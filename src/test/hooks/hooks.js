import { Before, After, Status } from '@cucumber/cucumber';
import { chromium } from '@playwright/test';
import { loadConfig } from '../utils/dataLoader.js';
import { LoginPage } from '../pages/LoginPage.js';
import { DashboardPage } from '../pages/DashboardPage.js';
import { CategoriesPage } from '../pages/CategoriesPage.js';
import { PlantsPage } from '../pages/PlantsPage.js';
import { SalesPage } from '../pages/SalesPage.js';

Before(async function () {
  const config = loadConfig();

  this.browser = await chromium.launch({
    headless: config.browser.headless,
    slowMo: config.browser.slowMo
  });
  this.context = await this.browser.newContext();
  this.page = await this.context.newPage();

  this.loginPage = new LoginPage(this.page);
  this.dashboardPage = new DashboardPage(this.page);
  this.categoriesPage = new CategoriesPage(this.page);
  this.plantsPage = new PlantsPage(this.page);
  this.salesPage = new SalesPage(this.page);
});

After(async function (scenario) {
  if (scenario.result.status === Status.FAILED) {
    if (this.page) {
      const screenshot = await this.page.screenshot({ fullPage: true });
      this.attach(screenshot, 'image/png');
    }
  }

  await this.browser.close();
});
