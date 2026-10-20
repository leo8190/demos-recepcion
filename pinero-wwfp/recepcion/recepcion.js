/* R24-BRIEF-1018: avatar humano, botones rápidos, "que me llamen", aviso al equipo, sin "no tengo ese dato" */
/* Recepción 24 h · Clínica Piñero & Bilbao (Sevilla, Los Remedios) — DEMO privada. BILINGÜE ES/EN.
   100% del lado del cliente: sin APIs, sin claves, sin envío de datos.
   Todas las respuestas salen de textos publicados en pinerobilbao.es (oct. 2026). Trato de «tú», como su web
   (home, tratamientos, la clínica). Atienden a pacientes «locales e internacionales»: si el paciente escribe en inglés,
   la recepción contesta en inglés (y vuelve al español si escribe en español).
   Su web NO publica el horario: la recepción no inventa horas; toma la cita o el «que me llamen» con franja mañana/tarde
   (la misma que pide su formulario) y el equipo llama para confirmar. Tampoco publica mutuas: se deriva al 954 084 916. */
(function () {
  "use strict";
  var C = {
    nombre: "Clínica Piñero & Bilbao",
    tel: "954 084 916", telh: "+34954084916",
    wa: "https://wa.me/34954084916",
    email: "info@pinerobilbao.es",
    dir: "C/ Virgen de Luján, 11, bajo, 41011 Sevilla (Los Remedios, cerca de Triana)",
    maps: "https://www.google.com/maps/search/?api=1&query=Cl%C3%ADnica+Dental+Pi%C3%B1ero+%26+Bilbao+C.+Virgen+de+Luj%C3%A1n+11+Sevilla"
  };
  var LANG = /^en/i.test(document.documentElement.lang || "") ? "en" : "es";
  function T(es, en) { return LANG === "en" ? en : es; }

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
  var EN_W = "the you your do does is are have has can could would i im my me we what where when how much many which who open opening hours hour appointment book booking speak english hello hi hey please thanks thank need want tooth teeth price prices cost costs implant implants braces cleaning whitening children kids child emergency pain hurts hurt toothache parking insurance call back dentist dentists any available tomorrow today week weekend saturday sunday monday friday clinic offer accept pay payment finance financing there yes good morning afternoon evening visit free first sedation scared afraid veneers aligners gums".split(" ");
  var ES_W = "que el la los las de del teneis haceis cuanto cuesta donde cuando cita hola gracias quiero necesito puedo precio precios dientes diente muela ninos horario abris abierto sabado domingo por para con una un es esta hay mi buenas buenos tardes dias habla hablais ingles tengo me duele llamar llamen pedir vale primera visita gratis".split(" ");
  function detectLang(t) {
    var w = norm(t).split(" "), en = 0, es = 0;
    w.forEach(function (x) { if (EN_W.indexOf(x) >= 0) en++; if (ES_W.indexOf(x) >= 0) es++; });
    if (/[¿¡ñáéíóú]/i.test(t)) es += 2;
    if (en > es) return "en"; if (es > en) return "es"; return null;
  }

  var CITA_CHIP = function () { return { t: T("Pedir cita (1ª visita gratis)", "Book (free first visit)"), a: "cita" }; };
  var URG_CHIP = function () { return { t: T("🦷 Tengo una urgencia", "🦷 Dental emergency"), a: "urgencia" }; };
  var LLAMADA_CHIP = function () { return { t: T("📲 Que me llamen", "📲 Call me back"), a: "llamada" }; };
  var LANG_CHIP = function () { return LANG === "en" ? { t: "🇪🇸 Español", a: "lang", v: "es" } : { t: "🇬🇧 English", a: "lang", v: "en" }; };
  function AVISO() { return T("🔔 El equipo de la clínica recibe este pedido al instante (en esta demo no se envía nada).", "🔔 The clinic team receives this request instantly (in this demo nothing is sent)."); }
  var lastQ = "";
  var TEL = function () { return { t: T("Llamar ", "Call ") + C.tel, tel: C.telh }; };
  var WA = function () { return { t: "WhatsApp " + C.tel, url: C.wa, wa: true }; };
  function Q(es, en, q) { return function () { return { t: T(es, en), q: q || T(es, en) }; }; }
  function mk(c) { return typeof c === "function" ? c() : c; }
  var BENEF = "Junta de Andalucía, Carné Joven, Tarjeta Sesentaycinco, Familia Numerosa, Ines Rosales, Círculo Mercantil e Industrial de Sevilla, Ingenieros Industriales de Andalucía y Club Náutico Sevilla";
  var NO_HORARIO = function () { return T("Su web no publica el horario de la clínica, así que no te voy a dar unas horas a ojo.", "Their website doesn't publish the clinic's opening hours, so I won't guess them."); };

  var KB = [
    { id: "valoracion", k: ["primera visita", "primera cita", "primera consulta", "primera vez", "consulta gratis", "consulta gratuita", "visita gratuita", "valoracion", "diagnostico", "gratis", "gratuito", "gratuita", "sin coste", "presupuesto", "sin compromiso", "segunda opinion"],
      ke: ["first visit", "first appointment", "consultation", "free", "quote", "estimate", "assessment", "check up", "checkup", "second opinion"],
      a: "¡Sí! La primera visita es gratuita y sin ningún compromiso: evalúan el estado de tu boca, resuelven tus dudas, te explican las opciones de tratamiento para tu caso y te dan un presupuesto detallado, «sin sorpresas».",
      ae: "Yes! The first visit is free and with no obligation: they assess your mouth, answer your questions, explain the treatment options for your case and give you a detailed quote, \"no surprises\".", c: [CITA_CHIP, Q("Financiación", "Financing", T("financiación", "financing")), LLAMADA_CHIP] },
    { id: "financiacion", k: ["financiacion", "financiais", "financiar", "plazos", "pagar a plazos", "cuotas", "al mes", "mensual", "mensualidades", "pago aplazado", "facilidades pago", "formas pago", "opciones pago"],
      ke: ["financing", "finance", "instalments", "installments", "monthly", "pay monthly", "payment plan", "payment options"],
      a: "Sí: tienen opciones de financiación adaptadas a cada caso, «para que el precio no sea un obstáculo». Las condiciones te las explica su coordinadora en la primera visita (que es gratuita), junto con el presupuesto detallado y sin costes ocultos.",
      ae: "Yes: they offer financing options tailored to each case, \"so price isn't an obstacle\". Their coordinator explains the conditions at the first visit (which is free), together with a detailed quote with no hidden costs.", c: [CITA_CHIP, Q("Descuentos", "Discounts", T("descuentos", "discounts")), LLAMADA_CHIP] },
    { id: "beneficios", k: ["descuento", "descuentos", "beneficio", "beneficios", "carne joven", "familia numerosa", "sesentaycinco", "tarjeta 65", "junta andalucia", "funcionario", "convenio", "convenios", "club nautico", "circulo mercantil", "ingenieros", "ines rosales", "oferta", "ofertas", "promocion"],
      ke: ["discount", "discounts", "offer", "offers", "promotion", "benefits"],
      a: "Ofrecen beneficios a titulares de: " + BENEF + ", «y más… ¡pregúntanos!». En qué consiste cada beneficio no lo detallan en la web: te lo cuentan en la clínica o por teléfono/WhatsApp al " + C.tel + ".",
      ae: "They offer benefits for holders of: " + BENEF + " (\"and more… ask us!\"). The exact benefit isn't detailed on the website: the clinic explains it in person or by phone/WhatsApp on " + C.tel + ".", c: [CITA_CHIP, WA, LLAMADA_CHIP] },
    { id: "precio", k: ["precio", "precios", "tarifa", "tarifas", "cuanto cuesta", "cuanto vale"],
      ke: ["price", "prices", "cost", "how much", "fee", "fees", "rates"],
      a: "Depende de cada caso, así que prefiero no darte una cifra a ojo. Lo que hacen: en la primera visita (gratuita) te dan un presupuesto personalizado y detallado, sin costes ocultos, y tienen opciones de financiación.",
      ae: "It depends on each case, so I'd rather not guess a figure. What they do: at the first visit (free) they give you a personalised, detailed quote with no hidden costs, and they offer financing.", c: [CITA_CHIP, Q("Financiación", "Financing", T("financiación", "financing")), LLAMADA_CHIP] },
    { id: "precio_implante", k: ["precio implante", "cuanto cuesta implante", "cuanto vale implante", "implante cuesta", "coste implante"],
      ke: ["implant price", "implant cost", "how much implant"],
      a: "En las preguntas frecuentes de implantes de su web lo explican así: el precio varía según el número de implantes, el tipo de corona (zirconio o porcelana sobre metal) y si hace falta regeneración ósea o elevación de seno; el implante en sí «ronda los 720 €».\nEl presupuesto cerrado te lo dan en la primera visita gratuita, sin costes ocultos y con financiación.",
      ae: "Their implant FAQ explains it like this: the price depends on the number of implants, the type of crown (zirconia or porcelain-fused-to-metal) and whether bone regeneration or a sinus lift is needed; the implant itself is \"around €720\".\nYou get the full quote at the free first visit, with no hidden costs and with financing.", c: [CITA_CHIP, Q("Financiación", "Financing", T("financiación", "financing")), LLAMADA_CHIP] },
    { id: "implantes", k: ["implante", "implantes", "implantologia", "dientes fijos", "falta diente", "perdido diente", "reponer diente", "carga inmediata", "titanio", "poco hueso", "injerto", "regeneracion osea", "osteointegracion", "elevacion seno", "cirugia guiada"],
      ke: ["implant", "implants", "missing tooth", "lost tooth", "bone graft", "guided surgery", "same day teeth"],
      a: "Sí, es una de sus especialidades:\n• Cirugía guiada por ordenador (planificación 3D y férulas quirúrgicas): menos invasiva y sin puntos en muchos casos.\n• Coronas de zirconio o de porcelana sobre metal.\n• Sedación consciente si te da miedo o el tratamiento es largo.\n• Proceso completo de 3 a 6 meses (osteointegración de unos 3–4 meses); en algunos casos, carga inmediata con corona provisional el mismo día.\n• Si hay poco hueso, regeneración ósea previa (luego hay que esperar unos 9 meses para el implante).\nEmpieza con la primera visita gratuita y un TAC o radiografía.",
      ae: "Yes, it's one of their specialties:\n• Computer-guided surgery (3D planning and surgical guides): less invasive, often with no stitches.\n• Zirconia or porcelain-fused-to-metal crowns.\n• Conscious sedation if you're nervous or the treatment is long.\n• Whole process takes 3 to 6 months (about 3–4 months of osseointegration); in some cases, immediate loading with a temporary crown the same day.\n• If there isn't enough bone, bone regeneration first (then about 9 months before the implant).\nIt starts with the free first visit and a CT scan or X-ray.", c: [CITA_CHIP, Q("¿Duele?", "Does it hurt?", T("duele implante", "implant hurt")), Q("¿Precio?", "Price?", T("precio implante", "implant price"))] },
    { id: "implante_dolor", k: ["duele implante", "implante duele", "postoperatorio", "molestias implante"],
      ke: ["implant hurt", "implant painful", "does implant hurt"],
      a: "Según su web, no: se coloca con anestesia local, así que no sientes dolor durante la intervención, y además ofrecen sedación consciente. Las molestias de después suelen ser leves y se controlan con analgésicos habituales.",
      ae: "According to their website, no: it's placed under local anaesthetic so you feel no pain during the procedure, and they also offer conscious sedation. Discomfort afterwards is usually mild and controlled with regular painkillers.", c: [CITA_CHIP, Q("Sedación", "Sedation", T("sedación", "sedation"))] },
    { id: "ortodoncia", k: ["ortodoncia", "invisalign", "ortodoncia invisible", "invisible", "alineador", "alineadores", "bracket", "brackets", "zafiro", "ceramica", "aparato", "aparatos", "dientes torcidos", "mordida", "apiñamiento"],
      ke: ["orthodontics", "orthodontic", "invisalign", "aligners", "aligner", "clear aligners", "braces", "crooked teeth", "straighten"],
      a: "Sí, para adultos, jóvenes y niños:\n• Invisalign: alineadores transparentes y removibles hechos con la forma de tus dientes, que se cambian cada dos semanas.\n• Brackets metálicos, de cerámica o de zafiro.\n• Niños: ortodoncia interceptiva (preventiva) desde los 6–7 años; la correctiva suele empezar entre los 10 y los 12. También Invisalign infantil.\nPlanifican cada caso con tecnología digital para que veas el resultado antes de empezar.",
      ae: "Yes, for adults, teens and children:\n• Invisalign: clear, removable aligners made to the shape of your teeth, changed every two weeks.\n• Metal, ceramic or sapphire braces.\n• Children: interceptive (preventive) orthodontics from age 6–7; corrective treatment usually starts between 10 and 12. Invisalign for kids too.\nThey plan each case digitally so you can see the result before starting.", c: [CITA_CHIP, Q("Financiación", "Financing", T("financiación", "financing"))] },
    { id: "estetica", k: ["estetica", "carilla", "carillas", "blanqueamiento", "blanquear", "dientes blancos", "diseño sonrisa", "diseno sonrisa", "sonrisa", "manchas", "composite", "porcelana", "corona", "coronas", "funda", "fundas", "encia sonrisa"],
      ke: ["cosmetic", "veneers", "veneer", "whitening", "white teeth", "smile design", "crowns", "crown"],
      a: "Están especializados en estética dental:\n• Carillas de porcelana y de composite (láminas de 0,8 a 1,5 mm).\n• Blanqueamiento profesional, en clínica y en casa, tras revisar que dientes y encías estén sanos.\n• Diseño digital de sonrisa: ves la simulación antes de empezar.\n• Coronas estéticas y remodelación de encía.\nRecomiendan una revisión al menos cada 6 meses o un año.",
      ae: "Cosmetic dentistry is one of their specialties:\n• Porcelain and composite veneers (0.8 to 1.5 mm thin).\n• Professional whitening, in-clinic and at home, after checking that teeth and gums are healthy.\n• Digital smile design: you see the simulation before starting.\n• Cosmetic crowns and gum contouring.\nThey recommend a check-up at least every 6 months to a year.", c: [CITA_CHIP, Q("Precio", "Price", T("precio carillas", "veneers price"))] },
    { id: "ninos", k: ["niño", "niños", "nino", "ninos", "hijo", "hija", "hijos", "infantil", "odontopediatria", "odontopediatra", "pequeño", "bebe", "primer diente", "dientes de leche", "selladores", "fluor"],
      ke: ["child", "children", "kids", "kid", "son", "daughter", "baby", "pediatric", "paediatric"],
      a: "Sí, tienen especialistas en odontopediatría:\n• Primera visita a partir de los 12 meses o con los primeros dientes (y no más tarde de los 3 años), sin tratamiento: el niño conoce la clínica sin presión.\n• Revisiones cada 6 meses, selladores, flúor, mantenedores de espacio y ortodoncia preventiva desde los 6–7 años.\n• Ambiente sin prisas y sedación si hiciera falta.",
      ae: "Yes, they have pediatric dentistry specialists:\n• First visit from 12 months or when the first teeth appear (and no later than age 3), with no treatment: the child gets to know the clinic without pressure.\n• Check-ups every 6 months, sealants, fluoride, space maintainers and preventive orthodontics from age 6–7.\n• An unhurried environment, and sedation if needed.", c: [CITA_CHIP] },
    { id: "miedo", k: ["miedo", "ansiedad", "nervios", "nervioso", "panico", "odontofobia", "sedacion", "sedar", "dormido", "anestesia general", "intravenosa"],
      ke: ["afraid", "scared", "fear", "anxiety", "anxious", "nervous", "sedation", "sedated", "asleep"],
      a: "Lo entienden y lo trabajan: tienen un protocolo para pacientes con miedo al dentista. Primera visita sin tratamiento para que conozcas el entorno y al equipo, explicación de cada paso antes de hacerlo, tiempos a tu ritmo y sedación (oral, intravenosa o consciente) para tratamientos largos o mucha ansiedad.",
      ae: "They understand it and have a protocol for patients who are afraid of the dentist: a first visit with no treatment so you get to know the place and the team, every step explained beforehand, your own pace, and sedation (oral, intravenous or conscious) for long treatments or high anxiety.", c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "encias", k: ["periodoncia", "periodontitis", "piorrea", "encia", "encias", "sangran", "sangrado", "gingivitis", "dientes se mueven", "curetaje", "raspado"],
      ke: ["gums", "gum", "bleeding gums", "periodontal", "periodontitis", "gingivitis", "deep cleaning"],
      a: "Sí, tratan las encías (periodoncia), desde la gingivitis hasta la periodontitis avanzada:\n• Raspado y alisado radicular (curetaje) con anestesia local, normalmente en 2 a 4 sesiones.\n• Después, mantenimiento con limpieza profunda cada 3 o 6 meses.\nSi necesitas implantes, primero sanan las encías.",
      ae: "Yes, they treat gums (periodontics), from gingivitis to advanced periodontitis:\n• Scaling and root planing under local anaesthetic, usually in 2 to 4 sessions.\n• Then maintenance with a deep cleaning every 3 or 6 months.\nIf you need implants, they treat the gums first.", c: [CITA_CHIP] },
    { id: "cirugia", k: ["cirugia", "extraccion", "extracciones", "sacar muela", "muela juicio", "muelas juicio", "cordal", "cordales"],
      ke: ["wisdom tooth", "wisdom teeth", "extraction", "pull tooth", "surgery"],
      a: "Sí: hacen extracciones, incluidas las muelas del juicio, con anestesia local, técnica mínimamente invasiva y sedación si la prefieres. Durante la intervención no duele; después puede haber molestias e inflamación de 3 a 5 días, que se controlan con la medicación pautada.",
      ae: "Yes: they do extractions, including wisdom teeth, under local anaesthetic, with minimally invasive technique and sedation if you prefer. It doesn't hurt during the procedure; afterwards there may be discomfort and swelling for 3 to 5 days, controlled with the prescribed medication.", c: [CITA_CHIP] },
    { id: "endodoncia", k: ["endodoncia", "matar nervio", "nervio", "conductos", "infeccion raiz", "retratamiento"],
      ke: ["root canal", "nerve", "endodontics"],
      a: "Sí, endodoncia avanzada para salvar el diente en vez de extraerlo: instrumentación rotatoria de níquel-titanio y magnificación óptica. La mayoría se resuelven en 1 o 2 sesiones, con anestesia local (y sedación consciente si la necesitas).",
      ae: "Yes, advanced root canal treatment to save the tooth instead of extracting it: rotary nickel-titanium instruments and optical magnification. Most are done in 1 or 2 sessions, under local anaesthetic (and conscious sedation if you need it).", c: [CITA_CHIP, URG_CHIP] },
    { id: "rehabilitacion", k: ["rehabilitacion", "protesis", "dentadura", "dentadura postiza", "puente", "puentes", "boca completa", "arcada"],
      ke: ["denture", "dentures", "bridge", "bridges", "full mouth", "prosthesis"],
      a: "Sí, hacen rehabilitación dental: coronas de zirconio (o porcelana sobre metal en muelas), puentes fijos, prótesis removibles y rehabilitación oral completa combinando implantes, coronas y prótesis fijas, planificada en 3D. Coronas y puentes duran unos 15–20 años con buen mantenimiento.",
      ae: "Yes, they do full dental rehabilitation: zirconia crowns (or porcelain-fused-to-metal on back teeth), fixed bridges, removable dentures and full-mouth rehabilitation combining implants, crowns and fixed prostheses, planned in 3D. Crowns and bridges last about 15–20 years with good care.", c: [CITA_CHIP] },
    { id: "complejos", k: ["casos complejos", "caso complejo", "complicado", "bruxismo", "rechinar", "apretar dientes", "asimetria", "conservar dientes"],
      ke: ["complex case", "complex", "bruxism", "grinding", "clenching"],
      a: "Los casos complejos son su especialidad (lo dicen en la portada): su filosofía es conservar tus dientes propios siempre que se pueda. Tratan bruxismo (rechinar o apretar los dientes), asimetría gingival y pérdida de piezas por infecciones o roturas, y discuten los casos complejos en equipo.",
      ae: "Complex cases are their specialty (it's on their homepage): their philosophy is to keep your own teeth whenever possible. They treat bruxism (grinding or clenching), gum asymmetry and tooth loss from infection or fractures, and discuss complex cases as a team.", c: [CITA_CHIP] },
    { id: "tecnologia", k: ["tecnologia", "escaner", "escaner intraoral", "tac", "cbct", "3d", "digital", "moldes", "moderno"],
      ke: ["technology", "scanner", "ct scan", "digital", "3d"],
      a: "Trabajan con escáner intraoral 3D (sin moldes), TAC dental (CBCT), cirugía guiada por ordenador, diseño digital de sonrisa e instrumentación rotatoria con magnificación en endodoncia.",
      ae: "They use a 3D intraoral scanner (no impressions), dental CT (CBCT), computer-guided surgery, digital smile design and rotary instruments with magnification for root canals.", c: [CITA_CHIP] },
    { id: "internacional", k: ["ingles", "idioma", "idiomas", "extranjero", "extranjeros", "internacional", "internacionales", "turista", "fuera de españa", "vengo de fuera"],
      ke: ["english", "speak english", "language", "languages", "foreign", "foreigner", "international", "tourist", "abroad", "visiting", "from abroad", "holiday", "expat"],
      a: "Atienden a pacientes de Sevilla y del extranjero: planifican los tratamientos adaptando los tiempos y las visitas para quien viene de fuera de España. Yo te atiendo en español o en inglés (you can write to me in English 🇬🇧). Si quieres que la consulta sea en inglés, lo anoto en tu solicitud y el equipo te lo confirma, porque su web no detalla qué idiomas habla cada profesional.",
      ae: "They treat patients from Seville and from abroad: they plan treatments adapting the timing and number of visits for people coming from outside Spain. I can help you in English or Spanish. If you'd like the appointment in English, I'll note it in your request and the team will confirm, since their website doesn't say which languages each dentist speaks.", c: [CITA_CHIP, LLAMADA_CHIP, WA] },
    { id: "urgencia", k: ["urgencia", "urgencias", "urgente", "dolor", "duele muela", "me duele", "dolor muelas", "emergencia", "flemon", "hinchazon", "infeccion", "se me ha roto", "diente roto", "fractura", "golpe", "diente partido"],
      ke: ["emergency", "urgent", "pain", "toothache", "hurts", "broken tooth", "swelling", "abscess", "chipped"],
      a: "Sí, atienden urgencias: llama o escribe por WhatsApp al " + C.tel + " (es su teléfono para citas y urgencias) si tienes dolor agudo, una fractura dental o cualquier urgencia; harán lo posible por atenderte a la mayor brevedad. Si ahora no puedes llamar, déjame tu urgencia y te llaman.",
      ae: "Yes, they handle emergencies: call or WhatsApp " + C.tel + " (their number for appointments and emergencies) if you have acute pain, a broken tooth or any dental emergency; they'll do their best to see you as soon as possible. If you can't call right now, leave your emergency with me and they'll call you.", urg: true, c: [URG_CHIP, TEL, WA] },
    { id: "horario", k: ["horario", "hora abris", "abris", "abierto", "abiertos", "cerrais", "cierra", "a que hora", "mediodia", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "sabados", "domingo", "domingos", "fin semana", "finde", "festivo", "agosto"],
      ke: ["opening hours", "hours", "open", "close", "closing", "what time", "saturday", "sunday", "weekend", "monday", "friday"],
      a: function () { return NO_HORARIO() + T("\nLo que sí publican: el " + C.tel + " (llamada o WhatsApp) es su teléfono para citas y urgencias. Y yo te atiendo a cualquier hora: déjame tu cita o tu «que me llamen», eliges mañana o tarde y el equipo te llama para confirmarte el día y la hora.",
        "\nWhat they do publish: " + C.tel + " (call or WhatsApp) is their number for appointments and emergencies. And I'm here at any time: leave your appointment request or a call-back, choose morning or afternoon, and the team will call you to confirm the day and time."); }, c: [CITA_CHIP, LLAMADA_CHIP, WA] },
    { id: "direccion", k: ["donde", "direccion", "ubicacion", "como llego", "llegar", "metro", "autobus", "bus", "aparcar", "aparcamiento", "parking", "calle", "mapa", "virgen lujan", "remedios", "triana"],
      ke: ["where", "address", "location", "directions", "get there", "parking", "map", "located"],
      a: "📍 " + C.dir + ".\nEs una zona céntrica y bien comunicada: según su web, con aparcamiento en la zona y transporte público desde cualquier punto de Sevilla.",
      ae: "📍 " + C.dir + ".\nIt's a central, well-connected area: according to their website, there's parking in the area and public transport from anywhere in Seville.", c: [{ t: "Google Maps", url: C.maps }, CITA_CHIP] },
    { id: "contacto", k: ["telefono", "llamar", "numero", "contacto", "email", "correo", "mail", "whatsapp", "wasap", "watsap", "movil", "hablar persona", "recepcion", "humano"],
      ke: ["phone", "telephone", "number", "contact", "email", "whatsapp", "talk to someone", "human", "person"],
      a: "Canales publicados:\n• Teléfono y WhatsApp: " + C.tel + " (para citas y urgencias)\n• Email: " + C.email + "\nSi prefieres, deja aquí tu teléfono y te llaman ellos.",
      ae: "Published contact details:\n• Phone and WhatsApp: " + C.tel + " (appointments and emergencies)\n• Email: " + C.email + "\nIf you prefer, leave your number here and they'll call you.", c: [TEL, WA, LLAMADA_CHIP] },
    { id: "equipo", k: ["quien atiende", "doctor", "doctora", "dentista", "dentistas", "odontologo", "especialista", "especialistas", "equipo", "opiniones", "reseñas", "cadena", "franquicia", "pinero", "bilbao"],
      ke: ["who", "dentist", "dentists", "doctor", "team", "specialist", "specialists", "reviews", "chain"],
      a: "No son una cadena: son «una clínica de barrio con tecnología de última generación» en Los Remedios. Cada tratamiento lo hace el especialista de esa área (implantología, ortodoncia, periodoncia, endodoncia, estética y odontopediatría), y los casos complejos se estudian en equipo. En Google tienen valoración «Excelente» (12 reseñas que muestra su web).",
      ae: "They're not a chain: they're \"a neighbourhood clinic with the latest technology\" in Los Remedios. Each treatment is done by the specialist in that area (implants, orthodontics, periodontics, root canals, cosmetic and pediatric dentistry), and complex cases are reviewed as a team. On Google they're rated \"Excellent\" (12 reviews shown on their website).", c: [CITA_CHIP] },
    { id: "seguros", k: ["seguro", "mutua", "adeslas", "sanitas", "dkv", "asisa", "mapfre", "aseguradora", "poliza", "seguridad social"],
      ke: ["insurance", "insurer", "health insurance", "cover", "covered"],
      a: "Su web no dice si trabajan con mutuas o seguros dentales, así que no te lo voy a asegurar. Lo que sí publican son beneficios para titulares de " + BENEF + ". Para tu caso, confírmalo por teléfono o WhatsApp al " + C.tel + ", o deja tu número y te llaman.",
      ae: "Their website doesn't say whether they work with insurers, so I won't promise it. What they do publish are benefits for holders of " + BENEF + ". For your case, check by phone or WhatsApp on " + C.tel + ", or leave your number and they'll call you.", c: [TEL, WA, LLAMADA_CHIP] },
    { id: "gracias", k: ["gracias", "vale gracias", "perfecto", "genial", "adios", "hasta luego"],
      ke: ["thanks", "thank you", "great", "bye", "goodbye", "perfect"],
      a: "¡A ti! Si necesitas algo más, aquí estoy. 😊", ae: "You're welcome! If you need anything else, I'm here. 😊", c: [CITA_CHIP] }
  ];
  var CITA_K = ["pedir cita", "cita", "reservar", "reserva", "agendar", "pedir hora", "hueco", "turno", "apuntarme", "citarme", "coger cita", "darme hora", "appointment", "book", "booking", "schedule"];

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
      var m = el("div", "r24-msg r24-bot" + (cls ? " " + cls : ""), esc(t).replace(/\b954 084 916\b/g, '<a href="tel:+34954084916">954 084 916</a>').replace(/info@pinerobilbao\.es/g, '<a href="mailto:info@pinerobilbao.es">info@pinerobilbao.es</a>'));
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
    status.className = "r24-status";
    status.textContent = T("🕒 Te atiendo a cualquier hora · Citas y urgencias: " + C.tel + " (llamada o WhatsApp)", "🕒 Here for you at any time · Appointments & emergencies: " + C.tel + " (call or WhatsApp)");
  }
  function setLang(l) {
    if (!l || l === LANG) return; LANG = l;
    if (!panel) return;
    input.placeholder = T("Escribe tu pregunta…", "Type your question…");
    panel.querySelector(".r24-legal").textContent = T("Asistente automático de demostración · tus datos no se envían a ningún sitio", "Automated demo assistant · your data is not sent anywhere");
    panel.querySelector(".r24-send").textContent = T("Enviar", "Send");
    panel.querySelector(".r24-online").textContent = T("● en línea", "● online");
    panel.querySelector(".r24-ht b").firstChild.nodeValue = T("Recepción 24 h ", "24 h Reception ");
    statusText();
  }
  function menuChips() { return [CITA_CHIP, URG_CHIP, Q("Tratamientos", "Treatments", T("tratamientos", "treatments")), LANG === "en" ? Q("International patients", "International patients", "international patients") : Q("Financiación y descuentos", "", "financiación"), LLAMADA_CHIP, LANG_CHIP]; }

  function build() {
    var base = window.R24_BASE || "recepcion/";
    var css = document.createElement("link"); css.rel = "stylesheet"; css.href = base + "recepcion.css"; document.head.appendChild(css);
    var ban = el("div", "r24-demo-banner", "Demo privada preparada para Clínica Piñero & Bilbao"); ban.setAttribute("role", "note"); document.body.appendChild(ban);
    launch = el("button", "r24-launch", '<img class="r24-face" src="' + base + 'avatar.svg" alt="Recepcionista"><span>' + T("Recepción 24 h", "24 h Reception") + '</span><span class="r24-dot"></span>');
    launch.type = "button"; launch.setAttribute("aria-label", T("Abrir la recepción 24 h", "Open the 24 h reception")); document.body.appendChild(launch);
    panel = el("div", "r24-panel"); panel.setAttribute("role", "dialog"); panel.setAttribute("aria-label", "Recepción 24 h");
    panel.innerHTML = '<div class="r24-head"><div class="r24-av"><img class="r24-face" src="' + base + 'avatar.svg" alt="Recepcionista"></div><div class="r24-ht"><b>' + T("Recepción 24 h ", "24 h Reception ") + '<span class="r24-online">' + T("● en línea", "● online") + '</span></b><small>Clínica Piñero & Bilbao · Los Remedios · ES / EN</small></div><button class="r24-x" type="button" aria-label="Cerrar">×</button></div><div class="r24-status"></div><div class="r24-body" aria-live="polite"></div><form class="r24-foot"><input class="r24-in" type="text" placeholder="' + T("Escribe tu pregunta…", "Type your question…") + '" autocomplete="off" maxlength="300"><button class="r24-send" type="submit">' + T("Enviar", "Send") + '</button></form><div class="r24-legal">' + T("Asistente automático de demostración · tus datos no se envían a ningún sitio", "Automated demo assistant · your data is not sent anywhere") + '</div>';
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
    addBot(T("¡Hola! 👋 Soy el asistente virtual con IA de Clínica Piñero & Bilbao, tu clínica dental en Los Remedios (Sevilla). Te ayudo a pedir tu primera visita gratuita, con una urgencia o con dudas de tratamientos, financiación y cómo llegar, a cualquier hora.\nYou can also write to me in English. 🇬🇧\n¿En qué te ayudo?",
      "Hi! 👋 I'm the AI virtual assistant of Clínica Piñero & Bilbao, your dental clinic in Los Remedios (Seville). I can help you book your free first visit, with an emergency, or with questions about treatments, financing and how to get here, at any time.\nTambién puedes escribirme en español. 🇪🇸\nHow can I help?"), menuChips());
  }
  function open(mode) {
    panel.classList.add("r24-open"); launch.classList.add("r24-hide"); document.documentElement.classList.add("r24-panel-open"); statusText();
    if (!opened) { opened = true; greet(); }
    if (mode === "llamada" && !flow) setTimeout(function () { addUser(mk(LLAMADA_CHIP).t); startLlamada(); }, 450);
    setTimeout(function () { input.focus(); }, 50);
  }

  // Motivos = servicios publicados en su web
  function TRAT() { return LANG === "en"
    ? ["Free first visit / check-up", "Implants", "Invisalign / braces", "Cosmetic (veneers, whitening)", "Root canal", "Gums (periodontics)", "Crowns / bridges / dentures", "Wisdom tooth / extraction", "Complex case / bruxism", "For a child", "Pain / emergency", "Other"]
    : ["Primera visita gratuita / revisión", "Implantes", "Invisalign / ortodoncia", "Estética (carillas, blanqueamiento)", "Endodoncia", "Encías (periodoncia)", "Coronas / puentes / prótesis", "Muela del juicio / extracción", "Caso complejo / bruxismo", "Para un niño/a", "Dolor / urgencia", "Otro"]; }
  function URG() { return LANG === "en"
    ? ["Toothache or abscess", "Broken tooth or knock", "Swelling", "Wisdom tooth", "Lost crown or filling", "Child emergency", "Other emergency"]
    : ["Dolor de muelas o flemón", "Diente roto o golpe", "Hinchazón", "Muela del juicio", "Se me ha caído una corona o empaste", "Urgencia de un niño/a", "Otra urgencia"]; }
  function DIAS() { return LANG === "en" ? ["As soon as possible", "This week", "Next week", "I'm only in Seville a few days"] : ["Lo antes posible", "Esta semana", "La semana que viene", "Estoy de paso por Sevilla unos días"]; }
  function startCita() {
    flow = { step: "nombre", d: { idioma: LANG } };
    addBot(T("¡Perfecto! Te ayudo a pedir cita en unos pasos. La primera visita es gratuita: valoración y presupuesto detallado, sin compromiso.\n¿Cómo te llamas? (Escribe «cancelar» si quieres salir.)",
      "Great! I'll help you request an appointment in a few steps. The first visit is free: assessment and a detailed quote, no obligation.\nWhat's your name? (Type \"cancel\" to exit.)"));
  }
  function startLlamada() {
    flow = { step: "nombre", d: { tipo: "llamada", idioma: LANG, consulta: (lastQ || T("Consulta general", "General enquiry")).slice(0, 120) } };
    addBot(T("¡Claro! Te llama una persona del equipo de la clínica. Solo necesito dos datos.\n¿Cómo te llamas? (Escribe «cancelar» si quieres salir.)",
      "Of course! Someone from the clinic team will call you. I just need two details.\nWhat's your name? (Type \"cancel\" to exit.)"));
  }
  function startUrgencia() {
    flow = { step: "urg", d: { tipo: "urgencia", idioma: LANG } };
    addBot(T("Vamos rápido. Lo más rápido es llamar o escribir por WhatsApp al " + C.tel + ", su teléfono para citas y urgencias. Si ahora no puedes, dejo tu urgencia pedida y te llaman en cuanto la vean.\n¿Qué te pasa?",
      "Let's be quick. The fastest way is to call or WhatsApp " + C.tel + ", their number for appointments and emergencies. If you can't right now, I'll leave your emergency request and they'll call you as soon as they see it.\nWhat's happening?"),
      URG().map(function (t) { return { t: t, v: t, flow: true }; }).concat([WA()]));
  }
  var ALARMA = function () { return T("⚠️ Si tienes fiebre alta, una inflamación que te dificulta tragar o respirar, o un golpe fuerte en la cara, no esperes: acude a urgencias de tu hospital o centro de salud (o llama al 112).",
    "⚠️ If you have a high fever, swelling that makes it hard to swallow or breathe, or a strong blow to the face, don't wait: go to hospital A&E or call 112."); };
  function idiomaLinea(d) { return d.idioma === "en" ? "\n🌐 Idioma: inglés (paciente internacional) · Language: English" : ""; }
  function ask(step) {
    flow.step = step;
    var d = flow.d;
    if (step === "tratamiento") addBot(T("Encantados, " + d.nombre + ". ¿Cuál es el motivo de la cita?", "Nice to meet you, " + d.nombre + ". What's the appointment for?"), TRAT().map(function (t) { return { t: t, v: t, flow: true }; }));
    else if (step === "dia") addBot(T("¿Cuándo te vendría bien? Su web no publica el horario, así que lo anoto como preferencia y el equipo te confirma el día y la hora exactos.", "When would suit you? Their website doesn't publish opening hours, so I'll note it as your preference and the team will confirm the exact day and time."),
      DIAS().map(function (x) { return { t: x, v: x, flow: true }; }));
    else if (step === "franja") addBot(T("¿Prefieres mañana o tarde? (Es lo mismo que pide su formulario.)", "Morning or afternoon?"), LANG === "en"
      ? [{ t: "Morning", v: "Morning", flow: true }, { t: "Afternoon", v: "Afternoon", flow: true }, { t: "Either", v: "Morning or afternoon, either", flow: true }]
      : [{ t: "Mañana", v: "Mañana", flow: true }, { t: "Tarde", v: "Tarde", flow: true }, { t: "Me da igual", v: "Mañana o tarde, indiferente", flow: true }]);
    else if (step === "telefono") addBot(d.tipo === "llamada" ? T("Perfecto, " + d.nombre + ". ¿A qué teléfono te llaman?", "Perfect, " + d.nombre + ". What number should they call?")
      : (d.tipo === "urgencia" ? T("¿A qué teléfono te llaman para darte el primer hueco?", "What number should they call to give you the first available slot?")
        : T("Último paso: ¿a qué teléfono te llamamos para confirmarte la cita? (Si es extranjero, con el prefijo, p. ej. +44…)", "Last step: what number should they call to confirm? (With country code if it's not Spanish, e.g. +44…)")));
    else if (step === "resumen") {
      var B = [{ t: T("✅ Confirmar", "✅ Confirm"), v: "__ok", flow: true }, { t: T("✏️ Corregir", "✏️ Edit"), v: "__fix", flow: true }, { t: T("Cancelar", "Cancel"), v: "cancelar", flow: true }];
      if (d.tipo === "llamada") { addBot(T("Revisa tu solicitud de llamada:", "Please check your call-back request:") + "\n👤 " + T("Nombre", "Name") + ": " + d.nombre + "\n💬 " + T("Consulta", "Enquiry") + ": " + d.consulta + "\n📱 " + T("Teléfono", "Phone") + ": " + d.telefono + idiomaLinea(d) + "\n\n" + AVISO() + "\n\n" + T("¿Lo confirmo?", "Shall I confirm it?"), B, "r24-sum"); return; }
      if (d.tipo === "urgencia") { addBot(T("Revisa tu urgencia:", "Please check your emergency request:") + "\n🚨 " + T("Urgencia", "Emergency") + ": " + d.motivo + "\n👤 " + T("Nombre", "Name") + ": " + d.nombre + "\n📅 " + T("Cuándo: el primer hueco de urgencias", "When: first available emergency slot") + "\n📱 " + T("Teléfono", "Phone") + ": " + d.telefono + idiomaLinea(d) + "\n\n" + AVISO() + "\n\n" + T("¿Lo confirmo?", "Shall I confirm it?"), B, "r24-sum"); return; }
      addBot(T("Revisa tu solicitud:", "Please check your request:") + "\n👤 " + T("Nombre", "Name") + ": " + d.nombre + "\n🦷 " + T("Motivo", "Reason") + ": " + d.tratamiento + "\n📅 " + T("Cuándo", "When") + ": " + d.dia + "\n🕐 " + T("Franja", "Time") + ": " + d.franja + "\n📱 " + T("Teléfono", "Phone") + ": " + d.telefono + idiomaLinea(d) + "\n\n" + AVISO() + "\n\n" + T("¿Lo confirmo?", "Shall I confirm it?"), B, "r24-sum");
    }
  }
  function flowInput(t) {
    var n = norm(t), d = flow.d;
    if (/^(cancelar|cancela|salir|dejalo|olvidalo|cancel|exit|stop)$/.test(n)) { flow = null; addBot(T("Sin problema, he cancelado la solicitud. ¿Te ayudo con otra cosa?", "No problem, I've cancelled the request. Can I help with anything else?"), [CITA_CHIP, LLAMADA_CHIP]); return; }
    if (/\?/.test(t) && flow.step !== "resumen") {
      var bi = bestIntent(t);
      if (bi && bi.s >= 1) { reply(bi.e, t); setTimeout(function () { ask(flow.step); }, 700); return; }
    }
    switch (flow.step) {
      case "urg":
        d.motivo = t.slice(0, 80);
        addBot(ALARMA());
        setTimeout(function () { flow.step = "nombre"; addBot(T("Para dejar tu urgencia pedida, ¿cómo te llamas?", "To leave your emergency request, what's your name?")); }, 900); return;
      case "nombre":
        var nm = t.replace(/^(me llamo|soy|mi nombre es|my name is|i am|i'm|im)\s+/i, "").trim();
        if (nm.length < 2 || nm.length > 60 || /\d/.test(nm)) { addBot(T("¿Me dices tu nombre, por favor? (solo el nombre, sin números)", "Could you tell me your name, please? (just the name, no numbers)")); return; }
        d.nombre = nm.split(/\s+/).map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join(" ");
        if (d.tipo === "llamada" || d.tipo === "urgencia") { ask("telefono"); return; } ask("tratamiento"); return;
      case "tratamiento":
        d.tratamiento = t.slice(0, 80);
        if (/urgen|dolor|pain|emergency/.test(n)) {
          addBot(T("Si te duele, lo más rápido es llamar o escribir por WhatsApp al " + C.tel + ": es su teléfono para citas y urgencias. Aun así, dejo tu solicitud preparada.", "If you're in pain, the fastest way is to call or WhatsApp " + C.tel + ": it's their number for appointments and emergencies. I'll still prepare your request."), [TEL, WA]);
          setTimeout(function () { ask("dia"); }, 900); return;
        }
        ask("dia"); return;
      case "dia":
        d.dia = t.slice(0, 60);
        if (/sabado|domingo|finde|fin de semana|festivo|saturday|sunday|weekend/.test(n)) { addBot(T("Lo anoto. Ojo: su web no publica si abren en fin de semana, así que el equipo te confirma si puede ser ese día o te propone el más cercano.", "Noted. Just so you know: their website doesn't say whether they open at weekends, so the team will confirm that day or offer the nearest one.")); setTimeout(function () { ask("franja"); }, 600); return; }
        ask("franja"); return;
      case "franja":
        d.franja = t.slice(0, 60); ask("telefono"); return;
      case "telefono":
        var ph = t.replace(/[\s().-]/g, "").replace(/^00/, "+");
        var es = ph.replace(/^\+34/, "");
        if (/^[6789]\d{8}$/.test(es)) { d.telefono = es.slice(0, 3) + " " + es.slice(3, 6) + " " + es.slice(6); }
        else if (/^\+(?!34)\d{8,15}$/.test(ph)) { d.telefono = ph; }
        else { addBot(T("Ese número no me cuadra. Escríbelo con 9 cifras, por ejemplo 612 345 678 (o con prefijo internacional, +44…).", "That number doesn't look right. Please write it with 9 digits, e.g. 612 345 678, or with the international code (+44…).")); return; }
        ask("resumen"); return;
      case "resumen":
        if (t === "__ok" || /^(si|vale|ok|confirmo|confirmar|correcto|yes|confirm)/.test(n)) {
          var nm2 = d.nombre.split(" ")[0], DEMO = T("\n\n(Versión de demostración: esta solicitud no se ha enviado a la clínica.)", "\n\n(Demo version: this request has not been sent to the clinic.)");
          if (d.tipo === "llamada") { addBot(T("¡Listo, " + nm2 + "! ✅ El equipo de la clínica recibe tu pedido al instante y te llama al " + d.telefono + ".", "Done, " + nm2 + "! ✅ The clinic team receives your request instantly and will call you on " + d.telefono + ".") + DEMO, [CITA_CHIP, Q("Otra pregunta", "Another question", "__menu")]); flow = null; return; }
          if (d.tipo === "urgencia") { addBot(T("¡Listo, " + nm2 + "! ✅ Tu urgencia queda pedida. El equipo te llama al " + d.telefono + " para darte el primer hueco; si puedes, adelántate por WhatsApp al " + C.tel + ".\nSi empeora, no esperes: urgencias de tu hospital o centro de salud, o el 112.", "Done, " + nm2 + "! ✅ Your emergency request is in. The team will call you on " + d.telefono + " with the first available slot; if you can, message them on WhatsApp at " + C.tel + ".\nIf it gets worse, don't wait: go to A&E or call 112.") + DEMO, [{ t: T("Cómo llegar", "How to get here"), q: T("dirección", "address") }, WA]); flow = null; return; }
          addBot(T("¡Listo, " + nm2 + "! ✅ Tu solicitud de cita está registrada.\nEl equipo te llamará al " + d.telefono + " para confirmarte el día y la hora exactos. Recuerda: la primera visita es gratuita.\nSi prefieres adelantarte: " + C.tel + " (llamada o WhatsApp).",
            "Done, " + nm2 + "! ✅ Your appointment request is registered.\nThe team will call you on " + d.telefono + " to confirm the exact day and time. Remember: the first visit is free.\nIf you'd rather get ahead: " + C.tel + " (call or WhatsApp).") + DEMO,
            [{ t: T("Cómo llegar", "How to get here"), q: T("dirección", "address") }, Q("Otra pregunta", "Another question", "__menu")]);
          flow = null; return;
        }
        if (t === "__fix" || /corregir|cambiar|^no\b|change|edit|wrong/.test(n)) { flow.d = d.tipo === "llamada" ? { tipo: "llamada", idioma: d.idioma, consulta: d.consulta } : (d.tipo === "urgencia" ? { tipo: "urgencia", idioma: d.idioma, motivo: d.motivo } : { idioma: d.idioma }); addBot(T("Vale, empezamos de nuevo. ¿Cómo te llamas?", "OK, let's start again. What's your name?")); flow.step = "nombre"; return; }
        ask("resumen"); return;
    }
  }
  function reply(e, raw) {
    var t = typeof e.a === "function" ? e.a() : (LANG === "en" && e.ae ? e.ae : e.a);
    if (e.urg) t += "\n\n" + ALARMA();
    addBot(t, (e.c || []).map(function (c) { c = mk(c); return c.q ? { t: c.t, v: c.q } : c; }));
  }
  function fallback() {
    addBot(T("Eso te lo confirma mejor el equipo de la clínica, así tienes el dato exacto. 😊\nLlámales o escríbeles por WhatsApp al " + C.tel + " (su teléfono para citas y urgencias), o deja tu teléfono y te llaman ellos.",
      "The clinic team can give you the exact answer on that. 😊\nCall or WhatsApp them on " + C.tel + " (their number for appointments and emergencies), or leave your number and they'll call you."), [TEL, WA, LLAMADA_CHIP, CITA_CHIP]);
  }
  function handle(t, chip) {
    if (t === "__menu") { addBot(T("Claro, ¿qué más quieres saber?", "Sure, what else would you like to know?"), [CITA_CHIP, Q("Tratamientos", "Treatments", T("tratamientos", "treatments")), Q("Cómo llegar", "How to get here", T("dirección", "address")), LLAMADA_CHIP]); return; }
    addUser(chip ? chip.t : t);
    if (chip && chip.a === "lang") { setLang(chip.v); addBot(T("¡Perfecto, seguimos en español! ¿En qué te ayudo?", "Great, let's continue in English! How can I help?"), menuChips()); return; }
    if (flow) { flowInput(chip && chip.v ? chip.v : t); return; }
    if (!chip) setLang(detectLang(t));
    if (chip && chip.a === "cita") { startCita(); return; }
    if (chip && chip.a === "llamada") { startLlamada(); return; }
    if (chip && chip.a === "urgencia") { startUrgencia(); return; }
    var n = norm(t);
    if (/^(hola|buenas|buenos dias|buenas tardes|hey|hello|hi|good morning|good afternoon)\b/.test(n) && n.split(" ").length <= 3) { addBot(T("¡Hola! ¿En qué te puedo ayudar? Puedo pedirte la primera visita gratuita, dejar pedida una urgencia o contarte tratamientos, financiación y cómo llegar.", "Hi! How can I help? I can request your free first visit, leave an emergency request, or tell you about treatments, financing and how to get here."), [CITA_CHIP, URG_CHIP, Q("Tratamientos", "Treatments", T("tratamientos", "treatments")), LLAMADA_CHIP]); return; }
    if (/^tratamientos?$|que tratamientos|que haceis|servicios|especialidades|^treatments?$|what treatments|services|what do you do/.test(n)) {
      addBot(T("Atención completa para toda la familia, «desde los tratamientos más sencillos hasta los casos más complejos»:\n• Estética dental: carillas, blanqueamiento y diseño de sonrisa\n• Implantes con cirugía guiada y coronas de zirconio\n• Ortodoncia e Invisalign (adultos, jóvenes y niños)\n• Rehabilitación: coronas, puentes y prótesis\n• Periodoncia (encías) y cirugía, muelas del juicio\n• Endodoncia avanzada\n• Odontopediatría\n• Casos complejos y bruxismo\n• Sedación para pacientes con miedo\n¿Sobre cuál quieres saber más?",
        "Complete care for the whole family, \"from the simplest treatments to the most complex cases\":\n• Cosmetic dentistry: veneers, whitening and smile design\n• Implants with guided surgery and zirconia crowns\n• Orthodontics and Invisalign (adults, teens and children)\n• Rehabilitation: crowns, bridges and dentures\n• Periodontics (gums) and surgery, wisdom teeth\n• Advanced root canal treatment\n• Pediatric dentistry\n• Complex cases and bruxism\n• Sedation for nervous patients\nWhich one would you like to know more about?"),
        [Q("Implantes", "Implants", T("implantes", "implants")), Q("Invisalign", "Invisalign", "invisalign"), Q("Estética", "Cosmetic", T("carillas", "veneers")), CITA_CHIP]); return; }
    var bi = bestIntent(t);
    var price = isPriceQ(n);
    if (/urgencia|urgente|emergency/.test(n) && /dejar|pedir|tengo|quiero|have|need/.test(n) && !/\?/.test(t)) { startUrgencia(); return; }
    if (wantsCita(n) && !price && !/sin coste|gratis|gratuit|primera|free|first/.test(n) && (!bi || bi.s < 2 || /cita|reserv|agendar|appointment|book/.test(n))) { startCita(); return; }
    if (price) {
      if (/gratis|gratuit|primera|sin coste|valoracion|presupuesto|free|first|quote/.test(n)) { reply(byId("valoracion"), t); return; }
      if (/financ|plazo|mes|pago|cuota|instal|monthly/.test(n)) { reply(byId("financiacion"), t); return; }
      if (/implant/.test(n)) { reply(byId("precio_implante"), t); return; }
      reply(byId("precio"), t); return;
    }
    if (bi) { reply(bi.e, t); return; }
    lastQ = t; fallback();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build); else build();
  window.R24 = { open: open, _test: { bestIntent: bestIntent, norm: norm, detectLang: detectLang, lang: function () { return LANG; } } };
})();
