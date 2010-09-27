#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module. 
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import os, shutil

def configure_acceptance_test_settings_for_ci():
    acceptance_test_root_path = os.path.realpath(os.path.join(os.path.dirname(__file__), '../../tests/akvo/acceptance'))
    
    shutil.copy(os.path.join(acceptance_test_root_path, 'test_settings_ci.py'),
                os.path.join(acceptance_test_root_path, 'test_settings.py'))
