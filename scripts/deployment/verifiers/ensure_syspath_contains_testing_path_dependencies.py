#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import imp, os

SCRIPT_DIR = os.path.dirname(__file__)

imp.load_source("syspath_verifiers", os.path.join(SCRIPT_DIR, 'syspath.py'))

from syspath_verifiers import SysPath

DEPLOYMENT_SCRIPTS_HOME = os.path.realpath(os.path.join(SCRIPT_DIR, '..'))
TEST_EXECUTION_HELPERS_HOME = os.path.realpath(os.path.join(SCRIPT_DIR, '../../../tests/shared'))

SysPath.ensure_syspath_contains(DEPLOYMENT_SCRIPTS_HOME)
SysPath.ensure_syspath_contains(TEST_EXECUTION_HELPERS_HOME)
