import { Before, After } from "@cucumber/cucumber";
import { request } from "@playwright/test";
import { loadConfig } from "../utils/dataLoader.js";

Before(async function () {
    const config = loadConfig();

    this.apiContext = await request.newContext({
        baseURL: config.baseURL,
        extraHTTPHeaders: { 'Content-Type': 'application/json' }
    });

    this.config = config;
});

After(async function () {
    if (this.apiContext) await this.apiContext.dispose();
});
