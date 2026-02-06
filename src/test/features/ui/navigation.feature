@navigation
Feature: Sidebar navigation by role

  Scenario Outline: Verify allowed sidebar navigation
    Given the user logged-in as "<role>"
    When the user provide credentials with username "<username>" and password "<password>" and click the login button for ui
    Then User should be redirected to the dashboard
    When User clicks on "<menu>"
    Then User should be navigated to "<route>"

    Examples:
      | role  | username | password | menu       | route           |
      | Admin | admin    | admin123 | Categories | /ui/categories  |
      | Admin | admin    | admin123 | Plants     | /ui/plants      |
      | Admin | admin    | admin123 | Sales      | /ui/sales       |
      | Admin | admin    | admin123 | Dashboard  | /ui/dashboard   |
      | User  | testuser | test123  | Plants     | /ui/plants      |
      | User  | testuser | test123  | Sales      | /ui/sales       |
      | User  | testuser | test123  | Dashboard  | /ui/dashboard   |
      | Admin | admin    | admin123 | Inventory  | /ui/inventory   |
      | User  | testuser  | test123 | Inventory  | /ui/inventory   |




