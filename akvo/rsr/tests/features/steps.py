# -*- coding: utf-8 -*-
"""
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please
    see < http://www.gnu.org/licenses/agpl.html >.
"""
from __future__ import absolute_import
from lettuce import *
#from akvo.rsr.middleware import PartnerSitesRouterMiddleware

@step(r'When I pass "http://www.akvo.org" I would like "(.*)" back')
def given_a_default_rsr_url(step, normal_url):
    assert 'http://www.akvo.org' == normal_url
