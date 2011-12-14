# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import imp, os

DEPLOYMENT_SCRIPTS_HOME = os.path.realpath(os.path.join(os.path.dirname(__file__), '..'))

imp.load_source("syspath_verification", os.path.join(DEPLOYMENT_SCRIPTS_HOME, 'verifiers/ensure_syspath_contains_testing_path_dependencies.py'))


# Use "fab --list" or "fab --shortlist" to display the list of available tasks

import fab.tasks.app.deployment
import fab.tasks.data.retrieval
import fab.tasks.database.rsr
import fab.tasks.environment.linux.systempackages
import fab.tasks.environment.python.installer
import fab.tasks.environment.python.systempackages
import fab.tasks.environment.python.virtualenv.rsr
