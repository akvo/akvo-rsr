# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.shortcuts import get_object_or_404

from rest_framework import filters
from rest_framework import viewsets
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import DjangoObjectPermissions

from .models import TastyTokenAuthentication


class BaseRSRViewSet(viewsets.ModelViewSet):
    """
    Base class used for the view sets for RSR models. Provides unified auth and perms settings.
    """
    authentication_classes = (SessionAuthentication, TastyTokenAuthentication, )
    permission_classes = (DjangoObjectPermissions, )
    filter_backends = (filters.DjangoFilterBackend, filters.OrderingFilter, )
    ordering_fields = '__all__'
