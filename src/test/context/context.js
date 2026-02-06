import { Before, After } from "@cucumber/cucumber";
import { request } from "@playwright/test";

Before(async function () {
  // Initialize API context once per scenario
  this.apiContext = await request.newContext({
    baseURL: "http://localhost:8080",
    extraHTTPHeaders: { "Content-Type": "application/json" },
  });
});

After(async function () {
  if (this.apiContext) await this.apiContext.dispose();
});
