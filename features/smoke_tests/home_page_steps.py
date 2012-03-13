# -*- coding: utf-8 -*-

from lettuce import after, before, step, world
from splinter.browser import Browser

SITE_UNDER_TEST = 'test2.akvo.org'

@before.all
def setUp():
    world.browser = Browser('firefox')

@after.all
def tearDown(test_results):
    world.browser.quit()

@step(u'Go to home page')
def go_to_home_page(step):
    world.browser.visit('http://%s' % SITE_UNDER_TEST)

@step(u'Then I should see the title "([^"]*)"')
def then_i_should_see_the_title(step, expected_title):
    assert world.browser.title == expected_title

@step(u'And I also see a "([^"]*)" link')
def and_i_also_see_link(step, link_text):
    assert world.browser.find_link_by_text('Projects')
    
@step(u'And I also see a "([^"]*)" link')
def and_i_also_see_a_projects_link(step, projects_link):
    assert world.browser.find_link_by_text(projects_link)
