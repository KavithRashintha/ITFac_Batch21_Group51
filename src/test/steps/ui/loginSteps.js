import {Given, When, Then} from "@cucumber/cucumber";
import { chromium, expect } from '@playwright/test';

Given('the user logged-in as {string}', async function (role) {
    this.browser = await chromium.launch({ headless: false });
    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();
    await this.page.goto('http://localhost:8080/ui/login');
});

When('the user provide credentials with username {string} and password {string} and click the login button for ui', async function (username, password) {
    await this.page.fill('input[name="username"]', username);
    await this.page.fill('input[name="password"]', password);
});

Then('User should be redirected to the dashboard', async function () {
    await Promise.all([
        this.page.waitForURL('**/ui/dashboard', { timeout: 20000 }),
        this.page.click('button[type="submit"]')
    ]);
});