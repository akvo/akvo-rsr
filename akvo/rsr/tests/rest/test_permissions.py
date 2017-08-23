# -*- coding: utf-8 -*-

"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

import collections
import re

from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser, Group
from django.core import management
from django.test import TestCase

from akvo.rest.viewsets import PublicProjectViewSet
from akvo.rsr import models as M
from akvo.utils import check_auth_groups


def slugify(s):
    return re.sub('\W+', '-', s.lower())


User = get_user_model()
group_count = collections.namedtuple('group_count', ('admin', 'anonymous', 'editor', 'other'))


class PermissionFilteringTestCase(TestCase):
    """Tests the filtering of querysets based on user permissions."""

    @classmethod
    def setUpClass(cls):
        """Setup the DB with all the objects we require.

        The objects created here are the ones which have ViewSets that are
        subclassed from PublicProjectViewSet or that have some code for dealing
        with permissions for them in akvo.rsr.permissions

        """

        # Prepend our messages to default messages.
        cls.longMessage = True

        cls.model_map = cls.populate_model_map()
        cls.ensure_model_map_populated(cls.model_map)

        # Setup Groups
        check_auth_groups(settings.REQUIRED_AUTH_GROUPS)

        # Create a couple of organisations
        for name in ('Akvo', 'WASH Org'):
            M.Organisation.objects.create(name=name, long_name=name, can_create_projects=True)

        # Create a category
        category = M.Category.objects.create(name='category1')

        # Create users in each of the auth groups for all the orgs
        for organisation in M.Organisation.objects.all():
            org_name = slugify(organisation.name)
            for group in Group.objects.all():
                username = '{}@{}.org'.format(slugify(group.name), org_name)
                cls.create_user(username, group, organisation)

            # Create an admin (general RSR admin, usually only akvo employees)
            group = Group.objects.get(name='Admins')
            username = 'rsr-admin@{}.org'.format(org_name)
            admin = cls.create_user(username, group, organisation, is_admin=True)

            # Create a superuser
            group = Group.objects.get(name='Admins')
            username = 'rsr-superuser@{}.org'.format(org_name)
            cls.create_user(username, group, organisation, is_superuser=True)

            # Create organisation indicator labels
            label = M.OrganisationIndicatorLabel.objects.create(
                organisation=organisation,
                label=u'label1'
            )

            # Create Projects
            for project_name in ('Private project', 'Public project'):
                for status in (M.PublishingStatus.STATUS_PUBLISHED, M.PublishingStatus.STATUS_UNPUBLISHED):
                    title = '{} - {} - {}'.format(project_name, organisation.name, status)
                    is_public = False if 'private' in project_name.lower() else True
                    project = M.Project.objects.create(title=title, is_public=is_public)
                    cls.set_publishing_status(project, status)
                    M.Partnership.objects.create(organisation=organisation,
                                                 project=project,
                                                 iati_organisation_role=M.Partnership.IATI_FUNDING_PARTNER)

            for project in organisation.all_projects().distinct():
                # Per-project objects
                # benchmark
                benchmark_name = M.Benchmarkname.objects.create(name='benchmark_name')
                M.Benchmark.objects.create(project=project, name=benchmark_name, category=category, value=10)
                # budget
                M.BudgetItem.objects.create(project=project)
                M.CountryBudgetItem.objects.create(project=project)
                # crs
                crs = M.CrsAdd.objects.create(project=project)
                M.CrsAddOtherFlag.objects.create(crs=crs)
                # fss
                fss = M.Fss.objects.create(project=project)
                M.FssForecast.objects.create(fss=fss)
                # goal
                M.Goal.objects.create(project=project)
                # legacy data
                M.LegacyData.objects.create(project=project)
                # link
                M.Link.objects.create(project=project, url='akvo.org')
                # humanitarian scope
                M.HumanitarianScope.objects.create(project=project)
                # conditions
                M.ProjectCondition.objects.create(project=project, text='Condition {}'.format(project.title))
                # contacts
                M.ProjectContact.objects.create(project=project)
                # custom fields
                M.ProjectCustomField.objects.create(project=project, section=1, order=4)
                # documents
                document = M.ProjectDocument.objects.create(project=project)
                # document categories
                M.ProjectDocumentCategory.objects.create(document=document, category='A')
                # recipient country and region
                M.RecipientCountry.objects.create(project=project)
                M.RecipientRegion.objects.create(project=project)
                # related project
                # # set other project from organisation as related project
                other_project = M.Project.objects.exclude(id__in=[project.id]).filter(
                    partnerships__organisation=organisation, is_public=True
                ).first()
                M.RelatedProject.objects.create(project=project, related_project=other_project)
                # planned disbursement
                M.PlannedDisbursement.objects.create(project=project)
                # policy marker
                M.PolicyMarker.objects.create(project=project)
                # sector
                M.Sector.objects.create(project=project)
                # transaction
                transaction = M.Transaction.objects.create(project=project)
                # transaction sector
                M.TransactionSector.objects.create(transaction=transaction)
                # iati export
                export = M.IatiExport.objects.create(reporting_organisation=organisation,
                                                     user=admin)
                for project_ in organisation.projects.all():
                    export.projects.add(project_)
                # location
                location = M.ProjectLocation.objects.create(location_target=project,
                                                            latitude=project.id,
                                                            longitude=project.id)
                # administrative location
                M.AdministrativeLocation.objects.create(location=location)
                # result
                result = M.Result.objects.create(project=project)
                # indicator
                indicator = M.Indicator.objects.create(result=result)
                # indicator label
                M.IndicatorLabel.objects.create(indicator=indicator, label=label)
                # indicator reference
                M.IndicatorReference.objects.create(indicator=indicator)
                # indicator period
                period = M.IndicatorPeriod.objects.create(indicator=indicator)
                # indicator period actual dimension
                M.IndicatorPeriodActualDimension.objects.create(period=period)
                # indicator period actual location
                M.IndicatorPeriodActualLocation.objects.create(period=period)
                # indicator period target dimension
                M.IndicatorPeriodTargetDimension.objects.create(period=period)
                # indicator period target location
                M.IndicatorPeriodTargetLocation.objects.create(period=period)

                # Per-project per-user objects
                for user in organisation.all_users():
                    title = '{}: {}'.format(user.username, project.title)
                    # updates
                    update = M.ProjectUpdate.objects.create(project=project,
                                                            user=user,
                                                            title=title)
                    # update location
                    M.ProjectUpdateLocation.objects.create(location_target=update,
                                                           latitude=update.id,
                                                           longitude=update.id)
                    # indicator period data
                    data = M.IndicatorPeriodData.objects.create(period=period, user=user)
                    # indicator period data comment
                    M.IndicatorPeriodDataComment.objects.create(data=data, user=user)
                    # comments
                    M.ProjectComment.objects.create(project=project, user=user)

            # PartnerSite
            M.PartnerSite.objects.create(organisation=organisation,
                                         piwik_id=0,
                                         hostname='{}.org'.format(org_name))

    @classmethod
    def tearDownClass(cls):
        management.call_command('flush', interactive=False)

    @staticmethod
    def ensure_model_map_populated(model_map):
        """Ensure all models of PublicProjectViewSet subclasses are present."""

        from akvo.rest import views
        view_sets = [
            obj for obj in views.__dict__.values()
            if isinstance(obj, type) and issubclass(obj, PublicProjectViewSet)
        ]
        view_set_models = {view_set.queryset.model for view_set in view_sets}
        missing_models = view_set_models - set(model_map.keys())
        assert not missing_models, '{} are missing from model_map'.format(missing_models)

    @staticmethod
    def populate_model_map():
        """Populate a dict with permissions information for each model class.

        The keys of the model_map are model classes for all the viewsets that
        subclass from PublicProjectViewSet are populated in this mapping.  The
        values consist of a dictionary with two keys, 'count' and
        'project_relation'.  'count' maps to a tuple containing the number of
        instances of that model that are visible to a user belonging to each of
        the following categories: (admin, anonymous-user,
        admin-or-project-editor, non-admin-or-project-editor-user).
        'project_relation' gives the django relational mapping to the
        corresponding project for that instance.

        """

        model_map = {}

        # 4 projects per organisation
        #   2 public, 2 private
        model_map[M.Project] = {
            'group_count': group_count(8, 4, 6, 4),
            'project_relation': ''
        }

        # one condition per project
        model_map[M.ProjectCondition] = {
            'group_count': group_count(8, 4, 6, 4),
            'project_relation': 'project__'
        }

        # one benchmark per project
        model_map[M.Benchmark] = {
            'group_count': group_count(8, 4, 6, 4),
            'project_relation': 'project__'
        }

        # FIXME: Using change_* permission for viewsets is kinda weird. For
        # instance, ProjectComments made by a non-privileged on private
        # projects is not visible to them, because of this! group_count(56, 28, 42, 30)
        # therefore becomes group_count(56, 28, 42, 28)
        # one benchmarkname per benchmark
        model_map[M.Benchmarkname] = {
            'group_count': group_count(8, 4, 4, 4),
            'project_relation': 'benchmark__project__'
        }

        # one budget item per projct
        model_map[M.BudgetItem] = {
            'group_count': group_count(8, 4, 6, 4),
            'project_relation': 'project__'
        }

        # one country budget item per project
        model_map[M.CountryBudgetItem] = {
            'group_count': group_count(8, 4, 6, 4),
            'project_relation': 'project__'
        }

        # one crs per project
        # FIXME: change_* wierdness.
        model_map[M.CrsAdd] = {
            'group_count': group_count(8, 4, 4, 4),
            'project_relation': 'project__'
        }

        # one per project
        # FIXME: change_* wierdness.
        model_map[M.CrsAddOtherFlag] = {
            'group_count': group_count(8, 4, 4, 4),
            'project_relation': 'crs__project__'
        }

        # one fss per project
        # FIXME: change_* wierdness.
        model_map[M.Fss] = {
            'group_count': group_count(8, 4, 4, 4),
            'project_relation': 'project__'
        }

        # on fss forecast per fss
        model_map[M.FssForecast] = {
            'group_count': group_count(8, 4, 4, 4),
            'project_relation': 'fss__project__'
        }

        # one goal
        model_map[M.Goal] = {
            'group_count': group_count(8, 4, 6, 4),
            'project_relation': 'project__'
        }

        # one legacy data item per project
        model_map[M.LegacyData] = {
            'group_count': group_count(8, 4, 6, 4),
            'project_relation': 'project__'
        }

        # one link per project
        model_map[M.Link] = {
            'group_count': group_count(8, 4, 6, 4),
            'project_relation': 'project__'
        }

        # one humanitarian_scope per project
        # FIXME: change_* permissions weirdness: admins can't see
        # humanitarian_scope of private projects
        model_map[M.HumanitarianScope] = {
            'group_count': group_count(8, 4, 4, 4),
            'project_relation': 'project__'
        }

        # FIXME: change_* wierdness.
        model_map[M.ProjectComment] = {
            'group_count': group_count(56, 28, 42, 28),
            'project_relation': 'project__'
        }

        # one contact per project
        model_map[M.ProjectContact] = {
            'group_count': group_count(8, 4, 6, 4),
            'project_relation': 'project__'
        }

        # one custom field per project
        model_map[M.ProjectCustomField] = {
            'group_count': group_count(8, 4, 6, 4),
            'project_relation': 'project__'
        }

        # one document per project
        model_map[M.ProjectDocument] = {
            'group_count': group_count(8, 4, 6, 4),
            'project_relation': 'project__'
        }

        # one document category per document
        # FIXME: admins also can't see private document categories??
        model_map[M.ProjectDocumentCategory] = {
            'group_count': group_count(8, 4, 4, 4),
            'project_relation': 'document__project__'
        }

        # one location per project
        model_map[M.ProjectLocation] = {
            'group_count': group_count(8, 4, 6, 4),
            'project_relation': 'location_target__'
        }

        # one administrative location per project
        model_map[M.AdministrativeLocation] = {
            'group_count': group_count(8, 4, 6, 4),
            'project_relation': 'location__location_target__'
        }

        # 7 project updates group_count(for each user in each group) per project
        # Every non-privileged user will also be able to see their update
        model_map[M.ProjectUpdate] = {
            'group_count': group_count(56, 28, 42, 30),
            'project_relation': 'project__'
        }

        # one location per update - only admin users are allowed to edit
        model_map[M.ProjectUpdateLocation] = {
            'group_count': group_count(56, 28, 28, 28),
            'project_relation': 'location_target__project__'
        }

        # one recipient country per project
        model_map[M.RecipientCountry] = {
            'group_count': group_count(8, 4, 6, 4),
            'project_relation': 'project__'
        }

        # one recipient region per project
        model_map[M.RecipientRegion] = {
            'group_count': group_count(8, 4, 6, 4),
            'project_relation': 'project__'
        }

        # one related_project per project
        model_map[M.RelatedProject] = {
            'group_count': group_count(8, 4, 6, 4),
            'project_relation': 'project__'
        }

        # one planned disbursement per project
        model_map[M.PlannedDisbursement] = {
            'group_count': group_count(8, 4, 6, 4),
            'project_relation': 'project__'
        }

        # one policy marker per project
        model_map[M.PolicyMarker] = {
            'group_count': group_count(8, 4, 6, 4),
            'project_relation': 'project__'
        }

        # one publishing status per project
        # FIXME: change_* permissions weirdness.
        # FIXME: permissions for admins group and other editors group_count(m&e,
        # project_editor)  differ. hence, the tuple weirdness
        model_map[M.PublishingStatus] = {
            'group_count': group_count(8, 4, (6, 4), 4),
            'project_relation': 'project__'
        }

        # one sector per project
        model_map[M.Sector] = {
            'group_count': group_count(8, 4, 6, 4),
            'project_relation': 'project__'
        }

        # one transaction per project
        model_map[M.Transaction] = {
            'group_count': group_count(8, 4, 6, 4),
            'project_relation': 'project__'
        }

        # one transaction sector per transaction
        # FIXME: change_* permissions weirdness
        model_map[M.TransactionSector] = {
            'group_count': group_count(8, 4, 4, 4),
            'project_relation': 'transaction__project__'
        }

        # one result per project
        model_map[M.Result] = {
            'group_count': group_count(8, 4, 6, 4),
            'project_relation': 'project__'
        }

        # one indicator per result
        model_map[M.Indicator] = {
            'group_count': group_count(8, 4, 6, 4),
            'project_relation': 'result__project__'
        }

        # one label per indicator
        # FIXME: change_* permissions weirdness
        model_map[M.IndicatorLabel] = {
            'group_count': group_count(8, 4, 4, 4),
            'project_relation': 'indicator__result__project__'
        }

        # one reference per indicator
        # FIXME: change_* permissions weirdness
        model_map[M.IndicatorReference] = {
            'group_count': group_count(8, 4, 4, 4),
            'project_relation': 'indicator__result__project__'
        }

        # one indicator period per indicator
        model_map[M.IndicatorPeriod] = {
            'group_count': group_count(8, 4, 6, 4),
            'project_relation': 'indicator__result__project__'
        }

        # one indicator period actual dimension per period
        # FIXME: change_* permissions weirdness
        model_map[M.IndicatorPeriodActualDimension] = {
            'group_count': group_count(8, 4, 4, 4),
            'project_relation': 'period__indicator__result__project__'
        }

        # one indicator period actual location per period
        # FIXME: change_* permissions weirdness
        model_map[M.IndicatorPeriodActualLocation] = {
            'group_count': group_count(8, 4, 4, 4),
            'project_relation': 'period__indicator__result__project__'
        }

        # one indicator period target dimension per period
        # FIXME: change_* permissions weirdness
        model_map[M.IndicatorPeriodTargetDimension] = {
            'group_count': group_count(8, 4, 4, 4),
            'project_relation': 'period__indicator__result__project__'
        }

        # one indicator period target location per period
        # FIXME: change_* permissions weirdness
        model_map[M.IndicatorPeriodTargetLocation] = {
            'group_count': group_count(8, 4, 4, 4),
            'project_relation': 'period__indicator__result__project__'
        }

        # one indicator period data per user per indicator period
        # FIXME: IndicatorPeriodData entries on private projects are not visible to non
        # privileged users?! Weirdness because of using change_* permission
        model_map[M.IndicatorPeriodData] = {
            'group_count': group_count(56, 28, 42, 28),
            'project_relation': 'period__indicator__result__project__'
        }

        # one comment per indicator period data
        model_map[M.IndicatorPeriodDataComment] = {
            'group_count': group_count(56, 28, 42, 28),
            'project_relation': 'data__period__indicator__result__project__'
        }

        # one partnership per project per org
        model_map[M.Partnership] = {
            'group_count': group_count(8, 4, 6, 4),
            'project_relation': 'project__'
        }

        return model_map

    @staticmethod
    def create_user(username, group, organisation, is_admin=False, is_superuser=False):
        user = User.objects.create(username=username,
                                   email=username,
                                   is_active=True)
        user.set_password('password')
        user.is_admin = is_admin
        user.is_superuser = is_superuser
        user.save()
        M.Employment.objects.create(
            user=user,
            group=group,
            organisation=organisation,
            is_approved=True)
        return user

    @staticmethod
    def set_publishing_status(project, status):
        publishing_status = M.PublishingStatus.objects.get(project=project)
        publishing_status.status = status
        publishing_status.save()

    def test_admin(self):
        for user in User.objects.filter(is_admin=True):
            for queryset, project_relation, count in self.iter_queryset('admin'):
                filtered_queryset = PublicProjectViewSet.projects_filter_for_non_privileged_users(
                    user, queryset, project_relation
                )
                self.assertPermissions(user, count, filtered_queryset)

    def test_anonymous(self):
        user = AnonymousUser()
        for queryset, project_relation, count in self.iter_queryset('anonymous'):
            filtered_queryset = PublicProjectViewSet.projects_filter_for_non_privileged_users(
                user, queryset, project_relation
            )
            self.assertPermissions(user, count, filtered_queryset)

    def test_logged_in_user(self):
        from akvo.rest.viewsets import PublicProjectViewSet
        m_e = Group.objects.get(name='M&E Managers')
        p_e = Group.objects.get(name='Project Editors')
        admins = Group.objects.get(name='Admins')
        for user in User.objects.filter(is_admin=False, is_superuser=False):
            if user.in_group(m_e) or user.in_group(p_e) or user.in_group(admins):
                user_type = 'editor'
            else:
                user_type = 'other'

            for queryset, project_relation, count in self.iter_queryset(user_type):
                filtered_queryset = PublicProjectViewSet.projects_filter_for_non_privileged_users(
                    user, queryset, project_relation
                )
                # Users in the Admins group sometimes have more permissions
                # than users in the other 'editor' groups - Project Editor or
                # M&E Managers.  Hence, the tuple weirdness.
                if isinstance(count, tuple):
                    count = count[0] if user.in_group(admins) else count[1]

                self.assertPermissions(user, count, filtered_queryset)

    def assertPermissions(self, user, expected_count, queryset):
        """Assert that count of objects in queryset matches expected_count."""

        actual_count = queryset.count()
        msg = '{} has incorrect permissions on {}.'.format(user.username, queryset.model.__name__)
        self.assertEqual(actual_count, expected_count, msg)

    def iter_queryset(self, user_type='other'):
        """An iterator over querysets to test permissions with."""

        for model in self.model_map:
            data = self.model_map[model]
            group_count = getattr(data['group_count'], user_type)
            yield model.objects.all(), data['project_relation'], group_count
