import { chromium } from "playwright";
import path from "path";

const ARTIFACT_DIR = "C:\\Users\\singh\\.gemini\\antigravity\\brain\\4d2b107c-acb9-40bf-ba51-5280999af7ec";
const BASE_URL = "http://localhost:5173";

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);

  // Scroll main container by 800px to view catalogue grid directly
  await page.evaluate(() => {
    const containers = document.querySelectorAll(".overflow-y-auto");
    for (const c of containers) {
      if (c.scrollHeight > 1000) {
        c.scrollTop = 780;
      }
    }
  });
  await page.waitForTimeout(1000);

  await page.screenshot({
    path: path.join(ARTIFACT_DIR, "redesign_catalogue_grid_cards.png"),
    fullPage: false
  });

  await browser.close();
  console.log("Catalogue grid cards screenshot captured!");
}

run().catch(console.error);
