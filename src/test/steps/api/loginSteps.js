import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { loginAs } from "../../helper/helper.js";

// -------------------- Login for Authentication (Background) --------------------
Given('{word} logged-in with username {string} and password {string}', async function (role, username, password) {
    const { token, tokenType } = await loginAs(this.apiContext, username, password);
    this.token = token;       
    this.tokenType = tokenType;
});

// -------------------- Login Test (sends request and captures response) --------------------
When('{word} logs in with username {string} and password {string}', async function (role, username, password) {
    this.response = await this.apiContext.post("/api/auth/login", {
        data: { username, password }
    });

    try {
        this.responseBody = await this.response.json();
    } catch (error) {
        this.responseBody = {};
    }
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

            // special placeholder
            if (expectedObj[key] === "any_non_empty_string") {
                expect(actualObj[key]).toBeTruthy();
                expect(typeof actualObj[key]).toBe("string");
                expect(actualObj[key].length).toBeGreaterThan(0);
                continue;
            }

            // auto generated id
            if (key === "id") {
                expect(actualObj[key]).toBeDefined();
                expect(typeof actualObj[key]).toBe("number");
                continue;
            }

            // dynamic timestamp
            if (key === "timestamp") {
                expect(actualObj[key]).toBeDefined();
                expect(typeof actualObj[key]).toBe("string");
                expect(actualObj[key].length).toBeGreaterThan(0);
                continue;
            }

            // nested object
            if (
                typeof expectedObj[key] === "object" &&
                expectedObj[key] !== null &&
                !Array.isArray(expectedObj[key])
            ) {
                validate(expectedObj[key], actualObj[key]);
                continue;
            }

            // array support (ex: subCategories: [])
            if (Array.isArray(expectedObj[key])) {
                expect(Array.isArray(actualObj[key])).toBe(true);
                expect(actualObj[key].length).toBe(expectedObj[key].length);
                continue;
            }

            // primitive exact match
            expect(actualObj[key]).toBe(expectedObj[key]);
        }
    }


    validate(expected, this.responseBody);
});

Then('Response body should contain {string}', function (expectedText) {
    const bodyAsString = JSON.stringify(this.responseBody);
    expect(bodyAsString).toContain(expectedText);
});