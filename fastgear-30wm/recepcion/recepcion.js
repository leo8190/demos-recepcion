/* R24-HUMANO-1018 */
/* R24-BRIEF-1018: avatar humano, botones rápidos, "que me llamen", aviso al equipo, sin "no tengo ese dato" */
/* Recepción 24 h · FastGear Auto Repair (taller mecánico familiar en Mesa, AZ) — DEMO privada, bilingüe ES/EN.
   Sale de plantilla-widget/recepcion.base.js (reglas del brief 18/10 + R24-HUMANO), en la variante de talleres ES/EN en «usted» (Roger's Motors).
   100% del lado del cliente: sin APIs, sin claves, sin envío de datos (la foto se muestra solo en este navegador).
   Respuestas sacadas solo de lo que publica fastgearauto.com (1 página, revisada el 20/10/2026):
   - 1060 S Alma School Rd, Mesa, AZ 85210 («Southern & Alma School in the East valley»). Teléfono 480-834-2454 (1 sola línea).
     Correo info@fastgearauto.com. Sin formulario. Sin WhatsApp.
   - Horario (pie): lunes a viernes 7 AM–5 PM; sábado 7 AM–3 PM; domingo cerrado («Sunday-Closed») (hora de Arizona, America/Phoenix,
     sin horario de verano).
   - Servicios: Engine care; Hybrids Welcome (técnicos certificados ASE leen los códigos de falla); Transmission (automática o manual,
     Auto-Stick, levas); Full Service: «We have a Tow Truck (flatbed)», la causa de cualquier luz de advertencia, Brakes, Tune-ups, pumps,
     fluid changes «and anything else». About: «We guarantee all work», muy bien calificados y con buenas reseñas, servicio completo,
     atienden a todos («Women can feel safe here»), familiar y atendido por sus dueños, «Se habla Español». Logo: «EV · All makes & models».
   Sin precios (la recepción no da ninguno), sin WhatsApp; la grúa: su web dice que tienen grúa de plataforma, pero la recepción no la promete
   (solo anota si el vehículo anda, está parado o necesita grúa y el taller confirma); garantía: solo «We guarantee all work», sin plazos;
   financiamiento, formas de pago, tiempos, atención sin cita ni nada que su web no diga → «su web no lo dice». No nombra a nadie. */
