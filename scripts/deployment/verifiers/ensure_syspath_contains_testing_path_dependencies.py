#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import imp, os

imp.load_source("syspath_verifiers", os.path.join(os.path.dirname(__file__), 'syspath.py'))
from syspath_verifiers import SysPathVerifier


SysPathVerifier().ensure_syspath_contains_deployment_scripts_home()
SysPathVerifier().ensure_syspath_contains_testing_helpers_home()
