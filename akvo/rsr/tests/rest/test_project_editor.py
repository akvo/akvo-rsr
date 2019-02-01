# -*- coding: utf-8 -*-

"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""
import datetime
from tempfile import NamedTemporaryFile

from django.conf import settings
from django.contrib.auth.models import Group
from django.test import TestCase, Client
from mock import patch

from akvo.rest.views.project_editor_utils import (
    add_error, create_or_update_objects_from_data, split_key
)
from akvo.rsr.iso3166 import ISO_3166_COUNTRIES
from akvo.rsr.models import (
    BudgetItem, BudgetItemLabel, Country, Employment, Indicator, IndicatorLabel, Organisation,
    OrganisationIndicatorLabel, Partnership, Project, ProjectLocation, Result, User,
    RelatedProject, IndicatorPeriod, Keyword
)
from akvo.rsr.templatetags.project_editor import choices
from akvo.utils import check_auth_groups, DjangoModel


def create_user(username='username', email='user@name.com', password='password'):
    user = User.objects.create_user(username, email, password)
    user.is_active = user.is_admin = user.is_superuser = True
    user.save()
    return user, username, password


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
        self.user, self.username, self.password = create_user()

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

    def test_should_handle_error_object_errors(self):
        # Given
        try:
            raise ValueError
        except ValueError as e:
            errors = []
            field_name = u'rsr_budgetitem.amount.5966_new-0'
            # When
            add_error(errors, e, field_name)

        # Then
        self.assertEquals(1, len(errors))


class SplitKeyTestCase(TestCase):

    def test_split_key_returns_three_items(self):
        # Given
        key = u'rsr_relatedproject.relation.1234_new-0'

        # When
        key_info = split_key(key)

        # Then
        self.assertEquals(
            key_info.model, DjangoModel._make((u'rsr_relatedproject', u'rsr', u'relatedproject'))
        )
        self.assertEquals(key_info.field, u'relation')
        self.assertEquals(key_info.ids, [u'1234', u'new-0'])


class ChoicesTestCase(TestCase):

    def setUp(self):
        # super(ProjectEditorReorderIndicatorsTestCase, self).setUp()
        self.project = Project.objects.create(title="Test Project")

    def test_non_fk_field(self):

        # When
        status_choices, ids = choices(self.project, 'status')

        # Then
        self.assertEqual(
            [(c[0], unicode(c[1])) for c in status_choices],
            [(c[0], unicode(c[1])) for c in Project.STATUSES]
        )
        self.assertEqual(
            [id for id in ids],
            [c[0] for c in Project.STATUSES]
        )

    def test_budget_item_choices(self):
        # Given
        label1 = BudgetItemLabel.objects.create(label=u'label 1')
        label2 = BudgetItemLabel.objects.create(label=u'label 2')
        budget_item = BudgetItem.objects.create(project=self.project)

        # When
        labels, ids = choices(budget_item, 'label')

        # Then
        self.assertEqual(
            set(labels),
            {(label1.pk, label1.label), (label2.pk, label2.label)}
        )
        self.assertEqual(
            ids,
            [label1.pk, label2.pk]
        )

    def test_indicator_label_choices(self):
        # Given
        organisation = Organisation.objects.create(
            name='name', long_name='long name', can_create_projects=True
        )
        Partnership.objects.create(
            organisation=organisation, project=self.project,
            iati_organisation_role=Partnership.IATI_ACCOUNTABLE_PARTNER
        )
        label1 = OrganisationIndicatorLabel.objects.create(
            organisation=organisation, label=u'label 1'
        )
        label2 = OrganisationIndicatorLabel.objects.create(
            organisation=organisation, label=u'label 2'
        )

        result = Result.objects.create(project=self.project, title="Result #1", type="1", )
        indicator = Indicator.objects.create(result=result, title="Indicator #1", measure="1", )
        indicator_label = IndicatorLabel.objects.create(indicator=indicator, label=label1)

        # When
        labels, ids = choices(indicator_label, 'label')

        # Then
        self.assertEqual(
            set(labels),
            {(label1.pk, label1.label), (label2.pk, label2.label)}
        )
        self.assertEqual(
            set(ids),
            {label1.pk, label2.pk}
        )

        # When
        labels, ids = choices('IndicatorLabel.{}_1234_567_89'.format(self.project.pk), 'label')

        # Then
        self.assertEqual(
            set(labels),
            {(label1.pk, label1.label), (label2.pk, label2.label)}
        )
        self.assertEqual(
            set(ids),
            {label1.pk, label2.pk}
        )

    def test_indicator_label_choices_multiple_organisations(self):
        # Given
        organisation1 = Organisation.objects.create(
            name='name1', long_name='long name1', can_create_projects=True
        )
        organisation2 = Organisation.objects.create(
            name='name2', long_name='long name2', can_create_projects=True
        )
        Partnership.objects.create(
            organisation=organisation1, project=self.project,
            iati_organisation_role=Partnership.IATI_ACCOUNTABLE_PARTNER
        )
        Partnership.objects.create(
            organisation=organisation2, project=self.project,
            iati_organisation_role=Partnership.IATI_ACCOUNTABLE_PARTNER
        )
        label1 = OrganisationIndicatorLabel.objects.create(
            organisation=organisation1, label=u'label 1'
        )
        label2 = OrganisationIndicatorLabel.objects.create(
            organisation=organisation2, label=u'label 2'
        )

        result = Result.objects.create(project=self.project, title="Result #1", type="1", )
        indicator = Indicator.objects.create(result=result, title="Indicator #1", measure="1", )
        indicator_label = IndicatorLabel.objects.create(indicator=indicator, label=label1)

        # When
        labels, ids = choices(indicator_label, 'label')

        # Then
        self.assertEqual(
            list(labels),
            [(label1.pk, label1.label), (label2.pk, label2.label)]
        )
        self.assertEqual(
            ids,
            [label1.pk, label2.pk]
        )

        # When
        labels, ids = choices('IndicatorLabel.{}_1234_567_89'.format(self.project.pk), 'label')

        # Then
        self.assertEqual(
            list(labels),
            [(label1.pk, label1.label), (label2.pk, label2.label)]
        )
        self.assertEqual(
            ids,
            [label1.pk, label2.pk]
        )


