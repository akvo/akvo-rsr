# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


class DataFixtureValidator(object):

    def __init__(self, host_controller):
        self.host_controller = host_controller
        self.feedback = host_controller.feedback

    def validate(self, data_fixture_file_path):
        self.feedback.comment('Validating data fixture: %s' % data_fixture_file_path)
        self.host_controller.run('xmllint --noout --memory %s' % data_fixture_file_path)
