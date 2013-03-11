Feature: Project listing pages smoke testing
  In order to check the basic functionality of the donations mechanism
  As a smoke testing user
  I want to confirm that I am able to make a donation and that it is recorded correctly

  Scenario: I can create 8 € projects and 4 $ projects
    When I log in to RSR admin 
    When I create and publish "8" uniquely named "euro" projects with a budget of "7000"
    When I create and publish "4" uniquely named "dollar" projects with a budget of "7000"
    Then I can log out of RSR admin

  Scenario: (1) I can fully fund a € project with a single donation using PayPal, see the updated project total and see the amount donated displayed against the donor's name (complete)
    When I go to project listing page
    When I find the first "euro" project requiring the maximum allowed PayPal donation or less, which has not received any donations
    When I note how many "euros" have been raised and how much is still needed
    When I click on the "Donate" link
    When I click on the link with "paypal" in the URL for the project
    When I take note of the amount that is suggested is needed to fully fund the project including PayPal fees
    When I enter "8000" in the "amount" field
    When I enter "the estimated amount including fees to fully fund the project" in the "amount" field
    When I enter "FullFunds Test" in the "name" field
    When I enter "test@akvo.org" in the "email" field
    When I enter "test@akvo.org" in the "email2" field
    When I click on the link with "donate_form" in the URL for the project
    When I click on the donate button
    When I enter the PayPal test username in the "login_email" field
    When I enter the PayPal test password in the "login_password" field
    When I click on the PayPal login button
    When I Click on the Continue button
    When I click on the Back to Akvos test store button
    When I click on the "Return to Project" link
    Then I see that the project appears as fully funded
    When I click on the link with "funding" in the URL for the project
    Then I see "the estimated project funds required including PayPal fees" listed against "FullFunds Test" in the donors list

   Scenario: (2) I can fully fund a $ project with a single donation, see the updated project total and see the amount donated displayed against the donor's name (complete)
    When I go to project listing page
    When I find the first "dollar" project requiring the maximum allowed PayPal donation or less, which has not received any donations
    When I note how many "dollars" have been raised and how much is still needed
    When I click on the "Donate" link
    When I click on the link with "paypal" in the URL for the project
    When I take note of the amount that is suggested is needed to fully fund the project including PayPal fees
    When I enter "the estimated amount including fees to fully fund the project" in the "amount" field
    When I enter "FullFunds Test" in the "name" field
    When I enter "test@akvo.org" in the "email" field
    When I enter "test@akvo.org" in the "email2" field
    When I click on the link with "donate_form" in the URL for the project
    When I click on the donate button
    When I enter the PayPal test username in the "login_email" field
    When I enter the PayPal test password in the "login_password" field
    When I click on the PayPal login button
    When I Click on the Continue button
    When I click on the Back to Akvos test store button
    When I click on the "Return to Project" link
    Then I see that the project appears as fully funded
    When I click on the link with "funding" in the URL for the project
    Then I see "the estimated project funds required including PayPal fees" listed against "FullFunds Test" in the donors list

   Scenario: (3) I can fully fund a € project with a single donation using iDeal, see the updated project total and see the amount donated displayed against the donor's name
    When I log in to RSR admin 
    When I configure Mollie in RSR admin to ensure it is in test mode
    Then I can log out of RSR admin
    When I go to the projects homepage
    When I go to project listing page
    When I find the first project still to be funded in "euros"
    When I note how many "euros" have been raised and how much is still needed
    When I click on the "Donate" link
    When I click on the link with "ideal" in the URL for the project
    When I take note of the amount that is suggested is needed to fully fund the project including PayPal fees
    When I enter "the estimated amount including fees to fully fund the project" in the "amount" field
    When I enter "FullFunds MollieTest" in the "name" field
    When I enter "test@akvo.org" in the "email" field
    When I enter "test@akvo.org" in the "email2" field
    When I select "TBM Bank (Test Bank)" from the select your bank drop down
    When I click on the link with "donate_form" in the URL for the project
    When I click on the link with "mollie" in the URL for the project
    When I click on the link with "true" in the URL for the project
    When I wait "10" seconds
    When I click on the "Return to Project" link
    Then I see that the project appears as fully funded
    When I click on the link with "funding" in the URL for the project
    Then I see "the estimated project funds required including PayPal fees" listed against "FullFunds MollieTest" in the donors list

   Scenario: (4) I can fully fund a € project in two donations with PayPal, see the updated project total and see the amount donated displayed against the donors' names (complete)
    When I go to project listing page
    When I find the first "euro" project requiring the maximum allowed PayPal donation or less, which has not received any donations
    When I note how many "euros" have been raised and how much is still needed
    When I click on the "Donate" link
    When I click on the link with "paypal" in the URL for the project
    When I take note of the amount that is suggested is needed to fully fund the project including PayPal fees
    When I enter "half the estimated amount including fees left to donate" in the "amount" field
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
    When I click on the "Return to Project" link
    When I click on the "Donate" link
    When I click on the link with "paypal" in the URL for the project
    When I take note of the amount that is suggested is needed to fully fund the project including PayPal fees
    When I enter "the estimated amount including fees to fully fund the project" in the "amount" field
    When I enter "Akvo Test2" in the "name" field
    When I enter "test@akvo.org" in the "email" field
    When I enter "test@akvo.org" in the "email2" field
    When I click on the link with "donate_form" in the URL for the project
    When I click on the donate button
    When I enter the PayPal test username in the "login_email" field
    When I enter the PayPal test password in the "login_password" field
    When I click on the PayPal login button
    When I Click on the Continue button
    When I click on the Back to Akvos test store button
    When I click on the "Return to Project" link
    Then I see that the project appears as fully funded
    When I click on the link with "funding" in the URL for the project
    Then I see "the first donation amount" listed against "Akvo Test" in the donors list
    Then I see "the estimated project funds required including PayPal fees" listed against "Akvo Test2" in the donors list

   Scenario: (5) I can fully fund a $ project in two donations with PayPal, see the updated project total and see the amount donated displayed against he donors' names (complete)
    When I go to project listing page
    When I find the first "dollar" project requiring the maximum allowed PayPal donation or less, which has not received any donations
    When I note how many "dollars" have been raised and how much is still needed
    When I click on the "Donate" link
    When I click on the link with "paypal" in the URL for the project
    When I take note of the amount that is suggested is needed to fully fund the project including PayPal fees
    When I enter "half the estimated amount including fees left to donate" in the "amount" field
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
    When I click on the "Return to Project" link
    When I click on the "Donate" link
    When I click on the link with "paypal" in the URL for the project
    When I take note of the amount that is suggested is needed to fully fund the project including PayPal fees
    When I enter "the estimated amount including fees to fully fund the project" in the "amount" field
    When I enter "Akvo Test2" in the "name" field
    When I enter "test@akvo.org" in the "email" field
    When I enter "test@akvo.org" in the "email2" field
    When I click on the link with "donate_form" in the URL for the project
    When I click on the donate button
    When I enter the PayPal test username in the "login_email" field
    When I enter the PayPal test password in the "login_password" field
    When I click on the PayPal login button
    When I Click on the Continue button
    When I click on the Back to Akvos test store button
    When I click on the "Return to Project" link
    Then I see that the project appears as fully funded
    When I click on the link with "funding" in the URL for the project
    Then I see "the first donation amount" listed against "Akvo Test" in the donors list
    Then I see "the estimated project funds required including PayPal fees" listed against "Akvo Test2" in the donors list

  Scenario: (6) I can fully fund a € project in two donations with iDeal, see the updated project total and see the amount donated displayed against the donors' names
    When I go to project listing page
    When I find the first "euro" project requiring the maximum allowed PayPal donation or less, which has not received any donations
    When I note how many "euros" have been raised and how much is still needed
    When I click on the "Donate" link
    When I click on the link with "ideal" in the URL for the project
    When I take note of the amount that is suggested is needed to fully fund the project including PayPal fees
    When I enter "half the estimated amount including fees left to donate" in the "amount" field
    When I enter "FirstDoation MollieTest" in the "name" field
    When I enter "test@akvo.org" in the "email" field
    When I enter "test@akvo.org" in the "email2" field
    When I select "TBM Bank (Test Bank)" from the select your bank drop down
    When I click on the link with "donate_form" in the URL for the project
    When I click on the link with "mollie" in the URL for the project
    When I click on the link with "true" in the URL for the project
    When I wait "10" seconds
    When I click on the "Return to Project" link
    When I click on the "Donate" link
    When I click on the link with "ideal" in the URL for the project
    When I take note of the amount that is suggested is needed to fully fund the project including PayPal fees
    When I enter "the estimated amount including fees to fully fund the project" in the "amount" field
    When I enter "SecondDonation MollieTest" in the "name" field
    When I enter "test@akvo.org" in the "email" field
    When I enter "test@akvo.org" in the "email2" field
    When I select "TBM Bank (Test Bank)" from the select your bank drop down
    When I click on the link with "donate_form" in the URL for the project
    When I click on the link with "mollie" in the URL for the project
    When I click on the link with "true" in the URL for the project
    When I wait "10" seconds
    When I click on the "Return to Project" link
    Then I see that the project appears as fully funded
    When I click on the link with "funding" in the URL for the project
    Then I see "the first donation amount" listed against "FirstDoation MollieTest" in the donors list
    Then I see "the estimated project funds required including PayPal fees" listed against "SecondDonation MollieTest" in the donors list

   Scenario: (7) I can see an appropriate error message when I attempt to overfund a € project using PayPal by more than 2% (complete)
    When I go to project listing page
    When I find the first project still to be funded in "euros"
    When I note how many "euros" have been raised and how much is still needed
    When I click on the "Donate" link
    When I click on the link with "paypal" in the URL for the project
    When I take note of the amount that is suggested is needed to fully fund the project including PayPal fees
    When I enter "the full estimated amound including fees plus an additional one percent" in the "amount" field
    When I enter "Akvo Test" in the "name" field
    When I enter "test@akvo.org" in the "email" field
    When I enter "test@akvo.org" in the "email2" field
    When I click on the link with "donate_form" in the URL for the project
    Then I see this error message "You cannot donate more than the project actually needs!"   

   Scenario: (8) I can see an appropriate error message when I attempt to overfund a € project using PayPal by more than 2% (complete)
    When I go to project listing page
    When I find the first project still to be funded in "dollars"
    When I note how many "dollars" have been raised and how much is still needed
    When I click on the "Donate" link
    When I click on the link with "paypal" in the URL for the project
    When I take note of the amount that is suggested is needed to fully fund the project including PayPal fees
    When I enter "the full estimated amound including fees plus an additional one percent" in the "amount" field
    When I enter "Akvo Test" in the "name" field
    When I enter "test@akvo.org" in the "email" field
    When I enter "test@akvo.org" in the "email2" field
    When I click on the link with "donate_form" in the URL for the project
    Then I see this error message "You cannot donate more than the project actually needs!" 

   Scenario: (9) I can see an appropriate error message when I attempt to overfund a € project using iDeal by more than 2%
    When I go to project listing page
    When I find the first project still to be funded in "dollars"
    When I note how many "dollars" have been raised and how much is still needed
    When I click on the "Donate" link
    When I click on the link with "paypal" in the URL for the project
    When I take note of the amount that is suggested is needed to fully fund the project including PayPal fees
    When I enter "the full estimated amound including fees plus an additional one percent" in the "amount" field
    When I enter "Akvo Test" in the "name" field
    When I enter "test@akvo.org" in the "email" field
    When I enter "test@akvo.org" in the "email2" field
    When I click on the link with "donate_form" in the URL for the project
    Then I see this error message "You cannot donate more than the project actually needs!" 

#   Scenario: (10) I can successfully overfund a € project using PayPal by 1% and see the amount by which the project is overfunded on the project page
#   Scenario: (11) I can successfully overfund a $ project using PayPal by 1% and see the amount by which the project is overfunded on the project page
#   Scenario: (12) I can successfully overfund a € project using iDeal by 1% and see the amount by which the project is overfunded on the project page
