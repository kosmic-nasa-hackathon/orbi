/* ORBI 5-slide pitch. Five slides, 2:55 target, speaker notes and a rehearsal timer.
   The content mirrors docs/ORBI_Organizacion_Diapositivas_Pitch.pdf; screenshots are real
   captures of the ORBI prototype. */
(() => {
  "use strict";

  const slides = Array.from(document.querySelectorAll(".slide"));
  const byId = (id) => document.getElementById(id);
  const deck = byId("deck");
  const prevBtn = byId("prev");
  const nextBtn = byId("next");
  const counter = byId("counter");
  const progress = byId("progress");
  const slideClock = byId("slide-clock");
  const timerToggle = byId("timer-toggle");
  const timerReset = byId("timer-reset");
  const timerValue = byId("timer");
  const timer = timerValue?.parentElement ?? null;
  const introVideo = byId("orbi-intro");
  const videoToggle = byId("video-toggle");
  const demoVideo = byId("orbi-demo");
  const reduceMotion =
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  let videoUserPaused = false;
  const notesBtn = byId("notes-btn");
  const notesEl = byId("notes");
  const notesBody = byId("notes-body");
  const notesTitle = byId("notes-title");
  const notesClose = byId("notes-close");
  const helpBtn = byId("help-btn");
  const helpEl = byId("help");
  const helpClose = byId("help-close");
  const fullscreenBtn = byId("fullscreen-btn");

  const TARGET_SECONDS = 175;
  const WATCH_SECONDS = 165;
  const state = { index: 0, notesOpen: false, helpOpen: false };
  let elapsed = 0;
  let running = false;
  let startedAt = 0;
  let frame = 0;

  function clamp(index) {
    return Math.max(0, Math.min(slides.length - 1, index));
  }

  function clock(seconds) {
    const value = Math.max(0, Math.round(seconds));
    return `${Math.floor(value / 60)}:${String(value % 60).padStart(2, "0")}`;
  }

  function slideLabel(index) {
    const label = slides[index]?.getAttribute("aria-label") ?? "";
    return label.split(":").slice(1).join(":").trim() || `Slide ${index + 1}`;
  }

  function syncVideoButton() {
    if (!introVideo || !videoToggle) return;
    const paused = introVideo.paused;
    videoToggle.textContent = paused ? "Play" : "Pause";
    videoToggle.setAttribute("aria-label", paused ? "Play intro video" : "Pause intro video");
  }

  function updateNotes() {
    if (!state.notesOpen) return;
    const slide = slides[state.index];
    if (!slide) return;
    const notes = slide.querySelector(".slide-notes");
    notesTitle.textContent = slideLabel(state.index);
    notesBody.innerHTML = notes ? notes.innerHTML : "<p>No notes for this slide.</p>";
  }

  function updateChrome() {
    const slide = slides[state.index];
    if (!slide) return;
    const total = slides.length;
    counter.textContent = `${String(state.index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
    prevBtn.disabled = state.index === 0;
    nextBtn.disabled = state.index === total - 1;
    const start = Number(slide.dataset.start ?? 0);
    const end = Number(slide.dataset.end ?? 0);
    slideClock.textContent = `${String(state.index + 1).padStart(2, "0")} · ${clock(start)}–${clock(end)}`;
    progress.style.width = `${((state.index + 1) / total) * 100}%`;
    document.title = `${slideLabel(state.index)} · ORBI Pitch`;
    updateNotes();
  }

  function applySlide(index) {
    slides.forEach((slide, current) => {
      const active = current === index;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", String(!active));
      if (active) slide.removeAttribute("inert");
      else slide.setAttribute("inert", "");
    });
    if (demoVideo && !slides[index]?.contains(demoVideo)) demoVideo.pause();
    if (introVideo) {
      if (index === 0 && !videoUserPaused && !reduceMotion) {
        introVideo.play().catch(() => syncVideoButton());
      } else {
        introVideo.pause();
      }
    }
  }

  function writeHash(index) {
    const next = `#s/${index + 1}`;
    if (window.location.hash === next) return;
    window.history.replaceState(null, "", next);
  }

  function goTo(index, options = {}) {
    const next = clamp(index);
    state.index = next;
    applySlide(next);
    updateChrome();
    if (!options.fromHash) writeHash(next);
  }

  function next() {
    goTo(state.index + 1);
  }

  function previous() {
    goTo(state.index - 1);
  }

  function setNotes(open) {
    state.notesOpen = open;
    notesEl.hidden = !open;
    notesBtn.setAttribute("aria-pressed", String(open));
    if (open) updateNotes();
  }

  function setHelp(open) {
    state.helpOpen = open;
    helpEl.hidden = !open;
    helpBtn.setAttribute("aria-pressed", String(open));
    if (open) byId("help-close")?.focus();
  }

  function closePanels() {
    setNotes(false);
    setHelp(false);
  }

  function renderTimer() {
    const total = elapsed + (running ? performance.now() - startedAt : 0);
    timerValue.textContent = clock(total / 1000);
    if (!timer) return;
    timer.classList.toggle("is-watch", total / 1000 >= WATCH_SECONDS && total / 1000 < TARGET_SECONDS);
    timer.classList.toggle("is-danger", total / 1000 >= TARGET_SECONDS);
  }

  function tickTimer() {
    if (!running) return;
    renderTimer();
    frame = requestAnimationFrame(tickTimer);
  }

  function startTimer() {
    if (running) return;
    running = true;
    startedAt = performance.now();
    timerToggle.textContent = "Pause";
    tickTimer();
  }

  function pauseTimer() {
    if (!running) return;
    elapsed += performance.now() - startedAt;
    running = false;
    timerToggle.textContent = "Start";
    cancelAnimationFrame(frame);
    renderTimer();
  }

  function resetTimer() {
    running = false;
    elapsed = 0;
    startedAt = 0;
    timerToggle.textContent = "Start";
    cancelAnimationFrame(frame);
    renderTimer();
  }

  function toggleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => {});
      return;
    }
    document.documentElement.requestFullscreen?.().catch(() => {});
  }

  function isTyping(target) {
    const tag = (target?.tagName ?? "").toLowerCase();
    return tag === "input" || tag === "textarea" || tag === "select";
  }

  prevBtn.addEventListener("click", previous);
  nextBtn.addEventListener("click", next);
  notesBtn.addEventListener("click", () => setNotes(!state.notesOpen));
  notesClose.addEventListener("click", () => setNotes(false));
  helpBtn.addEventListener("click", () => setHelp(!state.helpOpen));
  helpClose.addEventListener("click", () => setHelp(false));
  fullscreenBtn.addEventListener("click", toggleFullscreen);
  timerToggle.addEventListener("click", () => (running ? pauseTimer() : startTimer()));
  timerReset.addEventListener("click", resetTimer);

  if (introVideo) {
    introVideo.addEventListener("play", syncVideoButton);
    introVideo.addEventListener("pause", syncVideoButton);
    introVideo.addEventListener("loadeddata", syncVideoButton);
    if (reduceMotion) introVideo.pause();
    videoToggle?.addEventListener("click", () => {
      if (introVideo.paused) {
        videoUserPaused = false;
        introVideo.play().catch(() => syncVideoButton());
      } else {
        videoUserPaused = true;
        introVideo.pause();
      }
      syncVideoButton();
    });
    syncVideoButton();
  }

  helpEl.addEventListener("click", (event) => {
    if (event.target === helpEl) setHelp(false);
  });

  document.addEventListener("keydown", (event) => {
    if (isTyping(event.target)) return;
    const key = event.key;
    if (key === "ArrowRight" || key === "ArrowDown" || key === "PageDown") {
      event.preventDefault();
      next();
    } else if (key === "ArrowLeft" || key === "ArrowUp" || key === "PageUp") {
      event.preventDefault();
      previous();
    } else if (key === " " && !event.target?.closest?.("button, a, input, textarea, select, video")) {
      event.preventDefault();
      next();
    } else if (key === "Home") {
      event.preventDefault();
      goTo(0);
    } else if (key === "End") {
      event.preventDefault();
      goTo(slides.length - 1);
    } else if (key === "n" || key === "N") {
      event.preventDefault();
      setNotes(!state.notesOpen);
    } else if (key === "t" || key === "T") {
      event.preventDefault();
      running ? pauseTimer() : startTimer();
    } else if (key === "r" || key === "R") {
      event.preventDefault();
      resetTimer();
    } else if (key === "f" || key === "F") {
      event.preventDefault();
      toggleFullscreen();
    } else if (key === "p" || key === "P") {
      event.preventDefault();
      window.print();
    } else if (key === "?") {
      event.preventDefault();
      setHelp(!state.helpOpen);
    } else if (key === "Escape") {
      closePanels();
    }
  });

  window.addEventListener("hashchange", () => {
    const match = window.location.hash.match(/^#s\/(\d+)$/);
    if (!match) return;
    const index = Number.parseInt(match[1], 10) - 1;
    if (!Number.isNaN(index) && index !== state.index) goTo(index, { fromHash: true });
  });

  window.addEventListener("beforeunload", () => cancelAnimationFrame(frame));

  function init() {
    deck.setAttribute("aria-live", "polite");
    const match = window.location.hash.match(/^#s\/(\d+)$/);
    const initial = match ? Number.parseInt(match[1], 10) - 1 : 0;
    goTo(Number.isNaN(initial) ? 0 : initial, { fromHash: true });
    renderTimer();
  }

  init();
})();
