// import { When, Then, After } from "@cucumber/cucumber";
// import { expect } from "@playwright/test";

// const BASE_URL = "http://localhost:8080";

// /**
//  * Navigation step (REUSABLE)
//  */
// When("User navigates to {string}", async function (path) {
//   await this.page.goto(`${BASE_URL}${path}`);
// });

// /**
//  * Generic button visibility step (REUSABLE)
//  */
// Then("The {string} button should be visible", async function (buttonName) {
//   const button =
//     (await this.page.getByRole("button", { name: buttonName }).count()) > 0
//       ? this.page.getByRole("button", { name: buttonName })
//       : this.page.getByRole("link", { name: buttonName });

//   await expect(button).toBeVisible();
// });

// /**
//  * Generic validation message step (REUSABLE)
//  */
// Then('validation message {string} should be displayed', async function (message) {
//   await expect(this.page.locator(`text=${message}`)).toBeVisible();
// });

// /**
//  * Cleanup and  close browser after each scenario (REUSABLE)
//  */
// After(async function () {
//   await this.browser.close();
// });
