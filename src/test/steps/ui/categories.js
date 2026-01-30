import { When, Then } from '@cucumber/cucumber';

//--------------------------- Verify the Edit category button in Actions ---------------------------

When('user navigates to {string}', async function (path) {
    await this.page.goto(`http://localhost:8080/${path}`);
});

When('user clicks on Edit button', async function () {
    await this.page.locator('[title="Edit"]').first().click();
});

Then('user navigates to edit category page', async function(){
    await this.page.waitForURL('**/ui/categories/edit/**');
});