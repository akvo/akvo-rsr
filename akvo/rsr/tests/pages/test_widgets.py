# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from akvo.rsr.models import Organisation, Partnership, Project, ProjectUpdate
from akvo.rsr.tests.base import BaseTestCase
from ..utils import contains_template_errors


class PingWidgetsTest(BaseTestCase):

    """Simple ping."""

    def setUp(self):
        """Setup."""
        super(PingWidgetsTest, self).setUp()
        project = Project.objects.create(title="Test Project")
        project.publishingstatus.status = 'published'
        project.publishingstatus.save()
        organisation = Organisation.objects.create(name="Partner1")
        user = self.create_user('foo@example.com')
        Partnership.objects.create(project=project, organisation=organisation)
        ProjectUpdate.objects.create(project=project, title='Project Update', user=user)

    def test_narrow(self):
        """Ping /widgets/project-narrow."""
        p = Project.objects.get(title="Test Project")
        response = self.c.get('/widgets/project-narrow/{}/'.format(p.id))
        self.assertEqual(response.status_code, 200)
        self.assertFalse(contains_template_errors(response.content.decode('utf8')))

    def test_cobranded_banner(self):
        """Ping /widgets/cobranded-banner."""
        p = Project.objects.get(title="Test Project")
        response = self.c.get('/widgets/cobranded-banner/{}/'.format(p.id))
        self.assertEqual(response.status_code, 200)
        self.assertFalse(contains_template_errors(response.content.decode('utf8')))

    def test_project_small(self):
        """Ping /widgets/project-small."""
        p = Project.objects.get(title="Test Project")
        response = self.c.get('/widgets/project-small/{}/'.format(p.id))
        self.assertEqual(response.status_code, 200)
        self.assertFalse(contains_template_errors(response.content.decode('utf8')))

    def test_project_map(self):
        """Ping /widgets/projects/map."""
        o = Organisation.objects.get(name="Partner1")
        response = self.c.get('/widgets/projects/map/?organisation_id={}'.format(o.id))
        self.assertEqual(response.status_code, 200)
        self.assertFalse(contains_template_errors(response.content.decode('utf8')))

    def test_project_list(self):
        """Ping /widgets/projects/list."""
        o = Organisation.objects.get(name="Partner1")
        response = self.c.get('/widgets/projects/list/?organisation_id={}'.format(o.id))
        self.assertEqual(response.status_code, 200)
        self.assertFalse(contains_template_errors(response.content.decode('utf8')))
