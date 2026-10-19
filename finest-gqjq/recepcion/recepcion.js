/* R24-HUMANO-1018 */
/* R24-BRIEF-1018: avatar humano, botones rápidos, "que me llamen", aviso al equipo, sin "no tengo ese dato" */
/* Recepción 24 h · Finest Auto Body and Paint (chapa, pintura y colisión, Houston TX 77022) — DEMO privada, bilingüe ES/EN.
   100% del lado del cliente: sin APIs, sin claves, sin envío de datos.
   Respuestas sacadas solo de lo que publica finestautobodyandpaint.com (oct. 2026): Home, About Us, Info en Español, Important Info,
   Our Jobs, Quality Control, FAQ.
   - Dirección: 7702 Irvington Blvd, Houston, TX 77022.
   - Horario: barra superior de todas las páginas (y Google): L–J 8:00 am–5:30 pm · V 8:00 am–5:00 pm · S y D cerrado.
     El costado de las páginas internas dice «Monday to Friday 8:00AM to 6:00PM» (contradicción: hallazgo; en la demo se unifica).
   - Teléfonos 713-692-0038 y 346-335-8912 (escritos sin enlace). Grúa (FAQ): 713-692-0038 o 713-870-7269.
   - Email: Finestautobodyllc@gmail.com (escrito sin enlace). No publican WhatsApp: la demo no lo ofrece.
   - Servicios: presupuestos gratis; reparación de colisiones (choques chicos o grandes, todo tipo de vehículos), carrocería/enderezado, alineación de chasis,
     abolladuras (también sin pintura y por granizo), vidrios, detallado, restauración de pintura, soldadura, repuestos, pintura completa o parcial con igualación computarizada de color (AkzoNobel), identificación de fórmula de pintura.
   - Trabajan con todos los seguros; ayudan con el carro de renta; grúa sin costo si el auto no es seguro de manejar (página ES / FAQ);
     levantar y entregar el auto a domicilio gratis si es necesario (página ES); presupuesto detallado por escrito (FAQ).
   - Garantía publicada: de por vida en reparaciones de colisión (Home, About, Quality Control, Info en Español).
   - Plazo publicado: 3 a 5 días según los daños (Info en Español); el FAQ aclara que el daño oculto puede cambiar la fecha.
   - Pago (FAQ): efectivo, cheques del seguro, Visa / MasterCard y Discover.
   - Miembro de HABA (Houston Auto Body Association); programa de calidad «5 Star» con inspección de los dueños.
   No se dan precios ni porcentajes de descuento, ni servicios de mecánica que no publican, ni WhatsApp.
   El botón «Call us to schedule an appointment» de su home abre Google Maps (no llama): en la demo abre la recepción.
   Trato de «usted» en español, como su página en español. */
