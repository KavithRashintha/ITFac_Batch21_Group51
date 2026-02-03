Feature: Plant management API

  Background:
    Given Admin logged-in with username "admin" and password "admin123"
    And Admin sets the endpoint "/api/plants/category/1"

  Scenario: Create plant with missing mandatory fields
    When Admin sends POST request with payload
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