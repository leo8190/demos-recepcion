/* R24-HUMANO-1018 */
/* R24-BRIEF-1018: avatar humano, botones rápidos, "que me llamen", aviso al equipo, sin "no tengo ese dato" */
/* Recepción 24 h · Clínica Dental El Porvenir (Sevilla, C/ Bogotá 25) — DEMO privada.
   100% del lado del cliente: sin APIs, sin claves, sin envío de datos.
   Todas las respuestas salen de lo que publica clinicadentalelporvenir.com (oct. 2026): Inicio, Profesionales, Tratamientos,
   Instalaciones, Contacto y el modal «Promociones de este mes».
   Trato de «usted», como los textos principales de su web («nos importa su salud bucodental», «le asistirán», «Pida información»).
   Horario publicado en la cabecera: L–V 10:00–14:00 y 17:00–21:00 (sábado y domingo no figuran).
   Contacto publicado: tel. 955 524 724, clinicadentalelporvenir@gmail.com y Facebook (facebook.com/ClinicaDentalElPorvenir).
   No publican WhatsApp: no se inventa. Tampoco precios (su web dice que se piden por teléfono, mail o Facebook), mutuas,
   aparcamiento, servicio de urgencias, sedación, Invisalign ni que la 1ª visita sea gratis. La promoción del mes se cita sin cifra. */
