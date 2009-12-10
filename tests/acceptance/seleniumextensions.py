from selenium import selenium
from unittest import TestCase

class SeleniumTestCase(TestCase):
    def setUp(self, site_url, browser_config = "*firefoxchrome"):
        TestCase.setUp(self)
        self.verification_errors = []
        self.selenium = selenium("localhost", 4444, browser_config, site_url)
        self.selenium.start()
    
    def tearDown(self):
        TestCase.tearDown(self)
        self.selenium.stop()
        self.failUnlessEqual([], self.verification_errors)
    
    def open_home_page(self):
        self.selenium.open("/")
        self.selenium.wait_for_page_to_load("30000")
            
    def click_link(self, link):
        self.selenium.click("link=%s" % (link))
        self.selenium.wait_for_page_to_load("30000")
        
    def assert_title_is(self, expected_title):
        self.failUnlessEqual(expected_title, self.selenium.get_title(), "Expected page title: %s" % (expected_title))
        
    def assert_title_starts_with(self, expected_title_start):
        self.failUnless(self.selenium.get_title().startswith(expected_title_start),
                        "Expected page title to start with: %s" % (expected_title_start))

    def assert_page_contains_text(self, expected_text):
        self.failUnless(self.selenium.is_text_present(expected_text), "Page should contain: %s" % (expected_text))
    
    def assert_page_contains_text_items(self, list_of_expected_text_items):
        for expected_text in list_of_expected_text_items:
            self.assert_page_contains_text(expected_text)

    def assert_location_contains(self, expected_text):
        self.failIf(self.selenium.get_location().find(expected_text) == -1,
                    "Page URL should contain: %s" % (expected_text))
