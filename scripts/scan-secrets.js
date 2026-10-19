import fs from "node:fs";
import path from "node:path";

const secretPatterns = [
  /api[_-]?key\s*[:=]\s*['"][a-zA-Z0-9_\-\.]{16,}['"]/i,
  /secret\s*[:=]\s*['"][a-zA-Z0-9_\-\.]{16,}['"]/i,
  /bearer\s+[a-zA-Z0-9_\-\.]{20,}/i,
  /BEGIN (RSA|OPENSSH|DSA|EC|PRIVATE) KEY/
];

let detections = 0;

function scanDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === "node_modules" || entry.name === ".git" || entry.name === "dist") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== ".cache") scanDir(full);
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if ([".ts", ".tsx", ".js", ".jsx", ".json", ".md", ".html", ".css"].includes(ext)) {
        const content = fs.readFileSync(full, "utf8");
        for (const p of secretPatterns) {
          if (p.test(content)) {
            console.log(`[ALERT] Potential secret pattern matched in: ${full}`);
            detections++;
          }
        }
      }
    }
  }
}

console.log("=== Scanning project files for hardcoded secrets & credentials ===");
scanDir(".");
console.log(`Scan finished. Total detections: ${detections}`);
