@login @ui
Feature: Login UI

  Scenario: Admin login with valid credentials
    Given the user logged-in as "Admin"
    When the user provide credentials with username "admin" and password "admin123" and click the login button for ui
    Then User should be redirected to the dashboard

  Scenario: User login with valid credentials
    Given the user logged-in as "User"
    When the user provide credentials with username "testuser" and password "test123" and click the login button for ui
    Then User should be redirected to the dashboard

  @login_page
  Scenario: Verify Login page is displayed
    Given user is not logged in
    When user navigates to "ui/login"
    Then login page should be displayed
    And username and password fields should be visible

  @login_mandatory_fields
  Scenario: Verify username and password fields are mandatory
    Given user navigates to "ui/login"
    When user clicks the login button
    Then validation message "Username is required" should be displayed
    And validation message "Password is required" should be displayed
    And user should not be logged in

  @login_invalid_credentials
  Scenario: Verify error message for invalid login
    Given user is on the login page
    When user enters username "invalidUser"
    And user enters password "invalidPass"
    And user clicks the login button
    Then global error message "Invalid username or password" should be displayed
    And user should remain on the login page

  @login_success
  Scenario: Verify successful login redirects to Dashboard
    Given user is on the login page
    When user enters username "testuser"
    And user enters password "test123"
    And user clicks the login button
    Then user should be redirected to the dashboard