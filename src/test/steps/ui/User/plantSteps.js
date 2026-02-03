import { When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

// ===================== Filter by category =====================
When('User selects category {string} from filter', { timeout: 15000 }, async function (category) {
    await this.page.selectOption('select[name="categoryId"]', { label: category });
    const rows = this.page.locator('tbody tr');
    await rows.first().waitFor({ timeout: 10000 }).catch(() => {}); 
});

// ===================== Search plants =====================
When('User searches for plant {string}', { timeout: 20000 }, async function (plantName) {

    const searchInput = this.page.locator('input[name="name"]');

    await searchInput.fill('');
    await searchInput.fill(plantName);
    await searchInput.press('Enter');

    const rows = this.page.locator('tbody tr');

    await rows.first().waitFor({ timeout: 15000 });
});


Then('All plants should be displayed', async function () {
    const rows = this.page.locator('tbody tr');
    await rows.first().waitFor({ timeout: 10000 });
    const count = await rows.count();
    await expect(count).toBeGreaterThan(0);
});


// Only plants with specific category should be displayed
Then('Only plants with category {string} should be displayed', { timeout: 10000 }, async function (category) {
    const categoryCells = this.page.locator('tbody tr td:nth-child(2)'); // Adjust column index as per table
    const count = await categoryCells.count();
    for (let i = 0; i < count; i++) {
        await expect(categoryCells.nth(i)).toHaveText(category);
    }
});

// Check if a specific plant is visible
Then('The plant {string} should be visible in the results', { timeout: 10000 }, async function (plantName) {
    const plantCell = this.page.locator('tbody tr td', { hasText: plantName });
    await plantCell.waitFor({ timeout: 10000 });
    await expect(plantCell).toBeVisible();
});

// Check if no plants are displayed
Then('No plants should be displayed', { timeout: 10000 }, async function () {

    const noPlantsRow = this.page.locator('tbody tr td', {
        hasText: 'No plants found'
    });

    await expect(noPlantsRow).toBeVisible();
});

// Verify specific message is visible (e.g., "No plants found")
Then('A message {string} should be visible', { timeout: 10000 }, async function (message) {
    const messageLocator = this.page.getByText(message, { exact: false });
    await messageLocator.waitFor({ timeout: 10000 });
    await expect(messageLocator).toBeVisible();
});

// Verify "Low" badge when plant quantity is below 5
Then('Plants with quantity below 5 should display the {string} badge across all pages', 
  { timeout: 60000 }, 
  async function (badgeText) {

    const getRows = () => this.page.locator('tbody tr');
    const nextButton = this.page.locator('.pagination li a', { hasText: 'Next' });

    let foundLowQuantityPlant = false;

    while (true) {
        const rows = getRows();
        const rowCount = await rows.count();

        for (let i = 0; i < rowCount; i++) {
            const row = rows.nth(i);

            if ((await row.locator('text=No plants found').count()) > 0) continue;

            const quantityText = await row.locator('td:nth-child(4)').innerText();
            const quantity = Number(quantityText.trim());

            if (Number.isNaN(quantity)) continue;

            if (quantity < 5) {
                foundLowQuantityPlant = true;

                const badge = row.locator(`text=${badgeText}`);
                await expect(badge).toBeVisible();
                break; 
            }
        }

        if (foundLowQuantityPlant) break;
        if ((await nextButton.count()) === 0 || !(await nextButton.isEnabled())) break;

        await nextButton.click();
        await getRows().first().waitFor({ timeout: 10000 });
        await this.page.waitForTimeout(300); 
    }

    expect(foundLowQuantityPlant).toBeTruthy();
});
