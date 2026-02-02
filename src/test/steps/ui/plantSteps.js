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
    await this.browser.close();
});

//=================== Verify visibility of the pagination for plants list ==============================================

Then('The pagination should be visible', async function (){
    const pagination = this.page.locator('.pagination');
    await expect(pagination).toBeVisible()
});

//=================== Verify the Next button functionality of the pagination ===========================================

Then('The page {string} should be currently active', async function (pageNumber) {
    const activePage = this.page.locator('.pagination .active');
    await expect(activePage).toHaveText(pageNumber);
    await this.browser.close();
});

//=================== Verify Edit plant button in Actions ==============================================================

When('User clicks "Edit" button in the action of first record', async function () {
    const firstRow = this.page.locator('tbody tr').first();
    await expect(firstRow).toBeVisible();

    //All possible button types
    const button = firstRow.getByRole('button', { name: 'Edit' });
    const link = firstRow.getByRole('link', { name: 'Edit' });
    const title = firstRow.locator('[title="Edit"]');
    const aria = firstRow.locator('[aria-label="Edit"]');
    const href = firstRow.locator('a[href*="/edit/"]');

    if (await button.count() > 0) {
        await button.click();
    }
    else if (await link.count() > 0) {
        await link.click();
    }
    else if (await title.count() > 0) {
        await title.click();
    }
    else if (await aria.count() > 0) {
        await aria.click();
    }
    else if (await href.count() > 0) {
        await href.click();
    }
    else {
        throw new Error("Failed to find the Edit button using ANY known strategy.");
    }
});

Then('User see the current details of the plant', async function () {
    expect(this.page.url()).toContain('/edit');
    await expect(this.page.locator('#name')).not.toBeEmpty();
    await expect(this.page.locator('#price')).not.toBeEmpty();
    await expect(this.page.locator('#quantity')).not.toBeEmpty();
    await expect(this.page.locator('#categoryId')).not.toHaveValue('');
});