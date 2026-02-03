
Feature: Category management

    Background:
        Given the user logged-in as "Admin"
        When the user provide credentials with username "admin" and password "admin123" and click the login button for ui
        Then User should be redirected to the dashboard

    @viewcategories
    Scenario: Verify category page is visible to admin user
        When user navigates to "ui/categories"
        Then category list table should be visible
        And pagination should be visible
        And search option should be visible
        And sorting option should be visible

    @addcategory
    Scenario: Verify Add Category button is visible to Admin
        When user navigates to "ui/categories"
        Then Add Category button should be visible and enabled

    @editcategory
    Scenario: Verify the Edit category button in Actions 
        When user navigates to "ui/categories"
        And user clicks on Edit button
        Then user navigates to edit category page

    @editcategoryname
    Scenario: Verify the Validation errors when editing a categoryname that not meet the valid criteria (3-10)
        When user navigates to "ui/categories"
        And user clicks on Edit button
        And user navigates to edit category page
        And user provide categoryName "AnthuriumAnthurium" 
        Then user click save button

