/* R24-HUMANO-1018 */
/* R24-BRIEF-1018: avatar humano, botones rápidos, "que me llamen", aviso al equipo, sin "no tengo ese dato" */
/* Recepción 24 h · Mecánico a Domicilio Houston (mecánico móvil, Houston TX) — DEMO privada, en español (como su web).
   100% del lado del cliente: sin APIs, sin claves, sin envío de datos (la foto se muestra solo en este navegador).
   Respuestas sacadas solo de lo que publica mecanicoadomiciliohouston.com (oct. 2026): Home, Mecánico Eléctrico y Contacto.
   - Teléfono 832-906-3440 («LLAMA AHORA»). Email (Contacto): mecanicohou@gmail.com. No publican WhatsApp ni dicen que reciban textos: la demo no los ofrece.
   - Horas de servicio (Contacto): «Weekdays 8:00 – 18:00» (lunes a viernes) y «Saturday 9:00 – 15:00». El domingo no figura: no se afirma ni abierto ni cerrado.
   - Área de servicio (Contacto): Houston, Humble y Kingwood (TX). No publican dirección de taller: van a tu locación.
   - Servicios (Home y Mecánico Eléctrico): alternador, motor que no arranca, batería (pila), sobrecalentamiento, diagnóstico de computadora, tune up, frenos,
     cambio de aceite, sistema de combustible, bujías, marcha (starter), sensores; eléctrico: motores de ventanas, limpiaparabrisas, luces interiores,
     aire acondicionado, sensores, diagnóstico electrónico, luces de aviso, cortos circuitos.
   - «Te podemos atender el mismo día la mayoría de las veces»; «cuando llamas te podemos avisar a qué hora podemos estar en tu locación»; «llámanos para un estimado».
   Sin precios (no publican), sin grúa (no la publican), sin WhatsApp. Trato de «tú», como su web. */
