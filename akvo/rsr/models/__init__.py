# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import logging
logger = logging.getLogger('akvo.rsr')

from django.conf import settings
from django.db.models.signals import pre_save, post_save, post_delete
from django.contrib.admin.models import LogEntry

from akvo.rest.models import create_api_key

from ..signals import (
    change_name_of_file_on_change, change_name_of_file_on_create,
    create_publishing_status, create_organisation_account,
    create_payment_gateway_selector, act_on_log_entry,
    employment_post_save, employment_pre_save, update_project_budget,
    update_project_funding
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
from .iati_activity_import import IatiActivityImport
from .iati_check import IatiCheck
from .iati_export import IatiExport
from .iati_import import IatiImport
from .iati_import_job import IatiImportJob, CordaidZipIatiImportJob
from .iati_import_log import IatiImportLog
from .indicator import (Indicator, IndicatorPeriod, IndicatorPeriodData,
                        IndicatorPeriodDataComment, IndicatorReference,
                        IndicatorPeriodActualDimension, IndicatorPeriodTargetDimension,
                        IndicatorPeriodActualLocation, IndicatorPeriodTargetLocation)
from .invoice import Invoice
from .internal_organisation_id import InternalOrganisationID
from .keyword import Keyword
from .legacy_data import LegacyData
from .link import Link
from .location import (OrganisationLocation, ProjectLocation, ProjectUpdateLocation,
                       AdministrativeLocation)
from .organisation import Organisation
from .organisation_account import OrganisationAccount
from .organisation_budget import (OrganisationCountryBudget, OrganisationRegionBudget,
                                  OrganisationRecipientOrgBudget, OrganisationTotalBudget,
                                  OrganisationTotalExpenditure, OrganisationCountryBudgetLine,
                                  OrganisationExpenseLine, OrganisationRecipientOrgBudgetLine,
                                  OrganisationRegionBudgetLine, OrganisationTotalBudgetLine)
from .organisation_document import (OrganisationDocument, OrganisationDocumentCategory,
                                    OrganisationDocumentCountry)
from .partner_site import PartnerSite
from .partnership import Partnership
from .payment_gateway import PayPalGateway, MollieGateway, PaymentGatewaySelector
from .planned_disbursement import PlannedDisbursement
from .policy_marker import PolicyMarker
from .project import Project
from .project_comment import ProjectComment
from .project_condition import ProjectCondition
from .project_contact import ProjectContact
from .project_document import ProjectDocument, ProjectDocumentCategory
from .project_editor_validation import ProjectEditorValidation, ProjectEditorValidationSet
from .project_update import ProjectUpdate
from .publishing_status import PublishingStatus
from .region import RecipientRegion
from .related_project import RelatedProject
from .result import Result
from .sector import Sector
from .transaction import Transaction, TransactionSector
from .user import User

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
    'Employment',
    'FocusArea',
    'Fss',
    'FssForecast',
    'Goal',
    'HumanitarianScope',
    'IatiActivityExport',
    'IatiActivityImport',
    'IatiCheck',
    'IatiExport',
    'IatiImport',
    'IatiImportJob',
    'CordaidZipIatiImportJob',
    'IatiImportLog',
    'Indicator',
    'IndicatorPeriod',
    'IndicatorPeriodActualDimension',
    'IndicatorPeriodActualLocation',
    'IndicatorPeriodData',
    'IndicatorPeriodDataComment',
    'IndicatorPeriodTargetDimension',
    'IndicatorPeriodTargetLocation',
    'IndicatorReference',
    'Invoice',
    'InternalOrganisationID',
    'Keyword',
    'LegacyData',
    'Link',
    'ProjectLocation',
    'ProjectUpdateLocation',
    'Organisation',
    'OrganisationAccount',
    'OrganisationCountryBudget',
    'OrganisationCountryBudgetLine',
    'OrganisationCustomField',
    'OrganisationDocument',
    'OrganisationDocumentCategory',
    'OrganisationDocumentCountry',
    'OrganisationExpenseLine',
    'OrganisationLocation',
    'OrganisationRecipientOrgBudget',
    'OrganisationRecipientOrgBudgetLine',
    'OrganisationRegionBudget',
    'OrganisationRegionBudgetLine',
    'OrganisationTotalBudget',
    'OrganisationTotalBudgetLine',
    'OrganisationTotalExpenditure',
    'PartnerSite',
    'Partnership',
    'PayPalGateway',
    'MollieGateway',
    'PaymentGatewaySelector',
    'PlannedDisbursement',
    'PolicyMarker',
    'Project',
    'ProjectComment',
    'ProjectCondition',
    'ProjectContact',
    'ProjectCustomField',
    'ProjectDocument',
    'ProjectDocumentCategory',
    'ProjectEditorValidation',
    'ProjectEditorValidationSet',
    'ProjectUpdate',
    'PublishingStatus',
    'RecipientRegion',
    'RelatedProject',
    'Result',
    'Sector',
    'Transaction',
    'TransactionSector',
    'User',
]

