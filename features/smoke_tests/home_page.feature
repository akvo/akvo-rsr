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
