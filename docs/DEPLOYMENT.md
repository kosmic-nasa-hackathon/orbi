# DEPLOYMENT — ORBI

Release preview: **https://orbi.agustinpane.xyz** (deployed and verified on 2026-11-14).
Infra: **Dokploy BCN**, behind **Cloudflare** and the `bcn` tunnel.

The app is a static SPA: Node 22 compiles `dist/`, nginx serves it on port 80 and Dokploy
publishes it behind Traefik. There is no backend, database or application environment variables.

## Branch model

- `development` is the default branch and the integration target for every PR.
- `main` is release-only. The integrator opens a `development` → `main` release PR; merging it
  runs CI and the auto-deploy workflow.
- Dokploy builds `main`, so the preview always matches the latest release.

## Network path

```text
Cloudflare (TLS, zone agustinpane.xyz)
  └─> Cloudflare Tunnel "bcn" (LXC 114, 192.168.1.114)
        └─> nginx :80 (server_name orbi.agustinpane.xyz)
              └─> Dokploy Traefik :80 (192.168.1.115)
                    └─> ORBI container (nginx:alpine, port 80)
```

## Infrastructure

| Item | Value |
|---|---|
| Dokploy | `https://dokploy-bcn.agustinpane.xyz` (panel behind Cloudflare Access) |
| Dokploy VM | `192.168.1.115` |
| Project / environment | `Aplicaciones` (`FLGNQAu7z6UkAazPxu9r9`) / `production` (`uYxpUkNVX3jzl0fyehPy-`) |
| Dokploy app | `ORBI` |
| `applicationId` | `pnNCsfPVhaq6_lgsFDTEF` |
| `appName` | `app-input-open-source-panel-hqyoop` |
| Domain | `orbi.agustinpane.xyz` |
| Container port | `80` |
| Source | `git@github.com:kosmic-nasa-hackathon/orbi.git`, branch `main` (SSH deploy key `orbi-deploy`) |
| Build | `Dockerfile` at the root, context `/` |
| TLS | Cloudflare; in Dokploy the domain uses `https: false` |
| Database | none |
| Per-PR preview | no; release preview only |
| Auto-deploy | self-hosted runner `dokploy` (label `orbi`) + Dokploy webhook token |

## Current state

The app is already created, deployed and with auto-deploy verified:

- Release merge into `main` → CI → `deploy` workflow on the `dokploy` runner → Dokploy deploys `main`.
- Domain `https://orbi.agustinpane.xyz` responds `200` with the current build.
- F0 (#11) deployed on 2026-11-14 via release PR #37.
- The runner runs on the Dokploy VM as the `actions-runner-orbi.service` service.
- Repo secret: `DOKPLOY_TOKEN`. Variable: `DOKPLOY_AUTO_DEPLOY=true`.

## Prerequisites

1. **Repo/org admin** (`kosmic-nasa-hackathon`) for deploy keys, webhooks and secrets.
2. **Write on the repo** for whoever will push branches and PRs.
3. **Dokploy access**: API key (`DOKPLOY_API_KEY`) and panel/API reachable.
4. **Cloudflare access**: zone `agustinpane.xyz` and tunnel `bcn`.
5. **Access to LXC 114** to edit the cloudflared ingress and the nginx vhost.

## Build

Multi-stage `Dockerfile`:

1. `node:22-bookworm-slim` installs with `npm ci`.
2. `npm run build` (`tsc --noEmit && vite build`) generates `dist/`.
3. `nginx:1.27-alpine` serves `dist/` with `nginx.conf` (SPA fallback, asset cache, healthcheck).

`.dockerignore` excludes docs, markdown and `.github/`. A docs-only release can therefore reuse the
Docker cache, keep the same image and avoid restarting the service; that is expected, not a failed
deploy. App releases rebuild and update the container.

```bash
npm ci
npm run check
npm run build
docker build -t orbi:local .
docker run --rm -p 8080:80 orbi:local
curl -I http://localhost:8080/
```

## Provision Dokploy

The app is already provisioned (`applicationId` above). These commands serve to recreate it or
replicate it on another instance. Calls use `x-api-key` (not `Authorization: Bearer`). Store the
key in Dokploy/Vaultwarden, never in the repo.

```bash
export DOKPLOY_URL=https://dokploy-bcn.agustinpane.xyz
export DOKPLOY_API_KEY=...   # do not paste it in chat or git
```

### 1. Create the app

```bash
curl -s -X POST "$DOKPLOY_URL/api/application.create" \
  -H "x-api-key: $DOKPLOY_API_KEY" -H 'Content-Type: application/json' \
  -d '{"projectId":"FLGNQAu7z6UkAazPxu9r9","environmentId":"uYxpUkNVX3jzl0fyehPy-","name":"ORBI"}'
```

The response returns the `applicationId`. Save it as `APP_ID`.

### 2. Deploy key and Git source

The repo is private and the org does not have Dokploy's GitHub App installed, so the source is
**Git over SSH with a deploy key**:

```bash
# On the Dokploy VM
ssh-keygen -t ed25519 -N '' -C 'orbi-dokploy-deploy' -f /tmp/orbi-deploy
cat /tmp/orbi-deploy.pub
```

1. The org must allow deploy keys (`deploy_keys_enabled_for_repositories=true`).
2. Add the public key to the repo as a **read-only deploy key** (Settings → Deploy keys, or
   `gh api -X POST repos/kosmic-nasa-hackathon/orbi/keys -f title='Dokploy ORBI' -f key="<pub>" -F read_only=true`).
3. Create the SSH key in Dokploy (tRPC, requires `organizationId`):

```bash
jq -n --arg name "orbi-deploy" --arg desc "Deploy key for kosmic-nasa-hackathon/orbi" \
  --arg priv "$(cat /tmp/orbi-deploy)" --arg pub "$(cat /tmp/orbi-deploy.pub)" \
  '{json:{name:$name,description:$desc,privateKey:$priv,publicKey:$pub,organizationId:"74WBYJmQBJ9tmjP--JaHb"}}' \
  | dokploy-api POST trpc/sshKey.create -
```

Save the `sshKeyId` and configure the source:

```bash
curl -s -X POST "$DOKPLOY_URL/api/application.update" \
  -H "x-api-key: $DOKPLOY_API_KEY" -H 'Content-Type: application/json' \
  -d "{\"applicationId\":\"$APP_ID\",\"sourceType\":\"git\",\"customGitUrl\":\"git@github.com:kosmic-nasa-hackathon/orbi.git\",\"customGitBranch\":\"main\",\"customGitBuildPath\":\"/\",\"customGitSSHKeyId\":\"<SSH_KEY_ID>\",\"buildType\":\"dockerfile\",\"autoDeploy\":true}"
```

`autoDeploy: true` is required for the webhook token to accept the deploy.

### 3. Build type and domain

```bash
curl -s -X POST "$DOKPLOY_URL/api/application.saveBuildType" \
  -H "x-api-key: $DOKPLOY_API_KEY" -H 'Content-Type: application/json' \
  -d "{\"applicationId\":\"$APP_ID\",\"buildType\":\"dockerfile\"}"

curl -s -X POST "$DOKPLOY_URL/api/domain.create" \
  -H "x-api-key: $DOKPLOY_API_KEY" -H 'Content-Type: application/json' \
  -d "{\"applicationId\":\"$APP_ID\",\"host\":\"orbi.agustinpane.xyz\",\"port\":80,\"https\":false,\"path\":\"/\"}"
```

Do not enable Let's Encrypt: Cloudflare terminates TLS.

### 4. First deploy

```bash
curl -s -X POST "$DOKPLOY_URL/api/application.deploy" \
  -H "x-api-key: $DOKPLOY_API_KEY" -H 'Content-Type: application/json' \
  -d "{\"applicationId\":\"$APP_ID\",\"title\":\"Initial deploy\"}"
```

Check `applicationStatus` (`idle` → `running` → `done`/`error`) and the logs in
`/etc/dokploy/logs/<appName>/` on the VM.

## Cloudflare, tunnel and nginx

Already configured and verified. Documented so it can be recreated.

### DNS

CNAME `orbi` → `0bbb0bcf-863a-4f57-9b3a-353761b91799.cfargotunnel.com`, **proxied**
(DNS record id `0ddc2edc3d652ef424f670155a3b1d05` in the `agustinpane.xyz` zone).

### Tunnel ingress (LXC 114)

In `/root/.cloudflared/config.yml`, before the catch-all:

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

Do not put Cloudflare Access on `orbi.agustinpane.xyz`: the jury must be able to enter without login.

## Auto-deploy

### Implemented: self-hosted runner + webhook token

Token webhooks (`/api/deploy/<refreshToken>`) **remain behind Cloudflare Access**; that is why
they do not work from a GitHub-hosted runner. The deployed solution is a self-hosted runner on the
Dokploy VM itself:

| Item | Value |
|---|---|
| Runner | `dokploy` (labels `self-hosted`, `Linux`, `X64`, `orbi`) |
| Directory | `/opt/actions-runner` |
| User | `github-runner` |
| Service | `actions-runner-orbi.service` |
| Workflow | `.github/workflows/deploy.yml` |
| Repo secret | `DOKPLOY_TOKEN` (the app's refreshToken in Dokploy) |
| Repo variable | `DOKPLOY_AUTO_DEPLOY=true` |

Flow: release merge into `main` → `ci` → `deploy` (workflow_run) on the runner → POST to
`http://192.168.1.115:3000/api/deploy/$DOKPLOY_TOKEN` with `x-github-event: push` and
`{"ref":"refs/heads/main"}`. If CI fails, the deploy does not run.

The workflow can also be launched manually with **Actions → deploy → Run workflow**. If
`DOKPLOY_AUTO_DEPLOY` does not exist or is not `true`, the job is skipped and does not fail.

A `301` with `{"message":"Branch Not Match"}` means the payload branch does not match the one
configured in Dokploy; do not retry it as if it were a network error.

### Alternative: Dokploy GitHub App

If in the future Dokploy's GitHub App is installed in the `kosmic-nasa-hackathon` org, the source
can be changed to `sourceType=github` and use `autoDeploy`; the `/api/deploy/github` endpoint
already has a Cloudflare Access bypass in BCN. It is not necessary with the current runner.

## Verification

```bash
curl -sI https://orbi.agustinpane.xyz/
curl -s https://orbi.agustinpane.xyz/ | grep -o '<title>[^<]*</title>'

# Bypass Cloudflare, from the Dokploy VM
curl -s -H 'Host: orbi.agustinpane.xyz' http://127.0.0.1/

# Service and logs (name generated by Dokploy)
docker service ps app-input-open-source-panel-hqyoop
docker service logs app-input-open-source-panel-hqyoop --tail 50
```

Expected: HTTP `200`, build from `main`, engine console visible and day 148 data.

## Rollback

- In Dokploy, redeploy the previous commit (the app's deployment history).
- Or `git revert` the broken commit on `main` through a hotfix release; auto-deploy rebuilds.
- Being static, there are no migrations or state to revert.

## Troubleshooting

| Symptom | What to check |
|---|---|
| Cloudflare 502/1033 | `systemctl status cloudflared` on LXC 114 and the ingress entry |
| Traefik 404 | `/etc/dokploy/traefik/dynamic/app-input-open-source-panel-hqyoop.yml`: Host and port 80 |
| Traefik 502 | `docker service ps app-input-open-source-panel-hqyoop`; the container must be `Running` |
| Nginx error | `nginx -t` on LXC 114 and `systemctl reload nginx` |
| DNS does not resolve | proxied CNAME (`ttl: 1`) in the `agustinpane.xyz` zone |
| Deploy does not start | `systemctl status actions-runner-orbi`, the runner must be `online` in GitHub and `autoDeploy` must be `true` |
| Deploy 400 "Automatic deployments are disabled" | Enable `autoDeploy` in the Dokploy app |
| Build fails | `npm ci` and `npm run build` locally with Node 22 |
| SPA returns 404 on reload | `try_files $uri $uri/ /index.html` in `nginx.conf` |
| The local coach does not load the model | `Content-Security-Policy` in `nginx.conf`: `connect-src 'self'` blocks CDNs. If WebLLM is enabled, add the model origin to `connect-src`. |

## Deploy-free windows

Avoid deploys at **20:30–22:30** and **01:30–02:50 UTC**.

## Secrets

- There are no application secrets: the SPA is static.
- `DOKPLOY_API_KEY` and the Cloudflare token live in Dokploy/Vaultwarden/Cloudflare, never in git.
- `DOKPLOY_TOKEN` goes as a repo secret and is treated as a credential: the webhook URL is the
  only authentication. The runner injects it into the `curl` without writing it to logs.
- The `orbi-deploy` deploy key lives in Dokploy and its public part in GitHub; it is read-only.
  Rotate it if leaked or if someone loses access to the infrastructure.
- Dokploy's GitHub App is not necessary with the current runner; if used, avoid storing a PAT
  in the repo and avoid the token appearing in build logs.