class ProjectLocationTestCase(TestCase):
    """Test that creating and updating project locations works correctly."""

    def setUp(self):
        self.project = Project.objects.create(title='New Project')
        self.create_countries()
        self.user, self.username, self.password = create_user()

        self.c = Client(HTTP_HOST=settings.RSR_DOMAIN)
        self.c.login(username=self.username, password=self.password)

    def test_correct_country_new_location(self):
        # Given
        latitude, longitude = ('8.98075182', '38.797958')  # Ethiopia
        id_ = self.project.id
        url = '/rest/v1/project/{}/project_editor/?format=json'.format(self.project.id)
        data = {
            'rsr_projectlocation.latitude.{}_new-1'.format(id_): latitude,
            'rsr_projectlocation.longitude.{}_new-1'.format(id_): longitude
        }

        # When
        response = self.c.post(url, data=data, follow=True)

        # Then
        self.assertEqual(200, response.status_code)
        location = ProjectLocation.objects.get(location_target=id_)
        self.assertEqual(location.latitude, float(latitude))
        self.assertEqual(location.longitude, float(longitude))
        self.assertEqual(location.country.iso_code, u'et')

    def test_updated_lat_lng_change_country(self):
        # Given
        latitude, longitude = ('8.98075182', '38.797958')  # Ethiopia
        location = ProjectLocation.objects.create(location_target=self.project,
                                                  latitude=latitude,
                                                  longitude=longitude)
        id_ = self.project.id
        url = '/rest/v1/project/{}/project_editor/?format=json'.format(id_)
        # Move the location to Ghana
        new_longitude = '0'
        data = {
            'rsr_projectlocation.longitude.{}'.format(location.id): new_longitude
        }

        # When
        response = self.c.post(url, data=data, follow=True)

        # Then
        self.assertEqual(200, response.status_code)
        location = ProjectLocation.objects.get(location_target=id_)
        self.assertEqual(location.latitude, float(latitude))
        self.assertEqual(location.longitude, float(new_longitude))
        self.assertEqual(location.country.iso_code, u'gh')

    @staticmethod
    def create_countries():
        """Populate the DB with countries."""
        for iso_code, _ in ISO_3166_COUNTRIES:
            Country.objects.get_or_create(
                iso_code=iso_code,
                defaults=Country.fields_from_iso_code(iso_code)
            )


