#!/usr/bin/env node

/**
 * ElementraUI — Production Build Browser Test Runner
 *
 * Boots Vite preview server on dist/, executes Playwright browser tests
 * against the production build, verifies real rendering of community assets,
 * and shuts down cleanly.
 */

import { spawn } from "node:child_process";
import http from "node:http";
import path from "node:path";
import fs from "node:fs";

console.log("=================================================================");
console.log("   ELEMENTRAUI: PRODUCTION BUILD BROWSER TEST RUNNER             ");
console.log("=================================================================\n");

const PORT = 4173;
const PREVIEW_URL = `http://127.0.0.1:${PORT}`;
const DIST_DIR = path.resolve("dist");
const ASSETS_DIR = path.resolve("dist/awesome-components");

if (!fs.existsSync(DIST_DIR) || !fs.existsSync(ASSETS_DIR)) {
  console.error("✗ BLOCKING ERROR: Production build not found or missing dist/awesome-components.");
  console.error("  Run 'npm run build' before executing production browser tests.\n");
  process.exit(1);
}

// Helper to wait for server to respond
function waitForServer(url, timeoutMs = 20000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const check = () => {
      const req = http.get(url, (res) => {
        if (res.statusCode === 200 || res.statusCode === 304) {
          resolve(true);
        } else {
          setTimeout(check, 300);
        }
      });
      req.on("error", () => {
        if (Date.now() - start > timeoutMs) {
          reject(new Error(`Server did not respond within ${timeoutMs}ms at ${url}`));
        } else {
          setTimeout(check, 300);
        }
      });
    };
    check();
  });
}

async function main() {
  console.log(`Starting Vite preview server on ${PREVIEW_URL} (serving ${DIST_DIR})...`);
  
  const isWindows = process.platform === "win32";
  const previewProcess = spawn(
    isWindows ? "npx.cmd" : "npx",
    ["vite", "preview", "--port", String(PORT), "--strictPort"],
    {
      stdio: "pipe",
      shell: true,
      env: { ...process.env, PORT: String(PORT) }
    }
  );

  previewProcess.stdout.on("data", (d) => {
    const str = d.toString();
    if (str.includes("Local:") || str.includes("Network:")) {
      process.stdout.write(`  [preview] ${str.trim()}\n`);
    }
  });

  previewProcess.stderr.on("data", (d) => {
    process.stderr.write(`  [preview err] ${d.toString()}`);
  });

  let serverStarted = false;
  try {
    await waitForServer(PREVIEW_URL, 20000);
    serverStarted = true;
    console.log(`✓ Preview server is ready at ${PREVIEW_URL}\n`);

    // Import and execute the QA browser suite
    console.log("Executing Playwright browser suite against production build...\n");
    process.env.BASE_URL = PREVIEW_URL;

    const { execSync } = await import("node:child_process");
    execSync(`node scripts/qa-browser-tests.js`, {
      stdio: "inherit",
      env: { ...process.env, BASE_URL: PREVIEW_URL }
    });

    console.log("\n✓ All production browser tests completed successfully!");
  } catch (err) {
    console.error("\n✗ Production browser testing failed:", err.message);
    process.exitCode = 1;
  } finally {
    console.log("\nShutting down preview server...");
    if (previewProcess && !previewProcess.killed) {
      if (isWindows) {
        // Kill process tree on Windows
        try {
          execSync(`taskkill /pid ${previewProcess.pid} /T /F`, { stdio: "pipe" });
        } catch (e) {
          previewProcess.kill();
        }
      } else {
        previewProcess.kill("SIGTERM");
      }
    }
    console.log("Preview server stopped.\n");
  }
}

main();
