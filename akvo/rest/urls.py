# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.
See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""

import views

from django.conf.urls import patterns, url, include
from rest_framework import routers

router = routers.DefaultRouter()

router.register(r'benchmark', views.BenchmarkViewSet)
router.register(r'benchmark_name', views.BenchmarknameViewSet)
router.register(r'budget_item', views.BudgetItemViewSet)
router.register(r'budget_item_label', views.BudgetItemLabelViewSet)
router.register(r'category', views.CategoryViewSet)
router.register(r'country', views.CountryViewSet)
router.register(r'employment', views.EmploymentViewSet)
router.register(r'focus_area', views.FocusAreaViewSet)
router.register(r'goal', views.GoalViewSet)
router.register(r'indicator', views.IndicatorViewSet)
router.register(r'indicator_period', views.IndicatorPeriodViewSet)
router.register(r'internal_organisation_id',
                views.InternalOrganisationIDViewSet)
router.register(r'invoice', views.InvoiceViewSet)
router.register(r'keyword', views.KeywordViewSet)
router.register(r'legacy_data', views.LegacyDataViewSet)
router.register(r'link', views.LinkViewSet)
router.register(r'organisation', views.OrganisationViewSet)
router.register(r'organisation_location', views.OrganisationLocationViewSet)
router.register(r'partner_site', views.PartnerSiteViewSet)
router.register(r'partner_type', views.PartnerTypeViewSet)
router.register(r'partnership', views.PartnershipViewSet)
router.register(r'planned_disbursement', views.PlannedDisbursementViewSet)
router.register(r'policy_marker', views.PolicyMarkerViewSet)
router.register(r'project', views.ProjectViewSet)
router.register(r'project_extra', views.ProjectExtraViewSet,
                base_name='project_extra')
router.register(r'project_comment', views.ProjectCommentViewSet)
router.register(r'project_condition', views.ProjectConditionViewSet)
router.register(r'project_contact', views.ProjectContactViewSet)
router.register(r'project_document', views.ProjectDocumentViewSet)
router.register(r'project_location', views.ProjectLocationViewSet)
router.register(r'project_update_extra', views.ProjectUpdateExtraViewSet,
                base_name='project_update_extra')
router.register(r'project_update', views.ProjectUpdateViewSet,
                base_name='project_update')
router.register(r'project_update_location', views.ProjectUpdateLocationViewSet)
router.register(r'publishing_status', views.PublishingStatusViewSet)
router.register(r'recipient_country', views.RecipientCountryViewSet)
router.register(r'recipient_region', views.RecipientRegionViewSet)
router.register(r'related_project', views.RelatedProjectViewSet)
router.register(r'result', views.ResultViewSet)
router.register(r'sector', views.SectorViewSet)
router.register(r'transaction', views.TransactionViewSet)
router.register(r'user', views.UserViewSet)

# Wire up our API using automatic URL routing.
# Additionally, we include URLs for non-viewsets (functional views).

urlpatterns = patterns(
    '',
    url(r'^', include(router.urls)),
    url(r'^employment/(?P<pk>[0-9]+)/approve/$',
        views.approve_employment,
        name='approve_employment'),
    url(r'^employment/(?P<pk>[0-9]+)/set_group/(?P<group_id>[0-9]+)/$',
        views.set_group,
        name='set_group'),
    url(r'^user/(?P<pk>[0-9]+)/change_password/$',
        views.change_password,
        name='user_change_password'),
    url(r'^user/(?P<pk>[0-9]+)/update_details/$',
        views.update_details,
        name='user_update_details'),
    url(r'^user/(?P<pk>[0-9]+)/request_organisation/$',
        views.request_organisation,
        name='user_request_organisation'),
)

# Typeahead
urlpatterns += patterns(
    '',
    url(r'typeaheads/countries$',
        views.typeahead_country,
        name='country_typeahead'),
    url(r'typeaheads/organisations$',
        views.typeahead_organisation,
        name='organisation_typeahead'),
    url(r'typeaheads/projects$',
        views.typeahead_project,
        name='project_typeahead'),
    url(r'typeaheads/project_updates$',
        views.typeahead_projectupdate,
        name='projectupdate_typeahead'),

    # url(r'typeaheads/sectors$',
    #     views.typeahead_sector,
    #     name='sector_typeahead'),
)
