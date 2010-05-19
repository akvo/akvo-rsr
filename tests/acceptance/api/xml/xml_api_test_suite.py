#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from helpers.nosetestloaders import *

from api.xml.all_projects_test import AllProjectsTest
from api.xml.all_sponsored_projects_test import AllSponsoredProjectsTest
from api.xml.single_project_test import SingleProjectTest
from api.xml.all_project_updates_for_given_project_test import AllProjectUpdatesForGivenProjectTest
from api.xml.single_project_update_test import SingleProjectUpdateTest

def xml_api_suite():
    print "RSR XML API test suite:"

    return create_test_suite_from_classes([AllProjectsTest,
                                           AllSponsoredProjectsTest,
                                           SingleProjectTest,
                                           AllProjectUpdatesForGivenProjectTest,
                                           SingleProjectUpdateTest])

if __name__ == "__main__":
    run_test_suite(xml_api_suite())
