@categories
Feature: Category Management - User

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
