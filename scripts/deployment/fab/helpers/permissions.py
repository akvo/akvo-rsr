# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


class Permissions(object):

    GROUPS_COMMAND = "groups"

    def __init__(self, akvo_permissions_group, deployment_host, feedback):
        self.akvo_permissions_group = akvo_permissions_group
        self.deployment_host = deployment_host
        self.feedback = feedback

    def ensure_user_is_member_of_group(self, user_id, group_name):
        group_membership = self.deployment_host.run(Permissions.GROUPS_COMMAND)
        if group_membership.find(group_name) == -1:
            self.feedback.abort("User [%s] should be a member of group [%s]" % (user_id, group_name))
        else:
            self.feedback.comment("User [%s] is a member of expected group [%s]" % (user_id, group_name))

    def set_akvo_group_permissions_on_path(self, path):
        self.set_akvo_ownership_on_path(path)
        self.deployment_host.sudo("chmod -R g+rws %s" % path)

    def set_akvo_ownership_on_path(self, path):
        self.deployment_host.sudo("chown -R root:%s %s" % (self.akvo_permissions_group, path))
