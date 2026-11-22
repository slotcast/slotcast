import { createClient } from './supabase.js';
import { SUPABASE_URL, SUPABASE_KEY } from './config.js';
import { LANDING, POLICY } from './content.js';

const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

// ---------- Grunddata ----------
const REGIONS = {
  'Stockholm': {'Stockholm Innerstaden':[59.33,18.07],'Stockholm Norr':[59.40,17.95],'Stockholm Söder':[59.25,18.02],'Södertälje':[59.20,17.63],'Norrtälje':[59.76,18.70],'Nykvarn':[59.18,17.43],'Upplands-Bro':[59.52,17.64],'Märsta':[59.62,17.86],'Vallentuna':[59.53,18.08],'Värmdö':[59.32,18.40],'Nynäshamn':[58.90,17.95]},
  'Uppsala och Mälardalen': {'Uppsala':[59.86,17.64],'Enköping':[59.64,17.08],'Västerås':[59.61,16.55],'Eskilstuna':[59.37,16.51],'Strängnäs':[59.38,17.03],'Köping':[59.51,15.99],'Sala':[59.92,16.61],'Fagersta':[60.00,15.79],'Nyköping':[58.75,17.01],'Katrineholm':[58.99,16.21],'Örebro':[59.27,15.21],'Karlskoga':[59.33,14.52],'Kumla':[59.13,15.14]},
  'Östergötland': {'Linköping':[58.41,15.62],'Norrköping':[58.59,16.19],'Motala':[58.54,15.04],'Mjölby':[58.33,15.13],'Finspång':[58.71,15.77],'Vadstena':[58.45,14.89]},
  'Västsverige': {'Göteborg':[57.71,11.97],'Kungälv':[57.87,11.98],'Borås':[57.72,12.94],'Alingsås':[57.93,12.53],'Trollhättan':[58.28,12.29],'Uddevalla':[58.35,11.94],'Skövde':[58.39,13.85],'Lidköping':[58.51,13.16],'Varberg':[57.11,12.25],'Kungsbacka':[57.49,12.08],'Halmstad':[56.67,12.86]},
  'Småland och öarna': {'Jönköping':[57.78,14.16],'Värnamo':[57.19,14.04],'Växjö':[56.88,14.81],'Kalmar':[56.66,16.36],'Västervik':[57.76,16.64],'Vetlanda':[57.43,15.08],'Nässjö':[57.65,14.70],'Nybro':[56.74,15.91],'Vinninga':[58.43,13.06],'Visby':[57.64,18.29]},
  'Skåne och Blekinge': {'Malmö':[55.60,13.00],'Lund':[55.70,13.19],'Helsingborg':[56.05,12.69],'Landskrona':[55.87,12.83],'Trelleborg':[55.38,13.16],'Ystad':[55.43,13.82],'Kristianstad':[56.03,14.16],'Hässleholm':[56.16,13.77],'Höör':[55.94,13.54],'Karlskrona':[56.16,15.59],'Karlshamn':[56.17,14.86]},
  'Värmland och Dalarna': {'Karlstad':[59.40,13.51],'Arvika':[59.65,12.59],'Kristinehamn':[59.31,14.11],'Falun':[60.61,15.63],'Borlänge':[60.48,15.43],'Ludvika':[60.15,15.19],'Mora':[61.01,14.54],'Avesta':[60.14,16.17]},
  'Norrland': {'Gävle':[60.67,17.14],'Sandviken':[60.62,16.78],'Hudiksvall':[61.73,17.10],'Söderhamn':[61.30,17.06],'Sundsvall':[62.39,17.31],'Härnösand':[62.63,17.94],'Örnsköldsvik':[63.29,18.72],'Östersund':[63.18,14.64],'Umeå':[63.83,20.26],'Skellefteå':[64.75,20.95],'Luleå':[65.58,22.15],'Piteå':[65.32,21.48],'Kiruna':[67.86,20.23]},
  'Utland (fabriker)': {'Oslo (NO)':[59.91,10.75],'Köpenhamn (DK)':[55.68,12.57],'Helsingfors (FI)':[60.17,24.94],'Tallinn (EE)':[59.44,24.75],'Riga (LV)':[56.95,24.11],'Vilnius (LT)':[54.69,25.28],'Gdańsk (PL)':[54.35,18.65],'Szczecin (PL)':[53.43,14.55]}
};
const CITIES = Object.assign({}, ...Object.values(REGIONS));
const PRODUCTS = ['Sandwichvägg','Massiv vägg','Sockel','Plattbärlag','Håldäck','Balkong','Trappa'];
const MM = {'Sandwichvägg':230,'Massiv vägg':200,'Sockel':150,'Plattbärlag':50,'Håldäck':130,'Balkong':220};
const SPECIAL = ['Balkong','Trappa'];
const STAIRS_PER_LOAD = 5, LOAD_TON = 20; // trappor tar plats snarare än vikt: räkna hela lass om cirka 20 ton
const LAYERED = ['Sandwichvägg','Sockel'], WALLS = ['Sandwichvägg','Massiv vägg','Sockel'];
const ROLES = {fabrik:'Fabrik', kopare:'Köpare', bada:'Fabrik och köpare'};
const STATUS = {ny:'Ny', verifierad:'Verifierad', avstangd:'Avstängd'};

// ---------- Hjälpare ----------
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt = n => Math.round(+n || 0).toLocaleString('sv-SE');
const $ = id => document.getElementById(id);
const val = id => ($(id)?.value ?? '').trim();
const day = t => t ? new Date(t).toLocaleDateString('sv-SE') : '–';
function km(a, b) { if (!a || !b) return null; const R = 6371, t = x => x * Math.PI / 180, dl = t(b[0]-a[0]), dn = t(b[1]-a[1]); const h = Math.sin(dl/2)**2 + Math.cos(t(a[0]))*Math.cos(t(b[0]))*Math.sin(dn/2)**2; return Math.max(5, Math.round(2*R*Math.asin(Math.sqrt(h))*1.3)); }
function isoWeek(d) { const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())); const dd = t.getUTCDay() || 7; t.setUTCDate(t.getUTCDate() + 4 - dd); const y = t.getUTCFullYear(); return y*100 + Math.ceil(((t - Date.UTC(y,0,1))/864e5 + 1)/7); }
const WEEKS = (() => { const o = [], d = new Date(); for (let i = 0; i < 80; i++) { const w = isoWeek(d); if (!o.includes(w)) o.push(w); d.setDate(d.getDate() + 7); } return o; })();
const NOW = WEEKS[0];
const wl = w => w ? 'v' + (w % 100) + ' ' + Math.floor(w / 100) : '–';
const weekOpts = sel => WEEKS.map(w => `<option value="${w}" ${+sel === w ? 'selected' : ''}>${wl(w)}</option>`).join('');
const cityOpts = (sel, foreign) => '<option value="">Välj ort</option>' + Object.entries(REGIONS).filter(([r]) => foreign || !r.startsWith('Utland')).map(([r, cs]) => `<optgroup label="${esc(r)}">${Object.keys(cs).map(c => `<option ${c === sel ? 'selected' : ''}>${esc(c)}</option>`).join('')}</optgroup>`).join('');
const U = l => l.unit === 'lm' ? 'lm' : l.unit === 'st' ? 'st' : 'm²';
const hM = l => l.height_mm ? l.height_mm / 1000 : 0;
const area = (l, q) => l.unit === 'lm' ? q * hM(l) : q;
const tons = (l, q) => { if (l.product === 'Trappa') return Math.ceil(q / STAIRS_PER_LOAD) * LOAD_TON; const a = area(l, q), arm = +l.arm || 0; const mm = LAYERED.includes(l.product) ? ((+l.t1||0) + (+l.t3||0)) || MM[l.product] : (+l.concrete_mm || MM[l.product] || 200); return a * mm / 1000 * (arm ? 2.3 : 2.4) + a * arm / 1000; };
const perTon = (o, d) => { const a = +o.t30 || 120, b = +o.t300 || 342; return d <= 30 ? a : a + (d - 30) * (b - a) / 270; };
function transport(org, l, q, city) { const d = km(CITIES[org.city], CITIES[city]); if (d == null) return null; const t = tons(l, q); return { km: d, ton: t, kr: Math.round(t * perTon(org, d) / 100) * 100 }; }
const trInfo = (o, l, t) => l.product === 'Trappa' ? `Förslag: ${fmt(t.ton / LOAD_TON)} lass à cirka ${STAIRS_PER_LOAD} trappor, ${fmt(LOAD_TON * perTon(o, t.km))} kr per lass (${fmt(t.km)} km)` : `Förslag: ${fmt(t.ton)} ton × ${fmt(perTon(o, t.km))} kr/ton (${fmt(t.km)} km)`;
const upd = r => [r.edited_at, ...(r.request_lines || []).filter(l => !l.removed).map(l => l.edited_at)].filter(Boolean).sort().pop() || null;
const isFactory = o => o && (o.role === 'fabrik' || o.role === 'bada');
const isBuyer = o => o && (o.role === 'kopare' || o.role === 'bada');
const lineText = l => `${esc(l.product)}${l.spec ? ' · ' + esc(l.spec) : ''}, cirka ${fmt(l.qty)} ${U(l)}`;
const lineSub = l => l.product === 'Trappa' ? `${fmt(l.elements)} trappor · höjd ${fmt(l.height_mm)} mm per trappa · cirka ${fmt(Math.ceil(l.qty / STAIRS_PER_LOAD))} lass` : l.product === 'Balkong' ? `${fmt(l.elements)} balkonger · cirka ${fmt(tons(l, l.qty))} ton` : `Cirka ${fmt(l.elements)} element${l.height_mm ? ' · elementhöjd ' + fmt(l.height_mm) + ' mm' : ''}${l.arm ? ' · armering ' + (+l.arm).toLocaleString('sv-SE') + ' kg/m²' : ''} · cirka ${fmt(tons(l, l.qty))} ton`;
const isStale = (a, edited) => !!(a && edited && new Date(a.updated_at) < new Date(edited));
const errText = e => { const m = e?.message || String(e); if (/Invalid login/i.test(m)) return 'Fel e-post eller lösenord.'; if (/Email not confirmed/i.test(m)) return 'Bekräfta din e-post först. Kolla inkorgen och skräpposten.'; if (/already registered/i.test(m)) return 'Det finns redan ett konto med den e-postadressen.'; if (/Password should be/i.test(m)) return 'Lösenordet måste vara minst 8 tecken.'; return m; };

