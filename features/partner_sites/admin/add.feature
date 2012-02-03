Feature: Add new partner site
  In order to be able have a partner site
  As a RSR user
  I want to be able to create a partner sites

  Background:
    Given a RSR editor named "AkvoQAAdmin"
	And that user is connected to the organization AkvoQA
	And that the user is signed in

    Scenario: Successful creation
	  Go to Partner sites in the Admin (admin/rsr/partnersite/)
	  Access the link Add partner site
	  Select AkvoQA in the Organisation dropdown
  	  Fill the field "Hostname" with "akvoqa"
  	  Fill the field "CNAME" with "http://projects.akvoqa.org"
  	  Fill the field "Return URL" with "http://www.akvoqa.org"
  	  Fill the field "About box text" with "Test text"
      Click on "Save"
	  Go to http://akvoqa.akvo.org
	  Then I want to see the text "Find projects"