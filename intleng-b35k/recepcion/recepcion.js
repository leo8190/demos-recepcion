/* R24-HUMANO-1018 */
/* R24-BRIEF-1018: avatar humano, botones rápidos, "que me llamen", aviso al equipo, sin "no tengo ese dato" */
/* Recepción 24 h · International Engines LLC (motores y transmisiones; 2 sedes: Phoenix y Avondale, AZ) — DEMO privada, bilingüe ES/EN.
   Sale de plantilla-widget/recepcion.base.js (reglas del brief 18/10 + R24-HUMANO), en la variante de talleres ES/EN en «usted» (Medina's Automotive).
   100% del lado del cliente: sin APIs, sin claves, sin envío de datos (la foto se muestra solo en este navegador).
   Respuestas sacadas solo de lo que publica internationalenginesllc.com (revisada el 20/10/2026): Home, Services, About, Contact, Gallery y FAQs.
   - Phoenix: 3925 W Indian School Rd, Phoenix, AZ 85019 · (602) 264-8341; Avondale: 1050 N Eliseo Felix Jr Way #105, Avondale, AZ 85323 · (623) 440-2482.
     Correo internationalengines@gmail.com. Formulario «Contact Us» («Our team responds within 1 business day»). Sin WhatsApp.
   - Horario (pie de todas sus páginas, el mismo para las 2 sedes): lunes a viernes 8 AM – 4 PM; sábado y domingo no publica horario (cerrado)
     (hora de Arizona, America/Phoenix, sin horario de verano).
   - Servicios: reconstrucción de motores (long block, alcance publicado en Services), reemplazo con motores usados, reconstruidos o reacondicionados,
     instalación (paquete: desmontaje e instalación, inspección de externos, líquidos y filtros), reconstrucción y reemplazo de transmisiones; motores de
     4 a 8 cilindros (algunos de 12), japoneses y estadounidenses y algunos europeos; instalan un motor que traiga el cliente después de inspeccionarlo.
     Garantía: motores hasta 3 años / 36,000 millas; transmisiones hasta 1 año / 12,000 millas (en instalaciones hechas por su taller; solo componentes
     internos). Inspección sin cargo; «Same-Day Estimates»; la mayoría de las reconstrucciones lleva 7–10 días hábiles (plazo estimado tras la inspección);
     cargo por núcleo si no es reconstruible (varía); financiamiento con Snap Finance (llamar); «Hablamos Español»; fundada en 2015, 30+ años de experiencia.
   Sin precios (la recepción no da ninguno, tampoco de las ofertas semanales ni del cargo por núcleo), sin WhatsApp; no promete grúa/remolque (solo lo
   anota como preferencia), frenos, aire acondicionado, mecánica general, condiciones de financiamiento, formas de pago ni nada que su web no liste. */
