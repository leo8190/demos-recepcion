/* R24-HUMANO-1018 */
/* R24-BRIEF-1018: avatar humano, botones rápidos, "que me llamen", aviso al equipo, sin "no tengo ese dato" */
/* Recepción 24 h · Forrest Collision Center (taller familiar de reparación de choques y carrocería en Phoenix, AZ) — DEMO privada, bilingüe ES/EN.
   Sale de plantilla-widget/recepcion.base.js (reglas del brief 18/10 + R24-HUMANO), en la variante de talleres ES/EN en «usted» (FastGear / Roger's).
   100% del lado del cliente: sin APIs, sin claves, sin envío de datos (la foto se muestra solo en este navegador).
   Respuestas sacadas solo de lo que publica forrestcollision.com (6 páginas + versión de celular, revisadas el 20/10/2026):
   - Forrest Collision Center («Forrest Collision and Sales»), 1729 W Colter St, Phoenix, AZ 85015. Teléfono 602-973-3030 (1 sola línea).
     Correo forrest@forrestcollision.com. Contact Us tiene un formulario de HubSpot en inglés. Sin WhatsApp. «¡Hablamos Español!».
   - Horario de oficina: lunes a viernes 8:00 am–5:00 pm; sábado 9:00 am–12:00 pm; domingo «Close» (hora de Arizona, America/Phoenix,
     sin horario de verano).
   - Servicios: reparación de carrocería, pintura (igualan la de fábrica, pinturas Sherwin), abolladuras (con limpieza a fondo al devolverlo);
     «24/7 towing», ayuda con reclamos al seguro, instalación de vidrios, granizo, ventanillas o parabrisas, carrocería completa, renta de
     autos; «FLEET PRICING AVAILABLE» (sin precios). Garantía de por vida en carrocería y pintura / en todas las reparaciones (sin condiciones
     publicadas). FAQ: en Arizona usted elige el taller; ayudan con el deducible; taller preferido, trabajan con todo tipo de seguros, en el
     negocio desde 1995; coordinan que recojan el vehículo y lo guardan en su predio seguro. Presupuesto GRATIS; plazos: «pregúntenos al recibir
     el presupuesto». Familiar, más de 25 años. Empresas hermanas: Forrest Equipment Rentals y Desert Forrest Nursery.
   Sin precios (la recepción no da ninguno), sin WhatsApp; la grúa: su web dice «24/7 towing», pero la recepción no la promete (solo anota si
   el vehículo anda, está parado o necesita grúa y el taller confirma); seguro y aseguradora: solo se anotan; garantía: sin condiciones;
   financiamiento, formas de pago, plazos, atención sin cita ni nada que su web no diga → «su web no lo dice». No nombra a nadie. */
