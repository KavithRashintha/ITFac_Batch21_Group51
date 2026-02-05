import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

// ---------- User role validations ----------

Then('Add Category button should not be visible', async function () {
  const addCategoryButton = this.page.locator(
    'button:has-text("Add A Category"), a:has-text("Add A Category")'
  );

  // For non-admin users, the button should not exist in DOM
  await expect(addCategoryButton).toHaveCount(0);
});
