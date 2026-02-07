import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CategoryPage } from '../../../pages/CategoryPage.js';

//--------------------------- TC_ADMIN_CAT_13: Verify the Edit category button in Actions ---------------------------

When('user clicks on Edit button', async function () {
  await this.page.locator('[title="Edit"]').first().click();
});

Then('user navigates to edit category page', async function () {
  await this.page.waitForURL('**/ui/categories/edit/**');
});


//-------------- TC_ADMIN_CAT_14: Verify the Validation errors when editing a categoryname that not meet the valid criteria (3-10)------------

When('user provide categoryName {string}', async function (newCategoryName) {
  const categoryPage = new CategoryPage(this.page);
  await this.page.fill(categoryPage.categoryNameInput, newCategoryName);
});

Then('the error message should be visible', async function () {
  const categoryPage = new CategoryPage(this.page);
  await this.page.click(categoryPage.saveButton);
  await this.page.waitForSelector('.invalid-feedback');
});


//------------------ TC_ADMIN_CAT_15: Verify the Save button functionality in the Edit Category -------------

When('user clicks on edit button for category {string}', async function (oldCategoryName) {
  const categoryPage = new CategoryPage(this.page);
  const row = this.page.locator('table tbody tr').filter({ hasText: oldCategoryName }).first();
  await expect(row).toBeVisible();
  await row.locator('[title="Edit"]').click();
});

When('user edits the categoryname {string}', async function (newName) {
  const categoryPage = new CategoryPage(this.page);
  await this.page.fill(categoryPage.categoryNameInput, newName);
});

Then('user click save button', async function () {
  const categoryPage = new CategoryPage(this.page);
  await this.page.click(categoryPage.saveButton);
});

Then('user navigates to category page', async function () {
  await this.page.waitForURL('**/ui/categories');
});

Then('the success message should be displayed', async function () {
  const categoryPage = new CategoryPage(this.page);
  await categoryPage.verifySuccessMessage();
});

Then('the category name should be updated to {string}', async function (newName) {
  const categoryPage = new CategoryPage(this.page);
  await categoryPage.verifyCategoryVisible(newName);
});

//------------------ TC_ADMIN_CAT_16: Verify the Cancel button functionality in the Edit Category -------------

When('user clicks on cancel button', async function () {
  await this.page.getByText('Cancel').click();
});

Then('the category name should remain as {string}', async function (originalName) {
  const categoryPage = new CategoryPage(this.page);
  await categoryPage.verifyCategoryVisible(originalName);
});

//------------------ TC_ADMIN_CAT_17: Verify the Delete Category button in Action -------------

When('user clicks on delete button for category {string}', async function (categoryName) {
  const categoryPage = new CategoryPage(this.page);
  await categoryPage.deleteCategory(categoryName);
});

Then('delete confirmation popup should be displayed', async function () {
  const categoryPage = new CategoryPage(this.page);
  if (!this.page.lastDialogMessage) {
    throw new Error("No confirmation message appeared!");
  }
  expect(this.page.lastDialogMessage).toBe('Delete this category?');
});

// ---------- View Categories ----------

Then('category list table should be visible', async function () {
  const categoryPage = new CategoryPage(this.page);
  await expect(this.page.locator(categoryPage.table)).toBeVisible();
});

Then('pagination should be visible', async function () {
  const categoryPage = new CategoryPage(this.page);
  await expect(this.page.locator(categoryPage.pagination)).toBeVisible();
});

Then('search option should be visible', async function () {
  const categoryPage = new CategoryPage(this.page);
  await expect(this.page.locator(categoryPage.searchInput)).toBeVisible();
});

Then('sorting option should be visible', async function () {
  await expect(this.page.locator('th', { hasText: 'ID' })).toBeVisible();
});

Then('Add Category button should be visible and enabled', { timeout: 15000 }, async function () {
  const categoryPage = new CategoryPage(this.page);
  await this.page.waitForLoadState('networkidle');
  const btn = this.page.locator(categoryPage.addCategoryButton).first();
  await expect(btn).toBeVisible({ timeout: 10000 });
  await expect(btn).toBeEnabled();
});

// ---------- Category name required validation ----------

When('user clicks on Add Category button', async function () {
  const categoryPage = new CategoryPage(this.page);
  const btn = this.page.locator(categoryPage.addCategoryButton).first();
  await expect(btn).toBeVisible();
  await btn.click();
});

