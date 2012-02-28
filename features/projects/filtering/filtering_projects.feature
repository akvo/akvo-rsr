Feature: Searching for projects
  As a project partner
  I want to search for projects that mention particular keywords
  In order to find related projects easily

  Background:
    Given that I have signed in
    Click the "Projects" page tab

  Scenario: I can search for projects with specified keywords in the project name
    Fill the filter text field with the word "ecological"
    Click the "Filter" button
    Then I see a list of projects that have my search phrase in the project name

  Scenario: I can search for projects with specified keywords in the project subtitle
    Fill the filter text field with the phrase "water & sanitation"
    Click the "Filter" button
    Then I see a list of projects that have my search phrase in the project subtitle