(function () {
  "use strict";
  var C = {
    nombre: "Clínica Dental El Porvenir",
    tel: "955 524 724", telh: "+34955524724",
    email: "clinicadentalelporvenir@gmail.com",
    dir: "C/ Bogotá nº 25, Local 4, 41013 Sevilla",
    fb: "https://www.facebook.com/ClinicaDentalElPorvenir/",
    maps: "https://www.google.com/maps/search/?api=1&query=Cl%C3%ADnica+Dental+El+Porvenir+Calle+Bogot%C3%A1+25+41013+Sevilla"
  };
  // Horario (cabecera de su web). 0 = domingo. Minutos desde las 0:00.
  var LV = [[600, 840], [1020, 1260]];
  var H = { 1: LV, 2: LV, 3: LV, 4: LV, 5: LV, 0: [], 6: [] };
  var DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
  var MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  var HORARIO_TXT = "Horario que publica la clínica:\n• Lunes a viernes: 10:00–14:00 y 17:00–21:00\nSábados y domingos no figuran en su horario.";

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

  var STOP = "a al algo algun alguna como con cual cuales de del el en es esta este esto estoy hay la las lo los me mi mis o os para pero por que quiero se si sin su sus te tu tus un una uno unos y ya yo usted ustedes vosotros vuestra vuestro hacer haceis hacen teneis tienen tiene puedo podeis pueden podria saber gustaria hola buenas buenos dias tardes noches favor".split(" ");
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
  var MAPS = { t: "Google Maps", url: C.maps };
  var FB = { t: "Su Facebook", url: C.fb };
  function Q(t, q) { return { t: t, q: q || t }; }
  function horarioA() {
    var n = madridNow();
    return HORARIO_TXT + "\n\n" + (isOpen(n) ? "🟢 Ahora mismo están en horario (hasta las " + hhmm(closeAt(n)) + "): " + C.tel + "."
      : "🌙 Ahora mismo la clínica está cerrada (vuelven " + nextOpening(n) + "). Yo le atiendo igual: déjeme su cita o su «que me llamen» y el equipo lo tiene al abrir.");
  }
  var PRECIOS_TXT = "Su web no publica precios: indica que la información de precios y promociones se pide en la clínica, por teléfono (" + C.tel + "), por email (" + C.email + ") o por Facebook.";

  var KB = [
    { id: "primera", k: ["primera visita", "primera cita", "primera consulta", "primera vez", "valoracion", "revision", "revisar", "chequeo", "diagnostico", "presupuesto", "segunda opinion", "nuevo paciente"],
      a: "Para una primera visita o una revisión le pido la cita ahora mismo: me dice el motivo y el día que le viene bien, y el equipo le llama para confirmarle la hora. Su web no detalla en qué consiste la primera visita; eso se lo explican al llamarle.", c: [CITA_CHIP, Q("Financiación", "financiación"), LLAMADA_CHIP] },
    { id: "gratis", k: ["gratis", "gratuita", "gratuito", "sin coste", "cuesta primera visita", "cobran primera"],
      a: "Su web no dice si la primera visita tiene coste, así que no se lo voy a asegurar. Pregúntelo al pedir la cita o llamando al " + C.tel + "; si prefiere, deje su teléfono y le llaman.", c: [CITA_CHIP, TEL, LLAMADA_CHIP] },
    { id: "financiacion", k: ["financiacion", "financian", "financiais", "financiar", "plazos", "pagar a plazos", "cuotas", "al mes", "mensual", "mensualidades", "pago aplazado", "facilidades pago", "formas pago", "intereses"],
      a: "Sí: su web anuncia financiación sin intereses; en la página de Tratamientos indica «financiación 18 meses sin intereses». Las condiciones para su tratamiento se las explica el equipo.", c: [CITA_CHIP, Q("Promociones del mes", "promociones"), LLAMADA_CHIP] },
    { id: "promo", k: ["promocion", "promociones", "oferta", "ofertas", "descuento", "descuentos", "promo", "promociones del mes"],
      a: "En su web, en «Promociones de este mes», aparece una promoción de limpieza + blanqueamiento en clínica + tratamiento domiciliario (bajo prescripción del especialista). Para saber si sigue vigente y sus condiciones, pregúntelo en la clínica: " + C.tel + ", " + C.email + " o Facebook. ¿Quiere que le llamen para informarle?", c: [LLAMADA_CHIP, TEL, FB, CITA_CHIP] },
    { id: "precio", k: ["precio", "precios", "tarifa", "tarifas", "cuanto cuesta", "cuanto vale", "caro", "barato"],
      a: PRECIOS_TXT + " Prefiero no darle una cifra a ojo: depende de cada caso. Puede financiar sin intereses (hasta 18 meses, según su web). Si quiere, deje su teléfono y le llaman para informarle.", c: [LLAMADA_CHIP, TEL, CITA_CHIP] },
    { id: "implantes", k: ["implante", "implantes", "implantologia", "dientes fijos", "falta diente", "perdido diente", "reponer diente", "tercera denticion"],
      a: "Sí: la implantología es una de sus especialidades («Expertos en implantes», dice su web). Gracias a los implantes, las personas con ausencias dentarias pueden optar a lo que se conoce como «la tercera dentición». El Dr. Emilio López de Francisco tiene un Máster en Cirugía e Implantes. Cómo sería en su caso se lo explican en consulta.", c: [CITA_CHIP, Q("¿Precio?", "precio implante"), LLAMADA_CHIP] },
    { id: "periodoncia", k: ["periodoncia", "periodontitis", "piorrea", "encia", "encias", "sangran", "sangrado", "gingivitis", "dientes se mueven"],
      a: "Sí: hacen periodoncia, el tratamiento de las enfermedades que afectan a las encías y a los tejidos de soporte de los dientes. El Dr. Emilio López de Francisco es experto en Endodoncia y Periodoncia.", c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "endodoncia", k: ["endodoncia", "matar nervio", "nervio", "conductos", "desvitalizar"],
      a: "Sí: hacen endodoncia, la técnica que elimina el tejido inflamado o necrótico del interior del diente que causa dolor o infección. El Dr. Emilio López de Francisco es experto en Endodoncia.", c: [CITA_CHIP, URG_CHIP] },
    { id: "blanqueamiento", k: ["blanqueamiento", "blanquear", "dientes blancos", "manchas", "amarillos"],
      a: "Sí: el blanqueamiento en clínica con tratamiento domiciliario (bajo prescripción del especialista) aparece en sus «Promociones de este mes», junto con una limpieza. Si sigue vigente y sus condiciones se lo confirman en la clínica.", c: [CITA_CHIP, Q("Promociones del mes", "promociones"), LLAMADA_CHIP] },
    { id: "estetica", k: ["estetica", "carilla", "carillas", "corona", "coronas", "puente", "puentes", "funda", "protesis", "dentadura", "sonrisa"],
      a: "Hacen estética dental: según su web, hoy se puede tener una boca, además de sana, bonita, con distintas técnicas y tratamientos. No detalla cuáles (carillas, coronas…), así que se lo concreta el equipo en consulta.", c: [CITA_CHIP, Q("Blanqueamiento", "blanqueamiento")] },
    { id: "invisalign", k: ["invisalign", "alineador", "alineadores", "ortodoncia invisible", "invisible", "transparente"],
      a: "Hacen ortodoncia, pero su web no menciona Invisalign ni alineadores en concreto, así que no se lo voy a asegurar. Se lo confirma el equipo: llame al " + C.tel + " o deje su teléfono y le llaman.", c: [LLAMADA_CHIP, TEL, Q("Ortodoncia", "ortodoncia")] },
    { id: "ortodoncia", k: ["ortodoncia", "bracket", "brackets", "aparato", "aparatos", "dientes torcidos", "mordida", "ortodoncista"],
      a: "Sí: en ortodoncia se ocupan de corregir los defectos y las irregularidades en la posición de los dientes. En el equipo está el Dr. Emilio Jesús López Gómez, licenciado en Medicina y Cirugía, Máster en Ortodoncia y especialista en Estomatología.", c: [CITA_CHIP, Q("Para niños", "niños"), LLAMADA_CHIP] },
    { id: "ninos", k: ["niño", "niños", "nino", "ninos", "hijo", "hija", "hijos", "infantil", "odontopediatria", "odontopediatra", "pequeño", "bebe", "dientes leche", "peque"],
      a: "Sí: hacen odontopediatría. Su web lo explica así: el control bucodental del niño es fundamental desde los primeros años de vida, en cuanto empiezan a aparecer los dientes de leche. La Dra. Carmen López de Francisco tiene un Máster en Odontopediatría y es miembro de la Sociedad Española de Odontopediatría.", c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "limpieza", k: ["limpieza", "higiene", "higienista", "sarro", "limpiar dientes", "profilaxis"],
      a: "Sí: en el equipo tienen higienista bucodental, Marina Maldonado Durán. Además, en sus «Promociones de este mes» aparece la limpieza junto con un blanqueamiento; si sigue vigente se lo confirman en la clínica.", c: [CITA_CHIP, Q("Promociones del mes", "promociones")] },
    { id: "cirugia", k: ["cirugia", "cirugia bucal", "cirugia oral", "extraccion", "extracciones", "sacar muela", "muela juicio", "muelas juicio", "cordal", "cordales"],
      a: "Hacen cirugía bucal: según su web, da soluciones a problemas bucodentales que otras áreas no pueden ofrecer. El Dr. Emilio López de Francisco tiene un Máster en Cirugía e Implantes. Si es una muela del juicio u otra extracción, el equipo le valora el caso en consulta.", c: [CITA_CHIP, URG_CHIP] },
    { id: "miedo", k: ["miedo", "ansiedad", "nervios", "nervioso", "panico", "odontofobia", "sedacion", "sedar", "dormido", "anestesia"],
      a: "Le entiendo. Su web no habla de sedación, así que no se la prometo; lo que sí dice es que su prioridad es el bienestar de sus pacientes. Si quiere, lo anoto en su cita para que el equipo lo tenga en cuenta, o le llaman antes para hablarlo.", c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "urgencia", k: ["urgencia", "urgencias", "urgente", "dolor", "duele muela", "me duele", "dolor muelas", "emergencia", "flemon", "hinchazon", "inflamacion", "infeccion", "se me ha roto", "diente roto", "fractura", "golpe", "diente partido"],
      a: "Lo siento. Su web no describe un servicio de urgencias, así que no le prometo un hueco hoy; lo más rápido es llamar al " + C.tel + " en horario (lunes a viernes, 10:00–14:00 y 17:00–21:00). Si ahora no puede llamar, déjeme su urgencia y el equipo le llama en cuanto la vea.", urg: true, c: [URG_CHIP, TEL, LLAMADA_CHIP] },
    { id: "dias", k: ["sabado", "sabados", "domingo", "domingos", "fin semana", "finde", "festivo", "festivos", "agosto", "verano"],
      a: "Su horario publicado es de lunes a viernes; los sábados y domingos no figuran, así que no se lo voy a asegurar. Aquí sí le atiendo a cualquier hora: déjeme su cita y el equipo le confirma el día más cercano.\n\n" + HORARIO_TXT, c: [CITA_CHIP, LLAMADA_CHIP, TEL] },
    { id: "horario", k: ["horario", "hora abren", "abren", "abris", "abierto", "abiertos", "cierran", "cierra", "a que hora", "mediodia", "tarde", "lunes", "martes", "miercoles", "jueves", "viernes"], a: horarioA, c: [CITA_CHIP, LLAMADA_CHIP, TEL] },
    { id: "parking", k: ["aparcar", "aparcamiento", "parking", "coche", "garaje"],
      a: "Su web no dice nada de aparcamiento, así que no se lo voy a asegurar; se lo pueden contar en la clínica.\n📍 " + C.dir + ".", c: [MAPS, CITA_CHIP] },
    { id: "direccion", k: ["donde", "direccion", "ubicacion", "como llego", "llegar", "calle", "mapa", "bogota", "porvenir", "barrio", "zona"],
      a: "📍 " + C.dir + ".", c: [MAPS, CITA_CHIP] },
    { id: "facebook", k: ["facebook", "redes", "redes sociales", "instagram", "pagina facebook"],
      a: "Tienen página de Facebook (" + C.fb.replace("https://www.", "") + "); su web dice que por ahí también se pide información de precios y promociones. Instagram no lo enlazan en su web.", c: [FB, LLAMADA_CHIP] },
    { id: "contacto", k: ["telefono", "llamar", "numero", "contacto", "email", "correo", "mail", "whatsapp", "wasap", "watsap", "movil", "hablar persona", "recepcion", "humano"],
      a: "Canales que publica la clínica:\n• Teléfono: " + C.tel + "\n• Email: " + C.email + "\n• Facebook: " + C.fb.replace("https://www.", "") + "\nWhatsApp no lo publican en su web. Si prefiere, deje aquí su teléfono y le llaman ellos.", c: [TEL, LLAMADA_CHIP, FB] },
    { id: "equipo", k: ["quien atiende", "doctor", "doctora", "dentista", "dentistas", "odontologo", "odontologa", "especialista", "especialistas", "equipo", "profesionales", "lopez", "francisco", "maldonado", "familia"],
      a: "Son una familia de profesionales de la odontología:\n• Dra. Carmen López de Francisco: licenciada en Odontología, Máster en Odontopediatría, miembro de la Sociedad Española de Odontopediatría.\n• Dr. Emilio López de Francisco: licenciado en Odontología, Máster en Cirugía e Implantes, experto en Endodoncia y Periodoncia.\n• Dr. Emilio Jesús López Gómez: licenciado en Medicina y Cirugía, Máster en Ortodoncia, especialista en Estomatología.\n• Marina Maldonado Durán: higienista bucodental.", c: [CITA_CHIP, Q("¿Cuántos años llevan?", "experiencia")] },
    { id: "experiencia", k: ["experiencia", "historia", "cuantos anos", "años", "llevan", "fiable", "confianza", "opiniones", "opinion", "resenas", "buena clinica"],
      a: "Según su web, llevan más de 25 años trabajando por la salud bucodental de sus pacientes, «teniendo siempre como prioridad su bienestar», y son una familia de profesionales de la odontología.", c: [CITA_CHIP, Q("El equipo", "equipo")] },
    { id: "tecnologia", k: ["tecnologia", "instalaciones", "escaner", "tac", "3d", "digital", "moderno", "radiografia", "rayos"],
      a: "Su web dice que la clínica dispone de instalaciones con alta tecnología, y su higienista tiene el curso de operadores de radiodiagnóstico dental del Consejo de Seguridad Nuclear. No detalla qué equipos; eso se lo cuentan en la clínica. Hay fotos en la página «Instalaciones».", c: [CITA_CHIP] },
    { id: "seguros", k: ["seguro", "mutua", "mutuas", "adeslas", "sanitas", "dkv", "asisa", "mapfre", "aseguradora", "poliza", "seguridad social"],
      a: "Su web no dice si trabajan con mutuas o seguros dentales, así que no se lo voy a asegurar. Lo que sí publican es la financiación sin intereses. Confírmelo llamando al " + C.tel + ", o deje su número y le llaman.", c: [TEL, LLAMADA_CHIP] },
    { id: "gracias", k: ["gracias", "vale gracias", "perfecto", "genial", "adios", "hasta luego"], a: "¡A usted! Si necesita algo más, aquí estoy. 😊", c: [CITA_CHIP] }
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
  function isPriceQ(n) { return /\b(precio|precios|cuesta|cuestan|cuanto vale|cuanto valen|coste|tarifa|tarifas|€|euros|caro|barato|cobran|cobrais)\b/.test(n); }
  function wantsCita(n) { var ut = toks(n); return CITA_K.some(function (ph) { return phraseScore(ph, ut) > 0; }); }
  function byId(id) { return KB.filter(function (e) { return e.id === id; })[0]; }

  var body, input, status, panel, launch, opened = false;
  var flow = null;
  function el(tag, cls, html) { var x = document.createElement(tag); if (cls) x.className = cls; if (html != null) x.innerHTML = html; return x; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function linkify(s) {
    return esc(s).replace(/\b955 524 724\b/g, '<a href="tel:+34955524724">955 524 724</a>')
      .replace(/clinicadentalelporvenir@gmail\.com/g, '<a href="mailto:clinicadentalelporvenir@gmail.com">clinicadentalelporvenir@gmail.com</a>');
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
    if (isOpen(n)) { status.className = "r24-status"; status.textContent = "🟢 Clínica abierta ahora · hasta las " + hhmm(closeAt(n)) + " · " + C.tel; }
    else { status.className = "r24-status r24-closed"; status.textContent = "🌙 Clínica cerrada ahora (vuelven " + nextOpening(n) + ") · le atiendo igual y dejo su pedido listo"; }
  }
  function menuChips() { return [CITA_CHIP, URG_CHIP, Q("Tratamientos", "tratamientos"), Q("🎁 Promociones del mes", "promociones"), Q("Horario y dirección", "horario y dirección"), LLAMADA_CHIP]; }

  function build() {
    var base = window.R24_BASE || "recepcion/";
    var css = document.createElement("link"); css.rel = "stylesheet"; css.href = base + "recepcion.css"; document.head.appendChild(css);
    var ban = el("div", "r24-demo-banner", "Demo privada preparada para Clínica Dental El Porvenir"); ban.setAttribute("role", "note"); document.body.appendChild(ban);
    launch = el("button", "r24-launch", '<img class="r24-face" src="' + base + 'avatar.svg" alt="Recepcionista"><span>Recepción 24 h</span><span class="r24-dot"></span>');
    launch.type = "button"; launch.setAttribute("aria-label", "Abrir la recepción 24 h"); document.body.appendChild(launch);
    panel = el("div", "r24-panel"); panel.setAttribute("role", "dialog"); panel.setAttribute("aria-label", "Recepción 24 h");
    panel.innerHTML = '<div class="r24-head"><div class="r24-av"><img class="r24-face" src="' + base + 'avatar.svg" alt="Recepcionista"></div><div class="r24-ht"><b>Recepción 24 h <span class="r24-online">● en línea</span></b><small>Clínica Dental El Porvenir · C/ Bogotá 25, Sevilla</small></div><button class="r24-x" type="button" aria-label="Cerrar">×</button></div><div class="r24-status"></div><button class="r24-human" type="button">👤 Hablar con una persona</button><div class="r24-body" aria-live="polite"></div><form class="r24-foot"><input class="r24-in" type="text" placeholder="Escriba su pregunta…" autocomplete="off" maxlength="300"><button class="r24-send" type="submit">Enviar</button></form><div class="r24-legal">Asistente automático de demostración · sus datos no se envían a ningún sitio</div>';
    document.body.appendChild(panel);
    body = panel.querySelector(".r24-body"); input = panel.querySelector(".r24-in"); status = panel.querySelector(".r24-status"); panel.querySelector(".r24-human").onclick = humano;
    launch.onclick = function () { open(); };
    panel.querySelector(".r24-x").onclick = function () { panel.classList.remove("r24-open"); launch.classList.remove("r24-hide"); document.documentElement.classList.remove("r24-panel-open"); };
    panel.querySelector("form").onsubmit = function (ev) { ev.preventDefault(); ev.stopImmediatePropagation(); var t = input.value.trim(); if (!t) return; input.value = ""; handle(t); };
    document.addEventListener("click", function (ev) {
      var a = ev.target.closest && ev.target.closest("[data-r24-open]"); if (a) { ev.preventDefault(); ev.stopPropagation(); open(a.getAttribute("data-r24-open")); }
    }, true);
  }
  // R24-HUMANO-1018: siempre a la vista; nunca deja al paciente atrapado con el asistente
  function humano() {
    flow = null; addUser("👤 Hablar con una persona");
    var n = madridNow();
    addBot(isOpen(n) ? "Claro. Ahora la clínica está abierta: llame al " + C.tel + " y le atiende una persona del equipo. Si lo prefiere, le llaman ellos: me deja su nombre y teléfono y listo."
      : "Claro. Ahora la clínica está cerrada (vuelven " + nextOpening(n) + "). Déjeme su nombre y teléfono y una persona del equipo le llama en cuanto abran.", [TEL, LLAMADA_CHIP]);
  }
  function greet() {
    addBot("¡Hola! 👋 Soy la recepción virtual de Clínica Dental El Porvenir (C/ Bogotá 25, Sevilla). Le ayudo a pedir cita, con una urgencia o con dudas de tratamientos, horario, promociones y financiación, a cualquier hora, sin esperar a que le cojan el teléfono.\n¿En qué le ayudo?", menuChips());
  }
  function open(mode) {
    panel.classList.add("r24-open"); launch.classList.add("r24-hide"); document.documentElement.classList.add("r24-panel-open"); statusText();
    try { if (window.jQuery && jQuery.fn.modal) jQuery(".modal.in").modal("hide"); } catch (e) {}
    if (!opened) { opened = true; greet(); }
    if (mode === "llamada" && !flow) setTimeout(function () { addUser(LLAMADA_CHIP.t); startLlamada(); }, 450);
    if (mode === "urgencia" && !flow) setTimeout(function () { addUser(URG_CHIP.t); startUrgencia(); }, 450);
    setTimeout(function () { input.focus(); }, 50);
  }

  // Motivos = tratamientos publicados en su página de Tratamientos + la promoción del mes
  var TRAT = ["Revisión / primera visita", "Limpieza / higiene", "Implantes", "Ortodoncia", "Para un niño/a (odontopediatría)", "Estética / blanqueamiento", "Encías (periodoncia)", "Endodoncia", "Cirugía bucal", "Promoción del mes", "Dolor / urgencia", "Otro"];
  var URG = ["Dolor de muelas", "Inflamación / flemón", "Diente roto o golpe", "Se me ha caído un empaste o una funda", "Urgencia de un niño/a", "Otra urgencia"];
  function franjasDe(dow) {
    var rs = dow == null ? LV : (H[dow] || LV), o = [];
    rs.forEach(function (r) { var t = (r[0] < 840 ? "Mañana" : "Tarde") + " (" + hhmm(r[0]) + "–" + hhmm(r[1]) + ")"; o.push({ t: t, v: t, flow: true }); });
    if (o.length > 1) o.push({ t: "Me da igual", v: "Mañana o tarde, indiferente", flow: true });
    return o;
  }
  function startCita() {
    flow = { step: "nombre", d: {} };
    addBot("¡Perfecto! Le ayudo a pedir cita en unos pasos.\n¿Cómo se llama? (Escriba «cancelar» si quiere salir.)");
  }
  function startLlamada() {
    flow = { step: "nombre", d: { tipo: "llamada", consulta: (lastQ || "Consulta general").slice(0, 120) } };
    addBot("¡Claro! Le llama una persona del equipo de la clínica. Solo necesito dos datos.\n¿Cómo se llama? (Escriba «cancelar» si quiere salir.)");
  }
  function startUrgencia() {
    flow = { step: "urg", d: { tipo: "urgencia" } };
    var n = madridNow(), op = isOpen(n);
    addBot((op ? "Vamos rápido. Ahora la clínica está abierta: lo más rápido es llamar al " + C.tel + " y decirlo al principio. Si no puede llamar, la dejo pedida aquí."
      : "Vamos rápido. Ahora la clínica está cerrada (vuelven " + nextOpening(n) + "), pero dejo su urgencia pedida para que le llamen en cuanto la vean.") + "\n¿Qué le pasa?",
      URG.map(function (t) { return { t: t, v: t, flow: true }; }).concat([TEL]));
  }
  var ALARMA = "⚠️ Si tiene fiebre alta, una inflamación que le dificulta tragar o respirar, o un golpe fuerte en la cara, no espere: acuda a urgencias de su hospital o centro de salud (o llame al 112).";
  function ask(step) {
    flow.step = step;
    var d = flow.d, n = madridNow();
    if (step === "tratamiento") addBot("Encantados, " + d.nombre + ". ¿Cuál es el motivo de la cita?", TRAT.map(function (t) { return { t: t, v: t, flow: true }; }));
    else if (step === "dia") addBot("¿Qué día le viene mejor? Lo anoto como preferencia y el equipo le confirma la hora exacta. Atienden de lunes a viernes, de 10:00 a 14:00 y de 17:00 a 21:00.",
      nextWorkdays(n, 5).map(function (x) { return { t: x.label, v: x.label, dow: x.dow, flow: true }; }).concat([{ t: "Lo antes posible", v: "Lo antes posible", flow: true }]));
    else if (step === "franja") addBot("¿En qué franja?", franjasDe(d.dow));
    else if (step === "telefono") addBot(d.tipo === "llamada" ? "Perfecto, " + d.nombre + ". ¿A qué teléfono le llaman?"
      : (d.tipo === "urgencia" ? "¿A qué teléfono le llaman para darle el primer hueco?" : "Último paso: ¿a qué teléfono le llamamos para confirmarle la cita?"));
    else if (step === "resumen") {
      var B = [{ t: "✅ Confirmar", v: "__ok", flow: true }, { t: "✏️ Corregir", v: "__fix", flow: true }, { t: "Cancelar", v: "cancelar", flow: true }];
      if (d.tipo === "llamada") { addBot("Revise su solicitud de llamada:\n👤 Nombre: " + d.nombre + "\n💬 Consulta: " + d.consulta + "\n📱 Teléfono: " + d.telefono + "\n\n" + AVISO + "\n\n¿Lo confirmo?", B, "r24-sum"); return; }
      if (d.tipo === "urgencia") { addBot("Revise su urgencia:\n🚨 Urgencia: " + d.motivo + "\n👤 Nombre: " + d.nombre + "\n📅 Cuándo: el primer hueco posible" + (isOpen(n) ? " (hoy)" : " (vuelven " + nextOpening(n) + ")") + "\n📱 Teléfono: " + d.telefono + "\n\n" + AVISO + "\n\n¿Lo confirmo?", B, "r24-sum"); return; }
      addBot("Revise su solicitud:\n👤 Nombre: " + d.nombre + "\n🦷 Motivo: " + d.tratamiento + "\n📅 Día: " + d.dia + "\n🕐 Franja: " + d.franja + "\n📱 Teléfono: " + d.telefono + "\n\n" + AVISO + "\n\n¿Lo confirmo?", B, "r24-sum");
    }
  }
  function dowFromText(n) {
    var m = n.match(/\b(lunes|martes|miercoles|jueves|viernes|sabado|domingo)\b/); if (!m) return null;
    return ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"].indexOf(m[1]);
  }
  function flowInput(t, chip) {
    var n = norm(t), d = flow.d;
    if (/^(cancelar|cancela|salir|dejalo|olvidalo)$/.test(n)) { flow = null; addBot("Sin problema, he cancelado la solicitud. ¿Le ayudo con otra cosa?", [CITA_CHIP, LLAMADA_CHIP]); return; }
    if (/\?/.test(t) && flow.step !== "resumen") {
      var bi = bestIntent(t);
      if (bi && bi.s >= 1) { reply(bi.e); setTimeout(function () { ask(flow.step); }, 700); return; }
    }
    switch (flow.step) {
      case "urg":
        d.motivo = t.slice(0, 80);
        addBot(ALARMA);
        setTimeout(function () { flow.step = "nombre"; addBot("Para dejar su urgencia pedida, ¿cómo se llama?"); }, 900); return;
      case "nombre":
        var nm = t.replace(/^(me llamo|soy|mi nombre es)\s+/i, "").trim();
        if (nm.length < 2 || nm.length > 60 || /\d/.test(nm)) { addBot("¿Me dice su nombre, por favor? (solo el nombre, sin números)"); return; }
        d.nombre = nm.split(/\s+/).map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join(" ");
        if (d.tipo === "llamada" || d.tipo === "urgencia") { ask("telefono"); return; } ask("tratamiento"); return;
      case "tratamiento":
        d.tratamiento = t.slice(0, 80);
        if (/urgen|dolor/.test(n)) {
          addBot("Si le duele, lo más rápido es llamar al " + C.tel + (isOpen(madridNow()) ? " ahora mismo" : " en cuanto abran (" + nextOpening(madridNow()) + ")") + ". Aun así, dejo su solicitud preparada.", [TEL]);
          setTimeout(function () { ask("dia"); }, 900); return;
        }
        ask("dia"); return;
      case "dia":
        d.dia = t.slice(0, 60);
        d.dow = chip && chip.dow != null ? chip.dow : dowFromText(n);
        if (d.dow === 0 || d.dow === 6 || /finde|fin de semana|festivo/.test(n)) {
          d.dow = null;
          addBot("Lo anoto. Ojo: su horario publicado es de lunes a viernes y los sábados y domingos no figuran, así que el equipo le propone el día más cercano.");
          setTimeout(function () { ask("franja"); }, 700); return;
        }
        ask("franja"); return;
      case "franja":
        d.franja = t.slice(0, 60); ask("telefono"); return;
      case "telefono":
        var ph = t.replace(/[\s().-]/g, "").replace(/^00/, "+").replace(/^\+34/, "");
        if (!/^[6789]\d{8}$/.test(ph)) { addBot("Ese número no me cuadra. Escríbalo con 9 cifras, por ejemplo 612 345 678."); return; }
        d.telefono = ph.slice(0, 3) + " " + ph.slice(3, 6) + " " + ph.slice(6);
        ask("resumen"); return;
      case "resumen":
        if (t === "__ok" || /^(si|vale|ok|confirmo|confirmar|correcto)/.test(n)) {
          var nm2 = d.nombre.split(" ")[0], DEMO = "\n\n(Versión de demostración: esta solicitud no se ha enviado a la clínica.)";
          if (d.tipo === "llamada") { addBot("¡Listo, " + nm2 + "! ✅ El equipo de la clínica recibe su pedido al instante y le llama al " + d.telefono + "." + DEMO, [CITA_CHIP, Q("Otra pregunta", "__menu")]); flow = null; return; }
          if (d.tipo === "urgencia") { addBot("¡Listo, " + nm2 + "! ✅ Su urgencia queda pedida. El equipo le llama al " + d.telefono + " para darle el primer hueco; si puede, adelántese llamando al " + C.tel + ".\nSi empeora, no espere: urgencias de su hospital o centro de salud, o el 112." + DEMO, [{ t: "Cómo llegar", q: "dirección" }, TEL]); flow = null; return; }
          addBot("¡Listo, " + nm2 + "! ✅ Su solicitud de cita está registrada.\nEl equipo le llamará al " + d.telefono + " para confirmarle el día y la hora exactos.\nSi prefiere adelantarse: " + C.tel + "." + DEMO, [{ t: "Cómo llegar", q: "dirección" }, Q("Otra pregunta", "__menu")]);
          flow = null; return;
        }
        if (t === "__fix" || /corregir|cambiar|^no\b/.test(n)) { flow.d = d.tipo === "llamada" ? { tipo: "llamada", consulta: d.consulta } : (d.tipo === "urgencia" ? { tipo: "urgencia", motivo: d.motivo } : {}); addBot("De acuerdo, empezamos de nuevo. ¿Cómo se llama?"); flow.step = "nombre"; return; }
        ask("resumen"); return;
    }
  }
  function reply(e) {
    var t = typeof e.a === "function" ? e.a() : e.a;
    if (e.urg) t += "\n\n" + ALARMA;
    addBot(t, (e.c || []).map(function (c) { return c.q ? { t: c.t, v: c.q } : c; }));
  }
  function fallback() {
    addBot("Eso se lo confirma mejor el equipo de la clínica, así tiene el dato exacto. 😊\nLlame al " + C.tel + " o deje su teléfono y le llaman ellos.", [TEL, LLAMADA_CHIP, CITA_CHIP]);
  }
  function handle(t, chip) {
    if (t === "__menu") { addBot("Claro, ¿qué más quiere saber?", [CITA_CHIP, Q("Tratamientos", "tratamientos"), Q("Cómo llegar", "dirección"), LLAMADA_CHIP]); return; }
    addUser(chip ? chip.t : t);
    if (flow) { flowInput(chip && chip.v ? chip.v : t, chip); return; }
    if (chip && chip.a === "cita") { startCita(); return; }
    if (chip && chip.a === "llamada") { startLlamada(); return; }
    if (chip && chip.a === "urgencia") { startUrgencia(); return; }
    var n = norm(t);
    if (/^(hola|buenas|buenos dias|buenas tardes|hey)\b/.test(n) && n.split(" ").length <= 3) { addBot("¡Hola! ¿En qué le puedo ayudar? Puedo pedirle cita, dejar pedida una urgencia o contarle tratamientos, horario, promociones y financiación.", [CITA_CHIP, URG_CHIP, Q("Tratamientos", "tratamientos"), LLAMADA_CHIP]); return; }
    if (/^horario y direccion$/.test(n)) { addBot(horarioA() + "\n\n📍 " + C.dir + ".", [MAPS, CITA_CHIP, LLAMADA_CHIP]); return; }
    if (/^tratamientos?$|que tratamientos|que haceis|que hacen|servicios|especialidades/.test(n)) {
      addBot("Tratamientos que publica la clínica:\n• Implantología\n• Periodoncia (encías)\n• Cirugía bucal\n• Endodoncia\n• Estética dental\n• Ortodoncia\n• Odontopediatría (niños)\nY tienen higienista bucodental. ¿Sobre cuál quiere saber más?",
        [Q("Implantes", "implantes"), Q("Ortodoncia", "ortodoncia"), Q("Niños", "niños"), CITA_CHIP]); return; }
    var bi = bestIntent(t);
    var price = isPriceQ(n);
    if (/urgencia|urgente/.test(n) && /dejar|pedir|tengo|quiero/.test(n) && !/\?/.test(t)) { startUrgencia(); return; }
    if (wantsCita(n) && !price && (!bi || bi.s < 2 || /cita|reserv|agendar/.test(n))) { startCita(); return; }
    if (/\b(gratis|gratuita|gratuito|sin coste)\b/.test(n) && !wantsCita(n)) { reply(byId("gratis")); return; }
    if (price) {
      if (/primera|gratis|gratuit|sin coste/.test(n)) { reply(byId("gratis")); return; }
      if (/financ|plazo|mes|pago|cuota/.test(n)) { reply(byId("financiacion")); return; }
      if (/promo|oferta|descuento|blanque/.test(n)) { reply(byId("promo")); return; }
      reply(byId("precio")); return;
    }
    if (bi) { reply(bi.e); return; }
    lastQ = t; fallback();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build); else build();
  window.R24 = { open: open, _test: { bestIntent: bestIntent, norm: norm, isOpen: isOpen, madridNow: madridNow } };
})();
