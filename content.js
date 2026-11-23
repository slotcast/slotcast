// Texter för startsidan och integritetspolicyn (visas för utloggade besökare).

export const LANDING = `
<section class="hero"><div class="wrap hero-in">
  <div class="hero-txt">
    <p class="kick">Marknadsplatsen för betongelement</p>
    <h1 class="big">Betongelement nära ert projekt, från en fabrik som möter era miljökrav</h1>
    <p class="lead">Fler fabriker att välja bland. Få svar från prefabfabriker ni kanske aldrig har anlitat, eller inte har jobbat med på länge. Samma betong från en fabrik nära ger lägre kostnad och lägre utsläpp än från en fabrik långt bort. Har ni klimatkrav ser ni också fabrikens klimatnivå, EPD och elementens CO2 i varje svar.</p>
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
      <p>Då kan ni jämföra mer än priset. Förfrågan går till alla fabriker som tillverkar produkten. Varje svar visar avstånd till projektet, CO2 för element och transport, klimatnivå och EPD bredvid pris levererat. En fabrik nära projektet ger kortare transporter och lägre utsläpp och ofta också lägre pris. Ni väljer den som passar projektet bäst.</p>
      <button class="btn" data-reg="kopare">Begär offert</button>
    </div>
  </div>
</section>

<section class="wrap blk">
  <div class="pane dark">
    <p class="kick">För fabriker</p>
    <h3 class="h3">Fyll luckorna i produktionen med köpare ni inte når i dag</h3>
    <ul>
      <li>Fler order från ert närområde: förfrågningar på de produkter ni tillverkar, från byggföretag, stålhallsbyggare och andra fabriker</li>
      <li>Lägg in ledig kapacitet i m² och veckor; ingen produkt behövs, det avgör köparens förfrågan</li>
      <li>Ungefärligt svar först, fast offert när köparen har valt er</li>
      <li>Nästan ingen fabrik säljer på närhet i dag. Gör det med oss: köparen ser km och transportkostnad i varje svar</li>
      <li>Konkurrenter ser aldrig era svar eller priser</li>
      <li>Ingen provision; affären gör ni direkt med köparen</li>
      <li>Har ni EPD, ISO-certifiering eller fossilfria transporter syns det i svaren. Har ni det inte är ni ändå med, och <a href="#vagledning">vägledningen</a> visar hur ni kommer igång</li>
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
      <p>Betongelement är tunga. Samma betong från en fabrik nära ger lägre kostnad och lägre utsläpp än från en fabrik långt bort. Klimatkraven på stommen växer också, med klimatdeklaration vid bygglov, Miljöbyggnad och Svanen.</p>
      <p>Därför visar varje svar km, CO2 för element och transport, fabrikens klimatnivå och om den har en miljövarudeklaration (EPD). Lägst pris levererat kommer först; vid samma pris hamnar lägst klimatpåverkan först. Ställer ni klimatkrav hamnar svar som inte når kraven sist.</p>
      <p>För fabrikerna blir det marknadsföring av miljöinvesteringarna: klimatförbättrad betong, EPD, ISO-certifiering och fossilfria transporter syns där köparna jämför. Fabriker utan EPD visas med Boverkets generiska värde, så alla kan vara med.</p>
    </div>
    <div class="pane">
      <h3 class="h3">Så räknar Slotcast klimatpåverkan</h3>
      <ol>
        <li><b>Fabriken lägger in sin EPD</b> per produkt: klimatpåverkan för tillverkningen (A1–A3) i kg CO2e per ton, m³ eller m², registreringsnummer och länk.</li>
        <li><b>Slotcast räknar om</b> till hela ordern, med elementens tjocklek och vikt.</li>
        <li><b>Transporten läggs till</b> (A4) med vägavstånd och fabrikens fordon, diesel eller fossilfri transport (HVO100, biogas eller el), enligt Boverkets klimatdatabas. Köparen ser CO2 för element, transport och totalt.</li>
        <li><b>Utan EPD</b> används Boverkets generiska värde, märkt "generiskt". Det är typvärdet plus 25 %, så en egen EPD lönar sig. <a href="#vagledning">Så får ni en EPD.</a></li>
      </ol>
      <p class="sub">Klimatnivåerna följer Svensk Betongs vägledning för klimatförbättrad betong: nivå 1–4 är 10–40 % lägre klimatpåverkan än typvärdet, nivå 5 är halverad och nivå 6 är 60 % lägre. Slotcast räknar fram nivån ur fabrikens EPD.</p>
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
  <details><summary>Hur visas klimatpåverkan?</summary><p>Varje svar visar CO2 för element (ur fabrikens EPD, annars generiskt värde), transport och totalt, fabrikens klimatnivå och om den har EPD. Vid samma pris hamnar lägst CO2 totalt först. Köparen kan också ange lägsta klimatnivå och om EPD krävs; först då markeras svar som inte når kraven.</p></details>
  <details><summary>Hur räknas avståndet?</summary><p>Som vägavstånd för lastbil mellan fabrikens adress och projektets adress, från en karttjänst. Saknas adressen räknas avståndet från orten.</p></details>
  <details><summary>Kan vi ladda upp ritningar?</summary><p>Uppladdning av ritningar och underlag kommer snart. Tills vidare skickar ni underlaget direkt till fabriken när ni har valt den.</p></details>
  <details><summary>Måste fabriken ha en EPD?</summary><p>Nej. Utan EPD används Boverkets generiska värde, som är satt cirka 25 % över medel. Med en egen EPD syns fabrikens verkliga, oftast lägre, klimatpåverkan, och köparen kan föra över siffran till sin klimatdeklaration. <a href="#vagledning">Läs vägledningen.</a></p></details>
</section>

<footer class="foot"><div class="wrap foot-in">
  <div class="logo">slot<span>cast</span></div>
  <p><a href="mailto:filip@bjornstjerna.se">filip@bjornstjerna.se</a> · <a href="#vagledning">Vägledning klimatdata</a> · <a href="#integritet">Integritetspolicy</a></p>
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

<h2>Klimatuppgifter och beräkningar</h2>
<p>Klimatnivå, CO2 för element och transport och vägledningen bygger på fabrikernas egna uppgifter, Svensk Betongs typvärden och Boverkets generiska värden. Slotcast har inte kontrollerat uppgifterna och ansvarar inte för dem eller för beslut som fattas utifrån dem. Varje fabrik ansvarar för att de uppgifter den lägger in, till exempel EPD-värde och ISO-certifiering, stämmer. Se <a href="#vagledning">vägledningen</a>.</p>

<h2>Ändringar</h2>
<p>Ändrar vi policyn meddelar vi det i tjänsten och via mejl om ändringen är väsentlig.</p>
</div></div>
`;

