# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import rules

from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group

from .models import (Employment, IatiExport, Organisation, PartnerSite, Project, ProjectUpdate,
                     PublishingStatus)


ADMIN_GROUP = None
PROJECT_EDITOR_GROUP = None
ME_MANAGER_GROUP = None
USER_GROUP = None
USER_MANAGER_GROUP = None


@rules.predicate
def is_rsr_admin(user):
    if user.is_authenticated() and user.get_is_admin():
        return True
    return False


@rules.predicate
def is_org_admin(user, obj):
    global ADMIN_GROUP
    if ADMIN_GROUP is None:
        ADMIN_GROUP = Group.objects.get(name='Admins')
    if not user.is_authenticated():
        return False
    for employment in user.approved_employments():
        if employment.group_id == ADMIN_GROUP.id:
            org = employment.organisation
            if not obj:
                return True
            elif isinstance(obj, Organisation):
                if obj in org.content_owned_organisations():
                    return True
            elif isinstance(obj, get_user_model()) and obj in org.all_users():
                return True
            elif type(obj) == Employment and \
                    obj.organisation in org.content_owned_organisations():
                return True
            elif isinstance(obj, Project) and obj in org.all_projects():
                return True
            elif isinstance(obj, PublishingStatus) and \
                    obj in org.all_projects().publishingstatuses():
                return True
            elif isinstance(obj, PartnerSite) and obj in org.partnersites():
                return True
            elif isinstance(obj, ProjectUpdate) and obj.user == user:
                return True
            elif isinstance(obj, IatiExport) and \
                    obj.reporting_organisation in org.content_owned_organisations():
                return True
            else:
                try:
                    if obj.project and obj.project in employment.organisation.all_projects():
                        return True
                except:
                    pass
                try:
                    if obj.result.project and obj.result.project in \
                            employment.organisation.all_projects():
                        return True
                except:
                    pass
                try:
                    if obj.indicator.result.project and obj.indicator.result.project in \
                            employment.organisation.all_projects():
                        return True
                except:
                    pass
                try:
                    if obj.period.indicator.result.project and \
                        obj.period.indicator.result.project in employment.organisation.\
                            all_projects():
                        return True
                except:
                    pass
                try:
                    if obj.data.period.indicator.result.project and \
                        obj.data.period.indicator.result.project in employment.organisation.\
                            all_projects():
                        return True
                except:
                    pass
                try:
                    if obj.location.location_target and obj.location.location_target in \
                            employment.organisation.all_projects():
                        return True
                except:
                    pass
                try:
                    if obj.transaction.project and obj.transaction.project in \
                            employment.organisation.all_projects():
                        return True
                except:
                    pass
                try:
                    if isinstance(obj.location_target, Project) and \
                            obj.location_target in employment.organisation.all_projects():
                        return True
                except:
                    pass
                try:
                    if isinstance(obj.location_target, Organisation) and \
                            obj.location_target == employment.organisation:
                        return True
                except:
                    pass
    return False


@rules.predicate
def is_org_user_manager(user, obj):
    global USER_MANAGER_GROUP
    if USER_MANAGER_GROUP is None:
        USER_MANAGER_GROUP = Group.objects.get(name='User Managers')
    if not user.is_authenticated():
        return False
    for employment in user.approved_employments():
        if employment.group_id == USER_MANAGER_GROUP.id:
            if not obj:
                return True
            elif isinstance(obj, get_user_model()) and obj in employment.organisation.all_users():
                return True
            elif type(obj) == Employment and \
                    obj.organisation in employment.organisation.content_owned_organisations():
                return True
            elif type(obj) == Project and obj in employment.organisation.all_projects():
                return True
            elif type(obj) == Organisation and \
                    obj in employment.organisation.content_owned_organisations():
                return True
            elif isinstance(obj, ProjectUpdate) and obj.user == user:
                return True
    return False


@rules.predicate
def is_org_project_editor(user, obj):
    global ME_MANAGER_GROUP
    if ME_MANAGER_GROUP is None:
        ME_MANAGER_GROUP = Group.objects.get(name='M&E Managers')
    global PROJECT_EDITOR_GROUP
    if PROJECT_EDITOR_GROUP is None:
        PROJECT_EDITOR_GROUP = Group.objects.get(name='Project Editors')
    if not user.is_authenticated():
        return False
    for employment in user.approved_employments():
        if employment.group_id in set([PROJECT_EDITOR_GROUP.id, ME_MANAGER_GROUP.id]):
            if not obj:
                return True
            if isinstance(obj, Organisation):
                if obj in employment.organisation.content_owned_organisations():
                    return True
            elif isinstance(obj, Project) and obj in employment.organisation.all_projects():
                return True
            elif isinstance(obj, ProjectUpdate) and obj.user == user:
                return True
            else:
                try:
                    if obj.project and obj.project in employment.organisation.all_projects():
                        return True
                except:
                    pass
                try:
                    if obj.result.project and obj.result.project in \
                            employment.organisation.all_projects():
                        return True
                except:
                    pass
                try:
                    if obj.indicator.result.project and obj.indicator.result.project in \
                            employment.organisation.all_projects():
                        return True
                except:
                    pass
                try:
                    if obj.period.indicator.result.project and \
                        obj.period.indicator.result.project in employment.organisation.\
                            all_projects():
                        return True
                except:
                    pass
                try:
                    if obj.data.period.indicator.result.project and \
                        obj.data.period.indicator.result.project in employment.organisation.\
                            all_projects():
                        return True
                except:
                    pass
                try:
                    if obj.location.location_target and obj.location.location_target in \
                            employment.organisation.all_projects():
                        return True
                except:
                    pass
                try:
                    if obj.transaction.project and obj.transaction.project in \
                            employment.organisation.all_projects():
                        return True
                except:
                    pass
                try:
                    if isinstance(obj.location_target, Project) and \
                            obj.location_target in employment.organisation.all_projects():
                        return True
                except:
                    pass
    return False


@rules.predicate
def is_org_user(user, obj):
    global USER_GROUP
    if USER_GROUP is None:
        USER_GROUP = Group.objects.get(name='Users')
    if not user.is_authenticated():
        return False
    for employment in user.approved_employments():
        if employment.group_id == USER_GROUP.id:
            if not obj:
                return True
            if isinstance(obj, Project) and obj in employment.organisation.all_projects():
                return True
            if isinstance(obj, ProjectUpdate) and obj.user == user:
                return True
    return False


@rules.predicate
def is_self(user, obj):
    if not obj:
        return True
    if isinstance(obj, get_user_model()) and obj == user:
        return True
    if isinstance(obj, Employment) and obj.user == user:
        return True
    return False
