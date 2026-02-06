Feature: Plant Management API

  Background:
    Given Admin logs in with username "admin" and password "admin123"

  Scenario: Verify create plant with duplicate name
    And "Admin" sets the endpoint "/api/plants/category/2"
    When "Admin" sends "POST" request with token and payload
      """
      {
        "name": "Plant 2",
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
        "message": "Plant 'Plant 2' already exists in this category",
        "timestamp": "2any_non_empty_string"
      }
      """

  Scenario: Verify create plant with valid data
    And "Admin" sets the endpoint "/api/plants/category/2"
    When "Admin" sends "POST" request with token and payload
      """
      {
        "name": "Plant 13",
        "price": 100,
        "quantity": 20
      }
      """
    Then Response status code should be 201
    And Response body should match JSON structure
      """
      {
        "id": 13,
        "name": "Plant 13",
        "price": 100,
        "quantity": 20,
        "category": {
          "id": 2,
          "name": "Sub_Cat 1",
          "subCategories": []
        }
      }
      """

  Scenario: Verify create plant with missing mandatory fields
    And "Admin" sets the endpoint "/api/plants/category/2"
    When "Admin" sends "POST" request with token and payload
      """
      {
        "name": "Plant 14",
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
    And "Admin" sets the endpoint "/api/plants/category/2"
    When "Admin" sends "POST" request with token and payload
      """
      {
        "name": "Plant 15",
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
        "timestamp": "any_non_empty_string"
      }
      """

    Scenario: Verify create plant with invalid categoryId
      And "Admin" sets the endpoint "/api/plants/category/100"
      When "Admin" sends "POST" request with token and payload
      """
      {
        "name": "Plant 16",
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
        "timestamp": "any_non_empty_string"
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
        "price": 1000,
        "quantity": 5,
        "categoryId": 2
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
        "timestamp": "any_non_empty_string"
      }
      """

    Scenario: Verify the GET plant method by Category ID for a existing valid ID
      Given "Admin" sets the endpoint "/api/plants/category/2"
      When "Admin" sends "GET" request with token
      Then Response status code should be 200
      And Response body should match JSON structure
      """
      [
        {
          "id": "any_number",
          "name": "any_non_empty_string",
          "price": "any_number",
          "quantity": "any_number",
          "category": {
            "id": "any_number",
            "name": "any_non_empty_string",
            "parent": "any_non_empty_string",
            "subCategories": [

            ]
          }
        }
      ]
      """

    Scenario: Verify the GET plant method by Category ID for a non-existing ID
      Given "Admin" sets the endpoint "/api/plants/category/100"
      When "Admin" sends "GET" request with token
      Then Response status code should be 404
      And Response body should match JSON structure
      """
      {
        "status": 404,
        "error": "NOT_FOUND",
        "message": "Category not found",
        "timestamp": "2026-02-06T04:06:45.539Z"
      }
      """

    Scenario: Verify the DELETE plant method by ID for a existing valid ID
      Given "Admin" sets the endpoint "/api/plants/5"
      When "Admin" sends "DELETE" request with token
      Then Response status code should be 204
      ##And Response body should contain "Plant deleted successfully"