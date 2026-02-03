import { Before, After } from "@cucumber/cucumber";


/*Before({ tags: '@admin' }, async function () {
    await this.page.goto('/login');
    await this.page.fill('#username', 'admin');
    await this.page.fill('#password', 'admin123');
    await this.page.click('#login');
});

Before({ tags: '@nonadmin' }, async function () {
    await this.page.goto('/login');
    await this.page.fill('#username', 'user');
    await this.page.fill('#password', 'testuser');
    await this.page.click('#login');
});*/

After(async function () {

    if (this.page) {
        await this.page.close();
    }

    if (this.browser) {
        await this.browser.close();
    }

});
