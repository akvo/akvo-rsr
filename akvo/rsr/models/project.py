# -*- coding: utf-8 -*-
"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""
import dataclasses
import logging
from decimal import Decimal, InvalidOperation
from typing import Dict, Generic, Hashable, Optional, TypeVar
import urllib.parse

from django.conf import settings
from django.contrib.admin.models import LogEntry, ADDITION, CHANGE
from django.contrib.auth import get_user_model
from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import ValidationError, ObjectDoesNotExist, MultipleObjectsReturned
from django.core.mail import send_mail
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.apps import apps
from django.db.models import Sum
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.urls import reverse
from django.utils.safestring import mark_safe
from django.utils.translation import ugettext_lazy as _
from django.db import transaction
from django.db.models import Q
from django.db.models import JSONField
from django.utils.functional import cached_property

from sorl.thumbnail.fields import ImageField

from akvo.codelists.models import (AidType, ActivityScope, ActivityStatus, CollaborationType,
                                   FinanceType, FlowType, TiedStatus)
from akvo.codelists.store.default_codelists import (
    AID_TYPE_VOCABULARY, ACTIVITY_SCOPE, ACTIVITY_STATUS, COLLABORATION_TYPE, CURRENCY,
    FINANCE_TYPE, FLOW_TYPE, TIED_STATUS, BUDGET_IDENTIFIER_VOCABULARY
)
from akvo.utils import (
    codelist_choices, codelist_value, codelist_name, get_thumbnail, rsr_image_path,
    rsr_show_keywords, single_period_dates,
)
from .related_project import ParentChangeDisallowed
from .tree.model import AkvoTreeModel

from ..fields import ProjectLimitedTextField, ValidXMLCharField, ValidXMLTextField
from ..mixins import TimestampsMixin

from .iati_check import IatiCheck
from .result import IndicatorPeriod
from .model_querysets.project import ProjectQuerySet
from .partnership import Partnership
from .project_update import ProjectUpdate
from .project_editor_validation import ProjectEditorValidationSet
from .publishing_status import PublishingStatus
from .budget_item import BudgetItem

logger = logging.getLogger(__name__)

DESCRIPTIONS_ORDER = [
    'project_plan_summary', 'goals_overview', 'background', 'current_status', 'target_group',
    'project_plan', 'sustainability']

"""
Projects in the process of being deleted
Some signals attempt to update projects and they shouldn't attempt to do so
 when a project is being deleted
"""
DELETION_SET = set()


def get_default_descriptions_order():
    return DESCRIPTIONS_ORDER


def image_path(instance, file_name):
    return rsr_image_path(instance, file_name, 'db/project/%(instance_pk)s/%(file_name)s')


class MultipleReportingOrgs(Exception):
    pass


