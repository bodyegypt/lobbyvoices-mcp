#!/usr/bin/env node
"use strict";

/**
 * lobbyvoices-mcp — local stdio bridge to Lobby's remote MCP server.
 *
 * The real MCP server lives at https://lobbyvoices.com/api/mcp (stateless
 * Streamable HTTP, no auth). This bridge exists only so MCP clients that
 * still require a local stdio process (or Glama's Docker-based build/deploy
 * flow) have something to run. It does no protocol work itself — it wraps
 * the maintained `mcp-remote` package (https://www.npmjs.com/package/mcp-remote),
 * which speaks stdio on one side and Streamable HTTP/SSE on the other.
 *
 * Usage:
 *   npx lobbyvoices-mcp
 *   node index.js
 *
 * Env:
 *   LOBBYVOICES_MCP_URL   override the remote endpoint (default: production)
 *
 * Any extra CLI args are passed straight through to mcp-remote (e.g. --debug,
 * --header "X-Foo: bar"). See https://www.npmjs.com/package/mcp-remote.
 */

const { spawnSync } = require("node:child_process");

const REMOTE_URL = process.env.LOBBYVOICES_MCP_URL || "https://lobbyvoices.com/api/mcp";

let proxyBin;
try {
  proxyBin = require.resolve("mcp-remote/dist/proxy.js");
} catch (err) {
  console.error(
    "[lobbyvoices-mcp] Could not find mcp-remote. Run `npm install` in this package first (or use `npx lobbyvoices-mcp`, which installs it automatically)."
  );
  process.exit(1);
}

const passthroughArgs = process.argv.slice(2);
const hasTransportFlag = passthroughArgs.includes("--transport");

// The remote server is stateless Streamable HTTP with no SSE endpoint, so we
// pin http-only and skip mcp-remote's SSE-fallback probing unless the caller
// explicitly overrides --transport.
const args = [
  proxyBin,
  REMOTE_URL,
  ...(hasTransportFlag ? [] : ["--transport", "http-only"]),
  ...passthroughArgs
];

const result = spawnSync(process.execPath, args, { stdio: "inherit" });

if (result.error) {
  console.error("[lobbyvoices-mcp] Failed to start the mcp-remote bridge:", result.error.message);
  process.exit(1);
}

process.exit(result.status === null ? 1 : result.status);
