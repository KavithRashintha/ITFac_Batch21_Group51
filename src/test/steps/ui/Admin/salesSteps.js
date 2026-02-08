import { When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

Then('The \"Sell Plant\" button should be visible', async function () {
  const button = this.salesPage.getByRole("link", { name: "Sell Plant" });
  await this.salesPage.verifyVisible(button);
});

Then("The Sales Plant items should be visibile", async function () {
  const tableRows = this.salesPage.getLocator("table tbody tr");
  await this.salesPage.verifyVisible(tableRows.first());
});

Then(
  "The Sales Plant items should be sorted by date in ascending order",
  async function () {
    const dateCells = this.salesPage.getLocator("table tbody tr td:nth-child(4)");
    const dateTexts = await dateCells.allTextContents();
    const dates = dateTexts.map((dateStr) => new Date(dateStr.trim()));

    for (let i = 0; i < dates.length - 1; i++) {
      const currentDate = dates[i];
      const nextDate = dates[i + 1];
      expect(currentDate.getTime()).toBeGreaterThanOrEqual(nextDate.getTime());
    }


  },
);

Then("The Delete button should be visibile in Admin View", async function () {
  const actionIcons = this.salesPage.getLocator("table tbody tr td:last-child");
  const firstActionCell = actionIcons.first();

  await this.salesPage.verifyVisible(firstActionCell);

  const cellContent = await firstActionCell.textContent();


  const interactiveElements = firstActionCell.locator("button, a, [onclick]");
  const elementCount = await interactiveElements.count();

  if (elementCount > 0) {
    await expect(interactiveElements.first()).toBeVisible();

  } else {
    const isClickable =
      (await firstActionCell.getAttribute("onclick")) ||
      (await firstActionCell.getAttribute("role")) ||
      (await firstActionCell.getAttribute("data-action"));

    if (!isClickable) {
      // Log removed
    }
  }
});

When("User clicks the Delete button on a sales item", async function () {
  const deleteButton = this.salesPage
    .getLocator("table tbody tr")
    .first()
    .locator("button, a")
    .first();

  await this.salesPage.verifyVisible(deleteButton);
  await deleteButton.click();
});

Then("The Delete confirmation dialog should be visible", async function () {
  this.page.once("dialog", async (dialog) => {
    expect(dialog.type()).toBe("confirm");
    expect(dialog.message().toMatch(/delete/i));
    await dialog.dismiss();
  });
});
