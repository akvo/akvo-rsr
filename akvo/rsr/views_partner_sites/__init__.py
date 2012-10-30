    # -*- coding: utf-8 -*-
"""
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please
    see < http://www.gnu.org/licenses/agpl.html >.
"""
from __future__ import absolute_import

from akvo.rsr.views import global_organisation_projects_map_json

from akvo.rsr.views_partner_sites.auth import SignInView, signout
from akvo.rsr.views_partner_sites.base import BaseProjectListView
from akvo.rsr.views_partner_sites.error import ForbiddenView, NotFoundView
from akvo.rsr.views_partner_sites.partner import PartnerListView, PartnerView
from akvo.rsr.views_partner_sites.project import (ProjectFundingView,
    ProjectMainView, ProjectUpdateAddView, ProjectUpdateEditView,
    ProjectUpdateListView, ProjectUpdateView, ProjectDonationThanksView)
from akvo.rsr.views_partner_sites.widgets import (GetWidgetView,
    ProjectMapView, ProjectCordinates)


__all__ = [
    'ForbiddenView',
    'GetWidgetView',
    'global_organisation_projects_map_json',
    'HomeView',
    'NotFoundView',
    'OrganisationMapView',
    'PartnerListView',
    'PartnerView',
    'ProjectCordinates',
    'ProjectDonationThanksView',
    'ProjectFundingView',
    'ProjectMainView',
    'ProjectMapView',
    'ProjectUpdateAddView',
    'ProjectUpdateEditView',
    'ProjectUpdateListView',
    'ProjectUpdateView',
    'SignInView',
    'signout',
    ]


class HomeView(BaseProjectListView):
    """Represents the home page (/) on a partner site"""
    template_name = 'partner_sites/home.html'
