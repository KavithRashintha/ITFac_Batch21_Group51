
Feature: Category management

Background:
 Given User logged-in as Admin
 When Provide valid username "admin" and password "admin123" for ui
 Then click the login button for ui

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

