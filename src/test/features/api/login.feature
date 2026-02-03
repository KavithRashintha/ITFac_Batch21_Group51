Feature: Login test validation for API

Scenario: Admin login with valid credentials
    When User logs in with username "admin" and password "admin123"
    Then It receives the response and Response status code should be 200
    And Response body should contain a JSON like 
    """
    {
        "token": "any_non_empty_string",
        "tokenType": "Bearer"
    }
    """

Scenario: User login with valid credentials
    When User logs in with username "testuser" and password "test123"
    Then It receives the response and Response status code should be 200
    And Response body should contain a JSON like 
    """
    {
        "token": "any_non_empty_string",
        "tokenType": "Bearer"
    }
    """
