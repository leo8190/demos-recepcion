/* R24-HUMANO-1018 */
/* R24-BRIEF-1018: avatar humano, botones rápidos, "que me llamen", aviso al equipo, sin "no tengo ese dato" */
/* Recepción 24 h · Giuseppe Auto Repair (taller mecánico, 13873 SW 142nd Ave, Miami FL 33186, West Kendall) — DEMO privada, bilingüe ES/EN.
   100% del lado del cliente: sin APIs, sin claves, sin envío de datos (la foto se muestra solo en este navegador).
   Respuestas sacadas solo de lo que publica www.giuseppeautorepair.com (oct. 2026; en inglés con «Se habla español»): home, A/C, Suspension, Brakes,
   General Mechanic, Electrical Repairs, Gallery, Contact Us.
   - Teléfono 786-868-3110. Email emiliomartinez215@hotmail.com (en su web solo está en los datos para Google; el botón «Email» lleva al formulario).
     Facebook, Instagram, TikTok y Google. No publican WhatsApp.
   - Horario (pie y panel «Useful Info» de todas las páginas): lunes a viernes 7 am – 6 pm, sábado 7 am – 2 pm, domingo cerrado.
     El texto de la página Contacto dice solo «Mon–Fri 7am–6pm» (no menciona el sábado): la demo usa el horario del pie y lo avisa.
   - Taller con técnicos ASE certificados, 12 años; todas las marcas y modelos (autos y camionetas), especialidad en europeos: BMW, Audi, Mercedes-Benz y
     Porsche. Servicios: A/C, suspensión, frenos, mecánica general (diagnóstico de motor, mantenimiento de rutina), reparaciones eléctricas.
     Atienden The Hammocks, Kendall West, Country Walk, Three Lakes y todo Kendall.
   Sin precios (la web no publica ninguno), sin WhatsApp, sin grúa, sin llantas. Español en «usted». */
