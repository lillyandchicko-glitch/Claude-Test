/* Lilly Merch – Inhalte
   Alles, was sich redaktionell ändert (Sprüche, Preise, Bilder), liegt hier. */

window.LILLY = {
  instagram: "https://www.instagram.com/goldenretriever_lilly/",
  handle: "@goldenretriever lilly",

  // Bilder (Gemini-generiert, gehostet auf ImgBB)
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
    shirt:   { name: "T-Shirt",       price: 34.9, sizes: ["XS","S","M","L","XL","XXL"], colors: ["cream","red","mustard","ink","sky"] },
    hoodie:  { name: "Hoodie",        price: 64.9, sizes: ["S","M","L","XL","XXL"],      colors: ["ink","mustard","red","cream","forest"] },
    cap:     { name: "Dad Cap",       price: 29.9, sizes: ["One Size"],                  colors: ["red","ink","cream","forest"] },
    tote:    { name: "Gassi-Beutel",  price: 24.9, sizes: ["One Size"],                  colors: ["cream","ink","mustard"] },
    mug:     { name: "Tasse",         price: 19.9, sizes: ["330 ml"],                    colors: ["cream","ink","red"] },
    bandana: { name: "Hunde-Bandana", price: 17.9, sizes: ["S","M","L"],                 colors: ["red","mustard","sky","ink"] }
  },

  // Stofffarbe → [Stoff, Druckfarbe]
  colors: {
    cream:   { label: "Creme",       fabric: "#fff1dc", ink: "#e8361e" },
    red:     { label: "Ketchup",     fabric: "#e8361e", ink: "#fff1dc" },
    mustard: { label: "Senf",        fabric: "#ffb81c", ink: "#1b0f0a" },
    ink:     { label: "Nachtschwarz",fabric: "#1b0f0a", ink: "#ffb81c" },
    sky:     { label: "Himmelblau",  fabric: "#9fd3ff", ink: "#1b0f0a" },
    forest:  { label: "Waldgrün",    fabric: "#1f4d3a", ink: "#fff1dc" }
  },

  categories: [
    { id: "all",      label: "Alle" },
    { id: "politik",  label: "Politik" },
    { id: "wirtschaft", label: "Wirtschaft" },
    { id: "zeitgeist",label: "Zeitgeist" },
    { id: "alltag",   label: "Hundealltag" }
  ],

  // Die Kollektion. top = Hauptzeile (groß), sub = Kleingedrucktes.
  designs: [
    { id: "gassi-great",   cat: "politik",    type: "shirt",   color: "red",     top: "Make Gassi Great Again", sub: "Lilly 2026 · Leckerli für alle", badge: "Bestseller" },
    { id: "zoelle",        cat: "wirtschaft", type: "hoodie",  color: "ink",     top: "Ich verhandle nur in Leckerli", sub: "Zölle? Akzeptiere ich nicht.", badge: "Neu" },
    { id: "waermepumpe",   cat: "politik",    type: "shirt",   color: "mustard", top: "Ich bin die Wärmepumpe", sub: "Heizungsgesetz-konform seit Welpe" },
    { id: "sondervermoegen",cat: "wirtschaft",type: "shirt",   color: "cream",   top: "Mein Sondervermögen: 47 Tennisbälle", sub: "Schuldenbremse gilt nicht für Bälle" },
    { id: "eichhoernchen", cat: "politik",    type: "cap",     color: "red",     top: "Schuldenbremse? Ich bremse nur für Eichhörnchen", sub: "" , badge: "Limitiert" },
    { id: "ki-chef",       cat: "zeitgeist",  type: "hoodie",  color: "mustard", top: "KI ersetzt viele Jobs. Meinen nicht.", sub: "Chief Kuschel Officer" },
    { id: "buerokratie",   cat: "politik",    type: "tote",    color: "cream",   top: "Bürokratieabbau: Ich hab den Antrag gefressen", sub: "Formular 27b/6 – war lecker" },
    { id: "rente",         cat: "politik",    type: "shirt",   color: "sky",     top: "In Hundejahren 70. Arbeite noch Vollzeit.", sub: "Rentenpaket: Sofa + Decke" },
    { id: "bahn",          cat: "zeitgeist",  type: "mug",     color: "ink",     top: "Pünktlicher als die Bahn", sub: "Außer beim Gassi. Da bleib ich stehen." },
    { id: "inflation",     cat: "wirtschaft", type: "shirt",   color: "ink",     top: "Inflation trifft mich hart. Napf seit 5 Min leer.", sub: "Verbraucherpreisindex: Leckerli +300 %" },
    { id: "ki-blase",      cat: "wirtschaft", type: "bandana", color: "sky",     top: "KI-Blase? Ich jag nur Seifenblasen", sub: "" },
    { id: "fachkraft",     cat: "wirtschaft", type: "hoodie",  color: "red",     top: "Fachkräftemangel? Ich bin Leckerli-Prüferin", sub: "Staatlich nicht anerkannt" },
    { id: "staubsauger",   cat: "alltag",     type: "shirt",   color: "cream",   top: "Ich hab kein Haarproblem. Du hast ein Staubsaugerproblem.", sub: "", badge: "Bestseller" },
    { id: "tempolimit",    cat: "politik",    type: "shirt",   color: "forest",  top: "Tempolimit gilt nicht für Zoomies", sub: "0 auf 100 in 0,8 Sekunden" },
    { id: "homeoffice",    cat: "zeitgeist",  type: "mug",     color: "cream",   top: "Homeoffice ist nur gut, weil ich die Chefin bin", sub: "Meetings: 22 Stunden Nickerchen" },
    { id: "work-life",     cat: "alltag",     type: "hoodie",  color: "cream",   top: "Work-Life-Balance: 22 h schlafen, 2 h Chaos", sub: "" },
    { id: "koalition",     cat: "politik",    type: "tote",    color: "mustard", top: "Koalitionsvertrag: Ich krieg das Sofa", sub: "Du kriegst die Ecke. Verhandelbar: nein." },
    { id: "bitcoin",       cat: "wirtschaft", type: "cap",     color: "ink",     top: "Bitcoin fällt. Mein Ball fällt.", sub: "Ich hol nur einen davon zurück." },
    { id: "flauschig",     cat: "alltag",     type: "shirt",   color: "mustard", top: "Nicht dick. Flauschig budgetiert.", sub: "" },
    { id: "willkommen",    cat: "alltag",     type: "bandana", color: "red",     top: "Wachhund? Eher Willkommenskomitee", sub: "", badge: "Für Hunde" },
    { id: "mietpreis",     cat: "wirtschaft", type: "shirt",   color: "red",     top: "Mietpreisbremse fürs Körbchen. Jetzt.", sub: "Demo um 15 Uhr am Napf" },
    { id: "deutschlandticket", cat: "zeitgeist", type: "tote", color: "ink",     top: "Deutschlandticket? Ich fahr Kofferraum.", sub: "" },
    { id: "influencer",    cat: "zeitgeist",  type: "hoodie",  color: "forest",  top: "Ich bin nicht verwöhnt. Ich bin Influencerin.", sub: "Kooperationen nur gegen Käse" },
    { id: "nachrichten",   cat: "alltag",     type: "mug",     color: "red",     top: "Nachrichten machen mich müde. Schwanzwedeln hilft.", sub: "" }
  ],

  // Kurze Sprüche für Laufband und Spruch-Automat
  ticker: [
    "Good Girl. Bad Influence.",
    "Haare sind das neue Glitzer",
    "100 % Fellhaftung",
    "Sitz. Platz. Shoppen.",
    "Golden Hour ist meine Uhrzeit",
    "Ich apportiere nur Komplimente",
    "Wedeln ist mein Cardio"
  ],

  // Spruch-Automat: Anfang + Mitte + Ende werden kombiniert
  slot: {
    a: ["Schuldenbremse?", "Die Börse crasht?", "Neue Koalition?", "Inflation?", "KI übernimmt?", "Zölle steigen?", "Bahn verspätet?", "Montag?"],
    b: ["Ich", "Lilly", "Mein Hund", "Die Chefin"],
    c: ["bleibt flauschig.", "will nur Käse.", "hat 47 Bälle gespart.", "wedelt trotzdem.", "liegt auf dem Sofa.", "fordert Leckerli-Grundeinkommen.", "jagt Eichhörnchen.", "macht Zoomies."]
  },

  reviews: [
    { name: "Jana & Bruno", dog: "Labrador", text: "Mein Nachbar hat beim Gassi so gelacht, dass er seinen eigenen Hund vergessen hat.", stars: 5 },
    { name: "Mehmet & Luna", dog: "Golden Retriever", text: "Der Hoodie hält sogar die Haare von Luna. Fast. Okay, nicht wirklich. Aber er ist bequem.", stars: 5 },
    { name: "Sabine & Paul", dog: "Dackel", text: "Die Tasse sorgt im Büro täglich für Diskussionen über Wärmepumpen. Zehn von zehn.", stars: 5 },
    { name: "Tom & Kiwi", dog: "Mischling", text: "Kiwi trägt jetzt das Bandana und ist offiziell arroganter als ich. Danke für nichts.", stars: 5 }
  ]
};
