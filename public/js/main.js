(function () {
  "use strict";
  const audio = document.getElementById("audio");
  if (!audio) return;

  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));
  const fmt = s => { s = Math.max(0, s | 0); return String(s / 60 | 0).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0"); };
  const parseDur = str => {
    if (!str) return 0;
    const p = String(str).split(":").map(n => parseInt(n, 10) || 0);
    let t = 0; p.forEach(n => t = t * 60 + n); return t;
  };

  const tCur = $("#tCur"), tTot = $("#tTot"), seek = $("#seek");
  const S = { playing: false, t: 0, dur: parseDur(audio.dataset.dur) || 0, speed: 1, vis: true };
  if (tTot) tTot.textContent = fmt(S.dur);

  audio.addEventListener("loadedmetadata", () => {
    if (isFinite(audio.duration) && audio.duration > 0) S.dur = audio.duration;
    if (tTot) tTot.textContent = fmt(S.dur);
    if (seek) seek.max = Math.round(S.dur);
  });

  /* espectro REAL solo si el audio está en tu propio dominio;
     si está en r2.dev / archive.org / webdav → espectro simulado */
  let analyser = null, fb = null, actx = null;
  const sameOrigin = (() => {
    try { return new URL(audio.currentSrc || audio.src, location.href).hostname === location.hostname; }
    catch (e) { return false; }
  })();
  function wire() {
    if (analyser || !sameOrigin) return;
    try {
      actx = new (window.AudioContext || window.webkitAudioContext)();
      const src = actx.createMediaElementSource(audio);
      analyser = actx.createAnalyser();
      analyser.fftSize = 256; analyser.smoothingTimeConstant = 0.8;
      src.connect(analyser); analyser.connect(actx.destination);
      fb = new Uint8Array(analyser.frequencyBinCount);
    } catch (e) { analyser = null; }
  }

  const real = () => audio.readyState >= 2 && !audio.error;

  function setPlaying(on) {
    S.playing = on;
    document.body.classList.toggle("playing", on);
    const b = $("#playBtn"); if (b) b.textContent = on ? "❚❚" : "▶";
    if (on) { wire(); if (actx && actx.state === "suspended") actx.resume().catch(() => {}); }
  }
  function toggle(force) {
    const on = force === undefined ? !S.playing : force;
    setPlaying(on);
    if (real()) {
      if (on) { audio.playbackRate = S.speed; audio.play().catch(() => {}); }
      else audio.pause();
    }
  }
  function seekTo(t) {
    S.t = Math.max(0, Math.min(S.dur, t));
    if (real()) { try { audio.currentTime = S.t; } catch (e) {} }
  }

  const CH = $$("#chapters li").map(li => parseInt(li.dataset.t, 10)).filter(n => !isNaN(n) && n > 0);

  const playBtn = $("#playBtn");
  if (playBtn) playBtn.addEventListener("click", () => toggle());
  if (seek) seek.addEventListener("input", e => seekTo(+e.target.value));
  const prevCh = $("#prevCh");
  if (prevCh) prevCh.addEventListener("click", () => { let p = 0; CH.forEach(c => { if (S.t > c + 3) p = c; }); seekTo(p); });
  const nextCh = $("#nextCh");
  if (nextCh) nextCh.addEventListener("click", () => { let n = S.dur; CH.forEach(c => { if (c > S.t + 1) n = c; }); seekTo(n); });
  const chList = $("#chapters");
  if (chList) chList.addEventListener("click", e => {
    const li = e.target.closest("li");
    if (li && li.dataset.t) seekTo(+li.dataset.t);
  });

  $$(".sp").forEach(b => b.addEventListener("click", () => {
    $$(".sp").forEach(x => x.classList.remove("on"));
    b.classList.add("on");
    S.speed = parseFloat(b.dataset.speed) || 1;
    if (real()) audio.playbackRate = S.speed;
  }));

  $$(".tgl[data-v]").forEach(b => b.addEventListener("click", () => {
    document.body.classList.remove("v-vinyl", "v-speaker", "v-mic", "v-tv");
    document.body.classList.add(b.dataset.v);
    $$(".tgl[data-v]").forEach(x => x.classList.remove("on"));
    b.classList.add("on");
  }));

  const fx = $("#fxToggle"), cv = $("#viz");
  if (fx) fx.addEventListener("click", function () {
    S.vis = !S.vis;
    this.classList.toggle("on", S.vis);
    this.textContent = S.vis ? "espectro ✓" : "espectro ✕";
    if (cv) cv.style.display = S.vis ? "block" : "none";
  });

  const tvb = $("#tvbars");
  if (tvb) for (let i = 0; i < 18; i++) tvb.appendChild(document.createElement("i"));

  function bar(i, t) {
    if (!S.playing) return 0;
    if (analyser && fb) {
      analyser.getByteFrequencyData(fb);
      return fb[Math.min(fb.length - 1, (i * 1.5) | 0)] / 255;
    }
    return Math.max(0, 0.25 + 0.75 * Math.abs(Math.sin(i * 0.55 + t * 2.2) * Math.cos(i * 0.23 - t * 1.3)) * (0.6 + 0.4 * Math.sin(t * 0.7 + i)));
  }

  let cx = null;
  function sizeCv() {
    if (!cv) return;
    const dpr = window.devicePixelRatio || 1;
    cv.width = cv.clientWidth * dpr; cv.height = 56 * dpr;
    cx = cv.getContext("2d"); cx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  sizeCv();
  addEventListener("resize", sizeCv);

  function drawViz() {
    if (!cv || !S.vis || !cx) return;
    const w = cv.clientWidth, h = 56, n = 56, bw = w / n;
    cx.clearRect(0, 0, w, h);
    const now = performance.now() / 1000;
    for (let i = 0; i < n; i++) {
      const v = bar(i, now);
      const bh = Math.max(2, v * h), x = i * bw + 1, y = h - bh;
      const g = cx.createLinearGradient(0, h, 0, y);
      g.addColorStop(0, "#2b6bff");
      g.addColorStop(0.6, "#53c8ff");
      g.addColorStop(1, (v > 0.82 && S.playing) ? "#ff8a2a" : "#53c8ff");
      cx.fillStyle = g;
      cx.beginPath();
      if (cx.roundRect) cx.roundRect(x, y, bw - 2, bh, 2); else cx.rect(x, y, bw - 2, bh);
      cx.fill();
    }
  }

  function hud() {
    if (tCur) tCur.textContent = fmt(S.t);
    if (seek) { seek.value = S.t; seek.style.setProperty("--p", (S.t / S.dur * 100) + "%"); }
    let on = -1; CH.forEach((c, i) => { if (S.t >= c) on = i; });
    $$("#chapters li").forEach((li, i) => li.classList.toggle("on", i === on));
    if (tvb) $$("#tvbars i").forEach((b, i) => { b.style.height = (15 + 70 * bar(i * 1.7, performance.now() / 1000) * 0.9) + "%"; });
  }

  let last = performance.now();
  function tick(ts) {
    const dt = Math.min(0.1, (ts - last) / 1000); last = ts;
    if (S.playing) {
      if (real()) S.t = audio.currentTime;
      else { S.t += dt * S.speed; if (S.dur > 0 && S.t >= S.dur) S.t = 0; }
    }
    drawViz(); hud();
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();
