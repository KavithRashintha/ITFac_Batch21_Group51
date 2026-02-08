import { BasePage } from './BasePage.js';
import { loadCredentials } from '../utils/dataLoader.js';

export class LoginPage extends BasePage {
    constructor(page) {
        super(page);
        this.usernameInput = 'input[name="username"]';
        this.passwordInput = 'input[name="password"]';
        this.loginButton = 'button[type="submit"]';
    }

    async navigateToLogin() {
        await this.navigateTo('/ui/login');
        await this.waitFor(this.usernameInput, { timeout: 5000 });
    }

    async fillCredentials(username, password) {
        await this.fill(this.usernameInput, username);
        await this.fill(this.passwordInput, password);
    }

    async clickLoginButton() {
        await this.click(this.loginButton);
    }

    async login(username, password) {
        await this.fillCredentials(username, password);
        await this.clickLoginButton();
    }

    async loginWithRole(role = 'admin') {
        const credentials = loadCredentials(role);
        await this.login(credentials.username, credentials.password);
    }

    async verifyLoginPageDisplayed() {
        await this.verifyURL('/ui/login');
    }

    async verifyUsernameAndPasswordFieldsVisible() {
        await this.verifyVisible(this.usernameInput);
        await this.verifyVisible(this.passwordInput);
    }

    async verifyErrorMessage(message) {
        await this.verifyMessage(message);
    }

    async verifyRedirectToDashboard() {
        await this.verifyURL('/ui/dashboard');
    }

    async verifyRemainsOnLoginPage() {
        await this.verifyURL('/ui/login');
    }
}
