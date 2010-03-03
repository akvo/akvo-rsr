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

def suite():
    print "RSR user admin test suite:"
    sign_in_or_register_suite = nose.loader.TestLoader().loadTestsFromTestCase(SignInOrRegisterTest)
    organisation_selection_suite = nose.loader.TestLoader().loadTestsFromTestCase(OrganisationSelectionTest)
    user_details_entry_suite = nose.loader.TestLoader().loadTestsFromTestCase(UserDetailsEntryTest)
    user_registration_suite = nose.loader.TestLoader().loadTestsFromTestCase(UserRegistrationTest)

    return nose.suite.LazySuite([sign_in_or_register_suite,
                                 organisation_selection_suite,
                                 user_details_entry_suite,
                                 user_registration_suite])

if __name__ == "__main__":
    nose.core.TextTestRunner(verbosity=2).run(suite())
    SeleniumClient().stop()
