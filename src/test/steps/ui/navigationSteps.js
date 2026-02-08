import { When, Then, setDefaultTimeout } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

/* -------- Sidebar Click -------- */

When("User clicks on {string}", async function (menu) {
  await this.dashboardPage.clickSidebarMenu(menu);
});

/* -------- Route Assertion -------- */

Then("User should be navigated to {string}", async function (route) {
  await this.dashboardPage.verifyCurrentUrl(route);
});
