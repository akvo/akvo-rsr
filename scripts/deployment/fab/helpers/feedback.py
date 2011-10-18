# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import fabric.utils


class ExecutionFeedback(object):

    def comment(self, message):
        self._puts(self._add_comment_prefix_to(message), True, '\n', True)

    def _puts(self, formatted_message, display_host_prefix, line_ending, flush_output):
        fabric.utils.puts(formatted_message, display_host_prefix, line_ending, flush_output)

    def abort(self, message):
        self._abort(self._add_warning_prefix_to(message))

    def _abort(self, formatted_message):
        fabric.utils.abort(formatted_message) # calls sys.exit(1) and raises SystemExit(formatted_message)

    def warn(self, message):
        self._warn(self._add_warning_prefix_to(message))

    def _warn(self, formatted_message):
        fabric.utils.warn(formatted_message)

    def _add_comment_prefix_to(self, message):
        return ">> %s" % message

    def _add_warning_prefix_to(self, message):
        return "## %s" % message
