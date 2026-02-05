import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

// -------------------- Set API Endpoint --------------------
Given('{word} sets the endpoint {string}', function (role, endpoint) {
    this.endpoint = endpoint;
});

// -------------------- Generic request WITHOUT payload --------------------
When('User sends GET request with token', async function () {

    if (!this.token) {
        throw new Error("Token is not available. Make sure login ran first.");
    }

    const options = {
        headers: {
            Authorization: `${this.tokenType} ${this.token}`
        }
    };

    this.response = await this.apiContext.get(this.endpoint, options);

    try {
        this.responseBody = await this.response.json();
    } catch {
        this.responseBody = {};
    }
});


// -------------------- Generic request WITH token and payload --------------------
When('{word} sends {word} request with token and payload', async function (role, method, body) {

    if (!this.token) {
        throw new Error("Token is not available. Make sure login ran first.");
    }

    const options = {
        headers: {
            Authorization: `${this.tokenType} ${this.token}`,
            "Content-Type": "application/json"
        },
        data: JSON.parse(body)
    };

    switch (method.toUpperCase()) {

        case "POST":
            this.response = await this.apiContext.post(this.endpoint, options);
            break;

        case "PUT":
            this.response = await this.apiContext.put(this.endpoint, options);
            break;

        case "DELETE":
            this.response = await this.apiContext.delete(this.endpoint, options);
            break;

        default:
            throw new Error(`Unsupported method for payload request: ${method}`);
    }

    try {
        this.responseBody = await this.response.json();
    } catch {
        this.responseBody = {};
    }
});


// -------------------- Generic request without token --------------------
When('{word} sends {word} request without token', async function(role, method) {
    const options = {};

    switch (method.toUpperCase()) {
        case "GET":
            this.response = await this.apiContext.get(this.endpoint, options);
            break;
        case "POST":
            this.response = await this.apiContext.post(this.endpoint, options);
            break;
        case "PUT":
            this.response = await this.apiContext.put(this.endpoint, options);
            break;
        case "DELETE":
            this.response = await this.apiContext.delete(this.endpoint, options);
            break;
        default:
            throw new Error(`Unsupported method: ${method}`);
    }

    try {
        this.responseBody = await this.response.json();
    } catch (error) {
        this.responseBody = {};
    }
});

// -------------------- Assertion for Unauthorized --------------------
Then('Response should have status code {int} and message containing {string}', function(statusCode, expectedMessage) {
    expect(this.response.status()).toBe(statusCode);
    expect(this.responseBody).toHaveProperty("message");
    expect(this.responseBody.message).toContain(expectedMessage);
});

// -------------------- Assertions (shared with loginSteps) --------------------
Then('Response body should contain {string}', function (expectedText) {
    const bodyAsString = JSON.stringify(this.responseBody);
    expect(bodyAsString).toContain(expectedText);
});

Then("Response body 'content' should be an array with {int} items", function(expectedCount) {
    const arrayToCheck = this.responseBody.content;
    expect(arrayToCheck).toBeDefined();
    expect(Array.isArray(arrayToCheck)).toBeTruthy();
    expect(arrayToCheck.length).toBe(expectedCount);
});

Then("Response body 'content' should be an array with at most {int} items", function(expectedCount) {
    const arrayToCheck = this.responseBody.content;
    expect(arrayToCheck).toBeDefined();
    expect(Array.isArray(arrayToCheck)).toBeTruthy();
    expect(arrayToCheck.length).toBeLessThanOrEqual(expectedCount);
});

Then("The first plant in 'content' should have name {string}", function(expectedName) {
    const firstPlant = this.responseBody.content[0];
    expect(firstPlant).toBeDefined();
    expect(firstPlant.name).toBe(expectedName);
});

Then("Response page number should be {int}", function(expectedPage) {
    expect(this.responseBody.pageable.pageNumber).toBe(expectedPage);
});
