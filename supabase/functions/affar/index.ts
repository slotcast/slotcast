// "Blev det affär?" Två uppgifter:
// 1. action "send" (dagligen från pg_cron, kräver x-cron-secret): mejlar köparen för varje rad där en fabrik valdes för
//    minst outcome_days dagar sedan (app_settings, 21) och utfall saknas. Varje rad frågas en gång. Mejlet går via Resend
//    (RESEND_API_KEY, valfritt RESEND_FROM). Utan nyckel skickas inget och raderna frågas när nyckeln finns.
// 2. action "answer" (från sajtens sida #affar, utan inloggning): { t: token, o: 'affar' | 'ingen' } sparar svaret.
//    Mejlets knappar leder till sajten där köparen bekräftar med ett klick, så att länkskannrar i e-post inte svarar.
import { createClient } from 'npm:@supabase/supabase-js@2';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-cron-secret',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const json = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });
const esc = (s: unknown) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
const fmt = (n: number) => Math.round(n).toLocaleString('sv-SE');
const U = (l: any) => l.unit === 'lm' ? 'lm' : l.unit === 'st' ? 'st' : 'm²';
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  let body: any;
  try { body = await req.json(); } catch { return json({ error: 'bad_json' }, 400); }
  const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

  if (body?.action === 'answer') {
    const t = String(body.t || ''), o = String(body.o || '');
    if (!UUID.test(t) || !['affar', 'ingen'].includes(o)) return json({ error: 'bad_input' }, 400);
    const { data: l } = await db.from('request_lines').select('id,outcome,chosen_org_id,removed').eq('outcome_token', t).maybeSingle();
    if (!l || !l.chosen_org_id || l.removed) return json({ ok: false, reason: 'not_found' }, 404);
    if (l.outcome) return json({ ok: true, already: l.outcome });
    const { error } = await db.from('request_lines').update({ outcome: o }).eq('id', l.id).is('outcome', null);
    if (error) return json({ ok: false, reason: 'save_failed' }, 500);
    return json({ ok: true, saved: o });
  }

  if (body?.action === 'send') {
    const { data: ok } = await db.rpc('affar_cron_ok', { s: req.headers.get('x-cron-secret') || '' });
    if (!ok) return json({ error: 'forbidden' }, 403);
    const key = Deno.env.get('RESEND_API_KEY');
    if (!key) return json({ sent: 0, reason: 'no_key' }, 503);
    const { data: S } = await db.from('app_settings').select('key,value');
    const set = Object.fromEntries((S || []).map((x: any) => [x.key, x.value]));
    const days = +set.outcome_days || 21;
    const site = (set.site_url || 'https://slotcast-topaz.vercel.app').replace(/\/$/, '');
    const before = new Date(Date.now() - days * 864e5).toISOString();
    const { data: L } = await db.from('request_lines')
      .select('id,product,spec,qty,unit,chosen_org_id,chosen_at,outcome_token,request_id,requests!inner(city,addr,buyer_org_id,deleted_at)')
      .not('chosen_org_id', 'is', null).is('outcome', null).is('outcome_asked_at', null).eq('removed', false)
      .lte('chosen_at', before).is('requests.deleted_at', null).limit(100);
    let sent = 0;
    for (const l of (L || []) as any[]) {
      const r = l.requests;
      const [{ data: b }, { data: f }, { data: P }] = await Promise.all([
        db.from('organizations').select('name,contact_name,email').eq('id', r.buyer_org_id).single(),
        db.from('organizations').select('name').eq('id', l.chosen_org_id).single(),
        db.from('profiles').select('email').eq('org_id', r.buyer_org_id),
      ]);
      const to = b?.email || P?.[0]?.email;
      if (!to) continue;
      const link = (o: string) => `${site}/#affar?t=${l.outcome_token}&o=${o}`;
      const btn = (o: string, txt: string, bg: string) => `<a href="${link(o)}" style="display:inline-block;padding:10px 22px;margin-right:8px;border-radius:6px;background:${bg};color:#fff;text-decoration:none;font-weight:bold">${txt}</a>`;
      const what = `${esc(l.product)}${l.spec ? ' (' + esc(l.spec) + ')' : ''}, ${fmt(+l.qty)} ${U(l)}`;
      const html = `<div style="font-family:Arial,sans-serif;font-size:15px;color:#1d2939;line-height:1.5">
<p>Hej${b?.contact_name ? ' ' + esc(b.contact_name.split(' ')[0]) : ''},</p>
<p>Ni valde ${esc(f?.name || 'en fabrik')} i Slotcast för ${what} till ${esc(r.city)}. Blev det affär?</p>
<p>${btn('affar', 'Ja', '#E06A2C')}${btn('ingen', 'Nej', '#25313B')}</p>
<p>Det är allt vi frågar. Tack för att ni tar er tid.</p>
<p>Hälsningar<br>Slotcast</p></div>`;
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST', headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: Deno.env.get('RESEND_FROM') || 'Slotcast <hej@send.bjornstjerna.se>', to: [to], subject: `Blev det affär? ${l.product} till ${r.city}`, html }),
      });
      if (!res.ok) continue;
      await db.from('request_lines').update({ outcome_asked_at: new Date().toISOString() }).eq('id', l.id);
      sent++;
    }
    return json({ sent });
  }
  return json({ error: 'unknown_action' }, 400);
});
