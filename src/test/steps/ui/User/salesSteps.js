import { When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { SalesPage } from "../../../pages/SalesPage.js";

/* ---------------- UI Sale Item Visibility ---------------- */
Then("The Sales Plant items should be visibile in User View", async function () {
  const count = await this.page.locator("table tbody tr").count();
  expect(count).toBeGreaterThan(0);
});

/* ---------------- UI Button Visibility ---------------- */

Then('The {string} button should be hidden', async function (buttonName) {
  const button = this.page.getByRole('button', { name: buttonName });
  await expect(button).not.toBeVisible();
});

Then("The Delete button should be hidden in User View", async function () {
  const deleteBtns = this.page.locator('button[title="Delete"], .btn-danger');
  const count = await deleteBtns.count();
  for (let i = 0; i < count; i++) {
    await expect(deleteBtns.nth(i)).not.toBeVisible();
  }
});

/* ---------------- UI Sorting ---------------- */

Then("The Sales Plant items should be sorted by date in ascending order in User View", async function () {
  const dates = await this.page.locator("table tbody tr td:first-child").allTextContents();
  const sortedDates = [...dates].sort((a, b) => new Date(a) - new Date(b));
  expect(dates).toEqual(sortedDates);
});

/* ---------------- UI Responsiveness & Options ---------------- */

Then("Sales list table should be responsive", async function () {
  const table = this.page.locator("table");
  await expect(table).toBeVisible();
  // Simple check for responsive class or parent container
  const parent = this.page.locator(".table-responsive");
  await expect(parent).toBeVisible();
});

Then("No single sale view option should be available", async function () {
  const viewBtns = this.page.locator('button[title="View"], .btn-info');
  const count = await viewBtns.count();
  for (let i = 0; i < count; i++) {
    await expect(viewBtns.nth(i)).not.toBeVisible();
  }
});
