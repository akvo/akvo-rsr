# -*- coding: utf-8 -*-

from lettuce import step, world, before
from time import sleep, time

from admin.auth import *
from donations.auth import *
from donations.config.mollie import *
from donations.config.paypal import *

@before.each_feature
def log_in_to_paypal_test_environment(feature):
##    '''Figure out the URL to the project'''
##    world.browser.visit('http://%s' % world.SITE_UNDER_TEST)
##    element = world.browser.find_link_by_partial_href('donate').first
##    world.project_URL = '/'.join(element['href'].split('/')[:-2]) + '/'
    '''Log in to paypal to ensure the environment is active'''
    world.browser.visit('https://www.paypal.com/')
    world.browser.fill('login_email', world.PAYPAL_MASTER_USER)
    world.browser.fill('login_password', world.PAYPAL_MASTER_PASSWORD)
    world.browser.find_by_name('submit.x').first.click()
    sleep(10)
    world.browser.visit('https://developer.paypal.com/')

#    world.browser.check('cb_auto_login')
#    world.browser.find_by_name('submit').first.click()

#@before.each_scenario
#def navigate_to_homepage(scenario):
    world.browser.visit('http://%s/rsr/projects/' % world.SITE_UNDER_TEST)

@step(u'When I go to the projects homepage')
def when_i_go_to_the_project_homepage(step):
    world.browser.visit('http://%s/rsr/projects/' % world.SITE_UNDER_TEST)   

@step(u'When I create and publish "([^"]*)" uniquely named "([^"]*)" projects with a budget of "([^"]*)"')
def when_i_create_and_publish_group1_uniquely_named_group2_projects(step, num_of_projects, currency, project_budget):
    count = 0
    while count < int(num_of_projects):
        world.browser.click_link_by_text('Projects')
        world.browser.click_link_by_partial_href('project/add/')
        project_name = 'DonationTestProject' + str(time())
        world.browser.fill('title', project_name)
        world.browser.fill('subtitle', 'This is a project created for donation tests')
        world.browser.driver.find_element_by_xpath('//*[@id="id_status"]/option[2]').click()
        world.browser.driver.find_element_by_xpath('//*[@id="id_categories"]/option[6]').click()
        world.browser.fill('project_plan_summary', 'This is a project created for donation tests')
        world.browser.fill('sustainability', 'This is a project created for donation tests')
        if currency == 'euro':
            world.browser.driver.find_element_by_xpath('//*[@id="id_currency"]/option[2]').click()
        elif currency == 'dollar':
            world.browser.driver.find_element_by_xpath('//*[@id="id_currency"]/option[1]').click()
        world.browser.fill('goals_overview', 'This is a project created for donation tests')
        world.browser.driver.find_element_by_xpath('//*[@id="id_budget_items-0-label"]/option[3]').click()
        world.browser.fill('budget_items-0-amount', project_budget) 
        world.browser.driver.find_element_by_xpath('//*[@id="id_partnerships-0-partner_type"]/option[2]').click()
        world.browser.find_by_name('_save').first.click()  
        world.browser.click_link_by_partial_href('admin/rsr/')
        world.browser.click_link_by_partial_href('/rsr/admin/rsr/publishingstatus/')
        world.browser.click_link_by_text(project_name)
        world.browser.driver.find_element_by_xpath('//*[@id="id_status"]/option[2]').click()
        world.browser.find_by_name('_save').first.click()
        world.browser.click_link_by_partial_href('admin/rsr/')
        count = count+1

@step(u'When I configure Mollie in RSR admin to ensure it is in test mode')
def when_i_configure_mollie_in_rsr_admin_to_ensure_it_is_in_test_mode(step):
    world.browser.click_link_by_text('Mollie/iDEAL gateways')
    world.browser.click_link_by_text('Default')
    world.browser.fill('notification_email', world.MOLLIE_NOTIFICATION_EMAIL)
    world.browser.fill('partner_id', world.MOLLIE_PARTNER_ID)
    world.browser.find_by_name('_save').first.click()

@step(u'When I log out of RSR admin')
def then_i_can_log_out_of_rsr_admin(step):
    world.browser.click_link_by_partial_href('admin/logout/')

@step(u'When I go to project listing page')
def when_i_go_to_project_listing_page(step):
    world.browser.find_link_by_href('href="/rsr/projects/all/"')

