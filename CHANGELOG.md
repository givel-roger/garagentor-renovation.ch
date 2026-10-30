# Changelog

## 2.14.0 (2026-10-30)

- Google Tag Manager eingebunden (Container GTM-WMW6P2L4, überschreibbar via NEXT_PUBLIC_GTM_ID)
- Conversion-Events im dataLayer: lead_form_submit (mit Tor-Typ und PLZ) und phone_click
- Grundlage für Google-Ads-Conversion-Tracking

## 2.13.2 (2026-10-30)

- Fix: Zeitangabe bei Voicemail-Leads war UTC (eine Stunde zu früh) — jetzt Europe/Zurich
- Container läuft mit TZ=Europe/Zurich

## 2.13.1 (2026-10-30)

- Fix: 3CX meldete die Weiterleitung aufs eigene Handy als eingehenden Anruf → Phantom-Lead „Anrufer 5171212"
- Webhook ignoriert jetzt eigene Nummern (OWN_NUMBERS, Standard 0795171212); Voicemails von eigenen Nummern kommen weiterhin an

## 2.13.0 (2026-10-30)

- Fix: Ein Anruf erzeugte mehrere Leads (3CX-Webhook, Anruf-Poller und Voicemail-Mail legten je einen an)
- Gemeinsame Zuordnung: gleiche Nummer innerhalb von 2 Stunden = derselbe Lead, unabhängig vom Nummernformat (079… / +4179…)
- 3CX-Webhook ergänzt bestehenden Lead statt neu anzulegen (keine doppelte Benachrichtigung)
- Trifft die Transkription zu einem bestehenden Lead ein, wird sie per E-Mail nachgereicht
- Admin: Lead-Liste lädt alle 30 Sekunden still nach, geöffneter Lead aktualisiert sich mit (Transkription, Aufnahme)

## 2.12.1 (2026-10-30)

- Fix: Voicemail-Aufnahmen und Formular-Fotos waren im Admin nicht abrufbar (404) — Dateien, die nach dem Build in public/uploads landen, werden jetzt über /uploads/... ausgeliefert
- Voicemail-Empfang läuft direkt über eigene Inbound-Domain eingang.garagentor-renovation.ch (MX → Brevo → Webhook), kein Umweg mehr über Yorokobi
- 3CX Mailbox 110 sendet an voicemail@eingang.garagentor-renovation.ch

## 2.12.0 (2026-10-29)

- Voicemail-Empfang per E-Mail (wie Yorokobi): 3CX sendet Voicemail → Brevo Inbound → Webhook
- Neuer Endpoint /api/inbound-voicemail empfängt WAV-Anhänge und transkribiert mit Whisper
- Aufnahmen werden gespeichert und als Lead mit Transkription angelegt
- Recordings API entfernt (403 bei gehosteter 3CX — funktioniert nicht)
- Anruf-Poller synchronisiert weiterhin die Anrufliste via XAPI

## 2.11.0 (2026-10-29)

- Alle eingehenden Anrufe werden synchronisiert (nicht nur Voicemails)
- Aufnahmen werden heruntergeladen und automatisch transkribiert (wie bei Yorokobi)
- Transkription wird als Nachricht im Lead angezeigt
- Benötigt "Call Control API" in 3CX für Aufnahmen-Download

## 2.10.1 (2026-10-29)

- Login mit E-Mail statt Benutzername
- Passwort-Auge (Sichtbarkeit umschalten) auf Login- und Reset-Seite
- Login akzeptiert weiterhin auch den Benutzernamen (Abwärtskompatibel)

## 2.10.0 (2026-10-29)

- Passwort-Reset komplett neu: E-Mail eingeben → Reset-Link per E-Mail → neues Passwort 2x eingeben
- Token-basierter Reset (1 Stunde gültig, einmalig verwendbar)
- Eigene Reset-Seite unter /admin/reset-password
- Sicherer als vorher (kein Passwort im Login-Formular)