class UploadFileTestCase(TestCase):
    """Test that uploading a file works correctly."""

    def setUp(self):
        self.project = Project.objects.create(title='New Project')
        self.user, self.username, self.password = create_user()
        self.c = Client(HTTP_HOST=settings.RSR_DOMAIN)
        self.c.login(username=self.username, password=self.password)

    def test_uploading_new_file(self):
        # Given
        id_ = self.project.id
        url = '/rest/v1/project/{}/upload_file/?format=json'.format(id_)
        with open(__file__) as f:
            data = {
                'field_id': 'rsr_projectdocument.document.{}_new-0'.format(id_),
                'file': f
            }

            # When
            response = self.c.post(url, data=data, follow=True)

        # Then
        self.assertEqual(200, response.status_code)
        errors = response.data['errors']
        self.assertEqual(0, len(errors))
        changes = response.data['changes']
        self.assertEqual(1, len(changes))
        upload_url = changes[0][1]
        resp = self.c.get(upload_url, follow=True)
        text = '\n'.join(resp.streaming_content)
        self.assertIn(self.__class__.__name__, text)

    def test_replacing_existing_file(self):
        # Given
        id_ = self.project.id
        url = '/rest/v1/project/{}/upload_file/?format=json'.format(id_)
        with open(__file__) as f:
            data = {
                'field_id': 'rsr_projectdocument.document.{}_new-0'.format(id_),
                'file': f
            }
            response = self.c.post(url, data=data, follow=True)
        document_id = response.data['rel_objects'][0]['new_id']
        with NamedTemporaryFile() as f:
            new_data = {
                'field_id': 'rsr_projectdocument.document.{}'.format(document_id),
                'file': f
            }

            # When
            response = self.c.post(url, data=new_data, follow=True)

        # Then
        self.assertEqual(200, response.status_code)
        errors = response.data['errors']
        self.assertEqual(0, len(errors))
        changes = response.data['changes']
        self.assertEqual(1, len(changes))
        upload_url = changes[0][1]
        resp = self.c.get(upload_url, follow=True)
        text = '\n'.join(resp.streaming_content)
        self.assertNotIn(self.__class__.__name__, text)


