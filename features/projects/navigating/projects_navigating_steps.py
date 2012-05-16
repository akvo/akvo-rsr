# -*- coding: utf-8 -*-
from lettuce import step, world


@step(u'Go to project listing page')
def go_to_project_listing_page(step):
    world.browser.visit('http://%s/rsr/projects/all/' % world.SITE_UNDER_TEST)


# Scenario: I can navigate to the project list
@step(u'Then I see the first page of the project listing')
def then_i_see_the_first_page_of_the_project_listing(step):
    assert world.browser.title == 'Akvo.org - All projects'


# Scenario: I can navigate between the different pages of the project listing
@step(u'When I click on the "([^"]*)" link at the top of the list')
def when_i_click_on_the_group1_link_at_the_top_of_the_list(step, group1):
    world.browser.find_by_css('a.next').first.click()

@step(u'Then I click on the "([^"]*)" link at the bottom of the list')
def then_i_click_on_the_group1_link_at_the_bottom_of_the_list(step, group1):
    world.browser.find_by_css('a.prev').last.click()


# Scenario: I can navigate to a project displayed in the project list
@step(u'When I click on the link of the first project in the project list')
def when_i_click_on_the_link_of_the_fist_project_in_the_project_list(step):
    project_link = world.browser.find_by_tag('table').first.find_by_tag('td').first.find_by_tag('a').first.find_by_tag('p').last
    world.project_title = project_link.text
    project_link.click()

@step(u'Then I see the main page of that project')
def then_i_see_the_main_page_of_that_project(step):
    assert world.browser.title == 'Akvo.org - %s' % world.project_title


# Scenario: I can get a list of all projects in a Focus Area
@step(u'When I click on the first link in the "([^"]*)" column of the project listing')
def when_i_click_on_the_first_link_in_the_group1_column_of_the_project_listing(step, group1):
    fa_link = world.browser.find_by_tag('table').first.find_by_tag('td')[5].find_by_tag('a').first
    world.focus_area = fa_link.text
    fa_link.click()

@step(u'Then I am shown a project listing with projects for a Focus area')
def then_i_am_shown_a_project_listing_with_projects_for_a_focus_area(step):
    assert world.browser.title == 'Akvo.org - Projects - %s' % world.focus_area

