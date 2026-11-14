# DEPLOYMENT — ORBI

Producción: **https://orbi.agustinpane.xyz**
Infra: **Dokploy BCN**, detrás de **Cloudflare** y del túnel `bcn`.

La app es una SPA estática: Node 22 compila `dist/`, nginx la sirve en el puerto 80 y Dokploy la
publica detrás de Traefik. No hay backend, base de datos ni variables de entorno de aplicación.

## Ruta de red

```text
Cloudflare (TLS, zona agustinpane.xyz)
  └─> Cloudflare Tunnel "bcn" (LXC 114, 192.168.1.114)
        └─> nginx :80 (server_name orbi.agustinpane.xyz)
              └─> Dokploy Traefik :80 (192.168.1.115)
                    └─> contenedor ORBI (nginx:alpine, puerto 80)
```

## Infraestructura

| Item | Valor |
|---|---|
| Dokploy | `https://dokploy-bcn.agustinpane.xyz` (panel detrás de Cloudflare Access) |
| VM Dokploy | `192.168.1.115` |
| Proyecto / entorno | `Aplicaciones` (`FLGNQAu7z6UkAazPxu9r9`) / `production` (`uYxpUkNVX3jzl0fyehPy-`) |
| App Dokploy | `ORBI` (**a crear**) |
| `applicationId` | `<APP_ID>` (**se obtiene al crear**) |
| Dominio | `orbi.agustinpane.xyz` |
| Puerto del contenedor | `80` |
| Origen | `github.com/kosmic-nasa-hackathon/orbi`, branch `main` |
| Build | `Dockerfile` en la raíz, contexto `/` |
| TLS | Cloudflare; en Dokploy el dominio va con `https: false` |
| Base de datos | ninguna |
| Preview por PR | no; solo producción |

## Prerrequisitos

1. **Admin del repo/org** (`kosmic-nasa-hackathon`): instalar la GitHub App de Dokploy en la org y
   dar acceso al repo. Sin esto Dokploy no puede clonar un repo privado.
2. **Write en el repo** para quien vaya a pushear ramas y PRs.
3. **Acceso a Dokploy**: API key (`DOKPLOY_API_KEY`) y panel/API reachable.
4. **Acceso a Cloudflare**: zona `agustinpane.xyz` y túnel `bcn`.
5. **Acceso al LXC 114** para editar el ingress de cloudflared y el vhost de nginx.

## Build

`Dockerfile` multi-stage:

1. `node:22-bookworm-slim` instala con `npm ci`.
2. `npm run build` (`tsc --noEmit && vite build`) genera `dist/`.
3. `nginx:1.27-alpine` sirve `dist/` con `nginx.conf` (fallback SPA, cache de assets, healthcheck).

```bash
npm ci
npm run check
npm run build
docker build -t orbi:local .
docker run --rm -p 8080:80 orbi:local
curl -I http://localhost:8080/
```

## Provisionar Dokploy

Las llamadas usan `x-api-key` (no `Authorization: Bearer`). Guarda la key en Dokploy/Vaultwarden,
nunca en el repo.

```bash
export DOKPLOY_URL=https://dokploy-bcn.agustinpane.xyz
export DOKPLOY_API_KEY=...   # no lo pegues en el chat ni en git
```

### 1. Crear la app

```bash
curl -s -X POST "$DOKPLOY_URL/api/application.create" \
  -H "x-api-key: $DOKPLOY_API_KEY" -H 'Content-Type: application/json' \
  -d '{"projectId":"FLGNQAu7z6UkAazPxu9r9","environmentId":"uYxpUkNVX3jzl0fyehPy-","name":"ORBI"}'
```

La respuesta trae el `applicationId`. Guárdalo como `APP_ID`.

### 2. Enlazar el repo

```bash
curl -s -X POST "$DOKPLOY_URL/api/application.saveGithubProvider" \
  -H "x-api-key: $DOKPLOY_API_KEY" -H 'Content-Type: application/json' \
  -d "{\"applicationId\":\"$APP_ID\",\"githubAppGitProviderId\":\"TE6DZFA-GBljtQ-0q0q8m\",\"repository\":\"kosmic-nasa-hackathon/orbi\",\"branch\":\"main\",\"owner\":\"kosmic-nasa-hackathon\",\"buildPath\":\"/\",\"triggerType\":\"push\"}"
```

Si la API rechaza `githubAppGitProviderId`, prueba con `githubId` (mismo valor). El Git provider
`TE6DZFA-GBljtQ-0q0q8m` es el GitHub App de Dokploy; debe estar instalado en la org.

### 3. Build type y dominio

```bash
curl -s -X POST "$DOKPLOY_URL/api/application.saveBuildType" \
  -H "x-api-key: $DOKPLOY_API_KEY" -H 'Content-Type: application/json' \
  -d "{\"applicationId\":\"$APP_ID\",\"buildType\":\"dockerfile\"}"

curl -s -X POST "$DOKPLOY_URL/api/domain.create" \
  -H "x-api-key: $DOKPLOY_API_KEY" -H 'Content-Type: application/json' \
  -d "{\"applicationId\":\"$APP_ID\",\"host\":\"orbi.agustinpane.xyz\",\"port\":80,\"https\":false,\"path\":\"/\"}"
```

No actives Let's Encrypt: Cloudflare termina TLS.

### 4. Primer deploy

