/* R24-BRIEF-1018: avatar humano, botones rápidos, "que me llamen", aviso al equipo, sin "no tengo ese dato" */
/* Recepción 24 h · Clínica Dental Ruzafa (València, Ruzafa) — DEMO privada. BILINGÜE ES/EN.
   100% del lado del cliente: sin APIs, sin claves, sin envío de datos.
   Todas las respuestas salen de textos publicados en clinicadentalruzafa.es (ES + EN, oct. 2026). Trato de «tú», como su web.
   Idioma: en en.html empieza en inglés; en cualquier página, si el paciente escribe en inglés responde en inglés (y vuelve
   al español si escribe en español). Su web anuncia «atención bilingüe (español/inglés)».
   Lo que la web no publica (precios, mutuas, sábados, si la 1ª visita es gratis…) se deriva a su teléfono/WhatsApp. */
(function () {
  "use strict";
  var C = {
    nombre: "Clínica Dental Ruzafa",
    tel1: "622 485 781", tel1h: "+34622485781",
    wa: "https://wa.me/34622485781",
    email: "info@clinicadentalruzafa.es",
    dir: "C. Pedro III El Grande, 8, bajo Dcha., 46005 Valencia (Ruzafa)",
    maps: "https://www.google.com/maps/search/?api=1&query=Cl%C3%ADnica+Dental+Ruzafa+C.+Pedro+III+El+Grande+8+46005+Valencia"
  };
  // Horario publicado (pie de todas las páginas): «Lunes a jueves: 10:00 a 14:00 h y de 16:00 a 20:00 h. Viernes: de 09:30 a 18:00 h.»
  // Sábados y domingos: no figuran. (0 = domingo; minutos desde las 0:00)
  var LJ = [[600, 840], [960, 1200]], V = [[570, 1080]];
  var H = { 1: LJ, 2: LJ, 3: LJ, 4: LJ, 5: V, 0: [], 6: [] };
  var LANG = /^en/i.test(document.documentElement.lang || "") ? "en" : "es";
  function T(es, en) { return LANG === "en" ? en : es; }
  var DIAS = { es: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"], en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] };
  var MESES = { es: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"], en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] };
  function dia(i) { return DIAS[LANG][i]; }
  function HORARIO_TXT() { return T("Lunes a jueves: 10:00–14:00 y 16:00–20:00\nViernes: 9:30–18:00\nSábados y domingos: no figuran en su horario",
    "Monday to Thursday: 10:00–14:00 and 16:00–20:00\nFriday: 9:30–18:00\nSaturday and Sunday: not in their published hours"); }
  function HORARIO_CORTO() { return T("L–J 10:00–14:00 y 16:00–20:00 · V 9:30–18:00", "Mon–Thu 10:00–14:00 & 16:00–20:00 · Fri 9:30–18:00"); }

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
      for (var j = 0; j < rs.length; j++) if (i > 0 || rs[j][0] > n.min) {
        return (i === 0 ? T("hoy", "today") : (i === 1 ? T("mañana ", "tomorrow, ") + dia(dow) : T("el ", "on ") + dia(dow))) + T(" a las ", " at ") + hhmm(rs[j][0]);
      }
    }
    return "";
  }
  function nextWorkdays(n, k) {
    var out = [];
    for (var i = 1; out.length < k && i < 14; i++) {
      var dt = new Date(n.y, n.m, n.d + i), dow = dt.getDay();
      if ((H[dow] || []).length) { var dn = dia(dow); out.push({ dow: dow, label: dn.charAt(0).toUpperCase() + dn.slice(1) + " " + dt.getDate() + " " + MESES[LANG][dt.getMonth()] }); }
    }
    return out;
  }

  var STOP = ("a al algo algun alguna como con cual cuales de del el en es esta este esto estoy hay la las lo los me mi mis o os para pero por que quiero se si sin su sus te tu tus un una uno unos y ya yo vosotros vuestra vuestro hacer haceis teneis tienen tiene puedo podeis podria saber gustaria hola buenas buenos dias tardes noches favor " +
    "the you your do does is are have has can could would i my we please there any an of to for in on at it this that be am im will get").split(" ");
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
  // Detección de idioma por mensaje (sin APIs): palabras muy frecuentes de cada idioma
  var EN_W = "the you your do does is are have has can could would i im my me we what where when how much many which who open opening hours hour appointment book booking speak english hello hi hey please thanks thank need want tooth teeth price prices cost costs implant implants braces cleaning whitening children kids child emergency pain hurts hurt toothache parking insurance call back dentist dentists any available tomorrow today week weekend saturday sunday monday friday clinic offer accept pay payment finance financing there yes good morning afternoon evening".split(" ");
  var ES_W = "que el la los las de del teneis haceis cuanto cuesta donde cuando cita hola gracias quiero necesito puedo precio precios dientes diente muela ninos horario abris abierto sabado domingo por para con una un es esta hay mi buenas buenos tardes dias habla hablais ingles tengo me duele llamar llamen pedir vale".split(" ");
  function detectLang(t) {
    var w = norm(t).split(" "), en = 0, es = 0;
    w.forEach(function (x) { if (EN_W.indexOf(x) >= 0) en++; if (ES_W.indexOf(x) >= 0) es++; });
    if (/[¿¡ñáéíóú]/i.test(t)) es += 2;
    if (en > es) return "en"; if (es > en) return "es"; return null;
  }

  var CITA_CHIP = function () { return { t: T("Pedir cita", "Book an appointment"), a: "cita" }; };
  var LLAMADA_CHIP = function () { return { t: T("📲 Que me llamen", "📲 Call me back"), a: "llamada" }; };
  function AVISO() { return T("🔔 El equipo de la clínica recibe este pedido al instante (en esta demo no se envía nada).", "🔔 The clinic team receives this request instantly (in this demo nothing is sent)."); }
  var lastQ = "";
  var TEL1 = function () { return { t: T("Llamar ", "Call ") + C.tel1, tel: C.tel1h }; };
  var WA = function () { return { t: "WhatsApp " + C.tel1, url: C.wa, wa: true }; };
  var BA = function () { return { t: T("Ver antes y después", "See before & after"), url: "antes-y-despues.html" }; };
  var MAPS = function () { return { t: T("Abrir en Maps", "Open in Maps"), url: C.maps }; };
  function Q(es, en, q) { return function () { return { t: T(es, en), q: q || T(es, en) }; }; }
  var KB = [
    { id: "valoracion", k: ["primera visita", "primera cita", "primera consulta", "consulta gratis", "consulta gratuita", "valoracion", "diagnostico", "gratis", "gratuito", "gratuita", "sin coste", "presupuesto", "sin compromiso", "estudio"],
      ke: ["first visit", "first appointment", "consultation", "free", "quote", "estimate", "assessment", "check up", "checkup"],
      a: "En su web lo dicen así: «Agenda tu cita, y en la consulta te haremos un estudio y presupuesto sin compromiso», con presupuestos totalmente claros.\nSi la primera visita tiene coste o no, no lo indican: te lo confirman en el " + C.tel1 + ".",
      ae: "Their website says that at your appointment they'll do a study of your case and a no-obligation quote, with completely transparent budgets.\nWhether the first visit has a fee isn't stated; the clinic can confirm it on " + C.tel1 + ".", c: [CITA_CHIP, TEL1, LLAMADA_CHIP] },
    { id: "financiacion", k: ["financiacion", "financiamiento", "financiais", "financiar", "plazos", "pagar a plazos", "cuotas", "al mes", "mensual", "pago aplazado", "facilidades", "formas pago", "opciones pago", "tarjeta", "intereses", "sin intereses"],
      ke: ["financing", "finance", "instalments", "installments", "monthly", "pay monthly", "payment plan", "interest free", "credit card", "pay"],
      a: "Sí. Según su web:\n• Financiación con 0 % de intereses, en cómodas cuotas y para cualquier importe.\n• Hasta 1.500 € lo financian solo con tu tarjeta de débito o crédito, sin papeleos ni nóminas (tú eliges plazo e importe).\n• Ortodoncia invisible Alinea: 12, 24 o 36 meses sin intereses.\nLas condiciones de tu caso te las explican con el presupuesto.",
      ae: "Yes. According to their website:\n• 0% interest financing, in comfortable instalments, for any amount.\n• Up to €1,500 can be financed with just your debit or credit card, no paperwork or payslips (you choose the term and amount).\n• Alinea invisible aligners: 12, 24 or 36 months interest-free.\nThey'll explain the conditions for your case together with your quote.", c: [CITA_CHIP, Q("Alinea", "Alinea aligners", "alinea"), LLAMADA_CHIP] },
    { id: "precio", k: ["precio", "precios", "tarifa", "tarifas", "cuanto cuesta", "cuanto vale"],
      ke: ["price", "prices", "cost", "how much", "fee", "fees", "rates"],
      a: "Los precios no están publicados en su web, así que mejor no te doy una cifra a ojo.\nLo que sí dicen: en la consulta te hacen un estudio y presupuesto sin compromiso (presupuestos totalmente claros) y tienen financiación con 0 % de intereses.",
      ae: "Prices aren't published on their website, so I'd rather not guess a figure.\nWhat they do say: at your appointment they study your case and give you a no-obligation, transparent quote, and they offer 0% interest financing.", c: [CITA_CHIP, TEL1, LLAMADA_CHIP] },
    { id: "ortodoncia", k: ["ortodoncia", "ortodoncia invisible", "invisible", "invisalign", "alinea", "alineador", "alineadores", "bracket", "brackets", "alinear dientes", "dientes torcidos", "mordida", "aparato", "aparatos", "ortodoncista"],
      ke: ["orthodontics", "orthodontic", "orthodontist", "aligners", "aligner", "invisible", "clear aligners", "invisalign", "braces", "crooked teeth", "straighten"],
      a: "Sí: ortodoncia metálica e invisible.\nPara la invisible tienen su propia marca, Alinea: alineadores transparentes y removibles, que no interfieren con el habla y dan resultados visibles «en meses, no en años»; en su web dicen que puedes usarlos a tiempo completo o solo por las noches. Financiación en 12, 24 o 36 meses sin intereses.\nOrtodoncistas: Dra. Rita Faria Lavado y Dra. Kiara Núñez Tolotti.",
      ae: "Yes: metal and invisible orthodontics.\nFor invisible orthodontics they have their own brand, Alinea: clear, removable aligners that don't interfere with speech, with visible results \"in months, not years\"; their website says you can wear them full-time or only at night. 12, 24 or 36-month interest-free financing.\nOrthodontists: Dr. Rita Faria Lavado and Dr. Kiara Núñez Tolotti.", c: [CITA_CHIP, Q("¿Precio?", "Price?", "precio ortodoncia"), Q("Financiación", "Financing", "financiacion")] },
    { id: "implantes", k: ["implante", "implantes", "implantologia", "dientes fijos", "falta diente", "perdido diente", "reponer diente", "titanio", "cirugia", "cirugia oral", "cirujano", "extraccion", "extracciones", "sacar muela", "muela juicio", "cordal", "quitar diente"],
      ke: ["implant", "implants", "missing tooth", "lost tooth", "surgery", "oral surgery", "surgeon", "extraction", "wisdom tooth", "pull tooth"],
      a: "Sí: hacen cirugía e implantes, y también coronas, puentes y prótesis fijas y removibles.\nEn el equipo hay cirujanos bucales y maxilofacial (Dra. Lorena Fernandes Ciaccia, Dr. Pedro Luis Parés González, Dra. Kiara Núñez Tolotti) y trabajan con radiología digital, escáner intraoral y planificación 3D.\nTu caso te lo estudian en consulta, con presupuesto sin compromiso.",
      ae: "Yes: they do oral surgery and implants, as well as crowns, bridges and fixed and removable prostheses.\nThe team includes oral and maxillofacial surgeons (Dr. Lorena Fernandes Ciaccia, Dr. Pedro Luis Parés González, Dr. Kiara Núñez Tolotti), and they use digital radiology, an intraoral scanner and 3D planning.\nThey'll study your case at the appointment and give you a no-obligation quote.", c: [CITA_CHIP, Q("¿Precio?", "Price?", "precio implante"), Q("Financiación", "Financing", "financiacion")] },
    { id: "estetica", k: ["estetica", "carilla", "carillas", "blanqueamiento", "blanquear", "dientes blancos", "diseño sonrisa", "sonrisa", "manchas", "resina", "resinas"],
      ke: ["veneers", "veneer", "whitening", "whiten", "white teeth", "smile design", "cosmetic", "aesthetic"],
      a: "Sí, estética dental: carillas, blanqueamiento y diseño de sonrisa (modelan digitalmente la sonrisa a partir de radiografías y fotos). En su web muestran un caso de limpieza y blanqueamiento con peróxido de hidrógeno al 37 % y resinas estéticas hechas en la clínica.\nLa directora clínica, Dra. Karina Temes Rodríguez, lleva prótesis y estética.",
      ae: "Yes, cosmetic dentistry: veneers, whitening and smile design (they model your smile digitally from X-rays and photos). Their website shows a cleaning and whitening case with 37% hydrogen peroxide and aesthetic resins made in the clinic.\nThe clinical director, Dr. Karina Temes Rodríguez, handles prosthetics and aesthetics.", c: [CITA_CHIP, BA] },
    { id: "limpieza", k: ["limpieza", "limpieza bucal", "limpieza dental", "higiene", "revision", "revisiones", "chequeo", "sarro", "empaste", "empastes", "caries", "prevencion", "odontologia general"],
      ke: ["cleaning", "clean", "hygiene", "filling", "fillings", "cavity", "cavities", "general dentistry", "prevention"],
      a: "Sí: odontología general (empastes, prevención e higiene) y limpieza dental, también combinada con blanqueamiento.\nEl precio no está publicado; te lo confirma la clínica.",
      ae: "Yes: general dentistry (fillings, prevention and hygiene) and dental cleaning, also combined with whitening.\nThe price isn't published; the clinic will confirm it.", c: [CITA_CHIP, TEL1] },
    { id: "periodoncia", k: ["periodoncia", "periodontitis", "piorrea", "encia", "encias", "sangran", "sangrado", "gingivitis", "dientes se mueven", "periodoncista"],
      ke: ["gums", "gum", "bleeding", "periodontics", "periodontist", "gingivitis", "periodontitis", "loose teeth"],
      a: "Sí, periodoncia (salud de las encías), con el Dr. Pedro Luis Parés González, periodoncista y cirujano bucal.",
      ae: "Yes, periodontics (gum health), with Dr. Pedro Luis Parés González, periodontist and oral surgeon.", c: [CITA_CHIP] },
    { id: "endodoncia", k: ["endodoncia", "endodoncista", "matar nervio", "nervio", "raiz", "raices", "conducto"],
      ke: ["root canal", "endodontics", "endodontist", "nerve"],
      a: "Sí, endodoncia (tratamiento de raíces), con la Dra. Patricia Pérez Grau, endodoncista.",
      ae: "Yes, root canal treatment (endodontics), with Dr. Patricia Pérez Grau, endodontist.", c: [CITA_CHIP] },
    { id: "protesis", k: ["protesis", "dentadura", "corona", "coronas", "puente", "puentes", "postizo"],
      ke: ["prosthesis", "dentures", "denture", "crown", "crowns", "dental bridge", "bridgework"],  // "bridge" solo se confundía con "bring"
      a: "Sí: prótesis removibles y fijas, coronas y puentes. La directora clínica, Dra. Karina Temes Rodríguez, es la responsable de prótesis y estética.",
      ae: "Yes: removable and fixed prostheses, crowns and bridges. The clinical director, Dr. Karina Temes Rodríguez, is in charge of prosthetics and aesthetics.", c: [CITA_CHIP, Q("Implantes", "Implants", "implantes")] },
    { id: "ninos", k: ["niño", "niños", "nino", "ninos", "hijo", "hija", "hijos", "infantil", "odontopediatria", "pequeño", "bebe", "familia", "familias"],
      ke: ["children", "child", "kids", "kid", "son", "daughter", "family", "families", "pediatric", "paediatric"],
      a: "Sí: para familias cubren todas las necesidades preventivas y tienen servicio de odontopediatría para los más pequeños.",
      ae: "Yes: for families they cover all preventive needs and have a pediatric dentistry service for the little ones.", c: [CITA_CHIP] },
    { id: "miedo", k: ["miedo", "ansiedad", "nervios", "nervioso", "nerviosa", "fobia", "panico"],
      ke: ["fear", "afraid", "scared", "anxiety", "anxious", "nervous", "phobia"],
      a: "Lo tienen muy en cuenta: para pacientes con ansiedad dental «diseñamos un entorno seguro y aplicamos técnicas orientadas a que pierdas el miedo al dentista y disfrutes de una experiencia tranquila».",
      ae: "They take it seriously: for patients with dental anxiety they create a safe environment and use techniques to help you overcome your fear of the dentist and have a calm experience.", c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "urgencia", k: ["urgencia", "urgencias", "urgente", "dolor", "duele muela", "me duele", "emergencia", "flemon", "hinchazon", "infeccion", "se me ha roto", "diente roto", "fractura"],
      ke: ["emergency", "urgent", "pain", "hurts", "toothache", "swelling", "infection", "broken tooth", "chipped", "abscess"],
      a: "Lo siento. En su web explican que dan atención prioritaria a urgencias (dolor de muela, infecciones o fractura dental) y que, cuando es posible, hacen el tratamiento el mismo día.\nLo más rápido: llamar o escribir por WhatsApp al " + C.tel1 + ".\nMientras tanto: tu analgésico habitual, frío por fuera y evita lo muy frío, caliente o dulce. No te automediques con antibióticos.",
      ae: "I'm sorry. Their website explains that they give priority care to emergencies (toothache, infections or a fractured tooth) and, when possible, treat you the same day.\nThe fastest way: call or WhatsApp " + C.tel1 + ".\nMeanwhile: your usual painkiller, a cold compress on the outside, and avoid very cold, hot or sweet food. Don't self-medicate with antibiotics.", urg: true, c: [TEL1, WA, LLAMADA_CHIP] },
    { id: "horario", k: ["horario", "hora abris", "abris", "abierto", "cerrais", "cierra", "a que hora", "tarde", "mediodia", "lunes", "martes", "miercoles", "jueves", "viernes"],
      ke: ["hours", "opening hours", "open", "close", "closing", "what time", "monday", "tuesday", "wednesday", "thursday", "friday", "when"],
      a: function () { return T("Horario publicado:\n", "Published opening hours:\n") + HORARIO_TXT(); }, now: true, c: [CITA_CHIP] },
    { id: "finde", k: ["sabado", "domingo", "fin semana", "festivo", "agosto", "vacaciones"],
      ke: ["saturday", "sunday", "weekend", "holiday", "bank holiday"],
      a: function () { return T("Su horario publicado es de lunes a viernes; sábados, domingos y festivos no aparecen. Te lo confirman en el " + C.tel1 + ".\n\n", "Their published hours are Monday to Friday; Saturdays, Sundays and holidays aren't listed. The clinic can confirm on " + C.tel1 + ".\n\n") + HORARIO_TXT(); }, c: [CITA_CHIP, TEL1] },
    { id: "direccion", k: ["donde", "direccion", "ubicacion", "como llego", "llegar", "metro", "autobus", "bus", "aparcar", "aparcamiento", "parking", "calle", "mapa", "zona", "ruzafa", "russafa", "pedro iii", "mercado"],
      ke: ["where", "address", "location", "directions", "get there", "metro", "bus", "parking", "park", "map", "located"],
      a: "Estamos en " + C.dir + ".\n🚌 Bus: líneas 6, 14, 15, 35 y N9\n🚇 Metro: Xàtiva (líneas 3, 5 y 9) y Russafa (línea 10)\n🅿️ 1 hora gratis de parking en el Mercado de Ruzafa.",
      ae: "The clinic is at " + C.dir + ".\n🚌 Bus: lines 6, 14, 15, 35 and N9\n🚇 Metro: Xàtiva (lines 3, 5 and 9) and Russafa (line 10)\n🅿️ 1 hour of free parking at the Ruzafa Market car park.", c: [MAPS, CITA_CHIP] },
    { id: "contacto", k: ["telefono", "llamar", "numero", "contacto", "email", "correo", "mail", "whatsapp", "wasap", "movil", "hablar persona", "recepcion", "humano", "formulario"],
      ke: ["phone", "telephone", "call", "number", "contact", "email", "e mail", "whatsapp", "mobile", "speak to someone", "human", "person", "reception"],
      a: "Contacto publicado:\n• Teléfono y WhatsApp: " + C.tel1 + "\n• Email: " + C.email + "\nEn su web dicen: «Envíanos por favor un mensaje al WhatsApp " + C.tel1 + " con tu necesidad y en menos de 4 horas te responderemos».",
      ae: "Published contact details:\n• Phone and WhatsApp: " + C.tel1 + "\n• Email: " + C.email + "\nTheir website says that if you send a WhatsApp message to " + C.tel1 + " with what you need, they reply in less than 4 hours.", c: [TEL1, WA, LLAMADA_CHIP] },
    { id: "idioma", k: ["ingles", "habla ingles", "hablais ingles", "english", "idioma", "idiomas", "bilingue", "extranjero", "expatriado"],
      ke: ["english", "speak english", "language", "languages", "bilingual", "spanish", "expat", "expats"],
      a: "Sí: ofrecen atención bilingüe (español/inglés) para facilitar la comunicación con la comunidad internacional de Valencia.\nY yo también te atiendo en inglés: just write to me in English. 🇬🇧",
      ae: "Yes! The clinic offers bilingual care (Spanish/English) for professionals and expats in Valencia, and I can help you in English too. 🇬🇧", c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "equipo", k: ["quien atiende", "doctor", "doctora", "dentista", "dentistas", "odontologo", "odontologos", "experiencia", "opiniones", "equipo", "especialista", "especialistas", "directora"],
      ke: ["doctor", "doctors", "dentist", "dentists", "team", "staff", "experience", "specialist", "specialists", "who"],
      a: "Equipo de especialistas (todos con formación de postgrado en su área):\n• Dra. Karina Temes Rodríguez — directora clínica, prótesis y estética\n• Dra. Rita Faria Lavado — ortodoncista\n• Dra. Kiara Núñez Tolotti — ortodoncista y cirujana bucal\n• Dra. Patricia Pérez Grau — endodoncista\n• Dra. Lorena Fernandes Ciaccia — cirujana oral y maxilofacial\n• Dr. Pedro Luis Parés González — periodoncista y cirujano bucal\nEn su web cuentan más de 19 años de experiencia clínica y más de 10.000 pacientes tratados; abrieron en 2016.",
      ae: "Team of specialists (all with postgraduate training in their field):\n• Dr. Karina Temes Rodríguez — clinical director, prosthetics and aesthetics\n• Dr. Rita Faria Lavado — orthodontist\n• Dr. Kiara Núñez Tolotti — orthodontist and oral surgeon\n• Dr. Patricia Pérez Grau — endodontist\n• Dr. Lorena Fernandes Ciaccia — oral and maxillofacial surgeon\n• Dr. Pedro Luis Parés González — periodontist and oral surgeon\nThey are a group of dentists from Valencia and Venezuela who started the clinic in 2016 and have treated more than 10,000 patients.", c: [CITA_CHIP] },
    { id: "digital", k: ["digital", "tecnologia", "escaner", "escaner intraoral", "tac", "3d", "moderno", "equipos", "radiografia", "rayos"],
      ke: ["technology", "scanner", "intraoral", "3d", "digital", "x ray", "xray", "equipment"],
      a: "Trabajan con radiología digital, escáner intraoral y planificación 3D «para garantizar la máxima precisión en cada procedimiento».",
      ae: "They use digital radiology, an intraoral scanner and 3D planning to ensure maximum precision in every procedure.", c: [CITA_CHIP] },
    { id: "antesdespues", k: ["antes despues", "antes y despues", "casos", "fotos", "resultados"],
      ke: ["before after", "before and after", "cases", "photos", "results"],
      a: "En su web tienen casos de antes y después: un diseño de sonrisa (modelado digital y corrección del desgaste) y una limpieza con blanqueamiento y resinas estéticas.",
      ae: "Their website shows before-and-after cases: a smile design (digital modelling and wear correction) and a cleaning with whitening and aesthetic resins.", c: [BA, CITA_CHIP] },
    { id: "garantia", k: ["garantia", "garantias"], ke: ["guarantee", "warranty"],
      a: "En su web hablan de «amplias garantías en nuestros tratamientos»; el detalle de cada tratamiento te lo explican con el presupuesto.",
      ae: "Their website mentions comprehensive guarantees on their treatments; the details for each treatment are explained with your quote.", c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "seguros", k: ["seguro", "mutua", "adeslas", "sanitas", "dkv", "asisa", "mapfre", "aseguradora", "poliza", "seguridad social"],
      ke: ["insurance", "insurer", "covered", "health insurance", "dental plan"],
      a: "Su web no dice si trabajan con mutuas o seguros dentales. Te lo confirman en un momento por teléfono o WhatsApp, o dejas tu número y te llaman.",
      ae: "Their website doesn't say whether they work with insurance companies. They can confirm it quickly by phone or WhatsApp, or leave your number and they'll call you.", c: [TEL1, WA, LLAMADA_CHIP] },
    { id: "gracias", k: ["gracias", "vale gracias", "perfecto", "genial", "adios", "hasta luego"], ke: ["thanks", "thank", "great", "perfect", "bye", "goodbye", "cheers"],
      a: "¡A ti! Si necesitas algo más, aquí estoy. 😊", ae: "You're welcome! If you need anything else, I'm here. 😊", c: [CITA_CHIP] }
  ];
  var CITA_K = ["pedir cita", "cita", "reservar", "reserva", "agendar", "pedir hora", "hueco", "turno", "apuntarme", "citarme", "coger cita",
    "appointment", "book", "booking", "schedule", "make appointment", "see dentist"];

  function bestIntent(text) {
    var ut = toks(text), best = null, bs = 0;
    if (!ut.length) return null;
    KB.forEach(function (e) {
      var s = 0; e.k.concat(e.ke || []).forEach(function (ph) { s = Math.max(s, phraseScore(ph, ut)); });
      if (s > bs) { bs = s; best = e; }
    });
    return bs > 0 ? { e: best, s: bs } : null;
  }
  function isPriceQ(n) { return /\b(precio|precios|cuesta|cuestan|cuanto vale|cuanto valen|coste|tarifa|tarifas|€|euros|caro|barato|price|prices|cost|costs|how much|fee|fees|expensive|cheap)\b/.test(n); }
  function wantsCita(n) { var ut = toks(n); return CITA_K.some(function (ph) { return phraseScore(ph, ut) > 0; }); }
  function byId(id) { return KB.filter(function (e) { return e.id === id; })[0]; }
  function mk(c) { return typeof c === "function" ? c() : c; }

  var body, input, status, panel, launch, opened = false;
  var flow = null;

  function el(tag, cls, html) { var x = document.createElement(tag); if (cls) x.className = cls; if (html != null) x.innerHTML = html; return x; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function scroll() { body.scrollTop = body.scrollHeight; }
  function addUser(t) { var m = el("div", "r24-msg r24-user"); m.textContent = t; body.appendChild(m); scroll(); }
  function addBot(t, chips, cls) {
    var ty = el("div", "r24-typing", T("Escribiendo…", "Typing…")); body.appendChild(ty); scroll();
    chips = (chips || []).map(mk);
    setTimeout(function () {
      ty.remove();
      var m = el("div", "r24-msg r24-bot" + (cls ? " " + cls : ""), esc(t).replace(/\b(622 485 781)\b/g, function (x) {
        return '<a href="tel:+34' + x.replace(/\s/g, "") + '">' + x + "</a>";
      }));
      body.appendChild(m);
      if (chips.length) {
        var w = el("div", "r24-chips");
        chips.forEach(function (c) {
          var b;
          if (c.tel) { b = el("a", "r24-chip", "📞 " + esc(c.t)); b.href = "tel:" + c.tel; }
          else if (c.url) { b = el("a", "r24-chip" + (c.wa ? " r24-wa" : ""), esc(c.t)); b.href = c.url; b.target = "_blank"; b.rel = "noopener"; }
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
    if (isOpen(n)) { status.className = "r24-status"; status.textContent = T("🟢 Abierto ahora · hasta las ", "🟢 Open now · until ") + hhmm(closeAt(n)) + " · " + C.tel1; }
    else { status.className = "r24-status r24-closed"; status.textContent = T("🌙 Fuera del horario publicado (abre ", "🌙 Outside published hours (opens ") + nextOpening(n) + T("). Te atiendo igual y dejo tu cita solicitada.", "). I'll still help you and leave your request ready."); }
  }
  function closedNote() { var n = madridNow(); return isOpen(n) ? "" : T("\n\nℹ️ Ahora mismo la clínica está fuera de horario; abre ", "\n\nℹ️ The clinic is outside opening hours right now; it opens ") + nextOpening(n) + "."; }
  function setLang(l) {
    if (!l || l === LANG) return; LANG = l;
    if (!panel) return;
    input.placeholder = T("Escribe tu pregunta…", "Type your question…");
    panel.querySelector(".r24-legal").textContent = T("Asistente automático de demostración · tus datos no se envían a ningún sitio", "Automated demo assistant · your data is not sent anywhere");
    panel.querySelector(".r24-send").textContent = T("Enviar", "Send");
    panel.querySelector(".r24-online").textContent = T("● en línea", "● online");
    statusText();
  }

  function build() {
    var base = window.R24_BASE || "recepcion/";
    var css = document.createElement("link"); css.rel = "stylesheet"; css.href = base + "recepcion.css"; document.head.appendChild(css);
    var ban = el("div", "r24-demo-banner", T("Demo privada preparada para Clínica Dental Ruzafa", "Private demo prepared for Clínica Dental Ruzafa")); ban.setAttribute("role", "note"); document.body.appendChild(ban);
    launch = el("button", "r24-launch", '<img class="r24-face" src="' + base + 'avatar.svg" alt="' + T("Recepcionista", "Receptionist") + '"><span>' + T("Recepción 24 h", "24 h Reception") + '</span><span class="r24-dot"></span>');
    launch.type = "button"; launch.setAttribute("aria-label", T("Abrir la recepción 24 h", "Open the 24 h reception")); document.body.appendChild(launch);
    panel = el("div", "r24-panel"); panel.setAttribute("role", "dialog"); panel.setAttribute("aria-label", T("Recepción 24 h", "24 h Reception"));
    panel.innerHTML = '<div class="r24-head"><div class="r24-av"><img class="r24-face" src="' + base + 'avatar.svg" alt="' + T("Recepcionista", "Receptionist") + '"></div><div class="r24-ht"><b>' + T("Recepción 24 h", "24 h Reception") + ' <span class="r24-online">' + T("● en línea", "● online") + '</span></b><small>Clínica Dental Ruzafa · Valencia · ES / EN</small></div><button class="r24-x" type="button" aria-label="' + T("Cerrar", "Close") + '">×</button></div><div class="r24-status"></div><div class="r24-body" aria-live="polite"></div><form class="r24-foot"><input class="r24-in" type="text" placeholder="' + T("Escribe tu pregunta…", "Type your question…") + '" autocomplete="off" maxlength="300"><button class="r24-send" type="submit">' + T("Enviar", "Send") + '</button></form><div class="r24-legal">' + T("Asistente automático de demostración · tus datos no se envían a ningún sitio", "Automated demo assistant · your data is not sent anywhere") + '</div>';
    document.body.appendChild(panel);
    body = panel.querySelector(".r24-body"); input = panel.querySelector(".r24-in"); status = panel.querySelector(".r24-status");
    launch.onclick = open;
    panel.querySelector(".r24-x").onclick = function () { panel.classList.remove("r24-open"); launch.classList.remove("r24-hide"); document.documentElement.classList.remove("r24-panel-open"); };
    panel.querySelector("form").onsubmit = function (ev) { ev.preventDefault(); ev.stopImmediatePropagation(); var t = input.value.trim(); if (!t) return; input.value = ""; handle(t); };
    document.addEventListener("click", function (ev) {
      var a = ev.target.closest && ev.target.closest("[data-r24-open]"); if (a) { ev.preventDefault(); ev.stopPropagation(); open(); }
    }, true);
  }
  function open() {
    panel.classList.add("r24-open"); launch.classList.add("r24-hide"); document.documentElement.classList.add("r24-panel-open"); document.body.classList.remove("navigation-open"); statusText();
    if (!opened) {
      opened = true;
      addBot(T("¡Hola! 👋 Soy la recepción virtual de Clínica Dental Ruzafa, en pleno barrio de Ruzafa. Te ayudo a pedir cita y con dudas de tratamientos, financiación, horario o cómo llegar.\nYou can also write to me in English. 🇬🇧\n¿En qué te ayudo?",
        "Hi! 👋 I'm the virtual receptionist of Clínica Dental Ruzafa, in the heart of Ruzafa (Valencia). I can help you book an appointment and answer questions about treatments, financing, opening hours or how to get here.\nTambién puedes escribirme en español. 🇪🇸\nHow can I help?"),
        LANG === "en" ? [CITA_CHIP, Q("Invisible aligners (Alinea)", "Invisible aligners (Alinea)", "invisible aligners"), Q("Opening hours", "Opening hours", "opening hours"), Q("Dental emergency", "Dental emergency", "dental emergency"), LLAMADA_CHIP]
          : [CITA_CHIP, Q("Ortodoncia invisible Alinea", "", "ortodoncia invisible alinea"), Q("Financiación 0 %", "", "financiacion"), Q("Horario", "", "horario"), LLAMADA_CHIP]);
    }
    setTimeout(function () { input.focus(); }, 50);
  }

  // Motivos = servicios publicados en su web
  function TRAT() { return LANG === "en"
    ? ["Check-up / cleaning", "Invisible aligners (Alinea)", "Braces", "Implants / surgery", "Cosmetic (veneers, whitening)", "Root canal", "Gums (periodontics)", "Prosthesis / crowns", "For a child", "Pain / emergency", "Other"]
    : ["Revisión / limpieza", "Ortodoncia invisible (Alinea)", "Ortodoncia con brackets", "Implantes / cirugía", "Estética (carillas, blanqueamiento)", "Endodoncia", "Periodoncia (encías)", "Prótesis / coronas", "Para un niño/a", "Dolor / urgencia", "Otro"]; }
  function startCita() {
    flow = { step: "nombre", d: {} };
    addBot(T("¡Perfecto! Te ayudo a pedir cita en unos pasos; en la consulta te hacen un estudio y presupuesto sin compromiso.\n¿Cómo te llamas? (Escribe «cancelar» si quieres salir.)",
      "Great! I'll help you request an appointment in a few steps; at the appointment they'll study your case and give you a no-obligation quote.\nWhat's your name? (Type \"cancel\" to exit.)"));
  }
  function startLlamada() {
    flow = { step: "nombre", d: { tipo: "llamada", consulta: (lastQ || T("Consulta general", "General enquiry")).slice(0, 120) } };
    addBot(T("¡Claro! Te llama una persona del equipo de la clínica. Solo necesito dos datos.\n¿Cómo te llamas? (Escribe «cancelar» si quieres salir.)",
      "Of course! Someone from the clinic team will call you. I just need two details.\nWhat's your name? (Type \"cancel\" to exit.)"));
  }
  function ask(step) {
    flow.step = step;
    var n = madridNow();
    if (step === "tratamiento") addBot(T("Encantados, " + flow.d.nombre + ". ¿Cuál es el motivo de la cita?", "Nice to meet you, " + flow.d.nombre + ". What's the reason for your visit?"), TRAT().map(function (t) { return { t: t, v: t, flow: true }; }));
    else if (step === "dia") addBot(T("¿Qué día te viene mejor? Atienden de lunes a jueves de 10:00 a 14:00 y de 16:00 a 20:00, y los viernes de 9:30 a 18:00.", "Which day suits you best? They're open Monday to Thursday 10:00–14:00 and 16:00–20:00, and Friday 9:30–18:00."),
      nextWorkdays(n, 5).map(function (x) { return { t: x.label, v: x.label, flow: true }; }).concat([{ t: T("Lo antes posible", "As soon as possible"), v: T("Lo antes posible", "As soon as possible"), flow: true }]));
    else if (step === "franja") addBot(T("¿En qué franja?", "Morning or afternoon?"), LANG === "en"
      ? [{ t: "Morning (from 10:00; Fri from 9:30)", v: "Morning", flow: true }, { t: "Afternoon (16:00–20:00; Fri until 18:00)", v: "Afternoon", flow: true }, { t: "Either is fine", v: "Morning or afternoon, either", flow: true }]
      : [{ t: "Mañana (desde las 10:00; V desde 9:30)", v: "Mañana", flow: true }, { t: "Tarde (16:00–20:00; V hasta 18:00)", v: "Tarde", flow: true }, { t: "Me da igual", v: "Mañana o tarde, indiferente", flow: true }]);
    else if (step === "telefono") addBot(flow.d.tipo === "llamada" ? T("Perfecto, " + flow.d.nombre + ". ¿A qué teléfono te llaman?", "Perfect, " + flow.d.nombre + ". Which phone number should they call?") : T("Último paso: ¿a qué teléfono te llamamos para confirmarte la cita?", "Last step: which phone number should they call to confirm your appointment?"));
    else if (step === "resumen") {
      var d = flow.d, B = [{ t: T("✅ Confirmar", "✅ Confirm"), v: "__ok", flow: true }, { t: T("✏️ Corregir", "✏️ Edit"), v: "__fix", flow: true }, { t: T("Cancelar", "Cancel"), v: "cancelar", flow: true }];
      if (d.tipo === "llamada") { addBot(T("Revisa tu solicitud de llamada:\n👤 Nombre: ", "Please check your call-back request:\n👤 Name: ") + d.nombre + T("\n💬 Consulta: ", "\n💬 Enquiry: ") + d.consulta + T("\n📱 Teléfono: ", "\n📱 Phone: ") + d.telefono + "\n\n" + AVISO() + T("\n\n¿Lo confirmo?", "\n\nShall I confirm it?"), B, "r24-sum"); return; }
      addBot(T("Revisa tu solicitud:\n👤 Nombre: ", "Please check your request:\n👤 Name: ") + d.nombre + T("\n🦷 Motivo: ", "\n🦷 Reason: ") + d.tratamiento + T("\n📅 Día: ", "\n📅 Day: ") + d.dia + T("\n🕐 Franja: ", "\n🕐 Time: ") + d.franja + T("\n📱 Teléfono: ", "\n📱 Phone: ") + d.telefono + "\n\n" + AVISO() + T("\n\n¿Lo confirmo?", "\n\nShall I confirm it?"), B, "r24-sum");
    }
  }
  function flowInput(t) {
    var n = norm(t), d = flow.d;
    if (/^(cancelar|cancela|salir|dejalo|olvidalo|cancel|exit|quit|stop)$/.test(n)) { flow = null; addBot(T("Sin problema, he cancelado la solicitud. ¿Te ayudo con otra cosa?", "No problem, I've cancelled the request. Can I help with anything else?"), [CITA_CHIP]); return; }
    if (/\?/.test(t) && flow.step !== "resumen") {
      var bi = bestIntent(t);
      if (bi && bi.s >= 1) { reply(bi.e, t); setTimeout(function () { ask(flow.step); }, 700); return; }
    }
    switch (flow.step) {
      case "nombre":
        var nm = t.replace(/^(me llamo|soy|mi nombre es|my name is|i am|i'm|im|this is)\s+/i, "").trim();
        if (nm.length < 2 || nm.length > 60 || /\d/.test(nm)) { addBot(T("¿Me dices tu nombre, por favor? (solo el nombre, sin números)", "Could you tell me your name, please? (just your name, no numbers)")); return; }
        d.nombre = nm.split(/\s+/).map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join(" ");
        if (d.tipo === "llamada") { ask("telefono"); return; } ask("tratamiento"); return;
      case "tratamiento":
        d.tratamiento = t.slice(0, 80);
        if (/urgen|dolor|pain|emergenc/.test(n)) {
          var op = isOpen(madridNow());
          addBot(T("Si te duele, lo más rápido es llamar o escribir por WhatsApp al " + C.tel1 + (op ? " ahora mismo" : " (abren " + nextOpening(madridNow()) + ")") + ": dan atención prioritaria a urgencias. Aun así, dejo tu solicitud preparada.",
            "If you're in pain, the fastest way is to call or WhatsApp " + C.tel1 + (op ? " right now" : " (they open " + nextOpening(madridNow()) + ")") + ": they give priority care to emergencies. I'll still prepare your request."), [TEL1, WA]);
          setTimeout(function () { ask("dia"); }, 900); return;
        }
        ask("dia"); return;
      case "dia":
        if (/sabado|domingo|saturday|sunday|weekend|fin de semana/.test(n)) { addBot(T("Su horario publicado es solo de lunes a viernes. ¿Te viene bien alguno de esos días?", "Their published hours are Monday to Friday only. Would one of those days work for you?")); setTimeout(function () { ask("dia"); }, 500); return; }
        d.dia = t.slice(0, 60); ask("franja"); return;
      case "franja":
        if (/noche|\b(21|22|23)\b|madrugada|night|midnight/.test(n)) { addBot(T("Por la noche no atienden: de lunes a jueves cierran a las 20:00 y el viernes a las 18:00. ¿Mañana o tarde?", "They're not open at night: Monday to Thursday they close at 20:00 and on Friday at 18:00. Morning or afternoon?")); setTimeout(function () { ask("franja"); }, 500); return; }
        if (/mediodia|comer|lunch|\b(14|15)\b/.test(n)) { addBot(T("De lunes a jueves cierran de 14:00 a 16:00; el viernes abren de 9:30 a 18:00. ¿Mañana o tarde?", "Monday to Thursday they close from 14:00 to 16:00; on Friday they're open 9:30–18:00. Morning or afternoon?")); setTimeout(function () { ask("franja"); }, 500); return; }
        d.franja = t.slice(0, 60); ask("telefono"); return;
      case "telefono":
        var ph = t.replace(/[\s().-]/g, "").replace(/^00/, "+");
        if (/^(\+34)?[6789]\d{8}$/.test(ph)) { var dg = ph.replace(/^\+34/, ""); d.telefono = dg.slice(0, 3) + " " + dg.slice(3, 6) + " " + dg.slice(6); ask("resumen"); return; }
        if (/^\+(?!34)\d{8,15}$/.test(ph)) { d.telefono = ph; ask("resumen"); return; }
        addBot(T("Ese número no me cuadra. Escríbelo con 9 cifras, por ejemplo 612 345 678 (o con prefijo, +44…).", "That number doesn't look right. Please type it with 9 digits, e.g. 612 345 678 (or with the country code, e.g. +44…).")); return;
      case "resumen":
        if (t === "__ok" || /^(si|vale|ok|confirmo|confirmar|correcto|yes|yep|sure|confirm)/.test(n)) {
          var nm2 = d.nombre.split(" ")[0];
          if (d.tipo === "llamada") { addBot(T("¡Listo, " + nm2 + "! ✅ El equipo de la clínica recibe tu pedido al instante y te llama al " + d.telefono + "." + closedNote() + "\n\n(Versión de demostración: esta solicitud no se ha enviado a la clínica.)",
            "Done, " + nm2 + "! ✅ The clinic team receives your request instantly and will call you on " + d.telefono + "." + closedNote() + "\n\n(Demo version: this request has not been sent to the clinic.)"), [CITA_CHIP, { t: T("Otra pregunta", "Another question"), q: "__menu" }]); flow = null; return; }
          addBot(T("¡Listo, " + nm2 + "! ✅ Tu solicitud de cita está registrada.\nLa recepción te llamará al " + d.telefono + " para confirmarte el hueco exacto." + closedNote() + "\n\nSi prefieres adelantarte, puedes llamar o escribir por WhatsApp al " + C.tel1 + ".\n\n(Versión de demostración: esta solicitud no se ha enviado a la clínica.)",
            "Done, " + nm2 + "! ✅ Your appointment request has been registered.\nReception will call you on " + d.telefono + " to confirm the exact time." + closedNote() + "\n\nIf you'd rather not wait, you can call or WhatsApp " + C.tel1 + ".\n\n(Demo version: this request has not been sent to the clinic.)"), [{ t: T("Cómo llegar", "How to get here"), q: T("dirección", "address") }, { t: T("Otra pregunta", "Another question"), q: "__menu" }]);
          flow = null; return;
        }
        if (t === "__fix" || /corregir|cambiar|^no\b|change|edit|wrong/.test(n)) { flow.d = d.tipo === "llamada" ? { tipo: "llamada", consulta: d.consulta } : {}; addBot(T("Vale, empezamos de nuevo. ¿Cómo te llamas?", "OK, let's start again. What's your name?")); flow.step = "nombre"; return; }
        ask("resumen"); return;
    }
  }
  function reply(e, raw) {
    var t = typeof e.a === "function" ? e.a() : (LANG === "en" && e.ae ? e.ae : e.a);
    if (e.id === "horario" || e.id === "finde") {
      var nr = norm(raw || ""), dn = [["domingo", "sunday"], ["lunes", "monday"], ["martes", "tuesday"], ["miercoles", "wednesday"], ["jueves", "thursday"], ["viernes", "friday"], ["sabado", "saturday"]];
      for (var di = 0; di < 7; di++) if (nr.indexOf(dn[di][0]) >= 0 || nr.indexOf(dn[di][1]) >= 0) {
        if (di === 0 || di === 6) t = T("El " + dia(di) + " no figura en su horario publicado (es de lunes a viernes); te lo confirman en el " + C.tel1 + ".", dia(di) + " isn't in their published hours (Monday to Friday); the clinic can confirm on " + C.tel1 + ".");
        else if (di === 5) t = T("El viernes abren de 9:30 a 18:00.", "On Friday they're open from 9:30 to 18:00.");
        else t = T("El " + dia(di) + " abren de 10:00 a 14:00 y de 16:00 a 20:00 (cierran de 14:00 a 16:00).", "On " + dia(di) + " they're open 10:00–14:00 and 16:00–20:00 (closed 14:00–16:00).");
        t += T("\n\nHorario completo:\n", "\n\nFull opening hours:\n") + HORARIO_TXT(); break;
      }
    }
    if (e.now) { var n = madridNow(); t += isOpen(n) ? T("\n\n🟢 Ahora mismo la clínica está abierta: ", "\n\n🟢 The clinic is open right now: ") + C.tel1 + "." : T("\n\n🌙 Ahora mismo está fuera de horario; abre ", "\n\n🌙 It's outside opening hours right now; it opens ") + nextOpening(n) + "."; }
    if (e.urg && !isOpen(madridNow())) t += T("\n\n🌙 Ahora la clínica está fuera de horario (abre " + nextOpening(madridNow()) + "): escríbeles por WhatsApp o deja tu teléfono y te llaman. Si es grave —traumatismo fuerte o hinchazón que dificulta tragar o respirar— no esperes: llama al 112.",
      "\n\n🌙 The clinic is closed right now (opens " + nextOpening(madridNow()) + "): send them a WhatsApp or leave your number and they'll call you. If it's serious — a strong blow or swelling that makes it hard to swallow or breathe — don't wait: call 112.");
    addBot(t, (e.c || []).map(function (c) { c = mk(c); return c.q ? { t: c.t, v: c.q } : c; }));
  }
  function fallback() {
    addBot(T("Eso te lo confirma mejor el equipo de la clínica, así tienes el dato exacto. 😊\nLlámales o escríbeles por WhatsApp al " + C.tel1 + " (" + HORARIO_CORTO() + "; por WhatsApp dicen responder en menos de 4 horas), o deja tu teléfono y te llaman ellos.",
      "The clinic team can give you the exact answer on that. 😊\nCall or WhatsApp them on " + C.tel1 + " (" + HORARIO_CORTO() + "; they say they reply to WhatsApp in under 4 hours), or leave your number and they'll call you.") + closedNote(), [TEL1, WA, LLAMADA_CHIP]);
  }
  function handle(t, chip) {
    if (t === "__menu") { addBot(T("Claro, ¿qué más quieres saber?", "Sure, what else would you like to know?"), [CITA_CHIP, Q("Horario", "Opening hours", T("horario", "opening hours")), Q("Tratamientos", "Treatments", T("tratamientos", "treatments")), Q("Cómo llegar", "How to get here", T("dirección", "address"))]); return; }
    addUser(chip ? chip.t : t);
    if (flow) { flowInput(chip && chip.v ? chip.v : t); return; }
    if (!chip) setLang(detectLang(t));
    if (chip && chip.a === "cita") { startCita(); return; }
    if (chip && chip.a === "llamada") { startLlamada(); return; }
    var n = norm(t);
    if (/^(hola|buenas|buenos dias|buenas tardes|hey|hello|hi|good morning|good afternoon)\b/.test(n) && n.split(" ").length <= 3) { addBot(T("¡Hola! ¿En qué te puedo ayudar? Puedo pedirte cita o contarte tratamientos, horario y cómo llegar.", "Hi! How can I help? I can request an appointment for you or tell you about treatments, opening hours and how to get here."), [CITA_CHIP, Q("Horario", "Opening hours", T("horario", "opening hours")), Q("Tratamientos", "Treatments", T("tratamientos", "treatments")), LLAMADA_CHIP]); return; }
    if (/^tratamientos?$|que tratamientos|que haceis|servicios|especialidades|^treatments?$|what treatments|services|what do you do/.test(n)) {
      addBot(T("Trabajan todas las especialidades en un solo lugar:\n• Estética dental (carillas y blanqueamiento)\n• Ortodoncia metálica e invisible (su marca Alinea)\n• Odontología general (empastes, prevención e higiene)\n• Periodoncia (encías)\n• Endodoncia (raíces)\n• Prótesis removibles y fijas, coronas y puentes\n• Cirugía e implantes\n• Odontopediatría y urgencias dentales\n¿Sobre cuál quieres saber más?",
        "They cover all specialties in one place:\n• Cosmetic dentistry (veneers and whitening)\n• Metal and invisible orthodontics (their own Alinea brand)\n• General dentistry (fillings, prevention and hygiene)\n• Periodontics (gums)\n• Root canals\n• Removable and fixed prostheses, crowns and bridges\n• Surgery and implants\n• Pediatric dentistry and dental emergencies\nWhich one would you like to know more about?"),
        [Q("Ortodoncia invisible", "Invisible aligners", T("ortodoncia invisible", "invisible aligners")), Q("Implantes", "Implants", T("implantes", "implants")), Q("Estética", "Cosmetic", T("estetica", "whitening veneers")), CITA_CHIP]); return; }
    var bi = bestIntent(t);
    var price = isPriceQ(n);
    if (wantsCita(n) && !price && !/sin coste|gratis|gratuit|primera|free|first/.test(n) && (!bi || bi.s < 2 || /cita|reserv|agendar|appointment|book/.test(n))) { startCita(); return; }
    if (price) {
      if (/gratis|gratuit|primera|sin coste|valoracion|presupuesto|free|first|quote/.test(n)) { reply(byId("valoracion"), t); return; }
      if (/financ|plazo|mes|pago|cuota|instal|monthly/.test(n)) { reply(byId("financiacion"), t); return; }
      reply(byId("precio"), t); return;
    }
    if (bi) { reply(bi.e, t); return; }
    lastQ = t; fallback();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build); else build();
  window.R24 = { open: open, _test: { bestIntent: bestIntent, norm: norm, isOpen: isOpen, madridNow: madridNow, detectLang: detectLang, lang: function () { return LANG; } } };
})();
