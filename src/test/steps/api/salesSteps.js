import { Then, Given, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

// -------------------- Set API Endpoint --------------------
Given("Admin sets the endpoint {string}", function (endpoint) {
  this.endpoint = endpoint;
});

// -------------------- GET request with token --------------------
When("Admin sends GET request with token", async function () {
  if (!this.token) {
    throw new Error("Token is not available. Make sure login ran first.");
  }

  const options = {
    headers: {
      Authorization: `${this.tokenType} ${this.token}`,
    },
  };

  this.response = await this.apiContext.get(this.endpoint, options);

  try {
    this.responseBody = await this.response.json();
  } catch {
    this.responseBody = {};
  }
});

// -------------------- Sales List Assertions --------------------

//Check the request code
Then("Response should have status code {int}", function (statusCode) {
  expect(this.response.status()).toBe(statusCode);
});

//Check the response body
Then("Response body should be a sales list", function () {
  expect(Array.isArray(this.responseBody)).toBeTruthy();
  expect(this.responseBody.length).toBeGreaterThan(0);
});

Then("Each sales record should have required fields", function () {
  const salesList = this.responseBody;

  const sale = salesList[0];

  expect(sale).toHaveProperty("id");
  expect(sale).toHaveProperty("plant");
  expect(sale).toHaveProperty("quantity");
  expect(sale).toHaveProperty("totalPrice");
  expect(sale).toHaveProperty("soldAt");
});

Then("The sale should include plant details", function () {
  const sale = this.responseBody[0];

  expect(sale.plant).toHaveProperty("id");
  expect(sale.plant).toHaveProperty("name");
  expect(sale.plant).toHaveProperty("price");
  expect(sale.plant).toHaveProperty("quantity");
});
