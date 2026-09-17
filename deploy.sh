#!/bin/bash
# One-shot deploy: push build to prod + apply camertrace apex->www nginx redirect.
# Run from anywhere: bash deploy.sh   (will prompt for the root password a few times)
set -e
REMOTE=root@173.212.223.65
LOCAL_DIST=/var/www/html/whimo/whimo/dist/

echo ">> [1/3] Syncing build to $REMOTE:/var/whimo/dist/ ..."
rsync -az --delete "$LOCAL_DIST" "$REMOTE:/var/whimo/dist/"

echo ">> [2/3] Uploading new nginx config ..."
TMP=$(mktemp)
cat > "$TMP" <<'NGINX'
server {
    listen 80;
    server_name www.camertrace.cm camertrace.cm;
    return 301 https://$host$request_uri;
}

# Apex -> www (canonical) over HTTPS
server {
    listen 443 ssl;
    server_name camertrace.cm;

    ssl_certificate /etc/ssl/www_camertrace_cm_fullchain.pem;
    ssl_certificate_key /etc/ssl/camertrace_cm.key;

    return 301 https://www.camertrace.cm$request_uri;
}

server {
    listen 443 ssl;
    server_name www.camertrace.cm;

    ssl_certificate /etc/ssl/www_camertrace_cm_fullchain.pem;
    ssl_certificate_key /etc/ssl/camertrace_cm.key;

    root /var/whimo/dist;
    index index.html;

    # Django REST API. Must precede "location /" so SPA fallback does not
    # swallow /api/* and return index.html to the mobile app.
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /admin/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /static/ {
        alias /var/www/whimo-static/;
        expires 7d;
        add_header Cache-Control "public";
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}

server {
    listen 80;
    server_name cicc.prosygma-cm.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name cicc.prosygma-cm.com;

    ssl_certificate /etc/ssl/cicc/fullchain.pem;
    ssl_certificate_key /etc/ssl/cicc/cicc.prosygma-cm.com.key;

    location /static/ {
        alias /var/www/whimo-static/;
        expires 7d;
        add_header Cache-Control "public";
    }

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 80;
    server_name 173.212.223.65;

    location /static/ {
        alias /var/www/whimo-static/;
        expires 7d;
        add_header Cache-Control "public";
    }

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
NGINX
scp "$TMP" "$REMOTE:/tmp/whimo-test.new"
rm -f "$TMP"

echo ">> [3/3] Applying config on prod (backup + test + reload) ..."
ssh "$REMOTE" 'bash -s' <<'REMOTE_SCRIPT'
CFG=/etc/nginx/sites-available/whimo-test
NEW=/tmp/whimo-test.new
STAMP=$(date +%F-%H%M%S)
cp "$CFG" "$CFG.bak.$STAMP"
echo "   backed up -> $CFG.bak.$STAMP"
cp "$NEW" "$CFG"
if nginx -t; then
    systemctl reload nginx
    echo "APPLIED-OK"
else
    echo "NGINX-TEST-FAILED -> restoring backup"
    cp "$CFG.bak.$STAMP" "$CFG"
    nginx -t
    exit 1
fi
REMOTE_SCRIPT

echo ">> DONE."