@step(u'When I select "([^"]*)" from the select your bank drop down')
def when_i_select_group1_from_the_select_your_bank_drop_down(step, group1):
    world.browser.find_by_xpath('//*[@id="id_bank"]/option[11]').first.click()

@step(u'When I find the first project still to be funded in "([^"]*)"')
def when_i_find_the_first_project_still_to_be_funded_in(step, currency):
    if currency == "dollars":
        currency_symbol = u"$"
    elif currency == "euros":
        currency_symbol = u"€"

    project_table = world.browser.find_by_tag('tbody').first
    project_rows = project_table.find_by_tag('tr')
    count = 0
    while count < len(project_rows):
        if 'Donate' in project_rows[count].text and currency_symbol in project_rows[count].text:
            element = project_rows[count].find_by_css('a').last
            if currency == "dollars":
                world.project_needing_dollars_URL = '/'.join(element['href'].split('/')[:-2]) + '/'
            elif currency == "euros":
                world.project_needing_euro_URL = '/'.join(element['href'].split('/')[:-2]) + '/'
            break
        count = count + 1

    row_text = project_rows[count].text.split('\n')

    last_word = len(row_text)-1

    world.percentage_raised_all_page = int(''.join([c for c in row_text[last_word-1] if c in '1234567890'])) 
    world.total_budget_all_page = int(''.join([c for c in row_text[last_word-2] if c in '1234567890'])) 
    if currency == "dollars":
        world.browser.visit(world.project_needing_dollars_URL)
    elif currency == "euros":
        world.browser.visit(world.project_needing_euro_URL)

@step(u'When I find the first "([^"]*)" project requiring the maximum allowed PayPal donation or less, which has not received any donations')
def when_i_find_the_first_group1_project_requiring_the_maximum_allowed_paypal_donation_or_less_which_has_not_received_any_donations(step, currency):
    if currency == "euro":
        currency_symbol = u"€"
    elif currency == "dollar":
        currency_symbol = u"$"
    project_table = world.browser.find_by_tag('tbody').first
    project_rows = project_table.find_by_tag('tr')
    count = 0
    while count < len(project_rows):
        if 'Donate' in project_rows[count].text and currency_symbol in project_rows[count].text and '0 %' in project_rows[count].text:
            element = project_rows[count].find_by_css('a').last
            world.project_needing_funding_URL = '/'.join(element['href'].split('/')[:-2]) + '/'
            row_text = project_rows[count].text.split('\n')
            last_word = len(row_text)-1
            world.total_budget_all_page = int(''.join([c for c in row_text[last_word-2] if c in '1234567890']))
            if world.total_budget_all_page <= int(world.PAYPAL_MAX_DONATION_AMOUNT):
                world.percentage_raised_all_page = int(''.join([c for c in row_text[last_word-1] if c in '1234567890'])) 
                break
        count = count + 1
    world.browser.visit(world.project_needing_funding_URL)

@step(u'When I note how many "([^"]*)" have been raised and how much is still needed')
def when_i_note_how_many_group1_have_been_raised_and_how_much_is_still_needed(step, currency):
    if currency == "euros":
        currency_symbol = u"€"
    elif currency == "dollars":
        currency_symbol = u"$"
    element = world.browser.find_by_css('.fundingbox-table').first
    raised_text, still_needed_text = element.text.split('\n')
    total_budget_text = world.browser.find_by_css('.fundingbox-table').last.text

    #print "Original text: \n" + total_budget_text
    #raised_text, still_needed_text = element.text.split('\n')
    #print "Captured text: " + raised_text

    world.money_raised = int(raised_text.split(currency_symbol)[-1].strip().replace(",", ""))
    world.money_still_needed = int(still_needed_text.split(currency_symbol)[-1].strip().replace(",", ""))
    world.total_budget = int(total_budget_text.split(currency_symbol)[-1].strip().replace(",", ""))
    #print world.total_budget

@step(u'Then these amounts should agree with those on the project listing page')
def then_these_amounts_should_agree_with_those_on_the_project_listing_page(step):
    assert world.total_budget_all_page == world.total_budget
    assert (world.total_budget - world.money_raised) == world.money_still_needed
    assert world.percentage_raised_all_page == world.money_raised * 100 / world.total_budget

