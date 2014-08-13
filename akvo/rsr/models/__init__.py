# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import logging
logger = logging.getLogger('akvo.rsr')

from django.conf import settings
from django.db.models.signals import pre_save, post_save, post_delete
from django.contrib.admin.models import LogEntry

from registration.signals import user_activated

from akvo.api.models import create_api_key

from akvo.rsr.signals import (
    change_name_of_file_on_change, change_name_of_file_on_create,
    create_publishing_status, create_organisation_account,
    create_payment_gateway_selector, donation_completed,
    act_on_log_entry, user_activated_callback, update_project_budget,
    update_project_funding
)

from benchmark import Benchmark, Benchmarkname
from budget_item import BudgetItem, BudgetItemLabel
from country import Country, RecipientCountry
from category import Category
from focus_area import FocusArea
from goal import Goal
from invoice import Invoice
from link import Link
from location import OrganisationLocation, ProjectLocation, ProjectUpdateLocation
from mini_cms import MiniCMS
from organisation import Organisation
from organisation_account import OrganisationAccount
from partner_site import PartnerSite
from partnership import Partnership
from payment_gateway import PayPalGateway, MollieGateway, PaymentGatewaySelector
from project import Project, PublishingStatus
from project_comment import ProjectComment
from project_update import ProjectUpdate
from region import RecipientRegion
from sms_reporter import SmsReporter
from user_profile import UserProfile


# signals!
user_activated.connect(user_activated_callback)

post_save.connect(create_organisation_account, sender=Organisation)

post_save.connect(create_publishing_status, sender=Project)
post_save.connect(create_payment_gateway_selector, sender=Project)

if getattr(settings, "DONATION_NOTIFICATION_EMAILS", True):
    post_save.connect(donation_completed, sender=Invoice)

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

post_save.connect(create_api_key, sender=UserProfile)
