# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from rest_framework import viewsets

from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated, BasePermission, SAFE_METHODS

from akvo.rest.models import TastyTokenAuthentication
from akvo.utils import RSR_REST_USER


class IsRestUserOrReadOnly(BasePermission):
    """ Simple and API security.
        Assign all models to a group and add the RSR rest API user permission of all models to the group.
    """
    def has_permission(self, request, view):

        model_name = view.serializer_class.Meta.model.__name__.lower()
        has_permission = request.user.has_perms(["rsr.{}_{}".format(RSR_REST_USER, model_name)])

        return (
            request.method in SAFE_METHODS or
                request.user and
                request.user.is_authenticated() and
                has_permission
        )


class BaseRSRViewSet(viewsets.ModelViewSet):
    """
    Base class used for the view sets for RSR models. Provides unified auth and perms settings.
    """
    authentication_classes = (SessionAuthentication, TastyTokenAuthentication)
    permission_classes = (IsRestUserOrReadOnly,)