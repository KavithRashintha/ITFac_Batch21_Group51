import { expect } from '@playwright/test';

export async function verifyElementVisible(page, selector, options = {}) {
    const element = typeof selector === 'string' ? page.locator(selector) : selector;
    await expect(element).toBeVisible(options);
}

export async function verifyElementNotVisible(page, selector, options = {}) {
    const element = typeof selector === 'string' ? page.locator(selector) : selector;
    await expect(element).not.toBeVisible(options);
}

export async function verifyElementEnabled(page, selector, options = {}) {
    const element = typeof selector === 'string' ? page.locator(selector) : selector;
    await expect(element).toBeEnabled(options);
}

export async function verifyTextContent(page, selector, expectedText, options = {}) {
    const element = typeof selector === 'string' ? page.locator(selector) : selector;
    await expect(element).toHaveText(expectedText, options);
}

export async function verifyURL(page, expectedPattern) {
    if (typeof expectedPattern === 'string') {
        await expect(page).toHaveURL(new RegExp(expectedPattern));
    } else {
        await expect(page).toHaveURL(expectedPattern);
    }
}

export async function verifyMessageDisplayed(page, message, options = {}) {
    const messageLocator = page.getByText(message, { exact: false });
    await expect(messageLocator).toBeVisible(options);
}

export async function verifyElementCount(page, selector, count) {
    const element = typeof selector === 'string' ? page.locator(selector) : selector;
    await expect(element).toHaveCount(count);
}

export async function verifyElementNotEmpty(page, selector) {
    const element = typeof selector === 'string' ? page.locator(selector) : selector;
    await expect(element).not.toBeEmpty();
}

export async function verifyElementHasValue(page, selector, value) {
    const element = typeof selector === 'string' ? page.locator(selector) : selector;
    await expect(element).toHaveValue(value);
}

export async function verifyElementNotHaveValue(page, selector, value) {
    const element = typeof selector === 'string' ? page.locator(selector) : selector;
    await expect(element).not.toHaveValue(value);
}
