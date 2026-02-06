@categories-apitests
Feature: Category API Management

  Background:
    Given Admin logs in with username "admin" and password "admin123"

  @create_category_without_parent
  Scenario: Create category without parent
    And Admin sets the endpoint "/api/categories"
    When Admin sends POST request for categories with payload
      """
      {
        "id": 0,
        "name": "API_Main_Category"
      }
      """
    Then Response status code should be 201
    And Response body should contain expected category name
    And Response body should have property "subCategories" as empty array

  @duplicate_category_without_parent
  Scenario: Create category with duplicate name without parent
    Given main category "Main 2" already exists
    And Admin sets the endpoint "/api/categories"
    When Admin sends POST request for categories with payload
      """
      {
        "id": 0,
        "name": "Main 2"
      }
      """
    Then Response status code should be 400
    And Response body should match JSON structure
      """
      {
        "status": 400,
        "error": "DUPLICATE_RESOURCE",
        "message": "Main category 'Main 2' already exists",
        "timestamp": "any_non_empty_string"
      }
      """

  @create_subcategory_under_parent
  Scenario: Create sub category under parent category
    Given parent category "Main 1" exists
    And Admin sets the endpoint "/api/categories"
    When Admin sends POST request for categories with payload
      """
      {
        "id": 0,
        "name": "API_Sub_Category",
        "parent": {
          "id": "stored_parent_id"
        }
      }
      """
    Then Response status code should be 201
    And Response body should contain expected category name
    And Response body should have parent with stored parent id

  @duplicate_subcategory_same_parent
  Scenario: Create sub category with duplicate name under same parent
    Given parent category "Main 1" exists
    And subcategory "Sub_1" already exists under parent "Main 1"
    And Admin sets the endpoint "/api/categories"
    When Admin sends POST request for categories with payload
      """
      {
        "id": 0,
        "name": "Sub_1",
        "parent": {
          "id": "stored_parent_id"
        }
      }
      """
    Then Response status code should be 400
    And Response body should match JSON structure
      """
      {
        "status": 400,
        "error": "DUPLICATE_RESOURCE",
        "message": "Sub-category 'Sub_1' already exists under this parent",
        "timestamp": "any_non_empty_string"
      }
      """

  @category_name_less_than_3
  Scenario: Create category with name length less than 3
    And Admin sets the endpoint "/api/categories"
    When Admin sends POST request for categories with payload
      """
      {
        "id": 0,
        "name": "AB"
      }
      """
    Then Response status code should be 400
    And Response body should match JSON structure
      """
      {
        "details": {
          "name": "Category name must be between 3 and 10 characters"
        },
        "error": "BAD_REQUEST",
        "message": "Validation failed",
        "status": 400,
        "timestamp": "any_non_empty_string"
      }
      """

  @category_name_greater_than_10
  Scenario: Create category with name length greater than 10
    And Admin sets the endpoint "/api/categories"
    When Admin sends POST request for categories with payload
      """
      {
        "id": 0,
        "name": "VeryLongCategoryName"
      }
      """
    Then Response status code should be 400
    And Response body should match JSON structure
      """
      {
        "details": {
          "name": "Category name must be between 3 and 10 characters"
        },
        "error": "BAD_REQUEST",
        "message": "Validation failed",
        "status": 400,
        "timestamp": "any_non_empty_string"
      }
      """
