import { When, Then } from "@cucumber/cucumber";
import { expect } from '@playwright/test';

let capturedDialogMessage = "";

// ============================== Navigation ==================================================
When('User navigates to {string}', async function (url) {
    await this.page.goto(`http://localhost:8080${url}`);
});

//======================= Verify Add a Plant button visibility ===============================================
Then('The "Add a Plant" button should be visible', async function () {
    const button = this.page.getByRole('link', { name: 'Add a Plant' });
    await expect(button).toBeVisible();
});

// ========================== Button Click =================================================
When('User clicks {string} button', async function (buttonName) {
    const button = this.page.getByRole('button', { name: buttonName });

    if (await button.count() > 0) {
        await button.click();
    } else {
        await this.page.getByRole('link', { name: buttonName }).click();
    }
});

//============================= Verify plant quantity cannot be a minus value ====================================================
When('Provide {string} plantName {string}, select category {string}, price as {string}, and quantity as {string} for ui',{ timeout: 15000 }, async function (_, name, category, price, quantity) {
    if (name !== undefined){
        await this.page.fill('input[name="name"]', name);
    }
    if (price !== undefined){
        await this.page.fill('input[name="price"]', price);
    }
    if (category && category.trim() !== "") {
        await this.page.selectOption('#categoryId', {index: 1});
    }
    if (quantity !== undefined){
        await this.page.fill('input[name="quantity"]', quantity);
    }
});

// ==================================== Display Messages ========================================================
Then('User see an error message as {string}', async function (message) {

    const messageLocator = this.page.getByText(message, { exact: false });
    await expect(messageLocator).toBeVisible();
});

Then('User see a success message as {string}', async function (message) {
    const messageLocator = this.page.getByText(message, { exact: false });
    await expect(messageLocator).toBeVisible();
});

//=================== Verify visibility of the pagination for plants list ==============================================
Then('The pagination should be visible', async function (){
    const pagination = this.page.locator('ul.pagination');
    await expect(pagination).toBeVisible()
});

//=================== Verify the Next button functionality of the pagination ===========================================

Then('The page {string} should be currently active', async function (pageNumber) {
    const activePage = this.page.locator('ul.pagination .active');
    await expect(activePage).toHaveText(pageNumber);
});

//=================== Verify Edit plant button in Actions ==============================================================

When('User clicks {string} button in the action of first record', async function (buttonName) {
    const firstRow = this.page.locator('tbody tr').first();
    await expect(firstRow).toBeVisible();

    if (buttonName === "Delete") {
        this.page.once('dialog', async dialog => {
            capturedDialogMessage = dialog.message();
            await dialog.dismiss();
        });
    }

    //All possible button types
    const button = firstRow.getByRole('button', { name: buttonName });
    const link = firstRow.getByRole('link', { name: buttonName });
    const title = firstRow.locator(`[title="${buttonName}"]`);
    const aria = firstRow.locator(`[aria-label="${buttonName}"]`);
    const href = firstRow.locator(`a[href*="/${buttonName.toLowerCase()}/"]`);

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
        throw new Error(`Failed to find the ${buttonName} button using ANY known strategy.`);
    }
});

Then('User see the current details of the plant', async function () {
    expect(this.page.url()).toContain('/edit');
    await expect(this.page.locator('#name')).not.toBeEmpty();
    await expect(this.page.locator('#price')).not.toBeEmpty();
    await expect(this.page.locator('#quantity')).not.toBeEmpty();
    await expect(this.page.locator('#categoryId')).not.toHaveValue('');
});

//=================== Verify Delete plant button in Actions ============================================================

Then('User see a confirmation message', async function () {
    if (!capturedDialogMessage) {
        throw new Error("No confirmation message appeared!");
    }
    expect(capturedDialogMessage).toBe('Delete this plant?');
    await this.browser.close();
});

//====================Verify Cancel button functionality ========================================================
Then('User should be on the {string} page', async function (url) {
    await expect(this.page).toHaveURL(new RegExp(url));
});

Then('The plant {string} should not be in the list', { timeout: 10000 }, async function (plantName) {
    if (plantName && plantName.trim() !== "") {
        const plantCell = this.page.locator('table').getByRole('cell', { name: plantName, exact: true });
        await expect(plantCell).not.toBeVisible();
    }
});


