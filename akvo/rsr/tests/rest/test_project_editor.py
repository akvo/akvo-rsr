# -*- coding: utf-8 -*-

"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from akvo.rsr.models import Employment, Indicator, Organisation, Partnership, Project, Result, User
from akvo.utils import check_auth_groups

from django.conf import settings
from django.contrib.auth.models import Group
from django.test import TestCase, Client

from akvo.rest.views.project_editor import add_error


class BaseReorderTestCase(object):

    def setUp(self):
        # Create necessary groups
        check_auth_groups(settings.REQUIRED_AUTH_GROUPS)

        # Create project
        self.project = Project.objects.create(title="Test Project")

        # Create reporting organisation
        self.reporting_org = Organisation.objects.create(
            name="REST reporting",
            long_name="REST reporting org",
            new_organisation_type=22
        )

        # Create partnership
        Partnership.objects.create(
            project=self.project,
            organisation=self.reporting_org,
            iati_organisation_role=Partnership.IATI_REPORTING_ORGANISATION,
        )

        # Create active user
        self.username = 'username'
        self.password = 'password'
        self.user = User.objects.create_user(
            username=self.username,
            email="user.rest@test.akvo.org",
            password=self.password,
        )
        self.user.is_active = True
        self.user.save()

        # Create employment
        Employment.objects.create(
            user=self.user,
            organisation=self.reporting_org,
            group=Group.objects.get(name='Admins'),
            is_approved=True,
        )

        self.c = Client(HTTP_HOST=settings.RSR_DOMAIN)

    def tearDown(self):
        Project.objects.all().delete()
        User.objects.all().delete()
        Organisation.objects.all().delete()

    def test_should_reorder_item_up(self):
        """
        Checks the regular REST project endpoint.
        """

        # Given
        items = [self.create_item() for _ in range(5)]
        item_id = items[1].id
        url = '/rest/v1/project/{}/reorder_items/'.format(self.project.id)
        data = {
            'item_type': self.item_type,
            'item_id': item_id,
            'item_direction': 'up',
            'format': 'json'
        }
        self.c.login(username=self.username, password=self.password)

        # When
        response = self.c.post(url, data=data, follow=True)

        # Then
        items = self.get_items()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(items[0].order, 1)
        self.assertEqual(items[1].order, 0)
        self.assertEqual(items[2].order, 2)
        self.assertEqual(items[3].order, 3)
        self.assertEqual(items[4].order, 4)

    def test_should_not_reorder_first_item_up(self):
        # Given
        items = [self.create_item() for _ in range(5)]
        item_id = items[0].id
        url = '/rest/v1/project/{}/reorder_items/'.format(self.project.id)
        data = {
            'item_type': self.item_type,
            'item_id': item_id,
            'item_direction': 'up',
            'format': 'json'
        }
        self.c.login(username=self.username, password=self.password)

        # When
        response = self.c.post(url, data=data, follow=True)

        # Then
        items = self.get_items()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(items[0].order, 0)
        self.assertEqual(items[1].order, 1)
        self.assertEqual(items[2].order, 2)
        self.assertEqual(items[3].order, 3)
        self.assertEqual(items[4].order, 4)

    def test_should_reorder_item_down(self):
        # Given
        items = [self.create_item() for _ in range(5)]
        item_id = items[0].id
        url = '/rest/v1/project/{}/reorder_items/'.format(self.project.id)
        data = {
            'item_type': self.item_type,
            'item_id': item_id,
            'item_direction': 'down',
            'format': 'json'
        }
        self.c.login(username=self.username, password=self.password)

        # When
        response = self.c.post(url, data=data, follow=True)

        # Then
        items = self.get_items()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(items[0].order, 1)
        self.assertEqual(items[1].order, 0)
        self.assertEqual(items[2].order, 2)
        self.assertEqual(items[3].order, 3)
        self.assertEqual(items[4].order, 4)

    def test_should_not_reorder_last_item_down(self):
        # Given
        items = [self.create_item() for _ in range(5)]
        item_id = items[4].id
        url = '/rest/v1/project/{}/reorder_items/'.format(self.project.id)
        data = {
            'item_type': self.item_type,
            'item_id': item_id,
            'item_direction': 'down',
            'format': 'json'
        }
        self.c.login(username=self.username, password=self.password)

        # When
        response = self.c.post(url, data=data, follow=True)

        # Then
        items = self.get_items()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(items[0].order, 0)
        self.assertEqual(items[1].order, 1)
        self.assertEqual(items[2].order, 2)
        self.assertEqual(items[3].order, 3)
        self.assertEqual(items[4].order, 4)

    def test_should_handle_deleted_item(self):
        # Given
        self.c.login(username=self.username, password=self.password)
        items = [self.create_item() for _ in range(5)]
        item_id = items[2].id
        url = '/rest/v1/project/{}/reorder_items/'.format(self.project.id)
        data = {
            'item_type': self.item_type,
            'item_id': item_id,
            'item_direction': 'down',
            'format': 'json'
        }
        self.c.post(url, data=data, follow=True)

        # When
        item = self.ItemModel.objects.get(id=item_id)
        assert item.order is not None
        item.delete()

        # Then
        items = self.get_items()
        self.assertEqual(len(items), 4)
        self.assertEqual(items[0].order, 0)
        self.assertEqual(items[1].order, 1)
        self.assertEqual(items[2].order, 2)
        self.assertEqual(items[3].order, 3)

    def test_should_handle_creating_new_item(self):
        # Given
        # Try to move first item up, to set order column
        self.c.login(username=self.username, password=self.password)
        items = [self.create_item() for _ in range(4)]
        item_id = items[0].id
        url = '/rest/v1/project/{}/reorder_items/'.format(self.project.id)
        data = {
            'item_type': self.item_type,
            'item_id': item_id,
            'item_direction': 'up',
            'format': 'json'
        }
        self.c.post(url, data=data, follow=True)

        # When
        item = self.create_item()

        # Then
        items = self.get_items()
        self.assertEqual(len(items), 5)
        self.assertEqual(items[0].order, 0)
        self.assertEqual(items[1].order, 1)
        self.assertEqual(items[2].order, 2)
        self.assertEqual(items[3].order, 3)
        self.assertEqual(items[4].id, item.id)
        self.assertEqual(items[4].order, 4)

    def test_should_handle_messed_up_order(self):
        # Given
        self.c.login(username=self.username, password=self.password)
        order = [2, 3, 3, 6, 6]
        items = [self.create_item(order=i) for i in order]
        item_id = items[0].id
        url = '/rest/v1/project/{}/reorder_items/'.format(self.project.id)
        data = {
            'item_type': self.item_type,
            'item_id': item_id,
            'item_direction': 'down',
            'format': 'json'
        }

        # When
        self.c.post(url, data=data, follow=True)

        # Then
        items = self.get_items()
        self.assertEqual(len(items), 5)
        self.assertEqual(items[0].order, 1)
        self.assertEqual(items[1].order, 0)
        self.assertEqual(items[2].order, 2)
        self.assertEqual(items[3].order, 3)
        self.assertEqual(items[4].order, 4)

    def create_item(self, order=None):
        raise NotImplementedError

    def get_items(self):
        raise NotImplementedError


