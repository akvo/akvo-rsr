# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import os, subprocess

DEPLOYMENT_STEPS_HOME = os.path.realpath(os.path.join(os.path.dirname(__file__), '../steps'))


class ScenarioRunner(object):

    def run_step(self, step_name):
        subprocess.call(os.path.join(DEPLOYMENT_STEPS_HOME, step_name + '.py'))
