# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.db import transaction

from rest_framework import serializers
from rest_framework.exceptions import PermissionDenied

from akvo.rest.serializers.rsr_serializer import BaseRSRSerializer
from akvo.rsr.models import User, UserProjects


class UserProjectsSerializer(BaseRSRSerializer):

    class Meta:
        model = UserProjects
        fields = (
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

    def update(self, instance, validated_data):
        """ Custom update method that adds and/or removes projects from the UserProjects.projects
            list
        """
        # Wrap in a transaction to make sure we don't "forget" the original list if there's a
        # PermissionDenied error
        with transaction.atomic():
            try:
                user_projects = UserProjects.objects.get(user=instance)
            except UserProjects.DoesNotExist:
                # If this is the first time we set access for this user we need to create the
                # UserProjects object
                user_projects = UserProjects.objects.create(user=instance)
            user_projects.projects.clear()
            allowable_projects = instance.my_projects()
            for project in validated_data['user_projects']['projects']:
                # Check that each project is accessible by the user
                if not project in allowable_projects:
                    raise PermissionDenied(u"Project {} is not accessible by user {}".format(
                        project.pk, instance.pk))
                user_projects.projects.add(project)
        return instance