(function () {
  "use strict";
  var C = {
    nombre: "FastGear Auto Repair", corto: "FastGear Auto Repair",
    dir: "1060 S Alma School Rd, Mesa, AZ 85210", maps: "https://www.google.com/maps/dir/?api=1&destination=FastGear+Auto+Repair+1060+S+Alma+School+Rd+Mesa+AZ+85210",
    tel: "480-834-2454", telh: "+14808342454",
    email: "info@fastgearauto.com"
  };
  var qlang = (location.search.match(/[?&]lang=(es|en)\b/) || [])[1];
  var lang = qlang || ((window.R24_LANG === "auto" ? ((navigator.language || "en").slice(0, 2) === "es" ? "es" : "en") : (window.R24_LANG || "es")).slice(0, 2) === "en" ? "en" : "es");
  function L(es, en) { return lang === "en" ? en : es; }
  // Horario publicado (minutos desde las 0:00, hora de Arizona). 0 = domingo: cerrado («Sunday-Closed»). Sábado: 7:00 a 15:00.
  var LV = [[420, 1020]], SA = [[420, 900]];
  var H = { 1: LV, 2: LV, 3: LV, 4: LV, 5: LV, 6: SA, 0: [] };
  var DIAS = { es: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"], en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] };
  var MESES = { es: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"], en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] };
  function horarioTxt() {
    return L("Horario que publica el taller (hora de Arizona):\n• Lunes a viernes: 7:00 a.m. – 5:00 p.m.\n• Sábado: 7:00 a.m. – 3:00 p.m.\n• Domingo: cerrado",
      "Shop hours (Arizona time):\n• Monday–Friday: 7:00 AM – 5:00 PM\n• Saturday: 7:00 AM – 3:00 PM\n• Sunday: closed");
  }
  var HCORTO = { es: "lunes a viernes de 7 a 5 y sábado de 7 a 3", en: "Mon–Fri 7–5, Sat 7–3" };
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


  var CITA_CHIP = { a: "cita", get t() { return L("🔧 Pedir cita o presupuesto", "🔧 Appointment or estimate"); } };
  var LLAMADA_CHIP = { a: "llamada", get t() { return L("📲 Que me llamen o escriban", "📲 Call or text me back"); } };
  function aviso() { return L("🔔 El taller recibe este pedido al instante (en esta demo no se envía nada).", "🔔 The shop gets this request instantly (nothing is sent in this demo)."); }
  var lastQ = "";
  function TEL1() { return { t: L("Llamar al " + C.tel, "Call " + C.tel), tel: C.telh }; }
  function MAPS1() { return { t: L("📍 Cómo llegar", "📍 Get directions"), url: C.maps }; }
  function Q(es, en, qes, qen) { return { get t() { return L(es, en); }, get q() { return L(qes || es, qen || en); } }; }
  var SVC = Q("🛠️ Servicios", "🛠️ Services", "servicios", "services");
  var HOR = Q("🕐 Horario y dirección", "🕐 Hours & location", "horario y direccion", "hours and location");
  var PARADO = Q("🚗 Mi carro no arranca", "🚗 My car won't start", "mi carro no arranca", "my car won't start");
  function dirA() { return L("Están en " + C.dir + " (Southern y Alma School, en el East Valley).\n📞 " + C.tel,
    "They're at " + C.dir + " (Southern & Alma School, in the East Valley).\n📞 " + C.tel); }
  function horarioA() {
    var n = nowTx(), s = isOpen(n) ? L("🟢 Ahora están abiertos, hasta las " + hm(closeAt(n)) + ".", "🟢 They're open now, until " + hm(closeAt(n)) + ".")
      : L("🌙 Ahora está cerrado" + (n.dow === 0 ? " (domingo)" : "") + "; abre " + nextOpening(n) + ". Igual le tomo el pedido ahora y el taller lo recibe al instante.", "🌙 It's closed right now" + (n.dow === 0 ? " (Sunday)" : "") + "; opens " + nextOpening(n) + ". I can still take your request now and the shop gets it instantly.");
    return horarioTxt() + "\n" + s;
  }
  function serviciosA() {
    return L("Lo que publica el taller (servicio completo, negocio familiar en Mesa):\n• Cuidado y reparación del motor\n• Diagnóstico: la causa de cualquier luz de advertencia del tablero (técnicos certificados ASE leen los códigos de falla)\n• Híbridos bienvenidos\n• Transmisión automática o manual (Auto-Stick y levas)\n• Frenos\n• Afinaciones\n• Bombas\n• Cambios de fluidos\n• «y todo lo demás»\nAdemás, su web dice que tienen grúa de plataforma. ¿Qué le pasa a su vehículo?",
      "What the shop lists (full service, family-owned in Mesa):\n• Engine care and repair\n• Diagnostics: the cause of any warning light (ASE Certified Technicians pull the trouble codes)\n• Hybrids welcome\n• Automatic or manual transmissions (Auto-Stick and paddle shifters)\n• Brakes\n• Tune-ups\n• Pumps\n• Fluid changes\n• \"and anything else\"\nTheir site also says they have a flatbed tow truck. What's going on with your vehicle?");
  }
  function noListA() {
    return L("Eso su web no lo nombra en particular. Sí dice que son un taller de servicio completo («Brakes, Tune-ups, pumps, fluid changes and anything else»), pero no se lo voy a asegurar: se lo confirma el taller. Llame al " + C.tel + " (" + hc() + "), o déjeme su teléfono y le contactan ellos.",
      "Their site doesn't name that specifically. It does say they're a full-service shop (\"Brakes, Tune-ups, pumps, fluid changes and anything else\"), but I won't promise it: the shop will confirm. Call " + C.tel + " (" + hc() + "), or leave your number and they'll get back to you.");
  }
  function noPubA() {
    return L("Eso su web no lo dice, así que no se lo voy a inventar: se lo confirma el taller. Llame al " + C.tel + " (" + hc() + "), o déjeme su teléfono y le contactan ellos.",
      "Their site doesn't say, so I won't make it up: the shop will confirm. Call " + C.tel + " (" + hc() + "), or leave your number and they'll get back to you.");
  }
  function S(es, en) { return function () { return L(es, en); }; }
  var KB = [
    { id: "afinacion", k: ["afinacion", "afinar", "afinaciones", "tune up", "tune ups", "tuneup", "tuneups", "bujias", "spark plugs", "tune-up", "tune-ups"],
      a: S("Sí: afinaciones. Su web las lista entre sus servicios («Tune-ups»). Qué incluye en su vehículo se lo dice el taller al verlo. ¿Le dejo pedida la cita?",
        "Yes: tune-ups. Their site lists them among its services. What it includes for your vehicle, the shop tells you when they see it. Want me to request an appointment?"), c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "frenos", k: ["freno", "frenos", "balatas", "pastillas", "discos", "rotores", "rechina", "rechinan", "chillan", "pedal blando", "brake", "brakes", "pads", "rotors", "squeak", "squeal", "grinding"],
      a: S("Sí: frenos. Su web los lista entre sus servicios («Brakes»). Qué hay que cambiar se lo dice el taller después de revisarlos. ¿Le dejo pedida la cita para que los revisen?",
        "Yes: brakes. Their site lists them among its services. What needs replacing, the shop tells you after checking them. Want me to request an appointment to have them checked?"), c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "transmision", k: ["transmision", "caja", "caja de cambios", "patina", "patinando", "no cambia", "cambios duros", "automatica", "estandar", "manual", "levas", "transmission", "slipping", "rough shifting", "won t shift", "gearbox", "paddle shifters", "auto stick"],
      a: S("Sí: transmisiones. Su web dice «automática o manual, Auto-Stick y levas: sea cual sea la configuración, la dejamos funcionando como usted quiere». Qué conviene en su caso se lo dice el taller después de revisarla. ¿Le dejo pedida la revisión?",
        "Yes: transmissions. Their site says \"Automatic or Manual. Auto-Stick and paddle shifters. Regardless of the configuration, we can get it operating as you desire.\" What makes sense for you, the shop tells you after checking it. Want me to request a check?"), c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "hibrido", k: ["hibrido", "hibridos", "electrico", "electricos", "ev", "tesla", "prius", "hybrid", "hybrids", "electric", "electric car"],
      a: S("Su web dice «Hybrids Welcome» (híbridos bienvenidos) y su logo dice «EV · All makes & models», pero no detalla qué trabajos hacen en autos eléctricos: eso se lo confirma el taller. ¿Le dejo pedida la revisión con su modelo?",
        "Their site says \"Hybrids Welcome\" and the logo reads \"EV · All makes & models\", but it doesn't spell out what they do on electric cars: the shop will confirm. Want me to request a check with your model?"), c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "motor", k: ["motor", "falla", "fallas", "tironea", "tiembla", "pierde fuerza", "sin fuerza", "humo", "se recalienta", "ruido en el motor", "check engine", "luz del motor", "luz del tablero", "luces del tablero", "testigo", "diagnostico", "escaner", "codigo", "codigos", "engine", "misfire", "shaking", "loss of power", "smoke", "overheating", "engine noise", "diagnostic", "diagnostics", "scan", "code", "codes", "warning light", "dashboard light"],
      a: S("Sí: su web dice que encuentran la causa de cualquier luz de advertencia del tablero y que sus técnicos certificados ASE leen los códigos de falla de la computadora; además lista el cuidado del motor. Qué tiene su motor se lo dice el taller después de revisarlo. ¿Le dejo pedida la revisión?",
        "Yes: their site says they can get to the cause of any warning light and that their ASE Certified Technicians pull the trouble codes from the on-board computer; it also lists engine care. What's wrong with your engine, the shop tells you after checking it. Want me to request a check?"), c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "fluidos", k: ["aceite", "cambio de aceite", "sintetico", "filtro", "fluido", "fluidos", "anticongelante", "refrigerante", "liquido de frenos", "bomba", "bombas", "bomba de agua", "bomba de gasolina", "mantenimiento", "preventivo", "servicio de rutina", "oil", "oil change", "synthetic", "filter", "fluid", "fluids", "coolant", "pump", "pumps", "water pump", "fuel pump", "maintenance", "routine", "preventive"],
      a: S("Sí: su web lista bombas y cambios de fluidos («pumps, fluid changes») dentro de su servicio completo. Qué incluye en su vehículo (tipo de aceite o de fluido, piezas) se lo dice el taller. Abren de lunes a viernes de 7 a 5 y el sábado de 7 a 3. ¿Le dejo pedida la cita?",
        "Yes: their site lists pumps and fluid changes as part of its full service. What it includes for your vehicle (type of oil or fluid, parts), the shop tells you. They're open Mon–Fri 7–5 and Saturday 7–3. Want me to request an appointment?"), c: [CITA_CHIP, HOR] },
    { id: "nomaneja", k: ["no arranca", "no prende", "no enciende", "no anda", "varado", "varada", "me quede", "emergencia", "urgente", "grua", "remolque", "remolcar", "plataforma", "won t start", "wont start", "no start", "not running", "stranded", "broke down", "emergency", "urgent", "tow", "towing", "tow truck", "flatbed"],
      a: function () { var n = nowTx(); return L("Lo siento. Su web dice que tienen grúa de plataforma («Tow Truck (flatbed)»), pero si se la pueden mandar, cuándo y cuánto cuesta lo confirma el taller: no se lo voy a prometer. Lo que sí hago: le dejo el pedido con el vehículo marcado como parado (o que necesita grúa) y el taller le llama o le escribe." + (isOpen(n) ? " Ahora están abiertos: también puede llamar al " + C.tel + "." : " Ahora está cerrado (abre " + nextOpening(n) + "); su pedido le llega igual al instante."),
        "Sorry to hear that. Their site says they have a flatbed tow truck, but whether they can send it, when, and what it costs, the shop has to confirm, so I won't promise it. What I can do: log your request with the vehicle marked as down (or needing a tow) and the shop calls or texts you back." + (isOpen(n) ? " They're open now: you can also call " + C.tel + "." : " It's closed now (opens " + nextOpening(n) + "); your request still reaches them instantly.")); }, c: [CITA_CHIP, LLAMADA_CHIP, TEL1] },
    { id: "nolist", k: ["aire acondicionado", "a c", "clima", "no enfria", "compresor", "alternador", "motor de arranque", "bateria", "llanta", "llantas", "alineacion", "balanceo", "carroceria", "hojalateria", "pintura", "choque", "smog", "emisiones", "vidrios", "parabrisas", "a domicilio", "suspension", "amortiguadores", "correa de distribucion", "distribucion", "air conditioning", "ac", "not cooling", "alternator", "starter", "battery", "tire", "tires", "alignment", "body work", "paint", "collision", "emissions", "windshield", "mobile mechanic", "suspension", "shocks", "struts", "timing belt"], a: noListA, c: [TEL1, LLAMADA_CHIP, CITA_CHIP] },
    { id: "servicios", k: ["servicios", "que hacen", "que reparan", "que arreglan", "trabajos", "mecanica", "mecanico", "taller", "services", "what do you fix", "what do you do", "repairs", "mechanic"], a: serviciosA, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "precio", k: ["precio", "precios", "cuanto cuesta", "cuanto sale", "cuanto cobran", "costo", "caro", "barato", "descuento", "presupuesto gratis", "es gratis", "price", "prices", "how much", "cost", "cheap", "rates", "discount", "free estimate"],
      a: S("Los precios se los da el taller: esta recepción no da precios ni los inventa, y su web no publica ninguno. Lo que puedo hacer: dejarle pedido el presupuesto con su vehículo y lo que le pasa, y le contactan en español o en inglés.",
        "Pricing comes from the shop: this front desk doesn't quote or make up prices, and their site doesn't publish any. What I can do: request the estimate with your vehicle and what's going on, and they'll get back to you in English or Spanish."), c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "garantia", k: ["garantia", "garantias", "garantizan", "warranty", "guarantee", "guaranteed"],
      a: S("Su web dice «We guarantee all work» (garantizan todo su trabajo). Plazos y condiciones de la garantía no los publica, así que no se los voy a inventar: se los confirma el taller al " + "480-834-2454" + ".",
        "Their site says \"We guarantee all work.\" It doesn't publish the terms or how long, so I won't make them up: the shop will confirm at 480-834-2454."), c: [TEL1, LLAMADA_CHIP, CITA_CHIP] },
    { id: "nopub", k: ["financiamiento", "financiar", "a plazos", "credito", "zelle", "efectivo", "tarjeta", "formas de pago", "como pago", "cuanto tarda", "cuanto tiempo", "mismo dia", "carro de cortesia", "financing", "finance", "credit", "cash", "card", "payment", "how long", "same day", "loaner"], a: noPubA, c: [TEL1, LLAMADA_CHIP] },
    { id: "walkin", k: ["sin cita", "walk in", "walk-in", "puedo ir", "puedo llegar", "llegar sin avisar", "necesito cita", "dejar el carro", "without appointment", "drop by", "stop by", "drop off", "need an appointment"],
      a: S("Su web no dice si atienden sin cita; lo que publica es el teléfono 480-834-2454, el correo y el horario (lunes a viernes de 7 a 5, sábado de 7 a 3). Para no ir en balde, le dejo aquí pedida la cita y el taller le confirma, o llame al 480-834-2454.",
        "Their site doesn't say whether they take walk-ins; it lists the phone 480-834-2454, the email and the hours (Mon–Fri 7–5, Sat 7–3). To be safe, I can request the appointment here and the shop confirms, or call 480-834-2454."), c: [CITA_CHIP, TEL1] },
    { id: "idioma", k: ["espanol", "hablan espanol", "ingles", "spanish", "english", "speak spanish", "bilingue", "bilingual", "se habla"],
      a: S("Sí: su web dice «Se habla Español». El teléfono es uno solo, el 480-834-2454. Aquí también le atiendo en los dos idiomas (botón EN arriba).",
        "Yes: their site says \"Se habla Español\" (Spanish spoken). There's one phone number, 480-834-2454. I can help you in English or Spanish too (ES button at the top)."), c: [CITA_CHIP, TEL1] },
    { id: "historia", k: ["dueno", "quien", "quienes son", "experiencia", "historia", "confianza", "familia", "familiar", "resenas", "seguro", "segura", "mujer", "mujeres", "certificados", "ase", "owner", "who", "experience", "trust", "family", "reviews", "safe", "women", "certified"],
      a: S("FastGear Auto Repair es un taller familiar, atendido por sus dueños, en Mesa (Southern y Alma School, East Valley). Su web dice que garantizan todo su trabajo, que están muy bien calificados y tienen excelentes reseñas, que sus técnicos están certificados por ASE, que atienden a todos («las mujeres pueden sentirse seguras aquí») y que se habla español.",
        "FastGear Auto Repair is a family-owned and operated shop in Mesa (Southern & Alma School, East Valley). Their site says they guarantee all work, are highly ranked with great reviews, have ASE Certified Technicians, offer services to all (\"Women can feel safe here\") and speak Spanish."), c: [CITA_CHIP, HOR] },
    { id: "horario", k: ["horario", "horas", "abren", "abierto", "cierran", "a que hora", "sabado", "domingo", "fin de semana", "lunes", "hoy abren", "hours", "open", "close", "closing", "saturday", "sunday", "weekend"], a: horarioA, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "direccion", k: ["donde", "direccion", "ubicacion", "ubicados", "como llego", "llegar", "alma school", "southern", "mesa", "address", "location", "where", "directions", "located"],
      a: function () { return dirA() + L("\nSi quiere, le dejo pedida la cita y el taller le confirma.", "\nI can request an appointment and the shop confirms."); }, c: [MAPS1, CITA_CHIP] },
    { id: "contacto", k: ["telefono", "telefonos", "numero", "llamar", "contacto", "correo", "email", "mail", "whatsapp", "wasap", "watsap", "texto", "mensaje de texto", "sms", "formulario", "phone", "number", "call", "text", "contact", "form"],
      a: S("Canales que publica el taller:\n📞 480-834-2454 (lunes a viernes de 7:00 a.m. a 5:00 p.m., sábado de 7:00 a.m. a 3:00 p.m.)\n✉️ Correo: info@fastgearauto.com\nSu web no tiene formulario ni publica WhatsApp. O deje aquí su teléfono y le contactan ellos, por llamada o por texto.",
        "Channels the shop publishes:\n📞 480-834-2454 (Mon–Fri 7:00 AM – 5:00 PM, Sat 7:00 AM – 3:00 PM)\n✉️ Email: info@fastgearauto.com\nTheir site has no form and doesn't list WhatsApp. Or leave your number here and they'll reach out, by call or text."), c: [TEL1, LLAMADA_CHIP] },
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
  function looksEnglish(n) { var w = n.split(" "), en = ["the", "my", "is", "do", "you", "what", "how", "car", "truck", "are", "your", "can", "open", "hours", "much", "need", "want", "when", "where", "does", "have", "i", "not", "won", "start"]; var c = w.filter(function (x) { return en.indexOf(x) >= 0; }).length; return c >= 2 && !/[ñ]|\b(el|la|los|mi|que|como|cuanto|tienen|hacen|carro|auto|camioneta)\b/.test(n); }
  function looksSpanish(n) { return /\b(hola|cuanto|tienen|hacen|ustedes|carro|camioneta|troca|precio|horario|donde|necesito|quiero|mi carro|mi camioneta|gracias|cual|frenos|transmision|aceite|arranca|afinacion|espanol)\b/.test(n); }
  function byId(id) { return KB.filter(function (e) { return e.id === id; })[0]; }

  var body, input, status, panel, launch, fileIn, opened = false;
  var flow = null;
  function el(tag, cls, html) { var x = document.createElement(tag); if (cls) x.className = cls; if (html != null) x.innerHTML = html; return x; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function linkify(s) { return esc(s).replace(/480-834-2454/g, '<a href="tel:+14808342454">480-834-2454</a>').replace(/info@fastgearauto\.com/g, '<a href="mailto:info@fastgearauto.com">info@fastgearauto.com</a>'); }
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
    if (isOpen(n)) { status.className = "r24-status"; status.textContent = L("🟢 Abierto ahora · hasta las " + hm(closeAt(n)) + " · " + C.tel, "🟢 Open now · until " + hm(closeAt(n)) + " · " + C.tel); }
    else { status.className = "r24-status r24-closed"; status.textContent = L("🌙 Fuera de horario (abre " + nextOpening(n) + ") · le atiendo igual y el taller recibe su pedido", "🌙 After hours (opens " + nextOpening(n) + ") · I'll still take your request"); }
  }
  function menuChips() { return [CITA_CHIP, PARADO, SVC, HOR, LLAMADA_CHIP]; }
  var banner;
  function headTexts() {
    panel.querySelector(".r24-ht b").innerHTML = L("Recepción 24 h", "24/7 Front Desk") + ' <span class="r24-online">● ' + L("en línea", "online") + "</span>";
    panel.querySelector(".r24-ht small").textContent = C.corto + " · Mesa, AZ";
    panel.querySelector(".r24-in").placeholder = L("Escriba su pregunta…", "Type your question…");
    panel.querySelector(".r24-send").textContent = L("Enviar", "Send");
    panel.querySelector(".r24-lang").textContent = lang === "en" ? "ES" : "EN";
    panel.querySelector(".r24-lang").setAttribute("aria-label", lang === "en" ? "Cambiar a español" : "Switch to English");
    panel.querySelector(".r24-legal").textContent = L("Asistente automático de demostración · sus datos no se envían a ningún sitio", "Automated demo assistant · your data isn't sent anywhere");
    launch.querySelector(".r24-lt").textContent = L("Recepción 24 h", "24/7 Front Desk");
    launch.setAttribute("aria-label", L("Abrir la recepción 24 h", "Open the 24/7 front desk"));
    banner.textContent = L("Demo privada preparada para FastGear Auto Repair", "Private demo prepared for FastGear Auto Repair");
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
    addBot(L((ab ? "Claro. Ahora están abiertos: llame al " + C.tel + " y le atiende una persona (su web dice «Se habla Español»)." : "Claro. Ahora el taller está cerrado" + (n.dow === 0 ? " (el domingo no abren)" : "") + "; abre " + nextOpening(n) + ". En horario puede llamar al " + C.tel + " (su web dice «Se habla Español»).") + " Si prefiere, le contactan ellos: déjeme su nombre y teléfono y el pedido les llega al instante.",
      (ab ? "Sure. They're open now: call " + C.tel + " and a person will help you, in English or Spanish." : "Sure. The shop is closed right now" + (n.dow === 0 ? " (closed on Sunday)" : "") + "; it opens " + nextOpening(n) + ". During business hours you can call " + C.tel + ", in English or Spanish.") + " Or they can reach out to you: leave your name and number and they get the request instantly."), [TEL1(), LLAMADA_CHIP, CITA_CHIP]);
  }
  function greet() {
    addBot(L("¡Hola! 👋 Soy el asistente virtual con IA de FastGear Auto Repair (taller mecánico familiar en Mesa, AZ). Le ayudo a pedir una cita o un presupuesto, le tomo los datos para que el taller lo llame o le escriba, en español o en inglés, o le cuento servicios, horario y dirección, a cualquier hora: también de noche y el domingo, o cuando no pueden atender el teléfono.\n¿En qué le ayudo?",
      "Hi! 👋 I'm the AI virtual assistant for FastGear Auto Repair (family-owned auto repair in Mesa, AZ). I can set up an appointment or an estimate, take your details so the shop calls or texts you back, in English or Spanish, or answer questions about services, hours and location — any time, including nights and Sundays, or when nobody can pick up the phone.\nHow can I help?"), menuChips());
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
  // Lo que le pasa, con los servicios que publica su web
  function SINT() { return lang === "en" ? ["Tune-up / maintenance", "Brakes", "Transmission", "Engine / warning light", "Hybrid", "Pumps / fluid changes", "Won't start", "Other / not sure"]
    : ["Afinación / mantenimiento", "Frenos", "Transmisión", "Motor / luz del tablero", "Híbrido", "Bombas / cambio de fluidos", "No arranca", "Otra cosa / no sé"]; }
  function IDIOMAS() { return opts([L("🇲🇽 En español", "🇲🇽 In Spanish"), L("🇺🇸 En inglés", "🇺🇸 In English"), L("Me da igual", "Either is fine")]); }
  function ESTADO() { return opts([L("✅ Anda, puedo llevarlo", "✅ It runs, I can drive it in"), L("⚠️ Anda, pero con falla", "⚠️ It runs, but barely"), L("⛔ No arranca / está parado", "⛔ Won't start / it's down"), L("🚛 Necesita grúa", "🚛 Needs a tow")]); }
  function FOTO() { return [{ t: L("📷 Subir foto", "📷 Upload photo"), foto: true }, { t: L("Sin foto", "No photo"), v: "__nofoto", flow: true }]; }
  function MEDIO() { return opts([L("📞 Llamada", "📞 Phone call"), L("💬 Mensaje de texto", "💬 Text message")]); }
  function franjas(dow) {
    if (dow === 6) return opts([L("Sábado 7:00 a.m. – 3:00 p.m.", "Saturday 7:00 AM – 3:00 PM")]);
    return opts([L("Mañana (7:00 a.m. – 12:00 p.m.)", "Morning (7:00 AM – 12:00 PM)"), L("Tarde (12:00 – 5:00 p.m.)", "Afternoon (12:00 – 5:00 PM)"), L("Me da igual", "Either is fine")]);
  }
  function startCita() {
    flow = { step: "tipo", d: { tipo: "cita" } };
    addBot(L("¡Con gusto! En unos pasos le dejo el pedido listo para el taller. (Escriba «cancelar» si quiere salir.)\n¿Qué necesita?", "Happy to help! A few quick steps and your request is ready for the shop. (Type \"cancel\" to exit.)\nWhat do you need?"),
      opts([L("Cita para llevar el vehículo", "Appointment to bring the vehicle in"), L("Presupuesto / revisión", "Estimate / check-up")]));
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
    setTimeout(function () { ask("dia"); }, 600);
  }
  function medioTxt(d) { return d.medio || L("Llamada", "Phone call"); }
  function ask(step) {
    flow.step = step;
    var d = flow.d, n = nowTx();
    if (step === "vehiculo") addBot(L("¿Año, marca y modelo del vehículo? (por ejemplo: 2014 Toyota Camry)", "Year, make and model? (e.g. 2014 Toyota Camry)"));
    else if (step === "sintoma") addBot(L("¿Qué le pasa o qué servicio necesita?", "What's going on, or what service do you need?"), opts(SINT()));
    else if (step === "idioma") addBot(L("¿En qué idioma prefiere que le atiendan? (Su web dice «Se habla Español».)", "Which language would you like them to use? (Their site says \"Se habla Español\".)"), IDIOMAS());
    else if (step === "estado") addBot(L("¿El vehículo anda o está parado? (Solo lo anoto para el taller: si hace falta grúa, se lo confirma el taller.)", "Does the vehicle run, or is it down? (I just note it for the shop: if it needs a tow, the shop will confirm.)"), ESTADO());
    else if (step === "foto") { if (d.foto) { ask("dia"); return; } addBot(L("¿Tiene una foto (de la luz del tablero, la fuga o la pieza)? Es opcional y ayuda al taller a preparar el presupuesto.", "Do you have a photo (the dashboard light, the leak or the part)? It's optional and helps the shop prepare the estimate."), FOTO()); }
    else if (step === "dia") {
      var days = nextWorkdays(n, 6); flow.days = {}; days.forEach(function (x) { flow.days[x.label] = x.dow; });
      addBot(L("¿Qué día le queda mejor? Lo anoto como preferencia y el taller se lo confirma. Abren de lunes a viernes de 7:00 a.m. a 5:00 p.m. y el sábado de 7:00 a.m. a 3:00 p.m.; el domingo, cerrado.", "Which day works best? I'll note it as a preference and the shop confirms. They're open Monday–Friday 7:00 AM – 5:00 PM and Saturday 7:00 AM – 3:00 PM; closed Sunday."),
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
      addBot(L("Revise su solicitud:\n🧾 Tipo: ", "Please review your request:\n🧾 Type: ") + d.servicio + L("\n🚗 Vehículo: ", "\n🚗 Vehicle: ") + d.vehiculo + L("\n🔧 Qué le pasa: ", "\n🔧 Problem: ") + d.sintoma + L("\n🗣️ Idioma: ", "\n🗣️ Language: ") + d.idioma + L("\n🚦 Estado: ", "\n🚦 Status: ") + d.estado + L("\n📷 Foto: ", "\n📷 Photo: ") + foto + L("\n📅 Día: ", "\n📅 Day: ") + d.dia + L("\n🕐 Franja: ", "\n🕐 Window: ") + d.franja + L("\n👤 Nombre: ", "\n👤 Name: ") + d.nombre + L("\n📲 Cómo: ", "\n📲 How: ") + medioTxt(d) + L("\n📱 Teléfono: ", "\n📱 Phone: ") + d.telefono + "\n\n" + aviso() + q, B, "r24-sum");
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
        addBot(/cita|appointment/.test(n) ? L("Bien. Le anoto el día que prefiere y el taller se lo confirma.", "Got it. I'll note your preferred day and the shop confirms.")
          : L("Bien. Aquí no doy precios: el presupuesto se lo da el taller después de ver los datos o el vehículo.", "Got it. I don't quote prices here: the shop gives you the estimate after reviewing the details or the vehicle."));
        setTimeout(function () { ask("vehiculo"); }, 600); return;
      case "vehiculo":
        if (t.length < 2) { ask("vehiculo"); return; }
        d.vehiculo = t.slice(0, 60); ask("sintoma"); return;
      case "sintoma": d.sintoma = t.slice(0, 100); ask("idioma"); return;
      case "idioma":
        d.idioma = idiomaDe(t);
        if (d.tipo === "llamada") { ask("medio"); return; }
        ask("estado"); return;
      case "estado":
        d.estado = t.slice(0, 50);
        if (/parad|no arranca|grua|down|won.t start|tow/i.test(n)) addBot(L("Anotado: el taller ve en el pedido que el vehículo " + (/grua|tow/i.test(n) ? "necesita grúa" : "no arranca o está parado") + " y le dice cómo llevarlo. Su web dice que tienen grúa de plataforma, pero si se la pueden mandar y cuándo lo confirma el taller: no se lo prometo.", "Noted: the shop will see the vehicle " + (/grua|tow/i.test(n) ? "needs a tow" : "won't start or is down") + " and tell you how to get it there. Their site says they have a flatbed tow truck, but whether and when they can send it, the shop confirms: I won't promise it."));
        setTimeout(function () { ask("foto"); }, /parad|grua|down|tow|arranca|start/i.test(n) ? 700 : 0); return;
      case "foto":
        if (t !== "__nofoto") d.foto = L("la describe: ", "described: ") + t.slice(0, 60);
        ask("dia"); return;
      case "dia":
        d.dia = t.slice(0, 60); d.dow = flow.days && flow.days[t] != null ? flow.days[t] : -1;
        if (/^(lo antes posible|as soon as possible)$/i.test(t)) { d.franja = L("La primera disponible", "First available"); ask(d.nombre ? "medio" : "nombre"); return; }
        if (/domingo|sunday/i.test(t)) { addBot(L("El domingo el taller está cerrado. ¿Otro día?", "The shop is closed on Sunday. Another day?")); setTimeout(function () { ask("dia"); }, 500); return; }
        if (d.dow === 6) { d.franja = L("Sábado 7:00 a.m. – 3:00 p.m.", "Saturday 7:00 AM – 3:00 PM"); addBot(L("El sábado abren solo de 7:00 a.m. a 3:00 p.m.; lo anoto en esa franja.", "On Saturday they're open only 7:00 AM – 3:00 PM; I'll note that window.")); setTimeout(function () { ask(d.nombre ? "medio" : "nombre"); }, 500); return; }
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
        if (!/^[2-9]\d{9}$/.test(ph)) { addBot(L("Ese número no me cuadra. Escríbalo con 10 cifras (con código de área), por ejemplo 480-555-0123.", "That number doesn't look right. Please use 10 digits with area code, e.g. 480-555-0123.")); return; }
        d.telefono = ph.slice(0, 3) + "-" + ph.slice(3, 6) + "-" + ph.slice(6);
        ask("resumen"); return;
      case "resumen":
        if (t === "__ok" || /^(si|sí|ok|confirmo|confirmar|correcto|dale|yes|confirm|sure|yep)/.test(n)) {
          var nm2 = d.nombre.split(" ")[0], DEMO = L("\n\n(Versión de demostración: esta solicitud no se envió al taller.)", "\n\n(Demo version: this request was not sent to the shop.)"), tx = /texto|text/i.test(medioTxt(d));
          var en1 = /Ingl|English/.test(d.idioma), es1 = /Espa|Spanish/.test(d.idioma), idm = en1 ? L(" en inglés", " in English") : (es1 ? L(" en español", " in Spanish") : "");
          if (d.tipo === "llamada") { addBot(L("¡Listo, " + nm2 + "! ✅ El taller recibe su pedido al instante y le " + (tx ? "escribe" : "llama") + idm + " al " + d.telefono + ".", "All set, " + nm2 + "! ✅ The shop gets your request instantly and will " + (tx ? "text" : "call") + " you" + idm + " at " + d.telefono + ".") + DEMO, [CITA_CHIP, Q("Otra pregunta", "Another question", "__menu", "__menu")]); flow = null; return; }
          addBot(L("¡Listo, " + nm2 + "! ✅ Su solicitud quedó registrada en FastGear Auto Repair.\nEl taller le " + (tx ? "escribe" : "llama") + idm + " al " + d.telefono + " para confirmar el día y la hora; el presupuesto se lo dan ellos.", "All set, " + nm2 + "! ✅ Your request is in at FastGear Auto Repair.\nThe shop will " + (tx ? "text" : "call") + " you" + idm + " at " + d.telefono + " to confirm the day and time; the estimate comes from them.") + DEMO, [MAPS1(), Q("Otra pregunta", "Another question", "__menu", "__menu")]);
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
    if (/^(hola|buenas|buenos dias|buenas tardes|hey|hi|hello)\b/.test(n) && n.split(" ").length <= 3) { addBot(L("¡Hola! ¿En qué le puedo ayudar? Le pido una cita o un presupuesto, le tomo los datos para que lo llamen o le escriban y le cuento servicios, horario y dirección.", "Hi! How can I help? I can request an appointment or an estimate, take your details for a call or text back, and tell you about services, hours and location."), menuChips()); return; }
    if (/^(horario y direccion|hours and location)$/.test(n)) { addBot(horarioA() + "\n\n" + dirA(), [CITA_CHIP, MAPS1, LLAMADA_CHIP]); return; }
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
  window.R24 = { open: open, setLang: function (l) { if (panel) setLang(l === "en" ? "en" : "es", opened); }, _test: { bestIntent: bestIntent, norm: norm, nowTx: nowTx, lang: function () { return lang; } } };
})();
