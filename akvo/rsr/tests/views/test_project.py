# -*- coding: utf-8 -*-

"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from __future__ import print_function

from unittest import skip

import django_perf_rec
from django.test import TestCase


@skip('Needs Django >= 1.8')
class ProjectPerfomanceTestCase(TestCase):
    """Test performance of project views."""

    def setUp(self):
        return

    def test_project_directory_listing(self):
        with django_perf_rec.record():
            self.client.get('/en/projects/', follow=True)
