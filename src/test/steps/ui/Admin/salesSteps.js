// src/test/steps/ui/salesSteps.js
import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

/* ---------------- Login Steps ---------------- */

Given("User logged-in as Admin", async function () {
  // Navigate to login page
  await this.page.goto("http://localhost:8080/ui/login");

  const usernameField = this.page
    .locator(
      'input[name="username"], input[id="username"], input[placeholder*="username" i]',
    )
    .first();
  const passwordField = this.page
    .locator(
      'input[name="password"], input[id="password"], input[placeholder*="password" i]',
    )
    .first();

  await usernameField.fill("admin");
  await passwordField.fill("admin123");

  // Click login button
  const loginButton = this.page
    .locator('button:has-text("Login"), input[type="submit"][value*="Login" i]')
    .first();
  await loginButton.click();

  // Wait for navigation to complete
  await this.page.waitForURL("**/ui/**");
  await this.page.waitForLoadState("networkidle");
});

When(
  "Provide valid username {string} and password {string} for ui",
  async function (username, password) {
    const usernameField = this.page
      .locator('input[name="username"], input[id="username"]')
      .first();
    const passwordField = this.page
      .locator('input[name="password"], input[id="password"]')
      .first();

    await usernameField.fill(username);
    await passwordField.fill(password);
  },
);

Then("click the login button for ui", async function () {
  const loginButton = this.page.locator('button:has-text("Login")').first();
  await loginButton.click();

  // Wait for login to complete
  await this.page.waitForURL("**/ui/**");
  await this.page.waitForLoadState("networkidle");
});

/* ---------------- Navigation ---------------- */

When("User navigates to {string}", async function (url) {
  await this.page.goto(`http://localhost:8080${url}`);
  await this.page.waitForLoadState("networkidle");
});

When("User navigates to page {string}", async function (url) {
  await this.page.goto(`http://localhost:8080${url}`);
  await this.page.waitForLoadState("networkidle");
});

/* ---------------- UI Visibility ---------------- */

Then('The "Sell Plant" button should be visible', async function () {
  // Try multiple selectors
  const button = this.page
    .locator(
      'a:has-text("Sell Plant"), button:has-text("Sell Plant"), [href*="sell"]',
    )
    .first();
  await expect(button).toBeVisible({ timeout: 10000 });
});

Then('The "Add a Plant" button should be visible', async function () {
  const button = this.page
    .locator('a:has-text("Add a Plant"), button:has-text("Add a Plant")')
    .first();
  await expect(button).toBeVisible({ timeout: 10000 });
});

/* ---------------- Sales List ---------------- */

Then("Sales list should be displayed", async function () {
  // Wait for table to load
  await this.page.waitForSelector("table", { timeout: 10000 });

  const rows = this.page.locator("table tbody tr");
  await expect(rows.first()).toBeVisible({ timeout: 10000 });
});

/* ---------------- Sorting Validation ---------------- */

Then(
  'Sales list should be sorted by "Sold At" in descending order',
  async function () {
    await this.page.waitForSelector("table tbody tr", { timeout: 10000 });

    // Try different column indices - adjust based on your table structure
    const soldAtCells1 = this.page.locator("table tbody tr td:nth-child(4)");
    const soldAtCells2 = this.page.locator("table tbody tr td:nth-child(3)");

    let soldAtCells;
    let cellCount;

    // Check which selector works
    cellCount = await soldAtCells1.count();
    if (cellCount > 0) {
      soldAtCells = soldAtCells1;
    } else {
      cellCount = await soldAtCells2.count();
      soldAtCells = soldAtCells2;
    }

    expect(cellCount).toBeGreaterThan(0);

    const dates = [];

    for (let i = 0; i < cellCount; i++) {
      const text = await soldAtCells.nth(i).innerText();
      // Try different date formats
      const date = new Date(text.replace(" ", "T") || text);
      if (!isNaN(date.getTime())) {
        dates.push(date);
      }
    }

    // Validate descending order if we have at least 2 valid dates
    if (dates.length > 1) {
      for (let i = 0; i < dates.length - 1; i++) {
        expect(dates[i].getTime()).toBeGreaterThanOrEqual(
          dates[i + 1].getTime(),
        );
      }
    }
  },
);
