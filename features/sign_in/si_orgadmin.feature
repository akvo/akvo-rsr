Feature: Signing in to Akvo RSR
    As an Akvo RSR Oranisation Administrator 
    I want to be able to sign in to my Organisation Administrator account
    In order to administrate my Akvo RSR projects.

    Background: 
        Open Akvo home page
        I should see an Admin section in the footer
        I should see an "Akvo RSR login" link under Admin
        Click "Akvo RSR login" link
        Then I should see the "Akvo RSR administration" form
        
    Scenario: Successful organisation admin sign in
        Fill in organisation admin username and password
        Click "Log in" button
        Then I should see the organisation's limited Site administration page
        Then I should see a "Change password" link and a "Log out" link
        Click "Organisations" link
        Then I should see only my organisation listed
