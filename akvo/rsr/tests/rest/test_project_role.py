# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.

# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import json

from django.contrib.auth.models import Group

from akvo.rsr.models import Partnership, ProjectRole
from akvo.rsr.tests.base import BaseTestCase


class ProjectRoleTestCase(BaseTestCase):
    """Test the project role REST endpoint."""

    def setUp(self):
        super(ProjectRoleTestCase, self).setUp()
        self.user = self.create_user("user@akvo.org", "password", is_admin=True)
        self.c.login(username=self.user.username, password="password")

    def test_project_role_get(self):
        project = self.create_project("Project")
        org = self.create_organisation("Organisation")
        self.make_partner(
            project, org, Partnership.IATI_REPORTING_ORGANISATION
        )

        response = self.c.get(
            "/rest/v1/project/{}/project-roles/?format=json".format(project.pk)
        )

        self.assertEqual(response.status_code, 200)
        data = response.data
        self.assertEqual(len(data["organisations"]), 1)
        self.assertEqual(data["roles"], [])

        project.use_project_roles = True
        project.save(update_fields=["use_project_roles"])

        response = self.c.get(
            "/rest/v1/project/{}/project-roles/?format=json".format(project.pk)
        )

        self.assertEqual(response.status_code, 200)
        data = response.data
        self.assertEqual(data["organisations"], [])
        self.assertEqual(data["roles"], [])

        user = self.create_user("test-user@akvo.org", "password")
        group = Group.objects.get(name="Users")
        ProjectRole.objects.create(user=user, project=project, group=group)

        response = self.c.get(
            "/rest/v1/project/{}/project-roles/?format=json".format(project.pk)
        )

        self.assertEqual(response.status_code, 200)
        data = response.data
        self.assertEqual(data["organisations"], [])
        self.assertEqual(len(data["roles"]), 1)
        self.assertEqual(data["roles"][0]["email"], user.email)
        self.assertEqual(data["roles"][0]["role"], group.name)

    def test_project_role_patch(self):
        project = self.create_project("Project")
        email = "test-user@akvo.org"
        group = Group.objects.get(name="Users")
        ProjectRole.objects.create(user=self.user, project=project, group=group)

        user = self.create_user(email, "password")
        response = self.c.patch(
            "/rest/v1/project/{}/project-roles/?format=json".format(
                project.pk
            ),
            data=json.dumps({"roles": [{"email": email, "role": "Users", "name": "John Doe"}]}),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 200)
        data = response.data
        self.assertTrue(data['use_project_roles'])
        self.assertEqual(data['organisations'], [])
        self.assertEqual(len(data['roles']), 1)
        self.assertEqual(data['roles'][0]['email'], user.email)
        self.assertEqual(data['roles'][0]['role'], group.name)

        # New User
        email = "new-user@akvo.org"

        response = self.c.patch(
            "/rest/v1/project/{}/project-roles/?format=json".format(
                project.pk
            ),
            data=json.dumps({"roles": [{"email": email, "role": "Users"}]}),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 400)
        data = response.data
        self.assertIn(email, data["error"])

        # Incorrect Group
        response = self.c.patch(
            "/rest/v1/project/{}/project-roles/?format=json".format(
                project.pk
            ),
            data=json.dumps({"roles": [{"email": email, "role": "BogusRole"}]}),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 400)
        data = response.data
        self.assertIn("BogusRole", data["error"])

        # Switch use_project_roles_flag
        response = self.c.get(
            "/rest/v1/project/{}/project-roles/?format=json".format(project.pk),
            content_type="application/json",
        )
        data = response.data
        self.assertTrue(data['use_project_roles'])

        response = self.c.patch(
            "/rest/v1/project/{}/project-roles/?format=json".format(project.pk),
            data=json.dumps({'use_project_roles': False}),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 200)
        data = response.data
        self.assertFalse(data['use_project_roles'])

    def test_project_invite_user(self):
        project = self.create_project("Project")
        email = "test-user@akvo.org"
        url = "/rest/v1/project/{}/invite-user/?format=json".format(project.pk)
        data = {"email": email, "role": "Users", "name": "John Doe"}

        response = self.c.post(
            url,
            data=json.dumps(data),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 201)
        response_data = response.data
        self.assertEqual(response_data['role']['email'], data['email'])
        self.assertEqual(response_data['role']['role'], data['role'])
        self.assertEqual(response_data['role']['name'], data['name'])
