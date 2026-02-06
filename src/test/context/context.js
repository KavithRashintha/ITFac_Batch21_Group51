import { Before, After } from "@cucumber/cucumber";
import { request } from "@playwright/test";
import { config } from "./config.js";

Before(async function () {
    this.baseURL = config.baseURL;
    // Initialize API context once per scenario
    this.apiContext = await request.newContext({
        baseURL: this.baseURL,
        extraHTTPHeaders: { 'Content-Type': 'application/json' }
    });
});

After(async function () {
    if (this.apiContext) await this.apiContext.dispose();
});
