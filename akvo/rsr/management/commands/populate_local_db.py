# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import sys

from django.conf import settings
from django.core.management.base import BaseCommand
from akvo.rsr.models import Organisation, Partnership

from akvo.rsr.tests.base import BaseTestCase


class Command(BaseCommand):
    help = 'Script for populating DB for local development purpose'

    def handle(self, *args, **options):
        if not settings.DEBUG or not Organisation.objects.count() == 0:
            print('DB can be only populated in the DEBUG mode, and when DB is empty')
            sys.exit()
        user = BaseTestCase.create_user(
            email='local@akvo.org', password='password', is_admin=True, is_superuser=True)
        org = BaseTestCase.create_organisation('Akvo Foundation')
        project = BaseTestCase.create_project('Akvo RSR Test')
        self.add_fake_project_image(project)
        BaseTestCase.make_org_admin(user, org)
        BaseTestCase.make_partner(project, org, role=Partnership.IATI_REPORTING_ORGANISATION)

    @staticmethod
    def add_fake_project_image(project):
        project.current_image = 'foo.png'
        project.save()
