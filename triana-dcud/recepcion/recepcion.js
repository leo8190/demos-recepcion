/* R24-BRIEF-1018: avatar humano, botones rápidos, "que me llamen", aviso al equipo, sin "no tengo ese dato" */
/* Recepción 24 h · Clínica Dental Triana (Sevilla: Triana + Espartinas, Aljarafe) — DEMO privada.
   100% del lado del cliente: sin APIs, sin claves, sin envío de datos.
   Todas las respuestas salen de textos publicados en www.clinicadentaltriana.com (oct. 2026). Trato de «tú», como su web.
   Lo que la web no publica (precios, mutuas, WhatsApp, email, si la 1ª visita es gratis…) se deriva al teléfono de cada sede. */
(function () {
  "use strict";
  var C = {
    nombre: "Clínica Dental Triana",
    telTri: "954 33 50 13", telTrih: "+34954335013",
    telEsp: "955 71 31 34", telEsph: "+34955713134",
    dirTri: "C. Alfarería, 70, 41010 Sevilla (barrio de Triana)",
    mapsTri: "https://www.google.com/maps/search/?api=1&query=Cl%C3%ADnica+Dental+Triana+C.+Alfarer%C3%ADa+70+Sevilla",
    dirEsp: "Av. Velázquez, 2, 41807 Espartinas, Sevilla (Aljarafe)",
    mapsEsp: "https://www.google.com/maps/search/?api=1&query=Cl%C3%ADnica+Dental+Triana+Av.+Vel%C3%A1zquez+2+Espartinas"
  };
  // Horario publicado en Contacto, idéntico en las dos sedes: L–J 9:30–14:00 y 16:00–20:30 · V 9:30–14:00 · S y D cerrado. (0 = domingo)
  var LJ = [[570, 840], [960, 1230]], VI = [[570, 840]];
  var H = { 1: LJ, 2: LJ, 3: LJ, 4: LJ, 5: VI, 0: [], 6: [] };
  var DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
  var MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  var HORARIO_TXT = "Igual en Triana y en Espartinas:\n• Lunes a jueves: 9:30–14:00 y 16:00–20:30\n• Viernes: 9:30–14:00 (por la tarde, cerrado)\n• Sábados y domingos: cerrado";

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
  function nextOpening(n) {
    for (var i = 0; i < 8; i++) {
      var dt = new Date(n.y, n.m, n.d + i), dow = dt.getDay(), rs = H[dow] || [];
      for (var j = 0; j < rs.length; j++) if (i > 0 || rs[j][0] > n.min) {
        return (i === 0 ? "hoy" : (i === 1 ? "mañana " + DIAS[dow] : "el " + DIAS[dow])) + " a las " + hhmm(rs[j][0]);
      }
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
  var TEL_TRI = { t: "Llamar Triana " + C.telTri, tel: C.telTrih };
  var TEL_ESP = { t: "Llamar Espartinas " + C.telEsp, tel: C.telEsph };
  var TELS = "Triana " + C.telTri + " · Espartinas " + C.telEsp;
  var NO_WA = "La clínica no publica WhatsApp ni email: las citas se dan por teléfono (" + TELS + ").";
  var KB = [
    { id: "valoracion", k: ["primera visita", "primera cita", "primera consulta", "primera vez", "consulta gratis", "consulta gratuita", "valoracion", "diagnostico", "gratis", "gratuito", "gratuita", "sin coste", "presupuesto", "presupuesto escrito", "sin compromiso", "segunda opinion", "radiografia"],
      a: "En la primera visita te miran la boca (exploración y diagnóstico con radiografía digital), te explican con calma y sin compromiso qué tienes y qué haría falta, y te entregan el presupuesto detallado y por escrito, «sin sorpresas».\nEn su web indican que los presupuestos, estudios y modelos son gratuitos y sin ningún compromiso; si la visita en sí tiene algún coste no lo dicen, así que te lo confirman al llamar.", c: [CITA_CHIP, { t: "Financiación", q: "financiación" }, { t: "Servicios sin coste", q: "servicios gratuitos" }] },
    { id: "gratuitos", k: ["servicios gratuitos", "sin cargo", "incluido", "incluye", "suturas", "puntos", "pulido", "control postoperatorio", "tecnica cepillado", "consejos higiene"],
      a: "Con tu tratamiento incluyen sin coste adicional: pulido de empastes, suturas (puntos) y su retirada, radiografía periapical, control postoperatorio, revisión oclusal postoperatoria, asesoramiento sobre higiene bucal y técnicas de cepillado.", c: [CITA_CHIP] },
    { id: "financiacion", k: ["financiacion", "financiais", "financiar", "plazos", "pagar a plazos", "cuotas", "al mes", "mensual", "mensualidades", "pago aplazado", "facilidades", "formas pago", "opciones pago", "60 meses", "cinco años"],
      a: "Sí: los tratamientos se pueden repartir en mensualidades, con planes de hasta 60 meses según el tratamiento (en ortodoncia, también hasta 60 meses).\nEl presupuesto se cierra por escrito en la primera visita, antes de empezar, y no cambia por el camino. La cuota exacta te la calculan en recepción, sin compromiso.", c: [CITA_CHIP, TEL_TRI, TEL_ESP] },
    { id: "precio", k: ["precio", "precios", "tarifa", "tarifas", "cuanto cuesta", "cuanto vale"],
      a: "La clínica no publica precios: depende de cada caso (por ejemplo, en implantes del número de piezas, de si hace falta injerto y del tipo de corona). Prefiero no darte una cifra a ojo.\nLo que sí hacen: en la primera visita te dan un presupuesto cerrado y por escrito, y se puede financiar hasta 60 meses según el tratamiento.", c: [CITA_CHIP, { t: "Financiación", q: "financiación" }, LLAMADA_CHIP] },
    { id: "laboratorio", k: ["laboratorio", "laboratorio propio", "protesico", "protesis", "protesis rota", "dentadura", "dentadura rota", "dentadura postiza", "se me ha roto la protesis", "arreglar protesis", "reparar protesis", "ajustar protesis", "mismo dia", "en el dia", "dos horas", "2 horas", "inmediata"],
      a: "Sí: tienen laboratorio dental propio dentro de la clínica. El protésico (José Antonio Parejo Conde) ve tu boca y ajusta en el momento:\n• Arreglos de prótesis urgentes en unas 2 horas, el mismo día\n• Prótesis removibles inmediatas en el día\n• Escaneado intraoral y diseño digital, sin pastas ni moldes\n• Ajustes y retoques sin cita de espera\nTipos: removibles inmediatas, fijas sobre implantes, removibles sobre implantes y fijas de circonio.", c: [URG_CHIP, CITA_CHIP] },
    { id: "implantes", k: ["implante", "implantes", "implantologia", "dientes fijos", "falta diente", "perdido diente", "reponer diente", "carga inmediata", "titanio", "ticare", "mozo grau", "poco hueso", "injerto", "osteointegracion", "elevacion seno"],
      a: "Sí, ponen implantes en Triana y en Espartinas, desde una sola pieza hasta una arcada completa:\n• Trabajan con Ticare, de Mozo Grau (primera marca española), con planificación digital previa a la cirugía (escáner intraoral).\n• Si hay poco hueso: injerto o regeneración ósea guiada.\n• Carga inmediata (corona provisional el mismo día) si tu caso es apto.\n• La osteointegración tarda 3–4 meses en la mandíbula y 5–6 en el maxilar superior. Se hace con anestesia local.\nPresupuesto detallado por escrito antes de empezar.", c: [CITA_CHIP, { t: "¿Duele?", q: "duele implante" }, { t: "¿Precio?", q: "precio implante" }] },
    { id: "implante_dolor", k: ["duele implante", "implante duele", "postoperatorio", "molestias implante"],
      a: "Según su web, durante la colocación no duele: es con anestesia local, como un empaste. Puedes notar presión o vibración. Los días siguientes es normal alguna molestia, que se resuelve en 2 o 3 días.", c: [CITA_CHIP] },
    { id: "invisalign", k: ["invisalign", "ortodoncia invisible", "invisible", "alineador", "alineadores", "sin brackets", "transparente"],
      a: "Sí, trabajan con Invisalign en Triana y en Espartinas: alineadores transparentes hechos a medida, que te quitas para comer y cepillarte (se llevan unas 22 horas al día).\n• Primera visita: exploración, fotos y radiografías para ver si tu caso es apto, y presupuesto por escrito.\n• En adultos, la mayoría de ortodoncias duran entre 12 y 24 meses.\n• Financiación de la ortodoncia hasta 60 meses.", c: [CITA_CHIP, { t: "Otros tipos de ortodoncia", q: "brackets" }] },
    { id: "ortodoncia", k: ["ortodoncia", "bracket", "brackets", "damon", "zafiro", "oro", "aparato", "aparatos", "alinear dientes", "dientes torcidos", "mordida", "ortopedia"],
      a: "Hacen ortodoncia desde los primeros dientes hasta adultos que nunca se trataron:\n• Brackets convencionales, sistema Damon, brackets estéticos de zafiro y brackets de oro (dicen ser pioneros en España en esta técnica)\n• Ortodoncia invisible (Invisalign) y O.M.I. (mínimamente invasiva)\n• Niños: ortopedia dentofacial y ortodoncia funcional\nLa ortodoncia la lleva la Dra. Rocío Parejo Conde, socia fundadora. Financiación hasta 60 meses.", c: [CITA_CHIP, { t: "Invisalign", q: "invisalign" }] },
    { id: "ninos", k: ["niño", "niños", "nino", "ninos", "hijo", "hija", "hijos", "infantil", "odontopediatria", "odontopediatra", "pequeño", "bebe", "primer diente", "dientes de leche", "selladores"],
      a: "Sí: recomiendan la primera revisión con la salida del primer diente. Hacen selladores, «empastes sin miedo» y control del crecimiento para ver a tiempo si hará falta ortopedia.\nA los niños los ve Teresa Ruiz Zamudio, la odontopediatra. Un consejo de su web: con niños, mejor cita de mañana.", c: [CITA_CHIP] },
    { id: "mayores", k: ["mayores", "persona mayor", "abuelo", "abuela", "anciano", "gerodontologia", "movilidad reducida", "silla ruedas", "accesible", "accesibilidad", "escalones"],
      a: "Sí, con gerodontología: citas sin prisa, consultas accesibles y prótesis que se ajustan en el día para que nadie se quede sin comer.\n• Triana: entrada a nivel de calle y consulta adaptada.\n• Espartinas: consulta en planta baja, sin escalones.", c: [CITA_CHIP] },
    { id: "estetica", k: ["estetica", "carilla", "carillas", "blanqueamiento", "blanquear", "dientes blancos", "diseño sonrisa", "sonrisa", "manchas", "composite", "porcelana", "circonio", "corona", "coronas", "funda", "fundas"],
      a: "En estética dental hacen («primero la salud y la mordida; después el color y la forma»):\n• Carillas de composite y de porcelana (feldespática o disilicato)\n• Carillas y coronas de circonio\n• Blanqueamiento en la clínica, de forma segura y controlada\n• Diseño de sonrisa digital previo\nPrecio: no publicado; te lo dan por escrito en la primera visita.", c: [CITA_CHIP] },
    { id: "cirugia", k: ["cirugia", "cirugia oral", "cirujano", "extraccion", "extracciones", "sacar muela", "muela juicio", "muelas juicio", "cordal", "cordales", "quiste", "frenillo", "biopsia", "quirofano"],
      a: "Hacen cirugía oral: muelas del juicio (también las incluidas, las que no han llegado a salir), quistes, frenillos, biopsias, cirugía periodontal, regeneración ósea y elevaciones de seno. El cirujano oral es Iñigo Fernández-Figares Conde.\nLas extracciones se hacen con anestesia local y no duelen. Para las cirugías grandes trabajan con otorrinos y anestesistas, y alquilan quirófano en el Hospital Infanta Luisa.", c: [CITA_CHIP] },
    { id: "general", k: ["empaste", "empastes", "caries", "endodoncia", "matar nervio", "conductos", "limpieza", "limpieza dental", "higiene", "revision", "revisiones", "chequeo", "sarro", "detartraje"],
      a: "Sí: revisiones con radiografía digital, empastes y reconstrucciones, endodoncia, limpiezas e higiene periodontal («lo que evita las intervenciones grandes»).\nLa endodoncia se hace con anestesia local; Ignacio Albarrán está especializado en endodoncia avanzada. Una limpieza quita manchas de café, té o tabaco, aunque no cambia el color del diente.", c: [CITA_CHIP] },
    { id: "encias", k: ["periodoncia", "periodontitis", "piorrea", "encia", "encias", "sangran", "sangrado", "gingivitis", "dientes se mueven"],
      a: "Sí, tratan las encías (periodoncia): encías que sangran, gingivitis o periodontitis, con diagnóstico y tratamiento, cirugía periodontal y mantenimiento. En su web explican que una encía sana es rosada y no sangra al cepillarse.", c: [CITA_CHIP] },
    { id: "bruxismo", k: ["bruxismo", "rechinar", "apretar dientes", "placa descarga", "ferula", "mandibula", "atm", "jaqueca"],
      a: "El bruxismo (rechinar los dientes, a menudo de noche) se frena, si se coge a tiempo, con una placa de descarga transparente hecha en su propio laboratorio. En casos intensos lo combinan con fisioterapia osteocraneal.", c: [CITA_CHIP] },
    { id: "urgencia", k: ["urgencia", "urgencias", "urgente", "dolor", "duele muela", "me duele", "dolor muelas", "emergencia", "flemon", "hinchazon", "infeccion", "se me ha roto", "diente roto", "golpe", "diente partido", "bracket suelto", "alambre"],
      a: "Atienden urgencias en las dos sedes y reservan huecos cada día para esto: llama y dilo al principio de la llamada (" + TELS + ").\nMientras llegas: enjuaga con agua templada y no mastiques por ese lado; si hay hinchazón, frío por fuera a ratos; si se ha salido un diente, cógelo por la corona y guárdalo en leche; si se rompió la prótesis, trae todos los trozos (con su laboratorio propio la reparan en unas 2 horas).", urg: true, c: [URG_CHIP, TEL_TRI, TEL_ESP] },
    { id: "horario", k: ["horario", "hora abris", "abris", "abierto", "abiertos", "cerrais", "cierra", "a que hora", "tarde", "mediodia", "lunes", "martes", "miercoles", "jueves", "viernes"],
      a: "Horario publicado:\n" + HORARIO_TXT, now: true, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "finde", k: ["sabado", "sabados", "domingo", "domingos", "fin semana", "finde", "festivo", "agosto", "vacaciones"],
      a: "Los sábados y domingos las dos clínicas están cerradas (los viernes, solo por la mañana). Aquí sí te atiendo: déjame tu cita o tu urgencia y la clínica te llama en cuanto abra.\n\n" + HORARIO_TXT, c: [CITA_CHIP, URG_CHIP, LLAMADA_CHIP] },
    { id: "direccion", k: ["donde", "direccion", "ubicacion", "como llego", "llegar", "metro", "autobus", "bus", "aparcar", "aparcamiento", "parking", "calle", "mapa", "alfareria", "velazquez", "espartinas", "aljarafe", "sede", "sedes", "clinicas"],
      a: "Tienen dos sedes:\n📍 Triana: " + C.dirTri + " · tel. " + C.telTri + "\nBus C3 (paradas en c/ Castilla y San Jorge), 40 y 43 · Metro Plaza de Cuba (L1), a unos 15 min andando · aparcamiento regulado en Alfarería y Pagés del Corro.\n📍 Espartinas: " + C.dirEsp + " · tel. " + C.telEsp + "\nBus M-167 y M-168 · en coche por la A-49, unos 20 min desde Sevilla · aparcamiento libre en la calle, sin zona azul.", c: [{ t: "Maps Triana", url: C.mapsTri }, { t: "Maps Espartinas", url: C.mapsEsp }, CITA_CHIP] },
    { id: "contacto", k: ["telefono", "llamar", "numero", "contacto", "email", "correo", "mail", "whatsapp", "wasap", "watsap", "movil", "hablar persona", "recepcion", "humano"],
      a: "Teléfonos publicados:\n• Triana: " + C.telTri + "\n• Espartinas: " + C.telEsp + "\n" + NO_WA + "\nSi prefieres, deja aquí tu teléfono y te llaman ellos.", c: [TEL_TRI, TEL_ESP, LLAMADA_CHIP] },
    { id: "traer", k: ["traer", "llevar", "dni", "documentacion", "necesito llevar", "informes", "medicacion"],
      a: "Si eres paciente nuevo: el DNI y, si las tienes, radiografías o informes anteriores; la lista de medicación que tomas; y si vienes por una prótesis, tráela puesta o en la mano, aunque esté rota.", c: [CITA_CHIP] },
    { id: "equipo", k: ["quien atiende", "doctor", "doctora", "dentista", "dentistas", "odontologo", "experiencia", "opiniones", "equipo", "familia", "familiar", "1993", "años", "rocio", "parejo", "historia", "franquicia"],
      a: "Es una clínica familiar desde 1993 (empezó en la calle Alfarería, en Triana), con más de 30 años y 25.000 pacientes, y sin rotación de personal: el mismo equipo en las dos sedes y la misma historia clínica.\nDoctores: Rocío Parejo Conde (socia fundadora; ortodoncia, cirugía y diseño de sonrisa), David Gandía García (conservadora, prótesis e implantes), Rosa García García (conservadora, endodoncia, ortodoncia invisible), Iñigo Fernández-Figares Conde (cirujano oral), Teresa Ruiz Zamudio (odontopediatra) e Ignacio Albarrán (endodoncia avanzada).", c: [CITA_CHIP] },
    { id: "digital", k: ["digital", "tecnologia", "escaner", "escaner intraoral", "moldes", "pastas", "3d", "moderno"],
      a: "Trabajan con odontología digital: escáner intraoral y diseño digital (sin pastas ni moldes incómodos), radiografía digital y planificación digital de los implantes antes de la cirugía.", c: [CITA_CHIP] },
    { id: "seguros", k: ["seguro", "mutua", "adeslas", "sanitas", "dkv", "asisa", "mapfre", "aseguradora", "poliza", "seguridad social"],
      a: "Su web no dice si trabajan con mutuas o seguros dentales, así que no te lo voy a asegurar. Te lo confirman en un momento por teléfono (" + TELS + "), o deja tu número y te llaman.", c: [TEL_TRI, TEL_ESP, LLAMADA_CHIP] },
    { id: "gracias", k: ["gracias", "vale gracias", "perfecto", "genial", "adios", "hasta luego"],
      a: "¡A ti! Si necesitas algo más, aquí estoy. 😊", c: [CITA_CHIP] }
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
  function isPriceQ(n) { return /\b(precio|precios|cuesta|cuestan|cuanto vale|cuanto valen|coste|tarifa|tarifas|€|euros|caro|barato)\b/.test(n); }
  function wantsCita(n) { var ut = toks(n); return CITA_K.some(function (ph) { return phraseScore(ph, ut) > 0; }); }
  function byId(id) { return KB.filter(function (e) { return e.id === id; })[0]; }

  var body, input, status, panel, launch, opened = false;
  var flow = null;

  function el(tag, cls, html) { var x = document.createElement(tag); if (cls) x.className = cls; if (html != null) x.innerHTML = html; return x; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function scroll() { body.scrollTop = body.scrollHeight; }
  function addUser(t) { var m = el("div", "r24-msg r24-user"); m.textContent = t; body.appendChild(m); scroll(); }
  function addBot(t, chips, cls) {
    var ty = el("div", "r24-typing", "Escribiendo…"); body.appendChild(ty); scroll();
    setTimeout(function () {
      ty.remove();
      var m = el("div", "r24-msg r24-bot" + (cls ? " " + cls : ""), esc(t).replace(/\b(954 33 50 13|955 71 31 34)\b/g, function (x) {
        return '<a href="tel:+34' + x.replace(/\s/g, "") + '">' + x + "</a>";
      }));
      body.appendChild(m);
      if (chips && chips.length) {
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
  function closeAt(n) { var r = (H[n.dow] || []).filter(function (r) { return n.min >= r[0] && n.min < r[1]; })[0]; return r ? r[1] : 0; }
  function statusText() {
    var n = madridNow();
    if (isOpen(n)) { status.className = "r24-status"; status.textContent = "🟢 Abierto ahora · hasta las " + hhmm(closeAt(n)) + " · " + TELS; }
    else { status.className = "r24-status r24-closed"; status.textContent = "🌙 Clínicas cerradas ahora (abren " + nextOpening(n) + "). Te atiendo igual y dejo tu cita o urgencia pedida."; }
  }
  function closedNote() { var n = madridNow(); return isOpen(n) ? "" : "\n\nℹ️ Ahora mismo las dos clínicas están cerradas; abren " + nextOpening(n) + "."; }

  function build() {
    var base = window.R24_BASE || "recepcion/";
    var css = document.createElement("link"); css.rel = "stylesheet"; css.href = base + "recepcion.css"; document.head.appendChild(css);
    var ban = el("div", "r24-demo-banner", "Demo privada preparada para Clínica Dental Triana"); ban.setAttribute("role", "note"); document.body.appendChild(ban);
    launch = el("button", "r24-launch", '<img class="r24-face" src="' + base + 'avatar.svg" alt="Recepcionista"><span>Recepción 24 h</span><span class="r24-dot"></span>');
    launch.type = "button"; launch.setAttribute("aria-label", "Abrir la recepción 24 h"); document.body.appendChild(launch);
    panel = el("div", "r24-panel"); panel.setAttribute("role", "dialog"); panel.setAttribute("aria-label", "Recepción 24 h");
    panel.innerHTML = '<div class="r24-head"><div class="r24-av"><img class="r24-face" src="' + base + 'avatar.svg" alt="Recepcionista"></div><div class="r24-ht"><b>Recepción 24 h <span class="r24-online">● en línea</span></b><small>Clínica Dental Triana · Triana y Espartinas</small></div><button class="r24-x" type="button" aria-label="Cerrar">×</button></div><div class="r24-status"></div><div class="r24-body" aria-live="polite"></div><form class="r24-foot"><input class="r24-in" type="text" placeholder="Escribe tu pregunta…" autocomplete="off" maxlength="300"><button class="r24-send" type="submit">Enviar</button></form><div class="r24-legal">Asistente automático de demostración · tus datos no se envían a ningún sitio</div>';
    document.body.appendChild(panel);
    body = panel.querySelector(".r24-body"); input = panel.querySelector(".r24-in"); status = panel.querySelector(".r24-status");
    launch.onclick = open;
    panel.querySelector(".r24-x").onclick = function () { panel.classList.remove("r24-open"); launch.classList.remove("r24-hide"); };
    panel.querySelector("form").onsubmit = function (ev) { ev.preventDefault(); ev.stopImmediatePropagation(); var t = input.value.trim(); if (!t) return; input.value = ""; handle(t); };
    document.addEventListener("click", function (ev) {
      var a = ev.target.closest && ev.target.closest("[data-r24-open]"); if (a) { ev.preventDefault(); ev.stopPropagation(); open(); }
    }, true);
  }
  function open() {
    panel.classList.add("r24-open"); launch.classList.add("r24-hide"); statusText();
    if (!opened) {
      opened = true;
      addBot("¡Hola! 👋 Soy la recepción virtual de Clínica Dental Triana, tu dentista de familia en Triana y Espartinas desde 1993. Te ayudo a pedir cita en la sede que prefieras, con una urgencia o con dudas de tratamientos, horario y financiación, también cuando la clínica está cerrada.\n¿En qué te ayudo?",
        [CITA_CHIP, URG_CHIP, { t: "Horario y sedes", q: "horario" }, { t: "Financiación", q: "financiación" }, LLAMADA_CHIP]);
    }
    setTimeout(function () { input.focus(); }, 50);
  }

  // Motivos = servicios publicados en su web
  var TRAT = ["Primera visita / revisión", "Limpieza", "Implantes", "Ortodoncia / Invisalign", "Prótesis (dentadura)", "Estética (carillas, blanqueamiento)", "Empaste / endodoncia", "Encías", "Muela del juicio / cirugía", "Para un niño/a", "Dolor / urgencia", "Otro"];
  var URG = ["Dolor de muelas o flemón", "Diente roto o golpe", "Prótesis o dentadura rota", "Muela del juicio inflamada", "Bracket suelto o alambre que pincha", "Urgencia de un niño/a", "Otra urgencia"];
  var SEDES = [{ t: "Triana (C. Alfarería 70)", v: "Triana", flow: true }, { t: "Espartinas (Av. Velázquez 2)", v: "Espartinas", flow: true }, { t: "Me da igual", v: "La que tenga antes hueco", flow: true }];
  function sedeTel(s) { return /espartinas/i.test(s || "") ? C.telEsp : C.telTri; }
  function startCita() {
    flow = { step: "nombre", d: {} };
    addBot("¡Perfecto! Te ayudo a pedir cita en unos pasos. En la primera visita te dan el diagnóstico y el presupuesto por escrito.\n¿Cómo te llamas? (Escribe «cancelar» si quieres salir.)");
  }
  function startLlamada() {
    flow = { step: "nombre", d: { tipo: "llamada", consulta: (lastQ || "Consulta general").slice(0, 120) } };
    addBot("¡Claro! Te llama una persona del equipo de la clínica. Solo necesito dos datos.\n¿Cómo te llamas? (Escribe «cancelar» si quieres salir.)");
  }
  function startUrgencia() {
    flow = { step: "urg", d: { tipo: "urgencia" } };
    var n = madridNow(), op = isOpen(n);
    addBot((op ? "Vamos rápido. Ahora la clínica está abierta: lo más rápido es llamar y decirlo al principio (" + TELS + "); reservan huecos cada día para urgencias. Si no puedes llamar, la dejo pedida aquí." :
      "Vamos rápido. Ahora las dos clínicas están cerradas (abren " + nextOpening(n) + "), pero dejo tu urgencia pedida para que te llamen en cuanto abran; reservan huecos cada día para urgencias.") + "\n¿Qué te pasa?", URG.map(function (t) { return { t: t, v: t, flow: true }; }));
  }
  var CONSEJO = [
    [/protesis|dentadura/, "Trae todos los trozos y no la pegues en casa: con su laboratorio propio la reparan o ajustan en unas 2 horas, el mismo día."],
    [/roto|golpe/, "Si el diente se ha salido, cógelo por la corona (no por la raíz) y guárdalo en leche o en saliva: el tiempo es clave para salvarlo. Si es un trozo, guárdalo también."],
    [/juicio/, "Enjuaga con agua templada y aplica frío por fuera a intervalos cortos. En la visita valoran si basta con tratar la infección o conviene extraerla."],
    [/bracket|alambre/, "Tranquilidad: lo recolocan o lo ajustan para que sigas con el tratamiento."],
    [/nino/, "A los niños los atienden con calma y te explican qué hacer en casa. Si se ha roto un diente, guarda el fragmento en leche y no frotes la raíz."],
    [/./, "Mientras tanto: enjuaga con agua templada, evita masticar por ese lado y, si hay hinchazón, frío por fuera de la cara a ratos."]
  ];
  function ask(step) {
    flow.step = step;
    var n = madridNow();
    if (step === "sede") addBot("Encantados, " + flow.d.nombre + ". ¿En qué clínica te viene mejor?", SEDES);
    else if (step === "tratamiento") addBot("¿Cuál es el motivo de la cita?", TRAT.map(function (t) { return { t: t, v: t, flow: true }; }));
    else if (step === "dia") addBot("¿Qué día te viene mejor? Atienden de lunes a jueves de 9:30 a 14:00 y de 16:00 a 20:30, y los viernes de 9:30 a 14:00.",
      nextWorkdays(n, 5).map(function (x) { return { t: x.label, v: x.label, flow: true }; }).concat([{ t: "Lo antes posible", v: "Lo antes posible", flow: true }]));
    else if (step === "franja") addBot("¿En qué franja?", [{ t: "Mañana (9:30–14:00)", v: "Mañana (9:30–14:00)", flow: true }, { t: "Tarde (16:00–20:30)", v: "Tarde (16:00–20:30)", flow: true }, { t: "Me da igual", v: "Mañana o tarde, indiferente", flow: true }]);
    else if (step === "telefono") addBot(flow.d.tipo === "llamada" ? "Perfecto, " + flow.d.nombre + ". ¿A qué teléfono te llaman?" : (flow.d.tipo === "urgencia" ? "¿A qué teléfono te llaman para darte el primer hueco?" : "Último paso: ¿a qué teléfono te llamamos para confirmarte la cita?"));
    else if (step === "resumen") {
      var d = flow.d, B = [{ t: "✅ Confirmar", v: "__ok", flow: true }, { t: "✏️ Corregir", v: "__fix", flow: true }, { t: "Cancelar", v: "cancelar", flow: true }];
      if (d.tipo === "llamada") { addBot("Revisa tu solicitud de llamada:\n👤 Nombre: " + d.nombre + "\n💬 Consulta: " + d.consulta + "\n📱 Teléfono: " + d.telefono + "\n\n" + AVISO + "\n\n¿Lo confirmo?", B, "r24-sum"); return; }
      if (d.tipo === "urgencia") { addBot("Revisa tu urgencia:\n🚨 Urgencia: " + d.motivo + "\n👤 Nombre: " + d.nombre + "\n📍 Clínica: " + d.sede + "\n📅 Cuándo: primer hueco de urgencias" + (isOpen(madridNow()) ? " (hoy)" : " (abren " + nextOpening(madridNow()) + ")") + "\n📱 Teléfono: " + d.telefono + "\n\n" + AVISO + "\n\n¿Lo confirmo?", B, "r24-sum"); return; }
      addBot("Revisa tu solicitud:\n👤 Nombre: " + d.nombre + "\n📍 Clínica: " + d.sede + "\n🦷 Motivo: " + d.tratamiento + "\n📅 Día: " + d.dia + "\n🕐 Franja: " + d.franja + "\n📱 Teléfono: " + d.telefono + "\n\n" + AVISO + "\n\n¿Lo confirmo?", B, "r24-sum");
    }
  }
  function flowInput(t) {
    var n = norm(t), d = flow.d;
    if (/^(cancelar|cancela|salir|dejalo|olvidalo)$/.test(n)) { flow = null; addBot("Sin problema, he cancelado la solicitud. ¿Te ayudo con otra cosa?", [CITA_CHIP, LLAMADA_CHIP]); return; }
    if (/\?/.test(t) && flow.step !== "resumen") {
      var bi = bestIntent(t);
      if (bi && bi.s >= 1) { reply(bi.e, t); setTimeout(function () { ask(flow.step); }, 700); return; }
    }
    switch (flow.step) {
      case "urg":
        d.motivo = t.slice(0, 80);
        var cj = CONSEJO.filter(function (c) { return c[0].test(n); })[0][1];
        addBot(cj + "\n\n⚠️ Si tienes fiebre alta, una inflamación que te dificulta tragar o respirar, o un golpe fuerte en la cara, no esperes a que abran: acude a urgencias de tu hospital o centro de salud (o llama al 112).");
        setTimeout(function () { flow.step = "nombre"; addBot("Para dejar tu urgencia pedida, ¿cómo te llamas?"); }, 900); return;
      case "nombre":
        var nm = t.replace(/^(me llamo|soy|mi nombre es)\s+/i, "").trim();
        if (nm.length < 2 || nm.length > 60 || /\d/.test(nm)) { addBot("¿Me dices tu nombre, por favor? (solo el nombre, sin números)"); return; }
        d.nombre = nm.split(/\s+/).map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join(" ");
        if (d.tipo === "llamada") { ask("telefono"); return; } ask("sede"); return;
      case "sede":
        d.sede = /espartinas|aljarafe|velazquez/.test(n) ? "Espartinas (Av. Velázquez 2)" : (/triana|alfareria|sevilla/.test(n) ? "Triana (C. Alfarería 70)" : "La que tenga antes hueco (Triana o Espartinas)");
        if (d.tipo === "urgencia") { ask("telefono"); return; } ask("tratamiento"); return;
      case "tratamiento":
        d.tratamiento = t.slice(0, 80);
        if (/urgen|dolor/.test(n)) {
          var op = isOpen(madridNow());
          addBot("Si te duele, lo más rápido es llamar al " + sedeTel(d.sede) + (op ? " ahora mismo" : " en cuanto abran (" + nextOpening(madridNow()) + ")") + " y decirlo al empezar: reservan huecos cada día para urgencias. Aun así, dejo tu solicitud preparada.", [TEL_TRI, TEL_ESP]);
          setTimeout(function () { ask("dia"); }, 900); return;
        }
        ask("dia"); return;
      case "dia":
        if (/sabado|domingo|finde|fin de semana/.test(n)) { addBot("Los sábados y domingos las dos clínicas están cerradas. ¿Te viene bien algún día de lunes a viernes?"); setTimeout(function () { ask("dia"); }, 500); return; }
        if (/viernes/.test(n) && /tarde/.test(n)) { addBot("Los viernes por la tarde la clínica está cerrada: el viernes atienden de 9:30 a 14:00. ¿Te viene bien el viernes por la mañana u otro día?"); setTimeout(function () { ask("dia"); }, 500); return; }
        d.dia = t.slice(0, 60);
        if (/viernes/.test(n)) { d.franja = "Mañana (9:30–14:00)"; addBot("Los viernes solo abren por la mañana, así que lo anoto de 9:30 a 14:00."); setTimeout(function () { ask("telefono"); }, 500); return; }
        ask("franja"); return;
      case "franja":
        if (/noche|\b(21|22|23|15)\b|madrugada|mediodia|comer/.test(n)) { addBot("Atienden de 9:30 a 14:00 y de 16:00 a 20:30 (a mediodía cierran). ¿Mañana o tarde?"); setTimeout(function () { ask("franja"); }, 500); return; }
        d.franja = t.slice(0, 60); ask("telefono"); return;
      case "telefono":
        var ph = t.replace(/[\s().-]/g, "").replace(/^0034/, "+34");
        if (!/^(\+34)?[6789]\d{8}$/.test(ph)) { addBot("Ese número no me cuadra. Escríbelo con 9 cifras, por ejemplo 612 345 678."); return; }
        var dg = ph.replace(/^\+34/, ""); d.telefono = dg.slice(0, 3) + " " + dg.slice(3, 6) + " " + dg.slice(6); ask("resumen"); return;
      case "resumen":
        if (t === "__ok" || /^(si|vale|ok|confirmo|confirmar|correcto)/.test(n)) {
          var nm2 = d.nombre.split(" ")[0];
          if (d.tipo === "llamada") { addBot("¡Listo, " + nm2 + "! ✅ El equipo de la clínica recibe tu pedido al instante y te llama al " + d.telefono + "." + closedNote() + "\n\n(Versión de demostración: esta solicitud no se ha enviado a la clínica.)", [CITA_CHIP, { t: "Otra pregunta", q: "__menu" }]); flow = null; return; }
          if (d.tipo === "urgencia") { addBot("¡Listo, " + nm2 + "! ✅ Tu urgencia queda pedida en " + d.sede + ". La recepción te llama al " + d.telefono + (isOpen(madridNow()) ? " para darte el primer hueco de hoy." : " en cuanto abran (" + nextOpening(madridNow()) + ") para darte el primer hueco.") + "\nSi empeora, no esperes: urgencias de tu hospital o centro de salud, o el 112.\n\n(Versión de demostración: esta solicitud no se ha enviado a la clínica.)", [{ t: "Cómo llegar", q: "dirección" }, { t: "Otra pregunta", q: "__menu" }]); flow = null; return; }
          addBot("¡Listo, " + nm2 + "! ✅ Tu solicitud de cita en " + d.sede + " está registrada.\nLa recepción te llamará al " + d.telefono + " para confirmarte el hueco exacto." + closedNote() + "\n\nSi prefieres adelantarte, puedes llamar: " + TELS + ".\n\n(Versión de demostración: esta solicitud no se ha enviado a la clínica.)", [{ t: "Cómo llegar", q: "dirección" }, { t: "Qué tengo que traer", q: "qué tengo que traer" }, { t: "Otra pregunta", q: "__menu" }]);
          flow = null; return;
        }
        if (t === "__fix" || /corregir|cambiar|no/.test(n)) { flow.d = d.tipo === "llamada" ? { tipo: "llamada", consulta: d.consulta } : (d.tipo === "urgencia" ? { tipo: "urgencia", motivo: d.motivo } : {}); addBot("Vale, empezamos de nuevo. ¿Cómo te llamas?"); flow.step = "nombre"; return; }
        ask("resumen"); return;
    }
  }
  function reply(e, raw) {
    var t = e.a;
    if (e.id === "horario" || e.id === "finde") {
      var nr = norm(raw || ""), dn = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"];
      for (var di = 0; di < 7; di++) if (nr.indexOf(dn[di]) >= 0) {
        if (di === 0 || di === 6) t = "Los " + DIAS[di] + "s las dos clínicas están cerradas. Aquí sí te atiendo: deja tu cita o tu urgencia y te llaman en cuanto abran.";
        else if (di === 5) t = "Los viernes las dos clínicas abren de 9:30 a 14:00; por la tarde, cerrado." + (/tarde/.test(nr) ? " Si me dejas tu cita o tu urgencia ahora, te llaman el lunes a primera hora." : "");
        else t = "El " + DIAS[di] + " las dos clínicas abren de 9:30 a 14:00 y de 16:00 a 20:30.";
        t += "\n\nHorario completo:\n" + HORARIO_TXT; break;
      }
    }
    if (e.now) { var n = madridNow(); t += isOpen(n) ? "\n\n🟢 Ahora mismo están abiertas: " + TELS + "." : "\n\n🌙 Ahora mismo están cerradas; abren " + nextOpening(n) + ". Aun así puedes dejarme tu cita o tu urgencia."; }
    if (e.urg && !isOpen(madridNow())) t += "\n\n🌙 Ahora las dos clínicas están cerradas (abren " + nextOpening(madridNow()) + "). Deja tu urgencia pedida y te llaman en cuanto abran. Si tienes fiebre alta, una inflamación que dificulta tragar o respirar, o un golpe fuerte en la cara, no esperes: urgencias de tu hospital o centro de salud, o el 112.";
    addBot(t, (e.c || []).map(function (c) { return c.q ? { t: c.t, v: c.q } : c; }));
  }
  function fallback() {
    addBot("Eso te lo confirma mejor el equipo de la clínica, así tienes el dato exacto. 😊\nLlámales (Triana " + C.telTri + " · Espartinas " + C.telEsp + "; L–J 9:30–14:00 y 16:00–20:30, V 9:30–14:00) o deja tu teléfono y te llaman ellos." + closedNote(), [TEL_TRI, TEL_ESP, LLAMADA_CHIP, CITA_CHIP]);
  }
  function handle(t, chip) {
    if (t === "__menu") { addBot("Claro, ¿qué más quieres saber?", [CITA_CHIP, { t: "Horario y sedes", v: "horario" }, { t: "Tratamientos", v: "tratamientos" }, { t: "Cómo llegar", v: "dirección" }]); return; }
    addUser(chip ? chip.t : t);
    if (flow) { flowInput(chip && chip.v ? chip.v : t); return; }
    if (chip && chip.a === "cita") { startCita(); return; }
    if (chip && chip.a === "llamada") { startLlamada(); return; }
    if (chip && chip.a === "urgencia") { startUrgencia(); return; }
    var n = norm(t);
    if (/^(hola|buenas|buenos dias|buenas tardes|hey|hello)\b/.test(n) && n.split(" ").length <= 3) { addBot("¡Hola! ¿En qué te puedo ayudar? Puedo pedirte cita en Triana o Espartinas, dejar pedida una urgencia o contarte tratamientos y horario.", [CITA_CHIP, URG_CHIP, { t: "Horario y sedes", v: "horario" }, LLAMADA_CHIP]); return; }
    if (/^tratamientos?$|que tratamientos|que haceis|servicios|especialidades/.test(n) && !/gratuit|gratis/.test(n)) { addBot("Tratan a toda la familia, «desde el primer diente hasta la última prótesis»:\n• Implantes (Ticare, de Mozo Grau)\n• Ortodoncia: brackets, Damon, zafiro, oro e Invisalign\n• Prótesis con laboratorio propio (arreglos en unas 2 h)\n• Estética: carillas, coronas de circonio, blanqueamiento\n• Empastes, endodoncia, limpiezas y encías\n• Cirugía oral y muelas del juicio\n• Dentista infantil y para mayores\n¿Sobre cuál quieres saber más?", [{ t: "Implantes", v: "implantes" }, { t: "Invisalign", v: "invisalign" }, { t: "Prótesis", v: "laboratorio propio" }, CITA_CHIP]); return; }
    var bi = bestIntent(t);
    var price = isPriceQ(n);
    if (/urgencia|urgente/.test(n) && /dejar|pedir|tengo|quiero/.test(n) && !/\?/.test(t)) { startUrgencia(); return; }
    if (wantsCita(n) && !price && !/gratis|gratuit|primera/.test(n) && (!bi || bi.s < 2 || /cita|reserv|agendar/.test(n))) { startCita(); return; }
    if (price) {
      if (/gratis|gratuit|primera|sin coste|valoracion|presupuesto/.test(n)) { reply(byId("valoracion"), t); return; }
      if (/financ|plazo|mes|pago/.test(n)) { reply(byId("financiacion"), t); return; }
      reply(byId("precio"), t); return;
    }
    if (bi) { reply(bi.e, t); return; }
    lastQ = t; fallback();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build); else build();
  window.R24 = { open: open, _test: { bestIntent: bestIntent, norm: norm, isOpen: isOpen, madridNow: madridNow } };
})();
