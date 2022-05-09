from rest_framework.reverse import reverse

from akvo.codelists.store.codelists_v203 import SECTOR_CATEGORY
from akvo.rsr.tests.base import BaseTestCase


class TestSectorCodes(BaseTestCase):
    def test_GET(self):
        result = self.c.get("%s?format=json" % reverse("sector_code_list"))
        data = result.data
        self.assertIsInstance(data, list)
        self.assertEqual(len(data), len(SECTOR_CATEGORY) - 1)

        item = data[0]
        self.assertEqual({"id", "name"}, set(item.keys()))
