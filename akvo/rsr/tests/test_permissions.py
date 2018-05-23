# -*- coding: utf-8 -*-
# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.conf import settings
from django.contrib.auth.models import Group
from django.test import TestCase

from akvo.rsr.models import (
    User, Project, Organisation, Employment, Partnership, ProjectUpdate, PartnerSite, IatiExport,
    Result, Indicator, IndicatorPeriod, IndicatorPeriodData, IndicatorPeriodDataComment,
    AdministrativeLocation, ProjectLocation, OrganisationLocation, UserProjects
)
from akvo.utils import check_auth_groups


class PermissionsTestCase(TestCase):
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

        # Assert user all Users group permissions
        self.test_org_user_permissions()

        # Can add indicator
        project = self.projects[0]
        self.assertTrue(user.has_perm('rsr.add_indicatorperioddata', project))
        self.assertTrue(user.has_perm('rsr.change_indicatorperioddata', project))

    @staticmethod
    def create_user(email, is_active=True, is_admin=False, is_superuser=False):
        """Create a user with the given email."""

        user = User.objects.create(
            email=email,
            username=email,
            is_active=is_active,
            is_admin=is_admin,
            is_superuser=is_superuser,
        )
        return user

    @staticmethod
    def make_org_admin(user, org):
        PermissionsTestCase.make_employment(user, org, 'Admins')

    @staticmethod
    def make_org_project_editor(user, org):
        PermissionsTestCase.make_employment(user, org, 'Project Editors')

    @staticmethod
    def make_org_me_manager(user, org):
        PermissionsTestCase.make_employment(user, org, 'M&E Managers')

    @staticmethod
    def make_org_user_manager(user, org):
        PermissionsTestCase.make_employment(user, org, 'User Managers')

    @staticmethod
    def make_employment(user, org, group_name):
        group = Group.objects.get(name=group_name)
        Employment.objects.create(user=user, organisation=org, group=group, is_approved=True)


class UserPermissionedProjectsTestCase(TestCase):
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
        UserProjects.objects.create(user=user)

        # Then
        for project in self.projects:
            self.assertFalse(user.has_perm('rsr.view_project', project))

    def test_should_view_only_whitelisted_projects(self):
        # Given
        user = self.user

        # When
        # Assign first and second project to whitelist
        permissions = UserProjects.objects.create(user=user)
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

    def test_user_with_multiple_orgs_is_never_restricted(self):
        # Given
        user = self.user
        org2 = Organisation.objects.create(name='org2', long_name='org2')
        Partnership.objects.create(organisation=org2, project=self.projects[0])
        Employment.objects.create(
            user=user, organisation=org2, group=self.group, is_approved=True
        )
        # When
        # Create a UserProjects entry with no projects in it
        UserProjects.objects.create(user=user)

        # Then
        for project in self.projects:
            self.assertTrue(user.has_perm('rsr.view_project', project))
