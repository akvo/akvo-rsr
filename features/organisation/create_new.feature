Feature: Creating a new organisation
    In order to add a new partner to Akvo RSR
    As an Akvo Administrator 
    I want to create a new organisation
  
    Background: 
        Given that I have signed in to Admin as an Akvo Administrator
        Record number of "Project partners" shown on home page
        Record number of organisations shown on all-organisations page
        Click "Organisations" link under RSR
        Then I should see the Organisation listing page


    Scenario: Create a new organisation
    	Given I am on the admin Organisation listing page
        When I click "Add Organisation" button
        Then I should see the "Add Organisation" form

        Fill in required fields
        Click "Save"
        Then number of "Project partners" shown on the home page should be +1
        Then number of organisations shown on all-organisations page should be +1
        Then the new organisation should appear on all-organisations page
        Then an organisation page has been created for the new organisation