class DefaultPeriodsTestCase(TestCase):
    """Test the adding and removal of default periods."""

    def setUp(self):
        self.user, self.username, self.password = create_user()

        self.c = Client(HTTP_HOST=settings.RSR_DOMAIN)
        self.c.login(username=self.username, password=self.password)

        self.parent_project = Project.objects.create(
            title="Parent project", subtitle="Parent project (subtitle)"
        )
        self.parent_project.publish()

        self.child_project1 = Project.objects.create(
            title="Child project 1", subtitle="Child project 1 (subtitle)"
        )
        self.child_project1.publish()

        self.child_project2 = Project.objects.create(
            title="Child project 2", subtitle="Child project 2 (subtitle)"
        )
        self.child_project2.publish()

        RelatedProject.objects.create(
            project=self.parent_project, related_project=self.child_project1,
            relation=RelatedProject.PROJECT_RELATION_CHILD
        )
        RelatedProject.objects.create(
            project=self.parent_project, related_project=self.child_project2,
            relation=RelatedProject.PROJECT_RELATION_CHILD
        )
        # Create results framework
        self.result = Result.objects.create(
            project=self.parent_project, title="Result #1", type="1"
        )
        self.indicator1 = Indicator.objects.create(
            result=self.result, title="Indicator #1", measure="1"
        )
        self.today = datetime.date.today()
        self.period1 = IndicatorPeriod.objects.create(
            indicator=self.indicator1, period_start=self.today,
            period_end=self.today + datetime.timedelta(days=1), target_value="100"
        )
        self.period2 = IndicatorPeriod.objects.create(
            indicator=self.indicator1,
            period_start=self.today + datetime.timedelta(days=1),
            period_end=self.today + datetime.timedelta(days=2), target_value="200"
        )
        self.indicator2 = Indicator.objects.create(
            result=self.result, title="Indicator #2", measure="1"
        )
        # self.period3 = IndicatorPeriod.objects.create(
        #     indicator=self.indicator2,
        #     period_start=today + datetime.timedelta(days=3),
        #     period_end=today + datetime.timedelta(days=4), target_value="300"
        # )
        # self.period4 = IndicatorPeriod.objects.create(
        #     indicator=self.indicator2,
        #     period_start=today + datetime.timedelta(days=5),
        #     period_end=today + datetime.timedelta(days=6), target_value="400"
        # )

        # Import results framework into child
        self.import_status1, self.import_message1 = self.child_project1.import_results()
        self.import_status2, self.import_message2 = self.child_project2.import_results()

    def tearDown(self):
        Project.objects.all().delete()
        User.objects.all().delete()

    def test_set_default_periods(self):
        # Given
        project_id = self.parent_project.pk
        indicator_id = self.indicator1.pk
        url = '/rest/v1/project/{}/default_periods/?format=json'.format(project_id)

        # When
        # Set first indicator's periods as default
        data = {'indicator_id': indicator_id, 'copy': 'false', 'set_default': 'true'}
        response = self.c.post(url, data=data, follow=True)
        # Remove first indicator's periods as default
        data = {'indicator_id': indicator_id, 'copy': 'false', 'set_default': 'false'}
        response = self.c.post(url, data=data, follow=True)
        # Set first indicator's periods as default, and copy the periods to other eligible
        # indicators
        data = {'indicator_id': indicator_id, 'copy': 'true', 'set_default': 'true'}
        response = self.c.post(url, data=data, follow=True)

        # Then
        self.assertEqual(200, response.status_code)
        parent_periods1 = IndicatorPeriod.objects.filter(indicator__result__project=self.parent_project)
        self.assertEqual(parent_periods1.count(), 4)
        child_periods1 = IndicatorPeriod.objects.filter(indicator__result__project=self.child_project1)
        self.assertEqual(child_periods1.count(), 4)
        child_periods2 = IndicatorPeriod.objects.filter(indicator__result__project=self.child_project2)
        self.assertEqual(child_periods2.count(), 4)

    def test_set_default_periods_when_periods_exist(self):
        # Given
        # Adding a period to indicator2 prevents copying of default periods to it
        IndicatorPeriod.objects.create(
            indicator=self.indicator2,
            period_start=self.today + datetime.timedelta(days=3),
            period_end=self.today + datetime.timedelta(days=4), target_value="300"
        )
        project_id = self.parent_project.pk
        indicator_id = self.indicator1.pk
        url = '/rest/v1/project/{}/default_periods/?format=json'.format(project_id)

        # When
        # Set first indicator's periods as default
        data = {'indicator_id': indicator_id, 'copy': 'false', 'set_default': 'true'}
        self.c.post(url, data=data, follow=True)
        # Remove first indicator's periods as default
        data = {'indicator_id': indicator_id, 'copy': 'false', 'set_default': 'false'}
        self.c.post(url, data=data, follow=True)
        # Set first indicator's periods as default, and copy the periods to other eligible
        # indicators
        data = {'indicator_id': indicator_id, 'copy': 'true', 'set_default': 'true'}
        response = self.c.post(url, data=data, follow=True)

        # Then
        self.assertEqual(200, response.status_code)
        parent_periods1 = IndicatorPeriod.objects.filter(indicator__result__project=self.parent_project)
        self.assertEqual(parent_periods1.count(), 3)
        child_periods1 = IndicatorPeriod.objects.filter(indicator__result__project=self.child_project1)
        self.assertEqual(child_periods1.count(), 3)
        child_periods2 = IndicatorPeriod.objects.filter(indicator__result__project=self.child_project2)
        self.assertEqual(child_periods2.count(), 3)


