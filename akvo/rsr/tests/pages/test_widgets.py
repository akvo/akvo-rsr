# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from django.conf import settings
from django.test import Client, TestCase
from akvo.rsr.models import Project, Organisation


class PingWidgetsTest(TestCase):

    """Simple ping."""

    def setUp(self):
        """Setup."""
        self.c = Client(HTTP_HOST=settings.RSR_DOMAIN)
        Project.objects.create(title="Test Project")
        Organisation.objects.create(name="Partner1")

    def test_narrow(self):
        """Ping /widgets/project-narrow."""
        p = Project.objects.get(title="Test Project")
        response = self.c.get('/widgets/project-narrow/{}/'.format(p.id))
        self.assertEqual(response.status_code, 200)

    def test_cobranded_banner(self):
        """Ping /widgets/cobranded-banner."""
        p = Project.objects.get(title="Test Project")
        response = self.c.get('/widgets/cobranded-banner/{}/'.format(p.id))
        self.assertEqual(response.status_code, 200)

    def test_project_small(self):
        """Ping /widgets/project-small."""
        p = Project.objects.get(title="Test Project")
        response = self.c.get('/widgets/project-small/{}/'.format(p.id))
        self.assertEqual(response.status_code, 200)

    def test_project_map(self):
        """Ping /widgets/projects/map."""
        o = Organisation.objects.get(name="Partner1")
        response = self.c.get('/widgets/projects/map/?organisation_id={}'.format(o.id))
        self.assertEqual(response.status_code, 200)

    def test_project_list(self):
        """Ping /widgets/projects/list."""
        o = Organisation.objects.get(name="Partner1")
        response = self.c.get('/widgets/projects/list/?organisation_id={}'.format(o.id))
        self.assertEqual(response.status_code, 200)
