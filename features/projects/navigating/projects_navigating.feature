Feature: Project listing pages smoke testing
  In order to check the basic functioning of the project listing pages
  As a smoke testing user
  I want to browse the project listing pages to check that they render properly

  Scenario: I can navigate to the project list
    Go to project listing page
    Then I see the first page of the project listing

  Scenario: I can navigate between the different pages of the project listing
    Go to project listing page
    When I click on the "next ››" link at the top of the list
    Then I click on the "‹‹ previous" link at the bottom of the list
    Then I see the first page of the project listing

  Scenario: I can navigate to a project displayed in the project list
    Go to project listing page
    When I click on the link of the fist project in the project list
    Then I see the main page of that project

  Scenario: I can get a list of all projects in a Focus Area
    Go to project listing page
    When I click on the first link in the "Focus area" column of the project listing
    Then I am shown a project listing with projects for a Focus area
