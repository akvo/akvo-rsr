# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.

# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import json

from django.contrib.auth.models import Group
from django.test import override_settings
from unittest.mock import patch

from akvo.rsr.models import Partnership, ProjectRole
from akvo.rsr.tests.base import BaseTestCase
from akvo import utils


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

    @patch.object(utils, 'rsr_send_mail')
    def test_project_invite_new_user(self, mock_send):
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
        mock_send.assert_called_once()

    @patch.object(utils, 'rsr_send_mail')
    def test_project_invite_existing_user(self, mock_send):
        project = self.create_project("Project")
        email = "test-user@akvo.org"
        user = self.create_user(email)  # Create the user, before an invite is sent using the API
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
        self.assertEqual(response_data['role']['name'], user.get_full_name())
        mock_send.assert_not_called()


class MEManagerEditEnumeratorAccessTestCase(BaseTestCase):
    """Test M&E role can assign Enumerator to a project feature."""

    ME_MANAGERS_ROLE = 'M&E Managers'
    ENUMRATORS_ROLE = 'Enumerators'

    def create_org_user(self, email, password, org, group_name='Users'):
        user = self.create_user(email, password)
        self.make_employment(user, org, group_name)
        return user

    def create_test_project(self, title, reporting_org):
        project = self.create_project(title)
        project.use_project_roles = True
        project.save(update_fields=['use_project_roles'])
        self.make_partner(
            project, reporting_org, Partnership.IATI_REPORTING_ORGANISATION
        )
        return project

    def make_project_role(self, project, user, group_name='Users'):
        group = Group.objects.get(name=group_name)
        ProjectRole.objects.create(user=user, project=project, group=group)

    def test_me_project_role_of_configured_org_project_should_be_able_to_get_project_roles(self):
        org = self.create_organisation('Acme')
        user = self.create_org_user('test@acme.org', 'password', org)
        project = self.create_test_project('Project #1', org)
        self.make_project_role(project, user, self.ME_MANAGERS_ROLE)

        self.c.login(username=user.email, password='password')
        with override_settings(ME_MANAGER_EDIT_ENUMERATOR_ACCESS_ORGS=[org.id]):
            response = self.c.get(
                "/rest/v1/project/{}/project-roles/?format=json".format(project.pk)
            )

        self.assertEqual(response.status_code, 200)
        data = response.data
        self.assertEqual(data["organisations"], [])
        self.assertEqual(len(data["roles"]), 1)
        self.assertEqual(data["roles"][0]["email"], user.email)
        self.assertEqual(data["roles"][0]["role"], self.ME_MANAGERS_ROLE)

    def test_me_project_role_of_non_configured_org_project_should_not_be_able_to_get_project_roles(self):
        org = self.create_organisation('Acme')
        user = self.create_org_user('test@acme.org', 'password', org)
        project = self.create_test_project('Project #1', org)
        self.make_project_role(project, user, self.ME_MANAGERS_ROLE)

        self.c.login(username=user.email, password='password')
        with override_settings(ME_MANAGER_EDIT_ENUMERATOR_ACCESS_ORGS=[]):
            response = self.c.get(
                "/rest/v1/project/{}/project-roles/?format=json".format(project.pk)
            )

        self.assertEqual(response.status_code, 403)

    def test_me_project_role_should_be_able_to_add_new_enumerator(self):
        org = self.create_organisation('Acme')
        me_manager = self.create_org_user('test@acme.org', 'password', org)
        project = self.create_test_project('Project #1', org)
        self.make_project_role(project, me_manager, self.ME_MANAGERS_ROLE)
        new_user = self.create_user('new-user@example.org', "password")

        self.c.login(username=me_manager.email, password='password')
        with override_settings(ME_MANAGER_EDIT_ENUMERATOR_ACCESS_ORGS=[org.id]):
            response = self.c.patch(
                "/rest/v1/project/{}/project-roles/?format=json".format(project.pk),
                data=json.dumps({"roles": [
                    {"email": me_manager.email, "role": self.ME_MANAGERS_ROLE},
                    {"email": new_user.email, "role": self.ENUMRATORS_ROLE},
                ]}),
                content_type="application/json",
            )

        self.assertEqual(response.status_code, 200)
        data = response.data
        self.assertEqual(len(data['roles']), 2)
        new_role = [r for r in data['roles'] if r['email'] == new_user.email][0]
        self.assertEqual(new_role['role'], self.ENUMRATORS_ROLE)

    def test_me_project_role_adding_non_enumerator_role_should_be_ignored(self):
        org = self.create_organisation('Acme')
        me_manager = self.create_org_user('test@acme.org', 'password', org)
        project = self.create_test_project('Project #1', org)
        self.make_project_role(project, me_manager, self.ME_MANAGERS_ROLE)
        new_user = self.create_user('new-user@example.org', "password")

        self.c.login(username=me_manager.email, password='password')
        with override_settings(ME_MANAGER_EDIT_ENUMERATOR_ACCESS_ORGS=[org.id]):
            response = self.c.patch(
                "/rest/v1/project/{}/project-roles/?format=json".format(project.pk),
                data=json.dumps({"roles": [
                    {"email": me_manager.email, "role": self.ME_MANAGERS_ROLE},
                    {"email": new_user.email, "role": self.ME_MANAGERS_ROLE},
                ]}),
                content_type="application/json",
            )

        self.assertEqual(response.status_code, 200)
        data = response.data
        self.assertEqual(len(data['roles']), 1)
        self.assertEqual(data["roles"][0]["email"], me_manager.email)
        self.assertEqual(data["roles"][0]["role"], self.ME_MANAGERS_ROLE)

    def test_me_manager_role_should_be_able_to_remove_enumerator_role(self):
        org = self.create_organisation('Acme')
        me_manager = self.create_org_user('test@acme.org', 'password', org)
        project = self.create_test_project('Project #1', org)
        self.make_project_role(project, me_manager, self.ME_MANAGERS_ROLE)
        enumerator = self.create_user('new-user@example.org', "password")
        self.make_project_role(project, enumerator, self.ENUMRATORS_ROLE)

        self.c.login(username=me_manager.email, password='password')
        with override_settings(ME_MANAGER_EDIT_ENUMERATOR_ACCESS_ORGS=[org.id]):
            response = self.c.patch(
                "/rest/v1/project/{}/project-roles/?format=json".format(project.pk),
                data=json.dumps({"roles": [
                    {"email": me_manager.email, "role": self.ME_MANAGERS_ROLE},
                ]}),
                content_type="application/json",
            )

        self.assertEqual(response.status_code, 200)
        data = response.data
        self.assertEqual(len(data['roles']), 1)
        self.assertEqual(data["roles"][0]["email"], me_manager.email)
        self.assertEqual(data["roles"][0]["role"], self.ME_MANAGERS_ROLE)

    def test_me_project_role_removing_no_enumerator_role_should_be_ignored(self):
        org = self.create_organisation('Acme')
        me_manager = self.create_org_user('test@acme.org', 'password', org)
        project = self.create_test_project('Project #1', org)
        self.make_project_role(project, me_manager, self.ME_MANAGERS_ROLE)
        enumerator = self.create_user('new-user@example.org', "password")
        self.make_project_role(project, enumerator, self.ME_MANAGERS_ROLE)

        self.c.login(username=me_manager.email, password='password')
        with override_settings(ME_MANAGER_EDIT_ENUMERATOR_ACCESS_ORGS=[org.id]):
            response = self.c.patch(
                "/rest/v1/project/{}/project-roles/?format=json".format(project.pk),
                data=json.dumps({"roles": [
                    {"email": me_manager.email, "role": self.ME_MANAGERS_ROLE},
                ]}),
                content_type="application/json",
            )

        self.assertEqual(response.status_code, 200)
        data = response.data
        self.assertEqual(len(data['roles']), 2)

    @patch.object(utils, 'rsr_send_mail')
    def test_me_project_role_should_be_able_to_invite_new_enumerator(self, mock_send):
        org = self.create_organisation('Acme')
        me_manager = self.create_org_user('test@acme.org', 'password', org)
        project = self.create_test_project('Project #1', org)
        self.make_project_role(project, me_manager, self.ME_MANAGERS_ROLE)
        enumerator_email = "test@example.org"
        enumerator_name = "John Doe"

        self.c.login(username=me_manager.email, password='password')
        with override_settings(ME_MANAGER_EDIT_ENUMERATOR_ACCESS_ORGS=[org.id]):
            response = self.c.post(
                "/rest/v1/project/{}/invite-user/?format=json".format(project.pk),
                data=json.dumps({"email": enumerator_email, "role": self.ENUMRATORS_ROLE, "name": enumerator_name}),
                content_type="application/json",
            )

        self.assertEqual(response.status_code, 201)
        response_data = response.data
        self.assertEqual(response_data['role']['email'], enumerator_email)
        self.assertEqual(response_data['role']['role'], self.ENUMRATORS_ROLE)
        self.assertEqual(response_data['role']['name'], enumerator_name)
        mock_send.assert_called_once()

    def test_me_project_role_should_not_be_able_to_invite_non_enumerator_role(self):
        org = self.create_organisation('Acme')
        me_manager = self.create_org_user('test@acme.org', 'password', org)
        project = self.create_test_project('Project #1', org)
        self.make_project_role(project, me_manager, self.ME_MANAGERS_ROLE)
        enumerator_email = "test@example.org"
        enumerator_name = "John Doe"

        self.c.login(username=me_manager.email, password='password')
        with override_settings(ME_MANAGER_EDIT_ENUMERATOR_ACCESS_ORGS=[org.id]):
            response = self.c.post(
                "/rest/v1/project/{}/invite-user/?format=json".format(project.pk),
                data=json.dumps({"email": enumerator_email, "role": self.ME_MANAGERS_ROLE, "name": enumerator_name}),
                content_type="application/json",
            )

        self.assertEqual(response.status_code, 403)
