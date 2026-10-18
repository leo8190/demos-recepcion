/* R24-BRIEF-1018: avatar humano, botones rápidos, "que me llamen", aviso al equipo, sin "no tengo ese dato" */
/* Recepción 24 h · Coinsol Dental (Sevilla, Av. Manuel Siurot 52) — DEMO privada.
   100% del lado del cliente: sin APIs, sin claves, sin envío de datos.
   Todas las respuestas salen de lo que publica clinicadentalcoinsol.com (oct. 2026): Home, Conócenos, Servicios, Ortodoncia,
   Odontopediatría, Implantología, Periodoncia, Endodoncia, Estética, Otros servicios, Financiación y Contacto.
   Trato de «tú», como su web («te sientas como en casa», «ven con la tranquilidad», «consúltanos»).
   Horario de consulta publicado en Contacto: L–X 9:00–14:00 y 15:00–20:00 · J 15:00–20:00 · V 9:00–14:00 (sábado y domingo no figuran).
   Teléfonos publicados: 954 281 001 (pie y Contacto), 900 019 117 y 669 410 914 (Contacto), 954 273 717 (pie). Email clientes@…
   No publican WhatsApp: no se inventa. Tampoco precios, mutuas, idiomas, servicio de urgencias ni que la 1ª visita sea gratis. */
