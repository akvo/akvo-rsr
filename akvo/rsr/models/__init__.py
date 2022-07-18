# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import logging

from django.db.models.signals import pre_save, post_save, post_delete
from django.contrib.admin.models import LogEntry

from akvo.rest.authentication import create_api_key

from ..signals import (
    change_name_of_file_on_change, change_name_of_file_on_create,
    create_publishing_status, create_organisation_account,
    act_on_log_entry, employment_post_save, employment_pre_save,
    update_project_budget, update_project_funding
)

from .benchmark import Benchmark, Benchmarkname
from .budget_item import BudgetItem, BudgetItemLabel, CountryBudgetItem
from .country import Country, RecipientCountry
from .custom_field import OrganisationCustomField, ProjectCustomField
from .crs_add import CrsAdd, CrsAddOtherFlag
from .category import Category
from .employment import Employment
from .focus_area import FocusArea
from .fss import Fss, FssForecast
from .goal import Goal
from .humanitarian_scope import HumanitarianScope
from .iati_activity_export import IatiActivityExport
from .iati_check import IatiCheck
from .iati_export import IatiExport
from .result import (DefaultPeriod, Disaggregation, Indicator,
                     IndicatorDimensionName, IndicatorDimensionValue,
                     IndicatorLabel, IndicatorPeriod, IndicatorPeriodData,
                     IndicatorPeriodDataFile, IndicatorPeriodDataPhoto,
                     IndicatorPeriodDataComment, IndicatorReference,
                     IndicatorPeriodActualLocation,
                     IndicatorPeriodTargetLocation, NarrativeReport, PeriodActualValue,
                     PeriodDisaggregation, IndicatorPeriodDisaggregation, DisaggregationTarget,
                     DisaggregationContribution, IndicatorDisaggregationTarget,
                     IndicatorCustomField, IndicatorCustomValue, IndicatorPeriodLabel)
from .internal_organisation_id import InternalOrganisationID
from .keyword import Keyword
from .legacy_data import LegacyData
from .link import Link
from .location import (OrganisationLocation, ProjectLocation, ProjectUpdateLocation,
                       AdministrativeLocation)
from .login_log import LoginLog
from .organisation import Organisation
from .organisation_indicator_label import OrganisationIndicatorLabel
from .organisation_account import OrganisationAccount
from .organisation_budget import (OrganisationCountryBudget, OrganisationRegionBudget,
                                  OrganisationRecipientOrgBudget, OrganisationTotalBudget,
                                  OrganisationTotalExpenditure, OrganisationCountryBudgetLine,
                                  OrganisationExpenseLine, OrganisationRecipientOrgBudgetLine,
                                  OrganisationRegionBudgetLine, OrganisationTotalBudgetLine)
from .organisation_document import (OrganisationDocument, OrganisationDocumentCategory,
                                    OrganisationDocumentCountry)
from .organisation_codelist import OrganisationCodelist
from .partner_site import PartnerSite
from .partnership import Partnership
from .planned_disbursement import PlannedDisbursement
from .policy_marker import PolicyMarker
from .project import Project, project_directory_cache_key
from .project_condition import ProjectCondition
from .project_contact import ProjectContact
from .project_document import ProjectDocument, ProjectDocumentCategory
from .project_editor_validation import ProjectEditorValidation, ProjectEditorValidationSet
from .project_hierarchy import ProjectHierarchy
from .project_role import ProjectRole
from .project_thumbnail import ProjectThumbnail
from .project_update import ProjectUpdate, ProjectUpdatePhoto
from .publishing_status import PublishingStatus
from .region import RecipientRegion
from .related_project import RelatedProject
from .report import Report, ReportFormat
from .result import Result
from .sector import Sector
from .transaction import Transaction, TransactionSector
from .external_project import ExternalProject
from .user import User

logger = logging.getLogger('akvo.rsr')

