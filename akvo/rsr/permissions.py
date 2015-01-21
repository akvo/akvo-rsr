# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import rules

from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group

from .models import Employment, Organisation, Project


@rules.predicate
def is_rsr_admin(user):
    if user.is_authenticated() and user.get_is_admin():
        return True
    return False

@rules.predicate
def is_org_admin(user, obj):
    if not user.is_authenticated():
        return False
    for employment in user.employers.approved():
        if employment.group == Group.objects.get(name='Admins'):
            if not obj:
                return True
            if type(obj) == Organisation.Organisation and obj == employment.organisation:
                return True
            elif type(obj) == get_user_model() and obj in employment.organisation.all_users():
                return True
            elif type(obj) == Employment.Employment and obj in employment.organisation.employees.all():
                return True
            elif type(obj) == Project.Project and obj in employment.organisation.all_projects():
                return True
            else:
                try:
                    if obj.project and obj.project in employment.organisation.all_projects():
                        return True
                except:
                    pass
                try:
                    if type(obj.location_target) == Project.Project and \
                            obj.location_target in employment.organisation.all_projects():
                        return True
                except:
                    pass
                try:
                    if type(obj.location_target) == Organisation.Organisation and \
                            obj.location_target == employment.organisation:
                        return True
                except:
                    pass
    return False

@rules.predicate
def is_org_user_manager(user, obj):
    if not user.is_authenticated():
        return False
    for employment in user.employers.approved():
        if employment.group == Group.objects.get(name='User managers'):
            if not obj:
                return True
            elif type(obj) == get_user_model() and obj in employment.organisation.all_users():
                return True
            elif type(obj) == Employment.Employment and obj in employment.organisation.employees.all():
                return True
            elif type(obj) == Project.Project and obj in employment.organisation.all_projects():
                return True
    return False

@rules.predicate
def is_org_project_editor(user, obj):
    if not user.is_authenticated():
        return False
    for employment in user.employers.approved():
        if employment.group == Group.objects.get(name='Project editors'):
            if not obj:
                return True
            elif type(obj) == Project.Project and obj in employment.organisation.all_projects():
                return True
            else:
                try:
                    if obj.project and obj.project in employment.organisation.all_projects():
                        return True
                except:
                    pass
                try:
                    if type(obj.location_target) == Project.Project and \
                            obj.location_target in employment.organisation.all_projects():
                        return True
                except:
                    pass
    return False

@rules.predicate
def is_org_user(user, obj):
    if not user.is_authenticated():
        return False
    for employment in user.employers.approved():
        if employment.group == Group.objects.get(name='Users'):
            if type(obj) == Project.Project and obj in employment.organisation.all_projects():
                return True
    return False

@rules.predicate
def is_self(user, obj):
    if not obj:
        return True
    if type(obj) == get_user_model() and obj == user:
        return True
    return False
