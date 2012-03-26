# -*- coding: utf-8 -*-

from lettuce import after, before, step, world
from splinter.browser import Browser


@step('Go to home page')
def go_to_home_page(step):
    world.browser.visit('http://%s' % world.SITE_UNDER_TEST)

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


# Scenario: Home page displays recent project updates
@step('Then I click on the first project update')
def then_i_click_on_the_first_project_update(step):
    element = world.browser.find_by_css('#project_update_0').first
    title = world.project_update_title = element.find_by_tag('h2').first.text
    element.find_by_css('div div a').first.click()

@step('Then I expect to see the page for the selected update')
def then_i_expect_to_see_details_for_the_selected_update(step):
    assert world.browser.is_text_present(world.project_update_title)

@step('Then I expect to see the page for the selected update')
def then_i_expect_to_see_details_for_the_selected_update(step):
    assert world.browser.is_text_present(world.project_update_title)


# Scenario: Home page displays recent blog posts
@step(u'Then I click on the first blog post')
def then_i_click_on_the_first_blog_post(step):
    blog_block = world.browser.find_by_css('.span-12 .last').last
    blog_link = blog_block.find_by_css('a').first
    blog_title = world.blog_post_title = blog_block.find_by_css('h2').first.text
    blog_link.click()

@step(u'Then I expect to see details for the selected post')
def then_i_expect_to_see_details_for_the_selected_post(step):
    assert world.browser.is_text_present(world.blog_post_title)


# Scenario: Home page displays accordion with focus areas
@step(u'Then I click on the last focus area link')
def then_i_click_on_the_last_focus_area_link(step):
    accordion_block = world.browser.find_by_id('index-accordion').first
    accordion_link = accordion_block.find_by_css('a').last
    accordion_title_anchor = accordion_block.find_by_css('h3').last.find_by_css('a').first
    accordion_title = world.accordion_title = accordion_title_anchor.text
    accordion_title_anchor.click()
    accordion_link.click()

@step(u'Then I expect to see a list of projects for the focus area')
def then_i_expect_to_see_a_list_of_projects_for_the_focus_area(step):
    assert world.browser.is_text_present(world.accordion_title)
