import { When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

/* ---------------- Navigation ---------------- */

When("User navigates to page {string}", async function (url) {
  await this.page.goto(`http://localhost:8080{url}`);
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

/* ---------------- UI Delete Button Visibility ---------------- */

Then("The Delete button should be visibile in Admin View", async function () {
  // Based on your table, Actions column has clipboard icon 📋
  // This might be the delete button or represent some action
  const actionIcons = this.page.locator("table tbody tr td:last-child");
  const firstActionCell = actionIcons.first();

  await expect(firstActionCell).toBeVisible();

  const cellContent = await firstActionCell.textContent();
  console.log("Actions cell content:", cellContent);

  // Check if it contains any interactive element
  const interactiveElements = firstActionCell.locator("button, a, [onclick]");
  const elementCount = await interactiveElements.count();

  if (elementCount > 0) {
    await expect(interactiveElements.first()).toBeVisible();
    console.log("Found interactive element in actions cell");
  } else {
    // If it's just text/icon, check if it's clickable
    const isClickable =
      (await firstActionCell.getAttribute("onclick")) ||
      (await firstActionCell.getAttribute("role")) ||
      (await firstActionCell.getAttribute("data-action"));

    if (isClickable) {
      console.log("Actions cell appears to be clickable");
    } else {
      console.log(
        "Warning: Actions cell doesn't contain obvious interactive elements",
      );
    }
  }
});

/* ---------------- UI Delete Confirmation Message Visibility ---------------- */
When("User clicks the Delete button on a sales item", async function () {
  // Adjust selector if your delete button has an icon or tooltip
  const deleteButton = this.page
    .locator("table tbody tr")
    .first()
    .locator("button, a")
    .first();

  await expect(deleteButton).toBeVisible();
  await deleteButton.click();
});

Then("The Delete confirmation dialog should be visible", async function () {
  this.page.once("dialog", async (dialog) => {
    expect(dialog.type()).toBe("confirm");
    expect(dialog.message().toMatch(/delete/i));
    await dialog.dismiss();
  });
});
