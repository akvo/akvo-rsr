# -*- coding: utf-8 -*-
"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""


from decimal import Decimal, InvalidOperation

from django.conf import settings
from django.contrib.admin.models import LogEntry, ADDITION
from django.contrib.auth import get_user_model
from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import ValidationError, ObjectDoesNotExist, MultipleObjectsReturned
from django.core.mail import send_mail
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.db.models import get_model, Max, Sum
from django.db.models.signals import post_save, post_delete
from django.db.models.query import QuerySet as DjangoQuerySet
from django.dispatch import receiver
from django.utils.safestring import mark_safe
from django.utils.translation import ugettext_lazy as _
from django.db.models import Q

from django_counter.models import ViewCounter

from sorl.thumbnail.fields import ImageField

from akvo.codelists.models import (AidType, ActivityScope, ActivityStatus, CollaborationType,
                                   FinanceType, FlowType, TiedStatus)
from akvo.codelists.store.default_codelists import (AID_TYPE_VOCABULARY, ACTIVITY_SCOPE, ACTIVITY_STATUS,
                                                    COLLABORATION_TYPE, CURRENCY, FINANCE_TYPE,
                                                    FLOW_TYPE, TIED_STATUS, BUDGET_IDENTIFIER_VOCABULARY)
from akvo.utils import (codelist_choices, codelist_value, codelist_name, rsr_image_path,
                        rsr_show_keywords, single_period_dates)

from ...iati.checks.iati_checks import IatiChecks

from ..fields import ProjectLimitedTextField, ValidXMLCharField, ValidXMLTextField
from ..mixins import TimestampsMixin

from .country import Country
from .iati_check import IatiCheck
from .result import IndicatorPeriod
from .link import Link
from .models_utils import OrganisationsQuerySetManager, QuerySetManager
from .organisation import Organisation
from .partnership import Partnership
from .project_update import ProjectUpdate
from .project_editor_validation import ProjectEditorValidationSet
from .publishing_status import PublishingStatus
from .related_project import RelatedProject
from .budget_item import BudgetItem


def image_path(instance, file_name):
    return rsr_image_path(instance, file_name, 'db/project/%(instance_pk)s/%(file_name)s')


class MultipleReportingOrgs(Exception):
    pass


