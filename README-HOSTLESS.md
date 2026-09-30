# SVG — Hostless deployment

This package keeps the uploaded SVG project and adds a Hostless-ready Docker/runtime configuration.

## Hostless settings
- Build system: Docker
- Dockerfile path: `./Dockerfile`
- Start command: `npm start`
- Replicas: 1
- Health check: HTTP `/health`

The server listens on the `PORT` environment variable supplied by Hostless and binds to `0.0.0.0`.

The root URL serves `embed.html` so the app has a working landing page, while the Wisp WebSocket endpoint remains `/ws/`.
