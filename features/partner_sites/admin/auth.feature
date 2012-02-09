Feature: Sign on on partner sites
  In order to be able to make updates
  As a RSR user
  I want to be able to sign in on partner sites

  Background:
    Given a RSR editor named "AkvoQAAdmin"
    And that Akvo have an enabled partner site

    Scenario: Successfull sign in
      Go to Akvo´s partner sites
      Access the link "Sign in"
      Fill the field "username" with "AkvoQAAdmin"
      Fill the filed "password" with "xxx"
      Click on "Sign in"
      Then I want to see the text "Hello AkvoQAAdmin!"

    Scenario: Signing out
      Go to Akvo´s partner sites
      Access the link "Sign out"
      Then I want to see the text "Sign in"

    Scenario: Unsuccessfull sign in
      Go to Akvo´s partner sites
      Access the link "Sign in"
      Fill the field "username" with "AkvoQAAdmin"
      Fill the field "password" with "zzz"
      Click on "Sign in"
      Then I want to see the text "Error when signing in"
