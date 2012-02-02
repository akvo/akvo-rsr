# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from fab.dependency.verifier.collectionverifier import DependencyCollectionVerifier


class LinuxPackageVerifier(object):

    def __init__(self, dependency_verifier, host_controller):
        self.dependency_verifier = dependency_verifier
        self.host_controller = host_controller
        self.feedback = host_controller.feedback

    @staticmethod
    def create_with(host_controller):
        return LinuxPackageVerifier(DependencyCollectionVerifier(), host_controller)

    def update_package_sources(self):
        self.feedback.comment("Updating system package sources")
        self.host_controller.sudo("aptitude update")

    def exit_if_package_dependencies_not_met(self, dependency_collection):
        self.feedback.comment("Verifying expected system packages")
        self.dependency_verifier.verify(dependency_collection)

        if self.dependency_verifier.not_all_dependencies_met():
            self.feedback.abort("Missing system packages or packages with incorrect versions: %s" %
                                self.dependency_verifier.unmet_dependency_names())