__all__ = [
    'AdministrativeLocation',
    'Benchmark',
    'Benchmarkname',
    'BudgetItem',
    'BudgetItemLabel',
    'CountryBudgetItem',
    'Country',
    'RecipientCountry',
    'Category',
    'CrsAdd',
    'CrsAddOtherFlag',
    'DefaultPeriod',
    'Employment',
    'ExternalProject',
    'FocusArea',
    'Fss',
    'FssForecast',
    'Goal',
    'HumanitarianScope',
    'IatiActivityExport',
    'IatiCheck',
    'IatiExport',
    'Indicator',
    'IndicatorCustomField',
    'IndicatorCustomValue',
    'IndicatorDimensionName',
    'IndicatorDimensionValue',
    'IndicatorLabel',
    'IndicatorPeriod',
    'IndicatorPeriodActualLocation',
    'IndicatorPeriodData',
    'IndicatorPeriodDataFile',
    'IndicatorPeriodDataPhoto',
    'IndicatorPeriodLabel',
    'Disaggregation',
    'DisaggregationTarget',
    'IndicatorDisaggregationTarget',
    'DisaggregationContribution',
    'IndicatorPeriodDataComment',
    'IndicatorPeriodTargetLocation',
    'IndicatorReference',
    'InternalOrganisationID',
    'Keyword',
    'LegacyData',
    'LoginLog',
    'Link',
    'NarrativeReport',
    'Organisation',
    'OrganisationAccount',
    'OrganisationCodelist',
    'OrganisationCountryBudget',
    'OrganisationCountryBudgetLine',
    'OrganisationCustomField',
    'OrganisationDocument',
    'OrganisationDocumentCategory',
    'OrganisationDocumentCountry',
    'OrganisationExpenseLine',
    'OrganisationIndicatorLabel',
    'OrganisationLocation',
    'OrganisationRecipientOrgBudget',
    'OrganisationRecipientOrgBudgetLine',
    'OrganisationRegionBudget',
    'OrganisationRegionBudgetLine',
    'OrganisationTotalBudget',
    'OrganisationTotalBudgetLine',
    'OrganisationTotalExpenditure',
    'ProjectLocation',
    'ProjectUpdateLocation',
    'PartnerSite',
    'Partnership',
    'PeriodActualValue',
    'PeriodDisaggregation',
    'IndicatorPeriodDisaggregation',
    'PlannedDisbursement',
    'PolicyMarker',
    'Project',
    'ProjectCondition',
    'ProjectContact',
    'ProjectCustomField',
    'ProjectDocument',
    'ProjectDocumentCategory',
    'ProjectEditorValidation',
    'ProjectEditorValidationSet',
    'ProjectHierarchy',
    'ProjectRole',
    'ProjectThumbnail',
    'ProjectUpdate',
    'ProjectUpdatePhoto',
    'PublishingStatus',
    'RecipientRegion',
    'RelatedProject',
    'Report',
    'ReportFormat',
    'Result',
    'Sector',
    'Transaction',
    'TransactionSector',
    'User',
]

# Permission rules
import rules
from ..permissions import (is_rsr_admin, is_org_admin, is_org_user_manager,
                           is_org_me_manager, is_org_me_manager_or_project_editor,
                           is_org_user, is_self, is_org_enumerator, is_own)

rules.add_perm('rsr', rules.always_allow)

rules.add_perm('rsr.add_benchmarkname', is_rsr_admin)
rules.add_perm('rsr.change_benchmarkname', is_rsr_admin)

rules.add_perm('rsr.add_country', is_rsr_admin)
rules.add_perm('rsr.change_country', is_rsr_admin)

rules.add_perm('rsr.add_budgetitemlabel', is_rsr_admin)
rules.add_perm('rsr.change_budgetitemlabel', is_rsr_admin)

rules.add_perm('rsr.add_category', is_rsr_admin)
rules.add_perm('rsr.change_category', is_rsr_admin)

