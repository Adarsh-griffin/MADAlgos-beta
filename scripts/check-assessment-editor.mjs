import process from "node:process";
import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL || "http://localhost:3000";
const token = process.env.TEST_TOKEN || "";
const headed = String(process.env.HEADED || "").toLowerCase() === "true";

if (!token) {
  console.error("Missing TEST_TOKEN. Example:");
  console.error('  TEST_TOKEN="your-token" npm run check:editor');
  process.exit(1);
}

const testUrl = `${baseUrl}/test/${encodeURIComponent(token)}`;
const checks = [];

function ok(name) {
  checks.push({ name, status: "PASS" });
}

function fail(name, error) {
  checks.push({ name, status: "FAIL", error: String(error?.message || error) });
}

async function runCheck(name, fn) {
  try {
    await fn();
    ok(name);
  } catch (error) {
    fail(name, error);
  }
}

async function clickIfVisible(page, selector) {
  const el = page.locator(selector).first();
  if (await el.isVisible().catch(() => false)) {
    await el.click();
    return true;
  }
  return false;
}

async function main() {
  const browser = await chromium.launch({ headless: !headed });
  const page = await browser.newPage();

  await page.goto(testUrl, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(1500);

  // If fullscreen modal appears, enter fullscreen so editor is usable.
  const enteredFullscreen = await clickIfVisible(page, 'button:has-text("Enter fullscreen")');
  if (enteredFullscreen) await page.waitForTimeout(800);

  await runCheck("Editor visible", async () => {
    await page.locator("text=Run sample tests").first().waitFor({ state: "visible", timeout: 15000 });
  });

  await runCheck("Language dropdown opens and selects Python", async () => {
    await page.locator("button:has-text('Javascript'), button:has-text('Python'), button:has-text('Java')").first().click();
    await page.locator('[role="menuitem"]:has-text("Python")').first().click({ timeout: 5000 });
    await page.waitForTimeout(400);
  });

  await runCheck("Theme toggle button works", async () => {
    const toggle = page.locator('button[aria-haspopup="dialog"]').nth(0);
    // Fallback to icon button by tooltip trigger order (theme is before fullscreen).
    const iconButtons = page.locator("button.h-8.w-8");
    const count = await iconButtons.count();
    if (count < 2) throw new Error("Theme/fullscreen icon buttons not found");
    await iconButtons.nth(count - 2).click();
    await page.waitForTimeout(300);
  });

  await runCheck("Editor accepts typing", async () => {
    const editorInput = page.locator(".monaco-editor textarea.inputarea").first();
    await editorInput.click();
    await page.keyboard.type("\n// editor-check");
    await page.waitForTimeout(200);
  });

  await runCheck("Run sample tests button triggers summary", async () => {
    await page.locator("button:has-text('Run sample tests')").first().click();
    await page.locator("text=Test Run Summary").first().waitFor({ state: "visible", timeout: 70000 });
    await clickIfVisible(page, 'button:has-text("Close")');
  });

  await runCheck("Run all tests button triggers summary", async () => {
    await page.locator("button:has-text('Run all tests')").first().click();
    await page.locator("text=Test Run Summary").first().waitFor({ state: "visible", timeout: 70000 });
    await clickIfVisible(page, 'button:has-text("Close")');
  });

  await runCheck("Save button clickable", async () => {
    await page.locator("button:has-text('Submit test (save)'), button:has-text('Saving…')").first().click();
    await page.waitForTimeout(600);
  });

  await runCheck("Reset opens dialog and cancel works", async () => {
    const iconButtons = page.locator("button.h-8.w-8");
    const count = await iconButtons.count();
    if (count < 3) throw new Error("Reset/theme/fullscreen icon buttons not found");
    await iconButtons.first().click();
    await page.locator("text=Reset code?").first().waitFor({ state: "visible", timeout: 5000 });
    await page.locator('button:has-text("Cancel")').first().click();
  });

  await runCheck("Fullscreen toggle clickable", async () => {
    const iconButtons = page.locator("button.h-8.w-8");
    const count = await iconButtons.count();
    if (count < 1) throw new Error("Fullscreen icon button not found");
    await iconButtons.nth(count - 1).click();
    await page.waitForTimeout(300);
    await iconButtons.nth(count - 1).click();
  });

  await browser.close();

  console.log("\nAssessment editor functional checks");
  console.log(`URL: ${testUrl}`);
  for (const c of checks) {
    console.log(`- ${c.status} ${c.name}${c.error ? ` :: ${c.error}` : ""}`);
  }
  const failed = checks.filter((c) => c.status === "FAIL");
  console.log(`\nPassed: ${checks.length - failed.length}/${checks.length}`);
  if (failed.length) process.exit(2);
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