class Project(TimestampsMixin, models.Model):
    CURRENCY_CHOICES = codelist_choices(CURRENCY)

    HIERARCHY_OPTIONS = (
        (1, _(u'Core Activity')),
        (2, _(u'Sub Activity')),
        (3, _(u'Lower Sub Activity'))
    )

    LANGUAGE_OPTIONS = (
        ('de', _(u'German')),
        ('en', _(u'English')),
        ('es', _(u'Spanish')),
        ('fr', _(u'French')),
        ('nl', _(u'Dutch')),
        ('ru', _(u'Russian'))
    )

    STATUS_NONE = 'N'
    STATUS_NEEDS_FUNDING = 'H'
    STATUS_ACTIVE = 'A'
    STATUS_COMPLETE = 'C'
    STATUS_CANCELLED = 'L'
    STATUS_ARCHIVED = 'R'
    STATUSES = (
        (STATUS_NONE, ''),
        (STATUS_NEEDS_FUNDING, _(u'Needs funding')),
        (STATUS_ACTIVE, _(u'Active')),
        (STATUS_COMPLETE, _(u'Complete')),
        (STATUS_CANCELLED, _(u'Cancelled')),
        (STATUS_ARCHIVED, _(u'Archived')),
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

    title = ValidXMLCharField(_(u'project title'), max_length=200, db_index=True, blank=True)
    subtitle = ValidXMLCharField(_(u'project subtitle'), max_length=200, blank=True)
    status = ValidXMLCharField(
        _(u'status'), max_length=1, choices=STATUSES, db_index=True, default=STATUS_NONE
    )
    iati_status = ValidXMLCharField(
        _(u'status'), max_length=1, choices=(codelist_choices(ACTIVITY_STATUS)), db_index=True,
        blank=True,
        help_text=_(u'There are six different project statuses:<br/>'
                    u'1) Pipeline/identification: the project is being scoped or planned<br/>'
                    u'2) Implementation: the project is currently being implemented<br/>'
                    u'3) Completion: the project is complete or the final disbursement has been '
                    u'made<br/>'
                    u'4) Post-completion: the project is complete or the final disbursement has '
                    u'been made, '
                    u'but the project remains open pending financial sign off or M&E<br/>'
                    u'5) Cancelled: the project has been cancelled<br/>'
                    u'6) Suspended: the project has been temporarily suspended '
                    u'or the reporting partner no longer uses RSR.')
    )
    categories = models.ManyToManyField(
        'Category', verbose_name=_(u'categories'), related_name='projects', blank=True
    )
    partners = models.ManyToManyField(
        'Organisation', verbose_name=_(u'partners'), through=Partnership, related_name='projects',
        blank=True,
    )
    project_plan_summary = ProjectLimitedTextField(
        _(u'summary of project plan'), max_length=2000, blank=True,
        help_text=_(u'Enter a brief summary, try to restrict the number of characters to 400 in '
                    u'order to display the summary nicely on the project page. The summary should '
                    u'explain:<br>'
                    u'- Why the project is being carried out;<br>'
                    u'- Where it is taking place;<br>'
                    u'- Who will benefit and/or participate;<br>'
                    u'- What it specifically hopes to accomplish;<br>'
                    u'- How those specific goals will be reached')
    )

    current_image = ImageField(
        _('photo'), blank=True, upload_to=image_path,
        help_text=_(u'Add your project photo here. You can only add one photo. If you have more, '
                    u'you can add them via RSR updates when your project is published. A photo '
                    u'album will feature on the project page. The photo should not be larger '
                    u'than 2 MB in size, and should preferably be in JPG format.'),
    )
    current_image_caption = ValidXMLCharField(
        _(u'photo caption'), blank=True, max_length=60,
        help_text=_(u'Briefly describe who or what you see in the photo.')
    )
    current_image_credit = ValidXMLCharField(
        _(u'photo credit'), blank=True, max_length=60,
        help_text=_(u'Enter who took the photo.')
    )

    goals_overview = ValidXMLTextField(
        _(u'goals overview'), blank=True,
        help_text=_(u'Provide a brief description of the overall project goals. For links and '
                    u'styling of the text, <a href="https://github.com/adam-p/markdown-here/wiki/'
                    u'Markdown-Cheatsheet" target="_blank">Markdown</a> is supported.')
    )
    current_status = ValidXMLTextField(
        _(u'baseline situation'), blank=True,
        help_text=_(u'Describe the situation at the start of the project. For links and styling of '
                    u'the text, <a href="https://github.com/adam-p/markdown-here/wiki/Markdown-'
                    u'Cheatsheet" target="_blank">Markdown</a> is supported.')
    )
    project_plan = ValidXMLTextField(
        _(u'project plan'), blank=True,
        help_text=_(u'Detailed information about the implementation of the project: the what, how, '
                    u'who and when. For links and styling of the text, <a href="https://github.com/'
                    u'adam-p/markdown-here/wiki/Markdown-Cheatsheet" target="_blank">Markdown</a> '
                    u'is supported.')
    )
    sustainability = ValidXMLTextField(
        _(u'sustainability'), blank=True,
        help_text=_(u'Describe how you aim to guarantee sustainability of the project until 10 '
                    u'years after project implementation. Think about the institutional setting, '
                    u'capacity-building, a cost recovery plan, products used, feasible '
                    u'arrangements for operation and maintenance, anticipation of environmental '
                    u'impact and social integration. For links and styling of the text, '
                    u'<a href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet" '
                    u'target="_blank">Markdown</a> is supported.')
    )
    background = ValidXMLTextField(
        _(u'background'), blank=True,
        help_text=_(u'This should describe the geographical, political, environmental, social '
                    u'and/or cultural context of the project, and any related activities that '
                    u'have already taken place or are underway. For links and styling of the text, '
                    u'<a href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet" '
                    u'target="_blank">Markdown</a> is supported.')
    )
    target_group = ProjectLimitedTextField(
        _(u'target group'), blank=True,
        help_text=_(u'This should include information about the people, organisations or resources '
                    u'that are being impacted by this project. For links and styling of the text, '
                    u'<a href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet" '
                    u'target="_blank">Markdown</a> is supported.')
    )

    # Result aggregation
    aggregate_children = models.BooleanField(
        _(u'Aggregate results data from child projects'), default=True,
        help_text=_(u'By selecting this option, the results data of child projects will be aggregated to this project. '
                    u'In the child project(s), this can be turned off per project as well.')
    )
    aggregate_to_parent = models.BooleanField(
        _(u'Aggregate results data to parent project'), default=True,
        help_text=_(u'By selecting this option, the results data of this project will be aggregated '
                    u'to the parent project.')
    )

    # Results framework (always on)
    is_impact_project = models.BooleanField(
        _(u'is rsr impact project'), default=True,
        help_text=_(u'Determines whether the results framework is active for this project.')
    )

    # Private projects
    is_public = models.BooleanField(
        _(u'is public project'), default=True,
        help_text=_(u'Determines whether this project is a public project.')
    )

    # project meta info
    language = ValidXMLCharField(
        max_length=2, choices=LANGUAGE_OPTIONS, blank=True,
        help_text=_(u'Enter the language used when entering the details for this project.')
    )
    notes = ValidXMLTextField(
        _(u'project comments'), blank=True,
        help_text=_(u'The project comments are only for internal use and will not be displayed '
                    u'anywhere on the project page.')
    )
    keywords = models.ManyToManyField(
        'Keyword', verbose_name=_(u'keyword'), related_name='projects', blank=True,
        help_text=_(u'Choose a keyword to link to this project.')
    )

    # budget
    currency = ValidXMLCharField(
        _(u'currency'), choices=CURRENCY_CHOICES, max_length=3, default='EUR',
        help_text=_(u'The default currency for this project. Used in all financial '
                    u'aspects of the project.')
    )
    date_start_planned = models.DateField(
        _(u'start date (planned)'), null=True, blank=True,
        help_text=_(u'Enter the original start date of the project (DD/MM/YYYY).')
    )
    date_start_actual = models.DateField(
        _(u'start date (actual)'), null=True, blank=True,
        help_text=_(u'Enter the actual start date of the project (DD/MM/YYYY).')
    )
    date_end_planned = models.DateField(
        _(u'end date (planned)'), null=True, blank=True,
        help_text=_(u'Enter the original end date of the project (DD/MM/YYYY).')
    )
    date_end_actual = models.DateField(
        _(u'end date (actual)'), null=True, blank=True,
        help_text=_(u'Enter the actual end date of the project (DD/MM/YYYY).')
    )

    primary_location = models.ForeignKey('ProjectLocation', null=True, on_delete=models.SET_NULL)
    # primary_organisation is a denormalized field used for performance of the project list page
    primary_organisation = models.ForeignKey('Organisation', null=True, on_delete=models.SET_NULL)

    # donate url
    donate_url = models.URLField(
        _(u'donate url'), null=True, blank=True, max_length=200,
        help_text=_(u'Add a donation url for this project. If no URL is added, it is not possible '
                    u'to donate to this project through RSR.')
    )

    # donations
    donations = models.DecimalField(
        max_digits=14, decimal_places=2, blank=True, null=True, db_index=True, default=0,
        help_text=_(u'The total sum of donations the project has already recieved.')
    )

    # extra IATI fields
    iati_activity_id = ValidXMLCharField(
        _(u'IATI identifier'), max_length=100, blank=True, db_index=True, null=True, unique=True,
        help_text=_(u'This is a globally unique identifier for this activity. It is a requirement '
                    u'to be compliant with the IATI standard. This code consists of: '
                    u'[country code]-[Chamber of Commerce number]-[organisation’s internal project '
                    u'code]. For Dutch organisations this is e.g. NL-KVK-31156201-TZ1234. For more '
                    u'information see') + ' <a href="http://iatistandard.org/202/activity-standard/'
                                          'iati-activities/iati-activity/iati-identifier/'
                                          '#definition" target="_blank">http://iatistandard.org/'
                                          '201/activity-standard/iati-activities/iati-activity/'
                                          'iati-identifier/#definition</a>'
    )
    hierarchy = models.PositiveIntegerField(
        _(u'hierarchy'), null=True, blank=True, max_length=1, choices=HIERARCHY_OPTIONS,
        help_text=_(u'If you are reporting multiple levels of projects in RSR, you can specify '
                    u'whether this is a core, sub, or lower sub activity here.')
    )
    project_scope = ValidXMLCharField(
        _(u'project scope'), blank=True, max_length=2, choices=codelist_choices(ACTIVITY_SCOPE),
        help_text=_(u'Select the geographical scope of the project.')
    )
    capital_spend_percentage = models.DecimalField(
        _(u'capital spend percentage'), blank=True, null=True, max_digits=4, decimal_places=1,
        validators=[MaxValueValidator(100), MinValueValidator(0)],
        help_text=_(u'The percentage of the total commitment allocated to or planned for capital '
                    u'expenditure. Content must be a positive decimal number between 0 and 100, '
                    u'with no percentage sign. Use a period to denote decimals.')
    )
    collaboration_type = ValidXMLCharField(
        _(u'collaboration type'), blank=True, max_length=1,
        choices=codelist_choices(COLLABORATION_TYPE),
        help_text=_(u'This is the IATI identifier for the type of collaboration involved. For '
                    u'reference, please visit: <a href="http://iatistandard.org/202/codelists/'
                    u'CollaborationType/" target="_blank">http://iatistandard.org/202/codelists/'
                    u'CollaborationType/</a>.')
    )
    default_aid_type_vocabulary = ValidXMLCharField(
        _(u'default aid type vocabulary'), blank=True, max_length=1, default='1',
        choices=codelist_choices(AID_TYPE_VOCABULARY),
        help_text=_(u'This is the IATI identifier for the type of vocabulary being used for '
                    u'describing the type of the aid being supplied or activity '
                    u'being undertaken. For reference, please visit: <a '
                    u'href="http://iatistandard.org/203/codelists/AidTypeVocabulary/" target='
                    u'"_blank"> http://iatistandard.org/203/codelists/AidTypeVocabulary/</a>.')
    )
    default_aid_type = ValidXMLCharField(
        _(u'default aid type'),
        blank=True, max_length=3,
        help_text=_(u'This is the IATI identifier for the type of aid being supplied or activity '
                    u'being undertaken. This element specifies a default for all the project’s '
                    u'financial transactions. This can be overridden at the individual transaction '
                    u'level. For reference, please visit: <a href="http://iatistandard.org/202/'
                    u'codelists/AidType/" target="_blank">http://iatistandard.org/202/codelists/'
                    u'AidType/</a>.')
    )
    default_finance_type = ValidXMLCharField(
        _(u'default finance type'), blank=True, max_length=3,
        choices=codelist_choices(FINANCE_TYPE),
        help_text=_(u'This is the IATI identifier for the type of finance. This element specifies '
                    u'a default for all the transactions in the project’s activity report; it can '
                    u'be overridden at the individual transaction level. For reference visit: '
                    u'<a href="http://iatistandard.org/202/codelists/FinanceType/" target="_blank">'
                    u'http://iatistandard.org/202/codelists/FinanceType/</a>.')
    )
    default_flow_type = ValidXMLCharField(
        _(u'default flow type'), blank=True, max_length=2, choices=codelist_choices(FLOW_TYPE),
        help_text=_(u'This is the IATI identifier for how the activity (project) is funded. For '
                    u'reference, please visit: <a href="http://iatistandard.org/202/codelists/'
                    u'FlowType/" target="_blank">http://iatistandard.org/202/codelists/'
                    u'FlowType/</a>.')
    )
    default_tied_status = ValidXMLCharField(
        _(u'default tied status'), blank=True, max_length=10, choices=codelist_choices(TIED_STATUS),
        help_text=_(u'This element specifies a default for all the activity’s financial '
                    u'transactions; it can be overridden at the individual transaction level. For '
                    u'reference, please visit: <a href="http://iatistandard.org/202/codelists/'
                    u'TiedStatus/" target="_blank">http://iatistandard.org/202/codelists/'
                    u'TiedStatus/</a>.')
    )
    country_budget_vocabulary = ValidXMLCharField(
        _(u'country budget vocabulary'), blank=True, max_length=1,
        choices=codelist_choices(BUDGET_IDENTIFIER_VOCABULARY),
        help_text=_(u'Enter an IATI code for the common functional classification or country '
                    u'system (this allows for common codes, country-specific codes, or any other '
                    u'classification agreed between countries and donors) see: '
                    u'<a href="http://iatistandard.org/202/codelists/BudgetIdentifierVocabulary/" '
                    u'target="_blank">http://iatistandard.org/202/codelists/'
                    u'BudgetIdentifierVocabulary/</a>.')
    )
    humanitarian = models.NullBooleanField(
        _(u'humanitarian project'), help_text=_(u'Determines whether this project relates entirely '
                                                u'or partially to humanitarian aid.'))

    # Project editor settings
    validations = models.ManyToManyField(
        ProjectEditorValidationSet, verbose_name=_(u'validations'), related_name='projects'
    )

    # denormalized data
    budget = models.DecimalField(
        _(u'project budget'), max_digits=14, decimal_places=2, blank=True, null=True,
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

    # Custom manager
    # based on http://www.djangosnippets.org/snippets/562/ and
    # http://simonwillison.net/2008/May/1/orm/
    objects = QuerySetManager()
    organisations = OrganisationsQuerySetManager()

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'project')
        verbose_name_plural = _(u'projects')
        ordering = ['-id', ]
        permissions = (
            ('post_updates', u'Can post updates'),
        )

    def save(self, last_updated=False, *args, **kwargs):
        # Strip title of any trailing or leading spaces
        if self.title:
            self.title = self.title.strip()

        # Strip subtitle of any trailing or leading spaces
        if self.subtitle:
            self.subtitle = self.subtitle.strip()

        # Strip IATI ID of any trailing or leading spaces
        if self.iati_activity_id:
            self.iati_activity_id = self.iati_activity_id.strip()

        orig, orig_aggregate_children, orig_aggregate_to_parent = None, None, None
        if self.pk:
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
                {'date_start_planned': u'%s' % _(u'Start date (planned) cannot be at a later '
                                                 u'time than end date (planned).'),
                 'date_end_planned': u'%s' % _(u'Start date (planned) cannot be at a later '
                                               u'time than end date (planned).')}
            )
        if self.date_start_actual and self.date_end_actual and \
                (self.date_start_actual > self.date_end_actual):
            raise ValidationError(
                {'date_start_actual': u'%s' % _(u'Start date (actual) cannot be at a later '
                                                u'time than end date (actual).'),
                 'date_end_actual': u'%s' % _(u'Start date (actual) cannot be at a later '
                                              u'time than end date (actual).')}
            )

        # In order for the IATI activity IDs not be unique, we set them to None when they're empty
        if not self.iati_activity_id:
            self.iati_activity_id = None

    @models.permalink
    def get_absolute_url(self):
        return ('project-main', (), {'project_id': self.pk})

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
        budget_project_currency = BudgetItem.objects.filter(project__id=self.pk).filter(currency__exact='')\
            .aggregate(Sum('amount')).values()[0]
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
            object_id=str(self.id), content_type=ContentType.objects.get_for_model(self)
        ).order_by('action_time')
        if not entries.exists():
            return None
        user_id = entries.last().user_id
        last_modified_at = entries.last().action_time
        User = get_user_model()
        return dict(user=User.objects.only('first_name', 'last_name', 'email').get(id=user_id),
                    last_modified_at=last_modified_at)

    @property
    def view_count(self):
        counter = ViewCounter.objects.get_for_object(self)
        return counter.count or 0

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

    @property
    def publishing_orgs(self):
        """
        Returns the organisations that have the right to publish the project. In other words, that
        have Organisation.can_create_project set to True.
        """
        return self.partners.filter(can_create_projects=True)

    def set_reporting_org(self, organisation):
        """ Set the reporting-org for the project.
            Currently protests if you try to set another organisation when one is already set.
        """
        if self.reporting_org is not None:
            # TODO: should we allow overwriting the existing reporting-org here?
            if self.reporting_org != organisation:
                raise MultipleReportingOrgs
        else:
            Partnership.objects.create(
                project=self,
                organisation=organisation,
                iati_organisation_role=Partnership.IATI_REPORTING_ORGANISATION
            )

    def countries(self):
        """Return a list of countries for the project."""

        country_codes = set([c.country.lower() for c in self.recipient_countries.all()])
        return (
            [country for country in self.recipient_countries.all()] +
            [
                location.country for location in self.locations.all()
                if location.country and location.country.iso_code not in country_codes
            ]
        )

    class QuerySet(DjangoQuerySet):
        def of_partner(self, organisation):
            "return projects that have organisation as partner"
            return self.filter(partners__exact=organisation)

        def of_partners(self, organisations):
            "return projects that have one of the organisations as partner"
            return self.filter(partners__in=organisations)

        def has_location(self):
            return self.filter(primary_location__isnull=False)

        def published(self):
            return self.filter(publishingstatus__status=PublishingStatus.STATUS_PUBLISHED)

        def unpublished(self):
            return self.filter(publishingstatus__status=PublishingStatus.STATUS_UNPUBLISHED)

        def private(self):
            return self.filter(is_public=False)

        def public(self):
            return self.filter(is_public=True)

        def status_none(self):
            return self.filter(iati_status__exact='6')

        def status_active(self):
            return self.filter(iati_status__exact='2')

        def status_onhold(self):
            return self.filter(iati_status__exact='1')

        def status_complete(self):
            return self.filter(iati_status__exact='3')

        def status_not_complete(self):
            return self.exclude(iati_status__exact='3')

        def status_post_complete(self):
            return self.filter(iati_status__exact='4')

        def status_not_post_complete(self):
            return self.exclude(iati_status__exact='4')

        def status_cancelled(self):
            return self.filter(iati_status__exact='5')

        def status_not_cancelled(self):
            return self.exclude(iati_status__exact='5')

        def status_archived(self):
            return self.filter(iati_status__exact='6')

        def status_not_archived(self):
            return self.exclude(iati_status__exact='6')

        # aggregates
        def budget_sum(self):
            ''' aggregates the budgets of all the projects in the QS
                n.b. non-chainable, doesn't return a QS
            '''
            return self.aggregate(budget=Sum('budget'),)['budget'] or 0

        def funds_sum(self):
            ''' aggregates the funds of all the projects in the QS
                n.b. non-chainable, doesn't return a QS
            '''
            return self.aggregate(funds=Sum('funds'),)['funds'] or 0

        def funds_needed_sum(self):
            ''' aggregates the funds of all the projects in the QS
                n.b. non-chainable, doesn't return a QS
            '''
            return self.aggregate(funds_needed=Sum('funds_needed'),)['funds_needed'] or 0

        def get_largest_value_sum(self, benchmarkname, cats=None):
            if cats:
                # filter finds largest "benchmarkname" value in benchmarks for categories in cats
                result = self.filter(
                    benchmarks__name__name=benchmarkname,
                    benchmarks__category__name__in=cats
                )
            else:
                # filter finds largest "benchmarkname" value in benchmarks for all categories
                result = self.filter(
                    benchmarks__name__name=benchmarkname
                )
            # annotate the greatest of the "benchmarkname" values into max_value
            # sum max_value for all projects
            return result.annotate(max_value=Max('benchmarks__value')).aggregate(
                Sum('max_value')
            )['max_value__sum'] or 0  # we want to return 0 instead of an empty QS

        def get_planned_water_calc(self):
            "how many will get improved water"
            return self.status_not_cancelled().get_largest_value_sum(
                getattr(settings, 'AFFECTED_BENCHMARKNAME', 'people affected'),
                ['Water']
            ) - self.status_complete().get_largest_value_sum(
                getattr(settings, 'AFFECTED_BENCHMARKNAME', 'people affected'),
                ['Water']
            )

        def get_planned_sanitation_calc(self):
            "how many will get improved sanitation"
            return self.status_not_cancelled().get_largest_value_sum(
                getattr(settings, 'AFFECTED_BENCHMARKNAME', 'people affected'),
                ['Sanitation']
            ) - self.status_complete().get_largest_value_sum(
                getattr(settings, 'AFFECTED_BENCHMARKNAME', 'people affected'),
                ['Sanitation']
            )

        def get_actual_water_calc(self):
            "how many have gotten improved water"
            return self.status_complete().get_largest_value_sum(
                getattr(settings, 'AFFECTED_BENCHMARKNAME', 'people affected'),
                ['Water']
            )

        def get_actual_sanitation_calc(self):
            "how many have gotten improved sanitation"
            return self.status_complete().get_largest_value_sum(
                getattr(settings, 'AFFECTED_BENCHMARKNAME', 'people affected'),
                ['Sanitation']
            )

        def all_updates(self):
            """Return ProjectUpdates for self, newest first."""
            return ProjectUpdate.objects.filter(project__in=self).distinct()

        # The following 8 methods return organisation querysets
        def _partners(self, role=None):
            orgs = Organisation.objects.filter(partnerships__project__in=self)
            if role:
                orgs = orgs.filter(partnerships__iati_organisation_role=role)
            return orgs.distinct()

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

        def paying_partners(self):
            return Organisation.objects.filter(
                partnerships__project__in=self,
                can_create_projects=True
            ).distinct()

        def countries(self):
            """Returns a Country queryset of the countries of these projects"""
            country_ids = []
            for project in self:
                for location in project.locations.all():
                    country_ids.append(location.country.id)

            country_ids = list(set(country_ids))
            return Country.objects.filter(id__in=country_ids).distinct()

        def publishingstatuses(self):
            return PublishingStatus.objects.filter(project__in=self)

        def keywords(self):
            Keyword = get_model('rsr', 'Keyword')
            return Keyword.objects.filter(projects__in=self).distinct()

        def sectors(self):
            Sector = get_model('rsr', 'Sector')
            return Sector.objects.filter(project__in=self).distinct()

    def __unicode__(self):
        return u'%s' % self.title

    def updates_desc(self):
        """ProjectUpdate list for self, newest first."""
        return self.project_updates.select_related('user')

    def latest_update(self):
        """
        for use in the admin
        lists data useful when looking for projects that haven't been updated in a while
        (or not at all)
        note: it would have been useful to make this column sortable via the
        admin_order_field attribute, but this results in multiple rows shown for the project
        in the admin change list view and there's no easy way to distinct() them
        """
        # TODO: probably this can be solved by customizing ModelAdmin.queryset
        updates = self.updates_desc()
        if updates:
            update = updates[0]
            # date of update shown as link poiting to the update page
            update_info = '<a href="%s">%s</a><br/>' % (update.get_absolute_url(),
                                                        update.created_at,)
            # if we have an email of the user doing the update, add that as a mailto link
            if update.user.email:
                update_info = '%s<a href="mailto:%s">%s</a><br/><br/>' % (
                    update_info, update.user.email, update.user.email,
                )
            else:
                update_info = '%s<br/>' % update_info
        else:
            update_info = u'%s<br/><br/>' % (_(u'No update yet'),)
        # links to the project's support partners
        update_info = "%sSP: %s" % (
            update_info, ", ".join(
                [u'<a href="%s">%s</a>' % (
                    partner.get_absolute_url(), partner.name
                ) for partner in self.support_partners()]
            )
        )
        # links to the project's field partners
        return "%s<br/>FP: %s" % (
            update_info, ", ".join(
                [u'<a href="%s">%s</a>' % (
                    partner.get_absolute_url(), partner.name
                ) for partner in self.field_partners()]
            )
        )

    latest_update.allow_tags = True
    # no go, results in duplicate projects entries in the admin change list
    # latest_update.admin_order_field = 'project_updates__time'

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

    def show_current_image(self):
        try:
            return self.current_image.thumbnail_tag
        except:
            return ''
    show_current_image.allow_tags = True

    def show_keywords(self):
        return rsr_show_keywords(self)
    show_keywords.short_description = 'Keywords'
    show_keywords.allow_tags = True
    show_keywords.admin_order_field = 'keywords'

    def show_map(self):
        try:
            return '<img src="%s" />' % (self.map.url,)
        except:
            return ''
    show_map.allow_tags = True

    def connected_to_user(self, user):
        '''
        Test if a user is connected to self through an organisation
        '''
        try:
            for organisation in user.organisations.all():
                if self in organisation.all_projects():
                    return True
        except:
            pass
        return False

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
                          'iatiexport', 'iatiimportjob', 'id', 'is_impact_project', 'is_public',
                          'last_modified_at', 'partners', 'partnerships', 'primary_organisation',
                          'primary_organisation_id', 'publishingstatus', 'status', 'validations']

        for field in Project._meta.get_all_field_names():
            if field not in exclude_fields:
                field_value = getattr(self, field)
                m2m_field = getattr(field_value, 'all', None)
                if (m2m_field and m2m_field()) or (not m2m_field and getattr(self, field)):
                    return False

        return True

    def akvopedia_links(self):
        return self.links.filter(kind=Link.LINK_AKVOPEDIA)

    def external_links(self):
        return self.links.filter(kind=Link.LINK_EXTRNAL)

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
        unique_currencies = set([c.currency if c.currency else self.currency for c in budget_items])

        totals = {}
        for c in unique_currencies:
            if c == self.currency:
                totals[c] = budget_items.filter(Q(currency='') | Q(currency=c)).aggregate(Sum('amount')).values()[0]
            else:
                totals[c] = budget_items.filter(currency=c).aggregate(Sum('amount')).values()[0]

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

    def areas_and_categories(self):
        from .focus_area import FocusArea
        from .category import Category
        area_objs = FocusArea.objects.filter(
            categories__projects__exact=self
        ).distinct().order_by('name')
        areas = []
        for area_obj in area_objs:
            area = {'area': area_obj}
            area['categories'] = []
            for cat_obj in Category.objects.filter(
                    focus_area=area_obj,
                    projects=self
            ).order_by('name'):
                area['categories'] += [cat_obj.name]
            areas += [area]
        return areas

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
            if partnership.organisation not in partners_info.keys():
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

    def show_status_large(self):
        "Show the current project status with background"
        return mark_safe(
            "<span class='status_large' style='background-color:%s; color:inherit; "
            "display:inline-block;'>%s</span>" % (
                self.STATUSES_COLORS[self.iati_status], codelist_name(ActivityStatus, self, 'iati_status')
            )
        )

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
        return self.parents() or self.children() or self.siblings()

    def parents(self):
        return self.parents_all().published().public()

    def parents_all(self):
        return (
            Project.objects.filter(
                related_projects__related_project=self,
                related_projects__relation=RelatedProject.PROJECT_RELATION_CHILD
            ) | Project.objects.filter(
                related_to_projects__project=self,
                related_to_projects__relation=RelatedProject.PROJECT_RELATION_PARENT
            )
        ).distinct()

    def children(self):
        return self.children_all().published().public()

    def children_all(self):
        return (
            Project.objects.filter(
                related_projects__related_project=self,
                related_projects__relation=RelatedProject.PROJECT_RELATION_PARENT
            ) | Project.objects.filter(
                related_to_projects__project=self,
                related_to_projects__relation=RelatedProject.PROJECT_RELATION_CHILD
            )
        ).distinct()

    def siblings(self):
        return self.siblings_all().published().public()

    def siblings_all(self):
        return (
            Project.objects.filter(
                related_projects__related_project=self,
                related_projects__relation=RelatedProject.PROJECT_RELATION_SIBLING
            ) | Project.objects.filter(
                related_to_projects__project=self,
                related_to_projects__relation=RelatedProject.PROJECT_RELATION_SIBLING
            )
        ).distinct()

    def descendants(self, depth=None):
        """
        All child projects and all their children recursively
        :param dephth: How "deep" we recurse. If None, drill all the way down
        :return:
        """
        family = Project.objects.filter(pk=self.pk)
        family_count = 1
        while True:
            family = Project.objects.filter(
                related_projects__related_project__in=family,
                related_projects__relation=RelatedProject.PROJECT_RELATION_PARENT
            ) | Project.objects.filter(
                related_to_projects__project__in=family,
                related_to_projects__relation=RelatedProject.PROJECT_RELATION_CHILD
            ) | family
            if depth is None:
                if family.distinct().count() > family_count:
                    family_count = family.distinct().count()
                else:
                    return family.distinct()
            else:
                if family_count < depth:
                    family_count += 1
                else:
                    return family.distinct()

    def ancestor(self):
        "Find a project's ancestor, i.e. the parent or the parent's parent etc..."
        parents = self.parents_all()
        if parents and parents.count() == 1:
            return parents[0].ancestor()
        else:
            return self

    def uses_single_indicator_period(self):
        "Return the settings name of the hierarchy if there is one"
        ancestor = self.ancestor()
        if ancestor:
            pk = ancestor.pk
            root_projects = settings.SINGLE_PERIOD_INDICATORS['root_projects']
            root_ids = root_projects.keys()
            if pk in root_ids:
                return root_projects[pk]

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
        iati_checks = IatiChecks(self)
        return iati_checks.perform_checks()

    def update_iati_checks(self):
        """
        First, removes the current IATI checks, then adds new IATI checks.
        """
        # Remove old IATI checks
        for old_iati_check in self.iati_checks.all():
            old_iati_check.delete()

        # Perform new checks and save to database
        status_codes = {
            'success': 1,
            'warning': 2,
            'error': 3
        }

        iati_checks = self.check_mandatory_fields()
        for iati_check in iati_checks[1]:
            try:
                status_code = status_codes[iati_check[0]]
                IatiCheck.objects.create(
                    project=self,
                    status=status_code,
                    description=iati_check[1]
                )
            except KeyError:
                pass

    def iati_checks_status(self, status):
        return self.iati_checks.filter(status=status)

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

    def keyword_logos(self):
        """Return the keywords of the project which have a logo."""
        return self.keywords.exclude(logo='')

    def keyword_labels(self):
        return [keyword.label for keyword in self.keywords.all()]

    ###################################
    # RSR Impact projects #############
    ###################################

    def import_results(self):
        """Import results from the parent project."""
        import_failed = 0
        import_success = 1

        if self.parents_all().count() == 1:
            parent_project = self.parents_all()[0]
        elif self.parents_all().count() == 0:
            return import_failed, 'Project does not have a parent project'
        else:
            return import_failed, 'Project has multiple parent projects'

        for result in parent_project.results.all():
            # Only import results that have not been imported before
            if not self.results.filter(parent_result=result).exists():
                self.add_result(result)

        return import_success, 'Results imported'

    def import_indicator(self, parent_indicator_id):
        """
        :param parent_indicator_id: ID of indicator we want to create a child of in this self's
        results framework
        :return: new indicator object or None if it couldn't be imported/added
        """
        # Check that we have a parent project and that project of parent indicator is that parent
        parents = self.parents_all()
        if parents.count() == 0:
            raise Project.DoesNotExist, "Project has no parent"
        elif parents.count() > 1:
            raise Project.MultipleObjectsReturned, "Project has multiple parents"
        else:
            parent_project = parents[0]

        Result = get_model('rsr', 'Result')
        Indicator = get_model('rsr', 'Indicator')

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
        except:
            indicator_exists = False
        if indicator_exists:
            raise ValidationError("Indicator already exists")

        return self.add_indicator(result, parent_indicator)

    def add_result(self, result):
        child_result = get_model('rsr', 'Result').objects.create(
            project=self,
            parent_result=result,
            title=result.title,
            type=result.type,
            aggregation_status=result.aggregation_status,
            description=result.description,
        )

        for indicator in result.indicators.all():
            self.add_indicator(child_result, indicator)

    def add_indicator(self, result, parent_indicator):
        """Add a new indicator to the result as a child of the specified indicator.

        NOTE: There can only be one child for an indicator, per result. This
        method automatically updates an existing child indicator, if present.

        It also triggers the creation of periods, dimensions and references on
        the indicator, if the indicator is being created and not updated.

        """
        Indicator = get_model('rsr', 'Indicator')
        indicator, created = Indicator.objects.update_or_create(
            result=result,
            parent_indicator=parent_indicator,
            defaults=dict(
                title=parent_indicator.title,
                measure=parent_indicator.measure,
                ascending=parent_indicator.ascending,
            )
        )
        fields = ['description', 'baseline_year', 'baseline_value', 'baseline_comment']
        self._update_fields_if_not_child_updated(parent_indicator, indicator, fields)

        if not created:
            return indicator

        for period in parent_indicator.periods.all():
            self.add_period(indicator, period)

        for reference in parent_indicator.references.all():
            self.add_reference(indicator, reference)

        for dimension in parent_indicator.dimensions.all():
            self.add_dimension(indicator, dimension)

        return indicator

    def update_indicator(self, result, parent_indicator):
        """Update an indicator based on parent indicator attributes."""
        Indicator = get_model('rsr', 'Indicator')
        try:
            child_indicator = Indicator.objects.get(
                result=result,
                parent_indicator=parent_indicator,
            )

        except Indicator.DoesNotExist:
            return

        child_indicator.title = parent_indicator.title
        child_indicator.measure = parent_indicator.measure
        child_indicator.ascending = parent_indicator.ascending
        child_indicator.save()

        fields = ['title', 'description', 'baseline_year', 'baseline_value', 'baseline_comment']
        self._update_fields_if_not_child_updated(parent_indicator, child_indicator, fields)

    def add_period(self, indicator, period):
        """Add a new period to the indicator as a child of period.

        NOTE: There can only be one child for a period, per indicator. This
        method automatically updates the existing one, if there is one.

        """
        IndicatorPeriod = get_model('rsr', 'IndicatorPeriod')
        child_period, created = IndicatorPeriod.objects.select_related(
            'indicator',
            'indicator__result',
        ).update_or_create(
            indicator=indicator,
            parent_period=period,
            defaults=dict(
                period_start=period.period_start,
                period_end=period.period_end,
            )
        )
        fields = ['target_value', 'target_comment', 'actual_comment']
        self._update_fields_if_not_child_updated(period, child_period, fields)

    def update_period(self, indicator, parent_period):
        """Update a period based on the parent period attributes."""

        IndicatorPeriod = get_model('rsr', 'IndicatorPeriod')
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

        fields = ['target_value', 'target_comment', 'actual_comment']
        self._update_fields_if_not_child_updated(parent_period, child_period, fields)

    def add_dimension(self, indicator, dimension):
        get_model('rsr', 'IndicatorDimension').objects.create(
            indicator=indicator,
            name=dimension.name,
            value=dimension.value,
        )

    def add_reference(self, indicator, reference):
        get_model('rsr', 'IndicatorReference').objects.create(
            indicator=indicator,
            reference=reference.reference,
            vocabulary=reference.vocabulary,
            vocabulary_uri=reference.vocabulary_uri,
        )

    def _update_fields_if_not_child_updated(self, parent, child, fields):
        """Copy the specified fields from parent to child, when empty on the child."""
        for field in fields:
            parent_value = getattr(parent, field)
            if not getattr(child, field) and parent_value:
                setattr(child, field, parent_value)

        child.save()

    def has_results(self):
        for result in self.results.all():
            if result.title or result.type or result.aggregation_status or result.description:
                return True
        return False

    def has_indicators(self):
        for result in self.results.all():
            if result.indicators.all():
                return True
        return False

    def indicator_labels(self):
        return get_model('rsr', 'OrganisationIndicatorLabel').objects.filter(
            organisation=self.all_partners()
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

    @classmethod
    def log_project_addition(cls, project_id, user):
        project = cls.objects.get(id=project_id)
        message = u'%s.' % (_(u'Project editor, added project'))

        LogEntry.objects.log_action(
            user_id=user.pk,
            content_type_id=ContentType.objects.get_for_model(project).pk,
            object_id=project.pk,
            object_repr=project.__unicode__(),
            action_flag=ADDITION,
            change_message=message
        )

        # Perform IATI checks after a project has been created.
        project.update_iati_checks()

    @staticmethod
    def add_custom_fields(project_id, organisations):
        from akvo.rsr.models import OrganisationCustomField, ProjectCustomField
        custom_fields = OrganisationCustomField.objects.filter(
            organisation__in=organisations
        )
        copy_fields = (
            'name', 'type', 'section', 'order', 'max_characters', 'mandatory', 'help_text'
        )
        project_custom_fields = [
            ProjectCustomField(
                project_id=project_id,
                **{field: getattr(custom_field, field) for field in copy_fields}
            )
            for custom_field in custom_fields
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


@receiver(post_save, sender=Project)
def default_validation_set(sender, **kwargs):
    """When the project is created, add the RSR validation (pk=1) to the project."""
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
                      getattr(settings, "DEFAULT_FROM_EMAIL", "noreply@akvo.org"),
                      getattr(settings, "SUPPORT_EMAIL", ['rsr@akvo.org']))


@receiver(post_save, sender=ProjectUpdate)
def update_denormalized_project(sender, **kwargs):
    "Updates the denormalized project.last_update on related project."
    project_update = kwargs['instance']
    project = project_update.project
    project.last_update = project_update
    project.save(last_updated=True)


@receiver(post_delete, sender=ProjectUpdate)
def rewind_last_update(sender, **kwargs):
    """ Updates the denormalized project.last_update on related project

        When deleting an update we have to set project.last_update again since it'll change if the
        deleted update was tha latest or if it was the only update for the project
        """
    project_update = kwargs['instance']
    project = project_update.project
    try:
        project.last_update = project.updates_desc()[0]
    except IndexError:
        project.last_update = None
    project.save(last_updated=True)
