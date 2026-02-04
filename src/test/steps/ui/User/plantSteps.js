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

//==================================== Verify Action plants button visibility ==========================================

Then('{string} button should not be visible', async function (buttonName) {

    const firstRow = this.page.locator('tbody tr').first();
    await expect(firstRow).toBeVisible();

    const button = firstRow.getByRole('button', { name: buttonName });
    const link = firstRow.getByRole('link', { name: buttonName });
    const title = firstRow.locator(`[title="${buttonName}"]`);
    const aria = firstRow.locator(`[aria-label="${buttonName}"]`);
    const href = firstRow.locator(`a[href*="/${buttonName.toLowerCase()}/"]`);

    await expect(button).not.toBeVisible();
    await expect(link).not.toBeVisible();
    await expect(title).not.toBeVisible();
    await expect(aria).not.toBeVisible();
    await expect(href).not.toBeVisible();
});

//==================================== Verify visibility of the pagination for plants list =============================

Then('The pagination should be visible for non-admin user', async function (){
    const pagination = this.page.locator('ul.pagination');
    await expect(pagination).toBeVisible()
});

//==================================== Verify the visibility of the sort indicator =====================================

Then('User see the sort indicator in the name column', async function () {

    const header = this.page.getByRole('columnheader', { name: 'Name', exact: false });
    await expect(header).toBeVisible();

    const byText = header.locator('span').filter({ hasText: /[↓↑]/ });
    const byCss = header.locator('a > span');
    const byHrefContext = this.page.locator('th a[href*="sortField=name"] span');
    const byXpath = header.locator('xpath=.//span');

    if (await byText.count() > 0) {
        await expect(byText).toBeVisible();
    }
    else if (await byHrefContext.count() > 0) {
        await expect(byHrefContext).toBeVisible();
    }
    else if (await byCss.count() > 0) {
        const text = await byCss.textContent();
        if (text && text.trim().length > 0) {
            await expect(byCss).toBeVisible();
        }
    }
    else if (await byXpath.count() > 0) {
        await expect(byXpath).toBeVisible();
    }
    else {
        throw new Error("Failed to find the Sort Indicator using Text, CSS, HREF, or XPath strategies.");
    }
});
