Feature: Add new partner site
  In order for an RSR Organisation to have a partner site
  As a organisation administrator/editor???
  I want to be able to create a partner sites

  Background:
    Given the user is signed in
    And that the users organisation have public projects
    And the organisation to have a premium account 

    Scenario: Get new partner site form
      Given I Open the Admin partner site page (admin/rsr/partnersite/)
      When I click "Add partner site" button
      Then I want to see the users organisation pre loaded on the form
    
    Scenario: Successful creation of partner site
      Given I open the Admin partner site page (admin/rsr/partnersite/)
      When I click "Add partner site" button
      And I fill in "Hostname" with "akvoqa"
      And I fill in "CNAME" with "projects" plus local domain 
      And I fill in "Return URL" with local domain
      And I fill in "About box text" with "Test text"
      And I select the "Enabled" button
      And I click on "Save"
      And I open the new partner sites
      Then I want to see "Find projects"
