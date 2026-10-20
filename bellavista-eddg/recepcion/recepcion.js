/* R24-BRIEF-1018: avatar humano, botones rápidos, "que me llamen", aviso al equipo, sin "no tengo ese dato" */
/* Recepción 24 h · Clínica Dental Bellavista (Sevilla, Bellavista) — DEMO privada.
   100% del lado del cliente: sin APIs, sin claves, sin envío de datos.
   Todas las respuestas salen de lo que publica cdentalbellavista.es (oct. 2026): su web es de UNA página (la home) y casi no da detalle,
   así que la recepción dice lo que hay y para el resto deriva al 615 12 70 38 (llamada o WhatsApp, el mismo número de sus botones).
   Trato de «tú», como su home («cuidar de ti», «tu sonrisa», «te acompañamos»).
   Horario: su web pone «Horario: 9:30 – 21:00» SIN días. La recepción da esa franja tal cual, nunca dice «abierto ahora» (podría ser
   domingo) y no afirma qué días abren: fuera de 9:30–21:00 avisa que está fuera de su horario y deja el pedido listo.
   No inventa precios, mutuas, sedación, marcas (Invisalign), aparcamiento, nombres de doctores ni que la 1ª visita sea gratis. */
(function () {
  "use strict";
  var C = {
    nombre: "Clínica Dental Bellavista",
    tel: "615 12 70 38", telh: "+34615127038",
    wa: "https://wa.me/34615127038?text=" + encodeURIComponent("Hola, quisiera solicitar una cita en Clínica Dental Bellavista."),
    email: "cdentalbellavista@gmail.com",
    dir: "C/ Guadalajara 49, 41014 Sevilla (Bellavista)",
    maps: "https://www.google.com/maps/search/?api=1&query=Cl%C3%ADnica+Dental+Bellavista+C.+Guadalajara+49+41014+Sevilla",
    hIni: 9 * 60 + 30, hFin: 21 * 60, hTxt: "9:30 – 21:00"
  };
  function madridNow() {
    var q = (location.search.match(/[?&]r24now=([^&]+)/) || [])[1];
    if (q) { var p = decodeURIComponent(q).match(/(\d+)-(\d+)-(\d+)T(\d+):(\d+)/); if (p) return { min: +p[4] * 60 + +p[5] }; }
    var f = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Madrid", hour: "2-digit", minute: "2-digit", hour12: false });
    var o = {}; f.formatToParts(new Date()).forEach(function (x) { o[x.type] = x.value; });
    return { min: (+o.hour % 24) * 60 + +o.minute };
  }
  function fueraHorario() { var n = madridNow(); return n.min < C.hIni || n.min >= C.hFin; }

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
  var WA = { t: "WhatsApp " + C.tel, url: C.wa, wa: true };
  function Q(t, q) { return { t: t, q: q || t }; }
  var HORARIO_A = function () {
    return "Según su web, el horario de la clínica es de " + C.hTxt + " (no indica qué días de la semana abre).\n" +
      (fueraHorario() ? "Ahora mismo estamos fuera de esa franja, pero yo te atiendo igual: déjame tu cita o tu «que me llamen» y el equipo lo tiene al abrir."
        : "Yo te atiendo a cualquier hora: déjame tu cita o tu «que me llamen», eliges mañana o tarde y el equipo te confirma el día.");
  };
  function TRAT1(nombre) { return "Sí, " + nombre + " está entre los servicios de la clínica. Cómo sería en tu caso te lo explican en la primera visita, donde hacen una valoración completa de tu salud bucodental y te cuentan las opciones."; }

  var KB = [
    { id: "valoracion", k: ["primera visita", "primera cita", "primera consulta", "primera vez", "valoracion", "revision", "revisar", "chequeo", "diagnostico", "presupuesto", "segunda opinion"],
      a: "En la primera visita conoces tu estado de salud bucodental: hacen una valoración completa y te explican las diferentes opciones de tratamiento.\nSi te la pido ahora, me dices motivo y si prefieres mañana o tarde, y el equipo te confirma el día.", c: [CITA_CHIP, Q("Financiación", "financiación"), LLAMADA_CHIP] },
    { id: "gratis", k: ["gratis", "gratuita", "gratuito", "sin coste", "cuesta primera visita", "cobrais primera"],
      a: "Su web no dice si la primera visita tiene coste, así que no te lo voy a asegurar. Lo que sí cuentan: en esa visita hacen una valoración completa y te explican las opciones. Pregúntalo al pedir la cita o por WhatsApp al " + C.tel + ".", c: [CITA_CHIP, WA, LLAMADA_CHIP] },
    { id: "financiacion", k: ["financiacion", "financiais", "financiar", "plazos", "pagar a plazos", "cuotas", "al mes", "mensual", "mensualidades", "pago aplazado", "facilidades pago", "formas pago", "opciones pago"],
      a: "Sí: tienen opciones de financiación, «para que cuidar tu sonrisa sea más fácil» y adaptar el tratamiento a tus necesidades. Las condiciones no las detallan en la web: te las explican en la clínica o por WhatsApp al " + C.tel + ".", c: [CITA_CHIP, WA, LLAMADA_CHIP] },
    { id: "precio", k: ["precio", "precios", "tarifa", "tarifas", "cuanto cuesta", "cuanto vale", "caro", "barato"],
      a: "Su web no publica precios, así que prefiero no darte una cifra a ojo: depende de cada caso. Lo normal es valorarlo en la primera visita, y tienen opciones de financiación. Si quieres una orientación antes, escríbeles por WhatsApp al " + C.tel + ".", c: [CITA_CHIP, Q("Financiación", "financiación"), WA] },
    { id: "implantes", k: ["implante", "implantes", "implantologia", "dientes fijos", "falta diente", "perdido diente", "reponer diente"], a: TRAT1("la colocación de implantes"), c: [CITA_CHIP, Q("¿Precio?", "precio implante"), LLAMADA_CHIP] },
    { id: "invisalign", k: ["invisalign"], a: "Su web habla de «ortodoncia invisible», sin nombrar ninguna marca, así que no te puedo asegurar que sea Invisalign. Lo que sí hacen: ortodoncia invisible y ortodoncia convencional. La marca y el tipo de alineador te lo confirman en la primera visita o por WhatsApp al " + C.tel + ".", c: [CITA_CHIP, WA] },
    { id: "ortodoncia", k: ["ortodoncia", "ortodoncia invisible", "invisible", "alineador", "alineadores", "bracket", "brackets", "aparato", "aparatos", "dientes torcidos", "mordida"], a: "Sí: entre sus servicios están la ortodoncia y la ortodoncia invisible. Qué tipo te conviene te lo explican en la primera visita, con una valoración completa de tu caso.", c: [CITA_CHIP, Q("Financiación", "financiación")] },
    { id: "blanqueamiento", k: ["blanqueamiento", "blanquear", "dientes blancos", "manchas", "estetica"], a: TRAT1("el blanqueamiento dental"), c: [CITA_CHIP] },
    { id: "limpieza", k: ["limpieza", "limpiar", "sarro", "higiene", "tartrectomia"], a: TRAT1("la limpieza dental"), c: [CITA_CHIP] },
    { id: "endodoncia", k: ["endodoncia", "matar nervio", "nervio", "conductos"], a: TRAT1("la endodoncia"), c: [CITA_CHIP, URG_CHIP] },
    { id: "protesis", k: ["protesis", "dentadura", "dentadura postiza", "puente", "puentes", "corona", "coronas", "funda", "fundas"], a: TRAT1("la prótesis dental (las «soluciones protésicas», como las llaman)"), c: [CITA_CHIP] },
    { id: "periodoncia", k: ["periodoncia", "periodontitis", "piorrea", "encia", "encias", "sangran", "sangrado", "gingivitis", "dientes se mueven"], a: TRAT1("la periodoncia (tratamiento de encías)"), c: [CITA_CHIP] },
    { id: "cirugia", k: ["cirugia", "cirugia oral", "extraccion", "extracciones", "sacar muela", "muela juicio", "muelas juicio", "cordal", "cordales"], a: TRAT1("la cirugía oral (extracciones, muelas del juicio…)"), c: [CITA_CHIP, URG_CHIP] },
    { id: "ninos", k: ["niño", "niños", "nino", "ninos", "hijo", "hija", "hijos", "infantil", "odontopediatria", "odontopediatra", "pequeño", "bebe", "familia"], a: "Sí: tienen odontopediatría (atención pediátrica) y su web lo dice claro, «odontología cercana y personalizada para cuidar de ti y de toda tu familia». En las opiniones que muestran, una paciente cuenta que va desde pequeña.", c: [CITA_CHIP] },
    { id: "miedo", k: ["miedo", "ansiedad", "nervios", "nervioso", "panico", "odontofobia", "sedacion", "sedar", "dormido", "anestesia"], a: "Te entiendo. Su web no habla de sedación, así que no te lo voy a prometer. Lo que sí dicen: «escuchamos tus necesidades y te acompañamos durante todo el tratamiento para que te sientas cómodo, informado y en buenas manos». Si quieres, lo anoto en tu cita para que lo sepan desde el principio.", c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "tecnologia", k: ["tecnologia", "escaner", "tac", "3d", "digital", "moderno", "materiales"], a: "Su web dice que trabajan con tecnología avanzada y materiales de calidad para que los tratamientos sean precisos y seguros. No detalla qué equipos, así que eso te lo cuentan en la clínica.", c: [CITA_CHIP] },
    { id: "urgencia", k: ["urgencia", "urgencias", "urgente", "dolor", "duele muela", "me duele", "dolor muelas", "emergencia", "flemon", "hinchazon", "inflamacion", "infeccion", "se me ha roto", "diente roto", "fractura", "golpe", "diente partido"],
      a: "¿Dolor, inflamación o una urgencia inesperada? Lo que dice la clínica: «contacta con nosotros y haremos todo lo posible por atenderte cuanto antes». Llama o escribe por WhatsApp al " + C.tel + ". Si ahora no puedes llamar, déjame tu urgencia y te llaman.", urg: true, c: [URG_CHIP, TEL, WA] },
    { id: "dias", k: ["sabado", "sabados", "domingo", "domingos", "fin semana", "finde", "festivo", "festivos", "agosto", "lunes", "viernes"],
      a: function () { return "Su web publica el horario " + C.hTxt + ", pero no dice qué días abre (ni si abren sábados o festivos), así que no te lo voy a asegurar. Si quieres venir un día concreto, lo anoto en tu cita y el equipo te confirma ese día o el más cercano."; }, c: [CITA_CHIP, WA, LLAMADA_CHIP] },
    { id: "horario", k: ["horario", "hora abris", "abris", "abierto", "abiertos", "cerrais", "cierra", "a que hora", "mediodia", "tarde"], a: HORARIO_A, c: [CITA_CHIP, LLAMADA_CHIP, WA] },
    { id: "parking", k: ["aparcar", "aparcamiento", "parking", "metro", "autobus", "bus", "tren", "transporte"],
      a: "Su web no da información de aparcamiento ni de transporte, así que no te lo invento. Te dejo la dirección: 📍 " + C.dir + ", y el mapa para ver cómo llegar.", c: [{ t: "Google Maps", url: C.maps }, WA, CITA_CHIP] },
    { id: "direccion", k: ["donde", "direccion", "ubicacion", "como llego", "llegar", "calle", "mapa", "guadalajara", "bellavista"],
      a: "📍 " + C.dir + ".", c: [{ t: "Google Maps", url: C.maps }, CITA_CHIP] },
    { id: "contacto", k: ["telefono", "llamar", "numero", "contacto", "email", "correo", "mail", "whatsapp", "wasap", "watsap", "movil", "hablar persona", "recepcion", "humano"],
      a: "Canales que publica la clínica:\n• Teléfono y WhatsApp: " + C.tel + "\n• Email: " + C.email + "\nSi prefieres, deja aquí tu teléfono y te llaman ellos.", c: [TEL, WA, LLAMADA_CHIP] },
    { id: "equipo", k: ["quien atiende", "doctor", "doctora", "dentista", "dentistas", "odontologo", "odontologa", "especialista", "especialistas", "equipo", "isabel"],
      a: "Según su web, no es un solo doctor: es un equipo cercano y profesional de dentistas generales y especialistas (atención pediátrica, periodoncia, prótesis, endodoncia, implantes y cirugía). En las opiniones que muestran, una paciente destaca a la Dra. Isabel. Quién te atiende en tu caso te lo confirma el equipo.", c: [CITA_CHIP, Q("Opiniones", "opiniones")] },
    { id: "opiniones", k: ["opiniones", "opinion", "reseñas", "resenas", "valoraciones", "recomendais", "fiable", "buena clinica"],
      a: "En su web muestran opiniones de pacientes, todas con 5 de 5. Por ejemplo: «Para mí, la mejor clínica dental de toda Sevilla. Profesionalidad y amabilidad a partes iguales» y «Excelente trato y atención al paciente».", c: [CITA_CHIP] },
    { id: "seguros", k: ["seguro", "mutua", "mutuas", "adeslas", "sanitas", "dkv", "asisa", "mapfre", "aseguradora", "poliza", "seguridad social"],
      a: "Su web no dice si trabajan con mutuas o seguros dentales, así que no te lo voy a asegurar. Confírmalo por teléfono o WhatsApp al " + C.tel + ", o deja tu número y te llaman.", c: [TEL, WA, LLAMADA_CHIP] },
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
  function scroll() { body.scrollTop = body.scrollHeight; }
  function addUser(t) { var m = el("div", "r24-msg r24-user"); m.textContent = t; body.appendChild(m); scroll(); }
  function addBot(t, chips, cls) {
    var ty = el("div", "r24-typing", "Escribiendo…"); body.appendChild(ty); scroll();
    chips = chips || [];
    setTimeout(function () {
      ty.remove();
      var m = el("div", "r24-msg r24-bot" + (cls ? " " + cls : ""), esc(t).replace(/\b615 12 70 38\b/g, '<a href="tel:+34615127038">615 12 70 38</a>').replace(/cdentalbellavista@gmail\.com/g, '<a href="mailto:cdentalbellavista@gmail.com">cdentalbellavista@gmail.com</a>'));
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
    var fuera = fueraHorario();
    status.className = "r24-status" + (fuera ? " r24-closed" : "");
    status.textContent = fuera ? "🌙 Fuera del horario de la clínica (" + C.hTxt + ") · te atiendo igual y dejo tu pedido listo"
      : "🕒 Te atiendo a cualquier hora · Clínica: " + C.hTxt + " · " + C.tel + " (llamada o WhatsApp)";
  }
  function menuChips() { return [CITA_CHIP, URG_CHIP, Q("Tratamientos", "tratamientos"), Q("Horario y dirección", "horario y dirección"), Q("Financiación", "financiación"), LLAMADA_CHIP]; }

  function build() {
    var base = window.R24_BASE || "recepcion/";
    var css = document.createElement("link"); css.rel = "stylesheet"; css.href = base + "recepcion.css"; document.head.appendChild(css);
    var ban = el("div", "r24-demo-banner", "Demo privada preparada para Clínica Dental Bellavista"); ban.setAttribute("role", "note"); document.body.appendChild(ban);
    launch = el("button", "r24-launch", '<img class="r24-face" src="' + base + 'avatar.svg" alt="Recepcionista"><span>Recepción 24 h</span><span class="r24-dot"></span>');
    launch.type = "button"; launch.setAttribute("aria-label", "Abrir la recepción 24 h"); document.body.appendChild(launch);
    panel = el("div", "r24-panel"); panel.setAttribute("role", "dialog"); panel.setAttribute("aria-label", "Recepción 24 h");
    panel.innerHTML = '<div class="r24-head"><div class="r24-av"><img class="r24-face" src="' + base + 'avatar.svg" alt="Recepcionista"></div><div class="r24-ht"><b>Recepción 24 h <span class="r24-online">● en línea</span></b><small>Clínica Dental Bellavista · Sevilla</small></div><button class="r24-x" type="button" aria-label="Cerrar">×</button></div><div class="r24-status"></div><div class="r24-body" aria-live="polite"></div><form class="r24-foot"><input class="r24-in" type="text" placeholder="Escribe tu pregunta…" autocomplete="off" maxlength="300"><button class="r24-send" type="submit">Enviar</button></form><div class="r24-legal">Asistente automático de demostración · tus datos no se envían a ningún sitio</div>';
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
    addBot("¡Hola! 👋 Soy el asistente virtual con IA de Clínica Dental Bellavista (C/ Guadalajara 49, Sevilla). Te ayudo a pedir cita, con una urgencia o con dudas de tratamientos, horario y financiación, a cualquier hora, sin esperar a que te cojan el teléfono.\n¿En qué te ayudo?", menuChips());
  }
  function open(mode) {
    panel.classList.add("r24-open"); launch.classList.add("r24-hide"); document.documentElement.classList.add("r24-panel-open"); statusText();
    if (!opened) { opened = true; greet(); }
    if (mode === "llamada" && !flow) setTimeout(function () { addUser(LLAMADA_CHIP.t); startLlamada(); }, 450);
    if (mode === "urgencia" && !flow) setTimeout(function () { addUser(URG_CHIP.t); startUrgencia(); }, 450);
    setTimeout(function () { input.focus(); }, 50);
  }

  // Motivos = los 10 servicios publicados en su home
  var TRAT = ["Primera visita / revisión", "Limpieza dental", "Implantes", "Endodoncia", "Ortodoncia / ortodoncia invisible", "Blanqueamiento", "Prótesis", "Encías (periodoncia)", "Cirugía oral / muela del juicio", "Para un niño/a", "Dolor / urgencia", "Otro"];
  var URG = ["Dolor de muelas", "Inflamación / flemón", "Diente roto o golpe", "Muela del juicio", "Se me ha caído un empaste o corona", "Urgencia de un niño/a", "Otra urgencia"];
  var DIAS = ["Lo antes posible", "Esta semana", "La semana que viene", "Me da igual"];
  function startCita() {
    flow = { step: "nombre", d: {} };
    addBot("¡Perfecto! Te ayudo a pedir cita en unos pasos.\n¿Cómo te llamas? (Escribe «cancelar» si quieres salir.)");
  }
  function startLlamada() {
    flow = { step: "nombre", d: { tipo: "llamada", consulta: (lastQ || "Consulta general").slice(0, 120) } };
    addBot("¡Claro! Te llama una persona del equipo de la clínica. Solo necesito dos datos.\n¿Cómo te llamas? (Escribe «cancelar» si quieres salir.)");
  }
  function startUrgencia() {
    flow = { step: "urg", d: { tipo: "urgencia" } };
    addBot("Vamos rápido. Lo más rápido es llamar o escribir por WhatsApp al " + C.tel + (fueraHorario() ? " (ahora estamos fuera de su horario, " + C.hTxt + ")" : "") + ". Si ahora no puedes, dejo tu urgencia pedida y te llaman en cuanto la vean.\n¿Qué te pasa?",
      URG.map(function (t) { return { t: t, v: t, flow: true }; }).concat([WA]));
  }
  var ALARMA = "⚠️ Si tienes fiebre alta, una inflamación que te dificulta tragar o respirar, o un golpe fuerte en la cara, no esperes: acude a urgencias de tu hospital o centro de salud (o llama al 112).";
  function ask(step) {
    flow.step = step;
    var d = flow.d;
    if (step === "tratamiento") addBot("Encantados, " + d.nombre + ". ¿Cuál es el motivo de la cita?", TRAT.map(function (t) { return { t: t, v: t, flow: true }; }));
    else if (step === "dia") addBot("¿Cuándo te vendría bien? Lo anoto como preferencia y el equipo te confirma el día y la hora exactos (su horario es " + C.hTxt + ").", DIAS.map(function (x) { return { t: x, v: x, flow: true }; }));
    else if (step === "franja") addBot("¿Prefieres mañana o tarde?", [{ t: "Mañana", v: "Mañana", flow: true }, { t: "Tarde", v: "Tarde", flow: true }, { t: "Me da igual", v: "Mañana o tarde, indiferente", flow: true }]);
    else if (step === "telefono") addBot(d.tipo === "llamada" ? "Perfecto, " + d.nombre + ". ¿A qué teléfono te llaman?"
      : (d.tipo === "urgencia" ? "¿A qué teléfono te llaman para darte el primer hueco?" : "Último paso: ¿a qué teléfono te llamamos para confirmarte la cita?"));
    else if (step === "resumen") {
      var B = [{ t: "✅ Confirmar", v: "__ok", flow: true }, { t: "✏️ Corregir", v: "__fix", flow: true }, { t: "Cancelar", v: "cancelar", flow: true }];
      if (d.tipo === "llamada") { addBot("Revisa tu solicitud de llamada:\n👤 Nombre: " + d.nombre + "\n💬 Consulta: " + d.consulta + "\n📱 Teléfono: " + d.telefono + "\n\n" + AVISO + "\n\n¿Lo confirmo?", B, "r24-sum"); return; }
      if (d.tipo === "urgencia") { addBot("Revisa tu urgencia:\n🚨 Urgencia: " + d.motivo + "\n👤 Nombre: " + d.nombre + "\n📅 Cuándo: el primer hueco posible\n📱 Teléfono: " + d.telefono + "\n\n" + AVISO + "\n\n¿Lo confirmo?", B, "r24-sum"); return; }
      addBot("Revisa tu solicitud:\n👤 Nombre: " + d.nombre + "\n🦷 Motivo: " + d.tratamiento + "\n📅 Cuándo: " + d.dia + "\n🕐 Franja: " + d.franja + "\n📱 Teléfono: " + d.telefono + "\n\n" + AVISO + "\n\n¿Lo confirmo?", B, "r24-sum");
    }
  }
  function flowInput(t) {
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
          addBot("Si te duele, lo más rápido es llamar o escribir por WhatsApp al " + C.tel + ". Aun así, dejo tu solicitud preparada.", [TEL, WA]);
          setTimeout(function () { ask("dia"); }, 900); return;
        }
        ask("dia"); return;
      case "dia":
        d.dia = t.slice(0, 60);
        if (/sabado|domingo|finde|fin de semana|festivo/.test(n)) { addBot("Lo anoto. Ojo: su web no dice qué días abre, así que el equipo te confirma si puede ser ese día o te propone el más cercano."); setTimeout(function () { ask("franja"); }, 600); return; }
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
          if (d.tipo === "urgencia") { addBot("¡Listo, " + nm2 + "! ✅ Tu urgencia queda pedida. El equipo te llama al " + d.telefono + " para darte el primer hueco; si puedes, adelántate por WhatsApp al " + C.tel + ".\nSi empeora, no esperes: urgencias de tu hospital o centro de salud, o el 112." + DEMO, [{ t: "Cómo llegar", q: "dirección" }, WA]); flow = null; return; }
          addBot("¡Listo, " + nm2 + "! ✅ Tu solicitud de cita está registrada.\nEl equipo te llamará al " + d.telefono + " para confirmarte el día y la hora exactos.\nSi prefieres adelantarte: " + C.tel + " (llamada o WhatsApp)." + DEMO, [{ t: "Cómo llegar", q: "dirección" }, Q("Otra pregunta", "__menu")]);
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
    addBot("Eso te lo confirma mejor el equipo de la clínica, así tienes el dato exacto. 😊\nLlámales o escríbeles por WhatsApp al " + C.tel + ", o deja tu teléfono y te llaman ellos.", [TEL, WA, LLAMADA_CHIP, CITA_CHIP]);
  }
  function handle(t, chip) {
    if (t === "__menu") { addBot("Claro, ¿qué más quieres saber?", [CITA_CHIP, Q("Tratamientos", "tratamientos"), Q("Cómo llegar", "dirección"), LLAMADA_CHIP]); return; }
    addUser(chip ? chip.t : t);
    if (flow) { flowInput(chip && chip.v ? chip.v : t); return; }
    if (chip && chip.a === "cita") { startCita(); return; }
    if (chip && chip.a === "llamada") { startLlamada(); return; }
    if (chip && chip.a === "urgencia") { startUrgencia(); return; }
    var n = norm(t);
    if (/^(hola|buenas|buenos dias|buenas tardes|hey)\b/.test(n) && n.split(" ").length <= 3) { addBot("¡Hola! ¿En qué te puedo ayudar? Puedo pedirte cita, dejar pedida una urgencia o contarte tratamientos, horario y cómo llegar.", [CITA_CHIP, URG_CHIP, Q("Tratamientos", "tratamientos"), LLAMADA_CHIP]); return; }
    if (/^horario y direccion$/.test(n)) { addBot(HORARIO_A() + "\n📍 " + C.dir + ".", [{ t: "Google Maps", url: C.maps }, CITA_CHIP, LLAMADA_CHIP]); return; }
    if (/^tratamientos?$|que tratamientos|que haceis|servicios|especialidades/.test(n)) {
      addBot("Estos son los servicios que publica la clínica:\n• Implantes\n• Endodoncia\n• Ortodoncia y ortodoncia invisible\n• Blanqueamiento\n• Prótesis\n• Periodoncia (encías)\n• Odontopediatría\n• Cirugía oral\n• Limpieza dental\nCon un equipo de dentistas generales y especialistas. ¿Sobre cuál quieres saber más?",
        [Q("Implantes", "implantes"), Q("Ortodoncia invisible", "ortodoncia invisible"), Q("Niños", "niños"), CITA_CHIP]); return; }
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
  window.R24 = { open: open, _test: { bestIntent: bestIntent, norm: norm, fuera: fueraHorario } };
})();
