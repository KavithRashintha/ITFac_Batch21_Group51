import { When, Then, After } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { BasePage } from "../pages/BasePage.js";

const BASE_URL = "http://localhost:8080";

/**
 * Reusable Navigation Step
 */
When("User navigates to {string}", { timeout: 30000 }, async function (path) {
    const basePage = new BasePage(this.page);
    const url = path.startsWith('http') ? path : `${BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
    await basePage.navigateTo(url);
});

// Alias for low-case 'user' if needed by some feature files
When("user navigates to {string}", { timeout: 30000 }, async function (path) {
    const basePage = new BasePage(this.page);
    const url = path.startsWith('http') ? path : `${BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
    await basePage.navigateTo(url);
});

/**
 * Sidebar Click Step
 */
When("User clicks on {string}", async function (menu) {
    const menuItem = this.page.locator(`text=${menu}`).first();
    await menuItem.click();
});

/**
 * Generic Button Click Step (Uses BasePage strategy)
 */
When("User clicks {string} button", async function (buttonName) {
    const basePage = new BasePage(this.page);
    await basePage.clickGenericButton(buttonName);
});

/**
 * Common Message Validations
 */
Then("User see a success message as {string}", async function (message) {
    const basePage = new BasePage(this.page);
    await basePage.verifyTextVisible(message);
});

Then("User see an error message as {string}", async function (message) {
    const basePage = new BasePage(this.page);
    await basePage.verifyTextVisible(message);
});

Then("global error message {string} should be displayed", async function (message) {
    const basePage = new BasePage(this.page);
    await basePage.verifyTextVisible(message);
});

Then('validation message {string} should be displayed', async function (message) {
    const basePage = new BasePage(this.page);
    await basePage.verifyTextVisible(message);
});

/**
 * Common Table and Pagination Validations
 */
Then("The pagination should be visible", async function () {
    await expect(this.page.locator('.pagination')).toBeVisible();
});

Then("User should be navigated to {string}", async function (route) {
    const basePage = new BasePage(this.page);
    await basePage.verifyUrlContains(route);
});