rules.add_perm('rsr.add_focusarea', is_rsr_admin)
rules.add_perm('rsr.change_focusarea', is_rsr_admin)

rules.add_perm('rsr.add_indicator', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.change_indicator', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.delete_indicator', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.view_indicator', is_org_enumerator)

rules.add_perm('rsr.add_indicatorlabel', is_rsr_admin | is_org_admin |is_org_me_manager_or_project_editor)
rules.add_perm('rsr.change_indicatorlabel', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.delete_indicatorlabel', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)

rules.add_perm('rsr.add_indicatorperiod', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.change_indicatorperiod', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.delete_indicatorperiod', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.do_me_manager_actions', is_rsr_admin | is_org_admin | is_org_me_manager)
rules.add_perm('rsr.view_indicatorperiod', is_org_enumerator)

rules.add_perm('rsr.add_indicatorperiodlabel', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.change_indicatorperiodlabel', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.delete_indicatorperiodlabel', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.view_indicatorperiodlabel', is_org_enumerator)

rules.add_perm('rsr.add_indicatorreference', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.change_indicatorreference', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.delete_indicatorreference', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.view_indicatorreference', is_org_enumerator)

rules.add_perm('rsr.add_defaultperiod', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.change_defaultperiod', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.delete_defaultperiod', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)

rules.add_perm('rsr.add_disaggregationtarget', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.change_disaggregationtarget', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.delete_disaggregationtarget', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.view_disaggregationtarget', is_org_enumerator)

rules.add_perm('rsr.add_indicatordisaggregationtarget', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.change_indicatordisaggregationtarget', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.delete_indicatordisaggregationtarget', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.view_indicatordisaggregationtarget', is_org_enumerator)

rules.add_perm('rsr.change_indicatorperioddisaggregation', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.view_indicatorperioddisaggregation', is_org_enumerator)

rules.add_perm('rsr.view_indicatorperioddata', is_rsr_admin | is_org_admin | is_org_me_manager)
rules.add_perm(
    'rsr.add_indicatorperioddata',
    is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor | is_org_enumerator
)
rules.add_perm(
    'rsr.change_indicatorperioddata',
    is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor | is_org_enumerator
)
rules.add_perm(
    'rsr.delete_indicatorperioddata',
    is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor | is_org_enumerator
)

rules.add_perm('rsr.add_indicatordimensionname', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.change_indicatordimensionname', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.delete_indicatordimensionname', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.view_indicatordimensionname', is_org_enumerator)

rules.add_perm('rsr.add_indicatordimensionvalue', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.change_indicatordimensionvalue', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.delete_indicatordimensionvalue', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.view_indicatordimensionvalue', is_org_enumerator)

rules.add_perm('rsr.add_disaggregation', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.change_disaggregation', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.delete_disaggregation', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.view_disaggregation', is_org_enumerator)

rules.add_perm('rsr.add_indicatorperioddatacomment', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor | is_org_enumerator)
rules.add_perm('rsr.change_indicatorperioddatacomment', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.delete_indicatorperioddatacomment', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)

rules.add_perm('rsr.add_narrativereport', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.change_narrativereport', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.delete_narrativereport', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)

rules.add_perm('rsr.add_keyword', is_rsr_admin)
rules.add_perm('rsr.change_keyword', is_rsr_admin)

rules.add_perm('rsr.add_partnersite', is_rsr_admin)
rules.add_perm('rsr.change_partnersite', is_rsr_admin | is_org_admin)

rules.add_perm('rsr.change_organisationaccount', is_rsr_admin)

rules.add_perm('rsr.add_projectupdate', is_rsr_admin | is_org_admin | is_org_user_manager |
               is_org_me_manager_or_project_editor | is_org_enumerator | is_org_user | is_own)
rules.add_perm('rsr.change_projectupdate', is_own | is_rsr_admin | is_org_admin | is_org_user_manager |
               is_org_me_manager_or_project_editor | is_org_user | is_org_enumerator)
rules.add_perm('rsr.delete_projectupdate', is_own | is_rsr_admin | is_org_admin)

rules.add_perm('rsr.add_projectupdatelocation', is_rsr_admin)
rules.add_perm('rsr.change_projectupdatelocation', is_rsr_admin)
rules.add_perm('rsr.delete_projectupdatelocation', is_rsr_admin)

rules.add_perm('rsr.add_externalproject', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.change_externalproject', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.delete_externalproject', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)

rules.add_perm('rsr.add_relatedproject', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.change_relatedproject', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.delete_relatedproject', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)


rules.add_perm('rsr.add_goal', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.change_goal', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.delete_goal', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)

rules.add_perm('rsr.add_projectlocation', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.change_projectlocation', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.delete_projectlocation', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)

rules.add_perm('rsr.add_administrativelocation', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.change_administrativelocation', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.delete_administrativelocation', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)

rules.add_perm('rsr.add_budgetitem', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.change_budgetitem', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.delete_budgetitem', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)

rules.add_perm('rsr.add_projecteditorvalidation', is_rsr_admin | is_org_admin)
rules.add_perm('rsr.change_projecteditorvalidation', is_rsr_admin | is_org_admin)

rules.add_perm('rsr.add_projecteditorvalidationset', is_rsr_admin | is_org_admin)
rules.add_perm('rsr.change_projecteditorvalidationset', is_rsr_admin | is_org_admin)

rules.add_perm('rsr.add_projectcustomfield', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.change_projectcustomfield', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.delete_projectcustomfield', is_rsr_admin)

rules.add_perm('rsr.add_organisationcustomfield', is_rsr_admin | is_org_admin
               | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.change_organisationcustomfield', is_rsr_admin | is_org_admin
               | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.delete_organisationcustomfield', is_rsr_admin)

rules.add_perm('rsr.add_indicatorcustomfield', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.change_indicatorcustomfield', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.delete_indicatorcustomfield', is_rsr_admin)

rules.add_perm('rsr.add_indicatorcustomvalue', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.change_indicatorcustomvalue', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.delete_indicatorcustomvalue', is_rsr_admin)

rules.add_perm('rsr.add_organisationindicatorlabel', is_rsr_admin)
rules.add_perm('rsr.change_organisationindicatorlabel', is_rsr_admin)
rules.add_perm('rsr.delete_organisationindicatorlabel', is_rsr_admin)

rules.add_perm('rsr.add_benchmark', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.change_benchmark', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.delete_benchmark', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)

rules.add_perm('rsr.add_partnership', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.change_partnership', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.delete_partnership', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)

rules.add_perm('rsr.add_link', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.change_link', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.delete_link', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)

rules.add_perm('rsr.add_projectcondition', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.change_projectcondition', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.delete_projectcondition', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)

rules.add_perm('rsr.add_projectcontact', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.change_projectcontact', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.delete_projectcontact', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)

rules.add_perm('rsr.add_countrybudgetitem', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.change_countrybudgetitem', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.delete_countrybudgetitem', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)

rules.add_perm('rsr.add_planneddisbursement', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.change_planneddisbursement', is_rsr_admin | is_org_admin
               | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.delete_planneddisbursement', is_rsr_admin | is_org_admin
               | is_org_me_manager_or_project_editor)

rules.add_perm('rsr.add_policymarker', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.change_policymarker', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.delete_policymarker', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)

rules.add_perm('rsr.add_recipientcountry', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.change_recipientcountry', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.delete_recipientcountry', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)

rules.add_perm('rsr.add_recipientregion', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.change_recipientregion', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.delete_recipientregion', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)

rules.add_perm('rsr.add_result', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.change_result', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.delete_result', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.view_result', is_org_enumerator)
rules.add_perm('rsr.import_results', is_rsr_admin | is_org_admin | is_org_me_manager)


rules.add_perm('rsr.add_sector', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.change_sector', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.delete_sector', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)

rules.add_perm('rsr.add_transaction', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.change_transaction', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.delete_transaction', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)

rules.add_perm('rsr.add_legacydata', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.change_legacydata', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.delete_legacydata', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)

rules.add_perm('rsr.add_projectdocument', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.change_projectdocument', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.delete_projectdocument', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)

rules.add_perm('rsr.add_iatiexport', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.change_iatiexport', is_rsr_admin | is_org_admin)
rules.add_perm('rsr.delete_iatiexport', is_rsr_admin | is_org_admin)

rules.add_perm('rsr.add_organisation', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.change_organisation', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.delete_organisation', is_rsr_admin)

rules.add_perm('rsr.add_organisationlocation', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.change_organisationlocation', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.delete_organisationlocation', is_rsr_admin | is_org_admin)

rules.add_perm('rsr.add_organisationtotalbudget', is_rsr_admin | is_org_admin)
rules.add_perm('rsr.change_organisationtotalbudget', is_rsr_admin | is_org_admin)
rules.add_perm('rsr.delete_organisationtotalbudget', is_rsr_admin | is_org_admin)

rules.add_perm('rsr.add_organisationrecipientorgbudget', is_rsr_admin | is_org_admin)
rules.add_perm('rsr.change_organisationrecipientorgbudget', is_rsr_admin | is_org_admin)
rules.add_perm('rsr.delete_organisationrecipientorgbudget', is_rsr_admin | is_org_admin)

rules.add_perm('rsr.add_organisationregionbudget', is_rsr_admin | is_org_admin)
rules.add_perm('rsr.change_organisationregionbudget', is_rsr_admin | is_org_admin)
rules.add_perm('rsr.delete_organisationregionbudget', is_rsr_admin | is_org_admin)

rules.add_perm('rsr.add_organisationcountrybudget', is_rsr_admin | is_org_admin)
rules.add_perm('rsr.change_organisationcountrybudget', is_rsr_admin | is_org_admin)
rules.add_perm('rsr.delete_organisationcountrybudget', is_rsr_admin | is_org_admin)

rules.add_perm('rsr.add_organisationtotalexpenditure', is_rsr_admin | is_org_admin)
rules.add_perm('rsr.change_organisationtotalexpenditure', is_rsr_admin | is_org_admin)
rules.add_perm('rsr.delete_organisationtotalexpenditure', is_rsr_admin | is_org_admin)

rules.add_perm('rsr.add_organisationtotalbudgetline', is_rsr_admin | is_org_admin)
rules.add_perm('rsr.change_organisationtotalbudgetline', is_rsr_admin | is_org_admin)
rules.add_perm('rsr.delete_organisationtotalbudgetline', is_rsr_admin | is_org_admin)

rules.add_perm('rsr.add_organisationrecipientorgbudgetline', is_rsr_admin | is_org_admin)
rules.add_perm('rsr.change_organisationrecipientorgbudgetline', is_rsr_admin | is_org_admin)
rules.add_perm('rsr.delete_organisationrecipientorgbudgetline', is_rsr_admin | is_org_admin)

rules.add_perm('rsr.add_organisationregionbudgetline', is_rsr_admin | is_org_admin)
rules.add_perm('rsr.change_organisationregionbudgetline', is_rsr_admin | is_org_admin)
rules.add_perm('rsr.delete_organisationregionbudgetline', is_rsr_admin | is_org_admin)

rules.add_perm('rsr.add_organisationcountrybudgetline', is_rsr_admin | is_org_admin)
rules.add_perm('rsr.change_organisationcountrybudgetline', is_rsr_admin | is_org_admin)
rules.add_perm('rsr.delete_organisationcountrybudgetline', is_rsr_admin | is_org_admin)

rules.add_perm('rsr.add_organisationexpenseline', is_rsr_admin | is_org_admin)
rules.add_perm('rsr.change_organisationexpenseline', is_rsr_admin | is_org_admin)
rules.add_perm('rsr.delete_organisationexpenseline', is_rsr_admin | is_org_admin)

rules.add_perm('rsr.add_organisationdocument', is_rsr_admin | is_org_admin)
rules.add_perm('rsr.change_organisationdocument', is_rsr_admin | is_org_admin)
rules.add_perm('rsr.delete_organisationdocument', is_rsr_admin | is_org_admin)

rules.add_perm('rsr.add_organisationdocumentcategory', is_rsr_admin | is_org_admin)
rules.add_perm('rsr.change_organisationdocumentcategory', is_rsr_admin | is_org_admin)
rules.add_perm('rsr.delete_organisationdocumentcategory', is_rsr_admin | is_org_admin)

rules.add_perm('rsr.add_organisationdocumentcountry', is_rsr_admin | is_org_admin)
rules.add_perm('rsr.change_organisationdocumentcountry', is_rsr_admin | is_org_admin)
rules.add_perm('rsr.delete_organisationdocumentcountry', is_rsr_admin | is_org_admin)

rules.add_perm('rsr.add_project', is_rsr_admin | is_org_admin)
rules.add_perm('rsr.change_project', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.view_project', is_rsr_admin | is_org_admin | is_org_user_manager
               | is_org_me_manager_or_project_editor | is_org_user | is_org_enumerator)

rules.add_perm('rsr.add_projecthierarchy', is_rsr_admin | is_org_admin)
rules.add_perm('rsr.change_projecthierarchy', is_rsr_admin | is_org_admin)
rules.add_perm('rsr.view_projecthierarchy', is_rsr_admin | is_org_admin | is_org_user_manager
               | is_org_me_manager_or_project_editor | is_org_user | is_org_enumerator)

rules.add_perm('rsr.change_publishingstatus', is_rsr_admin | is_org_admin)

rules.add_perm('rsr.add_user', is_rsr_admin)
rules.add_perm('rsr.change_user', is_rsr_admin | is_org_admin | is_org_user_manager | is_self)

rules.add_perm('tastypie.change_apikey', is_rsr_admin | is_org_admin | is_org_user_manager
               | is_org_me_manager_or_project_editor)

rules.add_perm('rsr.add_employment', is_rsr_admin)
rules.add_perm('rsr.change_employment', is_rsr_admin | is_org_admin | is_org_user_manager)
rules.add_perm('rsr.delete_employment', is_rsr_admin | is_org_admin | is_org_user_manager | is_self)

rules.add_perm('rsr.project_management', is_rsr_admin | is_org_admin | is_org_me_manager_or_project_editor)
rules.add_perm('rsr.user_management', is_rsr_admin | is_org_admin | is_org_user_manager)
rules.add_perm('rsr.post_updates', is_rsr_admin | is_org_admin | is_org_user_manager
               | is_org_me_manager_or_project_editor | is_org_user | is_org_enumerator)


# Signals
pre_save.connect(employment_pre_save, sender=Employment)
post_save.connect(employment_post_save, sender=Employment)

post_save.connect(create_organisation_account, sender=Organisation)

post_save.connect(create_publishing_status, sender=Project)

post_save.connect(change_name_of_file_on_create, sender=Organisation)
post_save.connect(change_name_of_file_on_create, sender=Project)
post_save.connect(change_name_of_file_on_create, sender=ProjectUpdate)
post_save.connect(act_on_log_entry, sender=LogEntry)

pre_save.connect(change_name_of_file_on_change, sender=Organisation)
pre_save.connect(change_name_of_file_on_change, sender=Project)
pre_save.connect(change_name_of_file_on_change, sender=ProjectUpdate)

post_save.connect(update_project_budget, sender=BudgetItem)
post_save.connect(update_project_funding, sender=Partnership)

post_delete.connect(update_project_budget, sender=BudgetItem)
post_delete.connect(update_project_funding, sender=Partnership)

post_save.connect(create_api_key, sender=User)
