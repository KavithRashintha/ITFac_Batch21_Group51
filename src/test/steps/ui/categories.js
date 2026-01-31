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


//-------------- Verify the Validation errors when editing a categoryname that not meet the valid criteria (3-10)------------

When('user provide categoryName {string}', async function(newCategoryName){
    await this.page.fill('input[name="name"]',newCategoryName);
} );

Then('user click save button', async function () {
    await this.page.click('button[type="submit"]');
});