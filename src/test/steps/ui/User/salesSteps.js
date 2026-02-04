import { When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

/* ---------------- UI  Sale Button Hidden ---------------- */
Then('The "Sell Plant" button should be hidden', async function () {
  const button = this.page.getByRole("link", { name: "Sell Plant" });
  await expect(button).toBeHidden();
});

/* ---------------- UI Delete Button Hidden ---------------- */
