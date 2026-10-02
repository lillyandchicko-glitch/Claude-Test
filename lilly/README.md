# Lilly Merch – Good Girl. Bad Influence.

One-Page-Shop für den Instagram-Account **@goldenretriever lilly**: T-Shirts, Hoodies, Caps, Gassi-Beutel, Tassen und Hunde-Bandanas mit Sprüchen zu Politik, Wirtschaft, Zeitgeist und Hundealltag.

## Starten

Kein Build-Schritt, keine Abhängigkeiten zur Laufzeit (GSAP, ScrollTrigger, Lenis und die Schriften liegen lokal in `assets/`).

```bash
cd lilly
python3 -m http.server 8000
# → http://localhost:8000
```

## Was drin ist

| Bereich | Effekt |
| --- | --- |
| Preloader | Laufende Pfotenabdrücke + Prozentzähler, Vorhang fährt hoch |
| Hero | Buchstaben springen einzeln ein und wackeln bei Berührung wie Gummi, Lilly ploppt elastisch hoch, drehende Sonnenstrahlen, Maus-Parallax, rotierender Sticker |
| Laufband | Zwei schräge Bänder, Tempo und Neigung reagieren auf die Scroll-Geschwindigkeit |
| Manifest | Text leuchtet Wort für Wort beim Scrollen auf, Zähler laufen hoch |
| Shop | 78 Designs in 10 Kategorien (u. a. Berühmte Worte, Haltung, Herz & Fell), Filter, „Mehr Sprüche“ lädt je 12 nach, 3D-Tilt + Lichtspot auf Karten, Mockups werden live als SVG erzeugt |
| Produktdetail | Produkt, Farbe, Größe wechseln → Mockup wird sofort neu gedruckt |
| Warenkorb | Seitenpanel, Mengen, Gratis-Versand-Balken, Konfetti aus Pfoten, Knochen und Herzen; wird im Browser gespeichert |
| Lilly-Trend | Umfrage-Parodie „Sonntagsfrage“: abstimmen, Balken wachsen, Konfetti |
| Foto-Merch | Jedes Design wahlweise mit einem von 20 Lilly-Fotos (+5 €), neues Produkt „Wahlplakat“, Fotos auch direkt aus der Galerie bestellbar |
| Spruch-Automat | Slot-Maschine kombiniert Weltlage + Lilly-Weisheit; Ergebnis direkt als Unikat bestellbar |
| Galerie | Horizontal scrollende Polaroids (Desktop gepinnt, Handy wischbar) |
| Instagram | Fotostapel zum Durchklicken |
| Studio „Dein Hund aufs Shirt“ | Foto hochladen → KI stellt den Hund im Browser frei (MediaPipe DeepLab v3 + Magic Touch, Apache-2.0, lokal unter `assets/vendor/mediapipe`) → Name, Spruch-Vorlage oder eigener Spruch, Produkt und Farbe wählen → Korb. Wird kein Hund erkannt, tippt man ihn im großen Foto an. Das Foto verlässt das Gerät nicht. |
| Stöckchen-Modus | „Ball werfen“ (Knopf oder Taste B): Der Ball fliegt mit Physik übers Bild, Toffee oder Lilly rennt quer durch und holt ihn |
| Extras | Eigener Cursor mit Label, magnetische Buttons, Fortschrittsbalken, Navigation blendet beim Runterscrollen aus |

`prefers-reduced-motion` wird respektiert, Dialoge sind native `<dialog>`-Elemente, alles ist per Tastatur bedienbar. Ohne JavaScript bleibt der Inhalt sichtbar.

## Schrift & Farben

Angelehnt an cravburgers.shop: **Mouse Memoirs** (schmale, handgezeichnete Großbuchstaben, per Kontur fetter gemacht) für Überschriften und Fließtext-Akzente, **Luckiest Guy** für kleine Labels mit weißem Rand, **DM Sans** für Formulare. Alle drei sind freie Google-Fonts (SIL OFL) und liegen lokal in `assets/fonts/`. Rote Überschriften bekommen eine weiße Aufkleber-Kontur (`--sticker`), der Hintergrund ist Papier-Beige.

## Anpassen

Alle Inhalte stehen in `assets/js/data.js`:

- `instagram` – Link zum Profil (**bitte prüfen**, der genaue Handle ist geraten)
- `designs` – Sprüche, Kategorie, Standard-Produkt und -Farbe, optionales Badge
- `types` – Preise, Größen, verfügbare Farben je Produktart
- `slot` – Wortlisten für den Spruch-Automaten
- `poll` – Frage und Antworten der Umfrage-Parodie
- `studio` – Spruch-Vorlagen fürs Studio (`{name}` wird durch den Hundenamen ersetzt)
- `photos` / `cutout` – Bilder. Die GitHub Action `.github/workflows/lilly-images.yml` lädt sie bei jeder Änderung an `data.js` von ImgBB herunter, verkleinert sie als WebP und legt sie in `assets/img/` ab. Die Seite nutzt zuerst diese Kopien und fällt sonst auf ImgBB zurück. Neue Fotos also einfach hinten an `photos` anhängen.

## Noch offen für den echten Verkauf

- **Eigene Fotos an die Druckerei:** Das Studio speichert das freigestellte Bild bisher nur im Browser-Warenkorb. Beim Anbinden eines echten Shops muss es mit der Bestellung hochgeladen werden (z. B. Shopify + Printful/Printify-Personalisierung). Für den Druck empfiehlt sich das Original in voller Auflösung; die Freistellung im Browser ist eine Vorschau in ca. 1000 px.
- **Checkout:** „Zur Kasse“ ist eine Demo. Für echte Bestellungen z. B. Shopify Buy Button oder Stripe Checkout anbinden; für Druck und Versand ohne Lager einen Print-on-Demand-Dienst (Printful, Printify, Spreadshirt, Shirtee).
- **Rechtliches:** Impressum, Datenschutz, AGB, Widerrufsbelehrung und Versandseite sind nur Platzhalter-Links.
- **Sprüche:** Vor dem Druck kurz auf Markenrechte prüfen (z. B. Anspielungen auf bekannte Slogans).
