/* Lilly Merch – Inhalte
   Alles, was sich redaktionell ändert (Sprüche, Preise, Bilder), liegt hier. */

window.LILLY = {
  instagram: "https://www.instagram.com/goldenretriever_lilly/",
  handle: "@goldenretriever lilly",

  // Bilder (Gemini-generiert). Original bei ImgBB; die GitHub Action
  // .github/workflows/lilly-images.yml legt verkleinerte Kopien in assets/img/ ab.
  // Reihenfolge nicht ändern: cutout → cutout.webp, photos[0] → lilly-01.webp usw.
  cutout: "https://i.ibb.co/BVXkFTfc/Projekt-Hintergrund-entfernen-9.png",
  photos: [
    "https://i.ibb.co/xSy4rWXh/Gemini-Generated-Image-2vktt62vktt62vkt-2-2.png",
    "https://i.ibb.co/39KyWfqD/Gemini-Generated-Image-b5cya4b5cya4b5cy-2.png",
    "https://i.ibb.co/LzX3LJCy/Gemini-Generated-Image-ci40m9ci40m9ci40-2.png",
    "https://i.ibb.co/4nfjFcBD/Gemini-Generated-Image-awl45sawl45sawl4-2.png",
    "https://i.ibb.co/zwDZ7XH/Gemini-Generated-Image-904zm7904zm7904z-2.png",
    "https://i.ibb.co/PZB9km9Q/Gemini-Generated-Image-1cm2yg1cm2yg1cm2-2.png",
    "https://i.ibb.co/KxHZyq11/Gemini-Generated-Image-47400d47400d4740.png",
    "https://i.ibb.co/VbnrKqj/unnamed-3.jpg",
    "https://i.ibb.co/6S4XQgz/Generated-Image-May-06-2026-12-38-PM.jpg",
    "https://i.ibb.co/20P5vBy8/Generated-Image-May-04-2026-2-03-PM.jpg",
    "https://i.ibb.co/B2YFsDWx/Generated-Image-May-04-2026-1-19-PM.jpg",
    "https://i.ibb.co/JRqbxyDW/Generated-Image-May-03-2026-6-48-PM-2.png",
    "https://i.ibb.co/4wpVyMnP/Generated-Image-May-04-2026-11-14-AM-11.jpg",
    "https://i.ibb.co/Qj302z82/Generated-Image-May-04-2026-11-14-AM-4.jpg",
    "https://i.ibb.co/DPwkP64k/Generated-Image-May-04-2026-11-14-AM-5.jpg",
    "https://i.ibb.co/wZjp4Jmm/Generated-Image-May-04-2026-11-14-AM-7.jpg",
    "https://i.ibb.co/rRKbnbtJ/Generated-Image-May-03-2026-2-31-PM-2.jpg",
    "https://i.ibb.co/WXLnzc1/Generated-Image-May-03-2026-7-24-PM.jpg",
    "https://i.ibb.co/WN2rZC5w/Generated-Image-May-03-2026-6-48-PM-4.jpg",
    "https://i.ibb.co/nqXmCMHK/Generated-Image-May-03-2026-6-48-PM-2.jpg"
  ],

  // Produktarten: Preis in Euro, verfügbare Farben, Größen
  types: {
    shirt:   { name: "T-Shirt",        price: 34.9, sizes: ["XS","S","M","L","XL","XXL"], colors: ["cream","red","mustard","ink","sky"] },
    hoodie:  { name: "Hoodie",         price: 64.9, sizes: ["S","M","L","XL","XXL"],      colors: ["ink","mustard","red","cream","forest"] },
    poster:  { name: "Wahlplakat",     price: 29.9, sizes: ["A3","A2","A1"],              colors: ["cream","red","mustard","sky"] },
    cap:     { name: "Dad Cap",        price: 29.9, sizes: ["One Size"],                  colors: ["red","ink","cream","forest"] },
    tote:    { name: "Gassi-Beutel",   price: 24.9, sizes: ["One Size"],                  colors: ["cream","ink","mustard"] },
    mug:     { name: "Tasse",          price: 19.9, sizes: ["330 ml"],                    colors: ["cream","ink","red"] },
    bandana: { name: "Hunde-Bandana",  price: 17.9, sizes: ["S","M","L"],                 colors: ["red","mustard","sky","ink"] }
  },
  photoSurcharge: 5, // Aufpreis für Foto-Druck

  // Stofffarbe → Stoff + Druckfarbe
  colors: {
    cream:   { label: "Creme",        fabric: "#fff1dc", ink: "#e8361e" },
    red:     { label: "Ketchup",      fabric: "#e8361e", ink: "#fff1dc" },
    mustard: { label: "Senf",         fabric: "#ffb81c", ink: "#1b0f0a" },
    ink:     { label: "Nachtschwarz", fabric: "#1b0f0a", ink: "#ffb81c" },
    sky:     { label: "Himmelblau",   fabric: "#9fd3ff", ink: "#1b0f0a" },
    forest:  { label: "Waldgrün",     fabric: "#1f4d3a", ink: "#fff1dc" }
  },

  categories: [
    { id: "all",        label: "Alle" },
    { id: "kanzleramt", label: "Kanzleramt & Umfragen" },
    { id: "politik",    label: "Politik" },
    { id: "wirtschaft", label: "Wirtschaft" },
    { id: "zeitgeist",  label: "Zeitgeist" },
    { id: "alltag",     label: "Hundealltag" }
  ],

  // Die Kollektion. top = Hauptzeile, sub = Kleingedrucktes, photo = Index in photos (optional)
  // Leitlinie: sarkastisch über Politikbetrieb, Umfragen und Weltlage – nie über einzelne Menschen herziehen.
  designs: [
    // Kanzleramt & Umfragen
    { id: "kanzlerin",       cat: "kanzleramt", type: "poster",  color: "cream",   top: "Lilly for Kanzlerin", sub: "Programm: Leckerli. Sofa. Fertig.", photo: 8, badge: "Wahlkampf" },
    { id: "ruecktritt",      cat: "kanzleramt", type: "hoodie",  color: "ink",     top: "Ich trete nicht zurück. Ich leg mich hin.", sub: "Pressekonferenz beendet", badge: "Neu" },
    { id: "beliebter",       cat: "kanzleramt", type: "shirt",   color: "red",     top: "Beliebter als jede Regierung", sub: "Ich sag einfach nichts und wedel.", badge: "Bestseller" },
    { id: "umfragetief",     cat: "kanzleramt", type: "shirt",   color: "mustard", top: "Umfragetief? Ich lieg freiwillig flach.", sub: "Zustimmung am Napf: 100 %" },
    { id: "deutschlandtrend",cat: "kanzleramt", type: "tote",    color: "mustard", top: "94 % wollen mich streicheln", sub: "Die anderen 6 % lügen. (Lilly-Trend, Okt. 2026)" },
    { id: "vertrauensfrage", cat: "kanzleramt", type: "cap",     color: "red",     top: "Vertrauensfrage? Ich vertrau jedem mit Wurst.", sub: "" },
    { id: "koalitionsausschuss", cat: "kanzleramt", type: "mug", color: "cream",   top: "Koalitionsausschuss bis 3 Uhr? Ich: Sofa. Geklärt.", sub: "Ergebnisprotokoll: wurde gefressen" },
    { id: "regierungserklaerung", cat: "kanzleramt", type: "shirt", color: "ink",  top: "Regierungserklärung: Ich hab Hunger.", sub: "Weitere Fragen? Nein." },
    { id: "herbst-reformen", cat: "kanzleramt", type: "hoodie",  color: "mustard", top: "Herbst der Reformen: Körbchen umgestellt", sub: "Reicht für dieses Jahr." },
    { id: "sommerinterview", cat: "kanzleramt", type: "bandana", color: "sky",     top: "Sommerinterview? Ich mach Sommerschlaf.", sub: "" },
    { id: "wahlplakat",      cat: "kanzleramt", type: "poster",  color: "red",     top: "Ich verspreche nichts. Außer Liebe.", sub: "Die einzige Kandidatin ohne Skandal", photo: 11 },

    // Politik
    { id: "gassi-great",     cat: "politik",    type: "shirt",   color: "red",     top: "Make Gassi Great Again", sub: "Lilly 2026 · Leckerli für alle", badge: "Bestseller" },
    { id: "wehrdienst",      cat: "politik",    type: "hoodie",  color: "forest",  top: "Wehrdienst? Ich verteidige nur den Kühlschrank.", sub: "Freiwillig. Rund um die Uhr." },
    { id: "eichhoernchen",   cat: "politik",    type: "cap",     color: "ink",     top: "Schuldenbremse? Ich bremse nur für Eichhörnchen", sub: "", badge: "Limitiert" },
    { id: "buerokratie",     cat: "politik",    type: "tote",    color: "cream",   top: "Bürokratieabbau: Ich hab den Antrag gefressen", sub: "Formular 27b/6 – war lecker" },
    { id: "rente",           cat: "politik",    type: "shirt",   color: "sky",     top: "In Hundejahren 70. Arbeite noch Vollzeit.", sub: "Rentenkommission, ruft mich an." },
    { id: "waermepumpe",     cat: "politik",    type: "shirt",   color: "mustard", top: "Ich bin die Wärmepumpe", sub: "Heizungsgesetz-konform seit Welpe" },
    { id: "grundsicherung",  cat: "politik",    type: "shirt",   color: "cream",   top: "Meine Grundsicherung: ein voller Napf", sub: "Nicht verhandelbar." },

    // Wirtschaft
    { id: "zoelle",          cat: "wirtschaft", type: "hoodie",  color: "ink",     top: "Ich verhandle nur in Leckerli", sub: "Zölle? Akzeptiere ich nicht." },
    { id: "wachstum",        cat: "wirtschaft", type: "shirt",   color: "mustard", top: "Mein Fell ist das Einzige, was hier noch wächst", sub: "Wachstumsprognose Haare: +300 %", badge: "Neu" },
    { id: "steuer",          cat: "wirtschaft", type: "mug",     color: "red",     top: "Steuererklärung? Hat der Hund gefressen. Wirklich.", sub: "" },
    { id: "elster",          cat: "wirtschaft", type: "cap",     color: "cream",   top: "ELSTER? Ich jag nur echte.", sub: "" },
    { id: "sondervermoegen", cat: "wirtschaft", type: "shirt",   color: "cream",   top: "Mein Sondervermögen: 47 Tennisbälle", sub: "Schuldenbremse gilt nicht für Bälle" },
    { id: "bitcoin",         cat: "wirtschaft", type: "cap",     color: "red",     top: "Bitcoin fällt. Mein Ball fällt.", sub: "Ich hol nur einen davon zurück." },
    { id: "fachkraft",       cat: "wirtschaft", type: "hoodie",  color: "red",     top: "Fachkräftemangel? Ich bin Leckerli-Prüferin", sub: "Staatlich nicht anerkannt" },

    // Zeitgeist
    { id: "ki-chef",         cat: "zeitgeist",  type: "hoodie",  color: "cream",   top: "KI ersetzt viele Jobs. Meinen nicht.", sub: "Chief Kuschel Officer" },
    { id: "bahn",            cat: "zeitgeist",  type: "mug",     color: "ink",     top: "Pünktlicher als die Bahn", sub: "Außer beim Gassi. Da bleib ich stehen." },
    { id: "deutschlandticket", cat: "zeitgeist", type: "tote",   color: "ink",     top: "Deutschlandticket teurer? Ich fahr Kofferraum.", sub: "" },
    { id: "bildschirmzeit",  cat: "zeitgeist",  type: "shirt",   color: "sky",     top: "Bildschirmzeit: 0. Kuschelzeit: alles.", sub: "" },
    { id: "influencer",      cat: "zeitgeist",  type: "hoodie",  color: "forest",  top: "Ich bin nicht verwöhnt. Ich bin Influencerin.", sub: "Kooperationen nur gegen Käse", photo: 0 },
    { id: "ki-blase",        cat: "zeitgeist",  type: "bandana", color: "mustard", top: "KI-Blase? Ich jag nur Seifenblasen", sub: "" },

    // Hundealltag
    { id: "staubsauger",     cat: "alltag",     type: "shirt",   color: "cream",   top: "Ich hab kein Haarproblem. Du hast ein Staubsaugerproblem.", sub: "", badge: "Bestseller" },
    { id: "flauschig",       cat: "alltag",     type: "shirt",   color: "red",     top: "Nicht dick. Flauschig budgetiert.", sub: "", photo: 3 },
    { id: "willkommen",      cat: "alltag",     type: "bandana", color: "red",     top: "Wachhund? Eher Willkommenskomitee", sub: "", badge: "Für Hunde" },
    { id: "work-life",       cat: "alltag",     type: "mug",     color: "cream",   top: "Work-Life-Balance: 22 h schlafen, 2 h Chaos", sub: "" }
  ],

  // Kurze Sprüche für das Laufband
  ticker: [
    "Good Girl. Bad Influence.",
    "Umfragewerte: 100 % Wedeln",
    "Kein Rücktritt, nur Hinlegen",
    "Haare sind das neue Glitzer",
    "Sitz. Platz. Shoppen.",
    "Koalition mit dem Sofa steht",
    "Wedeln ist mein Cardio"
  ],

  // Spruch-Automat: Anfang + Mitte + Ende
  slot: {
    a: ["Umfragetief?", "Koalitionskrach?", "Herbst der Reformen?", "Rentenstreit?", "Zölle steigen?", "Wachstum bei 0,0 %?", "KI übernimmt?", "Bahn verspätet?", "Sondersitzung?", "Montag?"],
    b: ["Ich", "Lilly", "Die Kanzlerin der Herzen", "Mein Hund", "Die Chefin"],
    c: ["bleibt flauschig.", "will nur Käse.", "wedelt trotzdem.", "legt sich einfach hin.", "liegt im Umfragehoch.", "fordert Leckerli-Grundeinkommen.", "jagt Eichhörnchen.", "macht Zoomies.", "vertagt alles auf nach dem Nickerchen."]
  },

  // Lilly-Trend: Umfrage-Parodie. base = Startstimmen
  poll: {
    question: "Wenn am Sonntag Gassi-Wahl wäre …",
    options: [
      { id: "lilly",  label: "Lilly als Kanzlerin",            base: 612 },
      { id: "nap",    label: "Erst mal ein Nickerchen",          base: 233 },
      { id: "sofa",   label: "Große Koalition: Sofa + Decke",    base: 154 },
      { id: "cheese", label: "Weiß nicht, hab Käse gesehen",     base: 81 }
    ],
    footnote: "Befragt: 1.080 Hunde und 3 Katzen (ungültig). Fehlertoleranz ± 1 Leckerli."
  },

  reviews: [
    { name: "Jana & Bruno", dog: "Labrador", text: "Mein Nachbar hat beim Gassi so gelacht, dass er seinen eigenen Hund vergessen hat.", stars: 5 },
    { name: "Mehmet & Luna", dog: "Golden Retriever", text: "Seit ich das Rücktritt-Hoodie trage, legen sich im Büro alle hin. Produktivität: egal. Stimmung: top.", stars: 5 },
    { name: "Sabine & Paul", dog: "Dackel", text: "Das Wahlplakat hängt im Flur. Mein Mann hat schon zweimal unterschrieben.", stars: 5 },
    { name: "Tom & Kiwi", dog: "Mischling", text: "Kiwi trägt jetzt das Bandana und ist offiziell arroganter als ich. Danke für nichts.", stars: 5 }
  ]
};

// Bildquelle: zuerst die lokale WebP-Kopie, bei Fehler das Original bei ImgBB.
// i = Index in photos oder "cutout"
window.LILLY.img = function (i) {
  const L = window.LILLY;
  if (i === "cutout") return { src: "assets/img/cutout.webp", fallback: L.cutout };
  return { src: "assets/img/lilly-" + String(i + 1).padStart(2, "0") + ".webp", fallback: L.photos[i] };
};
