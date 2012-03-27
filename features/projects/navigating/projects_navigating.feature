Feature: Project listing pages smoke testing
  In order to check the basic functioning of the project listing pages
  As a smoke testing user
  I want to browse the project listing pages to check that they render properly

  Background:
    Given that I have internet access
    Then navigate to the Akvo RSR home page
    Then I click the "Projects" page tab in the main nav bar

  Scenario: I can navigate between the different pages of the project listing
    When I click on the "next ››" link at the top of the list
    Then I click on the "‹‹ previous" link at the bottom of the list
    Then I see the first page of the project listing

  Scenario: I can navigate to a project displayed in the project list
    When I click on the link of the fist project in the project list
    Then I see the main page of that project

  Scenario: I can get a list of all projects in a Focus Area
    When I click on the first link in the "Focus area" column of the project listing
    Then I am shown a project listing with projects for a Focus area

  Scenario: I can sort Projects by name
    When I click in the "Name" column header link 
    Then I am shown a project listing sorted alphabetically, reversed