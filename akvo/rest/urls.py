# -*- coding: utf-8 -*-
"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

import views

from django.conf.urls import patterns, url, include
from rest_framework import routers

router = routers.DefaultRouter()

router.register(r'administrative_location', views.AdministrativeLocationViewSet)
router.register(r'benchmark', views.BenchmarkViewSet)
router.register(r'benchmark_name', views.BenchmarknameViewSet)
router.register(r'budget_item', views.BudgetItemViewSet)
router.register(r'budget_item_label', views.BudgetItemLabelViewSet)
router.register(r'category', views.CategoryViewSet)
router.register(r'country', views.CountryViewSet)
router.register(r'country_budget_item', views.CountryBudgetItemViewSet)
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
router.register(r'organisation_map_location', views.MapOrganisationLocationViewSet)
router.register(r'partner_site', views.PartnerSiteViewSet)
router.register(r'partner_type', views.PartnerTypeViewSet)
router.register(r'partnership', views.PartnershipViewSet)
router.register(r'planned_disbursement', views.PlannedDisbursementViewSet)
router.register(r'policy_marker', views.PolicyMarkerViewSet)
router.register(r'project', views.ProjectViewSet)
router.register(r'project_extra', views.ProjectExtraViewSet,
                base_name='project_extra')
router.register(r'project_up', views.ProjectUpViewSet,
                base_name='project_up')
router.register(r'project_comment', views.ProjectCommentViewSet)
router.register(r'project_condition', views.ProjectConditionViewSet)
router.register(r'project_contact', views.ProjectContactViewSet)
router.register(r'project_document', views.ProjectDocumentViewSet)
router.register(r'project_location', views.ProjectLocationViewSet)
router.register(r'project_map_location', views.MapProjectLocationViewSet)

router.register(r'project_update_extra', views.ProjectUpdateExtraViewSet,
                base_name='project_update_extra')
router.register(r'project_update', views.ProjectUpdateViewSet,
                base_name='project_update')
router.register(r'project_update_location', views.ProjectUpdateLocationViewSet)
router.register(r'project_update_map_location', views.MapProjectUpdateLocationViewSet)

router.register(r'publishing_status', views.PublishingStatusViewSet)
router.register(r'recipient_country', views.RecipientCountryViewSet)
router.register(r'recipient_region', views.RecipientRegionViewSet)
router.register(r'related_project', views.RelatedProjectViewSet)
router.register(r'result', views.ResultViewSet)
router.register(r'sector', views.SectorViewSet)
router.register(r'transaction', views.TransactionViewSet)
router.register(r'transaction_sector', views.TransactionSectorViewSet)
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
    url(r'^project_iati_check/(?P<pk>[0-9]+)/$',
        views.ProjectIatiCheckView.as_view(),
        name='project_iati_check'),
)

# Project admin
urlpatterns += patterns(
    '',
    url(r'^project/(?P<project_pk>[0-9]+)/admin_delete_document/(?P<document_pk>[0-9]+)/$',
        views.project_admin_delete_document,
        name='project_admin_delete_document'),
    url(r'^project/(?P<pk>[0-9]+)/admin_delete_photo/$',
        views.project_admin_delete_photo,
        name='project_admin_delete_photo'),
    url(r'^project/(?P<pk>[0-9]+)/admin_step_1/$',
        views.project_admin_step1,
        name='project_admin_step1'),
    url(r'^project/(?P<pk>[0-9]+)/admin_step_2/$',
        views.project_admin_step2,
        name='project_admin_step2'),
    url(r'^project/(?P<pk>[0-9]+)/admin_step_3/$',
        views.project_admin_step3,
        name='project_admin_step3'),
    url(r'^project/(?P<pk>[0-9]+)/admin_step_4/$',
        views.project_admin_step4,
        name='project_admin_step4'),
    url(r'^project/(?P<pk>[0-9]+)/admin_step_5/$',
        views.project_admin_step5,
        name='project_admin_step5'),
    url(r'^project/(?P<pk>[0-9]+)/admin_step_6/$',
        views.project_admin_step6,
        name='project_admin_step6'),
    url(r'^project/(?P<pk>[0-9]+)/admin_step_7/$',
        views.project_admin_step7,
        name='project_admin_step7'),
    url(r'^project/(?P<pk>[0-9]+)/admin_step_8/$',
        views.project_admin_step8,
        name='project_admin_step8'),
    url(r'^project/(?P<pk>[0-9]+)/admin_step_9/$',
        views.project_admin_step9,
        name='project_admin_step9'),
    url(r'^project/(?P<pk>[0-9]+)/admin_step_10/$',
        views.project_admin_step10,
        name='project_admin_step10'),
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
