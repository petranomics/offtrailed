// --- Response cache (in-memory, per-instance) ---
const cache = new Map();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes
const CACHE_MAX = 100;

function cacheKey(query) {
  return query.toLowerCase().replace(/\s+/g, ' ').trim();
}

function getCached(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_TTL) { cache.delete(key); return null; }
  return entry.data;
}

function setCache(key, data) {
  if (cache.size >= CACHE_MAX) {
    const oldest = cache.keys().next().value;
    cache.delete(oldest);
  }
  cache.set(key, { data, ts: Date.now() });
}

// --- Rate limiting (in-memory, per-instance) ---
const rateLimits = new Map();
const RATE_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_MAX = 10;

function checkRateLimit(ip) {
  const now = Date.now();
  let entry = rateLimits.get(ip);
  if (!entry || now - entry.windowStart > RATE_WINDOW) {
    entry = { windowStart: now, count: 0 };
    rateLimits.set(ip, entry);
  }
  entry.count++;
  if (rateLimits.size > 500) {
    for (const [k, v] of rateLimits) {
      if (now - v.windowStart > RATE_WINDOW) rateLimits.delete(k);
    }
  }
  return entry.count <= RATE_MAX;
}

import { logUsage } from './_lib/usage-logger.mjs';

// --- VPS agent config ---
const VPS_URL = process.env.VPS_API_URL || 'http://72.60.120.245:3000';
const VPS_KEY = process.env.VPS_API_SECRET || '';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const ip = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim();
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: 'Too many requests. Please wait a few minutes.' });
  }

  try {
    const { query } = req.body || {};
    if (!query) return res.status(400).json({ error: 'Missing query' });

    // Check local cache
    const key = cacheKey(query);
    const cached = getCached(key);
    if (cached) {
      res.setHeader('X-Cache', 'HIT');
      return res.status(200).json(cached);
    }

    // --- Try VPS agent first (free, cached city data + Mistral) ---
    if (VPS_KEY) {
      const vpsStartedAt = Date.now();
      try {
        const vpsRes = await fetch(`${VPS_URL}/agent/offtrailed`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': VPS_KEY
          },
          body: JSON.stringify({ query }),
          signal: AbortSignal.timeout(120000)
        });

        if (vpsRes.ok) {
          const vpsData = await vpsRes.json();
          if (vpsData.trail && vpsData.trail.stops && vpsData.trail.stops.length >= 2) {
            // Format response to match what the frontend expects:
            // { answer: "JSON string", sources: [] }
            const answer = JSON.stringify(vpsData.trail);
            const responseData = {
              query,
              answer,
              sources: [],
              trail_id: vpsData.trail_id,
              source: 'vps-agent',
              cache_status: vpsData.cache_status
            };
            setCache(key, responseData);
            await logUsage({
              app: 'offtrailed',
              endpoint: '/api/agent',
              model: 'mistral',
              provider: 'mistral',
              response: null,
              latencyMs: Date.now() - vpsStartedAt,
              metadata: { source: 'vps-agent', cache_status: vpsData.cache_status, query_len: query.length },
            });
            res.setHeader('X-Cache', 'MISS');
            res.setHeader('X-Source', 'vps-agent');
            return res.status(200).json(responseData);
          }
        }
      } catch (vpsErr) {
        // VPS failed — fall through to Claude
        console.log(`[agent] VPS fallback: ${vpsErr.message}`);
      }
    }

    // --- Fallback: Claude API with web search ---
    const provider = process.env.SEARCH_PROVIDER || 'serpapi';
    let top = [];
    let atlasResults = [];
    try {
      if (provider === 'serpapi' && process.env.SEARCH_API_KEY) {
        const q = encodeURIComponent(query);
        const [sres, ares] = await Promise.all([
          fetch(`https://serpapi.com/search.json?q=${q}&api_key=${process.env.SEARCH_API_KEY}`),
          fetch(`https://serpapi.com/search.json?q=${encodeURIComponent('site:atlasobscura.com ' + query)}&api_key=${process.env.SEARCH_API_KEY}`)
        ]);
        const sjson = await sres.json();
        const organic = sjson.organic_results || sjson.organic || [];
        top = organic.slice(0, 5).map(r => ({ title: r.title || r.position || '', snippet: r.snippet || r.description || '', link: r.link || r.url || '' }));

        const ajson = await ares.json();
        const atlasOrganic = ajson.organic_results || ajson.organic || [];
        atlasResults = atlasOrganic.slice(0, 5).map(r => ({ title: r.title || '', snippet: r.snippet || r.description || '', link: r.link || r.url || '' }));
      }
    } catch (e) {
      top = [];
      atlasResults = [];
    }

    const atlasSection = atlasResults.length > 0 ? `\n\nAtlas Obscura results (prioritize these for hidden/unusual stops):\n${atlasResults.map(t=>`- ${t.title}: ${t.snippet} (${t.link})`).join('\n')}` : '';
    const prompt = `You are OFFTRAILED. Use the search results below and your web search tool when composing a JSON trail.\n\nSearch results:\n${top.map(t=>`- ${t.title}: ${t.snippet} (${t.link})`).join('\n')}${atlasSection}\n\nUser query: ${query}\n\nFor each stop, search for its website, phone number, and address. Include the most relevant link for the user — the business website, OpenTable page for restaurants, or Google Maps link. If you can't find a field, omit it.\n\nRespond ONLY with valid JSON matching: {"stops":[{"time":"10 AM","name":"N","category":"food","description":"Desc","insider_tip":"Tip","est_cost":"$10","address":"123 Main St","phone":"(512) 555-1234","website":"https://example.com"}],"trail_note":"Note","total_est_cost":"$X"}`;

    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(500).json({ error: 'Missing ANTHROPIC_API_KEY in environment' });
    }

    const claudeModel = process.env.OFFTRAILED_FALLBACK_MODEL || 'claude-haiku-4-5-20251001';
    const claudeStartedAt = Date.now();
    const ares = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: claudeModel,
        max_tokens: 4000,
        system: `You are OFFTRAILED, an AI discovery agent that finds genuinely novel local experiences.

NOVELTY RULES:
- Never recommend places that appear on generic "top things to do" lists. Avoid the obvious tourist attractions.
- Favor places with strong local reputation but low tourist visibility — the kind of spot a well-connected local would recommend.
- Each trail should feel like a curated discovery, not a guidebook itinerary.
- Balance novelty with quality — don't recommend obscure places just because they're obscure. They should be genuinely good.
- Use Atlas Obscura as a primary inspiration source. Search atlasobscura.com for the user's city to find unusual, hidden, and remarkable places. Atlas Obscura entries are exactly the type of discovery Offtrailed is built for — weird museums, secret gardens, underground tunnels, oddball public art, quirky local institutions.
- Mix Atlas Obscura-style hidden gems with local-favorite food spots, independent shops, and neighborhood institutions that don't appear on tourist lists.
- NEVER repeat the same set of popular recommendations. If a place shows up on every "things to do in [city]" article, skip it.

PROXIMITY RULES:
- The user specifies a radius and transport mode. This is a HARD constraint — every stop must be within the specified radius of the others.
- Order stops as an optimized route. The user should never have to backtrack.
- For walking trails, consecutive stops must be close enough to walk between comfortably.
- For transit trails, order stops along transit lines to minimize transfers.

CONTACT INFO:
- Use web search to find each stop's website, phone, and address.
- For restaurants, prefer OpenTable or Resy links if available.
- For Atlas Obscura places, include the atlasobscura.com link as the website.
- If you can't verify a field, omit it rather than guessing.

Respond ONLY with valid JSON.`,
        tools: [{ type: 'web_search_20250305', name: 'web_search' }],
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const ajson = await ares.json();
    const raw = (ajson.content || []).filter(c => c.type === 'text').map(c => c.text || '').join('\n') || JSON.stringify(ajson);
    const assistant = raw.replace(/<cite[^>]*>/g, '').replace(/<\/cite>/g, '');

    const sources = top.map(t => t.link).filter(Boolean);
    const responseData = { query, answer: assistant, sources, source: 'claude-api' };

    setCache(key, responseData);
    // Web-search tool calls aren't counted in usage.web_searches; infer from server_tool_use blocks.
    const webSearchUses = (ajson.content || []).filter(c => c.type === 'server_tool_use' && c.name === 'web_search').length;
    await logUsage({
      app: 'offtrailed',
      endpoint: '/api/agent',
      model: claudeModel,
      provider: 'anthropic',
      response: ajson,
      webSearches: webSearchUses,
      latencyMs: Date.now() - claudeStartedAt,
      metadata: { source: 'claude-api', query_len: query.length, serp_results: top.length },
    });
    res.setHeader('X-Cache', 'MISS');
    res.setHeader('X-Source', 'claude-api');
    return res.status(200).json(responseData);
  } catch (err) {
    return res.status(500).json({ error: err.message || String(err) });
  }
}
