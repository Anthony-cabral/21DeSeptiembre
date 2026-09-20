import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('.', import.meta.url));
const port = Number(process.env.PORT || 4174);

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp'
};

http.createServer(async (req, res) => {
  try {
    if (!['GET', 'HEAD'].includes(req.method)) {
      res.writeHead(405, { Allow: 'GET, HEAD' });
      res.end();
      return;
    }

    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
    const relative = path.relative(root, file);

    const publicFile =
      ['index.html', 'styles.css', 'app.js', 'countdown.js'].includes(relative) ||
      relative.startsWith('assets' + path.sep);

    if (!publicFile || relative.startsWith('..') || path.isAbsolute(relative)) {
      res.writeHead(404);
      res.end('No encontrado');
      return;
    }

    const contents = await readFile(file);
    const ext = path.extname(file);
    const isAsset = relative.startsWith('assets' + path.sep);

    res.writeHead(200, {
      'Content-Type': mime[ext] || 'application/octet-stream',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'no-referrer',
      'Cache-Control': isAsset ? 'public, max-age=86400' : 'no-cache',
      'Content-Security-Policy': "default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; font-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'"
    });

    res.end(req.method === 'HEAD' ? undefined : contents);
  } catch {
    res.writeHead(404);
    res.end('No encontrado');
  }
}).listen(port, '0.0.0.0', () => {
  console.log(`Tu jardín está en http://localhost:${port}`);
});
