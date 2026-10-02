/* Lilly Merch – Interaktion & Animation */
(function () {
  "use strict";

  const D = window.LILLY;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const hasGsap = !!(window.gsap && window.ScrollTrigger) && !reduced;
  const euro = (n) => n.toLocaleString("de-DE", { style: "currency", currency: "EUR" });
  const FREE_SHIP = 60;
  const hasPic = (p) => p !== undefined && p !== null && p !== "";
  const photoLabel = (p) => p && typeof p === "object" ? "Dein Hund" : p === "cutout" ? "Lilly liegt flach" : "Foto Nr. " + (+p + 1);
  const photoKey = (p) => p && typeof p === "object" ? p.id : p;
  const priceOf = (type, photo) => D.types[type].price + (hasPic(photo) ? D.photoSurcharge : 0);

  // Bühnenfarbe hinter dem Produkt (Kontrast zur Stofffarbe)
  const STAGE = { cream: "#f4b61a", red: "#ffd8a8", mustard: "#c8161d", ink: "#ff9ec7", sky: "#f6f0e4", forest: "#f4b61a" };

  if (hasGsap) gsap.registerPlugin(ScrollTrigger);
  else document.documentElement.classList.add("no-anim");

  /* ------------------------------------------------------------------
     Speicher (Warenkorb) – darf fehlschlagen, Seite funktioniert trotzdem
     ------------------------------------------------------------------ */
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* egal */ } }
  };

  /* ------------------------------------------------------------------
     Smooth Scroll
     ------------------------------------------------------------------ */
  let lenis = null;
  if (hasGsap && window.Lenis) {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  function scrollToEl(target) {
    const el = typeof target === "string" ? $(target) : target;
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -20 });
    else el.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  }
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute("href");
    if (id.length < 2) return;
    const el = $(id);
    if (!el) return;
    e.preventDefault();
    closeCart();
    scrollToEl(id === "#top" ? document.body : el);
  });

  /* ------------------------------------------------------------------
     Toast
     ------------------------------------------------------------------ */
  let toastTimer;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("is-on"), 2600);
  }

  /* ------------------------------------------------------------------
     Konfetti: Pfoten, Knochen, Herzen
     ------------------------------------------------------------------ */
  const confetti = (() => {
    const cv = $("#confetti");
    const ctx = cv.getContext("2d");
    let parts = [];
    let running = false;
    const colors = ["#c8161d", "#f4b61a", "#ff9ec7", "#9fd3ff", "#1b0f0a"];
    function resize() { cv.width = innerWidth * devicePixelRatio; cv.height = innerHeight * devicePixelRatio; }
    addEventListener("resize", resize);
    resize();
    function paw(s) {
      ctx.beginPath(); ctx.ellipse(0, s * .25, s * .42, s * .35, 0, 0, 7); ctx.fill();
      [[-.48, -.15], [-.18, -.48], [.18, -.48], [.48, -.15]].forEach(([x, y]) => { ctx.beginPath(); ctx.arc(x * s, y * s, s * .2, 0, 7); ctx.fill(); });
    }
    function bone(s) {
      ctx.fillRect(-s * .5, -s * .14, s, s * .28);
      [[-.5, -.18], [-.5, .18], [.5, -.18], [.5, .18]].forEach(([x, y]) => { ctx.beginPath(); ctx.arc(x * s, y * s, s * .2, 0, 7); ctx.fill(); });
    }
    function heart(s) {
      ctx.beginPath(); ctx.moveTo(0, s * .35);
      ctx.bezierCurveTo(-s * .7, -s * .1, -s * .35, -s * .65, 0, -s * .25);
      ctx.bezierCurveTo(s * .35, -s * .65, s * .7, -s * .1, 0, s * .35); ctx.fill();
    }
    const shapes = [paw, bone, heart];
    function tick() {
      ctx.clearRect(0, 0, cv.width, cv.height);
      parts = parts.filter((p) => p.y < cv.height + 60 && p.life > 0);
      parts.forEach((p) => {
        p.vy += .32 * devicePixelRatio; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.r += p.vr; p.life--;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c; p.shape(p.s); ctx.restore();
      });
      if (parts.length) requestAnimationFrame(tick); else running = false;
    }
    return function burst(x = innerWidth / 2, y = innerHeight / 2, n = 70) {
      if (reduced) return;
      const k = devicePixelRatio;
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2;
        const v = (6 + Math.random() * 12) * k;
        parts.push({ x: x * k, y: y * k, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 9 * k, r: Math.random() * 6, vr: (Math.random() - .5) * .3,
          s: (12 + Math.random() * 14) * k, c: colors[i % colors.length], shape: shapes[i % 3], life: 220 });
      }
      if (!running) { running = true; requestAnimationFrame(tick); }
    };
  })();

  /* ------------------------------------------------------------------
     Shop
     ------------------------------------------------------------------ */
  const PAGE = 12;
  const state = { cat: "all", type: "all", limit: PAGE };
  const grid = $("#grid");

  function renderFilters() {
    const counts = {};
    D.designs.forEach((d) => { counts[d.cat] = (counts[d.cat] || 0) + 1; });
    $("#filters").innerHTML = D.categories.map((c) =>
      `<button class="pill" role="tab" data-cat="${c.id}" aria-selected="${c.id === state.cat}">${c.label}<sup>${c.id === "all" ? D.designs.length : counts[c.id] || 0}</sup></button>`
    ).join("");
    const types = [["all", "Alles"]].concat(Object.entries(D.types).map(([k, v]) => [k, v.name]));
    $("#types").innerHTML = types.map(([k, n]) =>
      `<button class="pill pill--small" data-type="${k}" aria-pressed="${k === state.type}">${n}</button>`
    ).join("");
  }

  function cardHTML(d) {
    const t = D.types[d.type];
    return `
      <button class="card" data-id="${d.id}" style="--stage:${STAGE[d.color]}" aria-label="${d.top} – ${t.name}, ${euro(priceOf(d.type, d.photo))}">
        <div class="card__stage">
          ${d.badge ? `<span class="card__badge">${d.badge}</span>` : ""}
          ${mockup(d.type, d.color, d.top, d.sub, d.photo)}
          <span class="card__quick" aria-hidden="true">+</span>
        </div>
        <div class="card__body">
          <h3 class="card__title">${d.top}</h3>
          <span class="card__price">${euro(priceOf(d.type, d.photo))}</span>
          <p class="card__meta">${t.name} · ${t.colors.length} Farben${hasPic(d.photo) ? " · mit Foto" : ""}</p>
          <div class="card__dots" aria-hidden="true">${t.colors.map((c) => `<i style="background:${D.colors[c].fabric}"></i>`).join("")}</div>
        </div>
      </button>`;
  }

  function renderGrid() {
    const all = D.designs.filter((d) => (state.cat === "all" || d.cat === state.cat) && (state.type === "all" || d.type === state.type));
    const list = all.slice(0, state.limit);
    const more = $("#moreBtn");
    more.hidden = all.length <= state.limit;
    $("#moreCount").textContent = Math.min(PAGE, all.length - state.limit);
    const draw = () => {
      grid.innerHTML = list.length ? list.map(cardHTML).join("") :
        `<p style="font-family:var(--hand);font-size:1.4rem">Hier ist nichts. Lilly hat's wohl verbuddelt. Probier eine andere Kombi!</p>`;
      if (hasGsap) {
        gsap.fromTo($$(".card", grid), { y: 60, opacity: 0, rotate: () => gsap.utils.random(-4, 4) },
          { y: 0, opacity: 1, rotate: 0, duration: .8, ease: "back.out(1.4)", stagger: .05, clearProps: "transform,opacity" });
        ScrollTrigger.refresh();
      }
    };
    if (hasGsap && grid.children.length) {
      gsap.to($$(".card", grid), { y: 30, opacity: 0, duration: .25, stagger: .015, ease: "power2.in", onComplete: draw });
    } else draw();
  }

  $("#filters").addEventListener("click", (e) => {
    const b = e.target.closest("[data-cat]");
    if (!b || b.dataset.cat === state.cat) return;
    state.cat = b.dataset.cat;
    state.limit = PAGE;
    renderFilters(); renderGrid();
  });
  $("#types").addEventListener("click", (e) => {
    const b = e.target.closest("[data-type]");
    if (!b || b.dataset.type === state.type) return;
    state.type = b.dataset.type;
    state.limit = PAGE;
    renderFilters(); renderGrid();
  });
  // Mehr laden: neue Karten hinten anhängen statt alles neu zu zeichnen
  $("#moreBtn").addEventListener("click", () => {
    const all = D.designs.filter((d) => (state.cat === "all" || d.cat === state.cat) && (state.type === "all" || d.type === state.type));
    const next = all.slice(state.limit, state.limit + PAGE);
    state.limit += PAGE;
    grid.insertAdjacentHTML("beforeend", next.map(cardHTML).join(""));
    const added = $$(".card", grid).slice(-next.length);
    if (hasGsap) {
      gsap.fromTo(added, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: .7, ease: "back.out(1.4)", stagger: .05, clearProps: "transform,opacity" });
      ScrollTrigger.refresh();
    }
    $("#moreBtn").hidden = all.length <= state.limit;
    $("#moreCount").textContent = Math.min(PAGE, all.length - state.limit);
  });

  grid.addEventListener("click", (e) => {
    const c = e.target.closest(".card");
    if (c) openPdp(D.designs.find((d) => d.id === c.dataset.id), c);
  });

  // 3D-Tilt + Lichtspot auf Karten
  if (fine && !reduced) {
    grid.addEventListener("pointermove", (e) => {
      const c = e.target.closest(".card");
      if (!c) return;
      const r = c.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      c.style.setProperty("--tilt-y", (x - .5) * 10 + "deg");
      c.style.setProperty("--tilt-x", (.5 - y) * 10 + "deg");
      c.style.setProperty("--mx", x * 100 + "%");
      c.style.setProperty("--my", y * 100 + "%");
    });
    grid.addEventListener("pointerout", (e) => {
      const c = e.target.closest(".card");
      if (c && !c.contains(e.relatedTarget)) { c.style.setProperty("--tilt-x", "0deg"); c.style.setProperty("--tilt-y", "0deg"); }
    });
  }

  /* ------------------------------------------------------------------
     Produktdetail
     ------------------------------------------------------------------ */
  const pdp = $("#pdp");
  const sel = { design: null, type: "shirt", color: "cream", size: "M", qty: 1, photo: null };

  function openPdp(design, origin) {
    sel.design = design;
    sel.type = design.type;
    sel.color = design.color;
    sel.size = pickSize(design.type, "M");
    sel.qty = 1;
    sel.photo = hasPic(design.photo) ? design.photo : null;
    sel.custom = design.photo && typeof design.photo === "object" ? design.photo : null;
    renderPdp(false);
    lenis && lenis.stop();
    pdp.showModal();
    if (hasGsap) gsap.from("#pdpStage .mock", { scale: .6, rotate: -8, opacity: 0, duration: .8, ease: "elastic.out(1, .6)", delay: .1 });
  }
  function pickSize(type, wish) {
    const s = D.types[type].sizes;
    return s.includes(wish) ? wish : s[Math.floor(s.length / 2)];
  }
  function renderPdp(animate = true) {
    const d = sel.design, t = D.types[sel.type];
    if (!t.colors.includes(sel.color)) sel.color = t.colors[0];
    if (!t.sizes.includes(sel.size)) sel.size = pickSize(sel.type, sel.size);
    const stage = $("#pdpStage");
    stage.style.setProperty("--stage", STAGE[sel.color]);
    stage.innerHTML = mockup(sel.type, sel.color, d.top, d.sub, sel.photo);
    if (animate && hasGsap) gsap.from(stage.firstElementChild, { scale: .85, rotate: 4, duration: .6, ease: "back.out(2)" });
    $("#pdpType").textContent = t.name + " · " + (D.categories.find((c) => c.id === d.cat) || { label: "Unikat" }).label;
    $("#pdpTitle").textContent = d.top;
    $("#pdpSub").textContent = d.sub || "";
    $("#pdpPrice").textContent = euro(priceOf(sel.type, sel.photo));
    $("#pdpPhotoName").textContent = hasPic(sel.photo) ? `${photoLabel(sel.photo)} (+${euro(D.photoSurcharge)})` : "Nur Spruch";
    $("#pdpPhotos").innerHTML = `<button type="button" class="motif motif--none" data-photo="" aria-pressed="${!hasPic(sel.photo)}" aria-label="Nur Spruch, ohne Foto">Aa</button>` +
      (sel.custom ? `<button type="button" class="motif${sel.custom.cut ? " motif--cut" : ""}" data-photo="custom" aria-pressed="${sel.photo === sel.custom}" aria-label="Dein Hund"><img src="${sel.custom.src}" alt=""></button>` : "") +
      ["cutout"].concat(D.photos.map((_, i) => i)).map((i) => { const im = D.img(i); return `<button type="button" class="motif${im.cut ? " motif--cut" : ""}" data-photo="${i}" aria-pressed="${String(sel.photo) === String(i)}" aria-label="${photoLabel(i)}"><img src="${im.src}" data-fallback="${im.fallback}" referrerpolicy="no-referrer" onerror="lillyImgFail(this)" alt="" loading="lazy"></button>`; }).join("");
    $("#pdpTypes").innerHTML = Object.entries(D.types).map(([k, v]) =>
      `<button type="button" class="pill pill--small" data-ptype="${k}" aria-pressed="${k === sel.type}">${v.name}</button>`).join("");
    $("#pdpColors").innerHTML = t.colors.map((c) =>
      `<button type="button" class="swatch" data-color="${c}" style="--c:${D.colors[c].fabric}" aria-pressed="${c === sel.color}" aria-label="${D.colors[c].label}" title="${D.colors[c].label}"></button>`).join("");
    $("#pdpColorName").textContent = D.colors[sel.color].label;
    $("#pdpSizes").innerHTML = t.sizes.map((s) =>
      `<button type="button" class="pill pill--small" data-size="${s}" aria-pressed="${s === sel.size}">${s}</button>`).join("");
    $("#qty").textContent = sel.qty;
  }
  pdp.addEventListener("click", (e) => {
    if (e.target === pdp || e.target.closest("[data-close]")) return pdp.close();
    const pt = e.target.closest("[data-ptype]"); if (pt) { sel.type = pt.dataset.ptype; renderPdp(); }
    const c = e.target.closest("[data-color]"); if (c) { sel.color = c.dataset.color; renderPdp(); }
    const s = e.target.closest("[data-size]"); if (s) { sel.size = s.dataset.size; renderPdp(false); }
    const ph = e.target.closest("[data-photo]");
    if (ph) { const keep = $("#pdpPhotos").scrollLeft; sel.photo = ph.dataset.photo === "" ? null : ph.dataset.photo === "custom" ? sel.custom : ph.dataset.photo === "cutout" ? "cutout" : +ph.dataset.photo; renderPdp(); $("#pdpPhotos").scrollLeft = keep; }
  });
  pdp.addEventListener("close", () => lenis && lenis.start());
  $("#qtyMinus").addEventListener("click", () => { sel.qty = Math.max(1, sel.qty - 1); $("#qty").textContent = sel.qty; });
  $("#qtyPlus").addEventListener("click", () => { sel.qty = Math.min(20, sel.qty + 1); $("#qty").textContent = sel.qty; });
  $("#addToCart").addEventListener("click", (e) => {
    addToCart({ ...sel, design: { id: sel.design.id, top: sel.design.top, sub: sel.design.sub } });
    const r = e.currentTarget.getBoundingClientRect();
    confetti(r.left + r.width / 2, r.top, 60);
    toast("Ab in den Korb! Lilly wedelt zufrieden.");
    setTimeout(() => { pdp.close(); openCart(); }, 650);
  });

  /* ------------------------------------------------------------------
     Warenkorb
     ------------------------------------------------------------------ */
  let cart = store.get("lilly-cart", []).filter((i) => D.types[i.type] && D.colors[i.color]);
  const cartEl = $("#cart");

  function addToCart(item) {
    const key = [item.design.id, item.type, item.color, item.size, photoKey(item.photo)].join("|");
    const found = cart.find((i) => i.key === key);
    if (found) found.qty += item.qty;
    else cart.push({ key, design: item.design, type: item.type, color: item.color, size: item.size, photo: item.photo, qty: item.qty });
    saveCart();
    const b = $("#cartOpen");
    b.classList.remove("is-bump"); void b.offsetWidth; b.classList.add("is-bump");
  }
  function saveCart() { store.set("lilly-cart", cart); renderCart(); }
  function renderCart() {
    const count = cart.reduce((n, i) => n + i.qty, 0);
    const total = cart.reduce((n, i) => n + i.qty * priceOf(i.type, i.photo), 0);
    $("#cartCount").textContent = count;
    cartEl.classList.toggle("is-empty", !cart.length);
    $("#cartItems").innerHTML = cart.map((i, idx) => `
      <li class="cart__item">
        <div class="cart__thumb" style="--stage:${STAGE[i.color]}">${mockup(i.type, i.color, i.design.top, "", i.photo)}</div>
        <div>
          <h4>${i.design.top}</h4>
          <p>${D.types[i.type].name} · ${D.colors[i.color].label} · ${i.size}${hasPic(i.photo) ? " · " + photoLabel(i.photo) : ""}</p>
          <div class="mini-qty">
            <button data-dec="${idx}" aria-label="Menge verringern">−</button><span>${i.qty}</span><button data-inc="${idx}" aria-label="Menge erhöhen">+</button>
          </div>
        </div>
        <div class="cart__price">${euro(i.qty * priceOf(i.type, i.photo))}<button class="cart__remove" data-del="${idx}">Entfernen</button></div>
      </li>`).join("");
    $("#cartTotal").textContent = euro(total);
    const left = FREE_SHIP - total;
    $("#shipText").textContent = left > 0 ? `Noch ${euro(left)} bis zum Gratis-Versand 🐾` : "Gratis-Versand freigeschaltet! Guter Mensch.";
    $("#shipBar").style.width = Math.min(100, (total / FREE_SHIP) * 100) + "%";
  }
  $("#cartItems").addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    if (b.dataset.inc) cart[+b.dataset.inc].qty++;
    if (b.dataset.dec) { const i = cart[+b.dataset.dec]; i.qty--; if (i.qty < 1) cart.splice(+b.dataset.dec, 1); }
    if (b.dataset.del) cart.splice(+b.dataset.del, 1);
    saveCart();
  });
  let lastFocus = null;
  function openCart() {
    lastFocus = document.activeElement;
    cartEl.classList.add("is-open");
    cartEl.setAttribute("aria-hidden", "false");
    lenis && lenis.stop();
    setTimeout(() => $(".cart__close").focus(), 50);
  }
  function closeCart() {
    if (!cartEl.classList.contains("is-open")) return;
    cartEl.classList.remove("is-open");
    cartEl.setAttribute("aria-hidden", "true");
    lenis && lenis.start();
    lastFocus && lastFocus.focus && lastFocus.focus();
  }
  $("#cartOpen").addEventListener("click", openCart);
  cartEl.addEventListener("click", (e) => { if (e.target.closest("[data-cart-close]")) closeCart(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeCart(); });
  $("#checkout").addEventListener("click", () => {
    confetti(innerWidth / 2, innerHeight / 2, 140);
    toast("Demo-Shop: Hier wird später der echte Checkout (z. B. Shopify) angebunden.");
  });

  /* ------------------------------------------------------------------
     Spruch-Automat
     ------------------------------------------------------------------ */
  const REEL_H = 76;
  const reels = $$(".reel").map((el) => {
    const words = D.slot[el.dataset.reel];
    const strip = $(".reel__strip", el);
    // Mehrfach wiederholt, damit lange gedreht werden kann
    const loops = 6;
    strip.innerHTML = Array.from({ length: loops }, () => words.map((w) => `<div>${w}</div>`).join("")).join("");
    return { el, strip, words, index: 0 };
  });
  let slotResult = null;
  function spin() {
    $("#lever").classList.remove("is-pulled"); void $("#lever").offsetWidth; $("#lever").classList.add("is-pulled");
    $("#spin").disabled = true;
    const picks = reels.map((r) => Math.floor(Math.random() * r.words.length));
    let done = 0;
    reels.forEach((r, i) => {
      const target = (4 * r.words.length + picks[i]) * REEL_H;
      if (hasGsap) {
        gsap.fromTo(r.strip, { y: -r.index * REEL_H }, {
          y: -target, duration: 1.4 + i * .45, ease: "back.out(.6)",
          onComplete: () => { r.index = picks[i]; gsap.set(r.strip, { y: -picks[i] * REEL_H }); if (++done === reels.length) finish(); }
        });
      } else {
        r.index = picks[i];
        r.strip.style.transform = `translateY(${-picks[i] * REEL_H}px)`;
        if (++done === reels.length) finish();
      }
    });
    function finish() {
      slotResult = picks.map((p, i) => reels[i].words[p]);
      $("#spin").disabled = false;
      $("#slotToShirt").disabled = false;
      const r = $(".machine").getBoundingClientRect();
      confetti(r.left + r.width / 2, r.top + 40, 40);
    }
  }
  $("#spin").addEventListener("click", spin);
  $("#lever").addEventListener("click", spin);
  $("#slotToShirt").addEventListener("click", () => {
    if (!slotResult) return;
    const [a, b, c] = slotResult;
    const photo = D.slot.bPhoto[b];
    openPdp({ id: "unikat-" + slotResult.join("-").toLowerCase().replace(/[^a-z0-9äöüß]+/g, "-"), cat: "unikat", type: "shirt", color: "cream", top: `${a} ${b} ${c}`, sub: "Unikat aus Lillys Spruch-Automat", photo: photo === undefined ? null : photo });
  });

  /* ------------------------------------------------------------------
     Laufband, Galerie, Reviews, Instagram
     ------------------------------------------------------------------ */
  function fillTicker(el, items) {
    const html = items.map((t) => `<span>${t}</span>`).join("");
    el.innerHTML = html + html + html + html;
  }
  fillTicker($("#ticker1"), D.ticker);
  fillTicker($("#ticker2"), D.designs.slice(0, 8).map((d) => d.top));

  const captions = D.captions;
  $("#galleryTrack").innerHTML = D.photos.map((_, i) => { const im = D.img(i); return `
    <figure class="polaroid${im.cut ? " polaroid--cut" : ""}" style="--r:${(i % 2 ? 1 : -1) * (1 + (i * 7) % 4)}deg">
      <img src="${im.src}" data-fallback="${im.fallback}" referrerpolicy="no-referrer" onerror="lillyImgFail(this)" alt="Lilly: ${captions[i % captions.length]}" decoding="async" width="400" height="500" />
      <figcaption>${captions[i % captions.length]}</figcaption>
      <button class="polaroid__buy" data-photo-buy="${i}">Auf Merch drucken</button>
    </figure>`; }).join("");
  // Foto aus der Galerie direkt auf ein Shirt
  $("#galleryTrack").addEventListener("click", (e) => {
    const b = e.target.closest("[data-photo-buy]");
    if (!b) return;
    const i = +b.dataset.photoBuy;
    openPdp({ id: "foto-" + (i + 1), cat: "foto", type: D.cutouts.includes(i) ? "shirt" : "poster", color: "cream", top: "Good Girl. Bad Influence.", sub: captions[i % captions.length], photo: i });
  });

  $("#reviews").innerHTML = D.reviews.map((r) => `
    <figure class="review">
      <div class="review__stars" aria-label="${r.stars} von 5 Sternen">${"★".repeat(r.stars)}</div>
      <blockquote>„${r.text}“</blockquote>
      <figcaption>${r.name}<small>${r.dog}</small></figcaption>
    </figure>`).join("");

  $("#instaLink").href = D.instagram;
  const instaPics = [19, 15, 13, 16, 11].map((i) => D.img(i));
  const stack = $("#instaStack");
  stack.innerHTML = instaPics.map((im, i) => `<img src="${im.src}" data-fallback="${im.fallback}" referrerpolicy="no-referrer" onerror="lillyImgFail(this)" alt="" style="rotate:${(i - 2) * 6}deg;z-index:${i}" />`).join("");
  stack.addEventListener("click", () => {
    const imgs = $$("img", stack);
    const top = imgs.reduce((a, b) => (+getComputedStyle(b).zIndex > +getComputedStyle(a).zIndex ? b : a));
    const send = () => { imgs.forEach((im) => { im.style.zIndex = +getComputedStyle(im).zIndex + 1; }); top.style.zIndex = 0; };
    if (hasGsap) gsap.timeline().to(top, { x: 240, rotate: 20, duration: .35, ease: "power2.in" }).add(send).to(top, { x: 0, rotate: 0, duration: .5, ease: "back.out(1.6)" });
    else send();
  });

  /* ------------------------------------------------------------------
     Studio: eigenes Hundefoto hochladen → freistellen → Spruch → Korb
     ------------------------------------------------------------------ */
  (function studio() {
    const root = $("#studio");
    const st = { photo: null, result: null, tpl: 0, type: "shirt", color: "cream", own: "", name: "", tapping: false, taps: 0 };
    const cutoutURL = new URL("assets/js/cutout.js", document.baseURI).href;
    let mod = null;
    const getMod = () => (mod = mod || import(cutoutURL));

    function show(pane) {
      $$(".studio__pane", root).forEach((p) => { p.hidden = p.dataset.pane !== pane; });
      const idx = { upload: 0, scan: 1, result: 2 }[pane];
      $$("#studioSteps li").forEach((li, i) => { li.classList.toggle("is-active", i === idx); li.classList.toggle("is-done", i < idx); });
    }

    // Modelle vorladen, sobald das Studio in Sichtweite kommt
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { getMod().then((m) => m.warmup()).catch(() => {}); io.disconnect(); } }, { rootMargin: "400px" });
      io.observe(root);
    }

    const STEPS = { load: "KI wird geladen (einmalig ca. 12 MB) …", find: "Lilly sucht deinen Hund …", cut: "Schere wird gewetzt … schnipp, schnapp …", done: "Fertig!" };

    // Großes PNG für Warenkorb & Speicher verkleinern
    function shrink(url, max = 640) {
      return new Promise((res) => {
        const im = new Image();
        im.onload = () => {
          const k = Math.min(1, max / Math.max(im.width, im.height));
          const c = document.createElement("canvas");
          c.width = Math.round(im.width * k); c.height = Math.round(im.height * k);
          c.getContext("2d").drawImage(im, 0, 0, c.width, c.height);
          res(c.toDataURL("image/png"));
        };
        im.onerror = () => res(url);
        im.src = url;
      });
    }

    async function setResult(r, cut) {
      st.result = r;
      const src = await shrink(cut ? r.url : r.preview);
      st.photo = { id: "dein-hund-" + Date.now().toString(36), src, cut };
      $("#origImg").src = r.preview;
      const canTap = !!r.tap;
      $("#studioHint").textContent = !canTap ? "Dein Foto wird rund gedruckt."
        : cut ? "Nicht ganz richtig? Tipp im Originalfoto auf die fehlende Stelle deines Hundes."
        : "Wir haben deinen Hund nicht sicher erkannt. Tipp im großen Foto auf ihn, dann stelle ich ihn frei!";
      $("#studioOrig").classList.toggle("is-pulse", canTap && !cut);
      $("#studioOrig").disabled = !canTap;
      show("result");
      if (canTap && !cut) tapMode(true); else { st.tapping = false; renderStudio(true); }
    }

    async function handle(file) {
      if (!file || !/^image\//.test(file.type || "image/")) return toast("Das ist leider kein Bild.");
      show("scan");
      const scanImg = $("#scanImg");
      scanImg.src = URL.createObjectURL(file);
      $("#scanText").textContent = STEPS.load;
      try {
        const m = await getMod();
        const r = await m.cutout(file, (step) => { $("#scanText").textContent = STEPS[step] || ""; });
        if (r.url) {
          await setResult(r, true);
          const pv = $("#studioPreview").getBoundingClientRect();
          confetti(pv.left + pv.width / 2, pv.top + pv.height / 3, 70);
          toast("Freigestellt! So sieht dein Hund als Merch aus.");
        } else {
          await setResult(r, false);
          toast("Tipp im kleinen Foto auf deinen Hund, dann stelle ich ihn frei.");
        }
      } catch (err) {
        console.warn(err);
        // Fallback: Foto ohne Freistellen benutzen
        const url = URL.createObjectURL(file);
        await setResult({ url, preview: await shrink(url, 900), found: false, tap: null }, false);
        toast("Freistellen klappt in diesem Browser nicht. Wir drucken dein Foto rund.");
      }
    }

    $("#upload").addEventListener("change", (e) => handle(e.target.files[0]));
    const drop = $("#drop");
    ["dragenter", "dragover"].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.add("is-over"); }));
    ["dragleave", "drop"].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.remove("is-over"); }));
    drop.addEventListener("drop", (e) => handle(e.dataTransfer.files[0]));
    $("#tryDemo").addEventListener("click", async () => {
      const im = D.img(9);   // Toffee beim Kuchen
      const blob = await fetch(im.src).then((r) => r.ok ? r.blob() : fetch(im.fallback).then((x) => x.blob())).catch(() => null);
      if (blob) handle(new File([blob], "toffee.webp", { type: blob.type || "image/webp" }));
    });
    $("#newPhoto").addEventListener("click", () => { $("#upload").value = ""; show("upload"); });
    $("#useOriginal").addEventListener("click", async () => {
      if (!st.result) return;
      const src = await shrink(st.result.preview);
      st.photo = { id: "dein-hund-" + Date.now().toString(36), src, cut: false };
      renderStudio(true);
    });
    // Antipp-Modus: Originalfoto groß zeigen, Tipp auf den Hund
    function tapMode(on) {
      st.tapping = on;
      st.taps = 0;
      if (!on) return renderStudio(true);
      renderStudio(false);   // Bedienelemente aktualisieren, Vorschau bleibt das Originalfoto
      const pv = $("#studioPreview");
      pv.style.setProperty("--stage", "#1b0f0a");
      pv.innerHTML = `<div class="tapper"><img class="tapper__img" src="${st.result.preview}" alt="Dein Originalfoto"><p class="tapper__hint">Tipp auf deinen Hund</p></div>
        <button type="button" class="tapper__done" data-tapdone>Fertig</button>`;
      $("#studioOrig").classList.remove("is-pulse");
    }
    $("#studioOrig").addEventListener("click", () => { if (st.result && st.result.tap) tapMode(!st.tapping); });
    $("#studioPreview").addEventListener("click", async (e) => {
      if (e.target.closest("[data-tapdone]")) return tapMode(false);
      const img = e.target.closest(".tapper__img");
      if (!img || !st.tapping) return;
      const r = img.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      // Markierung an der Tipp-Stelle
      const dot = document.createElement("i");
      dot.className = "tapper__dot";
      dot.style.left = x * 100 + "%"; dot.style.top = y * 100 + "%";
      img.parentElement.appendChild(dot);
      $(".tapper__hint").textContent = "Moment …";
      await new Promise((res) => setTimeout(res, 40));
      try {
        const next = st.result.tap(x, y, st.taps === 0);   // erster Tipp: genau dieser Hund
        st.taps++;
        st.result = next;
        st.photo = { id: "dein-hund-" + Date.now().toString(36), src: await shrink(next.url), cut: true };
        $("#studioHint").textContent = "Fehlt noch was? Tipp im Foto auf die Stelle. Sonst: Fertig.";
        $(".tapper__hint").textContent = st.taps === 1 ? "Erwischt! Fehlt was? Nochmal tippen." : "Ergänzt!";
        // kleine Vorschau des Ergebnisses unten rechts
        let mini = $(".tapper__mini");
        if (!mini) { mini = document.createElement("img"); mini.className = "tapper__mini"; mini.alt = "Freigestellt"; img.parentElement.appendChild(mini); }
        mini.src = st.photo.src;
      } catch (err) {
        $(".tapper__hint").textContent = "Da ist kein Hund. Versuch's an einer anderen Stelle.";
      }
    });

    // Spruch, Produkt, Farbe
    const fill = (t) => t.replace(/\{name\}/g, st.name);
    function texts() {
      if (st.own.trim()) return { top: st.own.trim(), sub: st.name };
      const t = D.studio[st.tpl];
      const top = st.name ? fill(t.top) : (t.without || t.top.replace(/\{name\}/g, "").trim());
      const sub = st.name ? fill(t.sub || "") : (t.sub || "").includes("{name}") ? "" : t.sub || "";
      return { top, sub: sub.replace(/^,\s*/, "") };
    }
    function renderStudio(animate) {
      if (!st.photo) return;
      const t = D.types[st.type];
      if (!t.colors.includes(st.color)) st.color = t.colors[0];
      const { top, sub } = texts();
      const pv = $("#studioPreview");
      if (!st.tapping) {
        pv.style.setProperty("--stage", STAGE[st.color]);
        pv.innerHTML = mockup(st.type, st.color, top, sub, st.photo);
        if (animate && hasGsap) gsap.from(pv.firstElementChild, { scale: .8, rotate: -4, duration: .7, ease: "back.out(2)" });
      }
      $("#studioSlogans").innerHTML = D.studio.map((tpl, i) => {
        const label = st.name ? fill(tpl.top) : (tpl.without || tpl.top.replace(/\{name\}/g, "…"));
        return `<button type="button" class="pill pill--small" data-tpl="${i}" aria-pressed="${!st.own.trim() && i === st.tpl}">${label}</button>`;
      }).join("");
      $("#studioTypes").innerHTML = Object.entries(D.types).map(([k, v]) =>
        `<button type="button" class="pill pill--small" data-stype="${k}" aria-pressed="${k === st.type}">${v.name}</button>`).join("");
      $("#studioColors").innerHTML = t.colors.map((c) =>
        `<button type="button" class="swatch" data-scolor="${c}" style="--c:${D.colors[c].fabric}" aria-pressed="${c === st.color}" aria-label="${D.colors[c].label}" title="${D.colors[c].label}"></button>`).join("");
      $("#studioPrice").textContent = euro(priceOf(st.type, st.photo));
    }
    root.addEventListener("click", (e) => {
      const tp = e.target.closest("[data-tpl]"); if (tp) { st.tpl = +tp.dataset.tpl; st.own = ""; $("#ownText").value = ""; renderStudio(true); }
      const ty = e.target.closest("[data-stype]"); if (ty) { st.type = ty.dataset.stype; renderStudio(true); }
      const co = e.target.closest("[data-scolor]"); if (co) { st.color = co.dataset.scolor; renderStudio(true); }
    });
    let typing;
    $("#dogName").addEventListener("input", (e) => { st.name = e.target.value.trim(); clearTimeout(typing); typing = setTimeout(() => renderStudio(false), 120); });
    $("#ownText").addEventListener("input", (e) => { st.own = e.target.value; clearTimeout(typing); typing = setTimeout(() => renderStudio(false), 120); });
    $("#studioNext").addEventListener("click", () => {
      const { top, sub } = texts();
      openPdp({ id: st.photo.id, cat: "eigenes", type: st.type, color: st.color, top, sub, photo: st.photo });
    });
  })();

  /* ------------------------------------------------------------------
     Lilly-Trend (Umfrage-Parodie)
     ------------------------------------------------------------------ */
  const poll = D.poll;
  let myVote = store.get("lilly-vote", null);
  function renderPoll(animate) {
    const votes = poll.options.map((o) => o.base + (myVote === o.id ? 1 : 0));
    const sum = votes.reduce((a, b) => a + b, 0);
    $("#pollQ").textContent = poll.question;
    $("#pollNote").textContent = poll.footnote;
    $("#pollOpts").innerHTML = poll.options.map((o, i) => {
      const pct = Math.round((votes[i] / sum) * 100);
      return `<button class="poll__opt${myVote === o.id ? " is-mine" : ""}" data-vote="${o.id}" aria-pressed="${myVote === o.id}" style="--w:${animate ? 0 : pct}%" data-pct="${pct}">
        <span class="poll__bar"></span><span class="poll__label">${o.label}</span><span class="poll__pct">${myVote ? pct + " %" : ""}</span></button>`;
    }).join("");
    $("#pollOpts").classList.toggle("is-voted", !!myVote);
    if (animate) requestAnimationFrame(() => $$(".poll__opt").forEach((b) => b.style.setProperty("--w", b.dataset.pct + "%")));
  }
  $("#pollOpts").addEventListener("click", (e) => {
    const b = e.target.closest("[data-vote]");
    if (!b) return;
    myVote = b.dataset.vote;
    store.set("lilly-vote", myVote);
    renderPoll(true);
    const r = b.getBoundingClientRect();
    confetti(r.right - 40, r.top + r.height / 2, 40);
    toast(myVote === "lilly" ? "Danke! Lilly bleibt im Umfragehoch." : myVote === "toffee" ? "Toffee bedankt sich und frisst den Stimmzettel." : "Stimme gezählt. Lilly ist trotzdem vorne.");
  });
  renderPoll(false);
  $("#designCount").textContent = D.designs.length;

  $("#newsForm").addEventListener("submit", (e) => {
    e.preventDefault();
    $("#newsOk").hidden = false;
    e.target.reset();
    const r = e.target.getBoundingClientRect();
    confetti(r.left + r.width / 2, r.top, 60);
  });

  /* ------------------------------------------------------------------
     Stöckchen-Modus: Ball werfen → Toffee oder Lilly holt ihn
     ------------------------------------------------------------------ */
  (function fetchGame() {
    const btn = $("#fetchBtn");
    if (reduced) { btn.hidden = true; return; }
    const layer = document.createElement("div");
    layer.className = "fetch";
    layer.setAttribute("aria-hidden", "true");
    layer.innerHTML = '<div class="fetch__ball"></div><img class="fetch__dog" alt="">';
    document.body.appendChild(layer);
    const ball = $(".fetch__ball", layer), dog = $(".fetch__dog", layer);
    const R = 16;
    const dogs = [
      { name: "Toffee", img: D.img(3), lines: ["Toffee hat ihn! Sabbernd, aber stolz.", "Toffee bringt den Ball. Fast bis zu dir.", "Toffee: „Nochmal! Nochmal! Nochmal!“", "Toffee hat den Ball. Und eine Socke. Bonus."] },
      { name: "Lilly",  img: D.img(0), lines: ["Lilly holt den Ball. Ausnahmsweise.", "Lilly: „Das war das letzte Mal heute.“", "Lilly bringt ihn zurück und legt sich wieder hin.", "Lilly hat den Ball. Verhandlungen über Leckerli laufen."] }
    ];
    let busy = false, count = 0;

    function go(x, y) {
      if (busy) return;
      busy = true;
      const who = dogs[count % 2];
      count++;
      dog.onerror = () => { dog.onerror = null; dog.src = who.img.fallback; };
      dog.src = who.img.src;
      const dogW = Math.min(250, innerWidth * .42);
      dog.style.width = dogW + "px";
      const floor = () => innerHeight - R - 10;
      let bx = x, by = y, vx = (innerWidth / 2 - x) / 45 + (Math.random() - .5) * 8, vy = -(16 + Math.random() * 6);
      let spin = 0, phase = "fly", t = 0, dx = 0, dir = 1, rest = 0;
      layer.classList.add("is-on");
      ball.style.opacity = "1";
      dog.style.opacity = "0";

      (function frame() {
        t++;
        const dogH = dog.offsetHeight || dogW;
        const dogTop = innerHeight - dogH - 2;
        if (phase === "fly") {
          vy += .75; bx += vx; by += vy; spin += vx * 3;
          if (bx < R) { bx = R; vx = -vx * .8; }
          if (bx > innerWidth - R) { bx = innerWidth - R; vx = -vx * .8; }
          if (by > floor()) { by = floor(); vy = Math.abs(vy) < 3 ? 0 : -vy * .6; vx *= .88; }
          if (vy === 0) rest++;
          if (rest > 12 || t > 260) {
            phase = "run";
            dir = bx < innerWidth / 2 ? -1 : 1;            // vom weiter entfernten Rand quer übers Bild
            dx = dir === 1 ? -dogW : innerWidth;
            dog.style.opacity = "1";
          }
        } else if (phase === "run" || phase === "carry") {
          dx += dir * (phase === "carry" ? 1.25 : 1) * (innerWidth > 700 ? 9 : 6);
          const mouth = dx + dogW / 2;
          if (phase === "run" && ((dir === 1 && mouth >= bx) || (dir === -1 && mouth <= bx))) {
            phase = "carry";
            dir = -dir;
            toast(who.lines[Math.floor(Math.random() * who.lines.length)]);
            if (count % 5 === 0) {
              setTimeout(() => toast(count + " Bälle! Die Doppelspitze verlangt jetzt Leckerli."), 2700);
              confetti(bx, innerHeight - 120, 80);
            }
          }
          if (phase === "carry") { bx = dx + dogW / 2; by = dogTop + dogH * .32; spin = 0; }
          const bob = Math.abs(Math.sin(t * .45)) * 16;
          dog.style.transform = `translate(${dx}px, ${dogTop - bob}px) rotate(${Math.sin(t * .45) * 6}deg) scaleX(${-dir})`;
          if (phase === "carry" && (dx < -dogW - 40 || dx > innerWidth + 40)) {
            layer.classList.remove("is-on");
            ball.style.opacity = "0";
            dog.style.opacity = "0";
            busy = false;
            return;
          }
        }
        ball.style.transform = `translate(${bx - R}px, ${by - R}px) rotate(${spin}deg)`;
        requestAnimationFrame(frame);
      })();
    }

    // Im Hero gibt es einen eigenen Knopf; der schwebende erscheint erst nach dem Hero
    $$("[data-throw]").forEach((b) => b.addEventListener("click", () => { const r = b.getBoundingClientRect(); go(r.left + r.width / 2, r.top); }));
    const toggleFab = () => btn.classList.toggle("is-visible", scrollY > innerHeight * .7);
    addEventListener("scroll", toggleFab, { passive: true });
    toggleFab();

    btn.addEventListener("click", () => {
      const r = btn.getBoundingClientRect();
      btn.classList.remove("is-thrown"); void btn.offsetWidth; btn.classList.add("is-thrown");
      go(r.left + r.width / 2, r.top);
    });
    // Taste „B“ wirft auch (außer beim Tippen in Feldern)
    addEventListener("keydown", (e) => {
      if ((e.key === "b" || e.key === "B") && !e.target.closest("input, textarea") && !pdp.open) btn.click();
    });
  })();

  /* ------------------------------------------------------------------
     Cursor & magnetische Buttons
     ------------------------------------------------------------------ */
  if (fine && !reduced) {
    const cur = $(".cursor"), label = $(".cursor__label");
    let cx = innerWidth / 2, cy = innerHeight / 2, tx = cx, ty = cy;
    addEventListener("pointermove", (e) => { tx = e.clientX; ty = e.clientY; });
    (function loop() {
      cx += (tx - cx) * .2; cy += (ty - cy) * .2;
      cur.style.transform = `translate(${cx}px, ${cy}px)`;
      requestAnimationFrame(loop);
    })();
    document.addEventListener("pointerover", (e) => {
      const card = e.target.closest(".card, .insta__stack");
      const gal = e.target.closest(".polaroid");
      const link = e.target.closest("a, button, input");
      cur.classList.toggle("is-big", !!(card || gal));
      cur.classList.toggle("is-hover", !card && !gal && !!link);
      label.textContent = card ? (card.classList.contains("card") ? "Ansehen" : "Weiter") : gal ? "Wuff!" : "";
    });
    document.body.style.cursor = "";

    $$("[data-magnetic]").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${x * .25}px, ${y * .35}px)`;
      });
      el.addEventListener("pointerleave", () => {
        el.style.transition = "transform .6s cubic-bezier(.34,1.56,.64,1)";
        el.style.transform = "";
        setTimeout(() => (el.style.transition = ""), 600);
      });
    });
  }

  /* ------------------------------------------------------------------
     Navigation ein-/ausblenden, Fortschritt
     ------------------------------------------------------------------ */
  let lastY = 0;
  function onScroll(y) {
    const max = document.documentElement.scrollHeight - innerHeight;
    document.documentElement.style.setProperty("--p", max > 0 ? y / max : 0);
    $("#nav").classList.toggle("is-hidden", y > lastY && y > 300);
    lastY = y;
  }
  if (lenis) lenis.on("scroll", ({ scroll }) => onScroll(scroll));
  else addEventListener("scroll", () => onScroll(scrollY), { passive: true });

  /* ------------------------------------------------------------------
     Zeichen-/Wort-Splitting
     ------------------------------------------------------------------ */
  $$("[data-split]").forEach((w) => {
    w.innerHTML = [...w.textContent].map((ch) => `<span class="char">${ch}</span>`).join("");
  });
  const mt = $("#manifestText");
  mt.innerHTML = mt.textContent.split(" ").map((w) => `<span class="w">${w}</span>`).join(" ");

  /* ------------------------------------------------------------------
     Initiales Rendern
     ------------------------------------------------------------------ */
  renderFilters();
  renderGrid();
  renderCart();

  /* ------------------------------------------------------------------
     Preloader → Intro-Animation
     ------------------------------------------------------------------ */
  const loader = $("#loader");
  document.body.classList.add("is-loading");
  const heroImg = $("#heroDog img");
  const imgReady = new Promise((res) => {
    if (heroImg.complete) res(); else { heroImg.addEventListener("load", res); heroImg.addEventListener("error", res); }
  });
  const minTime = new Promise((res) => setTimeout(res, reduced ? 0 : 1200));
  const maxTime = new Promise((res) => setTimeout(res, 3500));
  let pct = 0;
  const counter = setInterval(() => { pct = Math.min(99, pct + Math.ceil(Math.random() * 9)); $("#loaderCount").textContent = pct; }, 70);

  Promise.race([Promise.all([imgReady, minTime, document.fonts ? document.fonts.ready : null]), maxTime]).then(() => {
    clearInterval(counter);
    $("#loaderCount").textContent = 100;
    document.body.classList.remove("is-loading");
    if (!hasGsap) { loader.remove(); $("#nav").classList.add("is-in"); initCountersStatic(); return; }
    const tl = gsap.timeline();
    tl.to(loader, { yPercent: -100, duration: .9, ease: "expo.inOut", delay: .15, onComplete: () => loader.remove() })
      .from(".hero__title .char", { yPercent: 120, rotate: () => gsap.utils.random(-25, 25), opacity: 0, duration: 1, ease: "back.out(1.7)", stagger: .035 }, "-=.35")
      .from(".hero__dog", { yPercent: 70, scale: .7, duration: 1.3, ease: "elastic.out(1, .7)" }, "-=.9")
      .from(".hero__sun", { scale: 0, duration: 1.1, ease: "expo.out" }, "<")
      .from(".sticker", { scale: 0, rotate: -180, duration: .9, ease: "back.out(2)", stagger: .12 }, "-=.9")
      .from(".hero__foot > *", { y: 40, opacity: 0, duration: .7, ease: "power3.out", stagger: .1 }, "-=.7")
      .add(() => $("#nav").classList.add("is-in"), "-=.8");
    initScrollAnimations();
  });

  function initCountersStatic() {
    $$("[data-count]").forEach((el) => { el.textContent = el.dataset.count; });
  }

  /* ------------------------------------------------------------------
     Scroll-Animationen (nur mit GSAP)
     ------------------------------------------------------------------ */
  function initScrollAnimations() {
    // Hero-Parallax
    gsap.to(".hero__dog", { yPercent: 18, scale: 1.08, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
    gsap.to(".hero__title", { yPercent: -30, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
    gsap.to(".hero__bg", { yPercent: 25, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });

    // Maus-Parallax im Hero
    if (fine) {
      const qx = [".hero__dog", ".sticker--one", ".sticker--two", ".hero__sun"].map((s, i) => ({
        x: gsap.quickTo(s, "x", { duration: .9, ease: "power3" }),
        y: gsap.quickTo(s, "y", { duration: .9, ease: "power3" }),
        k: [18, -36, 30, -12][i]
      }));
      $(".hero").addEventListener("pointermove", (e) => {
        const nx = e.clientX / innerWidth - .5, ny = e.clientY / innerHeight - .5;
        qx.forEach((q) => { q.x(nx * q.k); q.y(ny * q.k); });
      });
    }

    // Hero-Buchstaben wackeln bei Berührung wie Gummi
    $$(".hero__title .char").forEach((ch) => ch.addEventListener("pointerenter", () => {
      gsap.fromTo(ch, { scaleY: 1.35, scaleX: .78 }, { scaleY: 1, scaleX: 1, duration: 1, ease: "elastic.out(1.2, .3)", overwrite: "auto" });
    }));

    // Laufband: Grundgeschwindigkeit + Scroll-Velocity
    $$(".marquee__row").forEach((row) => {
      const track = $(".marquee__track", row);
      const dir = +row.dataset.speed;
      let x = 0, boost = 0;
      gsap.ticker.add(() => {
        const half = track.scrollWidth / 2;
        const v = lenis ? lenis.velocity : 0;
        boost += (v * .6 - boost) * .1;
        x -= (1.2 + Math.abs(boost)) * dir * (boost < 0 ? -1 : 1);
        if (x <= -half) x += half;
        if (x > 0) x -= half;
        track.style.transform = `translateX(${x}px) skewX(${gsap.utils.clamp(-12, 12, -boost * .5)}deg)`;
      });
    });

    // Manifest: Wörter leuchten beim Scrollen auf
    gsap.to("#manifestText .w", {
      opacity: 1, stagger: .1, ease: "none",
      scrollTrigger: { trigger: "#manifestText", start: "top 80%", end: "bottom 40%", scrub: true }
    });
    gsap.from(".manifest__stats div", { y: 80, rotate: (i) => [-6, 6, -4][i], opacity: 0, duration: 1, ease: "back.out(1.6)", stagger: .12,
      scrollTrigger: { trigger: ".manifest__stats", start: "top 85%" } });
    $$("[data-count]").forEach((el) => {
      const o = { v: 0 };
      gsap.to(o, { v: +el.dataset.count, duration: 1.8, ease: "power3.out", onUpdate: () => (el.textContent = Math.round(o.v)),
        scrollTrigger: { trigger: el, start: "top 90%" } });
    });

    // Überschriften: Wort für Wort
    $$(".section-title").forEach((t) => {
      const parts = $$("[data-reveal]", t);
      gsap.from(parts.length ? parts : t, { yPercent: 100, rotate: 6, opacity: 0, duration: 1, ease: "back.out(1.6)", stagger: .08,
        scrollTrigger: { trigger: t, start: "top 85%" } });
    });

    // Lilly-Trend: Balken wachsen beim Reinscrollen
    ScrollTrigger.create({ trigger: ".poll", start: "top 75%", once: true, onEnter: () => renderPoll(true) });

    // Automat
    gsap.from(".machine", { rotate: 8, y: 120, opacity: 0, duration: 1.2, ease: "elastic.out(1, .7)", scrollTrigger: { trigger: ".automat", start: "top 70%" } });

    // Galerie horizontal (Desktop)
    ScrollTrigger.matchMedia({
      "(min-width: 761px)": () => {
        const track = $("#galleryTrack");
        const dist = () => track.scrollWidth - innerWidth + $(".gallery__head").offsetWidth + 120;
        const tween = gsap.to(track, { x: () => -dist(), ease: "none",
          scrollTrigger: { trigger: ".gallery", start: "top top", end: () => "+=" + dist(), pin: ".gallery__pin", scrub: 1, invalidateOnRefresh: true } });
        $$(".polaroid", track).forEach((p) => {
          gsap.from(p, { y: () => gsap.utils.random(-120, 120), rotate: () => gsap.utils.random(-15, 15), ease: "none",
            scrollTrigger: { trigger: p, containerAnimation: tween, start: "left right", end: "center center", scrub: true } });
        });
      }
    });

    // Reviews
    gsap.from(".review", { y: 100, rotate: (i) => (i % 2 ? 8 : -8), opacity: 0, duration: 1, ease: "back.out(1.5)", stagger: .1,
      scrollTrigger: { trigger: ".reviews__grid", start: "top 85%" } });

    // Instagram-Stapel fächert sich auf
    gsap.from("#instaStack img", { y: 300, rotate: (i) => (i - 2) * 25, opacity: 0, duration: 1.1, ease: "back.out(1.4)", stagger: .1,
      scrollTrigger: { trigger: ".insta", start: "top 70%" } });

    // Footer-Schriftzug
    gsap.from(".footer__big", { yPercent: 60, scaleY: .4, transformOrigin: "50% 100%", ease: "none",
      scrollTrigger: { trigger: ".footer", start: "top bottom", end: "bottom bottom", scrub: true } });

    ScrollTrigger.refresh();
  }
})();
