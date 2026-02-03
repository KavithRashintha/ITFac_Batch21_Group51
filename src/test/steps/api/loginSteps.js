import { When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

// ===================== Send Login Request =====================
When('User logs in with username {string} and password {string}', async function (username, password) {
    if (!this.apiContext) throw new Error('API context is not initialized');

    // Hardcode the login endpoint here
    const endpoint = '/api/auth/login';

    this.response = await this.apiContext.post(endpoint, {
        data: { username, password }
    });

    this.responseBody = await this.response.json();

    if (this.responseBody.token) {
        this.token = this.responseBody.token; 
    }
});

// ===================== Assertions =====================
Then('It receives the response and Response status code should be {int}', async function (statusCode) {
    expect(this.response.status()).toBe(statusCode);
});

Then('Response body should contain a JSON like', async function (docString) {
    const expected = JSON.parse(docString);
    for (const key of Object.keys(expected)) {
        if (key === 'token') {
            // Just check token exists and is a non-empty string
            expect(typeof this.responseBody.token).toBe('string');
            expect(this.responseBody.token.length).toBeGreaterThan(0);
        } else {
            expect(this.responseBody[key]).toBe(expected[key]);
        }
    }
});

