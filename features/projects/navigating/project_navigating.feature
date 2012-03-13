Feature: Project pages smoke testing
  In order to check the basic functioning of the project pages
  As a smoke testing user
  I want to browse the project pages to check that they render properly

  Background:
    Given that I have internet access
    When I navigate to the Akvo RSR home page
    Then I click the link to the first update displayed in the "Most recent project updates" section

  Scenario: I can navigate to a project update page
    Then I am shown the project update

  Scenario: I can navigate to a project listing page
    When I click the link "Back to project updates"
    Then I am shown the updates listing page of the project

  Scenario: I can navigate to a project main page
    When I click the link "Back to project updates"
    Then I click the link "Back to main project page"
    Then I am shown the main page of the project
