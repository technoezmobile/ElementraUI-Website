import { chromium } from "playwright";
import path from "path";

const ARTIFACT_DIR = "C:\\Users\\singh\\.gemini\\antigravity\\brain\\4d2b107c-acb9-40bf-ba51-5280999af7ec";
const BASE_URL = "http://localhost:5173";

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2000);

  // Click "Awesome (6,591)" source button
  const awesomeBtn = page.locator('button:has-text("Awesome (6,591)")').first();
  if (await awesomeBtn.count() > 0) {
    await awesomeBtn.click();
    await page.waitForTimeout(2000);
  }

  await page.screenshot({
    path: path.join(ARTIFACT_DIR, "redesign_awesome_components_grid.png"),
    fullPage: false
  });

  await browser.close();
  console.log("Awesome components grid screenshot captured!");
}

run().catch(console.error);
