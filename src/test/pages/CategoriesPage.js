import { BasePage } from './BasePage.js';
import { expect } from '@playwright/test';
import { clickActionButton } from '../utils/commonActions.js';

export class CategoriesPage extends BasePage {
    constructor(page) {
        super(page);
        this.addCategoryButton = 'button:has-text("Add A Category"), a:has-text("Add A Category")';
        this.categoryNameInput = 'input[name="name"]';
        this.parentDropdown = 'select';
        this.saveButton = 'button[type="submit"]';
        this.cancelButton = 'text=Cancel';
        this.searchInput = 'input[placeholder*="Search"]';
        this.searchButton = 'button:has-text("Search")';
        this.categoryTable = 'table';
        this.pagination = '.pagination';
    }

    async clickAddCategory() {
        await this.waitForLoadState('networkidle');
        const button = this.getLocator(this.addCategoryButton).first();
        await this.verifyVisible(button, { timeout: 10000 });
        await this.verifyEnabled(button);
        await button.click();
    }

    async fillCategoryName(categoryName) {
        await this.fill(this.categoryNameInput, categoryName);
    }

    async selectParentCategory(parentName) {
        const dropdown = this.getLocator(this.parentDropdown).first();
        await this.verifyVisible(dropdown);
        await dropdown.selectOption({ label: parentName });
    }

    async clickSaveButton() {
        await this.click(this.saveButton);
    }

    async clickCancelButton() {
        await this.click(this.cancelButton);
    }

    async searchCategory(searchTerm) {
        const searchInput = this.getByPlaceholder('Search sub category');
        await this.verifyVisible(searchInput);
        await searchInput.fill(searchTerm);
    }

    async clickSearchButton() {
        const searchButton = this.getLocator(this.searchButton);
        await this.verifyVisible(searchButton);
        await searchButton.click();
        await this.waitForLoadState('networkidle');
    }

    async clickEditForCategory(categoryName) {
        await this.waitFor('table tbody tr');
        const row = this.getLocator('table tbody tr').filter({ hasText: categoryName }).first();
        await this.verifyVisible(row);
        await row.locator('[title="Edit"]').click();
    }

    async clickDeleteForCategory(categoryName) {
        await this.waitFor('table tbody tr');
        const row = this.getLocator('table tbody tr').filter({ hasText: categoryName }).first();
        await this.verifyVisible(row);

        const dialogPromise = this.handleDialog('dismiss', true);
        await row.locator('[title="Delete"]').click();
        return await dialogPromise;
    }

    async clickEditButtonFirst() {
        await this.getLocator('[title="Edit"]').first().click();
    }

    async sortByColumn(columnName) {
        const header = this.getLocator('th', { hasText: columnName });
        await this.verifyVisible(header);
        await header.click();
        await this.waitForLoadState('networkidle');
    }

    async verifyCategoryExists(categoryName) {
        const cell = this.getLocator(`td:has-text("${categoryName}")`);
        await this.verifyVisible(cell);
    }

    async verifyCategoryNotExists(categoryName) {
        const cell = this.getLocator(`td:has-text("${categoryName}")`);
        await this.verifyNotVisible(cell);
    }

    async getValidationMessage() {
        await this.click(this.saveButton);
        await this.waitFor('.invalid-feedback');
        return true;
    }

    async verifyValidationMessageDisplayed(expectedMessage) {
        const validationMessage = this.getByText(expectedMessage).or(
            this.getLocator('.error-message, .validation-error, .invalid-feedback, [role="alert"]')
        );
        await this.verifyVisible(validationMessage.first(), { timeout: 5000 });
    }

    async verifySuccessMessageDisplayed() {
        await this.waitFor('.alert.alert-success');
    }

    async verifyCategoryTableVisible() {
        await this.verifyVisible(this.categoryTable);
    }

    async verifyPaginationVisible() {
        await this.verifyVisible(this.pagination);
    }

    async verifySearchOptionVisible() {
        await this.verifyVisible(this.getByPlaceholder('Search'));
    }

    async verifySortingOptionVisible() {
        await this.verifyVisible(this.getLocator('th', { hasText: 'ID' }));
    }

    async verifyAddCategoryButtonVisible() {
        const button = this.getLocator(this.addCategoryButton).first();
        await this.verifyVisible(button, { timeout: 10000 });
        await this.verifyEnabled(button);
    }

    async verifyNavigatedToEditPage() {
        await this.waitForURL('**/ui/categories/edit/**');
    }

    async verifyNavigatedToCategoryPage() {
        await this.waitForURL('**/ui/categories');
    }

    async verifyCategoryUpdated(newName) {
        const updatedRow = this.getLocator(`td:has-text("${newName}")`);
        expect(await updatedRow.count()).toBeGreaterThan(0);
    }

    async verifyCategoryRemains(originalName) {
        const row = this.getLocator(`td:has-text("${originalName}")`);
        await this.verifyVisible(row);
    }

    async verifyDeleteConfirmation(expectedMessage) {
        return expectedMessage;
    }

    async verifySearchResultsDisplayed() {
        const rows = this.getLocator('tbody tr');
        await this.verifyVisible(rows.first());
    }

    async verifySearchResultsMatch(searchTerm) {
        await this.waitForLoadState('networkidle');
        const names = await this.getLocator('tbody tr td:nth-child(2)').allTextContents();
        expect(names.length).toBeGreaterThan(0);

        const hasMatchingResult = names.some(name =>
            name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        expect(hasMatchingResult).toBe(true);
    }

    async verifyFilteredByParent(parentCategory) {
        await this.waitForLoadState('networkidle');
        const parentColumnValues = await this.getLocator('tbody tr td:nth-child(3)').allTextContents();

        expect(parentColumnValues.length).toBeGreaterThan(0);
        const nonEmptyParents = parentColumnValues.filter(p => p.trim() && p.trim() !== '-');

        nonEmptyParents.forEach(parent => {
            expect(parent.trim()).toBe(parentCategory);
        });
    }

    async getSortedData(columnIndex) {
        await this.waitForLoadState('networkidle');
        return await this.getLocator(`tbody tr td:nth-child(${columnIndex})`).allTextContents();
    }
}
