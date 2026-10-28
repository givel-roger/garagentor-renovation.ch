#!/bin/bash
# =============================================================================
# Sicherer Deploy für garagentor-renovation.ch — Docker auf Server 8.
#
# Workflow: GitHub FIRST (commit + push), DANN deployen.
# DB (data/leads.db) und public/uploads sind Host-Volumes und bleiben
# bei jedem Deploy unberührt.
# =============================================================================
set -euo pipefail

SERVER="${DEPLOY_SERVER:-root@178.104.120.91}"
APP_DIR="/var/www/garagentor-renovation.ch"
REPO="https://github.com/givel-roger/garagentor-renovation.ch.git"
LOG_FILE="$(dirname "$0")/deploy.log"

echo "=== Deploy garagentor-renovation.ch auf $SERVER (Server 8) ==="
echo "$(date '+%Y-%m-%d %H:%M:%S') Deploy gestartet (S8)" >> "$LOG_FILE"

ssh "$SERVER" bash -s <<REMOTE
set -euo pipefail

# 1) Falls erstes Mal: Repo klonen
if [ ! -d "$APP_DIR" ]; then
  echo "Erstinstallation: Repo klonen..."
  git clone $REPO $APP_DIR
  cd $APP_DIR
  mkdir -p data public/uploads
else
  cd $APP_DIR

  # 2) Pre-Deploy DB-Backup (falls DB existiert)
  if [ -f data/leads.db ]; then
    TS="\$(date +%Y%m%d-%H%M%S)"
    mkdir -p backups
    cp -a data/leads.db "backups/leads.db.pre-deploy-\$TS"
    echo "DB-Backup: backups/leads.db.pre-deploy-\$TS (\$(du -h data/leads.db | cut -f1))"
  fi

  # 3) Code aktualisieren — NUR Fast-Forward
  git fetch origin main
  git merge --ff-only origin/main
fi

echo "Code auf: \$(git rev-parse --short HEAD)"

# 4) Container neu bauen. DB + uploads sind Volumes und bleiben.
docker compose up -d --build

echo "Deploy fertig."
REMOTE

echo "$(date '+%Y-%m-%d %H:%M:%S') Deploy erfolgreich (S8)" >> "$LOG_FILE"
echo "=== Deploy abgeschlossen ==="
