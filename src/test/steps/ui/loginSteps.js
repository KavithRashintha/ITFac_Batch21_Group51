import {Given, When, Then} from "@cucumber/cucumber";
import { chromium } from '@playwright/test';

Given('User logged-in as Admin', async function () {

    this.browser = await chromium.launch({ headless: false});
    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();

    await this.page.goto('http://localhost:8081/ui/login');
});


When('Provide valid username {string} and password {string} for ui', async function (username, password) {

    await  this.page.fill('input[name="username"]', username);
    await this.page.fill('input[name="password"]', password);
});


Then('click the login button for ui', async function () {

    await this.page.click('button[type="submit"]');

    // wait until login finishes
    await this.page.waitForURL('**/ui/**');
    await this.page.goto('http://localhost:8081/ui/dashboard');

    // await browser.close();
});


       
    