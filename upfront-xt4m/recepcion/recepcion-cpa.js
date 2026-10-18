/* R24-CPA-1018 · Recepción 24 h, variante "estudio contable" (CPA chico de EE.UU.) — DEMO privada, bilingüe EN/ES.
   100% del lado del cliente: sin APIs, sin claves, sin envío de datos.
   Reglas fijas del estudio (de lo que piden los dueños en #taxtwitter):
     1. Deja hablar al prospecto primero ("tell me in your own words") y guarda su relato tal cual.
     2. Distingue cliente nuevo / existente.
     3. Toma nombre y lo deletrea letra por letra para confirmarlo; email y teléfono validados.
     4. Tipo de servicio: individual / negocio / aviso del IRS (con nº de aviso y fecha si los tiene).
     5. NUNCA pasa la llamada al contador (aunque lo pidan) y NUNCA da asesoramiento impositivo.
     6. Deriva siempre a 1 de 2 links de reserva (nuevo / existente) + link del portal (alta o login).
     7. Al final arma el resumen para el dueño.
   El guion completo (también para voz) está en ../guion-estudio-contable.md: los textos de S.en / S.es son los mismos.
   Configuración por estudio: window.R24_CPA (ver CFG más abajo). */
(function () {
  "use strict";
  var CFG = Object.assign({
    firm: "Sample CPA", owner: { en: "the CPA", es: "el contador" }, sub: { en: "Tax & accounting", es: "Impuestos y contabilidad" },
    lang: "en", tz: "America/New_York", tzLabel: "ET",
    hours: null,                 // {1:[[540,1020]],...} minutos desde 00:00 en tz; null = la web no publica horario
    hoursTxt: null,              // {en:"", es:""}
    contact: null,               // {phone:"", email:""} solo si están publicados
    links: { newClient: "[LINK_RESERVA_NUEVO_CLIENTE]", existing: "[LINK_RESERVA_CLIENTE_EXISTENTE]", portal: "[LINK_ALTA_PORTAL]", portalLogin: "[LINK_LOGIN_PORTAL]" },
    linkNames: { newClient: { en: "New client consultation · 15 min", es: "Consulta cliente nuevo · 15 min" }, existing: { en: "Existing client call · 10 min", es: "Llamada cliente existente · 10 min" } },
    portalName: "TaxDome", mock: true,
    banner: { en: "Private demo — sample firm, not a real business", es: "Demo privada — estudio ficticio, no es un negocio real" },
    base: "recepcion/", services: null,
    apptOnly: false,             // true = la oficina atiende solo con cita (se dice fuera de horario y si preguntan por ir sin cita)
    offices: null,               // [{en:"", es:""}, ...] si hay varias oficinas (se pregunta cuál)
    wa: null,                    // {number:"443-296-2062"} = flujo de WhatsApp simulado (botón de WhatsApp de la web)
    names: []                    // nombres del dueño/equipo ("jimmy") para reconocer "quiero hablar con Jimmy" (regla: no se pasa)
  }, window.R24_CPA || {});
  var L = CFG.lang === "es" ? "es" : "en";

  var S = {
    en: {
      title: "Front desk", online: "● online", ph: "Type your message…", send: "Send",
      legal: "Automated demo assistant · nothing you type is sent anywhere",
      launch: "Front desk 24/7", open: "Open the front desk",
      greet: "Hi! Thanks for reaching out to {firm}. I'm the virtual front desk.\nWhat can we help you with? Tell me in your own words — take your time.",
      qNew: "I'm a new client", qExisting: "I'm already a client", qIrs: "I got a letter from the IRS", qBiz: "Business taxes / bookkeeping", qTalk: "Can I talk to the CPA?", qHours: "Office hours",
      qIrsText: "I got a letter from the IRS and I don't know what to do.",
      ackIrs: "Thank you for explaining. A letter from the IRS is exactly the kind of thing {owner} handles, so I'll make sure it's flagged.",
      ackBiz: "Thank you, that helps. I've noted it's about your business.",
      ackInd: "Thank you, that helps. I've noted it's about your personal taxes.",
      ackGen: "Thank you, I've written that down.",
      more: "Is there anything else you'd like {owner} to know before I take your details? You can keep typing, or tap “That's everything”.",
      moreOk: "Got it, I added that too.",
      done: "That's everything",
      askClient: "To send you to the right place: are you already a client of {firm}, or would this be your first time working with us?",
      cNew: "First time (new client)", cEx: "I'm already a client",
      askName: "Great. What's your full name — first and last — as it should appear on your file?",
      badName: "Could you type your full name (letters only)?",
      spell: "Let me make sure I spell it right:\n{spelled}\n“{name}” — is that correct?",
      yes: "✅ That's correct", fix: "✏️ Fix the spelling",
      fixAsk: "No problem — please type your name exactly as it should be written.",
      askEmail: "Thanks, {first}. What's the best email for you? The booking confirmation goes there.",
      badEmail: "That email doesn't look complete. Could you type it again? (e.g. name@example.com)",
      askPhone: "And a phone number, in case {owner} needs to reach you before the appointment?",
      badPhone: "That number doesn't look right. Please type it with the area code, e.g. (321) 555-0147.",
      askService: "Which of these best describes what you need?",
      svInd: "Individual tax return", svBiz: "Business taxes / bookkeeping", svIrs: "IRS notice or letter", svOther: "Something else",
      svFoot: " (from what you told me: {guess})",
      askNotice: "If you have the letter handy: what's the notice number (usually top or bottom right, like CP2000, CP14 or LTR 1058) and the date on it? If not, just type “skip”.",
      noticeOk: "Thanks, noted. I can't tell you what the notice means or what to do about it — {owner} will review it with you. I've marked it as time-sensitive.",
      askNotice2: "You mentioned a {code} notice. What's the date on the letter? If you don't have it handy, just tap “Skip”.",
      skip: "Skip",
      routeNew: "Here's how {firm} works with new clients:\n1) Book your new client consultation.\n2) Create your secure client portal account ({portal}) so you can upload {docs}.\nBoth links are below.",
      routeEx: "Since you're already a client, here's the fastest way:\n1) Book a call with {owner}.\n2) Log in to your client portal ({portal}) to upload {docs}.",
      docsIrs: "a photo or scan of the IRS letter", docsGen: "your documents",
      bookNew: "📅 Book new client consultation", bookEx: "📅 Book a call (existing clients)", portalNew: "🔐 Create portal account", portalEx: "🔐 Log in to the portal",
      later: "I'll do it later",
      booked: "✅ Booked: {slot} {tz} — {what}. The confirmation goes to {email}.",
      portalDone: "✅ Portal account created for {email}. You'll get an email to set your password; once you're in, upload {docs}.",
      portalSent: "No problem. I'll include the portal link in your confirmation email so you can do it later.",
      nextPortal: "One more step: create your portal account so {owner} can see your documents before the call.",
      nextBook: "And please pick a time for your call:",
      bye: "You're all set, {first}. {owner_c} will see you on {slot} {tz}.\nThis is what I've sent to the team:",
      byeNoBook: "Thanks, {first}. I've sent your details to the team. You can book any time with the link above.",
      ruleTransfer: "I understand you'd like to speak with {owner} directly. I'm not able to transfer calls — {firm} asks that every conversation be booked, so {owner} can give you their full attention. The quickest way is the booking link I'll give you in a moment.",
      ruleTransferBook: "I understand you'd like to speak with {owner}. I'm not able to transfer calls — {firm} asks that every conversation be booked. The fastest way to talk is the booking link:",
      ruleAdvice: "That's a good question for {owner}. I'm not able to give tax advice, but I've written your question down so they can answer it in your appointment.",
      price: "Fees depend on your situation, so {owner} quotes them after the consultation. I've noted that you'd like to know the cost.",
      hoursNo: "The website doesn't list office hours. You don't need to call, though: the booking link shows {owner}'s real availability, and I'm here 24/7.",
      hoursPre: "Office hours ({tz}):\n",
      contact: "You can reach the office at {contact}.\nCalls aren't transferred from here — the fastest way to talk with {owner} is to book a time.",
      portalQ: "{firm} uses a secure client portal ({portal}) for documents. New clients create an account; existing clients log in and upload there. I'll give you the right link at the end.",
      lang: "We can continue in Spanish if you prefer — just tap ES at the top.",
      fallback: "That's one for the team, so I've added it to your notes and {owner} will answer it. Meanwhile, the quickest way to get time with {owner} is to book.",
      cancel: "No problem, I've cancelled this request. Anything else I can help with?",
      restart: "Start over",
      statusOpen: "🟢 Office open now · I can book you in right away",
      statusClosed: "🌙 Office closed now · I can still book you in",
      status24: "🟢 Online 24/7 · books straight into the firm's calendar",
      sheetBook: "Pick a time", sheetPh: "Placeholder — in the real setup this is the firm's own booking link", confirm: "Confirm", back: "Back",
      sheetPortal: "Create your client portal account", sheetPortalPh: "Placeholder — in the real setup this is the firm's own {portal} sign-up link", createAcc: "Create account",
      fName: "Full name", fEmail: "Email", fPhone: "Phone",
      sumTitle: "📋 New front-desk summary for {firm}",
      sType: "Type", sNew: "NEW client (prospect)", sEx: "EXISTING client", sName: "Name (spelling confirmed)", sEmail: "Email", sPhone: "Phone",
      sService: "Service", sNotice: "IRS notice", sNone: "not provided", sStory: "In their words", sQs: "Questions for you (not answered — firm rule)",
      sBook: "Booked", sNoBook: "not booked yet (link sent)", sPortal: "Portal", sPortalNew: "account created ✓", sPortalEx: "login link sent ✓", sPortalLater: "link sent, pending",
      sRules: "Rules", sRulesTxt: "call not transferred ✓{n} · no tax advice given ✓", sTransfers: " (caller asked {k}×)", sLang: "Language", sFlag: "⚠️ Time-sensitive: IRS notice",
      sAviso: "🔔 In the real setup this summary reaches the owner within seconds by email/SMS. In this demo nothing is sent.",
      dows: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      langName: "English",
      closedNow: "The office is closed right now (it opens {next}) and works by appointment only — so let's get your appointment booked now.",
      openAppt: "🟢 Office open now · appointments only, I can book yours",
      closedAppt: "🌙 Office closed now (opens {next}) · I can book your appointment",
      walkin: "{firm} works by appointment only, so walk-ins can't be seen. I can book your appointment right here, any time.",
      askOffice: "Which office works best for you?", sOffice: "Office", sChannel: "Channel", chWeb: "Website chat", chWa: "WhatsApp",
      waSub: "WhatsApp · {num} (simulated)", waLegal: "Simulated WhatsApp chat for this demo · nothing is sent",
      today: "today", tomorrow: "tomorrow", at: "at", nextFmt: "{when} at {time}"
    },
    es: {
      title: "Recepción", online: "● en línea", ph: "Escribe tu mensaje…", send: "Enviar",
      legal: "Asistente automático de demostración · nada de lo que escribas se envía",
      launch: "Recepción 24/7", open: "Abrir la recepción",
      greet: "¡Hola! Gracias por comunicarte con {firm}. Soy la recepción virtual.\n¿En qué te podemos ayudar? Cuéntame con tus palabras, sin prisa.",
      qNew: "Soy cliente nuevo", qExisting: "Ya soy cliente", qIrs: "Me llegó una carta del IRS", qBiz: "Impuestos de mi negocio", qTalk: "¿Puedo hablar con el contador?", qHours: "Horario",
      qIrsText: "Me llegó una carta del IRS y no sé qué hacer.",
      ackIrs: "Gracias por contarme. Una carta del IRS es justo lo que atiende {owner}, así que la dejo marcada.",
      ackBiz: "Gracias, me sirve. Anoté que es por tu negocio.",
      ackInd: "Gracias, me sirve. Anoté que es por tus impuestos personales.",
      ackGen: "Gracias, ya lo anoté.",
      more: "¿Hay algo más que quieras que {owner} sepa antes de tomar tus datos? Puedes seguir escribiendo o tocar «Eso es todo».",
      moreOk: "Perfecto, también lo agregué.",
      done: "Eso es todo",
      askClient: "Para derivarte bien: ¿ya eres cliente de {firm} o sería la primera vez que trabajas con nosotros?",
      cNew: "Primera vez (cliente nuevo)", cEx: "Ya soy cliente",
      askName: "Genial. ¿Cuál es tu nombre completo —nombre y apellido— tal como debe figurar en tu expediente?",
      badName: "¿Me escribes tu nombre completo (solo letras)?",
      spell: "Quiero escribirlo bien:\n{spelled}\n«{name}», ¿es correcto?",
      yes: "✅ Es correcto", fix: "✏️ Corregir",
      fixAsk: "Sin problema: escribe tu nombre exactamente como debe ir.",
      askEmail: "Gracias, {first}. ¿A qué email te escribimos? Ahí te llegará la confirmación de la reserva.",
      badEmail: "Ese email parece incompleto. ¿Lo escribes de nuevo? (por ej. nombre@ejemplo.com)",
      askPhone: "¿Y un teléfono, por si {owner} necesita contactarte antes de la cita?",
      badPhone: "Ese número no parece correcto. Escríbelo con el código de área, por ej. (321) 555-0147.",
      askService: "¿Cuál de estas opciones describe mejor lo que necesitas?",
      svInd: "Declaración personal", svBiz: "Impuestos / contabilidad del negocio", svIrs: "Aviso o carta del IRS", svOther: "Otra cosa",
      svFoot: " (por lo que me contaste: {guess})",
      askNotice: "Si tienes la carta a mano: ¿qué número de aviso tiene (suele estar arriba o abajo a la derecha, como CP2000, CP14 o LTR 1058) y qué fecha? Si no, escribe «saltar».",
      noticeOk: "Gracias, anotado. No te puedo decir qué significa el aviso ni qué hacer: eso lo revisa {owner} contigo. Lo dejé marcado como urgente.",
      askNotice2: "Mencionaste un aviso {code}. ¿Qué fecha tiene la carta? Si no la tienes a mano, toca «Saltar».",
      skip: "Saltar",
      routeNew: "Así trabaja {firm} con clientes nuevos:\n1) Reserva tu consulta de cliente nuevo.\n2) Crea tu cuenta en el portal seguro de clientes ({portal}) para subir {docs}.\nTienes los dos enlaces aquí abajo.",
      routeEx: "Como ya eres cliente, lo más rápido es:\n1) Reservar una llamada con {owner}.\n2) Entrar a tu portal de clientes ({portal}) y subir {docs}.",
      docsIrs: "una foto o escaneo de la carta del IRS", docsGen: "tus documentos",
      bookNew: "📅 Reservar consulta cliente nuevo", bookEx: "📅 Reservar llamada (clientes)", portalNew: "🔐 Crear cuenta en el portal", portalEx: "🔐 Entrar al portal",
      later: "Lo hago después",
      booked: "✅ Reservado: {slot} ({tz}) — {what}. La confirmación te llegará a {email}.",
      portalDone: "✅ Cuenta del portal creada para {email}. Te llegará un email para elegir tu contraseña; una vez dentro, sube {docs}.",
      portalSent: "Sin problema. Te dejo el enlace del portal en el email de confirmación para que lo hagas después.",
      nextPortal: "Un paso más: crea tu cuenta en el portal así {owner} ve tus documentos antes de la llamada.",
      nextBook: "Y elige un horario para tu llamada:",
      bye: "Listo, {first}. {owner_c} te atiende el {slot} ({tz}).\nEsto es lo que le mandé al equipo:",
      byeNoBook: "Gracias, {first}. Le pasé tus datos al equipo. Puedes reservar cuando quieras con el enlace de arriba.",
      ruleTransfer: "Entiendo que quieres hablar directamente con {owner}. No puedo pasar llamadas: en {firm} todas las conversaciones se reservan, así {owner} te dedica toda su atención. Lo más rápido es el enlace de reserva que te doy en un momento.",
      ruleTransferBook: "Entiendo que quieres hablar con {owner}. No puedo pasar llamadas: en {firm} todas las conversaciones se reservan. La forma más rápida de hablar es este enlace:",
      ruleAdvice: "Es una muy buena pregunta para {owner}. No puedo darte asesoramiento impositivo, pero anoté tu pregunta para que te la responda en la cita.",
      price: "Los honorarios dependen de tu situación, así que {owner} te los cotiza después de la consulta. Anoté que quieres saber el costo.",
      hoursNo: "La web no publica horario de atención. Igual no hace falta llamar: el enlace de reserva muestra la disponibilidad real de {owner}, y yo atiendo 24/7.",
      hoursPre: "Horario de atención ({tz}):\n",
      contact: "Puedes contactar a la oficina al {contact}.\nDesde aquí no se pasan llamadas: la forma más rápida de hablar con {owner} es reservar un horario.",
      portalQ: "{firm} usa un portal seguro de clientes ({portal}) para los documentos. Los clientes nuevos crean una cuenta; los existentes entran y suben ahí. Al final te doy el enlace que corresponde.",
      lang: "Podemos seguir en inglés si prefieres: toca EN arriba.",
      fallback: "Eso lo responde mejor el equipo, así que lo agregué a tus notas y {owner} te lo contesta. Mientras tanto, lo más rápido para tener tiempo con {owner} es reservar.",
      cancel: "Sin problema, cancelé este pedido. ¿Te ayudo con otra cosa?",
      restart: "Empezar de nuevo",
      statusOpen: "🟢 Oficina abierta · te reservo un horario ahora",
      statusClosed: "🌙 Oficina cerrada · igual te reservo un horario",
      status24: "🟢 En línea 24/7 · reserva directo en la agenda del estudio",
      sheetBook: "Elige un horario", sheetPh: "Placeholder: en la versión real es el enlace de reservas del propio estudio", confirm: "Confirmar", back: "Volver",
      sheetPortal: "Crea tu cuenta en el portal de clientes", sheetPortalPh: "Placeholder: en la versión real es el enlace de alta de {portal} del propio estudio", createAcc: "Crear cuenta",
      fName: "Nombre completo", fEmail: "Email", fPhone: "Teléfono",
      sumTitle: "📋 Resumen de recepción para {firm}",
      sType: "Tipo", sNew: "Cliente NUEVO (prospecto)", sEx: "Cliente EXISTENTE", sName: "Nombre (deletreo confirmado)", sEmail: "Email", sPhone: "Teléfono",
      sService: "Servicio", sNotice: "Aviso del IRS", sNone: "no lo dio", sStory: "Con sus palabras", sQs: "Preguntas para ti (sin responder, regla del estudio)",
      sBook: "Reserva", sNoBook: "todavía sin reservar (enlace enviado)", sPortal: "Portal", sPortalNew: "cuenta creada ✓", sPortalEx: "enlace de acceso enviado ✓", sPortalLater: "enlace enviado, pendiente",
      sRules: "Reglas", sRulesTxt: "no se pasó la llamada ✓{n} · sin asesoramiento impositivo ✓", sTransfers: " (lo pidió {k}×)", sLang: "Idioma", sFlag: "⚠️ Urgente: aviso del IRS",
      sAviso: "🔔 En la versión real este resumen le llega al dueño en segundos por email/SMS. En esta demo no se envía nada.",
      dows: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"], months: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"],
      langName: "Español",
      closedNow: "Ahora la oficina está cerrada (abre {next}) y atiende solo con cita, así que te dejo la cita agendada ahora mismo.",
      openAppt: "🟢 Oficina abierta · se atiende solo con cita, te la reservo",
      closedAppt: "🌙 Oficina cerrada (abre {next}) · te reservo la cita igual",
      walkin: "{firm} atiende solo con cita previa, así que sin cita no te pueden recibir. Te la reservo aquí mismo, a cualquier hora.",
      askOffice: "¿Qué oficina te queda mejor?", sOffice: "Oficina", sChannel: "Canal", chWeb: "Chat de la web", chWa: "WhatsApp",
      waSub: "WhatsApp · {num} (simulado)", waLegal: "Chat de WhatsApp simulado para esta demo · no se envía nada",
      today: "hoy", tomorrow: "mañana", at: "a las", nextFmt: "{when} {at} {time}"
    }
  };
  function owner() { return CFG.owner[L] || CFG.owner.en; }
  function T(k, v) {
    var s = (S[L][k] != null ? S[L][k] : S.en[k]) || "";
    v = Object.assign({ firm: CFG.firm, owner: owner(), owner_c: owner().charAt(0).toUpperCase() + owner().slice(1), portal: CFG.portalName, tz: CFG.tzLabel }, v || {});
    return s.replace(/\{(\w+)\}/g, function (m, x) { return v[x] != null ? v[x] : m; });
  }

  // ---------- tiempo (zona del estudio; ?r24now=AAAA-MM-DDTHH:MM para pruebas) ----------
  function nowTz() {
    var q = (location.search.match(/[?&]r24now=([^&]+)/) || [])[1];
    if (q) { var p = decodeURIComponent(q).match(/(\d+)-(\d+)-(\d+)T(\d+):(\d+)/);
      if (p) return { y: +p[1], m: +p[2] - 1, d: +p[3], dow: new Date(+p[1], +p[2] - 1, +p[3]).getDay(), min: +p[4] * 60 + +p[5] }; }
    var f = new Intl.DateTimeFormat("en-US", { timeZone: CFG.tz, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
    var o = {}; f.formatToParts(new Date()).forEach(function (x) { o[x.type] = x.value; });
    var y = +o.year, m = +o.month - 1, d = +o.day;
    return { y: y, m: m, d: d, dow: new Date(y, m, d).getDay(), min: (+o.hour % 24) * 60 + +o.minute };
  }
  function isOpen(n) { return !!CFG.hours && (CFG.hours[n.dow] || []).some(function (r) { return n.min >= r[0] && n.min < r[1]; }); }
  function fmtTime(min) { var h = Math.floor(min / 60), mm = ("0" + (min % 60)).slice(-2); if (L === "es") return h + ":" + mm; return ((h + 11) % 12 + 1) + ":" + mm + (h < 12 ? " AM" : " PM"); }
  function nextOpen(n) {
    if (!CFG.hours) return "";
    for (var i = 0; i < 8; i++) {
      var dt = new Date(n.y, n.m, n.d + i), rs = CFG.hours[dt.getDay()] || [];
      for (var j = 0; j < rs.length; j++) if (i > 0 || rs[j][0] > n.min) {
        var when = i === 0 ? T("today") : i === 1 ? T("tomorrow") : (L === "es" ? "el " : "") + (L === "es" ? ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"] : ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"])[dt.getDay()];
        return T("nextFmt", { when: when, at: T("at"), time: fmtTime(rs[j][0]) });
      }
    }
    return "";
  }
  function bizDays(n, k) {
    var out = [];
    for (var i = 1; out.length < k && i < 15; i++) { var dt = new Date(n.y, n.m, n.d + i), w = dt.getDay(); if (w > 0 && w < 6) out.push(dt); }
    return out;
  }
  function fmtDay(dt) { return L === "es" ? S.es.dows[dt.getDay()] + " " + dt.getDate() + " " + S.es.months[dt.getMonth()] : S.en.dows[dt.getDay()] + ", " + S.en.months[dt.getMonth()] + " " + dt.getDate(); }

  // ---------- texto ----------
  function norm(s) { return (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9@.\s-]/g, " ").replace(/\s+/g, " ").trim(); }
  var ES_W = " hola tengo me llego carta que no se mi mis el la los las una un es por para con negocio impuestos declaracion soy cliente nuevo quiero hablar contador gracias necesito ayuda pagar deuda ".split(" ");
  var EN_W = " hi hello i have got the a letter my is for with business taxes return am client new want talk need help pay owe thanks do what ".split(" ");
  function guessLang(t) { var w = norm(t).split(" "), e = 0, s = 0; w.forEach(function (x) { if (ES_W.indexOf(x) > 0) s++; if (EN_W.indexOf(x) > 0) e++; }); return s >= 2 && s > e ? "es" : (e >= 2 && e > s ? "en" : null); }
  var RX = {
    transfer: /\b(speak|talk|chat)\s+(to|with)\s+(him|her|them|the cpa|the accountant|a cpa|an accountant|someone|somebody|a person|a human|a real person|the owner|karl|clay|the boss)\b|\btransfer\b|\bput me through\b|\breal person\b|\bhuman\b|\boperator\b|\bconnect me\b|\bhablar con (el|la|un|una|alguien|algun|una persona|el contador|la contadora|el dueno|el cpa)\b|\bpasame\b|\bpasarme\b|\bcomunicar(me)? con\b|\bpersona real\b|\btransferir\b|\bun humano\b/,
    advice: /\bshould i\b|\bdo i (have|need) to (pay|file|respond|answer)\b|\bcan i (deduct|write off|claim|ignore)\b|\bis (it|this|that) (deductible|a scam|legit|real|serious|bad)\b|\bhow much (will|do|would) i (owe|pay|get)\b|\bwhat (does|do) (this|the|it) (notice|letter)? ?mean\b|\bwhat should i do\b|\bwhat do i do\b|\bam i (in trouble|going to)\b|\bwill (the irs|i get)\b|\bpenalt(y|ies) (be|go)\b|\bdebo pagar\b|\btengo que pagar\b|\bpuedo deducir\b|\bcuanto (voy a|tengo que) pagar\b|\bque significa\b|\bes (una )?estafa\b|\bque (hago|tengo que hacer|debo hacer)\b|\bme van a (multar|cobrar)\b|\bestoy en problemas\b|\bes grave\b/,
    price: /\b(how much (do you|does it|is it|do they) (charge|cost)|price|prices|pricing|fee|fees|rates?|cost)\b|\b(cuanto (cobran|cuesta|sale)|precio|precios|honorarios|tarifa|costo)\b/,
    hours: /\b(hours|open|opening|close|closing|horario|abren|abierto|cierran)\b/,
    contact: /\b(phone number|your number|email address|address|where are you|located|telefono|direccion|donde estan|mail de la oficina)\b/,
    portal: /\b(portal|taxdome|upload|documents?|subir|documentos?)\b/,
    walkin: /\b(walk ?in|walk-in|without (an )?appointment|stop by|come in today|sin cita|ir directamente|pasar por la oficina|puedo ir hoy|llegar sin)\b/,
    langq: /\b(spanish|espanol|english|ingles|hablan|do you speak)\b/,
    irs: /\b(irs|notice|cp ?\d{2,4}|ltr ?\d{3,4}|letter|audit|carta|aviso|auditoria|hacienda)\b/,
    biz: /\b(business|llc|s ?corp|c ?corp|company|bookkeeping|payroll|1120|1065|my shop|restaurant|negocio|empresa|compania|contabilidad|nomina|sociedad|corporacion|contratista|mi local)\b/,
    ind: /\b(personal|individual|1040|w-?2|my return|refund|tax return|declaracion|personales|reembolso)\b/,
    isNew: /\b(new client|first time|never worked|not a client|cliente nuevo|primera vez|no soy cliente)\b/,
    isEx: /\b(existing client|already a client|current client|i m a client|im a client|ya soy cliente|soy cliente de)\b/,
    cancel: /^(cancel|stop|quit|cancelar|salir|olvidalo)$/
  };

  // ---------- estado ----------
  var d, flow, body, input, status, panel, launch, opened = false, waMode = false;
  function reset() { d = { story: [], questions: [], transfers: 0, advice: 0, client: null, name: null, email: null, phone: null, service: null, notice: null, noticeCode: null, office: null, channel: (typeof waMode !== "undefined" && waMode) ? "wa" : "web", slot: null, slotTxt: null, portal: null, guess: null }; flow = "story"; }
  reset();

  function el(tag, cls, html) { var x = document.createElement(tag); if (cls) x.className = cls; if (html != null) x.innerHTML = html; return x; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function scroll() { body.scrollTop = body.scrollHeight; }
  function addUser(t) { var m = el("div", "r24-msg r24-user"); m.textContent = t; body.appendChild(m); scroll(); }
  var q = [], busy = false; // cola de mensajes del bot (para que "Escribiendo…" no se superponga)
  function addBot(t, chips, cls, html) { q.push([t, chips, cls, html]); if (!busy) pump(); }
  function pump() {
    var it = q.shift(); if (!it) { busy = false; return; } busy = true;
    var ty = el("div", "r24-typing", L === "es" ? "Escribiendo…" : "Typing…"); body.appendChild(ty); scroll();
    setTimeout(function () {
      ty.remove();
      var m = el("div", "r24-msg r24-bot" + (it[2] ? " " + it[2] : ""), it[3] ? it[0] : esc(it[0])); body.appendChild(m);
      if (it[1] && it[1].length) {
        var w = el("div", "r24-chips");
        it[1].forEach(function (c) {
          var b = el("button", "r24-chip" + (c.main ? " r24-main" : ""), esc(c.t)); b.type = "button";
          if (c.k) b.setAttribute("data-k", c.k);
          b.onclick = function () { w.remove(); handle(c.v != null ? c.v : c.t, c); };
          w.appendChild(b);
        });
        body.appendChild(w);
      }
      scroll(); pump();
    }, Math.min(900, 350 + it[0].length * 2));
  }

  function statusText() {
    if (!status) return;
    if (!CFG.hours) { status.className = "r24-status"; status.textContent = T("status24"); return; }
    var n = nowTz(), o = isOpen(n); status.className = "r24-status" + (o ? "" : " r24-closed");
    status.textContent = CFG.apptOnly ? T(o ? "openAppt" : "closedAppt", { next: nextOpen(n) }) : T(o ? "statusOpen" : "statusClosed");
  }

  function build() {
    var B = CFG.base;
    var css = document.createElement("link"); css.rel = "stylesheet"; css.href = B + "recepcion-cpa.css"; document.head.appendChild(css);
    var ban = el("div", "r24-demo-banner", esc(CFG.banner[L])); ban.setAttribute("role", "note"); document.body.appendChild(ban);
    launch = el("button", "r24-launch"); launch.type = "button"; document.body.appendChild(launch);
    panel = el("div", "r24-panel"); panel.setAttribute("role", "dialog");
    panel.innerHTML = '<div class="r24-head"><div class="r24-av"><img class="r24-face" src="' + B + 'avatar.svg" alt=""></div><div class="r24-ht"><b><span class="r24-ttl"></span> <span class="r24-online"></span></b><small>' + esc(CFG.firm) + ' · <span class="r24-sub"></span></small></div><div class="r24-lang" role="group" aria-label="Language"><button type="button" class="r24-lb" data-l="en">EN</button><button type="button" class="r24-lb" data-l="es">ES</button></div><button class="r24-x" type="button" aria-label="Close">×</button></div><div class="r24-status"></div><div class="r24-body" aria-live="polite"></div><form class="r24-foot"><input class="r24-in" type="text" autocomplete="off" maxlength="400"><button class="r24-send" type="submit"></button></form><div class="r24-legal"></div>';
    document.body.appendChild(panel);
    body = panel.querySelector(".r24-body"); input = panel.querySelector(".r24-in"); status = panel.querySelector(".r24-status");
    launch.onclick = openWeb;
    panel.querySelector(".r24-x").onclick = function () { panel.classList.remove("r24-open"); launch.classList.remove("r24-hide"); };
    panel.querySelector("form").onsubmit = function (ev) { ev.preventDefault(); var t = input.value.trim(); if (!t) return; input.value = ""; handle(t); };
    [].forEach.call(panel.querySelectorAll(".r24-lb"), function (b) { b.onclick = function () { setLang(b.getAttribute("data-l")); }; });
    document.addEventListener("click", function (ev) {
      var w = ev.target.closest && ev.target.closest("[data-r24-wa]"); if (w) { ev.preventDefault(); ev.stopPropagation(); openWa(); return; }
      var a = ev.target.closest && ev.target.closest("[data-r24-open]"); if (a) { ev.preventDefault(); openWeb(); }
    }, true);
    paintLang();
  }
  function paintLang() {
    launch.innerHTML = '<img class="r24-face" src="' + CFG.base + 'avatar.svg" alt=""><span>' + esc(T("launch")) + '</span><span class="r24-dot"></span>';
    launch.setAttribute("aria-label", T("open"));
    panel.setAttribute("aria-label", T("title"));
    panel.querySelector(".r24-ttl").textContent = T("title"); panel.querySelector(".r24-online").textContent = T("online");
    panel.querySelector(".r24-sub").textContent = CFG.sub[L] || CFG.sub.en;
    input.placeholder = T("ph"); panel.querySelector(".r24-send").textContent = T("send"); panel.querySelector(".r24-legal").textContent = T("legal");
    var ban = document.querySelector(".r24-demo-banner"); if (ban) ban.textContent = CFG.banner[L];
    if (typeof paintWa === "function") paintWa();
    [].forEach.call(panel.querySelectorAll(".r24-lb"), function (b) { b.classList.toggle("r24-on", b.getAttribute("data-l") === L); });
    statusText();
    document.dispatchEvent(new CustomEvent("r24:lang", { detail: L }));
  }
  function paintWa() {
    if (!panel) return; panel.classList.toggle("r24-wa", waMode);
    var sub = panel.querySelector(".r24-ht small"), lg = panel.querySelector(".r24-legal");
    if (waMode && CFG.wa) { sub.textContent = T("waSub", { num: CFG.wa.number }); lg.textContent = T("waLegal"); panel.querySelector(".r24-ttl").textContent = CFG.firm; panel.querySelector(".r24-online").textContent = ""; }
    else { sub.innerHTML = esc(CFG.firm) + ' · <span class="r24-sub">' + esc(CFG.sub[L] || CFG.sub.en) + "</span>"; lg.textContent = T("legal"); panel.querySelector(".r24-ttl").textContent = T("title"); panel.querySelector(".r24-online").textContent = T("online"); }
  }
  function openWa() {
    if (!CFG.wa) { open(); return; }
    if (!waMode) { waMode = true; reset(); d.channel = "wa"; body.innerHTML = ""; opened = false; }
    open();
  }
  function openWeb() { if (waMode) { waMode = false; reset(); d.channel = "web"; body.innerHTML = ""; opened = false; } open(); }
  function setLang(l, silent) { if (l === L) return; L = l; paintLang(); if (opened && !silent) reprompt(); }

  function greetText() { var n = nowTz(); return T("greet") + (CFG.apptOnly && CFG.hours && !isOpen(n) ? "\n\n" + T("closedNow", { next: nextOpen(n) }) : ""); }
  function startChips() { return [{ t: T("qNew"), v: "__new" }, { t: T("qExisting"), v: "__ex" }, { t: T("qIrs"), v: "__irs" }, { t: T("qBiz"), v: "__biz" }, { t: T("qTalk"), v: "__talk" }, { t: T("qHours"), v: "__hours" }]; }
  function open() {
    panel.classList.add("r24-open"); launch.classList.add("r24-hide"); statusText();
    if (!opened) { opened = true; addBot(greetText(), startChips()); }
    paintWa();
    setTimeout(function () { input.focus(); }, 50);
  }

  // ---------- pasos ----------
  function svName(s) { return T({ ind: "svInd", biz: "svBiz", irs: "svIrs", other: "svOther" }[s]); }
  function classify(t) { var n = norm(t); if (RX.irs.test(n)) return "irs"; if (RX.biz.test(n)) return "biz"; if (RX.ind.test(n)) return "ind"; return null; }
  function spelled(name) {
    var HY = L === "es" ? "(guion)" : "(hyphen)", AP = L === "es" ? "(apóstrofo)" : "(apostrophe)";
    return name.split(/\s+/).map(function (w) { return Array.from(w.toLocaleUpperCase(L === "es" ? "es" : "en-US")).map(function (c) { return c === "-" ? HY : (c === "'" || c === "’") ? AP : c; }).join("-"); }).join("  ·  ");
  }
  function niceName(t) {
    var nm = t.replace(/^(my name is|i am|i'm|it's|its|this is|me llamo|soy|mi nombre es)\s+/i, "").replace(/[.,;]+$/, "").replace(/\s+/g, " ").trim();
    if (nm === nm.toLowerCase() || nm === nm.toUpperCase()) nm = nm.toLowerCase().replace(/(^|[\s'-])(\p{L})/gu, function (m, a, b) { return a + b.toUpperCase(); });
    return nm;
  }
  function noteCode(t) { var m = (t || "").match(/\b(cp|ltr|lt)\s?-?(\d{2,4}[a-z]?)\b/i); if (m && !d.noticeCode) d.noticeCode = m[1].toUpperCase() + (m[1].toLowerCase() === "cp" ? "" : " ") + m[2].toUpperCase(); }
  function first() { return (d.name || "").split(" ")[0]; }
  function fmtPhone(t) {
    var dg = t.replace(/[^\d+]/g, "");
    var us = dg.replace(/^\+?1(?=\d{10}$)/, "");
    if (/^\d{10}$/.test(us) && /^[2-9]/.test(us)) return "(" + us.slice(0, 3) + ") " + us.slice(3, 6) + "-" + us.slice(6);
    if (/^\+\d{8,15}$/.test(dg)) return dg;
    return null;
  }

  function ask(step) {
    flow = step;
    if (step === "story") addBot(greetText(), startChips());
    else if (step === "more") addBot(T("more"), [{ t: T("done"), v: "__done", main: true }]);
    else if (step === "client") addBot(T("askClient"), [{ t: T("cNew"), v: "__new" }, { t: T("cEx"), v: "__ex" }]);
    else if (step === "name") addBot(T("askName"));
    else if (step === "spell") addBot(T("spell", { spelled: spelled(d.name), name: d.name }), [{ t: T("yes"), v: "__yes", main: true }, { t: T("fix"), v: "__fix" }]);
    else if (step === "email") addBot(T("askEmail", { first: first() }));
    else if (step === "phone") addBot(T("askPhone"));
    else if (step === "service") {
      var opts = ["ind", "biz", "irs", "other"]; if (d.guess) opts.sort(function (a, b) { return (b === d.guess) - (a === d.guess); });
      addBot(T("askService") + (d.guess ? T("svFoot", { guess: svName(d.guess) }) : ""), opts.map(function (s) { return { t: svName(s), v: "__sv_" + s, main: s === d.guess }; }));
    }
    else if (step === "notice") addBot(d.noticeCode ? T("askNotice2", { code: d.noticeCode }) : T("askNotice"), [{ t: T("skip"), v: "__skip" }]);
    else if (step === "office") addBot(T("askOffice"), CFG.offices.map(function (o, i) { return { t: o[L] || o.en, v: "__of_" + i }; }));
    else if (step === "route") route();
  }
  function toRoute() { if (CFG.offices && d.office == null) ask("office"); else ask("route"); }
  function reprompt() { if (flow === "story") addBot(greetText(), startChips()); else ask(flow); }
  function docs() { return T(d.service === "irs" ? "docsIrs" : "docsGen"); }
  function route() {
    flow = "route";
    var nw = d.client !== "existing";
    addBot(T(nw ? "routeNew" : "routeEx", { docs: docs() }), routeChips());
  }
  function routeChips() {
    var nw = d.client !== "existing", c = [];
    if (!d.slot) c.push({ t: T(nw ? "bookNew" : "bookEx"), v: "__book", main: true, k: "book" });
    if (!d.portal) c.push({ t: T(nw ? "portalNew" : "portalEx"), v: "__portal", k: "portal" });
    if (!d.portal && d.slot) c.push({ t: T("later"), v: "__later" });
    return c;
  }
  function afterRouteStep() {
    if (d.slot && d.portal) { finish(); return; }
    if (d.slot && !d.portal) { addBot(T("nextPortal"), routeChips()); return; }
    if (!d.slot) addBot(T("nextBook"), routeChips());
  }
  function finish() {
    flow = "done";
    addBot(T("bye", { first: first(), slot: d.slotTxt }));
    addBot(summaryHtml(), [{ t: T("restart"), v: "__restart" }], "r24-owner", true);
  }
  function summaryHtml() {
    function row(k, v) { return "<div><b>" + esc(T(k)) + ":</b> " + v + "</div>"; }
    var h = '<div style="font-weight:700;margin-bottom:4px">' + esc(T("sumTitle")) + "</div>";
    if (d.service === "irs") h += '<div style="color:#9a5b00;font-weight:700">' + esc(T("sFlag")) + "</div>";
    h += row("sType", esc(T(d.client === "existing" ? "sEx" : "sNew")));
    h += row("sName", esc(d.name) + ' <span style="color:#5b6f84">(' + esc(spelled(d.name)) + ")</span>");
    h += row("sEmail", esc(d.email)) + row("sPhone", esc(d.phone));
    h += row("sService", esc(svName(d.service || "other")));
    if (d.service === "irs") h += row("sNotice", esc(d.notice || T("sNone")));
    if (d.story.length) h += row("sStory", "“" + esc(d.story.join(" ")) + "”");
    if (d.questions.length) h += row("sQs", d.questions.map(function (x) { return "“" + esc(x) + "”"; }).join(" · "));
    h += row("sBook", d.slot ? esc(d.slotTxt + " " + CFG.tzLabel + " — " + (CFG.linkNames[d.client === "existing" ? "existing" : "newClient"][L])) : esc(T("sNoBook")));
    h += row("sPortal", esc(T(d.portal === "done" ? (d.client === "existing" ? "sPortalEx" : "sPortalNew") : "sPortalLater")));
    h += row("sRules", esc(T("sRulesTxt", { n: d.transfers ? T("sTransfers", { k: d.transfers }) : "" })));
    if (CFG.offices && d.office != null) h += row("sOffice", esc(CFG.offices[d.office][L] || CFG.offices[d.office].en));
    if (CFG.wa) h += row("sChannel", esc(T(d.channel === "wa" ? "chWa" : "chWeb")) + (d.channel === "wa" ? " " + esc(CFG.wa.number) : ""));
    h += row("sLang", esc(S[L].langName));
    h += '<div style="margin-top:6px;color:#5b6f84">' + esc(T("sAviso")) + "</div>";
    return h;
  }
  window.R24_SUMMARY = function () { return JSON.parse(JSON.stringify(d)); };

  // ---------- simulaciones (placeholders tipo Calendly / TaxDome) ----------
  function sheet(html) { var ov = el("div", "r24-ov"), sh = el("div", "r24-sheet", html); ov.appendChild(sh); panel.appendChild(ov); return { ov: ov, sh: sh, close: function () { ov.remove(); } }; }
  function linkFor(kind) { return kind === "book" ? (d.client === "existing" ? CFG.links.existing : CFG.links.newClient) : (d.client === "existing" ? CFG.links.portalLogin : CFG.links.portal); }
  function realLink(u) { return /^https?:\/\//.test(u) && !CFG.mock; }
  function openBooking() {
    var u = linkFor("book"); if (realLink(u)) { window.open(u, "_blank", "noopener"); return; }
    var what = CFG.linkNames[d.client === "existing" ? "existing" : "newClient"][L];
    var n = nowTz(), days = bizDays(n, 3), SL = [570, 600, 630, 780, 870, 960];
    var h = "<h4>" + esc(T("sheetBook")) + "</h4><div style=\"font-size:13px;color:#5b6f84\">" + esc(CFG.firm + " · " + what) + "</div><div class=\"r24-ph\">" + esc(T("sheetPh")) + " · " + esc(u) + "</div>";
    days.forEach(function (dt, i) { h += '<div class="r24-day">' + esc(fmtDay(dt)) + '</div><div class="r24-slots">' + SL.filter(function (x, j) { return (i + j) % 3 !== 2; }).map(function (m) { return '<button type="button" class="r24-slot" data-s="' + i + "|" + m + '">' + esc(fmtTime(m)) + "</button>"; }).join("") + "</div>"; });
    h += '<label>' + esc(T("fName")) + '</label><input class="r24-f" readonly value="' + esc(d.name) + '"><label>' + esc(T("fEmail")) + '</label><input class="r24-f" readonly value="' + esc(d.email) + '">';
    h += '<div class="r24-row"><button type="button" class="r24-btn r24-sec" data-a="back">' + esc(T("back")) + '</button><button type="button" class="r24-btn" data-a="ok" disabled>' + esc(T("confirm")) + "</button></div>";
    var s = sheet(h), pick = null, okb = s.sh.querySelector('[data-a="ok"]');
    [].forEach.call(s.sh.querySelectorAll(".r24-slot"), function (b) { b.onclick = function () { [].forEach.call(s.sh.querySelectorAll(".r24-slot"), function (x) { x.classList.remove("r24-sel"); }); b.classList.add("r24-sel"); pick = b.getAttribute("data-s").split("|"); okb.disabled = false; }; });
    s.sh.querySelector('[data-a="back"]').onclick = function () { s.close(); addBot(T("nextBook"), routeChips()); };
    okb.onclick = function () {
      var dt = days[+pick[0]]; s.close();
      d.slot = { date: dt.getFullYear() + "-" + ("0" + (dt.getMonth() + 1)).slice(-2) + "-" + ("0" + dt.getDate()).slice(-2), min: +pick[1] };
      d.slotTxt = fmtDay(dt) + " · " + fmtTime(+pick[1]);
      addBot(T("booked", { slot: d.slotTxt, what: what, email: d.email }), null, "r24-ok");
      afterRouteStep();
    };
  }
  function openPortal() {
    var u = linkFor("portal"); if (realLink(u)) { window.open(u, "_blank", "noopener"); d.portal = "done"; afterRouteStep(); return; }
    var h = "<h4>" + esc(T("sheetPortal")) + "</h4><div class=\"r24-ph\">" + esc(T("sheetPortalPh")) + " · " + esc(u) + "</div>";
    h += '<label>' + esc(T("fName")) + '</label><input class="r24-f" readonly value="' + esc(d.name) + '"><label>' + esc(T("fEmail")) + '</label><input class="r24-f" readonly value="' + esc(d.email) + '"><label>' + esc(T("fPhone")) + '</label><input class="r24-f" readonly value="' + esc(d.phone) + '">';
    h += '<div class="r24-row"><button type="button" class="r24-btn r24-sec" data-a="back">' + esc(T("back")) + '</button><button type="button" class="r24-btn" data-a="ok">' + esc(T("createAcc")) + "</button></div>";
    var s = sheet(h);
    s.sh.querySelector('[data-a="back"]').onclick = function () { s.close(); afterRouteStep(); };
    s.sh.querySelector('[data-a="ok"]').onclick = function () { s.close(); d.portal = "done"; addBot(T("portalDone", { email: d.email, docs: docs() }), null, "r24-ok"); afterRouteStep(); };
  }

  // ---------- reglas fijas e intenciones sueltas (valen en cualquier paso) ----------
  function rules(t, n) {
    var NM = (CFG.names || []).length ? new RegExp("\\b(talk|speak|hablar|comunicarme|comunicar)\\s+(to|with|con)\\s+(mr\\.? |el senor |don )?(" + CFG.names.join("|") + ")\\b") : null;
    if (RX.transfer.test(n) || (NM && NM.test(n))) {
      d.transfers++;
      if (["route", "done"].indexOf(flow) >= 0 || !d.email) { addBot(T(flow === "route" ? "ruleTransferBook" : "ruleTransfer"), null, "r24-rule"); }
      else addBot(T("ruleTransfer"), null, "r24-rule");
      return "transfer";
    }
    if (RX.advice.test(n)) { d.advice++; if (d.questions.indexOf(t) < 0) d.questions.push(t.slice(0, 200)); addBot(T("ruleAdvice"), null, "r24-rule"); return "advice"; }
    return null;
  }
  function sideIntent(t, n) {
    if (RX.price.test(n)) { d.questions.push(t.slice(0, 200)); addBot(T("price")); return true; }
    if (RX.hours.test(n) && !RX.irs.test(n)) { addBot(CFG.hoursTxt ? T("hoursPre") + CFG.hoursTxt[L] : T("hoursNo")); return true; }
    if (RX.contact.test(n) && CFG.contact) { addBot(T("contact", { contact: CFG.contact[L] || CFG.contact.en })); return true; }
    if (CFG.apptOnly && RX.walkin.test(n)) { addBot(T("walkin")); return true; }
    if (RX.langq.test(n)) { addBot(T("lang")); return true; }
    if (RX.portal.test(n) && !RX.irs.test(n)) { addBot(T("portalQ")); return true; }
    return false;
  }

  function handle(t, chip) {
    if (t === "__restart") { reset(); d.channel = waMode ? "wa" : "web"; body.innerHTML = ""; addBot(greetText(), startChips()); return; }
    addUser(chip ? chip.t : t);
    var n = norm(t);
    if (!chip && d.story.length === 0 && flow === "story") { var gl = guessLang(t); if (gl && gl !== L) setLang(gl, true); }
    if (!chip && RX.cancel.test(n)) { reset(); addBot(T("cancel"), startChips()); return; }
    // chips de inicio
    if (t === "__talk") { d.transfers++; addBot(T("ruleTransfer"), null, "r24-rule"); if (flow === "story") ask("client"); else reprompt(); return; }
    if (t === "__hours") { addBot(CFG.hoursTxt ? T("hoursPre") + CFG.hoursTxt[L] : T("hoursNo")); reprompt(); return; }
    if (t === "__irs") { d.story.push(T("qIrsText")); d.guess = "irs"; addBot(T("ackIrs")); ask("more"); return; }
    if (t === "__biz") { d.guess = "biz"; d.story.push(T("qBiz")); addBot(T("ackBiz")); ask("more"); return; }
    if (t === "__new" || t === "__ex") { d.client = t === "__new" ? "new" : "existing"; ask("name"); return; }
    if (t === "__done") { d.client ? ask("name") : ask("client"); return; }
    if (t === "__book") { openBooking(); return; }
    if (t === "__portal") { openPortal(); return; }
    if (t === "__later") { d.portal = "later"; addBot(T("portalSent")); finish(); return; }
    if (t === "__yes") { ask("email"); return; }
    if (t === "__fix") { flow = "name"; addBot(T("fixAsk")); return; }
    if (t === "__skip") { d.notice = d.noticeCode || null; addBot(T("noticeOk")); toRoute(); return; }
    if (/^__sv_/.test(t)) { d.service = t.slice(5); if (d.service === "irs") ask("notice"); else toRoute(); return; }
    if (/^__of_/.test(t)) { d.office = +t.slice(5); ask("route"); return; }

    // reglas fijas (no pasar llamadas, no asesorar) en cualquier paso de texto libre
    var datos = ["name", "email", "phone", "notice"].indexOf(flow) >= 0;
    var r = rules(t, n);
    if (r) {
      if (flow === "story" || flow === "more") { if (r === "advice" || n.split(" ").length > 6) d.story.push(t.slice(0, 300)); noteCode(t); d.guess = d.guess || classify(t); }
      if (flow === "story") { if (r === "transfer" && n.split(" ").length <= 8) { ask("client"); } else ask("more"); return; }
      if (flow === "done") { addBot(T("bye", { first: first(), slot: d.slotTxt || "—" })); return; }
      setTimeout(function () { reprompt(); }, 300); return;
    }
    var corta = n.split(" ").length <= 10 || /\?/.test(t);
    if (!datos && corta && sideIntent(t, n)) { if (flow !== "story") reprompt(); return; }

    switch (flow) {
      case "story":
        if (RX.isNew.test(n) && n.split(" ").length <= 6) { d.client = "new"; ask("name"); return; }
        if (RX.isEx.test(n) && n.split(" ").length <= 6) { d.client = "existing"; ask("name"); return; }
        if (/^(hi|hello|hey|hola|buenas|buen dia|good morning|good afternoon)\b/.test(n) && n.split(" ").length <= 3) { addBot(T("greet").split("\n")[1] || T("greet"), startChips()); return; }
        d.story.push(t.slice(0, 300)); noteCode(t); d.guess = classify(t);
        if (RX.isNew.test(n)) d.client = "new"; else if (RX.isEx.test(n)) d.client = "existing";
        addBot(T(d.guess === "irs" ? "ackIrs" : d.guess === "biz" ? "ackBiz" : d.guess === "ind" ? "ackInd" : "ackGen"));
        ask("more"); return;
      case "more":
        if (/^(no|nope|nothing|that s all|thats all|that s it|no thanks|nada|nada mas|eso es todo|es todo|no gracias)$/.test(n)) { d.client ? ask("name") : ask("client"); return; }
        d.story.push(t.slice(0, 300)); noteCode(t); d.guess = d.guess || classify(t);
        if (RX.isNew.test(n)) d.client = "new"; else if (RX.isEx.test(n)) d.client = "existing";
        addBot(T("moreOk"), [{ t: T("done"), v: "__done", main: true }]); return;
      case "client":
        if (RX.isEx.test(n) || /^(yes|yeah|yep|si|ya)\b/.test(n)) { d.client = "existing"; ask("name"); return; }
        if (RX.isNew.test(n) || /\b(no|new|nuevo|first|primera)\b/.test(n)) { d.client = "new"; ask("name"); return; }
        ask("client"); return;
      case "name":
        var nm = niceName(t);
        if (nm.length < 3 || nm.length > 70 || /\d|@/.test(nm) || nm.split(" ").length < 2) { addBot(T("badName")); return; }
        d.name = nm; ask("spell"); return;
      case "spell":
        if (/^(yes|yep|yeah|correct|that s right|right|ok|si|es correcto|correcto|exacto|perfecto)\b/.test(n)) { ask("email"); return; }
        if (/^(no|wrong|incorrect|fix|mal|corregir)\b/.test(n)) { flow = "name"; addBot(T("fixAsk")); return; }
        var nm2 = niceName(t); if (nm2.split(" ").length >= 2 && !/\d|@/.test(nm2)) { d.name = nm2; ask("spell"); return; }
        ask("spell"); return;
      case "email":
        var em = (t.match(/[^\s@<>()]+@[^\s@<>()]+\.[a-z]{2,}/i) || [])[0];
        if (!em) { addBot(T("badEmail")); return; }
        d.email = em.toLowerCase(); ask("phone"); return;
      case "phone":
        var ph = fmtPhone(t); if (!ph) { addBot(T("badPhone")); return; }
        d.phone = ph; ask("service"); return;
      case "service":
        var g = classify(t) || (/other|otra|else/.test(n) ? "other" : null);
        if (g) { d.service = g; if (g === "irs") ask("notice"); else toRoute(); return; }
        ask("service"); return;
      case "notice":
        var nt = /^(skip|saltar|no|no la tengo|dont have it|i don t have it)$/.test(n) ? null : t.slice(0, 120).replace(/^notice\s+/i, "");
        noteCode(nt || ""); d.notice = d.noticeCode ? d.noticeCode + (nt && nt.toUpperCase().replace(/\s+/g, "").indexOf(d.noticeCode.replace(/\s+/g, "")) < 0 ? " · " + nt : (nt ? " · " + nt.replace(new RegExp(d.noticeCode.replace(/\s+/g, "\\s?"), "i"), "").replace(/^[\s,.-]+/, "") : "")) : nt;
        addBot(T("noticeOk")); toRoute(); return;
      case "office":
        var oi = -1; (CFG.offices || []).forEach(function (o, i) { if (oi < 0 && norm(o.en + " " + o.es).split(" ").some(function (w) { return w.length > 3 && n.indexOf(w) >= 0; })) oi = i; });
        if (oi >= 0) { d.office = oi; ask("route"); return; } ask("office"); return;
      case "route":
        d.questions.push(t.slice(0, 200)); addBot(T("fallback"), routeChips()); return;
      case "done":
        d.questions.push(t.slice(0, 200)); addBot(T("fallback"), [{ t: T("restart"), v: "__restart" }]); return;
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build); else build();
  window.R24 = { open: openWeb, openWa: openWa, setLang: function (l) { setLang(l); }, lang: function () { return L; } };
})();
