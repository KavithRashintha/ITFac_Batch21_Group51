import { Given, When, Then } from "@cucumber/cucumber";
import { LoginPage } from "../../pages/LoginPage.js";

const url = "http://localhost:8080";

// ----------------------------- Background Navigation --------------------------------------
Given(
  "the user logged-in as {string}",
  { timeout: 10000 },
  async function (role) {
    const loginPage = new LoginPage(this.page);
    await loginPage.navigateToLogin();
  },
);

// Navigation and other shared steps are now in commonStep.js

When(
  "the user provide credentials with username {string} and password {string} and click the login button for ui",
  async function (username, password) {
    const loginPage = new LoginPage(this.page);
    await loginPage.login(username, password);
  },
);

Then("User should be redirected to the dashboard", async function () {
  const loginPage = new LoginPage(this.page);
  await loginPage.verifyDashboardRedirect();
});

// ---------------------------------------------- Login page validation --------------------------------------

Given("user is not logged in", async function () {
  // Precondition only
});

Given("user is on the login page", async function () {
  const loginPage = new LoginPage(this.page);
  await loginPage.navigateToLogin();
});

Then("login page should be displayed", async function () {
  const loginPage = new LoginPage(this.page);
  await loginPage.verifyUrlContains("ui/login");
});

Then("username and password fields should be visible", async function () {
  const loginPage = new LoginPage(this.page);
  await loginPage.verifyInputVisibility();
});

// ------------------------------------------ Empty login form submit validation -------------------------------

When("user clicks the login button", async function () {
  const loginPage = new LoginPage(this.page);
  await this.page.click(loginPage.loginButton);
});

Then("user should not be logged in", async function () {
  const loginPage = new LoginPage(this.page);
  await loginPage.verifyUrlContains("ui/login");
});

// ------------------------------------------- Invalid credentials ---------------------------------------------

When("user enters username {string}", async function (username) {
  const loginPage = new LoginPage(this.page);
  await this.page.fill(loginPage.usernameInput, username);
});

When("user enters password {string}", async function (password) {
  const loginPage = new LoginPage(this.page);
  await this.page.fill(loginPage.passwordInput, password);
});

// global error message {string} should be displayed - moved to commonStep.js

Then("user should remain on the login page", async function () {
  const loginPage = new LoginPage(this.page);
  await loginPage.verifyUrlContains("ui/login");
});
