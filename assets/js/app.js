/* ==========================================================================
   Growatt Komplettanlagen – Interaktionen & Animationen
   Vanilla JS, keine Abhängigkeiten. Nutzt progressive Enhancement:
   View Transitions, IntersectionObserver, <dialog>, scroll-driven animations.
   ========================================================================== */
(() => {
  "use strict";

  const CFG = window.SITE_CONFIG;
  const PACKAGES = window.PACKAGES;
  const COMPONENTS = window.COMPONENTS;
  const CATEGORIES = window.CATEGORIES;

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(pointer: fine)").matches;
  const nf = new Intl.NumberFormat("de-DE");
  const nf1 = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 1 });
  const nf2 = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 2 });
  const eur = (v) => nf.format(Math.round(v)) + " €";
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const byId = (id) => PACKAGES.find((p) => p.id === id);

  const store = {
    get(key, fallback) {
      try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* privat / blockiert */ }
    },
  };

  const vt = (fn) => {
    if (!document.startViewTransition || reduced) { fn(); return null; }
    return document.startViewTransition(fn);
  };

  /* ---------------------------------------------------------------------- */
  /* Abgeleitete Kennzahlen                                                  */
  /* ---------------------------------------------------------------------- */
  const kwp = (p) => (p.modules * p.moduleWp) / 1000;
  const yieldOf = (p) => (p.modules ? kwp(p) : p.existingKwp || 0) * CFG.specificYield;
  const hasType = (p, type) => p.components.some(([id]) => COMPONENTS[id].type === type);
  const qtyOfType = (p, type) => p.components.reduce((n, [id, q]) => n + (COMPONENTS[id].type === type ? q : 0), 0);
  const inverterOf = (p) => {
    const c = p.components.find(([id]) => ["inverter", "micro"].includes(COMPONENTS[id].type));
    return c ? COMPONENTS[c[0]].name : "–";
  };
  const autarkyLabel = (p) => (p.autarky ? `ca. ${p.autarky} %` : `+${p.autarkyGain} %`);
  const priceLabel = (p) => (CFG.showPrices ? eur(p.price) : "auf Anfrage");

  /* ---------------------------------------------------------------------- */
  /* Stilisierte Produkt-Visuals (SVG)                                       */
  /* ---------------------------------------------------------------------- */
  let vid = 0;

  function defs(id) {
    return `<defs>
      <linearGradient id="dv${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f6f8fb"/><stop offset="1" stop-color="#bcc6d2"/></linearGradient>
      <linearGradient id="ds${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9aa6b4"/><stop offset="1" stop-color="#6c7887"/></linearGradient>
      <linearGradient id="dk${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2a3644"/><stop offset="1" stop-color="#121a24"/></linearGradient>
      <linearGradient id="pv${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3567a6"/><stop offset=".55" stop-color="#16325e"/><stop offset="1" stop-color="#0b1a35"/></linearGradient>
      <linearGradient id="sw${id}" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".35"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
      <filter id="sh${id}" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="12" stdDeviation="9" flood-color="#000" flood-opacity=".55"/></filter>
      <clipPath id="cp${id}"><rect width="320" height="220"/></clipPath>
    </defs>`;
  }

  const box = (id, x, y, w, h, r, face, depth = 7) => `
    <path d="M${x + w} ${y + r} l${depth} ${-depth * 0.6} v${h - r} l${-depth} ${depth * 0.6} z" fill="url(#ds${id})"/>
    <path d="M${x + r} ${y} h${w - r} l${depth} ${-depth * 0.6} h${-w + r} z" fill="#e9eef3" opacity=".7"/>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${face}"/>`;

  const devices = {
    inverter: (id, x, base) => {
      const w = 66, h = 84, y = base - h;
      return { w, svg: `<g class="float" filter="url(#sh${id})">${box(id, x, y, w, h, 9, `url(#dv${id})`)}
        <rect x="${x + 12}" y="${y + 14}" width="${w - 24}" height="12" rx="3" fill="#1b2430"/>
        <rect x="${x + 15}" y="${y + 17}" width="18" height="6" rx="1.5" fill="var(--accent)" opacity=".85"/>
        <circle cx="${x + w / 2}" cy="${y + h - 16}" r="3" fill="var(--accent)"><animate attributeName="opacity" values="1;.3;1" dur="2s" repeatCount="indefinite"/></circle>
        <path d="M${x + 12} ${y + 38} h${w - 24} M${x + 12} ${y + 46} h${w - 34}" stroke="#aab4c0" stroke-width="2" stroke-linecap="round"/></g>` };
    },
    micro: (id, x, base) => {
      const w = 58, h = 30, y = base - h;
      return { w, svg: `<g class="float d2" filter="url(#sh${id})">${box(id, x, y, w, h, 6, `url(#dk${id})`, 5)}
        <path d="M${x + 10} ${y + 10} h${w - 20} M${x + 10} ${y + 16} h${w - 20} M${x + 10} ${y + 22} h${w - 20}" stroke="#3b4a5c" stroke-width="2"/>
        <circle cx="${x + w - 9}" cy="${y + 8}" r="2.5" fill="var(--accent)"/></g>` };
    },
    noah: (id, x, base) => {
      const w = 78, h = 56, y = base - h;
      return { w, svg: `<g class="float d1" filter="url(#sh${id})">${box(id, x, y, w, h, 10, `url(#dv${id})`)}
        <rect x="${x + 10}" y="${y + 12}" width="${w - 20}" height="5" rx="2.5" fill="#c9d2dc"/>
        <rect x="${x + 10}" y="${y + h - 16}" width="${(w - 20) * 0.7}" height="5" rx="2.5" fill="var(--accent)"/>
        <circle cx="${x + w - 14}" cy="${y + h - 13.5}" r="2.5" fill="var(--accent)"/></g>` };
    },
    battery: (id, x, base, n = 2) => {
      const w = 60, mh = 22, gap = 3, cap = 10;
      const shown = clamp(n, 1, 4);
      let out = "";
      for (let i = 0; i < shown; i++) {
        const y = base - (i + 1) * (mh + gap);
        out += `${box(id, x, y, w, mh, 5, `url(#dv${id})`, 6)}
          <rect x="${x + 7}" y="${y + 9}" width="4" height="4" rx="1" fill="var(--accent)"/>
          <path d="M${x + 16} ${y + 11} h${w - 26}" stroke="#b3bdc9" stroke-width="2" stroke-linecap="round"/>`;
      }
      const top = base - shown * (mh + gap) - cap;
      out += box(id, x, top, w, cap, 4, `url(#dk${id})`, 6);
      return { w, svg: `<g class="float d3" filter="url(#sh${id})">${out}</g>` };
    },
    wallbox: (id, x, base) => {
      const w = 40, h = 64, y = base - h - 16;
      return { w, svg: `<g class="float d2" filter="url(#sh${id})">${box(id, x, y, w, h, 12, `url(#dk${id})`, 5)}
        <circle cx="${x + w / 2}" cy="${y + 24}" r="10" fill="none" stroke="var(--accent-2)" stroke-width="3"><animate attributeName="stroke-opacity" values="1;.35;1" dur="2.4s" repeatCount="indefinite"/></circle>
        <path d="M${x + w / 2} ${y + h} q 0 18 -16 22" stroke="#2a3644" stroke-width="4" fill="none" stroke-linecap="round"/></g>` };
    },
    meter: (id, x, base) => {
      const w = 44, h = 54, y = base - h;
      return { w, svg: `<g class="float d1" filter="url(#sh${id})">${box(id, x, y, w, h, 6, `url(#dv${id})`, 5)}
        <rect x="${x + 8}" y="${y + 10}" width="${w - 16}" height="14" rx="2" fill="#1b2430"/>
        <text x="${x + w / 2}" y="${y + 20.5}" text-anchor="middle" font-size="8" font-family="monospace" fill="var(--accent)">0.00</text>
        <path d="M${x + 8} ${y + 34} h${w - 16} M${x + 8} ${y + 42} h${w - 22}" stroke="#aab4c0" stroke-width="2" stroke-linecap="round"/></g>` };
    },
    dongle: (id, x, base) => {
      const w = 26, h = 70, y = base - h;
      return { w, svg: `<g class="float d2" filter="url(#sh${id})">${box(id, x, y, w, h, 6, `url(#dk${id})`, 4)}
        <rect x="${x + 7}" y="${y - 10}" width="${w - 14}" height="12" rx="2" fill="#9aa6b4"/>
        <path d="M${x + w / 2 - 7} ${y + 26} q7 -7 14 0 M${x + w / 2 - 4} ${y + 31} q4 -4 8 0" stroke="var(--accent-2)" stroke-width="2" fill="none" stroke-linecap="round"/>
        <circle cx="${x + w / 2}" cy="${y + 36}" r="2" fill="var(--accent-2)"/></g>` };
    },
  };

  function panels(id, cols, rows, cx, top) {
    const cw = 26, ch = 40, g = 3;
    const w = cols * (cw + g), h = rows * (ch + g);
    let cells = "";
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++)
        cells += `<rect x="${c * (cw + g)}" y="${r * (ch + g)}" width="${cw}" height="${ch}" rx="2" fill="url(#pv${id})" stroke="#5b8ccc" stroke-opacity=".5" stroke-width=".8"/>
          <path d="M${c * (cw + g) + cw / 2} ${r * (ch + g)} v${ch} M${c * (cw + g)} ${r * (ch + g) + ch / 3} h${cw} M${c * (cw + g)} ${r * (ch + g) + (2 * ch) / 3} h${cw}" stroke="#7aa7e0" stroke-opacity=".18" stroke-width=".6"/>`;
    // leichte Perspektive: Dachfläche geneigt
    const sx = cx - w * 0.42;
    return `<g transform="matrix(.84 0 -.42 .5 ${sx + h * 0.42 * 0.5} ${top})">
      <clipPath id="pc${id}"><rect x="-6" y="-6" width="${w + 9}" height="${h + 9}" rx="5"/></clipPath>
      <rect x="-6" y="-6" width="${w + 9}" height="${h + 9}" rx="5" fill="#0a111b" opacity=".85"/>
      ${cells}
      <g clip-path="url(#pc${id})"><rect class="sweep" x="-80" y="-10" width="60" height="${h + 20}" fill="url(#sw${id})"/></g>
    </g>`;
  }

  function sceneSvg(id, items, opts = {}) {
    const base = opts.base ?? 196;
    const gap = 16;
    const built = [];
    let total = 0;
    items.forEach(([type, arg], i) => {
      const d = devices[type](id, 0, base, arg);
      built.push({ type, arg, w: d.w });
      total += d.w + (i ? gap : 0);
    });
    let x = 160 - total / 2 + (opts.shift || 0);
    let out = "";
    built.forEach((b, i) => {
      if (i) x += gap;
      out += devices[b.type](id, x, base, b.arg).svg;
      x += b.w;
    });
    return out;
  }

  function visual(hue, inner, align = "xMidYMid") {
    return `<div class="visual" style="--hue:${hue}"><svg viewBox="0 0 320 220" aria-hidden="true" preserveAspectRatio="${align} meet">${inner}</svg></div>`;
  }

  function packageVisual(p, align) {
    const id = ++vid;
    const items = [];
    if (hasType(p, "micro")) items.push(["micro"]);
    if (hasType(p, "inverter")) items.push(["inverter"]);
    if (hasType(p, "noah")) items.push(["noah"]);
    if (hasType(p, "battery")) items.push(["battery", qtyOfType(p, "battery")]);
    if (hasType(p, "wallbox")) items.push(["wallbox"]);
    let roof = "";
    if (p.modules) {
      const cols = p.modules >= 30 ? 9 : p.modules >= 20 ? 8 : p.modules >= 10 ? 6 : 2;
      const rows = p.modules >= 10 ? 2 : 1;
      roof = panels(id, cols, rows, 170, 22);
    } else {
      roof = `<g opacity=".35">${panels(id, 6, 2, 170, 22)}</g>`;
    }
    const ground = `<ellipse cx="160" cy="200" rx="130" ry="10" fill="#000" opacity=".35"/>`;
    return visual(p.hue, defs(id) + `<g clip-path="url(#cp${id})">${roof}${ground}${sceneSvg(id, items)}</g>`, align);
  }

  function componentVisual(key, hue = 160) {
    const c = COMPONENTS[key];
    const id = ++vid;
    const type = c.type;
    const arg = type === "battery" ? 3 : undefined;
    const ground = `<ellipse cx="160" cy="194" rx="90" ry="10" fill="#000" opacity=".35"/>`;
    const inner = `<g transform="translate(160 192) scale(1.7) translate(-160 -200)">${sceneSvg(id, [[type, arg]])}</g>`;
    return visual(hue, defs(id) + ground + inner);
  }

  function pvVisual() {
    const id = ++vid;
    return visual(220, defs(id) + `<g transform="translate(160 110) scale(2.4) translate(-160 -110)">${panels(id, 3, 1, 172, 92)}</g>`);
  }

  const compHue = { inverter: 150, micro: 165, noah: 175, battery: 200, wallbox: 45, meter: 260, dongle: 300 };

  /* ---------------------------------------------------------------------- */
  /* State                                                                   */
  /* ---------------------------------------------------------------------- */
  const state = {
    filter: "all",
    sort: "reco",
    saved: new Set(store.get("gw_saved", [])),
    compare: new Set(),
  };
  const persistSaved = () => store.set("gw_saved", [...state.saved]);

  /* ---------------------------------------------------------------------- */
  /* Rendering: Filter-Chips, Grid, Komponenten                              */
  /* ---------------------------------------------------------------------- */
  const chipsEl = $("#chips");
  const gridEl = $("#grid");

  function renderChips() {
    chipsEl.innerHTML = CATEGORIES.map(
      (c) => `<button class="chip" role="tab" data-filter="${c.id}" aria-selected="${c.id === state.filter}">${c.id === state.filter ? '<span class="chip__pill"></span>' : ""}${c.label}</button>`
    ).join("");
  }

  function sorted(list) {
    const s = [...list];
    const by = {
      "price-asc": (a, b) => a.price - b.price,
      "price-desc": (a, b) => b.price - a.price,
      "kwp-desc": (a, b) => kwp(b) - kwp(a),
      "storage-desc": (a, b) => b.storage - a.storage,
    }[state.sort];
    return by ? s.sort(by) : s;
  }

  function cardHtml(p) {
    const comps = p.components
      .filter(([id]) => !["meter", "dongle"].includes(COMPONENTS[id].type))
      .map(([id, q]) => `<span class="tag">${q > 1 ? q + "× " : ""}${COMPONENTS[id].name}</span>`)
      .join("");
    const saved = state.saved.has(p.id);
    const firstSpec = p.modules
      ? `<div class="spec"><b>${nf2.format(kwp(p))}</b><span>kWp Leistung</span></div>`
      : `<div class="spec"><b>Bestand</b><span>PV vorhanden</span></div>`;
    return `<article class="card" data-id="${p.id}" style="--hue:${p.hue}; view-transition-name: card-${p.id}">
      ${p.badge ? `<span class="card__badge">${p.badge}</span>` : ""}
      <button class="icon-btn card__fav" data-fav="${p.id}" aria-pressed="${saved}" aria-label="${p.name} merken">
        <svg viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.8 4.5c2.1 0 3.6 1.1 4.4 2.6.8-1.5 2.3-2.6 4.4-2.6 3.8 0 5.9 3.9 4.4 7.3C18.9 16.4 12 21 12 21z"/></svg>
      </button>
      ${packageVisual(p)}
      <div class="card__body">
        <div class="card__title"><h3>${p.name}</h3></div>
        <p class="card__tagline">${p.tagline}</p>
        <div class="specs">
          ${firstSpec}
          <div class="spec"><b>${nf2.format(p.storage)}</b><span>kWh Speicher</span></div>
          <div class="spec"><b>${p.autarky ? p.autarky + " %" : "+" + p.autarkyGain + " %"}</b><span>Autarkie*</span></div>
        </div>
        <div class="card__comps">${comps}</div>
        <div class="card__foot">
          <div class="price"><small>${p.priceNote || "Richtpreis inkl. Montage"}</small><strong>${priceLabel(p)}</strong></div>
          <div class="card__actions">
            <button class="btn btn--ghost btn--sm" data-detail="${p.id}">Details</button>
            <button class="btn btn--primary btn--sm" data-reserve="${p.id}">Reservieren</button>
          </div>
        </div>
        <div class="card__row">
          <label class="cmp"><input type="checkbox" data-compare="${p.id}" ${state.compare.has(p.id) ? "checked" : ""}/> Vergleichen</label>
          <span class="muted" style="font-size:.8rem">${p.suited}</span>
        </div>
      </div>
    </article>`;
  }

  function renderGrid() {
    const list = sorted(PACKAGES.filter((p) => state.filter === "all" || p.category.includes(state.filter)));
    gridEl.innerHTML = list.map(cardHtml).join("");
  }

  function renderRail() {
    $("#rail").innerHTML = Object.entries(COMPONENTS)
      .map(
        ([key, c]) => `<article class="comp">
          ${componentVisual(key, compHue[c.type])}
          <div class="comp__body">
            <span class="comp__group">${c.group}</span>
            <h3>${c.name}</h3>
            <p>${c.desc}</p>
            <div class="card__comps">${c.specs.map((s) => `<span class="tag">${s}</span>`).join("")}</div>
          </div>
        </article>`
      )
      .join("");
  }

  chipsEl.addEventListener("click", (e) => {
    const chip = e.target.closest("[data-filter]");
    if (!chip || chip.dataset.filter === state.filter) return;
    state.filter = chip.dataset.filter;
    vt(() => { renderChips(); renderGrid(); });
  });

  $("#sort").addEventListener("change", (e) => {
    state.sort = e.target.value;
    vt(renderGrid);
  });

  $$("[data-rail]").forEach((b) =>
    b.addEventListener("click", () => {
      const rail = $("#rail");
      const card = rail.firstElementChild;
      rail.scrollBy({ left: (card ? card.offsetWidth + 18 : 300) * Number(b.dataset.rail), behavior: reduced ? "auto" : "smooth" });
    })
  );

  /* ---------------------------------------------------------------------- */
  /* Karten: Tilt + Spotlight                                                */
  /* ---------------------------------------------------------------------- */
  if (finePointer && !reduced) {
    gridEl.addEventListener("pointermove", (e) => {
      const card = e.target.closest(".card");
      if (!card) return;
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      card.classList.add("is-tilting");
      card.style.setProperty("--mx", `${x * 100}%`);
      card.style.setProperty("--my", `${y * 100}%`);
      card.style.setProperty("--rx", `${(0.5 - y) * 6}deg`);
      card.style.setProperty("--ry", `${(x - 0.5) * 8}deg`);
    });
    gridEl.addEventListener("pointerout", (e) => {
      const card = e.target.closest(".card");
      if (!card || card.contains(e.relatedTarget)) return;
      card.classList.remove("is-tilting");
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
    });
  }

  /* ---------------------------------------------------------------------- */
  /* Merkliste & Vergleich                                                   */
  /* ---------------------------------------------------------------------- */
  const savedCount = $("#savedCount");
  function updateSavedCount(bump) {
    savedCount.hidden = state.saved.size === 0;
    savedCount.textContent = state.saved.size;
    if (bump) { savedCount.classList.remove("bump"); void savedCount.offsetWidth; savedCount.classList.add("bump"); }
  }

  function toggleSaved(id) {
    const p = byId(id);
    if (state.saved.has(id)) { state.saved.delete(id); toast(`${p.name} von der Merkliste entfernt`, "♡"); }
    else { state.saved.add(id); toast(`${p.name} gemerkt`, "♥"); }
    persistSaved();
    updateSavedCount(true);
    $$(`[data-fav="${id}"]`).forEach((b) => b.setAttribute("aria-pressed", state.saved.has(id)));
  }

  const compareBar = $("#compareBar");
  function updateCompareBar() {
    compareBar.hidden = state.compare.size === 0;
    $("#compareItems").innerHTML = [...state.compare].map((id) => `<span class="tag">${byId(id).name}</span>`).join("");
    $("#openCompare").disabled = state.compare.size < 2;
    $("#openCompare").textContent = state.compare.size < 2 ? "Noch 1 wählen" : `${state.compare.size} vergleichen`;
  }

  function toggleCompare(id, input) {
    if (state.compare.has(id)) state.compare.delete(id);
    else if (state.compare.size >= 3) {
      if (input) input.checked = false;
      toast("Maximal 3 Pakete gleichzeitig vergleichen", "!");
      return;
    } else state.compare.add(id);
    updateCompareBar();
  }

  $("#clearCompare").addEventListener("click", () => {
    state.compare.clear();
    $$("[data-compare]").forEach((i) => (i.checked = false));
    updateCompareBar();
  });

  /* ---------------------------------------------------------------------- */
  /* Dialoge                                                                 */
  /* ---------------------------------------------------------------------- */
  const closeBtn = `<button class="icon-btn sheet__close" data-close aria-label="Schließen"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button>`;

  function openDialog(dlg) {
    if (!dlg.open) dlg.showModal();
    document.body.classList.add("no-scroll");
    dlg.scrollTop = 0;
  }
  function closeDialog(dlg) {
    if (dlg.open) dlg.close();
  }
  $$("dialog").forEach((dlg) => {
    dlg.addEventListener("close", () => {
      if (!$$("dialog").some((d) => d.open)) document.body.classList.remove("no-scroll");
      if (dlg.id === "detail" && location.hash.startsWith("#paket-")) history.replaceState(null, "", "#pakete");
    });
    dlg.addEventListener("click", (e) => {
      if (e.target === dlg) closeDialog(dlg); // Klick auf Backdrop
      if (e.target.closest("[data-close]")) closeDialog(dlg);
    });
  });

  /* Detailansicht mit Ertragsrechner -------------------------------------- */
  const detailEl = $("#detail");

  function detailHtml(p) {
    const comps = p.components
      .map(([id, q]) => {
        const c = COMPONENTS[id];
        return `<li><div class="mini">${componentVisual(id, compHue[c.type])}</div><div><b>${c.name}</b><span>${c.desc}</span></div><span class="qty">${q}×</span></li>`;
      })
      .join("");
    const moduleRow = p.modules
      ? `<li><div class="mini">${pvVisual()}</div><div><b>${p.modules} PV-Module à ${p.moduleWp} Wp</b><span>Full-Black-Module, passend zur Growatt-Konfiguration ausgelegt</span></div><span class="qty">${p.modules}×</span></li>`
      : "";
    const specs = [
      p.modules ? [nf2.format(kwp(p)) + " kWp", "Leistung"] : [p.existingKwp + " kWp", "Bestand (Bsp.)"],
      [nf2.format(p.storage) + " kWh", "Speicher"],
      [nf.format(Math.round(yieldOf(p) / 100) * 100) + " kWh", "Ertrag / Jahr*"],
      [autarkyLabel(p), "Autarkie*"],
      [p.phases, "Anschluss"],
    ];
    return `${closeBtn}
      <div class="detail">
        <div class="detail__hero">
          <div class="detail__visual" style="view-transition-name: detail-visual">${packageVisual(p, innerWidth > 760 ? "xMaxYMid" : "xMidYMid")}</div>
          <div class="detail__hero-text">
            <p class="eyebrow" style="margin:0 0 10px">${p.badge ? p.badge + " · " : ""}${p.suited}</p>
            <h2 id="detailTitle">${p.name}</h2>
            <p>${p.tagline}</p>
          </div>
        </div>
        <div class="sheet__body">
          <div class="detail__specs">${specs.map(([v, l]) => `<div class="spec"><b>${v}</b><span>${l}</span></div>`).join("")}</div>
          <div class="detail__grid">
            <div>
              <h4>Im Paket enthalten</h4>
              <ul class="list">${moduleRow}${comps}</ul>
              <h4>Highlights</h4>
              <ul class="checks">${p.highlights.map((h) => `<li>${h}</li>`).join("")}<li>${p.install}</li></ul>
            </div>
            <div>
              <h4>Ihr Ertragsrechner</h4>
              <div class="calc" data-calc="${p.id}">
                <label>Jahresverbrauch <b data-o="cons"></b></label>
                <input type="range" min="1500" max="15000" step="250" value="${p.consumption}" data-i="cons" aria-label="Jahresverbrauch in kWh"/>
                <label>Strompreis <b data-o="price"></b></label>
                <input type="range" min="20" max="55" step="1" value="${CFG.defaultPowerPrice}" data-i="price" aria-label="Strompreis in Cent pro kWh"/>
                <div class="calc__out">
                  <div><b data-o="save">–</b><span>Ersparnis pro Jahr</span></div>
                  <div><b data-o="amort">–</b><span>Amortisation</span></div>
                  <div><b data-o="aut">–</b><span>${p.autarky ? "Autarkiegrad" : "Mehr Eigenverbrauch"}</span></div>
                  <div><b data-o="co2">–</b><span>CO₂ vermieden / Jahr</span></div>
                </div>
              </div>
              <p class="fineprint" style="margin-top:14px">* Vereinfachte Schätzung mit ${nf.format(CFG.specificYield)} kWh/kWp und ${nf1.format(CFG.feedInTariff)} ct/kWh Einspeisevergütung. Kein Angebot.</p>
            </div>
          </div>
        </div>
        <div class="detail__cta">
          <div class="price"><small>${p.priceNote || "Richtpreis inkl. Montage"}</small><strong>${priceLabel(p)}</strong></div>
          <div class="btns">
            <button class="icon-btn" data-fav="${p.id}" aria-pressed="${state.saved.has(p.id)}" aria-label="Merken"><svg viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.8 4.5c2.1 0 3.6 1.1 4.4 2.6.8-1.5 2.3-2.6 4.4-2.6 3.8 0 5.9 3.9 4.4 7.3C18.9 16.4 12 21 12 21z"/></svg></button>
            <button class="btn btn--primary" data-reserve="${p.id}">Kostenlos reservieren</button>
          </div>
        </div>
      </div>`;
  }

  const tweens = new WeakMap();
  function tweenText(el, to, fmt) {
    const from = tweens.get(el) ?? to;
    tweens.set(el, to);
    if (reduced || from === to) { el.textContent = fmt(to); return; }
    const t0 = performance.now(), dur = 500;
    const step = (t) => {
      const k = Math.min(1, (t - t0) / dur);
      const e = 1 - Math.pow(1 - k, 3);
      el.textContent = fmt(from + (to - from) * e);
      if (k < 1 && tweens.get(el) === to) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  function setRangeFill(input) {
    const pct = ((input.value - input.min) / (input.max - input.min)) * 100;
    input.style.setProperty("--fill", pct + "%");
  }

  function calculate(p, cons, price) {
    const y = yieldOf(p);
    let selfUse, autarky;
    if (p.autarky) {
      autarky = clamp((p.autarky / 100) * Math.pow(p.consumption / cons, 0.3), 0.1, 0.9);
      selfUse = Math.min(cons * autarky, y * 0.9);
      autarky = selfUse / cons;
    } else {
      // Nachrüstung: zusätzlicher Eigenverbrauch statt Einspeisung
      autarky = p.autarkyGain / 100;
      selfUse = Math.min(cons * autarky, y * 0.5);
    }
    const feed = Math.max(0, y - selfUse);
    const save = p.autarky
      ? (selfUse * price) / 100 + (feed * CFG.feedInTariff) / 100
      : (selfUse * (price - CFG.feedInTariff)) / 100;
    return { save, amort: p.price / save, autarky: autarky * 100, co2: (y * 0.38) / 1000 };
  }

  function bindCalc(root, p) {
    const calc = $("[data-calc]", root);
    if (!calc) return;
    const ci = $('[data-i="cons"]', calc), pi = $('[data-i="price"]', calc);
    const o = (k) => $(`[data-o="${k}"]`, calc);
    const update = () => {
      [ci, pi].forEach(setRangeFill);
      o("cons").textContent = nf.format(ci.value) + " kWh";
      o("price").textContent = pi.value + " ct/kWh";
      const r = calculate(p, +ci.value, +pi.value);
      tweenText(o("save"), r.save, (v) => eur(v));
      tweenText(o("amort"), r.amort, (v) => nf1.format(v) + " J.");
      tweenText(o("aut"), r.autarky, (v) => (p.autarky ? "" : "+") + Math.round(v) + " %");
      tweenText(o("co2"), r.co2, (v) => nf1.format(v) + " t");
    };
    ci.addEventListener("input", update);
    pi.addEventListener("input", update);
    update();
  }

  function openDetail(id, sourceEl) {
    const p = byId(id);
    if (!p) return;
    const srcVisual = sourceEl?.closest(".card")?.querySelector(".visual");
    const show = () => {
      if (srcVisual) srcVisual.style.viewTransitionName = "";
      detailEl.innerHTML = detailHtml(p);
      bindCalc(detailEl, p);
      openDialog(detailEl);
    };
    history.replaceState(null, "", `#paket-${id}`);
    if (srcVisual && document.startViewTransition && !reduced) {
      srcVisual.style.viewTransitionName = "detail-visual";
      const t = document.startViewTransition(show);
      t.finished.finally(() => { const v = $(".detail__visual", detailEl); if (v) v.style.viewTransitionName = "none"; });
    } else {
      show();
      const v = $(".detail__visual", detailEl);
      if (v) v.style.viewTransitionName = "none";
    }
  }

  /* Vergleich ------------------------------------------------------------- */
  const compareEl = $("#compare");
  function openCompare() {
    const list = [...state.compare].map(byId);
    const rows = [
      ["Richtpreis", (p) => priceLabel(p), (p) => -p.price],
      ["Leistung", (p) => (p.modules ? nf2.format(kwp(p)) + " kWp" : "Bestand"), (p) => kwp(p)],
      ["PV-Module", (p) => (p.modules ? `${p.modules} × ${p.moduleWp} Wp` : "–")],
      ["Speicher", (p) => nf2.format(p.storage) + " kWh", (p) => p.storage],
      ["Wechselrichter", inverterOf],
      ["Anschluss", (p) => p.phases],
      ["Ertrag / Jahr*", (p) => nf.format(Math.round(yieldOf(p) / 100) * 100) + " kWh", (p) => yieldOf(p)],
      ["Autarkie*", autarkyLabel, (p) => p.autarky || 0],
      ["Wallbox", (p) => (hasType(p, "wallbox") ? "✓ THOR 11AS" : "–")],
      ["Geeignet für", (p) => p.suited],
    ];
    const head = list.map((p) => `<th>${packageVisual(p)}<h3>${p.name}</h3><p class="muted" style="font-size:.85rem;font-weight:400">${p.tagline}</p></th>`).join("");
    const body = rows
      .map(([label, fn, score]) => {
        let best = null;
        if (score) {
          const max = Math.max(...list.map(score));
          if (list.filter((p) => score(p) === max).length < list.length) best = max;
        }
        return `<tr><th scope="row">${label}</th>${list.map((p) => `<td class="${score && score(p) === best ? "best" : ""}">${fn(p)}</td>`).join("")}</tr>`;
      })
      .join("");
    const foot = `<tr><th></th>${list.map((p) => `<td><button class="btn btn--primary btn--sm" data-reserve="${p.id}">Reservieren</button></td>`).join("")}</tr>`;
    compareEl.innerHTML = `${closeBtn}
      <div class="sheet__head"><p class="eyebrow">Vergleich</p><h2 style="font-size:clamp(2rem,4vw,3rem)">Pakete im <em>Vergleich</em></h2></div>
      <div class="sheet__body"><div class="ctable-wrap"><table class="ctable"><colgroup><col class="lbl"/>${list.map(() => "<col/>").join("")}</colgroup><thead><tr><th></th>${head}</tr></thead><tbody>${body}${foot}</tbody></table></div>
      <p class="fineprint">Bestwerte sind farbig hervorgehoben. * Schätzwerte.</p></div>`;
    openDialog(compareEl);
  }
  $("#openCompare").addEventListener("click", openCompare);

  /* Merkliste ------------------------------------------------------------- */
  const savedEl = $("#saved");
  function renderSaved() {
    const list = [...state.saved].map(byId).filter(Boolean);
    const reservations = store.get("gw_reservations", []);
    const items = list.length
      ? `<div class="saved__list">${list
          .map(
            (p) => `<div class="saved__item">${packageVisual(p)}<div><b>${p.name}</b><div class="muted" style="font-size:.85rem">${priceLabel(p)}</div>
              <button class="btn btn--text btn--sm" data-detail="${p.id}">Details</button></div>
              <button class="icon-btn" data-unsave="${p.id}" aria-label="${p.name} entfernen"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>`
          )
          .join("")}</div>
          <button class="btn btn--primary" style="width:100%;margin-top:18px" data-reserve="${list[0].id}">Gemerktes Paket reservieren</button>`
      : `<div class="empty"><svg viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.8 4.5c2.1 0 3.6 1.1 4.4 2.6.8-1.5 2.3-2.6 4.4-2.6 3.8 0 5.9 3.9 4.4 7.3C18.9 16.4 12 21 12 21z"/></svg>Noch nichts gemerkt.<br/>Tippen Sie auf das Herz bei einem Paket.</div>`;
    const res = reservations.length
      ? `<h4 style="margin:36px 0 12px;font:600 .78rem var(--font);letter-spacing:.1em;text-transform:uppercase;color:var(--muted)">Meine Reservierungen</h4>
         <div class="summary">${reservations
           .slice(-5)
           .reverse()
           .map((r) => `<div><dt>${esc(r.code)}</dt><dd>${esc(byId(r.package)?.name || r.package)} · ${esc(r.dateLabel)}</dd></div>`)
           .join("")}</div>`
      : "";
    savedEl.innerHTML = `${closeBtn}<div class="sheet__head"><p class="eyebrow">Merkliste</p><h2 style="font-size:2.2rem">Ihre Favoriten</h2></div><div class="sheet__body">${items}${res}</div>`;
  }
  $("#openSaved").addEventListener("click", () => { renderSaved(); openDialog(savedEl); });

  /* ---------------------------------------------------------------------- */
  /* Reservierung (mehrstufig, ohne Zahlung)                                 */
  /* ---------------------------------------------------------------------- */
  const reserveEl = $("#reserve");
  const WD = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
  const MON = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];

  function nextWorkdays(n) {
    const out = [];
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    d.setDate(d.getDate() + 1);
    while (out.length < n) {
      if (d.getDay() !== 0 && d.getDay() !== 6) out.push(new Date(d));
      d.setDate(d.getDate() + 1);
    }
    return out;
  }

  function reserveHtml(selected) {
    const days = nextWorkdays(12);
    return `${closeBtn}
    <form class="rform" novalidate>
      <div class="sheet__head">
        <p class="eyebrow">Kostenlos & unverbindlich</p>
        <h2 id="reserveTitle" style="font-size:clamp(1.9rem,4vw,2.6rem)">Paket <em>reservieren</em></h2>
        <div class="steps-ind" aria-hidden="true"><span class="done"></span><span></span><span></span><span></span></div>
        <p class="muted" style="font-size:.85rem" data-steplabel>Schritt 1 von 4 · Paket</p>
      </div>
      <div class="sheet__body">
        <section class="rstep is-active" data-rs="0">
          <div class="pkg-pick">${PACKAGES.map(
            (p) => `<label><input type="radio" name="package" value="${p.id}" ${p.id === selected ? "checked" : ""}/><span class="box" style="--hue:${p.hue}"><b>${p.name}</b><span>${p.modules ? nf2.format(kwp(p)) + " kWp · " : ""}${nf2.format(p.storage)} kWh</span><br/><span>${priceLabel(p)}</span></span></label>`
          ).join("")}</div>
          <span class="form-label">Wie möchten Sie beraten werden?</span>
          <div class="seg">
            ${["Vor-Ort-Termin", "Videocall", "Telefon"].map((m, i) => `<label><input type="radio" name="mode" value="${m}" ${i === 0 ? "checked" : ""}/><span>${m}</span></label>`).join("")}
          </div>
        </section>

        <section class="rstep" data-rs="1">
          <div class="fields">
            ${field("firstName", "Vorname", "text", "given-name")}
            ${field("lastName", "Nachname", "text", "family-name")}
            ${field("email", "E-Mail", "email", "email", "full")}
            ${field("phone", "Telefon", "tel", "tel")}
            ${field("zip", "PLZ", "text", "postal-code", "", 'inputmode="numeric" maxlength="5"')}
            ${field("city", "Ort", "text", "address-level2", "full")}
            <div class="field full"><textarea id="f-note" name="note" placeholder=" "></textarea><label for="f-note">Nachricht (optional)</label></div>
          </div>
        </section>

        <section class="rstep" data-rs="2">
          <span class="form-label" style="margin-top:0">Wunschtag für die Beratung</span>
          <div class="slots">${days
            .map((d, i) => `<label class="slot"><input type="radio" name="date" value="${d.toISOString().slice(0, 10)}" data-label="${WD[d.getDay()]}, ${d.getDate()}. ${MON[d.getMonth()]}" ${i === 0 ? "checked" : ""}/><span><small>${WD[d.getDay()]}</small><b>${d.getDate()}</b><small>${MON[d.getMonth()]}</small></span></label>`)
            .join("")}</div>
          <span class="form-label">Zeitfenster</span>
          <div class="seg">${["8–12 Uhr", "12–16 Uhr", "16–19 Uhr"].map((t, i) => `<label><input type="radio" name="time" value="${t}" ${i === 1 ? "checked" : ""}/><span>${t}</span></label>`).join("")}</div>
          <p class="muted" style="font-size:.85rem;margin-top:18px">Wir bestätigen den Termin persönlich per Telefon oder E-Mail.</p>
        </section>

        <section class="rstep" data-rs="3">
          <dl class="summary" data-summary></dl>
          <label class="consent" data-consent><input type="checkbox" name="consent"/><span>Ich bin einverstanden, dass meine Angaben zur Bearbeitung der Reservierung gespeichert und ich kontaktiert werde. Die Reservierung ist kostenlos und unverbindlich – es entsteht kein Kaufvertrag.</span></label>
        </section>

        <section class="rstep" data-rs="4">
          <div class="success" data-success></div>
        </section>

        <div class="form-nav">
          <button type="button" class="btn btn--text" data-prev hidden>← Zurück</button>
          <button type="submit" class="btn btn--primary" data-next style="margin-left:auto">Weiter</button>
        </div>
      </div>
    </form>`;
  }

  function field(name, label, type, ac, cls = "", extra = "") {
    const errors = { email: "Bitte gültige E-Mail angeben.", zip: "Bitte 5-stellige PLZ angeben.", phone: "Bitte Telefonnummer angeben." };
    return `<div class="field ${cls}"><input id="f-${name}" name="${name}" type="${type}" autocomplete="${ac}" placeholder=" " required ${extra}/><label for="f-${name}">${label}</label><p class="err">${errors[name] || "Pflichtfeld"}</p></div>`;
  }

  function openReserve(id) {
    const selected = id || [...state.saved][0] || "home-m";
    $$("dialog[open]").forEach((d) => d !== reserveEl && d.close());
    reserveEl.innerHTML = reserveHtml(selected);
    openDialog(reserveEl);
    bindReserve();
  }

  function bindReserve() {
    const form = $("form", reserveEl);
    const steps = $$(".rstep", form);
    const labels = ["Paket", "Kontakt", "Wunschtermin", "Prüfen & absenden"];
    let cur = 0;

    const go = (n) => {
      steps[cur].classList.remove("is-active");
      cur = n;
      steps[cur].classList.add("is-active");
      $$(".steps-ind span", form).forEach((s, i) => s.classList.toggle("done", i <= cur));
      $("[data-steplabel]", form).textContent = cur < 4 ? `Schritt ${cur + 1} von 4 · ${labels[cur]}` : "Fertig";
      $("[data-prev]", form).hidden = cur === 0 || cur === 4;
      const next = $("[data-next]", form);
      next.textContent = cur === 3 ? "Kostenlos reservieren" : cur === 4 ? "Schließen" : "Weiter";
      if (cur === 3) fillSummary();
      reserveEl.scrollTop = 0;
      const focusable = steps[cur].querySelector("input:not([type=radio]), input:checked");
      if (focusable && cur !== 4) focusable.focus({ preventScroll: true });
    };

    const validators = {
      email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v),
      zip: (v) => /^\d{5}$/.test(v),
      phone: (v) => v.replace(/\D/g, "").length >= 6,
    };
    const validateContact = () => {
      let ok = true;
      $$(".field input[required]", steps[1]).forEach((inp) => {
        const v = inp.value.trim();
        const valid = v && (!validators[inp.name] || validators[inp.name](v));
        inp.closest(".field").classList.toggle("invalid", !valid);
        if (!valid && ok) { inp.focus(); ok = false; }
      });
      return ok;
    };
    $$(".field input", steps[1]).forEach((inp) =>
      inp.addEventListener("input", () => inp.closest(".field").classList.remove("invalid"))
    );

    const data = () => Object.fromEntries(new FormData(form));
    function fillSummary() {
      const d = data();
      const p = byId(d.package);
      const dateLabel = $(`input[name="date"]:checked`, form)?.dataset.label || "";
      const rows = [
        ["Paket", `${p.name} · ${priceLabel(p)}`],
        ["Beratung", d.mode],
        ["Wunschtermin", `${dateLabel}, ${d.time}`],
        ["Name", `${d.firstName} ${d.lastName}`],
        ["E-Mail", d.email],
        ["Telefon", d.phone],
        ["Ort", `${d.zip} ${d.city}`],
      ];
      if (d.note) rows.push(["Nachricht", d.note]);
      $("[data-summary]", form).innerHTML = rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join("");
    }

    async function submit() {
      const consent = $("[data-consent]", form);
      if (!form.consent.checked) { consent.classList.add("invalid"); toast("Bitte Einwilligung bestätigen", "!"); return; }
      consent.classList.remove("invalid");
      const next = $("[data-next]", form);
      next.disabled = true;
      next.textContent = "Wird gesendet …";
      const d = data();
      const code = "GW-" + Math.random().toString(36).slice(2, 8).toUpperCase();
      const payload = { ...d, code, dateLabel: $(`input[name="date"]:checked`, form)?.dataset.label, createdAt: new Date().toISOString() };
      delete payload.consent;
      try {
        if (CFG.reservationEndpoint) {
          const res = await fetch(CFG.reservationEndpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(payload) });
          if (!res.ok) throw new Error("HTTP " + res.status);
        } else {
          await new Promise((r) => setTimeout(r, 900)); // Demo-Modus
        }
      } catch (err) {
        next.disabled = false;
        next.textContent = "Erneut versuchen";
        toast("Senden fehlgeschlagen – bitte erneut versuchen oder anrufen.", "!");
        return;
      }
      const list = store.get("gw_reservations", []);
      list.push({ code, package: d.package, dateLabel: `${payload.dateLabel}, ${d.time}` });
      store.set("gw_reservations", list);
      const p = byId(d.package);
      $("[data-success]", form).innerHTML = `
        <svg class="success__check" viewBox="0 0 100 100"><circle cx="50" cy="50" r="44"/><path d="M30 52l13 13 27-29"/></svg>
        <h2>Reserviert, ${esc(d.firstName)}!</h2>
        <p>Ihr Paket <b>${p.name}</b> ist für Sie vorgemerkt. Wir melden uns innerhalb von 48&nbsp;Stunden zu Ihrem Wunschtermin.</p>
        <div class="code">${code}</div>
        <p style="font-size:.85rem">Ihre Reservierungsnummer</p>`;
      next.disabled = false;
      go(4);
      confetti();
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (cur === 1 && !validateContact()) return;
      if (cur === 3) return submit();
      if (cur === 4) return closeDialog(reserveEl);
      go(cur + 1);
    });
    $("[data-prev]", form).addEventListener("click", () => go(cur - 1));
  }

  /* ---------------------------------------------------------------------- */
  /* Globale Klick-Delegation                                                */
  /* ---------------------------------------------------------------------- */
  document.addEventListener("click", (e) => {
    const t = e.target;
    const reserve = t.closest("[data-reserve]");
    if (reserve) { e.preventDefault(); openReserve(reserve.dataset.reserve); return; }
    const detail = t.closest("[data-detail]");
    if (detail) {
      e.preventDefault();
      $$("dialog[open]").forEach((d) => d !== detailEl && d.close());
      openDetail(detail.dataset.detail, detail);
      return;
    }
    const fav = t.closest("[data-fav]");
    if (fav) { toggleSaved(fav.dataset.fav); return; }
    const unsave = t.closest("[data-unsave]");
    if (unsave) { toggleSaved(unsave.dataset.unsave); renderSaved(); return; }
  });
  gridEl.addEventListener("change", (e) => {
    if (e.target.matches("[data-compare]")) toggleCompare(e.target.dataset.compare, e.target);
  });

  /* ---------------------------------------------------------------------- */
  /* Anlagen-Finder                                                          */
  /* ---------------------------------------------------------------------- */
  const finderForm = $("#finderForm");
  const qs = $$(".q", finderForm);
  const consInput = $("#cons");
  let fq = 0;
  const finderHistory = [];

  function finderGo(n, back = false) {
    qs[fq].classList.remove("is-active");
    qs[fq].classList.toggle("is-past", !back);
    if (!back) finderHistory.push(fq);
    fq = n;
    qs[fq].classList.remove("is-past");
    qs[fq].classList.add("is-active");
    $("#finderBar").style.width = Math.min(100, ((n + 1) / 4) * 100) + "%";
    $("#finderStep").textContent = n < 4 ? `Frage ${n + 1} von 4` : "Ihre Empfehlung";
    $("#finderBack").hidden = finderHistory.length === 0;
  }

  finderForm.addEventListener("change", (e) => {
    if (e.target.type !== "radio") return;
    const v = e.target.value;
    setTimeout(() => {
      if (e.target.name === "home") finderGo(v === "wohnung" ? 3 : 1);
      else if (e.target.name === "pv") finderGo(v === "ja" ? 3 : 2);
      else if (e.target.name === "ev") finderGo(3);
    }, reduced ? 0 : 280);
  });

  consInput.addEventListener("input", () => {
    $("#consOut").textContent = nf.format(consInput.value) + " kWh";
    setRangeFill(consInput);
  });
  setRangeFill(consInput);

  $("#finderBack").addEventListener("click", () => {
    if (!finderHistory.length) return;
    finderGo(finderHistory.pop(), true);
  });

  function recommend({ home, pv, ev, cons }) {
    if (home === "wohnung") return { id: "balkon-plus", why: "Für Wohnungen ist ein Balkonkraftwerk mit Speicher die einfachste Lösung – ohne Dach und ohne Elektriker." };
    if (pv === "ja") return { id: "retrofit", why: "Sie haben bereits Module auf dem Dach – mit einem AC-gekoppelten Speicher nutzen Sie Ihren Strom auch abends." };
    if (ev === "ja" || ev === "geplant")
      return cons > 7500
        ? { id: "max", why: "Hoher Verbrauch plus E-Auto: Das Max-Paket bietet genug Leistung, Speicher und eine Wallbox." }
        : { id: "drive", why: "Mit Wallbox und PV-Überschussladen fahren Sie Ihr E-Auto mit eigenem Sonnenstrom." };
    if (cons <= 3200) return { id: "home-s", why: "Für Ihren Verbrauch reicht eine kompakte Anlage mit erweiterbarem Speicher." };
    if (cons <= 5500) return { id: "home-m", why: "Das ausgewogene Paket für Familienhaushalte – unser Bestseller." };
    return { id: "home-l", why: "Bei Ihrem hohen Verbrauch zahlt sich viel Speicher besonders aus." };
  }

  finderForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(finderForm));
    const r = recommend({ ...d, cons: +d.cons });
    const p = byId(r.id);
    $("#finderResult").innerHTML = `<div class="result">
      <div class="result__visual">${packageVisual(p)}</div>
      <div>
        <p class="eyebrow" style="margin:0">Unsere Empfehlung</p>
        <h3>${p.name}</h3>
        <p>${r.why}</p>
        <div class="result__specs">
          ${p.modules ? `<span class="tag">${nf2.format(kwp(p))} kWp</span>` : ""}
          <span class="tag">${nf2.format(p.storage)} kWh Speicher</span>
          <span class="tag">${autarkyLabel(p)} Autarkie*</span>
          <span class="tag">${priceLabel(p)}</span>
        </div>
        <div class="result__actions">
          <button type="button" class="btn btn--primary magnetic" data-reserve="${p.id}">Reservieren</button>
          <button type="button" class="btn btn--ghost" data-detail="${p.id}">Details</button>
          <button type="button" class="btn btn--text" data-restart>Neu starten</button>
        </div>
      </div>
    </div>`;
    finderGo(4);
    if (!reduced) $("#finderResult .visual")?.animate([{ transform: "scale(.85)", opacity: 0 }, { transform: "none", opacity: 1 }], { duration: 700, easing: "cubic-bezier(.22,1,.36,1)" });
  });

  finderForm.addEventListener("click", (e) => {
    if (!e.target.closest("[data-restart]")) return;
    finderForm.reset();
    consInput.value = 4500;
    consInput.dispatchEvent(new Event("input"));
    finderHistory.length = 0;
    qs.forEach((q) => q.classList.remove("is-past"));
    finderGo(0, true);
    finderHistory.length = 0;
    $("#finderBack").hidden = true;
  });

  /* ---------------------------------------------------------------------- */
  /* Scrollytelling                                                          */
  /* ---------------------------------------------------------------------- */
  const scene = $("#scene");
  const stepIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        $$(".step").forEach((s) => s.classList.toggle("is-active", s === en.target));
        scene.dataset.step = en.target.dataset.step;
      });
    },
    { rootMargin: "-45% 0px -45% 0px" }
  );
  $$(".step").forEach((s) => stepIO.observe(s));

  /* ---------------------------------------------------------------------- */
  /* Reveal, Split-Text, Counter                                             */
  /* ---------------------------------------------------------------------- */
  function splitText(el) {
    let i = 0;
    const wrap = (text, tag) =>
      text
        .split(/(\s+)/)
        .map((w) => {
          if (!w.trim()) return w;
          const inner = tag ? `<${tag}>${w}</${tag}>` : w;
          return `<span class="w" aria-hidden="true"><span style="--i:${i++}">${inner}</span></span>`;
        })
        .join("");
    el.innerHTML = [...el.childNodes]
      .map((n) => (n.nodeType === 3 ? wrap(n.textContent) : wrap(n.textContent, n.tagName.toLowerCase())))
      .join("");
  }
  $$(".split").forEach(splitText);
  requestAnimationFrame(() => requestAnimationFrame(() => $$(".split").forEach((el) => el.classList.add("is-in"))));

  const revealIO = new IntersectionObserver(
    (entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("is-in"); revealIO.unobserve(en.target); }
    }),
    { rootMargin: "0px 0px -8% 0px" }
  );
  const observeReveals = () => $$(".reveal:not(.is-in)").forEach((el) => revealIO.observe(el));
  observeReveals();

  function countUp(el) {
    const to = +el.dataset.count;
    const suffix = el.dataset.suffix || "";
    if (reduced) { el.textContent = nf.format(to) + suffix; return; }
    const t0 = performance.now(), dur = 1800;
    const step = (t) => {
      const k = Math.min(1, (t - t0) / dur);
      const e = 1 - Math.pow(1 - k, 4);
      el.textContent = nf.format(Math.round(to * e)) + suffix;
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  const countIO = new IntersectionObserver((entries) =>
    entries.forEach((en) => { if (en.isIntersecting) { countUp(en.target); countIO.unobserve(en.target); } })
  );
  $$("[data-count]").forEach((el) => countIO.observe(el));

  /* ---------------------------------------------------------------------- */
  /* Navigation, Scroll-Effekte                                              */
  /* ---------------------------------------------------------------------- */
  const nav = $("#nav");
  const progress = $(".progress");
  const timeline = $("#timeline");
  const orb = $(".orb");
  const supportsScrollTimeline = CSS.supports("animation-timeline: scroll()");
  let lastY = scrollY, ticking = false;

  function onScroll() {
    const y = scrollY;
    nav.classList.toggle("is-scrolled", y > 20);
    if (!nav.classList.contains("is-open")) nav.classList.toggle("is-hidden", y > 400 && y > lastY + 4);
    if (y < lastY - 4) nav.classList.remove("is-hidden");
    lastY = y;
    if (!supportsScrollTimeline) {
      const max = document.documentElement.scrollHeight - innerHeight;
      progress.style.setProperty("--p", max > 0 ? y / max : 0);
    }
    const r = timeline.getBoundingClientRect();
    timeline.style.setProperty("--fill", clamp((innerHeight * 0.7 - r.top) / r.height, 0, 1));
    if (!reduced && y < innerHeight * 1.2) orb.parentElement.style.transform = `translateY(${y * 0.25}px)`;
    ticking = false;
  }
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  const sectionIO = new IntersectionObserver(
    (entries) => entries.forEach((en) => {
      if (!en.isIntersecting) return;
      $$(".nav__links a").forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === "#" + en.target.id));
    }),
    { rootMargin: "-50% 0px -50% 0px" }
  );
  ["story", "finder", "pakete", "komponenten", "faq"].forEach((id) => sectionIO.observe($("#" + id)));

  const burger = $("#burger");
  burger.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", open);
  });
  $$(".nav__links a").forEach((a) => a.addEventListener("click", () => { nav.classList.remove("is-open"); burger.setAttribute("aria-expanded", false); }));

  /* Magnetische Buttons, Cursor, Orb-Parallax ----------------------------- */
  if (finePointer && !reduced) {
    document.addEventListener("pointermove", (e) => {
      const m = e.target.closest?.(".magnetic");
      $$(".magnetic.is-mag").forEach((b) => { if (b !== m) { b.classList.remove("is-mag"); b.style.translate = ""; } });
      if (m) {
        const r = m.getBoundingClientRect();
        m.classList.add("is-mag");
        m.style.translate = `${(e.clientX - r.left - r.width / 2) * 0.22}px ${(e.clientY - r.top - r.height / 2) * 0.35}px`;
      }
    });

    const cursor = $(".cursor");
    const dot = cursor.firstElementChild;
    addEventListener("pointermove", (e) => {
      dot.style.setProperty("--x", e.clientX + "px");
      dot.style.setProperty("--y", e.clientY + "px");
      cursor.classList.toggle("is-hover", !!e.target.closest?.("a, button, label, input, select, summary, .card"));
      if (e.clientY < innerHeight) {
        orb.style.setProperty("--ox", ((e.clientX / innerWidth) - 0.5) * -30 + "px");
        orb.style.setProperty("--oy", ((e.clientY / innerHeight) - 0.5) * -30 + "px");
      }
    });
    document.addEventListener("pointerleave", () => dot.style.setProperty("--x", "-100px"));
  }

  /* Marquee: Inhalt für nahtlose Schleife verdoppeln */
  const track = $(".marquee__track");
  track.innerHTML += track.innerHTML;
  [...track.children].slice(track.children.length / 2).forEach((c) => c.setAttribute("aria-hidden", "true"));

  /* ---------------------------------------------------------------------- */
  /* Toasts & Konfetti                                                       */
  /* ---------------------------------------------------------------------- */
  function toast(msg, icon = "✓") {
    const t = document.createElement("div");
    t.className = "toast";
    t.innerHTML = `<i>${icon}</i><span></span>`;
    t.lastChild.textContent = msg;
    $("#toasts").appendChild(t);
    setTimeout(() => { t.classList.add("out"); t.addEventListener("animationend", () => t.remove()); }, 2600);
  }

  function confetti() {
    if (reduced) return;
    const c = $("#confetti");
    const ctx = c.getContext("2d");
    const dpr = Math.min(2, devicePixelRatio || 1);
    c.width = innerWidth * dpr;
    c.height = innerHeight * dpr;
    ctx.scale(dpr, dpr);
    const colors = ["#b6f36b", "#4be3c1", "#58b7ff", "#ffc94a", "#ffffff"];
    const parts = Array.from({ length: 180 }, () => ({
      x: innerWidth / 2 + (Math.random() - 0.5) * 120,
      y: innerHeight * 0.45,
      vx: (Math.random() - 0.5) * 16,
      vy: -Math.random() * 16 - 6,
      s: Math.random() * 7 + 4,
      r: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.4,
      c: colors[(Math.random() * colors.length) | 0],
    }));
    const t0 = performance.now();
    (function frame(t) {
      const el = t - t0;
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      parts.forEach((p) => {
        p.vy += 0.42; p.vx *= 0.985; p.x += p.vx; p.y += p.vy; p.r += p.vr;
        ctx.save();
        ctx.globalAlpha = Math.max(0, 1 - el / 3200);
        ctx.translate(p.x, p.y); ctx.rotate(p.r);
        ctx.fillStyle = p.c;
        ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2);
        ctx.restore();
      });
      if (el < 3200) requestAnimationFrame(frame);
      else ctx.clearRect(0, 0, innerWidth, innerHeight);
    })(t0);
  }

  /* ---------------------------------------------------------------------- */
  /* Init                                                                    */
  /* ---------------------------------------------------------------------- */
  $$("[data-company]").forEach((el) => (el.textContent = CFG.company));
  $$("[data-phone]").forEach((el) => { el.textContent = CFG.phone; el.href = "tel:" + CFG.phone.replace(/\s/g, ""); });
  $$("[data-email]").forEach((el) => { el.textContent = CFG.email; el.href = "mailto:" + CFG.email; });
  $("#year").textContent = new Date().getFullYear();

  renderChips();
  renderGrid();
  renderRail();
  updateSavedCount();
  updateCompareBar();

  if (location.hash.startsWith("#paket-")) {
    const id = location.hash.slice(7);
    if (byId(id)) setTimeout(() => openDetail(id), 300);
  }
})();