(function () {
  "use strict";
  var C = {
    nombre: "Finest Auto Body and Paint",
    tel: "713-692-0038", telh: "+17136920038",
    tel2: "346-335-8912", tel2h: "+13463358912",
    telGrua: "713-870-7269", telGruah: "+17138707269",
    email: "Finestautobodyllc@gmail.com",
    dir: "7702 Irvington Blvd, Houston, TX 77022",
    maps: "https://www.google.com/maps/search/?api=1&query=Finest+Auto+Body+and+Paint+7702+Irvington+Blvd+Houston+TX+77022"
  };
  var qlang = (location.search.match(/[?&]lang=(es|en)\b/) || [])[1];
  var lang = qlang || ((window.R24_LANG === "auto" ? ((navigator.language || "en").slice(0, 2) === "es" ? "es" : "en") : (window.R24_LANG || "es")).slice(0, 2) === "en" ? "en" : "es");
  function L(es, en) { return lang === "en" ? en : es; }
  // Horario (minutos desde las 0:00, hora de Houston). 0 = domingo.
  var LJ = [[480, 1050]], VI = [[480, 1020]];
  var H = { 1: LJ, 2: LJ, 3: LJ, 4: LJ, 5: VI, 6: [], 0: [] };
  var DIAS = { es: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"], en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] };
  var MESES = { es: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"], en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] };
  function horarioTxt() {
    return L("Horario que publica el taller:\n• Lunes a jueves: 8:00 am – 5:30 pm\n• Viernes: 8:00 am – 5:00 pm\n• Sábado y domingo: cerrado",
      "Shop hours (as published):\n• Monday–Thursday: 8:00 am – 5:30 pm\n• Friday: 8:00 am – 5:00 pm\n• Saturday and Sunday: closed");
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
  var URG_CHIP = { a: "varado", get t() { return L("🚨 Tuve un choque", "🚨 I just had an accident"); } };
  var LLAMADA_CHIP = { a: "llamada", get t() { return L("📲 Que me llamen", "📲 Call me back"); } };
  function aviso() { return L("🔔 El equipo del taller recibe este pedido al instante (en esta demo no se envía nada).", "🔔 The shop team gets this request instantly (nothing is sent in this demo)."); }
  var lastQ = "";
  function TEL() { return { t: L("Llamar ", "Call ") + C.tel, tel: C.telh }; }
  function TEL2() { return { t: L("Llamar ", "Call ") + C.tel2, tel: C.tel2h }; }
  function MAIL() { return { t: L("✉️ Escribir un email", "✉️ Send an email"), url: "mailto:" + C.email }; }
  function MAPS() { return { t: L("Cómo llegar (Google Maps)", "Directions (Google Maps)"), url: C.maps }; }
  function Q(es, en, qes, qen) { return { get t() { return L(es, en); }, get q() { return L(qes || es, qen || en); } }; }
  function horarioA() {
    var n = nowTx();
    return horarioTxt() + "\n\n" + (isOpen(n)
      ? L("🟢 Ahora mismo está abierto (hasta las " + hm(closeAt(n)) + "): llame al " + C.tel + " o al " + C.tel2 + ".", "🟢 Open right now (until " + hm(closeAt(n)) + "): call " + C.tel + " or " + C.tel2 + ".")
      : L("🌙 Ahora mismo está cerrado (abre " + nextOpening(n) + "). Yo le atiendo igual: déjeme su presupuesto, su cita o su «que me llamen» y el taller lo tiene al abrir.",
        "🌙 Closed right now (opens " + nextOpening(n) + "). I can still help: leave your estimate, appointment or call-back request and the shop has it first thing."));
  }
  function serviciosA() {
    return L("Lo que publica el taller (chapa, pintura y colisión):\n• Reparación de choques, pequeños o grandes, en todo tipo de vehículos\n• Enderezado y carrocería, alineación de chasis y soldadura especializada\n• Reparación de abolladuras y cambio de piezas\n• Pintura completa o parcial, con igualación computarizada del color (pintura AkzoNobel), y restauración de pintura\n• Abolladuras sin pintura (paintless dent repair) y daños por granizo\n• Vidrios (auto glass) y detallado\n• Presupuestos gratis y trato directo con todos los seguros\n¿Qué le pasó al auto? Le dejo pedido el presupuesto.",
      "What the shop lists (body, paint and collision):\n• Collision repair, small or large, on all types of vehicles\n• Body and frame repair, frame/structure alignment and specialized welding\n• Dent repair and parts replacement\n• Full or partial paint jobs with computerized color matching (AkzoNobel paint), plus paint restoration\n• Paintless dent repair and hail damage repair\n• Auto glass and auto detailing\n• Free estimates, and they work directly with all insurance companies\nWhat happened to your car? I can set up an estimate request.");
  }
  function noListA() {
    return L("Su web habla de chapa, pintura y reparación de choques; ese servicio no aparece, así que no se lo voy a asegurar.\nPara confirmarlo, llame al " + C.tel + " o al " + C.tel2 + ", o deje su teléfono y le llaman.",
      "Their website covers body, paint and collision repair; that service isn't listed, so I won't promise it.\nTo confirm, call " + C.tel + " or " + C.tel2 + ", or leave your number and they'll call you.");
  }

  var KB = [
    { id: "choque", k: ["choque", "chocaron", "choco", "me chocaron", "accidente", "colision", "colisión", "golpe", "golpearon", "pegaron", "carroceria", "carrocería", "enderezado", "hojalateria", "chasis", "frame", "collision", "accident", "crash", "hit", "wreck", "body work", "bodywork", "body shop", "rear ended", "fender bender"],
      a: function () { return L("Sí, es su especialidad: reparan choques pequeños o grandes en todo tipo de vehículos (carrocería, enderezado, alineación de chasis, soldadura y pintura) y trabajan directamente con su seguro. Su web dice que el presupuesto empieza con una revisión detallada y por escrito. ¿Le dejo pedido el presupuesto?", "Yes, it's their specialty: they repair small or large collisions on all types of vehicles (body, frame, structure alignment, welding and paint) and work directly with your insurance. Their site says quality repairs start with a detailed written estimate. Want me to set up the estimate request?"); }, c: [CITA_CHIP, URG_CHIP, LLAMADA_CHIP] },
    { id: "pintura", k: ["pintura", "pintar", "pinten", "color", "rayon", "rayón", "rayones", "rayado", "retoque", "barniz", "como nuevo", "paint", "painting", "scratch", "scratches", "touch up", "color match", "clear coat", "look new"],
      a: function () { return L("Sí: hacen pintura completa o parcial según el código de fábrica, con un sistema computarizado para igualar cualquier color (importado o doméstico) y pintura de la línea AkzoNobel. También identifican la fórmula de pintura de su auto. Su web dice que un auto nuevo chocado puede volver a quedar como nuevo.", "Yes: full or partial paint jobs to factory code, with a computerized system to match any color (import or domestic) and AkzoNobel paint. They also identify your car's paint formula. Their site says a brand-new car that's been in an accident can look new again."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "abolladura", k: ["abolladura", "abolladuras", "abollado", "granizo", "sin pintura", "hail", "paintless", "sumido", "hundido", "defensa", "bumper", "fascia", "puerta", "salpicadera", "guardafango", "dent", "dents", "door", "fender", "quarter panel"],
      a: function () { return L("Sí: reparan abolladuras (también sin pintura, «paintless dent repair», y daños por granizo) y cambian o reparan piezas de carrocería (defensas, puertas, guardafangos) como parte de la reparación de choques. Si me dice marca, modelo, año y dónde está el golpe, le dejo pedido el presupuesto. Si tiene fotos, puede mandarlas a " + C.email + ".", "Yes: they repair dents (including paintless dent repair and hail damage) and repair or replace body parts (bumpers, doors, fenders) as part of collision repair. Tell me make, model, year and where the damage is and I'll set up the estimate request. Got photos? You can email them to " + C.email + "."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "extras", k: ["vidrio", "vidrios", "parabrisas", "cristal", "ventana", "detallado", "lavado", "encerado", "pulido", "restauracion de pintura", "glass", "windshield", "window", "detailing", "detail", "wax", "polish", "paint restoration"],
      a: function () { return L("Sí: en la lista de servicios de su web figuran vidrios (auto glass), detallado (auto detailing) y restauración de pintura, además de chapa, pintura y choques. Los detalles de cada trabajo se los confirma el taller con el presupuesto, que su web dice que es gratis.", "Yes: their services list includes auto glass, auto detailing and paint restoration, besides body, paint and collision work. The shop confirms the details with the estimate, which their site says is free."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "seguro", k: ["seguro", "aseguradora", "aseguranza", "reclamo", "deducible", "ajustador", "perito", "carro de renta", "renta", "rental", "insurance", "claim", "deductible", "adjuster", "geico", "progressive", "state farm", "allstate"],
      a: function () { return L("Trabajan con todos los seguros: están certificados y autorizados, y tratan directamente con la aseguradora para que el auto quede como antes del choque. Si hace falta, le ayudan con el carro de renta.\nSu web también recuerda que, por ley en Texas, usted elige el taller donde se repara su auto: su seguro no le puede obligar a ir a uno en particular.", "They work with all insurance companies: they're certified and authorized, and deal directly with the insurer to get your car back to pre-accident condition. If needed, they help with rental car arrangements.\nTheir site also reminds you that, by Texas law, you choose where your car is repaired: your insurer can't require a particular shop."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "grua", k: ["grua", "grúa", "remolque", "remolcar", "no se puede manejar", "no lo puedo manejar", "recoger", "recogen", "domicilio", "buscar el auto", "tow", "towing", "tow truck", "wrecker", "pick up", "pickup", "pick-up", "delivery"],
      a: function () { return L("Su web dice que, si el auto quedó inseguro para manejar después de un choque, no lo maneje: le pueden mandar una grúa sin costo y trabajan directamente con el seguro. También ofrecen levantar y entregar el auto a domicilio sin costo si es necesario.\nPara grúa, su web da estos teléfonos: " + C.tel + " o " + C.telGrua + ". El taller le confirma los detalles al llamar.", "Their site says that if your car isn't safe to drive after an accident, don't drive it: they can send a tow truck at no cost and work directly with the insurance. They also offer free pick-up and delivery if needed.\nFor towing, their site lists " + C.tel + " or " + C.telGrua + ". The shop confirms the details when you call."); }, c: [URG_CHIP, TEL, LLAMADA_CHIP] },
    { id: "nolist", k: ["mecanica", "mecánica", "motor", "transmision", "transmisión", "frenos", "aceite", "afinacion", "afinación", "aire acondicionado", "llanta", "llantas", "neumatico", "alineacion y balanceo", "balanceo", "inspeccion", "inspección", "smog", "bateria", "engine", "transmission", "brakes", "oil change", "tune up", "tires", "tire", "alignment and balance", "inspection", "battery", "ac repair", "check engine", "tint", "polarizado"], a: noListA, c: [TEL, LLAMADA_CHIP, CITA_CHIP] },
    { id: "servicios", k: ["servicios", "que hacen", "que reparan", "que arreglan", "trabajos", "services", "what do you fix", "what do you do", "repairs do"], a: serviciosA, c: [CITA_CHIP, URG_CHIP, LLAMADA_CHIP] },
    { id: "precio", k: ["precio", "precios", "cuanto cuesta", "cuanto sale", "cuanto cobran", "costo", "caro", "barato", "descuento", "presupuesto gratis", "price", "prices", "how much", "cost", "cheap", "rates", "discount", "free estimate"],
      a: function () { return L("Su web dice que el presupuesto es gratis (free estimates) y no publica precios: cada reparación empieza con un presupuesto detallado por escrito, porque depende del daño. Su página en español menciona descuentos y que pueden igualar o mejorar otro presupuesto; las condiciones se las confirma el taller. Lo que sí hago: le dejo pedido el presupuesto con marca, modelo, año y daño.", "Their website says estimates are free and doesn't list prices: every repair starts with a detailed written estimate, because it depends on the damage. Their Spanish page mentions discounts and that they can match or beat another estimate; the shop confirms the terms. What I can do: send an estimate request with make, model, year and damage."); }, c: [CITA_CHIP, LLAMADA_CHIP, TEL] },
    { id: "garantia", k: ["garantia", "garantía", "garantizan", "garantizado", "de por vida", "warranty", "guarantee", "guaranteed", "lifetime"],
      a: function () { return L("Su web dice que el trabajo de enderezado y pintura tiene garantía de por vida («por vida o por el tiempo que sea dueño de su auto») en las reparaciones de colisión. Los detalles se los confirma el taller con su presupuesto.", "Their site says collision repairs come with a lifetime warranty (\"for life, or for as long as you own your car\"). The shop will confirm the details with your estimate."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "tiempo", k: ["cuanto tarda", "cuanto tiempo", "cuantos dias", "cuando esta listo", "hoy mismo", "mismo dia", "rapido", "listo", "how long", "how many days", "same day", "when will", "quick", "ready"],
      a: function () { return L("Su página en español habla de terminar el trabajo en 3 a 5 días, según los daños. Su FAQ aclara que a veces hay daño oculto que solo se ve al desarmar el auto, y entonces la fecha puede cambiar. Le dejo pedida la cita para que lo revisen lo antes posible.", "Their Spanish page mentions finishing the job in 3 to 5 days depending on the damage. Their FAQ notes that hidden damage sometimes only shows up once the car is taken apart, which can change the date. I can request an appointment so they check it as soon as possible."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "pago", k: ["tarjeta", "efectivo", "cheque", "visa", "mastercard", "discover", "financiamiento", "financiar", "pagos", "forma de pago", "credito", "zelle", "card", "cash", "check", "financing", "payment", "payments", "credit"],
      a: function () { return L("Según su FAQ aceptan efectivo, cheques del seguro, Visa / MasterCard y Discover. Financiamiento o planes de pago no aparecen en su web: eso se lo confirma el taller.", "Per their FAQ they accept cash, insurance checks, Visa / MasterCard and Discover. Financing or payment plans aren't on their website: the shop can confirm that."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "pasos", k: ["que hago", "que debo hacer", "despues del choque", "acabo de chocar", "firmar", "culpa", "policia", "reporte", "what should i do", "after an accident", "sign", "fault", "police report"],
      a: function () { return L("Su web da estos consejos después de un choque:\n• No declare culpa.\n• Anote nombre, dirección y teléfono de todos los involucrados, y su compañía de seguro y número.\n• Anote también el VIN, la placa y el color si puede.\n• No firme en el lugar del accidente una autorización para reparar el auto.\n• Lea lo que firma antes de que se lleven el auto en grúa: lo puede mandar directo a su taller.\nSi está en un lugar peligroso, póngase a salvo y llame al 911.", "Their site gives this advice after an accident:\n• Never declare fault.\n• Get names, addresses and phone numbers of everyone involved, plus their insurance company and number.\n• Also note the VIN, license plate and color if you can.\n• Don't sign a repair authorization at the accident scene.\n• Read what you sign before the car is towed: you can send it straight to their shop.\nIf you're somewhere dangerous, get to safety and call 911."); }, c: [URG_CHIP, CITA_CHIP, LLAMADA_CHIP] },
    { id: "idioma", k: ["espanol", "español", "hablan espanol", "ingles", "inglés", "spanish", "english", "speak spanish"],
      a: function () { return L("Su web tiene una sección «Info en Español». Aquí le atiendo en español o en inglés, como prefiera (botón EN arriba).", "Their website has a Spanish section («Info en Español»). I can help you in English or Spanish (ES button at the top)."); }, c: [CITA_CHIP, URG_CHIP] },
    { id: "experiencia", k: ["experiencia", "anos", "años", "familia", "confiable", "quienes son", "certificado", "certificados", "haba", "calidad", "resenas", "reseñas", "experience", "family", "since", "trust", "reviews", "certified", "quality", "who are you"],
      a: function () { return L("Finest Auto Body and Paint es un taller de chapa y pintura de Houston, miembro de HABA (Houston Auto Body Association) y centro de reparación certificado. Su web habla de más de 4.000 clientes atendidos y de un programa de calidad «5 Star»: uno de los dueños revisa el auto al entrar y hace la inspección final antes de entregarlo.", "Finest Auto Body and Paint is a Houston body and paint shop, a member of HABA (Houston Auto Body Association) and a certified repair center. Their site mentions thousands of satisfied customers and a \"5 Star\" quality program: one of the owners inspects the car on arrival and does the final inspection before release."); }, c: [CITA_CHIP, Q("Servicios", "Services", "servicios", "services")] },
    { id: "horario", k: ["horario", "horas", "abren", "abierto", "cierran", "a que hora", "sabado", "domingo", "lunes", "viernes", "hours", "open", "close", "closing", "saturday", "sunday", "weekend"], a: horarioA, c: [CITA_CHIP, LLAMADA_CHIP, TEL] },
    { id: "direccion", k: ["donde", "dirección", "direccion", "ubicacion", "ubicados", "como llego", "llegar", "irvington", "houston", "address", "location", "where", "directions", "located"],
      a: function () { return L("📍 " + C.dir + ".\nSu web pide llamar para agendar; si quiere, le dejo pedida la cita desde aquí.", "📍 " + C.dir + ".\nTheir site asks you to call to schedule; I can request the appointment from here."); }, c: [MAPS, CITA_CHIP] },
    { id: "sincita", k: ["sin cita", "llegar directo", "pasar", "caer", "walk in", "walk-in", "drop by", "stop by", "drop off"],
      a: function () { return L("Su web pide llamar para agendar la cita. Para no esperar, le dejo pedida la cita y el taller le confirma.\n📍 " + C.dir + ".", "Their site asks you to call to schedule an appointment. To avoid waiting, I'll request it and the shop confirms.\n📍 " + C.dir + "."); }, c: [CITA_CHIP, MAPS] },
    { id: "contacto", k: ["telefono", "teléfono", "numero", "llamar", "contacto", "correo", "email", "mail", "whatsapp", "wasap", "watsap", "texto", "mensaje", "hablar con alguien", "persona", "fotos", "foto", "phone", "number", "call", "text", "contact", "talk to someone", "human", "photos", "picture"],
      a: function () { return L("Canales que publica el taller:\n• Teléfonos: " + C.tel + " y " + C.tel2 + "\n• Email (también para mandar fotos del daño): " + C.email + "\nWhatsApp no figura en su web. O deje aquí su teléfono y le llaman ellos.", "How to reach the shop (as published):\n• Phones: " + C.tel + " and " + C.tel2 + "\n• Email (also for photos of the damage): " + C.email + "\nWhatsApp isn't listed on their site. Or leave your number here and they'll call you."); }, c: [TEL, TEL2, LLAMADA_CHIP] },
    { id: "gracias", k: ["gracias", "muchas gracias", "perfecto", "adios", "thanks", "thank you", "bye", "great"], a: function () { return L("¡A usted! Si necesita algo más, aquí estoy. 🚗", "You're welcome! I'm here if you need anything else. 🚗"); }, c: [CITA_CHIP] }
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
  function isVarado(n) { return /me chocaron|acabo de chocar|tuve un choque|choque ahora|no se puede manejar|no lo puedo manejar|emergencia|urgente|just had an accident|just crashed|got hit|can t drive|cant drive|emergency|urgent/.test(n); }
  function looksEnglish(n) { var w = n.split(" "), en = ["the", "my", "is", "do", "you", "what", "how", "car", "are", "your", "can", "open", "hours", "much", "need", "want", "when", "where", "does", "have", "i"]; var c = w.filter(function (x) { return en.indexOf(x) >= 0; }).length; return c >= 2 && !/[ñ]|\b(el|la|los|mi|que|como|cuanto|tienen|hacen|usted|carro|auto)\b/.test(n); }
  function looksSpanish(n) { return /\b(hola|cuanto|tienen|hacen|ustedes|carro|precio|horario|donde|necesito|quiero|mi carro|mi auto|gracias)\b/.test(n); }
  function byId(id) { return KB.filter(function (e) { return e.id === id; })[0]; }

  var body, input, status, panel, launch, opened = false, waMode = false;
  var flow = null;
  function el(tag, cls, html) { var x = document.createElement(tag); if (cls) x.className = cls; if (html != null) x.innerHTML = html; return x; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function linkify(s) {
    return esc(s).replace(/\b713-692-0038\b/g, '<a href="tel:+17136920038">713-692-0038</a>').replace(/\b346-335-8912\b/g, '<a href="tel:+13463358912">346-335-8912</a>')
      .replace(/\b713-870-7269\b/g, '<a href="tel:+17138707269">713-870-7269</a>')
      .replace(/Finestautobodyllc@gmail\.com/g, '<a href="mailto:Finestautobodyllc@gmail.com">Finestautobodyllc@gmail.com</a>');
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
  function menuChips() { return [CITA_CHIP, URG_CHIP, Q("Servicios", "Services", "servicios", "services"), Q("Horario y dirección", "Hours & address", "horario y direccion", "hours and address"), Q("¿Trabajan con mi seguro?", "Do you work with my insurance?", "trabajan con mi seguro", "do you work with my insurance"), LLAMADA_CHIP]; }
  function headTexts() {
    panel.querySelector(".r24-ht b").innerHTML = L("Recepción 24 h", "24/7 Front Desk") + ' <span class="r24-online">● ' + L("en línea", "online") + "</span>";
    panel.querySelector(".r24-ht small").textContent = C.nombre + " · Houston, TX";
    panel.querySelector(".r24-in").placeholder = L("Escriba su pregunta…", "Type your question…");
    panel.querySelector(".r24-send").textContent = L("Enviar", "Send");
    panel.querySelector(".r24-lang").textContent = lang === "en" ? "ES" : "EN";
    panel.querySelector(".r24-lang").setAttribute("aria-label", lang === "en" ? "Cambiar a español" : "Switch to English");
    panel.querySelector(".r24-legal").textContent = L("Asistente automático de demostración · sus datos no se envían a ningún sitio", "Automated demo assistant · your data isn't sent anywhere");
    launch.querySelector(".r24-lt").textContent = L("Recepción 24 h", "24/7 Front Desk");
    banner.textContent = L("Demo privada preparada para Finest Auto Body and Paint", "Private demo prepared for Finest Auto Body and Paint");
    panel.querySelector(".r24-human").textContent = L("👤 Hablar con una persona", "👤 Talk to a person");
  }
  var banner;
  function build() {
    var base = window.R24_BASE || "recepcion/";
    var css = document.createElement("link"); css.rel = "stylesheet"; css.href = base + "recepcion.css"; document.head.appendChild(css);
    banner = el("div", "r24-demo-banner"); banner.setAttribute("role", "note"); document.body.appendChild(banner);
    launch = el("button", "r24-launch", '<img class="r24-face" src="' + base + 'avatar.svg" alt="Recepcionista"><span class="r24-lt"></span><span class="r24-dot"></span>');
    launch.type = "button"; launch.setAttribute("aria-label", L("Abrir la recepción 24 h", "Open the 24/7 front desk")); document.body.appendChild(launch);
    panel = el("div", "r24-panel"); panel.setAttribute("role", "dialog"); panel.setAttribute("aria-label", "Recepción 24 h");
    panel.innerHTML = '<div class="r24-head"><div class="r24-av"><img class="r24-face" src="' + base + 'avatar.svg" alt="Recepcionista"></div><div class="r24-ht"><b></b><small></small></div><button class="r24-lang" type="button"></button><button class="r24-x" type="button" aria-label="Cerrar">×</button></div><div class="r24-status"></div><button class="r24-human" type="button"></button><div class="r24-body" aria-live="polite"></div><form class="r24-foot"><input class="r24-in" type="text" autocomplete="off" maxlength="300"><button class="r24-send" type="submit"></button></form><div class="r24-legal"></div>';
    document.body.appendChild(panel);
    body = panel.querySelector(".r24-body"); input = panel.querySelector(".r24-in"); status = panel.querySelector(".r24-status"); panel.querySelector(".r24-human").onclick = humano;
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
    var n = nowTx();
    addBot(isOpen(n) ? L("Claro. El taller está abierto ahora: llame al " + C.tel + " o al " + C.tel2 + " y le atiende una persona. Si prefiere, le llaman ellos: me deja su nombre y teléfono.", "Sure. The shop is open now: call " + C.tel + " or " + C.tel2 + " and a person will pick up. Or they can call you: just leave your name and number.")
      : L("Claro. El taller está cerrado ahora (abre " + nextOpening(n) + "). Déjeme su nombre y teléfono y una persona del taller le llama en cuanto abran.", "Sure. The shop is closed right now (opens " + nextOpening(n) + "). Leave your name and number and someone from the shop will call you as soon as they open."), [TEL(), TEL2(), LLAMADA_CHIP]);
  }
  function greet() {
    addBot(L("¡Hola! 👋 Soy la recepción virtual de Finest Auto Body and Paint (Houston, TX). Le ayudo a pedir un presupuesto o una cita, si acaba de tener un choque, o con dudas de seguros, servicios y horario, a cualquier hora y sin esperar a que le contesten el teléfono.\n¿En qué le ayudo?",
      "Hi! 👋 I'm the virtual front desk for Finest Auto Body and Paint (Houston, TX). I can set up an estimate or appointment, help right after an accident, or answer questions about insurance, services and hours — any time, no waiting on the phone.\nHow can I help?"), menuChips());
  }
  function open(mode) {
    panel.classList.add("r24-open"); launch.classList.add("r24-hide"); document.documentElement.classList.add("r24-panel-open"); statusText();
    if (mode === "cita-maps" && !panel._mapsNote) {
      panel._mapsNote = true;
      addNote(L("🔧 <b>Nota de la demo:</b> en su web, el botón «Call us to schedule an appointment» abre Google Maps: no llama ni agenda. Además los teléfonos y el email están escritos sin enlace y no hay formulario. Aquí ese botón abre la recepción 24 h.",
        "🔧 <b>Demo note:</b> on their site, the \"Call us to schedule an appointment\" button opens Google Maps: it doesn't call or book anything. Phones and email are plain text with no links, and there's no form. Here that button opens the 24/7 front desk."));
    }
    if (!opened) { opened = true; greet(); }
    if (mode === "llamada" && !flow) setTimeout(function () { addUser(LLAMADA_CHIP.t); startLlamada(); }, 450);
    if (mode === "varado" && !flow) setTimeout(function () { addUser(URG_CHIP.t); startVarado(); }, 450);
    if ((mode === "cita" || mode === "cita-maps") && !flow) setTimeout(function () { addUser(CITA_CHIP.t); startCita(); }, 450);
    setTimeout(function () { input.focus(); }, 50);
  }

  function DANO() { return lang === "en" ? ["Collision damage", "Scratches / paint", "Dent", "Bumper", "Other"]
    : ["Daños por choque", "Rayones / pintura", "Abolladura", "Defensa (bumper)", "Otro"]; }
  function SEG() { return lang === "en" ? ["Yes, my insurance", "Yes, the other driver's insurance", "No, I'll pay myself", "Not sure"]
    : ["Sí, mi seguro", "Sí, el seguro del otro conductor", "No, pago particular", "No sé todavía"]; }
  function VAR() { return lang === "en" ? ["The car can't be driven", "It drives but it's damaged", "Minor hit / scratches", "Other"]
    : ["El auto no se puede manejar", "Se maneja pero está dañado", "Golpe chico / rayones", "Otro"]; }
  function franjasDe(dow) {
    var fin = dow === 5 ? "5:00 pm" : "5:30 pm";
    var a = L("Mañana (8:00 am – 12:00 pm)", "Morning (8:00 am – 12:00 pm)"), b = L("Tarde (12:00 – " + fin + ")", "Afternoon (12:00 – " + fin + ")"), c = L("Me da igual", "Either is fine");
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
  function alarma() { return L("⚠️ Si hay heridos o quedó en un lugar peligroso (autopista, carril o de noche sin luz), póngase a salvo fuera del tráfico y llame al 911. Su web aconseja: no declare culpa y no firme en el lugar una autorización de reparación.", "⚠️ If anyone is hurt or you're somewhere dangerous (freeway, traffic lane, or in the dark), get to safety away from traffic and call 911. Their site advises: never declare fault and don't sign a repair authorization at the scene."); }
  function startVarado() {
    flow = { step: "urg", d: { tipo: "varado" } };
    var n = nowTx(), op = isOpen(n);
    addBot((op ? L("Vamos rápido. El taller está abierto ahora: lo más rápido es llamar al " + C.tel + " y contar lo que pasó. Si no puede llamar, le dejo el pase urgente aquí.",
      "Let's be quick. The shop is open now: the fastest is to call " + C.tel + " and tell them what happened. If you can't call, I'll leave an urgent request here.")
      : L("Vamos rápido. El taller está cerrado ahora (abre " + nextOpening(n) + "), pero le dejo un pase urgente para que le llamen apenas abran.", "Let's be quick. The shop is closed now (opens " + nextOpening(n) + "), but I'll leave an urgent request so they call you as soon as they open."))
      + L("\n¿Cómo quedó el auto?", "\nWhat shape is the car in?"),
      VAR().map(function (t) { return { t: t, v: t, flow: true }; }).concat([TEL()]));
  }
  function ask(step) {
    flow.step = step;
    var d = flow.d, n = nowTx();
    if (step === "vehiculo") addBot(L("¿Qué auto es? Marca y modelo (por ejemplo: Ford F-150, Toyota Camry).", "What car is it? Make and model (e.g. Ford F-150, Toyota Camry)."));
    else if (step === "anio") addBot(L("¿De qué año es?", "What year is it?"), [{ t: L("No sé", "Not sure"), v: L("No sé", "Not sure"), flow: true }]);
    else if (step === "sintoma") addBot(L("¿Qué daño tiene o qué trabajo necesita?", "What's the damage, or what work do you need?"), DANO().map(function (t) { return { t: t, v: t, flow: true }; }));
    else if (step === "seguro") addBot(L("¿Va por seguro? (Trabajan con todos los seguros.)", "Is insurance involved? (They work with all insurance companies.)"), SEG().map(function (t) { return { t: t, v: t, flow: true }; }));
    else if (step === "dia") addBot(L("¿Qué día le queda mejor? Lo anoto como preferencia y el taller le confirma la hora. Atienden de lunes a jueves de 8:00 am a 5:30 pm y el viernes de 8:00 am a 5:00 pm.",
      "Which day works best? I'll note it as a preference and the shop confirms the time. They're open Monday–Thursday 8:00 am–5:30 pm and Friday 8:00 am–5:00 pm."),
      nextWorkdays(n, 5).map(function (x) { return { t: x.label, v: x.label, dow: x.dow, flow: true }; }).concat([{ t: L("Lo antes posible", "As soon as possible"), v: L("Lo antes posible", "As soon as possible"), flow: true }]));
    else if (step === "franja") addBot(L("¿En qué franja?", "What time window?"), franjasDe(d.dow));
    else if (step === "lugar") addBot(L("¿Dónde está el auto ahora? (calle o cruce y ciudad; así el taller sabe dónde está)", "Where is the car now? (street or cross streets and city, so the shop knows where it is)"));
    else if (step === "nombre") addBot(L("¿Cuál es su nombre?", "What's your name?"));
    else if (step === "telefono") addBot(d.tipo === "llamada" ? L("Perfecto, " + d.nombre + ". ¿A qué teléfono le llaman?", "Great, " + d.nombre + ". What number should they call?")
      : (d.tipo === "varado" ? L("¿A qué teléfono le llaman?", "What number should they call?") : L("Último paso: ¿a qué teléfono le llaman para confirmarle?", "Last step: what number should they call to confirm?")));
    else if (step === "resumen") {
      var B = [{ t: L("✅ Confirmar", "✅ Confirm"), v: "__ok", flow: true }, { t: L("✏️ Corregir", "✏️ Edit"), v: "__fix", flow: true }, { t: L("Cancelar", "Cancel"), v: "cancelar", flow: true }];
      var q = L("\n\n¿Lo confirmo?", "\n\nShall I confirm?");
      if (d.tipo === "llamada") { addBot(L("Revise su solicitud de llamada:\n👤 Nombre: ", "Please review your call-back request:\n👤 Name: ") + d.nombre + L("\n💬 Consulta: ", "\n💬 Question: ") + d.consulta + L("\n📱 Teléfono: ", "\n📱 Phone: ") + d.telefono + "\n\n" + aviso() + q, B, "r24-sum"); return; }
      if (d.tipo === "varado") { addBot(L("Revise su pase urgente:\n🚨 Cómo quedó el auto: ", "Please review your urgent request:\n🚨 Car condition: ") + d.motivo + L("\n📍 Dónde está el auto: ", "\n📍 Car location: ") + d.lugar + L("\n👤 Nombre: ", "\n👤 Name: ") + d.nombre + L("\n📱 Teléfono: ", "\n📱 Phone: ") + d.telefono + L("\n⏱️ Prioridad: urgente", "\n⏱️ Priority: urgent") + (isOpen(n) ? L(" (abierto ahora)", " (open now)") : L(" (abren " + nextOpening(n) + ")", " (opens " + nextOpening(n) + ")")) + "\n\n" + aviso() + q, B, "r24-sum"); return; }
      addBot(L("Revise su solicitud:\n🧾 Tipo: ", "Please review your request:\n🧾 Type: ") + d.servicio + L("\n🚗 Auto: ", "\n🚗 Car: ") + d.vehiculo + " · " + d.anio + L("\n🔧 Daño: ", "\n🔧 Damage: ") + d.sintoma + L("\n🛡️ Seguro: ", "\n🛡️ Insurance: ") + d.seguro + L("\n📅 Día: ", "\n📅 Day: ") + d.dia + L("\n🕐 Franja: ", "\n🕐 Window: ") + d.franja + L("\n👤 Nombre: ", "\n👤 Name: ") + d.nombre + L("\n📱 Teléfono: ", "\n📱 Phone: ") + d.telefono + "\n\n" + aviso() + q, B, "r24-sum");
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
        if (isVarado(n)) addBot(L("Si el auto no se puede manejar, puedo dejarle además un pase urgente («🚨 Tuve un choque»). Sigo con el presupuesto.", "If the car can't be driven, I can also leave an urgent request (\"🚨 I just had an accident\"). Continuing with the estimate."));
        setTimeout(function () { ask("seguro"); }, isVarado(n) ? 700 : 0); return;
      case "seguro": d.seguro = t.slice(0, 60); ask("dia"); return;
      case "dia":
        d.dia = t.slice(0, 60);
        d.dow = chip && chip.dow != null ? chip.dow : dowFromText(n);
        if (d.dow === 0 || d.dow === 6 || /domingo|sunday|sabado|saturday/.test(n)) {
          d.dow = null;
          addBot(L("Lo anoto, pero ojo: sábados y domingos el taller está cerrado, así que le proponen el día hábil más cercano.", "Noted — but the shop is closed on Saturdays and Sundays, so they'll offer the closest weekday."));
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
        if (!/^[2-9]\d{9}$/.test(ph)) { addBot(L("Ese número no me cuadra. Escríbalo con 10 cifras (código de área incluido), por ejemplo 713-555-0123.", "That number doesn't look right. Please use 10 digits with area code, e.g. 713-555-0123.")); return; }
        d.telefono = ph.slice(0, 3) + "-" + ph.slice(3, 6) + "-" + ph.slice(6);
        ask("resumen"); return;
      case "resumen":
        if (t === "__ok" || /^(si|sí|ok|confirmo|confirmar|correcto|dale|yes|confirm|sure|yep)/.test(n)) {
          var nm2 = d.nombre.split(" ")[0], DEMO = L("\n\n(Versión de demostración: esta solicitud no se envió al taller.)", "\n\n(Demo version: this request was not sent to the shop.)");
          if (d.tipo === "llamada") { addBot(L("¡Listo, " + nm2 + "! ✅ El taller recibe su pedido al instante y le llama al " + d.telefono + ".", "All set, " + nm2 + "! ✅ The shop gets your request instantly and will call you at " + d.telefono + ".") + DEMO, [CITA_CHIP, Q("Otra pregunta", "Another question", "__menu", "__menu")]); flow = null; return; }
          if (d.tipo === "varado") { addBot(L("¡Listo, " + nm2 + "! ✅ Su pase urgente queda arriba de la lista. El taller le llama al " + d.telefono + (isOpen(nowTx()) ? "; si puede, adelántese llamando al " + C.tel + "." : " apenas abra (" + nextOpening(nowTx()) + ").") + "\nSi hay heridos o está en un lugar peligroso, no espere: 911.",
            "All set, " + nm2 + "! ✅ Your urgent request is at the top of the list. The shop will call you at " + d.telefono + (isOpen(nowTx()) ? "; if you can, call " + C.tel + " right away." : " as soon as they open (" + nextOpening(nowTx()) + ").") + "\nIf anyone is hurt or you're somewhere dangerous, don't wait: call 911.") + DEMO, [TEL(), MAPS()]); flow = null; return; }
          addBot(L("¡Listo, " + nm2 + "! ✅ Su solicitud quedó registrada.\nEl taller le llama al " + d.telefono + " para confirmarle el día y la hora (y el presupuesto, si lo pidió). Si tiene fotos del daño, puede mandarlas a " + C.email + ".",
            "All set, " + nm2 + "! ✅ Your request is in.\nThe shop will call you at " + d.telefono + " to confirm the day and time (and your estimate, if you asked for one). Got photos of the damage? Email them to " + C.email + ".") + DEMO, [MAPS(), Q("Otra pregunta", "Another question", "__menu", "__menu")]);
          flow = null; return;
        }
        if (t === "__fix" || /corregir|cambiar|editar|edit|change|^no\b/.test(n)) {
          var keep = d.tipo === "llamada" ? { tipo: "llamada", consulta: d.consulta } : { tipo: d.tipo };
          flow.d = keep; addBot(L("De acuerdo, empezamos de nuevo.", "OK, let's start over."));
          setTimeout(function () { if (keep.tipo === "llamada") ask("nombre"); else if (keep.tipo === "varado") { flow.step = "urg"; addBot(L("¿Cómo quedó el auto?", "What shape is the car in?"), VAR().map(function (t) { return { t: t, v: t, flow: true }; })); } else { flow.d.servicio = d.servicio; ask("vehiculo"); } }, 500); return;
        }
        ask("resumen"); return;
    }
  }
  function reply(e) {
    var t = typeof e.a === "function" ? e.a() : e.a;
    addBot(t, (e.c || []).map(function (c) { if (typeof c === "function") c = c(); return c.q ? { t: c.t, v: c.q } : c; }));
  }
  function fallback() {
    addBot(L("Eso se lo confirma mejor el taller, así tiene el dato exacto. 😊\nLlame al " + C.tel + " o al " + C.tel2 + ", escríbales a " + C.email + ", o deje su teléfono y le llaman ellos.",
      "The shop can confirm that for you so you get the exact answer. 😊\nCall " + C.tel + " or " + C.tel2 + ", email " + C.email + ", or leave your number and they'll call you."), [TEL, TEL2, LLAMADA_CHIP, CITA_CHIP]);
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
    if (/^(hola|buenas|buenos dias|buenas tardes|hey|hi|hello)\b/.test(n) && n.split(" ").length <= 3) { addBot(L("¡Hola! ¿En qué le puedo ayudar? Puedo pedirle un presupuesto o una cita, dejar un pase urgente si acaba de tener un choque o contarle servicios, seguros y horario.", "Hi! How can I help? I can request an estimate or appointment, leave an urgent request if you just had an accident, or tell you about services, insurance and hours."), [CITA_CHIP, URG_CHIP, Q("Servicios", "Services", "servicios", "services"), LLAMADA_CHIP]); return; }
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
