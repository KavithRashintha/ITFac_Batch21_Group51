import { expect } from "@playwright/test";
import { BasePage } from "./BasePage.js";

export class PlantPage extends BasePage {
    constructor(page) {
        super(page);
        this.pagination = 'ul.pagination';
        this.tableRows = 'tbody tr';
    }

    async fillPlantForm(name, category, price, quantity) {
        if (name) await this.page.fill('input[name="name"]', name);
        if (price) await this.page.fill('input[name="price"]', price);
        if (quantity) await this.page.fill('input[name="quantity"]', quantity);

        if (category && category.trim() !== "") {
            // Assuming index 1 selection based on original code
            await this.page.selectOption('#categoryId', { index: 1 });
        }
    }

    async verifyPlantNotInList(plantName) {
        if (plantName && plantName.trim() !== "") {
            const plantCell = this.page.locator('table').getByRole('cell', { name: plantName, exact: true });
            await expect(plantCell).not.toBeVisible();
        }
    }

    async verifyEditPageDetails() {
        expect(this.page.url()).toContain('/edit');
        await expect(this.page.locator('#name')).not.toBeEmpty();
        await expect(this.page.locator('#price')).not.toBeEmpty();
        await expect(this.page.locator('#quantity')).not.toBeEmpty();
        await expect(this.page.locator('#categoryId')).not.toHaveValue('');
    }

    async verifyDeleteConfirmation() {
        if (!this.page.lastDialogMessage) {
            throw new Error("No confirmation message appeared!");
        }
        expect(this.page.lastDialogMessage).toBe('Delete this plant?');
        // Removing await this.page.close() as it closes the current page, better to let After hook handle it
    }

    async searchPlant(plantName) {
        const searchInput = this.page.locator('input[name="name"]');
        await searchInput.fill('');
        await searchInput.fill(plantName);
        await searchInput.press('Enter');
        await this.page.locator(this.tableRows).first().waitFor({ timeout: 15000 });
    }

    async filterByCategory(category) {
        await this.page.selectOption('select[name="categoryId"]', { label: category });
        await this.page.locator(this.tableRows).first().waitFor({ timeout: 10000 }).catch(() => { });
    }

    async verifyOnlyCategoryDisplayed(category) {
        const categoryCells = this.page.locator('tbody tr td:nth-child(2)');
        const count = await categoryCells.count();
        for (let i = 0; i < count; i++) {
            await expect(categoryCells.nth(i)).toHaveText(category);
        }
    }

    // Logic for the Low Quantity Badge loop
    async verifyLowQuantityBadges(threshold, badgeText) {
        const getRows = () => this.page.locator(this.tableRows);
        let foundLowQuantityPlant = false;

        while (true) {
            const rows = getRows();
            const rowCount = await rows.count();

            for (let i = 0; i < rowCount; i++) {
                const row = rows.nth(i);
                if ((await row.locator('text=No plants found').count()) > 0) continue;

                const quantitySpan = row.locator('td:nth-child(4) > span.text-danger.fw-bold');
                if ((await quantitySpan.count()) === 0) continue;

                const quantityText = await quantitySpan.innerText();
                const quantity = Number(quantityText.trim());

                if (Number.isNaN(quantity)) continue;

                if (quantity < threshold) {
                    foundLowQuantityPlant = true;
                    const badge = row.locator('td:nth-child(4) > span.badge', { hasText: badgeText });
                    await expect(badge).toBeVisible();
                }
            }

            const nextButtonLi = this.page.locator('.pagination li', { hasText: 'Next' });
            if ((await nextButtonLi.count()) === 0) break;
            const isDisabled = await nextButtonLi.first().getAttribute('class');
            if (isDisabled && isDisabled.includes('disabled')) break;

            await nextButtonLi.locator('a').click();
            await this.page.waitForLoadState('networkidle');
            await getRows().first().waitFor({ timeout: 10000 });
        }
        expect(foundLowQuantityPlant).toBeTruthy();
    }
}
