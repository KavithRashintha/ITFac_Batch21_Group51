import { expect } from "@playwright/test";
import { BasePage } from "./BasePage.js";

export class SalesPage extends BasePage {
    constructor(page) {
        super(page);
        this.sellPlantButton = 'a:has-text("Sell Plant")';
        this.salesTableRows = 'table tbody tr';
    }

    async navigateToSales() {
        await this.navigateTo('http://localhost:8080/ui/sales');
    }

    async verifySellPlantButtonVisible() {
        await expect(this.page.locator(this.sellPlantButton)).toBeVisible();
    }

    async verifySalesItemsVisible() {
        await expect(this.page.locator(this.salesTableRows).first()).toBeVisible();
    }

    async deleteSaleItem() {
        const deleteButton = this.page.locator(this.salesTableRows).first().locator("button, a").first();
        await deleteButton.click();
    }

    async verifyDeleteDialog() {
        this.page.once("dialog", async (dialog) => {
            expect(dialog.type()).toBe("confirm");
            expect(dialog.message()).toMatch(/delete/i);
            await dialog.dismiss();
        });
    }
}
