Feature: Login test validation for UI

  Scenario: Admin login with valid credentials
    Given the user logged-in as "Admin"
    When the user provide credentials with username "admin" and password "admin123" and click the login button for ui
    Then User should be redirected to the dashboard

  Scenario: User login with valid credentials
    Given the user logged-in as "User"
    When the user provide credentials with username "testuser" and password "test123" and click the login button for ui
    Then User should be redirected to the dashboard
