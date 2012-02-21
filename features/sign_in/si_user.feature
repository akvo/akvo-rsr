eature: Signing in to Akvo RSR
    As a registered user 
    I want to be able to sign in to my Akvo account
    In order to access cool premium features.
  
    Background: 
        Open Akvo home page
        I should see a "Register" link
        I should see a "Sign in" link
        Click "Sign in" link
        Then I should see the "Sign in" form
        
    Scenario: Successful sign in with Sign in button
        Fill in username and password
        Click "Sign in" button
        Then I should see the Akvo home page again
        Then I should see a "My Akvo" link and a "Sign out" link

    Scenario: Successful sign in with enter key
        Fill in username and password
        Press Enter key
        Then I should see the Akvo home page again
        Then I should see a "My Akvo" link and a "Sign out" link

    Scenario: Unsuccessful sign in with Sign in button
        Fill in unregistered username and password
        Click "Sign in" button
        Then I should see an "Error when signing in" message
        And I should see "Please enter a correct username and password" message

    Scenario: Missing password
        Fill in username only
        Click "Sign in" button
        Then I should see an "Error when signing in" message
        And I should see a "Missing password" error message
        
    Scenario: Missing username
        Fill in password only
        Click "Sign in" button
        Then I should see an "Error when signing in" message
        And I should see a "Missing username" error message

    Scenario: Missing username and password
        Click "Sign in" button
        Then I should see an "Error: Are you a moron? Fill in something, gherkin head!"
  
    Scenario: Inactive account
        Fill in username and password
        Click "Sign in" button
        Then I should see an "Error when signing in" message
        And I should see a "This account is inactive" error message
