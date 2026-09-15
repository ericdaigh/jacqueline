// Jacqueline worker: serves the game from ./public and keeps cloud saves in KV.
//   PUT  /api/save/:id   body = JSON save (≤ 96 KB)   → { ok, id }
//   GET  /api/save/:id                                  → the JSON save, or 404
// A save id is a 16-char random string the game generates; knowing it is the only key.
const MAX = 96 * 1024;
const ID = /^[a-z0-9]{12,32}$/;
const json = (o, status = 200) => new Response(JSON.stringify(o), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store', 'access-control-allow-origin': '*' } });

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const m = url.pathname.match(/^\/api\/save\/([^/]+)$/);
    if (m) {
      const id = m[1];
      if (!ID.test(id)) return json({ error: 'bad id' }, 400);
      if (!env.SAVES) return json({ error: 'saves not configured: bind a KV namespace called SAVES' }, 503);
      if (request.method === 'OPTIONS') return new Response(null, { headers: { 'access-control-allow-origin': '*', 'access-control-allow-methods': 'GET,PUT', 'access-control-allow-headers': 'content-type' } });
      if (request.method === 'GET') {
        const v = await env.SAVES.get(id);
        return v ? new Response(v, { headers: { 'content-type': 'application/json', 'cache-control': 'no-store', 'access-control-allow-origin': '*' } }) : json({ error: 'not found' }, 404);
      }
      if (request.method === 'PUT') {
        const body = await request.text();
        if (body.length > MAX) return json({ error: 'too large' }, 413);
        try { const o = JSON.parse(body); if (!o || typeof o.seed !== 'string') throw 0; } catch { return json({ error: 'not a save' }, 400); }
        await env.SAVES.put(id, body, { expirationTtl: 60 * 60 * 24 * 365 });
        return json({ ok: true, id });
      }
      return json({ error: 'method' }, 405);
    }
    return env.ASSETS.fetch(request);
  },
};
