(() => {
  "use strict";

  const TASKS = window.TASKS;
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const synth = window.speechSynthesis;
  const $ = (id) => document.getElementById(id);

  const LANGS = {
    hi: { stt: "hi-IN", tts: "hi-IN" },
    en: { stt: "en-IN", tts: "en-IN" }
  };

  const UI = window.UI;

  // Words people say to control the guide (Hindi, English, and Hindi written in English letters).
  const COMMANDS = {
    next: ["next", "continue", "go on", "अगला", "आगे", "अगले", "agla", "aage", "agle", "next step"],
    prev: ["back", "previous", "go back", "पीछे", "पिछला", "पहले वाला", "pichla", "peeche", "piche"],
    repeat: ["repeat", "again", "say again", "दोहराओ", "दोहराइए", "फिर से", "दोबारा", "dobara", "phir se", "dohrao", "फिर बोलो"],
    home: ["home", "menu", "start over", "होम", "मुख्य", "शुरू", "वापस", "सबसे पहले", "home page"],
    toEnglish: ["english", "अंग्रेज़ी", "अंग्रेजी", "इंग्लिश", "angrezi"],
    toHindi: ["hindi", "हिंदी", "हिन्दी", "हिंदी में"]
  };

  const state = { lang: "hi", task: null, idx: 0, listening: false, speaking: false };
  try { const saved = localStorage.getItem("lang"); if (saved in LANGS) state.lang = saved; } catch (_) { /* storage may be blocked */ }

  const t = () => UI[state.lang];

  /* ---------- text helpers ---------- */
  function normalize(s) {
    return s.toLowerCase().replace(/[.,!?।"'’]/g, " ").replace(/\s+/g, " ").trim();
  }
  function includesAny(text, words) {
    return words.some((w) => text.includes(w.toLowerCase()));
  }
  function findTask(text) {
    let best = null, bestScore = 0;
    for (const task of TASKS) {
      let score = 0;
      for (const w of task.words) {
        const word = w.toLowerCase();
        if (text.includes(word)) score += word.length;
      }
      if (score > bestScore) { best = task; bestScore = score; }
    }
    return best;
  }

  /* ---------- toast ---------- */
  let toastTimer;
  function toast(msg) {
    const el = $("toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 5000);
  }

  /* ---------- voice out ---------- */
  // Each line is played from a recorded clip (same clear voice on every device).
  // If a clip is missing, the device's own voice reads it, but never a wrong-language voice.
  let voices = [];
  function loadVoices() { voices = synth ? synth.getVoices() : []; }
  if (synth) { loadVoices(); synth.onvoiceschanged = loadVoices; }

  function pickVoice(lang) {
    const prefix = LANGS[lang].tts.slice(0, 2);
    const score = (v) =>
      (v.lang.replace("_", "-") === LANGS[lang].tts ? 4 : 0) +
      (/natural|neural|online|google/i.test(v.name) ? 2 : 0) +
      (v.localService ? 0 : 1);
    return voices.filter((v) => v.lang.toLowerCase().startsWith(prefix)).sort((a, b) => score(b) - score(a))[0] || null;
  }

  let speakToken = 0, currentAudio = null;

  function setSpeaking(on) { state.speaking = on; refreshMic(); }

  function stopSpeaking() {
    speakToken++;
    if (synth) synth.cancel();
    if (currentAudio) { currentAudio.onended = currentAudio.onerror = null; currentAudio.pause(); currentAudio = null; }
    setSpeaking(false);
  }

  function showVoiceNote() {
    const note = $("voiceNote");
    note.textContent = t().voiceNote;
    note.hidden = false;
  }

  // Fallback: read one line with the device voice. Returns false if no suitable voice exists.
  function speakWithDevice(text, lang, onDone) {
    const voice = pickVoice(lang);
    if (!synth || (!voice && lang === "hi")) return false;
    const u = new SpeechSynthesisUtterance(Speech.pronounce(text, lang));
    if (voice) u.voice = voice;
    u.lang = voice ? voice.lang : LANGS[lang].tts;
    u.rate = 0.9;
    u.volume = 1;
    u.onend = u.onerror = onDone;
    synth.speak(u);
    return true;
  }

  // `lines` is one text or a list of texts, spoken one after another.
  function speak(lines, onEnd) {
    stopListening();
    stopSpeaking();
    const queue = (Array.isArray(lines) ? lines : [lines]).filter(Boolean);
    if (!queue.length) return;
    const token = speakToken;
    const lang = state.lang;
    $("voiceNote").hidden = true;

    const finish = () => { if (token !== speakToken) return; setSpeaking(false); if (onEnd) onEnd(); };
    let i = 0;
    const next = () => {
      if (token !== speakToken) return;
      if (i >= queue.length) { finish(); return; }
      const line = queue[i++];
      const audio = new Audio(Speech.audioPath(lang, line));
      currentAudio = audio;
      let failed = false;
      const fallback = () => {
        if (failed || token !== speakToken) return;
        failed = true;
        if (!speakWithDevice(line, lang, next)) { showVoiceNote(); finish(); }
      };
      audio.onended = next;
      audio.onerror = fallback;
      audio.play().catch(fallback);
    };
    setSpeaking(true);
    next();
  }

  /* ---------- voice in (with live volume ring) ---------- */
  let recognition = null, meter = null;

  async function startMeter() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
      });
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      ctx.createMediaStreamSource(stream).connect(analyser);
      const data = new Uint8Array(analyser.fftSize);
      let raf;
      const tick = () => {
        analyser.getByteTimeDomainData(data);
        let sum = 0;
        for (const v of data) { const d = (v - 128) / 128; sum += d * d; }
        const level = Math.min(1, Math.sqrt(sum / data.length) * 5);
        $("mic").style.setProperty("--level", level.toFixed(2));
        raf = requestAnimationFrame(tick);
      };
      tick();
      meter = { stop() { cancelAnimationFrame(raf); stream.getTracks().forEach((tr) => tr.stop()); ctx.close(); $("mic").style.setProperty("--level", 0); } };
    } catch (_) { meter = null; /* the ring is just a nice extra */ }
  }
  function stopMeter() { if (meter) { meter.stop(); meter = null; } }

  function startListening() {
    if (!SR) { toast(t().noSupport); return; }
    stopSpeaking();
    stopListening();
    $("heard").textContent = "";

    const rec = new SR();
    recognition = rec;
    rec.lang = LANGS[state.lang].stt;
    rec.interimResults = true;
    rec.maxAlternatives = 3;
    rec.continuous = false;

    let heard = [];
    let failed = false;

    rec.onstart = () => { state.listening = true; refreshMic(); startMeter(); };
    rec.onresult = (e) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) heard = Array.from(r).map((a) => a.transcript);
        else interim += r[0].transcript;
      }
      $("heard").textContent = heard[0] || interim;
    };
    rec.onerror = (e) => {
      failed = true;
      if (e.error === "no-speech" || e.error === "audio-capture") say(t().noHear);
      else if (e.error === "not-allowed" || e.error === "service-not-allowed") toast(t().blocked);
      else if (e.error !== "aborted") toast(t().noHear);
    };
    rec.onend = () => {
      if (recognition === rec) recognition = null;
      state.listening = false;
      stopMeter();
      refreshMic();
      if (heard.length) handleSpeech(heard);
      else if (!failed) say(t().noHear);
    };

    try { rec.start(); } catch (_) { /* already started */ }
  }

  function stopListening() {
    if (recognition) { const r = recognition; recognition = null; try { r.abort(); } catch (_) {} }
    state.listening = false;
    stopMeter();
    refreshMic();
  }

  /* Show a message and read it out loud. */
  function say(msg) { $("heard").textContent = ""; toast(msg); speak(msg); }

  /* ---------- understanding what was said ---------- */
  function handleSpeech(alternatives) {
    const texts = alternatives.map(normalize);

    if (texts.some((x) => includesAny(x, COMMANDS.toEnglish))) return switchLang("en");
    if (texts.some((x) => includesAny(x, COMMANDS.toHindi))) return switchLang("hi");

    // Looking for a task first: "aadhaar card" should open the guide, even in a guide already.
    for (const x of texts) {
      const task = findTask(x);
      if (task) return openTask(task);
    }

    if (state.task) {
      for (const x of texts) {
        if (includesAny(x, COMMANDS.next)) return goStep(1);
        if (includesAny(x, COMMANDS.prev)) return goStep(-1);
        if (includesAny(x, COMMANDS.repeat)) return readStep(false);
        if (includesAny(x, COMMANDS.home)) return goHome(true);
      }
    } else if (texts.some((x) => includesAny(x, COMMANDS.repeat))) {
      return speak(t().welcome);
    }
    say(t().lost);
  }

  /* ---------- screens ---------- */
  function refreshMic() {
    const mic = $("mic");
    mic.classList.toggle("listening", state.listening);
    mic.classList.toggle("speaking", state.speaking && !state.listening);
    $("status").textContent = state.listening ? t().listening : state.speaking ? t().speaking : t().tap;
    mic.setAttribute("aria-label", t().tap);
  }

  function renderStatic() {
    document.documentElement.lang = state.lang;
    $("brand").textContent = t().brand;
    $("homeTitle").textContent = t().home;
    $("homeBtn").textContent = t().homeBtn;
    $("official").textContent = t().official;
    $("replay").textContent = t().replay;
    $("replay").setAttribute("aria-label", t().replay);
    document.querySelectorAll(".lang button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.lang === state.lang)));

    $("tiles").innerHTML = "";
    for (const task of TASKS) {
      const b = document.createElement("button");
      b.className = "tile";
      b.innerHTML = `<span class="ico" aria-hidden="true">${task.icon}</span><span></span>`;
      b.lastChild.textContent = task.name[state.lang];
      b.addEventListener("click", () => openTask(task));
      $("tiles").appendChild(b);
    }
    refreshMic();
    if (state.task) renderStep();
  }

  function renderStep() {
    const task = state.task, step = task.steps[state.idx], last = state.idx === task.steps.length - 1;
    $("taskName").textContent = `${task.icon} ${task.name[state.lang]}`;
    $("stepIcon").textContent = step.icon;
    $("stepText").textContent = step[state.lang];
    $("dots").innerHTML = task.steps.map((_, i) => `<i class="${i < state.idx ? "done" : i === state.idx ? "now" : ""}"></i>`).join("");
    $("prev").textContent = t().prev;
    $("prev").disabled = state.idx === 0;
    $("next").textContent = last ? t().done : t().next;
    $("official").href = task.link;
  }

  function show(view) {
    $("home").hidden = view !== "home";
    $("guide").hidden = view !== "guide";
    const zone = $("micZone");
    $(view === "home" ? "slotHome" : "slotGuide").appendChild(zone);
    zone.classList.toggle("compact", view === "guide");
    window.scrollTo({ top: 0 });
  }

  function goHome(announce) {
    state.task = null;
    show("home");
    $("heard").textContent = "";
    if (announce) speak(t().welcome); else stopSpeaking();
  }

  function openTask(task) {
    state.task = task;
    state.idx = 0;
    show("guide");
    renderStep();
    readStep(true);
  }

  function readStep(withTitle) {
    const task = state.task, step = task.steps[state.idx];
    const line = `${t().step} ${state.idx + 1}. ${step[state.lang]}`; // build-audio.js records exactly this line
    speak(withTitle ? [task.name[state.lang], line] : [line]);
  }

  function goStep(delta) {
    const next = state.idx + delta;
    if (next < 0) { speak(t().first); return; }
    if (next >= state.task.steps.length) { state.task = null; show("home"); speak(t().finished); return; }
    state.idx = next;
    renderStep();
    readStep(false);
  }

  function switchLang(lang) {
    if (!(lang in LANGS)) return;
    state.lang = lang;
    try { localStorage.setItem("lang", lang); } catch (_) {}
    renderStatic();
    if (state.task) readStep(true); else speak([t().langNow, t().welcome]);
  }

  /* ---------- wiring ---------- */
  $("mic").addEventListener("click", () => { state.listening ? stopListening() : startListening(); });
  $("prev").addEventListener("click", () => goStep(-1));
  $("next").addEventListener("click", () => goStep(1));
  $("replay").addEventListener("click", () => readStep(false));
  $("homeBtn").addEventListener("click", () => goHome(false));
  document.querySelectorAll(".lang button").forEach((b) => b.addEventListener("click", () => switchLang(b.dataset.lang)));

  renderStatic();
  show("home");
  if (!SR) toast(t().noSupport);
})();
