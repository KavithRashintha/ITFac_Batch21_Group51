Feature: Sales API management

  Background:
    Given User logs in with username "testuser" and password "test123"

  Scenario: Ensure that a normal user can retrieve the sales list using GET method
    And Normal User sets the endpoint "/api/sales"
    When User sends "GET" request with token
    Then Response should have status code 200
    And Response body should be a sales list
    And Each sales record should have required fields

 Scenario: Verify a regular user cannot delete a sale
    And Normal User sets the endpoint "/api/sales/6"  
    When User sends "DELETE" request with token
    Then Response should have status code 403
    And Response body should contain error "Forbidden: You do not have permission to delete this sale"

 Scenario: Verify that a regular user can retrieve individual sale details 
   And Normal User sets the endpoint "/api/sales/12"
   When User sends "GET" request with token
   Then Response should have status code 200
 
 