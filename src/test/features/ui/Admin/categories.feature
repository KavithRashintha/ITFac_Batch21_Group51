@categories
Feature: Category Management UI - Admin

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

    #TC_ADMIN_CAT_13
    @editcategory
    Scenario: Verify the Edit category button in Actions 
        When user navigates to "ui/categories"
        And user clicks on Edit button
        Then user navigates to edit category page

    #TC_ADMIN_CAT_14
    @editcategoryname
    Scenario Outline: Verify the Validation errors when editing a categoryname that not meet the valid criteria (3-10)
        When user navigates to "ui/categories"
        And user clicks on Edit button
        And user navigates to edit category page
        And user provide categoryName "<name>"
        Then the error message should be visible

    Examples:
      | name            |
      |                 |
      |An               |
      |Anthuriummm      |
      |Anthuriummmmmmmmm|

    #TC_ADMIN_CAT_15
    @editcategorySaveButton
    Scenario: Verify the Save button functionality in the Edit Category
        When user navigates to "ui/categories"
        And user clicks on edit button for category "Plant9"
        And user navigates to edit category page
        And user edits the categoryname "Rose"
        And user click save button
        Then user navigates to category page
        And the success message should be displayed
        And the category name should be updated to "Rose"

    #TC_ADMIN_CAT_16
    @editcategoryCancelButton
    Scenario: Verify the Cancel button functionality in the Edit Category
        When user navigates to "ui/categories"
        And user clicks on edit button for category "Plant9"
        And user navigates to edit category page
        And user edits the categoryname "RoseTemp"
        And user clicks on cancel button
        Then user navigates to category page
        And the category name should remain as "Anthurium"

    #TC_ADMIN_CAT_17
    @deleteCategoryConfirmation
    Scenario: Verify the Delete Category button in Action
        When user navigates to "ui/categories"
        And user clicks on delete button for category "plant8"
        Then delete confirmation popup should be displayed

    @categoryname_required
    Scenario: Verify category name is required to create a category
        When user navigates to "ui/categories"
        And user clicks on Add Category button
        And user clicks save button without entering category name
        Then validation message "Category name is required" should be displayed

    @categorysorting
    Scenario: Verify category list sorting works for ID, Name and Parent
        When user navigates to "ui/categories"
        Then user sorts category list by ID
        And user sorts category list by Name
        And user sorts category list by Parent

    @searchwithoutparent
    Scenario: Verify categories can be searched without selecting parent category
        When user navigates to "ui/categories"
        And user enters subcategory name "Sub_Cat1" in search field
        And user clicks Search button
        Then search results should be displayed
        And results should match the search criteria

    @filterbyparent
    Scenario: Verify filtering categories by parent category
        When user navigates to "ui/categories"
        And user selects parent category "Category 1"
        And user clicks Search button
        Then only subcategories belonging to parent category "Category 1" should be displayed



