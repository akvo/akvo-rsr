# -*- coding: utf-8 -*-
"""
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please
    see < http://www.gnu.org/licenses/agpl.html >.

    Tests need to be executed by Lettuces Django integration:
    python manage.py harvest rsr/features/partner_site_routing.feature
"""

from lettuce import before, step, world
from splinter.browser import Browser


@before.all
def setUp():
    world.browser = Browser()

@step(u'Go to Akvo´s partner sites')
def go_to_akvo_s_partner_sites(step):
    url = 'http://akvo.akvoapp.org'
    world.browser.visit(url)
    if world.browser.is_text_present('Find projects'):
        assert True
    else:
        assert False, 'Did not find projects on the partner site page'

@step(u'Access the link "([^"]*)"')
def access_the_link_group1(step, group1):
    world.browser.find_link_by_text(group1).first.click()
    #world.browser.find_by_css('#main_nav_account').first.click()
    assert True
    #assert world.browser.is_text_present('Sign in with your Akvo account')

@step(u'Fill the field "([^"]*)" with "([^"]*)"')
def fill_the_field_group1_with_group2(step, group1, group2):
    world.browser.fill(group1, group2)
    assert True

@step(u'Click on "([^"]*)"')
def click_on_group1(step, group1):
    world.browser.find_link_by_text('Sign in').first.click()
    assert True
    #assert False, 'This step must be implemented'

@step(u'Then I want to see the text "([^"]*)"')
def then_i_want_to_see_the_text_group1(step, group1):
    assert world.browser.is_text_present(group1)

def partner_site_url():
    return 'akvo.akvoapp.org'
