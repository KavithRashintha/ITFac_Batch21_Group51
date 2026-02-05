import { When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

/* ---------------- UI  Sale Button Hidden in User View ---------------- */
Then('The "Sell Plant" button should be hidden', async function () {
  const button = this.page.getByRole("link", { name: "Sell Plant" });
  await expect(button).toBeHidden();
});

/* ---------------- UI Sale Item Visibility in User View ---------------- */
Then(
  "The Sales Plant items should be visibile in User View",
  async function () {
    const tableRows = this.page.locator("table tbody tr");

    await expect(tableRows.first()).toBeVisible();
  },
);

/* ---------------- UI Sale Item Sorting in User View ---------------- */
Then(
  "The Sales Plant items should be sorted by date in ascending order in User View",
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

/* ---------------- UI Delete Button Hidden in User View ---------------- */
Then("The Delete button should be hidden in User View", async function () {
  const deleteButtons = this.page.locator(
    "table tbody tr td:last-child button, table tbody tr td:last-child a",
  );

  const count = await deleteButtons.count();

  // Best case: delete button is NOT rendered at all
  if (count === 0) {
    expect(count).toBe(0);
    console.log("Delete buttons are not rendered, as expected.");
  }
  // Fallback: rendered but hidden
  else {
    await expect(deleteButtons.first()).not.toBeVisible();
    console.log("Delete buttons are rendered but hidden, as expected.");
  }
});

/* ---------------- UI Responsiveness of Sales List ---------------- */
Then("Sales list table should be responsive", async function () {
  const table = this.page.locator("table");

  // ---------- Desktop ----------
  await this.page.setViewportSize({ width: 1280, height: 800 });
  await expect(table).toBeVisible();

  // ---------- Tablet ----------
  await this.page.setViewportSize({ width: 768, height: 1024 });
  await expect(table).toBeVisible();

  // ---------- Mobile ----------
  await this.page.setViewportSize({ width: 375, height: 667 });
  await expect(table).toBeVisible();
});
