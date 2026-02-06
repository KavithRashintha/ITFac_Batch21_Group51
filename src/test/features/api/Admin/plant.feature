Feature: Plant Management API

  Background:
    Given Admin logs in with username "admin" and password "admin123"

  Scenario: Verify create plant with duplicate name
    And "Admin" sets the endpoint "/api/plants/category/5"
    When "Admin" sends "POST" request with token and payload
      """
      {
        "name": "Rose",
        "price": 100,
        "quantity": 20
      }
      """
    Then Response status code should be 400
    And Response body should match JSON structure
      """
      {
        "status": 400,
        "error": "DUPLICATE_RESOURCE",
        "message": "Plant 'Rose' already exists in this category",
        "timestamp": "2026-02-04T10:05:11.9163253"
      }
      """

  Scenario: Verify create plant with valid data
    And "Admin" sets the endpoint "/api/plants/category/5"
    When "Admin" sends "POST" request with token and payload
      """
      {
        "name": "Rose",
        "price": 100,
        "quantity": 20
      }
      """
    Then Response status code should be 201
    And Response body should match JSON structure
      """
      {
        "id": 50,
        "name": "Rose",
        "price": 100,
        "quantity": 20,
        "category": {
          "id": 5,
          "name": "FFF",
          "subCategories": []
        }
      }
      """

  Scenario: Verify create plant with missing mandatory fields
    And "Admin" sets the endpoint "/api/plants/category/1"
    When "Admin" sends "POST" request with token and payload
      """
      {
        "name": "Rose",
        "price": 100
      }
      """
    Then Response status code should be 400
    And Response body should match JSON structure
      """
      {
        "details": {
          "quantity": "Quantity is required"
        },
        "error": "BAD_REQUEST",
        "message": "Validation failed",
        "status": 400,
        "timestamp": "any_non_empty_string"
      }
      """

  Scenario: Verify create plant with negative price
    And "Admin" sets the endpoint "/api/plants/category/1"
    When "Admin" sends "POST" request with token and payload
      """
      {
        "name": "Rose",
        "price": -100,
        "quantity": 25
      }
      """
    Then Response status code should be 400
    And Response body should match JSON structure
      """
      {
        "details": {
          "price": "Price must be greater than 0"
        },
        "error": "BAD_REQUEST",
        "message": "Validation failed",
        "status": 400,
        "timestamp": "2026-02-04T11:10:02.9029542"
      }
      """

    Scenario: Verify create plant with invalid categoryId
      And "Admin" sets the endpoint "/api/plants/category/100"
      When "Admin" sends "POST" request with token and payload
      """
      {
        "name": "Rose",
        "price": 100,
        "quantity": 25
      }
      """
      Then Response status code should be 404
      And Response body should match JSON structure
      """
      {
        "status": 404,
        "error": "NOT_FOUND",
        "message": "Category not found",
        "timestamp": "2026-02-04T11:40:14.3800173"
      }
      """

    Scenario: Verify the GET plant method by ID for a existing valid ID
      Given "Admin" sets the endpoint "/api/plants/1"
      When "Admin" sends "GET" request with token
      Then Response status code should be 200
      And Response body should match JSON structure
      """
      {
        "id": 1,
        "name": "Plant 1",
        "price": 500,
        "quantity": 100,
        "categoryId": 3
      }
      """

    Scenario: Verify the GET plant method by ID for a non-existing ID
      Given "Admin" sets the endpoint "/api/plants/100"
      When "Admin" sends "GET" request with token
      Then Response status code should be 404
      And Response body should match JSON structure
      """
      {
        "status": 404,
        "error": "NOT_FOUND",
        "message": "Plant not found: 100",
        "timestamp": "2026-02-06T04:06:45.539Z"
      }
      """