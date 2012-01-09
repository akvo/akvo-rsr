# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


class GroupsCommand(object):

    def __init__(self, host_controller):
        self.host_controller = host_controller

    def user(self, user_name):
        self.user_name = user_name
        return self

    def is_a_member_of(self, group_name):
         return self.host_controller.run("groups %s" % self.user_name).find(group_name) >= 0
