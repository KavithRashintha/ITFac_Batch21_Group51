import { When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { SalesPage } from "../../../pages/SalesPage.js";

/* ---------------- UI Sale Item Visibility ---------------- */
Then(
  "The Sales Plant items should be visibile for user view",
  async function () {
    const salesPage = new SalesPage(this.page);
    await salesPage.verifySalesItemsVisible();
  },
);

/* ---------------- UI Delete Button Visibility ---------------- */

Then("The Delete button should not be visible in User View", async function () {
  const actionIcons = this.page.locator("table tbody tr td:last-child");
  const count = await actionIcons.count();
  for (let i = 0; i < count; i++) {
    const interactive = actionIcons.nth(i).locator("button, a");
    await expect(interactive).not.toBeVisible();
  }
});
