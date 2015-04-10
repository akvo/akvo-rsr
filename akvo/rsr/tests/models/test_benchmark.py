# -*- coding: utf-8 -*-

"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from django.test import TestCase
from akvo.rsr.models import Benchmarkname


class BenchmarknameTestCase(TestCase):

    """Tests the Benchmarkname model."""

    def setUp(self):
        """Create two benchmarkname objects."""
        # Create test objects
        Benchmarkname.objects.create(name="Benchmarkname1")
        Benchmarkname.objects.create(name="Benchmarkname2", order=2)
        # Store for later use
        self.bn1 = Benchmarkname.objects.get(name="Benchmarkname1")
        self.bn2 = Benchmarkname.objects.get(name="Benchmarkname2")

    def test_name(self):
        """Test the name & the unicode method."""
        self.assertEqual(self.bn1.name, "Benchmarkname1")
        self.assertEqual("{}".format(self.bn2), "Benchmarkname2")

    def test_order(self):
        """Test the order field."""
        self.assertEqual(self.bn1.order, 0)
        self.assertEqual(self.bn2.order, 2)
