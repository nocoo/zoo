# CI And Automatic Deployment

`.github/workflows/ci.yml` runs on main pushes, pull requests targeting main and manual dispatch. The Check job installs the lockfile with Node 26.12.1, runs the existing content/audio/PWA checks, builds, checks the local health endpoint and performs a Wrangler dry run. These are basic project checks, not a comprehensive 6DQ suite. PR jobs receive no deployment credentials.

After Check succeeds, the main-only Deploy Production job builds the same commit and deploys the existing `zoo` Worker. Deployment is serialized without canceling an active upload. It checks remote main before setup and again before uploading, skipping superseded commits. Never deploy a pull-request branch or use `pull_request_target` to run untrusted code with secrets.

## One-Time Credential Setup

In GitHub repository Settings > Secrets and variables > Actions, add `CLOUDFLARE_API_TOKEN`. The production environment can alternatively hold this secret. Use a deployment API token scoped to the configured Cloudflare account, with Workers Scripts Write and the zone permissions required by the existing custom domain (Workers Routes Write and Zone Read). Account ID is public configuration in the workflow and `wrangler.jsonc`.

Never copy the local Wrangler/CF OAuth access or refresh tokens into CI, and never place tokens in files, logs or chat. A missing secret fails the deployment job explicitly. No speech/image-generation credentials are needed.

## Verify Latest Main

```sh
gh run list --repo nocoo/zoo --branch main --workflow ci.yml
gh run watch <run-id> --repo nocoo/zoo --exit-status
```

Check that the selected run's head SHA matches current remote main. The post-deploy verifier requests `/api/live` with a cache-busting query, verifies JSON, no-store, health and exact commit SHA, then compares deployed HTML, manifest, Apple icon, service worker and one HD image with the actual build bytes. Failures block a successful CD result; skipped deployments do not establish publication.

```sh
node scripts/verify-deployment.mjs https://zoo.hexly.ai <full-commit-sha>
```

This command requires `dist/` from that exact committed revision. Prefer Actions logs as evidence over rebuilding from an unrelated or dirty local tree. To retry after fixing the secret, rerun the latest main workflow from GitHub Actions rather than deploying an older successful build.
