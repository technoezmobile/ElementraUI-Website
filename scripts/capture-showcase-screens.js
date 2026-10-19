import { chromium } from "playwright";
import path from "node:path";
import fs from "node:fs";

const ARTIFACT_DIR = "C:/Users/singh/.gemini/antigravity/brain/4d2b107c-acb9-40bf-ba51-5280999af7ec";
const BASE_URL = "http://127.0.0.1:5173";

async function main() {
  if (!fs.existsSync(ARTIFACT_DIR)) {
    fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
  }

  console.log("Launching browser to capture showcase screens...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2
  });
  const page = await context.newPage();

  // 1. Marketplace Home / Spotlight
  console.log("Capturing 1. Marketplace Home...");
  await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForSelector('main', { timeout: 60000 });
  await page.waitForTimeout(2000);
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, "showcase_marketplace_home.png")
  });

  // 2. Component Discovery with search input
  console.log("Capturing 2. Component Discovery...");
  const searchInput = page.locator('input[placeholder*="Search local registry"]');
  if (await searchInput.count() > 0) {
    await searchInput.fill("card");
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, "showcase_component_discovery.png")
    });
    await searchInput.fill("");
    await page.waitForTimeout(500);
  }

  // 3. Component Preview Studio Lightbox Modal
  console.log("Capturing 3. Component Preview Studio Modal...");
  const firstCard = page.locator('main .group.cursor-pointer').first();
  if (await firstCard.count() > 0) {
    await firstCard.click();
    await page.waitForSelector('.fixed.inset-0', { timeout: 10000 });
    await page.waitForTimeout(1500);
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, "showcase_preview_studio.png")
    });

    // Close modal
    await page.keyboard.press("Escape");
    await page.waitForTimeout(800);
  }

  // 4. Themes & Design Systems Section
  console.log("Capturing 4. Themes Hub...");
  const themesBtn = page.locator('aside button:has-text("Themes")').first();
  if (await themesBtn.count() > 0) {
    await themesBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, "showcase_themes.png")
    });
  }

  // 5. Personal Workspace / Bookmarks Section
  console.log("Capturing 5. Personal Workspace...");
  const bookmarksBtn = page.locator('aside button:has-text("Bookmarks & Boards")').first();
  if (await bookmarksBtn.count() > 0) {
    await bookmarksBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, "showcase_personal_workspace.png")
    });
  }

  // 6. Mobile Viewport (390 x 844)
  console.log("Capturing 6. Mobile Viewport...");
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded", timeout: 15000 });
  await mobilePage.waitForSelector('main', { timeout: 15000 });
  await mobilePage.waitForTimeout(1500);
  await mobilePage.screenshot({
    path: path.join(ARTIFACT_DIR, "showcase_mobile_responsive.png")
  });

  await browser.close();
  console.log("All showcase screens captured successfully!");
}

main().catch((err) => {
  console.error("Capture error:", err);
  process.exit(1);
});
