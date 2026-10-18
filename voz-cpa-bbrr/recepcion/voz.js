/* Recepción IA · capa de VOZ "Habla con la recepcionista" (18/10/2026, borrador)
   Se monta sobre el chat que ya existe (recepcion-cpa.js) sin cambiar su guion.
   Dos modos:
   - EN VIVO (Grok Voice, speech-to-speech): pide un token efímero a POST {session} (backend propio que lee
     XAI_API_KEY de una variable de entorno). Con el token abre wss://api.x.ai/v1/realtime con el subprotocolo
     "xai-client-secret.<token>". La clave NUNCA llega al navegador.
   - SIMULADO (sin clave): el mismo motor del chat contesta; la voz sale del TTS del navegador (speechSynthesis)
     y lo que dices se reconoce con SpeechRecognition (Chrome/Edge/Safari). No se gasta nada.
   Config: window.R24_VOZ (ver DEF). Docs: https://docs.x.ai/developers/model-capabilities/audio/speech-to-speech
                                         https://docs.x.ai/developers/model-capabilities/audio/ephemeral-tokens */
(function () {
  "use strict";
  var DEF = {
    session: "/session",                 // endpoint del backend (server/server.js). null = siempre simulado
    model: "grok-voice-3.0",             // versión fija en producción (grok-voice-latest = alias)
    wsUrl: "wss://api.x.ai/v1/realtime",
    voice: "eve",
    langHint: { es: "es-MX", en: "en" }, // es-US no existe en la lista; para España usar "es-ES"
    sttLang: { es: "es-MX", en: "en-US" },
    keyterms: ["TaxDome", "Calendly", "IRS", "CP2000", "CP14"],
    maxSec: 300,                         // corte duro por llamada (con server_vad se cobra la duración de la sesión)
    idleSec: 30,                         // cuelga si nadie habla en N s
    pricePerMin: 0.08,                   // USD, docs.x.ai/developers/pricing (18/10/2026)
    instructions: null                   // string o función(lang, cfg) para pisar el prompt por defecto
  };
  var V = Object.assign({}, DEF, window.R24_VOZ || {});
  var CFG = window.R24_CPA || {};
  function L() { return (window.R24 && R24.lang && R24.lang()) || CFG.lang || "es"; }
  var TX = {
    es: { btn: "🎙️ Habla con la recepcionista", sim: "Modo simulado · voz del navegador (sin IA de voz, sin costo)", live: "En vivo · Grok Voice", conn: "Conectando…", listen: "Te escucho… habla ahora", speak: "Hablando…", think: "Pensando…", hang: "Colgar", ended: "Llamada terminada.", noStt: "Tu navegador no reconoce voz (usa Chrome, Edge o Safari). Escribe en el chat y la recepcionista te responde en voz alta.", micDenied: "No hay permiso de micrófono. Escribe en el chat y te respondo en voz alta.", sheet: "Te muestro los horarios disponibles en pantalla. Toca el que prefieras.", summary: "Listo. Te dejo el resumen en pantalla.", options: "Puedes decir: ", or: " o ", sttNote: "El reconocimiento de voz del navegador puede usar el servicio de su fabricante (en Chrome, Google).", cost: "costo estimado", limit: "Llegamos al límite de la demo. Gracias por llamar, ¡hasta luego!", sumTitle: "🔔 Resumen para el equipo (en la demo no se envía nada)", linksTitle: "📲 Links que se enviarían por SMS (demo: no se envía)" },
    en: { btn: "🎙️ Talk to the front desk", sim: "Simulated mode · browser voice (no voice AI, no cost)", live: "Live · Grok Voice", conn: "Connecting…", listen: "Listening… go ahead", speak: "Speaking…", think: "Thinking…", hang: "Hang up", ended: "Call ended.", noStt: "Your browser can't recognize speech (use Chrome, Edge or Safari). Type in the chat and the front desk will answer out loud.", micDenied: "No microphone permission. Type in the chat and I'll answer out loud.", sheet: "I'm showing the available times on screen. Tap the one you like.", summary: "Done. The summary is on screen.", options: "You can say: ", or: " or ", sttNote: "Browser speech recognition may use the vendor's service (Google, in Chrome).", cost: "est. cost", limit: "We've reached the demo limit. Thanks for calling, goodbye!", sumTitle: "🔔 Summary for the team (demo: nothing is sent)", linksTitle: "📲 Links that would be texted (demo: not sent)" }
  };
  function t(k) { return (TX[L()] || TX.es)[k]; }

  /* ---------- UI ---------- */
  var btn, bar, st, badge, timerEl, logEl, active = null; // active = "sim" | "live" | null
  function el(tag, cls, txt) { var x = document.createElement(tag); if (cls) x.className = cls; if (txt != null) x.textContent = txt; return x; }
  function build() {
    var css = document.createElement("link"); css.rel = "stylesheet"; css.href = (CFG.base || "recepcion/") + "voz.css"; document.head.appendChild(css);
    btn = el("button", "r24v-btn", t("btn")); btn.type = "button"; btn.onclick = start; document.body.appendChild(btn);
    bar = el("div", "r24v-bar"); bar.setAttribute("role", "status");
    bar.innerHTML = '<div class="r24v-row"><span class="r24v-dot"></span><b class="r24v-st"></b><span class="r24v-tm"></span><button type="button" class="r24v-hang"></button></div><div class="r24v-badge"></div><div class="r24v-log"></div>';
    document.body.appendChild(bar);
    st = bar.querySelector(".r24v-st"); badge = bar.querySelector(".r24v-badge"); timerEl = bar.querySelector(".r24v-tm"); logEl = bar.querySelector(".r24v-log");
    bar.querySelector(".r24v-hang").onclick = function () { stop(); };
    document.addEventListener("click", function (ev) { var a = ev.target.closest && ev.target.closest("[data-r24-voz]"); if (a) { ev.preventDefault(); start(); } });
    document.addEventListener("r24:lang", paint); paint();
  }
  function paint() { if (btn) btn.textContent = t("btn"); if (bar) bar.querySelector(".r24v-hang").textContent = t("hang"); }
  function status(s, cls) { st.textContent = s; bar.className = "r24v-bar r24v-on" + (cls ? " r24v-" + cls : ""); }
  function logLine(who, txt) { if (txt == null) return; var p = el("div", "r24v-l r24v-" + who, txt); logEl.appendChild(p); logEl.scrollTop = logEl.scrollHeight; return p; }
  var t0 = 0, tick = null, lastAct = 0;
  function startTimer() {
    t0 = Date.now(); lastAct = Date.now(); clearInterval(tick);
    tick = setInterval(function () {
      var s = Math.round((Date.now() - t0) / 1000), m = Math.floor(s / 60);
      timerEl.textContent = m + ":" + ("0" + (s % 60)).slice(-2) + (active === "live" ? " · " + t("cost") + " US$" + (s / 60 * V.pricePerMin).toFixed(2) : "");
      if (active === "live" && s >= V.maxSec) limitReached();
      if (active === "live" && (Date.now() - lastAct) / 1000 > V.idleSec && !playing()) stop();
    }, 500);
  }

  function start() {
    if (active) return;
    logEl.innerHTML = ""; status(t("conn")); badge.textContent = ""; btn.classList.add("r24v-hide");
    getToken().then(function (tok) {
      if (tok && tok.value) return startLive(tok);
      return startSim();
    }).catch(function () { startSim(); });
  }
  function getToken() {
    if (!V.session) return Promise.resolve(null);
    return fetch(V.session, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" })
      .then(function (r) { return r.ok ? r.json() : null; }, function () { return null; });
  }
  function stop(silent) {
    var was = active; active = null; clearInterval(tick);
    if (was === "sim") simStop(); if (was === "live") liveStop();
    if (!silent) status(t("ended"), "off");
    setTimeout(function () { bar.classList.remove("r24v-on"); btn.classList.remove("r24v-hide"); }, silent ? 0 : 2500);
    document.dispatchEvent(new CustomEvent("r24v:end", { detail: { mode: was } }));
  }

  /* ---------- prompt (mismo guion y reglas que el chat) ---------- */
  function prompt(lang) {
    if (typeof V.instructions === "function") return V.instructions(lang, CFG);
    if (typeof V.instructions === "string") return V.instructions;
    var firm = CFG.firm || "el estudio", own = (CFG.owner && (CFG.owner[lang] || CFG.owner.es)) || "el contador";
    var hrs = CFG.hoursTxt ? (CFG.hoursTxt[lang] || CFG.hoursTxt.es) : null, ctc = CFG.contact ? (CFG.contact[lang] || CFG.contact.es) : null;
    if (lang === "en") return [
      "# Role", "You are the virtual front desk (an AI voice assistant) of " + firm + ", a small US tax & accounting firm. Say you are the virtual front desk in your first sentence. Warm, brief, one question at a time, max 2 short sentences per turn.",
      "# Facts (only these; never invent)", "Office hours: " + (hrs || "not published") + ". Contact: " + (ctc || "not published") + ". Services: individual returns, small business taxes and bookkeeping, IRS notices. Client portal: " + (CFG.portalName || "TaxDome") + ".",
      "# Fixed rules", "R1 Never transfer the call, even if they ask for " + own + " or a real person: explain every conversation is booked so " + own + " can give full attention; count how many times they asked. R2 Never give tax advice or interpret an IRS notice; write the question down for " + own + ". R3 Every call ends with the booking link and portal link texted to them (new client: new-client consultation + portal sign-up; existing: client call + portal login). R4 Spell the full name letter by letter and wait for confirmation; read email and phone back once. R5 Fees: " + own + " quotes after the consultation. R6 Never say 'I don't know': note it for " + own + " and offer to book.",
      "# Flow", "1 Open question, let them talk. 2 Anything else? 3 New or existing client. 4 Full name + spell-back. 5 Email, phone. 6 Service type (if IRS notice: notice number and date, or skip). 7 Call enviar_links. 8 Call guardar_resumen with everything. 9 Short goodbye, then call colgar.",
      "# Language", "Answer in the caller's language (English or Spanish)."
    ].join("\n");
    return [
      "# Rol", "Eres la recepción virtual (asistente de voz con IA) de " + firm + ", un estudio contable chico de EE.UU. Di que eres la recepción virtual en tu primera frase. Español neutro con «tú», cálido y breve: una pregunta por turno, máximo 2 frases cortas.",
      "# Datos (solo estos; nunca inventes)", "Horario: " + (hrs || "no publicado") + ". Contacto: " + (ctc || "no publicado") + ". Servicios: declaraciones personales, impuestos y contabilidad de pequeñas empresas, avisos del IRS. Portal de clientes: " + (CFG.portalName || "TaxDome") + ".",
      "# Reglas fijas", "R1 Nunca pases la llamada, aunque pidan hablar con " + own + " o con una persona: explica que cada conversación se reserva para que " + own + " te dedique toda su atención; cuenta cuántas veces lo pidió. R2 Nunca des asesoramiento impositivo ni interpretes avisos del IRS; anota la pregunta para " + own + ". R3 Toda llamada termina con el link de reserva y el del portal enviados por SMS (cliente nuevo: consulta de cliente nuevo + alta en el portal; existente: llamada de cliente + ingreso al portal). R4 Deletrea el nombre completo letra por letra y espera confirmación; repite email y teléfono una vez. R5 Honorarios: " + own + " los cotiza después de la consulta. R6 Nunca digas «no sé»: anótalo para " + own + " y ofrece reservar.",
      "# Flujo", "1 Pregunta abierta, deja hablar. 2 ¿Algo más? 3 ¿Cliente nuevo o ya es cliente? 4 Nombre completo y deletreo. 5 Email y teléfono. 6 Tipo de servicio (si es aviso del IRS: número y fecha del aviso, o saltar). 7 Llama a enviar_links. 8 Llama a guardar_resumen con todo. 9 Despídete corto y llama a colgar.",
      "# Idioma", "Responde en el idioma de quien llama (español o inglés)."
    ].join("\n");
  }
  var TOOLS = [
    { type: "function", name: "guardar_resumen", description: "Guarda el resumen de la llamada para el dueño (en producción le llega al instante por email/WhatsApp).",
      parameters: { type: "object", properties: {
        nombre: { type: "string" }, nombre_deletreado: { type: "string" }, email: { type: "string" }, telefono: { type: "string" },
        cliente: { type: "string", enum: ["nuevo", "existente"] }, servicio: { type: "string", enum: ["personal", "empresa", "aviso_irs", "otro"] },
        aviso_irs: { type: "string" }, relato: { type: "string", description: "Lo que contó, con sus palabras" },
        preguntas_para_el_dueno: { type: "array", items: { type: "string" } }, pidio_hablar_con_el_dueno: { type: "integer" }, idioma: { type: "string" }
      }, required: ["nombre", "telefono", "cliente", "servicio"] } },
    { type: "function", name: "enviar_links", description: "Envía por SMS el link de reserva y el del portal al teléfono de quien llama.",
      parameters: { type: "object", properties: { telefono: { type: "string" }, cliente: { type: "string", enum: ["nuevo", "existente"] } }, required: ["telefono", "cliente"] } },
    { type: "function", name: "colgar", description: "Termina la llamada después de despedirte.", parameters: { type: "object", properties: {} } }
  ];
  function runTool(name, args) {
    if (name === "guardar_resumen") {
      var box = logLine("sum", t("sumTitle")); var pre = el("pre", "r24v-pre", JSON.stringify(args, null, 2)); box.appendChild(pre);
      window.R24V_LAST_SUMMARY = args; return { ok: true, demo: true };
    }
    if (name === "enviar_links") {
      var lk = CFG.links || {}, nw = args.cliente !== "existente";
      logLine("sum", t("linksTitle") + " → " + (args.telefono || "") + ": " + (nw ? lk.newClient : lk.existing) + " · " + (nw ? lk.portal : lk.portalLogin));
      return { ok: true, demo: true, nota: "Demo: no se envía SMS." };
    }
    if (name === "colgar") { setTimeout(function () { waitPlayback().then(function () { stop(); }); }, 300); return { ok: true }; }
    return { ok: false, error: "herramienta desconocida" };
  }

  /* ---------- MODO EN VIVO (Grok Voice) ---------- */
  var ws = null, ac = null, micStream = null, node = null, srcs = [], nextT = 0, curBot = null, toolBusy = false, closing = false;
  function playing() { return ac && nextT > ac.currentTime + 0.05; }
  function waitPlayback() { return new Promise(function (res) { (function w() { if (!playing()) res(); else setTimeout(w, 150); })(); }); }
  function b64FromI16(i16) { var u8 = new Uint8Array(i16.buffer), s = "", CH = 0x8000; for (var i = 0; i < u8.length; i += CH) s += String.fromCharCode.apply(null, u8.subarray(i, i + CH)); return btoa(s); }
  function f32FromB64(b64) { var bin = atob(b64), u8 = new Uint8Array(bin.length); for (var i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i); var i16 = new Int16Array(u8.buffer, 0, u8.length >> 1), f = new Float32Array(i16.length); for (var j = 0; j < i16.length; j++) f[j] = i16[j] / 32768; return f; }
  function send(o) { if (ws && ws.readyState === 1) ws.send(JSON.stringify(o)); }
  function startLive(tok) {
    active = "live"; closing = false; badge.textContent = t("live"); status(t("conn"));
    ac = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 24000 }); nextT = 0;
    var micP = navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } });
    var url = (tok.ws_url || V.wsUrl) + "?model=" + encodeURIComponent(tok.model || V.model);
    ws = new WebSocket(url, ["xai-client-secret." + tok.value]);
    var early = []; // audio capturado antes de que abra el socket (best practice de la doc)
    micP.then(function (stream) {
      micStream = stream;
      var code = "class P extends AudioWorkletProcessor{process(i){var c=i[0]&&i[0][0];if(c)this.port.postMessage(c.slice(0));return true}}registerProcessor('r24-mic',P);";
      return ac.audioWorklet.addModule(URL.createObjectURL(new Blob([code], { type: "application/javascript" }))).then(function () {
        var src = ac.createMediaStreamSource(stream); node = new AudioWorkletNode(ac, "r24-mic");
        var acc = new Int16Array(2400), n = 0; // 100 ms a 24 kHz
        node.port.onmessage = function (e) {
          var f = e.data; for (var i = 0; i < f.length; i++) { var s = Math.max(-1, Math.min(1, f[i])); acc[n++] = s < 0 ? s * 0x8000 : s * 0x7fff; if (n === acc.length) { var b = b64FromI16(acc); if (ws && ws.readyState === 1) send({ type: "input_audio_buffer.append", audio: b }); else early.push(b); acc = new Int16Array(2400); n = 0; } }
        };
        src.connect(node);
      });
    }).catch(function () { logLine("sys", t("micDenied")); });
    ws.onopen = function () {
      var lang = L();
      send({ type: "session.update", session: {
        instructions: prompt(lang), voice: V.voice, turn_detection: { type: "server_vad" },
        audio: { input: { format: { type: "audio/pcm", rate: 24000 }, transcription: { model: "grok-transcribe", language_hint: V.langHint[lang], keyterms: V.keyterms } },
                 output: { format: { type: "audio/pcm", rate: 24000 } } },
        tools: TOOLS
      } });
      early.forEach(function (b) { send({ type: "input_audio_buffer.append", audio: b }); }); early = [];
      send({ type: "response.create" }); // saluda primero (response.create no se cobra como texto)
      status(t("listen"), "listen"); startTimer();
    };
    ws.onmessage = function (m) {
      if (typeof m.data !== "string") return; var ev; try { ev = JSON.parse(m.data); } catch (e) { return; }
      switch (ev.type) {
        case "response.output_audio.delta": case "response.audio.delta": playChunk(ev.delta); lastAct = Date.now(); status(t("speak"), "speak"); break;
        case "response.output_audio_transcript.delta": case "response.audio_transcript.delta": if (!curBot) curBot = logLine("bot", ""); curBot.textContent += ev.delta || ""; break;
        case "response.output_audio_transcript.done": case "response.audio_transcript.done": if (curBot && ev.transcript) curBot.textContent = ev.transcript; else if (!curBot && ev.transcript) logLine("bot", ev.transcript); curBot = null; break;
        case "conversation.item.input_audio_transcription.completed": if (ev.transcript) logLine("user", ev.transcript); lastAct = Date.now(); break;
        case "input_audio_buffer.speech_started": bargeIn(); lastAct = Date.now(); status(t("listen"), "listen"); break;
        case "input_audio_buffer.speech_stopped": status(t("think"), "think"); break;
        case "response.function_call_arguments.done": onTool(ev); break;
        case "response.done": curBot = null; waitPlayback().then(function () { if (active === "live") status(t("listen"), "listen"); }); break;
        case "error": logLine("sys", "⚠️ " + ((ev.error && ev.error.message) || "error")); break;
      }
    };
    ws.onclose = function () { if (active === "live" && !closing) stop(); };
    ws.onerror = function () { logLine("sys", "⚠️ WebSocket"); };
  }
  function playChunk(b64) {
    if (!b64) return; var f = f32FromB64(b64); if (!f.length) return;
    var buf = ac.createBuffer(1, f.length, 24000); buf.copyToChannel(f, 0);
    var s = ac.createBufferSource(); s.buffer = buf; s.connect(ac.destination);
    nextT = Math.max(nextT, ac.currentTime + 0.03); s.start(nextT); nextT += buf.duration; srcs.push(s);
    s.onended = function () { srcs = srcs.filter(function (x) { return x !== s; }); };
  }
  function bargeIn() { srcs.forEach(function (s) { try { s.stop(); } catch (e) {} }); srcs = []; if (ac) nextT = ac.currentTime; }
  var pendingTools = 0;
  function onTool(ev) {
    var args = {}; try { args = JSON.parse(ev.arguments || "{}"); } catch (e) {}
    var out = runTool(ev.name, args);
    send({ type: "conversation.item.create", item: { type: "function_call_output", call_id: ev.call_id, output: JSON.stringify(out) } });
    if (ev.name === "colgar") return;
    pendingTools++; // varias llamadas en paralelo → un solo response.create, y después de terminar de hablar
    setTimeout(function () { if (--pendingTools === 0) waitPlayback().then(function () { if (active === "live") send({ type: "response.create" }); }); }, 50);
  }
  function limitReached() {
    if (closing) return; closing = true;
    send({ type: "conversation.item.create", item: { type: "force_message", role: "assistant", interruptible: false, content: [{ type: "output_text", text: t("limit") }] } });
    setTimeout(function () { waitPlayback().then(function () { stop(); }); }, 1500);
  }
  function liveStop() {
    closing = true; try { ws && ws.close(); } catch (e) {} ws = null; bargeIn();
    if (micStream) micStream.getTracks().forEach(function (x) { x.stop(); }); micStream = null;
    try { node && node.disconnect(); } catch (e) {} node = null; try { ac && ac.close(); } catch (e) {} ac = null;
  }

  /* ---------- MODO SIMULADO (TTS + reconocimiento del navegador, motor del chat) ---------- */
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition, rec = null, sayQ = [], speakingNow = false, listenT = null, sheetObs = null;
  function startSim() {
    active = "sim"; badge.textContent = t("sim"); status(t("speak"), "speak"); startTimer();
    if (!SR) logLine("sys", t("noStt")); else logLine("sys", t("sttNote"));
    if (window.R24) R24.open();
    // si el chat ya tenía mensajes, leemos el último para arrancar
    var bots = document.querySelectorAll(".r24-bot"); if (bots.length) speak(cleanForSpeech(bots[bots.length - 1].innerText, chipsVisible()));
    sheetObs = new MutationObserver(function () { var sh = document.querySelector(".r24-sheet"); if (sh && !sh.__r24v) { sh.__r24v = 1; stopListen(); speak(t("sheet"), true); } });
    sheetObs.observe(document.body, { childList: true, subtree: true });
    window.R24V_MODE = "sim";
  }
  function chipsVisible() { var w = document.querySelectorAll(".r24-chips"); if (!w.length) return []; return [].map.call(w[w.length - 1].querySelectorAll("button"), function (b) { return b.innerText; }); }
  function cleanForSpeech(txt, chips) {
    var s = String(txt || "").replace(/[\u{1F000}-\u{1FAFF}\u2600-\u27BF\uFE0F]/gu, "").replace(/\[[^\]]*\]/g, "").replace(/https?:\/\/\S+/g, "").replace(/\s*\n+\s*/g, ". ").replace(/\.\s*\./g, ".").replace(/\s{2,}/g, " ").trim();
    if (chips && chips.length && chips.length <= 6) s += " " + t("options") + chips.slice(0, 4).map(function (c) { return c.replace(/[\u{1F000}-\u{1FAFF}\u2600-\u27BF\uFE0F]/gu, "").trim(); }).join(", ").replace(/, ([^,]*)$/, t("or") + "$1") + ".";
    return s;
  }
  document.addEventListener("r24:bot", function (e) {
    if (active !== "sim") return; var d = e.detail || {};
    speak(d.html ? t("summary") : cleanForSpeech(d.text, d.chips));
  });
  function pickVoice(lang) {
    var vs = (window.speechSynthesis && speechSynthesis.getVoices()) || [], want = V.sttLang[lang].toLowerCase(), pre = lang;
    return vs.filter(function (v) { return v.lang.toLowerCase() === want; })[0] || vs.filter(function (v) { return v.lang.toLowerCase().indexOf(pre) === 0; })[0] || null;
  }
  function speak(text, noListenAfter) { if (!text) return; sayQ.push([text, noListenAfter]); stopListen(); if (!speakingNow) nextSay(); }
  function nextSay() {
    var it = sayQ.shift(); if (!it) { speakingNow = false; scheduleListen(); return; }
    speakingNow = true; status(t("speak"), "speak"); logLine("bot", it[0]); lastAct = Date.now();
    window.R24V_SPOKEN = (window.R24V_SPOKEN || []).concat([it[0]]);
    if (!window.speechSynthesis) { setTimeout(nextSay, 600); return; }
    var u = new SpeechSynthesisUtterance(it[0]), lang = L(); u.lang = V.sttLang[lang]; var v = pickVoice(lang); if (v) u.voice = v; u.rate = 1.03;
    var done = false, fin = function () { if (done) return; done = true; setTimeout(nextSay, 120); };
    u.onend = fin; u.onerror = fin; setTimeout(fin, 1500 + it[0].length * 90); // red de seguridad si el TTS no avisa
    speechSynthesis.speak(u);
  }
  function scheduleListen() {
    clearTimeout(listenT);
    listenT = setTimeout(function () {
      if (active !== "sim" || speakingNow || sayQ.length) return;
      if (document.querySelector(".r24-typing")) return scheduleListen(); // el chat todavía está "escribiendo"
      if (document.querySelector(".r24-sheet")) { status(t("sheet"), "think"); return watchSheet(); }
      listen();
    }, 700);
  }
  function watchSheet() { var w = setInterval(function () { if (active !== "sim") return clearInterval(w); if (!document.querySelector(".r24-sheet")) { clearInterval(w); scheduleListen(); } }, 400); }
  function listen() {
    if (!SR || rec) { status(SR ? t("listen") : t("noStt").split(".")[0], "listen"); return; }
    rec = new SR(); rec.lang = V.sttLang[L()]; rec.interimResults = true; rec.maxAlternatives = 1; rec.continuous = false;
    var live = null, got = false;
    rec.onresult = function (e) {
      var txt = "", fin = false; for (var i = e.resultIndex; i < e.results.length; i++) { txt += e.results[i][0].transcript; if (e.results[i].isFinal) fin = true; }
      if (!live) live = logLine("user", ""); live.textContent = txt; lastAct = Date.now();
      if (fin) { got = true; live.remove(); voiceInput(txt); }
    };
    rec.onerror = function () {}; rec.onend = function () { rec = null; if (active === "sim" && !got && !speakingNow) { if ((Date.now() - lastAct) / 1000 > V.idleSec) stop(); else scheduleListen(); } };
    try { rec.start(); status(t("listen"), "listen"); } catch (e) { rec = null; }
  }
  function stopListen() { clearTimeout(listenT); if (rec) { try { rec.abort(); } catch (e) {} rec = null; } }
  function nrm(s) { return (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9@.\s]/g, " ").replace(/\s+/g, " ").trim(); }
  // dictado → texto que entiende el chat (emails dichos en voz: "maria punto gonzalez arroba gmail punto com")
  function spokenToText(s) {
    var x = " " + s.toLowerCase() + " ";
    if (/arroba| at |@/.test(x)) x = x.replace(/ arroba | at /g, "@").replace(/ punto | dot /g, ".").replace(/ guion bajo | underscore /g, "_").replace(/ guion | dash | hyphen /g, "-").replace(/\s*([@._-])\s*/g, "$1");
    return x.trim();
  }
  window.R24V_spokenToText = spokenToText;
  function voiceInput(raw) {
    var txt = spokenToText(raw); logLine("user", txt);
    var w = document.querySelectorAll(".r24-chips"), last = w.length ? w[w.length - 1] : null, n = nrm(txt), words = n.split(" ");
    if (last && words.length <= 6) {
      var best = null, bs = 0;
      [].forEach.call(last.querySelectorAll("button"), function (b) {
        var cw = nrm(b.innerText).split(" ").filter(function (x) { return x.length > 3; }), sc = 0;
        cw.forEach(function (c) { if (words.some(function (wd) { return wd.length > 3 && (wd === c || (wd.length >= 5 && c.indexOf(wd.slice(0, 5)) === 0)); })) sc++; });
        if (sc > bs) { bs = sc; best = b; }
      });
      if (best) { best.click(); return; }
    }
    if (window.R24 && R24.send) R24.send(txt);
  }
  window.R24V_voiceInput = voiceInput; // usado por el test
  function simStop() { stopListen(); sayQ = []; speakingNow = false; try { speechSynthesis.cancel(); } catch (e) {} if (sheetObs) sheetObs.disconnect(); }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build); else build();
  window.R24V = { start: start, stop: stop, mode: function () { return active; }, prompt: prompt, tools: TOOLS };
})();
