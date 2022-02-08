# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from io import TextIOBase
from unittest.mock import Mock
from django.test import SimpleTestCase
from akvo.rsr.management.utils import VerbosityAwareWriter


class VerbosityAwareWriterTestCase(SimpleTestCase):

    def setUp(self):
        super().setUp()
        self.output = Mock(spec=TextIOBase)
        self.verbosity = 1
        self.writer = VerbosityAwareWriter(self.output, self.verbosity)

    def test_no_write(self):
        self.writer.write('test', level=2)
        self.output.write.assert_not_called()

    def test_write(self):
        self.writer.write('test', level=0)
        self.output.write.assert_called()
