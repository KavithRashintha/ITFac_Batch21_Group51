import { When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { PlantPage } from '../../../pages/PlantPage.js';

// ===================== Filter by category =====================
When('User selects category {string} from filter', { timeout: 15000 }, async function (category) {
    const plantPage = new PlantPage(this.page);
    await plantPage.filterByCategory(category);
});

// ===================== Search plants =====================
When('User searches for plant {string}', { timeout: 20000 }, async function (plantName) {
    const plantPage = new PlantPage(this.page);
    await plantPage.searchPlant(plantName);
});


Then('All plants should be displayed', async function () {
    const rows = this.page.locator('tbody tr');
    await rows.first().waitFor({ timeout: 10000 });
    const count = await rows.count();
    await expect(count).toBeGreaterThan(0);
});


//==================================== Only plants with specific category should be displayed ==========================

Then('Only plants with category {string} should be displayed', { timeout: 10000 }, async function (category) {
    const plantPage = new PlantPage(this.page);
    await plantPage.verifyOnlyCategoryDisplayed(category);
});

//==================================== Check if a specific plant is visible ============================================

Then('The plant {string} should be visible in the results', { timeout: 10000 }, async function (plantName) {
    const plantCell = this.page.locator('tbody tr td', { hasText: plantName });
    await plantCell.waitFor({ timeout: 10000 });
    await expect(plantCell).toBeVisible();
});

//==================================== Check if no plants are displayed ================================================

Then('No plants should be displayed', { timeout: 10000 }, async function () {
    const noPlantsRow = this.page.locator('tbody tr td', {
        hasText: 'No plants found'
    });
    await expect(noPlantsRow).toBeVisible();
});

//==================================== Verify specific message is visible (e.g., "No plants found") ====================

Then('A message {string} should be visible', { timeout: 10000 }, async function (message) {
    const plantPage = new PlantPage(this.page);
    await plantPage.verifyTextVisible(message);
});

//==================================== Verify "Low" badge when plant quantity is below 5 ===============================
Then('Plants with quantity below {int} should display the {string} badge',
    { timeout: 60000 },
    async function (threshold, badgeText) {
        const plantPage = new PlantPage(this.page);
        await plantPage.verifyLowQuantityBadges(threshold, badgeText);
    });

//==================================== Verify Action plants button visibility ==========================================

Then('{string} button should not be visible', async function (buttonName) {
    const firstRow = this.page.locator('tbody tr').first();
    await expect(firstRow).toBeVisible();
    const button = firstRow.getByRole('button', { name: buttonName });
    await expect(button).not.toBeVisible();
});

//==================================== Verify visibility of the pagination for plants list =============================

Then('The pagination should be visible for non-admin user', async function () {
    const pagination = this.page.locator('ul.pagination');
    await expect(pagination).toBeVisible()
});

//==================================== Verify the visibility of the sort indicator =====================================

Then('User see the sort indicator in the Name column', async function () {
    const header = this.page.getByRole('columnheader', { name: 'Name', exact: false });
    await expect(header).toBeVisible();
    const byText = header.locator('span').filter({ hasText: /[↓↑]/ });
    if (await byText.count() > 0) await expect(byText).toBeVisible();
});

//==================================== Verify the functionality of sort indicator ======================================

When('User clicks on {string} column header', async function (columnName) {
    const byRole = this.page.getByRole('columnheader', { name: columnName, exact: false });
    await byRole.click();
});

Then('User see the sort indicator {string} in the name column', { timeout: 15000 }, async function (direction) {
    const header = this.page.getByRole('columnheader', { name: 'Name', exact: false });
    const expectedChar = direction.toLowerCase() === 'up' ? '↑' : '↓';
    const textIndicator = header.locator('span').filter({ hasText: expectedChar });
    await expect(textIndicator).toBeVisible();
});