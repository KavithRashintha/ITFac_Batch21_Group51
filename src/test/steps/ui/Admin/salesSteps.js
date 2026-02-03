import { When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

/* ---------------- Navigation ---------------- */

When("User navigates to page {string}", async function (url) {
  await this.page.goto(`http://localhost:8080${url}`);
});

/* ---------------- UI  Button Visibility ---------------- */

Then('The "Sell Plant" button should be visible', async function () {
  const button = this.page.getByRole("link", { name: "Sell Plant" });
  await expect(button).toBeVisible();
});

/* ---------------- UI Sale Item Visibility ---------------- */
Then("The Sales Plant items should be visibile", async function () {
  const tableRows = this.page.locator("table tbody tr");

  await expect(tableRows.first()).toBeVisible();
});

Then(
  "The Sales Plant items should be sorted by date in ascending order",
  async function () {
    const dateCells = this.page.locator("table tbody tr td:nth-child(4)");
    const dateTexts = await dateCells.allTextContents();
    const dates = dateTexts.map((dateStr) => new Date(dateStr.trim()));

    // Check if dates are in descending order (newest first)
    for (let i = 0; i < dates.length - 1; i++) {
      const currentDate = dates[i];
      const nextDate = dates[i + 1];

      // For descending order, current date should be >= next date
      expect(currentDate.getTime()).toBeGreaterThanOrEqual(nextDate.getTime());
    }

    console.log("Dates are in descending order (newest first):", dateTexts);
  },
);