# Permission rules
import rules
from ..permissions import (is_rsr_admin, is_org_admin, is_org_user_manager, is_org_project_editor,
                           is_org_user, is_self)

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

rules.add_perm('rsr.add_indicator', is_rsr_admin | is_org_admin | is_org_project_editor)
rules.add_perm('rsr.change_indicator', is_rsr_admin | is_org_admin | is_org_project_editor)
rules.add_perm('rsr.delete_indicator', is_rsr_admin | is_org_admin | is_org_project_editor)

rules.add_perm('rsr.add_indicatorperiod', is_rsr_admin | is_org_admin | is_org_project_editor)
rules.add_perm('rsr.change_indicatorperiod', is_rsr_admin | is_org_admin | is_org_project_editor)
rules.add_perm('rsr.delete_indicatorperiod', is_rsr_admin | is_org_admin | is_org_project_editor)

rules.add_perm('rsr.add_indicatorperioddata', is_rsr_admin | is_org_admin | is_org_project_editor)
rules.add_perm('rsr.change_indicatorperioddata', is_rsr_admin | is_org_admin | is_org_project_editor)
rules.add_perm('rsr.delete_indicatorperioddata', is_rsr_admin | is_org_admin | is_org_project_editor)

rules.add_perm('rsr.add_indicatorperioddatacomment', is_rsr_admin | is_org_admin | is_org_project_editor)
rules.add_perm('rsr.change_indicatorperioddatacomment', is_rsr_admin | is_org_admin | is_org_project_editor)
rules.add_perm('rsr.delete_indicatorperioddatacomment', is_rsr_admin | is_org_admin | is_org_project_editor)

rules.add_perm('rsr.add_keyword', is_rsr_admin)
rules.add_perm('rsr.change_keyword', is_rsr_admin)

rules.add_perm('rsr.add_partnersite', is_rsr_admin)
rules.add_perm('rsr.change_partnersite', is_rsr_admin | is_org_admin)

rules.add_perm('rsr.change_organisationaccount', is_rsr_admin)

rules.add_perm('rsr.add_projectupdate', is_rsr_admin | is_org_admin | is_org_user_manager |
               is_org_project_editor | is_org_user)
rules.add_perm('rsr.change_projectupdate', is_rsr_admin | is_org_admin | is_org_user_manager |
               is_org_project_editor | is_org_user)
rules.add_perm('rsr.delete_projectupdate', is_rsr_admin | is_org_admin)

rules.add_perm('rsr.add_projectupdatelocation', is_rsr_admin)
rules.add_perm('rsr.change_projectupdatelocation', is_rsr_admin)
rules.add_perm('rsr.delete_projectupdatelocation', is_rsr_admin)

rules.add_perm('rsr.add_relatedproject', is_rsr_admin | is_org_admin | is_org_project_editor)
rules.add_perm('rsr.change_relatedproject', is_rsr_admin | is_org_admin | is_org_project_editor)
rules.add_perm('rsr.delete_relatedproject', is_rsr_admin | is_org_admin | is_org_project_editor)

rules.add_perm('rsr.add_projectcomment', is_rsr_admin | is_org_admin | is_org_project_editor)
rules.add_perm('rsr.change_projectcomment', is_rsr_admin | is_org_admin | is_org_project_editor)

rules.add_perm('rsr.add_goal', is_rsr_admin | is_org_admin | is_org_project_editor)
rules.add_perm('rsr.change_goal', is_rsr_admin | is_org_admin | is_org_project_editor)
rules.add_perm('rsr.delete_goal', is_rsr_admin | is_org_admin | is_org_project_editor)

rules.add_perm('rsr.add_projectlocation', is_rsr_admin | is_org_admin | is_org_project_editor)
rules.add_perm('rsr.change_projectlocation', is_rsr_admin | is_org_admin | is_org_project_editor)
rules.add_perm('rsr.delete_projectlocation', is_rsr_admin | is_org_admin | is_org_project_editor)

rules.add_perm('rsr.add_budgetitem', is_rsr_admin | is_org_admin | is_org_project_editor)
rules.add_perm('rsr.change_budgetitem', is_rsr_admin | is_org_admin | is_org_project_editor)
rules.add_perm('rsr.delete_budgetitem', is_rsr_admin | is_org_admin | is_org_project_editor)

rules.add_perm('rsr.add_projecteditorvalidation', is_rsr_admin | is_org_admin)
rules.add_perm('rsr.change_projecteditorvalidation', is_rsr_admin | is_org_admin)

