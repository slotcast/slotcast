// Karttjänst via OpenRouteService: adress till koordinater och vägavstånd för lastbil.
// Nyckeln ligger som hemlighet ORS_API_KEY i Supabase och syns aldrig i webbläsaren.
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const json = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  const key = Deno.env.get('ORS_API_KEY');
  if (!key) return json({ error: 'no_key' }, 503);
  let body: any;
  try { body = await req.json(); } catch { return json({ error: 'bad_json' }, 400); }
  try {
    if (body.action === 'geocode') {
      const text = String(body.text || '').slice(0, 200);
      if (!text) return json({ error: 'no_text' }, 400);
      const u = `https://api.openrouteservice.org/geocode/search?api_key=${key}&text=${encodeURIComponent(text)}&boundary.country=SE,DK,PL,NO,FI&size=1`;
      const r = await fetch(u); const d = await r.json();
      const f = d?.features?.[0];
      if (!f) return json({ found: false });
      const [lng, lat] = f.geometry.coordinates;
      return json({ found: true, lat, lng, label: f.properties?.label || '' });
    }
    if (body.action === 'route') {
      const a = body.from, b = body.to;
      if (![a?.lat, a?.lng, b?.lat, b?.lng].every((x) => typeof x === 'number')) return json({ error: 'bad_coords' }, 400);
      const r = await fetch('https://api.openrouteservice.org/v2/directions/driving-hgv', {
        method: 'POST', headers: { Authorization: key, 'Content-Type': 'application/json' },
        body: JSON.stringify({ coordinates: [[a.lng, a.lat], [b.lng, b.lat]] }),
      });
      const d = await r.json();
      const m = d?.routes?.[0]?.summary?.distance;
      if (typeof m !== 'number') return json({ found: false });
      return json({ found: true, km: Math.round(m / 1000) });
    }
    return json({ error: 'bad_action' }, 400);
  } catch (e) {
    return json({ error: 'ors_failed' }, 502);
  }
});
