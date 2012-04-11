Feature: Project pages smoke testing
  In order to check the basic functioning of the project pages
  As a smoke testing user
  I want to browse the project pages to check that they render properly

  Background: Navigate to the project main page for the project that has the first update on the home page

  Scenario: I can navigate to the project main page
    When I navigate to the project main page
    Then I am shown the main page of the project

  Scenario: I can navigate to the project update page
    When I navigate to the project main page
    When I click on the topmost link in the Latest updates section
    Then I expect to see the page for the selected update

  Scenario: I can navigate to the project listing page
    When I navigate to the project main page
    When I click on the See all ► link in the Latest updates section
    Then I am shown the updates listing page of the project

  Scenario: I can navigate to the project funding details page
    When I navigate to the project main page
    When I click on the See funding details ►
    Then I am shown the funding details page of the project

  Scenario: I can navigate to a project partners page
    When I navigate to the project main page
    When I click on the See details ► link in the Project partners section
    Then I am shown the project partners page for the project

  Scenario: I can navigate to a project partners page
    When I navigate to the project main page
    When I click on the See all ► link in the Comments section
    Then I am shown the comments page for the project