(function () {
  "use strict";
  var C = {
    nombre: "International Engines LLC", corto: "International Engines LLC",
    s1: { n: "Phoenix", dir: "3925 W Indian School Rd, Phoenix, AZ 85019", tel: "(602) 264-8341", telh: "+16022648341", maps: "https://www.google.com/maps/dir/?api=1&destination=International+Engines+LLC+3925+W+Indian+School+Rd+Phoenix+AZ+85019" },
    s2: { n: "Avondale", dir: "1050 N Eliseo Felix Jr Way #105, Avondale, AZ 85323", tel: "(623) 440-2482", telh: "+16234402482", maps: "https://www.google.com/maps/dir/?api=1&destination=International+Engines+LLC+1050+N+Eliseo+Felix+Jr+Way+105+Avondale+AZ+85323" }
  };
  C.tel = C.s1.tel; C.telh = C.s1.telh;
  var qlang = (location.search.match(/[?&]lang=(es|en)\b/) || [])[1];
  var lang = qlang || ((window.R24_LANG === "auto" ? ((navigator.language || "en").slice(0, 2) === "es" ? "es" : "en") : (window.R24_LANG || "es")).slice(0, 2) === "en" ? "en" : "es");
  function L(es, en) { return lang === "en" ? en : es; }
  // Horario publicado (minutos desde las 0:00, hora de Arizona): lunes a viernes 8:00 a 4:00 p. m.; sábado y domingo, cerrado.
  var LV = [[480, 960]];
  var H = { 1: LV, 2: LV, 3: LV, 4: LV, 5: LV, 6: [], 0: [] };
  var DIAS = { es: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"], en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] };
  var MESES = { es: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"], en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] };
  function horarioTxt() {
    return L("Horario que publica el taller, el mismo en las 2 sedes (hora de Arizona):\n• Lunes a viernes: 8:00 a.m. – 4:00 p.m.\n• Sábado y domingo: cerrado",
      "Shop hours, same at both locations (Arizona time):\n• Monday–Friday: 8:00 AM – 4:00 PM\n• Saturday and Sunday: closed");
  }
  var HCORTO = { es: "lunes a viernes de 8 a 4", en: "Mon–Fri 8–4" };
  function hc() { return HCORTO[lang]; }
  function nowTx() {
    var q = (location.search.match(/[?&]r24now=([^&]+)/) || [])[1];
    if (q) { var p = decodeURIComponent(q).match(/(\d+)-(\d+)-(\d+)T(\d+):(\d+)/);
      if (p) return { y: +p[1], m: +p[2] - 1, d: +p[3], dow: new Date(+p[1], +p[2] - 1, +p[3]).getDay(), min: +p[4] * 60 + +p[5] }; }
    var f = new Intl.DateTimeFormat("en-GB", { timeZone: "America/Phoenix", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false });
    var o = {}; f.formatToParts(new Date()).forEach(function (x) { o[x.type] = x.value; });
    var y = +o.year, m = +o.month - 1, d = +o.day;
    return { y: y, m: m, d: d, dow: new Date(y, m, d).getDay(), min: (+o.hour % 24) * 60 + +o.minute };
  }
  function hm(min) { var h = Math.floor(min / 60), mm = ("0" + (min % 60)).slice(-2), pm = h >= 12; h = h % 12 || 12; return h + ":" + mm + " " + (lang === "en" ? (pm ? "PM" : "AM") : (pm ? "p.m." : "a.m.")); }
  function isOpen(n) { return (H[n.dow] || []).some(function (r) { return n.min >= r[0] && n.min < r[1]; }); }
  function closeAt(n) { var r = (H[n.dow] || []).filter(function (r) { return n.min >= r[0] && n.min < r[1]; })[0]; return r ? r[1] : 0; }
  function nextOpening(n) {
    for (var i = 0; i < 8; i++) {
      var dt = new Date(n.y, n.m, n.d + i), dow = dt.getDay(), rs = H[dow] || [];
      for (var j = 0; j < rs.length; j++) if (i > 0 || rs[j][0] > n.min)
        return lang === "en" ? (i === 0 ? "today" : (i === 1 ? "tomorrow (" + DIAS.en[dow] + ")" : DIAS.en[dow])) + " at " + hm(rs[j][0])
          : (i === 0 ? "hoy" : (i === 1 ? "mañana " + DIAS.es[dow] : "el " + DIAS.es[dow])) + " a las " + hm(rs[j][0]);
    }
    return "";
  }
  function dayLabel(dt) { var dn = DIAS[lang][dt.getDay()]; return lang === "en" ? dn + ", " + MESES.en[dt.getMonth()] + " " + dt.getDate() : dn.charAt(0).toUpperCase() + dn.slice(1) + " " + dt.getDate() + " " + MESES.es[dt.getMonth()]; }
  function nextWorkdays(n, k) {
    var out = [];
    if ((H[n.dow] || []).some(function (r) { return n.min < r[0] || (n.min >= r[0] && r[1] - n.min >= 90); })) out.push({ dow: n.dow, label: L("Hoy", "Today") });
    for (var i = 1; out.length < k && i < 14; i++) {
      var dt = new Date(n.y, n.m, n.d + i), dow = dt.getDay();
      if ((H[dow] || []).length) out.push({ dow: dow, label: dayLabel(dt) });
    }
    return out;
  }

  var STOP = ("a al algo algun alguna como con cual de del el en es esta este esto estoy hay la las lo los me mi mis o para pero por que quiero se si sin su sus te tu un una uno unos y ya yo usted ustedes tienen tiene puedo podria saber gustaria hola buenas buenos dias tardes noches favor le les " +
    "the a an and or to of in on for my me i is are do does you your can could would like want please hi hello hey there it its at with what how which have has get need").split(" ");
  function norm(s) { return (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9ñ$\/\s]/g, " ").replace(/\s+/g, " ").trim(); }
  function stem(w) { if (w.length > 4) w = w.replace(/(es|s)$/, ""); return w; }
  function toks(s) { return norm(s).replace(/\//g, " ").split(" ").filter(function (w) { return w && STOP.indexOf(w) < 0; }).map(stem); }
  function lev(a, b) {
    if (Math.abs(a.length - b.length) > 2) return 9;
    var dp = []; for (var i = 0; i <= a.length; i++) { dp[i] = [i]; }
    for (var j = 1; j <= b.length; j++) dp[0][j] = j;
    for (i = 1; i <= a.length; i++) for (j = 1; j <= b.length; j++)
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return dp[a.length][b.length];
  }
  function tokMatch(k, u) {
    if (k === u) return true;
    if (k.length >= 5 && u.length >= 5 && (u.indexOf(k.slice(0, 5)) === 0 || k.indexOf(u.slice(0, 5)) === 0)) return true;
    if (k.length >= 5) return lev(k, u) <= (k.length >= 8 ? 2 : 1);
    return false;
  }
  function phraseScore(ph, ut) {
    var pt = toks(ph); if (!pt.length) return 0; var sc = 0;
    for (var i = 0; i < pt.length; i++) {
      if (ut.indexOf(pt[i]) >= 0) { sc += 1; continue; }
      if (!ut.some(function (u) { return tokMatch(pt[i], u); })) return 0;
      sc += 0.7;
    }
    return sc;
  }



  var CITA_CHIP = { a: "cita", get t() { return L("🔧 Presupuesto de motor o transmisión", "🔧 Engine or transmission quote"); } };
  var LLAMADA_CHIP = { a: "llamada", get t() { return L("📲 Que me llamen o escriban", "📲 Call or text me back"); } };
  function aviso() { return L("🔔 El taller recibe este pedido al instante (en esta demo no se envía nada).", "🔔 The shop gets this request instantly (nothing is sent in this demo)."); }
  var lastQ = "";
  function TEL1() { return { t: L("Llamar a Phoenix", "Call Phoenix"), tel: C.s1.telh }; }
  function TEL2() { return { t: L("Llamar a Avondale", "Call Avondale"), tel: C.s2.telh }; }
  function MAPS1() { return { t: L("📍 Cómo llegar a Phoenix", "📍 Directions to Phoenix"), url: C.s1.maps }; }
  function MAPS2() { return { t: L("📍 Cómo llegar a Avondale", "📍 Directions to Avondale"), url: C.s2.maps }; }
  function PAGE(es, en, f) { return function () { return { t: L(es, en), url: (lang === "es" ? "es-" : "") + f, self: true }; }; }
  var SERVP = PAGE("Ver la página de servicios", "See the services page", "services.html");
  var FAQP = PAGE("Ver las preguntas frecuentes", "See the FAQs", "faqs.html");
  function Q(es, en, qes, qen) { return { get t() { return L(es, en); }, get q() { return L(qes || es, qen || en); } }; }
  var SVC = Q("🛠️ Servicios y garantía", "🛠️ Services & warranty", "servicios", "services");
  var HOR = Q("🕐 Horario y sedes", "🕐 Hours & locations", "horario y sedes", "hours and locations");
  var PARADO = Q("🚗 Mi motor falló / no anda", "🚗 My engine failed / won't run", "mi motor fallo no anda", "my engine failed won't run");
  function telsTxt() { return "Phoenix: " + C.s1.tel + " · Avondale: " + C.s2.tel; }
  function dirA() { return L("Tienen 2 sedes:\n📍 Phoenix: " + C.s1.dir + " · 📞 " + C.s1.tel + "\n📍 Avondale: " + C.s2.dir + " · 📞 " + C.s2.tel + "\nLas dos tienen el mismo horario.",
    "They have 2 locations:\n📍 Phoenix: " + C.s1.dir + " · 📞 " + C.s1.tel + "\n📍 Avondale: " + C.s2.dir + " · 📞 " + C.s2.tel + "\nBoth keep the same hours."); }
  function horarioA() {
    var n = nowTx(), fin = n.dow === 6 || n.dow === 0, s = isOpen(n) ? L("🟢 Ahora están abiertos, hasta las " + hm(closeAt(n)) + ".", "🟢 They're open now, until " + hm(closeAt(n)) + ".")
      : L("🌙 Ahora está cerrado" + (fin ? " (fin de semana)" : "") + "; abre " + nextOpening(n) + ". Igual le tomo el pedido ahora y el taller lo recibe al instante.", "🌙 It's closed right now" + (fin ? " (weekend)" : "") + "; opens " + nextOpening(n) + ". I can still take your request now and the shop gets it instantly.");
    return horarioTxt() + "\n" + s;
  }
  function serviciosA() {
    return L("Lo que publica el taller (más de 30 años con motores y transmisiones, 2 sedes):\n• Reconstrucción de motores (long block: desarmado, maquinado, piezas internas de desgaste nuevas y servicio completo de culata)\n• Reemplazo de motor: usados (probados), reconstruidos o reacondicionados, instalados y probados\n• Paquete de instalación: desmontaje e instalación, inspección de externos, líquidos y filtros\n• Reconstrucción y reemplazo de transmisiones (reconstruidas o usadas, instaladas y probadas)\n• Motores japoneses y estadounidenses (y algunos europeos), de 4 a 8 cilindros y algunos de 12\n• Garantía: motores hasta 3 años / 36,000 millas; transmisiones hasta 1 año / 12,000 millas\n¿Qué le pasa a su vehículo?",
      "What the shop lists (30+ years with engines and transmissions, 2 locations):\n• Engine rebuilds (long block: teardown, machining, new wear-related internal parts and full cylinder head service)\n• Engine replacement: used (tested), rebuilt or reconditioned, installed and tested\n• Installation package: removal and installation, external parts inspection, fluids and filters\n• Transmission rebuild & replacement (rebuilt or used, installed and tested)\n• Japanese and domestic engines (and some European), 4 to 8 cylinders and select 12-cylinder\n• Warranty: engines up to 3 years / 36,000 miles; transmissions up to 1 year / 12,000 miles\nWhat's going on with your vehicle?");
  }
  function noListA() {
    return L("Eso no aparece entre los servicios de su web (se dedican a motores y transmisiones), así que no se lo voy a asegurar. Llame al taller (" + telsTxt() + "; " + hc() + "), o déjeme su teléfono y le contactan ellos.",
      "That isn't among the services on their website (they focus on engines and transmissions), so I won't promise it. Call the shop (" + telsTxt() + "; " + hc() + "), or leave your number and they'll get back to you.");
  }
  function noPubA() {
    return L("Eso su web no lo dice, así que no se lo voy a inventar: se lo confirma el taller. Llame al " + C.s1.tel + " (Phoenix) o al " + C.s2.tel + " (Avondale), " + hc() + ", o déjeme su teléfono y le contactan ellos.",
      "Their site doesn't say, so I won't make it up: the shop will confirm. Call " + C.s1.tel + " (Phoenix) or " + C.s2.tel + " (Avondale), " + hc() + ", or leave your number and they'll get back to you.");
  }
  function S(es, en) { return function () { return L(es, en); }; }
  var KB = [
    { id: "reconstruccion", k: ["reconstruccion", "reconstruir", "reconstruido", "rectificar", "rectificacion", "armar el motor", "ajuste de motor", "long block", "culata", "cabeza", "anillos", "rebuild", "rebuilt", "rebuilding", "machining", "cylinder head", "head gasket", "piston rings", "overhaul"],
      a: S("Sí: es su especialidad. Su web explica que en la reconstrucción el long block se desarma por completo, se limpia, se inspecciona, se maquina si hace falta y se arma con piezas internas de desgaste nuevas (anillos, cojinetes, juntas y retenes), con servicio completo de la culata. Lo que no se cambia automáticamente (pistones, bielas, camisas, culata) lo revisan con usted antes de seguir. La mayoría está lista en 7 a 10 días hábiles; el plazo estimado se lo dan después de la inspección. ¿Le dejo pedido el presupuesto?",
        "Yes: it's their specialty. Their site explains that in a rebuild the long block is fully torn down, cleaned, inspected, machined as needed and reassembled with new wear-related internal parts (rings, bearings, gaskets and seals), with full cylinder head service. Anything not replaced automatically (pistons, rods, sleeves, heads) they review with you before moving forward. Most rebuilds are ready in 7–10 business days; they give you the estimated timeline after inspection. Want me to request a quote?"), c: [CITA_CHIP, SERVP, LLAMADA_CHIP] },
    { id: "transmision", k: ["transmision", "caja", "caja de cambios", "patina", "patinando", "no cambia", "no hace los cambios", "cambios duros", "automatica", "transmission", "slipping", "not shifting", "won t shift", "hard shifting", "gearbox"],
      a: S("Sí: reconstruyen y reemplazan transmisiones. Su web dice que trabajan con transmisiones reconstruidas o usadas, instaladas y probadas, con garantía de hasta 1 año / 12,000 millas (en instalaciones hechas por su taller). Si patina o no cambia, primero lo inspeccionan sin cargo para ver la causa real. ¿Le dejo pedido el presupuesto?",
        "Yes: they rebuild and replace transmissions. Their site says they offer rebuilt or used transmissions, installed and tested, with a warranty of up to 1 year / 12,000 miles (on installs done by their shop). If it's slipping or not shifting, they first inspect it at no charge to find the real cause. Want me to request a quote?"), c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "reemplazo", k: ["reemplazo", "reemplazar", "cambiar el motor", "cambio de motor", "motor usado", "motores usados", "motor nuevo", "reacondicionado", "remanufacturado", "replacement", "replace my engine", "used engine", "used engines", "swap", "engine swap", "reconditioned", "remanufactured"],
      a: S("Sí: reemplazo de motor. Su web ofrece motores usados (probados, la opción económica), reconstruidos (la más elegida) y reacondicionados, instalados y probados. Qué le conviene, reconstruir o reemplazar, se lo recomiendan después de inspeccionarlo sin cargo. ¿Le dejo pedido el presupuesto?",
        "Yes: engine replacement. Their site offers used engines (quality-tested, the budget option), rebuilt engines (the most popular) and reconditioned engines, installed and tested. Whether to rebuild or replace, they recommend after a free inspection. Want me to request a quote?"), c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "sintoma", k: ["golpetea", "golpeteo", "cascabelea", "suena el motor", "ruido en el motor", "se recalienta", "recalentamiento", "sobrecalienta", "quema aceite", "humo", "humo blanco", "humo azul", "pierde refrigerante", "baja compresion", "se fundio", "fundido", "desvielado", "se trabo", "knocking", "knock", "overheating", "overheat", "burning oil", "smoke", "coolant", "low compression", "seized", "blown engine", "engine noise"],
      a: S("Eso es justo lo que su web describe: si el motor golpetea, se recalienta, quema aceite o refrigerante, tiene baja compresión o una falla interna, lo inspeccionan sin cargo para encontrar la causa real y le recomiendan si conviene reconstruirlo o reemplazarlo. ¿Le dejo pedido el presupuesto con su vehículo y lo que le pasa?",
        "That's exactly what their site describes: if the engine is knocking, overheating, burning oil or coolant, has low compression or an internal failure, they inspect it at no charge to find the real cause and recommend whether to rebuild or replace. Want me to request a quote with your vehicle and the symptom?"), c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "instalacion", k: ["instalacion", "instalar", "instalan", "desmontaje", "montaje", "paquete de instalacion", "mi propio motor", "traer mi motor", "traigo el motor", "conseguí un motor", "install", "installation", "installed", "removal", "r r", "my own engine", "bring my engine", "customer supplied"],
      a: S("Sí: su web ofrece el paquete de instalación (desmontaje del motor viejo e instalación, inspección de las piezas externas, líquidos y filtros), con la garantía de 3 años / 36,000 millas en los motores que instalan. También pueden instalar un motor que traiga usted, después de inspeccionarlo; la garantía en ese caso depende del estado de ese motor (y no lo recomiendan a efectos de garantía). ¿Le dejo pedido el presupuesto?",
        "Yes: their site offers an installation package (removal of the old engine and installation, external parts inspection, fluids and filters), with the 3-year / 36,000-mile warranty on engines they install. They can also install an engine you bring, after inspecting it; warranty in that case depends on that engine's condition (and they don't recommend it for warranty purposes). Want me to request a quote?"), c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "marcas", k: ["marca", "marcas", "japones", "japoneses", "honda", "toyota", "nissan", "ford", "chevy", "chevrolet", "dodge", "europeo", "europeos", "v6", "v8", "4 cilindros", "8 cilindros", "12 cilindros", "diesel", "make", "brand", "japanese", "domestic", "european", "cylinder"],
      a: S("Su web dice que trabajan «de Honda a Ford»: motores y transmisiones japoneses y estadounidenses, de 4 a 8 cilindros, algunas aplicaciones de 12 cilindros y algunos modelos europeos. Si el suyo es otro caso, se lo confirma el taller con el año, la marca, el modelo y el motor. ¿Le dejo pedido el presupuesto?",
        "Their site says they work \"from Honda to Ford\": Japanese and domestic engines and transmissions, 4 to 8 cylinders, select 12-cylinder applications and some European models. For anything else, the shop confirms with the year, make, model and engine size. Want me to request a quote?"), c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "nomaneja", k: ["no arranca", "no prende", "no enciende", "no anda", "varado", "varada", "me quede", "se apago", "emergencia", "urgente", "grua", "remolque", "remolcar", "won t start", "wont start", "not running", "stranded", "broke down", "emergency", "urgent", "tow", "towing", "tow truck"],
      a: function () { var n = nowTx(); return L("Lo siento. Su web no publica servicio de grúa ni de remolque, así que no se lo voy a prometer. Lo que sí hago: le dejo el pedido con el vehículo marcado como parado y su preferencia de remolque anotada, y el taller le dice cómo llevarlo y le llama o le escribe." + (isOpen(n) ? " Ahora están abiertos: también puede llamar (" + telsTxt() + ")." : " Ahora está cerrado (abre " + nextOpening(n) + "); su pedido le llega igual al instante."),
        "Sorry to hear that. Their site doesn't list towing, so I won't promise it. What I can do: log your request with the vehicle marked as down and your towing preference noted, and the shop tells you how to get it there and calls or texts you back." + (isOpen(n) ? " They're open now: you can also call (" + telsTxt() + ")." : " It's closed now (opens " + nextOpening(n) + "); your request still reaches them instantly.")); }, c: [CITA_CHIP, LLAMADA_CHIP, TEL1, TEL2] },
    { id: "nolist", k: ["frenos", "freno", "balatas", "aire acondicionado", "a c", "clima", "suspension", "amortiguadores", "alineacion", "llantas", "llanta", "cambio de aceite", "afinacion", "carroceria", "hojalateria", "pintura", "choque", "smog", "emisiones", "electrico", "alternador", "bateria", "brakes", "brake", "air conditioning", "suspension", "alignment", "tires", "oil change", "tune up", "body work", "paint", "collision", "emissions", "electrical", "alternator", "battery"], a: noListA, c: [TEL1, TEL2, LLAMADA_CHIP] },
    { id: "servicios", k: ["servicios", "que hacen", "que reparan", "que arreglan", "trabajos", "mecanica", "mecanico", "taller", "motores", "services", "what do you fix", "what do you do", "repairs", "mechanic", "engines"], a: serviciosA, c: [CITA_CHIP, SERVP, LLAMADA_CHIP] },
    { id: "precio", k: ["precio", "precios", "cuanto cuesta", "cuanto sale", "cuanto cobran", "costo", "caro", "barato", "descuento", "oferta", "ofertas", "especiales", "price", "prices", "how much", "cost", "cheap", "rates", "discount", "specials", "deal"],
      a: S("Los precios se los da el taller: esta recepción no da precios ni los inventa. Su web dice que dan presupuestos en el mismo día («Same-Day Estimates»), con precios claros y por adelantado, que la inspección es sin cargo y que las ofertas semanales de motores se consultan por teléfono. Lo que puedo hacer: dejarle pedido el presupuesto con su vehículo, el motor y lo que le pasa, y le contactan.",
        "Pricing comes from the shop: this front desk doesn't quote or make up prices. Their site mentions same-day estimates with transparent, upfront pricing, free inspections, and weekly engine specials you ask about by phone. What I can do: request the quote with your vehicle, engine and symptom, and they'll get back to you."), c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "garantia", k: ["garantia", "garantias", "garantizado", "cuanto dura la garantia", "millas", "warranty", "warranties", "guarantee", "miles"],
      a: S("Lo que publica su web: motores, hasta 3 años / 36,000 millas; transmisiones, hasta 1 año / 12,000 millas. La garantía aplica a las instalaciones hechas por su taller, cubre solo los componentes internos y requiere una instalación y un asentamiento correctos; los accesorios externos no entran salvo que se indique. Los detalles de su caso se los confirma el taller.",
        "What their site publishes: engines, up to 3 years / 36,000 miles; transmissions, up to 1 year / 12,000 miles. It applies to installs done by their shop, covers internal components only and requires proper installation and break-in; external accessories aren't covered unless noted. The shop confirms the details for your case."), c: [CITA_CHIP, FAQP, LLAMADA_CHIP] },
    { id: "tiempo", k: ["cuanto tarda", "cuanto tiempo", "cuantos dias", "demora", "para cuando", "rapido", "mismo dia", "how long", "turnaround", "how many days", "same day", "how soon"],
      a: S("Su web dice que la mayoría de las reconstrucciones lleva de 7 a 10 días hábiles, según la disponibilidad de piezas, el resultado de la inspección y la carga de trabajo, y que el plazo estimado se lo dan después de inspeccionarlo. También dice que dan presupuestos en el mismo día. ¿Le dejo pedido el presupuesto?",
        "Their site says most rebuilds take 7–10 business days, depending on parts availability, inspection results and workload, and that they give you an estimated timeline after inspection. It also mentions same-day estimates. Want me to request a quote?"), c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "inspeccion", k: ["inspeccion", "revision", "revisar", "diagnostico", "cobran por revisar", "es gratis", "gratis", "sin cargo", "inspection", "diagnostic", "diagnostics", "free", "check it"],
      a: S("Su web dice que antes de empezar inspeccionan el vehículo sin cargo para encontrar la causa real de la falla y le explican qué hay que reparar y qué es opcional, con un presupuesto claro. Ya desarmado el motor, le llaman con el informe (si el núcleo se puede reconstruir, qué piezas externas están mal y su aprobación antes de instalar nada). ¿Le dejo pedida la revisión?",
        "Their site says they inspect your vehicle at no charge before starting, to find the real cause of the failure, and explain what needs repair and what's optional, with a clear estimate. After teardown they call you with the engine report (whether the core is rebuildable, which external parts are bad, and your approval before anything is installed). Want me to request the inspection?"), c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "nucleo", k: ["nucleo", "core", "core charge", "cargo por nucleo", "motor viejo", "core fee", "old engine"],
      a: S("Su web explica que el núcleo es su motor viejo: si se puede reconstruir (sin bloque ni culatas rajados, sin faltantes importantes ni daño interno grave), se usa para la reconstrucción; si no, se aplica un cargo por núcleo que varía según el tipo de motor y la disponibilidad, y le avisan apenas lo inspeccionan. El monto no lo publica: se lo da el taller.",
        "Their site explains the core is your old engine: if it's rebuildable (no cracked block or heads, no major missing parts or severe internal damage) it's used for the rebuild; if not, a core charge applies that varies with engine type and availability, and they tell you as soon as they inspect it. The amount isn't published: the shop gives it to you."), c: [CITA_CHIP, FAQP, LLAMADA_CHIP] },
    { id: "financiamiento", k: ["financiamiento", "financiar", "financing", "finance", "a plazos", "plan de pagos", "cuotas", "credito", "snap", "payment plan", "credit"],
      a: S("Su web dice que ofrecen financiamiento con Snap Finance (aprobación rápida, opciones con poco o sin historial de crédito y planes de pago flexibles) y que hay que llamarles para que le manden la solicitud. Las condiciones no las publica, así que no se las voy a inventar: se las confirma el taller.",
        "Their site says they offer financing through Snap Finance (fast approval, no or limited credit options, flexible payment plans) and that you call them to get the application. The terms aren't published, so I won't make them up: the shop will confirm."), c: [TEL1, TEL2, LLAMADA_CHIP] },
    { id: "nopub", k: ["zelle", "efectivo", "tarjeta", "formas de pago", "como pago", "carro de cortesia", "auto de reemplazo", "sabado", "domingo abierto", "cash", "card", "payment", "loaner", "rental car"], a: noPubA, c: [TEL1, TEL2, LLAMADA_CHIP] },
    { id: "walkin", k: ["sin cita", "walk in", "walk-in", "puedo ir", "puedo llegar", "llegar sin avisar", "necesito cita", "dejar el carro", "without appointment", "drop by", "stop by", "drop off", "need an appointment"],
      a: S("Su web no dice si atienden sin cita; lo que publica son los teléfonos de las 2 sedes, el formulario «Contáctenos» y el horario (lunes a viernes de 8 a 4). Para no ir en balde, le dejo aquí pedido el presupuesto y el taller le confirma, o llame (" + telsTxt() + ").",
        "Their site doesn't say whether they take walk-ins; it lists both shops' phone numbers, the \"Contact Us\" form and the hours (Mon–Fri 8–4). To be safe, I can request the quote here and the shop confirms, or call (" + telsTxt() + ")."), c: [CITA_CHIP, TEL1, TEL2] },
    { id: "idioma", k: ["espanol", "hablan espanol", "ingles", "spanish", "english", "speak spanish", "bilingue", "bilingual", "se habla", "hablamos"],
      a: S("Sí: su web dice «Hablamos Español» (en Nosotros y en las preguntas frecuentes) y que con gusto atienden a clientes de habla hispana. Aquí también le atiendo en los dos idiomas (botón EN arriba).", "Yes: their site says \"Hablamos Español\" (on About and in the FAQs) and that they proudly assist Spanish-speaking customers. I can help you in English or Spanish too (ES button at the top)."), c: [CITA_CHIP] },
    { id: "historia", k: ["dueno", "quien", "quienes son", "experiencia", "historia", "confianza", "desde cuando", "cuantos anos", "bbb", "owner", "who", "experience", "trust", "since when", "how long have you"],
      a: S("International Engines LLC se fundó en 2015 sobre más de 30 años de experiencia en motores y transmisiones: su web cuenta que antes vendían e instalaban motores japoneses y estadounidenses en California, que abrieron su propio taller para atender Phoenix, Avondale y alrededores, y que han vendido e instalado miles de motores y transmisiones, a particulares y a talleres.",
        "International Engines LLC was founded in 2015 on 30+ years of engine and transmission experience: their site says they sold and installed Japanese and domestic powertrains in California before opening their own facility for Phoenix, Avondale and nearby areas, and that they've sold and installed thousands of engines and transmissions, to drivers and repair shops alike."), c: [CITA_CHIP, PAGE("Ver «Nosotros»", "See \"About\"", "about-1.html")] },
    { id: "horario", k: ["horario", "horas", "abren", "abierto", "cierran", "a que hora", "fin de semana", "lunes", "hoy abren", "hours", "open", "close", "closing", "saturday", "sunday", "weekend"], a: horarioA, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "direccion", k: ["donde", "direccion", "direcciones", "ubicacion", "ubicados", "como llego", "llegar", "sede", "sedes", "sucursal", "indian school", "eliseo felix", "cual queda mas cerca", "address", "location", "locations", "where", "directions", "located", "closest"],
      a: function () { return dirA() + L("\nSi quiere, le dejo pedido el presupuesto en la que le quede mejor y el taller le confirma.", "\nI can request the quote at whichever is better for you and the shop confirms."); }, c: [MAPS1, MAPS2, CITA_CHIP] },
    { id: "contacto", k: ["telefono", "telefonos", "numero", "llamar", "contacto", "correo", "email", "mail", "whatsapp", "wasap", "watsap", "texto", "mensaje de texto", "sms", "formulario", "phone", "number", "call", "text", "contact", "form"],
      a: S("Canales que publica el taller:\n📞 Phoenix: " + C.s1.tel + " · Avondale: " + C.s2.tel + " (lunes a viernes de 8:00 a.m. a 4:00 p.m.)\n✉️ Correo: internationalengines@gmail.com\n📝 El formulario «Contáctenos» (su web dice que responden en un plazo de 1 día hábil)\nNo publican WhatsApp. O deje aquí su teléfono y le contactan ellos, por llamada o por texto.",
        "Channels the shop publishes:\n📞 Phoenix: " + C.s1.tel + " · Avondale: " + C.s2.tel + " (Mon–Fri 8:00 AM – 4:00 PM)\n✉️ Email: internationalengines@gmail.com\n📝 The \"Contact Us\" form (their site says they respond within 1 business day)\nThey don't list WhatsApp. Or leave your number here and they'll reach out, by call or text."), c: [TEL1, TEL2, LLAMADA_CHIP] },
    { id: "gracias", k: ["gracias", "muchas gracias", "perfecto", "adios", "thanks", "thank you", "bye", "great"], a: S("¡Con gusto! Si necesita algo más, aquí estoy. 🔧", "You're welcome! I'm here if you need anything else. 🔧"), c: [CITA_CHIP] }
  ];
  var CITA_K = ["cita", "presupuesto", "cotizacion", "cotizar", "estimado", "estimacion", "agendar", "reservar", "turno", "programar", "llevar el carro", "llevar mi carro", "llevar la camioneta", "llevar mi camioneta", "appointment", "estimate", "quote", "book", "schedule", "bring my car", "bring my truck"];
  function bestIntent(text) {
    var ut = toks(text), best = null, bs = 0;
    if (!ut.length) return null;
    KB.forEach(function (e) {
      var s = 0; e.k.forEach(function (ph) { s = Math.max(s, phraseScore(ph, ut)); });
      if (s > bs) { bs = s; best = e; }
    });
    return bs > 0 ? { e: best, s: bs } : null;
  }
  function isPriceQ(n) { return /\b(precio|precios|cuesta|cuestan|cuanto sale|cuanto cobran|costo|caro|barato|tarifa|price|prices|how much|cost|cheap|cheaper|rates|\$)\b/.test(n); }
  function isWalkinQ(n) { return /\b(walk ?in|sin cita|necesito (una )?cita|hace falta (una )?cita|tengo que (hacer|sacar) cita|need an appointment|appointment needed|no appointment)\b/.test(n); }
  function wantsCita(n) { var ut = toks(n); return CITA_K.some(function (ph) { var pt = toks(ph); return pt.length && pt.every(function (k) { return ut.indexOf(k) >= 0 || (k.length >= 5 && ut.some(function (u) { return u.length >= 5 && u.slice(0, 5) === k.slice(0, 5); })); }); }); }
  function looksEnglish(n) { var w = n.split(" "), en = ["the", "my", "is", "do", "you", "what", "how", "car", "truck", "are", "your", "can", "open", "hours", "much", "need", "want", "when", "where", "does", "have", "i", "not", "won", "start", "engine"]; var c = w.filter(function (x) { return en.indexOf(x) >= 0; }).length; return c >= 2 && !/[ñ]|\b(el|la|los|mi|que|como|cuanto|tienen|hacen|carro|auto|camioneta|motor)\b/.test(n); }
  function looksSpanish(n) { return /\b(hola|cuanto|tienen|hacen|ustedes|carro|camioneta|troca|precio|horario|donde|necesito|quiero|mi carro|mi camioneta|gracias|cual|motor|transmision|garantia|arranca)\b/.test(n); }
  function byId(id) { return KB.filter(function (e) { return e.id === id; })[0]; }

  var body, input, status, panel, launch, fileIn, opened = false;
  var flow = null;
  function el(tag, cls, html) { var x = document.createElement(tag); if (cls) x.className = cls; if (html != null) x.innerHTML = html; return x; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function linkify(s) { return esc(s).replace(/\(602\) 264-8341/g, '<a href="tel:+16022648341">(602) 264-8341</a>').replace(/\(623\) 440-2482/g, '<a href="tel:+16234402482">(623) 440-2482</a>').replace(/internationalengines@gmail\.com/g, '<a href="mailto:internationalengines@gmail.com">internationalengines@gmail.com</a>'); }
  function scroll() { body.scrollTop = body.scrollHeight; }
  function addUser(t) { var m = el("div", "r24-msg r24-user"); m.textContent = t; body.appendChild(m); scroll(); }
  function addBot(t, chips, cls) {
    t = String(t).replace(/([ap]\. ?m\.)\.(?=\s|$|\))/g, "$1");   // «8:00 a.m..» -> «8:00 a.m.»
    var ty = el("div", "r24-typing", L("Escribiendo…", "Typing…")); body.appendChild(ty); scroll();
    chips = chips || [];
    setTimeout(function () {
      ty.remove();
      var m = el("div", "r24-msg r24-bot" + (cls ? " " + cls : ""), linkify(t));
      body.appendChild(m);
      if (chips.length) {
        var w = el("div", "r24-chips");
        chips.forEach(function (c) {
          if (typeof c === "function") c = c();
          var b;
          if (c.tel) { b = el("a", "r24-chip" + (c.cls ? " " + c.cls : ""), "📞 " + esc(c.t)); b.href = "tel:" + c.tel; }
          else if (c.url) { b = el("a", "r24-chip", esc(c.t)); b.href = c.url; if (!c.self) { b.target = "_blank"; b.rel = "noopener"; } }
          else { var tt = c.t; b = el("button", "r24-chip", esc(tt)); b.type = "button"; b.onclick = function () { if (c.foto) { fileIn.click(); return; } w.remove(); handle(c.v || c.q || tt, c, tt); }; }
          w.appendChild(b);
        });
        body.appendChild(w);
      }
      scroll();
    }, 380);
  }
  function statusText() {
    var n = nowTx();
    if (isOpen(n)) { status.className = "r24-status"; status.textContent = L("🟢 Abierto ahora · hasta las " + hm(closeAt(n)) + " · " + C.s1.tel + " / " + C.s2.tel, "🟢 Open now · until " + hm(closeAt(n)) + " · " + C.s1.tel + " / " + C.s2.tel); }
    else { status.className = "r24-status r24-closed"; status.textContent = L("🌙 Fuera de horario (abre " + nextOpening(n) + ") · le atiendo igual y el taller recibe su pedido", "🌙 After hours (opens " + nextOpening(n) + ") · I'll still take your request"); }
  }
  function menuChips() { return [CITA_CHIP, PARADO, SVC, HOR, LLAMADA_CHIP]; }
  var banner;
  function headTexts() {
    panel.querySelector(".r24-ht b").innerHTML = L("Recepción 24 h", "24/7 Front Desk") + ' <span class="r24-online">● ' + L("en línea", "online") + "</span>";
    panel.querySelector(".r24-ht small").textContent = C.corto + " · Phoenix / Avondale, AZ";
    panel.querySelector(".r24-in").placeholder = L("Escriba su pregunta…", "Type your question…");
    panel.querySelector(".r24-send").textContent = L("Enviar", "Send");
    panel.querySelector(".r24-lang").textContent = lang === "en" ? "ES" : "EN";
    panel.querySelector(".r24-lang").setAttribute("aria-label", lang === "en" ? "Cambiar a español" : "Switch to English");
    panel.querySelector(".r24-legal").textContent = L("Asistente automático de demostración · sus datos no se envían a ningún sitio", "Automated demo assistant · your data isn't sent anywhere");
    launch.querySelector(".r24-lt").textContent = L("Recepción 24 h", "24/7 Front Desk");
    launch.setAttribute("aria-label", L("Abrir la recepción 24 h", "Open the 24/7 front desk"));
    banner.textContent = L("Demo privada preparada para International Engines LLC", "Private demo prepared for International Engines LLC");
    panel.querySelector(".r24-human").textContent = L("👤 Hablar con una persona", "👤 Talk to a person");
  }
  function build() {
    var base = window.R24_BASE || "recepcion/";
    var css = document.createElement("link"); css.rel = "stylesheet"; css.href = base + "recepcion.css"; document.head.appendChild(css);
    banner = el("div", "r24-demo-banner"); banner.setAttribute("role", "note"); document.body.appendChild(banner);
    launch = el("button", "r24-launch", '<img class="r24-face" src="' + base + 'avatar.svg" alt="Recepcionista"><span class="r24-lt"></span><span class="r24-dot"></span>');
    launch.type = "button"; document.body.appendChild(launch);
    panel = el("div", "r24-panel"); panel.setAttribute("role", "dialog"); panel.setAttribute("aria-label", "Recepción 24 h");
    panel.innerHTML = '<div class="r24-head"><div class="r24-av"><img class="r24-face" src="' + base + 'avatar.svg" alt="Recepcionista"></div><div class="r24-ht"><b></b><small></small></div><button class="r24-lang" type="button"></button><button class="r24-x" type="button" aria-label="Cerrar">×</button></div><div class="r24-status"></div><button class="r24-human" type="button"></button><div class="r24-body" aria-live="polite"></div><form class="r24-foot"><input class="r24-in" type="text" autocomplete="off" maxlength="300"><button class="r24-send" type="submit"></button></form><input class="r24-file" type="file" accept="image/*" hidden><div class="r24-legal"></div>';
    document.body.appendChild(panel);
    body = panel.querySelector(".r24-body"); input = panel.querySelector(".r24-in"); status = panel.querySelector(".r24-status"); fileIn = panel.querySelector(".r24-file");
    panel.querySelector(".r24-human").onclick = humano;
    fileIn.onchange = function () { var f = fileIn.files && fileIn.files[0]; if (!f || !flow || flow.step !== "foto") return; fotoRecibida(f); fileIn.value = ""; };
    headTexts();
    launch.onclick = function () { open(); };
    panel.querySelector(".r24-x").onclick = function () { panel.classList.remove("r24-open"); launch.classList.remove("r24-hide"); document.documentElement.classList.remove("r24-panel-open"); };
    panel.querySelector(".r24-lang").onclick = function () { setLang(lang === "en" ? "es" : "en", true); };
    panel.querySelector("form").onsubmit = function (ev) { ev.preventDefault(); ev.stopImmediatePropagation(); var t = input.value.trim(); if (!t) return; input.value = ""; handle(t); };
    document.addEventListener("click", function (ev) {
      var a = ev.target.closest && ev.target.closest("[data-r24-open]"); if (a) { ev.preventDefault(); ev.stopPropagation(); open(a.getAttribute("data-r24-open")); }
    }, true);
  }
  function setLang(l, announce) {
    if (l === lang) return; lang = l; headTexts(); statusText();
    if (announce) addBot(L("Perfecto, seguimos en español. ¿En qué le ayudo?", "Sure, let's continue in English. How can I help?"), flow ? [] : menuChips());
    if (flow && announce) setTimeout(function () { ask(flow.step); }, 600);
  }
  // R24-HUMANO-1018: siempre a la vista; nunca deja al cliente atrapado con el asistente
  function humano() {
    flow = null; addUser(L("👤 Hablar con una persona", "👤 Talk to a person"));
    var n = nowTx(), ab = isOpen(n), fin = n.dow === 6 || n.dow === 0;
    addBot(L((ab ? "Claro. Ahora están abiertos: llame a la sede que prefiera y le atiende una persona (" + telsTxt() + ")." : "Claro. Ahora el taller está cerrado" + (fin ? " (el fin de semana no abren)" : "") + "; abre " + nextOpening(n) + ". En horario puede llamar a Phoenix (" + C.s1.tel + ") o a Avondale (" + C.s2.tel + ").") + " Si prefiere, le contactan ellos: déjeme su nombre y teléfono y el pedido les llega al instante.",
      (ab ? "Sure. They're open now: call either location and a person will help you (" + telsTxt() + ")." : "Sure. The shop is closed right now" + (fin ? " (closed on weekends)" : "") + "; it opens " + nextOpening(n) + ". During business hours you can call Phoenix (" + C.s1.tel + ") or Avondale (" + C.s2.tel + ").") + " Or they can reach out to you: leave your name and number and they get the request instantly."), [TEL1(), TEL2(), LLAMADA_CHIP, CITA_CHIP]);
  }
  function greet() {
    addBot(L("¡Hola! 👋 Soy el asistente virtual con IA de International Engines LLC (motores y transmisiones, con 2 sedes: Phoenix y Avondale). Le ayudo a pedir un presupuesto de motor o de transmisión, le tomo los datos para que el taller lo llame o le escriba, o le cuento servicios, garantía, horario y direcciones, a cualquier hora: también después de las 4 p. m. y el fin de semana, o cuando no pueden atender el teléfono.\n¿En qué le ayudo?",
      "Hi! 👋 I'm the AI virtual assistant for International Engines LLC (engines and transmissions, with 2 locations: Phoenix and Avondale). I can set up an engine or transmission quote, take your details so the shop calls or texts you back, or answer questions about services, warranty, hours and locations — any time, including after 4 PM and on weekends, or when nobody can pick up the phone.\nHow can I help?"), menuChips());
  }
  function open(mode) {
    if (mode === "es" || mode === "en") { if (lang !== mode) { lang = mode; headTexts(); } mode = null; }
    if (mode === "form") mode = null;
    panel.classList.add("r24-open"); launch.classList.add("r24-hide"); document.documentElement.classList.add("r24-panel-open"); statusText();
    if (!opened) { opened = true; greet(); }
    if (mode === "llamada" && !flow) setTimeout(function () { addUser(LLAMADA_CHIP.t); startLlamada(); }, 450);
    if (mode === "cita" && !flow) setTimeout(function () { addUser(CITA_CHIP.t); startCita(); }, 450);
    setTimeout(function () { input.focus(); }, 50);
  }
  function opts(a) { return a.map(function (t) { return { t: t, v: t, flow: true }; }); }
  // Lo que le pasa, con lo que describe su web (About y FAQs)
  function SINT() { return lang === "en" ? ["Knocking / engine noise", "Overheating", "Burning oil or coolant", "Low compression / internal failure", "Engine seized / won't run", "Transmission slipping / not shifting", "Other / not sure"]
    : ["Golpetea / ruido en el motor", "Se recalienta", "Quema aceite o refrigerante", "Baja compresión / falla interna", "Motor trabado / no anda", "La transmisión patina / no cambia", "Otra cosa / no sé"]; }
  function TIPOS() { return opts([L("Reconstrucción de motor", "Engine rebuild"), L("Reemplazo de motor (usado o reconstruido)", "Engine replacement (used or rebuilt)"), L("Transmisión (reconstrucción o reemplazo)", "Transmission (rebuild or replacement)"), L("Instalar un motor que ya tengo", "Install an engine I already have"), L("No sé, que lo revisen", "Not sure, please inspect it")]); }
  function SEDES() { return opts([L("Phoenix (3925 W Indian School Rd)", "Phoenix (3925 W Indian School Rd)"), L("Avondale (1050 N Eliseo Felix Jr Way)", "Avondale (1050 N Eliseo Felix Jr Way)"), L("Me da igual / la más cercana", "Either / whichever is closer")]); }
  function ESTADO() { return opts([L("✅ Anda, puedo llevarlo", "✅ It runs, I can drive it in"), L("⚠️ Anda, pero con falla", "⚠️ It runs, but barely"), L("⛔ No anda / está parado", "⛔ It won't run / it's down")]); }
  function REMOLQUE() { return opts([L("🚛 Sí, necesitaría remolque", "🚛 Yes, I'd need a tow"), L("Lo llevo yo (grúa propia o de un conocido)", "I'll get it there myself"), L("Todavía no sé", "Not sure yet")]); }
  function FOTO() { return [{ t: L("📷 Subir foto", "📷 Upload photo"), foto: true }, { t: L("Sin foto", "No photo"), v: "__nofoto", flow: true }]; }
  function MEDIO() { return opts([L("📞 Llamada", "📞 Phone call"), L("💬 Mensaje de texto", "💬 Text message")]); }
  function franjas() { return opts([L("Mañana (8:00 a.m. – 12:00 p.m.)", "Morning (8:00 AM – 12:00 PM)"), L("Tarde (12:00 – 4:00 p.m.)", "Afternoon (12:00 – 4:00 PM)"), L("Me da igual", "Either is fine")]); }
  function startCita() {
    flow = { step: "tipo", d: { tipo: "cita" } };
    addBot(L("¡Con gusto! En unos pasos le dejo el pedido de presupuesto listo para el taller. (Escriba «cancelar» si quiere salir.)\n¿Qué necesita?", "Happy to help! A few quick steps and your quote request is ready for the shop. (Type \"cancel\" to exit.)\nWhat do you need?"), TIPOS());
  }
  function startLlamada() {
    flow = { step: "nombre", d: { tipo: "llamada", consulta: (lastQ || L("Consulta general", "General question")).slice(0, 120) } };
    addBot(L("¡Claro! Le contacta una persona del taller, por llamada o por mensaje de texto. Solo necesito unos datos.\n¿Cuál es su nombre? (Escriba «cancelar» si quiere salir.)", "Sure! Someone from the shop will reach out by phone call or text. I just need a few details.\nWhat's your name? (Type \"cancel\" to exit.)"));
  }
  function normTel(t) { var ph = String(t || "").replace(/[\s().+-]/g, ""); if (/^1\d{10}$/.test(ph)) ph = ph.slice(1); return /^[2-9]\d{9}$/.test(ph) ? ph.slice(0, 3) + "-" + ph.slice(3, 6) + "-" + ph.slice(6) : ""; }
  function cap(s) { return String(s || "").trim().split(/\s+/).filter(Boolean).map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join(" ").slice(0, 60); }
  function sedeDe(t) { return /phoenix|indian school|3925|602/i.test(t) ? "Phoenix" : (/avondale|eliseo|felix|1050|623/i.test(t) ? "Avondale" : L("La más cercana / cualquiera", "Whichever is closer")); }
  // Su formulario «Contact Us» (Home y Contact) le entrega el pedido a la recepción, que confirma al instante y pide lo que falta
  function fromForm(f) {
    f = f || {};
    var nm = cap(f.name);
    var d = { tipo: "cita", form: true, servicio: (f.servicio ? f.servicio + " · " : "") + L("formulario «Contáctenos»", "\"Contact Us\" form"),
      nombre: nm.length >= 2 ? nm : "", telefono: normTel(f.tel), email: String(f.email || "").trim().slice(0, 60), vehiculo: String(f.vehiculo || "").trim().slice(0, 60), sintoma: String(f.msg || "").trim().slice(0, 120) };
    if (f.sede) d.sede = sedeDe(f.sede);
    open("form");
    flow = { step: !d.vehiculo ? "vehiculo" : (!d.sintoma ? "sintoma" : (!d.sede ? "sede" : "estado")), d: d };
    addUser(L("📝 Formulario «Contáctenos»", "📝 \"Contact Us\" form") + "\n" + [nm, f.tel, d.email, d.vehiculo, f.servicio, f.sede, d.sintoma].filter(Boolean).join(" · "));
    addBot(L("¡Recibido" + (nm ? ", " + nm.split(" ")[0] : "") + "! ✅ Su pedido ya le llegó al taller: no se queda esperando 1 día hábil a que le respondan. " + aviso() + "\nPara dejarlo completo, unas preguntas rápidas.",
      "Got it" + (nm ? ", " + nm.split(" ")[0] : "") + "! ✅ Your request already reached the shop: no waiting 1 business day for a reply. " + aviso() + "\nA few quick questions to complete it."));
    setTimeout(function () { ask(flow.step); }, 700);
  }
  function fotoRecibida(f) {
    var d = flow.d; d.foto = f.name.slice(0, 40);
    var m = el("div", "r24-msg r24-user r24-photo"); var im = new Image(); im.alt = "foto"; im.style.cssText = "max-width:160px;max-height:120px;display:block;border-radius:8px;margin-bottom:4px";
    try { im.src = URL.createObjectURL(f); } catch (e) {}
    m.appendChild(im); m.appendChild(document.createTextNode("📷 " + d.foto)); body.appendChild(m); scroll();
    var w = body.querySelectorAll(".r24-chips"); if (w.length) w[w.length - 1].remove();
    addBot(L("📷 Foto recibida (en esta demo no sale de su teléfono).", "📷 Photo received (in this demo it never leaves your phone)."));
    setTimeout(function () { ask("dia"); }, 600);
  }
  function medioTxt(d) { return d.medio || L("Llamada", "Phone call"); }
  function ask(step) {
    flow.step = step;
    var d = flow.d, n = nowTx();
    if (step === "vehiculo") addBot(L("¿Año, marca, modelo y tamaño del motor? (por ejemplo: 2012 Honda Accord 2.4L)", "Year, make, model and engine size? (e.g. 2012 Honda Accord 2.4L)"));
    else if (step === "sintoma") addBot(L("¿Qué le pasa al motor o a la transmisión?", "What's going on with the engine or transmission?"), opts(SINT()));
    else if (step === "sede") addBot(L("¿En cuál de las 2 sedes le queda mejor? (El mismo horario en las dos.)", "Which of the 2 locations works best for you? (Same hours at both.)"), SEDES());
    else if (step === "estado") addBot(L("¿El vehículo anda o está parado?", "Does the vehicle run, or is it down?"), ESTADO());
    else if (step === "remolque") addBot(L("¿Cómo lo llevaría al taller? Lo anoto solo como preferencia: su web no publica servicio de grúa ni de remolque, así que no se lo prometo.", "How would you get it to the shop? I'll just note it as a preference: their site doesn't list towing, so I won't promise it."), REMOLQUE());
    else if (step === "foto") { if (d.foto) { ask("dia"); return; } addBot(L("¿Tiene una foto (del motor, la fuga, el humo o la luz del tablero)? Es opcional y ayuda al taller a preparar el presupuesto.", "Do you have a photo (the engine, the leak, the smoke or the dashboard light)? It's optional and helps the shop prepare the quote."), FOTO()); }
    else if (step === "dia") {
      var days = nextWorkdays(n, 5); flow.days = {}; days.forEach(function (x) { flow.days[x.label] = x.dow; });
      addBot(L("¿Qué día le queda mejor para llamarle o para llevarlo a revisar? Lo anoto como preferencia y el taller se lo confirma. Atienden de lunes a viernes de 8:00 a.m. a 4:00 p.m.; el fin de semana, cerrado.", "Which day works best for a call or to bring it in for inspection? I'll note it as a preference and the shop confirms. They're open Monday–Friday 8:00 AM – 4:00 PM; closed on weekends."),
        opts(days.map(function (x) { return x.label; })).concat(opts([L("Lo antes posible", "As soon as possible")])));
    }
    else if (step === "franja") addBot(L("¿En qué franja?", "What time window?"), franjas());
    else if (step === "nombre") addBot(L("¿Cuál es su nombre?", "What's your name?"));
    else if (step === "medio") addBot(L("Gracias, " + d.nombre + ". ¿Prefiere que le llamen o que le manden un mensaje de texto?", "Thanks, " + d.nombre + ". Would you rather get a call or a text?"), MEDIO());
    else if (step === "telefono") addBot(d.tipo === "llamada" ? L("Perfecto. ¿A qué teléfono le " + (/texto/i.test(medioTxt(d)) ? "escriben" : "llaman") + "?", "Great. What number should they " + (/text/i.test(medioTxt(d)) ? "text" : "call") + "?") : L("Último paso: ¿a qué teléfono le contactan con el presupuesto?", "Last step: what number should they use to reach you with the quote?"));
    else if (step === "resumen") {
      var B = [{ t: L("✅ Confirmar", "✅ Confirm"), v: "__ok", flow: true }, { t: L("✏️ Corregir", "✏️ Edit"), v: "__fix", flow: true }, { t: L("Cancelar", "Cancel"), v: "cancelar", flow: true }];
      var q = L("\n\n¿Lo confirmo?", "\n\nShall I confirm?"), foto = d.foto ? d.foto : L("sin foto", "no photo");
      if (d.tipo === "llamada") { addBot(L("Revise su solicitud de contacto:\n👤 Nombre: ", "Please review your contact request:\n👤 Name: ") + d.nombre + L("\n💬 Consulta: ", "\n💬 Question: ") + d.consulta + L("\n🏁 Sede: ", "\n🏁 Location: ") + d.sede + L("\n📲 Cómo: ", "\n📲 How: ") + medioTxt(d) + L("\n📱 Teléfono: ", "\n📱 Phone: ") + d.telefono + "\n\n" + aviso() + q, B, "r24-sum"); return; }
      addBot(L("Revise su solicitud:\n🧾 Pedido: ", "Please review your request:\n🧾 Request: ") + d.servicio + L("\n🚗 Vehículo: ", "\n🚗 Vehicle: ") + d.vehiculo + L("\n🔧 Qué le pasa: ", "\n🔧 Problem: ") + d.sintoma + L("\n🏁 Sede: ", "\n🏁 Location: ") + d.sede + L("\n🚦 Estado: ", "\n🚦 Status: ") + d.estado + (d.remolque ? L("\n🚛 Remolque (preferencia): ", "\n🚛 Towing (preference): ") + d.remolque : "") + L("\n📷 Foto: ", "\n📷 Photo: ") + foto + L("\n📅 Día: ", "\n📅 Day: ") + d.dia + L("\n🕐 Franja: ", "\n🕐 Window: ") + d.franja + L("\n👤 Nombre: ", "\n👤 Name: ") + d.nombre + L("\n📲 Cómo: ", "\n📲 How: ") + medioTxt(d) + L("\n📱 Teléfono: ", "\n📱 Phone: ") + d.telefono + (d.email ? L("\n✉️ Correo: ", "\n✉️ Email: ") + d.email : "") + "\n\n" + aviso() + q, B, "r24-sum");
    }
  }
  function flowInput(t, chip) {
    var n = norm(t), d = flow.d;
    if (/^(cancelar|cancela|salir|dejalo|olvidalo|cancel|stop|exit|quit)$/.test(n)) { flow = null; addBot(L("Sin problema, cancelé la solicitud. ¿Le ayudo con otra cosa?", "No problem, I've cancelled the request. Anything else?"), [CITA_CHIP, HOR, LLAMADA_CHIP]); return; }
    if (/\?/.test(t) && flow.step !== "resumen") {
      var bi = bestIntent(t);
      if (bi && bi.s >= 1) { reply(bi.e); setTimeout(function () { ask(flow.step); }, 700); return; }
    }
    switch (flow.step) {
      case "tipo":
        d.servicio = t.slice(0, 50);
        addBot(/instalar|install/.test(n) ? L("Bien. Su web dice que instalan un motor que traiga el cliente después de inspeccionarlo; la garantía depende del estado de ese motor. Aquí no doy precios: el presupuesto se lo da el taller.", "Got it. Their site says they install a customer-supplied engine after inspecting it; warranty depends on that engine's condition. I don't quote prices here: the shop gives you the quote.")
          : L("Bien. Aquí no doy precios: el presupuesto se lo da el taller (su web dice que la inspección es sin cargo).", "Got it. I don't quote prices here: the shop gives you the quote (their site says inspections are free)."));
        setTimeout(function () { ask("vehiculo"); }, 600); return;
      case "vehiculo":
        if (t.length < 2) { ask("vehiculo"); return; }
        d.vehiculo = t.slice(0, 60); if (d.form && d.sintoma) ask(d.sede ? "estado" : "sede"); else ask("sintoma"); return;
      case "sintoma": d.sintoma = t.slice(0, 100); ask(d.sede ? "estado" : "sede"); return;
      case "sede":
        d.sede = sedeDe(t);
        if (d.tipo === "llamada") { ask("medio"); return; }
        ask("estado"); return;
      case "estado":
        d.estado = t.slice(0, 50);
        if (/no anda|parado|won.t run|down/i.test(n)) { ask("remolque"); return; }
        ask("foto"); return;
      case "remolque":
        d.remolque = t.replace(/^🚛\s*/, "").slice(0, 50);
        if (/remolque|tow/i.test(n) && !/llevo yo|myself/i.test(n)) addBot(L("Anotado como preferencia: el taller ve en el pedido que el vehículo no anda y que necesitaría remolque, y le dice cómo coordinarlo. No le prometo grúa porque su web no la ofrece.", "Noted as a preference: the shop will see the vehicle won't run and you'd need a tow, and tell you how to arrange it. I won't promise a tow since their site doesn't offer one."));
        setTimeout(function () { ask("foto"); }, /remolque|tow/i.test(n) ? 700 : 0); return;
      case "foto":
        if (t !== "__nofoto") d.foto = L("la describe: ", "described: ") + t.slice(0, 60);
        ask("dia"); return;
      case "dia":
        d.dia = t.slice(0, 60); d.dow = flow.days && flow.days[t] != null ? flow.days[t] : -1;
        if (/^(lo antes posible|as soon as possible)$/i.test(t)) { d.franja = L("La primera disponible", "First available"); ask(d.nombre ? "medio" : "nombre"); return; }
        if (/sabado|domingo|saturday|sunday|fin de semana|weekend/i.test(n)) { addBot(L("El fin de semana el taller está cerrado. ¿Otro día, de lunes a viernes?", "The shop is closed on weekends. Another day, Monday to Friday?")); setTimeout(function () { ask("dia"); }, 500); return; }
        ask("franja"); return;
      case "franja": d.franja = t.slice(0, 60); ask(d.nombre ? "medio" : "nombre"); return;
      case "nombre":
        var nm = t.replace(/^(me llamo|soy|mi nombre es|my name is|i am|i'm|im)\s+/i, "").trim();
        if (nm.length < 2 || nm.length > 60 || /\d/.test(nm)) { addBot(L("¿Me dice su nombre, por favor? (solo el nombre, sin números)", "What's your name, please? (just your name, no numbers)")); return; }
        d.nombre = nm.split(/\s+/).map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join(" ");
        if (d.tipo === "llamada" && !d.sede) { ask("sede"); return; }
        ask("medio"); return;
      case "medio":
        d.medio = /texto|text|sms|mensaje/i.test(t) ? L("Mensaje de texto", "Text message") : L("Llamada", "Phone call");
        if (d.telefono) ask("resumen"); else ask("telefono"); return;
      case "telefono":
        var ph = t.replace(/[\s().+-]/g, "");
        if (/^1\d{10}$/.test(ph)) ph = ph.slice(1);
        if (!/^[2-9]\d{9}$/.test(ph)) { addBot(L("Ese número no me cuadra. Escríbalo con 10 cifras (con código de área), por ejemplo 602-555-0123.", "That number doesn't look right. Please use 10 digits with area code, e.g. 602-555-0123.")); return; }
        d.telefono = ph.slice(0, 3) + "-" + ph.slice(3, 6) + "-" + ph.slice(6);
        ask("resumen"); return;
      case "resumen":
        if (t === "__ok" || /^(si|sí|ok|confirmo|confirmar|correcto|dale|yes|confirm|sure|yep)/.test(n)) {
          var nm2 = d.nombre.split(" ")[0], DEMO = L("\n\n(Versión de demostración: esta solicitud no se envió al taller.)", "\n\n(Demo version: this request was not sent to the shop.)"), tx = /texto|text/i.test(medioTxt(d));
          var sd = /Avondale/.test(d.sede) ? MAPS2 : MAPS1;
          if (d.tipo === "llamada") { addBot(L("¡Listo, " + nm2 + "! ✅ El taller recibe su pedido al instante y le " + (tx ? "escribe" : "llama") + " al " + d.telefono + ".", "All set, " + nm2 + "! ✅ The shop gets your request instantly and will " + (tx ? "text" : "call") + " you at " + d.telefono + ".") + DEMO, [CITA_CHIP, Q("Otra pregunta", "Another question", "__menu", "__menu")]); flow = null; return; }
          addBot(L("¡Listo, " + nm2 + "! ✅ Su pedido de presupuesto quedó registrado para la sede " + d.sede + ".\nEl taller le " + (tx ? "escribe" : "llama") + " al " + d.telefono + " para darle el presupuesto y confirmar el día; el precio se lo dan ellos.", "All set, " + nm2 + "! ✅ Your quote request is in for the " + d.sede + " location.\nThe shop will " + (tx ? "text" : "call") + " you at " + d.telefono + " with the quote and to confirm the day; pricing comes from them.") + DEMO, [sd(), Q("Otra pregunta", "Another question", "__menu", "__menu")]);
          flow = null; return;
        }
        if (t === "__fix" || /corregir|cambiar|editar|edit|change|^no\b/.test(n)) {
          var keep = d.tipo === "llamada" ? { tipo: "llamada", consulta: d.consulta } : { tipo: d.tipo, servicio: d.servicio };
          flow.d = keep; addBot(L("De acuerdo, empezamos de nuevo.", "OK, let's start over."));
          setTimeout(function () { if (keep.tipo === "llamada") ask("nombre"); else ask("vehiculo"); }, 500); return;
        }
        ask("resumen"); return;
    }
  }
  function reply(e) {
    var t = typeof e.a === "function" ? e.a() : e.a;
    addBot(t, (e.c || []).map(function (c) { if (typeof c === "function") c = c(); return c.q ? { t: c.t, v: c.q } : c; }));
  }
  function fallback() {
    addBot(L("Eso se lo confirma mejor el taller, así tiene el dato exacto. 😊\nLlame al " + C.s1.tel + " (Phoenix) o al " + C.s2.tel + " (Avondale), " + hc() + ", o déjeme su teléfono y le contactan ellos.",
      "The shop can confirm that for you so you get the exact answer. 😊\nCall " + C.s1.tel + " (Phoenix) or " + C.s2.tel + " (Avondale), " + hc() + ", or leave your number and they'll get back to you."), [TEL1, TEL2, LLAMADA_CHIP, CITA_CHIP]);
  }
  function handle(t, chip, shown) {
    if (t === "__menu") { addBot(L("Claro, ¿qué más quiere saber?", "Sure, what else would you like to know?"), menuChips()); return; }
    addUser(chip ? (shown || chip.t) : t);
    var n = norm(t);
    if (!chip) { if (lang === "es" && looksEnglish(n)) setLang("en", false); else if (lang === "en" && looksSpanish(n)) setLang("es", false); }
    if (flow) { flowInput(chip && chip.v ? chip.v : t, chip); return; }
    if (chip && chip.a === "cita") { startCita(); return; }
    if (chip && chip.a === "llamada") { startLlamada(); return; }
    if (/^(hola|buenas|buenos dias|buenas tardes|hey|hi|hello)\b/.test(n) && n.split(" ").length <= 3) { addBot(L("¡Hola! ¿En qué le puedo ayudar? Le pido un presupuesto de motor o transmisión, le tomo los datos para que lo llamen o le escriban y le cuento servicios, garantía, horario y direcciones.", "Hi! How can I help? I can request an engine or transmission quote, take your details for a call or text back, and tell you about services, warranty, hours and locations."), menuChips()); return; }
    if (/^(horario y sedes|hours and locations)$/.test(n)) { addBot(horarioA() + "\n\n" + dirA(), [CITA_CHIP, MAPS1, MAPS2, LLAMADA_CHIP]); return; }
    if (/^(mi motor fallo no anda|my engine failed won t run)$/.test(n)) { reply(byId("nomaneja")); return; }
    if (/\b(que me llamen|llamenme|que me escriban|escribanme|textean|call me back|text me|callback|call back)\b/.test(n)) { startLlamada(); return; }
    if (/\b(persona|humano|alguien real|asesor|person|human|someone real|real person)\b/.test(n)) { humano(); return; }
    if (isWalkinQ(n)) { reply(byId("walkin")); return; }
    var bi = bestIntent(t);
    var price = isPriceQ(n);
    if (wantsCita(n) && !price && !(bi && bi.e && bi.e.id === "precio" && /\?|es gratis|is it free|sin compromiso|no obligation/.test(t)) && (!bi || bi.s < 2 || /cita|presupuesto|cotiz|appointment|estimate|quote|schedule|book/.test(n))) { startCita(); return; }
    if (price && !(bi && bi.e.id === "nolist")) { reply(byId("precio")); return; }
    if (bi) { reply(bi.e); return; }
    lastQ = t; fallback();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build); else build();
  window.R24 = { open: open, fromForm: function (f) { if (panel) fromForm(f); }, setLang: function (l) { if (panel) setLang(l === "en" ? "en" : "es", opened); }, _test: { bestIntent: bestIntent, norm: norm, nowTx: nowTx, lang: function () { return lang; } } };
})();
