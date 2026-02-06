import { Before, After } from '@cucumber/cucumber';
import { chromium } from '@playwright/test';
import { config } from '../context/config.js';

Before(async function () {
  this.baseURL = config.baseURL;
  this.browser = await chromium.launch({ headless: false });
  this.context = await this.browser.newContext();
  this.page = await this.context.newPage();
});

After(async function () {
  await this.browser.close();
});
