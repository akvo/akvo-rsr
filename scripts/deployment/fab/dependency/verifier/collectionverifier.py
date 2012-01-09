# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


class DependencyCollectionVerifier(object):

    def __init__(self):
        self.unmet_dependencies = []

    def verify(self, dependency_collection):
        self.unmet_dependencies = dependency_collection.find_unmet_dependencies()

    def not_all_dependencies_met(self):
        return len(self.unmet_dependencies) > 0

    def unmet_dependency_names(self):
        return " ".join(self.unmet_dependencies)
