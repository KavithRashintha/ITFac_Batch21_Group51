import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

// -------------------- Set API Endpoint --------------------
Given('{word} sets the endpoint {string}', function (role, endpoint) {
    this.endpoint = endpoint;
});

// -------------------- Send POST Request --------------------
When('{word} sends POST request with payload', async function (role, docString) {
    if (!this.token) {
        throw new Error("Token is not available. Make sure login ran first.");
    }
    
    this.response = await this.apiContext.post(this.endpoint, {
        data: JSON.parse(docString),
        headers: { Authorization: `${this.tokenType} ${this.token}` }
    });
    
    try {
        this.responseBody = await this.response.json();
    } catch (error) {
        this.responseBody = {};
    }
});

// -------------------- Send GET Request --------------------
When('{word} sends GET request', async function (role) {
    if (!this.token) {
        throw new Error("Token is not available. Make sure login ran first.");
    }
    
    this.response = await this.apiContext.get(this.endpoint, {
        headers: { Authorization: `${this.tokenType} ${this.token}` }
    });
    
    try {
        this.responseBody = await this.response.json();
    } catch (error) {
        this.responseBody = {};
    }
});

// -------------------- Send PUT Request --------------------
When('{word} sends PUT request with payload', async function (role, docString) {
    if (!this.token) {
        throw new Error("Token is not available. Make sure login ran first.");
    }
    
    this.response = await this.apiContext.put(this.endpoint, {
        data: JSON.parse(docString),
        headers: { Authorization: `${this.tokenType} ${this.token}` }
    });
    
    try {
        this.responseBody = await this.response.json();
    } catch (error) {
        this.responseBody = {};
    }
});

// -------------------- Send DELETE Request --------------------
When('{word} sends DELETE request', async function (role) {
    if (!this.token) {
        throw new Error("Token is not available. Make sure login ran first.");
    }
    
    this.response = await this.apiContext.delete(this.endpoint, {
        headers: { Authorization: `${this.tokenType} ${this.token}` }
    });
    
    try {
        this.responseBody = await this.response.json();
    } catch (error) {
        this.responseBody = {};
    }
});

// -------------------- Assertions (shared with loginSteps) --------------------
// Note: Response status code and JSON structure assertions are already in loginSteps.js

Then('Response body should contain {string}', function (expectedText) {
    const bodyAsString = JSON.stringify(this.responseBody);
    expect(bodyAsString).toContain(expectedText);
});

Then('Response body should be an array with {int} items', function (count) {
    expect(Array.isArray(this.responseBody)).toBeTruthy();
    expect(this.responseBody.length).toBe(count);
});