## 2.9.1 (2026-10-29)

- Fix: Passwort-Zurücksetzen funktionierte nicht (Enter löste Login statt Reset aus)
- Reset-Formular ist jetzt ein eigenes `<form>` — Enter und Button-Klick funktionieren korrekt

## 2.9.0 (2026-10-29)

- E-Mail-Benachrichtigung bei jedem neuen Lead (Formular, Telefonanruf, Voicemail)
- Benachrichtigung enthält: Name, Telefon, Quelle, Nachricht, Transkription
- Via Brevo SMTP an givel@marktindex.ch

## 2.8.0 (2026-10-29)

- Automatischer Voicemail-Sync via 3CX XAPI: Anrufbeantworter-Nachrichten werden automatisch abgerufen
- Hintergrund-Poller alle 2 Minuten (läuft 24/7 im Docker-Container)
- Voicemail-Aufnahmen werden heruntergeladen und lokal gespeichert
- Automatische Transkription via OpenAI Whisper (Deutsch)
- Zuordnung zu bestehenden Leads anhand Telefonnummer
- Manueller Sync-Trigger über /api/voicemail-sync

## 2.7.0 (2026-10-29)

- 3CX CRM-Integration: Custom XML-Vorlage für automatischen Anruf-Webhook
- Neuer API-Endpunkt /api/3cx-lookup für 3CX-Kontaktabfrage
- Webhook erweitert: Anruftyp (eingehend/verpasst), Agent und Notizen werden gespeichert
- Verpasste Anrufe werden separat markiert

## 2.6.0 (2026-10-29)

- Dashboard-Tab mit Statistiken: Leads gesamt, Abschlussrate, Status-Übersicht, Quellen, Leads pro Partner
- E-Mail & WhatsApp Vorlagen: 4 Templates (Erstantwort, Offerte, Nachfassen, Termin)
- Schweizer Kantonskarte: Interaktive Karte mit Lead-Heatmap pro Kanton
- Partner-Impersonation: Admin kann Ansicht eines Partners simulieren
- Anrufen-Button in Lead-Detail
- Partner-Karten zeigen Lead-Anzahl und "Als Partner ansehen" Button

## 2.5.0 (2026-10-29)

- Kanban-Board für Leads: Drag & Drop zwischen Spalten (Neu, Kontaktiert, Offerte, Erledigt, Abgelehnt)
- Toggle zwischen Kanban- und Listenansicht
- Farbcodierte Spalten-Header
- Lead-Karten mit Name, Ort, Telefon, Partner-Zuordnung

## 2.4.0 (2026-10-29)

- Passwort-Reset sendet E-Mail via Brevo SMTP
- E-Mail-Feld für Benutzer hinzugefügt
- Nodemailer Integration für transaktionale E-Mails

## 2.3.0 (2026-10-28)

- Benutzerverwaltung im Admin: neuer "Users"-Tab
- Passwort zurücksetzen für alle User (Admin-only)
- User sperren/aktivieren
- API-Endpunkt /api/users für User-Verwaltung
- Datenbank-Permissions auf Server 8 gefixt

## 2.2.1 (2026-10-28)

- Port auf Server 8 von 3001 auf 3007 geändert (3001 gehört sanitär-stellen.ch)
- Containername garagentor-renovation.ch wie auf dem Server

## 2.2.0 (2026-10-28)

- Migration auf Server 8 (178.104.120.91): Docker Port 3001
- deploy.sh für Server 8 aktualisiert

## 2.1.0 (2026-10-28)

- Telefonanrufe automatisch transkribieren (OpenAI Whisper)
- Transkription im Admin-Lead-Detail anzeigen (goldenes Textfeld)
- Audio-Player für Aufnahme im Admin eingebaut
- Transkriptions-Vorschau in der Lead-Liste
- recording_url und transkription Spalten in DB

## 2.0.0 (2026-10-28)

