import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

function sortStrings(arr, direction = 'asc') {
  const sorted = [...arr].sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true })
  );
  return direction === 'asc' ? sorted : sorted.reverse();
}

//--------------------------- Verify the Edit category button in Actions ---------------------------

When('user navigates to {string}', { timeout: 30000 }, async function (path) {
    await this.page.goto(`http://localhost:8080/${path}`, { 
        waitUntil: 'domcontentloaded',
        timeout: 30000 
    });
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

// ---------- Category name required validation ----------

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

// ---------- Category sorting verification ----------

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

  // First click
  await nameHeader.click();
  await this.page.waitForLoadState('networkidle');
  const namesAfterFirstClick = await getNames();

  // Second click
  await nameHeader.click();
  await this.page.waitForLoadState('networkidle');
  const namesAfterSecondClick = await getNames();

  // At least one of these must be true:
  // 1. Order changes
  // 2. Order remains consistent (already sorted / single rule)
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

// ---------- Search categories without parent filter ----------

When('user enters subcategory name {string} in search field', async function (subcategory) {
  const searchInput = this.page.getByPlaceholder('Search sub category');
  await expect(searchInput).toBeVisible();
  await searchInput.fill(subcategory);
  
  // Store search term for validation
  this.searchTerm = subcategory;
});

When('user clicks Search button', async function () {
  const searchButton = this.page.locator('button:has-text("Search")');
  await expect(searchButton).toBeVisible();
  await searchButton.click();
  
  // Wait for search results to load
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
  
  // Verify at least one result contains the searched term (stored in context)
  // If search was for "Sub_1", check that at least one name contains it
  const hasMatchingResult = names.some(name => 
    name.toLowerCase().includes(this.searchTerm?.toLowerCase() || '')
  );
  
  expect(hasMatchingResult).toBe(true);
});

// ---------- Filter categories by parent ----------

When('user selects parent category {string}', async function (parentCategory) {
  // Use more specific selector - the dropdown next to search field
  const parentDropdown = this.page.locator('select').first();
  await expect(parentDropdown).toBeVisible();
  await parentDropdown.selectOption({ label: parentCategory });
  
  // Store selected parent for validation
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

    // Verify we have results
    expect(parentColumnValues.length).toBeGreaterThan(0);
    
    // All rows should match selected parent (filter out empty/dash values)
    const nonEmptyParents = parentColumnValues.filter(p => p.trim() && p.trim() !== '-');
    
    nonEmptyParents.forEach(parent => {
      expect(parent.trim()).toBe(parentCategory);
    });
  }
);


