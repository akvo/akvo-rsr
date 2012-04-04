#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from testing.helpers.execution import TestRunner, TestSuiteLoader

from fab.tests.verifiers.config_file_verifier_test import ConfigFileVerifierTest
from fab.tests.verifiers.deployment_user_verifier_test import DeploymentUserVerifierTest
from fab.tests.verifiers.rsr_credentials_verifier_test import RSRCredentialsVerifierTest
from fab.tests.verifiers.rsr_settings_verifier_test import RSRSettingsVerifierTest


def verifiers_suite():
    return TestSuiteLoader().create_suite_from_classes([ConfigFileVerifierTest, DeploymentUserVerifierTest,
                                                        RSRCredentialsVerifierTest, RSRSettingsVerifierTest])

if __name__ == '__main__':
    TestRunner().run_test_suite(verifiers_suite())
