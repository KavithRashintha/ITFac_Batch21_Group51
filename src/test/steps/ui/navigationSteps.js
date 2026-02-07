import { When, Then, setDefaultTimeout } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { BasePage } from "../pages/BasePage.js";

/* -------- Sidebar Click -------- */

When("User clicks on {string}", async function (menu) {
  const menuItem = this.page.locator(`text=${menu}`).first();
  await menuItem.click();
});

/* -------- Route Assertion -------- */

Then("User should be navigated to {string}", async function (route) {
  const basePage = new BasePage(this.page);
  await basePage.verifyUrlContains(route);
});