@step(u'When I click on the "([^"]*)" link')
def when_i_click_on_the_group1_link(step, link_name):
    #world.browser.driver.execute_script('window.onbeforeunload = function() {}')
	world.browser.click_link_by_text(link_name)

@step(u'When I click on the link with "([^"]*)" in the URL for the project')
def when_i_click_on_the_link_with_group1_in_the_url_for_the_project(step, link_name):
    world.browser.click_link_by_partial_href(link_name)

@step(u'When I enter "([^"]*)" in the "([^"]*)" field')
def when_i_enter_group1_in_the_group2_field(step, input_value, field_name):
    value = input_value
    if input_value == "the estimated amount including fees to fully fund the project":
        value = world.fully_fund_with_fees_estimate
    elif input_value == "half the estimated amount including fees left to donate":
        value = world.fully_fund_with_fees_estimate / 2
        world.first_donation = value
    elif input_value == "the full estimated amount including fees plus an additional three percent":
        value = int(float(world.fully_fund_with_fees_estimate)*1.03)
    world.browser.fill(field_name, value)

@step(u'When I enter the full budget required for the project in the "([^"]*)" field')
def when_i_enter_the_full_budget_required_for_the_project_in_the_group1_field(step, field_name):
    world.browser.fill(field_name, world.total_budget_all_page)

@step(u'When I click on the donate button')
def when_i_click_on_the_donate_button(step):
    world.browser.find_by_name('submit').first.click()

@step(u'When I enter the PayPal test username in the "([^"]*)" field')
def when_i_enter_the_paypal_test_username_in_the_group1_field(step, field_name):
    world.browser.fill(field_name, world.PAYPAL_TEST_USER)

@step(u'When I enter the PayPal test password in the "([^"]*)" field')
def when_i_enter_the_paypal_test_password_in_the_group1_field(step, field_name):
    world.browser.fill(field_name, world.PAYPAL_TEST_USER_PASSWORD)

@step(u'When I click on the PayPal login button')
def when_i_click_on_the_donate_button(step):
    world.browser.find_by_name('login.x').first.click()

@step(u'When I Click on the Continue button')
def when_i_click_on_the_continue_button_continue_x(step):
    world.browser.find_by_name('continue.x').first.click()

@step(u'When I click on the Back to Akvos test store button')
def when_i_click_on_the_back_to_akvo_s_test_store_button_merchant_return_link(step):
    world.browser.find_by_name('merchant_return_link').first.click()
    alert = world.browser.get_alert()
    alert.accept()
    #world.browser.visit(world.project_URL)

@step(u'When I note the new values of how much has been raised and how much is still needed')
def when_i_note_how_much_has_been_raised_and_how_much_is_still_needed(step):
    element = world.browser.find_by_css('.fundingbox-table').first
    raised_text, still_needed_text = element.text.split('\n')
    world.new_money_raised = int(raised_text.split(u"€")[-1].strip().replace(",", ""))
    world.new_money_still_needed = int(still_needed_text.split(u"€")[-1].strip().replace(",", ""))

@step(u'Then I see that the amount raised has been incremented by "([^"]*)" and the amount left to raise decremented by the same amount')
def then_i_see_that_the_amount_raised_has_been_incremented_by_group1_and_the_amount_left_to_raise_decremented_by_the_same_amount(step, amount):
    assert world.new_money_raised == (world.money_raised + int(amount))
    assert world.new_money_still_needed == (world.money_still_needed - int(amount))

@step(u'Then I see this error message "([^"]*)"')
def then_i_see_this_error_message_group1(step, expected_error):
    element = world.browser.find_by_css('.errorlist').first
    errortext = element.find_by_tag('li').first.text
    assert errortext == expected_error

@step(u'When I enter more funds than are needed in the "([^"]*)" field')
def when_i_enter_more_funds_than_are_needed_in_the_group1_field(step, field_name):
    input_value = (world.money_still_needed * 2)
    world.browser.fill(field_name, input_value)

@step(u'When I enter the remaining amount needed in the "([^"]*)" field')
def when_i_enter_the_remaining_amount_needed_in_the_group1_field(step, field_name):
    input_value = world.money_still_needed
    world.browser.fill(field_name, input_value)

