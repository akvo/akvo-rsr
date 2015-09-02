# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


class ProjectException(Exception):
    """
    A specific Exception used in IATI imports for errors belonging to a project.
    Assumes that a project is passed together with the message in a dictionary.
    """
    pass
