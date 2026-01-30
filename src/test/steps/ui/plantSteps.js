import { When, Then } from "@cucumber/cucumber";
import { expect } from '@playwright/test';

When('User navigates to {string}', async function (url) {
    await this.page.goto(`http://localhost:8080${url}`);
});

Then('The "Add a Plant" button should be visible', async function () {
    const button = this.page.getByRole('link', { name: 'Add a Plant' });
    await expect(button).toBeVisible();

    await this.browser.close();
});

//=================== Verify plant quantity cannot be a minus value ====================================================

When('User clicks {string} button', async function (buttonName) {
    const button = this.page.getByRole('button', { name: buttonName });

    if (await button.count() > 0) {
        await button.click();
    } else {
        await this.page.getByRole('link', { name: buttonName }).click();
    }
});

When('Provide valid plantName {string}, select category {string}, price as {string}, and incorrect quantity as {string} for ui', async function (name, category, price, quantity) {
    await this.page.fill('input[name="name"]', name);
    await this.page.fill('input[name="price"]', price);

    // select the first option in the selection of categories
    await this.page.selectOption('#categoryId', { index: 1 });

    await this.page.fill('input[name="quantity"]', quantity);
});

Then('User see an error message as {string}', async function (errorMessage) {
    const errorLocator = this.page.getByText(errorMessage);
    await expect(errorLocator).toBeVisible();

    //await this.browser.close();
});

//=================== Verify visibility of the pagination for plants list ==============================================

Then('The pagination should be visible', async function (){
    const pagination = this.page.locator('.pagination');

    await expect(pagination).toBeVisible()
});


