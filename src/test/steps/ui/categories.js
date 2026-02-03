import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

//--------------------------- Verify the Edit category button in Actions ---------------------------

When('user navigates to {string}', async function (path) {
    await this.page.goto(`http://localhost:8081/${path}`);
});

When('user clicks on Edit button', async function () {
    await this.page.locator('[title="Edit"]').first().click();
});

Then('user navigates to edit category page', async function(){
    await this.page.waitForURL('**/ui/categories/edit/**');
});


//-------------- Verify the Validation errors when editing a categoryname that not meet the valid criteria (3-10)------------

When('user provide categoryName {string}', async function(newCategoryName){
    await this.page.fill('input[name="name"]',newCategoryName);
} );

Then('user click save button', async function () {
    await this.page.click('button[type="submit"]');
});

// ---------- View Categories ----------

Then('category list table should be visible', async function () {
  await expect(this.page.locator('table')).toBeVisible();
});

Then('pagination should be visible', async function () {
  await expect(this.page.locator('.pagination')).toBeVisible();
});

Then('search option should be visible', async function () {
  await expect(this.page.getByPlaceholder('Search')).toBeVisible();
});

Then('sorting option should be visible', async function () {
  await expect(
    this.page.locator('th', { hasText: 'ID' })
  ).toBeVisible();
});

Then('Add Category button should be visible and enabled', { timeout: 15000 }, async function () {
  // Wait for the page to fully load
  await this.page.waitForLoadState('networkidle');
  
  // Use a more flexible selector that works for both buttons and links
  const addCategoryButton = this.page.locator('button:has-text("Add A Category"), a:has-text("Add A Category")').first();

  await expect(addCategoryButton).toBeVisible({ timeout: 10000 });
  await expect(addCategoryButton).toBeEnabled();
});

