import { Then, Given, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

// -------------------- Set API Endpoint --------------------
Given("Admin sets the endpoint {string}", function (endpoint) {
  this.endpoint = endpoint;
});

// -------------------- Request with token (GET | POST | PUT | DELETE) --------------------
When("Admin sends {string} request with token", async function (method) {
  if (!this.token) {
    throw new Error("Token is not available. Make sure login ran first.");
  }

  const options = {
    headers: {
      Authorization: `${this.tokenType} ${this.token}`,
    },
  };

  // Attach query params if exist (POST sales uses this)
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

// -------------------- Request with token AND JSON payload --------------------
When(
  "Admin sends {string} request with token and payload",
  async function (method, docString) {
    if (!this.token) {
      throw new Error("Token is not available. Make sure login ran first.");
    }

    // Parse JSON payload from doc string
    let payload = {};
    try {
      payload = JSON.parse(docString);
    } catch (error) {
      throw new Error("Invalid JSON payload: " + error.message);
    }

    const options = {
      headers: {
        Authorization: `${this.tokenType} ${this.token}`,
        "Content-Type": "application/json",
      },
      data: payload,
    };

    // Attach query parameters if they exist
    if (this.queryParams) {
      options.params = this.queryParams;
    }

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

    // Parse response body
    try {
      this.responseBody = await this.response.json();
    } catch {
      this.responseBody = {};
    }
  },
);

// -------------------- GET All Sales List Assertions --------------------

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

// -------------------- POST Sale Assertions --------------------

Then("Response body should contain created sale details", function () {
  const sale = this.responseBody;

  expect(sale).toHaveProperty("id");
  expect(sale).toHaveProperty("plant");
  expect(sale).toHaveProperty("quantity");
  expect(sale).toHaveProperty("totalPrice");
  expect(sale).toHaveProperty("soldAt");

  expect(sale.plant).toHaveProperty("id");
  expect(sale.plant).toHaveProperty("name");
  expect(sale.plant).toHaveProperty("price");
});

//Check the Total price
Then("Total price should be calculated correctly", function () {
  const sale = this.responseBody;

  const expectedTotal = Number(sale.plant.price) * Number(sale.quantity);

  expect(sale.totalPrice).toBe(expectedTotal);
});

// -------------------- Invalid  testing --------------------

Then(
  "Response body should contain error message {string}",
  function (expectedMessage) {
    expect(this.responseBody).toHaveProperty("message");
    expect(this.responseBody.message).toContain(expectedMessage);
  },
);
