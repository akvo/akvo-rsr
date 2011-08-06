# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


class AkvoPermissions(object):

    GROUPS_COMMAND = "groups"
    WEB_USER_GROUP = "www-edit"

    def __init__(self, remote_host):
        self.remote_host = remote_host
        self.feedback = remote_host.feedback

    def ensure_user_is_member_of_web_group(self, user_id):
        group_membership = self.remote_host.run(AkvoPermissions.GROUPS_COMMAND)
        if group_membership.find(AkvoPermissions.WEB_USER_GROUP) == -1:
            self.feedback.abort("User [%s] should be a member of group [%s]" % (user_id, AkvoPermissions.WEB_USER_GROUP))
        else:
            self.feedback.comment("User [%s] is a member of expected group [%s]" % (user_id, AkvoPermissions.WEB_USER_GROUP))

    def set_web_group_permissions_on_directory(self, dir_path):
        self.set_web_group_ownership_on_directory(dir_path)
        self.remote_host.sudo("chmod -R g+rws %s" % dir_path)

    def set_web_group_ownership_on_directory(self, dir_path):
        self.remote_host.sudo("chown -R root:%s %s" % (AkvoPermissions.WEB_USER_GROUP, dir_path))
