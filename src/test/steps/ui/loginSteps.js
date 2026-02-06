import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

// ---------- Background login (Admin/User) ----------

Given('the user logged-in as {string}', { timeout: 10000 }, async function (role) {
  await this.page.goto('http://localhost:8080/ui/login', { 
    waitUntil: 'domcontentloaded',
    timeout: 10000 
  });
  
  // Wait for login form to be ready
  await this.page.waitForSelector('input[name="username"]', { timeout: 5000 });
});

When(
  'the user provide credentials with username {string} and password {string} and click the login button for ui',
  async function (username, password) {
    await this.page.fill('input[name="username"]', username);
    await this.page.fill('input[name="password"]', password);
    await this.page.click('button[type="submit"]');
  }
);

Then('User should be redirected to the dashboard', async function () {
  await expect(this.page).toHaveURL(/\/ui\/dashboard/);
});

// ---------- Login page validation ----------

Given('user is not logged in', async function () {
  // Precondition only
});

Given('user is on the login page', async function () {
  await this.page.goto('http://localhost:8080/ui/login');
});

Then('login page should be displayed', async function () {
  await expect(this.page).toHaveURL(/\/ui\/login/);
});

Then('username and password fields should be visible', async function () {
  await expect(this.page.locator('input[name="username"]')).toBeVisible();
  await expect(this.page.locator('input[name="password"]')).toBeVisible();
});

// ---------- Login validation ----------

When('user clicks the login button', async function () {
  await this.page.click('button[type="submit"]');
});

Then('user should not be logged in', async function () {
  await expect(this.page).toHaveURL(/\/ui\/login/);
});

// ---------- Invalid credentials ----------

When('user enters username {string}', async function (username) {
  await this.page.fill('input[name="username"]', username);
});

When('user enters password {string}', async function (password) {
  await this.page.fill('input[name="password"]', password);
});

Then(
  'global error message {string} should be displayed',
  async function (message) {
    await expect(this.page.locator(`text=${message}`)).toBeVisible();
  }
);

Then('user should remain on the login page', async function () {
  await expect(this.page).toHaveURL(/\/ui\/login/);
});

Then('user should be redirected to the dashboard', async function () {
  await expect(this.page).toHaveURL(/\/ui\/dashboard/);
});
