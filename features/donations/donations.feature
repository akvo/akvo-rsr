Feature: Project listing pages smoke testing
  In order to check the basic functionality of the donations mechanism
  As a smoke testing user
  I want to confirm that I am able to make a donation and that it is recorded correctly

  Background: Navigate to the list of all projects from the home page

  Scenario: I can navigate to the list of all projects and then to an individual project page and confirm the information displayed correlates
    When I go to project listing page
    When I find the first project still to be funded in €
    When I note how much has been raised and how much is still needed
    Then these amounts should agree with those on the project listing page

#  Scenario: I can navigate to a project displayed in the project list and have a donation properly recorded using PayPal anonymously
#    When I go to project listing page
#    When I find the first project still to be funded in €
#    When I note how much has been raised and how much is still needed
#    When I click on the "Donate" link
#    When I click on the link with "paypal" in the URL for the project
#    When I enter "10" in the "amount" field
#    When I enter "Akvo Test" in the "name" field
#    When I enter "test@akvo.org" in the "email" field
#    When I enter "test@akvo.org" in the "email2" field
#    When I click on the link with "donate_form" in the URL for the project
#    When I click on the donate button
#    When I enter the information to make an anonymous donation
#    When I click on the "continue.x" button
#    When I Click on the Continue button
#    When I click on the Back to Akvos test store button
#    When I take note of the invoice number
#    When I click on the "Return to Project" link
#    When I note the new values of how much has been raised and how much is still needed
#    Then I see that the amount raised has been incremented by "10" and the amount left to raise decremented by the same amount
#    When I log in to RSR admin 
#    Then I see that the invoice is present and is in the "pending" state

  Scenario: I can navigate to a project displayed in the project list and have a donation properly recorded when signed in to a PayPal account
    When I go to project listing page
    When I find the first project still to be funded in €
    When I note how much has been raised and how much is still needed
    When I click on the "Donate" link
    When I click on the link with "paypal" in the URL for the project
    When I enter "10" in the "amount" field
    When I enter "Akvo Test" in the "name" field
    When I enter "test@akvo.org" in the "email" field
    When I enter "test@akvo.org" in the "email2" field
    When I click on the link with "donate_form" in the URL for the project
    When I click on the donate button
    When I enter the PayPal test username in the "login_email" field
    When I enter the PayPal test password in the "login_password" field
    When I click on the PayPal login button
    When I Click on the Continue button
    When I click on the Back to Akvos test store button
    When I take note of the invoice number
    When I click on the "Return to Project" link
    When I note the new values of how much has been raised and how much is still needed
    Then I see that the amount raised has been incremented by "10" and the amount left to raise decremented by the same amount
    When I log in to RSR admin 
    Then I see that the invoice is present and is in the "pending" state

  Scenario: I can see an error message if while making a donation I do not enter the same email in the confirm email field
    When I go to project listing page
    When I find the first project still to be funded in €
    When I note how much has been raised and how much is still needed
    When I click on the "Donate" link
    When I click on the link with "paypal" in the URL for the project
    When I enter "10" in the "amount" field
    When I enter "Akvo Test" in the "name" field
    When I enter "test@akvo.org" in the "email" field
    When I enter "test2@akvo.org" in the "email2" field
    When I click on the link with "donate_form" in the URL for the project
    Then I see this error message "You must type the same email address each time!"

  Scenario: I can see an error message if I attempt to donate considerably more funds than are needed for the project
    When I go to project listing page
    When I find the first project still to be funded in €
    When I note how much has been raised and how much is still needed
    When I click on the "Donate" link
    When I click on the link with "paypal" in the URL for the project
    When I enter more funds than are needed in the "amount" field
    When I enter "Akvo Test" in the "name" field
    When I enter "test@akvo.org" in the "email" field
    When I enter "test@akvo.org" in the "email2" field
    When I click on the link with "donate_form" in the URL for the project
    Then I see this error message "You cannot donate more than the project actually needs!"

  Scenario: I can see an error message if I attempt to donate an amount that is a negative number negative number project
    When I go to project listing page
    When I find the first project still to be funded in €
    When I click on the "Donate" link
    When I click on the link with "paypal" in the URL for the project
    When I enter "-10" in the "amount" field
    When I enter "Akvo Test" in the "name" field
    When I enter "test@akvo.org" in the "email" field
    When I enter "test@akvo.org" in the "email2" field
    When I click on the link with "donate_form" in the URL for the project
    Then I see this error message "Ensure this value is greater than or equal to 2."

  Scenario: I can see an error message if I attempt to donate a decimal amount
    When I go to project listing page
    When I find the first project still to be funded in €
    When I click on the "Donate" link
    When I click on the link with "paypal" in the URL for the project
    When I enter "10.23" in the "amount" field
    When I enter "Akvo Test" in the "name" field
    When I enter "test@akvo.org" in the "email" field
    When I enter "test@akvo.org" in the "email2" field
    When I click on the link with "donate_form" in the URL for the project
    Then I see this error message "Enter a whole number."

  Scenario: I see the appropriate error message each time I leave one of the donation fields blank
    When I go to project listing page
    When I find the first project still to be funded in €
    When I click on the "Donate" link
    When I click on the link with "paypal" in the URL for the project
    Then I see the error message "This field is required." each time I leave one of the fields blank

  Scenario: I can see that the funds are not credited to the project if I do not complete the PayPal transaction
    When I go to project listing page
    When I find the first project still to be funded in €
    When I note how much has been raised and how much is still needed
    When I click on the "Donate" link
    When I click on the link with "paypal" in the URL for the project
    When I enter "10" in the "amount" field
    When I enter "Akvo Test" in the "name" field
    When I enter "test@akvo.org" in the "email" field
    When I enter "test@akvo.org" in the "email2" field
    When I click on the link with "donate_form" in the URL for the project
    When I click on the donate button
    When I enter the PayPal test username in the "login_email" field
    When I enter the PayPal test password in the "login_password" field
    When I click on the PayPal login button
    When I go to project listing page
    When I wait "16" minutes
    When I return to the euro project requiring funding
    When I note the new values of how much has been raised and how much is still needed
    Then I see that the amount raised and the amount left to raise are unchanged


