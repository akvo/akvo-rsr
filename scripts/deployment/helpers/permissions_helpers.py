# -*- coding: utf-8 -*-
# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import sys

from fabric.api import env, run, sudo


def ensure_user_is_member_of_group(group_name):
    group_membership = run("groups")
    if group_membership.find(group_name) == -1:
        print "\n>> User [%s] should be a member of group [%s]" % (env.user, group_name)
        sys.exit(1)

def set_akvo_group_permissions_on_path(path):
    sudo("chown -R root:%s %s" % (env.akvo_permissions_group, path))
    sudo("chmod -R g+rws %s" % path)