rules.add_perm('rsr.add_projecteditorvalidationset', is_rsr_admin | is_org_admin)
rules.add_perm('rsr.change_projecteditorvalidationset', is_rsr_admin | is_org_admin)

rules.add_perm('rsr.add_projectcustomfield', is_rsr_admin | is_org_admin | is_org_project_editor)
rules.add_perm('rsr.change_projectcustomfield', is_rsr_admin | is_org_admin | is_org_project_editor)
rules.add_perm('rsr.delete_projectcustomfield', is_rsr_admin)

rules.add_perm('rsr.add_organisationcustomfield', is_rsr_admin | is_org_admin |
               is_org_project_editor)
rules.add_perm('rsr.change_organisationcustomfield', is_rsr_admin | is_org_admin |
               is_org_project_editor)
rules.add_perm('rsr.delete_organisationcustomfield', is_rsr_admin)

rules.add_perm('rsr.add_benchmark', is_rsr_admin | is_org_admin | is_org_project_editor)
rules.add_perm('rsr.change_benchmark', is_rsr_admin | is_org_admin | is_org_project_editor)
rules.add_perm('rsr.delete_benchmark', is_rsr_admin | is_org_admin | is_org_project_editor)

rules.add_perm('rsr.add_partnership', is_rsr_admin | is_org_admin | is_org_project_editor)
rules.add_perm('rsr.change_partnership', is_rsr_admin | is_org_admin | is_org_project_editor)
rules.add_perm('rsr.delete_partnership', is_rsr_admin | is_org_admin | is_org_project_editor)

rules.add_perm('rsr.add_link', is_rsr_admin | is_org_admin | is_org_project_editor)
rules.add_perm('rsr.change_link', is_rsr_admin | is_org_admin | is_org_project_editor)
rules.add_perm('rsr.delete_link', is_rsr_admin | is_org_admin | is_org_project_editor)

rules.add_perm('rsr.add_projectcondition', is_rsr_admin | is_org_admin | is_org_project_editor)
rules.add_perm('rsr.change_projectcondition', is_rsr_admin | is_org_admin | is_org_project_editor)
rules.add_perm('rsr.delete_projectcondition', is_rsr_admin | is_org_admin | is_org_project_editor)

rules.add_perm('rsr.add_projectcontact', is_rsr_admin | is_org_admin | is_org_project_editor)
rules.add_perm('rsr.change_projectcontact', is_rsr_admin | is_org_admin | is_org_project_editor)
rules.add_perm('rsr.delete_projectcontact', is_rsr_admin | is_org_admin | is_org_project_editor)

rules.add_perm('rsr.add_countrybudgetitem', is_rsr_admin | is_org_admin | is_org_project_editor)
rules.add_perm('rsr.change_countrybudgetitem', is_rsr_admin | is_org_admin | is_org_project_editor)
rules.add_perm('rsr.delete_countrybudgetitem', is_rsr_admin | is_org_admin | is_org_project_editor)

rules.add_perm('rsr.add_planneddisbursement', is_rsr_admin | is_org_admin | is_org_project_editor)
rules.add_perm('rsr.change_planneddisbursement', is_rsr_admin | is_org_admin |
               is_org_project_editor)
rules.add_perm('rsr.delete_planneddisbursement', is_rsr_admin | is_org_admin |
               is_org_project_editor)

rules.add_perm('rsr.add_policymarker', is_rsr_admin | is_org_admin | is_org_project_editor)
rules.add_perm('rsr.change_policymarker', is_rsr_admin | is_org_admin | is_org_project_editor)
rules.add_perm('rsr.delete_policymarker', is_rsr_admin | is_org_admin | is_org_project_editor)

rules.add_perm('rsr.add_recipientcountry', is_rsr_admin | is_org_admin | is_org_project_editor)
rules.add_perm('rsr.change_recipientcountry', is_rsr_admin | is_org_admin | is_org_project_editor)
rules.add_perm('rsr.delete_recipientcountry', is_rsr_admin | is_org_admin | is_org_project_editor)

rules.add_perm('rsr.add_recipientregion', is_rsr_admin | is_org_admin | is_org_project_editor)
rules.add_perm('rsr.change_recipientregion', is_rsr_admin | is_org_admin | is_org_project_editor)
rules.add_perm('rsr.delete_recipientregion', is_rsr_admin | is_org_admin | is_org_project_editor)

rules.add_perm('rsr.add_result', is_rsr_admin | is_org_admin | is_org_project_editor)
rules.add_perm('rsr.change_result', is_rsr_admin | is_org_admin | is_org_project_editor)
rules.add_perm('rsr.delete_result', is_rsr_admin | is_org_admin | is_org_project_editor)

