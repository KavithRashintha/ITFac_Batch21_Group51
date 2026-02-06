import { When, Then, setDefaultTimeout } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

/* -------- Sidebar Click -------- */

When("User clicks on {string}", async function (menu) {
  const menuItem = this.page.locator(`text=${menu}`).first();
  await menuItem.click();
});

/* -------- Route Assertion -------- */

Then("User should be navigated to {string}", async function (route) {
  await expect(this.page.url()).toContain(route);
});
