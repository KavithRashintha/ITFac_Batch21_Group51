import { When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage.js";
import { PlantPage } from "../../pages/PlantPage.js";
import { CategoryPage } from "../../pages/CategoryPage.js";

const url = "http://localhost:8080";

When('user navigates to {string}', { timeout: 30000 }, async function (path) {
    const fullUrl = path.startsWith('http') ? path : `${url}/${path.startsWith('/') ? path.substring(1) : path}`;
    await this.page.goto(fullUrl);
});

When('User navigates to {string}', async function (path) {
    const fullUrl = path.startsWith('http') ? path : `${url}/${path.startsWith('/') ? path.substring(1) : path}`;
    await this.page.goto(fullUrl);
});

When('User clicks {string} button', async function (buttonName) {
    const plantPage = new PlantPage(this.page);
    await plantPage.clickGenericButton(buttonName);
});

Then('User should be on the {string} page', async function (expectedPath) {
    await expect(this.page).toHaveURL(new RegExp(expectedPath));
});
