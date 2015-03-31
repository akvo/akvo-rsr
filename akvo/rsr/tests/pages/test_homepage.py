# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from django.contrib.sites.models import Site
from django.test import Client, TestCase


# class notFoundPageTestCase(TestCase):
#     def setUp(self):
#         site, created = Site.objects.get_or_create(domain="localdev.akvo.org",
#                                                   name="localdev")
#         with self.settings(SITE_ID=site.id):
#             c = Client()
#             self.resp = c.get('/does-not-exist')
#
#     def test_access(self):
#         self.assertEqual(self.resp.status_code, 404)


class homePageTestCase(TestCase):

    """Make sure requests to the home page returns as expected."""

    def setUp(self):
        """Make sure we have a site object and config settings."""
        site, created = Site.objects.get_or_create(domain="localdev.akvo.org",
                                                   name="localdev")
        with self.settings(SITE_ID=site.id):
            c = Client()
            self.resp = c.get('/')

    def test_redirect(self):
        """Test that we get a redirect (http 302) on the home page."""
        self.assertEqual(self.resp.status_code, 302)


# class projectsPageTestCase(TestCase):
#     def setUp(self):
#         site, created = Site.object.get_or_create(domain="localdev.akvo.org",
#                                                   name="localdev")
#         with self.settings(SITE_ID=site.id):
#             c = Client()
#             self.resp = c.get('/projects/')
#
#     def test_response(self):
#         self.assertEqual(self.resp.status_code, 200)
