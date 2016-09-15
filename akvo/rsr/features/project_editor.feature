Feature: Check that project editor works correctly

Background: Setup intial test data
  Given that test data is loaded

Scenario: Project Editor shows up for admin
    Given I am a logged in admin
    When I click create new project
    Then Project editor opens
