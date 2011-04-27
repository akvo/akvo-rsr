#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module. 
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import os

PROJECT_ROOT_DIR = os.path.realpath(os.path.join(os.path.dirname(__file__), '..', '..'))
MEDIAROOT_DIR = os.path.join(PROJECT_ROOT_DIR, 'akvo/mediaroot')
STATIC_DIR = os.path.realpath(os.path.join(PROJECT_ROOT_DIR, '../static'))

def teamcity_warning(message):
    message = message.replace("'", "|'").replace("]", "|]")
    print "##teamcity[message text='%s' status='WARNING']" % (message)

def remove_link(link_path):
    if os.path.lexists(link_path):
        print ">> removing link: [%s]" % (link_path)
        os.unlink(link_path)
    else:
        teamcity_warning(">> [warning] expected link to be removed does not exist: [%s]" % (link_path))

def remove_project_links_to_prevent_subsequent_build_failure():
    print '\nRemoving project links for post CI clean-up:'
    remove_link(os.path.join(PROJECT_ROOT_DIR, 'akvo/settings.py'))
    remove_link(os.path.join(MEDIAROOT_DIR, 'admin'))
    remove_link(os.path.join(MEDIAROOT_DIR, 'db'))
    remove_link(os.path.join(STATIC_DIR, 'akvo'))
    remove_link(os.path.join(STATIC_DIR, 'akvo-env'))
    remove_link(os.path.join(STATIC_DIR, 'db'))
    remove_link(os.path.join(STATIC_DIR, 'django'))
    print
