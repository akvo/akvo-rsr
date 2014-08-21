# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.contrib.auth.models import Group, User
from django.db import models
from django.utils.translation import ugettext_lazy as _

from tastypie.models import ApiKey

from akvo.utils import GROUP_RSR_EDITORS, GROUP_RSR_PARTNER_ADMINS, GROUP_RSR_PARTNER_EDITORS
from akvo.utils import groups_from_user

from ..fields import ValidXMLTextField

from .project_update import ProjectUpdate


class UserProfile(models.Model): #, PermissionBase, WorkflowBase):
    '''
    Extra info about a user.
    '''
    user = models.OneToOneField(User, related_name='userprofile')
    organisation = models.ForeignKey('Organisation')

    notes = ValidXMLTextField(verbose_name=_("Notes and comments"), blank=True, default='')

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'user profile')
        verbose_name_plural = _(u'user profiles')
        ordering = ['user__username', ]

    def __unicode__(self):
        return self.user.username

    def user_name(self):
        return self.__unicode__()

    def organisation_name(self):
        return self.organisation.name

    def updates(self):
        """
        return all updates created by the user
        """
        return ProjectUpdate.objects.filter(user=self.user).order_by('-created_at')

    def latest_update_date(self):
        updates = self.updates()
        if updates:
            return updates[0].created_at
        else:
            return None

    #methods that interact with the User model
    def get_is_active(self):
        return self.user.is_active
    get_is_active.boolean = True  # make pretty icons in the admin list view
    get_is_active.short_description = _(u'user is activated (may log in)')

    def set_is_active(self, set_it):
        self.user.is_active = set_it
        self.user.save()

    def get_is_staff(self):
        return self.user.is_staff
    get_is_staff.boolean = True  # make pretty icons in the admin list view

    def set_is_staff(self, set_it):
        self.user.is_staff = set_it
        self.user.save()

    def get_is_rsr_admin(self):
        return GROUP_RSR_EDITORS in groups_from_user(self.user)

    def get_is_org_admin(self):
        return GROUP_RSR_PARTNER_ADMINS in groups_from_user(self.user)
    get_is_org_admin.boolean = True  # make pretty icons in the admin list view
    get_is_org_admin.short_description = _(u'user is an organisation administrator')

    def set_is_org_admin(self, set_it):
        if set_it:
            self._add_user_to_group(GROUP_RSR_PARTNER_ADMINS)
        else:
            self._remove_user_from_group(GROUP_RSR_PARTNER_ADMINS)

    def get_is_org_editor(self):
        return GROUP_RSR_PARTNER_EDITORS in groups_from_user(self.user)
    get_is_org_editor.boolean = True  # make pretty icons in the admin list view
    get_is_org_editor.short_description = _(u'user is a project editor')

    def set_is_org_editor(self, set_it):
        if set_it:
            self._add_user_to_group(GROUP_RSR_PARTNER_EDITORS)
        else:
            self._remove_user_from_group(GROUP_RSR_PARTNER_EDITORS)

    def _add_user_to_group(self, group_name):
        group = Group.objects.get(name=group_name)
        user = self.user
        if not group in user.groups.all():
            user.groups.add(group)
            user.save()

    def _remove_user_from_group(self, group_name):
        group = Group.objects.get(name=group_name)
        user = self.user
        if group in user.groups.all():
            user.groups.remove(group)
            user.save()

    def my_projects(self):
        return self.organisation.all_projects()

    def allow_edit(self, project):
        """ Support partner organisations may "take ownership" of projects, meaning that editing of them is restricted
        This method is used "on top" of normal checking for user access to projects since it is only relevant for
        Partner users
        """
        allow_edit = True
        partner_admins_allowed = []
        # compile list of support orgs that limit editing
        for partner in project.support_partners():
            if not partner.allow_edit:
                allow_edit = False
                partner_admins_allowed.append(partner)
        # no-one limits editing, all systems go
        if allow_edit:
            return True
        # Only Partner admins on the list of "limiters" list may edit
        else:
            if self.get_is_org_admin() and self.organisation in partner_admins_allowed:
                return True
        return False

    @property
    def api_key(self, key=""):
        try:
            api_key = ApiKey.objects.get(user=self.user)
            key = api_key.key
        except:
            pass
        return key
