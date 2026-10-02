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

  // Die Hunde: Lilly ist die Helle, Toffee die Dunkle (Rote).
  // photos[0–5] sind freigestellt (transparenter Hintergrund) → ideal für den Druck
  cutouts: [0, 1, 2, 3, 4, 5],
  // Bildunterschriften in der Galerie (gleiche Reihenfolge wie photos)
  captions: [
    "Lilly posiert fürs Wahlplakat", "Lilly, zweiter Versuch", "Toffee leitet das Wahlkampfteam",
    "Toffee hört der Regierung zu", "Toffee hat eine Rückfrage", "Koalitionsverhandlungen, Tag 3",
    "Bürgersprechstunde mit Lilly & Toffee", "Toffees Infrastrukturprojekt im Stadtpark", "Toffee verhandelt um Kuchen. Lilly schläft.",
    "Toffee protestiert, Lilly sitzt es aus", "Lauschen am Koalitionsausschuss", "Die Doppelspitze",
    "Lilly im Umfragetief, freiwillig", "Toffee: Schlammschlacht. Lilly: bleibt sauber.", "Ressortverteilung: Toffee Socken, Lilly Schuhe",
    "Dienstwagen, Fenster unten", "Offizielles Pressefoto der Doppelspitze", "Lilly tritt nicht zurück. Liegt.",
    "Haushaltsdebatte: Toffee prüft den Müll", "Beide haben Käse gesehen"
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
    { id: "zitate",     label: "Berühmte Worte" },
    { id: "haltung",    label: "Haltung" },
    { id: "doppelspitze", label: "Lilly & Toffee" },
    { id: "herz",       label: "Herz & Fell" },
    { id: "politik",    label: "Politik" },
    { id: "wirtschaft", label: "Wirtschaft" },
    { id: "zeitgeist",  label: "Zeitgeist" },
    { id: "alltag",     label: "Hundealltag" }
  ],

  // Die Kollektion. top = Hauptzeile, sub = Kleingedrucktes, photo = Index in photos (optional)
  // Leitlinie: sarkastisch über Politikbetrieb, Umfragen und Weltlage – nie über einzelne Menschen herziehen.
  designs: [
    // Kanzleramt & Umfragen
    { id: "kanzlerin",       cat: "kanzleramt", type: "poster",  color: "cream",   top: "Lilly for Kanzlerin", sub: "Programm: Leckerli. Sofa. Fertig.", photo: 0, badge: "Wahlkampf" },
    { id: "ruecktritt",      cat: "kanzleramt", type: "hoodie",  color: "ink",     top: "Ich trete nicht zurück. Ich leg mich hin.", sub: "Pressekonferenz beendet", badge: "Neu" },
    { id: "beliebter",       cat: "kanzleramt", type: "shirt",   color: "red",     top: "Beliebter als jede Regierung", sub: "Ich sag einfach nichts und wedle.", badge: "Bestseller" },
    { id: "umfragetief",     cat: "kanzleramt", type: "shirt",   color: "mustard", top: "Umfragetief? Ich lieg freiwillig flach.", sub: "Zustimmung am Napf: 100 %", photo: "cutout" },
    { id: "deutschlandtrend",cat: "kanzleramt", type: "tote",    color: "mustard", top: "94 % wollen mich streicheln", sub: "Die anderen 6 % lügen. (Lilly-Trend, Okt. 2026)" },
    { id: "vertrauensfrage", cat: "kanzleramt", type: "cap",     color: "red",     top: "Vertrauensfrage? Ich vertrau jedem mit Wurst.", sub: "" },
    { id: "koalitionsausschuss", cat: "kanzleramt", type: "mug", color: "cream",   top: "Koalitionsausschuss bis 3 Uhr? Ich: Sofa. Geklärt.", sub: "Ergebnisprotokoll: wurde gefressen", photo: 5 },
    { id: "regierungserklaerung", cat: "kanzleramt", type: "shirt", color: "ink",  top: "Regierungserklärung: Ich hab Hunger.", sub: "Weitere Fragen? Nein." },
    { id: "herbst-reformen", cat: "kanzleramt", type: "hoodie",  color: "mustard", top: "Herbst der Reformen: Körbchen umgestellt", sub: "Reicht für dieses Jahr." },
    { id: "sommerinterview", cat: "kanzleramt", type: "bandana", color: "sky",     top: "Sommerinterview? Ich mach Sommerschlaf.", sub: "" },
    { id: "wahlplakat",      cat: "kanzleramt", type: "poster",  color: "red",     top: "Ich verspreche nichts. Außer Liebe.", sub: "Die Doppelspitze ohne Skandal", photo: 16 },

    // Berühmte Worte – frei nach bekannten Zitaten, ohne Namen
    { id: "little-bit",      cat: "zitate", type: "shirt",   color: "red",     top: "I hope we have a little bit Leckerli.", sub: "Frei nach einem großen Fußballphilosophen", badge: "Neu" },
    { id: "habe-fertig",     cat: "zitate", type: "shirt",   color: "ink",     top: "Ich habe fertig!", sub: "Napf leer.", photo: 12 },
    { id: "was-erlauben",    cat: "zitate", type: "mug",     color: "red",     top: "Was erlauben Staubsauger?!", sub: "Frei nach einem italienischen Trainer" },
    { id: "visionen",        cat: "zitate", type: "tote",    color: "cream",   top: "Wer Visionen hat, sollte zum Tierarzt gehen.", sub: "Frei nach einem Hamburger Altkanzler" },
    { id: "schaffen-das",    cat: "zitate", type: "hoodie",  color: "mustard", top: "Wir schaffen das. Den ganzen Napf.", sub: "", photo: 11 },
    { id: "neuland",         cat: "zitate", type: "shirt",   color: "sky",     top: "Der Garten ist für uns alle Neuland.", sub: "Frei nach einer Kanzlerin, 2013" },
    { id: "doppelwumms",     cat: "zitate", type: "cap",     color: "mustard", top: "Doppelwumms: zwei Leckerli auf einmal", sub: "" },
    { id: "mailand-madrid",  cat: "zitate", type: "shirt",   color: "cream",   top: "Napf oder Schüssel – Hauptsache Futter.", sub: "Frei nach: Mailand oder Madrid" },
    { id: "sitz-oder-nicht", cat: "zitate", type: "poster",  color: "cream",   top: "Sitz oder nicht Sitz, das ist hier die Frage.", sub: "Hundlet, 3. Akt", photo: 1 },
    { id: "bettel-also",     cat: "zitate", type: "mug",     color: "cream",   top: "Ich bettle, also bin ich.", sub: "Frei nach einem französischen Denker", photo: 8 },
    { id: "veni-vidi",       cat: "zitate", type: "shirt",   color: "mustard", top: "Veni, vidi, Wurst.", sub: "" },
    { id: "gestreichelt",    cat: "zitate", type: "hoodie",  color: "ink",     top: "Gestreichelt, nicht gerührt.", sub: "Agentin 00-Wuff" },
    { id: "fluffy-one",      cat: "zitate", type: "shirt",   color: "red",     top: "I'm the fluffy one.", sub: "Frei nach einem Trainer mit sehr weißen Zähnen", photo: 0 },
    { id: "kein-leckerli",   cat: "zitate", type: "tote",    color: "ink",     top: "Ich habe heute leider kein Leckerli für dich.", sub: "Toffee, Jury-Vorsitz", photo: 4 },
    { id: "unendlich",       cat: "zitate", type: "shirt",   color: "ink",     top: "Zwei Dinge sind unendlich: das Universum und mein Hunger.", sub: "" },
    { id: "armer-hund",      cat: "zitate", type: "poster",  color: "mustard", top: "Da sitz ich nun, ich armer Hund, und bin so hungrig als wie zuvor.", sub: "Faust, Teil Napf", photo: 3 },
    { id: "wir-brauchen",    cat: "zitate", type: "hoodie",  color: "red",     top: "Leckerli! Wir brauchen Leckerli!", sub: "Frei nach einem Torwart-Titan" },
    { id: "schaun-mer-mal",  cat: "zitate", type: "cap",     color: "cream",   top: "Schau'n mer mal, ob's Leckerli gibt.", sub: "" },
    { id: "ill-be-back",     cat: "zitate", type: "bandana", color: "ink",     top: "I'll be back. Mit Stöckchen.", sub: "" },
    { id: "kleiner-schritt", cat: "zitate", type: "shirt",   color: "sky",     top: "Ein kleiner Schritt für den Menschen, ein großer Sprung aufs Sofa.", sub: "" },

    // Haltung – zur Brandmauer- und Extremismus-Debatte. Klar in der Sache, ohne Menschen herabzusetzen.
    { id: "kamingitter",     cat: "haltung", type: "shirt",  color: "ink",     top: "Die einzige Brandmauer, die ich kenne: das Kamingitter.", sub: "Feuerfest. Wie meine Werte.", badge: "Haltung" },
    { id: "hass-apportier",  cat: "haltung", type: "hoodie", color: "red",     top: "Hass apportier ich nicht.", sub: "Nur Bälle. Und Liebe.", photo: 2 },
    { id: "pfotenbreit",     cat: "haltung", type: "shirt",  color: "mustard", top: "Kein Pfotenbreit dem Hass.", sub: "Wedeln statt Hetzen" },
    { id: "rudel-bunt",      cat: "haltung", type: "tote",   color: "cream",   top: "Mein Rudel ist bunt.", sub: "Hell, dunkel, Mischling – alle willkommen.", photo: 5 },
    { id: "herkunft-egal",   cat: "haltung", type: "bandana", color: "sky",    top: "Ich schnüffle an allen. Herkunft egal.", sub: "" },
    { id: "wahlprogramm",    cat: "haltung", type: "shirt",  color: "cream",   top: "Ich mag alle Menschen. Das ist mein ganzes Wahlprogramm.", sub: "Golden Retriever, parteilos", photo: 0 },
    { id: "sofaverbot",      cat: "haltung", type: "mug",    color: "ink",     top: "Verbotsverfahren? Ich kenn nur Sofaverbot.", sub: "Ich halt mich trotzdem nicht dran." },

    // Herz & Fell – die schönen Sachen
    { id: "therapeut",       cat: "herz", type: "shirt",   color: "cream",   top: "Mein Therapeut hat vier Pfoten.", sub: "Und nimmt nur Leckerli.", photo: 16, badge: "Neu" },
    { id: "nasser-hund",     cat: "herz", type: "mug",     color: "cream",   top: "Glück riecht nach nassem Hund.", sub: "", photo: 13 },
    { id: "socken",          cat: "herz", type: "hoodie",  color: "cream",   top: "Zuhause ist, wo jemand auf deinen Socken schläft.", sub: "", photo: 14 },
    { id: "kalte-schnauze",  cat: "herz", type: "shirt",   color: "sky",     top: "Der beste Tag beginnt mit einer kalten Schnauze.", sub: "" },
    { id: "glitzer",         cat: "herz", type: "shirt",   color: "ink",     top: "Hundehaare sind mein Glitzer.", sub: "", badge: "Bestseller" },
    { id: "trotzdem-toll",   cat: "herz", type: "tote",    color: "mustard", top: "Ich bin nicht perfekt. Mein Hund findet mich trotzdem toll.", sub: "" },
    { id: "glueck-kaufen",   cat: "herz", type: "poster",  color: "sky",     top: "Geld kauft kein Glück. Aber Leckerli. Fast dasselbe.", sub: "", photo: 19 },

    // Lilly & Toffee
    { id: "doppelspitze",    cat: "doppelspitze", type: "shirt", color: "cream",   top: "Doppelspitze: Lilly regiert, Toffee randaliert.", sub: "Koalitionsvertrag liegt im Körbchen", photo: 5, badge: "Neu" },
    { id: "team-lilly",      cat: "doppelspitze", type: "shirt", color: "sky",     top: "Team Lilly", sub: "Ruhe, Fell und Würde", photo: 0 },
    { id: "team-toffee",     cat: "doppelspitze", type: "shirt", color: "mustard", top: "Team Toffee", sub: "Chaos mit Stammbaum", photo: 3 },
    { id: "opposition",      cat: "doppelspitze", type: "hoodie", color: "ink",    top: "Toffee ist nicht frech. Toffee ist Opposition.", sub: "Fraktionsstärke: 1 Hund, 4 Pfoten", photo: 2 },
    { id: "grosse-koalition",cat: "doppelspitze", type: "tote",  color: "cream",   top: "Große Koalition: Hell + Dunkel", sub: "Einig nur beim Futter", photo: 5 },
    { id: "toffee-wars",     cat: "doppelspitze", type: "bandana", color: "red",   top: "Toffee war's.", sub: "", badge: "Für Hunde" },
    { id: "lilly-wars-nicht",cat: "doppelspitze", type: "bandana", color: "sky",   top: "Ich war's nicht. Frag Toffee.", sub: "" },
    { id: "haushaltsdebatte",cat: "doppelspitze", type: "mug",   color: "ink",     top: "Haushaltsdebatte? Toffee hat den Müll schon geprüft.", sub: "Ergebnis: lecker" },
    { id: "pressefoto",      cat: "doppelspitze", type: "poster", color: "mustard", top: "Lilly & Toffee 2026", sub: "Gemeinsam gegen Staubsauger", photo: 16 },

    // Politik
    { id: "gassi-great",     cat: "politik",    type: "shirt",   color: "red",     top: "Make Gassi Great Again", sub: "Lilly 2026 · Leckerli für alle", badge: "Bestseller" },
    { id: "wehrdienst",      cat: "politik",    type: "hoodie",  color: "forest",  top: "Wehrdienst? Ich verteidige nur den Kühlschrank.", sub: "Freiwillig. Rund um die Uhr." },
    { id: "eichhoernchen",   cat: "politik",    type: "cap",     color: "ink",     top: "Schuldenbremse? Ich bremse nur für Eichhörnchen", sub: "", badge: "Limitiert" },
    { id: "buerokratie",     cat: "politik",    type: "tote",    color: "cream",   top: "Bürokratieabbau: Ich hab den Antrag gefressen", sub: "Formular 27b/6 – war lecker" },
    { id: "rente",           cat: "politik",    type: "shirt",   color: "sky",     top: "In Hundejahren 70. Arbeite noch Vollzeit.", sub: "Rentenkommission, ruft mich an." },
    { id: "waermepumpe",     cat: "politik",    type: "shirt",   color: "mustard", top: "Ich bin die Wärmepumpe", sub: "Heizungsgesetz-konform seit dem Welpenalter" },
    { id: "grundsicherung",  cat: "politik",    type: "shirt",   color: "cream",   top: "Meine Grundsicherung: ein voller Napf", sub: "Nicht verhandelbar." },

    // Wirtschaft
    { id: "zoelle",          cat: "wirtschaft", type: "hoodie",  color: "ink",     top: "Ich verhandle nur in Leckerli", sub: "Zölle? Akzeptiere ich nicht." },
    { id: "wachstum",        cat: "wirtschaft", type: "shirt",   color: "mustard", top: "Mein Fell ist das Einzige, was hier noch wächst", sub: "Wachstumsprognose Haare: +300 %", badge: "Neu" },
    { id: "steuer",          cat: "wirtschaft", type: "mug",     color: "red",     top: "Steuererklärung? Hat der Hund gefressen. Wirklich.", sub: "" },
    { id: "elster",          cat: "wirtschaft", type: "cap",     color: "cream",   top: "ELSTER? Ich jag nur echte.", sub: "" },
    { id: "sondervermoegen", cat: "wirtschaft", type: "shirt",   color: "cream",   top: "Mein Sondervermögen: 47 Tennisbälle", sub: "Schuldenbremse gilt nicht für Bälle" },
    { id: "bitcoin",         cat: "wirtschaft", type: "cap",     color: "red",     top: "Bitcoin fällt. Mein Ball fällt.", sub: "Ich hol nur einen davon zurück." },
    { id: "fachkraft",       cat: "wirtschaft", type: "hoodie",  color: "red",     top: "Fachkräftemangel? Ich bin Leckerli-Prüferin", sub: "Staatlich nicht anerkannt", photo: 3 },

    // Zeitgeist
    { id: "ki-chef",         cat: "zeitgeist",  type: "hoodie",  color: "cream",   top: "KI ersetzt viele Jobs. Meinen nicht.", sub: "Chief Kuschel Officer" },
    { id: "bahn",            cat: "zeitgeist",  type: "mug",     color: "ink",     top: "Pünktlicher als die Bahn", sub: "Außer beim Gassi. Da bleib ich stehen." },
    { id: "deutschlandticket", cat: "zeitgeist", type: "tote",   color: "ink",     top: "Deutschlandticket teurer? Ich fahr Kofferraum.", sub: "" },
    { id: "bildschirmzeit",  cat: "zeitgeist",  type: "shirt",   color: "sky",     top: "Bildschirmzeit: 0. Kuschelzeit: alles.", sub: "" },
    { id: "influencer",      cat: "zeitgeist",  type: "hoodie",  color: "forest",  top: "Ich bin nicht verwöhnt. Ich bin Influencerin.", sub: "Kooperationen nur gegen Käse", photo: 1 },
    { id: "ki-blase",        cat: "zeitgeist",  type: "bandana", color: "mustard", top: "KI-Blase? Ich jag nur Seifenblasen", sub: "" },

    // Hundealltag
    { id: "staubsauger",     cat: "alltag",     type: "shirt",   color: "cream",   top: "Ich hab kein Haarproblem. Du hast ein Staubsaugerproblem.", sub: "", badge: "Bestseller" },
    { id: "flauschig",       cat: "alltag",     type: "shirt",   color: "red",     top: "Nicht dick. Flauschig budgetiert.", sub: "", photo: 12 },
    { id: "willkommen",      cat: "alltag",     type: "bandana", color: "red",     top: "Wachhund? Eher Willkommenskomitee", sub: "", badge: "Für Hunde" },
    { id: "work-life",       cat: "alltag",     type: "mug",     color: "cream",   top: "Work-Life-Balance: 22 h schlafen, 2 h Chaos", sub: "" }
  ],

  // Kurze Sprüche für das Laufband
  ticker: [
    "Good Girl. Bad Influence.",
    "Umfragewerte: 100 % Wedeln",
    "Kein Rücktritt, nur Hinlegen",
    "Hundehaare sind mein Glitzer",
    "Sitz. Platz. Shoppen.",
    "Koalition mit dem Sofa steht",
    "Wedeln ist mein Cardio",
    "Hass apportier ich nicht",
    "I hope we have a little bit Leckerli",
    "Toffee war's"
  ],

  // Spruch-Automat: Anfang + Mitte + Ende
  slot: {
    a: ["Montagmorgen?", "Regen beim Gassi?", "Der Postbote klingelt?", "Staubsauger an?", "Tierarzttermin?", "Börsencrash?",
        "Diät ab morgen?", "Umfragetief?", "Koalitionskrach?", "KI übernimmt die Welt?", "Silvester?", "Die Katze guckt komisch?",
        "Käse fällt runter?", "WLAN weg?", "Schwiegermutter kommt?", "Bahnstreik?", "Hitzewelle?", "Steuererklärung fällig?",
        "Herbst der Reformen?", "Zölle steigen?", "Badewanne läuft ein?", "Jemand sagt „Leckerli“?"],
    // Wer im Spruch vorkommt, landet als Foto mit aufs Shirt (Index in photos)
    bPhoto: { "Lilly": 0, "Toffee": 3, "Die Doppelspitze": 5, "Die Kanzlerin der Herzen": 1, "Ein echter Golden": 1, "Das Fellmonster": "cutout", "Die Chefin": 0 },
    b: ["Lilly", "Toffee", "Die Doppelspitze", "Die Kanzlerin der Herzen", "Ein echter Golden", "Das Fellmonster", "Die Chefin", "Mein Hund"],
    c: ["bleibt flauschig.", "will nur Käse.", "wedelt trotzdem.", "legt sich einfach hin.", "liegt im Umfragehoch.",
        "fordert Leckerli-Grundeinkommen.", "jagt Eichhörnchen.", "macht Zoomies.", "vertagt alles aufs Nickerchen.",
        "beruft eine Pressekonferenz ein.", "wälzt sich im Matsch.", "frisst die Beweise.", "guckt treu und sagt nichts.",
        "kündigt dem Staubsauger.", "haart demonstrativ.", "tritt nicht zurück, sondern legt sich hin.", "bellt die Wolken an.",
        "versteckt sich hinter dem Sofa.", "klaut eine Socke.", "sabbert vor Glück.", "hat alles im Griff. Fast."]
  },


  // Studio „Dein Hund aufs Shirt“: Spruch-Vorlagen. {name} = Name des Hundes,
  // without = Text, falls kein Name eingegeben wurde.
  studio: [
    { top: "Good Girl. Bad Influence.", sub: "{name}" },
    { top: "Good Boy. Bad Influence.", sub: "{name}" },
    { top: "{name} for Kanzlerin", without: "Mein Hund for Kanzlerin", sub: "Programm: Leckerli. Sofa. Fertig." },
    { top: "{name} for Kanzler", without: "Mein Hund for Kanzler", sub: "Programm: Leckerli. Sofa. Fertig." },
    { top: "Team {name}", without: "Team Hund", sub: "" },
    { top: "{name} war's.", without: "Der Hund war's.", sub: "" },
    { top: "Bester Hund der Welt. Offiziell.", sub: "{name}" },
    { top: "Mein Therapeut hat vier Pfoten.", sub: "Er heißt {name}." },
    { top: "Hundehaare sind mein Glitzer.", sub: "" },
    { top: "Ich trete nicht zurück. Ich leg mich hin.", sub: "{name}, Pressekonferenz beendet" },
    { top: "Beliebter als jede Regierung", sub: "{name}, parteilos" },
    { top: "Hass apportier ich nicht.", sub: "{name}" },
    { top: "I hope we have a little bit Leckerli.", sub: "{name}" },
    { top: "Zuhause ist, wo {name} auf meinen Socken schläft.", without: "Zuhause ist, wo jemand auf deinen Socken schläft.", sub: "" }
  ],

  // Lilly-Trend: Umfrage-Parodie. base = Startstimmen
  poll: {
    question: "Wenn am Sonntag Gassi-Wahl wäre …",
    options: [
      { id: "lilly",  label: "Lilly als Kanzlerin",                  base: 498 },
      { id: "toffee", label: "Toffee (Wahlversprechen: Chaos)",      base: 287 },
      { id: "nap",    label: "Erst mal ein Nickerchen",              base: 151 },
      { id: "sofa",   label: "Große Koalition: Sofa + Decke",        base: 92 },
      { id: "cheese", label: "Weiß nicht, hab Käse gesehen",         base: 52 }
    ],
    footnote: "Befragt: 1.080 Hunde und 3 Katzen (ungültig). Toffee hat zweimal abgestimmt. Fehlertoleranz ± 1 Leckerli."
  },

  reviews: [
    { name: "Jana & Bruno", dog: "Labrador", text: "Mein Nachbar hat beim Gassi so gelacht, dass er seinen eigenen Hund vergessen hat.", stars: 5 },
    { name: "Mehmet & Luna", dog: "Golden Retriever", text: "Seit ich den Rücktritts-Hoodie trage, legen sich im Büro alle hin. Produktivität: egal. Stimmung: top.", stars: 5 },
    { name: "Sabine & Paul", dog: "Dackel", text: "Das Wahlplakat hängt im Flur. Mein Mann hat schon zweimal unterschrieben.", stars: 5 },
    { name: "Tom & Kiwi", dog: "Mischling", text: "Kiwi trägt jetzt das „Toffee war's“-Bandana. Seitdem war Kiwi nie mehr schuld. Genial.", stars: 5 }
  ]
};

// Bildquelle: zuerst die lokale WebP-Kopie, bei Fehler das Original bei ImgBB.
// i = Index in photos oder "cutout" (das liegende Hero-Bild)
window.LILLY.img = function (i) {
  const L = window.LILLY;
  if (i && typeof i === "object") return { src: i.src, fallback: i.src, cut: !!i.cut };   // eigenes Foto aus dem Studio
  if (i === "cutout") return { src: "assets/img/cutout.webp", fallback: L.cutout, cut: true };
  i = +i;
  return { src: "assets/img/lilly-" + String(i + 1).padStart(2, "0") + ".webp", fallback: L.photos[i], cut: L.cutouts.includes(i) };
};
