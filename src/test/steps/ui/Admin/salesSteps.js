import { When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { SalesPage } from "../../../pages/SalesPage.js";

/* ---------------- UI  Button Visibility ---------------- */

Then('The "Sell Plant" button should be visible', async function () {
  const salesPage = new SalesPage(this.page);
  await salesPage.verifySellPlantButtonVisible();
});

/* ---------------- UI Sale Item Visibility ---------------- */
Then("The Sales Plant items should be visibile", async function () {
  const salesPage = new SalesPage(this.page);
  await salesPage.verifySalesItemsVisible();
});

Then(
  "The Sales Plant items should be sorted by date in ascending order",
  async function () {
    const salesPage = new SalesPage(this.page);
    const dateCells = this.page.locator("table tbody tr td:nth-child(4)");
    const dateTexts = await dateCells.allTextContents();
    const dates = dateTexts.map((dateStr) => new Date(dateStr.trim()));

    // Check if dates are in descending order (newest first)
    for (let i = 0; i < dates.length - 1; i++) {
        const currentDate = dates[i];
        const nextDate = dates[i + 1];
        expect(currentDate.getTime()).toBeGreaterThanOrEqual(nextDate.getTime());
    }
  },
);

/* ---------------- UI Delete Button Visibility ---------------- */

Then("The Delete button should be visibile in Admin View", async function () {
  const salesPage = new SalesPage(this.page);
  const actionIcons = this.page.locator("table tbody tr td:last-child");
  await expect(actionIcons.first()).toBeVisible();
});

/* ---------------- UI Delete Confirmation Message Visibility ---------------- */
When("User clicks the Delete button on a sales item", async function () {
  const salesPage = new SalesPage(this.page);
  await salesPage.deleteSaleItem();
});

Then("The Delete confirmation dialog should be visible", async function () {
  const salesPage = new SalesPage(this.page);
  await salesPage.verifyDeleteDialog();
});
