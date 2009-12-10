#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module. 
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import os

PROJECT_ROOT_DIR = os.path.realpath(os.path.join(os.path.dirname(__file__), '..'))
MEDIAROOT_DIR = os.path.join(PROJECT_ROOT_DIR, 'akvo/mediaroot')

def remove_link(link_path):
    print ">> removing link: [%s]" % (link_path)
    os.unlink(link_path)

def remove_project_links_to_prevent_subsequent_build_failure():
    print '\nremoving project links for post CI clean-up:'
    remove_link(os.path.join(PROJECT_ROOT_DIR, 'akvo/settings.py'))
    remove_link(os.path.join(MEDIAROOT_DIR, 'admin'))
    remove_link(os.path.join(MEDIAROOT_DIR, 'db'))
    print

