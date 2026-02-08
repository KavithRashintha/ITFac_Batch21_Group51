import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

Then('Add Category button should not be visible', async function () {
    const addCategoryButton = this.categoriesPage.getLocator(
        'button:has-text("Add A Category"), a:has-text("Add A Category")'
    );
    await expect(addCategoryButton).toHaveCount(0);
});

When('user navigates to category page {string}', { timeout: 30000 }, async function (path) {
    await this.categoriesPage.navigateTo(`/${path}`);
});

Then('the Edit button for category {string} should be disabled', async function (categoryName) {
    await this.categoriesPage.waitFor('table tbody tr');
    const row = this.categoriesPage.getLocator('table tbody tr').filter({ hasText: categoryName }).first();
    await this.categoriesPage.verifyVisible(row);

    const editButton = row.locator('[title="Edit"]');
    const isDisabled = await editButton.isDisabled();
    expect(isDisabled).toBe(true);
});

Then('the Delete button for category {string} should be disabled', async function (categoryName) {
    await this.categoriesPage.waitFor('table tbody tr');
    const row = this.categoriesPage.getLocator('table tbody tr').filter({ hasText: categoryName }).first();
    await this.categoriesPage.verifyVisible(row);

    const deleteButton = row.locator('[title="Delete"]');
    const isDisabled = await deleteButton.isDisabled();
    expect(isDisabled).toBe(true);
});

When('user enters {string} in the search bar', async function (subcategoryName) {
    await this.categoriesPage.fill('input[placeholder="Search sub category"]', subcategoryName);
});

When('user clicks on the search button', async function () {
    await this.categoriesPage.click('button[type="submit"]');
});

Then(/^the search results should display category\/subcategory "([^"]*)"$/, async function (subcategoryName) {
    await this.categoriesPage.waitFor('table tbody tr');
    const rows = this.categoriesPage.getLocator('table tbody tr');
    const matchedRows = rows.filter({ hasText: subcategoryName });
    expect(await matchedRows.count()).toBeGreaterThan(0);
    await this.page.waitForTimeout(3000);
});

Then('"No category found" message should be displayed', async function () {
    const noRecordMsg = this.categoriesPage.getByText('No category found');
    await noRecordMsg.waitFor({ state: 'visible', timeout: 5000 });
    expect(await noRecordMsg.isVisible()).toBeTruthy();
    await this.page.waitForTimeout(3000);
});

When('user clicks on the Reset button', async function () {
    await this.categoriesPage.getByText('Reset').click();
    await this.categoriesPage.waitFor('table tbody tr');
});

Then('the search input should be cleared', async function () {
    const searchValue = await this.page.inputValue('input[placeholder="Search sub category"]');
    expect(searchValue).toBe('');
});

Then('the category list should be reset', async function () {
    const rows = this.categoriesPage.getLocator('table tbody tr');
    expect(await rows.count()).toBeGreaterThan(0);
    await this.page.waitForTimeout(3000);
});
