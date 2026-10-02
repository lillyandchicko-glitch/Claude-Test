/* Automatisches Freistellen im Browser (nichts wird hochgeladen).
   1. DeepLab v3 findet den Hund (Klasse „dog“, zur Not „cat“) und dessen Mitte.
   2. Magic Touch schneidet ab diesem Punkt das Tier sauber aus.
   Beide Modelle: MediaPipe, Apache-2.0, lokal unter assets/vendor/mediapipe. */
import { FilesetResolver, ImageSegmenter, InteractiveSegmenterLegacy } from "../vendor/mediapipe/vision_bundle.mjs";

const BASE = new URL("../vendor/mediapipe/", import.meta.url).href;
const MAX = 1024;          // längste Bildseite für die Verarbeitung
const DOG = 12, CAT = 8;   // Pascal-VOC-Klassen in DeepLab v3

let ready = null;
function load() {
  if (!ready) {
    ready = (async () => {
      const files = await FilesetResolver.forVisionTasks(BASE + "wasm");
      const [finder, cutter] = await Promise.all([
        ImageSegmenter.createFromOptions(files, {
          baseOptions: { modelAssetPath: BASE + "deeplab_v3.tflite" },
          runningMode: "IMAGE", outputConfidenceMasks: true, outputCategoryMask: false
        }),
        InteractiveSegmenterLegacy.createFromOptions(files, {
          baseOptions: { modelAssetPath: BASE + "magic_touch.tflite" },
          outputConfidenceMasks: true, outputCategoryMask: false
        })
      ]);
      return { finder, cutter };
    })();
    ready.catch(() => { ready = null; });
  }
  return ready;
}

// Bild in eine Canvas mit maximal MAX px laden
async function toCanvas(file) {
  const bmp = await createImageBitmap(file, { imageOrientation: "from-image" });
  const k = Math.min(1, MAX / Math.max(bmp.width, bmp.height));
  const c = document.createElement("canvas");
  c.width = Math.round(bmp.width * k);
  c.height = Math.round(bmp.height * k);
  c.getContext("2d").drawImage(bmp, 0, 0, c.width, c.height);
  bmp.close && bmp.close();
  return c;
}

// Maske (beliebige Auflösung) auf Bildgröße skalieren → Float32Array
function scaleMask(mask, w, h) {
  const src = mask.getAsFloat32Array(), mw = mask.width, mh = mask.height;
  if (mw === w && mh === h) return Float32Array.from(src);
  const out = new Float32Array(w * h);
  for (let y = 0; y < h; y++) {
    const sy = Math.min(mh - 1, (y + .5) * mh / h - .5), y0 = Math.max(0, Math.floor(sy)), y1 = Math.min(mh - 1, y0 + 1), fy = Math.max(0, sy - y0);
    for (let x = 0; x < w; x++) {
      const sx = Math.min(mw - 1, (x + .5) * mw / w - .5), x0 = Math.max(0, Math.floor(sx)), x1 = Math.min(mw - 1, x0 + 1), fx = Math.max(0, sx - x0);
      const a = src[y0 * mw + x0] * (1 - fx) + src[y0 * mw + x1] * fx;
      const b = src[y1 * mw + x0] * (1 - fx) + src[y1 * mw + x1] * fx;
      out[y * w + x] = a * (1 - fy) + b * fy;
    }
  }
  return out;
}

// Punkte auf dem Tier verteilen (bis zu 16) → Hinweis für Magic Touch
function seedPoints(m, w, h) {
  const pts = [], G = 4;
  for (let gy = 0; gy < G; gy++) for (let gx = 0; gx < G; gx++) {
    let best = .6, bx = -1, by = -1;
    for (let y = Math.floor(gy * h / G); y < Math.floor((gy + 1) * h / G); y += 3)
      for (let x = Math.floor(gx * w / G); x < Math.floor((gx + 1) * w / G); x += 3) {
        const v = m[y * w + x];
        if (v > best) { best = v; bx = x; by = y; }
      }
    if (bx >= 0) pts.push({ x: bx / w, y: by / h });
  }
  return pts;
}

// Nur zusammenhängende Flächen behalten, die groß genug sind (entfernt Bildreste)
function keepMainParts(alpha, w, h) {
  const label = new Int32Array(w * h), sizes = [0], queue = new Int32Array(w * h);
  for (let i = 0; i < w * h; i++) {
    if (alpha[i] < 64 || label[i]) continue;
    const id = sizes.length; let head = 0, tail = 0, n = 0;
    queue[tail++] = i; label[i] = id;
    while (head < tail) {
      const p = queue[head++]; n++;
      const x = p % w, y = (p / w) | 0;
      if (x > 0 && !label[p - 1] && alpha[p - 1] >= 64) { label[p - 1] = id; queue[tail++] = p - 1; }
      if (x < w - 1 && !label[p + 1] && alpha[p + 1] >= 64) { label[p + 1] = id; queue[tail++] = p + 1; }
      if (y > 0 && !label[p - w] && alpha[p - w] >= 64) { label[p - w] = id; queue[tail++] = p - w; }
      if (y < h - 1 && !label[p + w] && alpha[p + w] >= 64) { label[p + w] = id; queue[tail++] = p + w; }
    }
    sizes.push(n);
  }
  const biggest = Math.max(...sizes);
  if (!biggest) return;
  // weiche Randpixel gehören zur nächsten Fläche: einmal um 2 px „wachsen“ lassen
  const keep = sizes.map((n) => n >= biggest * .18);
  const ok = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) if (label[i] && keep[label[i]]) ok[i] = 1;
  for (let pass = 0; pass < 2; pass++) {
    const prev = ok.slice();
    for (let i = 0; i < w * h; i++) if (!prev[i]) {
      const x = i % w;
      if ((x > 0 && prev[i - 1]) || (x < w - 1 && prev[i + 1]) || (i >= w && prev[i - w]) || (i < w * (h - 1) && prev[i + w])) ok[i] = 1;
    }
  }
  for (let i = 0; i < w * h; i++) if (!ok[i]) alpha[i] = 0;
}

