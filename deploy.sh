#!/usr/bin/env bash
set -euo pipefail

SERVER="root@65.108.4.141"
REMOTE_DIR="/opt/weihnachtsmarkt-luzern"
REPO="git@github.com:givel-roger/sushi-catering.ch.git"
BRANCH="claude/weihnachtsmarkt-luzern-redesign-f24dc9"

echo "=== Deploy weihnachtsmarkt-luzern.com ==="
echo "Server: $SERVER"
echo "Pfad:   $REMOTE_DIR"
echo ""

# 1. Auf dem Server: Verzeichnis anlegen falls nötig, Repo klonen/pullen
ssh "$SERVER" bash -s <<'REMOTE'
set -euo pipefail

REMOTE_DIR="/opt/weihnachtsmarkt-luzern"
REPO="git@github.com:givel-roger/sushi-catering.ch.git"
BRANCH="claude/weihnachtsmarkt-luzern-redesign-f24dc9"

if [ ! -d "$REMOTE_DIR" ]; then
  echo ">>> Klone Repository nach $REMOTE_DIR ..."
  git clone -b "$BRANCH" "$REPO" "$REMOTE_DIR"
else
  echo ">>> Pull neueste Änderungen ..."
  cd "$REMOTE_DIR"
  git fetch origin
  git checkout "$BRANCH"
  git pull origin "$BRANCH"
fi

cd "$REMOTE_DIR"

# .env.production muss vorhanden sein
if [ ! -f .env.production ]; then
  echo "FEHLER: .env.production fehlt auf dem Server!"
  echo "Bitte anlegen: $REMOTE_DIR/.env.production"
  exit 1
fi

echo ">>> Docker Container bauen und starten ..."
docker compose down || true
docker compose up -d --build

echo ">>> Warte 10 Sekunden auf Start ..."
sleep 10

echo ">>> Health Check ..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3081/ || echo "000")
if [ "$HTTP_CODE" = "200" ]; then
  echo "✅ Health Check OK (HTTP $HTTP_CODE)"
else
  echo "⚠️  Health Check: HTTP $HTTP_CODE"
  echo ">>> Container-Logs:"
  docker compose logs --tail=30
fi
REMOTE

echo ""
echo "=== Deploy abgeschlossen ==="
