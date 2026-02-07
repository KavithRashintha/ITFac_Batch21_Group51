import { expect } from "@playwright/test";
import { BasePage } from "./BasePage.js";

export class LoginPage extends BasePage {
    constructor(page) {
        super(page);
        this.usernameInput = 'input[name="username"]';
        this.passwordInput = 'input[name="password"]';
        this.loginButton = 'button[type="submit"]';
    }

    async navigateToLogin() {
        await this.navigateTo('http://localhost:8080/ui/login');
        await this.page.waitForSelector(this.usernameInput, { timeout: 5000 });
    }

    async login(username, password) {
        await this.page.fill(this.usernameInput, username);
        await this.page.fill(this.passwordInput, password);
        await this.page.click(this.loginButton);
    }

    async verifyDashboardRedirect() {
        await expect(this.page).toHaveURL(/\/ui\/dashboard/);
    }

    async verifyInputVisibility() {
        await expect(this.page.locator(this.usernameInput)).toBeVisible();
        await expect(this.page.locator(this.passwordInput)).toBeVisible();
    }
}
