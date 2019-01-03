# -*- coding: utf-8 -*-

"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from django.test import TestCase

import akvo.rest.serializers as S


class SerializersTestCase(TestCase):
    """Tests to verify that serializers have been setup correctly."""

    @classmethod
    def setUpClass(cls):
        pass

    @classmethod
    def tearDownClass(cls):
        pass

    def test_all_serializers_have_fields(self):
        for serializer_name in S.__all__:
            serializer = getattr(S, serializer_name)
            fields = getattr(serializer.Meta, 'fields', None)
            exclude = getattr(serializer.Meta, 'exclude', None)
            self.assertIsNotNone(
                fields or exclude,
                msg='{} does not have fields or exclude specified'.format(serializer_name)
            )
            self.assertIsNone(
                fields and exclude,
                msg='{} has both fields and exclude set'.format(serializer_name)
            )
