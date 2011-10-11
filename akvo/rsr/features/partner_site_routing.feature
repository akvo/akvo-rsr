Feature: Routing middleware
  In order to access the proper RSR page 
  As a user
  I want RSR to show me the appropriate page based on my request URL

  Scenario: Route normal RSR URL
    Given I access RSR from the url "www.akvo.org" I would like to access a normal RSR instance
    Given I access RSR from the url "akvo.org" I would like to access a normal RSR instance
    Given I access RSR from the url "localhost" I would like to access a normal RSR instance
    Given I access RSR from the url "127.0.0.1" I would like to access a normal RSR instance
    Given I access RSR from the url "akvo.dev" I would like to access a normal RSR instance

  Scenario: Route partner site RSR URL
    Given I access RSR from the url "projects.akvoapp.org" I would like to access a partner sites RSR instance

  Scenario: Route nonvalid partner sites URL
    Given I access RSR from the nonvalid url "nonvalid.partner.org" I want to see a 404 page
