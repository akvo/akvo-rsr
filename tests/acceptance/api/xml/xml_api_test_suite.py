#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from helpers.testexecution import *

from api.xml.all_projects_test import AllProjectsTest
from api.xml.all_le_sponsored_projects_test import AllLESponsoredProjectsTest
from api.xml.single_project_test import SingleProjectTest
from api.xml.all_project_updates_for_given_project_test import AllProjectUpdatesForGivenProjectTest
from api.xml.single_project_update_test import SingleProjectUpdateTest

from test_settings import RSR_API_PATH, RSR_MEDIA_PATH

def describe_suite():
    print "Using API path:   %s" % (RSR_API_PATH)
    print "Using media path: %s" % (RSR_MEDIA_PATH)

def xml_api_suite():
    describe_suite()

    return create_test_suite_from_classes([AllProjectsTest,
                                           AllLESponsoredProjectsTest,
                                           SingleProjectTest,
                                           AllProjectUpdatesForGivenProjectTest,
                                           SingleProjectUpdateTest])

if __name__ == "__main__":
    describe_suite()
    run_test_suite(xml_api_suite())
