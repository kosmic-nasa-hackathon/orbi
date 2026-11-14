# DEPLOYMENT — ORBI

Producción: **https://orbi.agustinpane.xyz** (desplegada y verificada el 2026-11-14).
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
| App Dokploy | `ORBI` |
| `applicationId` | `pnNCsfPVhaq6_lgsFDTEF` |
| `appName` | `app-input-open-source-panel-hqyoop` |
| Dominio | `orbi.agustinpane.xyz` |
| Puerto del contenedor | `80` |
| Origen | `git@github.com:kosmic-nasa-hackathon/orbi.git`, branch `main` (deploy key SSH `orbi-deploy`) |
| Build | `Dockerfile` en la raíz, contexto `/` |
| TLS | Cloudflare; en Dokploy el dominio va con `https: false` |
| Base de datos | ninguna |
| Preview por PR | no; solo producción |
| Auto-deploy | runner self-hosted `dokploy` (label `orbi`) + token webhook de Dokploy |

## Estado actual

La app ya está creada, desplegada y con auto-deploy verificado:

- Push a `main` → CI → workflow `deploy` en el runner `dokploy` → Dokploy despliega `main`.
- Dominio `https://orbi.agustinpane.xyz` responde `200` con el build actual.
- El runner corre en la VM de Dokploy como servicio `actions-runner-orbi.service`.
- Secret del repo: `DOKPLOY_TOKEN`. Variable: `DOKPLOY_AUTO_DEPLOY=true`.

## Prerrequisitos

1. **Admin del repo/org** (`kosmic-nasa-hackathon`) para deploy keys, webhooks y secretos.
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

La app ya está provisionada (`applicationId` arriba). Estos comandos sirven para recrearla o
replicarla en otra instancia. Las llamadas usan `x-api-key` (no `Authorization: Bearer`). Guarda la
key en Dokploy/Vaultwarden, nunca en el repo.

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

### 2. Deploy key y origen Git

El repo es privado y la org no tiene instalada la GitHub App de Dokploy, así que el origen es
**Git por SSH con un deploy key**:

```bash
# En la VM de Dokploy
ssh-keygen -t ed25519 -N '' -C 'orbi-dokploy-deploy' -f /tmp/orbi-deploy
cat /tmp/orbi-deploy.pub
```

1. La org debe permitir deploy keys (`deploy_keys_enabled_for_repositories=true`).
2. Añade la clave pública al repo como **deploy key de solo lectura** (Settings → Deploy keys, o
   `gh api -X POST repos/kosmic-nasa-hackathon/orbi/keys -f title='Dokploy ORBI' -f key="<pub>" -F read_only=true`).
3. Crea la SSH key en Dokploy (tRPC, requiere `organizationId`):

```bash
jq -n --arg name "orbi-deploy" --arg desc "Deploy key for kosmic-nasa-hackathon/orbi" \
  --arg priv "$(cat /tmp/orbi-deploy)" --arg pub "$(cat /tmp/orbi-deploy.pub)" \
  '{json:{name:$name,description:$desc,privateKey:$priv,publicKey:$pub,organizationId:"74WBYJmQBJ9tmjP--JaHb"}}' \
  | dokploy-api POST trpc/sshKey.create -
```

Guarda el `sshKeyId` y configura el origen:

```bash
curl -s -X POST "$DOKPLOY_URL/api/application.update" \
  -H "x-api-key: $DOKPLOY_API_KEY" -H 'Content-Type: application/json' \
  -d "{\"applicationId\":\"$APP_ID\",\"sourceType\":\"git\",\"customGitUrl\":\"git@github.com:kosmic-nasa-hackathon/orbi.git\",\"customGitBranch\":\"main\",\"customGitBuildPath\":\"/\",\"customGitSSHKeyId\":\"<SSH_KEY_ID>\",\"buildType\":\"dockerfile\",\"autoDeploy\":true}"
```

`autoDeploy: true` es necesario para que el token webhook acepte el deploy.

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

Ya configurado y verificado. Se documenta para recrearlo.

### DNS

CNAME `orbi` → `0bbb0bcf-863a-4f57-9b3a-353761b91799.cfargotunnel.com`, **proxied**
(registro DNS id `0ddc2edc3d652ef424f670155a3b1d05` en la zona `agustinpane.xyz`).

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

### Implementado: runner self-hosted + token webhook

Los webhooks por token (`/api/deploy/<refreshToken>`) **siguen detrás de Cloudflare Access**; por eso
no funcionan desde un runner GitHub-hosted. La solución desplegada es un runner self-hosted en la
propia VM de Dokploy:

| Item | Valor |
|---|---|
| Runner | `dokploy` (labels `self-hosted`, `Linux`, `X64`, `orbi`) |
| Directorio | `/opt/actions-runner` |
| Usuario | `github-runner` |
| Servicio | `actions-runner-orbi.service` |
| Workflow | `.github/workflows/deploy.yml` |
| Secret del repo | `DOKPLOY_TOKEN` (refreshToken de la app en Dokploy) |
| Variable del repo | `DOKPLOY_AUTO_DEPLOY=true` |

Flujo: push a `main` → `ci` → `deploy` (workflow_run) en el runner → POST a
`http://192.168.1.115:3000/api/deploy/$DOKPLOY_TOKEN` con `x-github-event: push` y
`{"ref":"refs/heads/main"}`. Si CI falla, el deploy no corre.

El workflow también se puede lanzar a mano con **Actions → deploy → Run workflow**. Si
`DOKPLOY_AUTO_DEPLOY` no existe o no es `true`, el job se salta y no falla.

Un `301` con `{"message":"Branch Not Match"}` significa que el branch del payload no coincide con
el configurado en Dokploy; no lo reintentes como si fuera un error de red.

### Alternativa: GitHub App de Dokploy

Si en el futuro se instala la GitHub App de Dokploy en la org `kosmic-nasa-hackathon`, se puede
cambiar el origen a `sourceType=github` y usar `autoDeploy`; el endpoint `/api/deploy/github` ya
tiene bypass de Cloudflare Access en BCN. No es necesario con el runner actual.

## Verificación

```bash
curl -sI https://orbi.agustinpane.xyz/
curl -s https://orbi.agustinpane.xyz/ | grep -o '<title>[^<]*</title>'

# Bypass Cloudflare, desde la VM de Dokploy
curl -s -H 'Host: orbi.agustinpane.xyz' http://127.0.0.1/

# Servicio y logs (nombre generado por Dokploy)
docker service ps app-input-open-source-panel-hqyoop
docker service logs app-input-open-source-panel-hqyoop --tail 50
```

Esperado: HTTP `200`, build de `main`, consola del motor visible y datos del día 148.

## Rollback

- En Dokploy, redeploy del commit anterior (historial de deployments de la app).
- O `git revert` del commit roto en `main` y push; el auto-deploy reconstruye.
- Al ser estático, no hay migraciones ni estado que revertir.

## Troubleshooting

| Síntoma | Qué revisar |
|---|---|
| Cloudflare 502/1033 | `systemctl status cloudflared` en LXC 114 y la entrada de ingress |
| 404 de Traefik | `/etc/dokploy/traefik/dynamic/app-input-open-source-panel-hqyoop.yml`: Host y puerto 80 |
| 502 de Traefik | `docker service ps app-input-open-source-panel-hqyoop`; el contenedor debe estar `Running` |
| Nginx error | `nginx -t` en LXC 114 y `systemctl reload nginx` |
| DNS no resuelve | CNAME proxied (`ttl: 1`) en la zona `agustinpane.xyz` |
| Deploy no arranca | `systemctl status actions-runner-orbi`, el runner debe estar `online` en GitHub y `autoDeploy` debe ser `true` |
| Deploy 400 "Automatic deployments are disabled" | Activar `autoDeploy` en la app de Dokploy |
| Build falla | `npm ci` y `npm run build` en local con Node 22 |
| SPA da 404 al recargar | `try_files $uri $uri/ /index.html` en `nginx.conf` |
| El coach local no carga el modelo | `Content-Security-Policy` en `nginx.conf`: `connect-src 'self'` bloquea CDNs. Si se activa WebLLM, añade el origen del modelo a `connect-src`. |

## Ventanas sin deploys

Evitar deploys en **20:30–22:30** y **01:30–02:50 UTC**.

## Secretos

- No hay secretos de aplicación: la SPA es estática.
- `DOKPLOY_API_KEY` y el token de Cloudflare viven en Dokploy/Vaultwarden/Cloudflare, nunca en git.
- `DOKPLOY_TOKEN` va como secret del repo y se trata como credencial: la URL del webhook es la
  única autenticación. El runner lo inyecta en el `curl` sin escribirlo en logs.
- La deploy key `orbi-deploy` vive en Dokploy y su pública en GitHub; es de solo lectura.
  Rótala si se filtra o si alguien deja de tener acceso a la infraestructura.
- La GitHub App de Dokploy no es necesaria con el runner actual; si se usa, evita guardar un PAT
  en el repo y evita que el token aparezca en logs de build.
