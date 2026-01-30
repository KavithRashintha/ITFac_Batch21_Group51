import {Given, When, Then} from "@cucumber/cucumber";
import { chromium } from '@playwright/test';

export let browser;
let context;
export let page;

Given('User logged-in as Admin', async function () {
    console.log("URL Provided for ui")

    browser = await chromium.launch({ headless: false});
    context = await browser.newContext();
    page = await context.newPage();

    await page.goto('http://localhost:8080/ui/login');
});


When('Provide valid username {string} and password {string} for ui', async function (username, password) {
    console.log("Username and Password provided for ui")

    await  page.fill('input[name="username"]', username);
    await page.fill('input[name="password"]', password);
});


Then('click the login button for ui', async function () {
    console.log("Login button clicked for ui and navigating to dashboard")

    await page.click('button[type="submit"]');

    // wait until login finishes
    await page.waitForURL('**/ui/**');
    await page.goto('http://localhost:8080/ui/dashboard');

    // await browser.close();
});


       
    