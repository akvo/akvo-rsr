# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from fab.environment.python.brew import PythonBrew


class PythonInstaller(object):

    def __init__(self, pythonbrew):
        self.pythonbrew = pythonbrew

    @staticmethod
    def create_instance(host_controller):
        return PythonInstaller(PythonBrew(host_controller))

    def ensure_python_is_installed_with_version(self, python_version):
        self.pythonbrew.ensure_pythonbrew_is_installed()
        self.pythonbrew.install_python(python_version)
        self.pythonbrew.enable_python_version_for_all_users(python_version)
