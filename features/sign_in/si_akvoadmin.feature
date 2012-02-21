Feature: Signing in to Akvo RSR
    As an Akvo Administrator 
    I want to be able to sign in to my Akvo Administrator account
    In order to work on RSR partner accounts.
  
    Background: 
        Open Akvo home page
        I should see an Admin section in the footer
        I should see an "Akvo RSR login" link under Admin
        Click "Akvo RSR login" link
        Then I should see the "Akvo RSR administration" form
        
    Scenario: Successful Akvo adminstrator sign in
        Fill in administrator username and password
        Click "Log in" button
        Then I should see the full Site administration page
        Then I should see a "Change password" link and a "Log out" link

    Scenario: Successful Akvo administrator sign in with enter key
        Fill in administrator username and password
        Click "Log in" button
        Then I should see the full Site administration page
        Then I should see a "Change password" link and a "Log out" link

    Scenario: Missing password
        Fill in username only
        Click "Log in" button
        Then I should see an "Please correct the error below"
        And I should see a "This field is required" message by Password field
        
    Scenario: Missing username
        Fill in password only
        Click "Log in" button
        Then I should see an "Please correct the error below"
        And I should see a "This field is required" message by Username field

    Scenario: Missing username and password
        Click "Sign in" button
        Click "Log in" button
        Then I should see an "Please correct the errors below"
        And I should see a "This field is required" message by Password field
        And I should see a "This field is required" message by Username field
  
    Scenario: Inactive account
        Fill in username and password for an inactive account
        Click "Log in" button
        Then I should see an "Error when signing in" message
        And I should see a "This account is inactive" error message