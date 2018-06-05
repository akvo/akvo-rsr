# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.contrib.auth import get_user_model
from django.db import transaction

from rest_framework import serializers
from rest_framework.exceptions import PermissionDenied

from akvo.rest.serializers.rsr_serializer import BaseRSRSerializer
from akvo.rsr.models import User, UserProjects


class UserProjectsSerializer(BaseRSRSerializer):

    class Meta:
        model = UserProjects
        fields = (
            'is_restricted',
            'projects',
        )


class UserProjectAccessSerializer(BaseRSRSerializer):

    all_projects = serializers.SerializerMethodField()
    user_projects = UserProjectsSerializer()

    class Meta:
        model = User
        fields = (
            'id',
            'user_projects',
            'all_projects',
        )

    def __init__(self, *args, **kwargs):
        """ Delete the 'absolute_url' field added in BaseRSRSerializer.__init__().
        It's neither correct nor do we want this data to be visible.
        """
        super(UserProjectAccessSerializer, self).__init__(*args, **kwargs)
        del self.fields['absolute_url']

    def get_all_projects(self, obj):
        return obj.user.my_projects().values('id', 'title')

    def update(self, user, validated_data):
        """ Custom update method that adds and/or removes projects from the UserProjects.projects
            list
        """
        # Wrap in a transaction to make sure we don't "forget" the original list if there's a
        # PermissionDenied error
        with transaction.atomic():
            user_projects_data = validated_data.get('user_projects', None)

            if user_projects_data is not None:
                user_projects, _created = UserProjects.objects.get_or_create(user=user)

                is_restricted = user_projects_data.get('is_restricted', None)
                if is_restricted is not None:
                    user_projects.is_restricted = is_restricted
                    user_projects.save()

                allowable_projects = user.my_projects()
                projects = user_projects_data.get('projects', None)
                if projects is not None:
                    if not _created:
                        user_projects.projects.clear()
                    for project in projects:
                        # Check that each project is accessible by the user
                        if not project in allowable_projects:
                            raise PermissionDenied(u"Project {} is not accessible by user {}".format(
                                project.pk, user.pk))
                        user_projects.projects.add(project)
        # For reasons I don't understand, on the original instance, user, the fields on
        # UserProjects for the instance are not updated resulting in returning stale data if there
        # have been changes. Fix by fetching a fresh instance of User.
        return get_user_model().objects.get(pk=user.pk)
