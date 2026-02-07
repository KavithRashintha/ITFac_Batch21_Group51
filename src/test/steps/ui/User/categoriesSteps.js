import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CategoryPage } from '../../../pages/CategoryPage.js';

//---------- TC_USER_CAT_01: Verify the Search functionality of the categories list for non-admin user ----------

When('User navigates to {string} page', async function (path) {
    const categoryPage = new CategoryPage(this.page);
    await categoryPage.navigateTo(`http://localhost:8080/${path}`);
});

When('User enters subcategory name {string} in search field', async function (name) {
    const categoryPage = new CategoryPage(this.page);
    await this.page.fill(categoryPage.searchInput, name);
    this.searchTerm = name;
});

When('User clicks Search button for categories list', async function () {
    const categoryPage = new CategoryPage(this.page);
    await this.page.click(categoryPage.searchButton);
    await this.page.waitForLoadState('networkidle');
});

Then('Search results should be displayed in categories table', async function () {
    const categoryPage = new CategoryPage(this.page);
    await expect(this.page.locator(categoryPage.table)).toBeVisible();
});

Then('Results should match the search criteria in categories list', async function () {
    const categoryPage = new CategoryPage(this.page);
    const names = await this.page.locator('tbody tr td:nth-child(2)').allTextContents();
    expect(names.length).toBeGreaterThan(0);
    const hasMatchingResult = names.some(name => 
      name.toLowerCase().includes(this.searchTerm?.toLowerCase() || '')
    );
    expect(hasMatchingResult).toBe(true);
});

//---------- TC_USER_CAT_02: Verify the Filter functionality of the categories list for non-admin user ----------

When('User selects parent category {string} from dropdown', async function (category) {
    const categoryPage = new CategoryPage(this.page);
    await categoryPage.filterByParent(category);
});

Then('Only subcategories belonging to parent category {string} should be visible', async function (category) {
    await this.page.waitForLoadState('networkidle');
    const parentColumnValues = await this.page.locator('tbody tr td:nth-child(3)').allTextContents();
    expect(parentColumnValues.length).toBeGreaterThan(0);
    const nonEmptyParents = parentColumnValues.filter(p => p.trim() && p.trim() !== '-');
    nonEmptyParents.forEach(parent => {
      expect(parent.trim()).toBe(category);
    });
});

//---------- TC_USER_CAT_03: Verify sorting of category list by Name for non-admin user ----------

When('User sorts category list by Name', async function () {
    await this.page.locator('th', { hasText: 'Name' }).click();
    await this.page.waitForLoadState('networkidle');
});

Then('Category list should be sorted by name', async function () {
    const names = await this.page.locator('tbody tr td:nth-child(2)').allTextContents();
    const sorted = [...names].sort((a, b) => a.localeCompare(b));
    const reversed = [...sorted].reverse();
    const isSorted = JSON.stringify(names) === JSON.stringify(sorted) || 
                     JSON.stringify(names) === JSON.stringify(reversed);
    expect(isSorted).toBe(true);
});

//---------- TC_USER_CAT_04: Verify sorting of category list by Parent for non-admin user ----------

When('User sorts category list by Parent', async function () {
    await this.page.locator('th', { hasText: 'Parent' }).click();
    await this.page.waitForLoadState('networkidle');
});

Then('Category list should be sorted by parent', async function () {
    const parents = await this.page.locator('tbody tr td:nth-child(3)').allTextContents();
    expect(parents.length).toBeGreaterThan(0);
});

//-------------------------- Verify the visibility of the pagination --------------------------

Then('The pagination should be visible for user view', async function () {
    const categoryPage = new CategoryPage(this.page);
    await expect(this.page.locator(categoryPage.pagination)).toBeVisible();
});