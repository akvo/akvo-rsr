# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from rest_framework import exceptions
from rest_framework.views import exception_handler as drf_exception_handler

from akvo.rsr.models.related_project import MultipleParentsDisallowed, ParentChangeDisallowed


def exception_handler(exc, context):
    """Returns the response that should be used for any given exception.

    Override to handle custom errors raised by RSR code

    """

    if isinstance(exc, (MultipleParentsDisallowed, ParentChangeDisallowed)):
        exc = exceptions.ValidationError({'related_project': exc.message})

    return drf_exception_handler(exc, context)