(function () {
  "use strict";
  var C = {
    nombre: "Mecánico a Domicilio Houston",
    tel: "832-906-3440", telh: "+18329063440",
    email: "mecanicohou@gmail.com",
    zonas: "Houston, Humble y Kingwood"
  };
  // Horario (minutos desde las 0:00, hora de Houston). 0 = domingo: no figura en su web.
  var LV = [[480, 1080]], SA = [[540, 900]];
  var H = { 1: LV, 2: LV, 3: LV, 4: LV, 5: LV, 6: SA, 0: [] };
  var DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
  var MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  function horarioTxt() {
    return "Horas de servicio que publica el mecánico:\n• Lunes a viernes: 8:00 am – 6:00 pm\n• Sábado: 9:00 am – 3:00 pm\n• Domingo: no figura en su web (lo confirma el mecánico)\nÁrea de servicio: " + C.zonas + ".";
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
        return (i === 0 ? "hoy" : (i === 1 ? "mañana " + DIAS[dow] : "el " + DIAS[dow])) + " a las " + hm(rs[j][0]);
    }
    return "";
  }
  function nextWorkdays(n, k) {
    var out = [];
    for (var i = 1; out.length < k && i < 14; i++) {
      var dt = new Date(n.y, n.m, n.d + i), dow = dt.getDay();
      if ((H[dow] || []).length) { var dn = DIAS[dow]; out.push({ dow: dow, label: dn.charAt(0).toUpperCase() + dn.slice(1) + " " + dt.getDate() + " " + MESES[dt.getMonth()] }); }
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
    var pt = toks(ph); if (!pt.length) return 0; var sc = 0;
    for (var i = 0; i < pt.length; i++) {
      if (ut.indexOf(pt[i]) >= 0) { sc += 1; continue; }
      if (!ut.some(function (u) { return tokMatch(pt[i], u); })) return 0;
      sc += 0.7;
    }
    return sc;
  }

  var CITA_CHIP = { a: "cita", t: "🔧 Pedir mecánico a domicilio" };
  var URG_CHIP = { a: "varado", t: "🚨 Me quedé tirado / no arranca" };
  var LLAMADA_CHIP = { a: "llamada", t: "📲 Que me llamen" };
  function aviso() { return "🔔 El mecánico recibe este pedido al instante (en esta demo no se envía nada)."; }
  var lastQ = "";
  function TEL() { return { t: "Llamar al " + C.tel, tel: C.telh }; }
  function MAIL() { return { t: "✉️ Escribir un email", url: "mailto:" + C.email, self: true }; }
  function ELECP() { return { t: "Ver página Mecánico Eléctrico", url: "mecaacutenico-eleacutectrico.html", self: true }; }
  function Q(t, q) { return { t: t, q: q || t }; }
  function horarioA() {
    var n = nowTx();
    return horarioTxt() + "\n\n" + (isOpen(n)
      ? "🟢 Ahora es horario de servicio (hasta las " + hm(closeAt(n)) + "): llama al " + C.tel + ". Si no contesta (puede estar trabajando debajo de un auto), déjame aquí tu pedido y le llega al instante."
      : "🌙 Ahora está fuera del horario publicado (vuelve " + nextOpening(n) + "). Yo te atiendo igual: deja tu pedido de mecánico a domicilio, tu aviso de «me quedé tirado» o tu «que me llamen» y el mecánico lo recibe al instante.");
  }
  function serviciosA() {
    return "Lo que publica el mecánico (va a tu casa, trabajo o donde se quedó el carro):\n• Batería (pila) y alternador\n• Motor que no arranca y marcha (starter)\n• Sobrecalentamiento (overheat): radiador, bomba de agua, fugas\n• Diagnóstico de computadora y luces del tablero\n• Tune up y bujías\n• Frenos (brakes)\n• Cambio de aceite\n• Sistema de combustible (bomba de gasolina, filtros)\n• Sensores (oxígeno, MAF)\n• Mecánico eléctrico: ventanas, limpiaparabrisas, luces, aire acondicionado, cortos circuitos\n¿Qué le pasa a tu carro?";
  }
  function noListA() {
    return "Eso no aparece en su web, así que no te lo voy a asegurar. Para confirmarlo, llama al " + C.tel + " o deja tu teléfono y te llama el mecánico.";
  }
  var SVC = Q("Servicios", "servicios");
  var KB = [
    { id: "bateria", k: ["bateria", "pila", "carga", "cables", "pasar corriente", "jump", "jumper", "se descargo", "descargada", "garantia de la pila", "garantia bateria", "battery"],
      a: function () { return "Sí: te ayudan con la batería (pila) a domicilio. Su web explica que a veces el carro no arranca porque la pila no tiene suficiente carga, y que con el tiempo pierde capacidad. Si tu pila tiene garantía, tratan de ayudarte a conseguirla donde tienes la garantía para que salga más económico; la cambian y prueban el carro. ¿Te dejo pedido el mecánico?"; }, c: [CITA_CHIP, URG_CHIP, LLAMADA_CHIP] },
    { id: "alternador", k: ["alternador", "gen", "alt", "luz de bateria", "no carga", "alternator"],
      a: function () { return "Sí: revisan y prueban el alternador a domicilio. Su web dice que si el alternador no funciona la batería no se carga, y que a veces se prende una luz en el tablero que dice GEN o ALT. ¿Te dejo pedido el mecánico? Si el carro ya te dejó tirado, toca «🚨 Me quedé tirado»."; }, c: [CITA_CHIP, URG_CHIP, LLAMADA_CHIP] },
    { id: "arranque", k: ["no arranca", "no prende", "no enciende", "no quiere arrancar", "marcha", "starter", "motor de arranque", "hace clic", "click", "won t start", "wont start"],
      a: function () { return "Sí: es de lo que más atienden. Su web dice que diagnostican la marcha (starter), la cambian si hace falta y muchas veces consiguen que el carro arranque; también revisan batería y alternador. Si estás tirado ahora, toca «🚨 Me quedé tirado» y dejo tu ubicación marcada urgente."; }, c: [URG_CHIP, CITA_CHIP, LLAMADA_CHIP] },
    { id: "calienta", k: ["se calienta", "calentando", "sobrecalentamiento", "overheat", "temperatura", "radiador", "bomba de agua", "anticongelante", "coolant", "humo blanco", "vapor"],
      a: function () { return "⚠️ Su web es clara: si tu auto se empieza a calentar, páralo lo más pronto posible en un lugar seguro para no causar un daño grave al motor, y llámalos. Puede ser el radiador, la bomba de agua, una fuga u otra cosa: lo diagnostican a domicilio. ¿Te dejo el aviso?"; }, c: [URG_CHIP, CITA_CHIP, TEL] },
    { id: "diagnostico", k: ["diagnostico", "escanear", "scanner", "codigo", "codigos", "check engine", "luz del motor", "luces del tablero", "testigo", "luz prendida", "computadora"],
      a: function () { return "Sí: hacen diagnóstico de computadora a domicilio. Su web dice que sus mecánicos tienen la herramienta para leer los códigos de falla que reporta el auto, y que hoy es clave porque los autos usan muchos sensores. Si tienes una luz prendida en el tablero, puedes mandar una foto en el pedido."; }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "tuneup", k: ["tune up", "tuneup", "afinacion", "afinar", "mantenimiento", "bujia", "bujias", "spark plug", "spark plugs"],
      a: function () { return "Sí: tune up y cambio de bujías a domicilio. Su web dice que van a tu locación y llevan las partes necesarias, y que para un estimado los llames. ¿Te dejo pedido el mecánico?"; }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "frenos", k: ["freno", "frenos", "balatas", "pastillas", "discos", "rechina", "brake", "brakes"],
      a: function () { return "Sí: servicio de frenos a domicilio. Su web dice que puedes estar en casa mientras el mecánico repara los frenos de tu auto. ¿Te dejo pedido el mecánico?"; }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "aceite", k: ["aceite", "cambio de aceite", "oil", "oil change", "filtro de aceite"],
      a: function () { return "Sí: cambio de aceite a domicilio. Su web pide que los llames para planificar dónde te hacen el servicio. ¿Te dejo pedido con tu dirección y el día que prefieras?"; }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "combustible", k: ["combustible", "gasolina", "bomba de gasolina", "filtro de gasolina", "tanque", "fuel", "fuel pump", "se apaga", "se jalonea"],
      a: function () { return "Sí: revisan el sistema de combustible (bomba de gasolina, filtros, tanque). Su web dice que si falla puede costar arrancar el auto o que funcione mal, y que sus mecánicos diagnostican el problema. ¿Te dejo pedido el mecánico?"; }, c: [CITA_CHIP, URG_CHIP, LLAMADA_CHIP] },
    { id: "sensores", k: ["sensor", "sensores", "sensor de oxigeno", "maf", "flujo de aire", "o2"],
      a: function () { return "Sí: diagnóstico y cambio de sensores (por ejemplo de oxígeno o de flujo de aire MAF). Su web explica que muchas veces no es el motor ni la transmisión, sino un sensor el que causa la falla."; }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "electrico", k: ["electrico", "electrica", "electronico", "corto", "corto circuito", "ventana", "ventanas", "vidrio electrico", "limpiaparabrisas", "luces", "luz interior", "aire acondicionado", "ac", "a c", "clima", "fusible", "fusibles", "electrical"],
      a: function () { return "Sí: son mecánicos eléctricos. Su web menciona motores de ventanas, limpiaparabrisas, luces adentro del carro, problemas de aire acondicionado, sensores, diagnóstico electrónico, luces de aviso y cortos circuitos (si el carro hace cosas raras con la electrónica, recomiendan revisarlo antes de que afecte otras piezas)."; }, c: [ELECP, CITA_CHIP, LLAMADA_CHIP] },
    { id: "domicilio", k: ["a domicilio", "vienen", "van a mi casa", "a mi casa", "trabajo", "estacionamiento", "parqueadero", "donde estoy", "como funciona", "movil", "mobile", "taller", "direccion del taller", "donde estan", "donde quedan", "ubicacion"],
      a: function () { return "Es mecánico a domicilio: no hace falta llevar el carro a un taller (su web no publica dirección de taller). Van a tu locación —tu casa, tu trabajo o donde se quedó el carro— en " + C.zonas + ". Su web dice que cuando llamas te avisan a qué hora pueden llegar y que la mayoría de las veces te atienden el mismo día."; }, c: [CITA_CHIP, URG_CHIP, LLAMADA_CHIP] },
    { id: "zona", k: ["zona", "area", "humble", "kingwood", "houston", "katy", "pasadena", "spring", "cypress", "baytown", "sugar land", "pearland", "atascocita", "llegan a", "cubren"],
      a: function () { return "Área de servicio que publica: " + C.zonas + " (TX). Si estás en otra zona cercana, el mecánico te confirma si llega: déjame tu pedido o llama al " + C.tel + "."; }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "tiempo", k: ["cuanto tarda", "cuanto tiempo", "mismo dia", "hoy mismo", "hoy", "rapido", "a que hora llegan", "cuando llegan", "urge", "pronto"],
      a: function () { return "Su web dice que te pueden atender el mismo día la mayoría de las veces, que llegan lo más rápido posible y que cuando llamas te avisan a qué hora pueden estar en tu locación. La hora exacta te la confirma el mecánico."; }, c: [CITA_CHIP, URG_CHIP, LLAMADA_CHIP] },
    { id: "nolist", k: ["grua", "remolque", "remolcar", "tow", "towing", "carroceria", "pintura", "hojalateria", "choque", "llanta", "llantas", "ponchadura", "ponchada", "transmision", "clutch", "embrague", "inspeccion", "sticker", "lavado", "detallado", "camion", "diesel", "trailer"],
      a: function () { return noListA() + "\nSi te quedaste tirado, igual te ayudo: toca «🚨 Me quedé tirado» y el mecánico recibe tu ubicación marcada urgente."; }, c: [URG_CHIP, TEL, LLAMADA_CHIP] },
    { id: "servicios", k: ["servicios", "que hacen", "que reparan", "que arreglan", "trabajos", "services"], a: serviciosA, c: [CITA_CHIP, URG_CHIP, LLAMADA_CHIP] },
    { id: "precio", k: ["precio", "precios", "cuanto cuesta", "cuanto sale", "cuanto cobran", "costo", "caro", "barato", "descuento", "estimado", "cotizacion", "tarifa", "price", "how much", "cost"],
      a: function () { return "Su web no publica precios: pide que llames para un estimado, porque depende del carro y de la falla. Lo que sí hago: te dejo el pedido con tu carro, el síntoma y una foto, y el mecánico te llama con el estimado."; }, c: [CITA_CHIP, TEL, LLAMADA_CHIP] },
    { id: "experiencia", k: ["experiencia", "anos", "confiable", "quienes son", "resenas", "opiniones", "clientes", "jesus"],
      a: function () { return "Su web dice que llevan muchos años atendiendo a la comunidad de Houston, que sus mecánicos saben diagnosticar cualquier problema del auto y que tratan de llegar lo más pronto posible. En la reseña de su web, un cliente (Martín M.) cuenta que su carro se le quedó en un parqueadero y el mecánico llegó justo a tiempo y lo arregló."; }, c: [CITA_CHIP, SVC] },
    { id: "horario", k: ["horario", "horas", "abren", "abierto", "cierran", "a que hora", "sabado", "domingo", "lunes", "hours", "open"], a: horarioA, c: [CITA_CHIP, URG_CHIP, LLAMADA_CHIP] },
    { id: "contacto", k: ["telefono", "numero", "llamar", "contacto", "correo", "email", "mail", "whatsapp", "wasap", "watsap", "texto", "mensaje de texto", "sms", "phone", "contact"],
      a: function () { return "Canales que publica el mecánico:\n• Teléfono: " + C.tel + "\n• Email: " + C.email + "\nWhatsApp no figura en su web. O deja aquí tu teléfono y te llama él."; }, c: [TEL, MAIL, LLAMADA_CHIP] },
    { id: "gracias", k: ["gracias", "muchas gracias", "perfecto", "adios", "thanks", "thank you", "bye"], a: function () { return "¡De nada! Si necesitas algo más, aquí estoy. 🔧"; }, c: [CITA_CHIP] }
  ];
  var CITA_K = ["cita", "agendar", "reservar", "pedir mecanico", "necesito un mecanico", "necesito mecanico", "mandar un mecanico", "que venga", "que vengan", "vengan a", "revisar mi carro", "revisen mi carro", "appointment", "book", "schedule"];
  function bestIntent(text) {
    var ut = toks(text), best = null, bs = 0;
    if (!ut.length) return null;
    KB.forEach(function (e) { var s = 0; e.k.forEach(function (ph) { s = Math.max(s, phraseScore(ph, ut)); }); if (s > bs) { bs = s; best = e; } });
    return bs > 0 ? { e: best, s: bs } : null;
  }
  function isPriceQ(n) { return /\b(precio|precios|cuesta|cuestan|cuanto sale|cuanto cobran|costo|caro|barato|tarifa|tarifas|price|how much|cost|\$)\b/.test(n); }
  function wantsCita(n) { var ut = toks(n); return CITA_K.some(function (ph) { return phraseScore(ph, ut) > 0; }); }
  function isVarado(n) { return /me quede tirado|quede tirado|tirado|varado|me dejo tirado|se me descompuso|se descompuso|se me apago|no arranca y|emergencia|urgente|me quede parado|stranded|broke down|emergency/.test(n); }
  function byId(id) { return KB.filter(function (e) { return e.id === id; })[0]; }

  var body, input, status, panel, launch, fileIn, opened = false;
  var flow = null;
  function el(tag, cls, html) { var x = document.createElement(tag); if (cls) x.className = cls; if (html != null) x.innerHTML = html; return x; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function linkify(s) {
    return esc(s).replace(/832-906-3440/g, '<a href="tel:+18329063440">832-906-3440</a>')
      .replace(/mecanicohou@gmail\.com/g, '<a href="mailto:mecanicohou@gmail.com">mecanicohou@gmail.com</a>');
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
          if (typeof c === "function") c = c();
          var b;
          if (c.tel) { b = el("a", "r24-chip", "📞 " + esc(c.t)); b.href = "tel:" + c.tel; }
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
    if (isOpen(n)) { status.className = "r24-status"; status.textContent = "🟢 Horario de servicio · hasta las " + hm(closeAt(n)) + " · " + C.tel; }
    else { status.className = "r24-status r24-closed"; status.textContent = "🌙 Fuera de horario (vuelve " + nextOpening(n) + ") · te atiendo igual y el mecánico recibe tu pedido"; }
  }
  function menuChips() { return [CITA_CHIP, URG_CHIP, SVC, Q("Horario y zona", "horario y zona"), Q("¿Cuánto cuesta?", "cuanto cuesta"), LLAMADA_CHIP]; }
  var banner;
  function build() {
    var base = window.R24_BASE || "recepcion/";
    var css = document.createElement("link"); css.rel = "stylesheet"; css.href = base + "recepcion.css"; document.head.appendChild(css);
    banner = el("div", "r24-demo-banner"); banner.setAttribute("role", "note"); banner.textContent = "Demo privada preparada para Mecánico a Domicilio Houston"; document.body.appendChild(banner);
    launch = el("button", "r24-launch", '<img class="r24-face" src="' + base + 'avatar.svg" alt="Recepcionista"><span class="r24-lt">Recepción 24 h</span><span class="r24-dot"></span>');
    launch.type = "button"; launch.setAttribute("aria-label", "Abrir la recepción 24 h"); document.body.appendChild(launch);
    panel = el("div", "r24-panel"); panel.setAttribute("role", "dialog"); panel.setAttribute("aria-label", "Recepción 24 h");
    panel.innerHTML = '<div class="r24-head"><div class="r24-av"><img class="r24-face" src="' + base + 'avatar.svg" alt="Recepcionista"></div><div class="r24-ht"><b>Recepción 24 h <span class="r24-online">● en línea</span></b><small>' + C.nombre + '</small></div><button class="r24-x" type="button" aria-label="Cerrar">×</button></div><div class="r24-status"></div><button class="r24-human" type="button">👤 Hablar con una persona</button><div class="r24-body" aria-live="polite"></div><form class="r24-foot"><input class="r24-in" type="text" autocomplete="off" maxlength="300" placeholder="Escribe tu pregunta…"><button class="r24-send" type="submit">Enviar</button></form><input class="r24-file" type="file" accept="image/*" hidden><div class="r24-legal">Asistente automático de demostración · tus datos no se envían a ningún sitio</div>';
    document.body.appendChild(panel);
    body = panel.querySelector(".r24-body"); input = panel.querySelector(".r24-in"); status = panel.querySelector(".r24-status"); fileIn = panel.querySelector(".r24-file");
    panel.querySelector(".r24-human").onclick = humano;
    fileIn.onchange = function () { var f = fileIn.files && fileIn.files[0]; if (!f || !flow || flow.step !== "foto") return; fotoRecibida(f); fileIn.value = ""; };
    launch.onclick = function () { open(); };
    panel.querySelector(".r24-x").onclick = function () { panel.classList.remove("r24-open"); launch.classList.remove("r24-hide"); document.documentElement.classList.remove("r24-panel-open"); };
    panel.querySelector("form").onsubmit = function (ev) { ev.preventDefault(); ev.stopImmediatePropagation(); var t = input.value.trim(); if (!t) return; input.value = ""; handle(t); };
    document.addEventListener("click", function (ev) {
      var a = ev.target.closest && ev.target.closest("[data-r24-open]"); if (a) { ev.preventDefault(); ev.stopPropagation(); open(a.getAttribute("data-r24-open")); }
    }, true);
  }
  // R24-HUMANO-1018: siempre a la vista; nunca deja al cliente atrapado con el asistente
  function humano() {
    flow = null; addUser("👤 Hablar con una persona");
    var n = nowTx();
    addBot(isOpen(n) ? "Claro. Ahora es horario de servicio: llama al " + C.tel + " y te atiende el mecánico. Si no contesta, seguramente está trabajando debajo de un auto: déjame tu nombre y teléfono y te llama él en cuanto pueda (el pedido le llega al instante)."
      : "Claro. Ahora está fuera del horario publicado (vuelve " + nextOpening(n) + "). Déjame tu nombre y teléfono y el mecánico te llama; el pedido le llega al instante. Si te quedaste tirado, toca «🚨 Me quedé tirado» y lo marco urgente.", [TEL(), LLAMADA_CHIP, URG_CHIP]);
  }
  function greet() {
    addBot("¡Hola! 👋 Soy la recepción virtual de Mecánico a Domicilio Houston. Te ayudo a pedir un mecánico que vaya a tu casa o a donde está tu carro, si te quedaste tirado, o con dudas de servicios, zona y horario, a cualquier hora y sin esperar a que te contesten el teléfono.\n¿En qué te ayudo?", menuChips());
  }
  function open(mode) {
    panel.classList.add("r24-open"); launch.classList.add("r24-hide"); document.documentElement.classList.add("r24-panel-open"); statusText();
    if (!opened) { opened = true; greet(); }
    if (mode === "llamada" && !flow) setTimeout(function () { addUser(LLAMADA_CHIP.t); startLlamada(); }, 450);
    if (mode === "varado" && !flow) setTimeout(function () { addUser(URG_CHIP.t); startVarado(); }, 450);
    if (mode === "cita" && !flow) setTimeout(function () { addUser(CITA_CHIP.t); startCita(); }, 450);
    if (mode === "humano") setTimeout(humano, 450);
    setTimeout(function () { input.focus(); }, 50);
  }
  function opts(a) { return a.map(function (t) { return { t: t, v: t, flow: true }; }); }
  function ZONAS() { return ["Houston", "Humble", "Kingwood", "Otra zona"]; }
  function SINT() { return ["No arranca / batería", "Alternador / luz de batería", "Se calienta (overheat)", "Luz en el tablero / diagnóstico", "Frenos", "Cambio de aceite / tune up", "Eléctrico (ventanas, luces, AC)", "Otro"]; }
  function VAR() { return ["No arranca / batería", "Se calentó (overheat)", "Se apagó andando", "Otro"]; }
  function FOTO() { return [{ t: "📷 Subir foto", foto: true }, { t: "Sin foto", v: "__nofoto", flow: true }]; }
  function franjas(dow) { var sat = dow === 6; return opts([sat ? "Mañana (9:00 am – 12:00 pm)" : "Mañana (8:00 am – 12:00 pm)", sat ? "Mediodía (12:00 – 3:00 pm)" : "Tarde (12:00 – 6:00 pm)", "Me da igual"]); }
  function startCita() {
    flow = { step: "zona", d: { tipo: "cita" } };
    addBot("¡Con gusto! En unos pasos le dejo tu pedido listo al mecánico. (Escribe «cancelar» si quieres salir.)\n📍 ¿En qué zona estás? Su web publica servicio en " + C.zonas + ".", opts(ZONAS()));
  }
  function startLlamada() {
    flow = { step: "nombre", d: { tipo: "llamada", consulta: (lastQ || "Consulta general").slice(0, 120) } };
    addBot("¡Claro! Te llama el mecánico. Solo necesito dos datos.\n¿Cuál es tu nombre? (Escribe «cancelar» si quieres salir.)");
  }
  function alarma(motivo) {
    var s = "⚠️ Primero tu seguridad: si estás en la carretera o en un carril, prende las intermitentes y quédate fuera del tráfico. Si hay heridos o peligro, llama al 911.";
    if (/calent/i.test(motivo || "")) s += "\nSi se calentó, su web recomienda parar el motor lo más pronto posible en un lugar seguro para no dañarlo.";
    return s;
  }
  function startVarado() {
    flow = { step: "urg", d: { tipo: "varado" } };
    var n = nowTx(), op = isOpen(n);
    addBot((op ? "Vamos rápido. Ahora es horario de servicio: lo más rápido es llamar al " + C.tel + ". Si no contesta (puede estar debajo de un auto), te dejo aquí el aviso marcado URGENTE y le llega al instante."
      : "Vamos rápido. Ahora está fuera del horario publicado (vuelve " + nextOpening(n) + "), pero el mecánico recibe este aviso al instante, marcado URGENTE. También puedes intentar al " + C.tel + ".")
      + "\n¿Qué le pasó al carro?", opts(VAR()).concat([TEL()]));
  }
  function fotoRecibida(f) {
    var d = flow.d; d.foto = f.name.slice(0, 40);
    var m = el("div", "r24-msg r24-user r24-photo"); var im = new Image(); im.alt = "foto"; im.style.cssText = "max-width:160px;max-height:120px;display:block;border-radius:8px;margin-bottom:4px";
    try { im.src = URL.createObjectURL(f); } catch (e) {}
    m.appendChild(im); m.appendChild(document.createTextNode("📷 " + d.foto)); body.appendChild(m); scroll();
    var w = body.querySelectorAll(".r24-chips"); if (w.length) w[w.length - 1].remove();
    addBot("📷 Foto recibida (en esta demo no sale de tu teléfono).");
    setTimeout(function () { ask(d.tipo === "varado" ? "nombre" : "dia"); }, 600);
  }
  function ask(step) {
    flow.step = step;
    var d = flow.d, n = nowTx();
    if (step === "zona") addBot("📍 ¿En qué zona estás?", opts(ZONAS()));
    else if (step === "lugar") addBot(d.tipo === "varado" ? "📍 ¿Dónde estás exactamente? Calle o autopista, cruce o salida, y ciudad (por ejemplo: Wilson Rd y Atascocita Rd, Humble)."
      : "¿Dónde tiene que ir el mecánico? Dirección o cruce de calles (y código postal si lo sabes). Es solo para el pedido; en esta demo no se envía.");
    else if (step === "vehiculo") addBot("🚗 ¿Qué carro es? Marca, modelo y año (por ejemplo: Toyota Camry 2012).");
    else if (step === "sintoma") addBot("🔧 ¿Qué le pasa o qué servicio necesitas?", opts(SINT()));
    else if (step === "foto") addBot("¿Tienes una foto del tablero, de la luz prendida o de la pieza? Le ayuda al mecánico a llevar lo necesario. (Opcional)", FOTO());
    else if (step === "dia") addBot("📅 ¿Qué día te queda mejor? Lo anoto como preferencia; su web dice que la mayoría de las veces atienden el mismo día y que el mecánico te avisa a qué hora puede llegar. Horas de servicio: lunes a viernes 8:00 am – 6:00 pm y sábado 9:00 am – 3:00 pm.",
      opts(["Hoy, lo antes posible"]).concat(opts(nextWorkdays(n, 5).map(function (x) { return x.label; }))));
    else if (step === "franja") addBot("🕐 ¿En qué franja?", franjas(d.dow));
    else if (step === "nombre") addBot("¿Cuál es tu nombre?");
    else if (step === "telefono") addBot(d.tipo === "llamada" ? "Perfecto, " + d.nombre + ". ¿A qué teléfono te llama?" : (d.tipo === "varado" ? "¿A qué teléfono te llama el mecánico?" : "Último paso: ¿a qué teléfono te llama el mecánico para confirmar?"));
    else if (step === "resumen") {
      var B = [{ t: "✅ Confirmar", v: "__ok", flow: true }, { t: "✏️ Corregir", v: "__fix", flow: true }, { t: "Cancelar", v: "cancelar", flow: true }];
      var q = "\n\n¿Lo confirmo?", foto = d.foto ? d.foto : "sin foto";
      if (d.tipo === "llamada") { addBot("Revisa tu solicitud de llamada:\n👤 Nombre: " + d.nombre + "\n💬 Consulta: " + d.consulta + "\n📱 Teléfono: " + d.telefono + "\n\n" + aviso() + q, B, "r24-sum"); return; }
      if (d.tipo === "varado") { addBot("Revisa tu aviso:\n🚨 Prioridad: URGENTE · me quedé tirado\n🔧 Qué pasó: " + d.motivo + "\n📍 Ubicación: " + d.lugar + "\n🚗 Carro: " + d.vehiculo + "\n📷 Foto: " + foto + "\n👤 Nombre: " + d.nombre + "\n📱 Teléfono: " + d.telefono + (isOpen(n) ? "\n🟢 En horario de servicio" : "\n🌙 Fuera de horario (vuelve " + nextOpening(n) + "): lo recibe igual al instante") + "\n\n" + aviso() + q, B, "r24-sum"); return; }
      addBot("Revisa tu pedido de mecánico a domicilio:\n📍 Zona: " + d.zona + "\n🏠 Dónde: " + d.lugar + "\n🚗 Carro: " + d.vehiculo + "\n🔧 Síntoma / servicio: " + d.sintoma + "\n📷 Foto: " + foto + "\n📅 Día: " + d.dia + "\n🕐 Franja: " + d.franja + "\n👤 Nombre: " + d.nombre + "\n📱 Teléfono: " + d.telefono + "\n\n" + aviso() + q, B, "r24-sum");
    }
  }
  function dowFromText(n) {
    var es = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"];
    for (var i = 0; i < 7; i++) if (new RegExp("\\b" + es[i] + "\\b").test(n)) return i;
    return null;
  }
  function flowInput(t, chip) {
    var n = norm(t), d = flow.d;
    if (/^(cancelar|cancela|salir|dejalo|olvidalo|cancel|stop)$/.test(n)) { flow = null; addBot("Sin problema, cancelé la solicitud. ¿Te ayudo con otra cosa?", [CITA_CHIP, URG_CHIP, LLAMADA_CHIP]); return; }
    if (/\?/.test(t) && flow.step !== "resumen") {
      var bi = bestIntent(t);
      if (bi && bi.s >= 1) { reply(bi.e); setTimeout(function () { ask(flow.step); }, 700); return; }
    }
    switch (flow.step) {
      case "zona":
        d.zona = t.slice(0, 40);
        if (!/houston|humble|kingwood/.test(n)) {
          addBot("Lo anoto. Su web publica servicio en " + C.zonas + "; si estás en otra zona, el mecánico te confirma si llega.");
          setTimeout(function () { ask("lugar"); }, 700); return;
        }
        ask("lugar"); return;
      case "lugar":
        if (t.length < 3) { ask("lugar"); return; }
        d.lugar = t.slice(0, 100); ask("vehiculo"); return;
      case "vehiculo":
        if (t.length < 2) { ask("vehiculo"); return; }
        d.vehiculo = t.slice(0, 60);
        if (d.tipo === "cita" && !/\b(19[5-9]\d|20[0-3]\d)\b/.test(t)) { addBot("Si sabes el año, me ayuda (lo puedes poner después en «Corregir»). Sigo."); setTimeout(function () { ask("sintoma"); }, 700); return; }
        ask(d.tipo === "varado" ? "foto" : "sintoma"); return;
      case "sintoma":
        d.sintoma = t.slice(0, 100);
        if (isVarado(n)) { addBot("Si te quedaste tirado ahora, también puedo dejar un aviso URGENTE («🚨 Me quedé tirado»). Sigo con el pedido."); setTimeout(function () { ask("foto"); }, 700); return; }
        ask("foto"); return;
      case "foto":
        if (t !== "__nofoto") d.foto = "la describe: " + t.slice(0, 60);
        ask(d.tipo === "varado" ? "nombre" : "dia"); return;
      case "dia":
        d.dia = t.slice(0, 60);
        var dw = dowFromText(n);
        if (/^hoy/.test(n)) dw = nowTx().dow;
        d.dow = dw;
        if (dw === 0) { addBot("Lo anoto, pero ojo: su web no publica horario para el domingo, así que el mecánico te confirma si puede ir o te propone otro día."); setTimeout(function () { ask("franja"); }, 700); return; }
        ask("franja"); return;
      case "franja": d.franja = t.slice(0, 60); ask("nombre"); return;
      case "urg":
        d.motivo = t.slice(0, 80);
        addBot(alarma(d.motivo));
        setTimeout(function () { ask("lugar"); }, 900); return;
      case "nombre":
        var nm = t.replace(/^(me llamo|soy|mi nombre es|my name is)\s+/i, "").trim();
        if (nm.length < 2 || nm.length > 60 || /\d/.test(nm)) { addBot("¿Me dices tu nombre, por favor? (solo el nombre, sin números)"); return; }
        d.nombre = nm.split(/\s+/).map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join(" ");
        ask("telefono"); return;
      case "telefono":
        var ph = t.replace(/[\s().+-]/g, "");
        if (/^1\d{10}$/.test(ph)) ph = ph.slice(1);
        if (!/^[2-9]\d{9}$/.test(ph)) { addBot("Ese número no me cuadra. Escríbelo con 10 cifras (con código de área), por ejemplo 713-555-0123."); return; }
        d.telefono = ph.slice(0, 3) + "-" + ph.slice(3, 6) + "-" + ph.slice(6);
        ask("resumen"); return;
      case "resumen":
        if (t === "__ok" || /^(si|ok|confirmo|confirmar|correcto|dale|claro)/.test(n)) {
          var nm2 = d.nombre.split(" ")[0], DEMO = "\n\n(Versión de demostración: esta solicitud no se envió al mecánico.)", now = nowTx();
          if (d.tipo === "llamada") { addBot("¡Listo, " + nm2 + "! ✅ El mecánico recibe tu pedido al instante y te llama al " + d.telefono + "." + DEMO, [CITA_CHIP, Q("Otra pregunta", "__menu")]); flow = null; return; }
          if (d.tipo === "varado") { addBot("¡Listo, " + nm2 + "! ✅ Tu aviso URGENTE ya le llegó al mecánico, con tu ubicación. Te llama al " + d.telefono + (isOpen(now) ? "; si puedes, intenta también al " + C.tel + "." : ". Ahora está fuera de horario (vuelve " + nextOpening(now) + "), pero lo recibe al instante.") + "\nSi hay heridos o peligro, no esperes: 911." + DEMO, [TEL()]); flow = null; return; }
          addBot("¡Listo, " + nm2 + "! ✅ Tu pedido quedó registrado.\nEl mecánico te llama al " + d.telefono + " para confirmar a qué hora puede llegar y darte el estimado. Más fotos: " + C.email + "." + DEMO, [Q("Otra pregunta", "__menu")]);
          flow = null; return;
        }
        if (t === "__fix" || /corregir|cambiar|editar|^no\b/.test(n)) {
          var keep = d.tipo === "llamada" ? { tipo: "llamada", consulta: d.consulta } : { tipo: d.tipo };
          flow.d = keep; addBot("De acuerdo, empezamos de nuevo.");
          setTimeout(function () { if (keep.tipo === "llamada") ask("nombre"); else if (keep.tipo === "varado") { flow.step = "urg"; addBot("¿Qué le pasó al carro?", opts(VAR())); } else ask("zona"); }, 500); return;
        }
        ask("resumen"); return;
    }
  }
  function reply(e) {
    var t = typeof e.a === "function" ? e.a() : e.a;
    addBot(t, (e.c || []).map(function (c) { if (typeof c === "function") c = c(); return c.q ? { t: c.t, v: c.q } : c; }));
  }
  function fallback() {
    addBot("Eso te lo confirma mejor el mecánico, así tienes el dato exacto. 😊\nLlama al " + C.tel + ", escribe a " + C.email + ", o deja tu teléfono y te llama él.", [TEL, LLAMADA_CHIP, CITA_CHIP]);
  }
  function handle(t, chip, shown) {
    if (t === "__menu") { addBot("Claro, ¿qué más quieres saber?", [CITA_CHIP, URG_CHIP, SVC, Q("Horario y zona", "horario y zona"), LLAMADA_CHIP]); return; }
    addUser(chip ? (shown || chip.t) : t);
    var n = norm(t);
    if (flow) { flowInput(chip && chip.v ? chip.v : t, chip); return; }
    if (chip && chip.a === "cita") { startCita(); return; }
    if (chip && chip.a === "llamada") { startLlamada(); return; }
    if (chip && chip.a === "varado") { startVarado(); return; }
    if (/^(hola|buenas|buenos dias|buenas tardes|hey|hi|hello)\b/.test(n) && n.split(" ").length <= 3) { addBot("¡Hola! ¿En qué te puedo ayudar? Si te quedaste tirado, toca «🚨 Me quedé tirado». También te dejo pedido un mecánico a domicilio y te cuento servicios, zona y horario.", [CITA_CHIP, URG_CHIP, SVC, LLAMADA_CHIP]); return; }
    if (/^horario y zona$/.test(n)) { addBot(horarioA(), [CITA_CHIP, LLAMADA_CHIP]); return; }
    var bi = bestIntent(t);
    var price = isPriceQ(n);
    if (isVarado(n) && !/\?/.test(t)) { startVarado(); return; }
    if (wantsCita(n) && !price && (!bi || bi.s < 2 || /cita|agendar|mecanico|vengan|venga/.test(n))) { startCita(); return; }
    if (price && !(bi && bi.e.id === "nolist")) { reply(byId("precio")); return; }
    if (bi) { reply(bi.e); return; }
    lastQ = t; fallback();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build); else build();
  window.R24 = { open: open, _test: { bestIntent: bestIntent, norm: norm, isOpen: isOpen, nowTx: nowTx, lang: function () { return "es"; } } };
})();
