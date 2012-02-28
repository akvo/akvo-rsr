Feature: Visit partner sites
  In order to use partner sites
  As a user
  I want to be able to access a partner sites pages

  Background:
    Given that a partner sites "akvoqa.akvo.org" exists
  And the user is not signed in

  Scenario: Access home page
    Go to home page
    Then I want to see the text "Find projects"
    And also see the text "Sign in"

  Scenario: Access project page
    Go to home page
    Click on the link "Test project"
    Then I want to see the text "Test project"

  Scenario: Access funding page
    Go to home page
    Click on the link "Test project"
    Click on the link "See funding and milestone details"
    Then I want to see the text "Raised equals donations minus transaction fees"

  Scenario: Access updates list page
    Go to home page
    Click on the link "Test project"
    Click on the link "See all"  (This seems like an issue)
    Then I want to see the text "Project updates"

  Scenario: Access updates list page
    Go to home page
    Click on the link "Test project"
    Click on the first update (This seems like an issue)
    Then I want to see the text "Back to project updates"

  Scenario: Access project partner page
    Go to home page
    Click on the first partner on the first project in the partner column
    Then I want to see the text "People who get"

  Scenario: Access project partner list page
    Go to home page
    Click on the link "Test project"
    Click on the link "Project partners"
    Then I want to see the text "Project partners"

  Scenario: Access donation flow
    Go to home page
    Click on the link "Test project"
    Click on "Donate"
    Then I want to see the text "Test project"
    And see the button "Donate"
