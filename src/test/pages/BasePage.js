import { expect } from '@playwright/test';
import { loadConfig } from '../utils/dataLoader.js';
import * as actions from '../utils/commonActions.js';
import * as assertions from '../utils/commonAssertions.js';

export class BasePage {
    constructor(page) {
        this.page = page;
        this.config = loadConfig();
        this.baseURL = this.config.baseURL;
    }

    async navigateTo(path) {
        await actions.navigateTo(this.page, path, this.baseURL);
    }

    async click(selector, options = {}) {
        await actions.clickElement(this.page, selector, options);
    }

    async fill(selector, value, options = {}) {
        await actions.fillField(this.page, selector, value, options);
    }

    async select(selector, value, options = {}) {
        await actions.selectOption(this.page, selector, value, options);
    }

    async waitFor(selector, options = {}) {
        await actions.waitForElement(this.page, selector, options);
    }

    async verifyVisible(selector, options = {}) {
        await assertions.verifyElementVisible(this.page, selector, options);
    }

    async verifyNotVisible(selector, options = {}) {
        await assertions.verifyElementNotVisible(this.page, selector, options);
    }

    async verifyEnabled(selector, options = {}) {
        await assertions.verifyElementEnabled(this.page, selector, options);
    }

    async verifyText(selector, expectedText, options = {}) {
        await assertions.verifyTextContent(this.page, selector, expectedText, options);
    }

    async verifyURL(expectedPattern) {
        await assertions.verifyURL(this.page, expectedPattern);
    }

    async verifyMessage(message, options = {}) {
        await assertions.verifyMessageDisplayed(this.page, message, options);
    }

    async clickButtonByText(buttonText) {
        await actions.clickButtonByText(this.page, buttonText);
    }

    async handleDialog(action = 'accept', captureMessage = false) {
        return await actions.handleDialog(this.page, action, captureMessage ? '' : null);
    }

    async waitForLoadState(state = 'networkidle') {
        await this.page.waitForLoadState(state);
    }

    async waitForURL(pattern, options = {}) {
        await this.page.waitForURL(pattern, options);
    }

    getLocator(selector) {
        return this.page.locator(selector);
    }

    getByRole(role, options = {}) {
        return this.page.getByRole(role, options);
    }

    getByText(text, options = {}) {
        return this.page.getByText(text, options);
    }

    getByPlaceholder(placeholder) {
        return this.page.getByPlaceholder(placeholder);
    }
}
