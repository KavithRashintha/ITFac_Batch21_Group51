import { When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

/* ---------------- Navigation ---------------- */

When("User navigates to page {string}", async function (url) {
  await this.page.goto(`http://localhost:8080${url}`);
});

/* ---------------- UI Visibility ---------------- */

Then('The "Sell Plant" button should be visible', async function () {
  const button = this.page.getByRole("link", { name: "Sell Plant" });
  await expect(button).toBeVisible();
});
