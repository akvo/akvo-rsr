#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import imp, os, sys

imp.load_source("syspath", os.path.join(os.path.dirname(__file__), 'syspath.py'))

from syspath import SysPathVerifier

SysPathVerifier().exit_if_deployment_scripts_home_not_on_syspath()


from verifiers.syspackages import SystemPackageVerifier


if __name__ == "__main__":
    try:
        SystemPackageVerifier().ensure_expected_system_components_are_installed()
    except Exception, exception:
        print exception
        sys.exit(1)
