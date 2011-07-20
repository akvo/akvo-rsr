# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import fabric.utils


class ExecutionFeedback(object):

    def comment(self, message):
        print message

    def abort(self, message):
        fabric.utils.abort(message) # also raises SystemExit(message)
