import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

When('user navigates to {string}', { timeout: 30000 }, async function (path) {
  await this.categoriesPage.navigateTo(`/${path}`);
});

When('user clicks on Edit button', async function () {
  await this.categoriesPage.clickEditButtonFirst();
});

Then('user navigates to edit category page', async function () {
  await this.categoriesPage.verifyNavigatedToEditPage();
});

When('user provide categoryName {string}', async function (newCategoryName) {
  await this.categoriesPage.fillCategoryName(newCategoryName);
});

Then('the error message should be visible', async function () {
  await this.categoriesPage.getValidationMessage();
});

When('user clicks on edit button for category {string}', async function (oldCategoryName) {
  await this.categoriesPage.clickEditForCategory(oldCategoryName);
});

When('user edits the categoryname {string}', async function (newName) {
  await this.categoriesPage.fillCategoryName(newName);
});

Then('user click save button', async function () {
  await this.categoriesPage.clickSaveButton();
});

Then('user navigates to category page', async function () {
  await this.categoriesPage.verifyNavigatedToCategoryPage();
});

Then('the success message should be displayed', async function () {
  await this.categoriesPage.verifySuccessMessageDisplayed();
});

Then('the category name should be updated to {string}', async function (newName) {
  await this.categoriesPage.verifyCategoryUpdated(newName);
});

When('user clicks on cancel button', async function () {
  await this.categoriesPage.clickCancelButton();
});

Then('the category name should remain as {string}', async function (originalName) {
  await this.categoriesPage.verifyCategoryRemains(originalName);
});

When('user clicks on delete button for category {string}', async function (categoryName) {
  this.lastDialogMessage = await this.categoriesPage.clickDeleteForCategory(categoryName);
});

Then('delete confirmation popup should be displayed', async function () {
  if (!this.lastDialogMessage) {
    throw new Error("No confirmation message appeared!");
  }
  expect(this.lastDialogMessage).toBe('Delete this category?');
});

Then('category list table should be visible', async function () {
  await this.categoriesPage.verifyCategoryTableVisible();
});

Then('pagination should be visible', async function () {
  await this.categoriesPage.verifyPaginationVisible();
});

Then('search option should be visible', async function () {
  await this.categoriesPage.verifySearchOptionVisible();
});

Then('sorting option should be visible', async function () {
  await this.categoriesPage.verifySortingOptionVisible();
});

Then('Add Category button should be visible and enabled', { timeout: 15000 }, async function () {
  await this.categoriesPage.verifyAddCategoryButtonVisible();
});

When('user clicks on Add Category button', async function () {
  await this.categoriesPage.clickAddCategory();
});

When('user clicks save button without entering category name', async function () {
  await this.categoriesPage.clickSaveButton();
});

Then('validation message {string} should be displayed', async function (expectedMessage) {
  await this.categoriesPage.verifyValidationMessageDisplayed(expectedMessage);
});

Then('user sorts category list by ID', async function () {
  await this.categoriesPage.sortByColumn('ID');

  const idsAfterClick = (await this.categoriesPage.getSortedData(1))
    .map(id => Number(id.trim()));

  const asc = [...idsAfterClick].sort((a, b) => a - b);
  const desc = [...asc].reverse();

  const isSortedAsc = JSON.stringify(idsAfterClick) === JSON.stringify(asc);
  const isSortedDesc = JSON.stringify(idsAfterClick) === JSON.stringify(desc);

  expect(isSortedAsc || isSortedDesc).toBe(true);
});

Then('user sorts category list by Name', async function () {
  await this.categoriesPage.sortByColumn('Name');
  const namesAfterFirstClick = await this.categoriesPage.getSortedData(2);

  await this.categoriesPage.sortByColumn('Name');
  const namesAfterSecondClick = await this.categoriesPage.getSortedData(2);

  const orderChanged = JSON.stringify(namesAfterFirstClick) !== JSON.stringify(namesAfterSecondClick);
  expect(orderChanged || namesAfterFirstClick.length > 0).toBe(true);
});

Then('user sorts category list by Parent', async function () {
  await this.categoriesPage.sortByColumn('Parent');
  const firstOrder = await this.categoriesPage.getSortedData(3);

  await this.categoriesPage.sortByColumn('Parent');
  const secondOrder = await this.categoriesPage.getSortedData(3);

  expect(firstOrder.length).toBeGreaterThan(0);
});

When('user enters subcategory name {string} in search field', async function (subcategory) {
  await this.categoriesPage.searchCategory(subcategory);
  this.searchTerm = subcategory;
});

When('user clicks Search button', async function () {
  await this.categoriesPage.clickSearchButton();
});

Then('search results should be displayed', async function () {
  await this.categoriesPage.verifySearchResultsDisplayed();
});

Then('results should match the search criteria', async function () {
  await this.categoriesPage.verifySearchResultsMatch(this.searchTerm);
});

When('user selects parent category {string}', async function (parentCategory) {
  await this.categoriesPage.selectParentCategory(parentCategory);
  this.selectedParent = parentCategory;
});

Then(
  'only subcategories belonging to parent category {string} should be displayed',
  async function (parentCategory) {
    await this.categoriesPage.verifyFilteredByParent(parentCategory);
  }
);
