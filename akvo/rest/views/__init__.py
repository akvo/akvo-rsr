# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.
See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""


from .benchmark import BenchmarkViewSet
from .benchmark_name import BenchmarknameViewSet
from .budget_item import BudgetItemViewSet
from .budget_item_label import BudgetItemLabelViewSet
from .category import CategoryViewSet
from .country import CountryViewSet
from .employment import EmploymentViewSet, approve_employment, set_group
from .focus_area import FocusAreaViewSet
from .goal import GoalViewSet
from .indicator import IndicatorViewSet, IndicatorPeriodViewSet
from .internal_organisation_id import InternalOrganisationIDViewSet
from .invoice import InvoiceViewSet
from .keyword import KeywordViewSet
from .legacy_data import LegacyDataViewSet
from .link import LinkViewSet
from .organisation import OrganisationViewSet
from .organisation_location import OrganisationLocationViewSet, MapOrganisationLocationViewSet
from .partner_site import PartnerSiteViewSet
from .partner_type import PartnerTypeViewSet
from .partnership import PartnershipViewSet
from .planned_disbursement import PlannedDisbursementViewSet
from .policy_marker import PolicyMarkerViewSet
from .project import ProjectViewSet, ProjectExtraViewSet, ProjectUpViewSet
from .project_admin import (project_admin_step1,
                            project_admin_step2,
                            project_admin_step4)
from .project_comment import ProjectCommentViewSet
from .project_document import ProjectDocumentViewSet
from .project_condition import ProjectConditionViewSet
from .project_contact import ProjectContactViewSet
from .project_iati_checks import ProjectIatiCheckView
from .project_location import ProjectLocationViewSet, MapProjectLocationViewSet
from .project_update import ProjectUpdateViewSet, ProjectUpdateExtraViewSet
from .project_update_location import ProjectUpdateLocationViewSet, MapProjectUpdateLocationViewSet
from .publishing_status import PublishingStatusViewSet
from .recipient_country import RecipientCountryViewSet
from .related_project import RelatedProjectViewSet
from .region import RecipientRegionViewSet
from .result import ResultViewSet
from .sector import SectorViewSet
from .transaction import TransactionViewSet
from .typeahead import (typeahead_country,
                        typeahead_organisation,
                        typeahead_project,
                        typeahead_projectupdate)
from .user import (UserViewSet, change_password, update_details,
                   request_organisation)

__all__ = [
    'approve_employment',
    'BenchmarknameViewSet',
    'BenchmarkViewSet',
    'BudgetItemLabelViewSet',
    'BudgetItemViewSet',
    'CategoryViewSet',
    'change_password',
    'CountryViewSet',
    'EmploymentViewSet',
    'FocusAreaViewSet',
    'GoalViewSet',
    'IndicatorPeriodViewSet',
    'IndicatorViewSet',
    'InternalOrganisationIDViewSet',
    'InvoiceViewSet',
    'KeywordViewSet',
    'LegacyDataViewSet',
    'LinkViewSet',
    'MapOrganisationLocationViewSet',
    'MapProjectLocationViewSet',
    'MapProjectUpdateLocationViewSet',
    'OrganisationLocationViewSet',
    'OrganisationViewSet',
    'PartnershipViewSet',
    'PartnerSiteViewSet',
    'PartnerTypeViewSet',
    'PlannedDisbursementViewSet',
    'PolicyMarkerViewSet',
    'ProjectCommentViewSet',
    'ProjectConditionViewSet',
    'ProjectContactViewSet',
    'ProjectDocumentViewSet',
    'ProjectExtraViewSet',
    'ProjectIatiCheckView',
    'ProjectLocationViewSet',
    'ProjectUpdateExtraViewSet',
    'ProjectUpdateLocationViewSet',
    'ProjectUpdateViewSet',
    'ProjectUpViewSet',
    'ProjectViewSet',
    'project_admin_step1',
    'project_admin_step2',
    'project_admin_step4',
    'PublishingStatusViewSet',
    'RecipientCountryViewSet',
    'RecipientRegionViewSet',
    'RelatedProjectViewSet',
    'request_organisation',
    'ResultViewSet',
    'SectorViewSet',
    'set_group',
    'TransactionViewSet',
    'typeahead_country',
    'typeahead_organisation',
    'typeahead_project',
    'typeahead_projectupdate',
    'update_details',
    'UserViewSet',
    # 'typeahead_sector',
]