When('user clicks save button without entering category name', async function () {
  const categoryPage = new CategoryPage(this.page);
  await this.page.click(categoryPage.saveButton);
});

Then('validation message {string} should be displayed', async function (expectedMessage) {
  const validationMessage = this.page.locator('text=' + expectedMessage).or(
    this.page.locator('.error-message, .validation-error, .invalid-feedback, [role="alert"]')
  );
  await expect(validationMessage.first()).toBeVisible({ timeout: 5000 });
});

// ---------- Category sorting verification ----------

Then('user sorts category list by ID', async function () {
  const idHeader = this.page.locator('th', { hasText: 'ID' });
  await expect(idHeader).toBeVisible();

  const getIds = async () =>
    (await this.page.locator('tbody tr td:first-child').allTextContents())
      .map(id => Number(id.trim()));

  await idHeader.click();
  await this.page.waitForLoadState('networkidle');

  const idsAfterClick = await getIds();
  const asc = [...idsAfterClick].sort((a, b) => a - b);
  const desc = [...asc].reverse();

  const isSortedAsc = JSON.stringify(idsAfterClick) === JSON.stringify(asc);
  const isSortedDesc = JSON.stringify(idsAfterClick) === JSON.stringify(desc);

  expect(isSortedAsc || isSortedDesc).toBe(true);
});

Then('user sorts category list by Name', async function () {
  const nameHeader = this.page.locator('th', { hasText: 'Name' });
  await expect(nameHeader).toBeVisible();
  await nameHeader.click();
  await this.page.waitForLoadState('networkidle');

  const names = await this.page.locator('tbody tr td:nth-child(2)').allTextContents();
  const sorted = [...names].sort((a, b) => a.localeCompare(b));
  const reversed = [...sorted].reverse();
  expect(JSON.stringify(names) === JSON.stringify(sorted) || JSON.stringify(names) === JSON.stringify(reversed)).toBe(true);
});

Then('user sorts category list by Parent', async function () {
  const parentHeader = this.page.locator('th', { hasText: 'Parent' });
  await expect(parentHeader).toBeVisible();
  await parentHeader.click();
  await this.page.waitForLoadState('networkidle');

  const parents = await this.page.locator('tbody tr td:nth-child(3)').allTextContents();
  expect(parents.length).toBeGreaterThan(0);
});

// ---------- Search categories without parent filter ----------

When('user enters subcategory name {string} in search field', async function (subcategory) {
  const categoryPage = new CategoryPage(this.page);
  const searchInput = this.page.locator(categoryPage.searchInput).first();
  await expect(searchInput).toBeVisible();
  await searchInput.fill(subcategory);
  this.searchTerm = subcategory;
});

When('user clicks Search button', async function () {
  const categoryPage = new CategoryPage(this.page);
  await this.page.locator(categoryPage.searchButton).click();
  await this.page.waitForLoadState('networkidle');
});

Then('search results should be displayed', async function () {
  await expect(this.page.locator('tbody tr').first()).toBeVisible();
});

Then('results should match the search criteria', async function () {
  await this.page.waitForLoadState('networkidle');
  const names = await this.page.locator('tbody tr td:nth-child(2)').allTextContents();
  expect(names.length).toBeGreaterThan(0);
  const hasMatchingResult = names.some(name =>
    name.toLowerCase().includes(this.searchTerm?.toLowerCase() || '')
  );
  expect(hasMatchingResult).toBe(true);
});

// ---------- Filter categories by parent ----------

When('user selects parent category {string}', async function (parentCategory) {
  const categoryPage = new CategoryPage(this.page);
  await categoryPage.filterByParent(parentCategory);
  this.selectedParent = parentCategory;
});

Then(
  'only subcategories belonging to parent category {string} should be displayed',
  async function (parentCategory) {
    await this.page.waitForLoadState('networkidle');
    const parentColumnValues = await this.page.locator('tbody tr td:nth-child(3)').allTextContents();
    expect(parentColumnValues.length).toBeGreaterThan(0);
    const nonEmptyParents = parentColumnValues.filter(p => p.trim() && p.trim() !== '-');
    nonEmptyParents.forEach(parent => {
      expect(parent.trim()).toBe(parentCategory);
    });
  }
);
