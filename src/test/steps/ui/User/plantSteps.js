import { When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

When('User selects category {string} from filter', { timeout: 15000 }, async function (category) {
    await this.plantsPage.select('select[name="categoryId"]', { label: category });
    const rows = this.plantsPage.getLocator('tbody tr');
    await rows.first().waitFor({ timeout: 10000 }).catch(() => { });
});

When('User searches for plant {string}', { timeout: 20000 }, async function (plantName) {
    const searchInput = this.plantsPage.getLocator('input[name="name"]');
    await searchInput.fill('');
    await searchInput.fill(plantName);
    await searchInput.press('Enter');
    const rows = this.plantsPage.getLocator('tbody tr');
    await rows.first().waitFor({ timeout: 15000 });
});

Then('All plants should be displayed', async function () {
    const rows = this.plantsPage.getLocator('tbody tr');
    await rows.first().waitFor({ timeout: 10000 });
    const count = await rows.count();
    await expect(count).toBeGreaterThan(0);
});

When('User clicks {string} button', async function (buttonName) {
    const button = this.plantsPage.getByRole('button', { name: buttonName });
    await button.waitFor({ state: 'visible' });
    await Promise.all([
        this.page.waitForLoadState('networkidle'),
        button.click()
    ]);
});

Then('Only plants with category {string} should be displayed', { timeout: 10000 }, async function (category) {
    const categoryCells = this.plantsPage.getLocator('tbody tr td:nth-child(2)');
    const count = await categoryCells.count();
    for (let i = 0; i < count; i++) {
        await expect(categoryCells.nth(i)).toHaveText(category);
    }
});

Then('The plant {string} should be visible in the results', { timeout: 10000 }, async function (plantName) {
    const plantCell = this.plantsPage.getLocator('tbody tr td', { hasText: plantName });
    await plantCell.waitFor({ timeout: 10000 });
    await this.plantsPage.verifyVisible(plantCell);
});

Then('No plants should be displayed', { timeout: 10000 }, async function () {
    const noPlantsRow = this.plantsPage.getLocator('tbody tr td', {
        hasText: 'No plants found'
    });
    await this.plantsPage.verifyVisible(noPlantsRow);
});

Then('A message {string} should be visible', { timeout: 10000 }, async function (message) {
    await this.plantsPage.verifyMessage(message, { timeout: 10000 });
});

Then('Plants with quantity below {int} should display the {string} badge',
    { timeout: 60000 },
    async function (threshold, badgeText) {
        const getRows = () => this.plantsPage.getLocator('tbody tr');
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

            const nextButtonLi = this.plantsPage.getLocator('.pagination li', { hasText: 'Next' });
            if ((await nextButtonLi.count()) === 0) break;
            const isDisabled = await nextButtonLi.first().getAttribute('class');
            if (isDisabled && isDisabled.includes('disabled')) break;

            await nextButtonLi.locator('a').click();
            await this.page.waitForLoadState('networkidle');
            await getRows().first().waitFor({ timeout: 10000 });
        }

        expect(foundLowQuantityPlant).toBeTruthy();
    });

Then('{string} button should not be visible', async function (buttonName) {
    const firstRow = this.plantsPage.getLocator('tbody tr').first();
    await this.plantsPage.verifyVisible(firstRow);

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

Then('The pagination should be visible for non-admin user', async function () {
    await this.plantsPage.verifyPaginationVisible();
});

Then('User see the sort indicator in the Name column', async function () {
    const header = this.plantsPage.getByRole('columnheader', { name: 'Name', exact: false });
    await this.plantsPage.verifyVisible(header);

    const byText = header.locator('span').filter({ hasText: /[↓↑]/ });
    const byCss = header.locator('a > span');
    const byHrefContext = this.plantsPage.getLocator('th a[href*="sortField=name"] span');
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
        throw new Error("Failed to find the Sort Indicator using Text, CSS, href, or XPath strategies.");
    }
});

When('User clicks on {string} column header', async function (columnName) {
    const byLink = this.plantsPage.getLocator('th a').filter({ hasText: columnName });
    const byRole = this.plantsPage.getByRole('columnheader', { name: columnName, exact: false });
    const byText = this.plantsPage.getLocator('th').filter({ hasText: columnName });
    const byXpath = this.plantsPage.getLocator(`xpath=//th[contains(., "${columnName}")]`);

    if (await byLink.count() > 0) {
        await byLink.click();
    }
    else if (await byRole.count() > 0) {
        await byRole.click();
    }
    else if (await byText.count() > 0) {
        await byText.click();
    }
    else if (await byXpath.count() > 0) {
        await byXpath.click();
    }
    else {
        throw new Error(`Failed to find column header using Link, Role, Text, or XPath strategies.`);
    }
});

Then('User see the sort indicator {string} in the name column', async function (direction) {
    const header = this.plantsPage.getByRole('columnheader', { name: 'Name', exact: false });

    const expectedChar = direction.toLowerCase() === 'up' ? '↑' : '↓';
    const expectedClass = direction.toLowerCase() === 'up' ? 'bi-arrow-up' : 'bi-arrow-down';

    const anyIndicator = header.locator('span').filter({ hasText: /[↑↓]/ }).or(header.locator(`.${expectedClass}`));

    try {
        await expect(anyIndicator).toBeVisible({ timeout: 5000 });
    } catch (e) {

        throw e;
    }

    const textIndicator = header.locator('span').filter({ hasText: expectedChar });
    const iconIndicator = header.locator(`.${expectedClass}`);

    if (await textIndicator.count() > 0) {
        await expect(textIndicator).toBeVisible();
    } else if (await iconIndicator.count() > 0) {
        await expect(iconIndicator).toBeVisible();
    } else {
        const actualText = await header.innerText();
        throw new Error(`Failed to find sort indicator for '${direction}'. Expected '${expectedChar}' or class '${expectedClass}'. Actual Header Text: "${actualText}"`);
    }
});