@categories-user-apitests
Feature: User Category API Operations

  Background:
    Given User logs in with username "testuser" and password "test123"

  @TC_USER_CAT_03 @get_all_categories
  Scenario: User retrieves complete list of categories
    Given User sets the endpoint "/api/categories"
    When User sends GET request
    Then Response status code should be 200
    And Response body should be a non-empty array
    And Each category should have properties "id", "name", "parentName"

  @TC_USER_CAT_04 @get_main_categories
  Scenario: User retrieves list of parent categories only
    Given User sets the endpoint "/api/categories/main"
    When User sends GET request
    Then Response status code should be 200
    And Response body should be a non-empty array
    And Each category should have properties "id", "name", "subCategories"
    And Each category should have no parent

  @TC_USER_CAT_05 @get_all_subcategories
  Scenario: User retrieves complete list of sub categories
    Given User sets the endpoint "/api/categories/sub-categories"
    When User sends GET request
    Then Response status code should be 200
    And Response body should be a non-empty array
    And Each category should have properties "id", "name"

  # TC_USER_CAT_06: User can search categories with pagination
  # Note: This test currently FAILS due to backend bug - API returns DESC when ASC is requested
  @TC_USER_CAT_06 @user_search_categories_pagination @known-bug
  Scenario: User searches categories with pagination
    Given User sets the endpoint "/api/categories/page"
    And User sets query parameters
      | name      |      |
      | parentId  |      |
      | page      | 0    |
      | size      | 10   |
      | sortField | name |
      | sortDir   | asc  |
    When User sends GET request
    Then Response status code should be 200
    And Response body should have pagination structure
    And Number of records should be less than or equal to 10
    And Results should be sorted by "name" in "asc" order

  @TC_USER_CAT_07 @user_cannot_create_category
  Scenario: User attempts to create category and is denied
    Given User sets the endpoint "/api/categories"
    When User sends POST request for categories with payload
      """
      {
        "id": 0,
        "name": "UserCat"
      }
      """
    Then Response status code should be 403
    And Response body should match JSON structure
      """
      {
        "status": 403,
        "error": "Forbidden",
        "path": "/api/categories",
        "timestamp": "any_non_empty_string"
      }
      """
