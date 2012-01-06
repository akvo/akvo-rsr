# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


class DeploymentUserVerifier(object):

    def __init__(self, permissions):
        self.permissions = permissions

    def verify_sudo_and_web_admin_permissions_for(self, user_id):
        self.permissions.exit_if_user_does_not_have_sudo_permission(user_id)
        self.permissions.exit_if_user_is_not_member_of_web_group(user_id)
