import { When, Then } from "@cucumber/cucumber";
import { expect } from '@playwright/test';
import { page, browser } from "./loginSteps.js";

When(/^User navigates to "\/ui\/plants"$/, async function () {
    console.log("User navigated to '/ui/plants' Successfully");

    await page.goto('http://localhost:8080/ui/plants');
});


Then('The "Add a Plant" button should be visible', async function () {
    console.log("Login button clicked for ui");

    const button = page.getByRole('link', { name: 'Add a Plant' });
    await expect(button).toBeVisible();

    await browser.close();
});
