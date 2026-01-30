import { When, Then } from "@cucumber/cucumber";
import { expect } from '@playwright/test';

When(/^User navigates to "\/ui\/plants"$/, async function () {
    console.log("User navigated to '/ui/plants' Successfully");

    await this.page.goto('http://localhost:8080/ui/plants');
});


Then('The "Add a Plant" button should be visible', async function () {
    console.log("Login button clicked for ui");

    const button = this.page.getByRole('link', { name: 'Add a Plant' });
    await expect(button).toBeVisible();

    await this.browser.close();
});