// ---------- Tillstånd ----------
const S = { session: null, profile: null, org: null, view: null, flash: '', recovery: false, authTab: 'login' };
const app = $('app');

function flash(msg) { S.flash = msg; render(); }

// ---------- Inloggning ----------
sb.auth.onAuthStateChange(async (event, session) => {
  if (event === 'PASSWORD_RECOVERY') { S.recovery = true; S.session = session; render(); return; }
  S.session = session;
  if (session) await loadMe(); else { S.profile = null; S.org = null; }
  render();
});

async function loadMe() {
  const uid = S.session.user.id;
  const { data: p } = await sb.from('profiles').select('*').eq('id', uid).maybeSingle();
  S.profile = p;
  if (p?.org_id) { const { data: o } = await sb.from('organizations').select('*').eq('id', p.org_id).maybeSingle(); S.org = o; }
}

function vAuth() {
  $('nav').innerHTML = '';
  $('who').innerHTML = '<button id="hlogin">Logga in</button>';
  $('hlogin').onclick = () => openAuth('login');
  app.classList.add('full');
  app.innerHTML = LANDING;
  app.querySelectorAll('[data-reg]').forEach(b => b.onclick = () => openAuth('reg', b.dataset.reg));
  authCard();
}

function openAuth(tab, role) {
  S.authTab = tab; if (role) S.regRole = role;
  if (!$('authwrap')) { location.hash = ''; render(); }
  authCard();
  $('authwrap').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function authCard() {
  const w = $('authwrap'); if (!w) return;
  const t = S.authTab;
  w.innerHTML = `<div class="card" style="margin:0"><div class="tabs"><button data-t="login" class="${t==='login'?'on':''}">Logga in</button><button data-t="reg" class="${t==='reg'?'on':''}">Registrera företag</button></div><div id="authbox"></div></div>`;
  w.querySelectorAll('[data-t]').forEach(b => b.onclick = () => { S.authTab = b.dataset.t; authCard(); });
  const box = $('authbox');
  if (t === 'login') {
    box.innerHTML = `<label for="le">E-post</label><input id="le" type="email" autocomplete="email">
    <label for="lp" style="margin-top:10px">Lösenord</label><input id="lp" type="password" autocomplete="current-password">
    <div id="lerr" class="err"></div>
    <p><button class="btn" id="lgo">Logga in</button> <button class="lnk" id="forgot">Glömt lösenord?</button></p>`;
    $('lgo').onclick = async () => { $('lerr').textContent = ''; const { error } = await sb.auth.signInWithPassword({ email: val('le'), password: $('lp').value }); if (error) $('lerr').textContent = errText(error); };
    $('lp').onkeydown = e => { if (e.key === 'Enter') $('lgo').click(); };
    $('forgot').onclick = async () => { const e = val('le'); if (!e) { $('lerr').textContent = 'Skriv din e-post först, så skickar vi en länk.'; return; } const { error } = await sb.auth.resetPasswordForEmail(e, { redirectTo: location.origin + location.pathname }); $('lerr').className = error ? 'err' : 'ok'; $('lerr').textContent = error ? errText(error) : 'Om adressen finns skickar vi en länk för att välja nytt lösenord.'; };
  } else {
    box.innerHTML = `<label>Roll</label><div>${Object.entries(ROLES).map(([k, v]) => `<label class="chk"><input type="radio" name="rr" value="${k}" ${k===(S.regRole||'kopare')?'checked':''}>${v}</label>`).join('')}</div>
    <div class="row" style="margin-top:8px"><div><label for="rc">Företag</label><input id="rc" autocomplete="organization"></div><div><label for="rn">Kontaktperson</label><input id="rn" autocomplete="name"></div></div>
    <div class="row" style="margin-top:8px"><div><label for="rph">Telefon</label><input id="rph" autocomplete="tel"></div><div><label for="rcy">Ort <span class="sub" id="rcyl">(valfri)</span></label><select id="rcy">${cityOpts('', true)}</select></div></div>
    <div id="rprod" style="margin-top:8px;display:none"><label>Produkter ni tillverkar</label>${PRODUCTS.map(x => `<label class="chk"><input type="checkbox" class="rp" value="${esc(x)}">${esc(x)}</label>`).join('')}</div>
    <div class="row" style="margin-top:8px"><div><label for="re">E-post</label><input id="re" type="email" autocomplete="email"></div><div><label for="rpw">Lösenord (minst 8 tecken)</label><input id="rpw" type="password" autocomplete="new-password"></div></div>
    <label class="chk" style="margin-top:10px"><input type="checkbox" id="rterms">Jag godkänner att uppgifterna sparas för att använda Slotcast enligt <a href="#integritet" target="_blank" rel="noopener">integritetspolicyn</a>.</label>
    <div id="rerr" class="err"></div><p><button class="btn" id="rgo">Registrera</button></p>`;
    const tog = () => { const r = box.querySelector('input[name=rr]:checked').value; const f = r !== 'kopare'; $('rprod').style.display = f ? '' : 'none'; $('rcyl').textContent = f ? '(fabrikens ort, för avstånd)' : '(valfri)'; };
    box.querySelectorAll('input[name=rr]').forEach(r => r.onchange = tog); tog();
    $('rgo').onclick = async () => {
      const e = $('rerr'); e.className = 'err'; e.textContent = '';
      const role = box.querySelector('input[name=rr]:checked').value;
      const products = [...box.querySelectorAll('.rp:checked')].map(x => x.value);
      const meta = { role, company: val('rc'), contact: val('rn'), phone: val('rph'), city: val('rcy'), products };
      if (!meta.company || !meta.contact) { e.textContent = 'Skriv företag och kontaktperson.'; return; }
      if (role !== 'kopare' && !meta.city) { e.textContent = 'Välj fabrikens ort; den behövs för att räkna avstånd och transport.'; return; }
      if (role !== 'kopare' && !products.length) { e.textContent = 'Kryssa i minst en produkt som fabriken tillverkar.'; return; }
      if ($('rpw').value.length < 8) { e.textContent = 'Lösenordet måste vara minst 8 tecken.'; return; }
      if (!$('rterms').checked) { e.textContent = 'Kryssa i att du godkänner att uppgifterna sparas.'; return; }
      $('rgo').disabled = true;
      const { data, error } = await sb.auth.signUp({ email: val('re'), password: $('rpw').value, options: { data: meta, emailRedirectTo: location.origin + location.pathname } });
      $('rgo').disabled = false;
      if (error) { e.textContent = errText(error); return; }
      if (!data.session) { e.className = 'ok'; e.textContent = 'Klart. Vi har skickat ett mejl till ' + val('re') + '. Klicka på länken i mejlet för att bekräfta adressen och logga sedan in.'; }
    };
  }
}

function vPolicy() {
  if (!S.session) { $('nav').innerHTML = ''; $('who').innerHTML = ''; }
  app.innerHTML = POLICY; window.scrollTo(0, 0);
}

function vRecovery() {
  $('nav').innerHTML = '';
  app.innerHTML = `<div class="narrow"><div class="card"><h2>Välj nytt lösenord</h2>
  <label for="np" style="margin-top:12px">Nytt lösenord (minst 8 tecken)</label><input id="np" type="password" autocomplete="new-password">
  <div id="nerr" class="err"></div><p><button class="btn" id="ngo">Spara lösenord</button></p></div></div>`;
  $('ngo').onclick = async () => { if ($('np').value.length < 8) { $('nerr').textContent = 'Lösenordet måste vara minst 8 tecken.'; return; } const { error } = await sb.auth.updateUser({ password: $('np').value }); if (error) { $('nerr').textContent = errText(error); return; } S.recovery = false; history.replaceState(null, '', location.pathname); await loadMe(); S.flash = 'Lösenordet är ändrat.'; render(); };
}

// ---------- Navigering ----------
function views() {
  const o = S.org, v = [];
  if (isBuyer(o)) { v.push(['ny', 'Ny förfrågan']); v.push(['mina', 'Mina förfrågningar']); }
  if (isFactory(o)) { v.push(['inkorg', 'Förfrågningar']); v.push(['kapacitet', 'Ledig kapacitet']); }
  v.push(['profil', 'Företagsprofil']);
  if (S.profile?.is_admin) v.push(['admin', 'Admin']);
  return v;
}
function go(v, keep) { if (!keep) S.editReq = null; S.view = v; S.flash = ''; location.hash = v; render(); }

window.addEventListener('hashchange', () => { if (location.hash === '#integritet' || S.policy) render(); });

function render() {
  app.classList.remove('full');
  S.policy = location.hash === '#integritet';
  if (S.policy) return vPolicy();
  if (S.recovery) return vRecovery();
  if (!S.session) return vAuth();
  if (!S.profile || !S.org) { app.innerHTML = '<div class="card">Kontot saknar företagsprofil. Kontakta Slotcast.</div>'; return; }
  const vs = views();
  if (!S.view) S.view = (location.hash.slice(1) && vs.some(x => x[0] === location.hash.slice(1))) ? location.hash.slice(1) : vs[0][0];
  if (!vs.some(x => x[0] === S.view)) S.view = vs[0][0];
  $('nav').innerHTML = vs.map(([k, t]) => `<button data-go="${k}" class="${S.view === k ? 'on' : ''}">${esc(t)}<span class="n" id="n-${k}" style="display:none"></span></button>`).join('');
  $('nav').querySelectorAll('[data-go]').forEach(b => b.onclick = () => go(b.dataset.go));
  $('who').innerHTML = `<span>${esc(S.org.name)} · ${ROLES[S.org.role]}${S.profile.is_admin ? ' · admin' : ''}</span><button id="out">Logga ut</button>`;
  $('out').onclick = async () => { await sb.auth.signOut(); S.view = null; };
  let top = '';
  if (S.org.status === 'avstangd') top += '<div class="banner"><span>Företaget är avstängt från Slotcast. Kontakta oss om det är fel.</span></div>';
  if (S.flash) top += `<div class="banner"><span>${esc(S.flash)}</span><button class="lnk" id="fx">Stäng</button></div>`;
  app.innerHTML = top + '<div id="v"><div class="card">Laddar…</div></div>';
  if ($('fx')) $('fx').onclick = () => { S.flash = ''; render(); };
  const V = { ny: vNew, mina: vMine, inkorg: vInbox, kapacitet: vCap, profil: vProfile, admin: vAdmin }[S.view];
  V($('v')).catch(e => { $('v').innerHTML = `<div class="card err">Något gick fel: ${esc(errText(e))}</div>`; });
}

// ---------- Profil ----------
async function vProfile(el) {
  const o = S.org;
  el.innerHTML = `<h1>Företagsprofil</h1><div class="card">
  <p class="sub" style="margin-top:0">Status: <span class="tag ${o.status==='verifierad'?'ok':''}">${STATUS[o.status]}</span> · inloggad som ${esc(S.profile.email)}</p>
  <label>Roll</label><div>${Object.entries(ROLES).map(([k, t]) => `<label class="chk"><input type="radio" name="role" value="${k}" ${o.role === k ? 'checked' : ''}>${t}</label>`).join('')}</div>
  <div class="row" style="margin-top:10px"><div><label for="co">Företag</label><input id="co" value="${esc(o.name)}"></div><div><label for="ct">Kontaktperson</label><input id="ct" value="${esc(o.contact_name)}"></div></div>
  <div class="row" style="margin-top:10px"><div><label for="ph">Telefon</label><input id="ph" value="${esc(o.phone)}"></div><div><label for="em">E-post för kontakt</label><input id="em" type="email" value="${esc(o.email)}"></div><div><label for="cy">Ort</label><select id="cy">${cityOpts(o.city, true)}</select></div></div>
  <div id="fx2" class="line"><h3>Fabrik</h3><label style="margin-top:8px">Produkter ni tillverkar</label>
  <div>${PRODUCTS.map(x => `<label class="chk"><input type="checkbox" class="pr" value="${esc(x)}" ${(o.products || []).includes(x) ? 'checked' : ''}>${esc(x)}</label>`).join('')}</div>
  <p class="sub" style="margin:10px 0 6px">Transporttaxa som förslag i era svar. Förifyllt med Prebetongs taxa 2020; ni kan ändra transportbeloppet i varje svar.</p>
  <div class="row"><div><label for="t30">kr per ton, upp till 30 km</label><input id="t30" type="number" min="0" value="${esc(o.t30)}"></div><div><label for="t300">kr per ton, vid 300 km</label><input id="t300" type="number" min="0" value="${esc(o.t300)}"></div></div></div>
  <div id="perr" class="err"></div><p><button class="btn" id="psave">Spara profil</button></p></div>
  <div class="card"><h3>Lösenord</h3><div class="row" style="margin-top:8px"><div><label for="np2">Nytt lösenord</label><input id="np2" type="password" autocomplete="new-password"></div></div><div id="pwerr" class="err"></div><p><button class="btn2" id="pwsave">Byt lösenord</button></p></div>`;
  const tog = () => { const r = el.querySelector('input[name=role]:checked').value; $('fx2').style.display = r !== 'kopare' ? '' : 'none'; };
  el.querySelectorAll('input[name=role]').forEach(r => r.onchange = tog); tog();
  $('psave').onclick = async () => {
    const role = el.querySelector('input[name=role]:checked').value, products = [...el.querySelectorAll('.pr:checked')].map(x => x.value), e = $('perr');
    const d = { role, name: val('co'), contact_name: val('ct'), phone: val('ph'), email: val('em'), city: val('cy') || null, products, t30: +val('t30') || 120, t300: +val('t300') || 342 };
    if (!d.name) { e.textContent = 'Skriv företagets namn.'; return; }
    if (role !== 'kopare' && !d.city) { e.textContent = 'Välj fabrikens ort.'; return; }
    if (role !== 'kopare' && !products.length) { e.textContent = 'Kryssa i minst en produkt.'; return; }
    const { data, error } = await sb.from('organizations').update(d).eq('id', o.id).select().single();
    if (error) { e.textContent = errText(error); return; }
    S.org = data; flash('Profilen är sparad.');
  };
  $('pwsave').onclick = async () => { const p = $('np2').value, e = $('pwerr'); if (p.length < 8) { e.textContent = 'Minst 8 tecken.'; return; } const { error } = await sb.auth.updateUser({ password: p }); e.className = error ? 'err' : 'ok'; e.textContent = error ? errText(error) : 'Lösenordet är bytt.'; };
}

// ---------- Fabrik: ledig kapacitet ----------
async function vCap(el) {
  const { data: slots, error } = await sb.from('slots').select('*').eq('org_id', S.org.id).order('from_week');
  if (error) throw error;
  const prods = S.org.products || [];
  el.innerHTML = `<h1>Ledig kapacitet</h1>
  <div class="card"><p class="sub" style="margin-top:0">Lägg in perioder där ni har plats i produktionen, i m² per vecka. Vilken produkt det blir avgör köparens förfrågan, bland de produkter ni tillverkar${prods.length ? ' (' + esc(prods.join(', ').toLowerCase()) + ')' : ''}. Köpare ser att det finns ledig kapacitet, men inte vilken fabrik det gäller.</p>
  <div class="row"><div><label for="sf">Från vecka</label><select id="sf">${weekOpts(WEEKS[4])}</select></div><div><label for="st">Till vecka</label><select id="st">${weekOpts(WEEKS[8])}</select></div>
  <div><label for="sm">m² per vecka</label><input id="sm" type="number" min="1"></div></div>
  <div style="margin-top:10px"><label for="sn">Kommentar (valfri)</label><input id="sn" placeholder="t.ex. bara socklar upp till 1,6 m"></div>
  <div id="serr" class="err"></div><p><button class="btn" id="sadd">Lägg till</button></p></div>
  <div class="card"><h2>Inlagd kapacitet</h2>${slots.length ? `<div class="scroll"><table><thead><tr><th>Veckor</th><th class="num">m²/vecka</th><th>Kommentar</th><th></th></tr></thead><tbody>
  ${slots.map(s => `<tr${s.to_week < NOW ? ' style="opacity:.5"' : ''}><td>${wl(s.from_week)}–${wl(s.to_week)}${s.to_week < NOW ? ' <span class="tag">passerad</span>' : ''}</td><td class="num">${fmt(s.m2_per_week)}</td><td>${esc(s.note)}</td><td><button class="lnk" data-del="${s.id}">Ta bort</button></td></tr>`).join('')}
  </tbody></table></div>` : '<p class="sub">Ingen kapacitet inlagd än.</p>'}</div>`;
  $('sadd').onclick = async () => {
    const d = { org_id: S.org.id, product: null, from_week: +val('sf'), to_week: +val('st'), m2_per_week: +val('sm'), note: val('sn') || null };
    if (d.to_week < d.from_week) { $('serr').textContent = 'Till-veckan kan inte vara före från-veckan.'; return; }
    if (!(d.m2_per_week > 0)) { $('serr').textContent = 'Ange hur många m² per vecka ni har ledigt.'; return; }
    const { error } = await sb.from('slots').insert(d);
    if (error) { $('serr').textContent = errText(error); return; }
    flash('Kapaciteten är inlagd.');
  };
  el.querySelectorAll('[data-del]').forEach(b => b.onclick = async () => { if (!confirm('Ta bort den lediga kapaciteten?')) return; const { error } = await sb.from('slots').delete().eq('id', b.dataset.del); if (error) return flash(errText(error)); render(); });
}

// ---------- Köpare: ny förfrågan ----------
async function vNew(el) {
  const R0 = S.editReq || null;
  el.innerHTML = `<h1>${R0 ? 'Ändra förfrågan' : 'Ny förfrågan'}</h1><div class="card">${R0 ? '<div class="note">Fabriker som redan har svarat ser att förfrågan är uppdaterad och ombeds kontrollera sitt svar. Rader där ni har valt fabrik är låsta.</div>' : ''}
  <p class="sub" style="margin-top:0">En grov uppskattning räcker. Förfrågan går anonymt till fabriker som tillverkar produkterna. De svarar med ungefärligt pris, leveransveckor och transport. När ni valt fabrik ser ni varandras namn och fabriken lämnar fast offert.</p>
  <div id="lines"></div><button class="lnk" id="addl">+ Lägg till produktrad</button>
  <div class="row" style="margin-top:12px"><div><label for="addr">Projektets adress</label><input id="addr" placeholder="Gata, ort"></div><div><label for="dc">Närmaste ort i listan (för avstånd)</label><select id="dc">${cityOpts(S.org.city && CITIES[S.org.city] && !S.org.city.includes('(') ? S.org.city : '', false)}</select></div></div>
  <div class="row" style="margin-top:12px"><div><label for="w1">Första leverans</label><select id="w1">${weekOpts(WEEKS[8])}</select></div><div><label for="w2">Sista leveransvecka</label><select id="w2">${weekOpts(WEEKS[10])}</select></div>
  <div><label for="all">Leverantörer</label><select id="all"><option value="1">Allt från en fabrik</option><option value="0">Delar ok</option></select></div>
  <div><label for="draw">Tillverkningsritningar</label><select id="draw"><option>Finns</option><option>Tas fram av oss</option><option>Ska tas fram av fabriken</option></select></div></div>
  <div id="nerr" class="err"></div><p><button class="btn" id="send">${R0 ? 'Spara ändringar' : 'Skicka förfrågan'}</button>${R0 ? ' <button class="lnk" id="cancel">Avbryt</button>' : ''}</p></div>`;
  const removedIds = [];
  const lines = $('lines');
  const hint = async () => { const w1 = +val('w1'), w2 = +val('w2'); for (const d of lines.querySelectorAll('.ln')) { const p = d.querySelector('.lp').value; const { data } = await sb.rpc('capacity_summary', { p, w1, w2 }); const r = data?.[0] || { factories: 0, with_capacity: 0 }; const h = d.querySelector('.hint'); h.className = 'hint' + (r.with_capacity ? '' : ' no'); h.textContent = r.factories ? `${r.factories} fabrik(er) tillverkar ${p.toLowerCase()}; ${r.with_capacity} har lagt in ledig kapacitet under perioden.` : `Ingen fabrik i Slotcast tillverkar ${p.toLowerCase()} ännu.`; } };
  const kb = p => p === 'Balkong' ? `<div class="row"><div><label>Yta per balkong (m²)</label><input class="lba" type="number" min="0.5" step="0.1"></div><div><label>Antal balkonger</label><input class="lbn" type="number" min="1"></div><div><label>Plattjocklek (mm), för vikt</label><input class="lbt" type="number" min="50" value="220"></div></div>`
    : p === 'Trappa' ? `<div class="row"><div><label>Antal trappor</label><input class="ltn" type="number" min="1"></div><div><label>Höjd per trappa (mm)</label><input class="lth" type="number" min="500" step="10" placeholder="t.ex. 2800"></div><div><label>Kravställning (valfri)</label><input class="lk" placeholder="t.ex. rak, 1 200 mm bred"></div></div>`
    : LAYERED.includes(p) ? `<div class="row"><div><label>Innerskiva (mm)</label><input class="l1" type="number" min="1"></div><div><label>Isolering (mm)</label><input class="l2" type="number" min="0"></div><div><label>Ytterskiva (mm)</label><input class="l3" type="number" min="1"></div></div>` : `<label>Kravställning (mm)</label><input class="lk" placeholder="t.ex. 200">`;
  const add = pre => {
    if (pre && pre.chosen_org_id) { const d = document.createElement('div'); d.className = 'line'; d.innerHTML = `<h3>${lineText(pre)}</h3><p class="sub">${lineSub(pre)} · <span class="tag acc">Fabrik vald, raden är låst</span></p>`; lines.appendChild(d); return; }
    const d = document.createElement('div'); d.className = 'ln line'; const p0 = pre?.product || PRODUCTS[0]; if (pre) d.dataset.id = pre.id;
    d.innerHTML = `<div class="row"><div style="flex:0 1 220px"><label>Produkt</label><select class="lp">${PRODUCTS.map(x => `<option ${x === p0 ? 'selected' : ''}>${esc(x)}</option>`).join('')}</select></div><div class="kb" style="flex:1 1 360px">${kb(p0)}</div></div>
    <div class="row r2" style="margin-top:8px"><div style="flex:0 1 110px"><label>Enhet</label><select class="lu"><option value="m2">m²</option><option value="lm">lm</option></select></div><div><label>Mängd</label><input class="lm" type="number" min="1"></div><div><label>Elementhöjd (mm) <span class="sub lhr">valfri</span></label><input class="lh" type="number" min="100" step="10"></div><div><label>Antal element, cirka</label><input class="le" type="number" min="1"></div><div class="ltw"><label>Betong (mm), för vikt</label><input class="lt" type="number" min="20" value="${MM[p0]}"></div><div class="law"><label>Armering per kvm (kg)</label><input class="la" type="number" min="0" step="0.5"></div></div>
    <div class="hint"></div>${(lines.querySelectorAll('.ln').length || pre) ? '<button class="lnk rm">Ta bort raden</button>' : ''}`;
    lines.appendChild(d);
    const tog = p => { d.querySelector('.r2').style.display = SPECIAL.includes(p) ? 'none' : ''; d.querySelector('.ltw').style.display = LAYERED.includes(p) ? 'none' : ''; d.querySelector('.law').style.display = WALLS.includes(p) ? '' : 'none'; }; tog(p0);
    d.querySelector('.lu').onchange = e => { d.querySelector('.lhr').textContent = e.target.value === 'lm' ? 'krävs vid lm' : 'valfri'; };
    d.querySelector('.lp').onchange = e => { const p = e.target.value; d.querySelector('.kb').innerHTML = kb(p); d.querySelector('.lt').value = MM[p]; tog(p); hint(); };
    d.querySelector('.rm')?.addEventListener('click', () => { if (lines.querySelectorAll('.ln').length < 2) return; if (d.dataset.id) removedIds.push(d.dataset.id); d.remove(); });
    // Kravställning i mm följer med till "Betong (mm), för vikt"
    d.addEventListener('input', ev => { if (!ev.target.classList.contains('lk') || SPECIAL.includes(d.querySelector('.lp').value)) return; const m = ev.target.value.match(/\d+/); if (m) d.querySelector('.lt').value = m[0]; });
    if (pre) {
      const q = c => d.querySelector(c), set = (c, v) => { if (q(c) && v != null) q(c).value = v; };
      set('.lu', pre.unit === 'st' ? 'm2' : pre.unit); set('.lm', pre.qty); set('.lh', pre.height_mm); set('.le', pre.elements); set('.la', pre.arm);
      if (pre.product === 'Balkong') { set('.lba', pre.elements ? Math.round(pre.qty / pre.elements * 10) / 10 : ''); set('.lbn', pre.elements); set('.lbt', pre.concrete_mm); }
      else if (pre.product === 'Trappa') { set('.ltn', pre.qty); set('.lth', pre.height_mm); set('.lk', pre.spec); }
      else if (LAYERED.includes(pre.product)) { set('.l1', pre.t1); set('.l2', pre.t2); set('.l3', pre.t3); }
      else { set('.lk', (pre.spec || '').replace(/\s*mm$/, '')); set('.lt', pre.concrete_mm); }
      if (pre.unit === 'lm') q('.lhr').textContent = 'krävs vid lm';
    }
    hint();
  };
  if (R0) {
    (R0.request_lines || []).filter(l => !l.removed).sort((a, b) => a.created_at.localeCompare(b.created_at)).forEach(add);
    if (!lines.querySelector('.ln') && !lines.children.length) add();
    if (R0.addr) $('addr').value = R0.addr; if (R0.city) $('dc').value = R0.city;
    if (WEEKS.includes(R0.first_week)) $('w1').value = R0.first_week; if (WEEKS.includes(R0.last_week)) $('w2').value = R0.last_week;
    $('all').value = R0.all_from_one ? '1' : '0'; if (R0.drawings) $('draw').value = R0.drawings;
    $('cancel').onclick = () => go('mina');
  } else add();
  $('addl').onclick = () => add(); $('w1').onchange = hint; $('w2').onchange = hint;
  $('send').onclick = async () => {
    const e = $('nerr'); e.textContent = '';
    const out = [...lines.querySelectorAll('.ln')].map(d => { const q = c => d.querySelector(c); const p = q('.lp').value; const n = { _id: d.dataset.id || null, product: p, unit: q('.lu').value, qty: +q('.lm').value, height_mm: +q('.lh').value || null, elements: +q('.le').value || null, arm: WALLS.includes(p) ? (+String(q('.la').value).replace(',', '.') || null) : null };
      if (p === 'Balkong') { const a = +String(q('.lba').value).replace(',', '.') || 0, c = +q('.lbn').value || 0; Object.assign(n, { unit: 'm2', qty: Math.round(a * c * 10) / 10, elements: c || null, height_mm: null, arm: null, concrete_mm: +q('.lbt').value || MM[p], spec: a ? a.toLocaleString('sv-SE') + ' m² per balkong' : null }); return n; }
      if (p === 'Trappa') { const c = +q('.ltn').value || 0; Object.assign(n, { unit: 'st', qty: c, elements: c || null, height_mm: +q('.lth').value || null, arm: null, spec: q('.lk').value.trim() || null }); return n; }
      if (LAYERED.includes(p)) { n.t1 = +q('.l1').value || null; n.t2 = +q('.l2').value || null; n.t3 = +q('.l3').value || null; n.spec = `${n.t1 || 0} + ${n.t2 || 0} + ${n.t3 || 0} mm`; }
      else { n.spec = q('.lk').value.trim() || null; if (n.spec && /^[\d\s+,.]+$/.test(n.spec)) n.spec += ' mm'; n.concrete_mm = +q('.lt').value || MM[p]; }
      return n; });
    if (!out.length && !(R0 && lines.children.length)) { e.textContent = 'Lägg till minst en produktrad.'; return; }
    if (out.some(l => !(l.qty > 0) || !(l.elements > 0))) { e.textContent = 'Ange mängd och antal på varje rad (yta och antal för balkonger, antal för trappor).'; return; }
    if (out.some(l => LAYERED.includes(l.product) && !(l.t1 > 0 && l.t3 > 0))) { e.textContent = 'Ange innerskiva och ytterskiva i mm på sandwich- och sockelrader.'; return; }
    if (out.some(l => l.product === 'Trappa' && !(l.height_mm > 0))) { e.textContent = 'Ange höjd per trappa i mm.'; return; }
    if (out.some(l => l.unit === 'lm' && !(l.height_mm > 0))) { e.textContent = 'Ange elementhöjd på rader där mängden är i lm.'; return; }
    if (!val('dc')) { e.textContent = 'Välj närmaste ort i listan.'; return; }
    if (+val('w2') < +val('w1')) { e.textContent = 'Sista leveransveckan kan inte vara före första leveransen.'; return; }
    $('send').disabled = true;
    const head = { addr: val('addr') || null, city: val('dc'), first_week: +val('w1'), last_week: +val('w2'), all_from_one: val('all') === '1', drawings: val('draw') };
    if (R0) {
      const fail = err => { $('send').disabled = false; e.textContent = errText(err); };
      const { error: h } = await sb.from('requests').update(head).eq('id', R0.id); if (h) return fail(h);
      for (const l of out) { const { _id, ...row } = l; const { error: x } = _id ? await sb.from('request_lines').update(row).eq('id', _id) : await sb.from('request_lines').insert({ ...row, request_id: R0.id }); if (x) return fail(x); }
      for (const id of removedIds) { const { error: x } = await sb.from('request_lines').update({ removed: true }).eq('id', id); if (x) return fail(x); }
      S.editReq = null; S.view = 'mina'; location.hash = 'mina'; flash('Förfrågan är uppdaterad. Fabrikerna ser att den är ändrad.'); return;
    }
    out.forEach(l => delete l._id);
    const { data: r, error } = await sb.from('requests').insert({ buyer_org_id: S.org.id, created_by: S.session.user.id, addr: val('addr') || null, city: val('dc'), first_week: +val('w1'), last_week: +val('w2'), all_from_one: val('all') === '1', drawings: val('draw') }).select().single();
    if (error) { $('send').disabled = false; e.textContent = errText(error); return; }
    const { error: e2 } = await sb.from('request_lines').insert(out.map(l => ({ ...l, request_id: r.id })));
    if (e2) { $('send').disabled = false; await sb.from('requests').delete().eq('id', r.id); e.textContent = errText(e2); return; }
    S.view = 'mina'; flash('Förfrågan är skickad. Svaren dyker upp under Mina förfrågningar.');
  };
}

// ---------- Köpare: mina förfrågningar ----------
async function vMine(el) {
  const { data: R, error } = await sb.from('requests').select('*, request_lines(*)').eq('buyer_org_id', S.org.id).is('deleted_at', null).order('created_at', { ascending: false });
  if (error) throw error;
  if (!R.length) { el.innerHTML = '<h1>Mina förfrågningar</h1><div class="card"><p>Inga förfrågningar än.</p><button class="btn" id="g">Skapa en förfrågan</button></div>'; $('g').onclick = () => go('ny'); return; }
  const lineIds = R.flatMap(r => r.request_lines.map(l => l.id));
  const { data: A } = await sb.from('answers').select('*, offers(*)').in('line_id', lineIds).order('created_at');
  const chosenIds = [...new Set(R.flatMap(r => r.request_lines.map(l => l.chosen_org_id)).filter(Boolean))];
  const { data: O } = chosenIds.length ? await sb.from('organizations').select('id,name,city,contact_name,phone,email').in('id', chosenIds) : { data: [] };
  const org = id => O.find(o => o.id === id) || {};
  let h = '<h1>Mina förfrågningar</h1>';
  for (const r of R) {
    h += `<div class="card"><div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap"><h2>${esc(r.addr || r.city)}</h2><span class="sub">skickad ${day(r.created_at)}${upd(r) ? ` · <span class="tag dev">Uppdaterad ${day(upd(r))}</span>` : ''}</span></div>
    <p class="sub">Leverans ${wl(r.first_week)}–${wl(r.last_week)} till ${esc(r.city)} · ${r.all_from_one ? 'allt från en fabrik' : 'delar ok'} · ritningar: ${esc((r.drawings || '').toLowerCase())}</p>`;
    for (const l of r.request_lines.filter(l => !l.removed).sort((a, b) => a.created_at.localeCompare(b.created_at))) {
      const ans = (A || []).filter(a => a.line_id === l.id), yes = ans.filter(a => a.status !== 'nej'), no = ans.length - yes.length;
      const rows = yes.map((a, i) => { const share = a.status === 'delvis' ? +a.qty : +l.qty; const tm2 = a.transport / share; const del = +a.price + tm2; const dev = []; if (a.status === 'delvis' && r.all_from_one) dev.push(Math.round(share / l.qty * 100) + ' % av mängden'); if (a.week_to > r.last_week) dev.push('sista leverans ' + wl(a.week_to)); const co2 = a.km ? Math.round(a.km * tons(l, share) * 0.082 / 100) / 10 : null; return { a, i, dev, del, tm2, share, co2 }; }).sort((x, y) => (x.dev.length - y.dev.length) || (x.del - y.del));
      const label = (a, i) => l.chosen_org_id === a.factory_org_id ? esc(org(a.factory_org_id).name || 'Fabrik') : 'Fabrik ' + String.fromCharCode(65 + i);
      h += `<div class="line"><h3>${lineText(l)}</h3><p class="sub" style="margin:4px 0">${lineSub(l)} · ${yes.length} svar med pris, ${no} nej.</p>`;
      if (yes.length) h += `<div class="scroll"><table><thead><tr><th>Fabrik</th><th>Klarar</th><th class="num">kr/${U(l)} LOK</th><th class="num">Transport kr/${U(l)}</th><th class="num">Kr/${U(l)} levererat</th><th class="num">Totalt kr</th><th>Leverans</th><th class="num">km</th><th class="num">CO2 ton</th><th>Krav</th><th></th></tr></thead><tbody>
        ${rows.map(x => { const a = x.a, isC = l.chosen_org_id === a.factory_org_id; return `<tr><td><b>${label(a, x.i)}</b><div class="sub">${isC ? esc(org(a.factory_org_id).city || '') : 'anonym'}</div>${isStale(a, l.edited_at || r.edited_at) ? '<span class="tag dev">Svar före er ändring</span>' : ''}${a.note ? `<div class="sub">”${esc(a.note)}”</div>` : ''}</td><td>${a.status === 'delvis' ? fmt(a.qty) + ' ' + U(l) : 'Hela'}</td><td class="num">${fmt(a.price)}</td><td class="num">${fmt(x.tm2)}<div class="sub">(Estimat)</div></td><td class="num"><b>${fmt(x.del)}</b><div class="sub">(Estimat)</div></td><td class="num">${fmt(x.del * x.share)}<div class="sub">(Estimat)</div></td><td>${wl(a.week_from)}–${wl(a.week_to)}</td><td class="num">${a.km != null ? fmt(a.km) : '–'}</td><td class="num">${x.co2 != null ? x.co2.toLocaleString('sv-SE') : '–'}</td><td>${x.dev.length ? '<span class="tag dev">' + esc(x.dev.join(', ')) + '</span>' : '<span class="tag ok">Uppfyller</span>'}</td><td>${l.chosen_org_id ? (isC ? '<span class="tag acc">Vald</span>' : '') : `<button class="btn2" data-pick="${l.id}|${a.factory_org_id}" data-name="${label(a, x.i)}">Välj</button>`}</td></tr>`; }).join('')}</tbody></table></div>`;
      else h += '<p class="sub">Inga svar ännu.</p>';
      if (l.chosen_org_id) {
        const f = org(l.chosen_org_id), a = ans.find(x => x.factory_org_id === l.chosen_org_id), of = a?.offers;
        h += `<div class="note"><b>Ni har valt ${esc(f.name || 'fabriken')}.</b> Kontakt: ${esc(f.contact_name || '')}${f.phone ? ', ' + esc(f.phone) : ''}${f.email ? ', ' + esc(f.email) : ''}. Skicka ritningar och underlag direkt till dem.</div>`;
        if (of) h += `<div class="card" style="background:#F7F8F6;margin:8px 0"><h3>Fast offert</h3><p>${fmt(of.price)} kr/${U(l)} LOK · transport ${fmt(of.transport)} kr (estimat) · giltig till ${esc(of.valid_until || '–')}${of.note ? '<br>Villkor: ' + esc(of.note) : ''}</p>
          <p style="margin-bottom:0">${l.outcome ? `Ni har markerat: <b>${l.outcome === 'affar' ? 'Affär' : 'Ingen affär'}</b>.` : `Blev det affär? <button class="btn2" data-out="${l.id}|affar">Ja, affär</button> <button class="lnk" data-out="${l.id}|ingen">Nej</button>`}</p></div>`;
        else h += '<p class="sub">Väntar på fast offert från fabriken.</p>';
      }
      h += '</div>';
    }
    h += `<p>${r.request_lines.some(l => !l.removed && !l.chosen_org_id) ? `<button class="btn2" data-editreq="${r.id}">Ändra förfrågan</button> ` : ''}<button class="lnk" data-del="${r.id}">Ta bort förfrågan</button></p></div>`;
  }
  el.innerHTML = h;
  el.querySelectorAll('[data-editreq]').forEach(b => b.onclick = () => { S.editReq = R.find(r => r.id === b.dataset.editreq); go('ny', true); });
  el.querySelectorAll('[data-pick]').forEach(b => b.onclick = async () => { const [lid, fid] = b.dataset.pick.split('|'); if (!confirm(`Välja ${b.dataset.name}? Namn och kontaktuppgifter visas då för båda och fabriken lämnar fast offert. Valet går inte att ändra.`)) return; const { error } = await sb.from('request_lines').update({ chosen_org_id: fid }).eq('id', lid); if (error) return flash(errText(error)); flash('Fabriken är vald. Kontaktuppgifterna syns nu för er båda.'); });
  el.querySelectorAll('[data-out]').forEach(b => b.onclick = async () => { const [lid, o] = b.dataset.out.split('|'); const { error } = await sb.from('request_lines').update({ outcome: o }).eq('id', lid); if (error) return flash(errText(error)); render(); });
  el.querySelectorAll('[data-del]').forEach(b => b.onclick = async () => { if (!confirm('Ta bort förfrågan? Fabrikerna ser den inte längre.')) return; const { error } = await sb.from('requests').update({ deleted_at: new Date().toISOString() }).eq('id', b.dataset.del); if (error) return flash(errText(error)); flash('Förfrågan är borttagen.'); });
}

// ---------- Fabrik: inkorg ----------
async function vInbox(el) {
  const o = S.org;
  const { data: X, error } = await sb.rpc('factory_inbox'); if (error) throw error;
  const { data: A } = await sb.from('answers').select('*, offers(*)').eq('factory_org_id', o.id);
  const ans = id => (A || []).find(a => a.line_id === id);
  const edited = x => [x.line_edited_at, x.request_edited_at].filter(Boolean).sort().pop();
  const isOpen = x => !x.chosen_me && !x.chosen_other && (!ans(x.line_id) || isStale(ans(x.line_id), edited(x)));
  const open = X.filter(isOpen), rest = X.filter(x => !isOpen(x));
  let h = '<h1>Förfrågningar</h1>';
  if (!X.length) { el.innerHTML = h + `<div class="card"><p>Inga förfrågningar på era produkter ännu (${esc((o.products || []).join(', ').toLowerCase())}).</p><p class="sub">Lägg gärna in ledig kapacitet.</p></div>`; return; }
  const card = x => {
    const a = ans(x.line_id), l = x, tr = transport(o, l, l.qty, x.city), stale = isStale(a, edited(x));
    let c = `<div class="card"><div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px"><h3>${lineText(l)}</h3><span class="sub">${x.chosen_me ? esc(x.buyer_name) : 'Anonym köpare'} · ${day(x.request_created_at)}${edited(x) ? ` · <span class="tag dev">Uppdaterad ${day(edited(x))}</span>` : ''}</span></div>
    <p class="sub" style="margin:6px 0">${lineSub(l)} · leverans ${wl(x.first_week)}–${wl(x.last_week)} till ${esc(x.city)}${tr ? ` (cirka ${fmt(tr.km)} km från er)` : ''} · ${x.all_from_one ? 'allt från en fabrik' : 'delar ok'} · ritningar: ${esc((x.drawings || '').toLowerCase())}</p>
    ${stale ? '<div class="note"><b>Köparen har ändrat förfrågan efter ert svar.</b> Kontrollera och uppdatera svaret.</div>' : ''}`;
    if (x.chosen_me) {
      const of = a?.offers;
      c += `<div class="note"><b>Köparen har valt er.</b> ${esc(x.buyer_name)}: ${esc(x.buyer_contact || '')}${x.buyer_phone ? ', ' + esc(x.buyer_phone) : ''}${x.buyer_email ? ', ' + esc(x.buyer_email) : ''}${x.addr ? ' · projekt: ' + esc(x.addr) : ''}. Begär ritningar av köparen och lämna fast offert här.</div>`;
      if (of && S.edit !== 'o' + x.line_id) c += `<p>Er fasta offert: ${fmt(of.price)} kr/${U(l)} LOK, transport ${fmt(of.transport)} kr (estimat), giltig till ${esc(of.valid_until || '–')}. ${x.outcome ? `Köparen har markerat: <b>${x.outcome === 'affar' ? 'Affär' : 'Ingen affär'}</b>.` : ''} <button class="lnk" data-edit="o${x.line_id}">Ändra offerten</button></p>`;
      else { const d = of || {}; c += `<div class="row"><div><label>Fast pris, kr/${U(l)} LOK</label><input id="op${x.line_id}" type="number" value="${esc(d.price ?? a.price)}"></div><div><label>Transport, kr totalt (estimat)</label><input id="ot${x.line_id}" type="number" value="${esc(d.transport ?? a.transport)}"></div><div><label>Giltig till</label><input id="ov${x.line_id}" type="date" value="${esc(d.valid_until || '')}"></div></div>
        <div style="margin-top:10px"><label>Villkor och kommentar</label><textarea id="on${x.line_id}" rows="2">${esc(d.note || '')}</textarea></div><div class="err" id="oe${x.line_id}"></div><p><button class="btn" data-offer="${x.line_id}">Skicka fast offert</button></p>`; }
    } else if (x.chosen_other) c += '<p class="sub">Köparen valde en annan fabrik för den här raden.</p>';
    else if (a && !stale && S.edit !== x.line_id) c += `<p>Ert svar: ${a.status === 'nej' ? '<b>Nej</b>' : `<b>${a.status === 'delvis' ? fmt(a.qty) + ' ' + U(l) : 'Hela mängden'}</b>, cirka ${fmt(a.price)} kr/${U(l)} LOK, transport ${fmt(a.transport)} kr (estimat), ${wl(a.week_from)}–${wl(a.week_to)}`}. <button class="lnk" data-edit="${x.line_id}">Ändra svar</button></p>`;
    else {
      const d = a ? { ...a } : { status: 'helt', qty: l.qty, price: '', transport: tr ? tr.kr : '', week_from: x.first_week, week_to: x.last_week, note: '' };
      if (stale && tr) d.transport = tr.kr;
      const k = x.line_id;
      c += `<div class="row" style="margin-top:8px"><div><label>Svar</label><select id="st${k}" data-k="${k}" class="stsel"><option value="helt" ${d.status === 'helt' ? 'selected' : ''}>Kan hela mängden</option><option value="delvis" ${d.status === 'delvis' ? 'selected' : ''}>Kan delvis</option><option value="nej" ${d.status === 'nej' ? 'selected' : ''}>Nej</option></select></div>
      <div><label>Mängd vid delvis, ${U(l)}</label><input id="m2${k}" data-k="${k}" class="m2in" type="number" value="${esc(d.qty ?? l.qty)}"></div>
      <div><label>Ungefärligt pris, kr/${U(l)} LOK</label><input id="pr${k}" type="number" min="1" value="${esc(d.price)}"></div>
      <div><label>Transport, kr totalt (estimat)</label><input id="tr${k}" type="number" min="0" value="${esc(d.transport)}"><div class="sub" id="tri${k}">${tr ? trInfo(o, l, tr) : 'Välj fabrikens ort i profilen för transportförslag'}</div></div></div>
      <div class="row" style="margin-top:10px"><div><label>Första leverans</label><select id="wf${k}">${weekOpts(d.week_from)}</select></div><div><label>Sista leverans</label><select id="wt${k}">${weekOpts(d.week_to)}</select></div><div style="flex-basis:300px"><label>Kommentar till köparen (valfri)</label><input id="no${k}" value="${esc(d.note || '')}"></div></div>
      <div class="err" id="ae${k}"></div><p><button class="btn" data-ans="${k}">Skicka svar</button>${a ? ' <button class="lnk" data-edit="">Avbryt</button>' : ''}</p>`;
    }
    return c + '</div>';
  };
  if (open.length) h += `<h2 style="margin-top:14px">Att svara på (${open.length})</h2>` + open.map(card).join('');
  if (rest.length) h += '<h2 style="margin-top:20px">Besvarade och avslutade</h2>' + rest.map(card).join('');
  el.innerHTML = h;
  const nb = $('n-inkorg'); if (nb && open.length) { nb.textContent = open.length; nb.style.display = ''; }
  const find = k => X.find(x => x.line_id === k);
  el.querySelectorAll('.m2in').forEach(i => i.oninput = () => { const x = find(i.dataset.k); const q = $('st' + i.dataset.k).value === 'delvis' ? (+i.value || 0) : x.qty; const t = transport(o, x, q, x.city); if (t) { $('tr' + i.dataset.k).value = t.kr; $('tri' + i.dataset.k).textContent = trInfo(o, x, t); } });
  el.querySelectorAll('.stsel').forEach(s => s.onchange = () => { const i = $('m2' + s.dataset.k); if (s.value !== 'delvis') i.value = find(s.dataset.k).qty; i.oninput(); });
  el.querySelectorAll('[data-edit]').forEach(b => b.onclick = () => { S.edit = b.dataset.edit || null; render(); });
  el.querySelectorAll('[data-ans]').forEach(b => b.onclick = async () => {
    const k = b.dataset.ans, x = find(k), e = $('ae' + k), st = val('st' + k);
    const d = { line_id: k, factory_org_id: o.id, status: st, qty: st === 'delvis' ? +val('m2' + k) : null, price: st === 'nej' ? null : +val('pr' + k), transport: st === 'nej' ? null : +val('tr' + k), week_from: st === 'nej' ? null : +val('wf' + k), week_to: st === 'nej' ? null : +val('wt' + k), note: val('no' + k) || null, km: transport(o, x, x.qty, x.city)?.km ?? null };
    if (st !== 'nej') { if (!(d.price > 0)) { e.textContent = 'Ange ungefärligt pris.'; return; } if (!(d.transport >= 0)) { e.textContent = 'Ange transport (0 om köparen hämtar).'; return; } if (d.week_to < d.week_from) { e.textContent = 'Sista leverans kan inte vara före första.'; return; } }
    if (st === 'delvis' && !(d.qty > 0 && d.qty < x.qty)) { e.textContent = 'Ange en mängd som är mindre än hela.'; return; }
    b.disabled = true;
    const { error } = await sb.from('answers').upsert(d, { onConflict: 'line_id,factory_org_id' });
    if (error) { b.disabled = false; e.textContent = errText(error); return; }
    S.edit = null; flash('Svaret är skickat. Köparen ser det utan ert namn.');
  });
  el.querySelectorAll('[data-offer]').forEach(b => b.onclick = async () => {
    const k = b.dataset.offer, a = ans(k), e = $('oe' + k);
    const d = { answer_id: a.id, price: +val('op' + k), transport: +val('ot' + k), valid_until: val('ov' + k) || null, note: val('on' + k) || null };
    if (!(d.price > 0) || !(d.transport >= 0)) { e.textContent = 'Ange pris och transport.'; return; }
    const { error } = await sb.from('offers').upsert(d, { onConflict: 'answer_id' });
    if (error) { e.textContent = errText(error); return; }
    S.edit = null; flash('Den fasta offerten är skickad till köparen.');
  });
}

// ---------- Admin ----------
async function vAdmin(el) {
  const [{ data: O }, { data: P }, { data: R }, { data: A }, { data: L }] = await Promise.all([
    sb.from('organizations').select('*').order('created_at', { ascending: false }),
    sb.from('profiles').select('id,org_id,email,full_name,created_at'),
    sb.from('requests').select('id,buyer_org_id,city,created_at,deleted_at'),
    sb.from('answers').select('id,line_id,status'),
    sb.from('request_lines').select('id,request_id,product,qty,unit,chosen_org_id,outcome,removed')
  ]);
  const f = S.adminFilter || 'alla';
  const list = O.filter(o => f === 'alla' || o.status === f);
  const nNew = O.filter(o => o.status === 'ny').length;
  const live = (R || []).filter(r => !r.deleted_at);
  el.innerHTML = `<h1>Admin</h1>
  <div class="card stat"><div><b>${O.length}</b>företag</div><div><b>${O.filter(isFactory).length}</b>fabriker</div><div><b>${O.filter(isBuyer).length}</b>köpare</div><div><b>${nNew}</b>att verifiera</div><div><b>${live.length}</b>förfrågningar</div><div><b>${(A || []).filter(a => a.status !== 'nej').length}</b>svar med pris</div><div><b>${(L || []).filter(l => l.chosen_org_id).length}</b>valda fabriker</div><div><b>${(L || []).filter(l => l.outcome === 'affar').length}</b>affärer</div></div>
  <div class="card"><div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px"><h2>Företag</h2><select id="af" style="width:auto">${['alla', 'ny', 'verifierad', 'avstangd'].map(k => `<option value="${k}" ${f === k ? 'selected' : ''}>${k === 'alla' ? 'Alla' : STATUS[k]}</option>`).join('')}</select></div>
  <div class="scroll"><table><thead><tr><th>Företag</th><th>Roll</th><th>Ort</th><th>Kontakt</th><th>Produkter</th><th>Registrerad</th><th>Status</th><th></th></tr></thead><tbody>
  ${list.map(o => { const users = (P || []).filter(p => p.org_id === o.id); return `<tr><td><b>${esc(o.name)}</b><div class="sub">${users.map(u => esc(u.email)).join(', ')}</div></td><td>${ROLES[o.role]}</td><td>${esc(o.city || '–')}</td><td>${esc(o.contact_name || '')}<div class="sub">${esc(o.phone || '')}</div></td><td class="sub">${esc((o.products || []).join(', '))}</td><td>${day(o.created_at)}</td><td><span class="tag ${o.status === 'verifierad' ? 'ok' : o.status === 'avstangd' ? 'dev' : ''}">${STATUS[o.status]}</span></td>
  <td style="white-space:nowrap">${o.status !== 'verifierad' ? `<button class="btn2" data-st="${o.id}|verifierad">Verifiera</button> ` : ''}${o.status !== 'avstangd' && o.id !== S.org.id ? `<button class="lnk" data-st="${o.id}|avstangd">Stäng av</button>` : ''}${o.status === 'avstangd' ? `<button class="lnk" data-st="${o.id}|ny">Återaktivera</button>` : ''}</td></tr>`; }).join('') || '<tr><td colspan="8" class="sub">Inga företag.</td></tr>'}
  </tbody></table></div></div>
  <div class="card"><h2>Senaste förfrågningar</h2><div class="scroll"><table><thead><tr><th>Datum</th><th>Köpare</th><th>Ort</th><th>Rader</th><th class="num">Svar</th><th>Status</th></tr></thead><tbody>
  ${live.sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, 50).map(r => { const ls = (L || []).filter(l => l.request_id === r.id && !l.removed); const na = (A || []).filter(a => ls.some(l => l.id === a.line_id)).length; const ch = ls.filter(l => l.chosen_org_id).length; return `<tr><td>${day(r.created_at)}</td><td>${esc(O.find(o => o.id === r.buyer_org_id)?.name || '')}</td><td>${esc(r.city)}</td><td class="sub">${ls.map(l => esc(l.product) + ' ' + fmt(l.qty) + ' ' + U(l)).join('<br>')}</td><td class="num">${na}</td><td>${ch ? `<span class="tag acc">${ch} vald</span>` : '<span class="tag">Öppen</span>'}</td></tr>`; }).join('') || '<tr><td colspan="6" class="sub">Inga förfrågningar än.</td></tr>'}
  </tbody></table></div></div>`;
  $('af').onchange = e => { S.adminFilter = e.target.value; render(); };
  el.querySelectorAll('[data-st]').forEach(b => b.onclick = async () => { const [id, st] = b.dataset.st.split('|'); if (st === 'avstangd' && !confirm('Stänga av företaget? De kan logga in men inte se eller skicka förfrågningar.')) return; const { error } = await sb.from('organizations').update({ status: st }).eq('id', id); if (error) return flash(errText(error)); render(); });
}