export const GUIDE = `
<div class="wrap blk policy"><div class="card">
<p><a href="#">← Tillbaka</a></p>
<h1>Klimatdata för er fabrik – vägledning</h1>
<p class="lead2">Ni behöver ingen EPD för att vara med i Slotcast. Men med en egen EPD syns er verkliga klimatpåverkan, som nästan alltid är lägre än det generiska värdet. Så här kommer ni igång, i tre steg.</p>
<p class="sub">Vägledningen är allmän information. Slotcast ansvarar inte för siffrorna eller för hur ni tar fram er EPD; se friskrivningen längst ner.</p>

<h2>Steg 1: Ni är med direkt, med generiskt värde</h2>
<p>Lämnar ni klimatfälten tomma i profilen visar Slotcast Boverkets generiska värde för produkten. Det är typvärdet plus 25 %, alltså medvetet högt satt. Köparen ser "generiskt värde" i stället för en EPD. Ni förlorar inga förfrågningar på det: lägst pris levererat kommer först, och klimatet markeras bara när köparen själv har ställt krav.</p>

<h2>Steg 2: Ta fram en egen EPD</h2>
<ul>
<li><b>Vad det är:</b> en miljövarudeklaration enligt EN 15804, granskad av tredje part. Den visar klimatpåverkan för tillverkningen (A1–A3) i kg CO2e, oftast per ton element. Den gäller i fem år.</li>
<li><b>Enklaste vägen:</b> Svensk Betongs EPD-verktyg (IVL EPD-generator för betong), som medlemmar kan använda. Ni fyller i recept, energi och transporter av råvaror, och verktyget räknar. EPD:n publiceras hos EPD-Norge (EPD Global). Andra vägar är One Click LCA eller en konsult.</li>
<li><b>Vad ni behöver samla in:</b> recept per produkt (cement, tillsatsmaterial, ballast, armering, isolering), el och värme i fabriken under ett år, total produktion i ton och avstånd till era leverantörer.</li>
<li><b>Börja med er största produkt.</b> En EPD per produkttyp räcker, till exempel massiv vägg eller sandwichvägg.</li>
</ul>
<p>Lägg sedan in värdet, registreringsnumret och länken i profilen. Slotcast räknar fram er klimatnivå.</p>

<h2>Steg 3: Klimatförbättra betongen</h2>
<p>Det vanligaste sättet är att ersätta en del av cementen med slagg eller att byta till en cement med lägre klimatpåverkan. Varje steg om 10 % under typvärdet ger en nivå (nivå 1–6). Tänk på att mer slagg kan ge längre härdtid i formen.</p>

<h2>Standardmått: vad brukar en betong ha?</h2>
<p>Typvärdet är vad en vanlig betong av produkten brukar ha i klimatpåverkan för tillverkningen, enligt Svensk Betongs vägledning för klimatförbättrad betong (tabell 3, inomhus och balkonger utomhus). Jämför med er EPD.</p>
<div class="scroll"><table><thead><tr><th>Produkt</th><th class="num">Typvärde, kg CO2e/ton</th><th class="num">Generiskt (utan EPD)</th><th class="num">Nivå 1</th><th class="num">Nivå 4</th><th class="num">Nivå 5</th><th class="num">Nivå 6</th><th class="num">Typvärde, kg CO2e/m² (ungefär)</th></tr></thead><tbody>
<tr><td>Sandwichvägg</td><td class="num">235</td><td class="num">294</td><td class="num">211</td><td class="num">141</td><td class="num">117</td><td class="num">94</td><td class="num">130 (230 mm betong)</td></tr>
<tr><td>Massiv vägg</td><td class="num">155</td><td class="num">194</td><td class="num">139</td><td class="num">93</td><td class="num">77</td><td class="num">62</td><td class="num">74 (200 mm)</td></tr>
<tr><td>Sockel</td><td class="num">235</td><td class="num">294</td><td class="num">211</td><td class="num">141</td><td class="num">117</td><td class="num">94</td><td class="num">85 (150 mm betong)</td></tr>
<tr><td>Plattbärlag, filigran</td><td class="num">185</td><td class="num">231</td><td class="num">166</td><td class="num">111</td><td class="num">92</td><td class="num">74</td><td class="num">22 (50 mm)</td></tr>
<tr><td>Plattbärlag, massiv RD-platta</td><td class="num">185</td><td class="num">231</td><td class="num">166</td><td class="num">111</td><td class="num">92</td><td class="num">74</td><td class="num">89 (200 mm)</td></tr>
<tr><td>Håldäck</td><td class="num">135</td><td class="num">169</td><td class="num">121</td><td class="num">81</td><td class="num">67</td><td class="num">54</td><td class="num">42 (HD/F 200)</td></tr>
<tr><td>Balkong</td><td class="num">210</td><td class="num">263</td><td class="num">189</td><td class="num">126</td><td class="num">105</td><td class="num">84</td><td class="num">111 (220 mm)</td></tr>
<tr><td>Trappa</td><td class="num">210</td><td class="num">263</td><td class="num">189</td><td class="num">126</td><td class="num">105</td><td class="num">84</td><td class="num">–</td></tr>
</tbody></table></div>
<p class="sub">Värdena gäller tillverkningen (A1–A3) inklusive armering, ingjutningsgods och isolering. Nivåkolumnerna visar högsta värde för nivån (10, 40, 50 och 60 % under typvärdet). Massiv vägg motsvarar "Väggar (RV)" och sockel räknas som sandwichvägg. Per m² är ungefärligt, med 2,4 ton betong per m³.</p>

<h2>Mät alltid på samma sätt</h2>
<ul>
<li>Använd klimatpåverkan för tillverkningen, A1–A3, raden GWP-GHG (annars GWP-total).</li>
<li>Ange helst per ton, som EPD:erna gör. Slotcast räknar om till hela ordern.</li>
<li>Transporten (A4) räknar Slotcast själv, utifrån avstånd och om ni kör diesel eller fossilfri transport.</li>
</ul>

<h2>Certifiering</h2>
<p>Kryssa i profilen i om ni har ISO 9001 (kvalitet), ISO 14001 (miljö) eller ISO 45001 (arbetsmiljö). Det visas för köparen i era svar.</p>

<h2>Friskrivning</h2>
<p>Vägledningen är allmän information och ingen rådgivning. Typvärdena och de generiska värdena kommer från Svensk Betong och Boverket, och Slotcast har inte kontrollerat dem. Värdena per m² och klimatnivåerna är förenklade beräkningar och kan avvika från en verklig EPD.</p>
<p>Slotcast ansvarar inte för siffrorna, för hur ni tar fram en EPD eller för beslut som fattas utifrån vägledningen. Varje fabrik ansvarar själv för de uppgifter den lägger in, och klimatnivån Slotcast räknar fram gäller bara om EPD-värdet stämmer.</p>
<p>Kontrollera alltid aktuella värden i källorna och låt en EPD granskas av tredje part enligt EN 15804. För klimatdeklarationer gäller Boverkets regler.</p>

<p class="sub">Källor: <a href="https://www.svenskbetong.se/component/sbdocs/ladda-ner/60/vagledning-klimatforbattrad-betong-utgava-2" target="_blank" rel="noopener">Svensk Betong, Vägledning klimatförbättrad betong, utgåva 2</a> · <a href="https://www.boverket.se/sv/klimatdeklaration/klimatdatabas/" target="_blank" rel="noopener">Boverkets klimatdatabas</a>. Frågor: <a href="mailto:filip@bjornstjerna.se">filip@bjornstjerna.se</a></p>
</div></div>
`;
