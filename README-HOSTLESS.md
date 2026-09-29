# CineWeb — Hostless-ready

This is the supplied `codiesnutkiss-sudo/svg` repository with a small Hostless packaging layer.

## Hostless
Use **Create an app → Docker** and point it at the repository root.

- Dockerfile: `Dockerfile`
- Start command: `npm start`
- Port: the app uses `process.env.PORT`
- Health endpoint: `/health`

The original proxy endpoint remains:

`/ws/`

The supplied repository did not include an `index.html`, so this package adds a small launcher at `/` that links to the original `embed.html?url=...` endpoint.

The original runtime files and assets are otherwise preserved.
