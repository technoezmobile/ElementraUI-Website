import { chromium } from "playwright";
import path from "path";

const ARTIFACT_DIR = "C:\\Users\\singh\\.gemini\\antigravity\\brain\\4d2b107c-acb9-40bf-ba51-5280999af7ec";
const BASE_URL = "http://localhost:5173";

async function run() {
  console.log("Launching browser for visual verification of 21st.dev redesign...");
  const browser = await chromium.launch({ headless: true });

  // 1. Desktop 1440x900 - Marketplace Home & Featured Shelves
  console.log("Capturing 1: Desktop Marketplace Home...");
  const pageDesktop = await browser.newPage({
    viewport: { width: 1440, height: 900 }
  });
  await pageDesktop.goto(BASE_URL, { waitUntil: "domcontentloaded" });
  await pageDesktop.waitForTimeout(2000);
  await pageDesktop.screenshot({
    path: path.join(ARTIFACT_DIR, "redesign_marketplace_home.png"),
    fullPage: false
  });

  // 2. Desktop - Component Discovery Grid (Scroll down to component grid)
  console.log("Capturing 2: Component Discovery Grid...");
  await pageDesktop.evaluate(() => {
    const scrollContainers = document.querySelectorAll(".overflow-y-auto");
    for (const c of scrollContainers) {
      if (c.scrollHeight > 1000) {
        c.scrollTop = 580;
      }
    }
  });
  await pageDesktop.waitForTimeout(1000);
  await pageDesktop.screenshot({
    path: path.join(ARTIFACT_DIR, "redesign_component_discovery.png"),
    fullPage: false
  });

  // 3. Desktop - Immersive Preview Modal (Direct URL param ?item=bento-grid)
  console.log("Capturing 3: Component Preview Modal (?item=bento-grid)...");
  const pageModal = await browser.newPage({
    viewport: { width: 1440, height: 900 }
  });
  await pageModal.goto(`${BASE_URL}/?item=bento-grid`, { waitUntil: "domcontentloaded" });
  await pageModal.waitForTimeout(2000);
  await pageModal.screenshot({
    path: path.join(ARTIFACT_DIR, "redesign_preview_modal.png"),
    fullPage: false
  });

  // 4. Mobile 390x844 Responsive
  console.log("Capturing 4: Mobile Responsive (390x844)...");
  const pageMobile = await browser.newPage({
    viewport: { width: 390, height: 844 },
    isMobile: true
  });
  await pageMobile.goto(BASE_URL, { waitUntil: "domcontentloaded" });
  await pageMobile.waitForTimeout(2000);
  await pageMobile.screenshot({
    path: path.join(ARTIFACT_DIR, "redesign_mobile_responsive.png"),
    fullPage: false
  });

  // 5. Tablet 768x1024 Responsive
  console.log("Capturing 5: Tablet Responsive (768x1024)...");
  const pageTablet = await browser.newPage({
    viewport: { width: 768, height: 1024 }
  });
  await pageTablet.goto(BASE_URL, { waitUntil: "domcontentloaded" });
  await pageTablet.waitForTimeout(2000);
  await pageTablet.screenshot({
    path: path.join(ARTIFACT_DIR, "redesign_tablet_responsive.png"),
    fullPage: false
  });

  await browser.close();
  console.log("All redesign verification screenshots captured successfully!");
}

run().catch((err) => {
  console.error("Screenshot capture failed:", err);
  process.exit(1);
});
