# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from verifiers.helpers.system import command_exists_on_path, library_exists, library_file, header_path_exists


class DependencyVerifier:

    def __init__(self):
        self.dependencies = []
        self.missing_items = []

    def add(self, dependency):
        self.dependencies.append(dependency)

    def verify_all(self):
        for dependency in self.dependencies:
            dependency.verify(self.missing_items)

    def display_dependency_warnings(self):
        for dependency in self.dependencies:
            dependency.warn_if_condition_not_met()

    def not_all_dependencies_met(self):
        return len(self.missing_items) > 0

    def missing_dependencies(self):
        return ", ".join(self.missing_items)


class BaseDependency:

    def __init__(self):
        self.condition_met = False

    def check_dependency_and_display_verification_message(self, dependency_name, missing_items_list):
        if not self.condition_met:
            missing_items_list.append(dependency_name)
        self.display_verification_message_for(dependency_name)

    def display_verification_message_for(self, dependency_name):
        print "%s (%s)" % (dependency_name, "yes" if self.condition_met else "no")


class CommandDependency(BaseDependency):

    def __init__(self, command, package_name, dependant_python_module):
        self.command = command
        self.package_name = package_name
        self.python_module = dependant_python_module

    def verify(self, missing_items_list):
        self.condition_met = command_exists_on_path(self.command)
        self.check_dependency_and_display_verification_message(self.package_name, missing_items_list)

    def warn_if_condition_not_met(self):
        if not self.condition_met:
            print "Command is not on path: %s (required to build %s)" % (self.command, self.python_module)


class HeaderDirectoryDependency(BaseDependency):

    def __init__(self, library_name, dependant_python_module):
        self.library_name = library_name
        self.python_module = dependant_python_module

    def verify(self, missing_items_list):
        self.condition_met = header_path_exists(self.library_name)
        self.check_dependency_and_display_verification_message(self.library_name, missing_items_list)

    def warn_if_condition_not_met(self):
        if not self.condition_met:
            print "Library headers are missing: %s (required to build %s)" % (self.library_name, self.python_module)


class HeaderFileDependency(BaseDependency):

    def __init__(self, library_name, header_file, dependant_python_module):
        self.library_name = library_name
        self.header_file = header_file if header_file.endswith(".h") else header_file + ".h"
        self.python_module = dependant_python_module

    def verify(self, missing_items_list):
        self.condition_met = header_path_exists(self.header_file)
        self.check_dependency_and_display_verification_message(self.library_name, missing_items_list)

    def warn_if_condition_not_met(self):
        if not self.condition_met:
            print "Library header is missing: %s [%s] (required to build %s)" % (self.library_name,
                self.header_file, self.python_module)


class LibraryDependency(BaseDependency):

    def __init__(self, library_name, dependant_python_module):
        self.library_name = library_name
        self.python_module = dependant_python_module

    def verify(self, missing_items_list):
        self.condition_met = library_exists(self.library_name)
        self.check_dependency_and_display_verification_message(self.library_name, missing_items_list)

    def warn_if_condition_not_met(self):
        if not self.condition_met:
            print "Library is missing: %s (required to build %s)" % (library_file(self.library_name), self.python_module)
