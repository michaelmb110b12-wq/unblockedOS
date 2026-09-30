const http = require('http');
const fs = require('fs');
const path = require('path');
const { createWispServer } = require('wisp-server-node');

const PORT = Number.parseInt(process.env.PORT || '3000', 10);
const HOST = process.env.HOST || '0.0.0.0';
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.mp4': 'video/mp4',
  '.wasm': 'application/wasm',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.json': 'application/json; charset=utf-8'
};

function safePath(urlPath) {
  let pathname;
  try {
    pathname = decodeURIComponent(urlPath.split('?')[0] || '/');
  } catch {
    return null;
  }

  if (pathname === '/' || pathname === '') pathname = '/embed.html';

  const filePath = path.resolve(ROOT, '.' + pathname);
  if (filePath !== ROOT && !filePath.startsWith(ROOT + path.sep)) return null;
  return filePath;
}

const server = http.createServer((req, res) => {
  const urlPath = req.url || '/';

  if (urlPath === '/health' || urlPath.startsWith('/health?')) {
    res.writeHead(200, {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store'
    });
    res.end('ok');
    return;
  }

  // Wisp uses WebSocket upgrades on /ws/. The Wisp server handles those
  // upgrade requests; ordinary HTTP requests continue through this handler.
  const filePath = safePath(urlPath);
  if (!filePath) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(err.code === 'ENOENT' ? 404 : 500, {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store'
      });
      res.end(err.code === 'ENOENT' ? 'Not found' : 'Internal server error');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Cache-Control': 'no-cache',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp'
    });
    res.end(data);
  });
});

createWispServer({ server, path: '/ws/' });

server.listen(PORT, HOST, () => {
  console.log(`SVG app listening on http://${HOST}:${PORT}`);
  console.log(`Wisp endpoint available at /ws/`);
});

function shutdown(signal) {
  console.log(`${signal} received, shutting down...`);
  server.close(() => process.exit(0));
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
