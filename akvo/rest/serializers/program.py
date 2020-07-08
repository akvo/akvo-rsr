#!/usr/bin/env python3
# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from rest_framework import serializers

from akvo.rsr.models import ProjectHierarchy
from .rsr_serializer import BaseRSRSerializer


class ProgramSerializer(BaseRSRSerializer):

    id = serializers.ReadOnlyField(source='root_project.pk')
    name = serializers.ReadOnlyField(source='root_project.title')
    project_count = serializers.SerializerMethodField()
    can_edit_program = serializers.SerializerMethodField()
    can_create_projects = serializers.SerializerMethodField()

    class Meta:
        model = ProjectHierarchy
        fields = ('id', 'name', 'project_count', 'can_edit_program', 'can_create_projects')

    def get_project_count(self, program):
        return program.project_count

    def get_can_edit_program(self, program):
        user = self.context['request'].user
        if user.is_superuser or user.is_admin:
            return True
        return user.has_perm('rsr.change_project', program)

    def get_can_create_projects(self, program):
        user = self.context['request'].user
        return user.can_create_projects_in_program(program)
