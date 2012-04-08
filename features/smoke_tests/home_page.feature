Feature: Home page navigation
  As anyone
  I want to view the Akvo home page
  In order to see what's available

  Scenario: View home page
    Go to home page
    Then I should see the title "Akvo.org - See it happen"
    And I also see a "Projects" link

  Scenario: Home page displays recent project updates
    Go to home page
    Then I should see "Most recent project updates"
    Then I click on the first project update
    Then I expect to see the page for the selected update

  Scenario: Home page displays recent blog posts
    Go to home page
    Then I should see "Recent blog posts"
    Then I click on the first blog post
    Then I expect to see details for the selected post

  Scenario: Home page displays accordion with focus areas
    Go to home page
    Then I should see "Project focus areas"
    Then I click on the last focus area link
    Then I expect to see a list of projects for the focus area
