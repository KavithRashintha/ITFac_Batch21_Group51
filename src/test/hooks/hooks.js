import { After } from "@cucumber/cucumber";

After(async function () {

    if (this.page) {
        await this.page.close();
    }

    if (this.browser) {
        await this.browser.close();
    }

});