(function () {
  "use strict";
  var C = {
    nombre: "Coinsol Dental",
    tel: "954 281 001", telh: "+34954281001",
    tel900: "900 019 117", tel900h: "+34900019117",
    telMov: "669 410 914", telMovh: "+34669410914",
    tel2: "954 273 717", tel2h: "+34954273717",
    email: "clientes@clinicadentalcoinsol.com",
    dir: "Avda. Manuel Siurot, 52, 41013 Sevilla",
    parking: "parking privado exclusivo para clientes, 50 % bonificado por Coinsol (entrada por C/ Marqués de Luca de Tena, esquina con C/ Manuel Siurot)",
    maps: "https://www.google.com/maps/search/?api=1&query=Cl%C3%ADnica+Dental+Coinsol+Av.+Manuel+Siurot+52+41013+Sevilla"
  };
  // Horario de consulta (Contacto). 0 = domingo. Minutos desde las 0:00.
  var LX = [[540, 840], [900, 1200]], JU = [[900, 1200]], VI = [[540, 840]];
  var H = { 1: LX, 2: LX, 3: LX, 4: JU, 5: VI, 0: [], 6: [] };
  var DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
  var MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  var HORARIO_TXT = "Horario de consulta que publica la clínica:\n• Lunes a miércoles: 9:00–14:00 y 15:00–20:00\n• Jueves: 15:00–20:00 (solo tarde)\n• Viernes: 9:00–14:00 (solo mañana)\nSábados y domingos no figuran en su horario.";

  function madridNow() {
    var q = (location.search.match(/[?&]r24now=([^&]+)/) || [])[1];
    if (q) { var p = decodeURIComponent(q).match(/(\d+)-(\d+)-(\d+)T(\d+):(\d+)/);
      if (p) return { y: +p[1], m: +p[2] - 1, d: +p[3], dow: new Date(+p[1], +p[2] - 1, +p[3]).getDay(), min: +p[4] * 60 + +p[5] }; }
    var f = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Madrid", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false });
    var o = {}; f.formatToParts(new Date()).forEach(function (x) { o[x.type] = x.value; });
    var y = +o.year, m = +o.month - 1, d = +o.day;
    return { y: y, m: m, d: d, dow: new Date(y, m, d).getDay(), min: (+o.hour % 24) * 60 + +o.minute };
  }
  function hhmm(min) { return Math.floor(min / 60) + ":" + ("0" + (min % 60)).slice(-2); }
  function isOpen(n) { return (H[n.dow] || []).some(function (r) { return n.min >= r[0] && n.min < r[1]; }); }
  function closeAt(n) { var r = (H[n.dow] || []).filter(function (r) { return n.min >= r[0] && n.min < r[1]; })[0]; return r ? r[1] : 0; }
  function nextOpening(n) {
    for (var i = 0; i < 8; i++) {
      var dt = new Date(n.y, n.m, n.d + i), dow = dt.getDay(), rs = H[dow] || [];
      for (var j = 0; j < rs.length; j++) if (i > 0 || rs[j][0] > n.min)
        return (i === 0 ? "hoy" : (i === 1 ? "mañana " + DIAS[dow] : "el " + DIAS[dow])) + " a las " + hhmm(rs[j][0]);
    }
    return "";
  }
  function nextWorkdays(n, k) {
    var out = [];
    for (var i = 1; out.length < k && i < 14; i++) {
      var dt = new Date(n.y, n.m, n.d + i), dow = dt.getDay();
      if ((H[dow] || []).length) out.push({ dow: dow, label: DIAS[dow].charAt(0).toUpperCase() + DIAS[dow].slice(1) + " " + dt.getDate() + " " + MESES[dt.getMonth()] });
    }
    return out;
  }

  var STOP = "a al algo algun alguna como con cual cuales de del el en es esta este esto estoy hay la las lo los me mi mis o os para pero por que quiero se si sin su sus te tu tus un una uno unos y ya yo vosotros vuestra vuestro hacer haceis teneis tienen tiene puedo podeis podria saber gustaria hola buenas buenos dias tardes noches favor".split(" ");
  function norm(s) { return (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9ñ€\s]/g, " ").replace(/\s+/g, " ").trim(); }
  function stem(w) { if (w.length > 4) w = w.replace(/(es|s)$/, ""); return w; }
  function toks(s) { return norm(s).split(" ").filter(function (w) { return w && STOP.indexOf(w) < 0; }).map(stem); }
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
    var pt = toks(ph); if (!pt.length) return 0;
    for (var i = 0; i < pt.length; i++) if (!ut.some(function (u) { return tokMatch(pt[i], u); })) return 0;
    return pt.length;
  }

  var CITA_CHIP = { t: "Pedir cita", a: "cita" };
  var URG_CHIP = { t: "🦷 Tengo una urgencia", a: "urgencia" };
  var LLAMADA_CHIP = { t: "📲 Que me llamen", a: "llamada" };
  var AVISO = "🔔 El equipo de la clínica recibe este pedido al instante (en esta demo no se envía nada).";
  var lastQ = "";
  var TEL = { t: "Llamar " + C.tel, tel: C.telh };
  var TEL900 = { t: "Llamar " + C.tel900, tel: C.tel900h };
  var MAPS = { t: "Google Maps", url: C.maps };
  function Q(t, q) { return { t: t, q: q || t }; }
  function horarioA() {
    var n = madridNow();
    return HORARIO_TXT + "\n\n" + (isOpen(n) ? "🟢 Ahora mismo están en horario de consulta (hasta las " + hhmm(closeAt(n)) + "): " + C.tel + " o " + C.tel900 + "."
      : "🌙 Ahora mismo están fuera del horario de consulta (vuelven " + nextOpening(n) + "). Yo te atiendo igual: déjame tu cita o tu «que me llamen» y el equipo lo tiene al abrir.");
  }
  var EQUIPO_TXT = "La familia Solano Mendoza, con más de 35 años en Sevilla, y un equipo de doce profesionales";

  var KB = [
    { id: "primera", k: ["primera visita", "primera cita", "primera consulta", "primera vez", "valoracion", "revision", "revisar", "chequeo", "diagnostico", "presupuesto", "segunda opinion", "evaluacion"],
      a: "En Coinsol el tratamiento es personalizado desde la primera visita: el equipo te da un informe personalizado con tu diagnóstico de salud y estética bucodental, los tratamientos a realizar, las tarifas y las posibilidades de financiación.\nSi quieres te la pido ahora: me dices el motivo y el día que te viene bien, y el equipo te confirma.", c: [CITA_CHIP, Q("Financiación", "financiación"), LLAMADA_CHIP] },
    { id: "gratis", k: ["gratis", "gratuita", "gratuito", "sin coste", "cuesta primera visita", "cobrais primera"],
      a: "Su web no dice si la primera visita tiene coste, así que no te lo voy a asegurar. Lo que sí cuentan: en esa visita te dan un informe personalizado con tu diagnóstico, los tratamientos, las tarifas y la financiación. Pregúntalo al pedir la cita o llamando al " + C.tel + ".", c: [CITA_CHIP, TEL, LLAMADA_CHIP] },
    { id: "financiacion", k: ["financiacion", "financiais", "financiar", "plazos", "pagar a plazos", "cuotas", "al mes", "mensual", "mensualidades", "pago aplazado", "facilidades pago", "formas pago", "opciones pago", "intereses"],
      a: "Sí: ofrecen a todos los pacientes la opción de financiar sus tratamientos en un máximo de 36 meses sin intereses. En la primera visita te explican las posibilidades de financiación de tu caso, junto con el diagnóstico y las tarifas.", c: [CITA_CHIP, Q("Primera visita", "primera visita"), LLAMADA_CHIP] },
    { id: "precio", k: ["precio", "precios", "tarifa", "tarifas", "cuanto cuesta", "cuanto vale", "caro", "barato"],
      a: "Su web no publica precios, así que prefiero no darte una cifra a ojo: depende de cada caso. Las tarifas te las dan en el informe personalizado de la primera visita, y puedes financiar el tratamiento hasta en 36 meses sin intereses. Si quieres una orientación antes, llama al " + C.tel + " o deja tu teléfono y te llaman.", c: [CITA_CHIP, TEL, LLAMADA_CHIP] },
    { id: "invisalign", k: ["invisalign", "alineador", "alineadores", "ortodoncia invisible", "invisible", "transparente"],
      a: "Sí: su web dice que cuentan con expertos en Invisalign («la ortodoncia del futuro»): alineadores transparentes hechos a medida. La Dra. Beatriz Solano es especialista ortodoncista e Invisalign. Qué opción te conviene te lo explican en la primera visita.", c: [CITA_CHIP, Q("Ortodoncia", "ortodoncia"), Q("Financiación", "financiación")] },
    { id: "ortodoncia", k: ["ortodoncia", "bracket", "brackets", "aparato", "aparatos", "dientes torcidos", "mordida", "lingual", "ortodoncista", "microtornillo", "ortognatica"],
      a: "La ortodoncia es una de sus grandes especialidades, para niños y adultos. La lidera el Prof. Enrique Solano (Catedrático de Ortodoncia de la Universidad de Sevilla) junto a la Dra. Beatriz Solano. Opciones que publican: Invisalign, brackets, ortodoncia lingual, ortodoncia estética, interceptiva, férulas de descarga, apnea del sueño (DAM), microtornillos y cirugía ortognática.", c: [CITA_CHIP, Q("Invisalign", "invisalign"), Q("Para niños", "niños")] },
    { id: "ninos", k: ["niño", "niños", "nino", "ninos", "hijo", "hija", "hijos", "infantil", "odontopediatria", "odontopediatra", "pequeño", "bebe", "bebes", "dientes leche", "peque"],
      a: "Coinsol empezó como clínica para niños y la odontopediatría es su especialidad: atienden de 0 a 12 años. La dirige la Prof. Asunción Mendoza, Catedrática de Odontopediatría y directora del Máster de Odontopediatría de la Universidad de Sevilla, que aplica técnicas psicológicas adaptadas al paciente infantil, con la Dra. María Biedma.\nLa sala de espera tiene juegos, dibujos animados y PlayStation, y el Ratón Pérez les hace una visita al terminar. También hacen sedación con óxido nitroso («más de 30 años usando esta técnica»).", c: [CITA_CHIP, Q("Ortodoncia infantil", "ortodoncia"), LLAMADA_CHIP] },
    { id: "implantes", k: ["implante", "implantes", "implantologia", "dientes fijos", "falta diente", "perdido diente", "reponer diente", "elevacion seno", "regeneracion osea", "arcada"],
      a: "Sí: la implantología es una de sus especialidades, con la Dra. Patricia Solano (Implantología y Periodoncia) y la Prof. Asunción Mendoza. Publican: implante unitario, puente sobre implantes, rehabilitaciones completas, elevaciones de seno, regeneración ósea y mantenimiento. Cómo sería en tu caso te lo explican en la primera visita.", c: [CITA_CHIP, Q("¿Precio?", "precio implante"), LLAMADA_CHIP] },
    { id: "periodoncia", k: ["periodoncia", "periodontitis", "piorrea", "encia", "encias", "sangran", "sangrado", "gingivitis", "dientes se mueven", "encia retraida"],
      a: "Sí: la periodoncia la lidera la Dra. Patricia Solano Mendoza. Publican: descontaminación periodontal, cirugía periodontal, regeneración periodontal, recubrimiento de encías, alargamiento coronario y microcirugía.", c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "endodoncia", k: ["endodoncia", "matar nervio", "nervio", "conductos", "desvitalizar"],
      a: "Sí: hacen endodoncia (tratamiento de conductos) para salvar el diente y quitar el dolor. Según su web, se hace a ser posible en una sola visita, con microcirugía y localizadores de conductos de gran fiabilidad.", c: [CITA_CHIP, URG_CHIP] },
    { id: "blanqueamiento", k: ["blanqueamiento", "blanquear", "dientes blancos", "manchas", "diente oscuro"],
      a: "Sí: hacen blanqueamiento externo (aclara varias tonalidades, con férulas hechas a medida) y blanqueamiento interno (para dientes que se han oscurecido).", c: [CITA_CHIP, Q("Estética dental", "estética")] },
    { id: "estetica", k: ["estetica", "carilla", "carillas", "corona", "coronas", "puente", "puentes", "funda", "protesis", "dentadura", "composite", "porcelana"],
      a: "En estética dental publican: blanqueamiento externo e interno, carillas de composite y de porcelana (también sin tallado), coronas y puentes, y prótesis. En el equipo de estética están el Dr. Imar Monzón y la Dra. Patricia Solano.", c: [CITA_CHIP, Q("Blanqueamiento", "blanqueamiento")] },
    { id: "atm", k: ["atm", "mandibula", "bruxismo", "rechinar", "apretar dientes", "fisioterapia", "fisio", "ferula", "ferula descarga", "dolor cabeza", "dolor cuello", "articulacion"],
      a: "Sí: tienen fisioterapia para la articulación temporomandibular (ATM), para dolores de cabeza y cuello, bruxismo y apretamiento, combinando técnicas manuales y tecnología. En ortodoncia también hacen férulas de descarga.", c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "logopedia", k: ["logopedia", "logopeda", "habla", "voz", "lenguaje", "deglucion"],
      a: "Sí: tienen logopeda, que trabaja la prevención, evaluación e intervención en niños y adultos con alteraciones de la voz, el habla, el lenguaje, la audición y las funciones orofaciales.", c: [CITA_CHIP] },
    { id: "apnea", k: ["apnea", "ronquido", "roncar", "ronco", "dam"],
      a: "Sí: dentro de ortodoncia tratan el ronquido y el síndrome de apnea del sueño (el «tratamiento DAM», como lo llama su web).", c: [CITA_CHIP] },
    { id: "cirugia", k: ["cirugia", "cirugia oral", "extraccion", "extracciones", "sacar muela", "muela juicio", "muelas juicio", "cordal", "cordales"],
      a: "La cirugía oral está entre sus servicios (diagnóstico y tratamiento de enfermedades, traumatismos y defectos de los dientes), con espacios habilitados para que el procedimiento quirúrgico sea seguro. Si es una muela del juicio, te la valoran en la visita.", c: [CITA_CHIP, URG_CHIP] },
    { id: "miedo", k: ["miedo", "ansiedad", "nervios", "nervioso", "panico", "odontofobia", "sedacion", "sedar", "dormido", "anestesia", "oxido nitroso"],
      a: "Te entiendo. Su web lo dice así: «los nervios que suelen existir en cualquier persona antes de ir al dentista, en Coinsol Dental desaparecen», y quieren que te sientas como en casa desde la llamada. Para niños publican sedación con óxido nitroso; para adultos no lo detallan, así que te lo confirma el equipo. Si quieres, lo anoto en tu cita.", c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "urgencia", k: ["urgencia", "urgencias", "urgente", "dolor", "duele muela", "me duele", "dolor muelas", "emergencia", "flemon", "hinchazon", "inflamacion", "infeccion", "se me ha roto", "diente roto", "fractura", "golpe", "diente partido"],
      a: "Lo siento. Su web no describe un servicio de urgencias, así que no te prometo un hueco hoy; lo más rápido es llamar al " + C.tel + " o al " + C.tel900 + " en horario de consulta. Si ahora no puedes llamar, déjame tu urgencia y el equipo te llama en cuanto la vea.", urg: true, c: [URG_CHIP, TEL, TEL900] },
    { id: "dias", k: ["sabado", "sabados", "domingo", "domingos", "fin semana", "finde", "festivo", "festivos", "agosto"],
      a: "Su horario publicado es de lunes a viernes; los sábados y domingos no figuran, así que no te lo voy a asegurar. Aquí sí te atiendo a cualquier hora: déjame tu cita y el equipo te confirma el día más cercano.\n\n" + HORARIO_TXT, c: [CITA_CHIP, LLAMADA_CHIP, TEL] },
    { id: "horario", k: ["horario", "hora abris", "abris", "abierto", "abiertos", "cerrais", "cierra", "a que hora", "mediodia", "lunes", "martes", "miercoles", "jueves", "viernes"], a: horarioA, c: [CITA_CHIP, LLAMADA_CHIP, TEL] },
    { id: "parking", k: ["aparcar", "aparcamiento", "parking", "coche", "garaje", "plaza"],
      a: "Sí: tienen " + C.parking + ".\n📍 " + C.dir + ".", c: [MAPS, CITA_CHIP] },
    { id: "direccion", k: ["donde", "direccion", "ubicacion", "como llego", "llegar", "calle", "mapa", "manuel siurot", "siurot", "heliopolis", "bermejales"],
      a: "📍 " + C.dir + ".\nTienen " + C.parking + ".", c: [MAPS, CITA_CHIP] },
    { id: "contacto", k: ["telefono", "llamar", "numero", "contacto", "email", "correo", "mail", "whatsapp", "wasap", "watsap", "movil", "hablar persona", "recepcion", "humano"],
      a: "Canales que publica la clínica:\n• Teléfonos: " + C.tel + " · " + C.tel900 + " · " + C.telMov + " · " + C.tel2 + "\n• Email: " + C.email + "\nWhatsApp no lo publican en su web. Si prefieres, deja aquí tu teléfono y te llaman ellos.", c: [TEL, TEL900, LLAMADA_CHIP] },
    { id: "equipo", k: ["quien atiende", "doctor", "doctora", "dentista", "dentistas", "odontologo", "odontologa", "especialista", "especialistas", "equipo", "solano", "mendoza", "biedma", "monzon", "familia"],
      a: EQUIPO_TXT + ": Prof. Enrique Solano (Catedrático de Ortodoncia) y Prof. Asunción Mendoza (Catedrática de Odontopediatría), ambos de la Universidad de Sevilla; Dra. Beatriz Solano (ortodoncia e Invisalign); Dra. Patricia Solano (implantología y periodoncia); Dra. María Biedma (odontopediatría); Patricia Gómez (ortodoncista); Dr. Imar Monzón (estética) y Sofía Solano, directora.", c: [CITA_CHIP, Q("¿Por qué Coinsol?", "experiencia")] },
    { id: "experiencia", k: ["experiencia", "historia", "cuantos anos", "años", "fiable", "recomendais", "opiniones", "opinion", "resenas", "buena clinica", "por que coinsol"],
      a: "Coinsol abrió hace más de 35 años de la mano de los profesores Solano y Mendoza, empezando por la odontología infantil, y hoy es un centro de odontología integral para toda la familia. Según su web, más del 95 % de sus pacientes vienen recomendados.", c: [CITA_CHIP, Q("El equipo", "equipo")] },
    { id: "tecnologia", k: ["tecnologia", "escaner", "tac", "3d", "digital", "moderno", "invasivo"],
      a: "Su web dice que emplean técnicas mínimamente invasivas con tecnología de gran precisión para diagnosticar mejor, y espacios habilitados para que la cirugía sea segura. No detalla qué equipos, eso te lo cuentan en la clínica.", c: [CITA_CHIP] },
    { id: "seguros", k: ["seguro", "mutua", "mutuas", "adeslas", "sanitas", "dkv", "asisa", "mapfre", "aseguradora", "poliza", "seguridad social"],
      a: "Su web no dice si trabajan con mutuas o seguros dentales, así que no te lo voy a asegurar. Lo que sí publican es la financiación hasta en 36 meses sin intereses. Confírmalo llamando al " + C.tel + ", o deja tu número y te llaman.", c: [TEL, LLAMADA_CHIP] },
    { id: "gracias", k: ["gracias", "vale gracias", "perfecto", "genial", "adios", "hasta luego"], a: "¡A ti! Si necesitas algo más, aquí estoy. 😊", c: [CITA_CHIP] }
  ];
  var CITA_K = ["pedir cita", "cita", "reservar", "reserva", "agendar", "pedir hora", "hueco", "turno", "apuntarme", "citarme", "coger cita", "darme hora"];

  function bestIntent(text) {
    var ut = toks(text), best = null, bs = 0;
    if (!ut.length) return null;
    KB.forEach(function (e) {
      var s = 0; e.k.forEach(function (ph) { s = Math.max(s, phraseScore(ph, ut)); });
      if (s > bs) { bs = s; best = e; }
    });
    return bs > 0 ? { e: best, s: bs } : null;
  }
  function isPriceQ(n) { return /\b(precio|precios|cuesta|cuestan|cuanto vale|cuanto valen|coste|tarifa|tarifas|€|euros|caro|barato|cobrais)\b/.test(n); }
  function wantsCita(n) { var ut = toks(n); return CITA_K.some(function (ph) { return phraseScore(ph, ut) > 0; }); }
  function byId(id) { return KB.filter(function (e) { return e.id === id; })[0]; }

  var body, input, status, panel, launch, opened = false;
  var flow = null;
  function el(tag, cls, html) { var x = document.createElement(tag); if (cls) x.className = cls; if (html != null) x.innerHTML = html; return x; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function linkify(s) {
    return esc(s).replace(/\b(954 281 001|900 019 117|669 410 914|954 273 717)\b/g, function (m) { return '<a href="tel:+34' + m.replace(/ /g, "") + '">' + m + "</a>"; })
      .replace(/clientes@clinicadentalcoinsol\.com/g, '<a href="mailto:clientes@clinicadentalcoinsol.com">clientes@clinicadentalcoinsol.com</a>');
  }
  function scroll() { body.scrollTop = body.scrollHeight; }
  function addUser(t) { var m = el("div", "r24-msg r24-user"); m.textContent = t; body.appendChild(m); scroll(); }
  function addBot(t, chips, cls) {
    var ty = el("div", "r24-typing", "Escribiendo…"); body.appendChild(ty); scroll();
    chips = chips || [];
    setTimeout(function () {
      ty.remove();
      var m = el("div", "r24-msg r24-bot" + (cls ? " " + cls : ""), linkify(t));
      body.appendChild(m);
      if (chips.length) {
        var w = el("div", "r24-chips");
        chips.forEach(function (c) {
          var b;
          if (c.tel) { b = el("a", "r24-chip", "📞 " + esc(c.t)); b.href = "tel:" + c.tel; }
          else if (c.url) { b = el("a", "r24-chip", esc(c.t)); b.href = c.url; b.target = "_blank"; b.rel = "noopener"; }
          else { b = el("button", "r24-chip", esc(c.t)); b.type = "button"; b.onclick = function () { w.remove(); handle(c.v || c.q || c.t, c); }; }
          w.appendChild(b);
        });
        body.appendChild(w);
      }
      scroll();
    }, 380);
  }
  function statusText() {
    var n = madridNow();
    if (isOpen(n)) { status.className = "r24-status"; status.textContent = "🟢 En horario de consulta ahora · hasta las " + hhmm(closeAt(n)) + " · " + C.tel + " · " + C.tel900; }
    else { status.className = "r24-status r24-closed"; status.textContent = "🌙 Fuera del horario de consulta (vuelven " + nextOpening(n) + ") · te atiendo igual y dejo tu pedido listo"; }
  }
  function menuChips() { return [CITA_CHIP, URG_CHIP, Q("Tratamientos", "tratamientos"), Q("Horario y parking", "horario y parking"), Q("Financiación", "financiación"), LLAMADA_CHIP]; }

  function build() {
    var base = window.R24_BASE || "recepcion/";
    var css = document.createElement("link"); css.rel = "stylesheet"; css.href = base + "recepcion.css"; document.head.appendChild(css);
    var ban = el("div", "r24-demo-banner", "Demo privada preparada para Coinsol Dental"); ban.setAttribute("role", "note"); document.body.appendChild(ban);
    launch = el("button", "r24-launch", '<img class="r24-face" src="' + base + 'avatar.svg" alt="Recepcionista"><span>Recepción 24 h</span><span class="r24-dot"></span>');
    launch.type = "button"; launch.setAttribute("aria-label", "Abrir la recepción 24 h"); document.body.appendChild(launch);
    panel = el("div", "r24-panel"); panel.setAttribute("role", "dialog"); panel.setAttribute("aria-label", "Recepción 24 h");
    panel.innerHTML = '<div class="r24-head"><div class="r24-av"><img class="r24-face" src="' + base + 'avatar.svg" alt="Recepcionista"></div><div class="r24-ht"><b>Recepción 24 h <span class="r24-online">● en línea</span></b><small>Coinsol Dental · Av. Manuel Siurot, Sevilla</small></div><button class="r24-x" type="button" aria-label="Cerrar">×</button></div><div class="r24-status"></div><div class="r24-body" aria-live="polite"></div><form class="r24-foot"><input class="r24-in" type="text" placeholder="Escribe tu pregunta…" autocomplete="off" maxlength="300"><button class="r24-send" type="submit">Enviar</button></form><div class="r24-legal">Asistente automático de demostración · tus datos no se envían a ningún sitio</div>';
    document.body.appendChild(panel);
    body = panel.querySelector(".r24-body"); input = panel.querySelector(".r24-in"); status = panel.querySelector(".r24-status");
    launch.onclick = function () { open(); };
    panel.querySelector(".r24-x").onclick = function () { panel.classList.remove("r24-open"); launch.classList.remove("r24-hide"); document.documentElement.classList.remove("r24-panel-open"); };
    panel.querySelector("form").onsubmit = function (ev) { ev.preventDefault(); ev.stopImmediatePropagation(); var t = input.value.trim(); if (!t) return; input.value = ""; handle(t); };
    document.addEventListener("click", function (ev) {
      var a = ev.target.closest && ev.target.closest("[data-r24-open]"); if (a) { ev.preventDefault(); ev.stopPropagation(); open(a.getAttribute("data-r24-open")); }
    }, true);
  }
  function greet() {
    addBot("¡Hola! 👋 Soy la recepción virtual de Coinsol Dental (Av. Manuel Siurot 52, Sevilla). Te ayudo a pedir cita, con una urgencia o con dudas de tratamientos, horario, parking y financiación, a cualquier hora, sin esperar a que te cojan el teléfono.\n¿En qué te ayudo?", menuChips());
  }
  function open(mode) {
    panel.classList.add("r24-open"); launch.classList.add("r24-hide"); document.documentElement.classList.add("r24-panel-open"); statusText();
    if (!opened) { opened = true; greet(); }
    if (mode === "llamada" && !flow) setTimeout(function () { addUser(LLAMADA_CHIP.t); startLlamada(); }, 450);
    if (mode === "urgencia" && !flow) setTimeout(function () { addUser(URG_CHIP.t); startUrgencia(); }, 450);
    setTimeout(function () { input.focus(); }, 50);
  }

  // Motivos = especialidades publicadas (su formulario ofrece Ortodoncia, Odontopediatría, Implantes, Revisión y Otros)
  var TRAT = ["Primera visita / revisión", "Ortodoncia / Invisalign", "Para un niño/a (odontopediatría)", "Implantes", "Estética / blanqueamiento", "Encías (periodoncia)", "Endodoncia", "ATM / bruxismo (fisioterapia)", "Logopedia", "Dolor / urgencia", "Otro"];
  var URG = ["Dolor de muelas", "Inflamación / flemón", "Diente roto o golpe", "Muela del juicio", "Bracket suelto o alambre que pincha", "Urgencia de un niño/a", "Otra urgencia"];
  function franjasDe(dow) {
    var rs = dow == null ? LX : (H[dow] || []), o = [];
    rs.forEach(function (r) { var t = (r[0] < 840 ? "Mañana" : "Tarde") + " (" + hhmm(r[0]) + "–" + hhmm(r[1]) + ")"; o.push({ t: t, v: t, flow: true }); });
    if (o.length > 1) o.push({ t: "Me da igual", v: "Mañana o tarde, indiferente", flow: true });
    return o;
  }
  function startCita() {
    flow = { step: "nombre", d: {} };
    addBot("¡Perfecto! Te ayudo a pedir cita en unos pasos. En la primera visita te dan un informe personalizado con diagnóstico, tratamientos, tarifas y financiación.\n¿Cómo te llamas? (Escribe «cancelar» si quieres salir.)");
  }
  function startLlamada() {
    flow = { step: "nombre", d: { tipo: "llamada", consulta: (lastQ || "Consulta general").slice(0, 120) } };
    addBot("¡Claro! Te llama una persona del equipo de la clínica. Solo necesito dos datos.\n¿Cómo te llamas? (Escribe «cancelar» si quieres salir.)");
  }
  function startUrgencia() {
    flow = { step: "urg", d: { tipo: "urgencia" } };
    var n = madridNow(), op = isOpen(n);
    addBot((op ? "Vamos rápido. Ahora están en horario de consulta: lo más rápido es llamar al " + C.tel + " o al " + C.tel900 + " y decirlo al principio. Si no puedes llamar, la dejo pedida aquí."
      : "Vamos rápido. Ahora están fuera del horario de consulta (vuelven " + nextOpening(n) + "), pero dejo tu urgencia pedida para que te llamen en cuanto la vean.") + "\n¿Qué te pasa?",
      URG.map(function (t) { return { t: t, v: t, flow: true }; }).concat([TEL]));
  }
  var ALARMA = "⚠️ Si tienes fiebre alta, una inflamación que te dificulta tragar o respirar, o un golpe fuerte en la cara, no esperes: acude a urgencias de tu hospital o centro de salud (o llama al 112).";
  function ask(step) {
    flow.step = step;
    var d = flow.d, n = madridNow();
    if (step === "tratamiento") addBot("Encantados, " + d.nombre + ". ¿Cuál es el motivo de la cita?", TRAT.map(function (t) { return { t: t, v: t, flow: true }; }));
    else if (step === "dia") addBot("¿Qué día te viene mejor? Lo anoto como preferencia y el equipo te confirma la hora exacta. Atienden L–X de 9:00 a 14:00 y de 15:00 a 20:00, el jueves solo por la tarde (15:00–20:00) y el viernes solo por la mañana (9:00–14:00).",
      nextWorkdays(n, 5).map(function (x) { return { t: x.label, v: x.label, dow: x.dow, flow: true }; }).concat([{ t: "Lo antes posible", v: "Lo antes posible", flow: true }]));
    else if (step === "franja") {
      var fr = franjasDe(d.dow);
      if (fr.length === 1) { d.franja = fr[0].v; addBot("Ese día solo atienden " + (/Mañana/.test(fr[0].v) ? "por la mañana" : "por la tarde") + ": lo anoto en " + fr[0].v.toLowerCase() + "."); setTimeout(function () { ask("telefono"); }, 700); return; }
      addBot("¿En qué franja?", fr);
    }
    else if (step === "telefono") addBot(d.tipo === "llamada" ? "Perfecto, " + d.nombre + ". ¿A qué teléfono te llaman?"
      : (d.tipo === "urgencia" ? "¿A qué teléfono te llaman para darte el primer hueco?" : "Último paso: ¿a qué teléfono te llamamos para confirmarte la cita?"));
    else if (step === "resumen") {
      var B = [{ t: "✅ Confirmar", v: "__ok", flow: true }, { t: "✏️ Corregir", v: "__fix", flow: true }, { t: "Cancelar", v: "cancelar", flow: true }];
      if (d.tipo === "llamada") { addBot("Revisa tu solicitud de llamada:\n👤 Nombre: " + d.nombre + "\n💬 Consulta: " + d.consulta + "\n📱 Teléfono: " + d.telefono + "\n\n" + AVISO + "\n\n¿Lo confirmo?", B, "r24-sum"); return; }
      if (d.tipo === "urgencia") { addBot("Revisa tu urgencia:\n🚨 Urgencia: " + d.motivo + "\n👤 Nombre: " + d.nombre + "\n📅 Cuándo: el primer hueco posible" + (isOpen(n) ? " (hoy)" : " (vuelven " + nextOpening(n) + ")") + "\n📱 Teléfono: " + d.telefono + "\n\n" + AVISO + "\n\n¿Lo confirmo?", B, "r24-sum"); return; }
      addBot("Revisa tu solicitud:\n👤 Nombre: " + d.nombre + "\n🦷 Motivo: " + d.tratamiento + "\n📅 Día: " + d.dia + "\n🕐 Franja: " + d.franja + "\n📱 Teléfono: " + d.telefono + "\n\n" + AVISO + "\n\n¿Lo confirmo?", B, "r24-sum");
    }
  }
  function dowFromText(n) {
    var m = n.match(/\b(lunes|martes|miercoles|jueves|viernes|sabado|domingo)\b/); if (!m) return null;
    return ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"].indexOf(m[1]);
  }
  function flowInput(t, chip) {
    var n = norm(t), d = flow.d;
    if (/^(cancelar|cancela|salir|dejalo|olvidalo)$/.test(n)) { flow = null; addBot("Sin problema, he cancelado la solicitud. ¿Te ayudo con otra cosa?", [CITA_CHIP, LLAMADA_CHIP]); return; }
    if (/\?/.test(t) && flow.step !== "resumen") {
      var bi = bestIntent(t);
      if (bi && bi.s >= 1) { reply(bi.e); setTimeout(function () { ask(flow.step); }, 700); return; }
    }
    switch (flow.step) {
      case "urg":
        d.motivo = t.slice(0, 80);
        addBot(ALARMA);
        setTimeout(function () { flow.step = "nombre"; addBot("Para dejar tu urgencia pedida, ¿cómo te llamas?"); }, 900); return;
      case "nombre":
        var nm = t.replace(/^(me llamo|soy|mi nombre es)\s+/i, "").trim();
        if (nm.length < 2 || nm.length > 60 || /\d/.test(nm)) { addBot("¿Me dices tu nombre, por favor? (solo el nombre, sin números)"); return; }
        d.nombre = nm.split(/\s+/).map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join(" ");
        if (d.tipo === "llamada" || d.tipo === "urgencia") { ask("telefono"); return; } ask("tratamiento"); return;
      case "tratamiento":
        d.tratamiento = t.slice(0, 80);
        if (/urgen|dolor/.test(n)) {
          addBot("Si te duele, lo más rápido es llamar al " + C.tel + " o al " + C.tel900 + (isOpen(madridNow()) ? " ahora mismo" : " en cuanto vuelvan (" + nextOpening(madridNow()) + ")") + ". Aun así, dejo tu solicitud preparada.", [TEL, TEL900]);
          setTimeout(function () { ask("dia"); }, 900); return;
        }
        ask("dia"); return;
      case "dia":
        d.dia = t.slice(0, 60);
        d.dow = chip && chip.dow != null ? chip.dow : dowFromText(n);
        if (d.dow === 0 || d.dow === 6 || /finde|fin de semana|festivo/.test(n)) {
          d.dow = null;
          addBot("Lo anoto. Ojo: su horario publicado es de lunes a viernes y los sábados y domingos no figuran, así que el equipo te propone el día más cercano.");
          setTimeout(function () { ask("franja"); }, 700); return;
        }
        ask("franja"); return;
      case "franja":
        d.franja = t.slice(0, 60); ask("telefono"); return;
      case "telefono":
        var ph = t.replace(/[\s().-]/g, "").replace(/^00/, "+").replace(/^\+34/, "");
        if (!/^[6789]\d{8}$/.test(ph)) { addBot("Ese número no me cuadra. Escríbelo con 9 cifras, por ejemplo 612 345 678."); return; }
        d.telefono = ph.slice(0, 3) + " " + ph.slice(3, 6) + " " + ph.slice(6);
        ask("resumen"); return;
      case "resumen":
        if (t === "__ok" || /^(si|vale|ok|confirmo|confirmar|correcto)/.test(n)) {
          var nm2 = d.nombre.split(" ")[0], DEMO = "\n\n(Versión de demostración: esta solicitud no se ha enviado a la clínica.)";
          if (d.tipo === "llamada") { addBot("¡Listo, " + nm2 + "! ✅ El equipo de la clínica recibe tu pedido al instante y te llama al " + d.telefono + "." + DEMO, [CITA_CHIP, Q("Otra pregunta", "__menu")]); flow = null; return; }
          if (d.tipo === "urgencia") { addBot("¡Listo, " + nm2 + "! ✅ Tu urgencia queda pedida. El equipo te llama al " + d.telefono + " para darte el primer hueco; si puedes, adelántate llamando al " + C.tel + ".\nSi empeora, no esperes: urgencias de tu hospital o centro de salud, o el 112." + DEMO, [{ t: "Cómo llegar", q: "dirección" }, TEL]); flow = null; return; }
          addBot("¡Listo, " + nm2 + "! ✅ Tu solicitud de cita está registrada.\nEl equipo te llamará al " + d.telefono + " para confirmarte el día y la hora exactos.\nSi prefieres adelantarte: " + C.tel + " o " + C.tel900 + "." + DEMO, [{ t: "Cómo llegar y parking", q: "dirección" }, Q("Otra pregunta", "__menu")]);
          flow = null; return;
        }
        if (t === "__fix" || /corregir|cambiar|^no\b/.test(n)) { flow.d = d.tipo === "llamada" ? { tipo: "llamada", consulta: d.consulta } : (d.tipo === "urgencia" ? { tipo: "urgencia", motivo: d.motivo } : {}); addBot("Vale, empezamos de nuevo. ¿Cómo te llamas?"); flow.step = "nombre"; return; }
        ask("resumen"); return;
    }
  }
  function reply(e) {
    var t = typeof e.a === "function" ? e.a() : e.a;
    if (e.urg) t += "\n\n" + ALARMA;
    addBot(t, (e.c || []).map(function (c) { return c.q ? { t: c.t, v: c.q } : c; }));
  }
  function fallback() {
    addBot("Eso te lo confirma mejor el equipo de la clínica, así tienes el dato exacto. 😊\nLlámales al " + C.tel + " o al " + C.tel900 + ", o deja tu teléfono y te llaman ellos.", [TEL, TEL900, LLAMADA_CHIP, CITA_CHIP]);
  }
  function handle(t, chip) {
    if (t === "__menu") { addBot("Claro, ¿qué más quieres saber?", [CITA_CHIP, Q("Tratamientos", "tratamientos"), Q("Cómo llegar", "dirección"), LLAMADA_CHIP]); return; }
    addUser(chip ? chip.t : t);
    if (flow) { flowInput(chip && chip.v ? chip.v : t, chip); return; }
    if (chip && chip.a === "cita") { startCita(); return; }
    if (chip && chip.a === "llamada") { startLlamada(); return; }
    if (chip && chip.a === "urgencia") { startUrgencia(); return; }
    var n = norm(t);
    if (/^(hola|buenas|buenos dias|buenas tardes|hey)\b/.test(n) && n.split(" ").length <= 3) { addBot("¡Hola! ¿En qué te puedo ayudar? Puedo pedirte cita, dejar pedida una urgencia o contarte tratamientos, horario, parking y financiación.", [CITA_CHIP, URG_CHIP, Q("Tratamientos", "tratamientos"), LLAMADA_CHIP]); return; }
    if (/^horario y parking$/.test(n)) { addBot(horarioA() + "\n\n📍 " + C.dir + ". Tienen " + C.parking + ".", [MAPS, CITA_CHIP, LLAMADA_CHIP]); return; }
    if (/^tratamientos?$|que tratamientos|que haceis|servicios|especialidades/.test(n)) {
      addBot("Coinsol es un centro de odontología integral para toda la familia. Especialidades que publica:\n• Ortodoncia (Invisalign, brackets, lingual, estética, interceptiva…)\n• Odontopediatría (0 a 12 años)\n• Implantología\n• Periodoncia (encías)\n• Endodoncia\n• Estética dental (blanqueamiento, carillas, coronas y puentes, prótesis)\n• Cirugía oral\n• Fisioterapia de ATM y bruxismo\n• Logopedia\n¿Sobre cuál quieres saber más?",
        [Q("Ortodoncia", "ortodoncia"), Q("Niños", "niños"), Q("Implantes", "implantes"), CITA_CHIP]); return; }
    var bi = bestIntent(t);
    var price = isPriceQ(n);
    if (/urgencia|urgente/.test(n) && /dejar|pedir|tengo|quiero/.test(n) && !/\?/.test(t)) { startUrgencia(); return; }
    if (wantsCita(n) && !price && (!bi || bi.s < 2 || /cita|reserv|agendar/.test(n))) { startCita(); return; }
    if (/\b(gratis|gratuita|gratuito|sin coste)\b/.test(n) && !wantsCita(n)) { reply(byId("gratis")); return; }
    if (price) {
      if (/primera|gratis|gratuit|sin coste/.test(n)) { reply(byId("gratis")); return; }
      if (/financ|plazo|mes|pago|cuota/.test(n)) { reply(byId("financiacion")); return; }
      reply(byId("precio")); return;
    }
    if (bi) { reply(bi.e); return; }
    lastQ = t; fallback();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build); else build();
  window.R24 = { open: open, _test: { bestIntent: bestIntent, norm: norm, isOpen: isOpen, madridNow: madridNow } };
})();
