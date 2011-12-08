# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


class PythonBrewInstaller(object):

    PYTHONBREW_VERSION = "1.1"

    def __init__(self, host_controller):
        self.host_controller = host_controller
        self.feedback = host_controller.feedback

    def ensure_pythonbrew_is_installed(self):
        if not self._pythonbrew_is_installed():
            self._install_pythonbrew()

    def _pythonbrew_is_installed(self):
        return self._installed_pythonbrew_path().find("pythonbrew") > 0

    def _installed_pythonbrew_path(self):
        with self.host_controller.hide_command_and_output():
            return self.host_controller.run("which pythonbrew")

    def _install_pythonbrew(self):
        self.feedback.comment("Installing pythonbrew")
        self.host_controller.sudo("curl -kL http://xrl.us/pythonbrewinstall | bash")
