# Changelog

## v1.0.1 - 2026-10-10

- Adopt the approved Zoo picture-card identity across the header, favicon, Apple Touch Icon and PWA icons while preserving existing illustrations and offline behavior.
- Add the Hexly project archive entry and complete Chinese and English documentation.
- Publish build-generated deployment health at `/api/live` with package version, source revision and `Cache-Control: no-store`; exclude health requests from service-worker caching.
- Add isolated local Worker health checks alongside existing content and PWA checks.
