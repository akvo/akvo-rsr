# -*- coding: utf-8 -*-
# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.conf import settings
from django.contrib.auth.models import Group

from akvo.rsr.models import (
    Project, Organisation, Employment, Partnership, ProjectUpdate, PartnerSite, IatiExport,
    Result, Indicator, IndicatorPeriod, IndicatorPeriodData, IndicatorPeriodDataComment,
    AdministrativeLocation, ProjectLocation, OrganisationLocation, UserProjects,
    ProjectHierarchy, IndicatorDimensionName, IndicatorDimensionValue
)
from akvo.utils import check_auth_groups
from akvo.rsr.tests.base import BaseTestCase
from akvo.rsr.permissions import user_accessible_projects


class PermissionsTestCase(BaseTestCase):
    """Testing that permissions work correctly."""

    def setUp(self):
        check_auth_groups(settings.REQUIRED_AUTH_GROUPS)
        # Create organisations
        self.orgs = [
            Organisation.objects.create(name='org-{}'.format(i), long_name='org-{}'.format(i))
            for i in range(2)
        ]

        # Create one Project per organisation
        self.projects = []
        for org in self.orgs:
            project = Project.objects.create()
            Partnership.objects.create(organisation=org, project=project)
            self.projects.append(project)

        # PartnerSite
        self.partner_sites = [
            PartnerSite.objects.create(organisation=org, hostname=org.name, piwik_id=0)
            for org in self.orgs
        ]

        # Create users, one "normal" user per organisation
        self.users = []
        self.iati_exports = []
        group = Group.objects.get(name='Users')
        for i, org in enumerate(self.orgs):
            user = self.create_user('user@org-{}.org'.format(i))
            Employment.objects.create(user=user, organisation=org, group=group, is_approved=True)
            self.users.append(user)

            iati_export = IatiExport.objects.create(reporting_organisation=org, user=user)
            self.iati_exports.append(iati_export)

        # For each user create a project update
        self.project_updates = [
            ProjectUpdate.objects.create(user=user_, project=project_)
            for (project_, user_) in zip(self.projects, self.users)
        ]

        # Indicator Dimension Names
        self.dimension_names = [
            IndicatorDimensionName.objects.create(project=project_) for project_ in self.projects
        ]

        # Indicator Dimension Values
        self.dimension_values = [
            IndicatorDimensionValue.objects.create(name=name) for name in self.dimension_names
        ]

        # Results
        self.results = [
            Result.objects.create(project=project_) for project_ in self.projects
        ]

        # Indicators
        self.indicators = [
            Indicator.objects.create(result=result) for result in self.results
        ]

        # Indicator periods
        self.indicator_periods = [
            IndicatorPeriod.objects.create(indicator=indicator) for indicator in self.indicators
        ]

        # Indicator updates
        self.indicator_updates = [
            IndicatorPeriodData.objects.create(period=period, user=self.users[i])
            for i, period in enumerate(self.indicator_periods)
        ]

        # Indicator update comments
        self.indicator_update_comments = [
            IndicatorPeriodDataComment.objects.create(data=update, user=self.users[i])
            for i, update in enumerate(self.indicator_updates)
        ]

        # Project locations
        self.project_locations = [
            ProjectLocation.objects.create(location_target=project_) for project_ in self.projects
        ]

        # Administrative locations
        self.admin_locations = [
            AdministrativeLocation.objects.create(location=location)
            for location in self.project_locations
        ]

        # Organisation locations
        self.org_locations = [
            OrganisationLocation.objects.create(location_target=org)
            for org in self.orgs
        ]

    def test_org_admin_permissions(self):
        # Given
        user = self.users[0]
        self.make_org_admin(user, self.orgs[0])

        # No object
        self.assertTrue(user.has_perm('rsr.change_project', None))
        self.assertTrue(user.has_perm('rsr.change_partnersite'))

        # "M&E manager" actions
        self.assertTrue(user.has_perm('rsr.do_me_manager_actions'))

        # Organisation permissions
        for i, org in enumerate(self.orgs):
            test = self.assertTrue if i == 0 else self.assertFalse
            test(user.has_perm('rsr.change_organisation', org))

        # User (and related) permissions
        for i, user_ in enumerate(self.users):
            test = self.assertTrue if i == 0 else self.assertFalse
            test(user.has_perm('rsr.change_user', user_))

            # Employment permissions
            employment = user_.approved_employments().first()
            test(user.has_perm('rsr.change_employment', employment))

        # Project (and related) permissions
        for i, project in enumerate(self.projects):
            test = self.assertTrue if i == 0 else self.assertFalse
            test(user.has_perm('rsr.change_project', project))

            # Project Status
            test(user.has_perm('rsr.change_publishingstatus', project.publishingstatus))

        # Project Update permissions
        for i, project_update in enumerate(self.project_updates):
            test = self.assertTrue if i == 0 else self.assertFalse
            test(user.has_perm('rsr.change_projectupdate', project_update))

        # Indicator dimension names
        for i, dimension_name in enumerate(self.dimension_names):
            test = self.assertTrue if i == 0 else self.assertFalse
            test(user.has_perm('rsr.change_indicatordimensionname', dimension_name))

        # Indicator dimension values
        for i, dimension_value in enumerate(self.dimension_values):
            test = self.assertTrue if i == 0 else self.assertFalse
            test(user.has_perm('rsr.change_indicatordimensionvalue', dimension_value))

        # Partner Site permissions
        for i, partner_site in enumerate(self.partner_sites):
            test = self.assertTrue if i == 0 else self.assertFalse
            test(user.has_perm('rsr.change_partnersite', partner_site))

        # IatiExport permissions
        for i, iati_export in enumerate(self.iati_exports):
            test = self.assertTrue if i == 0 else self.assertFalse
            test(user.has_perm('rsr.change_iatiexport', iati_export))

        # Result permissions
        for i, result in enumerate(self.results):
            test = self.assertTrue if i == 0 else self.assertFalse
            test(user.has_perm('rsr.change_result', result))

        # Indicator permissions
        for i, indicator in enumerate(self.indicators):
            test = self.assertTrue if i == 0 else self.assertFalse
            test(user.has_perm('rsr.change_indicator', indicator))

        # Indicator period permissions
        for i, period in enumerate(self.indicator_periods):
            test = self.assertTrue if i == 0 else self.assertFalse
            test(user.has_perm('rsr.change_indicatorperiod', period))

        # IndicatorPeriodData permissions
        for i, update in enumerate(self.indicator_updates):
            test = self.assertTrue if i == 0 else self.assertFalse
            test(user.has_perm('rsr.change_indicatorperioddata', update))

        # IndicatorPeriodDataComment permissions
        for i, comment in enumerate(self.indicator_update_comments):
            test = self.assertTrue if i == 0 else self.assertFalse
            test(user.has_perm('rsr.change_indicatorperioddatacomment', comment))

        # AdministrativeLocation permissons
        for i, admin_location in enumerate(self.admin_locations):
            test = self.assertTrue if i == 0 else self.assertFalse
            test(user.has_perm('rsr.change_administrativelocation', admin_location))

        # ProjectLocation permissions
        for i, location in enumerate(self.project_locations):
            test = self.assertTrue if i == 0 else self.assertFalse
            test(user.has_perm('rsr.change_projectlocation', location))

        # OrganisationLocation permissions
        for i, location in enumerate(self.org_locations):
            test = self.assertTrue if i == 0 else self.assertFalse
            test(user.has_perm('rsr.change_organisationlocation', location))

    def test_org_project_editor(self):
        # Given
        user = self.users[0]
        self.make_org_project_editor(user, self.orgs[0])

        # No object
        self.assertTrue(user.has_perm('rsr.change_project', None))

        # "M&E manager" actions
        self.assertFalse(user.has_perm('rsr.do_me_manager_actions'))

        # Organisation permissions
        for i, org in enumerate(self.orgs):
            test = self.assertTrue if i == 0 else self.assertFalse
            test(user.has_perm('rsr.change_organisation', org))

        # User (and related) permissions
        for i, user_ in enumerate(self.users):
            test = self.assertTrue if i == 0 else self.assertFalse
            test(user.has_perm('rsr.change_user', user_))

            # Employment permissions
            employment = user_.approved_employments().first()
            self.assertFalse(user.has_perm('rsr.change_employment', employment))

        # Project (and related) permissions
        for i, project in enumerate(self.projects):
            test = self.assertTrue if i == 0 else self.assertFalse
            test(user.has_perm('rsr.change_project', project))

            # Project Status
            self.assertFalse(user.has_perm('rsr.change_publishingstatus', project.publishingstatus))

        # Project Update permissions
        for i, project_update in enumerate(self.project_updates):
            test = self.assertTrue if i == 0 else self.assertFalse
            test(user.has_perm('rsr.change_projectupdate', project_update))

        # Indicator dimension names
        for i, dimension_name in enumerate(self.dimension_names):
            test = self.assertTrue if i == 0 else self.assertFalse
            test(user.has_perm('rsr.change_indicatordimensionname', dimension_name))

        # Indicator dimension values
        for i, dimension_value in enumerate(self.dimension_values):
            test = self.assertTrue if i == 0 else self.assertFalse
            test(user.has_perm('rsr.change_indicatordimensionvalue', dimension_value))

        # Partner Site permissions
        for i, partner_site in enumerate(self.partner_sites):
            self.assertFalse(user.has_perm('rsr.change_partnersite', partner_site))

        # IatiExport permissions
        for i, iati_export in enumerate(self.iati_exports):
            test = self.assertTrue if i == 0 else self.assertFalse
            self.assertFalse(user.has_perm('rsr.change_iatiexport', iati_export))

        # Result permissions
        for i, result in enumerate(self.results):
            test = self.assertTrue if i == 0 else self.assertFalse
            test(user.has_perm('rsr.change_result', result))

        # Indicator permissions
        for i, indicator in enumerate(self.indicators):
            test = self.assertTrue if i == 0 else self.assertFalse
            test(user.has_perm('rsr.change_indicator', indicator))

        # Indicator period permissions
        for i, period in enumerate(self.indicator_periods):
            test = self.assertTrue if i == 0 else self.assertFalse
            test(user.has_perm('rsr.change_indicatorperiod', period))

        # IndicatorPeriodData permissions
        for i, update in enumerate(self.indicator_updates):
            test = self.assertTrue if i == 0 else self.assertFalse
            test(user.has_perm('rsr.change_indicatorperioddata', update))

        # IndicatorPeriodDataComment permissions
        for i, comment in enumerate(self.indicator_update_comments):
            test = self.assertTrue if i == 0 else self.assertFalse
            test(user.has_perm('rsr.change_indicatorperioddatacomment', comment))

        # AdministrativeLocation permissons
        for i, admin_location in enumerate(self.admin_locations):
            test = self.assertTrue if i == 0 else self.assertFalse
            test(user.has_perm('rsr.change_administrativelocation', admin_location))

        # ProjectLocation permissions
        for i, location in enumerate(self.project_locations):
            test = self.assertTrue if i == 0 else self.assertFalse
            test(user.has_perm('rsr.change_projectlocation', location))

        # OrganisationLocation permissions
        for i, location in enumerate(self.org_locations):
            test = self.assertTrue if i == 0 else self.assertFalse
            test(user.has_perm('rsr.change_organisationlocation', location))

    def test_org_me_manager(self):
        # Given
        user = self.users[0]
        self.make_org_me_manager(user, self.orgs[0])

        # No object
        self.assertTrue(user.has_perm('rsr.change_project', None))

        # "M&E manager" actions
        self.assertTrue(user.has_perm('rsr.do_me_manager_actions'))

        # Organisation permissions
        for i, org in enumerate(self.orgs):
            test = self.assertTrue if i == 0 else self.assertFalse
            test(user.has_perm('rsr.change_organisation', org))

        # User (and related) permissions
        for i, user_ in enumerate(self.users):
            test = self.assertTrue if i == 0 else self.assertFalse
            test(user.has_perm('rsr.change_user', user_))

            # Employment permissions
            employment = user_.approved_employments().first()
            self.assertFalse(user.has_perm('rsr.change_employment', employment))

        # Project (and related) permissions
        for i, project in enumerate(self.projects):
            test = self.assertTrue if i == 0 else self.assertFalse
            test(user.has_perm('rsr.change_project', project))

            # Project Status
            self.assertFalse(user.has_perm('rsr.change_publishingstatus', project.publishingstatus))

        # Project Update permissions
        for i, project_update in enumerate(self.project_updates):
            test = self.assertTrue if i == 0 else self.assertFalse
            test(user.has_perm('rsr.change_projectupdate', project_update))

        # Indicator dimension names
        for i, dimension_name in enumerate(self.dimension_names):
            test = self.assertTrue if i == 0 else self.assertFalse
            test(user.has_perm('rsr.change_indicatordimensionname', dimension_name))

        # Indicator dimension values
        for i, dimension_value in enumerate(self.dimension_values):
            test = self.assertTrue if i == 0 else self.assertFalse
            test(user.has_perm('rsr.change_indicatordimensionvalue', dimension_value))

        # Partner Site permissions
        for i, partner_site in enumerate(self.partner_sites):
            self.assertFalse(user.has_perm('rsr.change_partnersite', partner_site))

        # IatiExport permissions
        for i, iati_export in enumerate(self.iati_exports):
            test = self.assertTrue if i == 0 else self.assertFalse
            self.assertFalse(user.has_perm('rsr.change_iatiexport', iati_export))

        # Result permissions
        for i, result in enumerate(self.results):
            test = self.assertTrue if i == 0 else self.assertFalse
            test(user.has_perm('rsr.change_result', result))

        # Indicator permissions
        for i, indicator in enumerate(self.indicators):
            test = self.assertTrue if i == 0 else self.assertFalse
            test(user.has_perm('rsr.change_indicator', indicator))

        # Indicator period permissions
        for i, period in enumerate(self.indicator_periods):
            test = self.assertTrue if i == 0 else self.assertFalse
            test(user.has_perm('rsr.change_indicatorperiod', period))

        # IndicatorPeriodData permissions
        for i, update in enumerate(self.indicator_updates):
            test = self.assertTrue if i == 0 else self.assertFalse
            test(user.has_perm('rsr.change_indicatorperioddata', update))

        # IndicatorPeriodDataComment permissions
        for i, comment in enumerate(self.indicator_update_comments):
            test = self.assertTrue if i == 0 else self.assertFalse
            test(user.has_perm('rsr.change_indicatorperioddatacomment', comment))

        # AdministrativeLocation permissons
        for i, admin_location in enumerate(self.admin_locations):
            test = self.assertTrue if i == 0 else self.assertFalse
            test(user.has_perm('rsr.change_administrativelocation', admin_location))

        # ProjectLocation permissions
        for i, location in enumerate(self.project_locations):
            test = self.assertTrue if i == 0 else self.assertFalse
            test(user.has_perm('rsr.change_projectlocation', location))

        # OrganisationLocation permissions
        for i, location in enumerate(self.org_locations):
            test = self.assertTrue if i == 0 else self.assertFalse
            test(user.has_perm('rsr.change_organisationlocation', location))

    def test_org_user_manager(self):
        # Given
        user = self.users[0]
        self.make_org_user_manager(user, self.orgs[0])

        # No object
        self.assertFalse(user.has_perm('rsr.change_project', None))

        # "M&E manager" actions
        self.assertFalse(user.has_perm('rsr.do_me_manager_actions'))

        # Organisation permissions
        for i, org in enumerate(self.orgs):
            self.assertFalse(user.has_perm('rsr.change_organisation', org))

        # User (and related) permissions
        for i, user_ in enumerate(self.users):
            test = self.assertTrue if i == 0 else self.assertFalse
            test(user.has_perm('rsr.change_user', user_))

            # Employment permissions
            employment = user_.approved_employments().first()
            test = self.assertTrue if (employment.organisation == self.orgs[0]) else self.assertFalse
            test(user.has_perm('rsr.change_employment', employment))

        # Project (and related) permissions
        for i, project in enumerate(self.projects):
            self.assertFalse(user.has_perm('rsr.change_project', project))
            # Project Status
            self.assertFalse(user.has_perm('rsr.change_publishingstatus', project.publishingstatus))

        # Project Update permissions
        for i, project_update in enumerate(self.project_updates):
            test = self.assertTrue if i == 0 else self.assertFalse
            test(user.has_perm('rsr.change_projectupdate', project_update))

        # Indicator dimension names
        for dimension_name in self.dimension_names:
            self.assertFalse(user.has_perm('rsr.change_indicatordimensionname', dimension_name))

        # Indicator dimension values
        for dimension_value in self.dimension_values:
            self.assertFalse(user.has_perm('rsr.change_indicatordimensionvalue', dimension_value))

        # Partner Site permissions
        for i, partner_site in enumerate(self.partner_sites):
            self.assertFalse(user.has_perm('rsr.change_partnersite', partner_site))

        # IatiExport permissions
        for i, iati_export in enumerate(self.iati_exports):
            test = self.assertTrue if i == 0 else self.assertFalse
            self.assertFalse(user.has_perm('rsr.change_iatiexport', iati_export))

        # Result permissions
        for i, result in enumerate(self.results):
            self.assertFalse(user.has_perm('rsr.change_result', result))

        # Indicator permissions
        for i, indicator in enumerate(self.indicators):
            self.assertFalse(user.has_perm('rsr.change_indicator', indicator))

        # Indicator period permissions
        for i, period in enumerate(self.indicator_periods):
            self.assertFalse(user.has_perm('rsr.change_indicatorperiod', period))

        # IndicatorPeriodData permissions
        for i, update in enumerate(self.indicator_updates):
            self.assertFalse(user.has_perm('rsr.change_indicatorperioddata', update))

        # IndicatorPeriodDataComment permissions
        for i, comment in enumerate(self.indicator_update_comments):
            self.assertFalse(user.has_perm('rsr.change_indicatorperioddatacomment', comment))

        # AdministrativeLocation permissons
        for i, admin_location in enumerate(self.admin_locations):
            self.assertFalse(user.has_perm('rsr.change_administrativelocation', admin_location))

        # ProjectLocation permissions
        for i, location in enumerate(self.project_locations):
            self.assertFalse(user.has_perm('rsr.change_projectlocation', location))

        # OrganisationLocation permissions
        for i, location in enumerate(self.org_locations):
            self.assertFalse(user.has_perm('rsr.change_organisationlocation', location))

    def test_org_user_permissions(self):
        user = self.users[0]

        # None object permissions
        self.assertTrue(user.has_perm('rsr.view_project', None))

        # "M&E manager" actions
        self.assertFalse(user.has_perm('rsr.do_me_manager_actions'))

        # Test no permissions on None, if user doesn't have required employment
        self.assertFalse(user.has_perm('rsr.add_indicatorperioddata'))

        # Project Update permissions
        for i, project_update in enumerate(self.project_updates):
            test = self.assertTrue if i == 0 else self.assertFalse
            test(user.has_perm('rsr.change_projectupdate', project_update))

        for i, project in enumerate(self.projects):
            test = self.assertTrue if i == 0 else self.assertFalse
            test(user.has_perm('rsr.view_project', project))
            self.assertFalse(user.has_perm('rsr.change_project', project))

    def test_org_enumerator_permissions(self):
        user = self.users[0]

        # Change Users employment to Enumerators employment
        employment = user.employers.first()
        group = Group.objects.get(name='Enumerators')
        employment.group = group
        employment.save()

        # Permissions on None
        self.assertTrue(user.has_perm('rsr.view_project', None))

        # "M&E manager" actions
        self.assertFalse(user.has_perm('rsr.do_me_manager_actions'))

        # Project Update permissions
        for i, project_update in enumerate(self.project_updates):
            test = self.assertTrue if i == 0 else self.assertFalse
            test(user.has_perm('rsr.change_projectupdate', project_update))

        # Project permissions
        for i, project in enumerate(self.projects):
            test = self.assertTrue if i == 0 else self.assertFalse
            test(user.has_perm('rsr.view_project', project))
            self.assertFalse(user.has_perm('rsr.change_project', project))

        # Can add indicator
        project = self.projects[0]
        self.assertTrue(user.has_perm('rsr.add_indicatorperioddata', project))
        self.assertTrue(user.has_perm('rsr.change_indicatorperioddata', project))

        # Indicator dimension names
        for i, dimension_name in enumerate(self.dimension_names):
            test = self.assertTrue if i == 0 else self.assertFalse
            test(user.has_perm('rsr.view_indicatordimensionname', dimension_name))

        # Indicator dimension values
        for i, dimension_value in enumerate(self.dimension_values):
            test = self.assertTrue if i == 0 else self.assertFalse
            test(user.has_perm('rsr.view_indicatordimensionvalue', dimension_value))


