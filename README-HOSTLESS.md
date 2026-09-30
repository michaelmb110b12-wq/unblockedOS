# Hostless deployment

This package is prepared for Hostless using the documented `hostless.yaml` schema.

Recommended Hostless settings:
- Build system: Docker
- Dockerfile path: `Dockerfile`
- Start command: `npm start`
- Replicas: 1
- Health check: TCP every 10 seconds

The server listens on `process.env.PORT` and binds to `0.0.0.0`.
