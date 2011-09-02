# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


class SystemPackageDependencyCollection(object):

    def __init__(self, package_specifications, package_inspector, feedback):
        self.dependencies = []
        self.package_inspector = package_inspector
        self.feedback = feedback

        self.add_from_specifications(package_specifications)

    def __len__(self):
        return len(self.dependencies)

    def add_from_specifications(self, package_specifications):
        for package_spec in package_specifications:
            self.add(SystemPackageDependency.from_specification(package_spec))

    def add(self, system_package_dependency):
        self.dependencies.append(system_package_dependency)

    def find_unmet_dependencies(self):
        unmet_dependencies = []

        for dependency in self.dependencies:
            if not dependency.is_met(self.package_inspector, self.feedback):
                unmet_dependencies.append(dependency.package_name)

        return unmet_dependencies


class SystemPackageDependency(object):

    def __init__(self, package_name, minimum_package_version):
        self.package_name = package_name
        self.minimum_package_version = minimum_package_version

    @staticmethod
    def from_specification(package_spec):
        return SystemPackageDependency(package_spec['name'], package_spec['version'])

    def __eq__(self, dependency):
        return (self.package_name == dependency.package_name and
                self.minimum_package_version == dependency.minimum_package_version)

    def __ne__(self, dependency):
        return not self.__eq__(dependency)

    def is_met(self, package_inspector, feedback):
        dependency_is_met = False
        package = package_inspector.info_for(self.package_name)
        if package.is_installed():
            if package.version >= self.minimum_package_version:
                feedback.comment("Found expected system package: %s" % package.name_and_installed_version)
                dependency_is_met = True
            else:
                feedback.warn("Found %s system package but version is outdated: %s (expected minimum %s)" % (package.name,
                                    package.version, self.minimum_package_version))
        else:
            feedback.warn("Missing system package: %s" % package.name)

        return dependency_is_met