class ProjectEditorReorderResultsTestCase(BaseReorderTestCase, TestCase):
    """Tests the reordering of results in the project editor."""

    item_type = 'result'
    ItemModel = Result

    def create_item(self, order=None):
        return Result.objects.create(project_id=self.project.id, order=order)

    def get_items(self):
        return Result.objects.filter(project__id=self.project.id).order_by('id')


class ProjectEditorReorderIndicatorsTestCase(BaseReorderTestCase, TestCase):
    """Tests the reordering of indicators in the project editor."""

    item_type = 'indicator'
    ItemModel = Indicator

    def setUp(self):
        super(ProjectEditorReorderIndicatorsTestCase, self).setUp()
        self.result = Result.objects.create(project_id=self.project.id)

    def create_item(self, order=None):
        return Indicator.objects.create(result_id=self.result.id, order=order)

    def get_items(self):
        return Indicator.objects.filter(result_id=self.result.id).order_by('id')


class ErrorHandlerTestCase(TestCase):
    """Tests for the error handler used by project editor."""

    def test_should_handle_unicode_errors(self):
        # Given
        message = u"""Il n'est pas permis d'utiliser une virgule, utilisez un point pour indiquer les décimales."""
        errors = []
        field_name = u'rsr_budgetitem.amount.5966_new-0'

        # When
        add_error(errors, message, field_name)

        # Then
        self.assertEquals(1, len(errors))

    def test_should_handle_str_errors(self):
        # Given
        message = "It is not allowed to use a comma, use a period to denote decimals."
        errors = []
        field_name = u'rsr_budgetitem.amount.5966_new-0'

        # When
        add_error(errors, message, field_name)

        # Then
        self.assertEquals(1, len(errors))
