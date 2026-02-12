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
  // Clean up old entries periodically
  if (rateLimits.size > 500) {
    for (const [k, v] of rateLimits) {
      if (now - v.windowStart > RATE_WINDOW) rateLimits.delete(k);
    }
  }
  return entry.count <= RATE_MAX;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Rate limit by IP
  const ip = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim();
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: 'Too many requests. Please wait a few minutes.' });
  }

  try {
    const { query } = req.body || {};
    if (!query) return res.status(400).json({ error: 'Missing query' });

    // Check cache
    const key = cacheKey(query);
    const cached = getCached(key);
    if (cached) {
      res.setHeader('Cache-Control', 'private, max-age=1800');
      res.setHeader('X-Cache', 'HIT');
      return res.status(200).json(cached);
    }

    // Basic search (SerpAPI) - requires SEARCH_API_KEY in Vercel env
    const provider = process.env.SEARCH_PROVIDER || 'serpapi';
    let top = [];
    try {
      if (provider === 'serpapi' && process.env.SEARCH_API_KEY) {
        const q = encodeURIComponent(query);
        const sres = await fetch(`https://serpapi.com/search.json?q=${q}&api_key=${process.env.SEARCH_API_KEY}`);
        const sjson = await sres.json();
        const organic = sjson.organic_results || sjson.organic || [];
        top = organic.slice(0, 5).map(r => ({ title: r.title || r.position || '', snippet: r.snippet || r.snippet || r.description || '', link: r.link || r.url || '' }));
      }
    } catch (e) {
      // ignore search errors but continue
      top = [];
    }

    // Build a prompt for Claude using search results
    const prompt = `You are OFFTRAILED. Use the search results below and your web search tool when composing a JSON trail.\n\nSearch results:\n${top.map(t=>`- ${t.title}: ${t.snippet} (${t.link})`).join('\n')}\n\nUser query: ${query}\n\nFor each stop, search for its website, phone number, and address. Include the most relevant link for the user — the business website, OpenTable page for restaurants, or Google Maps link. If you can't find a field, omit it.\n\nRespond ONLY with valid JSON matching: {"stops":[{"time":"10 AM","name":"N","category":"food","description":"Desc","insider_tip":"Tip","est_cost":"$10","address":"123 Main St","phone":"(512) 555-1234","website":"https://example.com"}],"trail_note":"Note","total_est_cost":"$X"}`;

    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(500).json({ error: 'Missing ANTHROPIC_API_KEY in environment' });
    }

    const ares = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        system: 'You are OFFTRAILED, an AI discovery agent. Find novel, underrated experiences — not tourist traps or top-10 list staples. If user mentions events, prioritize those. Use web search to verify each stop is real and currently open, and to find its website, phone, and address. For restaurants, prefer linking to their OpenTable or Resy page if available, otherwise their own website. Respond ONLY with valid JSON.',
        tools: [{ type: 'web_search_20250305', name: 'web_search' }],
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const ajson = await ares.json();
    const raw = (ajson.content || []).filter(c => c.type === 'text').map(c => c.text || '').join('\n') || JSON.stringify(ajson);
    const assistant = raw.replace(/<cite[^>]*>/g, '').replace(/<\/cite>/g, '');

    const sources = top.map(t => t.link).filter(Boolean);
    const responseData = { query, answer: assistant, sources };

    // Cache the response
    setCache(key, responseData);

    res.setHeader('Cache-Control', 'private, max-age=1800');
    res.setHeader('X-Cache', 'MISS');
    return res.status(200).json(responseData);
  } catch (err) {
    return res.status(500).json({ error: err.message || String(err) });
  }
}
