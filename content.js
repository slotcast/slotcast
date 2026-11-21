// Texter för startsidan och integritetspolicyn (visas för utloggade besökare).

export const LANDING = `
<section class="hero"><div class="wrap hero-in">
  <div class="hero-txt">
    <p class="kick">Marknadsplatsen för betongelement</p>
    <h1 class="big">Fler fabriker att välja bland, närmare ert projekt</h1>
    <p class="lead">Få svar från prefabfabriker ni kanske aldrig har anlitat, eller inte har jobbat med på länge. En fabrik närmare projektet betyder lägre transportkostnad och mindre CO2.</p>
    <p class="lead">Väggar och socklar från närmaste fabrik. Balkonger och trappor från specialister i Sverige, Danmark och Polen. Plattbärlag och håldäck till bästa pris levererat.</p>
    <p class="free">Alltid gratis för köpare. Har ni en fabrik? Nå köpare ni inte har i dag, gratis till augusti 2027.</p>
  </div>
  <div id="authwrap" class="hero-auth"></div>
</div></section>

<section class="wrap blk">
  <h2 class="h2">Vad behöver ni?</h2>
  <div class="two">
    <div class="pane">
      <p class="kick">Snabb leverans</p>
      <h3 class="h3">Behöver du snabb leverans?</h3>
      <p>Då gäller det att hitta en fabrik som har plats i produktionen. Redan när ni fyller i förfrågan ser ni hur många fabriker som har lagt in ledig kapacitet under perioden. Fabrikerna svarar med vilka veckor de kan leverera och väggar och bjälklag kan komma från olika fabriker.</p>
      <button class="btn" data-reg="kopare">Hitta ledig kapacitet</button>
    </div>
    <div class="pane">
      <p class="kick">Traditionell offert</p>
      <h3 class="h3">Har ni tid att jämföra?</h3>
      <p>Då handlar det om pris och därmed om närhet till projektet. Förfrågan går till alla fabriker som tillverkar produkten. Svaren visas med pris levererat, km och transportens CO2, så att närmaste fabrik som klarar kraven syns först.</p>
      <button class="btn" data-reg="kopare">Begär offert</button>
    </div>
  </div>
</section>

<section class="wrap blk">
  <div class="pane dark">
    <p class="kick">För fabriker</p>
    <h3 class="h3">Fyll luckorna i produktionen med köpare ni inte når i dag</h3>
    <ul>
      <li>Lägg in ledig kapacitet i m² och veckor; ingen produkt behövs, det avgör köparens förfrågan</li>
      <li>Förfrågningar på de produkter ni tillverkar, från byggföretag, stålhallsbyggare och andra fabriker</li>
      <li>Ungefärligt svar först, fast offert när köparen har valt er</li>
      <li>Konkurrenter ser aldrig era svar eller priser</li>
      <li>Ingen provision; affären gör ni direkt med köparen</li>
    </ul>
    <button class="btn" data-reg="fabrik">Anslut er fabrik</button>
  </div>
</section>

<section class="wrap blk">
  <h2 class="h2">Så fungerar det, i två steg</h2>
  <p class="lead2">Som branschen redan arbetar: först ett ungefärligt pris på en grov beskrivning, sedan fast pris på ritningarna. Bara snabbare och till fler fabriker.</p>
  <div class="steps">
    <div><b>1</b><h3 class="h4">Köparen frågar</h3><p>Produkt med enkel kravställning, mängd i m² eller löpmeter, ungefärligt antal element, projektets adress och leveransveckor.</p></div>
    <div><b>2</b><h3 class="h4">Fabrikerna svarar</h3><p>Anonymt: kan helt, delvis eller nej, ungefärligt pris, transport och leveransveckor.</p></div>
    <div><b>3</b><h3 class="h4">Köparen väljer</h3><p>Då släpps namn och kontaktuppgifter åt båda håll och ritningarna går till fabriken.</p></div>
    <div><b>4</b><h3 class="h4">Fast offert</h3><p>Fabriken räknar på ritningarna. Affären görs direkt mellan parterna.</p></div>
  </div>
</section>

<section class="wrap blk">
  <div class="two">
    <div>
      <h2 class="h2">Det som skiljer fabrikerna åt</h2>
      <p>Fabriker skiljer sig i när de kan leverera, i kvalitet, i avstånd till projektet och i klimatavtryck. Slotcast visar det som går att mäta i varje svar: leveransveckor, km till projektet och transportens CO2. Kvaliteten bedömer ni som i dag, när ni har valt fabrik och får fast offert.</p>
      <p>Transporten är en stor del av priset. För en massiv vägg är den ungefär 6 % av priset inom 3 mil och 16 % på 30 mil, så närmaste fabrik som klarar kraven blir ofta billigast.</p>
    </div>
    <div class="nums">
      <div><b>189</b><span>företag i Sverige tillverkar betongvaror för byggindustrin, 56 av dem med minst 10 anställda (SCB, 2025)</span></div>
      <div><b>18,4 mdr kr</b><span>i omsättning i branschen 2024 (SCB)</span></div>
    </div>
  </div>
</section>

<section class="wrap blk">
  <div class="two">
    <div>
      <p class="kick">Varför Slotcast</p>
      <h2 class="h2">Byggt av någon som har drivit en prefabfabrik</h2>
      <p>I min fabrik, Prebetong i Motala, varierade produktionen mellan 158 och 738 m² i veckan med samma personal. Projekt sköts fram eller krympte och luckorna kom utan förvarning. Samtidigt ringde köpare runt för att hitta någon med ledig tid. Slotcast kopplar ihop de två.</p>
      <p><b>Filip Björnstjerna, grundare</b></p>
    </div>
    <div class="nums">
      <div><b>158–738</b><span>m² gjutet per vecka i samma fabrik</span></div>
      <div><b>26–35 %</b><span>av försäljningen gick till andra fabriker</span></div>
      <div><b>80 av 301</b><span>offerter gällde under 200 m²</span></div>
    </div>
  </div>
</section>

<section class="cta"><div class="wrap cta-in">
  <div>
    <h2 class="h2">Gå med nu, så sparar du mer</h2>
    <p>Alltid gratis för köpare. Gratis för fabriker till augusti 2027; ju tidigare er fabrik går med, desto fler gratis månader. Därefter ett abonnemang som följer hur mycket affärer fabriken gör. Ingen provision.</p>
  </div>
  <div class="cta-b"><button class="btn2" data-reg="kopare">Skapa konto som köpare</button><button class="btn3" data-reg="fabrik">Anslut er fabrik</button></div>
</div></section>

<section class="wrap blk faq">
  <h2 class="h2">Vanliga frågor</h2>
  <details><summary>Kostar det något?</summary><p>Köpare betalar ingenting. Fabriker är med gratis till augusti 2027 och betalar sedan ett abonnemang som följer hur mycket affärer fabriken gör. Ingen provision.</p></details>
  <details><summary>Hur exakta är priserna i första svaret?</summary><p>Ungefärliga, byggda på det köparen har angett. Fast pris lämnar fabriken på ritningarna när köparen har valt den.</p></details>
  <details><summary>Vem ser vad?</summary><p>Fabrikerna ser en anonym förfrågan. Köparen ser svaren utan fabrikernas namn. Konkurrerande fabriker ser aldrig varandras svar. Namn och kontaktuppgifter släpps när köparen väljer fabrik.</p></details>
  <details><summary>Måste fabriken ange produkt för sin lediga kapacitet?</summary><p>Nej. Ledig kapacitet anges i m² och veckor. Om det blir sandwichvägg, massiv vägg eller sockel avgör köparens förfrågan, bland de produkter fabriken tillverkar.</p></details>
  <details><summary>Hur snabbt kan elementen levereras?</summary><p>Det avgör fabriken. Fabriker behöver oftast tillverkningsritningar 6–8 veckor före produktion, så akuta förfrågningar fungerar bäst när ritningarna är klara.</p></details>
  <details><summary>Vem ansvarar för transporten?</summary><p>Köparen och fabriken, som i dag. Fabriken anger transporten i sitt svar och Slotcast föreslår ett belopp utifrån avstånd och vikt. Köparen ser km och transportens CO2 för varje svar.</p></details>
</section>

<footer class="foot"><div class="wrap foot-in">
  <div class="logo">slot<span>cast</span></div>
  <p><a href="mailto:filip@bjornstjerna.se">filip@bjornstjerna.se</a> · <a href="#integritet">Integritetspolicy</a></p>
</div></footer>
`;

