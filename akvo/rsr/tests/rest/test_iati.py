# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.

# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import json

from akvo.rsr.models import IatiExport, Partnership
from akvo.rsr.tests.base import BaseTestCase


class IatiTestCase(BaseTestCase):

    def setUp(self):
        super(IatiTestCase, self).setUp()
        email = password = 'foo@example.com'
        self.user = self.create_user(email, password, is_superuser=True)
        self.c.login(username=email, password=password)
        self.project = self.create_project('Test Project')
        self.org = self.create_organisation('Org')
        self.make_partner(self.project, self.org, Partnership.IATI_REPORTING_ORGANISATION)

    def test_iati_export(self):
        url = '/rest/v1/iati_export/?format=json'
        data = {
            "reporting_organisation": self.org.id,
            "user": self.user.id,
            "version": "2",
            "projects": [self.project.id]
        }

        response = self.c.post(url, data)

        self.assertEqual(response.status_code, 201)
        for key in data:
            self.assertEqual(data[key], response.data[key])

    def test_list_iati_exports_by_reporting_org(self):
        # Create an export
        self.test_iati_export()

        url = '/rest/v1/iati_export/?format=json&reporting_organisation={}'.format(self.org)
        response = self.c.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['count'], 1)
        result = response.data['results'][0]
        self.assertEqual(result['reporting_organisation'], self.org.pk)
        self.assertEqual(result['projects'], [self.project.pk])

    def test_set_iati_export_as_latest(self):
        # Create a couple of iati exports
        export_1 = IatiExport.objects.create(
            reporting_organisation=self.org, user=self.user, status=IatiExport.STATUS_COMPLETED)
        export_2 = IatiExport.objects.create(
            reporting_organisation=self.org, user=self.user, status=IatiExport.STATUS_COMPLETED)
        self.assertFalse(export_1.is_latest)
        self.assertTrue(export_2.is_latest)

        url = f'/rest/v1/iati_export/{export_1.id}/?format=json'
        data = {"is_latest": True}

        response = self.c.patch(url, data=json.dumps(data), content_type='application/json')

        self.assertTrue(response.data['is_latest'])
        export_1.refresh_from_db()
        export_2.refresh_from_db()
        self.assertTrue(export_1.is_latest)
        self.assertFalse(export_2.is_latest)