```bash
curl -s -X POST "$DOKPLOY_URL/api/application.deploy" \
  -H "x-api-key: $DOKPLOY_API_KEY" -H 'Content-Type: application/json' \
  -d "{\"applicationId\":\"$APP_ID\",\"title\":\"Initial deploy\"}"
```

Comprueba `applicationStatus` (`idle` → `running` → `done`/`error`) y los logs en
`/etc/dokploy/logs/<appName>/` en la VM.

## Cloudflare, túnel y nginx

### DNS

CNAME `orbi` → `0bbb0bcf-863a-4f57-9b3a-353761b91799.cfargotunnel.com`, **proxied**.

### Ingress del túnel (LXC 114)

En `/root/.cloudflared/config.yml`, antes del catch-all:

```yaml
- hostname: orbi.agustinpane.xyz
  service: http://127.0.0.1:80
```

```bash
systemctl restart cloudflared
```

### Nginx (LXC 114)

`/etc/nginx/sites-available/orbi.agustinpane.xyz`:

```nginx
server {
    listen 80;
    server_name orbi.agustinpane.xyz;

    location / {
        proxy_pass http://192.168.1.115:80;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

```bash
ln -s /etc/nginx/sites-available/orbi.agustinpane.xyz /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
```

No pongas Cloudflare Access en `orbi.agustinpane.xyz`: el jurado tiene que entrar sin login.

## Auto-deploy

### Opción recomendada: GitHub App de Dokploy

1. En Dokploy → Git → GitHub, instala/actualiza la App en la org `kosmic-nasa-hackathon` y dale
   acceso a `orbi`.
2. En la app `ORBI`, activa `autoDeploy`.
3. El endpoint `/api/deploy/github` ya tiene bypass de Cloudflare Access en BCN.

Cada push a `main` despliega. CI sigue corriendo en PRs y en `main`; el merge solo se hace con CI
en verde. No hay previews por PR.

### Fallback: runner self-hosted + token webhook

Los webhooks por token (`/api/deploy/<refreshToken>`) **siguen detrás de Cloudflare Access**; por eso
no funcionan desde un runner GitHub-hosted. Si no se puede usar la GitHub App:

1. Registra un runner self-hosted en la LAN (el runner 100 ya tiene 6; sería el séptimo).
2. Guarda `DOKPLOY_TOKEN` como secret del repo.
3. Añade un workflow que, tras el CI, haga:

```bash
curl -X POST "http://192.168.1.115:3000/api/deploy/$DOKPLOY_TOKEN" \
  -H "x-github-event: push" \
  -H "Content-Type: application/json" \
  -d '{"ref":"refs/heads/main"}'
```

Un `301` con `{"message":"Branch Not Match"}` significa que el branch del payload no coincide con
el configurado en Dokploy; no lo reintentes como si fuera un error de red.

### Si el GitHub App de la org no se puede instalar

Forkear a `Agupane/orbi` (el App ya está instalado en esa cuenta) y deployar desde el fork. Es un
parche temporal: el repo oficial debe ser `kosmic-nasa-hackathon/orbi`.

## Verificación

```bash
curl -sI https://orbi.agustinpane.xyz/
curl -s https://orbi.agustinpane.xyz/ | grep -o '<title>[^<]*</title>'

# Bypass Cloudflare, desde la VM de Dokploy
curl -s -H 'Host: orbi.agustinpane.xyz' http://127.0.0.1/

# Servicio y logs (nombre generado por Dokploy)
docker service ps <appName>
docker service logs <appName> --tail 50
```

Esperado: HTTP `200`, build de `main`, `SELECT`/`Today` visible y datos del día 148.

## Rollback

- En Dokploy, redeploy del commit anterior (historial de deployments de la app).
- O `git revert` del commit roto en `main` y push; el auto-deploy reconstruye.
- Al ser estático, no hay migraciones ni estado que revertir.

## Troubleshooting

| Síntoma | Qué revisar |
|---|---|
| Cloudflare 502/1033 | `systemctl status cloudflared` en LXC 114 y la entrada de ingress |
| 404 de Traefik | `/etc/dokploy/traefik/dynamic/<appName>.yml`: Host y puerto 80 |
| 502 de Traefik | `docker service ps <appName>`; el contenedor debe estar `Running` |
| Nginx error | `nginx -t` en LXC 114 y `systemctl reload nginx` |
| DNS no resuelve | CNAME proxied (`ttl: 1`) en la zona `agustinpane.xyz` |
| Deploy no arranca | GitHub App instalada en la org, repo accesible, branch `main` |
| Build falla | `npm ci` y `npm run build` en local con Node 22 |
| SPA da 404 al recargar | `try_files $uri $uri/ /index.html` en `nginx.conf` |
| El coach local no carga el modelo | `Content-Security-Policy` en `nginx.conf`: `connect-src 'self'` bloquea CDNs. Si se activa WebLLM, añade el origen del modelo a `connect-src`. |

## Ventanas sin deploys

Evitar deploys en **20:30–22:30** y **01:30–02:50 UTC**.

## Secretos

- No hay secretos de aplicación: la SPA es estática.
- `DOKPLOY_API_KEY` y el token de Cloudflare viven en Dokploy/Vaultwarden/Cloudflare, nunca en git.
- Si se usa el webhook por token, el `DOKPLOY_TOKEN` va como secret del repo y se trata como
  credencial: la URL es la única autenticación.
- La GitHub App evita guardar un PAT en el repo y evita que el token aparezca en logs de build.
