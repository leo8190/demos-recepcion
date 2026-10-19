/* R24-HUMANO-1018 */
/* R24-BRIEF-1018: avatar humano, botones rápidos, "que me llamen", aviso al equipo, sin "no tengo ese dato" */
/* Recepción 24 h · Jaramillo's Transmission (transmisiones, 602 E Red Bird Ln Ste F, Duncanville TX 75116) — DEMO privada, bilingüe ES/EN.
   100% del lado del cliente: sin APIs, sin claves, sin envío de datos (la foto se muestra solo en este navegador).
   Respuestas sacadas solo de lo que publica www.jaramillostransmission.com (oct. 2026; una sola página, en inglés, con «Hablamos Español»):
   - Teléfono 972-241-1599 y email Jaramillos.trans@gmail.com (en su web están escritos SIN enlace; en la demo son tocables). Facebook. No publican WhatsApp.
   - Horario: su web NO publica horario ni días. Lo único: bajo el formulario «*We typically respond within 15–30 minutes during business hours».
     La demo no inventa «abierto/cerrado»: lo dice así, toma los datos a cualquier hora y el taller llama.
   - Servicios: reconstrucción (rebuild) y reparación de transmisiones automáticas, manuales, 4x4 y CVT en su taller, todas las marcas y modelos;
     diagnóstico y cotización gratis (inspección completa y escaneo por computadora; cotización clara de partes y mano de obra, sin cargos ocultos);
     servicio de fluido y diagnóstico por computadora; garantía «12 / 36 month» en unidades reconstruidas; la mayoría de los rebuilds en «unos días
     hábiles» según vehículo y partes; servicio para talleres (rebuild al por mayor: el taller saca e instala, ellos reconstruyen, bajo el nombre del
     taller, con tarifas de mayoreo). Atienden Dallas, Fort Worth y el metroplex DFW. Hablan español.
   Sin precios (la web no publica ninguno), sin WhatsApp. Español en «usted». */
