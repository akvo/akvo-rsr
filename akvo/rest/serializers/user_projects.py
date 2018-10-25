# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.contrib.auth import get_user_model
from django.db import transaction
from django.utils.translation import ugettext_lazy as _

from rest_framework import serializers

from akvo.rest.serializers.rsr_serializer import BaseRSRSerializer
from akvo.rsr.models import User, UserProjects, Organisation, Project
from akvo.rsr.models.user_projects import restrict_projects, unrestrict_projects


class UserProjectsSerializer(BaseRSRSerializer):

    may_unrestrict = serializers.SerializerMethodField()

    class Meta:
        model = UserProjects
        fields = (
            'is_restricted',
            'projects',
            'may_unrestrict',
        )

    def get_may_unrestrict(self, obj):
        admin = self.context['request'].user.user
        user = obj.user

        return not self.disallow_unrestrict(admin, user)

    @staticmethod
    def disallow_unrestrict(admin, user):
        """ Determine if the admin is allowed to unrestrict a user
            This depends on there not being any restricted projects for the user that the admin
            cannot administer
        """
        try:
            user_projects = UserProjects.objects.get(user=user)
        except UserProjects.DoesNotExist:
            return True

        admin_projects = set(admin.admin_projects().values_list('pk', flat=True))

        user_orgs = user.get_non_admin_employment_orgs()
        user_associated_projects = user_orgs.all_projects().values_list('pk', flat=True)
        # restricted projects are those not included in user_projects.projects.all()
        user_restricted_projects = user_associated_projects.exclude(
            pk__in=user_projects.projects.all()
        ).values_list('pk', flat=True)
        # if user_restricted_projects has projects that are not in admin_projects then restrictions
        # should not be lifted
        return bool(set(user_restricted_projects).difference(admin_projects))


class UserProjectAccessSerializer(BaseRSRSerializer):
    """ This serializer includes the "synthetic" field organisation_groups which groups the projects
        according to which organisations that the admin or the user has in common with the projects.

       organisation_groups is read only and is used to populate the React client in a straight
       mapping of the data.
    """

    organisation_groups = serializers.SerializerMethodField()
    user_projects = UserProjectsSerializer()

    class Meta:
        model = User
        fields = (
            'user_projects',
            'organisation_groups',
        )
        read_only_fields = ('organisation_groups',)

    def __init__(self, *args, **kwargs):
        """ Delete the 'absolute_url' field added in BaseRSRSerializer.__init__().
        It's neither correct nor do we want this data to be visible.
        """
        super(UserProjectAccessSerializer, self).__init__(*args, **kwargs)
        del self.fields['absolute_url']

        user = self.instance
        # for some reason the serializer is called three times when accessing the endpoint,
        # therefore we check for the existence of a UserProjects object to not have to call
        # restrict_projects more than once
        try:
            UserProjects.objects.get(user=user)
        except UserProjects.DoesNotExist:
            admin = self.context['request'].user
            # Make sure we have a UserProjects object, but don't change an existing one
            restrict_projects(admin, user, Project.objects.none())

    def validate(self, data):
        """ Here validate that we can unrestrict a user. This check is only done if is_restricted is
            present in the data and is False
        """
        is_restricted = data.get('user_projects', []).get('is_restricted', None)
        if is_restricted is False:

            admin = self.context['request'].user.user
            user = self.instance

            if UserProjectsSerializer.disallow_unrestrict(admin, user):
                raise serializers.ValidationError(
                    _(u'This user may not be unrestricted at this time.')
                )

        return data

    def get_organisation_groups(self, obj):

        admin = self.context['request'].user.user
        admin_orgs = admin.get_admin_employment_orgs()
        # All projects that I may admin
        admin_associated_projects = admin.admin_projects()

        user = obj.user
        # All orgs the user is employed by as a non-admin
        user_orgs = user.get_non_admin_employment_orgs()
        # All projects the user is associated with
        user_associated_project = user_orgs.all_projects()
        try:
            user_projects = UserProjects.objects.get(user=user)
        except UserProjects.DoesNotExist:
            user_projects = None

        # All projects the admin and the user have in common.
        # It is those projects that the admin may restrict
        common_projects = admin_associated_projects & user_associated_project

        # The project list is split on partners shared by the project and the admin or the user
        project_sets = {}
        admin_orgs_pks = set(admin_orgs.values_list('pk', flat=True))
        user_orgs_pks = set(user_orgs.values_list('pk', flat=True))
        for project in common_projects:
            # Determine which partners the the project has in common with the admin and/or the user
            # See the tests at rest.test_project_access for more detail on the resulting data
            # structure
            project_partners_pks = set(project.all_partners().values_list('pk', flat=True))
            admin_org_for_project_pks = admin_orgs_pks & project_partners_pks
            user_org_for_project_pks = user_orgs_pks & project_partners_pks
            # Crete a tuple of the org's pks so it can be used as a dict key
            common_orgs_pks = tuple(admin_org_for_project_pks | user_org_for_project_pks)
            project_sets.setdefault(common_orgs_pks, []).append(project)

        projects_grouped_by_orgs = []
        user_projects_projects = user_projects.projects.all() if user_projects else False
        for orgs_pks, projects in project_sets.items():
            orgs = Organisation.objects.filter(pk__in=orgs_pks)
            orgs_string = ', '.join([org.name for org in orgs])
            project_group = []
            for project in projects:
                project_group.append(dict(
                    id=project.pk,
                    title=project.title,
                    subtitle=project.subtitle,
                    access=project in user_projects_projects
                ))
            projects_grouped_by_orgs.append(dict(organisations=orgs_string, projects=project_group))

        return projects_grouped_by_orgs

    def update(self, user, validated_data):
        """ Custom update method that adds and/or removes projects from the UserProjects.projects
            list
        """
        # Wrap in a transaction to make sure we don't "forget" the original list if there's a
        # PermissionDenied error
        with transaction.atomic():
            user_projects_data = validated_data.get('user_projects', None)

            if user_projects_data is not None:

                admin = self.context['request'].user.user

                # Check if we have a list of projects. These are all projects
                # that the admin can grant access to. The user may have access
                # to other projects, which this admin cannot restrict/grant
                # access to.
                accessible_projects = user_projects_data.get('projects', None)
                accessible_project_pks = set(p.pk for p in accessible_projects or {})

                # The projects where the admin has restricted access by
                # unselecting previously selected check boxes
                try:
                    projects = UserProjects.objects.get(user=user).projects.values_list('pk', flat=True)
                except UserProjects.DoesNotExist:
                    projects = []

                admin_associated_project_pks = admin.admin_projects().values_list('pk', flat=True)
                currently_accessible_projects = set(projects) & set(admin_associated_project_pks)
                restricted_projects = currently_accessible_projects - accessible_project_pks
                user_projects = restrict_projects(
                    admin, user, Project.objects.filter(pk__in=restricted_projects)
                )

                # The projects where the admin has granted access by selecting
                # previously unselected check boxes
                unrestricted_projects = (
                    accessible_project_pks - set(user_projects.projects.values_list('pk', flat=True))
                )
                user_projects = unrestrict_projects(
                    admin, user, Project.objects.filter(pk__in=unrestricted_projects)
                )

                # Finally set is_restricted
                is_restricted = user_projects_data.get('is_restricted', None)
                if is_restricted is not None:
                    user_projects.is_restricted = is_restricted
                    user_projects.save()

        # For reasons I don't understand, on the original instance, user, the fields on
        # UserProjects for the instance are not updated resulting in returning stale data if there
        # have been changes. Fix by fetching a fresh instance of User.
        return get_user_model().objects.get(pk=user.pk)
