# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


class SystemPackageVerifier(object):

    def __init__(self, dependency_verifier, feedback):
        self.dependency_verifier = dependency_verifier
        self.feedback = feedback

    def exit_if_package_dependencies_not_met(self, dependency_collection):
        self.feedback.comment("Verifying expected system packages")
        self.dependency_verifier.verify(dependency_collection)

        if self.dependency_verifier.not_all_dependencies_met():
            self.feedback.abort("Missing system packages or packages with incorrect versions: %s" %
                                self.dependency_verifier.unmet_dependency_names())
