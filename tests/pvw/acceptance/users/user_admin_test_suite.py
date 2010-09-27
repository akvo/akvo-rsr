#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import nose

from seleniumclient import SeleniumClient

from users.sign_in_or_register_test import SignInOrRegisterTest
from users.organisation_selection_test import OrganisationSelectionTest
from users.user_details_entry_test import UserDetailsEntryTest
from users.user_registration_test import UserRegistrationTest

def user_admin_suite():
    print "RSR user admin test suite:"

    return nose.suite.LazySuite([load_tests_from(SignInOrRegisterTest),
                                 load_tests_from(OrganisationSelectionTest),
                                 load_tests_from(UserDetailsEntryTest),
                                 load_tests_from(UserRegistrationTest)])

def load_tests_from(test_case):
    return nose.loader.TestLoader().loadTestsFromTestCase(test_case)

if __name__ == "__main__":
    nose.core.TextTestRunner(verbosity=2).run(user_admin_suite())
    SeleniumClient().stop()
