# Changelog

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
