# -*- coding: utf-8 -*-

"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

import json

from akvo.rsr.models import IndicatorDimensionName, IndicatorDimensionValue
from akvo.rsr.tests.base import BaseTestCase


class RestIndicatorDimensionTestCase(BaseTestCase):
    """Tests the indicator dimension REST endpoints."""

    def setUp(self):
        super(RestIndicatorDimensionTestCase, self).setUp()
        self.user = self.create_user("user@akvo.org", "password", is_superuser=True)
        self.project = self.create_project("Test project")
        self.c.login(username=self.user.username, password="password")

    def test_indicator_dimension_name_has_nested_dimension_values(self):
        dimension_name = IndicatorDimensionName.objects.create(project=self.project, name="Gender")
        dimension_value = IndicatorDimensionValue.objects.create(name=dimension_name, value="Women")

        response = self.c.get("/rest/v1/dimension_name/?format=json")

        content = json.loads(response.content)
        self.assertEqual(content["results"][0]["name"], dimension_name.name)
        self.assertEqual(content["results"][0]["values"][0]["value"], dimension_value.value)

    def test_create_new_indicator_name_with_nested_values(self):
        data = {
            "name": "Gender",
            "project": self.project.id,
            "values": [
                {"value": "Women"}
            ]
        }

        response = self.c.post("/rest/v1/dimension_name/?format=json",
                               data=json.dumps(data),
                               content_type="application/json")

        self.assertEqual(response.status_code, 201)
        content = json.loads(response.content)
        self.assertEqual(content["name"], data["name"])
        self.assertEqual(content["values"][0]["value"], data["values"][0]["value"])
