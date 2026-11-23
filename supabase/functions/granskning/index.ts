// Volymkontroll: mejlar admin när en förfrågan väntar på granskning (under 100 m² eller över 4 000 m² på någon rad).
// Anropas av sajten efter att köparen har skickat eller ändrat en förfrågan. Gör inget om förfrågan inte granskas
// eller om mejlet redan är skickat. Mejlet går via Resend: hemligheten RESEND_API_KEY och, valfritt, RESEND_FROM.
// Mottagaren står i app_settings (review_email).
import { createClient } from 'npm:@supabase/supabase-js@2';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const json = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });
const esc = (s: unknown) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
const fmt = (n: number) => Math.round(n).toLocaleString('sv-SE');
const m2 = (l: any) => l.unit === 'm2' ? +l.qty : l.unit === 'lm' && l.height_mm > 0 ? +l.qty * l.height_mm / 1000 : null;
const U = (l: any) => l.unit === 'lm' ? 'lm' : l.unit === 'st' ? 'st' : 'm²';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  let body: any;
  try { body = await req.json(); } catch { return json({ error: 'bad_json' }, 400); }
  const id = String(body?.request_id || '');
  if (!id) return json({ error: 'no_id' }, 400);
  const url = Deno.env.get('SUPABASE_URL')!;
  // Anroparen måste kunna se förfrågan (köparen själv eller admin)
  const user = createClient(url, Deno.env.get('SUPABASE_ANON_KEY')!, { global: { headers: { Authorization: req.headers.get('Authorization') || '' } } });
  const { data: mine } = await user.from('requests').select('id').eq('id', id).maybeSingle();
  if (!mine) return json({ error: 'not_found' }, 404);

  const db = createClient(url, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
  const { data: r } = await db.from('requests').select('*, request_lines(*)').eq('id', id).single();
  if (!r || r.review !== 'granskas' || r.review_notified_at || r.deleted_at) return json({ sent: false, reason: 'not_needed' });
  const { data: S } = await db.from('app_settings').select('key,value');
  const set = Object.fromEntries((S || []).map((x: any) => [x.key, x.value]));
  const min = +set.review_min_m2 || 100, max = +set.review_max_m2 || 4000;
  const { data: b } = await db.from('organizations').select('name,contact_name,phone,email').eq('id', r.buyer_org_id).single();
  const key = Deno.env.get('RESEND_API_KEY');
  if (!key) return json({ sent: false, reason: 'no_key' }, 503);

  const lines = (r.request_lines || []).filter((l: any) => !l.removed);
  const rows = lines.map((l: any) => {
    const a = m2(l), out = a != null && (a < min || a > max);
    return `<tr><td style="padding:4px 8px">${esc(l.product)}${l.spec ? ' · ' + esc(l.spec) : ''}</td><td style="padding:4px 8px;text-align:right">${fmt(+l.qty)} ${U(l)}${l.unit === 'lm' && a != null ? ` (${fmt(a)} m²)` : ''}</td><td style="padding:4px 8px">${out ? `<b style="color:#b42318">${a! < min ? 'Under ' + fmt(min) : 'Över ' + fmt(max)} m²</b>` : ''}</td></tr>`;
  }).join('');
  const site = (set.site_url || 'https://slotcast-topaz.vercel.app').replace(/\/$/, '');
  const html = `<div style="font-family:Arial,sans-serif;font-size:14px;color:#1d2939">
<p>En förfrågan väntar på granskning innan den går ut till fabrikerna.</p>
<p><b>${esc(b?.name)}</b><br>${esc(b?.contact_name)}${b?.phone ? ' · ' + esc(b.phone) : ''}${b?.email ? ' · <a href="mailto:' + esc(b.email) + '">' + esc(b.email) + '</a>' : ''}<br>Ort: ${esc(r.city)}${r.addr ? ' (' + esc(r.addr) + ')' : ''}</p>
<table style="border-collapse:collapse">${rows}</table>
<p>Gränserna är ${fmt(min)} och ${fmt(max)} m² per produktrad. Köparen har inte fått något besked om granskningen.</p>
<p><a href="${site}/#admin">Öppna Admin i Slotcast</a> för att godkänna, avböja eller rätta förfrågan.</p></div>`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST', headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: Deno.env.get('RESEND_FROM') || 'Slotcast <granskning@send.bjornstjerna.se>',
      to: [set.review_email || set.notify_email], subject: `Granska förfrågan: ${b?.name || 'okänd köpare'}, ${r.city}`, html,
    }),
  });
  if (!res.ok) return json({ sent: false, reason: 'resend_failed', detail: await res.text() }, 502);
  await db.from('requests').update({ review_notified_at: new Date().toISOString() }).eq('id', id);
  return json({ sent: true });
});