rules.add_perm('rsr.add_sector', is_rsr_admin | is_org_admin | is_org_project_editor)
rules.add_perm('rsr.change_sector', is_rsr_admin | is_org_admin | is_org_project_editor)
rules.add_perm('rsr.delete_sector', is_rsr_admin | is_org_admin | is_org_project_editor)

rules.add_perm('rsr.add_transaction', is_rsr_admin | is_org_admin | is_org_project_editor)
rules.add_perm('rsr.change_transaction', is_rsr_admin | is_org_admin | is_org_project_editor)
rules.add_perm('rsr.delete_transaction', is_rsr_admin | is_org_admin | is_org_project_editor)

rules.add_perm('rsr.add_legacydata', is_rsr_admin | is_org_admin | is_org_project_editor)
rules.add_perm('rsr.change_legacydata', is_rsr_admin | is_org_admin | is_org_project_editor)
rules.add_perm('rsr.delete_legacydata', is_rsr_admin | is_org_admin | is_org_project_editor)

rules.add_perm('rsr.add_projectdocument', is_rsr_admin | is_org_admin | is_org_project_editor)
rules.add_perm('rsr.change_projectdocument', is_rsr_admin | is_org_admin | is_org_project_editor)
rules.add_perm('rsr.delete_projectdocument', is_rsr_admin | is_org_admin | is_org_project_editor)

rules.add_perm('rsr.add_iatiexport', is_rsr_admin | is_org_admin)
rules.add_perm('rsr.change_iatiexport', is_rsr_admin | is_org_admin)
rules.add_perm('rsr.delete_iatiexport', is_rsr_admin | is_org_admin)

rules.add_perm('rsr.add_organisation', is_rsr_admin | is_org_admin | is_org_project_editor)
rules.add_perm('rsr.change_organisation', is_rsr_admin | is_org_admin | is_org_project_editor)
rules.add_perm('rsr.delete_organisation', is_rsr_admin)

rules.add_perm('rsr.add_organisationlocation', is_rsr_admin | is_org_admin | is_org_project_editor)
rules.add_perm('rsr.change_organisationlocation', is_rsr_admin | is_org_admin | is_org_project_editor)
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
rules.add_perm('rsr.change_project', is_rsr_admin | is_org_admin | is_org_project_editor)
rules.add_perm('rsr.view_project', is_rsr_admin | is_org_admin | is_org_user_manager |
               is_org_project_editor | is_org_user)

rules.add_perm('rsr.change_publishingstatus', is_rsr_admin | is_org_admin)

rules.add_perm('rsr.add_user', is_rsr_admin)
rules.add_perm('rsr.change_user', is_rsr_admin | is_org_admin | is_org_user_manager | is_self)

rules.add_perm('tastypie.change_apikey', is_rsr_admin | is_org_admin | is_org_user_manager |
               is_org_project_editor)

rules.add_perm('rsr.add_employment', is_rsr_admin)
rules.add_perm('rsr.change_employment', is_rsr_admin | is_org_admin | is_org_user_manager)
rules.add_perm('rsr.delete_employment', is_rsr_admin | is_org_admin | is_org_user_manager | is_self)

rules.add_perm('rsr.project_management', is_rsr_admin | is_org_admin | is_org_project_editor)
rules.add_perm('rsr.user_management', is_rsr_admin | is_org_admin | is_org_user_manager)
rules.add_perm('rsr.post_updates', is_rsr_admin | is_org_admin | is_org_user_manager |
               is_org_project_editor | is_org_user)


# Signals
pre_save.connect(employment_pre_save, sender=Employment)
post_save.connect(employment_post_save, sender=Employment)

post_save.connect(create_organisation_account, sender=Organisation)

post_save.connect(create_publishing_status, sender=Project)
post_save.connect(create_payment_gateway_selector, sender=Project)

post_save.connect(change_name_of_file_on_create, sender=Organisation)
post_save.connect(change_name_of_file_on_create, sender=Project)
post_save.connect(change_name_of_file_on_create, sender=ProjectUpdate)
post_save.connect(act_on_log_entry, sender=LogEntry)

pre_save.connect(change_name_of_file_on_change, sender=Organisation)
pre_save.connect(change_name_of_file_on_change, sender=Project)
pre_save.connect(change_name_of_file_on_change, sender=ProjectUpdate)

post_save.connect(update_project_budget, sender=BudgetItem)
post_save.connect(update_project_funding, sender=Invoice)
post_save.connect(update_project_funding, sender=Partnership)

post_delete.connect(update_project_budget, sender=BudgetItem)
post_delete.connect(update_project_funding, sender=Invoice)
post_delete.connect(update_project_funding, sender=Partnership)

post_save.connect(create_api_key, sender=User)
