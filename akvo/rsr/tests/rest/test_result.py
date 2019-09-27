# -*- coding: utf-8 -*-

"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

import json

from akvo.codelists.models import ResultType, Version
from akvo.rsr.tests.base import BaseTestCase


class RestResultTestCase(BaseTestCase):
    """Test the result REST endpoints."""

    def setUp(self):
        super(RestResultTestCase, self).setUp()
        iati_version, _ = Version.objects.get_or_create(code='2.02')
        ResultType.objects.get_or_create(code="1", name="Output", version=iati_version)

    def test_result_post(self):
        user = self.create_user("user@akvo.org", "password", is_admin=True)
        project = self.create_project("Test project")
        self.c.login(username=user.username, password="password")

        response = self.c.post("/rest/v1/results_framework/?format=json",
                               data=json.dumps({"type": 1, "project": project.id}),
                               content_type="application/json")

        self.assertEqual(response.status_code, 201)
