import { Then, Given, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

// -------------------- Set API Endpoint --------------------
Given("Normal User sets the endpoint {string}", function (endpoint) {
  this.endpoint = endpoint;
});

// -------------------- Request with token (GET | POST | PUT | DELETE) --------------------
When("User sends {string} request with token", async function (method) {
  if (!this.token) {
    throw new Error("Token is not available. Make sure login ran first.");
  }

  const options = {
    headers: {
      Authorization: `${this.tokenType} ${this.token}`,
    },
  };

  if (this.queryParams) {
    options.params = this.queryParams;
  }

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
      throw new Error(`Unsupported HTTP method: ${method}`);
  }

  try {
    this.responseBody = await this.response.json();
  } catch {
    this.responseBody = {};
  }
});

// -------------------- Invalid  testing --------------------
Then("Response body should contain error {string}", function (expectedMessage) {
  expect(this.responseBody).toHaveProperty("message");
  expect(this.responseBody.message).toContain(expectedMessage);
});

Then("Response should use default pagination", function () {
  // Response must be an array
  expect(Array.isArray(this.responseBody)).toBeTruthy();

  // Ensure at least one record exists
  expect(this.responseBody.length).toBeGreaterThan(0);

  // Default pagination usually limits results (example: <= 10)
  expect(this.responseBody.length).toBeLessThanOrEqual(15);
});

Given(
  "User sets query parameters page {string} and limit {string}",
  function (page, limit) {
    this.queryParams = {
      page: Number(page),
      limit: Number(limit),
    };
  },
);
