# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.contrib.auth import get_user_model
from django.db import transaction

from rest_framework import serializers
from rest_framework.exceptions import PermissionDenied

from akvo.rest.serializers.rsr_serializer import BaseRSRSerializer
from akvo.rsr.models import User, UserProjects, Organisation, Project
from akvo.rsr.models.user_projects import restrict_projects, unrestrict_projects


class UserProjectsSerializer(BaseRSRSerializer):

    class Meta:
        model = UserProjects
        fields = (
            'is_restricted',
            'projects',
        )


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
        for project in common_projects:
            # Determine which partners the the project has in common with the admin and/or the user
            # See the tests at rest.test_project_access for more detail on the resulting data
            # structure
            project_partners = project.all_partners()
            admin_orgs_for_project = admin_orgs & project_partners
            user_orgs_for_project = user_orgs & project_partners
            admin_org_pks = admin_orgs_for_project.values_list('pk', flat=True)
            user_org_pks = user_orgs_for_project.values_list('pk', flat=True)
            # Crete a tuple of the org's pks so it can be used as a dict key
            common_orgs_pks = tuple(set().union(admin_org_pks, user_org_pks))
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
                # All projects the admin can restrict
                admin_associated_projects = admin.admin_projects()

                # Check if we have a list of projects. These are all projects that the admin can
                # grant access to
                accessible_projects = user_projects_data.get('projects', None)

                # To set restrictions, we restrict all admin_associated_projects and then add
                # back the accessible_projects.

                if accessible_projects is not None:
                    user_projects = restrict_projects(admin, user, admin_associated_projects)

                # If accessible_projects is None no changes to restrictions should be made, so we
                # call restrict_projects with an empty Project QS to get the current one back
                # without modifying it
                else:
                    accessible_projects = Project.objects.none()
                    user_projects = restrict_projects(admin, user, accessible_projects)

                # Now we unrestrict the accessible_projects
                if accessible_projects:
                    unrestrict_projects(admin, user, accessible_projects,
                                        user_projects.is_restricted)

                # Finally set is_restricted
                is_restricted = user_projects_data.get('is_restricted', None)
                if is_restricted is not None:
                    user_projects.is_restricted = is_restricted
                    user_projects.save()

        # For reasons I don't understand, on the original instance, user, the fields on
        # UserProjects for the instance are not updated resulting in returning stale data if there
        # have been changes. Fix by fetching a fresh instance of User.
        return get_user_model().objects.get(pk=user.pk)
