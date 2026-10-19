/* R24-BRIEF-1018: avatar humano, botones rápidos, "que me llamen", aviso al equipo, sin "no tengo ese dato" */
/* Recepción 24 h · Auto Mechanic Garcia's (taller mecánico, Tomball/Houston TX) — DEMO privada, bilingüe ES/EN.
   100% del lado del cliente: sin APIs, sin claves, sin envío de datos.
   Respuestas sacadas solo de lo que publica automechanicgarcias.com (oct. 2026), páginas Home y Contact en inglés y en español:
   - Dirección actual: 340 Mechanic St., Unit B, Tomball TX 77375 (web en inglés, actualizada jul-2025; coincide con Google).
     La web en español todavía muestra 251 Blue Bell Rd, Houston TX 77037 (hallazgo para el pitch; en la demo se corrige).
   - Horario: L–V 9:00 am–6:00 pm · S 9:00 am–2:00 pm · D cerrado (Home ES/EN y Contact EN; Contact ES dice 9–5 y sábado cerrado).
   - Teléfono 281-820-3690 («Call or Text Us», «Hablamos Español»). 346-273-9735 solo aparece en la home en español: no se usa.
   - Email: Sales@garcias-auto.com (destino real de sus enlaces mailto).
   - Servicios: A/C, transmisión (de reparaciones eléctricas a reconstrucción completa), motor (reparación y reconstrucción), diagnóstico
     (check engine), frenos, afinación, cambio de aceite, mantenimiento y reparación estándar y especializada.
   - Empresa familiar desde 2002, 20+ años, 50+ años de experiencia combinada, 4 técnicos, 6 días a la semana.
   - Zonas: Tomball, Spring, Magnolia, Cypress, Houston y alrededores.
   No se inventan precios, plazos, términos de garantía, grúa, llantas, inspecciones ni formas de pago.
   El botón de WhatsApp de su web apunta a wa.me/281-820-3690 (sin el 1): en la demo abre un WhatsApp simulado; el enlace correcto es wa.me/12818203690.
   Trato de «usted» en español, como su web («Permítanos ayudarle», «le brindaremos»). */
