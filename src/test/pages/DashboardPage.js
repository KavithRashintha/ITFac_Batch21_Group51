import { expect } from "@playwright/test";
import { BasePage } from "./BasePage.js";

export class DashboardPage extends BasePage {
    constructor(page) {
        super(page);
    }

    async navigateToDashboard() {
        await this.navigateTo('http://localhost:8080/ui/dashboard');
    }

    async verifyOnDashboard() {
        await expect(this.page).toHaveURL(/.*dashboard/);
    }
}
