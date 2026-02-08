import { When, Then } from "@cucumber/cucumber";

When('User navigates to {string}', async function (url) {
    await this.plantsPage.navigateTo(url);
});

Then('The \"Add a Plant\" button should be visible', async function () {
    await this.plantsPage.verifyAddPlantButtonVisible();
});

When('User clicks {string} button', async function (buttonName) {
    await this.plantsPage.clickButtonByText(buttonName);
});

When('Provide {string} plantName {string}, select category {string}, price as {string}, and quantity as {string} for ui', { timeout: 15000 }, async function (_, name, category, price, quantity) {
    const plantData = { name, category, price, quantity };
    await this.plantsPage.fillPlantForm(plantData);
});

Then('User see an error message as {string}', async function (message) {
    await this.plantsPage.verifyErrorMessage(message);
});

Then('User see a success message as {string}', async function (message) {
    await this.plantsPage.verifySuccessMessage(message);
});

Then('The pagination should be visible', async function () {
    await this.plantsPage.verifyPaginationVisible();
});

Then('The page {string} should be currently active', async function (pageNumber) {
    await this.plantsPage.verifyCurrentActivePage(pageNumber);
});

When('User clicks {string} button in the action of first record', async function (buttonName) {
    const dialogMessage = await this.plantsPage.clickActionButtonInFirstRow(buttonName);
    if (dialogMessage) {
        this.capturedDialogMessage = dialogMessage;
    }
});

Then('User see the current details of the plant', async function () {
    await this.plantsPage.verifyCurrentPlantDetails();
});

Then('User see a confirmation message', async function () {
    if (!this.capturedDialogMessage) {
        throw new Error("No confirmation message appeared!");
    }
    const expectedMessage = await this.plantsPage.verifyDeleteConfirmation('Delete this plant?');
    if (this.capturedDialogMessage !== expectedMessage) {
        throw new Error(`Expected "${expectedMessage}" but got "${this.capturedDialogMessage}"`);
    }
    await this.browser.close();
});

Then('User should be on the {string} page', async function (url) {
    await this.plantsPage.verifyURL(url);
});

Then('The plant {string} should not be in the list', { timeout: 10000 }, async function (plantName) {
    await this.plantsPage.verifyPlantNotExists(plantName);
});
