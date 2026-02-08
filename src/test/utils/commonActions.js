import { expect } from '@playwright/test';

export async function clickElement(page, selector, options = {}) {
    const element = typeof selector === 'string' ? page.locator(selector) : selector;
    await element.click(options);
}

export async function fillField(page, selector, value, options = {}) {
    if (value !== undefined && value !== null && value !== '') {
        const element = typeof selector === 'string' ? page.locator(selector) : selector;
        await element.fill(value, options);
    }
}

export async function selectOption(page, selector, value, options = {}) {
    const element = typeof selector === 'string' ? page.locator(selector) : selector;

    // Handle both string values and option objects like { label: 'text' }
    if (value) {
        if (typeof value === 'string' && value.trim() !== '') {
            await element.selectOption(value, options);
        } else if (typeof value === 'object') {
            await element.selectOption(value, options);
        }
    }
}

export async function waitForElement(page, selector, options = {}) {
    const element = typeof selector === 'string' ? page.locator(selector) : selector;
    await element.waitFor(options);
}

export async function navigateTo(page, path, baseURL, options = {}) {
    const url = path.startsWith('http') ? path : `${baseURL}${path}`;
    await page.goto(url, { waitUntil: 'domcontentloaded', ...options });
}

export async function handleDialog(page, action = 'accept', message = null) {
    return new Promise((resolve) => {
        page.once('dialog', async (dialog) => {
            if (message !== null) {
                resolve(dialog.message());
            }
            if (action === 'accept') {
                await dialog.accept();
            } else {
                await dialog.dismiss();
            }
            if (message === null) {
                resolve(true);
            }
        });
    });
}

export async function clickButtonByText(page, buttonText) {
    const button = page.getByRole('button', { name: buttonText });

    if (await button.count() > 0) {
        await button.click();
    } else {
        await page.getByRole('link', { name: buttonText }).click();
    }
}

export async function clickActionButton(row, buttonName) {
    const button = row.getByRole('button', { name: buttonName });
    const link = row.getByRole('link', { name: buttonName });
    const title = row.locator(`[title="${buttonName}"]`);
    const aria = row.locator(`[aria-label="${buttonName}"]`);
    const href = row.locator(`a[href*="/${buttonName.toLowerCase()}/"]`);

    if (await button.count() > 0) {
        await button.click();
    } else if (await link.count() > 0) {
        await link.click();
    } else if (await title.count() > 0) {
        await title.click();
    } else if (await aria.count() > 0) {
        await aria.click();
    } else if (await href.count() > 0) {
        await href.click();
    } else {
        throw new Error(`Failed to find the ${buttonName} button using any known strategy.`);
    }
}
