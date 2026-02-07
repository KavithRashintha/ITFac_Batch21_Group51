import { expect } from "@playwright/test";
import { BasePage } from "./BasePage.js";

export class CategoryPage extends BasePage {
    constructor(page) {
        super(page);
        this.categoryNameInput = 'input[name="name"]';
        this.saveButton = 'button[type="submit"]';
        this.addCategoryButton = 'button:has-text("Add A Category"), a:has-text("Add A Category")';
        this.searchInput = 'input[placeholder*="Search"]';
        this.searchButton = 'button:has-text("Search")';
        this.parentDropdown = 'select';
        this.table = 'table';
        this.pagination = '.pagination';
    }

    async navigateToCategories() {
        await this.navigateTo('http://localhost:8080/ui/categories');
    }

    async addCategory(name) {
        await this.page.locator(this.addCategoryButton).first().click();
        await this.page.fill(this.categoryNameInput, name);
        await this.page.click(this.saveButton);
    }

    async editCategory(oldName, newName) {
        const row = this.page.locator('table tbody tr').filter({ hasText: oldName }).first();
        await row.locator('[title="Edit"]').click();
        await this.page.fill(this.categoryNameInput, newName);
        await this.page.click(this.saveButton);
    }

    async deleteCategory(name) {
        const row = this.page.locator('table tbody tr').filter({ hasText: name }).first();
        this.page.once('dialog', async dialog => {
            this.page.lastDialogMessage = dialog.message();
            await dialog.dismiss();
        });
        await row.locator('[title="Delete"]').click();
    }

    async searchCategory(name) {
        const input = this.page.locator(this.searchInput).first();
        await input.fill(name);
        await this.page.locator(this.searchButton).click();
    }

    async filterByParent(parentLabel) {
        const dropdown = this.page.locator(this.parentDropdown).first();
        await dropdown.selectOption({ label: parentLabel });
    }

    async verifyCategoryVisible(name) {
        await expect(this.page.locator(`td:has-text("${name}")`)).toBeVisible();
    }

    async verifySuccessMessage() {
        await expect(this.page.locator('.alert.alert-success')).toBeVisible();
    }
}
