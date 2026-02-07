@categories-api
Feature: Category Management - Admin API

  Background:
    Given Admin logs in with username "admin" and password "admin123"

  @create_category_without_parent
  Scenario: Create category without parent
    And Admin sets the endpoint "/api/categories"
    When Admin sends POST request for categories with payload
      """
      {
        "id": 7,
        "name": "Category 3"
      }
      """
    Then Response status code should be 201
    And Response body should contain expected category name
    And Response body should have property "subCategories" as empty array

  @duplicate_category_without_parent
  Scenario: Create category with duplicate name without parent
    Given main category "Category 1" already exists
    And Admin sets the endpoint "/api/categories"
    When Admin sends POST request for categories with payload
      """
      {
        "id": 8,
        "name": "Category 2"
      }
      """
    Then Response status code should be 400
    And Response body should match JSON structure
      """
      {
        "status": 400,
        "error": "DUPLICATE_RESOURCE",
        "message": "Main category 'Category 2' already exists",
        "timestamp": "any_non_empty_string"
      }
      """

  @create_subcategory_under_parent
  Scenario: Create sub category under parent category
    Given parent category "Category 1" exists
    And Admin sets the endpoint "/api/categories"
    When Admin sends POST request for categories with payload
      """
      {
        "id": 8,
        "name": "Sub_Cat 5",
        "parent": {
          "id": 4
        }
      }
      """
    Then Response status code should be 201
    And Response body should contain expected category name
    And Response body should have parent with stored parent id

  @duplicate_subcategory_same_parent
  Scenario: Create sub category with duplicate name under same parent
    Given parent category "Category 1" exists
    And subcategory "CAT1" already exists under parent "Category 1"
    And Admin sets the endpoint "/api/categories"
    When Admin sends POST request for categories with payload
      """
      {
        "id": 9,
        "name": "Sub_Cat 3",
        "parent": {
          "id": 4
        }
      }
      """
    Then Response status code should be 400
    And Response body should match JSON structure
      """
      {
        "status": 400,
        "error": "DUPLICATE_RESOURCE",
        "message": "Sub-category 'Sub_Cat 3' already exists under this parent",
        "timestamp": "any_non_empty_string"
      }
      """

  @category_name_less_than_3
  Scenario: Create category with name length less than 3
    And Admin sets the endpoint "/api/categories"
    When Admin sends POST request for categories with payload
      """
      {
        "id": 10,
        "name": "C5"
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
        "id": 11,
        "name": "Sub Category 5"
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

  # TC_ADMIN_CAT_20
  @updatecategoryname
  Scenario: Verify PUT category method for updating the category name with valid data
    # Ensure ID 10 exists or use a dynamic ID setup in background
    And "Admin" sets the endpoint "/api/categories/15"
    When "Admin" sends "PUT" request with token and payload
      """
      {
        "name": "Sub_Cat4",
        "parentId": 4
      }
      """
    Then Response status code should be 200
    And Response body should match JSON structure
      """
      {
        "id": 5,
        "name": "Sub_Cat4",
        "subCategories": []
      }
      """

  # TC_ADMIN_CAT_21
  @updateparentID
  Scenario: Verify PUT category method for updating the parent ID with valid data
    # Assuming ID 15 is a subcategory moving to Parent ID 13
    And "Admin" sets the endpoint "/api/categories/15"
    When "Admin" sends "PUT" request with token and payload
      """
      {
        "name": "Sub_Cat4_",
        "parentId": 4
      }
      """
    Then Response status code should be 200
    And Response body should match JSON structure
      """
      {
         "id": 5,
         "name": "Sub_Cat4_",
         "subCategories": []
      }
      """

  # TC_ADMIN_CAT_22
  @updateEmptyCategoryName
  Scenario: Verify PUT category method with an empty category name
    And "Admin" sets the endpoint "/api/categories/15"
    When "Admin" sends "PUT" request with token and payload
      """
      {
        "name": "",
        "parentId": 4
      }
      """
    Then Response status code should be 400
    And Response body should match JSON structure
      """
      {
        "status": 400,
        "error": "BAD_REQUEST",
        "message": "Category name must not be empty"
      }
      """

  # TC_ADMIN_CAT_23
  @deletecategoryWithNoSubcategory
  Scenario: Verify DELETE category by Id method for deleting a category that has no subcategories
    # ID 17 should be a category with NO subcategories
    And "Admin" sets the endpoint "/api/categories/7"
    When "Admin" sends "DELETE" request with token
    Then Response status code should be 204
    And Response body should contain "Category deleted successfully"

  # TC_ADMIN_CAT_24
  @deletecategoryWithSubcategory
  Scenario: Verify DELETE category method for attempting to delete a category that has one or more subcategories
    # ID 7 should be a main category WITH subcategories
    And "Admin" sets the endpoint "/api/categories/4"
    When "Admin" sends "DELETE" request with token
    Then Response status code should be 409
    And Response body should match JSON structure
      """
      {
        "status": 409,
        "error": "CONFLICT",
        "message": "Cannot delete main category because it has associated subcategories"
      }
      """

  # TC_ADMIN_CAT_25
  @deletecategoryHaveRecords
  Scenario: Verify DELETE category method for attempting to delete a category that has related records
    # ID 5 should be a category linked to existing Plants/Sales
    And "Admin" sets the endpoint "/api/categories/4"
    When "Admin" sends "DELETE" request with token
    Then Response status code should be 409
    And Response body should match JSON structure
      """
      {
        "status": 409,
        "error": "CONFLICT",
        "message": "Cannot delete category because it has related plant/sales records"
      }
      """