@step(u'Then I see that the amount raised and the amount left to raise are unchanged')
def then_i_see_that_the_amount_raised_and_the_amount_left_to_raise_are_unchanged(step):
    assert world.new_money_raised == world.money_raised
    assert world.new_money_still_needed == world.money_still_needed

@step(u'When I return to the euro project requiring funding')
def when_i_return_to_the_euro_project_requiring_funding(step):
    world.browser.visit(world.project_needing_euro_URL)

@step(u'When I wait "([^"]*)" minutes')
def when_i_wait_group1_minutes(step, minutes):
    wait_seconds = float(minutes) * 60
    sleep(wait_seconds)

@step(u'When I wait "([^"]*)" seconds')
def when_i_wait_group1_minutes(step, seconds):
    sleep(float(seconds))

@step(u'When I take note of the invoice number')
def when_i_take_note_of_the_invoice_number(step):
    world.paypal_invoice_number = world.browser.find_by_css('.donate_details_right').first.text

@step(u'When I log in to RSR admin')
def when_i_log_in_to_rsr_admin(step):
    world.browser.find_link_by_text('Akvo RSR login').first.click()
    world.browser.fill('username', world.AKVO_ADMIN_USER)
    world.browser.fill('password', world.AKVO_ADMIN_PASSWORD)
    world.browser.find_by_xpath('//*[@id="login-form"]/div[4]/input').first.click()

@step(u'Then I see the error message "([^"]*)" each time I leave one of the fields blank')
def then_i_see_the_error_message_group1_each_time_i_leave_one_of_the_fields_blank(step, expected_error):
    world.browser.fill('name', 'Akvo Test')
    world.browser.fill('email', 'test@akvo.org')
    world.browser.fill('email2', 'test@akvo.org')
    world.browser.click_link_by_partial_href('donate_form')
    world.browser.click_link_by_partial_href('donate_form')
    element = world.browser.find_by_css('.errorlist').first
    errortext = element.find_by_tag('li').first.text
    assert errortext == expected_error

    world.browser.fill('amount', '10')
    world.browser.fill('name', '')
    world.browser.fill('email', 'test@akvo.org')
    world.browser.fill('email2', 'test@akvo.org')
    world.browser.click_link_by_partial_href('donate_form')
    element = world.browser.find_by_css('.errorlist').first
    errortext = element.find_by_tag('li').first.text
    assert errortext == expected_error

    world.browser.fill('amount', '10')
    world.browser.fill('name', 'Akvo Test')
    world.browser.fill('email', '')
    world.browser.fill('email2', 'test@akvo.org')
    world.browser.click_link_by_partial_href('donate_form')
    element = world.browser.find_by_css('.errorlist').first
    errortext = element.find_by_tag('li').first.text
    assert errortext == expected_error

    world.browser.fill('amount', '10')
    world.browser.fill('name', 'Akvo Test')
    world.browser.fill('email', 'test@akvo.org')
    world.browser.fill('email2', '')
    world.browser.click_link_by_partial_href('donate_form')
    element = world.browser.find_by_css('.errorlist').first
    errortext = element.find_by_tag('li').first.text
    assert errortext == expected_error

@step(u'When I enter the information to make an anonymous donation')
def when_i_enter_the_information_to_make_an_anonymous_donation(step):
    world.browser.select('country_code', 'IE')
    world.browser.fill('first_name', 'Akvo')
    world.browser.fill('last_name', 'Test')
    world.browser.fill('expdate_month', world.PAYPAL_TEST_VISA_EXP_MONTH)
    world.browser.fill('expdate_year', world.PAYPAL_TEST_VISA_EXP_YEAR)
    world.browser.fill('address1', '180 Akvo central')
    world.browser.fill('city', 'Amsterdam')


@step(u'Then I see that the invoice is present and is in the "([^"]*)" state')
def then_i_see_that_the_invoice_is_present_and_is_in_the_group1_state(step, group1):
    world.browser.click_link_by_text('Invoices')
    world.browser.find_link_by_text(world.paypal_invoice_number).first