# TODO: add post-save that sets path if none is set
class Project(TimestampsMixin, AkvoTreeModel):
    CURRENCY_CHOICES = codelist_choices(CURRENCY)

    HIERARCHY_OPTIONS = (
        (1, _('Core Activity')),
        (2, _('Sub Activity')),
        (3, _('Lower Sub Activity'))
    )

    LANGUAGE_OPTIONS = (
        ('de', _('German')),
        ('en', _('English')),
        ('es', _('Spanish')),
        ('fr', _('French')),
        ('nl', _('Dutch')),
        ('ru', _('Russian'))
    )

    TARGETS_AT_OPTION = (
        ('period', _('Period')),
        ('indicator', _('Indicator')),
        ('both', _('Both'))
    )

    STATUS_NONE = 'N'
    STATUS_NEEDS_FUNDING = 'H'
    STATUS_ACTIVE = 'A'
    STATUS_COMPLETE = 'C'
    STATUS_CANCELLED = 'L'
    STATUS_ARCHIVED = 'R'
    STATUSES = (
        (STATUS_NONE, ''),
        (STATUS_NEEDS_FUNDING, _('Needs funding')),
        (STATUS_ACTIVE, _('Active')),
        (STATUS_COMPLETE, _('Complete')),
        (STATUS_CANCELLED, _('Cancelled')),
        (STATUS_ARCHIVED, _('Archived')),
    )

    STATUSES_COLORS = {
        '': 'grey',
        '1': 'orange',
        '2': '#AFF167',
        '3': 'grey',
        '4': 'grey',
        '5': 'red',
        '6': 'grey',
    }

    CODE_TO_STATUS = {
        '': 'N',
        '1': 'H',
        '2': 'A',
        '3': 'C',
        '4': 'C',
        '5': 'L',
        '6': 'C'
    }

    STATUS_TO_CODE = {
        'N': '',
        'H': '1',
        'A': '2',
        'C': '3',
        'L': '5',
        'R': '3'
    }

    # Status combinations used in conditionals
    EDIT_DISABLED = []
    DONATE_DISABLED = ['', '3', '4', '5', '6']
    NOT_SUSPENDED = ['', '1', '2', '3', '4', '5']

    title = ValidXMLCharField(_('project title'), max_length=200, db_index=True, blank=True)
    subtitle = ValidXMLCharField(_('project subtitle'), max_length=200, blank=True)
    status = ValidXMLCharField(
        _('status'), max_length=1, choices=STATUSES, db_index=True, default=STATUS_NONE
    )
    iati_status = ValidXMLCharField(
        _('status'), max_length=1, choices=(codelist_choices(ACTIVITY_STATUS)), db_index=True,
        blank=True,
        help_text=_('There are six different project statuses:<br/>'
                    '1) Pipeline/identification: the project is being scoped or planned<br/>'
                    '2) Implementation: the project is currently being implemented<br/>'
                    '3) Completion: the project is complete or the final disbursement has been '
                    'made<br/>'
                    '4) Post-completion: the project is complete or the final disbursement has '
                    'been made, '
                    'but the project remains open pending financial sign off or M&E<br/>'
                    '5) Cancelled: the project has been cancelled<br/>'
                    '6) Suspended: the project has been temporarily suspended '
                    'or the reporting partner no longer uses RSR.')
    )
    categories = models.ManyToManyField(
        'Category', verbose_name=_('categories'), related_name='projects', blank=True
    )
    partners = models.ManyToManyField(
        'Organisation', verbose_name=_('partners'), through='Partnership', related_name='projects',
        blank=True,
    )
    project_plan_summary = ProjectLimitedTextField(
        _('summary of project plan'), max_length=2000, blank=True,
        help_text=_('Enter a brief summary, try to restrict the number of characters to 400 in '
                    'order to display the summary nicely on the project page. The summary should '
                    'explain:<br>'
                    '- Why the project is being carried out;<br>'
                    '- Where it is taking place;<br>'
                    '- Who will benefit and/or participate;<br>'
                    '- What it specifically hopes to accomplish;<br>'
                    '- How those specific goals will be reached')
    )

    current_image = ImageField(
        _('photo'), blank=True, upload_to=image_path,
        help_text=_('Add your project photo here. You can only add one photo. If you have more, '
                    'you can add them via RSR updates when your project is published. A photo '
                    'album will feature on the project page. The photo should not be larger '
                    'than 2 MB in size, and should preferably be in JPG format.'),
    )
    current_image_caption = ValidXMLCharField(
        _('photo caption'), blank=True, max_length=60,
        help_text=_('Briefly describe who or what you see in the photo.')
    )
    current_image_credit = ValidXMLCharField(
        _('photo credit'), blank=True, max_length=60,
        help_text=_('Enter who took the photo.')
    )

    goals_overview = ValidXMLTextField(
        _('goals overview'), blank=True,
        help_text=_('Provide a brief description of the overall project goals. For links and '
                    'styling of the text, <a href="https://github.com/adam-p/markdown-here/wiki/'
                    'Markdown-Cheatsheet" target="_blank">Markdown</a> is supported.')
    )
    current_status = ValidXMLTextField(
        _('baseline situation'), blank=True,
        help_text=_('Describe the situation at the start of the project. For links and styling of '
                    'the text, <a href="https://github.com/adam-p/markdown-here/wiki/Markdown-'
                    'Cheatsheet" target="_blank">Markdown</a> is supported.')
    )
    project_plan = ValidXMLTextField(
        _('project plan'), blank=True,
        help_text=_('Detailed information about the implementation of the project: the what, how, '
                    'who and when. For links and styling of the text, <a href="https://github.com/'
                    'adam-p/markdown-here/wiki/Markdown-Cheatsheet" target="_blank">Markdown</a> '
                    'is supported.')
    )
    sustainability = ValidXMLTextField(
        _('sustainability'), blank=True,
        help_text=_('Describe how you aim to guarantee sustainability of the project until 10 '
                    'years after project implementation. Think about the institutional setting, '
                    'capacity-building, a cost recovery plan, products used, feasible '
                    'arrangements for operation and maintenance, anticipation of environmental '
                    'impact and social integration. For links and styling of the text, '
                    '<a href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet" '
                    'target="_blank">Markdown</a> is supported.')
    )
    background = ValidXMLTextField(
        _('background'), blank=True,
        help_text=_('This should describe the geographical, political, environmental, social '
                    'and/or cultural context of the project, and any related activities that '
                    'have already taken place or are underway. For links and styling of the text, '
                    '<a href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet" '
                    'target="_blank">Markdown</a> is supported.')
    )
    target_group = ProjectLimitedTextField(
        _('target group'), blank=True,
        help_text=_('This should include information about the people, organisations or resources '
                    'that are being impacted by this project. For links and styling of the text, '
                    '<a href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet" '
                    'target="_blank">Markdown</a> is supported.')
    )
    descriptions_order = JSONField(default=get_default_descriptions_order)

    # Result aggregation
    aggregate_children = models.BooleanField(
        _('Aggregate results data from child projects'), default=True,
        help_text=_('By selecting this option, the results data of child projects will be aggregated to this project. '
                    'In the child project(s), this can be turned off per project as well.')
    )
    aggregate_to_parent = models.BooleanField(
        _('Aggregate results data to parent project'), default=True,
        help_text=_('By selecting this option, the results data of this project will be aggregated '
                    'to the parent project.')
    )

    # Results framework (always on)
    is_impact_project = models.BooleanField(
        _('is rsr impact project'), default=True,
        help_text=_('Determines whether the results framework is active for this project.')
    )

    # Private projects
    is_public = models.BooleanField(
        _('is public project'), default=True,
        help_text=_('Determines whether this project is a public project.')
    )

    # Parent contributing project
    # When the project is on RSR, this field is used
    contributes_to_project = models.ForeignKey("self", models.SET_NULL, null=True)
    # when the project isn't on RSR, this field is used
    # they can't be set together
    external_parent_iati_activity_id = ValidXMLCharField(
        _('IATI identifier'), max_length=100, blank=True, db_index=True, null=True,
        help_text=_('This is a globally unique identifier for an activity. It is a requirement '
                    'to be compliant with the IATI standard. This code consists of: '
                    '[country code]-[Chamber of Commerce number]-[organisation’s internal project '
                    'code]. For Dutch organisations this is e.g. NL-KVK-31156201-TZ1234. For more '
                    'information see') + ' <a href="http://iatistandard.org/202/activity-standard/'
                                         'iati-activities/iati-activity/iati-identifier/'
                                         '#definition" target="_blank">http://iatistandard.org/'
                                         '201/activity-standard/iati-activities/iati-activity/'
                                         'iati-identifier/#definition</a>'
    )

    # project meta info
    language = ValidXMLCharField(
        max_length=2, choices=LANGUAGE_OPTIONS, blank=True,
        help_text=_('Enter the language used when entering the details for this project.')
    )
    notes = ValidXMLTextField(
        _('project comments'), blank=True,
        help_text=_('The project comments are only for internal use and will not be displayed '
                    'anywhere on the project page.')
    )
    keywords = models.ManyToManyField(
        'Keyword', verbose_name=_('keyword'), related_name='projects', blank=True,
        help_text=_('Choose a keyword to link to this project.')
    )
    targets_at = ValidXMLCharField(
        max_length=9, choices=TARGETS_AT_OPTION, default='period',
        help_text=_('Which project attributes that has a target value')
    )

    # budget
    currency = ValidXMLCharField(
        _('currency'), choices=CURRENCY_CHOICES, max_length=3, default='EUR',
        help_text=_('The default currency for this project. Used in all financial '
                    'aspects of the project.')
    )
    date_start_planned = models.DateField(
        _('start date (planned)'), null=True, blank=True,
        help_text=_('Enter the original start date of the project (DD/MM/YYYY).')
    )
    date_start_actual = models.DateField(
        _('start date (actual)'), null=True, blank=True,
        help_text=_('Enter the actual start date of the project (DD/MM/YYYY).')
    )
    date_end_planned = models.DateField(
        _('end date (planned)'), null=True, blank=True,
        help_text=_('Enter the original end date of the project (DD/MM/YYYY).')
    )
    date_end_actual = models.DateField(
        _('end date (actual)'), null=True, blank=True,
        help_text=_('Enter the actual end date of the project (DD/MM/YYYY).')
    )

    primary_location = models.ForeignKey('ProjectLocation', null=True, on_delete=models.SET_NULL)
    # primary_organisation is a denormalized field used for performance of the project list page
    primary_organisation = models.ForeignKey('Organisation', null=True, on_delete=models.SET_NULL)

    # donate url
    donate_url = models.URLField(
        _('donate url'), null=True, blank=True, max_length=200,
        help_text=_('Add a donation url for this project. If no URL is added, it is not possible '
                    'to donate to this project through RSR.')
    )

    # donations
    donations = models.DecimalField(
        max_digits=14, decimal_places=2, blank=True, null=True, db_index=True, default=0,
        help_text=_('The total sum of donations the project has already recieved.')
    )

    # extra IATI fields
    iati_activity_id = ValidXMLCharField(
        _('IATI identifier'), max_length=100, blank=True, db_index=True, null=True, unique=True,
        help_text=_('This is a globally unique identifier for this activity. It is a requirement '
                    'to be compliant with the IATI standard. This code consists of: '
                    '[country code]-[Chamber of Commerce number]-[organisation’s internal project '
                    'code]. For Dutch organisations this is e.g. NL-KVK-31156201-TZ1234. For more '
                    'information see') + ' <a href="http://iatistandard.org/202/activity-standard/'
        'iati-activities/iati-activity/iati-identifier/'
        '#definition" target="_blank">http://iatistandard.org/'
        '201/activity-standard/iati-activities/iati-activity/'
        'iati-identifier/#definition</a>'
    )
    hierarchy = models.PositiveIntegerField(
        _('hierarchy'), null=True, blank=True, choices=HIERARCHY_OPTIONS,
        help_text=_('If you are reporting multiple levels of projects in RSR, you can specify '
                    'whether this is a core, sub, or lower sub activity here.')
    )
    project_scope = ValidXMLCharField(
        _('project scope'), blank=True, max_length=2, choices=codelist_choices(ACTIVITY_SCOPE),
        help_text=_('Select the geographical scope of the project.')
    )
    capital_spend_percentage = models.DecimalField(
        _('capital spend percentage'), blank=True, null=True, max_digits=4, decimal_places=1,
        validators=[MaxValueValidator(100), MinValueValidator(0)],
        help_text=_('The percentage of the total commitment allocated to or planned for capital '
                    'expenditure. Content must be a positive decimal number between 0 and 100, '
                    'with no percentage sign. Use a period to denote decimals.')
    )
    collaboration_type = ValidXMLCharField(
        _('collaboration type'), blank=True, max_length=1,
        choices=codelist_choices(COLLABORATION_TYPE),
        help_text=_('This is the IATI identifier for the type of collaboration involved. For '
                    'reference, please visit: <a href="http://iatistandard.org/202/codelists/'
                    'CollaborationType/" target="_blank">http://iatistandard.org/202/codelists/'
                    'CollaborationType/</a>.')
    )
    default_aid_type_vocabulary = ValidXMLCharField(
        _('default aid type vocabulary'), blank=True, max_length=1, default='1',
        choices=codelist_choices(AID_TYPE_VOCABULARY),
        help_text=_('This is the IATI identifier for the type of vocabulary being used for '
                    'describing the type of the aid being supplied or activity '
                    'being undertaken. For reference, please visit: <a '
                    'href="http://iatistandard.org/203/codelists/AidTypeVocabulary/" target='
                    '"_blank"> http://iatistandard.org/203/codelists/AidTypeVocabulary/</a>.')
    )
    default_aid_type = ValidXMLCharField(
        _('default aid type'),
        blank=True, max_length=3,
        help_text=_('This is the IATI identifier for the type of aid being supplied or activity '
                    'being undertaken. This element specifies a default for all the project’s '
                    'financial transactions. This can be overridden at the individual transaction '
                    'level. For reference, please visit: <a href="http://iatistandard.org/202/'
                    'codelists/AidType/" target="_blank">http://iatistandard.org/202/codelists/'
                    'AidType/</a>.')
    )
    default_finance_type = ValidXMLCharField(
        _('default finance type'), blank=True, max_length=3,
        choices=codelist_choices(FINANCE_TYPE),
        help_text=_('This is the IATI identifier for the type of finance. This element specifies '
                    'a default for all the transactions in the project’s activity report; it can '
                    'be overridden at the individual transaction level. For reference visit: '
                    '<a href="http://iatistandard.org/202/codelists/FinanceType/" target="_blank">'
                    'http://iatistandard.org/202/codelists/FinanceType/</a>.')
    )
    default_flow_type = ValidXMLCharField(
        _('default flow type'), blank=True, max_length=2, choices=codelist_choices(FLOW_TYPE),
        help_text=_('This is the IATI identifier for how the activity (project) is funded. For '
                    'reference, please visit: <a href="http://iatistandard.org/202/codelists/'
                    'FlowType/" target="_blank">http://iatistandard.org/202/codelists/'
                    'FlowType/</a>.')
    )
    default_tied_status = ValidXMLCharField(
        _('default tied status'), blank=True, max_length=10, choices=codelist_choices(TIED_STATUS),
        help_text=_('This element specifies a default for all the activity’s financial '
                    'transactions; it can be overridden at the individual transaction level. For '
                    'reference, please visit: <a href="http://iatistandard.org/202/codelists/'
                    'TiedStatus/" target="_blank">http://iatistandard.org/202/codelists/'
                    'TiedStatus/</a>.')
    )
    country_budget_vocabulary = ValidXMLCharField(
        _('country budget vocabulary'), blank=True, max_length=1,
        choices=codelist_choices(BUDGET_IDENTIFIER_VOCABULARY),
        help_text=_('Enter an IATI code for the common functional classification or country '
                    'system (this allows for common codes, country-specific codes, or any other '
                    'classification agreed between countries and donors) see: '
                    '<a href="http://iatistandard.org/202/codelists/BudgetIdentifierVocabulary/" '
                    'target="_blank">http://iatistandard.org/202/codelists/'
                    'BudgetIdentifierVocabulary/</a>.')
    )
    humanitarian = models.BooleanField(
        _('humanitarian project'), null=True,
        help_text=_('Determines whether this project relates entirely or partially to humanitarian aid.'),
    )

    # Project editor settings
    validations = models.ManyToManyField(
        'ProjectEditorValidationSet', verbose_name=_('validations'), related_name='projects'
    )

    use_project_roles = models.BooleanField(
        verbose_name=_(u"use project roles"),
        default=False,
        help_text=_(u'Toggle between using project roles and employment based permissions'))

    run_iati_checks = models.BooleanField(
        verbose_name=_(u"run iati checks"),
        default=False,
        help_text=_(u'Flag to indicate that the project has pending IATI checks to be run')
    )

    # denormalized data
    budget = models.DecimalField(
        _('project budget'), max_digits=14, decimal_places=2, blank=True, null=True,
        db_index=True, default=0
    )
    funds = models.DecimalField(
        max_digits=14, decimal_places=2, blank=True, null=True, db_index=True, default=0
    )
    funds_needed = models.DecimalField(
        max_digits=14, decimal_places=2, blank=True, null=True, db_index=True, default=0
    )
    last_update = models.ForeignKey(
        ProjectUpdate, related_name='the_project', null=True, on_delete=models.SET_NULL
    )

    objects = ProjectQuerySet.as_manager()

    class Meta:
        app_label = 'rsr'
        verbose_name = _('project')
        verbose_name_plural = _('projects')
        ordering = ['-id', ]
        permissions = (
            ('post_updates', 'Can post updates'),
        )

    def delete(self, using=None, keep_parents=False):
        # Delete results on the project, before trying to delete the project,
        # since the RelatedProject object on the project refuses to get deleted
        # if there are existing results, causing the delete to raise 500s
        if self.pk:
            DELETION_SET.add(self.pk)
        try:
            self.results.all().delete()
            return super(Project, self).delete(using=using, keep_parents=keep_parents)
        finally:
            DELETION_SET.discard(self.pk)

    def save(self, *args, **kwargs):
        # Strip title of any trailing or leading spaces
        if self.title:
            self.title = self.title.strip()

        # Strip subtitle of any trailing or leading spaces
        if self.subtitle:
            self.subtitle = self.subtitle.strip()

        # Strip IATI ID of any trailing or leading spaces
        if self.iati_activity_id:
            self.iati_activity_id = self.iati_activity_id.strip()

        # In order for the IATI activity IDs to be unique, we set them to None when they're empty
        if not self.iati_activity_id:
            self.iati_activity_id = None

        orig, orig_aggregate_children, orig_aggregate_to_parent = None, None, None
        if self.pk:
            # If the project is being deleted, don't allow saving it
            if self.pk in DELETION_SET:
                return
            orig = Project.objects.get(pk=self.pk)

            # Update funds and funds_needed if donations change.  Any other
            # changes (budget, pledged amounts, ...) are handled by signals.
            if self.donations != orig.donations:
                self.funds = self.get_funds()
                self.funds_needed = self.get_funds_needed()

            # Update legacy status field
            if self.iati_status != orig.iati_status:
                self.status = self.CODE_TO_STATUS[self.iati_status]
                super(Project, self).save(update_fields=['status'])

            # Update IATI status field
            if self.status != orig.status:
                self.iati_status = self.STATUS_TO_CODE[self.status]
                super(Project, self).save(update_fields=['iati_status'])

            # Root project with modified targets_at must propagate change to children
            if self.targets_at != orig.targets_at and hasattr(self, "projecthierarchy"):
                descendants = self.descendants()
                descendants.exclude(pk=self.pk).update(targets_at=self.targets_at)

            orig_aggregate_children = orig.aggregate_children
            orig_aggregate_to_parent = orig.aggregate_to_parent

        super(Project, self).save(*args, **kwargs)

        if orig:
            # Update aggregation from children
            if self.aggregate_children != orig_aggregate_children:
                for period in IndicatorPeriod.objects.filter(indicator__result__project_id=self.pk):
                    if self.aggregate_children:
                        period.recalculate_period()
                    else:
                        period.recalculate_period(only_self=True)

            # Update aggregation to parent
            if self.aggregate_to_parent != orig_aggregate_to_parent:
                for period in IndicatorPeriod.objects.filter(indicator__result__project_id=self.pk):
                    if period.parent_period:
                        period.parent_period.recalculate_period()

    def clean(self):
        # Don't allow a start date before an end date
        if self.date_start_planned and self.date_end_planned and \
                (self.date_start_planned > self.date_end_planned):
            raise ValidationError(
                {'date_start_planned': '%s' % _('Start date (planned) cannot be at a later '
                                                'time than end date (planned).'),
                 'date_end_planned': '%s' % _('Start date (planned) cannot be at a later '
                                              'time than end date (planned).')}
            )
        if self.date_start_actual and self.date_end_actual and \
                (self.date_start_actual > self.date_end_actual):
            raise ValidationError(
                {'date_start_actual': '%s' % _('Start date (actual) cannot be at a later '
                                               'time than end date (actual).'),
                 'date_end_actual': '%s' % _('Start date (actual) cannot be at a later '
                                             'time than end date (actual).')}
            )

        if self.contributes_to_project and self.external_parent_iati_activity_id:
            raise ValidationError(
                "contributes_to_project cannot be set at the same time as external_parent_iati_activity_id",
            )

    def get_absolute_url(self):
        return reverse('project-main', kwargs={'project_id': self.pk})

    @property
    def cacheable_url(self):
        # Language names are 2 chars long
        return self.get_absolute_url()[3:]

    def get_iati_profile_url(self):
        if not self.iati_project_exports.filter(status=2, iati_export__latest=True).count():
            return None
        if not self.primary_organisation or not self.primary_organisation.iati_org_id:
            return None
        if not self.iati_activity_id:
            return None
        org_id = urllib.parse.quote(self.primary_organisation.iati_org_id, safe='')
        act_id = urllib.parse.quote(self.iati_activity_id, safe='')
        return f"https://d-portal.org/ctrack.html?reporting_ref={org_id}#view=act&aid={act_id}"

    @cached_property
    def is_unep_project(self):
        return 'UNEP Marine Litter Stocktake' in self.keyword_labels()

    def accepts_donations(self):
        """Returns True if a project accepts donations, otherwise False.
        A project accepts donations when the donate url is set, the project is published,
        the project needs funding and is not cancelled or archived."""
        if self.donate_url and self.is_published() and self.funds_needed > 0 and \
                self.iati_status not in Project.DONATE_DISABLED:
            return True
        return False

    # New API, de-normalized fields support
    def get_budget(self):
        budgets = self.budget_items.filter(amount__gt=0)
        total_budgets = budgets.filter(label__label='Total')

        if total_budgets.exists():
            revised_total_budgets = total_budgets.filter(type='2')

            if revised_total_budgets.exists():
                return revised_total_budgets.order_by('-pk')[0].amount
            else:
                return total_budgets.order_by('-pk')[0].amount

        elif budgets.exists():
            summed_up_budget = 0

            for budget in budgets:
                if budgets.filter(label=budget.label, type='2').exists():
                    if budget == budgets.filter(label=budget.label, type='2').order_by('-pk')[0]:
                        summed_up_budget += budget.amount
                else:
                    summed_up_budget += budget.amount

            return summed_up_budget

        else:
            return 0

    def get_budget_project_currency(self):
        qs = BudgetItem.objects.filter(project__id=self.pk).filter(currency__exact='').aggregate(Sum('amount'))
        budget_project_currency = list(qs.values())[0]
        return budget_project_currency if budget_project_currency >= 1 else 0.0

    def update_budget(self):
        "Update de-normalized field"
        self.budget = self.get_budget()
        self.save()

    def get_pledged(self):
        """ How much is pledges by funding organisations"""
        return Partnership.objects.filter(project__exact=self).filter(
            iati_organisation_role__exact=Partnership.IATI_FUNDING_PARTNER
        ).aggregate(Sum('funding_amount'))['funding_amount__sum'] or 0

    def get_funds(self):
        """ All money given to a project"""
        return self.donations + self.get_pledged()

    def update_funds(self):
        "Update de-normalized field"
        self.funds = self.get_funds()
        self.save()

    def get_funds_needed(self):
        """
        How much more is needed to fulfill the project's budget needs. In case of a negative value
        or a value less than 1, the value is set to 0.
        """
        funds_needed = self.get_budget() - self.get_funds()
        return funds_needed if funds_needed >= 1 else 0.0

    def get_funds_needed_project_currency(self):
        "Funds need in project currency, only used if budget items have multiple currencies"
        funds_needed = Decimal(self.get_budget_project_currency()) - self.get_funds()
        return funds_needed if funds_needed >= 1 else 0.0

    def update_funds_needed(self):
        "Update de-normalized field"
        self.funds_needed = self.get_funds_needed()
        self.save()

    # End new API

    @property
    def last_modified_by(self):
        """Return the user who last edited this project and when the edit was made."""
        entries = LogEntry.objects.filter(
            object_id=str(self.id),
            content_type=ContentType.objects.get_for_model(self),
            action_flag=CHANGE,
        ).order_by('action_time')
        if not entries.exists():
            return None
        last_entry = entries.last()
        user_id = last_entry.user_id
        last_modified_at = last_entry.action_time
        User = get_user_model()
        return dict(user=User.objects.only('first_name', 'last_name', 'email').get(id=user_id),
                    last_modified_at=last_modified_at)

    @property
    def reporting_partner(self):
        """ In some cases we need the partnership object instead of the organisation to be able to
            access is_secondary_reporter
        """
        try:
            return self.partnerships.get(
                iati_organisation_role=Partnership.IATI_REPORTING_ORGANISATION)
        except ObjectDoesNotExist:
            return None
        except MultipleObjectsReturned:
            # A project with multiple reporting organisations should not happen, but in practice
            # it sometimes does unfortunately. In these cases we check if there's one "primary
            # reporter" and return that. If not, we return the first reporting organisation.
            primary_reporters = self.partnerships.filter(
                iati_organisation_role=Partnership.IATI_REPORTING_ORGANISATION).exclude(
                    is_secondary_reporter=True)
            if primary_reporters.count() == 1:
                return primary_reporters[0]
            else:
                return self.partnerships.filter(
                    iati_organisation_role=Partnership.IATI_REPORTING_ORGANISATION)[0]

    @property
    def reporting_org(self):
        """ Returns the organisation of the partnership that is the reporting-org, if there is one
        """
        return self.reporting_partner.organisation if self.reporting_partner else None

    def organisation_codelist(self):
        """Return organisation specific custom codelist, if any."""

        if self.reporting_org:
            return self.reporting_org.codelist

        return None

    @property
    def publishing_orgs(self):
        """
        Returns the organisations that have the right to publish the project. In other words, that
        have Organisation.can_create_project set to True.
        """
        return self.partners.filter(can_create_projects=True)

    def set_reporting_org(self, organisation):
        """ Set the reporting-org for the project."""
        if self.reporting_partner is not None:
            partnership = self.reporting_partner
            partnership.organisation = organisation
            partnership.save(update_fields=['organisation'])
        else:
            Partnership.objects.create(
                project=self,
                organisation=organisation,
                iati_organisation_role=Partnership.IATI_REPORTING_ORGANISATION
            )

    def set_accountable_partner(self, organisation):
        """Set the organisation as an accountable partner."""
        try:
            Partnership.objects.get_or_create(
                project=self,
                organisation=organisation,
                iati_organisation_role=Partnership.IATI_ACCOUNTABLE_PARTNER
            )
        except Partnership.MultipleObjectsReturned:
            # Ignore if there are one or more such partnerships
            pass

    def countries(self):
        """Return a list of countries for the project."""

        country_codes = {c.country.lower() for c in self.recipient_countries.all()}
        return (
            [country for country in self.recipient_countries.all()]
            + [
                location.country for location in self.locations.all()
                if location.country and location.country.iso_code not in country_codes
            ]
        )

    def __str__(self):
        return '%s' % self.title

    def updates_desc(self):
        """ProjectUpdate list for self, newest first."""
        return self.project_updates.select_related('user')

    def show_status(self):
        "Show the current project status"
        if not self.iati_status == '0':
            return mark_safe(
                "<span style='color: %s;'>%s</span>" % (self.STATUSES_COLORS[self.iati_status],
                                                        codelist_name(ActivityStatus, self, 'iati_status'))
            )
        else:
            return ''

    def show_plain_status(self):
        "Show the current project status value without styling"
        if not self.iati_status == '0':
            return codelist_name(ActivityStatus, self, 'iati_status')
        else:
            return ''

    def show_keywords(self):
        return rsr_show_keywords(self)
    show_keywords.short_description = 'Keywords'
    show_keywords.allow_tags = True
    show_keywords.admin_order_field = 'keywords'

    def is_published(self):
        if self.publishingstatus:
            return self.publishingstatus.status == PublishingStatus.STATUS_PUBLISHED
        return False
    is_published.boolean = True

    def publish(self):
        """Set the publishing status to published."""

        self.publishingstatus.status = PublishingStatus.STATUS_PUBLISHED
        self.publishingstatus.save()

    def unpublish(self):
        """Set the publishing status to unpublished."""

        self.publishingstatus.status = PublishingStatus.STATUS_UNPUBLISHED
        self.publishingstatus.save()

    def is_empty(self):
        exclude_fields = ['benchmarks', 'categories', 'created_at', 'crsadd', 'currency',
                          'custom_fields', 'fss', 'iati_checks', 'iati_project_exports',
                          'iatiexport', 'id', 'is_impact_project', 'is_public',
                          'last_modified_at', 'partners', 'partnerships', 'primary_organisation',
                          'primary_organisation_id', 'publishingstatus', 'status', 'validations']

        for field in Project._meta.get_all_field_names():
            if field not in exclude_fields:
                field_value = getattr(self, field)
                m2m_field = getattr(field_value, 'all', None)
                if (m2m_field and m2m_field()) or (not m2m_field and getattr(self, field)):
                    return False

        return True

    def budget_total(self):
        return Project.objects.budget_total().get(pk=self.pk).budget_total

    def has_multiple_budget_currencies(self):
        # Using a python loop for iteration, because it's faster when
        # budget_items have been pre-fetched
        budget_items = self.budget_items.all()
        num_currencies = len(
            set([self.currency] + [c.currency for c in budget_items if c.currency])
        )
        return num_currencies > 1

    def budget_currency_totals(self):
        budget_items = BudgetItem.objects.filter(project__id=self.pk)
        unique_currencies = {c.currency if c.currency else self.currency for c in budget_items}

        totals = {}
        for c in unique_currencies:
            if c == self.currency:
                totals[c] = list(budget_items.filter(Q(currency='') | Q(currency=c)).aggregate(Sum('amount')).values())[0]
            else:
                totals[c] = list(budget_items.filter(currency=c).aggregate(Sum('amount')).values())[0]

        return totals

    def budget_currency_totals_string(self):

        totals = self.budget_currency_totals()

        total_string = ''

        for t in totals:
            total_string += '%s %s, ' % ("{:,.0f}".format(totals[t]), t)

        return total_string[:-2]

    def focus_areas(self):
        from .focus_area import FocusArea
        return FocusArea.objects.filter(categories__in=self.categories.all()).distinct()
    focus_areas.allow_tags = True

    # shortcuts to linked orgs for a single project
    def _partners(self, role=None):
        """
        Return the partner organisations to the project.
        If role is specified only organisations having that role are returned
        """
        orgs = self.partners.all()
        if role:
            return orgs.filter(partnerships__iati_organisation_role=role).distinct()
        else:
            return orgs.distinct()

    def find_primary_organisation(self):
        """
        This method tries to return the "managing" partner organisation.
        """
        # Pick the reporting org first
        if self.reporting_org:
            return self.reporting_org
        # Otherwise, pick the partner that can publish the project
        if self.publishing_orgs:
            return self.publishing_orgs[0]
        # Otherwise, grab the first accountable partner we find
        elif self.support_partners():
            return self.support_partners()[0]
        # Panic mode: grab the first partner we find
        elif self.all_partners():
            return self.all_partners()[0]
        # Uh-oh...
        else:
            return None

    def field_partners(self):
        return self._partners(Partnership.IATI_IMPLEMENTING_PARTNER)

    def funding_partners(self):
        return self._partners(Partnership.IATI_FUNDING_PARTNER)

    def sponsor_partners(self):
        return self._partners(Partnership.AKVO_SPONSOR_PARTNER)

    def support_partners(self):
        return self._partners(Partnership.IATI_ACCOUNTABLE_PARTNER)

    def extending_partners(self):
        return self._partners(Partnership.IATI_EXTENDING_PARTNER)

    def all_partners(self):
        return self._partners()

    def partner_organisation_pks(self):
        """Return all organisation ids along with hierarchy owner

        If project is in a hierarchy, includes the hierarchy owner in the
        partners list.

        """
        pks = set(self._partners().values_list('id', flat=True))
        hierarchy_org = self.get_hierarchy_organisation()
        if hierarchy_org is not None:
            pks.add(hierarchy_org.id)
        return pks

    def partners_info(self):
        """
        Return a dict of the distinct partners with the organisation as key and as content:
        1. The partnerships of the organisation
        2. The (added up) funding amount, if available. Otherwise None.
        E.g. {<Organisation 1>: [[<Partnership 1>,], 10000],}
        """
        partners_info = {}
        for partnership in Partnership.objects.filter(project=self):
            funding_amount = partnership.funding_amount if partnership.funding_amount else None
            if partnership.organisation not in partners_info:
                partners_info[partnership.organisation] = [[partnership], funding_amount]
            else:
                partners_info[partnership.organisation][0].append(partnership)
                existing_funding_amount = partners_info[partnership.organisation][1]
                if funding_amount and existing_funding_amount:
                    partners_info[partnership.organisation][1] += funding_amount
                elif funding_amount:
                    partners_info[partnership.organisation][1] = funding_amount
        return partners_info

    def funding_partnerships(self):
        "Return the Partnership objects associated with the project that have funding information"
        return self.partnerships.filter(iati_organisation_role=Partnership.IATI_FUNDING_PARTNER).order_by('organisation__name').prefetch_related('organisation').all()

    def iati_project_scope(self):
        return codelist_value(ActivityScope, self, 'project_scope')

    def iati_project_scope_unicode(self):
        return str(self.iati_project_scope())

    def iati_collaboration_type(self):
        return codelist_value(CollaborationType, self, 'collaboration_type')

    def iati_collaboration_type_unicode(self):
        return str(self.iati_collaboration_type())

    def iati_default_flow_type(self):
        return codelist_value(FlowType, self, 'default_flow_type')

    def iati_default_flow_type_unicode(self):
        return str(self.iati_default_flow_type())

    def iati_default_finance_type(self):
        return codelist_value(FinanceType, self, 'default_finance_type')

    def iati_default_finance_type_unicode(self):
        return str(self.iati_default_finance_type())

    def iati_default_aid_type(self):
        return codelist_value(AidType, self, 'default_aid_type')

    def iati_default_aid_type_unicode(self):
        return str(self.iati_default_aid_type())

    def iati_default_tied_status(self):
        return codelist_value(TiedStatus, self, 'default_tied_status')

    def iati_default_tied_status_unicode(self):
        return str(self.iati_default_tied_status())

    def sector_categories_codes(self):
        from .sector import Sector
        sector_categories = Sector.objects.filter(project=self, vocabulary='2') | \
            Sector.objects.filter(project=self, vocabulary='DAC-3')
        return [sector.iati_sector_codes for sector in sector_categories]

    def sector_categories(self):
        from .sector import Sector
        sector_categories = Sector.objects.filter(project=self, vocabulary='2') | \
            Sector.objects.filter(project=self, vocabulary='DAC-3')
        return [sector.iati_sector for sector in sector_categories]

    def has_relations(self):
        return self.has_ancestors or self.children() or self.siblings()

    def uses_single_indicator_period(self) -> Optional[str]:
        """Return the settings name of the hierarchy if there is one"""
        root = self.get_root()
        root_projects = settings.SINGLE_PERIOD_INDICATORS['root_projects']
        pk = root.pk
        if pk in root_projects:
            return root_projects[pk]

    def in_eutf_hierarchy(self):
        """Check if the project is a part of the EUTF hierarchy."""
        # FIXME: Ideally, we shouldn't need such a function and all
        # functionality should be generic enough to enable/disable for other
        # organisations.
        return self.get_root().id == settings.EUTF_ROOT_PROJECT

    def in_nuffic_hierarchy(self):
        """Check if the project is a part of the Nuffic hierarchy."""
        return self.get_root().id == settings.NUFFIC_ROOT_PROJECT

    def add_to_program(self, program):
        self.set_reporting_org(program.reporting_org)
        # Set validation sets
        for validation_set in program.validations.all():
            self.add_validation_set(validation_set)
        # set parent
        self.set_parent(program).save()
        # Import Results
        self.import_results()
        # Refresh to get updated attributes
        self.refresh_from_db()

    def is_master_program(self):
        """Return True if the project is a master program."""

        from akvo.rsr.models import ProjectHierarchy

        try:
            hierarchy = ProjectHierarchy.objects.get(root_project=self)
            return hierarchy.is_master
        except ProjectHierarchy.DoesNotExist:
            return False

    def is_hierarchy_root(self):
        """Return True if the project is root project in a hierarchy."""
        return hasattr(self, "projecthierarchy")

    def get_hierarchy_organisation(self):
        """Return the hierarchy organisation if project belongs to one."""

        from akvo.rsr.models import ProjectHierarchy

        try:
            hierarchy = ProjectHierarchy.objects.get(root_project=self.get_root())
            return hierarchy.organisation
        except ProjectHierarchy.DoesNotExist:
            return None

    def get_program(self):
        """Return the program which this project includes."""
        from akvo.rsr.models import ProjectHierarchy
        ancestor = self.get_root()
        if ProjectHierarchy.objects.filter(root_project=ancestor).count() > 0:
            return ancestor
        else:
            return None

    def project_dates(self):
        """ Return the project start and end dates, preferably the actuals. If they are not set, use
            the planned values.
        """
        start_date = (self.date_start_actual if self.date_start_actual
                      else self.date_start_planned)
        end_date = (self.date_end_actual if self.date_end_actual
                    else self.date_end_planned)
        return start_date, end_date

    def project_hierarchy_context(self, context):
        "Add info used in single period hierarchy projects if present"
        hierarchy_name = self.uses_single_indicator_period()
        context['start_date'], context['end_date'] = self.project_dates()

        if hierarchy_name:
            context['hierarchy_name'] = hierarchy_name
            (
                context['needs_reporting_timeout_days'],
                context['period_start'],
                context['period_end']
            ) = single_period_dates(hierarchy_name)
        return context

    def check_mandatory_fields(self):
        from ...iati.checks.iati_checks import IatiChecks

        iati_checks = IatiChecks(self)
        return iati_checks.perform_checks()

    def schedule_iati_checks(self):
        self.run_iati_checks = True
        self.save(update_fields=['run_iati_checks'])

    def update_iati_checks(self):
        """
        First, removes the current IATI checks, then adds new IATI checks.
        """

        # Perform new checks
        iati_checks = self.check_mandatory_fields()
        # FIXME: Do we really need to create the "success" check objects? Where
        # do we use them?
        status_codes = {
            'success': 1,
            'warning': 2,
            'error': 3
        }
        checks = [
            IatiCheck(project=self, status=status_codes[status], description=description)
            for (status, description) in iati_checks[1] if status in status_codes
        ]

        with transaction.atomic():
            # Remove old IATI checks
            self.iati_checks.all().delete()
            # Save new checks to DB
            IatiCheck.objects.bulk_create(checks)
            # Mark project as checked
            self.run_iati_checks = False
            self.save(update_fields=['run_iati_checks'])

    def iati_checks_status(self, status):
        return [check for check in self.iati_checks.all() if check.status == status]

    def iati_successes(self):
        return [check.description for check in self.iati_checks_status(1)]

    def iati_successes_unicode(self):
        return str(self.iati_successes())

    def iati_warnings(self):
        return [check.description for check in self.iati_checks_status(2)]

    def iati_warnings_unicode(self):
        return str(self.iati_warnings())

    def iati_errors(self):
        return [check.description for check in self.iati_checks_status(3)]

    def iati_errors_unicode(self):
        return str(self.iati_errors())

    def iati_prefixes(self):
        """Return the IATI ID prefixes for the project.

        Based on the reporting organisations, returns the IATI prefixes.

        """
        from akvo.rsr.models import Organisation

        reporting_orgs = self.partnerships.filter(
            iati_organisation_role=Partnership.IATI_REPORTING_ORGANISATION
        ).values_list('organisation_id', flat=True)
        org_ids = set(reporting_orgs)
        if self.in_eutf_hierarchy():
            org_ids.add(settings.EUTF_ORG_ID)
        prefixes = Organisation.objects.filter(id__in=org_ids)\
                                       .values_list('iati_prefixes', flat=True)
        prefixes = [prefix.strip().strip(';') for prefix in prefixes if prefix is not None]
        prefixes = ';'.join([prefix for prefix in prefixes if prefix])
        return prefixes.split(';') if prefixes else []

    def iati_identifier_context(self):
        iati_activity_id_prefix = iati_activity_id_suffix = ''
        iati_id = self.iati_activity_id or ''

        iati_prefixes = self.iati_prefixes()
        for prefix in iati_prefixes:
            if iati_id.startswith(prefix):
                iati_activity_id_prefix = prefix
                break

        iati_activity_id_suffix = iati_id[len(iati_activity_id_prefix):]
        data = {
            'iati_prefixes': iati_prefixes,
            'iati_activity_id_prefix': iati_activity_id_prefix,
            'iati_activity_id_suffix': iati_activity_id_suffix,
        }
        return data

    def keyword_logos(self):
        """Return the keywords of the project which have a logo."""
        return self.keywords.exclude(logo='')

    def keyword_labels(self):
        return [keyword.label for keyword in self.keywords.all()]

    def has_imported_results(self):
        Result = apps.get_model('rsr', 'Result')
        return Result.objects.filter(project=self).exclude(parent_result=None).count() > 0

    def check_imported_results(self):
        """
        Ensure that a project doesn't have results which were imported from a parent
        """
        if self.has_imported_results():
            raise ParentChangeDisallowed()

    def delete_parent(self, force=False, update_descendants=True):
        self.check_imported_results()
        self.check_child_imported_results()

        return super().delete_parent()

    def check_child_imported_results(self):
        """Make sure children haven't imported results"""
        Result = apps.get_model('rsr', 'Result')
        imported_results = Result.objects.filter(project=self, child_results__isnull=False)
        if imported_results.exists():
            raise ParentChangeDisallowed()

    def check_old_parent_results(self, new_parent: "Project"):
        """
        Ensure imported results all point to the new parent
        """
        Result = apps.get_model('rsr', 'Result')
        old_parent_results = Result.objects.filter(child_results__project=self).exclude(project=new_parent)
        if old_parent_results.exists():
            raise ParentChangeDisallowed()

    def set_parent(self, parent_project: "Project", force: bool = False):
        if not force:
            self.check_old_parent_results(parent_project)
        return super().set_parent(parent_project)

    def add_validation_set(self, validation_set):
        if validation_set not in self.validations.all():
            self.validations.add(validation_set)

    ###################################
    # RSR Impact projects #############
    ###################################

    def import_results(self):
        """Import results from the parent project."""
        import_failed = 0
        import_success = 1

        if self.has_imported_results():
            return import_failed, 'Project has already imported results'

        parent = self.parent()
        if parent:
            parent_project = parent
        else:
            return import_failed, 'Project does not have a parent project'

        self.do_import_results(parent_project)
        return import_success, 'Results imported'

    def do_import_results(self, parent_project):

        for dimension_name in parent_project.dimension_names.all():
            # Only import dimension names that have not been imported before
            if not self.dimension_names.filter(parent_dimension_name=dimension_name).exists():
                self.copy_dimension_name(dimension_name)

        for result in parent_project.results.all():
            # Only import results that have not been imported before
            if not self.results.filter(parent_result=result).exists():
                self.copy_result(result)

        # Copy the default periods after copying the results to not create new
        # periods, from the parent, which may already be present from the parent!
        for parent_default_period in parent_project.default_periods.all():
            if not self.default_periods.filter(parent=parent_default_period).exists():
                self.copy_default_period(parent_default_period)

    def import_result(self, parent_result_id):
        """Import a specific result from the parent project."""

        # Check that we have a parent project and that project of parent
        # result is that parent
        parent = self.parent()
        if parent:
            parent_project = parent
        else:
            raise Project.DoesNotExist("Project has no parent")

        Result = apps.get_model('rsr', 'Result')

        # Check that we have a parent result
        parent_result = Result.objects.get(pk=parent_result_id, project=parent_project)

        # Check that we don't have an result that has parent_result as parent already.
        try:
            self.results.get(parent_result=parent_result)
            raise ValidationError("Result already exists")
        except Result.DoesNotExist:
            pass

        return self.copy_result(parent_result, set_parent=True)

    def import_indicator(self, parent_indicator_id):
        """
        :param parent_indicator_id: ID of indicator we want to create a child of in this self's
        results framework
        :return: new indicator object or None if it couldn't be imported/added
        """
        # Check that we have a parent project and that project of parent indicator is that parent
        parent = self.parent()
        if parent:
            parent_project = parent
        else:
            raise Project.DoesNotExist("Project has no parent")

        Result = apps.get_model('rsr', 'Result')
        Indicator = apps.get_model('rsr', 'Indicator')

        # Check that we have a parent indicator
        parent_indicator = Indicator.objects.get(pk=parent_indicator_id)

        # Check that parent indicator's project is our parent project
        parent_result = parent_indicator.result
        if parent_result.project != parent_project:
            raise ValidationError("Parent indicator's project is not the correct parent project")

        # Get or create self.result that has parent_indicator.result as parent_result
        result, _created = Result.objects.get_or_create(
            project=self,
            parent_result=parent_result,
            defaults=dict(
                title=parent_result.title,
                type=parent_result.type,
                aggregation_status=parent_result.aggregation_status,
                description=parent_result.description,
            )
        )

        # Check that we don't have an indicator that has parent_indicator as parent already.
        # This can only happen if result already exists
        try:
            Indicator.objects.get(result=result, parent_indicator=parent_indicator)
            indicator_exists = True
        except Indicator.DoesNotExist:
            indicator_exists = False
        if indicator_exists:
            raise ValidationError("Indicator already exists")

        return self.copy_indicator(result, parent_indicator, set_parent=True)

    def copy_results(self, source_project):
        """Copy results from a source project."""

        if self.results.count() > 0:
            raise RuntimeError(_('Can copy results only if the results framework is empty.'))

        for dimension_name in source_project.dimension_names.all():
            self.copy_dimension_name(dimension_name, set_parent=False)

        for result in source_project.results.all():
            self.copy_result(result, set_parent=False)

        for default_period in source_project.default_periods.all():
            self.copy_default_period(default_period, set_parent=False)

    def copy_dimension_name_to_children(self, dimension_name):
        """Copy dimension_name to all children that imported from this project."""

        for child in self.children():
            if not child.has_imported_results():
                continue
            child.copy_dimension_name(dimension_name, set_parent=True)

    def copy_default_period_to_children(self, default_period):
        """Copy default period to all children that imported results from this project."""

        for child in self.children():
            child.copy_default_period(default_period, set_parent=True)

    def copy_default_period(self, parent, set_parent=True):
        DefaultPeriod = apps.get_model('rsr', 'DefaultPeriod')
        defaults = dict(parent=parent)
        data = dict(
            project=self, period_start=parent.period_start, period_end=parent.period_end,
            defaults=defaults)

        if not set_parent:
            defaults.pop('parent')

        DefaultPeriod.objects.get_or_create(**data)

    def copy_dimension_name(self, source_dimension_name, set_parent=True):
        defaults = dict(parent_dimension_name=source_dimension_name)
        data = dict(project=self, name=source_dimension_name.name, defaults=defaults)
        if not set_parent:
            defaults.pop('parent_dimension_name')

        IndicatorDimensionName = apps.get_model('rsr', 'IndicatorDimensionName')
        dimension_name, created = IndicatorDimensionName.objects.get_or_create(**data)
        if not created and set_parent:
            dimension_name.parent_dimension_name = source_dimension_name
            dimension_name.save(update_fields=['parent_dimension_name'])

        for dimension_value in source_dimension_name.dimension_values.all():
            self.copy_dimension_value(dimension_name, dimension_value, set_parent=set_parent)

        return dimension_name

    def copy_dimension_value(self, dimension_name, source_dimension_value, set_parent=True):
        IndicatorDimensionValue = apps.get_model('rsr', 'IndicatorDimensionValue')
        defaults = dict(parent_dimension_value=source_dimension_value)
        data = dict(
            name=dimension_name,
            value=source_dimension_value.value,
            defaults=defaults)
        if not set_parent:
            defaults.pop('parent_dimension_value')
        dimension_value, created = IndicatorDimensionValue.objects.get_or_create(**data)
        if not created and set_parent:
            dimension_value.parent_dimension_value = source_dimension_value
            dimension_value.save(update_fields=['parent_dimension_value'])

    def copy_result_to_children(self, result):
        """Copy result to all children that imported results from this project."""

        for child in self.children():
            if not child.has_imported_results():
                continue
            child.copy_result(result, set_parent=True)

    def copy_result(self, source_result, set_parent=True):
        """Copy the source_result to this project, setting it as parent if specified."""
        data = dict(
            project=self,
            parent_result=source_result,
            title=source_result.title,
            type=source_result.type,
            aggregation_status=source_result.aggregation_status,
            description=source_result.description,
            order=source_result.order,
        )
        if not set_parent:
            data.pop('parent_result')

        result = apps.get_model('rsr', 'Result').objects.create(**data)

        for indicator in source_result.indicators.all():
            self.copy_indicator(result, indicator, set_parent=set_parent)

        return result

    def copy_indicator(self, result, source_indicator, set_parent=True):
        """Copy a source_indicator to the result, setting it as parent if specified.

        NOTE: There can only be one child for an indicator, per result. This
        method automatically updates an existing child indicator, if present.

        It also triggers the creation of periods, dimensions and references on
        the indicator, if the indicator is being created and not updated.

        """
        Indicator = apps.get_model('rsr', 'Indicator')
        data = dict(
            title=source_indicator.title,
            description=source_indicator.description,
            measure=source_indicator.measure,
            ascending=source_indicator.ascending,
            type=source_indicator.type,
            export_to_iati=source_indicator.export_to_iati,
            scores=source_indicator.scores,
            order=source_indicator.order,
            baseline_comment=source_indicator.baseline_comment,
        )
        if set_parent:
            indicator, created = Indicator.objects.update_or_create(
                result=result,
                parent_indicator=source_indicator,
                defaults=data,
            )
        else:
            indicator = Indicator.objects.create(result=result, **data)
            created = True

        fields = ['baseline_year', 'baseline_value']
        self._update_fields_if_not_child_updated(source_indicator, indicator, fields)

        if not created:
            return indicator

        for period in source_indicator.periods.all():
            self.copy_period(indicator, period, set_parent=set_parent)

        for reference in source_indicator.references.all():
            self.add_reference(indicator, reference)

        IndicatorDimensionName = apps.get_model('rsr', 'IndicatorDimensionName')
        for source_dimension_name in source_indicator.dimension_names.all():
            dimension_name = IndicatorDimensionName.objects.filter(
                project=self, name=source_dimension_name.name
            ).first()
            indicator.dimension_names.add(dimension_name)

        return indicator

    def update_indicator(self, result, parent_indicator):
        """Update an indicator based on parent indicator attributes."""
        Indicator = apps.get_model('rsr', 'Indicator')
        try:
            child_indicator = Indicator.objects.get(
                result=result,
                parent_indicator=parent_indicator,
            )

        except Indicator.DoesNotExist:
            return

        update_fields = ['title', 'measure', 'ascending', 'type', 'export_to_iati', 'description',
                         'order', 'scores', 'baseline_comment']
        for field in update_fields:
            setattr(child_indicator, field, getattr(parent_indicator, field))
        child_indicator.save(update_fields=update_fields)

        fields = ['baseline_year', 'baseline_value']
        self._update_fields_if_not_child_updated(parent_indicator, child_indicator, fields)

    def copy_period(self, indicator, source_period, set_parent=True):
        """Copy the source period to the indicator, and set it as a parent if specified.

        NOTE: There can only be one child for a period, per indicator. This
        method automatically updates the existing one, if there is one.

        """
        IndicatorPeriod = apps.get_model('rsr', 'IndicatorPeriod')
        data = dict(
            period_start=source_period.period_start,
            period_end=source_period.period_end,
        )
        qs = IndicatorPeriod.objects.select_related('indicator', 'indicator__result')
        if set_parent:
            qs.update_or_create(indicator=indicator, parent_period=source_period, defaults=data)
        else:
            qs.create(indicator=indicator, **data)

    def update_period(self, indicator, parent_period):
        """Update a period based on the parent period attributes."""

        IndicatorPeriod = apps.get_model('rsr', 'IndicatorPeriod')
        try:
            child_period = IndicatorPeriod.objects.select_related(
                'indicator',
                'indicator__result',
            ).get(
                indicator=indicator,
                parent_period=parent_period,
            )

        except IndicatorPeriod.DoesNotExist:
            return

        child_period.period_start = parent_period.period_start
        child_period.period_end = parent_period.period_end
        child_period.save()

    def update_dimension_value(self, dimension_name, parent_dimension_value):
        """Update dimension value base on the parent dimension value attribute."""

        IndicatorDimensionValue = apps.get_model('rsr', 'IndicatorDimensionValue')
        try:
            child_dimension_value = IndicatorDimensionValue.objects.select_related(
                'name'
            ).get(
                name=dimension_name,
                parent_dimension_value=parent_dimension_value,
            )
        except IndicatorDimensionValue.DoesNotExist:
            return

        child_dimension_value.value = parent_dimension_value.value
        child_dimension_value.save()

    def add_reference(self, indicator, reference):
        apps.get_model('rsr', 'IndicatorReference').objects.create(
            indicator=indicator,
            reference=reference.reference,
            vocabulary=reference.vocabulary,
            vocabulary_uri=reference.vocabulary_uri,
        )

    def _update_fields_if_not_child_updated(self, parent, child, fields):
        """Copy the specified fields from parent to child, when empty on the child."""
        for field in fields:
            parent_value = getattr(parent, field)
            child_value = getattr(child, field)
            if isinstance(child_value, str):
                # cleanup unicode non-printing space
                child_value = child_value.replace(u'\u200b', '')
            if not child_value and parent_value:
                setattr(child, field, parent_value)

        child.save()

    def indicator_labels(self):
        return apps.get_model('rsr', 'OrganisationIndicatorLabel').objects.filter(
            organisation__in=self.all_partners()
        ).distinct()

    def has_indicator_labels(self):
        return self.indicator_labels().count() > 0

    def toggle_aggregate_children(self, aggregate):
        """
        If aggregation to children is turned off,

        :param aggregate; Boolean, indicating if aggregation is turned on (True) or off (False)
        """
        for result in self.results.all():
            for indicator in result.indicators.all():
                if indicator.is_parent_indicator():
                    for period in indicator.periods.all():
                        if indicator.measure == '2':
                            self.update_parents(period, period.child_periods_average(), 1)
                        else:
                            sign = 1 if aggregate else -1
                            self.update_parents(period, period.child_periods_sum(), sign)

    def toggle_aggregate_to_parent(self, aggregate):
        """ Add/subtract child indicator period values from parent if aggregation is toggled """
        for result in self.results.all():
            for indicator in result.indicators.all():
                if indicator.is_child_indicator():
                    for period in indicator.periods.all():
                        parent = period.parent_period
                        if parent and period.actual_value:
                            if indicator.measure == '2':
                                self.update_parents(parent, parent.child_periods_average(), 1)
                            else:
                                sign = 1 if aggregate else -1
                                self.update_parents(parent, period.actual_value, sign)

    def update_parents(self, update_period, difference, sign):
        """ Update parent indicator periods if they exist and allow aggregation """
        try:
            if update_period.indicator.measure == '2':
                update_period.actual_value = str(Decimal(difference))
            else:
                update_period.actual_value = str(
                    Decimal(update_period.actual_value) + sign * Decimal(difference))
            update_period.save()

            parent_period = update_period.parent_period
            if parent_period and parent_period.indicator.result.project.aggregate_children:
                if update_period.indicator.measure == '2':
                    self.update_parents(parent_period, parent_period.child_periods_average(), 1)
                else:
                    self.update_parents(parent_period, difference, sign)

        except (InvalidOperation, TypeError):
            pass

    def update_use_project_roles(self):
        if not self.reporting_org:
            return

        if self.reporting_org.use_project_roles == self.use_project_roles:
            return

        # We only wish to turn on the project roles flag on the project, if the
        # reporting organisation has that flag turned on. If the project
        # already has the flag turned on, we don't want to turn it off
        # implicitly, based on the reporting organisation. There has to be a
        # more explicit way of turning this off, for the user.
        if self.reporting_org.use_project_roles and not self.use_project_roles:
            self.use_project_roles = True
            self.save(update_fields=['use_project_roles'])

    @classmethod
    def log_project_addition(cls, project_id, user):
        project = cls.objects.get(id=project_id)
        message = '%s.' % (_('Project editor, added project'))

        LogEntry.objects.log_action(
            user_id=user.pk,
            content_type_id=ContentType.objects.get_for_model(project).pk,
            object_id=project.pk,
            object_repr=str(project),
            action_flag=ADDITION,
            change_message=message
        )

        # Schedule IATI checks after a project has been created.
        project.schedule_iati_checks()

    @staticmethod
    def add_custom_fields(project_id, organisations):
        from akvo.rsr.models import OrganisationCustomField, ProjectCustomField
        custom_fields = OrganisationCustomField.objects.filter(
            organisation__in=organisations
        )
        project_custom_fields = [
            custom_field.new_project_custom_field(project_id) for custom_field in custom_fields
        ]
        ProjectCustomField.objects.bulk_create(project_custom_fields)

    @classmethod
    def new_project_created(cls, project_id, user):
        """Hook to do some book-keeping for a newly created project.

        *NOTE*: This hook cannot be moved into a post-save hook since we need
        information about the user who created this project, to perform some of
        the actions.

        """
        # Set reporting organisation
        organisations = [e.organisation for e in user.approved_employments().order_by('id')]
        can_create_project_orgs = [
            org for org in organisations
            if org.can_create_projects and user.has_perm('rsr.add_project', org)
        ]

        if can_create_project_orgs:
            # FIXME: We randomly choose the first organisation, where the user
            # can create projects, when ordered by employments
            organisation_id = organisations[0].id
            from akvo.rsr.models import Partnership
            Partnership.objects.create(
                project_id=project_id,
                organisation_id=organisation_id,
                iati_organisation_role=Partnership.IATI_REPORTING_ORGANISATION
            )

        Project.log_project_addition(project_id, user)
        organisation_ids = [org.id for org in organisations]
        Project.add_custom_fields(project_id, organisation_ids)

    def users_with_access(self, group_name=None):
        if self.use_project_roles:
            qs = self.projectrole_set.all()
        else:
            # NOTE: We deliberately keep the access simple here - we only look
            # for users employed by direct partners, and don't worry about
            # content-owned organisations or users employed by project hierarchy
            # owner organisation, etc.
            qs = self.partners.employments()

        if group_name is not None:
            qs = qs.filter(group__name=group_name)

        user_ids = qs.values_list('user__id', flat=True)
        User = get_user_model()
        return User.objects.filter(pk__in=user_ids)