export const POLICY = `
<div class="wrap blk policy"><div class="card">
<p><a href="#">← Tillbaka</a></p>
<h1>Integritetspolicy för Slotcast</h1>
<p class="sub">Gäller från [DATUM]</p>

<h2>Vem ansvarar för dina uppgifter</h2>
<p>Slotcast drivs av [BOLAG], org.nr [XXXXXX-XXXX], som är personuppgiftsansvarig. Frågor om dina uppgifter skickar du till <a href="mailto:filip@bjornstjerna.se">filip@bjornstjerna.se</a>.</p>

<h2>Vilka uppgifter vi samlar in</h2>
<ul>
<li>Kontouppgifter: företagets namn, kontaktperson, telefon, e-post, ort, roll och vilka produkter fabriken tillverkar. Lösenordet sparas krypterat och kan inte läsas av oss.</li>
<li>Uppgifter i tjänsten: förfrågningar (till exempel projektets adress, mängder och leveransveckor), fabrikernas svar och offerter, ledig kapacitet, transporttaxa och om det blev affär.</li>
<li>Tekniska uppgifter: inloggningsuppgifter för att hålla dig inloggad samt loggar med IP-adress och tidpunkt, som våra leverantörer sparar för drift och säkerhet.</li>
</ul>

<h2>Varför vi använder uppgifterna och med vilken rätt</h2>
<ul>
<li>För att leverera tjänsten: skapa konto, skicka förfrågningar och svar, visa kontaktuppgifter när en köpare har valt fabrik och skicka mejl om nya förfrågningar och svar. Grunden är avtalet med dig när du registrerar dig.</li>
<li>För att verifiera nya företag och förhindra missbruk. Grunden är vårt berättigade intresse av en säker marknadsplats.</li>
<li>För att följa upp om det blev affär och förbättra tjänsten. Grunden är vårt berättigade intresse.</li>
<li>För bokföring när fabriker betalar abonnemang. Grunden är vår rättsliga skyldighet.</li>
</ul>

<h2>Vem som ser uppgifterna</h2>
<p>Fabriker ser förfrågningar utan köparens namn. Köpare ser svar utan fabrikens namn. När en köpare väljer en fabrik ser båda varandras namn och kontaktuppgifter och fabriken ser projektets adress. Konkurrerande fabriker ser aldrig varandras svar.</p>
<p>Vi säljer inga uppgifter. Vi använder följande leverantörer, som behandlar uppgifter för vår räkning enligt personuppgiftsbiträdesavtal:</p>
<ul>
<li>Supabase: databas och inloggning. Uppgifterna lagras i Stockholm (EU).</li>
<li>Vercel: driftar webbplatsen. Vercel är ett amerikanskt bolag; överföring utanför EU sker med stöd av EU:s standardavtalsklausuler [KONTROLLERA].</li>
<li>[E-POSTLEVERANTÖR]: skickar mejl från tjänsten.</li>
</ul>

<h2>Hur länge vi sparar uppgifterna</h2>
<p>Så länge kontot är aktivt. När ett konto avslutas raderar vi uppgifterna inom 12 månader. Förfrågningar och svar som andra användare har fått kan finnas kvar i avidentifierad form för statistik. Bokföringsunderlag sparar vi i sju år enligt bokföringslagen.</p>

<h2>Cookies</h2>
<p>Vi använder inga cookies för spårning eller reklam. Webbläsaren sparar bara det som behövs för att hålla dig inloggad.</p>

<h2>Dina rättigheter</h2>
<p>Du har rätt att få veta vilka uppgifter vi har om dig, att få fel rättade, att få uppgifter raderade, att begränsa eller invända mot behandlingen och att få ut dina uppgifter i ett läsbart format. Skriv till <a href="mailto:filip@bjornstjerna.se">filip@bjornstjerna.se</a>. Är du inte nöjd kan du klaga hos Integritetsskyddsmyndigheten, <a href="https://www.imy.se" target="_blank" rel="noopener">imy.se</a>.</p>

<h2>Ändringar</h2>
<p>Ändrar vi policyn meddelar vi det i tjänsten och via mejl om ändringen är väsentlig.</p>
</div></div>
`;
