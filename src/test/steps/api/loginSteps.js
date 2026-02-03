import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { loginAs } from "../../helper/helper.js";

// -------------------- Login for Authentication (Background) --------------------
Given('{word} logged-in with username {string} and password {string}', async function (role, username, password) {
    const { token, tokenType } = await loginAs(this.apiContext, username, password);
    this.token = token;       
    this.tokenType = tokenType;
    this.role = role;         
});

// -------------------- Login Test (sends request and captures response) --------------------
When('{word} logs in with username {string} and password {string}', async function (role, username, password) {
    this.response = await this.apiContext.post("/api/auth/login", {
        data: { username, password }
    });
    
    // Capture response body for validation
    try {
        this.responseBody = await this.response.json();
    } catch (error) {
        // If response is not JSON, set empty object
        this.responseBody = {};
    }
    
    this.role = role;
});

// -------------------- Assertions --------------------
Then('Response status code should be {int}', async function (statusCode) {
    expect(this.response.status()).toBe(statusCode);
});

Then('Response body should match JSON structure', function (docString) {
    const expected = JSON.parse(docString);
    
    function validate(expectedObj, actualObj) {
        for (const key of Object.keys(expectedObj)) {
            expect(actualObj).toHaveProperty(key);
            
            if (expectedObj[key] === "any_non_empty_string") {
                expect(actualObj[key]).toBeTruthy();
                expect(typeof actualObj[key]).toBe("string");
                expect(actualObj[key].length).toBeGreaterThan(0);
            } else if (typeof expectedObj[key] === "object" && expectedObj[key] !== null) {
                validate(expectedObj[key], actualObj[key]);
            } else {
                expect(actualObj[key]).toBe(expectedObj[key]);
            }
        }
    }
    
    validate(expected, this.responseBody);
});

Then('Response body should contain {string}', function (expectedText) {
    const bodyAsString = JSON.stringify(this.responseBody);
    expect(bodyAsString).toContain(expectedText);
});