class UserPermissionedProjectsTestCase(BaseTestCase):
    """Testing that restricting permissions to projects per user works."""

    def setUp(self):
        check_auth_groups(settings.REQUIRED_AUTH_GROUPS)

        # Create organisation
        self.org = Organisation.objects.create(name='org', long_name='org')

        # Create three projects - two of which have the org as a partner
        self.projects = []
        for i in range(3):
            project = Project.objects.create()
            self.projects.append(project)
            if i > 0:
                Partnership.objects.create(organisation=self.org, project=project)

        self.user = PermissionsTestCase.create_user('user@org.org')
        self.group = Group.objects.get(name='Users')
        Employment.objects.create(
            user=self.user, organisation=self.org, group=self.group, is_approved=True
        )

    def test_should_view_all_org_projects(self):
        # Given
        user = self.user

        # Then
        for i, project in enumerate(self.projects):
            if i == 0:
                self.assertFalse(user.has_perm('rsr.view_project', project))
            else:
                self.assertTrue(user.has_perm('rsr.view_project', project))

    def test_should_not_view_any_org_projects(self):
        # Given
        user = self.user

        # When
        # Create a UserProjects entry with no projects in it
        UserProjects.objects.create(user=user, is_restricted=True)

        # Then
        for project in self.projects:
            self.assertFalse(user.has_perm('rsr.view_project', project))

    def test_should_view_only_whitelisted_projects(self):
        # Given
        user = self.user

        # When
        # Assign first and second project to whitelist
        permissions = UserProjects.objects.create(user=user, is_restricted=True)
        for project in self.projects[:2]:
            permissions.projects.add(project)

        # Then
        # Non organisation project is not accessible, even if explicitly given permissions to.
        self.assertFalse(user.has_perm('rsr.view_project', self.projects[0]))
        # This project is on the white list, and is a project of the user's organisation
        self.assertTrue(user.has_perm('rsr.view_project', self.projects[1]))
        # This project is not on the white list so even though it's  an organisation project, access
        # is denied
        self.assertFalse(user.has_perm('rsr.view_project', self.projects[2]))

    def test_user_with_multiple_orgs_can_be_restricted(self):
        # Given
        user = self.user
        org2 = Organisation.objects.create(name='org2', long_name='org2')
        Partnership.objects.create(organisation=org2, project=self.projects[0])
        Employment.objects.create(
            user=user, organisation=org2, group=self.group, is_approved=True
        )
        # When
        # Create a UserProjects entry with no projects in it
        UserProjects.objects.create(user=user, is_restricted=True)

        # Then
        for project in self.projects:
            self.assertFalse(user.has_perm('rsr.view_project', project))


