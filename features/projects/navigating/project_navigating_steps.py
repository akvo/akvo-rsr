# -*- coding: utf-8 -*-

from lettuce import step, world, before


@before.each_feature
def get_project_info(feature):
    '''Figure out the title of the project update and the URL to the project'''
    world.browser.visit('http://%s' % world.SITE_UNDER_TEST)
    element = world.browser.find_by_css('#project_update_0').first
    world.project_update_title = element.find_by_tag('h2').first.text
    world.project_URL = '/'.join(element.find_by_tag('a').first['href'].split('/')[:-3]) + '/'


@before.each_scenario
def navigate_to_project(scenario):
    world.browser.visit(world.project_URL)

@step(u'When I navigate to the project main page')
def when_i_navigate_to_the_project_main_page(step):
    "To get output for each scenario that is starts out navigating to the project main page"
    pass

# Scenario: I can navigate to a project main page
@step(u'Then I am shown the main page of the project')
def then_i_am_shown_the_main_page_of_the_project(step):
    assert world.browser.is_text_present('Summary')
    assert world.browser.is_text_present('Location')
    assert world.browser.is_text_present('Funding')
    assert world.browser.is_text_present('Latest updates')
    assert world.browser.is_text_present('Tools for this page')
    assert world.browser.is_text_present('Project partners')
    assert world.browser.is_text_present('Project in depth')
    assert world.browser.is_text_present('Related to this project')
    assert world.browser.is_text_present('Comments')
    assert world.browser.is_text_present('About Akvo.org')


# Scenario: I can navigate to a project update page
@step(u'When I click on the topmost link in the Latest updates section')
def when_i_click_on_the_topmost_link_in_the_latest_updates_section(step):
    world.browser.click_link_by_text(world.project_update_title)

@step(u'Then I expect to see the page for the selected update')
def then_i_expect_to_see_the_page_for_the_selected_update(step):
    assert world.browser.is_text_present(world.project_update_title)


# Scenario: I can navigate to the project listing page
@step(u'When I click on the See all ► link in the Latest updates section')
def when_i_click_on_the_see_all_link_in_the_latest_updates_section(step):
    world.browser.find_link_by_partial_text(u'See all ')[0].click()

@step(u'Then I am shown the updates listing page of the project')
def then_i_am_shown_the_updates_listing_page_of_the_project(step):
    assert world.browser.is_text_present(world.project_update_title)
    assert world.browser.is_text_present('Project updates')


# Scenario: I can navigate to the project funding details page
@step(u'When I click on the See funding details ►')
def when_i_click_on_the_see_funding_details(step):
    world.browser.click_link_by_partial_text('See funding details ')

@step(u'Then I am shown the funding details page of the project')
def then_i_am_shown_the_funding_details_page_of_the_project(step):
    assert world.browser.is_text_present('Funding details')


# Scenario: I can navigate to a project partners page
@step(u'When I click on the See details ► link in the Project partners section')
def when_i_click_on_the_see_details_link_in_the_project_partners_section(step):
    world.browser.click_link_by_partial_text('See details ')

@step(u'Then I am shown the project partners page for the project')
def then_i_am_shown_the_project_partners_page_for_the_project(step):
    assert world.browser.is_text_present('Project partners')


@step(u'When I click on the See all ► link in the Comments section')
def when_i_click_on_the_see_all_link_in_the_comments_section(step):
    world.browser.find_link_by_partial_text(u'See all ')[1].click()

@step(u'Then I am shown the comments page for the project')
def then_i_am_shown_the_comments_page_for_the_project(step):
    assert world.browser.is_text_present('New comment')
    assert world.browser.is_text_present('All comments')
