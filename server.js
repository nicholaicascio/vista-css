#!/usr/bin/env node
/**
 * Development server: rebuilds on source changes and live-reloads the docs.
 *   npm start
 */

const chokidar = require("chokidar");
const liveServer = require("live-server");
const build = require("./build");

let running = false;
let queued = false;

async function rebuild(reason) {
  if (running) {
    queued = true;
    return;
  }
  running = true;
  try {
    console.log(`\n[build] ${reason}`);
    await build();
  } catch (err) {
    console.error(err);
  } finally {
    running = false;
    if (queued) {
      queued = false;
      rebuild("queued change");
    }
  }
}

chokidar
  .watch(["gui/**/*", "themes/**/*", "docs/**/*"], { ignoreInitial: true })
  .on("all", (_event, file) => rebuild(file));

build().then(() => {
  liveServer.start({
    root: "dist",
    port: 8080,
    open: true,
    wait: 200,
    logLevel: 1,
  });
});