- Multi-User Admin-System: Login mit Benutzername/Passwort (roger, irma als Admins)
- Partner-Verwaltung: Firmen mit PLZ, Ort, Radius anlegen + Login erstellen
- Regionale Lead-Zuweisung: Leads automatisch dem nächsten Partner innerhalb Radius zuweisen
- Rollenbasierte Ansichten: Partner sehen nur ihre Leads, Admins sehen alles
- 3CX Webhook: Telefonanrufe werden als Leads erfasst (Quelle: Telefon)
- Lead-Quelle anzeigen (Formular vs. Telefon)
- Manuelle Partner-Zuweisung durch Admin
- PLZ-Koordinaten-Tabelle für Schweizer Postleitzahlen (Haversine-Distanzberechnung)

## 1.5.1 (2026-10-28)

- "bis zu" vor 70% ergänzt

## 1.5.0 (2026-10-27)

- Vorteile-Karten plakativ redesigned: dunkelblau mit grossen goldenen Zahlen (70%, 1 Tag, 100%, 5 Jahre)
- Montserrat Black für die Highlight-Zahlen

## 1.4.3 (2026-10-27)

- Telefonnummer 044 442 99 90 im Header, Hero und Footer eingefügt

## 1.4.2 (2026-10-27)

- Footer vereinfacht: nur Leadhunter GmbH + Leistungen-Spalte zurück

## 1.4.1 (2026-10-27)

- Betreiberin geändert auf Leadhunter GmbH

## 1.4.0 (2026-10-27)

- Logo-Redesign: gestapeltes Wordmark mit Montserrat Black + goldener Trennlinie
- Kontaktdaten eingefügt: Marktindex AG, Cheerstrasse 13b, 6014 Luzern
- Betreiberin im Footer: Marktindex AG
- E-Mail statt Platzhalter-Telefonnummer im Header und Hero

## 1.3.0 (2026-10-26)

- Komplette Umfärbung im Hörmann-Stil: Dunkelblau (#003A7D) + Gold (#F9AD09)
- Dunkelblauer Header mit goldenem CTA-Button
- Hero-Overlay in Dunkelblau
- Alle Akzente und Icons in Gold statt Orange
- Dunkelblauer Footer
- Formular-Button in Dunkelblau

## 1.2.2 (2026-10-26)

- Logo nochmals überarbeitet: oranges Quadrat + einheitlicher Text
- Kein Farbsplit, kein Untertitel, kein Icon — sieht nicht nach KI aus

## 1.2.1 (2026-10-26)

- Logo komplett neu: rein typografisch mit orangem Akzent-Strich (kein Icon)
- Minimalistisches Schweizer Design-Studio Branding

## 1.2.0 (2026-10-26)

- Alle Bilder durch echte Schweizer/europäische Garagentor-Fotos ersetzt
- Neue Bilder: Sektionaltore, Schwingtore, Monteure bei der Arbeit
- Logo-Redesign: orangener Gradient mit weissem Haus-Icon
- Alte Test-Bilder und amerikanische Fotos entfernt

## 1.1.0 (2026-10-26)

- Komplettes Redesign der Landingpage
- Echte Fotos von Garagentoren statt generischem Layout
- Neue Sektionen: Tor-Typen, CTA-Banner mit Hintergrundbild
- SVG-Icons statt Emojis
- Professionelles Layout inspiriert von sisto.swiss und hoermann.ch
- Hero mit Foto und dunklem Overlay
- Trust-Bar mit Kennzahlen

## 1.0.0 (2026-10-25)

- Initiale Version
- Landingpage mit Lead-Formular (Foto-Upload, Kontaktdaten, Tor-Details)
- Admin-Panel mit Login, Lead-Verwaltung, Status-Filter
- WhatsApp- und E-Mail-Integration im Admin
- SQLite-Datenbank für Leads
- Mobile-optimiert
- Docker-Setup für Deployment