(function () {
  "use strict";
  var C = {
    nombre: "Forrest Collision Center", corto: "Forrest Collision Center",
    dir: "1729 W Colter St, Phoenix, AZ 85015", maps: "https://www.google.com/maps/dir/?api=1&destination=Forrest+Collision+Center+1729+W+Colter+St+Phoenix+AZ+85015",
    tel: "602-973-3030", telh: "+16029733030",
    email: "forrest@forrestcollision.com"
  };
  var qlang = (location.search.match(/[?&]lang=(es|en)\b/) || [])[1];
  var lang = qlang || ((window.R24_LANG === "auto" ? ((navigator.language || "en").slice(0, 2) === "es" ? "es" : "en") : (window.R24_LANG || "es")).slice(0, 2) === "en" ? "en" : "es");
  function L(es, en) { return lang === "en" ? en : es; }
  // Horario de oficina publicado (minutos desde las 0:00, hora de Arizona). 0 = domingo: cerrado («Sunday: Close»). Sábado: 9:00 a 12:00.
  var LV = [[480, 1020]], SA = [[540, 720]];
  var H = { 1: LV, 2: LV, 3: LV, 4: LV, 5: LV, 6: SA, 0: [] };
  var DIAS = { es: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"], en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] };
  var MESES = { es: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"], en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] };
  function horarioTxt() {
    return L("Horario de oficina que publica el taller (hora de Arizona):\n• Lunes a viernes: 8:00 a.m. – 5:00 p.m.\n• Sábado: 9:00 a.m. – 12:00 p.m.\n• Domingo: cerrado",
      "Office hours the shop publishes (Arizona time):\n• Monday–Friday: 8:00 AM – 5:00 PM\n• Saturday: 9:00 AM – 12:00 PM\n• Sunday: closed");
  }
  var HCORTO = { es: "lunes a viernes de 8 a 5 y sábado de 9 a 12", en: "Mon–Fri 8–5, Sat 9–12" };
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

  var CITA_CHIP = { a: "cita", get t() { return L("🚗 Pedir presupuesto por choque", "🚗 Collision estimate"); } };
  var LLAMADA_CHIP = { a: "llamada", get t() { return L("📲 Que me llamen o escriban", "📲 Call or text me back"); } };
  function aviso() { return L("🔔 El taller recibe este pedido al instante (en esta demo no se envía nada).", "🔔 The shop gets this request instantly (nothing is sent in this demo)."); }
  var lastQ = "";
  function TEL1() { return { t: L("Llamar al " + C.tel, "Call " + C.tel), tel: C.telh }; }
  function MAPS1() { return { t: L("📍 Cómo llegar", "📍 Get directions"), url: C.maps }; }
  function Q(es, en, qes, qen) { return { get t() { return L(es, en); }, get q() { return L(qes || es, qen || en); } }; }
  var SVC = Q("🛠️ Servicios", "🛠️ Services", "servicios", "services");
  var HOR = Q("🕐 Horario y dirección", "🕐 Hours & location", "horario y direccion", "hours and location");
  var CHOQUE = Q("💥 Acabo de chocar", "💥 I just had an accident", "acabo de chocar", "i just had an accident");
  var SEGURO = Q("🛡️ Seguro y deducible", "🛡️ Insurance & deductible", "seguro y deducible", "insurance and deductible");
  function dirA() { return L("Están en " + C.dir + ".\n📞 " + C.tel, "They're at " + C.dir + ".\n📞 " + C.tel); }
  function horarioA() {
    var n = nowTx(), s = isOpen(n) ? L("🟢 Ahora la oficina está abierta, hasta las " + hm(closeAt(n)) + ".", "🟢 The office is open now, until " + hm(closeAt(n)) + ".")
      : L("🌙 Ahora la oficina está cerrada" + (n.dow === 0 ? " (domingo)" : "") + "; abre " + nextOpening(n) + ". Igual le tomo el pedido ahora y el taller lo recibe al instante.", "🌙 The office is closed right now" + (n.dow === 0 ? " (Sunday)" : "") + "; it opens " + nextOpening(n) + ". I can still take your request now and the shop gets it instantly.");
    return horarioTxt() + "\n" + s;
  }
  function serviciosA() {
    return L("Lo que publica el taller (reparación de choques, negocio familiar con más de 25 años en Phoenix):\n• Reparación de carrocería (mucho trabajo de carrocería o abolladuras)\n• Pintura de carrocería: igualan la de fábrica, con pinturas Sherwin\n• Reparación de abolladuras (con limpieza a fondo al devolverle el vehículo)\n• Daños por granizo\n• Instalación de vidrios; cambio de ventanillas o parabrisas\n• Ayuda con los reclamos al seguro\n• Grúa «24/7» y renta de autos\nDice además que todos sus trabajos de carrocería y pintura tienen garantía de por vida y que el presupuesto es GRATIS. ¿Qué le pasó a su vehículo?",
      "What the shop lists (collision repair, family-owned, 25+ years in Phoenix):\n• Auto body repair (extensive body work or dent correction)\n• Auto body painting: they match factory paint, using Sherwin paints\n• Dent repair (with a thorough detailing when you get the vehicle back)\n• Hail damage repair\n• Glass installations; window or windshield replacements\n• Insurance claims assistance\n• 24/7 towing and car rentals\nTheir site also says all body & paint jobs come with a lifetime warranty and the estimate is FREE. What happened to your vehicle?");
  }
  function noListA() {
    return L("Eso su web no lo nombra en particular. Sí dice que su equipo está preparado para «todo tipo de reparaciones de autos», pero lo que detalla es carrocería, pintura, abolladuras, granizo y vidrios, así que no se lo voy a asegurar: se lo confirma el taller. Llame al " + C.tel + " (" + hc() + "), o déjeme su teléfono y le contactan ellos.",
      "Their site doesn't name that specifically. It does say their team handles \"all types of automotive repairs\", but what it details is body work, paint, dents, hail and glass, so I won't promise it: the shop will confirm. Call " + C.tel + " (" + hc() + "), or leave your number and they'll get back to you.");
  }
  function noPubA() {
    return L("Eso su web no lo dice, así que no se lo voy a inventar: se lo confirma el taller. Llame al " + C.tel + " (" + hc() + "), o déjeme su teléfono y le contactan ellos.",
      "Their site doesn't say, so I won't make it up: the shop will confirm. Call " + C.tel + " (" + hc() + "), or leave your number and they'll get back to you.");
  }
  function S(es, en) { return function () { return L(es, en); }; }
  function gruaA() { var n = nowTx(); return L("Lo siento. Su web dice que tienen grúa «24/7» y que coordinan que recojan su vehículo (y hasta guardarlo en su predio seguro), pero si se la pueden mandar, cuándo y cuánto cuesta lo confirma el taller: no se lo voy a prometer. Lo que sí hago: le dejo el pedido con el vehículo marcado como parado (o que necesita grúa) y el taller le llama o le escribe." + (isOpen(n) ? " Ahora la oficina está abierta: también puede llamar al " + C.tel + "." : " Ahora la oficina está cerrada (abre " + nextOpening(n) + "); su web publica un solo teléfono, el " + C.tel + ", y su pedido le llega igual al instante."),
      "Sorry to hear that. Their site says they offer 24/7 towing and can coordinate picking up your vehicle (and even store it in their secure facility), but whether they can send a tow, when, and what it costs, the shop has to confirm, so I won't promise it. What I can do: log your request with the vehicle marked as down (or needing a tow) and the shop calls or texts you back." + (isOpen(n) ? " The office is open now: you can also call " + C.tel + "." : " The office is closed now (opens " + nextOpening(n) + "); their site lists one phone number, " + C.tel + ", and your request still reaches them instantly.")); }
  var KB = [
    { id: "accidente", k: ["acabo de chocar", "choque", "chocaron", "me chocaron", "accidente", "tuve un accidente", "que hago", "que hacer", "consejos", "heridos", "policia", "just had an accident", "accident", "crash", "crashed", "wreck", "what should i do", "tips", "injured", "police"],
      a: S("Lo siento mucho. Lo primero, según los consejos de su web: quédese en el lugar, fíjese que todos estén bien y llame a una ambulancia si hace falta; si hay heridos graves, avise a la policía sin perder tiempo. Intercambie licencia, registro y seguro con el otro conductor, anote testigos, daños, fecha, hora y lugar, y avise a su agente de seguros. Cuando pueda, le dejo pedido el presupuesto: vehículo, daño, foto y seguro, y el taller le contacta.",
        "I'm sorry. First, per the tips on their site: stay at the scene, make sure everyone is OK and call an ambulance if needed; if someone is badly hurt, report it to the police right away. Exchange license, registration and insurance with the other driver, note witnesses, damage, date, time and place, and tell your insurance agent. When you're ready, I can request the estimate: vehicle, damage, a photo and insurance, and the shop gets back to you."), c: [CITA_CHIP, Q("🚛 Necesito grúa", "🚛 I need a tow", "necesito grua", "i need a tow"), LLAMADA_CHIP] },
    { id: "nomaneja", k: ["no arranca", "no prende", "no anda", "varado", "varada", "me quede", "emergencia", "urgente", "grua", "necesito grua", "remolque", "remolcar", "recoger el carro", "recoger mi auto", "won t start", "wont start", "not running", "stranded", "broke down", "emergency", "urgent", "tow", "towing", "i need a tow", "tow truck", "pick up my car", "pickup"], a: gruaA, c: [CITA_CHIP, LLAMADA_CHIP, TEL1] },
    { id: "carroceria", k: ["carroceria", "chapa", "hojalateria", "golpe", "golpes", "abolladura", "abolladuras", "abollado", "defensa", "parachoques", "facia", "puerta", "body work", "auto body", "body shop", "dent", "dents", "bumper", "fender", "fender bender", "door", "collision repair"],
      a: S("Sí: es lo suyo. Su web dice que reparan carrocería y abolladuras «sin importar qué tan grande sea», que le dejan el auto como recién salido de la agencia, que al devolverlo le hacen una limpieza a fondo y que todos sus trabajos de carrocería y pintura tienen garantía de por vida. Qué hay que hacer en su auto se lo dice el taller al verlo (o con una foto). ¿Le dejo pedido el presupuesto?",
        "Yes, that's what they do. Their site says they repair body damage and dents \"no matter the severity\", bring the car back to showroom condition, do a thorough detailing when you get it back, and that all body & paint jobs come with a lifetime warranty. What your car needs, the shop tells you when they see it (or from a photo). Want me to request the estimate?"), c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "pintura", k: ["pintura", "pintar", "rayon", "rayones", "rayado", "color", "paint", "painting", "scratch", "scratches", "scratched", "repaint"],
      a: S("Sí: pintura de carrocería. Su web dice que igualan la pintura de fábrica, pero con mayor y mejor durabilidad, porque usan pinturas Sherwin, y que la pintura tiene garantía de por vida. ¿Le dejo pedido el presupuesto? Con una foto del daño le ayuda al taller.",
        "Yes: auto body painting. Their site says they match factory paint with increased and better durability, since they use Sherwin paints, and that paint jobs come with a lifetime warranty. Want me to request the estimate? A photo of the damage helps the shop."), c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "granizo", k: ["granizo", "granizada", "hail", "hail damage"],
      a: S("Sí: su web lista la reparación de daños por granizo. Cuánto trabajo lleva se lo dice el taller al ver el vehículo o las fotos. ¿Le dejo pedido el presupuesto?",
        "Yes: their site lists hail damage repair. How much work it takes, the shop tells you after seeing the vehicle or photos. Want me to request the estimate?"), c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "vidrios", k: ["vidrio", "vidrios", "parabrisas", "ventanilla", "ventanillas", "cristal", "luna", "glass", "windshield", "window", "windows"],
      a: S("Sí: su web lista la instalación completa de vidrios y el cambio de ventanillas o parabrisas. Qué vidrio lleva su vehículo y cuándo se lo confirma el taller. ¿Le dejo pedido el presupuesto?",
        "Yes: their site lists full-service glass installations and window or windshield replacements. Which glass your vehicle needs and when, the shop confirms. Want me to request the estimate?"), c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "seguro", k: ["seguro", "aseguradora", "reclamo", "reclamar", "siniestro", "ajustador", "deducible", "geico", "progressive", "state farm", "allstate", "farmers", "elegir taller", "otro taller", "insurance", "claim", "adjuster", "deductible", "choose my shop", "any shop", "insurer"],
      a: S("Su web dice que le ayudan con el reclamo al seguro y, si usted lo permite, trabajan con su aseguradora y se encargan del papeleo; que son un taller preferido y trabajan con todo tipo de seguros; que en Arizona usted puede elegir el taller que quiera; y que ayudan con el deducible. Cuánto cubre su seguro o cuánto sería el deducible no lo publica: se lo dice el taller. En el pedido anoto si va por seguro y cuál.",
        "Their site says they help with insurance claims and, if you allow it, work with your insurer and handle the paperwork; that they're a preferred body shop that works with all types of insurance; that in Arizona you can choose any body shop; and that they offer deductible assistance. What your policy covers or what the deductible would be isn't published: the shop tells you. In the request I note whether it's an insurance claim and which company."), c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "renta", k: ["renta", "rentar", "auto de reemplazo", "carro de reemplazo", "auto de cortesia", "carro de cortesia", "rental", "rent a car", "loaner", "car rental"],
      a: S("Su web lista «Car rentals» (renta de autos) entre sus servicios, pero no dice condiciones, costos ni si va con el seguro: eso se lo confirma el taller. Si quiere, lo anoto en su pedido.",
        "Their site lists car rentals among its services, but doesn't say terms, cost or whether insurance covers it: the shop confirms. I can note it in your request."), c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "flota", k: ["flota", "flotas", "flotilla", "empresa", "camiones de la empresa", "fleet", "fleet pricing", "company cars", "business vehicles"],
      a: S("Su web dice «FLEET PRICING AVAILABLE» (precios especiales para flotas) y pide llamar para más información. Esta recepción no da precios: se los da el taller al " + "602-973-3030" + ". Si quiere, le dejo pedido que le llamen.",
        "Their site says \"FLEET PRICING AVAILABLE\" and asks you to call for more information. This front desk doesn't quote prices: the shop does, at 602-973-3030. I can have them call you."), c: [TEL1, LLAMADA_CHIP] },
    { id: "nolist", k: ["frenos", "motor", "aceite", "cambio de aceite", "transmision", "aire acondicionado", "a c", "bateria", "llantas", "alineacion", "suspension", "afinacion", "check engine", "luz del motor", "mecanica", "brakes", "engine", "oil change", "transmission", "air conditioning", "ac", "battery", "tires", "alignment", "suspension", "tune up", "mechanic"], a: noListA, c: [TEL1, LLAMADA_CHIP, CITA_CHIP] },
    { id: "servicios", k: ["servicios", "que hacen", "que reparan", "que arreglan", "trabajos", "taller", "services", "what do you fix", "what do you do", "repairs"], a: serviciosA, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "precio", k: ["precio", "precios", "cuanto cuesta", "cuanto sale", "cuanto cobran", "costo", "caro", "barato", "descuento", "presupuesto gratis", "es gratis", "price", "prices", "how much", "cost", "cheap", "rates", "discount", "free estimate"],
      a: S("Los precios se los da el taller: esta recepción no da precios ni los inventa, y su web no publica ninguno (sí dice que el presupuesto es GRATIS). Lo que puedo hacer: dejarle pedido el presupuesto con su vehículo, el daño y una foto, y le contactan en español o en inglés.",
        "Pricing comes from the shop: this front desk doesn't quote or make up prices, and their site doesn't publish any (it does say the estimate is FREE). What I can do: request the estimate with your vehicle, the damage and a photo, and they'll get back to you in English or Spanish."), c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "garantia", k: ["garantia", "garantias", "garantizan", "de por vida", "warranty", "guarantee", "guaranteed", "lifetime"],
      a: S("Su web dice que todos sus trabajos de carrocería y pintura tienen garantía de por vida (y en las preguntas frecuentes, que la dan en todos sus servicios). Las condiciones no las publica, así que no se las voy a inventar: se las confirma el taller al " + "602-973-3030" + ".",
        "Their site says all body & paint jobs come with a lifetime warranty (and its FAQ says the lifetime guarantee covers all their services). It doesn't publish the terms, so I won't make them up: the shop will confirm at 602-973-3030."), c: [TEL1, LLAMADA_CHIP, CITA_CHIP] },
    { id: "plazo", k: ["cuanto tarda", "cuanto tiempo", "cuantos dias", "para cuando", "cuando esta listo", "mismo dia", "how long", "how long take", "repair take", "long take", "cuanto demora", "cuanto tardan", "how many days", "when will it be ready", "same day", "timeline"],
      a: S("Su web no da plazos: dice que quieren devolverle el auto reparado lo antes posible y que les pregunte los tiempos cuando reciba su presupuesto GRATIS. Así que no se los voy a inventar: se los da el taller al ver el daño.",
        "Their site doesn't give timeframes: it says they want your car fixed as quickly as possible and to ask them for a timeline when you get your FREE estimate. So I won't make one up: the shop tells you after seeing the damage."), c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "nopub", k: ["financiamiento", "financiar", "a plazos", "credito", "zelle", "efectivo", "tarjeta", "formas de pago", "como pago", "financing", "finance", "credit", "cash", "card", "payment"], a: noPubA, c: [TEL1, LLAMADA_CHIP] },
    { id: "walkin", k: ["sin cita", "walk in", "walk-in", "puedo ir", "puedo llegar", "llegar sin avisar", "necesito cita", "dejar el carro", "without appointment", "drop by", "stop by", "drop off", "need an appointment"],
      a: S("Su web no dice si atienden sin cita; lo que publica es el teléfono 602-973-3030, el correo y el horario de oficina (lunes a viernes de 8 a 5, sábado de 9 a 12). Para no ir en balde, le dejo aquí pedido el presupuesto y el taller le confirma, o llame al 602-973-3030.",
        "Their site doesn't say whether they take walk-ins; it lists the phone 602-973-3030, the email and office hours (Mon–Fri 8–5, Sat 9–12). To be safe, I can request the estimate here and the shop confirms, or call 602-973-3030."), c: [CITA_CHIP, TEL1] },
    { id: "idioma", k: ["espanol", "hablan espanol", "ingles", "spanish", "english", "speak spanish", "bilingue", "bilingual", "hablamos"],
      a: S("Sí: su web dice «¡Hablamos Español!». El teléfono es uno solo, el 602-973-3030. Aquí también le atiendo en los dos idiomas (botón EN arriba).",
        "Yes: their site says \"¡Hablamos Español!\" (we speak Spanish). There's one phone number, 602-973-3030. I can help you in English or Spanish too (ES button at the top)."), c: [CITA_CHIP, TEL1] },
    { id: "historia", k: ["dueno", "quien", "quienes son", "experiencia", "historia", "confianza", "familia", "familiar", "desde cuando", "anos", "owner", "who", "experience", "trust", "family", "since when", "years"],
      a: S("Forrest Collision Center (también «Forrest Collision and Sales») es una empresa local y familiar de reparación de choques con más de 25 años en el área de Phoenix; en sus preguntas frecuentes dice que están en el negocio desde 1995 y que son un taller preferido. Sus empresas hermanas son Forrest Equipment Rentals y Desert Forrest Nursery.",
        "Forrest Collision Center (also \"Forrest Collision and Sales\") is a local, family-owned collision repair company serving the Phoenix Metro Area for over 25 years; its FAQ says they've been in business since 1995 and are a preferred body shop. Sister companies: Forrest Equipment Rentals and Desert Forrest Nursery."), c: [CITA_CHIP, HOR] },
    { id: "horario", k: ["horario", "horas", "abren", "abierto", "cierran", "a que hora", "sabado", "domingo", "fin de semana", "lunes", "hoy abren", "hours", "open", "close", "closing", "saturday", "sunday", "weekend"], a: horarioA, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "direccion", k: ["donde", "direccion", "ubicacion", "ubicados", "como llego", "llegar", "colter", "address", "location", "where", "directions", "located"],
      a: function () { return dirA() + L("\nSi quiere, le dejo pedido el presupuesto y el taller le confirma.", "\nI can request the estimate and the shop confirms."); }, c: [MAPS1, CITA_CHIP] },
    { id: "contacto", k: ["telefono", "telefonos", "numero", "llamar", "contacto", "correo", "email", "mail", "whatsapp", "wasap", "watsap", "texto", "mensaje de texto", "sms", "formulario", "phone", "number", "call", "text", "contact", "form"],
      a: S("Canales que publica el taller:\n📞 602-973-3030 (oficina: lunes a viernes de 8:00 a.m. a 5:00 p.m., sábado de 9:00 a.m. a 12:00 p.m.)\n✉️ Correo: forrest@forrestcollision.com\n📝 Un formulario en inglés en su página «Contact Us».\nSu web no publica WhatsApp. O deje aquí su teléfono y le contactan ellos, por llamada o por texto.",
        "Channels the shop publishes:\n📞 602-973-3030 (office: Mon–Fri 8:00 AM – 5:00 PM, Sat 9:00 AM – 12:00 PM)\n✉️ Email: forrest@forrestcollision.com\n📝 A form on their \"Contact Us\" page.\nTheir site doesn't list WhatsApp. Or leave your number here and they'll reach out, by call or text."), c: [TEL1, LLAMADA_CHIP] },
    { id: "gracias", k: ["gracias", "muchas gracias", "perfecto", "adios", "thanks", "thank you", "bye", "great"], a: S("¡Con gusto! Si necesita algo más, aquí estoy. 🚗", "You're welcome! I'm here if you need anything else. 🚗"), c: [CITA_CHIP] }
  ];
  var CITA_K = ["cita", "presupuesto", "cotizacion", "cotizar", "estimado", "estimacion", "agendar", "reservar", "turno", "programar", "llevar el carro", "llevar mi carro", "llevar mi auto", "appointment", "estimate", "quote", "book", "schedule", "bring my car"];
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
  function looksEnglish(n) { var w = n.split(" "), en = ["the", "my", "is", "do", "you", "what", "how", "car", "truck", "are", "your", "can", "open", "hours", "much", "need", "want", "when", "where", "does", "have", "i", "not", "won", "start", "just", "had"]; var c = w.filter(function (x) { return en.indexOf(x) >= 0; }).length; return c >= 2 && !/[ñ]|\b(el|la|los|mi|que|como|cuanto|tienen|hacen|carro|auto|camioneta)\b/.test(n); }
  function looksSpanish(n) { return /\b(hola|cuanto|tienen|hacen|ustedes|carro|camioneta|troca|precio|horario|donde|necesito|quiero|mi carro|mi auto|gracias|cual|choque|chocar|chocaron|seguro|pintura|abolladura|granizo|grua|espanol)\b/.test(n); }
  function byId(id) { return KB.filter(function (e) { return e.id === id; })[0]; }

  var body, input, status, panel, launch, fileIn, opened = false;
  var flow = null;
  function el(tag, cls, html) { var x = document.createElement(tag); if (cls) x.className = cls; if (html != null) x.innerHTML = html; return x; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function linkify(s) { return esc(s).replace(/\(?602\)?[- ]973-3030/g, function (m) { return '<a href="tel:+16029733030">' + m + '</a>'; }).replace(/forrest@forrestcollision\.com/g, '<a href="mailto:forrest@forrestcollision.com">forrest@forrestcollision.com</a>'); }
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
  }  function statusText() {
    var n = nowTx();
    if (isOpen(n)) { status.className = "r24-status"; status.textContent = L("🟢 Oficina abierta · hasta las " + hm(closeAt(n)) + " · " + C.tel, "🟢 Office open · until " + hm(closeAt(n)) + " · " + C.tel); }
    else { status.className = "r24-status r24-closed"; status.textContent = L("🌙 Oficina cerrada (abre " + nextOpening(n) + ") · le atiendo igual y el taller recibe su pedido", "🌙 Office closed (opens " + nextOpening(n) + ") · I'll still take your request"); }
  }
  function menuChips() { return [CITA_CHIP, CHOQUE, SEGURO, SVC, HOR, LLAMADA_CHIP]; }
  var banner;
  function headTexts() {
    panel.querySelector(".r24-ht b").innerHTML = L("Recepción 24 h", "24/7 Front Desk") + ' <span class="r24-online">● ' + L("en línea", "online") + "</span>";
    panel.querySelector(".r24-ht small").textContent = C.corto + " · Phoenix, AZ";
    panel.querySelector(".r24-in").placeholder = L("Escriba su pregunta…", "Type your question…");
    panel.querySelector(".r24-send").textContent = L("Enviar", "Send");
    panel.querySelector(".r24-lang").textContent = lang === "en" ? "ES" : "EN";
    panel.querySelector(".r24-lang").setAttribute("aria-label", lang === "en" ? "Cambiar a español" : "Switch to English");
    panel.querySelector(".r24-legal").textContent = L("Asistente automático de demostración · sus datos no se envían a ningún sitio", "Automated demo assistant · your data isn't sent anywhere");
    launch.querySelector(".r24-lt").textContent = L("Recepción 24 h", "24/7 Front Desk");
    launch.setAttribute("aria-label", L("Abrir la recepción 24 h", "Open the 24/7 front desk"));
    banner.textContent = L("Demo privada preparada para Forrest Collision Center", "Private demo prepared for Forrest Collision Center");
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
    var n = nowTx(), ab = isOpen(n);
    addBot(L((ab ? "Claro. Ahora la oficina está abierta: llame al " + C.tel + " y le atiende una persona (su web dice «¡Hablamos Español!»)." : "Claro. Ahora la oficina está cerrada" + (n.dow === 0 ? " (el domingo no abren)" : "") + "; abre " + nextOpening(n) + ". En horario de oficina puede llamar al " + C.tel + " (su web dice «¡Hablamos Español!»).") + " Si prefiere, le contactan ellos: déjeme su nombre y teléfono y el pedido les llega al instante.",
      (ab ? "Sure. The office is open now: call " + C.tel + " and a person will help you, in English or Spanish." : "Sure. The office is closed right now" + (n.dow === 0 ? " (closed on Sunday)" : "") + "; it opens " + nextOpening(n) + ". During office hours you can call " + C.tel + ", in English or Spanish.") + " Or they can reach out to you: leave your name and number and they get the request instantly."), [TEL1(), LLAMADA_CHIP, CITA_CHIP]);
  }
  function greet() {
    addBot(L("¡Hola! 👋 Soy el asistente virtual con IA de Forrest Collision Center (taller familiar de reparación de choques y carrocería en Phoenix, AZ). Le ayudo a pedir un presupuesto por choque, golpe, pintura, granizo o vidrios, le tomo los datos para que el taller lo llame o le escriba, en español o en inglés, o le cuento servicios, seguro, horario y dirección, a cualquier hora: también de noche y el domingo, cuando la oficina está cerrada.\n¿En qué le ayudo?",
      "Hi! 👋 I'm the AI virtual assistant for Forrest Collision Center (family-owned collision and body repair in Phoenix, AZ). I can request an estimate for a collision, dent, paint, hail or glass, take your details so the shop calls or texts you back, in English or Spanish, or answer questions about services, insurance, hours and location — any time, including nights and Sundays, when the office is closed.\nHow can I help?"), menuChips());
  }
  function open(mode) {
    if (mode === "es" || mode === "en") { if (lang !== mode) { lang = mode; headTexts(); } mode = null; }
    panel.classList.add("r24-open"); launch.classList.add("r24-hide"); document.documentElement.classList.add("r24-panel-open"); statusText();
    if (!opened) { opened = true; greet(); }
    if (mode === "llamada" && !flow) setTimeout(function () { addUser(LLAMADA_CHIP.t); startLlamada(); }, 450);
    if (mode === "cita" && !flow) setTimeout(function () { addUser(CITA_CHIP.t); startCita(); }, 450);
    setTimeout(function () { input.focus(); }, 50);
  }
  function opts(a) { return a.map(function (t) { return { t: t, v: t, flow: true }; }); }
  // Qué daño tiene, con lo que publica su web
  function DANIO() { return lang === "en" ? ["Collision / crash damage", "Dent / ding", "Scratch / paint", "Hail damage", "Glass / windshield", "Other / not sure"]
    : ["Choque / golpe", "Abolladura", "Rayón / pintura", "Granizo", "Vidrio / parabrisas", "Otra cosa / no sé"]; }
  function SEGUROS() { return opts([L("🛡️ Sí, por mi seguro", "🛡️ Yes, my insurance"), L("🛡️ Sí, por el seguro del otro", "🛡️ Yes, the other driver's insurance"), L("💵 No, lo pago yo", "💵 No, I'm paying myself"), L("No sé todavía", "Not sure yet")]); }
  function IDIOMAS() { return opts([L("🇲🇽 En español", "🇲🇽 In Spanish"), L("🇺🇸 En inglés", "🇺🇸 In English"), L("Me da igual", "Either is fine")]); }
  function ESTADO() { return opts([L("✅ Anda, puedo llevarlo", "✅ It runs, I can drive it in"), L("⚠️ Anda, pero con daño", "⚠️ It runs, but it's damaged"), L("⛔ No anda / está parado", "⛔ Won't run / it's down"), L("🚛 Necesita grúa", "🚛 Needs a tow")]); }
  function FOTO() { return [{ t: L("📷 Subir foto", "📷 Upload photo"), foto: true }, { t: L("Sin foto", "No photo"), v: "__nofoto", flow: true }]; }
  function MEDIO() { return opts([L("📞 Llamada", "📞 Phone call"), L("💬 Mensaje de texto", "💬 Text message")]); }
  function franjas(dow) {
    if (dow === 6) return opts([L("Sábado 9:00 a.m. – 12:00 p.m.", "Saturday 9:00 AM – 12:00 PM")]);
    return opts([L("Mañana (8:00 a.m. – 12:00 p.m.)", "Morning (8:00 AM – 12:00 PM)"), L("Tarde (12:00 – 5:00 p.m.)", "Afternoon (12:00 – 5:00 PM)"), L("Me da igual", "Either is fine")]);
  }
  function startCita() {
    flow = { step: "tipo", d: { tipo: "cita" } };
    addBot(L("¡Con gusto! En unos pasos le dejo el pedido listo para el taller. (Escriba «cancelar» si quiere salir.)\n¿Qué necesita?", "Happy to help! A few quick steps and your request is ready for the shop. (Type \"cancel\" to exit.)\nWhat do you need?"),
      opts([L("Presupuesto por choque / carrocería", "Collision / body estimate"), L("Llevar el vehículo (cita)", "Bring the vehicle in (appointment)")]));
  }
  function startLlamada() {
    flow = { step: "nombre", d: { tipo: "llamada", consulta: (lastQ || L("Consulta general", "General question")).slice(0, 120) } };
    addBot(L("¡Claro! Le contacta una persona del taller, por llamada o por mensaje de texto. Solo necesito unos datos.\n¿Cuál es su nombre? (Escriba «cancelar» si quiere salir.)", "Sure! Someone from the shop will reach out by phone call or text. I just need a few details.\nWhat's your name? (Type \"cancel\" to exit.)"));
  }
  function fotoRecibida(f) {
    var d = flow.d; d.foto = f.name.slice(0, 40);
    var m = el("div", "r24-msg r24-user r24-photo"); var im = new Image(); im.alt = "foto"; im.style.cssText = "max-width:160px;max-height:120px;display:block;border-radius:8px;margin-bottom:4px";
    try { im.src = URL.createObjectURL(f); } catch (e) {}
    m.appendChild(im); m.appendChild(document.createTextNode("📷 " + d.foto)); body.appendChild(m); scroll();
    var w = body.querySelectorAll(".r24-chips"); if (w.length) w[w.length - 1].remove();
    addBot(L("📷 Foto recibida (en esta demo no sale de su teléfono).", "📷 Photo received (in this demo it never leaves your phone)."));
    setTimeout(function () { ask("seguro"); }, 600);
  }
  function medioTxt(d) { return d.medio || L("Llamada", "Phone call"); }
  function ask(step) {
    flow.step = step;
    var d = flow.d, n = nowTx();
    if (step === "vehiculo") addBot(L("¿Año, marca y modelo del vehículo? (por ejemplo: 2016 Honda Accord)", "Year, make and model? (e.g. 2016 Honda Accord)"));
    else if (step === "danio") addBot(L("¿Qué daño tiene?", "What kind of damage is it?"), opts(DANIO()));
    else if (step === "foto") { if (d.foto) { ask("seguro"); return; } addBot(L("¿Tiene una foto del daño? Es opcional y ayuda al taller a preparar el presupuesto.", "Do you have a photo of the damage? It's optional and helps the shop prepare the estimate."), FOTO()); }
    else if (step === "seguro") addBot(L("¿Va por seguro? (Solo lo anoto para el taller.)", "Is this going through insurance? (I just note it for the shop.)"), SEGUROS());
    else if (step === "aseguradora") addBot(L("¿Qué compañía de seguros? (Solo la anoto; lo que cubre se lo confirma el taller con su seguro.)", "Which insurance company? (I just note it; what's covered, the shop confirms with your insurer.)"), opts([L("No sé todavía", "Not sure yet")]));
    else if (step === "estado") addBot(L("¿El vehículo anda o está parado? (Solo lo anoto para el taller: si hace falta grúa, se lo confirma el taller.)", "Does the vehicle run, or is it down? (I just note it for the shop: if it needs a tow, the shop will confirm.)"), ESTADO());
    else if (step === "idioma") addBot(L("¿En qué idioma prefiere que le atiendan? (Su web dice «¡Hablamos Español!».)", "Which language would you like them to use? (Their site says \"¡Hablamos Español!\".)"), IDIOMAS());
    else if (step === "dia") {
      var days = nextWorkdays(n, 6); flow.days = {}; days.forEach(function (x) { flow.days[x.label] = x.dow; });
      addBot(L("¿Qué día le queda mejor para que vean el vehículo? Lo anoto como preferencia y el taller se lo confirma. La oficina abre de lunes a viernes de 8:00 a.m. a 5:00 p.m. y el sábado de 9:00 a.m. a 12:00 p.m.; el domingo, cerrado.", "Which day works best for them to see the vehicle? I'll note it as a preference and the shop confirms. The office is open Monday–Friday 8:00 AM – 5:00 PM and Saturday 9:00 AM – 12:00 PM; closed Sunday."),
        opts(days.map(function (x) { return x.label; })).concat(opts([L("Lo antes posible", "As soon as possible")])));
    }
    else if (step === "franja") addBot(L("¿En qué franja?", "What time window?"), franjas(d.dow));
    else if (step === "nombre") addBot(L("¿Cuál es su nombre?", "What's your name?"));
    else if (step === "medio") addBot(L("Gracias, " + d.nombre + ". ¿Prefiere que le llamen o que le manden un mensaje de texto?", "Thanks, " + d.nombre + ". Would you rather get a call or a text?"), MEDIO());
    else if (step === "telefono") addBot(d.tipo === "llamada" ? L("Perfecto. ¿A qué teléfono le " + (/texto/i.test(medioTxt(d)) ? "escriben" : "llaman") + "?", "Great. What number should they " + (/text/i.test(medioTxt(d)) ? "text" : "call") + "?") : L("Último paso: ¿a qué teléfono le contactan para confirmar?", "Last step: what number should they use to confirm?"));
    else if (step === "resumen") {
      var B = [{ t: L("✅ Confirmar", "✅ Confirm"), v: "__ok", flow: true }, { t: L("✏️ Corregir", "✏️ Edit"), v: "__fix", flow: true }, { t: L("Cancelar", "Cancel"), v: "cancelar", flow: true }];
      var q = L("\n\n¿Lo confirmo?", "\n\nShall I confirm?"), foto = d.foto ? d.foto : L("sin foto", "no photo");
      if (d.tipo === "llamada") { addBot(L("Revise su solicitud de contacto:\n👤 Nombre: ", "Please review your contact request:\n👤 Name: ") + d.nombre + L("\n💬 Consulta: ", "\n💬 Question: ") + d.consulta + L("\n🗣️ Idioma: ", "\n🗣️ Language: ") + d.idioma + L("\n📲 Cómo: ", "\n📲 How: ") + medioTxt(d) + L("\n📱 Teléfono: ", "\n📱 Phone: ") + d.telefono + "\n\n" + aviso() + q, B, "r24-sum"); return; }
      addBot(L("Revise su solicitud:\n🧾 Tipo: ", "Please review your request:\n🧾 Type: ") + d.servicio + L("\n🚗 Vehículo: ", "\n🚗 Vehicle: ") + d.vehiculo + L("\n💥 Daño: ", "\n💥 Damage: ") + d.danio + L("\n📷 Foto: ", "\n📷 Photo: ") + foto + L("\n🛡️ Seguro: ", "\n🛡️ Insurance: ") + d.seguro + (d.aseguradora ? L(" (" + d.aseguradora + ")", " (" + d.aseguradora + ")") : "") + L("\n🚦 Estado: ", "\n🚦 Status: ") + d.estado + L("\n🗣️ Idioma: ", "\n🗣️ Language: ") + d.idioma + L("\n📅 Día: ", "\n📅 Day: ") + d.dia + L("\n🕐 Franja: ", "\n🕐 Window: ") + d.franja + L("\n👤 Nombre: ", "\n👤 Name: ") + d.nombre + L("\n📲 Cómo: ", "\n📲 How: ") + medioTxt(d) + L("\n📱 Teléfono: ", "\n📱 Phone: ") + d.telefono + "\n\n" + aviso() + q, B, "r24-sum");
    }
  }
  function idiomaDe(t) { return /ingl|english/i.test(t) ? L("Inglés", "English") : (/espa|spanish/i.test(t) ? L("Español", "Spanish") : L("Me da igual", "Either")); }
  function flowInput(t, chip) {
    var n = norm(t), d = flow.d;
    if (/^(cancelar|cancela|salir|dejalo|olvidalo|cancel|stop|exit|quit)$/.test(n)) { flow = null; addBot(L("Sin problema, cancelé la solicitud. ¿Le ayudo con otra cosa?", "No problem, I've cancelled the request. Anything else?"), [CITA_CHIP, HOR, LLAMADA_CHIP]); return; }
    if (/\?/.test(t) && flow.step !== "resumen") {
      var bi = bestIntent(t);
      if (bi && bi.s >= 1) { reply(bi.e); setTimeout(function () { ask(flow.step); }, 700); return; }
    }
    switch (flow.step) {
      case "tipo":
        d.servicio = t.slice(0, 40);
        addBot(/cita|appointment|llevar|bring/.test(n) ? L("Bien. Le anoto el día que prefiere y el taller se lo confirma. Aquí no doy precios: el presupuesto (GRATIS, según su web) se lo da el taller.", "Got it. I'll note your preferred day and the shop confirms. I don't quote prices here: the estimate (FREE, per their site) comes from the shop.")
          : L("Bien. Aquí no doy precios: el presupuesto (GRATIS, según su web) se lo da el taller después de ver los datos, las fotos o el vehículo.", "Got it. I don't quote prices here: the estimate (FREE, per their site) comes from the shop after reviewing the details, photos or the vehicle."));
        setTimeout(function () { ask("vehiculo"); }, 600); return;
      case "vehiculo":
        if (t.length < 2) { ask("vehiculo"); return; }
        d.vehiculo = t.slice(0, 60); ask("danio"); return;
      case "danio": d.danio = t.slice(0, 100); ask("foto"); return;
      case "foto":
        if (t !== "__nofoto") d.foto = L("la describe: ", "described: ") + t.slice(0, 60);
        ask("seguro"); return;
      case "seguro":
        d.seguro = t.replace(/^[^\wÁÉÍÓÚáéíóúÑñ]+/, "").slice(0, 50);
        if (/^(si|yes)\b/.test(n)) { ask("aseguradora"); return; }
        ask("estado"); return;
      case "aseguradora":
        d.aseguradora = t.slice(0, 40);
        addBot(L("Anotado. Su web dice que, si usted lo permite, trabajan con su aseguradora y se encargan del papeleo; lo que cubre se lo confirma el taller.", "Noted. Their site says that, if you allow it, they work with your insurer and handle the paperwork; what's covered, the shop confirms."));
        setTimeout(function () { ask("estado"); }, 600); return;
      case "estado":
        d.estado = t.slice(0, 50);
        if (/parad|no anda|grua|down|won.t run|tow/i.test(n)) addBot(L("Anotado: el taller ve en el pedido que el vehículo " + (/grua|tow/i.test(n) ? "necesita grúa" : "no anda o está parado") + " y le dice cómo llevarlo. Su web dice que tienen grúa «24/7», pero si se la pueden mandar y cuándo lo confirma el taller: no se lo prometo.", "Noted: the shop will see the vehicle " + (/grua|tow/i.test(n) ? "needs a tow" : "won't run or is down") + " and tell you how to get it there. Their site says they offer 24/7 towing, but whether and when they can send it, the shop confirms: I won't promise it."));
        setTimeout(function () { ask("idioma"); }, /parad|grua|down|tow|anda|run/i.test(n) ? 700 : 0); return;
      case "idioma":
        d.idioma = idiomaDe(t);
        if (d.tipo === "llamada") { ask("medio"); return; }
        ask("dia"); return;
      case "dia":
        d.dia = t.slice(0, 60); d.dow = flow.days && flow.days[t] != null ? flow.days[t] : -1;
        if (/^(lo antes posible|as soon as possible)$/i.test(t)) { d.franja = L("La primera disponible", "First available"); ask(d.nombre ? "medio" : "nombre"); return; }
        if (/domingo|sunday/i.test(t)) { addBot(L("El domingo la oficina está cerrada. ¿Otro día?", "The office is closed on Sunday. Another day?")); setTimeout(function () { ask("dia"); }, 500); return; }
        if (d.dow === 6) { d.franja = L("Sábado 9:00 a.m. – 12:00 p.m.", "Saturday 9:00 AM – 12:00 PM"); addBot(L("El sábado la oficina abre solo de 9:00 a.m. a 12:00 p.m.; lo anoto en esa franja.", "On Saturday the office is open only 9:00 AM – 12:00 PM; I'll note that window.")); setTimeout(function () { ask(d.nombre ? "medio" : "nombre"); }, 500); return; }
        ask("franja"); return;
      case "franja": d.franja = t.slice(0, 60); ask(d.nombre ? "medio" : "nombre"); return;
      case "nombre":
        var nm = t.replace(/^(me llamo|soy|mi nombre es|my name is|i am|i'm|im)\s+/i, "").trim();
        if (nm.length < 2 || nm.length > 60 || /\d/.test(nm)) { addBot(L("¿Me dice su nombre, por favor? (solo el nombre, sin números)", "What's your name, please? (just your name, no numbers)")); return; }
        d.nombre = nm.split(/\s+/).map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join(" ");
        if (d.tipo === "llamada" && !d.idioma) { ask("idioma"); return; }
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
          var en1 = /Ingl|English/.test(d.idioma), es1 = /Espa|Spanish/.test(d.idioma), idm = en1 ? L(" en inglés", " in English") : (es1 ? L(" en español", " in Spanish") : "");
          if (d.tipo === "llamada") { addBot(L("¡Listo, " + nm2 + "! ✅ El taller recibe su pedido al instante y le " + (tx ? "escribe" : "llama") + idm + " al " + d.telefono + ".", "All set, " + nm2 + "! ✅ The shop gets your request instantly and will " + (tx ? "text" : "call") + " you" + idm + " at " + d.telefono + ".") + DEMO, [CITA_CHIP, Q("Otra pregunta", "Another question", "__menu", "__menu")]); flow = null; return; }
          addBot(L("¡Listo, " + nm2 + "! ✅ Su solicitud quedó registrada en Forrest Collision Center.\nEl taller le " + (tx ? "escribe" : "llama") + idm + " al " + d.telefono + " para confirmar el día y la hora; el presupuesto y lo del seguro se los dan ellos.", "All set, " + nm2 + "! ✅ Your request is in at Forrest Collision Center.\nThe shop will " + (tx ? "text" : "call") + " you" + idm + " at " + d.telefono + " to confirm the day and time; the estimate and the insurance details come from them.") + DEMO, [MAPS1(), Q("Otra pregunta", "Another question", "__menu", "__menu")]);
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
    addBot(L("Eso se lo confirma mejor el taller, así tiene el dato exacto. 😊\nLlame al " + C.tel + " (" + hc() + "), o déjeme su teléfono y le contactan ellos.",
      "The shop can confirm that for you so you get the exact answer. 😊\nCall " + C.tel + " (" + hc() + "), or leave your number and they'll get back to you."), [TEL1, LLAMADA_CHIP, CITA_CHIP]);
  }
  function handle(t, chip, shown) {
    if (t === "__menu") { addBot(L("Claro, ¿qué más quiere saber?", "Sure, what else would you like to know?"), menuChips()); return; }
    addUser(chip ? (shown || chip.t) : t);
    var n = norm(t);
    if (!chip) { if (lang === "es" && looksEnglish(n)) setLang("en", false); else if (lang === "en" && looksSpanish(n)) setLang("es", false); }
    if (flow) { flowInput(chip && chip.v ? chip.v : t, chip); return; }
    if (chip && chip.a === "cita") { startCita(); return; }
    if (chip && chip.a === "llamada") { startLlamada(); return; }
    if (/^(hola|buenas|buenos dias|buenas tardes|hey|hi|hello)\b/.test(n) && n.split(" ").length <= 3) { addBot(L("¡Hola! ¿En qué le puedo ayudar? Le pido un presupuesto por choque, le tomo los datos para que lo llamen o le escriban y le cuento servicios, seguro, horario y dirección.", "Hi! How can I help? I can request a collision estimate, take your details for a call or text back, and tell you about services, insurance, hours and location."), menuChips()); return; }
    if (/^(horario y direccion|hours and location)$/.test(n)) { addBot(horarioA() + "\n\n" + dirA(), [CITA_CHIP, MAPS1, LLAMADA_CHIP]); return; }
    if (/^(seguro y deducible|insurance and deductible)$/.test(n)) { reply(byId("seguro")); return; }
    if (/\b(que me llamen|llamenme|que me escriban|escribanme|textean|call me back|text me|callback|call back)\b/.test(n)) { startLlamada(); return; }
    if (/\b(persona|humano|alguien real|asesor|person|human|someone real|real person)\b/.test(n)) { humano(); return; }
    if (isWalkinQ(n)) { reply(byId("walkin")); return; }
    var bi = bestIntent(t);
    var price = isPriceQ(n);
    if (wantsCita(n) && !price && !(bi && bi.e && bi.e.id === "precio" && /\?|es gratis|is it free|sin compromiso|no obligation/.test(t)) && (!bi || bi.s < 2 || /cita|presupuesto|cotiz|appointment|estimate|quote|schedule|book/.test(n))) { startCita(); return; }
    if (price && !(bi && (bi.e.id === "nolist" || bi.e.id === "flota"))) { reply(byId("precio")); return; }
    if (bi) { reply(bi.e); return; }
    lastQ = t; fallback();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build); else build();
  window.R24 = { open: open, setLang: function (l) { if (panel) setLang(l === "en" ? "en" : "es", opened); }, _test: { bestIntent: bestIntent, norm: norm, nowTx: nowTx, lang: function () { return lang; } } };
})();
