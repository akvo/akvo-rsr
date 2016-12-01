from behave import given, when, then
from django.core import management

from akvo.rsr.models import Organisation

ORG_NAME = 'Akvo'
ADMIN_USER = 'admin@localdev.akvo.org'
PASSWORD = 'password'


@given(u'that test data is loaded')
def test_data_loaded(context):
    # Load some initial fixture data
    # FIXME: This is slow!
    management.call_command('loaddata', 'test_data.json', verbosity=3, interactive=False)
    # FIXME: Ideally, the dump data should already have this.
    organisation = Organisation.objects.get(name=ORG_NAME)
    organisation.can_create_projects = True
    organisation.save()


@given(u'I am a logged in admin')
def admin_logged_in(context):
    browser = context.browser
    url = '{}/{}'.format(context.config.server_url, 'en/sign_in/')
    browser.visit(url)
    browser.fill('username', ADMIN_USER)
    browser.fill('password', PASSWORD)
    browser.find_by_xpath('//form/div/button').click()


@when(u'I click create new project')
def create_project(context):
    browser = context.browser
    url = '{}/{}'.format(context.config.server_url, 'en/myrsr/projects/')
    browser.visit(url)
    browser.find_by_id('createProject').click()

@then(u'Project editor opens')
def is_editor_open(context):
    browser = context.browser
    assert browser.is_text_present(
        'Project Editor',
        # Wait for the project editor page to open up.  It can take a while to
        # create the new project and the project editor to open up.
        wait_time=100
    )
    assert browser.is_text_present(
        'Your RSR project page shows project information', wait_time=100
    )