(function () {
  "use strict";
  var C = {
    nombre: "Jaramillo's Transmission", corto: "Jaramillo's Transmission",
    tel: "972-241-1599", telh: "+19722411599", mail: "Jaramillos.trans@gmail.com",
    dir: "602 E Red Bird Ln Ste F, Duncanville, TX 75116", maps: "https://maps.google.com/?q=602+E+Red+Bird+Ln+Ste+F+Duncanville+TX+75116"
  };
  var qlang = (location.search.match(/[?&]lang=(es|en)\b/) || [])[1];
  var lang = qlang || ((window.R24_LANG === "auto" ? ((navigator.language || "en").slice(0, 2) === "es" ? "es" : "en") : (window.R24_LANG || "es")).slice(0, 2) === "en" ? "en" : "es");
  function L(es, en) { return lang === "en" ? en : es; }
  var DIAS = { es: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"], en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] };
  var MESES = { es: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"], en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] };
  function horarioTxt() {
    return L("Su web no publica el horario de atención (ni días ni horas), así que no se lo voy a inventar. Lo único que dice es que «normalmente responden en 15–30 minutos en horario de atención».\nLo que sí puedo hacer ahora, a cualquier hora: le tomo su nombre, su teléfono y qué le pasa al vehículo, y el taller lo llama. También puede llamar al " + C.tel + ".",
      "Their website doesn't publish business hours (no days or times), so I won't make them up. All it says is \"we typically respond within 15–30 minutes during business hours\".\nWhat I can do right now, any time: take your name, number and what your vehicle is doing, and the shop calls you back. You can also call " + C.tel + ".");
  }
  function nowTx() {
    var q = (location.search.match(/[?&]r24now=([^&]+)/) || [])[1];
    if (q) { var p = decodeURIComponent(q).match(/(\d+)-(\d+)-(\d+)T(\d+):(\d+)/);
      if (p) return { y: +p[1], m: +p[2] - 1, d: +p[3], dow: new Date(+p[1], +p[2] - 1, +p[3]).getDay(), min: +p[4] * 60 + +p[5] }; }
    var f = new Intl.DateTimeFormat("en-GB", { timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false });
    var o = {}; f.formatToParts(new Date()).forEach(function (x) { o[x.type] = x.value; });
    var y = +o.year, m = +o.month - 1, d = +o.day;
    return { y: y, m: m, d: d, dow: new Date(y, m, d).getDay(), min: (+o.hour % 24) * 60 + +o.minute };
  }
  function dayLabel(dt) { var dn = DIAS[lang][dt.getDay()]; return lang === "en" ? dn + ", " + MESES.en[dt.getMonth()] + " " + dt.getDate() : dn.charAt(0).toUpperCase() + dn.slice(1) + " " + dt.getDate() + " " + MESES.es[dt.getMonth()]; }
  function nextDays(n, k) {
    var out = [];
    for (var i = 1; out.length < k && i < 14; i++) { var dt = new Date(n.y, n.m, n.d + i); out.push({ dow: dt.getDay(), label: dayLabel(dt) }); }
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

  var CITA_CHIP = { a: "cita", get t() { return L("🔧 Diagnóstico gratis o cotización", "🔧 Free diagnostic or quote"); } };
  var TALLER_CHIP = { a: "taller", get t() { return L("🏭 Soy taller (rebuild por mayoreo)", "🏭 I'm a repair shop (wholesale)"); } };
  var LLAMADA_CHIP = { a: "llamada", get t() { return L("📲 Que me llamen", "📲 Call me back"); } };
  function aviso() { return L("🔔 El equipo del taller recibe este pedido al instante (en esta demo no se envía nada).", "🔔 The shop team gets this request instantly (nothing is sent in this demo)."); }
  var lastQ = "";
  function TEL() { return { t: L("Llamar al ", "Call ") + C.tel, tel: C.telh }; }
  function MAIL() { return { t: "✉️ " + C.mail, url: "mailto:" + C.mail, self: true }; }
  function MAPS() { return { t: L("Cómo llegar (Google Maps)", "Directions (Google Maps)"), url: C.maps }; }
  function Q(es, en, qes, qen) { return { get t() { return L(es, en); }, get q() { return L(qes || es, qen || en); } }; }
  var SVC = Q("🛠️ Servicios", "🛠️ Services", "servicios", "services");
  var HOR = Q("🕐 Horario y dirección", "🕐 Hours & address", "horario y direccion", "hours and address");
  var GAR = Q("🛡️ Garantía", "🛡️ Warranty", "garantia", "warranty");
  function dirA() { return L("📍 " + C.dir + ". Su web dice que están en Duncanville, «justo al lado de E. Red Bird Ln.» y con fácil acceso desde Dallas; atienden Dallas, Fort Worth y todo el metroplex DFW.", "📍 " + C.dir + ". Their site says they're in Duncanville, \"just off E. Red Bird Ln.\", easy to reach from Dallas; they serve Dallas, Fort Worth and the whole DFW metroplex."); }
  function horarioA() { return horarioTxt(); }
  function serviciosA() {
    return L("Lo que publica el taller (se dedican a transmisiones):\n• Reconstrucción (rebuild) y reparación de transmisiones automáticas, manuales, 4x4 y CVT, en su propio taller, todas las marcas y modelos\n• Diagnóstico y cotización gratis: inspección completa y escaneo por computadora, con cotización clara de partes y mano de obra, sin cargos ocultos\n• Servicio de fluido de transmisión y diagnóstico por computadora\n• Garantía de 12/36 meses en las unidades reconstruidas\n• Para talleres: rebuild por mayoreo (ustedes sacan e instalan, ellos reconstruyen)\n¿Qué está haciendo su vehículo?",
      "What the shop lists (they're transmission specialists):\n• Rebuild and repair of automatic, manual, 4x4 and CVT transmissions, in-house, all makes and models\n• Free diagnostic & quote: full inspection and computer scan, with a clear upfront quote for parts and labor, no hidden fees\n• Transmission fluid service and computer diagnostics\n• 12/36 month warranty on rebuilt units\n• For repair shops: wholesale rebuilds (you remove and reinstall, they rebuild)\nWhat is your vehicle doing?");
  }
  function noListA() {
    return L("Su web se dedica a transmisiones y eso no aparece entre sus servicios, así que no se lo voy a asegurar. Llame al " + C.tel + " o déjeme su teléfono y le llaman ellos.",
      "Their website is all about transmissions and that isn't among their services, so I won't promise it. Call " + C.tel + " or leave your number and they'll call you.");
  }
  var KB = [
    { id: "sintomas", k: ["patina", "patinando", "se patina", "no cambia", "cambia tarde", "cambios bruscos", "jalones", "golpea al cambiar", "tarda en cambiar", "ruido", "rechina", "zumbido", "fuga", "gotea", "pierde aceite", "luz", "check engine", "testigo", "no avanza", "no camina", "no entra el cambio", "reversa", "se calienta",
        "slipping", "slip", "delayed shifting", "hard shift", "shifting", "grinding", "noise", "whining", "leak", "leaking", "fluid leak", "warning light", "check engine", "won t move", "wont move", "no reverse", "jerking", "overheating", "shudder"],
      a: function () { return L("Según su web, las señales comunes son: cambios que patinan, cambios que tardan, ruidos o rechinidos, fugas de fluido o luces de advertencia. Ofrecen diagnóstico gratis para confirmar el problema antes de recomendar una reparación. Si quiere, le dejo pedido el diagnóstico ahora.", "Per their site, common signs are slipping gears, delayed shifting, grinding, fluid leaks or warning lights. They offer a free diagnostic to confirm the issue before recommending repairs. I can request the diagnostic for you right now."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "rebuild", k: ["reconstruir", "reconstruccion", "reconstruyen", "rebuild", "rebuilt", "reparar transmision", "arreglar transmision", "transmision", "caja de cambios", "caja", "automatica", "manual", "estandar", "4x4", "cvt", "convertidor", "torque converter", "transfer", "transmission", "gearbox", "automatic", "stick"],
      a: function () { return L("Sí: es su especialidad. Reconstruyen en su propio taller transmisiones automáticas, manuales, 4x4 y CVT de todas las marcas y modelos. Su web dice que, en vez de un reemplazo costoso, dejan su unidad como nueva, con garantía. El primer paso es el diagnóstico gratis.", "Yes, it's their specialty. They rebuild automatic, manual, 4x4 and CVT transmissions in-house for all makes and models. Their site says that instead of a costly replacement they restore your unit to like-new condition, backed by warranty. The first step is the free diagnostic."); }, c: [CITA_CHIP, GAR, LLAMADA_CHIP] },
    { id: "diagnostico", k: ["diagnostico", "diagnóstico", "revision", "revisar", "revisen", "escaneo", "scanner", "inspeccion", "gratis", "free", "diagnostic", "diagnosis", "inspection", "scan", "check"],
      a: function () { return L("Su web ofrece diagnóstico de transmisión gratis: inspección completa y escaneo por computadora. Después le dan una cotización clara de partes y mano de obra, «sin sorpresas ni cargos ocultos».", "Their site offers a free transmission diagnostic: full inspection and computer scan. Then you get a clear upfront quote for parts and labor, \"no surprises, no hidden fees\"."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "fluido", k: ["fluido", "aceite de transmision", "cambio de aceite", "mantenimiento", "servicio de transmision", "filtro", "fluid", "fluid service", "flush", "oil", "maintenance", "filter"],
      a: function () { return L("Sí: su web lista servicio de fluido de transmisión y diagnóstico por computadora. Dicen que el mantenimiento de rutina y un diagnóstico temprano pueden evitar un rebuild costoso.", "Yes: their site lists transmission fluid service and computer diagnostics. They say routine fluid service and early diagnostics can prevent costly rebuilds."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "garantia", k: ["garantia", "garantía", "garantizado", "warranty", "guarantee", "guaranteed"],
      a: function () { return L("Su web dice que todas las unidades reconstruidas tienen garantía de 12/36 meses («12 / 36 month warranty»). Los detalles de cobertura se los confirma el taller.", "Their site says all rebuilt units are backed by a 12/36 month warranty. The shop can confirm the coverage details."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "tiempo", k: ["cuanto tarda", "cuanto tiempo", "cuantos dias", "rapido", "mismo dia", "hoy mismo", "cuando esta", "how long", "how fast", "turnaround", "same day"],
      a: function () { return L("Su FAQ dice que la mayoría de los rebuilds se terminan en unos días hábiles, según el vehículo y la disponibilidad de partes. El tiempo exacto se lo da el taller después del diagnóstico.", "Their FAQ says most rebuilds are completed within a few business days, depending on the vehicle and parts availability. The shop gives you the exact time after the diagnostic."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "talleres", k: ["soy taller", "tengo un taller", "mi taller", "mayoreo", "al por mayor", "mecanico", "para mis clientes", "repair shop", "wholesale", "my shop", "i m a mechanic", "for my customers", "partner"],
      a: function () { return L("Sí: su web ofrece rebuild de transmisiones para talleres. Ustedes sacan e instalan la unidad, ellos la reconstruyen en su taller; trabajan detrás de escena, bajo el nombre de su taller y sin contacto con su cliente, con tarifas de mayoreo. Le dejo el pedido listo si quiere.", "Yes: their site offers transmission rebuilds for repair shops. You remove and reinstall, they rebuild in-house; they work behind the scenes, under your shop's name, with no direct customer contact, at wholesale rates. I can set up the request for you."); }, c: [TALLER_CHIP, LLAMADA_CHIP] },
    { id: "marcas", k: ["marca", "marcas", "importado", "toyota", "honda", "ford", "chevrolet", "chevy", "gmc", "nissan", "bmw", "mercedes", "dodge", "ram", "jeep", "kia", "hyundai", "make", "makes", "model", "foreign", "domestic", "truck", "troca", "camioneta"],
      a: function () { return L("Su web dice que reconstruyen transmisiones de todas las marcas y modelos (en la página muestran Honda, Ford, Mercedes-Benz, Toyota y BMW). Para su vehículo en particular, el diagnóstico es gratis.", "Their site says they rebuild transmissions for all makes and models (the page shows Honda, Ford, Mercedes-Benz, Toyota and BMW). For your specific vehicle, the diagnostic is free."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "nolist", k: ["frenos", "llantas", "llanta", "motor", "aire acondicionado", "carroceria", "pintura", "choque", "grua", "remolque", "moto", "motos", "brakes", "tires", "engine", "body work", "paint", "collision", "tow", "towing", "motorcycle", "ac repair"], a: noListA, c: [TEL, LLAMADA_CHIP, CITA_CHIP] },
    { id: "servicios", k: ["servicios", "que hacen", "que reparan", "que arreglan", "trabajos", "services", "what do you fix", "what do you do", "repairs"], a: serviciosA, c: [CITA_CHIP, TALLER_CHIP, LLAMADA_CHIP] },
    { id: "precio", k: ["precio", "precios", "cuanto cuesta", "cuanto sale", "cuanto cobran", "costo", "caro", "barato", "descuento", "tarifa", "price", "prices", "how much", "cost", "cheap", "rates", "discount", "cheaper"],
      a: function () { return L("Los precios se los da el taller: su web no publica precios. Dice que el diagnóstico es gratis y que después le dan una cotización clara de partes y mano de obra, sin cargos ocultos; y que en muchos casos reconstruir sale menos que reemplazar la transmisión. Lo que sí hago: le dejo pedida la cotización con su vehículo y lo que le pasa.", "Pricing comes from the shop: their site doesn't publish prices. It says the diagnostic is free and you then get a clear upfront quote for parts and labor, no hidden fees, and that in many cases rebuilding costs less than replacing the transmission. What I can do: request the quote with your vehicle and what it's doing."); }, c: [CITA_CHIP, TEL, LLAMADA_CHIP] },
    { id: "idioma", k: ["espanol", "español", "hablan espanol", "ingles", "inglés", "spanish", "english", "speak spanish", "bilingue"],
      a: function () { return L("Sí: su web dice «Hablamos Español» y que atienden a los clientes de habla hispana con el mismo cuidado y claridad. Aquí le atiendo en español o en inglés (botón EN arriba).", "Yes: their site says \"Hablamos Español\" and that they help Spanish-speaking customers with the same care and clarity. I can help you in English or Spanish (ES button at the top)."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "horario", k: ["horario", "horas", "abren", "abierto", "cierran", "a que hora", "sabado", "domingo", "lunes", "hours", "open", "close", "closing", "saturday", "sunday", "weekend"], a: horarioA, c: [LLAMADA_CHIP, CITA_CHIP, TEL] },
    { id: "direccion", k: ["donde", "dirección", "direccion", "ubicacion", "ubicados", "como llego", "llegar", "red bird", "duncanville", "dallas", "fort worth", "address", "location", "where", "directions", "located"],
      a: function () { return dirA() + L("\nSu web no publica el horario: si quiere, le dejo el pedido desde aquí y el taller le llama para coordinar.", "\nTheir site doesn't publish hours: I can send your request from here and the shop calls you to set it up."); }, c: [MAPS, CITA_CHIP, LLAMADA_CHIP] },
    { id: "contacto", k: ["telefono", "teléfono", "numero", "llamar", "contacto", "correo", "email", "mail", "whatsapp", "wasap", "watsap", "texto", "mensaje de texto", "sms", "facebook", "phone", "number", "call", "text", "contact"],
      a: function () { return L("Canales que publica el taller:\n📞 Teléfono: " + C.tel + "\n✉️ Email: " + C.mail + "\nTambién tienen página de Facebook. No publican WhatsApp. O deje aquí su teléfono y le llaman ellos.", "Channels the shop publishes:\n📞 Phone: " + C.tel + "\n✉️ Email: " + C.mail + "\nThey also have a Facebook page. They don't list WhatsApp. Or leave your number here and they'll call you."); }, c: [TEL, MAIL, LLAMADA_CHIP] },
    { id: "gracias", k: ["gracias", "muchas gracias", "perfecto", "adios", "thanks", "thank you", "bye", "great"], a: function () { return L("¡Con gusto! Si necesita algo más, aquí estoy. 🔧", "You're welcome! I'm here if you need anything else. 🔧"); }, c: [CITA_CHIP] }
  ];
  var CITA_K = ["cita", "presupuesto", "cotizacion", "cotizar", "estimado", "agendar", "reservar", "turno", "llevar el carro", "llevar mi carro", "llevar el auto", "llevar la troca", "appointment", "estimate", "quote", "book", "schedule", "bring my car", "bring my truck"];
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
  function wantsCita(n) { var ut = toks(n); return CITA_K.some(function (ph) { return phraseScore(ph, ut) > 0; }); }
  function looksEnglish(n) { var w = n.split(" "), en = ["the", "my", "is", "do", "you", "what", "how", "car", "truck", "are", "your", "can", "open", "hours", "much", "need", "want", "when", "where", "does", "have", "i", "not"]; var c = w.filter(function (x) { return en.indexOf(x) >= 0; }).length; return c >= 2 && !/[ñ]|\b(el|la|los|mi|que|como|cuanto|tienen|hacen|carro|auto)\b/.test(n); }
  function looksSpanish(n) { return /\b(hola|cuanto|tienen|hacen|ustedes|carro|troca|precio|horario|donde|necesito|quiero|mi carro|mi auto|gracias|cual|transmision|patina)\b/.test(n); }
  function byId(id) { return KB.filter(function (e) { return e.id === id; })[0]; }

  var body, input, status, panel, launch, fileIn, opened = false;
  var flow = null;
  function el(tag, cls, html) { var x = document.createElement(tag); if (cls) x.className = cls; if (html != null) x.innerHTML = html; return x; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function linkify(s) { return esc(s).replace(/972-241-1599/g, '<a href="tel:+19722411599">972-241-1599</a>').replace(/Jaramillos\.trans@gmail\.com/g, '<a href="mailto:Jaramillos.trans@gmail.com">Jaramillos.trans@gmail.com</a>'); }
  function scroll() { body.scrollTop = body.scrollHeight; }
  function addUser(t) { var m = el("div", "r24-msg r24-user"); m.textContent = t; body.appendChild(m); scroll(); }
  function addBot(t, chips, cls) {
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
    status.className = "r24-status r24-nohours";
    status.textContent = L("🕐 Su web no publica horario · responden en 15–30 min «en horario» · aquí le tomo los datos 24 h · " + C.tel, "🕐 No business hours on their site · they reply in 15–30 min \"during business hours\" · I take your details 24/7 · " + C.tel);
  }
  function menuChips() { return [CITA_CHIP, TALLER_CHIP, SVC, HOR, LLAMADA_CHIP]; }
  var banner;
  function headTexts() {
    panel.querySelector(".r24-ht b").innerHTML = L("Recepción 24 h", "24/7 Front Desk") + ' <span class="r24-online">● ' + L("en línea", "online") + "</span>";
    panel.querySelector(".r24-ht small").textContent = C.corto + " · Duncanville, TX";
    panel.querySelector(".r24-in").placeholder = L("Escriba su pregunta…", "Type your question…");
    panel.querySelector(".r24-send").textContent = L("Enviar", "Send");
    panel.querySelector(".r24-lang").textContent = lang === "en" ? "ES" : "EN";
    panel.querySelector(".r24-lang").setAttribute("aria-label", lang === "en" ? "Cambiar a español" : "Switch to English");
    panel.querySelector(".r24-legal").textContent = L("Asistente automático de demostración · sus datos no se envían a ningún sitio", "Automated demo assistant · your data isn't sent anywhere");
    launch.querySelector(".r24-lt").textContent = L("Recepción 24 h", "24/7 Front Desk");
    banner.textContent = L("Demo privada preparada para Jaramillo's Transmission", "Private demo prepared for Jaramillo's Transmission");
    panel.querySelector(".r24-human").textContent = L("👤 Hablar con una persona", "👤 Talk to a person");
  }
  function build() {
    var base = window.R24_BASE || "recepcion/";
    var css = document.createElement("link"); css.rel = "stylesheet"; css.href = base + "recepcion.css"; document.head.appendChild(css);
    banner = el("div", "r24-demo-banner"); banner.setAttribute("role", "note"); document.body.appendChild(banner);
    launch = el("button", "r24-launch", '<img class="r24-face" src="' + base + 'avatar.svg" alt="Recepcionista"><span class="r24-lt"></span><span class="r24-dot"></span>');
    launch.type = "button"; launch.setAttribute("aria-label", L("Abrir la recepción 24 h", "Open the 24/7 front desk")); document.body.appendChild(launch);
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
    addBot(L("Claro. Llame al " + C.tel + " y le atiende una persona del taller (su web no publica el horario de atención). Si prefiere, le llaman ellos: déjeme su nombre y teléfono y el pedido les llega al instante. También puede escribir a " + C.mail + ".",
      "Sure. Call " + C.tel + " and a person from the shop will help you (their site doesn't publish business hours). Or they can call you: leave your name and number and they get the request instantly. You can also email " + C.mail + "."), [TEL(), LLAMADA_CHIP, CITA_CHIP, MAIL()]);
  }
  function greet() {
    addBot(L("¡Hola! 👋 Soy la recepción virtual de Jaramillo's Transmission (Duncanville, DFW). Le ayudo a pedir el diagnóstico gratis o una cotización, le tomo los datos para que el taller lo llame, o le cuento servicios y garantía, a cualquier hora y sin esperar a que contesten el teléfono.\n¿En qué le ayudo?",
      "Hi! 👋 I'm the virtual front desk for Jaramillo's Transmission (Duncanville, DFW). I can set up your free diagnostic or a quote, take your details so the shop calls you back, or answer questions about services and warranty — any time, no waiting on the phone.\nHow can I help?"), menuChips());
  }
  function open(mode) {
    if (mode === "es" || mode === "en") { if (lang !== mode) { lang = mode; headTexts(); } mode = null; }
    panel.classList.add("r24-open"); launch.classList.add("r24-hide"); document.documentElement.classList.add("r24-panel-open"); statusText();
    if (!opened) { opened = true; greet(); }
    if (mode === "llamada" && !flow) setTimeout(function () { addUser(LLAMADA_CHIP.t); startLlamada(); }, 450);
    if (mode === "taller" && !flow) setTimeout(function () { addUser(TALLER_CHIP.t); startTaller(); }, 450);
    if (mode === "cita" && !flow) setTimeout(function () { addUser(CITA_CHIP.t); startCita(); }, 450);
    setTimeout(function () { input.focus(); }, 50);
  }
  function opts(a) { return a.map(function (t) { return { t: t, v: t, flow: true }; }); }
  // «What is your vehicle doing?» (campo de su formulario) con las señales que lista su FAQ
  function SINT() { return lang === "en" ? ["Slipping gears", "Delayed / hard shifting", "Grinding / noise", "Fluid leak", "Warning light", "Won't move / no reverse", "Other"]
    : ["Patina / se resbalan los cambios", "Cambia tarde o con golpes", "Ruido / rechinido", "Fuga de fluido", "Luz de advertencia", "No avanza / sin reversa", "Otro"]; }
  function FOTO() { return [{ t: L("📷 Subir foto", "📷 Upload photo"), foto: true }, { t: L("Sin foto", "No photo"), v: "__nofoto", flow: true }]; }
  function franjas() { return opts([L("Por la mañana", "Morning"), L("Por la tarde", "Afternoon"), L("Me da igual", "Either is fine")]); }
  function startCita() {
    flow = { step: "tipo", d: { tipo: "cita" } };
    addBot(L("¡Con gusto! En unos pasos le dejo el pedido listo para el taller. (Escriba «cancelar» si quiere salir.)\n¿Qué necesita?", "Happy to help! A few quick steps and your request is ready for the shop. (Type \"cancel\" to exit.)\nWhat do you need?"),
      opts([L("Diagnóstico gratis", "Free diagnostic"), L("Cotización de rebuild / reparación", "Rebuild / repair quote"), L("Servicio de fluido", "Fluid service")]));
  }
  function startTaller() {
    flow = { step: "taller", d: { tipo: "taller", servicio: L("🏭 Rebuild por mayoreo (taller)", "🏭 Wholesale rebuild (repair shop)") } };
    addBot(L("Perfecto. Su web dice que trabajan detrás de escena para talleres: ustedes sacan e instalan, ellos reconstruyen, bajo el nombre de su taller y con tarifas de mayoreo. (Escriba «cancelar» si quiere salir.)\n¿Cómo se llama su taller?", "Great. Their site says they work behind the scenes for repair shops: you remove and reinstall, they rebuild, under your shop's name at wholesale rates. (Type \"cancel\" to exit.)\nWhat's the name of your shop?"));
  }
  function startLlamada() {
    flow = { step: "nombre", d: { tipo: "llamada", consulta: (lastQ || L("Consulta general", "General question")).slice(0, 120) } };
    addBot(L("¡Claro! Le llama una persona del taller. Solo necesito dos datos.\n¿Cuál es su nombre? (Escriba «cancelar» si quiere salir.)", "Sure! Someone from the shop will call you. I just need two things.\nWhat's your name? (Type \"cancel\" to exit.)"));
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
  function ask(step) {
    flow.step = step;
    var d = flow.d, n = nowTx();
    if (step === "vehiculo") addBot(d.tipo === "taller" ? L("¿Qué vehículo o unidad es? (año, marca, modelo y motor; por ejemplo: 2015 Honda Civic 2.4L)", "Which vehicle or unit? (year, make, model and engine, e.g. 2015 Honda Civic 2.4L)")
      : L("¿Año, marca y modelo del vehículo? (por ejemplo: 2015 Honda Civic 2.4L)", "Year, make and model of the vehicle? (e.g. 2015 Honda Civic 2.4L)"));
    else if (step === "taller") addBot(L("¿Cómo se llama su taller?", "What's the name of your shop?"));
    else if (step === "sintoma") addBot(d.tipo === "taller" ? L("¿Qué necesita la unidad o qué falla tiene?", "What does the unit need, or what's the failure?") : L("¿Qué está haciendo su vehículo?", "What is your vehicle doing?"), d.tipo === "taller" ? [] : opts(SINT()));
    else if (step === "foto") addBot(L("¿Tiene una foto (del tablero, de la fuga o de la pieza)? Es opcional y ayuda al taller.", "Do you have a photo (of the dashboard, the leak or the part)? It's optional and helps the shop."), FOTO());
    else if (step === "dia") {
      var days = nextDays(n, 6); flow.days = {}; days.forEach(function (x) { flow.days[x.label] = x.dow; });
      addBot(L("¿Qué día le queda mejor para llevarlo? Lo anoto como preferencia y el taller le llama para confirmar: su web no publica qué días ni a qué hora atienden.", "Which day works best to bring it in? I'll note it as a preference and the shop calls you to confirm: their site doesn't publish which days or hours they're open."),
        opts([L("Lo antes posible", "As soon as possible")]).concat(opts(days.map(function (x) { return x.label; }))));
    }
    else if (step === "franja") addBot(L("¿Prefiere mañana o tarde? (el taller le confirma la hora)", "Morning or afternoon? (the shop confirms the time)"), franjas());
    else if (step === "nombre") addBot(L("¿Cuál es su nombre?", "What's your name?"));
    else if (step === "telefono") addBot(d.tipo === "llamada" ? L("Perfecto, " + d.nombre + ". ¿A qué teléfono le llaman?", "Great, " + d.nombre + ". What number should they call?")
      : L("Último paso: ¿a qué teléfono le llaman?", "Last step: what number should they call?"));
    else if (step === "resumen") {
      var B = [{ t: L("✅ Confirmar", "✅ Confirm"), v: "__ok", flow: true }, { t: L("✏️ Corregir", "✏️ Edit"), v: "__fix", flow: true }, { t: L("Cancelar", "Cancel"), v: "cancelar", flow: true }];
      var q = L("\n\n¿Lo confirmo?", "\n\nShall I confirm?"), foto = d.foto ? d.foto : L("sin foto", "no photo");
      if (d.tipo === "llamada") { addBot(L("Revise su solicitud de llamada:\n👤 Nombre: ", "Please review your call-back request:\n👤 Name: ") + d.nombre + L("\n💬 Consulta: ", "\n💬 Question: ") + d.consulta + L("\n📱 Teléfono: ", "\n📱 Phone: ") + d.telefono + "\n\n" + aviso() + q, B, "r24-sum"); return; }
      if (d.tipo === "taller") { addBot(L("Revise su solicitud:\n🧾 Tipo: ", "Please review your request:\n🧾 Type: ") + d.servicio + L("\n🏭 Taller: ", "\n🏭 Shop: ") + d.taller + L("\n🚗 Unidad: ", "\n🚗 Unit: ") + d.vehiculo + L("\n🔧 Qué necesita: ", "\n🔧 What it needs: ") + d.sintoma + L("\n👤 Nombre: ", "\n👤 Name: ") + d.nombre + L("\n📱 Teléfono: ", "\n📱 Phone: ") + d.telefono + "\n\n" + aviso() + q, B, "r24-sum"); return; }
      addBot(L("Revise su solicitud:\n🧾 Tipo: ", "Please review your request:\n🧾 Type: ") + d.servicio + L("\n🚗 Vehículo: ", "\n🚗 Vehicle: ") + d.vehiculo + L("\n🔧 Qué hace: ", "\n🔧 What it's doing: ") + d.sintoma + L("\n📷 Foto: ", "\n📷 Photo: ") + foto + L("\n📅 Día preferido: ", "\n📅 Preferred day: ") + d.dia + L("\n🕐 Franja: ", "\n🕐 Window: ") + d.franja + L("\n👤 Nombre: ", "\n👤 Name: ") + d.nombre + L("\n📱 Teléfono: ", "\n📱 Phone: ") + d.telefono + "\n\n" + aviso() + q, B, "r24-sum");
    }
  }
  function flowInput(t, chip) {
    var n = norm(t), d = flow.d;
    if (/^(cancelar|cancela|salir|dejalo|olvidalo|cancel|stop|exit|quit)$/.test(n)) { flow = null; addBot(L("Sin problema, cancelé la solicitud. ¿Le ayudo con otra cosa?", "No problem, I've cancelled the request. Anything else?"), [CITA_CHIP, TALLER_CHIP, LLAMADA_CHIP]); return; }
    if (/\?/.test(t) && flow.step !== "resumen") {
      var bi = bestIntent(t);
      if (bi && bi.s >= 1) { reply(bi.e); setTimeout(function () { ask(flow.step); }, 700); return; }
    }
    switch (flow.step) {
      case "tipo":
        d.servicio = t.slice(0, 40);
        addBot(/fluid|fluido/.test(n) ? L("Bien. Su web dice que el servicio de fluido y un diagnóstico temprano pueden evitar un rebuild costoso.", "Got it. Their site says fluid service and early diagnostics can prevent a costly rebuild.")
          : L("Bien. Dato de su web: el diagnóstico es gratis (inspección completa y escaneo por computadora) y después le dan una cotización clara de partes y mano de obra.", "Got it. From their site: the diagnostic is free (full inspection and computer scan) and then you get a clear quote for parts and labor."));
        setTimeout(function () { ask("vehiculo"); }, 600); return;
      case "taller": if (t.length < 2) { ask("taller"); return; } d.taller = t.slice(0, 60); ask("vehiculo"); return;
      case "vehiculo":
        if (t.length < 2) { ask("vehiculo"); return; }
        d.vehiculo = t.slice(0, 60); ask("sintoma"); return;
      case "sintoma": d.sintoma = t.slice(0, 100); ask(d.tipo === "taller" ? "nombre" : "foto"); return;
      case "foto":
        if (t !== "__nofoto") d.foto = L("la describe: ", "described: ") + t.slice(0, 60);
        ask("dia"); return;
      case "dia": d.dia = t.slice(0, 60); ask("franja"); return;
      case "franja": d.franja = t.slice(0, 60); ask("nombre"); return;
      case "nombre":
        var nm = t.replace(/^(me llamo|soy|mi nombre es|my name is|i am|i'm|im)\s+/i, "").trim();
        if (nm.length < 2 || nm.length > 60 || /\d/.test(nm)) { addBot(L("¿Me dice su nombre, por favor? (solo el nombre, sin números)", "What's your name, please? (just your name, no numbers)")); return; }
        d.nombre = nm.split(/\s+/).map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join(" ");
        ask("telefono"); return;
      case "telefono":
        var ph = t.replace(/[\s().+-]/g, "");
        if (/^1\d{10}$/.test(ph)) ph = ph.slice(1);
        if (!/^[2-9]\d{9}$/.test(ph)) { addBot(L("Ese número no me cuadra. Escríbalo con 10 cifras (con código de área), por ejemplo 972-555-0123.", "That number doesn't look right. Please use 10 digits with area code, e.g. 972-555-0123.")); return; }
        d.telefono = ph.slice(0, 3) + "-" + ph.slice(3, 6) + "-" + ph.slice(6);
        ask("resumen"); return;
      case "resumen":
        if (t === "__ok" || /^(si|sí|ok|confirmo|confirmar|correcto|dale|yes|confirm|sure|yep)/.test(n)) {
          var nm2 = d.nombre.split(" ")[0], DEMO = L("\n\n(Versión de demostración: esta solicitud no se envió al taller.)", "\n\n(Demo version: this request was not sent to the shop.)");
          if (d.tipo === "llamada") { addBot(L("¡Listo, " + nm2 + "! ✅ El taller recibe su pedido al instante y le llama al " + d.telefono + ".", "All set, " + nm2 + "! ✅ The shop gets your request instantly and will call you at " + d.telefono + ".") + DEMO, [CITA_CHIP, Q("Otra pregunta", "Another question", "__menu", "__menu")]); flow = null; return; }
          if (d.tipo === "taller") { addBot(L("¡Listo, " + nm2 + "! ✅ El taller recibe su pedido al instante y le llama al " + d.telefono + " para coordinar la unidad y la tarifa de mayoreo.", "All set, " + nm2 + "! ✅ The shop gets your request instantly and will call you at " + d.telefono + " to arrange the unit and the wholesale rate.") + DEMO, [MAPS(), Q("Otra pregunta", "Another question", "__menu", "__menu")]); flow = null; return; }
          addBot(L("¡Listo, " + nm2 + "! ✅ Su solicitud quedó registrada.\nEl taller le llama al " + d.telefono + " para confirmar el día y la hora; la cotización se la dan ellos después del diagnóstico gratis.", "All set, " + nm2 + "! ✅ Your request is in.\nThe shop will call you at " + d.telefono + " to confirm the day and time; the quote comes from them after the free diagnostic.") + DEMO, [MAPS(), Q("Otra pregunta", "Another question", "__menu", "__menu")]);
          flow = null; return;
        }
        if (t === "__fix" || /corregir|cambiar|editar|edit|change|^no\b/.test(n)) {
          var keep = d.tipo === "llamada" ? { tipo: "llamada", consulta: d.consulta } : d.tipo === "taller" ? { tipo: "taller", servicio: d.servicio } : { tipo: d.tipo, servicio: d.servicio };
          flow.d = keep; addBot(L("De acuerdo, empezamos de nuevo.", "OK, let's start over."));
          setTimeout(function () { if (keep.tipo === "llamada") ask("nombre"); else if (keep.tipo === "taller") ask("taller"); else ask("vehiculo"); }, 500); return;
        }
        ask("resumen"); return;
    }
  }
  function reply(e) {
    var t = typeof e.a === "function" ? e.a() : e.a;
    addBot(t, (e.c || []).map(function (c) { if (typeof c === "function") c = c(); return c.q ? { t: c.t, v: c.q } : c; }));
  }
  function fallback() {
    addBot(L("Eso se lo confirma mejor el taller, así tiene el dato exacto. 😊\nLlame al " + C.tel + " o déjeme su teléfono y le llaman ellos.",
      "The shop can confirm that for you so you get the exact answer. 😊\nCall " + C.tel + " or leave your number and they'll call you."), [TEL, LLAMADA_CHIP, CITA_CHIP]);
  }
  function handle(t, chip, shown) {
    if (t === "__menu") { addBot(L("Claro, ¿qué más quiere saber?", "Sure, what else would you like to know?"), menuChips()); return; }
    addUser(chip ? (shown || chip.t) : t);
    var n = norm(t);
    if (!chip) { if (lang === "es" && looksEnglish(n)) setLang("en", false); else if (lang === "en" && looksSpanish(n)) setLang("es", false); }
    if (flow) { flowInput(chip && chip.v ? chip.v : t, chip); return; }
    if (chip && chip.a === "cita") { startCita(); return; }
    if (chip && chip.a === "taller") { startTaller(); return; }
    if (chip && chip.a === "llamada") { startLlamada(); return; }
    if (/^(hola|buenas|buenos dias|buenas tardes|hey|hi|hello)\b/.test(n) && n.split(" ").length <= 3) { addBot(L("¡Hola! ¿En qué le puedo ayudar? Le pido el diagnóstico gratis o una cotización, le tomo los datos para que lo llamen y le cuento servicios, garantía y dirección.", "Hi! How can I help? I can request your free diagnostic or a quote, take your details for a call back, and tell you about services, warranty and location."), menuChips()); return; }
    if (/^(horario y direccion|hours and address)$/.test(n)) { addBot(horarioA() + "\n\n" + dirA(), [LLAMADA_CHIP, MAPS, CITA_CHIP]); return; }
    if (/\b(que me llamen|llamenme|call me back|callback|call back)\b/.test(n)) { startLlamada(); return; }
    var bi = bestIntent(t);
    var price = isPriceQ(n);
    if (wantsCita(n) && !price && (!bi || bi.s < 2 || /cita|presupuesto|cotiz|appointment|estimate|quote|schedule|book/.test(n))) { startCita(); return; }
    if (price && !(bi && bi.e.id === "nolist")) { reply(byId("precio")); return; }
    if (bi) { reply(bi.e); return; }
    lastQ = t; fallback();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build); else build();
  window.R24 = { open: open, _test: { bestIntent: bestIntent, norm: norm, nowTx: nowTx, lang: function () { return lang; } } };
})();
