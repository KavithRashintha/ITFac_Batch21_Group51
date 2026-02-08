import { Given, When, Then } from '@cucumber/cucumber';

Given('the user logged-in as {string}', { timeout: 10000 }, async function (role) {
  await this.loginPage.navigateToLogin();
});

When('user navigates to {string}', async function (path) {
  await this.loginPage.navigateTo(`/${path}`);
});

When(
  'the user provide credentials with username {string} and password {string} and click the login button for ui',
  async function (username, password) {
    await this.loginPage.login(username, password);
  }
);

Then('User should be redirected to the dashboard', async function () {
  await this.loginPage.verifyRedirectToDashboard();
});

Given('user is not logged in', async function () {
  // Precondition only
});

Given('user is on the login page', async function () {
  await this.loginPage.navigateToLogin();
});

Then('login page should be displayed', async function () {
  await this.loginPage.verifyLoginPageDisplayed();
});

Then('username and password fields should be visible', async function () {
  await this.loginPage.verifyUsernameAndPasswordFieldsVisible();
});

When('user clicks the login button', async function () {
  await this.loginPage.clickLoginButton();
});

Then('user should not be logged in', async function () {
  await this.loginPage.verifyRemainsOnLoginPage();
});

When('user enters username {string}', async function (username) {
  await this.loginPage.fill(this.loginPage.usernameInput, username);
});

When('user enters password {string}', async function (password) {
  await this.loginPage.fill(this.loginPage.passwordInput, password);
});

Then(
  'global error message {string} should be displayed',
  async function (message) {
    await this.loginPage.verifyErrorMessage(message);
  }
);

Then('user should remain on the login page', async function () {
  await this.loginPage.verifyRemainsOnLoginPage();
});

Then('user should be redirected to the dashboard', async function () {
  await this.loginPage.verifyRedirectToDashboard();
});
