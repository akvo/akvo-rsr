# -*- coding: utf-8 -*-
"""
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please
    see < http://www.gnu.org/licenses/agpl.html >.

    Tests need to be executed by Lettuces Django integration:
    python manage.py harvest rsr/features/partner_site_routing.feature
"""
from __future__ import absolute_import
from django.http import HttpRequest, Http404
from lettuce import before, step, world
from akvo.rsr.middleware import PartnerSitesRouterMiddleware


@before.all
def setUp():
    """Make the middleware available to the world"""
    world.mw = PartnerSitesRouterMiddleware()


@step(u'Given I access RSR from the url "([^"]*)" I would like to access \
a normal RSR instance')
def given_a_default_rsr_url(step, normal_url):
    """Tests that the middlweare returns None on a default URL"""
    akvo_request = get_request(normal_url)
    assert world.mw.process_request(akvo_request) == None


@step(u'Given I access RSR from the url "([^"]*)" I would like to access \
a partner sites RSR instance')
def given_a_partner_site_url(step, partner_sites_url):
    """Tests that a partner_site is available for a valid partner site"""
    valid_request = get_request(partner_sites_url)
    world.mw.process_request(valid_request)
    try:
        if valid_request.partner_site:
            assert True
    except AttributeError:
        assert False


@step(u'Given I access RSR from the nonvalid url "([^"]*)" I want to see \
a 404 page')
def given_a_nonvalid_partner_site_url(step, nonvalid_url):
    """Tests that a nonvalid URL generates a 404 Not Found"""
    nonvalid_request = get_request(nonvalid_url)
    try:
        world.mw.process_request(nonvalid_request)
    except Http404:
        assert True
    else:
        assert False


# Help functions
def get_request(url, port='8000'):
    """Returns a Django request object with specified url and port"""
    tmp_request = HttpRequest()
    tmp_request.META['SERVER_NAME'] = url
    tmp_request.META['SERVER_PORT'] = port
    return tmp_request