@step(u'When I find the first project in € that has not yet received any donations')
def when_i_find_the_first_project_in_that_has_not_yet_received_any_donations(step):
    project_table = world.browser.find_by_tag('tbody').first
    project_rows = project_table.find_by_tag('tr')
    count = 0
    while count < len(project_rows):
        if 'Donate' in project_rows[count].text and u"€" in project_rows[count].text:
            element = project_rows[count].find_by_css('a').last

            row_text = project_rows[count].text.split('\n')

            last_word = len(row_text)-1

            percentage_raised = int(''.join([c for c in row_text[last_word-1] if c in '1234567890']))
            if percentage_raised == 0:

                world.percentage_raised_all_page = percentage_raised 
                world.total_budget_all_page = int(''.join([c for c in row_text[last_word-2] if c in '1234567890'])) 
                world.project_needing_euro_URL = '/'.join(element['href'].split('/')[:-2]) + '/'
                print "project with 0 donations" + world.project_needing_euro_URL
            break
        count = count + 1


    world.browser.visit(world.project_needing_euro_URL)


@step(u'Then I see that the project appears as fully funded')
def then_i_see_that_the_project_appears_as_fully_funded(step):
    element = world.browser.find_by_css('.green').first
    assert element.text == 'Fully funded'

@step(u'When I enter half the amount left to donate in the "([^"]*)" field')
def when_i_enter_half_the_amount_left_to_donate_in_the_group1_field(step, field_name):
    input_value = (world.money_still_needed / 2)
    world.browser.fill(field_name, input_value)

@step(u'Then I see the half of the project funds listed against "([^"]*)" in the donors list')
def then_i_see_the_half_of_the_project_funds_listed_against_group1_in_the_donors_list(step, donor_name):
    donation_amount = (world.money_still_needed / 2)

    element = world.browser.find_by_css('.project_budget_table').first
    print element.text

    print "the amount I expect to see would be"
    print donation_amount
    print "This needs to be completed - does the donor only appear after the donation is confirmed?"

@step(u'Then I see that the invoices are present and is in the "([^"]*)" state')
def then_i_see_that_the_invoices_are_present_and_is_in_the_group1_state(step, group1):
    assert False, 'This step must be implemented'

@step(u'Then I see "([^"]*)" listed against "([^"]*)" in the donors list')
def then_i_see_group1_listed_against_group2_in_the_donors_list(step, donation, donor_name):

    donations_table = world.browser.find_by_css('.project_budget_table').last
    donation_found = 0
#    print donations_table.text
    donation_rows = donations_table.find_by_tag('tr')
    count = 0
    if donation == "the estimated project funds required including PayPal fees":
        donation = world.fully_fund_with_fees_estimate
    elif donation == "the first donation amount":
        donation = world.first_donation
    while count < len(donation_rows):
#        print "the row under scrutiny is"
#        print donation_rows[count].text
        if donor_name in donation_rows[count].text and str(donation) in donation_rows[count].text:
            donation_found = 1 
        count = count + 1
#    print "the amount I expect to see would be"
#    print donation
#    print "against"
#    print donor_name
#    print "This needs to be completed - does the donor only appear after the donation is confirmed?"
    if donation_found == 0:
        assert False, 'The donation does not appear in the list of donations'

#@step(u'When I note how many dollars have been raised and how much is still needed')
#def when_i_note_how_many_group1_have_been_raised_and_how_much_is_still_needed(step):
#    element = world.browser.find_by_css('.fundingbox-table').first
#    raised_text, still_needed_text = element.text.split('\n')
#    total_budget_text = world.browser.find_by_css('.fundingbox-table').last.text

#    print "Original text: \n" + total_budget_text
#    raised_text, still_needed_text = element.text.split('\n')
#    print "Captured text: " + raised_text

#    world.money_raised = int(raised_text.split(u"$")[-1].strip().replace(",", ""))
#    world.money_still_needed = int(still_needed_text.split(u"$")[-1].strip().replace(",", ""))
#    world.total_budget = int(total_budget_text.split(u"$")[-1].strip().replace(",", ""))

@step(u'When I take note of the amount that is suggested is needed to fully fund the project including fees')
def when_i_take_not_of_the_amount_that_is_suggested_is_needed_to_fully_fund_the_project_including_paypal_fees(step):
    grey_elements = world.browser.find_by_css('.grey')
    last_letter = len(grey_elements.first.text)-1
    world.fully_fund_with_fees_estimate = int(''.join([c for c in grey_elements.first.text if c in '1234567890']))


    

