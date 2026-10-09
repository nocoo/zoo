# Initial Deployment

- Date: 2026-10-09
- Application revision: `3c90de8`
- Cloudflare account: Zheng Li Workspace
- Worker: `zoo`, assets-only
- Domain: https://zoo.hexly.ai
- Worker version: `c4c1aff5-a217-4c89-a411-1095ab0a5ab8`
- Local: https://zoo.dev.hexly.ai -> 127.0.0.1:7058
- Caddy template commit in Workflow: `7aa28a5`

## Verified

- `npm run check`: 246 unique cards, eight category counts, image existence and Chinese number labels.
- `npm run build`: strict TypeScript and Vite production build.
- `wrangler deploy --dry-run`: valid static Worker package.
- Chromium smoke checks: all categories, animal filters, number 100 and its 100 dots, modal previous/next and closing, favorites persistence, parent information, no horizontal overflow at 320/390/768/1440 pixels, no uncaught page errors.
- Production homepage and an animal image: HTTPS 200.
- Production mobile viewport: homepage, open animal card, visible content and close action.
- Local Caddy HTTPS: 200; existing wildcard certificate reused without certificate or trust-store changes.
- npm audit: zero findings after pinning the patched `sharp` transitive development dependency to 0.35.5. The installed Wrangler release otherwise pulled the affected image-processing dependency. No image-processing code runs in the deployed site.

Local screenshots are stored in ignored `artifacts/`. Audible speech and physical-device touch behavior were not independently verified. This is intentionally a basic smoke check, not a full quality-standard audit. Source commits were kept local; no Git push or GitHub release was requested.
