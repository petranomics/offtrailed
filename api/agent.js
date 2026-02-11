export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { query } = req.body || {};
    if (!query) return res.status(400).json({ error: 'Missing query' });

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
    const prompt = `You are OFFTRAILED. Use the search results below when composing a JSON itinerary.\n\nSearch results:\n${top.map(t=>`- ${t.title}: ${t.snippet} (${t.link})`).join('\n')}\n\nUser query: ${query}\n\nRespond ONLY with valid JSON matching: {"stops":[{"time":"10 AM","name":"N","category":"food","description":"Desc","insider_tip":"Tip","est_cost":"$10"}],"trail_note":"Note","total_est_cost":"$X"}`;

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
        system: 'You are OFFTRAILED. Find novel, underrated experiences. If user mentions events, prioritize those. Use web search. Respond ONLY valid JSON.',
        tools: [{ type: 'web_search_20250305', name: 'web_search' }],
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const ajson = await ares.json();
    const assistant = (ajson.content || []).filter(c => c.type === 'text').map(c => c.text || '').join('\n') || JSON.stringify(ajson);

    const sources = top.map(t => t.link).filter(Boolean);
    return res.status(200).json({ query, answer: assistant, sources });
  } catch (err) {
    return res.status(500).json({ error: err.message || String(err) });
  }
}
