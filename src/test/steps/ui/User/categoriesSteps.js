import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

// ---------- User role validations ----------

Then('Add Category button should not be visible', async function () {
  const addCategoryButton = this.page.locator(
    'button:has-text("Add A Category"), a:has-text("Add A Category")'
  );

  // For non-admin users, the button should not exist in DOM
  await expect(addCategoryButton).toHaveCount(0);
});


//---------------------------- TC_USER_CAT_08: Verify that the Category Edit button is disabled for users ------------------

When('user navigates to category page {string}', { timeout: 30000 }, async function (path) {
    await this.page.goto(`http://localhost:8080/${path}`, { 
        waitUntil: 'domcontentloaded',
        timeout: 30000 
    });
});

Then('the Edit button for category {string} should be disabled', async function(categoryName) {
    await this.page.waitForSelector('table tbody tr');

    const row = this.page.locator('table tbody tr').filter({ hasText: categoryName }).first();
    await expect(row).toBeVisible();

    const editButton = row.locator('[title="Edit"]');

    const isDisabled = await editButton.isDisabled();
    expect(isDisabled).toBe(true);  
});

//---------------------------- TC_USER_CAT_09: Verify that the Category Delete button is disabled for users ------------------

Then('the Delete button for category {string} should be disabled', async function(categoryName) {
    await this.page.waitForSelector('table tbody tr');

    const row = this.page.locator('table tbody tr').filter({ hasText: categoryName }).first();
    await expect(row).toBeVisible();

    const deleteButton = row.locator('[title="Delete"]');

    const isDisabled = await deleteButton.isDisabled();
    expect(isDisabled).toBe(true);  // Passes if button is disabled
});

//---------------------------- TC_USER_CAT_11: Verify search functionality for a valid subcategory name ------------------

When('user enters {string} in the search bar', async function(subcategoryName) {
    await this.page.fill('input[placeholder="Search sub category"]', subcategoryName);
});

When('user clicks on the search button', async function() {
    await this.page.click('button[type="submit"]');  
});

Then('the search results should display category\\/subcategory {string}', async function(subcategoryName) {
  await this.page.waitForSelector('table tbody tr');   
  const rows = this.page.locator('table tbody tr');
  const matchedRows = rows.filter({ hasText: subcategoryName });
  expect(await matchedRows.count()).toBeGreaterThan(0);
  await this.page.waitForTimeout(3000);
});

//---------------------------- TC_USER_CAT_12: Verify "No category found" message displays when the records do not exist ------------------

Then('"No category found" message should be displayed', async function() {
    const noRecordMsg = this.page.locator('text=No category found');
    await noRecordMsg.waitFor({ state: 'visible', timeout: 5000 });

    expect(await noRecordMsg.isVisible()).toBeTruthy();
    await this.page.waitForTimeout(3000);
});

//---------------------------- TC_USER_CAT_13: Verify that clicking the Reset button clears the entered search criteria ----------------

When('user clicks on the Reset button', async function() {
    await this.page.getByText('Reset').click();
    await this.page.waitForSelector('table tbody tr');
});

Then('the search input should be cleared', async function() {
    const searchValue = await this.page.inputValue('input[placeholder="Search sub category"]');
    expect(searchValue).toBe('');
});

Then('the category list should be reset', async function() {
    const rows = this.page.locator('table tbody tr');
    expect(await rows.count()).toBeGreaterThan(0);
    await this.page.waitForTimeout(3000);
});