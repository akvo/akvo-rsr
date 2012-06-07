# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import os, subprocess

from fab.tasks.runner import ProcessRunner

DEPLOYMENT_STEPS_HOME = os.path.realpath(os.path.join(os.path.dirname(__file__), '../steps'))


class ScenarioRunner(object):

    def run_step(self, step_name, host_config_specification=None):
        exit_code = 0
        deployment_script_path = os.path.join(DEPLOYMENT_STEPS_HOME, step_name + '.py')

        if host_config_specification:
            print '>> Running deployment step [%s] with host config specification [%s]' % (step_name, host_config_specification)
            ProcessRunner().execute([deployment_script_path, host_config_specification])
        else:
            print '>> Running deployment step [%s]' % step_name
            ProcessRunner().execute(deployment_script_path)
