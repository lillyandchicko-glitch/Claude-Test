# Growatt Komplettanlagen – Aussuchen & Reservieren

Moderne One-Page-Website für Photovoltaik-Komplettanlagen, die **ausschließlich aus Growatt-Komponenten** bestehen. Kein Shop und keine Zahlung: Besucher suchen ein Paket aus, vergleichen es und reservieren es kostenlos.

## Starten

Die Seite braucht keinen Build-Schritt und keine Abhängigkeiten.

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

Sie lässt sich auf jedem statischen Hosting veröffentlichen, z. B. GitHub Pages, Netlify oder Vercel.

## Funktionen

| Bereich | UX-Vorbild | Umsetzung |
| --- | --- | --- |
| Hero mit Split-Text, Aurora und animiertem Sonnen-Orb | Apple, Linear | CSS `@property`, Blur-Reveal pro Wort |
| Scrollytelling „So funktioniert's“ | Apple-Produktseiten | Sticky-SVG-Szene, Energieflüsse reagieren auf Scroll |
| Anlagen-Finder (4 Fragen → Empfehlung) | Enpal, 1KOMMA5° | Schrittweises Quiz mit Fortschrittsbalken |
| Paket-Grid mit Filter & Sortierung | Tesla, Stripe | **View Transitions API**, 3D-Tilt und Spotlight-Hover |
| Detailansicht mit Ertragsrechner | Tesla Energy | Shared-Element-Übergang, Live-Berechnung mit Zahl-Tweens |
| Vergleich von bis zu 3 Paketen | – | Schwebende Vergleichsleiste, Bestwerte hervorgehoben |
| Merkliste | – | Speicherung im `localStorage` |
| Reservierung in 4 Schritten | Airbnb | Paket → Kontakt → Wunschtermin → Prüfen, Konfetti bei Erfolg |
| Weitere Effekte | – | Scroll-Fortschritt (`animation-timeline`), magnetische Buttons, eigener Cursor, Marquee, Timeline |

Die Seite ist barrierearm umgesetzt: `prefers-reduced-motion` wird respektiert, Dialoge sind native `<dialog>`-Elemente und alles ist per Tastatur bedienbar. Die Schriften sind selbst gehostet, es werden also keine Google-Fonts nachgeladen (wichtig für die DSGVO).

## Anpassen

Alle Inhalte stehen in **`assets/js/data.js`**:

- `SITE_CONFIG`: Firmenname, Telefon, E-Mail, Strompreis-Standardwert, Einspeisevergütung, Preisanzeige an/aus
- `COMPONENTS`: Growatt-Einzelkomponenten
- `PACKAGES`: Komplettanlagen mit Preis, Speicher, Modulanzahl, Autarkie und Komponentenliste

> ⚠️ **Preise, Autarkie- und Ertragswerte sind Beispielwerte.** Bitte vor dem Livegang durch eigene Kalkulationen ersetzen und die technischen Daten mit den aktuellen Growatt-Datenblättern abgleichen.

### Reservierungen empfangen

Ohne Konfiguration läuft das Formular im **Demo-Modus**: Reservierungen werden nur im Browser des Besuchers gespeichert. Um sie wirklich zu empfangen, tragen Sie in `SITE_CONFIG.reservationEndpoint` eine URL ein, die JSON per `POST` annimmt, z. B. Formspree, Make/Zapier-Webhook oder ein eigenes Backend.

Beispiel für den gesendeten Inhalt:

```json
{
  "package": "home-m", "mode": "Vor-Ort-Termin",
  "firstName": "Max", "lastName": "Muster", "email": "max@example.de",
  "phone": "0170 1234567", "zip": "80331", "city": "München", "note": "",
  "date": "2026-10-05", "time": "12–16 Uhr", "code": "GW-7RRFXM",
  "dateLabel": "Mo, 5. Okt", "createdAt": "2026-10-02T09:00:00.000Z"
}
```

### Vor dem Livegang

- Impressum- und Datenschutz-Links im Footer verlinken
- Firmenname und Kontaktdaten in `SITE_CONFIG` eintragen
- Optional die stilisierten SVG-Produktgrafiken durch echte Produktfotos ersetzen (Nutzungsrechte beachten)

## Struktur

```
index.html            Markup aller Sektionen
assets/css/styles.css Design-System, Layout, Animationen
assets/js/data.js     Sortiment & Konfiguration
assets/js/app.js      Interaktionen (Vanilla JS, keine Abhängigkeiten)
assets/fonts/         Inter & Bricolage Grotesque (OFL, selbst gehostet)
```
