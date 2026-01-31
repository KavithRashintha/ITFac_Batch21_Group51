import { When, Then } from "@cucumber/cucumber";
import { expect } from '@playwright/test';

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

//============================= Fill Plant Form ====================================================
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

//====================Verify Cancel button functionality ========================================================
// When('User fills the plant form partially or completely', async function () {
//     // Example: fill fields (modify as per your input selectors)
//     await this.page.fill('input[name="name"]', 'TestPlant');
//     await this.page.selectOption('#categoryId', {index: 1});
//     await this.page.fill('input[name="price"]', '500');
//     await this.page.fill('input[name="quantity"]', '10');
// });
//
// Then('The new plant should not be saved', async function () {
//     // Verify that 'TestPlant' is NOT in the plant list
//     const plantExists = await this.page.locator(`text=TestPlant`).count();
//     expect(plantExists).toBe(0);
// });