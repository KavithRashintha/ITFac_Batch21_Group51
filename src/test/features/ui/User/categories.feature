@categories @ui @user
Feature: Category Management UI - User

    Background:
        Given the user logged-in as "User"
        When the user provide credentials with username "testuser" and password "test123" and click the login button for ui
        Then User should be redirected to the dashboard

    @user_view_categories
    Scenario: Verify category list page is visible for user
        When user navigates to "ui/categories"
        Then category list table should be visible
        And pagination should be visible
        And search option should be visible
        And sorting option should be visible

    @user_add_category_hidden
    Scenario: Verify Add Category button is hidden for non admin user
        When user navigates to "ui/categories"
        Then Add Category button should not be visible

    #TC_USER_CAT_08
    @editCategoryButtonDisabled
    Scenario: Verify that the Category Edit button is disabled for users
        When user navigates to category page "ui/categories"
        Then the Edit button for category "Plant1" should be disabled
    
    #TC_USER_CAT_09
    @deleteCategoryButtonDisabled
    Scenario: Verify that the Category Delete button is disabled for users
        When user navigates to category page "ui/categories"
        Then the Delete button for category "Plant1" should be disabled

    #TC_ADMIN_CAT_11
    @searchValidSubcategory
    Scenario: Verify search functionality for a valid subcategory name
        When user navigates to "ui/categories"
        And user enters "Plant1" in the search bar
        And user clicks on the search button
        Then the search results should display category/subcategory "Plant1"

    #TC_ADMIN_CAT_12
    @searchInvalidSubcategory
    Scenario: Verify "No category found" message displays when the records do not exist
        When user navigates to "ui/categories"
        And user enters "Pineapple" in the search bar
        And user clicks on the search button
        Then "No category found" message should be displayed

    #TC_USER_CAT_13
    @searchResetButton
    Scenario: Verify that clicking the Reset button clears the entered search criteria
        When user navigates to "ui/categories"
        And user enters "Apple" in the search bar
        And user clicks on the search button
        And the search results should display category/subcategory "Apple"
        And user clicks on the Reset button
        Then the search input should be cleared
        And the category list should be reset