(function () {
  "use strict";
  var C = {
    nombre: "Auto Mechanic Garcia's",
    tel: "281-820-3690", telh: "+12818203690",
    wa: "https://wa.me/12818203690",
    email: "Sales@garcias-auto.com",
    dir: "340 Mechanic St., Unit B, Tomball, TX 77375",
    maps: "https://www.google.com/maps/search/?api=1&query=340+Mechanic+St+Unit+B+Tomball+TX+77375"
  };
  var lang = (window.R24_LANG || document.documentElement.lang || "es").slice(0, 2) === "en" ? "en" : "es";
  function L(es, en) { return lang === "en" ? en : es; }
  // Horario (minutos desde las 0:00, hora de Houston). 0 = domingo.
  var WD = [[540, 1080]], SA = [[540, 840]];
  var H = { 1: WD, 2: WD, 3: WD, 4: WD, 5: WD, 6: SA, 0: [] };
  var DIAS = { es: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"], en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] };
  var MESES = { es: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"], en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] };
  function horarioTxt() {
    return L("Horario que publica el taller:\n• Lunes a viernes: 9:00 am – 6:00 pm\n• Sábado: 9:00 am – 2:00 pm\n• Domingo: cerrado",
      "Shop hours (as published):\n• Monday–Friday: 9:00 am – 6:00 pm\n• Saturday: 9:00 am – 2:00 pm\n• Sunday: closed");
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
  function nextWorkdays(n, k) {
    var out = [];
    for (var i = 1; out.length < k && i < 14; i++) {
      var dt = new Date(n.y, n.m, n.d + i), dow = dt.getDay();
      if ((H[dow] || []).length) {
        var dn = DIAS[lang][dow];
        out.push({ dow: dow, label: lang === "en" ? dn + ", " + MESES.en[dt.getMonth()] + " " + dt.getDate() : dn.charAt(0).toUpperCase() + dn.slice(1) + " " + dt.getDate() + " " + MESES.es[dt.getMonth()] });
      }
    }
    return out;
  }

  var STOP = ("a al algo algun alguna como con cual de del el en es esta este esto estoy hay la las lo los me mi mis o para pero por que quiero se si sin su sus te tu un una uno unos y ya yo usted ustedes tienen tiene puedo podria saber gustaria hola buenas buenos dias tardes noches favor " +
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
    // coincidencia exacta = 1, aproximada (errata, plural) = 0.7: así «alineación» no se confunde con «afinación»
    var pt = toks(ph); if (!pt.length) return 0; var sc = 0;
    for (var i = 0; i < pt.length; i++) {
      if (ut.indexOf(pt[i]) >= 0) { sc += 1; continue; }
      if (!ut.some(function (u) { return tokMatch(pt[i], u); })) return 0;
      sc += 0.7;
    }
    return sc;
  }

  var CITA_CHIP = { a: "cita", get t() { return L("🔧 Presupuesto o cita", "🔧 Estimate or appointment"); } };
  var URG_CHIP = { a: "varado", get t() { return L("🚨 Mi auto quedó varado", "🚨 My car broke down"); } };
  var LLAMADA_CHIP = { a: "llamada", get t() { return L("📲 Que me llamen", "📲 Call me back"); } };
  function aviso() { return L("🔔 El equipo del taller recibe este pedido al instante (en esta demo no se envía nada).", "🔔 The shop team gets this request instantly (nothing is sent in this demo)."); }
  var lastQ = "";
  function TEL() { return { t: L("Llamar ", "Call ") + C.tel, tel: C.telh }; }
  function WA() { return { t: "WhatsApp " + C.tel, url: C.wa, wa: true }; }
  function MAPS() { return { t: L("Cómo llegar (Google Maps)", "Directions (Google Maps)"), url: C.maps }; }
  function Q(es, en, qes, qen) { return { get t() { return L(es, en); }, get q() { return L(qes || es, qen || en); } }; }
  function horarioA() {
    var n = nowTx();
    return horarioTxt() + "\n\n" + (isOpen(n)
      ? L("🟢 Ahora mismo está abierto (hasta las " + hm(closeAt(n)) + "): llame o mande texto al " + C.tel + ".", "🟢 Open right now (until " + hm(closeAt(n)) + "): call or text " + C.tel + ".")
      : L("🌙 Ahora mismo está cerrado (abre " + nextOpening(n) + "). Yo le atiendo igual: déjeme su presupuesto, su cita o su «que me llamen» y el taller lo tiene al abrir.",
        "🌙 Closed right now (opens " + nextOpening(n) + "). I can still help: leave your estimate, appointment or call-back request and the shop has it first thing."));
  }
  function serviciosA() {
    return L("Lo que publica el taller:\n• Reparación de aire acondicionado (A/C)\n• Reparación de transmisión: desde fallas eléctricas hasta reconstrucción completa\n• Reparación y reconstrucción de motores\n• Diagnóstico (luz de check engine)\n• Frenos, afinación y cambio de aceite\n• Mantenimiento y reparación, estándar y especializada\n¿Qué le está pasando al auto? Le dejo pedido el presupuesto.",
      "What the shop lists:\n• A/C repair\n• Transmission repair: from electrical issues to complete rebuilds\n• Engine repair and rebuilds\n• Diagnostics (check engine light)\n• Brake work, tune-ups and oil changes\n• Standard and specialized maintenance and repair\nWhat's going on with your car? I can set up an estimate request.");
  }
  function noListA() {
    return L("Ese servicio no aparece detallado en su web, así que no se lo voy a asegurar. Lo que sí publican: A/C, transmisión, motor, diagnóstico, frenos, afinación, cambio de aceite y mantenimiento en general.\nPara confirmarlo, llame o mande texto al " + C.tel + ", o deje su teléfono y le llaman.",
      "That service isn't listed on their website, so I won't promise it. What they do list: A/C, transmission, engine, diagnostics, brakes, tune-ups, oil changes and general maintenance.\nTo confirm, call or text " + C.tel + ", or leave your number and they'll call you.");
  }

  var KB = [
    { id: "ac", k: ["aire acondicionado", "aire", "a c", "ac", "clima", "no enfria", "no enfría", "tira aire caliente", "freon", "compresor", "air conditioning", "air conditioner", "cold air", "blowing hot", "hot air"],
      a: function () { return L("Sí: reparan aire acondicionado de autos («Permítanos ayudarle a mantenerse fresco durante todo el verano»). Diagnostican y arreglan el sistema de A/C. El precio depende de qué falle, así que se lo cotizan al revisarlo.", "Yes: they do car A/C repair — they diagnose and fix automotive air conditioning systems. The price depends on what's failing, so they quote it after checking the car."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "transmision", k: ["transmision", "transmisión", "caja", "caja de cambios", "cambios", "patina", "no entra", "no cambia", "jalones", "transmission", "shifting", "slipping", "gear", "gears", "rebuild transmission"],
      a: function () { return L("Sí, es una de sus especialidades: ofrecen reparación de transmisiones, desde reparaciones eléctricas hasta reconstrucciones completas. Si me dice marca, modelo, año y qué hace (patina, no entra un cambio, jalones…), le dejo pedido el presupuesto.", "Yes, it's one of their specialties: transmission diagnostics and repairs ranging from electrical issues to complete rebuilds. Tell me make, model, year and what it's doing (slipping, won't shift, jerking…) and I'll set up the estimate request."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "motor", k: ["motor", "reconstruccion", "reconstrucción", "rectificar", "junta", "empaque", "cabeza", "humo", "pierde aceite", "engine", "engine rebuild", "head gasket", "smoke", "overheating", "sobrecalienta", "calienta"],
      a: function () { return L("Sí: hacen reparación y reconstrucción de motores («reparaciones y reconstrucciones de motores de calidad y duraderas»). Para cotizar necesitan ver el auto; le dejo pedido el presupuesto con el síntoma.", "Yes: they do quality, long-lasting engine repairs and rebuilds. To quote they need to see the car; I can set up the estimate request with the symptom."); }, c: [CITA_CHIP, URG_CHIP, LLAMADA_CHIP] },
    { id: "diagnostico", k: ["diagnostico", "diagnóstico", "check engine", "luz", "foco", "testigo", "escaner", "scanner", "codigo", "código", "falla", "diagnostic", "warning light", "light on"],
      a: function () { return L("Sí: hacen diagnóstico. Su web dice que, con años de experiencia y equipo y tecnología actualizados, le dan el diagnóstico correcto para ahorrarle tiempo y dinero. Si tiene la luz de check engine prendida, déjeme marca, modelo, año y lo que nota, y le piden cita.", "Yes: diagnostics. Their site says that with years of experience and up-to-date equipment and technology they'll give you the right diagnosis to save you time and money. Check engine light on? Leave make, model, year and what you notice, and they'll set you up."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "frenos", k: ["frenos", "freno", "balatas", "pastillas", "rechinan", "brakes", "brake", "pads", "squeak", "grinding"],
      a: function () { return L("Sí: los frenos están entre los trabajos que publican (brake-work). El presupuesto se lo dan al revisar el auto.", "Yes: brake work is on their list. They'll give you the estimate after checking the car."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "aceite", k: ["aceite", "cambio de aceite", "afinacion", "afinación", "tune up", "mantenimiento", "bujias", "filtros", "oil", "oil change", "tune-up", "maintenance"],
      a: function () { return L("Sí: hacen desde cambios de aceite sencillos hasta reparaciones complejas, además de afinaciones (tune-ups) y mantenimiento estándar y especializado. ¿Le pido cita?", "Yes: from simple oil changes to complex repairs, plus tune-ups and standard and specialized maintenance. Want me to request an appointment?"); }, c: [CITA_CHIP, Q("Horario", "Hours", "horario", "hours")] },
    { id: "nolist", k: ["llanta", "llantas", "neumatico", "ponchada", "alineacion", "balanceo", "inspeccion", "inspección", "smog", "emisiones", "sticker", "hojalateria", "pintura", "carroceria", "choque", "vidrios", "diesel", "hibrido", "tires", "tire", "flat", "alignment", "inspection", "body work", "paint", "dent", "hybrid", "windshield"], a: noListA, c: [TEL, LLAMADA_CHIP, CITA_CHIP] },
    { id: "servicios", k: ["servicios", "que hacen", "que reparan", "que arreglan", "trabajos", "services", "what do you fix", "what do you do", "repairs do"], a: serviciosA, c: [CITA_CHIP, URG_CHIP, LLAMADA_CHIP] },
    { id: "grua", k: ["grua", "grúa", "remolque", "remolcar", "tow", "towing", "tow truck", "wrecker", "recoger auto", "pick up car"],
      a: function () { return L("Su web no menciona servicio de grúa, así que no se lo voy a prometer. Si el auto quedó varado, lo más rápido es llamar al " + C.tel + " en horario; si no, le dejo un pase urgente para que le llamen apenas abran.", "Their website doesn't mention towing, so I won't promise it. If your car broke down, the fastest is to call " + C.tel + " during hours; otherwise I'll leave an urgent request so they call you as soon as they open."); }, c: [URG_CHIP, TEL, LLAMADA_CHIP] },
    { id: "precio", k: ["precio", "precios", "cuanto cuesta", "cuanto sale", "cuanto cobran", "costo", "caro", "barato", "price", "prices", "how much", "cost", "cheap", "rates"],
      a: function () { return L("Su web no publica precios, y en un taller depende de lo que tenga el auto, así que no le doy una cifra a ojo. Lo que sí hago: le dejo pedido el presupuesto con marca, modelo, año y síntoma, y el taller le contesta.", "Their website doesn't list prices, and at a shop it depends on what the car needs, so I won't guess a number. What I can do: send an estimate request with make, model, year and symptom, and the shop gets back to you."); }, c: [CITA_CHIP, LLAMADA_CHIP, TEL] },
    { id: "garantia", k: ["garantia", "garantía", "garantizan", "warranty", "guarantee", "guaranteed"],
      a: function () { return L("Su web dice: «Garantizamos reparaciones rápidas y confiables para su auto, utilizando las mejores piezas disponibles». Los términos (plazo, piezas, mano de obra) no los detalla, así que se los confirma el taller al darle el presupuesto.", "Their site says: \"We guarantee fast and reliable repair for your car.\" It doesn't spell out warranty terms (time, parts, labor), so the shop will confirm them with your estimate."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "tiempo", k: ["cuanto tarda", "cuanto tiempo", "hoy mismo", "mismo dia", "rapido", "listo", "how long", "same day", "today", "quick", "ready"],
      a: function () { return L("Depende del trabajo y de las piezas. Su web promete reparaciones rápidas y confiables, pero no da plazos, así que se lo confirma el taller al ver el auto. Si quiere, le dejo la cita para lo antes posible.", "It depends on the job and parts. Their site promises fast and reliable repairs but doesn't give timelines, so the shop will tell you once they see the car. I can request the earliest appointment."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "sincita", k: ["sin cita", "llegar directo", "pasar", "caer", "walk in", "walk-in", "drop by", "stop by", "drop off"],
      a: function () { return L("Su web invita a llamar, mandar texto o pasar por el taller. Para no esperar, conviene avisar antes: le dejo pedida la cita y le confirman.\n📍 " + C.dir + ".", "Their site says you can call, text or drop by. To avoid waiting, it's best to give them a heads-up: I'll request the appointment and they'll confirm.\n📍 " + C.dir + "."); }, c: [CITA_CHIP, MAPS] },
    { id: "pago", k: ["tarjeta", "efectivo", "financiamiento", "financiar", "pagos", "plazos", "credito", "zelle", "card", "cash", "financing", "payment", "payments", "credit"],
      a: function () { return L("Las formas de pago y el financiamiento no figuran en su web, así que no se lo voy a asegurar. Confírmelo llamando o mandando texto al " + C.tel + ", o deje su teléfono y le llaman.", "Payment methods and financing aren't on their website, so I won't promise anything. Confirm by calling or texting " + C.tel + ", or leave your number for a call back."); }, c: [TEL, LLAMADA_CHIP] },
    { id: "idioma", k: ["espanol", "español", "hablan espanol", "ingles", "inglés", "spanish", "english", "speak spanish"],
      a: function () { return L("¡Sí, hablamos español! Su web lo dice así: «Hablamos Español». Aquí le atiendo en español o en inglés, como prefiera (botón EN arriba).", "Yes! The shop says \"Hablamos Español\", and their website is in English and Spanish. I can help you in either language (ES button at the top)."); }, c: [CITA_CHIP, URG_CHIP] },
    { id: "experiencia", k: ["experiencia", "anos", "años", "familia", "familiar", "confiable", "quienes son", "mecanicos", "tecnicos", "experience", "family", "since", "trust", "reviews", "technicians", "who are you"],
      a: function () { return L("Auto Mechanic Garcia's es un taller familiar, abierto desde 2002: más de 20 años de experiencia y más de 50 años de experiencia combinada, con 4 técnicos y 6 días a la semana de atención. Atienden Tomball, Spring, Magnolia, Cypress, Houston y alrededores.", "Auto Mechanic Garcia's is family owned and operated since 2002: 20+ years in business and 50+ years of combined experience, with 4 technicians, open 6 days a week. They serve Tomball, Spring, Magnolia, Cypress, Houston and surrounding areas."); }, c: [CITA_CHIP, Q("Servicios", "Services", "servicios", "services")] },
    { id: "horario", k: ["horario", "horas", "abren", "abierto", "cierran", "a que hora", "sabado", "domingo", "lunes", "viernes", "hours", "open", "close", "closing", "saturday", "sunday", "weekend"], a: horarioA, c: [CITA_CHIP, LLAMADA_CHIP, TEL] },
    { id: "direccion", k: ["donde", "dirección", "direccion", "ubicacion", "ubicados", "como llego", "llegar", "tomball", "blue bell", "mechanic st", "houston", "spring", "cypress", "magnolia", "address", "location", "where", "directions", "located"],
      a: function () { return L("📍 " + C.dir + " (así figura en su web actual).\nAtienden Tomball, Spring, Magnolia, Cypress, Houston y alrededores.", "📍 " + C.dir + ".\nThey serve Tomball, Spring, Magnolia, Cypress, Houston and surrounding areas."); }, c: [MAPS, CITA_CHIP] },
    { id: "contacto", k: ["telefono", "teléfono", "numero", "llamar", "contacto", "correo", "email", "mail", "whatsapp", "wasap", "watsap", "texto", "mensaje", "hablar con alguien", "persona", "phone", "number", "call", "text", "contact", "talk to someone", "human"],
      a: function () { return L("Canales del taller:\n• Teléfono (llamada o texto): " + C.tel + "\n• WhatsApp: " + C.tel + "\n• Email: " + C.email + "\nO deje aquí su teléfono y le llaman ellos.", "How to reach the shop:\n• Phone (call or text): " + C.tel + "\n• WhatsApp: " + C.tel + "\n• Email: " + C.email + "\nOr leave your number here and they'll call you."); }, c: [TEL, WA, LLAMADA_CHIP] },
    { id: "gracias", k: ["gracias", "muchas gracias", "perfecto", "adios", "thanks", "thank you", "bye", "great"], a: function () { return L("¡A usted! Si necesita algo más, aquí estoy. 🔧", "You're welcome! I'm here if you need anything else. 🔧"); }, c: [CITA_CHIP] }
  ];
  var CITA_K = ["cita", "presupuesto", "cotizacion", "cotizar", "estimado", "agendar", "reservar", "revisar mi carro", "revisen", "llevar carro", "appointment", "estimate", "quote", "book", "schedule", "bring car"];

  function bestIntent(text) {
    var ut = toks(text), best = null, bs = 0;
    if (!ut.length) return null;
    KB.forEach(function (e) {
      var s = 0; e.k.forEach(function (ph) { s = Math.max(s, phraseScore(ph, ut)); });
      if (s > bs) { bs = s; best = e; }
    });
    return bs > 0 ? { e: best, s: bs } : null;
  }
  function isPriceQ(n) { return /\b(precio|precios|cuesta|cuestan|cuanto sale|cuanto cobran|costo|caro|barato|price|prices|how much|cost|cheap|\$)\b/.test(n); }
  function wantsCita(n) { var ut = toks(n); return CITA_K.some(function (ph) { return phraseScore(ph, ut) > 0; }); }
  function isVarado(n) { return /varad|se me descompuso|no arranca|no prende|se apago|se quedo tirado|me quede tirado|emergencia|urgente|broke down|broken down|stranded|won t start|wont start|stalled|emergency|urgent/.test(n); }
  function looksEnglish(n) { var w = n.split(" "), en = ["the", "my", "is", "do", "you", "what", "how", "car", "are", "your", "can", "open", "hours", "much", "need", "want", "when", "where", "does", "have", "i"]; var c = w.filter(function (x) { return en.indexOf(x) >= 0; }).length; return c >= 2 && !/[ñ]|\b(el|la|los|mi|que|como|cuanto|tienen|hacen|usted|carro|auto)\b/.test(n); }
  function looksSpanish(n) { return /\b(hola|cuanto|tienen|hacen|ustedes|carro|precio|horario|donde|necesito|quiero|mi carro|mi auto|gracias)\b/.test(n); }
  function byId(id) { return KB.filter(function (e) { return e.id === id; })[0]; }

  var body, input, status, panel, launch, opened = false, waMode = false;
  var flow = null;
  function el(tag, cls, html) { var x = document.createElement(tag); if (cls) x.className = cls; if (html != null) x.innerHTML = html; return x; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function linkify(s) {
    return esc(s).replace(/\b281-820-3690\b/g, '<a href="tel:+12818203690">281-820-3690</a>')
      .replace(/Sales@garcias-auto\.com/g, '<a href="mailto:Sales@garcias-auto.com">Sales@garcias-auto.com</a>');
  }
  function scroll() { body.scrollTop = body.scrollHeight; }
  function addUser(t) { var m = el("div", "r24-msg r24-user"); m.textContent = t; body.appendChild(m); scroll(); }
  function addNote(html) { var m = el("div", "r24-note", html); body.appendChild(m); scroll(); }
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
          if (c.tel) { b = el("a", "r24-chip", "📞 " + esc(c.t)); b.href = "tel:" + c.tel; }
          else if (c.url) { b = el("a", "r24-chip" + (c.wa ? " r24-wa" : ""), esc(c.t)); b.href = c.url; b.target = "_blank"; b.rel = "noopener"; }
          else { var tt = c.t; b = el("button", "r24-chip", esc(tt)); b.type = "button"; b.onclick = function () { w.remove(); handle(c.v || c.q || tt, c, tt); }; }
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
    else { status.className = "r24-status r24-closed"; status.textContent = L("🌙 Cerrado ahora (abre " + nextOpening(n) + ") · le atiendo igual y dejo su pedido listo", "🌙 Closed now (opens " + nextOpening(n) + ") · I'll still take your request"); }
  }
  function menuChips() { return [CITA_CHIP, URG_CHIP, Q("Servicios", "Services", "servicios", "services"), Q("Horario y dirección", "Hours & address", "horario y direccion", "hours and address"), LLAMADA_CHIP]; }
  function headTexts() {
    panel.querySelector(".r24-ht b").innerHTML = (waMode ? "WhatsApp · " + esc(C.nombre) : L("Recepción 24 h", "24/7 Front Desk")) + ' <span class="r24-online">● ' + L("en línea", "online") + "</span>";
    panel.querySelector(".r24-ht small").textContent = waMode ? "+1 " + C.tel + L(" · simulado en la demo", " · simulated in this demo") : C.nombre + " · Tomball, TX";
    panel.querySelector(".r24-in").placeholder = L("Escriba su pregunta…", "Type your question…");
    panel.querySelector(".r24-send").textContent = L("Enviar", "Send");
    panel.querySelector(".r24-lang").textContent = lang === "en" ? "ES" : "EN";
    panel.querySelector(".r24-lang").setAttribute("aria-label", lang === "en" ? "Cambiar a español" : "Switch to English");
    panel.querySelector(".r24-legal").textContent = L("Asistente automático de demostración · sus datos no se envían a ningún sitio", "Automated demo assistant · your data isn't sent anywhere");
    launch.querySelector(".r24-lt").textContent = L("Recepción 24 h", "24/7 Front Desk");
    banner.textContent = L("Demo privada preparada para Auto Mechanic Garcia's", "Private demo prepared for Auto Mechanic Garcia's");
    panel.classList.toggle("r24-wamode", waMode);
  }
  var banner;
  function build() {
    var base = window.R24_BASE || "recepcion/";
    var css = document.createElement("link"); css.rel = "stylesheet"; css.href = base + "recepcion.css"; document.head.appendChild(css);
    banner = el("div", "r24-demo-banner"); banner.setAttribute("role", "note"); document.body.appendChild(banner);
    launch = el("button", "r24-launch", '<img class="r24-face" src="' + base + 'avatar.svg" alt="Recepcionista"><span class="r24-lt"></span><span class="r24-dot"></span>');
    launch.type = "button"; launch.setAttribute("aria-label", L("Abrir la recepción 24 h", "Open the 24/7 front desk")); document.body.appendChild(launch);
    panel = el("div", "r24-panel"); panel.setAttribute("role", "dialog"); panel.setAttribute("aria-label", "Recepción 24 h");
    panel.innerHTML = '<div class="r24-head"><div class="r24-av"><img class="r24-face" src="' + base + 'avatar.svg" alt="Recepcionista"></div><div class="r24-ht"><b></b><small></small></div><button class="r24-lang" type="button"></button><button class="r24-x" type="button" aria-label="Cerrar">×</button></div><div class="r24-status"></div><div class="r24-body" aria-live="polite"></div><form class="r24-foot"><input class="r24-in" type="text" autocomplete="off" maxlength="300"><button class="r24-send" type="submit"></button></form><div class="r24-legal"></div>';
    document.body.appendChild(panel);
    body = panel.querySelector(".r24-body"); input = panel.querySelector(".r24-in"); status = panel.querySelector(".r24-status");
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
  function greet() {
    addBot(L("¡Hola! 👋 Soy la recepción virtual de Auto Mechanic Garcia's (Tomball, TX). Le ayudo a pedir un presupuesto o una cita, con un auto varado o con dudas de servicios y horario, a cualquier hora y sin esperar a que le contesten el teléfono. Hablamos español.\n¿En qué le ayudo?",
      "Hi! 👋 I'm the virtual front desk for Auto Mechanic Garcia's (Tomball, TX). I can set up an estimate or appointment, help if your car broke down, or answer questions about services and hours — any time, no waiting on the phone. Hablamos español.\nHow can I help?"), menuChips());
  }
  function open(mode) {
    var wantWa = mode === "wa";
    if (wantWa !== waMode) { waMode = wantWa; headTexts(); }
    panel.classList.add("r24-open"); launch.classList.add("r24-hide"); document.documentElement.classList.add("r24-panel-open"); statusText();
    if (wantWa && !panel._waNote) {
      panel._waNote = true;
      addNote(L("🔧 <b>Nota de la demo:</b> el botón de WhatsApp de su web apunta a <code>wa.me/281-820-3690</code>, sin el 1 de EE. UU., y no abre su chat. El enlace correcto es <code>wa.me/12818203690</code>. Aquí se simula cómo contestaría la recepción 24 h por WhatsApp.",
        "🔧 <b>Demo note:</b> the WhatsApp button on their site points to <code>wa.me/281-820-3690</code> (missing the US country code 1), so it doesn't open their chat. The correct link is <code>wa.me/12818203690</code>. This simulates how the 24/7 front desk would answer on WhatsApp."));
      if (!opened) { opened = true; greet(); }
      else addBot(L("¡Hola! 👋 Le escribe Auto Mechanic Garcia's por WhatsApp. ¿En qué le ayudo?", "Hi! 👋 Auto Mechanic Garcia's here on WhatsApp. How can I help?"), menuChips());
    }
    if (!opened) { opened = true; greet(); }
    if (mode === "llamada" && !flow) setTimeout(function () { addUser(LLAMADA_CHIP.t); startLlamada(); }, 450);
    if (mode === "varado" && !flow) setTimeout(function () { addUser(URG_CHIP.t); startVarado(); }, 450);
    if (mode === "cita" && !flow) setTimeout(function () { addUser(CITA_CHIP.t); startCita(); }, 450);
    setTimeout(function () { input.focus(); }, 50);
  }

  function SINT() { return lang === "en" ? ["Check engine light", "A/C not cooling", "Transmission / shifting", "Engine noise or smoke", "Brakes", "Oil change / tune-up", "Other"]
    : ["Luz de check engine", "El A/C no enfría", "Transmisión / cambios", "Ruido o humo del motor", "Frenos", "Cambio de aceite / afinación", "Otro"]; }
  function VAR() { return lang === "en" ? ["Won't start", "Died while driving", "Overheated", "Smoke or strange noise", "Other"]
    : ["No arranca", "Se apagó manejando", "Se sobrecalentó", "Humo o ruido raro", "Otro"]; }
  function franjasDe(dow) {
    if (dow === 6) return [{ t: L("Mañana (9:00 am – 2:00 pm)", "Morning (9:00 am – 2:00 pm)"), v: L("Mañana (9:00 am – 2:00 pm)", "Morning (9:00 am – 2:00 pm)"), flow: true }];
    var a = L("Mañana (9:00 am – 12:00 pm)", "Morning (9:00 am – 12:00 pm)"), b = L("Tarde (12:00 – 6:00 pm)", "Afternoon (12:00 – 6:00 pm)"), c = L("Me da igual", "Either is fine");
    return [{ t: a, v: a, flow: true }, { t: b, v: b, flow: true }, { t: c, v: c, flow: true }];
  }
  function startCita() {
    flow = { step: "tipo", d: { tipo: "cita" } };
    addBot(L("¡Con gusto! En unos pasos le dejo el pedido listo para el taller. (Escriba «cancelar» si quiere salir.)\n¿Qué necesita?", "Happy to help! A few quick steps and your request is ready for the shop. (Type \"cancel\" to exit.)\nWhat do you need?"),
      [{ t: L("Presupuesto", "Estimate"), v: L("Presupuesto", "Estimate"), flow: true }, { t: L("Cita para llevar el auto", "Appointment to bring the car"), v: L("Cita", "Appointment"), flow: true }]);
  }
  function startLlamada() {
    flow = { step: "nombre", d: { tipo: "llamada", consulta: (lastQ || L("Consulta general", "General question")).slice(0, 120) } };
    addBot(L("¡Claro! Le llama una persona del taller. Solo necesito dos datos.\n¿Cuál es su nombre? (Escriba «cancelar» si quiere salir.)", "Sure! Someone from the shop will call you. I just need two things.\nWhat's your name? (Type \"cancel\" to exit.)"));
  }
  function alarma() { return L("⚠️ Si quedó en un lugar peligroso (autopista, carril o de noche sin luz), póngase a salvo fuera del tráfico y llame al 911.", "⚠️ If you're stuck somewhere dangerous (freeway, traffic lane, or in the dark), get to safety away from traffic and call 911."); }
  function startVarado() {
    flow = { step: "urg", d: { tipo: "varado" } };
    var n = nowTx(), op = isOpen(n);
    addBot((op ? L("Vamos rápido. El taller está abierto ahora: lo más rápido es llamar al " + C.tel + " y decir que el auto quedó varado. Si no puede llamar, le dejo el pase urgente aquí.",
      "Let's be quick. The shop is open now: the fastest is to call " + C.tel + " and say your car broke down. If you can't call, I'll leave an urgent request here.")
      : L("Vamos rápido. El taller está cerrado ahora (abre " + nextOpening(n) + "), pero le dejo un pase urgente para que le llamen apenas abran.", "Let's be quick. The shop is closed now (opens " + nextOpening(n) + "), but I'll leave an urgent request so they call you as soon as they open."))
      + L("\n¿Qué le pasó al auto?", "\nWhat happened to the car?"),
      VAR().map(function (t) { return { t: t, v: t, flow: true }; }).concat([TEL()]));
  }
  function ask(step) {
    flow.step = step;
    var d = flow.d, n = nowTx();
    if (step === "vehiculo") addBot(L("¿Qué auto es? Marca y modelo (por ejemplo: Ford F-150, Toyota Camry).", "What car is it? Make and model (e.g. Ford F-150, Toyota Camry)."));
    else if (step === "anio") addBot(L("¿De qué año es?", "What year is it?"), [{ t: L("No sé", "Not sure"), v: L("No sé", "Not sure"), flow: true }]);
    else if (step === "sintoma") addBot(L("¿Qué le pasa o qué servicio necesita?", "What's going on, or what service do you need?"), SINT().map(function (t) { return { t: t, v: t, flow: true }; }));
    else if (step === "dia") addBot(L("¿Qué día le queda mejor? Lo anoto como preferencia y el taller le confirma la hora. Atienden de lunes a viernes de 9:00 am a 6:00 pm y el sábado de 9:00 am a 2:00 pm.",
      "Which day works best? I'll note it as a preference and the shop confirms the time. They're open Monday–Friday 9:00 am–6:00 pm and Saturday 9:00 am–2:00 pm."),
      nextWorkdays(n, 5).map(function (x) { return { t: x.label, v: x.label, dow: x.dow, flow: true }; }).concat([{ t: L("Lo antes posible", "As soon as possible"), v: L("Lo antes posible", "As soon as possible"), flow: true }]));
    else if (step === "franja") {
      var fr = franjasDe(d.dow);
      if (fr.length === 1) { d.franja = fr[0].v; addBot(L("Los sábados atienden de 9:00 am a 2:00 pm: lo anoto en esa franja.", "On Saturdays they're open 9:00 am–2:00 pm: I'll note that window.")); setTimeout(function () { ask("nombre"); }, 700); return; }
      addBot(L("¿En qué franja?", "What time window?"), fr);
    }
    else if (step === "lugar") addBot(L("¿Dónde quedó el auto? (calle o cruce y ciudad; así el taller sabe dónde está)", "Where is the car? (street or cross streets and city, so the shop knows where it is)"));
    else if (step === "nombre") addBot(L("¿Cuál es su nombre?", "What's your name?"));
    else if (step === "telefono") addBot(d.tipo === "llamada" ? L("Perfecto, " + d.nombre + ". ¿A qué teléfono le llaman?", "Great, " + d.nombre + ". What number should they call?")
      : (d.tipo === "varado" ? L("¿A qué teléfono le llaman?", "What number should they call?") : L("Último paso: ¿a qué teléfono le llaman o le mandan texto para confirmarle?", "Last step: what number should they call or text to confirm?")));
    else if (step === "resumen") {
      var B = [{ t: L("✅ Confirmar", "✅ Confirm"), v: "__ok", flow: true }, { t: L("✏️ Corregir", "✏️ Edit"), v: "__fix", flow: true }, { t: L("Cancelar", "Cancel"), v: "cancelar", flow: true }];
      var q = L("\n\n¿Lo confirmo?", "\n\nShall I confirm?");
      if (d.tipo === "llamada") { addBot(L("Revise su solicitud de llamada:\n👤 Nombre: ", "Please review your call-back request:\n👤 Name: ") + d.nombre + L("\n💬 Consulta: ", "\n💬 Question: ") + d.consulta + L("\n📱 Teléfono: ", "\n📱 Phone: ") + d.telefono + "\n\n" + aviso() + q, B, "r24-sum"); return; }
      if (d.tipo === "varado") { addBot(L("Revise su pase urgente:\n🚨 Qué pasó: ", "Please review your urgent request:\n🚨 What happened: ") + d.motivo + L("\n📍 Dónde está el auto: ", "\n📍 Car location: ") + d.lugar + L("\n👤 Nombre: ", "\n👤 Name: ") + d.nombre + L("\n📱 Teléfono: ", "\n📱 Phone: ") + d.telefono + L("\n⏱️ Prioridad: urgente", "\n⏱️ Priority: urgent") + (isOpen(n) ? L(" (abierto ahora)", " (open now)") : L(" (abren " + nextOpening(n) + ")", " (opens " + nextOpening(n) + ")")) + "\n\n" + aviso() + q, B, "r24-sum"); return; }
      addBot(L("Revise su solicitud:\n🧾 Tipo: ", "Please review your request:\n🧾 Type: ") + d.servicio + L("\n🚗 Auto: ", "\n🚗 Car: ") + d.vehiculo + " · " + d.anio + L("\n🔧 Síntoma: ", "\n🔧 Issue: ") + d.sintoma + L("\n📅 Día: ", "\n📅 Day: ") + d.dia + L("\n🕐 Franja: ", "\n🕐 Window: ") + d.franja + L("\n👤 Nombre: ", "\n👤 Name: ") + d.nombre + L("\n📱 Teléfono: ", "\n📱 Phone: ") + d.telefono + "\n\n" + aviso() + q, B, "r24-sum");
    }
  }
  function dowFromText(n) {
    var es = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"], en = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    for (var i = 0; i < 7; i++) if (new RegExp("\\b(" + es[i] + "|" + en[i] + ")\\b").test(n)) return i;
    return null;
  }
  function flowInput(t, chip) {
    var n = norm(t), d = flow.d;
    if (/^(cancelar|cancela|salir|dejalo|olvidalo|cancel|stop|exit|quit)$/.test(n)) { flow = null; addBot(L("Sin problema, cancelé la solicitud. ¿Le ayudo con otra cosa?", "No problem, I've cancelled the request. Anything else?"), [CITA_CHIP, LLAMADA_CHIP]); return; }
    if (/\?/.test(t) && flow.step !== "resumen") {
      var bi = bestIntent(t);
      if (bi && bi.s >= 1) { reply(bi.e); setTimeout(function () { ask(flow.step); }, 700); return; }
    }
    switch (flow.step) {
      case "tipo": d.servicio = t.slice(0, 40); ask("vehiculo"); return;
      case "vehiculo":
        if (t.length < 2) { ask("vehiculo"); return; }
        d.vehiculo = t.slice(0, 60); ask("anio"); return;
      case "anio":
        var y = (t.match(/\b(19[5-9]\d|20[0-2]\d)\b/) || [])[1];
        if (!y && /^\d{2}$/.test(n)) y = (+n > 30 ? "19" : "20") + n;
        if (!y && !/no se|not sure|no recuerdo|no lo se|dont know|don t know/.test(n)) { addBot(L("¿Me dice el año con 4 cifras? Por ejemplo 2014. Si no lo sabe, toque «No sé».", "Could you give me the 4-digit year? E.g. 2014. If you're not sure, tap \"Not sure\"."), [{ t: L("No sé", "Not sure"), v: L("No sé", "Not sure"), flow: true }]); return; }
        d.anio = y || L("año no indicado", "year not given"); ask("sintoma"); return;
      case "sintoma":
        d.sintoma = t.slice(0, 100);
        if (isVarado(n)) addBot(L("Si el auto no se puede mover, puedo dejarle además un pase urgente («🚨 Mi auto quedó varado»). Sigo con la cita.", "If the car can't be driven, I can also leave an urgent request (\"🚨 My car broke down\"). Continuing with the appointment."));
        setTimeout(function () { ask("dia"); }, isVarado(n) ? 700 : 0); return;
      case "dia":
        d.dia = t.slice(0, 60);
        d.dow = chip && chip.dow != null ? chip.dow : dowFromText(n);
        if (d.dow === 0 || /domingo|sunday/.test(n)) {
          d.dow = null;
          addBot(L("Lo anoto, pero ojo: los domingos el taller está cerrado, así que le proponen el día más cercano.", "Noted — but the shop is closed on Sundays, so they'll offer the closest day."));
          setTimeout(function () { ask("franja"); }, 700); return;
        }
        ask("franja"); return;
      case "franja": d.franja = t.slice(0, 60); ask("nombre"); return;
      case "urg":
        d.motivo = t.slice(0, 80);
        addBot(alarma());
        setTimeout(function () { ask("lugar"); }, 900); return;
      case "lugar":
        if (t.length < 3) { ask("lugar"); return; }
        d.lugar = t.slice(0, 100); ask("nombre"); return;
      case "nombre":
        var nm = t.replace(/^(me llamo|soy|mi nombre es|my name is|i am|i'm|im)\s+/i, "").trim();
        if (nm.length < 2 || nm.length > 60 || /\d/.test(nm)) { addBot(L("¿Me dice su nombre, por favor? (solo el nombre, sin números)", "What's your name, please? (just your name, no numbers)")); return; }
        d.nombre = nm.split(/\s+/).map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join(" ");
        ask("telefono"); return;
      case "telefono":
        var ph = t.replace(/[\s().+-]/g, "");
        if (/^1\d{10}$/.test(ph)) ph = ph.slice(1);
        if (!/^[2-9]\d{9}$/.test(ph)) { addBot(L("Ese número no me cuadra. Escríbalo con 10 cifras (código de área incluido), por ejemplo 281-555-0123.", "That number doesn't look right. Please use 10 digits with area code, e.g. 281-555-0123.")); return; }
        d.telefono = ph.slice(0, 3) + "-" + ph.slice(3, 6) + "-" + ph.slice(6);
        ask("resumen"); return;
      case "resumen":
        if (t === "__ok" || /^(si|sí|ok|confirmo|confirmar|correcto|dale|yes|confirm|sure|yep)/.test(n)) {
          var nm2 = d.nombre.split(" ")[0], DEMO = L("\n\n(Versión de demostración: esta solicitud no se envió al taller.)", "\n\n(Demo version: this request was not sent to the shop.)");
          if (d.tipo === "llamada") { addBot(L("¡Listo, " + nm2 + "! ✅ El taller recibe su pedido al instante y le llama al " + d.telefono + ".", "All set, " + nm2 + "! ✅ The shop gets your request instantly and will call you at " + d.telefono + ".") + DEMO, [CITA_CHIP, Q("Otra pregunta", "Another question", "__menu", "__menu")]); flow = null; return; }
          if (d.tipo === "varado") { addBot(L("¡Listo, " + nm2 + "! ✅ Su pase urgente queda arriba de la lista. El taller le llama al " + d.telefono + (isOpen(nowTx()) ? "; si puede, adelántese llamando al " + C.tel + "." : " apenas abra (" + nextOpening(nowTx()) + ").") + "\nSi está en un lugar peligroso, no espere: 911.",
            "All set, " + nm2 + "! ✅ Your urgent request is at the top of the list. The shop will call you at " + d.telefono + (isOpen(nowTx()) ? "; if you can, call " + C.tel + " right away." : " as soon as they open (" + nextOpening(nowTx()) + ").") + "\nIf you're somewhere dangerous, don't wait: call 911.") + DEMO, [TEL(), MAPS()]); flow = null; return; }
          addBot(L("¡Listo, " + nm2 + "! ✅ Su solicitud quedó registrada.\nEl taller le llama o le manda texto al " + d.telefono + " para confirmarle el día y la hora (y el presupuesto, si lo pidió). Si tiene fotos o video del problema, puede mandarlos por texto o WhatsApp al " + C.tel + ".",
            "All set, " + nm2 + "! ✅ Your request is in.\nThe shop will call or text you at " + d.telefono + " to confirm the day and time (and your estimate, if you asked for one). Got photos or a video of the problem? Text or WhatsApp them to " + C.tel + ".") + DEMO, [MAPS(), Q("Otra pregunta", "Another question", "__menu", "__menu")]);
          flow = null; return;
        }
        if (t === "__fix" || /corregir|cambiar|editar|edit|change|^no\b/.test(n)) {
          var keep = d.tipo === "llamada" ? { tipo: "llamada", consulta: d.consulta } : { tipo: d.tipo };
          flow.d = keep; addBot(L("De acuerdo, empezamos de nuevo.", "OK, let's start over."));
          setTimeout(function () { if (keep.tipo === "llamada") ask("nombre"); else if (keep.tipo === "varado") { flow.step = "urg"; addBot(L("¿Qué le pasó al auto?", "What happened to the car?"), VAR().map(function (t) { return { t: t, v: t, flow: true }; })); } else { flow.d.servicio = d.servicio; ask("vehiculo"); } }, 500); return;
        }
        ask("resumen"); return;
    }
  }
  function reply(e) {
    var t = typeof e.a === "function" ? e.a() : e.a;
    addBot(t, (e.c || []).map(function (c) { if (typeof c === "function") c = c(); return c.q ? { t: c.t, v: c.q } : c; }));
  }
  function fallback() {
    addBot(L("Eso se lo confirma mejor el taller, así tiene el dato exacto. 😊\nLlame o mande texto al " + C.tel + ", escríbales por WhatsApp, o deje su teléfono y le llaman ellos.",
      "The shop can confirm that for you so you get the exact answer. 😊\nCall or text " + C.tel + ", message them on WhatsApp, or leave your number and they'll call you."), [TEL, WA, LLAMADA_CHIP, CITA_CHIP]);
  }
  function handle(t, chip, shown) {
    if (t === "__menu") { addBot(L("Claro, ¿qué más quiere saber?", "Sure, what else would you like to know?"), [CITA_CHIP, Q("Servicios", "Services", "servicios", "services"), Q("Cómo llegar", "Directions", "direccion", "address"), LLAMADA_CHIP]); return; }
    addUser(chip ? (shown || chip.t) : t);
    var n = norm(t);
    if (!chip) { if (lang === "es" && looksEnglish(n)) setLang("en", false); else if (lang === "en" && looksSpanish(n)) setLang("es", false); }
    if (flow) { flowInput(chip && chip.v ? chip.v : t, chip); return; }
    if (chip && chip.a === "cita") { startCita(); return; }
    if (chip && chip.a === "llamada") { startLlamada(); return; }
    if (chip && chip.a === "varado") { startVarado(); return; }
    if (/^(hola|buenas|buenos dias|buenas tardes|hey|hi|hello)\b/.test(n) && n.split(" ").length <= 3) { addBot(L("¡Hola! ¿En qué le puedo ayudar? Puedo pedirle un presupuesto o una cita, dejar un pase urgente si el auto quedó varado o contarle servicios y horario.", "Hi! How can I help? I can request an estimate or appointment, leave an urgent request if your car broke down, or tell you about services and hours."), [CITA_CHIP, URG_CHIP, Q("Servicios", "Services", "servicios", "services"), LLAMADA_CHIP]); return; }
    if (/^(horario y direccion|hours and address)$/.test(n)) { addBot(horarioA() + "\n\n📍 " + C.dir + ".", [MAPS, CITA_CHIP, LLAMADA_CHIP]); return; }
    var bi = bestIntent(t);
    var price = isPriceQ(n);
    if (isVarado(n) && !/\?/.test(t)) { startVarado(); return; }
    if (wantsCita(n) && !price && (!bi || bi.s < 2 || /cita|presupuesto|cotiz|appointment|estimate|quote|schedule/.test(n))) { startCita(); return; }
    if (price && !(bi && bi.e.id === "nolist")) { reply(byId("precio")); return; }
    if (bi) { reply(bi.e); return; }
    lastQ = t; fallback();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build); else build();
  window.R24 = { open: open, _test: { bestIntent: bestIntent, norm: norm, isOpen: isOpen, nowTx: nowTx, lang: function () { return lang; } } };
})();
