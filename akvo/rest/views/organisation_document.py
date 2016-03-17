# -*- coding: utf-8 -*-
"""Akvo RSR is covered by the GNU Affero General Public License.
See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from akvo.rest.serializers import (OrganisationDocumentSerializer,
                                   OrganisationDocumentCountrySerializer,
                                   OrganisationDocumentCategorySerializer)
from akvo.rest.viewsets import BaseRSRViewSet
from akvo.rsr.models import (OrganisationDocument, OrganisationDocumentCountry,
                             OrganisationDocumentCategory)


class OrganisationDocumentViewSet(BaseRSRViewSet):
    """
    API endpoint that allows organisation documents to be viewed or edited.
    """
    queryset = OrganisationDocument.objects.all()
    serializer_class = OrganisationDocumentSerializer


class OrganisationDocumentCountryViewSet(BaseRSRViewSet):
    """
    API endpoint that allows organisation document countries to be viewed or edited.
    """
    queryset = OrganisationDocumentCountry.objects.all()
    serializer_class = OrganisationDocumentCountrySerializer


class OrganisationDocumentCategoryViewSet(BaseRSRViewSet):
    """
    API endpoint that allows organisation document categories to be viewed or edited.
    """
    queryset = OrganisationDocumentCategory.objects.all()
    serializer_class = OrganisationDocumentCategorySerializer
