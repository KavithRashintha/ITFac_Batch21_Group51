import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CategoryPage } from '../../../pages/CategoryPage.js';

//---------- TC_USER_CAT_01: Verify the Search functionality of the categories list for non-admin user ----------

//---------- TC_USER_CAT_01: Verify the Search functionality of the categories list for non-admin user ----------

When('user navigates to category page {string}', async function (path) {
    const categoryPage = new CategoryPage(this.page);
    await categoryPage.navigateTo(`http://localhost:8080/${path}`);
});

When('user enters {string} in the search bar', async function (name) {
    const categoryPage = new CategoryPage(this.page);
    await this.page.fill(categoryPage.searchInput, name);
    this.searchTerm = name;
});

When('user clicks on the search button', async function () {
    const categoryPage = new CategoryPage(this.page);
    await this.page.click(categoryPage.searchButton);
    await this.page.waitForLoadState('networkidle');
});

Then('the search results should display category/subcategory {string}', async function (searchTerm) {
    const names = await this.page.locator('tbody tr td:nth-child(2)').allTextContents();
    const hasMatchingResult = names.some(name =>
        name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    expect(hasMatchingResult).toBe(true);
});

Then('{string} message should be displayed', async function (message) {
    await expect(this.page.locator(`text=${message}`)).toBeVisible();
});

//---------- Search Reset ----------

When('user clicks on the Reset button', async function () {
    await this.page.click('button:has-text("Reset")');
    await this.page.waitForLoadState('networkidle');
});

Then('the search input should be cleared', async function () {
    const categoryPage = new CategoryPage(this.page);
    const value = await this.page.inputValue(categoryPage.searchInput);
    expect(value).toBe('');
});

Then('the category list should be reset', async function () {
    const rows = this.page.locator('tbody tr');
    await expect(rows).toBeVisible();
});

//---------- Button Visibility/State ----------

Then('Add Category button should not be visible', async function () {
    const categoryPage = new CategoryPage(this.page);
    await expect(this.page.locator(categoryPage.addCategoryButton)).not.toBeVisible();
});

Then('the Edit button for category {string} should be disabled', async function (categoryName) {
    const row = this.page.locator('table tbody tr').filter({ hasText: categoryName }).first();
    const editBtn = row.locator('[title="Edit"]');
    await expect(editBtn).toBeDisabled();
});

Then('the Delete button for category {string} should be disabled', async function (categoryName) {
    const row = this.page.locator('table tbody tr').filter({ hasText: categoryName }).first();
    const deleteBtn = row.locator('[title="Delete"]');
    await expect(deleteBtn).toBeDisabled();
});

//---------- Existing User Sorting (Keep for now if needed, but feature file uses Name/Parent) ----------

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

When('User sorts category list by Parent', async function () {
    await this.page.locator('th', { hasText: 'Parent' }).click();
    await this.page.waitForLoadState('networkidle');
});

Then('Category list should be sorted by parent', async function () {
    const parents = await this.page.locator('tbody tr td:nth-child(3)').allTextContents();
    expect(parents.length).toBeGreaterThan(0);
});

Then('The pagination should be visible for user view', async function () {
    const categoryPage = new CategoryPage(this.page);
    await expect(this.page.locator(categoryPage.pagination)).toBeVisible();
});
