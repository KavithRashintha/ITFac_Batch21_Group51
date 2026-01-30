Feature: Login test validation for UI

  Scenario: Login user with a valid credentials in ui
    Given User logged-in as Admin
    When Provide valid username "admin" and password "admin123" for ui
    Then click the login button for ui
