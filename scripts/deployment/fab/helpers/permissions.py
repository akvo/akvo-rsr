# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


class Permissions(object):

    GROUPS_COMMAND = "groups"

    def __init__(self, deployer_config, fabric_runner, feedback):
        self.config = deployer_config
        self.fabric = fabric_runner
        self.feedback = feedback

    def ensure_user_is_member_of_group(self, user_id, group_name):
        group_membership = self.fabric.run(Permissions.GROUPS_COMMAND)
        if group_membership.find(group_name) == -1:
            self.feedback.abort("\n>> User [%s] should be a member of group [%s]" % (user_id, group_name))
        else:
            self.feedback.comment(">> User [%s] is a member of expected group [%s]" % (user_id, group_name))

    def set_akvo_group_permissions_on_path(self, path):
        self.set_akvo_ownership_on_path(path)
        self.fabric.sudo("chmod -R g+rws %s" % path)

    def set_akvo_ownership_on_path(self, path):
        self.fabric.sudo("chown -R root:%s %s" % (self.config.akvo_permissions_group, path))
