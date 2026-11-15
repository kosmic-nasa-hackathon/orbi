/* ORBI pitch deck engine.
   Structure and presentation live here and in theme.css; deck.json only holds content.
   Keyboard: arrows/space navigate, G overview, S notes, F fullscreen, P print, ? help. */
(() => {
  "use strict";

  const byId = (id) => document.getElementById(id);
  const deckEl = byId("deck");
  const notesEl = byId("notes");
  const notesBody = byId("notes-body");
  const notesTitle = byId("notes-title");
  const overviewEl = byId("overview");
  const overviewGrid = byId("overview-grid");
  const helpEl = byId("help");
  const progressEl = byId("progress");
  const counterEl = byId("counter");
  const blockEl = byId("block");
  const liveEl = byId("live");
  const prevBtn = byId("prev");
  const nextBtn = byId("next");
  const notesBtn = byId("notes-btn");
  const overviewBtn = byId("overview-btn");
  const helpBtn = byId("help-btn");

  const params = new URLSearchParams(window.location.search);
  const scrollMode = params.get("view") === "scroll";

  const state = {
    meta: {},
    slides: [],
    index: 0,
    notesOpen: false,
    overviewOpen: false,
    helpOpen: false,
    bound: false,
    lastFocus: null,
  };

  const INLINE = /\\([\\*`[\]()])|`([^`]+)`|\*\*([^*]+)\*\*|\*([^*]+)\*|\[([^\]]+)\]\(([^)\s]+)\)/g;

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function safeHref(value) {
    const href = String(value == null ? "" : value).trim();
    if (/^(https?:\/\/|mailto:)/i.test(href)) return href;
    if (href.startsWith("/") && !href.startsWith("//")) return href;
    if (href.startsWith("#")) return href;
    return "#";
  }

  function inline(value) {
    const source = String(value == null ? "" : value);
    let out = "";
    let last = 0;
    let match;
    INLINE.lastIndex = 0;
    while ((match = INLINE.exec(source)) !== null) {
      out += esc(source.slice(last, match.index));
      if (match[1] !== undefined) out += esc(match[1]);
      else if (match[2] !== undefined) out += `<code>${esc(match[2])}</code>`;
      else if (match[3] !== undefined) out += `<strong>${esc(match[3])}</strong>`;
      else if (match[4] !== undefined) out += `<em>${esc(match[4])}</em>`;
      else
        out += `<a href="${esc(safeHref(match[6]))}"${
          /^https?:/i.test(safeHref(match[6])) ? ' target="_blank" rel="noreferrer"' : ""
        }>${esc(match[5])}</a>`;
      last = INLINE.lastIndex;
    }
    return out + esc(source.slice(last));
  }

  function plain(value) {
    return String(value == null ? "" : value)
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/[*`_]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function listOf(value) {
    if (value == null) return [];
    return Array.isArray(value) ? value : [value];
  }

  function el(tag, className, html) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (html != null) node.innerHTML = html;
    return node;
  }

  function sectionAt(index) {
    return deckEl.querySelector(`#slide-${index + 1}`);
  }

  function kickerNode(text) {
    return el("p", "kicker", inline(text));
  }

  function textNodes(parent, value) {
    listOf(value).forEach((line) => {
      parent.appendChild(el("p", "slide-text", inline(line)));
    });
  }

  function bulletList(parent, items) {
    const ul = el("ul", "bullets");
    listOf(items).forEach((item) => {
      const li = el("li", null, inline(item));
      ul.appendChild(li);
    });
    parent.appendChild(ul);
  }

  function stepList(parent, items) {
    const ol = el("ol", "steps");
    listOf(items).forEach((item) => {
      const li = el("li", null, inline(item));
      ol.appendChild(li);
    });
    parent.appendChild(ol);
  }

  function renderStats(parent, stats) {
    const wrap = el("div", "stats");
    listOf(stats).forEach((stat) => {
      const card = el("div", "stat");
      card.appendChild(el("span", "stat-value", inline(stat.value)));
      card.appendChild(el("span", "stat-label", inline(stat.label)));
      if (stat.note) card.appendChild(el("span", "stat-note", inline(stat.note)));
      wrap.appendChild(card);
    });
    parent.appendChild(wrap);
  }

  function renderCards(parent, cards) {
    const wrap = el("div", "cards");
    listOf(cards).forEach((card) => {
      const tone = card.tone ? ` card--${esc(card.tone)}` : "";
      const node = el("article", `card${tone}`);
      if (card.label) node.appendChild(el("p", "card-label", inline(card.label)));
      if (card.title) node.appendChild(el("h3", "card-title", inline(card.title)));
      if (card.text) node.appendChild(el("p", "card-text", inline(card.text)));
      wrap.appendChild(node);
    });
    parent.appendChild(wrap);
  }

  function renderFlow(parent, flow) {
    const wrap = el("div", "flow");
    const highlights = listOf(flow.highlight).map(Number);
    listOf(flow.nodes).forEach((node, index) => {
      const active = highlights.indexOf(index) > -1 ? " is-highlight" : "";
      wrap.appendChild(el("span", `flow-node${active}`, inline(node)));
    });
    parent.appendChild(wrap);
  }

  function renderTable(parent, table) {
    const wrap = el("div", "table-wrap");
    const node = document.createElement("table");
    const thead = document.createElement("thead");
    const headRow = document.createElement("tr");
    listOf(table.columns).forEach((column) => {
      const th = document.createElement("th");
      th.scope = "col";
      th.innerHTML = inline(column);
      headRow.appendChild(th);
    });
    thead.appendChild(headRow);
    node.appendChild(thead);
    const tbody = document.createElement("tbody");
    listOf(table.rows).forEach((row) => {
      const tr = document.createElement("tr");
      listOf(row).forEach((cell, cellIndex) => {
        const td = document.createElement("td");
        if (cellIndex === 0) td.className = "table-key";
        td.innerHTML = inline(cell);
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    node.appendChild(tbody);
    wrap.appendChild(node);
    parent.appendChild(wrap);
  }

  function renderColumns(parent, columns) {
    const wrap = el("div", "columns");
    listOf(columns).forEach((column) => {
      const node = el("div", "column");
      if (column.title) node.appendChild(el("h3", "column-title", inline(column.title)));
      if (column.text) textNodes(node, column.text);
      if (column.bullets) bulletList(node, column.bullets);
      if (column.steps) stepList(node, column.steps);
      if (column.cards) renderCards(node, column.cards);
      if (column.callout) renderCallout(node, column.callout);
      wrap.appendChild(node);
    });
    parent.appendChild(wrap);
  }

  function renderTimeline(parent, items) {
    const wrap = el("div", "timeline");
    listOf(items).forEach((item) => {
      const node = el("div", `timeline-item${item.now ? " is-now" : ""}`);
      if (item.label) node.appendChild(el("span", "timeline-label", inline(item.label)));
      if (item.text) node.appendChild(el("span", "timeline-text", inline(item.text)));
      wrap.appendChild(node);
    });
    parent.appendChild(wrap);
  }

  function renderCallout(parent, callout) {
    const value = typeof callout === "string" ? { text: callout } : callout;
    const tone = value.tone ? ` callout--${esc(value.tone)}` : "";
    parent.appendChild(el("p", `callout${tone}`, inline(value.text)));
  }

  function renderLinks(parent, links) {
    const wrap = el("div", "links");
    listOf(links).forEach((link) => {
      const href = safeHref(link.href);
      const external = /^https?:/i.test(href);
      const anchor = el("a", "link", inline(link.label));
      anchor.href = href;
      if (external) {
        anchor.target = "_blank";
        anchor.rel = "noreferrer";
      }
      wrap.appendChild(anchor);
    });
    parent.appendChild(wrap);
  }

  function artNode(name) {
    const wrap = el("div", `art art--${esc(name)}`);
    if (name === "orbit") {
      wrap.innerHTML =
        '<svg viewBox="0 0 420 420" role="presentation" aria-hidden="true">' +
        '<defs><radialGradient id="orb-glow" cx="50%" cy="50%" r="50%">' +
        '<stop offset="0%" stop-color="#22d3ee" stop-opacity="0.22"/>' +
        '<stop offset="100%" stop-color="#22d3ee" stop-opacity="0"/>' +
        "</radialGradient></defs>" +
        '<circle cx="210" cy="210" r="190" fill="url(#orb-glow)"/>' +
        '<circle cx="210" cy="210" r="92" fill="none" stroke="rgba(148,163,184,0.22)" stroke-width="1"/>' +
        '<circle cx="210" cy="210" r="142" fill="none" stroke="rgba(148,163,184,0.16)" stroke-width="1"/>' +
        '<circle cx="210" cy="210" r="188" fill="none" stroke="rgba(148,163,184,0.1)" stroke-width="1"/>' +
        '<ellipse cx="210" cy="210" rx="190" ry="64" fill="none" stroke="rgba(34,211,238,0.32)" stroke-width="1.2" transform="rotate(-18 210 210)"/>' +
        '<ellipse cx="210" cy="210" rx="160" ry="52" fill="none" stroke="rgba(251,191,36,0.18)" stroke-width="1" transform="rotate(32 210 210)"/>' +
        '<circle cx="372" cy="142" r="7" fill="#fbbf24"/>' +
        '<circle cx="210" cy="210" r="5" fill="#22d3ee"/>' +
        "</svg>";
    }
    return wrap;
  }

  function renderSlide(slide, index, total) {
    const type = slide.type || "default";
    const section = el("section", `slide slide--${esc(type)}`);
    section.id = `slide-${index + 1}`;
    section.setAttribute("role", "group");
    section.setAttribute("aria-roledescription", "slide");
    section.setAttribute(
      "aria-label",
      `${index + 1} of ${total}: ${plain(slide.title || slide.quote || slide.kicker || "ORBI")}`,
    );

    const inner = el("div", "slide-inner");
    if (slide.art) inner.appendChild(artNode(slide.art));

    if (type === "cover") {
      inner.classList.add("cover-layout");
      if (slide.kicker) inner.appendChild(kickerNode(slide.kicker));
      if (slide.title) inner.appendChild(el("h1", "cover-title", inline(slide.title)));
      if (slide.subtitle) inner.appendChild(el("p", "cover-subtitle", inline(slide.subtitle)));
      if (slide.text) {
        const text = el("div", "cover-text");
        textNodes(text, slide.text);
        inner.appendChild(text);
      }
      if (slide.links) renderLinks(inner, slide.links);
      if (slide.footer) inner.appendChild(el("p", "slide-footer", inline(slide.footer)));
    } else if (type === "quote") {
      inner.classList.add("quote-layout");
      if (slide.kicker) inner.appendChild(kickerNode(slide.kicker));
      if (slide.quote) inner.appendChild(el("blockquote", "quote", inline(slide.quote)));
      if (slide.text) {
        const text = el("div", "quote-text");
        textNodes(text, slide.text);
        inner.appendChild(text);
      }
      if (slide.links) renderLinks(inner, slide.links);
      if (slide.footer) inner.appendChild(el("p", "slide-footer", inline(slide.footer)));
    } else {
      if (slide.kicker) inner.appendChild(kickerNode(slide.kicker));
      if (slide.title) inner.appendChild(el("h2", "slide-title", inline(slide.title)));
      if (slide.subtitle) inner.appendChild(el("p", "slide-subtitle", inline(slide.subtitle)));
      if (slide.text) textNodes(inner, slide.text);
      if (slide.stats) renderStats(inner, slide.stats);
      if (slide.flow) renderFlow(inner, slide.flow);
      if (slide.columns) renderColumns(inner, slide.columns);
      if (slide.cards) renderCards(inner, slide.cards);
      if (slide.table) renderTable(inner, slide.table);
      if (slide.steps) stepList(inner, slide.steps);
      if (slide.bullets) bulletList(inner, slide.bullets);
      if (slide.timeline) renderTimeline(inner, slide.timeline);
      if (slide.callout) renderCallout(inner, slide.callout);
      if (slide.links) renderLinks(inner, slide.links);
      if (slide.footer) inner.appendChild(el("p", "slide-footer", inline(slide.footer)));
    }

    section.appendChild(inner);
    return section;
  }

  function buildOverview() {
    overviewGrid.innerHTML = "";
    state.slides.forEach((slide, index) => {
      const button = el("button", "overview-card");
      button.type = "button";
      button.dataset.index = String(index);
      button.appendChild(el("span", "overview-num", String(index + 1).padStart(2, "0")));
      const body = el("span", "overview-body");
      if (slide.kicker) body.appendChild(el("span", "overview-kicker", inline(slide.kicker)));
      body.appendChild(
        el("span", "overview-title", inline(slide.title || slide.quote || "Slide")),
      );
      button.appendChild(body);
      button.addEventListener("click", () => {
        go(index);
        closeOverlays();
      });
      overviewGrid.appendChild(button);
    });
  }

  function updateOverview() {
    const cards = overviewGrid.querySelectorAll(".overview-card");
    cards.forEach((card) => {
      const isCurrent = Number(card.dataset.index) === state.index;
      card.classList.toggle("is-current", isCurrent);
      if (isCurrent) card.setAttribute("aria-current", "true");
      else card.removeAttribute("aria-current");
    });
  }

  function renderNotes() {
    if (!state.notesOpen) return;
    const slide = state.slides[state.index];
    if (!slide) return;
    notesTitle.textContent = plain(slide.kicker || slide.title || "Speaker notes");
    notesBody.innerHTML = "";
    const notes = listOf(slide.notes);
    if (notes.length === 0) {
      notesBody.appendChild(el("p", "notes-empty", "No notes for this slide."));
      return;
    }
    notes.forEach((note) => {
      const paragraph = el("p");
      paragraph.innerHTML = inline(note);
      notesBody.appendChild(paragraph);
    });
  }

  function updateChrome() {
    const slide = state.slides[state.index];
    const total = state.slides.length;
    counterEl.textContent = `${String(state.index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
    blockEl.textContent = plain(slide.kicker || slide.title || state.meta.title || "ORBI");
    progressEl.style.width = `${((state.index + 1) / total) * 100}%`;
    prevBtn.disabled = state.index === 0;
    nextBtn.disabled = state.index === total - 1;
    liveEl.textContent = `Slide ${state.index + 1} of ${total}. ${plain(
      slide.title || slide.quote || slide.kicker || "",
    )}`;
    const slideTitle = plain(slide.title || slide.quote || slide.kicker || "ORBI");
    document.title =
      slideTitle === "ORBI" && state.meta.title ? state.meta.title : `${slideTitle} · ORBI`;
    updateOverview();
    renderNotes();
  }

  function applySlide(index) {
    state.slides.forEach((_, current) => {
      const section = sectionAt(current);
      const active = current === index;
      section.classList.toggle("is-active", active);
      section.setAttribute("aria-hidden", String(!active));
      if (active) section.removeAttribute("inert");
      else section.setAttribute("inert", "");
    });
  }

  function writeHash(index) {
    if (scrollMode) return;
    const next = `#s/${index + 1}`;
    if (window.location.hash === next) return;
    window.history.replaceState(null, "", next);
  }

  function readHash() {
    const match = window.location.hash.match(/^#s\/(\d+)$/);
    if (!match) return null;
    const parsed = Number.parseInt(match[1], 10) - 1;
    if (Number.isNaN(parsed)) return null;
    return clamp(parsed);
  }

  function clamp(index) {
    return Math.max(0, Math.min(state.slides.length - 1, index));
  }

  function go(index, options) {
    const settings = options || {};
    const next = clamp(index);
    state.index = next;
    if (scrollMode) {
      const section = sectionAt(next);
      if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
      updateChrome();
      if (!settings.fromHash) writeHash(next);
      return;
    }
    applySlide(next);
    updateChrome();
    if (!settings.fromHash) writeHash(next);
  }

  function next() {
    go(state.index + 1);
  }

  function previous() {
    go(state.index - 1);
  }

  function setNotes(open) {
    state.notesOpen = open;
    notesEl.hidden = !open;
    notesBtn.setAttribute("aria-pressed", String(open));
    if (open) renderNotes();
  }

  function setOverview(open) {
    state.overviewOpen = open;
    overviewEl.hidden = !open;
    overviewBtn.setAttribute("aria-pressed", String(open));
    if (open) {
      updateOverview();
      state.lastFocus = document.activeElement;
      const close = byId("overview-close");
      if (close) close.focus();
    }
  }

  function setHelp(open) {
    state.helpOpen = open;
    helpEl.hidden = !open;
    helpBtn.setAttribute("aria-pressed", String(open));
    if (open) {
      state.lastFocus = document.activeElement;
      const close = byId("help-close");
      if (close) close.focus();
    }
  }

  function closeOverlays() {
    const hadOverlay = state.overviewOpen || state.helpOpen;
    setOverview(false);
    setHelp(false);
    setNotes(false);
    if (hadOverlay && state.lastFocus && typeof state.lastFocus.focus === "function") {
      state.lastFocus.focus();
    }
  }

  function toggleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
      return;
    }
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  }

  function isTyping(target) {
    const tag = (target && target.tagName ? target.tagName : "").toLowerCase();
    return tag === "input" || tag === "textarea" || tag === "select";
  }

  function bind() {
    if (state.bound) return;
    state.bound = true;

    prevBtn.addEventListener("click", previous);
    nextBtn.addEventListener("click", next);
    overviewBtn.addEventListener("click", () => setOverview(!state.overviewOpen));
    notesBtn.addEventListener("click", () => setNotes(!state.notesOpen));
    helpBtn.addEventListener("click", () => setHelp(!state.helpOpen));
    byId("fullscreen-btn").addEventListener("click", toggleFullscreen);
    byId("notes-close").addEventListener("click", () => setNotes(false));
    byId("overview-close").addEventListener("click", () => setOverview(false));
    byId("help-close").addEventListener("click", () => setHelp(false));

    [overviewEl, helpEl].forEach((overlay) => {
      overlay.addEventListener("click", (event) => {
        if (event.target === overlay) {
          if (overlay === overviewEl) setOverview(false);
          else setHelp(false);
        }
      });
    });

    document.addEventListener("keydown", (event) => {
      if (isTyping(event.target)) return;
      if (event.defaultPrevented) return;
      const key = event.key;
      if (key === "ArrowRight" || key === "ArrowDown" || key === "PageDown") {
        event.preventDefault();
        next();
      } else if (key === "ArrowLeft" || key === "ArrowUp" || key === "PageUp") {
        event.preventDefault();
        previous();
      } else if (key === " " && !/^(button|a)$/i.test((event.target.tagName || "").toLowerCase())) {
        event.preventDefault();
        next();
      } else if (key === "Home") {
        event.preventDefault();
        go(0);
      } else if (key === "End") {
        event.preventDefault();
        go(state.slides.length - 1);
      } else if (key === "g" || key === "G") {
        event.preventDefault();
        setOverview(!state.overviewOpen);
      } else if (key === "s" || key === "S") {
        event.preventDefault();
        setNotes(!state.notesOpen);
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
        closeOverlays();
      }
    });

    window.addEventListener("hashchange", () => {
      const target = readHash();
      if (target != null && target !== state.index) go(target, { fromHash: true });
    });

    let startX = 0;
    let startY = 0;
    let tracking = false;
    deckEl.addEventListener(
      "pointerdown",
      (event) => {
        if (scrollMode || event.pointerType === "mouse") return;
        startX = event.clientX;
        startY = event.clientY;
        tracking = true;
      },
      { passive: true },
    );
    deckEl.addEventListener(
      "pointerup",
      (event) => {
        if (!tracking) return;
        tracking = false;
        const dx = event.clientX - startX;
        const dy = event.clientY - startY;
        if (Math.abs(dx) > 46 && Math.abs(dx) > Math.abs(dy) * 1.4) {
          if (dx < 0) next();
          else previous();
        }
      },
      { passive: true },
    );
  }

  function build(data) {
    if (!data || !Array.isArray(data.slides) || data.slides.length === 0) {
      throw new Error("deck.json has no slides");
    }
    state.meta = data.meta || {};
    state.slides = data.slides;
    deckEl.innerHTML = "";

    const fragment = document.createDocumentFragment();
    state.slides.forEach((slide, index) => {
      fragment.appendChild(renderSlide(slide, index, state.slides.length));
    });
    deckEl.appendChild(fragment);
    buildOverview();
    bind();

    if (scrollMode) {
      document.body.classList.add("is-scroll");
      state.slides.forEach((_, index) => {
        const section = sectionAt(index);
        section.classList.add("is-active");
        section.removeAttribute("inert");
        section.setAttribute("aria-hidden", "false");
      });
      updateChrome();
      const target = readHash();
      if (target != null) requestAnimationFrame(() => sectionAt(target).scrollIntoView());
      return;
    }

    const initial = readHash();
    go(initial == null ? 0 : initial, { fromHash: true });
  }

  fetch("/pitch/full/deck.json", { cache: "no-cache" })
    .then((response) => {
      if (!response.ok) throw new Error(`deck.json returned ${response.status}`);
      return response.json();
    })
    .then(build)
    .catch((error) => {
      deckEl.innerHTML = `<p class="deck-error">Could not load the deck. ${esc(error.message)}</p>`;
    });
})();
