// Texter för startsidan och integritetspolicyn (visas för utloggade besökare).

export const LANDING = `
<section class="hero"><div class="wrap hero-in">
  <div class="hero-txt">
    <p class="kick">Marknadsplatsen för betongelement</p>
    <h1 class="big">Betongelement nära ert projekt, från en fabrik som möter era miljökrav</h1>
    <p class="lead">Fler fabriker att välja bland. Få svar från prefabfabriker ni kanske aldrig har anlitat, eller inte har jobbat med på länge. En fabrik närmare projektet betyder lägre transportkostnad och mindre CO2. Varje svar visar också fabrikens klimatnivå, EPD och elementens CO2, så att ni hittar en leverantör som är nära och möter era miljökrav. Vid samma pris vinner miljön.</p>
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
      <p>Då handlar det om pris och därmed om närhet till projektet. Förfrågan går till alla fabriker som tillverkar produkten. Svaren visas med pris levererat, km, CO2 för element och transport, klimatnivå och EPD. Lägst pris levererat syns först, och det är oftast närmaste fabrik som klarar kraven. Vid samma pris vinner lägst klimatpåverkan.</p>
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
      <li>Visa era miljöinvesteringar: lägg in siffran ur er EPD, så syns elementens CO2 och er klimatnivå i varje svar, för alla köpare</li>
      <li>Vid samma pris vinner fabriken med lägst klimatpåverkan, så er EPD blir ett sätt att skilja er från mängden</li>
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
    <div><b>1</b><h3 class="h4">Köparen frågar</h3><p>Produkt med enkel kravställning, mängd i m² eller löpmeter, ungefärligt antal element, projektets adress, leveransveckor och klimatkrav om ni har.</p></div>
    <div><b>2</b><h3 class="h4">Fabrikerna svarar</h3><p>Anonymt: kan helt, delvis eller nej, ungefärligt pris, transport och fordon, leveransveckor och klimatnivå.</p></div>
    <div><b>3</b><h3 class="h4">Köparen väljer</h3><p>Då släpps namn och kontaktuppgifter åt båda håll och ritningarna går till fabriken.</p></div>
    <div><b>4</b><h3 class="h4">Fast offert</h3><p>Fabriken räknar på ritningarna. Affären görs direkt mellan parterna.</p></div>
  </div>
</section>

<section class="wrap blk">
  <div class="two">
    <div>
      <h2 class="h2">Det som skiljer fabrikerna åt</h2>
      <p>Fabriker skiljer sig i när de kan leverera, i kvalitet, i avstånd till projektet och i klimatavtryck. Slotcast visar det som går att mäta i varje svar: leveransveckor, km till projektet, CO2 för element och transport, klimatnivå och EPD. Kvaliteten bedömer ni som i dag, när ni har valt fabrik och får fast offert.</p>
      <p>Transporten är en stor del av priset. För en massiv vägg kan den vara ungefär 6 % av priset inom 3 mil och 16 % på 30 mil, så närmaste fabrik som klarar kraven blir ofta billigast. Siffrorna bygger på Prebetongs transportpriser från 2020, som är över sex år gamla och visar en möjlig nivå.</p>
    </div>
    <div class="nums">
      <div><b>189</b><span>företag i Sverige tillverkar betongvaror för byggindustrin, 56 av dem med minst 10 anställda (SCB, 2025)</span></div>
      <div><b>18,4 mdr kr</b><span>i omsättning i branschen 2024 (SCB)</span></div>
    </div>
  </div>
</section>

<section class="wrap blk" id="klimat">
  <div class="two">
    <div>
      <p class="kick">Nära och klimat</p>
      <h2 class="h2">Nära är bra för ekonomin och miljön</h2>
      <p>Betongelement är tunga. Ju kortare väg från fabrik till projekt, desto lägre transportkostnad och desto mindre utsläpp. Klimatkraven på stommen växer också, med klimatdeklaration vid bygglov, Miljöbyggnad och Svanen.</p>
      <p>Därför visar varje svar fabrikens klimatnivå, om den har en miljövarudeklaration (EPD) och CO2 för element och transport, oavsett om köparen har ställt krav. Vid samma pris hamnar fabriken med lägst klimatpåverkan först.</p>
      <p>För fabrikerna blir det marknadsföring av miljöinvesteringarna: klimatförbättrad betong, EPD och fossilfria transporter syns där köparna jämför. Fabriker utan EPD svarar med branschens typvärde, så alla kan vara med.</p>
    </div>
    <div class="pane">
      <h3 class="h3">Så räknar Slotcast klimatpåverkan</h3>
      <ol>
        <li><b>Fabriken lägger in sin EPD</b> per produkt: klimatpåverkan för tillverkningen (A1–A3) i kg CO2e per ton, m³ eller m², registreringsnummer och länk.</li>
        <li><b>Slotcast räknar om</b> till hela ordern, med elementens tjocklek och vikt.</li>
        <li><b>Transporten läggs till</b> (A4) med vägavstånd och fabrikens fordon, diesel, HVO100, biogas eller el, enligt Boverkets klimatdatabas. Köparen ser CO2 för element, transport och totalt.</li>
        <li><b>Utan EPD</b> används Boverkets generiska värde, märkt "generiskt". Det ligger cirka 25 % över medel, så en egen EPD lönar sig.</li>
      </ol>
      <p class="sub">Klimatnivåerna följer Svensk Betongs vägledning för klimatförbättrad betong: nivå 1–4 är 10–40 % lägre klimatpåverkan än branschreferensen, nivå 5 är halverad.</p>
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
  <details><summary>Vem ansvarar för transporten?</summary><p>Köparen och fabriken, som i dag. Fabriken anger sin transportkostnad i svaret; lämnas den tom visas priset exklusive transport. Köparen ser km och transportens CO2 för varje svar.</p></details>
  <details><summary>Hur visas klimatpåverkan?</summary><p>Varje svar visar CO2 för element (ur fabrikens EPD), transport och totalt, fabrikens klimatnivå och om den har EPD, oavsett om köparen har ställt krav. Vid samma pris hamnar lägst CO2 totalt först. Köparen kan också ange lägsta klimatnivå och om EPD krävs.</p></details>
  <details><summary>Hur räknas avståndet?</summary><p>Som vägavstånd för lastbil mellan fabrikens adress och projektets adress, från en karttjänst. Saknas adressen räknas avståndet från orten.</p></details>
  <details><summary>Kan vi ladda upp ritningar?</summary><p>Uppladdning av ritningar och underlag kommer snart. Tills vidare skickar ni underlaget direkt till fabriken när ni har valt den.</p></details>
  <details><summary>Måste fabriken ha en EPD?</summary><p>Nej. Utan EPD används Boverkets generiska värde, som är satt cirka 25 % över medel. Med en egen EPD syns fabrikens verkliga, oftast lägre, klimatpåverkan, och köparen kan föra över siffran till sin klimatdeklaration.</p></details>
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