def project_directory_cache_key(project_id):
    return f'project_directory_{project_id}'


@receiver(post_save, sender=Project)
def default_validation_set(sender, **kwargs):
    """When the project is created, add the RSR validation (pk=1) to the project."""

    # Disable signal handler when loading fixtures
    if kwargs.get('raw', False):
        return

    project = kwargs['instance']
    created = kwargs['created']
    if created:
        try:
            if not project.validations.all():
                project.validations.add(ProjectEditorValidationSet.objects.get(pk=1))
        except ProjectEditorValidationSet.DoesNotExist:
            # RSR validation set does not exist, should not happen..
            send_mail('RSR validation set missing',
                      'This is a notification to inform the RSR admins that the RSR validation set '
                      '(pk=1) is missing.',
                      settings.DEFAULT_FROM_EMAIL,
                      getattr(settings, "SUPPORT_EMAIL", ['rsr@akvo.org']))


def update_thumbnails(sender, **kwargs):
    """Update the thumbnails of a project if an image exists"""

    # Disable signal handler when loading fixtures
    if kwargs.get('raw', False):
        return

    project: Project = kwargs['instance']
    created = kwargs['created']
    log = logger.getChild("update_thumbnails_%s" % project.id)

    # Remove existing thumbnails when the current image is deleted
    if not project.current_image:
        deletions, _ = project.thumbnails.all().delete()
        log.log(logging.DEBUG if not deletions else logging.INFO, "Deleted %s old thumbs after unset", deletions)
        return

    default_sizes = settings.DEFAULT_PROJECT_THUMBNAIL_SIZES
    full_size_url = project.current_image.url
    thumbnails = project.thumbnails.filter(geometry__in=default_sizes, full_size_url=full_size_url)
    missing_geometries = default_sizes - set(thumbnails.values_list("geometry", flat=True))

    # Do nothing for existing with all thumbnails existing
    if not created and not missing_geometries:
        return

    # Generate missing thumbnail formats
    for geometry in missing_geometries:
        try:
            thumbnail = get_thumbnail(project.current_image, geometry)
            project.thumbnails.create(
                geometry=geometry,
                url=thumbnail.url,
                full_size_url=full_size_url
            )
        except Exception as e:
            log.error("Cannot generate thumbnail in missing geometry: %s", e)
    log.info("Generated thumbs for %s", ", ".join(missing_geometries))

    # Delete thumbnails without the current URL
    deletions, _ = project.thumbnails.exclude(full_size_url=full_size_url).delete()
    log.log(logging.DEBUG if not deletions else logging.INFO, "Deleted %s thumbs with old URLs", deletions)


