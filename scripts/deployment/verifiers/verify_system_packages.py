#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from verifiers.syspackages import SystemPackageVerifier


if __name__ == "__main__":
    SystemPackageVerifier().ensure_expected_system_components_are_installed()
