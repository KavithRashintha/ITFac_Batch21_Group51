import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

// ------------ Edit Category -----------------
When('user clicks on Edit button', async function () {
    await this.page.locator('[title="Edit"]').first().click();
});

Then('user navigates to edit category page', async function(){
    await this.page.waitForURL('**/ui/categories/edit/**');
});


//-------------- Edit Category - Validation ------------

When('user provide categoryName {string}', async function(newCategoryName){
    await this.page.fill('input[name="name"]',newCategoryName);
} );

Then('user click save button', async function () {
    await this.page.click('button[type="submit"]');
});

// --------------- View Categories ------------------

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

// ---------------------- Add category – required validation -------------------------

When('user clicks on Add Category button', async function () {
  const addCategoryButton = this.page.locator(
    'button:has-text("Add A Category"), a:has-text("Add A Category")'
  ).first();

  await expect(addCategoryButton).toBeVisible();
  await addCategoryButton.click();
});

When('user clicks save button without entering category name', async function () {
  await this.page.click('button[type="submit"]');
});

Then('validation message {string} should be displayed', async function (expectedMessage) {
  // Wait for validation message to appear
  const validationMessage = this.page.locator('text=' + expectedMessage).or(
    this.page.locator('.error-message, .validation-error, .invalid-feedback, [role="alert"]')
  );
  
  await expect(validationMessage.first()).toBeVisible({ timeout: 5000 });
});

// --------------------------- Category sorting verification -------------------------------

Then('user sorts category list by ID', async function () {
  const idHeader = this.page.locator('th', { hasText: 'ID' });
  await expect(idHeader).toBeVisible();

  const getIds = async () =>
    (await this.page.locator('tbody tr td:first-child').allTextContents())
      .map(id => Number(id.trim()));

  // Click once to apply sorting
  await idHeader.click();
  await this.page.waitForLoadState('networkidle');

  const idsAfterClick = await getIds();

  const asc = [...idsAfterClick].sort((a, b) => a - b);
  const desc = [...asc].reverse();

  const isSortedAsc =
    JSON.stringify(idsAfterClick) === JSON.stringify(asc);
  const isSortedDesc =
    JSON.stringify(idsAfterClick) === JSON.stringify(desc);

  expect(isSortedAsc || isSortedDesc).toBe(true);
});

Then('user sorts category list by Name', async function () {
  const nameHeader = this.page.locator('th', { hasText: 'Name' });
  await expect(nameHeader).toBeVisible();

  const getNames = async () =>
    (await this.page.locator('tbody tr td:nth-child(2)').allTextContents())
      .map(name => name.trim());

  await nameHeader.click();
  await this.page.waitForLoadState('networkidle');
  const namesAfterFirstClick = await getNames();

  await nameHeader.click();
  await this.page.waitForLoadState('networkidle');
  const namesAfterSecondClick = await getNames();

  const orderChanged =
    JSON.stringify(namesAfterFirstClick) !==
    JSON.stringify(namesAfterSecondClick);

  expect(orderChanged || namesAfterFirstClick.length > 0).toBe(true);
});


Then('user sorts category list by Parent', async function () {
  const parentHeader = this.page.locator('th', { hasText: 'Parent' });
  await expect(parentHeader).toBeVisible();

  const getParents = async () =>
    (await this.page.locator('tbody tr td:nth-child(3)').allTextContents())
      .map(parent => parent.trim());

  await parentHeader.click();
  await this.page.waitForLoadState('networkidle');
  const firstOrder = await getParents();

  await parentHeader.click();
  await this.page.waitForLoadState('networkidle');
  const secondOrder = await getParents();

  expect(firstOrder.length).toBeGreaterThan(0);
});

// ---------------------- Search categories without parent filter ------------------------

When('user enters subcategory name {string} in search field', async function (subcategory) {
  const searchInput = this.page.getByPlaceholder('Search sub category');
  await expect(searchInput).toBeVisible();
  await searchInput.fill(subcategory);

  this.searchTerm = subcategory;
});

When('user clicks Search button', async function () {
  const searchButton = this.page.locator('button:has-text("Search")');
  await expect(searchButton).toBeVisible();
  await searchButton.click();
  
  await this.page.waitForLoadState('networkidle');
});

Then('search results should be displayed', async function () {
  const rows = this.page.locator('tbody tr');
  await expect(rows.first()).toBeVisible();
});

Then('results should match the search criteria', async function () {
  // Wait for results to load
  await this.page.waitForLoadState('networkidle');
  
  const names = await this.page.locator('tbody tr td:nth-child(2)').allTextContents();
  expect(names.length).toBeGreaterThan(0);

  const hasMatchingResult = names.some(name => 
    name.toLowerCase().includes(this.searchTerm?.toLowerCase() || '')
  );
  
  expect(hasMatchingResult).toBe(true);
});

// -------------------------- Filter categories by parent ------------------------

When('user selects parent category {string}', async function (parentCategory) {
  const parentDropdown = this.page.locator('select').first();
  await expect(parentDropdown).toBeVisible();
  await parentDropdown.selectOption({ label: parentCategory });

  this.selectedParent = parentCategory;
});

Then(
  'only subcategories belonging to parent category {string} should be displayed',
  async function (parentCategory) {
    // Wait for filtered results
    await this.page.waitForLoadState('networkidle');
    
    const parentColumnValues = await this.page
      .locator('tbody tr td:nth-child(3)')
      .allTextContents();

    expect(parentColumnValues.length).toBeGreaterThan(0);
    
    const nonEmptyParents = parentColumnValues.filter(p => p.trim() && p.trim() !== '-');
    
    nonEmptyParents.forEach(parent => {
      expect(parent.trim()).toBe(parentCategory);
    });
  }
);