class CreateOrUpdateTestCase(TestCase):

    def setUp(self):
        # Create necessary groups
        check_auth_groups(settings.REQUIRED_AUTH_GROUPS)

        # Create project
        self.project = Project.objects.create(title="Test Project")
        self.project_2 = Project.objects.create(title="Test Project 2")

    def test_saving_project_attributes(self):
        # Given
        iati_activity_id = u'iati_activity_id'
        background = u'Background'
        data = {
            u'rsr_project.iati_activity_id.{}'.format(self.project.id): iati_activity_id,
            u'rsr_project.background.{}'.format(self.project.id): background,
        }

        # When
        errors, changes, rel_objects = create_or_update_objects_from_data(self.project, data)

        # Then
        project = Project.objects.get(id=self.project.id)
        self.assertEqual(project.iati_activity_id, iati_activity_id)
        self.assertEqual(project.background, background)
        self.assertEqual(0, len(errors))
        self.assertEqual(0, len(rel_objects))
        self.assertEqual(1, len(changes))
        self.assertEqual(2, len(changes[0]))
        self.assertEqual(2, len(changes[0][1]))

    def test_save_called_once(self):
        # Given
        iati_activity_id = u'iati_activity_id'
        background = u'Background'
        data = {
            u'rsr_project.iati_activity_id.{}'.format(self.project.id): iati_activity_id,
            u'rsr_project.background.{}'.format(self.project.id): background,
        }

        # When
        with patch('akvo.rsr.models.project.Project.save') as patched_save:
            create_or_update_objects_from_data(self.project, data)

        # Then
        self.assertEqual(1, patched_save.call_count)

    def test_saving_incorrect_project_attributes(self):
        # Given
        hierarchy = 'incorrect_hierarchy_value'
        data = {
            u'rsr_project.hierarchy.{}'.format(self.project.id): hierarchy,
        }

        # When
        errors, changes, rel_objects = create_or_update_objects_from_data(self.project, data)

        # Then
        self.assertEqual(1, len(errors))
        self.assertEqual('rsr_project.hierarchy.{}'.format(self.project.id), errors[0]['name'])
        self.assertEqual(0, len(rel_objects))
        self.assertEqual(0, len(changes))

    def test_creating_project_attribute_object(self):
        # Given
        relation = '3'
        data = {
            u'rsr_relatedproject.relation.{}_new-1'.format(self.project.id): relation,
            u'rsr_relatedproject.related_project.{}_new-1'.format(self.project.id): self.project_2.id,
        }

        # When
        errors, changes, rel_objects = create_or_update_objects_from_data(self.project, data)

        # Then
        project = Project.objects.get(id=self.project.id)
        self.assertEqual(project.related_projects.count(), 1)
        related_project = project.related_projects.first()
        self.assertEqual(related_project.project, self.project)
        self.assertEqual(related_project.related_project, self.project_2)
        self.assertEqual(related_project.relation, relation)
        self.assertEqual(0, len(errors))
        self.assertEqual(1, len(rel_objects))
        self.assertEqual(1, len(changes))
        self.assertEqual(2, len(changes[0]))
        self.assertEqual(2, len(changes[0][1]))

    def test_creating_project_m2m_object(self):
        # Given
        keyword_label = 'keyword-1'
        keyword = Keyword(label=keyword_label)
        keyword.save()
        data = {u'rsr_keyword.label.{}_new-1'.format(self.project.id): str(keyword.id)}

        # When
        errors, changes, rel_objects = create_or_update_objects_from_data(self.project, data)

        # Then
        project = Project.objects.get(id=self.project.id)
        self.assertEqual(project.keywords.count(), 1)
        keyword = project.keywords.first()
        self.assertEqual(keyword_label, keyword.label)
        self.assertEqual(0, len(errors))
        self.assertEqual(1, len(rel_objects))
        self.assertEqual(1, len(changes))
        self.assertEqual(2, len(changes[0]))
        self.assertEqual(1, len(changes[0][1]))

    def test_updating_project_attribute_object(self):
        # Given
        sibling_relation = '3'
        parent_relation = '1'
        original_data = {
            u'rsr_relatedproject.relation.{}_new-1'.format(self.project.id): sibling_relation,
            u'rsr_relatedproject.related_project.{}_new-1'.format(self.project.id): self.project_2.id,
        }
        create_or_update_objects_from_data(self.project, original_data)

        # When
        project = Project.objects.get(id=self.project.id)
        update_data = {
            u'rsr_relatedproject.relation.{}'.format(project.related_projects.first().id): '1'
        }
        errors, changes, rel_objects = create_or_update_objects_from_data(self.project, update_data)

        # Then
        project = Project.objects.get(id=self.project.id)
        self.assertEqual(project.related_projects.count(), 1)
        related_project = project.related_projects.first()
        self.assertEqual(related_project.project, self.project)
        self.assertEqual(related_project.related_project, self.project_2)
        self.assertEqual(related_project.relation, parent_relation)
        self.assertEqual(0, len(errors))
        self.assertEqual(1, len(rel_objects))
        self.assertEqual(1, len(changes))
        self.assertEqual(2, len(changes[0]))
        self.assertEqual(1, len(changes[0][1]))

    def test_creating_project_attirbute_hierarchy(self):
        # Given
        result_title = 'Result Title'
        result_description = 'Result Description'
        result_type = u'1'
        result_aggregation = u'2'

        result_title_2 = 'Result Title 2'
        result_description_2 = 'Result Description 2'
        result_type_2 = u'2'
        result_aggregation_2 = u'2'

        indicator_title = u'Indicator Title'
        indicator_description = u'Indicator Description'
        indicator_measure = '1'
        indicator_type = '1'
        indicator_ascending = '1'

        period_start = u'01/01/2019'
        period_end = u'01/02/2019'
        period_target_value = u'12'
        period_target_comment = u'Target Comment'

        data = {
            u'rsr_result.description.{}_new-0': result_description,
            u'rsr_result.title.{}_new-0': result_title,
            u'rsr_result.type.{}_new-0': result_type,
            u'rsr_result.aggregation_status.{}_new-0': result_aggregation,

            u'rsr_result.description.{}_new-1': result_description_2,
            u'rsr_result.title.{}_new-1': result_title_2,
            u'rsr_result.type.{}_new-1': result_type_2,
            u'rsr_result.aggregation_status.{}_new-1': result_aggregation_2,

            u'rsr_indicator.type.{}_new-0_new-0': indicator_type,
            u'rsr_indicator.ascending.{}_new-0_new-0': indicator_ascending,
            u'rsr_indicator.title.{}_new-0_new-0': indicator_title,
            u'rsr_indicator.description.{}_new-0_new-0': indicator_description,
            u'rsr_indicator.measure.{}_new-0_new-0': indicator_measure,

            u'rsr_indicatorperiod.period_start.{}_new-0_new-0_new-0': period_start,
            u'rsr_indicatorperiod.period_end.{}_new-0_new-0_new-0': period_end,
            u'rsr_indicatorperiod.target_value.{}_new-0_new-0_new-0': period_target_value,
            u'rsr_indicatorperiod.target_comment.{}_new-0_new-0_new-0': period_target_comment,
        }
        data = {
            key.format(self.project.id): value for key, value in data.items()
        }

        # When
        errors, changes, rel_objects = create_or_update_objects_from_data(self.project, data)

        # Then
        project = Project.objects.get(id=self.project.id)
        self.assertEqual(2, project.results.count())

        result = Result.objects.get(project=self.project.id, title=result_title)
        self.assertEqual(result.title, result_title)
        self.assertEqual(result.description, result_description)
        self.assertEqual(result.type, result_type)
        self.assertEqual(result.aggregation_status, result_aggregation == '1')

        result_2 = Result.objects.get(project=self.project.id, title=result_title_2)
        self.assertEqual(result_2.title, result_title_2)
        self.assertEqual(result_2.description, result_description_2)
        self.assertEqual(result_2.type, result_type_2)
        self.assertEqual(result_2.aggregation_status, result_aggregation_2 == '1')

        indicator = Indicator.objects.get(result=result)
        self.assertEqual(indicator.title, indicator_title)
        self.assertEqual(indicator.description, indicator_description)
        self.assertEqual(indicator.type, int(indicator_type))
        self.assertEqual(indicator.measure, indicator_measure)
        self.assertEqual(indicator.ascending, indicator_ascending == '1')

        period = IndicatorPeriod.objects.get(indicator=indicator)
        self.assertEqual(period.period_start.strftime('%d/%m/%Y'), period_start)
        self.assertEqual(period.period_end.strftime('%d/%m/%Y'), period_end)
        self.assertEqual(period.target_value, period_target_value)
        self.assertEqual(period.target_comment, period_target_comment)

        self.assertEqual(0, len(errors))
        self.assertEqual(4, len(rel_objects))
        self.assertEqual(4, len(changes))
        for change in changes:
            self.assertEqual(2, len(change))
            attributes = 5 if isinstance(change[0], Indicator) else 4
            self.assertEqual(attributes, len(change[1]))
