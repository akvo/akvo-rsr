# -*- coding: utf-8 -*-
"""
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please
    see < http://www.gnu.org/licenses/agpl.html >.
"""
from __future__ import absolute_import

from django.views.generic import TemplateView, ListView


__all__ = [
    'OrganisationMapView',
    ]

class OrganisationMapView(TemplateView):
    template_name = 'partner_sites/widgets/projetcs_map.html'

