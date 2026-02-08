@plants @api @admin
Feature: Plant Management API - Admin

  Background:
    Given Admin logs in with username "admin" and password "admin123"

  Scenario: Verify create plant with duplicate name
    And "Admin" sets the endpoint "/api/plants/category/6"
    When "Admin" sends "POST" request with token and payload
      """
      {
        "name": "Plant12",
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
        "message": "Plant 'Plant13' already exists in this category",
        "timestamp": "any_non_empty_string"
      }
      """

  Scenario: Verify create plant with valid data
    And "Admin" sets the endpoint "/api/plants/category/4"
    When "Admin" sends "POST" request with token and payload
      """
      {
        "name": "Plant13",
        "price": 100,
        "quantity": 20
      }
      """
    Then Response status code should be 201
    And Response body should match JSON structure
      """
      {
        "id": 13,
        "name": "Plant13",
        "price": 100,
        "quantity": 20,
        "category": {
          "id": 6,
          "name": "Sub_Cat4",
          "subCategories": []
        }
      }
      """

  Scenario: Verify create plant with missing mandatory fields
    And "Admin" sets the endpoint "/api/plants/category/2"
    When "Admin" sends "POST" request with token and payload
      """
      {
        "name": "Plant14",
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
        "name": "Plant15",
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
        "path": "Category not found",
        "timestamp": "any_non_empty_string"
      }
      """

    Scenario: Verify the DELETE plant method by ID for a existing valid ID
      Given "Admin" sets the endpoint "/api/plants/11"
      When "Admin" sends "DELETE" request with token
      Then Response status code should be 204
      ##And Response body should contain "Plant deleted successfully"