class ProjectHierarchyPermissionsTestCase(BaseTestCase):

    def setUp(self):
        super(ProjectHierarchyPermissionsTestCase, self).setUp()
        self.user = self.create_user('foo@example.com', 'password')
        self.par_owner = self.create_organisation('EUTF', enable_restrictions=True)
        self.project = self.create_project('EUTF Project')
        ProjectHierarchy.objects.create(
            root_project=self.project, organisation=self.par_owner, max_depth=2
        )

    def test_hierarchy_owner_employees_have_access(self):
        # Given
        project = self.create_project('EUTF Child Project')
        self.make_org_project_editor(self.user, self.par_owner)
        self.assertFalse(self.user.has_perm('rsr.change_project', project))

        # When
        self.make_parent(self.project, project)

        # Then
        with self.settings(EUTF_ROOT_PROJECT=self.project.id):
            self.assertTrue(project.in_eutf_hierarchy())
            self.assertTrue(self.user.has_perm('rsr.change_project', project))

    def test_non_hierarchy_owner_employees_donot_have_access(self):
        # Given
        project = self.create_project('EUTF Child Project')
        org = self.create_organisation('Implementing Partner 1')
        self.make_partner(project, org)
        self.make_org_project_editor(self.user, org)
        self.assertTrue(self.user.has_perm('rsr.change_project', project))

        # When
        self.make_parent(self.project, project)

        # Then
        with self.settings(EUTF_ROOT_PROJECT=self.project.id):
            self.assertTrue(project.in_eutf_hierarchy())
            self.assertFalse(self.user.has_perm('rsr.change_project', project))

    def test_normal_access_if_not_enable_restrictions(self):
        # Given
        self.par_owner.enable_restrictions = False
        self.par_owner.save(update_fields=['enable_restrictions'])
        project = self.create_project('EUTF Child Project')
        org = self.create_organisation('Implementing Partner 1')
        self.make_partner(project, org)
        self.make_org_project_editor(self.user, org)
        self.assertTrue(self.user.has_perm('rsr.change_project', project))

        # When
        self.make_parent(self.project, project)

        # Then
        with self.settings(EUTF_ROOT_PROJECT=self.project.id):
            self.assertTrue(project.in_eutf_hierarchy())
            self.assertTrue(self.user.has_perm('rsr.change_project', project))

    def test_hierarchy_owner_collaborator_employees_have_access(self):
        # Given
        project = self.create_project('EUTF Child Project')
        collaborator_org = self.create_organisation('Collaborator: EUTF')
        collaborator_org.content_owner = collaborator_org.original = self.par_owner
        collaborator_org.save(update_fields=['content_owner', 'original'])
        self.make_org_project_editor(self.user, collaborator_org)
        self.assertFalse(self.user.has_perm('rsr.change_project', project))

        # When
        self.make_parent(self.project, project)

        # Then
        with self.settings(EUTF_ROOT_PROJECT=self.project.id):
            self.assertTrue(project.in_eutf_hierarchy())
            self.assertTrue(self.user.has_perm('rsr.change_project', project))

    def test_hierarchy_projects_excluded_for_non_employees(self):
        # Given
        project = self.create_project('EUTF Child Project')
        self.make_parent(self.project, project)
        org = self.create_organisation('Implementing Partner 1')
        self.make_partner(project, org)
        self.make_org_project_editor(self.user, org)
        all_projects = Project.objects.all()

        # When
        projects = user_accessible_projects(
            self.user, self.user.approved_employments(), all_projects)

        # Then
        with self.settings(EUTF_ROOT_PROJECT=self.project.id):
            self.assertTrue(project.in_eutf_hierarchy())
        self.assertNotIn(project, projects)

    def test_projects_visible_to_employees(self):
        # Given
        org = self.create_organisation('Implementing Partner 1')
        self.make_org_project_editor(self.user, org)
        project = self.create_project('EUTF Child Project')
        self.make_partner(project, org)
        self.make_partner(self.project, org)
        all_projects = Project.objects.all()

        # When
        projects = user_accessible_projects(
            self.user, self.user.approved_employments(), all_projects)

        # Then
        self.assertIn(project, projects)
        # Hierarchy project not visible
        self.assertNotIn(self.project, projects)

    def test_hierarchy_projects_listed_for_managed_users(self):
        # Given
        project = self.create_project('EUTF Child Project')
        self.make_parent(self.project, project)
        collaborator_org = self.create_organisation('Collaborator: EUTF')
        collaborator_org.content_owner = collaborator_org.original = self.par_owner
        collaborator_org.save(update_fields=['content_owner', 'original'])
        self.make_org_project_editor(self.user, collaborator_org)
        employments = self.user.approved_employments()
        projects = employments.organisations().all_projects()

        # When
        projects = user_accessible_projects(self.user, employments, projects)

        # Then
        with self.settings(EUTF_ROOT_PROJECT=self.project.id):
            self.assertTrue(project.in_eutf_hierarchy())
        self.assertIn(project, projects)
        self.assertIn(self.project, projects)

    def test_hierarchy_published_only_projects_listed_for_managed_users(self):
        # Given
        project = self.create_project('EUTF Child Project', published=False)
        self.make_parent(self.project, project)
        collaborator_org = self.create_organisation('Collaborator: EUTF')
        collaborator_org.content_owner = collaborator_org.original = self.par_owner
        collaborator_org.save(update_fields=['content_owner', 'original'])
        self.make_org_user_manager(self.user, collaborator_org)
        self.assertFalse(self.user.has_perm('rsr.change_project', project))
        employments = self.user.approved_employments()
        projects = employments.organisations().all_projects().published()

        # When
        projects = user_accessible_projects(self.user, self.user.approved_employments(), projects)

        # Then
        with self.settings(EUTF_ROOT_PROJECT=self.project.id):
            self.assertTrue(project.in_eutf_hierarchy())
        self.assertFalse(project.is_published())
        self.assertNotIn(project, projects)
        self.assertIn(self.project, projects)
