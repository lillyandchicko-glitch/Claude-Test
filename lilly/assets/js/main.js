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

  // Bühnenfarbe hinter dem Produkt (Kontrast zur Stofffarbe)
  const STAGE = { cream: "#ffb81c", red: "#ffd8a8", mustard: "#e8361e", ink: "#ff9ec7", sky: "#fff1dc", forest: "#ffb81c" };

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
    const colors = ["#e8361e", "#ffb81c", "#ff9ec7", "#9fd3ff", "#1b0f0a"];
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
  const state = { cat: "all", type: "all" };
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
      <button class="card" data-id="${d.id}" style="--stage:${STAGE[d.color]}" aria-label="${d.top} – ${t.name}, ${euro(t.price)}">
        <div class="card__stage">
          ${d.badge ? `<span class="card__badge">${d.badge}</span>` : ""}
          ${mockup(d.type, d.color, d.top, d.sub)}
          <span class="card__quick" aria-hidden="true">+</span>
        </div>
        <div class="card__body">
          <h3 class="card__title">${d.top}</h3>
          <span class="card__price">${euro(t.price)}</span>
          <p class="card__meta">${t.name} · ${t.colors.length} Farben</p>
          <div class="card__dots" aria-hidden="true">${t.colors.map((c) => `<i style="background:${D.colors[c].fabric}"></i>`).join("")}</div>
        </div>
      </button>`;
  }

  function renderGrid() {
    const list = D.designs.filter((d) => (state.cat === "all" || d.cat === state.cat) && (state.type === "all" || d.type === state.type));
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
    renderFilters(); renderGrid();
  });
  $("#types").addEventListener("click", (e) => {
    const b = e.target.closest("[data-type]");
    if (!b || b.dataset.type === state.type) return;
    state.type = b.dataset.type;
    renderFilters(); renderGrid();
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
  const sel = { design: null, type: "shirt", color: "cream", size: "M", qty: 1 };

  function openPdp(design, origin) {
    sel.design = design;
    sel.type = design.type;
    sel.color = design.color;
    sel.size = pickSize(design.type, "M");
    sel.qty = 1;
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
    stage.innerHTML = mockup(sel.type, sel.color, d.top, d.sub);
    if (animate && hasGsap) gsap.from(stage.firstElementChild, { scale: .85, rotate: 4, duration: .6, ease: "back.out(2)" });
    $("#pdpType").textContent = t.name + " · " + (D.categories.find((c) => c.id === d.cat) || { label: "Unikat" }).label;
    $("#pdpTitle").textContent = d.top;
    $("#pdpSub").textContent = d.sub || "";
    $("#pdpPrice").textContent = euro(t.price);
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
  let cart = store.get("lilly-cart", []);
  const cartEl = $("#cart");

  function addToCart(item) {
    const key = [item.design.id, item.type, item.color, item.size].join("|");
    const found = cart.find((i) => i.key === key);
    if (found) found.qty += item.qty;
    else cart.push({ key, design: item.design, type: item.type, color: item.color, size: item.size, qty: item.qty });
    saveCart();
    const b = $("#cartOpen");
    b.classList.remove("is-bump"); void b.offsetWidth; b.classList.add("is-bump");
  }
  function saveCart() { store.set("lilly-cart", cart); renderCart(); }
  function renderCart() {
    const count = cart.reduce((n, i) => n + i.qty, 0);
    const total = cart.reduce((n, i) => n + i.qty * D.types[i.type].price, 0);
    $("#cartCount").textContent = count;
    cartEl.classList.toggle("is-empty", !cart.length);
    $("#cartItems").innerHTML = cart.map((i, idx) => `
      <li class="cart__item">
        <div class="cart__thumb" style="--stage:${STAGE[i.color]}">${mockup(i.type, i.color, i.design.top, "")}</div>
        <div>
          <h4>${i.design.top}</h4>
          <p>${D.types[i.type].name} · ${D.colors[i.color].label} · ${i.size}</p>
          <div class="mini-qty">
            <button data-dec="${idx}" aria-label="Menge verringern">−</button><span>${i.qty}</span><button data-inc="${idx}" aria-label="Menge erhöhen">+</button>
          </div>
        </div>
        <div class="cart__price">${euro(i.qty * D.types[i.type].price)}<button class="cart__remove" data-del="${idx}">Entfernen</button></div>
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
    openPdp({ id: "unikat-" + slotResult.join("-").toLowerCase().replace(/[^a-z0-9äöüß]+/g, "-"), cat: "unikat", type: "shirt", color: "cream", top: `${a} ${b} ${c}`, sub: "Unikat aus Lillys Spruch-Automat" });
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

  const captions = ["Chefin im Dienst", "Golden Hour, wer sonst", "Fotoshooting gegen Käse", "Hat den Ball gesehen", "Bin heute Influencerin", "Kein Leckerli, keine Pose",
    "Offiziell beste Hündin", "Sonntag. Sofa. Sieg.", "Sieht unschuldig aus", "War's nicht", "Modelt nur Hoodies", "Haare überall, Liebe auch",
    "Termin beim Friseur? Nö.", "Plant den nächsten Drop", "Zoomies in 3…2…1", "Bitte nicht stören", "Schnüffelt die Konkurrenz aus", "Wartet auf Komplimente",
    "Lächelt für die Kamera", "Wochenende!"];
  $("#galleryTrack").innerHTML = D.photos.map((src, i) => `
    <figure class="polaroid" style="--r:${(i % 2 ? 1 : -1) * (1 + (i * 7) % 4)}deg">
      <img src="${src}" alt="Lilly: ${captions[i % captions.length]}" loading="lazy" decoding="async" width="400" height="500" />
      <figcaption>${captions[i % captions.length]}</figcaption>
    </figure>`).join("");
  $$("#galleryTrack img").forEach((img) => img.addEventListener("error", () => { img.closest(".polaroid").remove();
    if (!$(".polaroid")) $("#galerie").hidden = true;
    if (hasGsap) ScrollTrigger.refresh();
  }));

  $("#reviews").innerHTML = D.reviews.map((r) => `
    <figure class="review">
      <div class="review__stars" aria-label="${r.stars} von 5 Sternen">${"★".repeat(r.stars)}</div>
      <blockquote>„${r.text}“</blockquote>
      <figcaption>${r.name}<small>${r.dog}</small></figcaption>
    </figure>`).join("");

  $("#instaLink").href = D.instagram;
  const instaPics = [D.photos[8], D.photos[11], D.photos[0], D.photos[13], D.photos[5]];
  const stack = $("#instaStack");
  stack.innerHTML = instaPics.map((src, i) => `<img src="${src}" alt="" loading="lazy" style="rotate:${(i - 2) * 6}deg;z-index:${i}" />`).join("");
  stack.addEventListener("click", () => {
    const imgs = $$("img", stack);
    const top = imgs.reduce((a, b) => (+getComputedStyle(b).zIndex > +getComputedStyle(a).zIndex ? b : a));
    const send = () => { imgs.forEach((im) => { im.style.zIndex = +getComputedStyle(im).zIndex + 1; }); top.style.zIndex = 0; };
    if (hasGsap) gsap.timeline().to(top, { x: 240, rotate: 20, duration: .35, ease: "power2.in" }).add(send).to(top, { x: 0, rotate: 0, duration: .5, ease: "back.out(1.6)" });
    else send();
  });

  $("#newsForm").addEventListener("submit", (e) => {
    e.preventDefault();
    $("#newsOk").hidden = false;
    e.target.reset();
    const r = e.target.getBoundingClientRect();
    confetti(r.left + r.width / 2, r.top, 60);
  });

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
