# -*- coding: utf-8 -*-

from lettuce import after, before, step, world
from splinter.browser import Browser

SITE_UNDER_TEST = 'test.akvo.org'

@before.all
def setUp():
    world.browser = Browser('firefox')

@after.all
def tearDown(test_results):
    world.browser.quit()

@step('Go to home page')
def go_to_home_page(step):
    world.browser.visit('http://%s' % SITE_UNDER_TEST)

@step('Then I should see the title "([^"]*)"')
def then_i_should_see_the_title(step, expected_title):
    assert world.browser.title == expected_title

@step('And I also see a "([^"]*)" link')
def and_i_also_see_link(step, expected_link_text):
    assert world.browser.find_link_by_text(expected_link_text)
    
@step('And I also see a "([^"]*)" link')
def and_i_also_see_a_projects_link(step, projects_link):
    assert world.browser.find_link_by_text(projects_link)

@step('Then I should see "([^"]*)"')
def then_i_should_see_text(step, expected_text):
    assert world.browser.is_text_present(expected_text)

@step('Then I click on the first project update')
def then_i_click_on_the_first_project_update(step):
    element = world.browser.find_by_css('#project_update_0').first
    title = world.project_update_title = element.find_by_tag('h2').first.text
    element.find_by_css('div div a').first.click()

@step('Then I expect to see the page for the selected update')
def then_i_expect_to_see_details_for_the_selected_update(step):
    assert world.browser.is_text_present(world.project_update_title)
