Feature: Route partner sites
  In order to route partner sites users
  As a visitor
  RSR should route urls to either partner sites or to normal RSR

  Scenario: Route to normal RSR
    When I pass "http://www.akvo.org" I would like "http://www.akvo.org" back
