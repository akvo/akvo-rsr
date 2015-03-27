# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""

from django.contrib.sites.models import Site
from django.test import Client, TestCase
from akvo.rsr.models import Benchmarkname


class BenchmarknameTestCase(TestCase):
    def setUp(self):
        # Create test objects
        Benchmarkname.objects.create(name="Benchmarkname1")
        Benchmarkname.objects.create(name="Benchmarkname2", order=2)
        # Store for later use
        self.bn1 = Benchmarkname.objects.get(name="Benchmarkname1")
        self.bn2 = Benchmarkname.objects.get(name="Benchmarkname2")

    def test_name(self):
        self.assertEqual(self.bn1.name, "Benchmarkname1")
        self.assertEqual("{}".format(self.bn2), "Benchmarkname2")

    def test_order(self):
        self.assertEqual(self.bn1.order, 0)
        self.assertEqual(self.bn2.order, 2)


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
    def setUp(self):
        site, created = Site.objects.get_or_create(domain="localdev.akvo.org",
                                                  name="localdev")
        with self.settings(SITE_ID=site.id):
            c = Client()
            self.resp = c.get('/')

    def test_redirect(self):
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
