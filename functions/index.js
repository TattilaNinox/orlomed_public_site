const { https } = require("firebase-functions");
const next = require("next");

const isDev = process.env.NODE_ENV !== "production";

const server = next({
  dev: isDev,
  conf: { distDir: "../.next" },
});

const handle = server.getRequestHandler();

exports.nextServer = https.onRequest((req, res) => {
  return server.prepare().then(() => handle(req, res));
});
