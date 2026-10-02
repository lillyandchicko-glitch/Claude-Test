/* Produkt-Mockups als SVG + HTML-Druckfläche.
   mockup(type, colorKey, top, sub) → HTML-String. */
(function () {
  let uid = 0;

  // Silhouetten (viewBox 0 0 400 440). print = Druckfläche in % [left, top, width, height]
  const SHAPES = {
    shirt: {
      print: [29, 27, 42, 44],
      draw: (f, s, g) => `
        <path d="M140 40C160 64 240 64 260 40L332 66L394 142L340 184L308 160L308 410Q200 424 92 410L92 160L60 184L6 142L68 66Z" fill="${f}"/>
        <path d="M140 40C160 64 240 64 260 40L332 66L394 142L340 184L308 160L308 410Q200 424 92 410L92 160L60 184L6 142L68 66Z" fill="url(#${g})"/>
        <path d="M140 40C158 74 242 74 260 40" fill="none" stroke="${s}" stroke-width="7" stroke-linecap="round"/>
        <path d="M92 160L92 200M308 160L308 200" stroke="${s}" stroke-width="2" opacity=".5"/>`
    },
    hoodie: {
      print: [29, 39, 42, 28],
      draw: (f, s, g) => `
        <path d="M118 74C104 6 296 6 282 74Z" fill="${f}"/>
        <path d="M118 72L60 94L22 262L24 384L72 388L84 254L92 206L92 414Q200 426 308 414L308 206L316 254L328 388L376 384L378 262L340 94L282 72Z" fill="${f}"/>
        <path d="M118 72L60 94L22 262L24 384L72 388L84 254L92 206L92 414Q200 426 308 414L308 206L316 254L328 388L376 384L378 262L340 94L282 72Z" fill="url(#${g})"/>
        <path d="M148 76C146 34 254 34 252 76C232 108 168 108 148 76Z" fill="${s}" opacity=".55"/>
        <path d="M178 100L172 170M222 100L228 170" stroke="${s}" stroke-width="4" stroke-linecap="round"/>
        <path d="M138 318L262 318L282 392L118 392Z" fill="none" stroke="${s}" stroke-width="3" opacity=".55"/>
        <path d="M24 372L72 376M328 376L376 372M94 404Q200 416 306 404" stroke="${s}" stroke-width="3" opacity=".5"/>`
    },
    cap: {
      print: [30, 41, 40, 16],
      draw: (f, s, g) => `
        <path d="M70 270C62 120 338 120 330 270Z" fill="${f}"/>
        <path d="M70 270C62 120 338 120 330 270Z" fill="url(#${g})"/>
        <path d="M200 140L200 268M130 160Q150 210 150 268M270 160Q250 210 250 268" stroke="${s}" stroke-width="2" opacity=".35" fill="none"/>
        <path d="M54 266Q200 248 346 266Q368 316 290 322Q200 300 110 322Q32 316 54 266Z" fill="${f}"/>
        <path d="M54 266Q200 248 346 266Q368 316 290 322Q200 300 110 322Q32 316 54 266Z" fill="${s}" opacity=".28"/>
        <circle cx="200" cy="136" r="10" fill="${f}" stroke="${s}" stroke-width="2" opacity=".9"/>`
    },
    tote: {
      print: [24, 42, 52, 42],
      draw: (f, s, g) => `
        <path d="M130 150C130 30 180 30 180 150M220 150C220 30 270 30 270 150" fill="none" stroke="${f}" stroke-width="16"/>
        <path d="M130 150C130 30 180 30 180 150M220 150C220 30 270 30 270 150" fill="none" stroke="${s}" stroke-width="16" opacity=".22"/>
        <path d="M74 140L326 140L340 424L60 424Z" fill="${f}"/>
        <path d="M74 140L326 140L340 424L60 424Z" fill="url(#${g})"/>
        <path d="M78 156L322 156" stroke="${s}" stroke-width="2" stroke-dasharray="6 6" opacity=".45"/>`
    },
    mug: {
      print: [25, 37, 44, 42],
      draw: (f, s, g) => `
        <path d="M300 170C380 170 380 320 300 320" fill="none" stroke="${f}" stroke-width="30"/>
        <path d="M300 170C380 170 380 320 300 320" fill="none" stroke="${s}" stroke-width="30" opacity=".18"/>
        <path d="M80 120L320 120L320 380Q320 410 290 410L110 410Q80 410 80 380Z" fill="${f}"/>
        <path d="M80 120L320 120L320 380Q320 410 290 410L110 410Q80 410 80 380Z" fill="url(#${g})"/>
        <ellipse cx="200" cy="120" rx="120" ry="20" fill="${f}"/>
        <ellipse cx="200" cy="122" rx="104" ry="13" fill="#3a1f12"/>`
    },
    bandana: {
      print: [30, 31, 40, 24],
      draw: (f, s, g) => `
        <path d="M10 112Q40 96 70 116L50 150Q24 140 10 112ZM390 112Q360 96 330 116L350 150Q376 140 390 112Z" fill="${f}"/>
        <path d="M44 116Q200 140 356 116L210 410Q200 426 190 410Z" fill="${f}"/>
        <path d="M44 116Q200 140 356 116L210 410Q200 426 190 410Z" fill="url(#${g})"/>
        <path d="M70 134Q200 156 330 134" fill="none" stroke="${s}" stroke-width="3" stroke-dasharray="2 9" stroke-linecap="round" opacity=".6"/>`
    }
  };

  // Wahlplakat (eigene Form, gleiche Druck-Logik)
  SHAPES.poster = {
    print: [21, 12, 58, 76],
    draw: (f, s, g) => `
      <rect x="58" y="18" width="284" height="404" rx="6" fill="${f}"/>
      <rect x="58" y="18" width="284" height="404" rx="6" fill="url(#${g})"/>
      <rect x="72" y="32" width="256" height="376" rx="3" fill="none" stroke="${s}" stroke-width="2" opacity=".5"/>
      <rect x="150" y="6" width="100" height="26" rx="3" fill="#fff8e8" opacity=".85" transform="rotate(-4 200 19)"/>`
  };

  // Druckfläche, wenn ein Foto mitgedruckt wird (größer als nur Text)
  const PHOTO_PRINT = {
    shirt: [27, 20, 46, 58], hoodie: [28, 33, 44, 36], poster: [21, 10, 58, 80],
    cap: [33, 34, 34, 26], tote: [24, 38, 52, 52], mug: [25, 33, 44, 54], bandana: [31, 29, 38, 32]
  };

  const PAW = `<svg class="print__paw" viewBox="0 0 64 64" aria-hidden="true"><g fill="currentColor"><ellipse cx="32" cy="44" rx="13" ry="11"/><circle cx="15" cy="29" r="6.5"/><circle cx="26" cy="18" r="6.5"/><circle cx="38" cy="18" r="6.5"/><circle cx="49" cy="29" r="6.5"/></g></svg>`;

  function esc(t) {
    return String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  }

  // Schriftgröße in cqw abhängig von Textlänge und Breite der Druckfläche
  // und so, dass das längste Wort nie umbrechen muss
  function fit(text, width) {
    const len = Math.max(8, text.length);
    const longest = Math.max(...text.split(/\s+/).map((w) => w.length));
    return Math.min(9.5, (width * 1.6) / longest, Math.max(2.4, (width * 2.1) / Math.pow(len, 0.78)));
  }

  window.mockup = function (type, colorKey, top, sub, photo) {
    const shape = SHAPES[type] || SHAPES.shirt;
    const c = window.LILLY.colors[colorKey] || window.LILLY.colors.cream;
    const g = "sh" + ++uid;
    const shadeDark = colorKey === "ink" || colorKey === "forest";
    const stroke = shadeDark ? "rgba(255,255,255,.35)" : "rgba(27,15,10,.55)";
    const hasPhoto = photo !== undefined && photo !== null && photo !== "";
    const [l, t, w, h] = hasPhoto ? PHOTO_PRINT[type] || shape.print : shape.print;
    const fs = fit(top, w) * (hasPhoto ? (type === "poster" ? .62 : .72) : 1);
    let pic = PAW;
    if (hasPhoto) {
      const im = window.LILLY.img(photo);
      const shape = im.cut ? "cut" : type === "poster" ? "rect" : "round";
      pic = `<img class="print__photo print__photo--${shape}" src="${im.src}" data-fallback="${im.fallback}" referrerpolicy="no-referrer" onerror="lillyImgFail(this)" alt="" decoding="async">`;
    }
    return `
      <div class="mock mock--${type}${hasPhoto ? " has-photo" : ""}" style="--print-ink:${c.ink}">
        <svg class="mock__svg" viewBox="0 0 400 440" aria-hidden="true">
          <defs>
            <linearGradient id="${g}" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="#fff" stop-opacity=".22"/>
              <stop offset=".45" stop-color="#fff" stop-opacity="0"/>
              <stop offset="1" stop-color="#000" stop-opacity=".18"/>
            </linearGradient>
          </defs>
          ${shape.draw(c.fabric, stroke, g)}
        </svg>
        <div class="print" style="left:${l}%;top:${t}%;width:${w}%;height:${h}%">
          ${pic}
          <p class="print__top" style="font-size:${fs.toFixed(2)}cqw">${esc(top)}</p>
          ${sub ? `<p class="print__sub">${esc(sub)}</p>` : ""}
        </div>
      </div>`;
  };
})();
