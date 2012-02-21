Feature: A partner site home page should load without any errors
    As a project partner
    I want a partner site that displays a list of my projects and some branding
    In order to share my work with the online community

    Scenario: I can view a list of projects for a specified partner organisation
        Load the "<partner_site_home>" page
        Then I should see a list of projects for the organisation


    Examples:
        | partner_site_home             | 
        | akvo.akvotest*.org            |
        | aqua4all.akvotest*.org        |
        | connect4change.akvotest*.org  |
        | akvo.akvoapp.org              |
        | aqua4all.akvoapp.org          |
        | connect4change.akvoapp.org    |
