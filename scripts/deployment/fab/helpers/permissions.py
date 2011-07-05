# -*- coding: utf-8 -*-
# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import fabric.api
import fabric.utils


class PermissionsHelper():

    def __init__(self, environment):
        self.env = environment

    def ensure_user_is_member_of_group(self, group_name):
        group_membership = fabric.api.run("groups")
        if group_membership.find(group_name) == -1:
            fabric.utils.abort("\n>> User [%s] should be a member of group [%s]" % (self.env.user, group_name))
        else:
            print ">> User [%s] is a member of expected group [%s]" % (self.env.user, group_name)

    def set_akvo_group_permissions_on_path(self, path):
        self.set_akvo_ownership_on_path(path)
        fabric.api.sudo("chmod -R g+rws %s" % path)

    def set_akvo_ownership_on_path(self, path):
        fabric.api.sudo("chown -R root:%s %s" % (self.env.akvo_permissions_group, path))