function softAlpha(v) {
  v = Math.min(1, Math.max(0, (v - .3) / .4));
  return v * v * (3 - 2 * v) * 255;
}

// Aus Originalbild + Alpha das zugeschnittene PNG bauen
function render(src, alpha, w, h) {
  let minX = w, minY = h, maxX = 0, maxY = 0;
  for (let i = 0; i < w * h; i++) if (alpha[i] > 25) {
    const x = i % w, y = (i / w) | 0;
    if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y;
  }
  if (maxX <= minX || maxY <= minY) throw new Error("Kein Tier gefunden");
  const data = new ImageData(new Uint8ClampedArray(src.data), w, h);
  for (let i = 0; i < w * h; i++) data.data[i * 4 + 3] = alpha[i];
  const full = document.createElement("canvas");
  full.width = w; full.height = h;
  full.getContext("2d").putImageData(data, 0, 0);
  const pad = Math.round(Math.max(w, h) * .02);
  minX = Math.max(0, minX - pad); minY = Math.max(0, minY - pad);
  maxX = Math.min(w - 1, maxX + pad); maxY = Math.min(h - 1, maxY + pad);
  const out = document.createElement("canvas");
  out.width = maxX - minX + 1; out.height = maxY - minY + 1;
  out.getContext("2d").drawImage(full, minX, minY, out.width, out.height, 0, 0, out.width, out.height);
  return { url: out.toDataURL("image/png"), width: out.width, height: out.height };
}

/**
 * Stellt das Tier auf dem Foto frei.
 * @param {File|Blob} file
 * @param {(step:string)=>void} [onStep] Fortschritt für die Oberfläche
 * @returns {Promise<{url, width, height, found, preview, tap(x,y)}>}
 *   preview: Originalbild (für „tipp auf deinen Hund“)
 *   tap(x,y): normierte Koordinate im Original → Fläche dort hinzufügen, liefert neues Ergebnis
 */
export async function cutout(file, onStep = () => {}) {
  onStep("load");
  const [models, img] = await Promise.all([load(), toCanvas(file)]);
  const { finder, cutter } = models;
  const w = img.width, h = img.height;
  const src = img.getContext("2d").getImageData(0, 0, w, h);

  onStep("find");
  const res = finder.segment(img);
  const masks = res.confidenceMasks;
  const dog = scaleMask(masks[DOG], w, h), cat = scaleMask(masks[CAT], w, h);
  masks.forEach((m) => m.close());
  const animal = dog.map((v, i) => Math.max(v, cat[i]));
  const seeds = seedPoints(animal, w, h);
  const found = seeds.length > 0;

  const alpha = new Uint8ClampedArray(w * h);
  const magic = (roi) => {
    const r = cutter.segment(img, roi);
    const m = scaleMask(r.confidenceMasks[r.confidenceMasks.length - 1], w, h);
    r.confidenceMasks.forEach((x) => x.close());
    return m;
  };

  onStep("cut");
  if (found) {
    const fine = magic({ scribble: seeds });
    // Magic Touch für saubere Kanten, DeepLab als Sicherheitsnetz gegen Hintergrund
    for (let i = 0; i < w * h; i++) alpha[i] = softAlpha(Math.max(fine[i] * Math.min(1, animal[i] * 3 + .1), animal[i] * .9));
    keepMainParts(alpha, w, h);
  }
  const preview = img.toDataURL("image/jpeg", .85);

  const result = (base) => Object.assign(base, {
    found, preview,
    // Nutzer tippt auf eine Stelle des Tiers → diese Fläche kommt dazu
    // (replace: Auswahl neu beginnen, z. B. „genau diesen Hund“)
    tap(x, y, replace = false) {
      const m = magic({ keypoint: { x, y } });
      if (replace) alpha.fill(0);
      for (let i = 0; i < w * h; i++) alpha[i] = Math.max(alpha[i], softAlpha(m[i]));
      keepMainParts(alpha, w, h);
      return result(render(src, alpha, w, h));
    }
  });

  onStep("done");
  if (!found) return result({ url: null, width: w, height: h });
  return result(render(src, alpha, w, h));
}

// Modelle schon mal im Hintergrund laden (z. B. wenn der Upload-Bereich sichtbar wird)
export function warmup() { return load().catch(() => {}); }
