import { When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { PlantPage } from "../../../pages/PlantPage.js";

// ============================== Navigation ==================================================

When("User navigates to {string}", async function (url) {
  const plantPage = new PlantPage(this.page);
  await plantPage.navigateTo(`http://localhost:8080${url}`);
});

//======================= Verify Add a Plant button visibility ===============================================

Then('The "Add a Plant" button should be visible', async function () {
  const button = this.page.getByRole("link", { name: "Add a Plant" });
  await expect(button).toBeVisible();
});

// ========================== Button Click =================================================

When("User clicks {string} button", async function (buttonName) {
  const plantPage = new PlantPage(this.page);
  await plantPage.clickGenericButton(buttonName);
});

//============================= Form Filling ====================================================

When(
  "Provide {string} plantName {string}, select category {string}, price as {string}, and quantity as {string} for ui",
  { timeout: 15000 },
  async function (_, name, category, price, quantity) {
    const plantPage = new PlantPage(this.page);
    await plantPage.fillPlantForm(name, category, price, quantity);
  },
);

// ==================================== Display Messages ========================================================

Then("User see an error message as {string}", async function (message) {
  const plantPage = new PlantPage(this.page);
  await plantPage.verifyTextVisible(message);
});

Then("User see a success message as {string}", async function (message) {
  const plantPage = new PlantPage(this.page);
  await plantPage.verifyTextVisible(message);
});

//=================== Verify visibility of the pagination for plants list ==============================================

Then("The pagination should be visible", async function () {
  const pagination = this.page.locator("ul.pagination");
  await expect(pagination).toBeVisible();
});

//=================== Verify the Next button functionality of the pagination ===========================================

Then(
  "The page {string} should be currently active",
  async function (pageNumber) {
    const activePage = this.page.locator("ul.pagination .active");
    await expect(activePage).toHaveText(pageNumber);
  },
);

//=================== Verify Edit plant button in Actions ==============================================================

When(
  "User clicks {string} button in the action of first record",
  async function (buttonName) {
    const plantPage = new PlantPage(this.page);
    await plantPage.clickGenericButton(buttonName);
  },
);

Then("User see the current details of the plant", async function () {
  const plantPage = new PlantPage(this.page);
  await plantPage.verifyEditPageDetails();
});

//=================== Verify Delete plant button in Actions ============================================================

Then("User see a confirmation message", async function () {
  const plantPage = new PlantPage(this.page);
  await plantPage.verifyDeleteConfirmation();
});

//====================Verify Cancel button functionality ========================================================
Then("User should be on the {string} page", async function (url) {
  const plantPage = new PlantPage(this.page);
  await plantPage.verifyUrlContains(url);
});

Then(
  "The plant {string} should not be in the list",
  { timeout: 10000 },
  async function (plantName) {
    const plantPage = new PlantPage(this.page);
    await plantPage.verifyPlantNotInList(plantName);
  },
);
