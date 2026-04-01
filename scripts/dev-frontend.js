const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

const ROOT_DIR = process.cwd();
const PORT = Number(process.env.PORT || 5500);
const HOST = process.env.HOST || "127.0.0.1";

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".eot": "application/vnd.ms-fontobject",
  ".map": "application/json; charset=utf-8"
};

const ROUTE_REDIRECTS = {
  "/sign-up": "/admin%20src/build/pages/sign-up.html",
  "/sign-in": "/admin%20src/build/pages/sign-in.html",
  "/admin-dashboard": "/admin%20src/build/pages/admin-dashboard.html",
  "/teacher-dashboard": "/admin%20src/build/pages/teacher-dashboard.html",
  "/student-dashboard": "/admin%20src/build/pages/student-dashboard.html",
  "/admin-management": "/admin%20src/build/pages/admin-management.html",
  "/courses": "/course.html",
  "/my-courses": "/course.html",
  "/library": "/library.html",
  "/progress": "/admin%20src/build/pages/student-dashboard.html#progress-overview",
  "/classroom-1": "/classroom_1.html",
  "/classroom-2": "/classroom_2.html"
};

function send(res, statusCode, body, contentType = "text/plain; charset=utf-8") {
  res.writeHead(statusCode, { "Content-Type": contentType });
  res.end(body);
}

function resolveFilePath(requestUrl) {
  const parsedUrl = new URL(requestUrl, `http://${HOST}:${PORT}`);
  const decodedPath = decodeURIComponent(parsedUrl.pathname);
  const relativePath = decodedPath === "/" ? "/index.html" : decodedPath;
  const normalizedPath = path.normalize(relativePath).replace(/^(\.\.[/\\])+/, "");
  const absolutePath = path.join(ROOT_DIR, normalizedPath);

  if (!absolutePath.startsWith(ROOT_DIR)) {
    return null;
  }

  return absolutePath;
}

function tryServeFile(filePath, res) {
  fs.stat(filePath, (statError, stats) => {
    if (statError) {
      send(res, 404, "Not found");
      return;
    }

    const finalPath = stats.isDirectory() ? path.join(filePath, "index.html") : filePath;

    fs.readFile(finalPath, (readError, content) => {
      if (readError) {
        send(res, 404, "Not found");
        return;
      }

      const ext = path.extname(finalPath).toLowerCase();
      const contentType = MIME_TYPES[ext] || "application/octet-stream";
      send(res, 200, content, contentType);
    });
  });
}

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url || "/", `http://${HOST}:${PORT}`);
  const redirectTarget = ROUTE_REDIRECTS[parsedUrl.pathname];

  if (redirectTarget) {
    res.writeHead(302, { Location: redirectTarget });
    res.end();
    return;
  }

  const filePath = resolveFilePath(req.url || "/");

  if (!filePath) {
    send(res, 403, "Forbidden");
    return;
  }

  tryServeFile(filePath, res);
});

server.listen(PORT, HOST, () => {
  console.log(`Dzidzo frontend running at http://${HOST}:${PORT}/`);
});