(function () {
  "use strict";
  var C = {
    nombre: "Giuseppe Auto Repair", corto: "Giuseppe Auto Repair",
    tel: "786-868-3110", telh: "+17868683110", mail: "emiliomartinez215@hotmail.com",
    dir: "13873 SW 142nd Ave, Miami, FL 33186", maps: "https://maps.google.com/?q=Giuseppe+Auto+Repair,+13873+SW+142nd+Ave,+Miami,+FL+33186"
  };
  var qlang = (location.search.match(/[?&]lang=(es|en)\b/) || [])[1];
  var lang = qlang || ((window.R24_LANG === "auto" ? ((navigator.language || "en").slice(0, 2) === "es" ? "es" : "en") : (window.R24_LANG || "es")).slice(0, 2) === "en" ? "en" : "es");
  function L(es, en) { return lang === "en" ? en : es; }
  var ES = /(^|\/)es-[^\/]*$/.test(location.pathname);
  // Horario (minutos desde las 0:00, hora de Miami). 0 = domingo.
  var LV = [[420, 1080]];
  var H = { 1: LV, 2: LV, 3: LV, 4: LV, 5: LV, 6: [[420, 840]], 0: [] };
  var DIAS = { es: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"], en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] };
  var MESES = { es: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"], en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] };
  function horarioTxt() {
    return L("Horario que publica el taller (al pie de todas sus páginas):\n• Lunes a viernes: 7:00 am – 6:00 pm\n• Sábado: 7:00 am – 2:00 pm\n• Domingo: cerrado\nOjo: el texto de su página de Contacto dice solo «Mon–Fri 7am–6pm» y no menciona el sábado; si piensa ir un sábado, conviene confirmarlo al " + C.tel + ".",
      "Shop hours (at the bottom of every page on their site):\n• Monday–Friday: 7:00 am – 6:00 pm\n• Saturday: 7:00 am – 2:00 pm\n• Sunday: closed\nNote: the text on their Contact page only says \"Mon–Fri 7am–6pm\" and doesn't mention Saturday; if you're planning a Saturday visit, check with the shop at " + C.tel + ".");
  }
  function nowTx() {
    var q = (location.search.match(/[?&]r24now=([^&]+)/) || [])[1];
    if (q) { var p = decodeURIComponent(q).match(/(\d+)-(\d+)-(\d+)T(\d+):(\d+)/);
      if (p) return { y: +p[1], m: +p[2] - 1, d: +p[3], dow: new Date(+p[1], +p[2] - 1, +p[3]).getDay(), min: +p[4] * 60 + +p[5] }; }
    var f = new Intl.DateTimeFormat("en-GB", { timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false });
    var o = {}; f.formatToParts(new Date()).forEach(function (x) { o[x.type] = x.value; });
    var y = +o.year, m = +o.month - 1, d = +o.day;
    return { y: y, m: m, d: d, dow: new Date(y, m, d).getDay(), min: (+o.hour % 24) * 60 + +o.minute };
  }
  function hm(min) { var h = Math.floor(min / 60), mm = ("0" + (min % 60)).slice(-2), ap = h >= 12 ? "pm" : "am"; h = h % 12 || 12; return h + ":" + mm + " " + ap; }
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
    if (isOpen(n) && closeAt(n) - n.min >= 90) out.push({ dow: n.dow, label: L("Hoy", "Today") });
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

  var CITA_CHIP = { a: "cita", get t() { return L("🔧 Presupuesto o cita", "🔧 Estimate or appointment"); } };
  var EURO_CHIP = { a: "euro", get t() { return L("🏁 Mi auto es europeo (BMW, Audi, Mercedes, Porsche)", "🏁 European car (BMW, Audi, Mercedes, Porsche)"); } };
  var LLAMADA_CHIP = { a: "llamada", get t() { return L("📲 Que me llamen", "📲 Call me back"); } };
  function aviso() { return L("🔔 El equipo del taller recibe este pedido al instante (en esta demo no se envía nada).", "🔔 The shop team gets this request instantly (nothing is sent in this demo)."); }
  var lastQ = "";
  function TEL() { return { t: L("Llamar al ", "Call ") + C.tel, tel: C.telh }; }
  function MAIL() { return { t: "✉️ " + C.mail, url: "mailto:" + C.mail, self: true }; }
  function MAPS() { return { t: L("Cómo llegar (Google Maps)", "Directions (Google Maps)"), url: C.maps }; }
  function PAGE(es, en, f) { return function () { return { t: L(es, en), url: (ES ? "es-" : "") + f, self: true }; }; }
  var ACP = PAGE("Ver la página de A/C", "See the A/C page", "ac.html");
  var SUSP = PAGE("Ver la página de suspensión", "See the suspension page", "suspension.html");
  var FREP = PAGE("Ver la página de frenos", "See the brakes page", "brakes.html");
  var MECP = PAGE("Ver «General Mechanic»", "See \"General Mechanic\"", "general-mechanic.html");
  var ELEP = PAGE("Ver la página de electricidad", "See the electrical page", "electrical-repairs.html");
  function Q(es, en, qes, qen) { return { get t() { return L(es, en); }, get q() { return L(qes || es, qen || en); } }; }
  var SVC = Q("🛠️ Servicios", "🛠️ Services", "servicios", "services");
  var HOR = Q("🕐 Horario y dirección", "🕐 Hours & address", "horario y direccion", "hours and address");
  function dirA() { return L("📍 " + C.dir + " (West Kendall). Su web dice que atienden a conductores de The Hammocks, Kendall West, Country Walk, Three Lakes y todo Kendall.", "📍 " + C.dir + " (West Kendall). Their site says they serve drivers from The Hammocks, Kendall West, Country Walk, Three Lakes and all of Kendall."); }
  function horarioA() {
    var n = nowTx(), s = isOpen(n) ? L("🟢 Ahora están abiertos, hasta las " + hm(closeAt(n)) + ".", "🟢 They're open now, until " + hm(closeAt(n)) + ".") : L("🌙 Ahora está cerrado; abre " + nextOpening(n) + ". Igual le tomo el pedido ahora y el taller lo recibe al instante.", "🌙 It's closed right now; opens " + nextOpening(n) + ". I can still take your request now and the shop gets it instantly.");
    return horarioTxt() + "\n" + s;
  }
  function serviciosA() {
    return L("Lo que publica el taller (técnicos ASE certificados, 12 años, todas las marcas y modelos de autos y camionetas):\n• A/C del auto (diagnóstico y reparación)\n• Suspensión\n• Frenos\n• Mecánica general: diagnóstico de motor y mantenimiento de rutina\n• Reparaciones eléctricas (cableado y sistemas electrónicos)\n• Especialidad en europeos: BMW, Audi, Mercedes-Benz y Porsche\n¿Qué le pasa a su auto?",
      "What the shop lists (ASE certified technicians, 12 years, all makes and models of cars and trucks):\n• Car A/C (diagnosis and repair)\n• Suspension\n• Brakes\n• General mechanic: engine diagnosis and routine maintenance\n• Electrical repairs (wiring and electronic systems)\n• European specialists: BMW, Audi, Mercedes-Benz and Porsche\nWhat's going on with your car?");
  }
  function noListA() {
    return L("Eso no aparece entre los servicios de su web, así que no se lo voy a asegurar. Llame al " + C.tel + " o déjeme su teléfono y le llaman ellos para confirmarlo.",
      "That isn't among the services on their website, so I won't promise it. Call " + C.tel + " or leave your number and they'll call you to confirm.");
  }
  var KB = [
    { id: "ac", k: ["aire", "aire acondicionado", "ac", "no enfria", "no enfría", "calor", "clima", "freon", "gas del aire", "compresor", "air conditioning", "air conditioner", "a/c", "not cold", "not cooling", "blowing hot", "compressor", "refrigerant"],
      a: function () { return L("Sí: el A/C es uno de sus servicios. Su web dice que sus técnicos ASE certificados, con más de 12 años de experiencia, diagnostican y reparan el aire de autos y camionetas de todas las marcas, con especialidad en europeos («Escape the Miami heat»). Si quiere, le dejo pedido el presupuesto ahora.", "Yes: A/C is one of their services. Their site says their ASE certified technicians, with over 12 years of experience, diagnose and repair A/C on cars and trucks of all makes, with a European specialty (\"Escape the Miami heat\"). I can request your estimate right now."); }, c: [CITA_CHIP, ACP, LLAMADA_CHIP] },
    { id: "suspension", k: ["suspension", "suspensión", "amortiguador", "amortiguadores", "golpea", "golpeteo", "brinca", "rebota", "alineacion", "direccion dura", "shocks", "struts", "bumps", "bouncing", "clunk", "rough ride", "control arm"],
      a: function () { return L("Sí: hacen reparación de suspensión en europeos (BMW, Audi, Mercedes-Benz, Porsche) y en cualquier otra marca. Su web dice que diagnostican el problema para que el auto vuelva a andar suave y cómodo.", "Yes: they do suspension repair on European cars (BMW, Audi, Mercedes-Benz, Porsche) and any other make. Their site says they diagnose the issue so your car rides smooth and comfortable again."); }, c: [CITA_CHIP, SUSP, LLAMADA_CHIP] },
    { id: "frenos", k: ["freno", "frenos", "pastillas", "balatas", "discos", "rechinan", "chillan", "vibra al frenar", "pedal", "abs", "brake", "brakes", "pads", "rotors", "squeak", "squealing", "grinding brakes"],
      a: function () { return L("Sí: reparación de frenos para autos y camionetas, europeos y de todas las marcas. Su web pone su seguridad primero: diagnostican y resuelven el problema de frenos. Le dejo el pedido listo si quiere.", "Yes: brake repair for cars and trucks, European and all other makes. Their site puts your safety first: they diagnose and fix brake issues. I can set up the request for you."); }, c: [CITA_CHIP, FREP, LLAMADA_CHIP] },
    { id: "electrico", k: ["electrico", "eléctrico", "electricidad", "electrica", "no arranca", "no prende", "bateria", "batería", "alternador", "cables", "cableado", "luces", "fusible", "sensor", "computadora", "electrical", "electric", "won t start", "wont start", "battery", "alternator", "wiring", "fuse", "lights"],
      a: function () { return L("Sí: hacen reparaciones eléctricas del auto, «desde el cableado hasta los sistemas electrónicos avanzados», en europeos y en todas las marcas. El taller lo revisa y le dice qué tiene.", "Yes: they do auto electrical repairs, \"from intricate wiring to advanced electronic systems\", on European cars and all makes. The shop checks it and tells you what's wrong."); }, c: [CITA_CHIP, ELEP, LLAMADA_CHIP] },
    { id: "mecanica", k: ["motor", "luz del motor", "check engine", "testigo", "diagnostico", "diagnóstico", "escaneo", "falla", "ruido", "humo", "se calienta", "mantenimiento", "cambio de aceite", "aceite", "afinacion", "engine", "check engine light", "diagnosis", "diagnostic", "noise", "smoke", "overheating", "maintenance", "oil change", "tune up", "tune-up", "general repair"],
      a: function () { return L("Sí: su página «General Mechanic» habla de reparaciones para todos los autos y camionetas, desde el mantenimiento de rutina hasta diagnosticar problemas complejos de motor. Lo que no detalla (por ejemplo, qué incluye cada servicio) se lo confirma el taller.", "Yes: their \"General Mechanic\" page covers repairs for all cars and trucks, from routine maintenance to diagnosing complex engine issues. Anything it doesn't spell out (like what each service includes) the shop can confirm."); }, c: [CITA_CHIP, MECP, LLAMADA_CHIP] },
    { id: "euro", k: ["europeo", "europeos", "bmw", "audi", "mercedes", "mercedes benz", "benz", "porsche", "mini", "volkswagen", "vw", "european", "german", "aleman"],
      a: function () { return L("Sí: es su especialidad. Su web dice que su equipo se especializa en marcas europeas de lujo: BMW, Audi, Mercedes-Benz y Porsche, con reparaciones y mantenimiento a la medida de cada modelo. Le dejo el pedido con su modelo si quiere.", "Yes, it's their specialty. Their site says their team specializes in European luxury brands: BMW, Audi, Mercedes-Benz and Porsche, with repairs and maintenance tailored to each model. I can set up the request with your model."); }, c: [EURO_CHIP, CITA_CHIP, LLAMADA_CHIP] },
    { id: "marcas", k: ["marca", "marcas", "toyota", "honda", "ford", "chevrolet", "chevy", "nissan", "hyundai", "kia", "jeep", "dodge", "ram", "camioneta", "troca", "pickup", "make", "makes", "model", "truck", "suv"],
      a: function () { return L("Sí: su web dice que atienden todas las marcas y modelos, «desde autos compactos hasta camionetas grandes», aunque su especialidad son los europeos.", "Yes: their site says they handle all makes and models, \"from compact cars to full-size trucks\", although their specialty is European cars."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "ase", k: ["certificados", "certificado", "ase", "experiencia", "anos", "garantia", "garantía", "confianza", "certified", "experience", "years", "warranty", "guarantee"],
      a: function () { return L("Su web dice que sus técnicos son ASE certificados y que llevan 12 años reparando todas las marcas. No publica condiciones de garantía: eso se lo confirma el taller.", "Their site says their technicians are ASE certified and they've been repairing all makes for 12 years. It doesn't publish warranty terms: the shop can confirm that."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "chapa", k: ["carroceria", "chapa", "pintura", "choque", "abolladura", "golpe en la puerta", "body work", "bodywork", "paint", "collision", "dent"],
      a: function () { return L("Su página principal menciona «precision bodywork» al hablar de autos europeos, pero no figura entre sus servicios, así que no se lo voy a asegurar. Mejor que se lo confirme el taller: llame al " + C.tel + " o le llaman ellos.", "Their homepage mentions \"precision bodywork\" when talking about European cars, but it isn't among their listed services, so I won't promise it. Best to confirm with the shop: call " + C.tel + " or they can call you."); }, c: [TEL, LLAMADA_CHIP, CITA_CHIP] },
    { id: "nolist", k: ["llantas", "llanta", "gomas", "neumaticos", "grua", "remolque", "transmision", "reconstruir transmision", "moto", "motos", "vidrios", "parabrisas", "tires", "tire", "tow", "towing", "transmission rebuild", "motorcycle", "windshield", "glass", "detailing"], a: noListA, c: [TEL, LLAMADA_CHIP, CITA_CHIP] },
    { id: "servicios", k: ["servicios", "que hacen", "que reparan", "que arreglan", "trabajos", "services", "what do you fix", "what do you do", "repairs"], a: serviciosA, c: [CITA_CHIP, EURO_CHIP, LLAMADA_CHIP] },
    { id: "precio", k: ["precio", "precios", "cuanto cuesta", "cuanto sale", "cuanto cobran", "costo", "caro", "barato", "descuento", "tarifa", "price", "prices", "how much", "cost", "cheap", "rates", "discount", "cheaper"],
      a: function () { return L("Los precios se los da el taller: su web no publica precios (en su formulario hay una opción «Question about prices»). Lo que sí hago: le dejo pedido el presupuesto con su auto y lo que le pasa, y el taller lo llama.", "Pricing comes from the shop: their site doesn't publish prices (their form has a \"Question about prices\" option). What I can do: request the estimate with your car and what's going on, and the shop calls you."); }, c: [CITA_CHIP, TEL, LLAMADA_CHIP] },
    { id: "idioma", k: ["espanol", "español", "hablan espanol", "ingles", "inglés", "spanish", "english", "speak spanish", "bilingue"],
      a: function () { return L("Sí: su web dice «Se habla español». Aquí le atiendo en español o en inglés (botón EN arriba).", "Yes: their site says \"Se habla español\" (Spanish spoken). I can help you in English or Spanish (ES button at the top)."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "horario", k: ["horario", "horas", "abren", "abierto", "cierran", "a que hora", "sabado", "domingo", "lunes", "hoy", "hours", "open", "close", "closing", "saturday", "sunday", "weekend", "today"], a: horarioA, c: [CITA_CHIP, LLAMADA_CHIP, TEL] },
    { id: "direccion", k: ["donde", "dirección", "direccion", "ubicacion", "ubicados", "como llego", "llegar", "kendall", "west kendall", "hammocks", "country walk", "three lakes", "miami", "virginia gardens", "address", "location", "where", "directions", "located"],
      a: function () { return dirA() + "\n" + horarioTxt().split("\n").slice(0, 4).join("\n"); }, c: [MAPS, CITA_CHIP, LLAMADA_CHIP] },
    { id: "contacto", k: ["telefono", "teléfono", "numero", "llamar", "contacto", "correo", "email", "mail", "whatsapp", "wasap", "watsap", "texto", "mensaje de texto", "sms", "facebook", "instagram", "tiktok", "phone", "number", "call", "text", "contact"],
      a: function () { return L("Canales que publica el taller:\n📞 Teléfono: " + C.tel + "\n✉️ Email: " + C.mail + "\nTambién tienen Facebook, Instagram y TikTok (@giusepperepair) y un formulario de contacto. No publican WhatsApp. O deje aquí su teléfono y le llaman ellos.", "Channels the shop publishes:\n📞 Phone: " + C.tel + "\n✉️ Email: " + C.mail + "\nThey're also on Facebook, Instagram and TikTok (@giusepperepair) and have a contact form. They don't list WhatsApp. Or leave your number here and they'll call you."); }, c: [TEL, MAIL, LLAMADA_CHIP] },
    { id: "gracias", k: ["gracias", "muchas gracias", "perfecto", "adios", "thanks", "thank you", "bye", "great"], a: function () { return L("¡Con gusto! Si necesita algo más, aquí estoy. 🔧", "You're welcome! I'm here if you need anything else. 🔧"); }, c: [CITA_CHIP] }
  ];
  var CITA_K = ["cita", "presupuesto", "cotizacion", "cotizar", "estimado", "agendar", "reservar", "turno", "llevar el carro", "llevar mi carro", "llevar el auto", "llevar mi auto", "appointment", "estimate", "quote", "book", "schedule", "bring my car", "bring my truck"];
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
  function looksSpanish(n) { return /\b(hola|cuanto|tienen|hacen|ustedes|carro|precio|horario|donde|necesito|quiero|mi carro|mi auto|gracias|cual|frenos|aire)\b/.test(n); }
  function byId(id) { return KB.filter(function (e) { return e.id === id; })[0]; }

  var body, input, status, panel, launch, fileIn, opened = false;
  var flow = null;
  function el(tag, cls, html) { var x = document.createElement(tag); if (cls) x.className = cls; if (html != null) x.innerHTML = html; return x; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function linkify(s) { return esc(s).replace(/786-868-3110/g, '<a href="tel:+17868683110">786-868-3110</a>').replace(/emiliomartinez215@hotmail\.com/g, '<a href="mailto:emiliomartinez215@hotmail.com">emiliomartinez215@hotmail.com</a>'); }
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
    var n = nowTx();
    if (isOpen(n)) { status.className = "r24-status"; status.textContent = L("🟢 Abierto ahora · hasta las " + hm(closeAt(n)) + " · " + C.tel, "🟢 Open now · until " + hm(closeAt(n)) + " · " + C.tel); }
    else { status.className = "r24-status r24-closed"; status.textContent = L("🌙 Fuera de horario (abre " + nextOpening(n) + ") · le atiendo igual y el taller recibe su pedido", "🌙 After hours (opens " + nextOpening(n) + ") · I'll still take your request"); }
  }
  function menuChips() { return [CITA_CHIP, EURO_CHIP, SVC, HOR, LLAMADA_CHIP]; }
  var banner;
  function headTexts() {
    panel.querySelector(".r24-ht b").innerHTML = L("Recepción 24 h", "24/7 Front Desk") + ' <span class="r24-online">● ' + L("en línea", "online") + "</span>";
    panel.querySelector(".r24-ht small").textContent = C.corto + " · West Kendall, Miami FL";
    panel.querySelector(".r24-in").placeholder = L("Escriba su pregunta…", "Type your question…");
    panel.querySelector(".r24-send").textContent = L("Enviar", "Send");
    panel.querySelector(".r24-lang").textContent = lang === "en" ? "ES" : "EN";
    panel.querySelector(".r24-lang").setAttribute("aria-label", lang === "en" ? "Cambiar a español" : "Switch to English");
    panel.querySelector(".r24-legal").textContent = L("Asistente automático de demostración · sus datos no se envían a ningún sitio", "Automated demo assistant · your data isn't sent anywhere");
    launch.querySelector(".r24-lt").textContent = L("Recepción 24 h", "24/7 Front Desk");
    banner.textContent = L("Demo privada preparada para Giuseppe Auto Repair", "Private demo prepared for Giuseppe Auto Repair");
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
    var n = nowTx(), ab = isOpen(n);
    addBot(L((ab ? "Claro. Ahora están abiertos: llame al " + C.tel + " y le atiende una persona del taller." : "Claro. Ahora el taller está cerrado (abre " + nextOpening(n) + "); puede llamar al " + C.tel + " en horario.") + " Si prefiere, le llaman ellos: déjeme su nombre y teléfono y el pedido les llega al instante. También puede escribir a " + C.mail + ".",
      (ab ? "Sure. They're open now: call " + C.tel + " and a person from the shop will help you." : "Sure. The shop is closed right now (opens " + nextOpening(n) + "); you can call " + C.tel + " during business hours.") + " Or they can call you: leave your name and number and they get the request instantly. You can also email " + C.mail + "."), [TEL(), LLAMADA_CHIP, CITA_CHIP, MAIL()]);
  }
  function greet() {
    addBot(L("¡Hola! 👋 Soy la recepción virtual de Giuseppe Auto Repair (West Kendall, Miami). Le ayudo a pedir un presupuesto o una cita, le tomo los datos para que el taller lo llame, o le cuento servicios y horario, a cualquier hora y sin esperar a que contesten el teléfono.\n¿En qué le ayudo?",
      "Hi! 👋 I'm the virtual front desk for Giuseppe Auto Repair (West Kendall, Miami). I can set up an estimate or an appointment, take your details so the shop calls you back, or answer questions about services and hours — any time, no waiting on the phone.\nHow can I help?"), menuChips());
  }
  function open(mode) {
    if (mode === "es" || mode === "en") { if (lang !== mode) { lang = mode; headTexts(); } mode = null; }
    panel.classList.add("r24-open"); launch.classList.add("r24-hide"); document.documentElement.classList.add("r24-panel-open"); statusText();
    if (!opened) { opened = true; greet(); }
    if (mode === "llamada" && !flow) setTimeout(function () { addUser(LLAMADA_CHIP.t); startLlamada(); }, 450);
    if (mode === "euro" && !flow) setTimeout(function () { addUser(EURO_CHIP.t); startEuro(); }, 450);
    if (mode === "cita" && !flow) setTimeout(function () { addUser(CITA_CHIP.t); startCita(); }, 450);
    setTimeout(function () { input.focus(); }, 50);
  }
  function opts(a) { return a.map(function (t) { return { t: t, v: t, flow: true }; }); }
  // Lo que le pasa, con los servicios que publica su web
  function SINT() { return lang === "en" ? ["A/C not cooling", "Brakes (noise / vibration)", "Suspension (bumps / clunks)", "Electrical / won't start", "Check engine light / engine", "Routine maintenance", "Other"]
    : ["El A/C no enfría", "Frenos (ruido / vibración)", "Suspensión (golpes / ruidos)", "Falla eléctrica / no arranca", "Luz del motor / motor", "Mantenimiento de rutina", "Otro"]; }
  function FOTO() { return [{ t: L("📷 Subir foto", "📷 Upload photo"), foto: true }, { t: L("Sin foto", "No photo"), v: "__nofoto", flow: true }]; }
  function franjas(dow) {
    if (dow === 6) return opts([L("Sábado por la mañana (7:00 am – 2:00 pm)", "Saturday morning (7:00 am – 2:00 pm)")]);
    return opts([L("Mañana (7:00 am – 12:00 pm)", "Morning (7:00 am – 12:00 pm)"), L("Tarde (12:00 – 6:00 pm)", "Afternoon (12:00 – 6:00 pm)"), L("Me da igual", "Either is fine")]);
  }
  function startCita() {
    flow = { step: "tipo", d: { tipo: "cita" } };
    addBot(L("¡Con gusto! En unos pasos le dejo el pedido listo para el taller. (Escriba «cancelar» si quiere salir.)\n¿Qué necesita?", "Happy to help! A few quick steps and your request is ready for the shop. (Type \"cancel\" to exit.)\nWhat do you need?"),
      opts([L("Presupuesto", "Estimate"), L("Cita para llevar el auto", "Appointment to bring the car")]));
  }
  function startEuro() {
    flow = { step: "marca", d: { tipo: "cita", servicio: L("Auto europeo", "European car"), euro: true } };
    addBot(L("Perfecto: los europeos son su especialidad (técnicos ASE certificados). (Escriba «cancelar» si quiere salir.)\n¿Qué marca es?", "Great: European cars are their specialty (ASE certified technicians). (Type \"cancel\" to exit.)\nWhich make?"), opts(["BMW", "Audi", "Mercedes-Benz", "Porsche", L("Otra europea", "Other European")]));
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
    if (step === "marca") addBot(L("¿Qué marca es?", "Which make?"), opts(["BMW", "Audi", "Mercedes-Benz", "Porsche", L("Otra europea", "Other European")]));
    else if (step === "vehiculo") addBot(d.euro ? L("¿Año y modelo? (por ejemplo: 2018 " + (d.marca && !/otra|other/i.test(d.marca) ? d.marca : "BMW") + " X3)", "Year and model? (e.g. 2018 " + (d.marca && !/otra|other/i.test(d.marca) ? d.marca : "BMW") + " X3)")
      : L("¿Año, marca y modelo del auto? (por ejemplo: 2017 Toyota Camry)", "Year, make and model? (e.g. 2017 Toyota Camry)"));
    else if (step === "sintoma") addBot(L("¿Qué le pasa o qué servicio necesita?", "What's going on, or what service do you need?"), opts(SINT()));
    else if (step === "foto") addBot(L("¿Tiene una foto (del tablero, de la luz de aviso o de la pieza)? Es opcional y ayuda al taller a preparar el presupuesto.", "Do you have a photo (dashboard, warning light or the part)? It's optional and helps the shop prepare the estimate."), FOTO());
    else if (step === "dia") {
      var days = nextWorkdays(n, 6); flow.days = {}; days.forEach(function (x) { flow.days[x.label] = x.dow; });
      addBot(L("¿Qué día le queda mejor? Lo anoto como preferencia y el taller le confirma la hora. Abren de lunes a viernes de 7:00 am a 6:00 pm y el sábado de 7:00 am a 2:00 pm.", "Which day works best? I'll note it as a preference and the shop confirms the time. They're open Monday–Friday 7:00 am–6:00 pm and Saturday 7:00 am–2:00 pm."),
        opts(days.map(function (x) { return x.label; })).concat(opts([L("Lo antes posible", "As soon as possible")])));
    }
    else if (step === "franja") addBot(L("¿En qué franja?", "What time window?"), franjas(d.dow));
    else if (step === "nombre") addBot(L("¿Cuál es su nombre?", "What's your name?"));
    else if (step === "telefono") addBot(d.tipo === "llamada" ? L("Perfecto, " + d.nombre + ". ¿A qué teléfono le llaman?", "Great, " + d.nombre + ". What number should they call?") : L("Último paso: ¿a qué teléfono le llaman para confirmar?", "Last step: what number should they call to confirm?"));
    else if (step === "resumen") {
      var B = [{ t: L("✅ Confirmar", "✅ Confirm"), v: "__ok", flow: true }, { t: L("✏️ Corregir", "✏️ Edit"), v: "__fix", flow: true }, { t: L("Cancelar", "Cancel"), v: "cancelar", flow: true }];
      var q = L("\n\n¿Lo confirmo?", "\n\nShall I confirm?"), foto = d.foto ? d.foto : L("sin foto", "no photo");
      if (d.tipo === "llamada") { addBot(L("Revise su solicitud de llamada:\n👤 Nombre: ", "Please review your call-back request:\n👤 Name: ") + d.nombre + L("\n💬 Consulta: ", "\n💬 Question: ") + d.consulta + L("\n📱 Teléfono: ", "\n📱 Phone: ") + d.telefono + "\n\n" + aviso() + q, B, "r24-sum"); return; }
      addBot(L("Revise su solicitud:\n🧾 Tipo: ", "Please review your request:\n🧾 Type: ") + d.servicio + L("\n🚗 Auto: ", "\n🚗 Vehicle: ") + (d.euro && d.marca ? d.marca + " " : "") + d.vehiculo + L("\n🔧 Qué le pasa: ", "\n🔧 Problem: ") + d.sintoma + L("\n📷 Foto: ", "\n📷 Photo: ") + foto + L("\n📅 Día: ", "\n📅 Day: ") + d.dia + L("\n🕐 Franja: ", "\n🕐 Window: ") + d.franja + L("\n👤 Nombre: ", "\n👤 Name: ") + d.nombre + L("\n📱 Teléfono: ", "\n📱 Phone: ") + d.telefono + "\n\n" + aviso() + q, B, "r24-sum");
    }
  }
  function flowInput(t, chip) {
    var n = norm(t), d = flow.d;
    if (/^(cancelar|cancela|salir|dejalo|olvidalo|cancel|stop|exit|quit)$/.test(n)) { flow = null; addBot(L("Sin problema, cancelé la solicitud. ¿Le ayudo con otra cosa?", "No problem, I've cancelled the request. Anything else?"), [CITA_CHIP, EURO_CHIP, LLAMADA_CHIP]); return; }
    if (/\?/.test(t) && flow.step !== "resumen") {
      var bi = bestIntent(t);
      if (bi && bi.s >= 1) { reply(bi.e); setTimeout(function () { ask(flow.step); }, 700); return; }
    }
    switch (flow.step) {
      case "tipo":
        d.servicio = t.slice(0, 40);
        addBot(/cita|appointment/.test(n) ? L("Bien. Le anoto el día que prefiere y el taller le confirma la hora.", "Got it. I'll note your preferred day and the shop confirms the time.")
          : L("Bien. Su web no publica precios: el taller revisa su caso y le da el presupuesto.", "Got it. Their site doesn't publish prices: the shop reviews your case and gives you the estimate."));
        setTimeout(function () { ask("vehiculo"); }, 600); return;
      case "marca": d.marca = t.slice(0, 30); ask("vehiculo"); return;
      case "vehiculo":
        if (t.length < 2) { ask("vehiculo"); return; }
        d.vehiculo = t.slice(0, 60); ask("sintoma"); return;
      case "sintoma": d.sintoma = t.slice(0, 100); ask("foto"); return;
      case "foto":
        if (t !== "__nofoto") d.foto = L("la describe: ", "described: ") + t.slice(0, 60);
        ask("dia"); return;
      case "dia":
        d.dia = t.slice(0, 60); d.dow = flow.days && flow.days[t] != null ? flow.days[t] : -1;
        if (/^(lo antes posible|as soon as possible)$/i.test(t)) { d.franja = L("La primera disponible", "First available"); ask("nombre"); return; }
        ask("franja"); return;
      case "franja": d.franja = t.slice(0, 60); ask("nombre"); return;
      case "nombre":
        var nm = t.replace(/^(me llamo|soy|mi nombre es|my name is|i am|i'm|im)\s+/i, "").trim();
        if (nm.length < 2 || nm.length > 60 || /\d/.test(nm)) { addBot(L("¿Me dice su nombre, por favor? (solo el nombre, sin números)", "What's your name, please? (just your name, no numbers)")); return; }
        d.nombre = nm.split(/\s+/).map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join(" ");
        ask("telefono"); return;
      case "telefono":
        var ph = t.replace(/[\s().+-]/g, "");
        if (/^1\d{10}$/.test(ph)) ph = ph.slice(1);
        if (!/^[2-9]\d{9}$/.test(ph)) { addBot(L("Ese número no me cuadra. Escríbalo con 10 cifras (con código de área), por ejemplo 305-555-0123.", "That number doesn't look right. Please use 10 digits with area code, e.g. 305-555-0123.")); return; }
        d.telefono = ph.slice(0, 3) + "-" + ph.slice(3, 6) + "-" + ph.slice(6);
        ask("resumen"); return;
      case "resumen":
        if (t === "__ok" || /^(si|sí|ok|confirmo|confirmar|correcto|dale|yes|confirm|sure|yep)/.test(n)) {
          var nm2 = d.nombre.split(" ")[0], DEMO = L("\n\n(Versión de demostración: esta solicitud no se envió al taller.)", "\n\n(Demo version: this request was not sent to the shop.)");
          if (d.tipo === "llamada") { addBot(L("¡Listo, " + nm2 + "! ✅ El taller recibe su pedido al instante y le llama al " + d.telefono + ".", "All set, " + nm2 + "! ✅ The shop gets your request instantly and will call you at " + d.telefono + ".") + DEMO, [CITA_CHIP, Q("Otra pregunta", "Another question", "__menu", "__menu")]); flow = null; return; }
          addBot(L("¡Listo, " + nm2 + "! ✅ Su solicitud quedó registrada.\nEl taller le llama al " + d.telefono + " para confirmar el día y la hora; el presupuesto se lo dan ellos después de revisar el auto.", "All set, " + nm2 + "! ✅ Your request is in.\nThe shop will call you at " + d.telefono + " to confirm the day and time; the estimate comes from them after checking the car.") + DEMO, [MAPS(), Q("Otra pregunta", "Another question", "__menu", "__menu")]);
          flow = null; return;
        }
        if (t === "__fix" || /corregir|cambiar|editar|edit|change|^no\b/.test(n)) {
          var keep = d.tipo === "llamada" ? { tipo: "llamada", consulta: d.consulta } : { tipo: d.tipo, servicio: d.servicio, euro: d.euro };
          flow.d = keep; addBot(L("De acuerdo, empezamos de nuevo.", "OK, let's start over."));
          setTimeout(function () { if (keep.tipo === "llamada") ask("nombre"); else if (keep.euro) ask("marca"); else ask("vehiculo"); }, 500); return;
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
    if (chip && chip.a === "euro") { startEuro(); return; }
    if (chip && chip.a === "llamada") { startLlamada(); return; }
    if (/^(hola|buenas|buenos dias|buenas tardes|hey|hi|hello)\b/.test(n) && n.split(" ").length <= 3) { addBot(L("¡Hola! ¿En qué le puedo ayudar? Le pido un presupuesto o una cita, le tomo los datos para que lo llamen y le cuento servicios, horario y dirección.", "Hi! How can I help? I can request an estimate or an appointment, take your details for a call back, and tell you about services, hours and location."), menuChips()); return; }
    if (/^(horario y direccion|hours and address)$/.test(n)) { addBot(horarioA() + "\n\n" + dirA(), [CITA_CHIP, MAPS, LLAMADA_CHIP]); return; }
    if (/\b(que me llamen|llamenme|call me back|callback|call back)\b/.test(n)) { startLlamada(); return; }
    var bi = bestIntent(t);
    var price = isPriceQ(n);
    if (wantsCita(n) && !price && (!bi || bi.s < 2 || /cita|presupuesto|cotiz|appointment|estimate|quote|schedule|book/.test(n))) { if (bi && bi.e.id === "euro") startEuro(); else startCita(); return; }
    if (price && !(bi && bi.e.id === "nolist")) { reply(byId("precio")); return; }
    if (bi) { reply(bi.e); return; }
    lastQ = t; fallback();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build); else build();
  window.R24 = { open: open, _test: { bestIntent: bestIntent, norm: norm, nowTx: nowTx, lang: function () { return lang; } } };
})();
