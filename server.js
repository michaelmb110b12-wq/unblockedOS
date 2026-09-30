const http = require('http');
const fs = require('fs');
const path = require('path');
const { createWispServer } = require('wisp-server-node');

const PORT = process.env.PORT || 3000;

const MIME = {
  '.html': 'text/html',
  '.svg': 'image/svg+xml',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.css': 'text/css',
  '.mp4': 'video/mp4',
  '.wasm': 'application/wasm',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain',
  '.json': 'application/json'
};

const server = http.createServer(function(req, res) {
  var urlPath = req.url.split('?')[0];

  if (urlPath === '/health') {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' });
    res.end('ok');
    return;
  }

  if (urlPath === '/' || urlPath === '') urlPath = '/index.html';
  var filePath = path.join(__dirname, urlPath);
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }
  fs.readFile(filePath, function(err, data) {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found: ' + urlPath);
      return;
    }
    var ext = path.extname(filePath).toLowerCase();
    var mime = MIME[ext] || 'application/octet-stream';
    res.writeHead(200, {
      'Content-Type': mime,
      'Cache-Control': 'no-cache',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp'
    });
    res.end(data);
  });
});

createWispServer({ server: server, path: '/ws/' });

server.listen(Number(PORT), '0.0.0.0', function() {
  console.log('CineWeb running on port ' + PORT);
});