receiver(post_save, sender=Project)(update_thumbnails)


@receiver(post_save, sender=ProjectUpdate)
def update_denormalized_project(sender, **kwargs):
    "Updates the denormalized project.last_update on related project."

    # Disable signal handler when loading fixtures
    if kwargs.get('raw', False):
        return

    project_update = kwargs['instance']
    project = project_update.project
    project.last_update = project_update
    project.save()


@receiver(post_delete, sender=ProjectUpdate)
def rewind_last_update(sender, **kwargs):
    """ Updates the denormalized project.last_update on related project

        When deleting an update we have to set project.last_update again since it'll change if the
        deleted update was tha latest or if it was the only update for the project
        """
    # Disable signal handler when loading fixtures
    if kwargs.get('raw', False):
        return

    project_update = kwargs['instance']
    project = project_update.project
    try:
        project.last_update = project.updates_desc()[0]
    except IndexError:
        project.last_update = None
    project.save()


TreeNodeItem_T = TypeVar("TreeNodeItem_T")


@dataclasses.dataclass
class TreeNode(Generic[TreeNodeItem_T]):
    item: TreeNodeItem_T
    children: Dict[Hashable, "TreeNode"] = dataclasses.field(default_factory=dict)

    def __iter__(self):
        return iter(self.children.values())

    def to_dict(self):
        return {
            "item": self.item,
            "children": {
                child_id: child.to_dict()
                for child_id, child in self.children.items()
            }
        }


def build_tree(project: "Project") -> TreeNode["Project"]:
    descendants = list(project.descendants(with_self=False))
    tree = TreeNode(item=project)
    project_cache = {descendant.uuid: descendant for descendant in descendants}
    project_cache[project.uuid] = project

    node_cache = {project.uuid: tree}
    for descendant in descendants:
        descendant_node = node_cache.setdefault(descendant.uuid, TreeNode(item=descendant))
        parent = project_cache[descendant.get_parent_uuid()]
        parent_tree = node_cache.setdefault(parent.uuid, TreeNode(item=parent))
        parent_tree.children[descendant.uuid] = descendant_node

    return tree


def print_tree(node: TreeNode, depth=0, tab_char=' '):
    print(f"{tab_char * depth}{node.item}")
    for child in node:
        print_tree(child, depth + 1, tab_char)
