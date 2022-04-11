# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from .activity_date_type import ActivityDateType
from .activity_scope import ActivityScope
from .activity_status import ActivityStatus
from .aid_type import AidType
from .aid_type_category import AidTypeCategory
from .aid_type_vocabulary import AidTypeVocabulary
from .aid_type_flag import AidTypeFlag
from .budget_identifier import BudgetIdentifier
from .budget_identifier_sector import BudgetIdentifierSector
from .budget_identifier_sector_category import BudgetIdentifierSectorCategory
from .budget_identifier_vocabulary import BudgetIdentifierVocabulary
from .budget_not_provided import BudgetNotProvided
from .budget_status import BudgetStatus
from .budget_type import BudgetType
from .cashand_voucher_modalities import CashandVoucherModalities
from .collaboration_type import CollaborationType
from .condition_type import ConditionType
from .contact_type import ContactType
from .country import Country
from .crs_add_other_flags import CRSAddOtherFlags
from .crs_channel_code import CRSChannelCode
from .currency import Currency
from .description_type import DescriptionType
from .disbursement_channel import DisbursementChannel
from .document_category import DocumentCategory
from .document_category_category import DocumentCategoryCategory
from .earmarking_category import EarmarkingCategory
from .file_format import FileFormat
from .finance_type import FinanceType
from .finance_type_category import FinanceTypeCategory
from .flow_type import FlowType
from .gazetteer_agency import GazetteerAgency
from .geographic_exactness import GeographicExactness
from .geographic_location_class import GeographicLocationClass
from .geographic_location_reach import GeographicLocationReach
from .geographic_vocabulary import GeographicVocabulary
from .geographical_precision import GeographicalPrecision
from .humanitarian_scope_type import HumanitarianScopeType
from .humanitarian_scope_vocabulary import HumanitarianScopeVocabulary
from .indicator_measure import IndicatorMeasure
from .indicator_vocabulary import IndicatorVocabulary
from .language import Language
from .loan_repayment_period import LoanRepaymentPeriod
from .loan_repayment_type import LoanRepaymentType
from .location_type import LocationType
from .location_type_category import LocationTypeCategory
from .organisation_identifier import OrganisationIdentifier
from .organisation_registration_agency import OrganisationRegistrationAgency
from .organisation_role import OrganisationRole
from .organisation_type import OrganisationType
from .other_identifier_type import OtherIdentifierType
from .policy_marker import PolicyMarker
from .policy_marker_vocabulary import PolicyMarkerVocabulary
from .policy_significance import PolicySignificance
from .publisher_type import PublisherType
from .region import Region
from .region_vocabulary import RegionVocabulary
from .related_activity_type import RelatedActivityType
from .result_type import ResultType
from .result_vocabulary import ResultVocabulary
from .sector import Sector
from .sector_category import SectorCategory
from .sector_vocabulary import SectorVocabulary
from .tag_vocabulary import TagVocabulary
from .tied_status import TiedStatus
from .transaction_type import TransactionType
from .unsdg_goals import UNSDGGoals
from .unsdg_targets import UNSDGTargets
from .value_type import ValueType
from .verification_status import VerificationStatus
from .version import Version
from .vocabulary import Vocabulary

__all__ = [
    'ActivityDateType',
    'ActivityScope',
    'ActivityStatus',
    'AidType',
    'AidTypeCategory',
    'AidTypeVocabulary',
    'AidTypeFlag',
    'BudgetIdentifier',
    'BudgetIdentifierSector',
    'BudgetIdentifierSectorCategory',
    'BudgetIdentifierVocabulary',
    'BudgetNotProvided',
    'BudgetStatus',
    'BudgetType',
    'CashandVoucherModalities',
    'CollaborationType',
    'ConditionType',
    'ContactType',
    'Country',
    'CRSAddOtherFlags',
    'CRSChannelCode',
    'Currency',
    'DescriptionType',
    'DisbursementChannel',
    'DocumentCategory',
    'DocumentCategoryCategory',
    'EarmarkingCategory',
    'FileFormat',
    'FinanceType',
    'FinanceTypeCategory',
    'FlowType',
    'GazetteerAgency',
    'GeographicExactness',
    'GeographicLocationClass',
    'GeographicLocationReach',
    'GeographicVocabulary',
    'GeographicalPrecision',
    'HumanitarianScopeType',
    'HumanitarianScopeVocabulary',
    'IndicatorMeasure',
    'IndicatorVocabulary',
    'Language',
    'LoanRepaymentPeriod',
    'LoanRepaymentType',
    'LocationType',
    'LocationTypeCategory',
    'OrganisationIdentifier',
    'OrganisationRegistrationAgency',
    'OrganisationRole',
    'OrganisationType',
    'OtherIdentifierType',
    'PolicyMarker',
    'PolicyMarkerVocabulary',
    'PolicySignificance',
    'PublisherType',
    'Region',
    'RegionVocabulary',
    'RelatedActivityType',
    'ResultType',
    'ResultVocabulary',
    'Sector',
    'SectorCategory',
    'SectorVocabulary',
    'TagVocabulary',
    'TiedStatus',
    'TransactionType',
    'UNSDGGoals',
    'UNSDGTargets',
    'ValueType',
    'VerificationStatus',
    'Version',
    'Vocabulary',
]
