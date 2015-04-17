# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import math

from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.db.models import Max, Sum
from django.db.models.signals import post_save
from django.db.models.query import QuerySet
from django.dispatch import receiver
from django.utils.safestring import mark_safe
from django.utils.translation import ugettext, ugettext_lazy as _

from django_counter.models import ViewCounter

from sorl.thumbnail.fields import ImageField

from akvo.codelists.models import (AidType, ActivityScope, CollaborationType, FinanceType, FlowType, TiedStatus,
                                   BudgetIdentifierVocabulary)
from akvo.codelists.store.codelists_v201 import (AID_TYPE, ACTIVITY_SCOPE, COLLABORATION_TYPE,
                                                 FINANCE_TYPE, FLOW_TYPE, TIED_STATUS,
                                                 BUDGET_IDENTIFIER_VOCABULARY)
from akvo.utils import codelist_choices, codelist_value, rsr_image_path, rsr_show_keywords

from ...iati.mandatory_fields import check_export_fields

from ..fields import ProjectLimitedTextField, ValidXMLCharField, ValidXMLTextField
from ..mixins import TimestampsMixin

from .budget_item import BudgetItem, BudgetItemLabel
from .country import Country
from .invoice import Invoice
from .link import Link
from .models_utils import OrganisationsQuerySetManager, QuerySetManager
from .organisation import Organisation
from .partnership import Partnership
from .project_update import ProjectUpdate
from .publishing_status import PublishingStatus


def image_path(instance, file_name):
    return rsr_image_path(instance, file_name, 'db/project/%(instance_pk)s/%(file_name)s')


class Project(TimestampsMixin, models.Model):
    CURRENCY_CHOICES = (
        ('USD', '$'),
        ('EUR', '€'),
    )

    HIERARCHY_OPTIONS = (
        (1, u'Core Activity'),
        (2, u'Sub Activity'),
        (3, u'Lower Sub Activity')
    )

    STATUS_NONE = 'N'
    STATUS_NEEDS_FUNDING = 'H'
    STATUS_ACTIVE = 'A'
    STATUS_COMPLETE = 'C'
    STATUS_CANCELLED = 'L'
    STATUS_ARCHIVED = 'R'
    STATUSES = (
        (STATUS_NONE, _(u'None')),
        (STATUS_NEEDS_FUNDING, _(u'Needs funding')),
        (STATUS_ACTIVE, _(u'Active')),
        (STATUS_COMPLETE, _(u'Complete')),
        (STATUS_CANCELLED, _(u'Cancelled')),
        (STATUS_ARCHIVED, _(u'Archived')),
    )

    STATUSES_COLORS = {
        STATUS_NONE: 'black',
        STATUS_NEEDS_FUNDING: 'orange',
        STATUS_ACTIVE: '#AFF167',
        STATUS_COMPLETE: 'grey',
        STATUS_CANCELLED: 'red',
        STATUS_ARCHIVED: 'grey',
    }

    title = ValidXMLCharField(
        _(u'title'), max_length=45, db_index=True,
        help_text=_(u'The title and subtitle fields are the newspaper headline for your project. Use them to attract '
                    u'attention to what you are doing. (45 characters)')
    )
    subtitle = ValidXMLCharField(
        _(u'subtitle'), max_length=75,
        help_text=_(u'The title and subtitle fields are the newspaper headline for your project. Use them to attract '
                    u'attention to what you are doing. (75 characters)')
    )
    status = ValidXMLCharField(
        _(u'status'), max_length=1, choices=STATUSES, db_index=True, default=STATUS_NONE,
        help_text=_(u'There are four different project statuses:<br>'
                    u'1) Needs funding: projects that still need funding.<br>'
                    u'2) Active: projects that started with the implementation phase.<br>'
                    u'3) Completed: projects that have been finished.<br>'
                    u'4) Cancelled: projects that were never fully implemented or carried out.')
    )
    categories = models.ManyToManyField('Category', verbose_name=_(u'categories'), related_name='projects', blank=True)
    partners = models.ManyToManyField(
        'Organisation', verbose_name=_(u'partners'), through=Partnership, related_name='projects',
    )
    project_plan_summary = ProjectLimitedTextField(
        _(u'summary of project plan'), max_length=400,
        help_text=_(u'Enter a brief summary. The summary should explain: (400 characters)<br>'
                    u'- Why the project is being carried out;<br>'
                    u'- Where it is taking place;<br>'
                    u'- Who will benefit and/or participate;<br>'
                    u'- What it specifically hopes to accomplish;<br>'
                    u'- How those specific goals will be reached')
    )

    current_image = ImageField(
        _('project photo'), blank=True, upload_to=image_path,
        help_text=_(u'Add your project photo here. You can only add one photo. If you have more, you can add them '
                    u'via RSR updates when your project is published.<br>'
                    u'The photo should be about 1 MB in size, and should preferably be in JPG format.'),
    )
    current_image_caption = ValidXMLCharField(
        _(u'photo caption'), blank=True, max_length=50,
        help_text=_(u'Briefly describe what is happening in the photo. (50 characters)')
    )
    current_image_credit = ValidXMLCharField(
        _(u'photo credit'), blank=True, max_length=50,
        help_text=_(u'Who took the photo? (50 characters)')
    )

    goals_overview = ProjectLimitedTextField(
        _(u'goals overview'), max_length=600,
        help_text=_(u'Provide a brief description of the overall project goals. (600 characters)')
    )
    current_status = ProjectLimitedTextField(
        _(u'current situation'), blank=True, max_length=600,
        help_text=_(u'Describe the current situation of the project: (600 characters)<br>'
                    u'- What is the starting point of the project?<br>'
                    u'- What is happening at the moment?')
    )
    project_plan = ValidXMLTextField(
        _(u'project plan'), blank=True,
        help_text=_(
            u'This should include detailed information about the project and plans for implementing: '
            u'the what, how, who and when. (unlimited)'
        )
    )
    sustainability = ValidXMLTextField(
        _(u'sustainability'),
        help_text=_(u'Describe plans for sustaining/maintaining results after implementation is complete. (unlimited)')
    )
    background = ProjectLimitedTextField(
        _(u'background'), blank=True, max_length=1000,
        help_text=_(
            u'Include relevant background information, including geographic, political, environmental, social and/or '
            u'cultural issues. (1000 characters)'
        )
    )
    target_group = ProjectLimitedTextField(
        _(u'target group'), blank=True, max_length=600,
        help_text=_(
            u'This should include information about the people, organisations or resources that are being impacted by '
            u'this project. (600 characters)'
        )
    )

    # project meta info
    language = ValidXMLCharField(
        max_length=2, choices=settings.LANGUAGES, default='en', help_text=u'The main language of the project.'
    )
    project_rating = models.IntegerField(_(u'project rating'), default=0)
    notes = ValidXMLTextField(_(u'notes'), blank=True, default='', help_text=_(u'(Unlimited number of characters).'))
    keywords = models.ManyToManyField('Keyword', verbose_name=_(u'keywords'), related_name='projects', blank=True)

    # budget
    currency = ValidXMLCharField(
        _(u'currency'), choices=CURRENCY_CHOICES, max_length=3, default='EUR',
        help_text=_(u'The default currency for this project. Used in all financial aspects of the project.')
    )
    date_start_planned = models.DateField(
        _(u'start date (planned)'), null=True, blank=True, help_text=_(u'Enter the planned start date of the project.')
    )
    date_start_actual = models.DateField(
        _(u'start date (actual)'), null=True, blank=True, help_text=_(u'Enter the actual start date of the project.')
    )
    date_end_planned = models.DateField(
        _(u'end date (planned)'), null=True, blank=True, help_text=_(u'Enter the planned end date of the project.')
    )
    date_end_actual = models.DateField(
        _(u'end date (actual)'), null=True, blank=True, help_text=_(u'Enter the actual end date of the project.')
    )

    primary_location = models.ForeignKey('ProjectLocation', null=True, on_delete=models.SET_NULL)

    # donate button
    donate_button = models.BooleanField(
        _(u'donate button'), default=True,
        help_text=_(u'Show donate button for this project. If not selected, it is not possible to donate to this '
                    u'project and the donate button will not be shown.')
    )

    # synced projects
    sync_owner = models.ForeignKey(
        'Organisation', verbose_name=_(u'reporting organisation'), related_name='reporting_projects',
        null=True, blank=True, on_delete=models.SET_NULL, help_text=_(u'Select the reporting organisation of the project.')
    )
    sync_owner_secondary_reporter = models.NullBooleanField(
        _(u'secondary reporter'),
        help_text=_(u'This indicates whether the reporting organisation is a secondary publisher: publishing data for '
                    u'which it is not directly responsible.')
    )

    # extra IATI fields
    iati_activity_id = ValidXMLCharField(
        _(u'IATI Project Identifier'), max_length=100, blank=True, db_index=True,
        help_text=_(u'This should be the official unique IATI Identifier for the project. The identifier consists of '
                    u'the IATI organisation identifier and the (organisations internal) project identifier, e.g. '
                    u'NL-KVK-31156201-TZ1234. (100 characters)<br>'
                    u'Note that \'projects\' in this form are the same as \'activities\' in IATI.<br>'
                    u'<a href="http://iatistandard.org/activity-standard/iati-activities/iati-activity/iati-identifier"'
                    u' target="_blank">How to create</a>')
    )
    hierarchy = models.PositiveIntegerField(
        _(u'hierarchy'), null=True, blank=True, max_length=1, choices=HIERARCHY_OPTIONS,
        help_text=_(u'If you are reporting multiple levels of projects in RSR, you can specify whether this is a core '
                    u'or sub-project here.<br>'
                    u'So for example: is this project part of a larger project or programme.')
    )
    project_scope = ValidXMLCharField(
        _(u'project scope'), blank=True, max_length=2, choices=codelist_choices(ACTIVITY_SCOPE),
        help_text=_(u'Select the geographical scope of the project.')
    )
    capital_spend_percentage = models.DecimalField(
        _(u'capital spend percentage'), blank=True, null=True, max_digits=4, decimal_places=1,
        validators=[MaxValueValidator(100), MinValueValidator(0)]
    )
    collaboration_type = ValidXMLCharField(_(u'collaboration type'), blank=True, max_length=1,
                                           choices=codelist_choices(COLLABORATION_TYPE))
    default_aid_type = ValidXMLCharField(_(u'default aid type'), blank=True, max_length=3,
                                         choices=codelist_choices(AID_TYPE))
    default_finance_type = ValidXMLCharField(_(u'default finance type'), blank=True, max_length=3,
                                             choices=codelist_choices(FINANCE_TYPE))
    default_flow_type = ValidXMLCharField(_(u'default flow type'), blank=True, max_length=2,
                                          choices=codelist_choices(FLOW_TYPE))
    default_tied_status = ValidXMLCharField(_(u'default tied status'), blank=True, max_length=1,
                                            choices=codelist_choices(TIED_STATUS))
    country_budget_vocabulary = ValidXMLCharField(
        _(u'country budget vocabulary'), blank=True, max_length=1,
        choices=codelist_choices(BUDGET_IDENTIFIER_VOCABULARY)
    )

    # denormalized data
    # =================
    budget = models.DecimalField(
        _('project budget'), max_digits=10, decimal_places=2, blank=True, null=True, db_index=True, default=0
    )
    funds = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True, db_index=True, default=0)
    funds_needed = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True, db_index=True, default=0)
    last_update = models.ForeignKey(ProjectUpdate, related_name='the_project',
                                    null=True, on_delete=models.SET_NULL)

    # Custom manager
    # based on http://www.djangosnippets.org/snippets/562/ and
    # http://simonwillison.net/2008/May/1/orm/
    objects = QuerySetManager()
    organisations = OrganisationsQuerySetManager()

    @models.permalink
    def get_absolute_url(self):
        return ('project-main', (), {'project_id': self.pk})

    def accepts_donations(self):
        """Returns True if a project accepts donations, otherwise False.
        A project accepts donations when the donate button settings is True, the project is published,
        the project needs funding and is not cancelled or archived."""
        if self.donate_button and self.is_published() and self.funds_needed > 0 and \
                self.status in [Project.STATUS_NEEDS_FUNDING, Project.STATUS_ACTIVE, Project.STATUS_COMPLETE]:
            return True
        return False

    def all_donations(self):
        return Invoice.objects.filter(
            project__exact=self.id
        ).filter(status__exact=Invoice.PAYPAL_INVOICE_STATUS_COMPLETE).exclude(test=True)

    def public_donations(self):
        return Invoice.objects.filter(
            project__exact=self.id
        ).filter(status__exact=Invoice.PAYPAL_INVOICE_STATUS_COMPLETE).exclude(test=True).exclude(is_anonymous=True)

    def all_donations_amount(self):
        return Invoice.objects.filter(
            project__exact=self.id
        ).filter(status__exact=Invoice.PAYPAL_INVOICE_STATUS_COMPLETE).exclude(test=True).aggregate(
            all_donations_sum=Sum('amount')
        )['all_donations_sum']

    def all_donations_amount_received(self):
        return Invoice.objects.filter(
            project__exact=self.id).filter(
            status__exact=Invoice.PAYPAL_INVOICE_STATUS_COMPLETE).exclude(test=True).aggregate(
            all_donations_sum=Sum('amount_received')
        )['all_donations_sum']

    def amount_needed_to_fully_fund_via_paypal(self):
        if self.currency == 'USD':
            PAYPAL_FEE_PCT = getattr(settings, 'PAYPAL_FEE_PCT_USD', 3.9)
            PAYPAL_FEE_BASE = getattr(settings, 'PAYPAL_FEE_BASE_USD', 0.30)
        else:
            PAYPAL_FEE_PCT = getattr(settings, 'PAYPAL_FEE_PCT_EUR', 3.4)
            PAYPAL_FEE_BASE = getattr(settings, 'PAYPAL_FEE_BASE_EUR', 0.35)
        return int(math.ceil(float(self.funds_needed) / (1 - PAYPAL_FEE_PCT/100) + PAYPAL_FEE_BASE))

    def amount_needed_to_fully_fund_via_ideal(self):
        MOLLIE_FEE_BASE = getattr(settings, 'MOLLIE_FEE_BASE', 1.20)
        return int(math.ceil(float(self.funds_needed) + MOLLIE_FEE_BASE))

    def anonymous_donations_amount_received(self):
        amount = Invoice.objects.filter(project__exact=self.id).exclude(is_anonymous=False)
        amount = amount.filter(status__exact=3).aggregate(sum=Sum('amount_received'))['sum']
        return amount or 0

    # New API, de-normalized fields support

    def get_budget(self):
        if 'total' in BudgetItemLabel.objects.filter(budgetitem__project__exact=self):
            return BudgetItem.objects.filter(project__exact=self).filter(label__label='total')[0].amount
        else:
            return BudgetItem.objects.filter(project__exact=self).aggregate(Sum('amount'))['amount__sum'] or 0

    def update_budget(self):
        "Update de-normalized field"
        self.budget = self.get_budget()
        self.save()

    def get_donations(self):
        """ Confirmed donations to the project, after middleman fees"""
        return Invoice.objects.filter(project__exact=self).filter(
            status__exact=Invoice.PAYPAL_INVOICE_STATUS_COMPLETE
        ).aggregate(Sum('amount_received'))['amount_received__sum'] or 0

    def get_pending_donations(self):
        """ Unconfirmed donations, before middleman fees have been deducted"""
        return Invoice.objects.filter(project__exact=self).filter(
            status__exact=Invoice.PAYPAL_INVOICE_STATUS_PENDING
        ).aggregate(Sum('amount'))['amount__sum'] or 0

    def get_pledged(self):
        """ How much is pledges by funding organisations"""
        return Partnership.objects.filter(project__exact=self).filter(
            partner_type__exact=Partnership.FUNDING_PARTNER
        ).aggregate(Sum('funding_amount'))['funding_amount__sum'] or 0

    def get_funds(self):
        """ All money given to a project, including pending donations"""
        return self.get_donations() + self.get_pending_donations() + self.get_pledged()

    def update_funds(self):
        "Update de-normalized field"
        self.funds = self.get_funds()
        self.save()

    def get_funds_needed(self):
        """ How much more is needed to fulfill the project's budget needs
            Note that this may be a small negative if there's been an overshooting donation
        """
        return self.get_budget() - self.get_funds()

    def update_funds_needed(self):
        "Update de-normalized field"
        self.funds_needed = self.get_funds_needed()
        self.save()

    # End new API

    @property
    def view_count(self):
        counter = ViewCounter.objects.get_for_object(self)
        return counter.count or 0


    class QuerySet(QuerySet):

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

        def status_none(self):
            return self.filter(status__exact=Project.STATUS_NONE)

        def status_active(self):
            return self.filter(status__exact=Project.STATUS_ACTIVE)

        def status_onhold(self):
            return self.filter(status__exact=Project.STATUS_NEEDS_FUNDING)

        def status_complete(self):
            return self.filter(status__exact=Project.STATUS_COMPLETE)

        def status_not_complete(self):
            return self.exclude(status__exact=Project.STATUS_COMPLETE)

        def status_cancelled(self):
            return self.filter(status__exact=Project.STATUS_CANCELLED)

        def status_not_cancelled(self):
            return self.exclude(status__exact=Project.STATUS_CANCELLED)

        def status_archived(self):
            return self.filter(status__exact=Project.STATUS_ARCHIVED)

        def status_not_archived(self):
            return self.exclude(status__exact=Project.STATUS_ARCHIVED)

        def active(self):
            """Return projects that are published and not cancelled or archived"""
            return self.published().status_not_cancelled().status_not_archived()

        def euros(self):
            return self.filter(currency='EUR')

        def dollars(self):
            return self.filter(currency='USD')

        def donated(self):
            return self.filter(
                    invoice__status=Invoice.PAYPAL_INVOICE_STATUS_COMPLETE
                ).annotate(donated=Sum('invoice__amount_received')).distinct()

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
                result = self.filter(  # filter finds largest "benchmarkname" value in benchmarks for categories in cats
                    benchmarks__name__name=benchmarkname,
                    benchmarks__category__name__in=cats
                )
            else:
                result = self.filter(  # filter finds largest "benchmarkname" value in benchmarks for all categories
                    benchmarks__name__name=benchmarkname
                )
            # annotate the greatest of the "benchmarkname" values into max_value
            return result.annotate(max_value=Max('benchmarks__value')).aggregate( # sum max_value for all projects
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

        def latest_update_fields(self):
            #used in project_list view
            #cheating slightly, counting on that both id and time are the largest for the latest update
            return self.annotate(
                latest_update_id=Max('project_updates__id'), latest_update_date=Max('project_updates__created_at')
            )

        def all_updates(self):
            "return ProjectUpdates for self, newest first"
            from ..models import ProjectUpdate
            qs = ProjectUpdate.objects.none()
            for project in self:
                qs = qs | project.project_updates.all()
            return qs

        #the following 6 methods return organisation querysets!
        def _partners(self, partner_type=None):
            orgs = Organisation.objects.filter(partnerships__project__in=self)
            if partner_type:
                orgs = orgs.filter(partnerships__partner_type=partner_type)
            return orgs.distinct()

        def field_partners(self):
            return self._partners(Partnership.FIELD_PARTNER)

        def funding_partners(self):
            return self._partners(Partnership.FUNDING_PARTNER)

        def sponsor_partners(self):
            return self._partners(Partnership.SPONSOR_PARTNER)

        def support_partners(self):
            return self._partners(Partnership.SUPPORT_PARTNER)

        def all_partners(self):
            return self._partners()

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


    def __unicode__(self):
        return u'%s' % self.title

    def updates_desc(self):
        "return ProjectUpdates for self, newest first"
        return self.project_updates.all().order_by('-created_at')

    def latest_update(self):
        """
        for use in the admin
        lists data useful when looking for projects that haven't been updated in a while (or not at all)
        note: it would have been useful to make this column sortable via the admin_order_field attribute,
        but this results in multiple rows shown for the project in the admin change list view and there's no easy way
        to distinct() them
        """
        # TODO: probably this can be solved by customizing ModelAdmin.queryset
        updates = self.updates_desc()
        if updates:
            update = updates[0]
            # date of update shown as link poiting to the update page
            update_info = '<a href="%s">%s</a><br/>' % (update.get_absolute_url(), update.created_at,)
            # if we have an email of the user doing the update, add that as a mailto link
            if update.user.email:
                update_info = '%s<a href="mailto:%s">%s</a><br/><br/>' % (
                    update_info, update.user.email, update.user.email,
                )
            else:
                update_info = '%s<br/>' % update_info
        else:
            update_info = u'%s<br/><br/>' % (ugettext(u'No update yet'),)
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
    #no go, results in duplicate projects entries in the admin change list
    #latest_update.admin_order_field = 'project_updates__time'

    def show_status(self):
        "Show the current project status"
        return mark_safe(
            "<span style='color: %s;'>%s</span>" % (self.STATUSES_COLORS[self.status], self.get_status_display())
        )

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

    def akvopedia_links(self):
        return self.links.filter(kind=Link.LINK_AKVOPEDIA)

    def external_links(self):
        return self.links.filter(kind=Link.LINK_EXTRNAL)

    def budget_total(self):
        return Project.objects.budget_total().get(pk=self.pk).budget_total

    def focus_areas(self):
        from .focus_area import FocusArea
        return FocusArea.objects.filter(categories__in=self.categories.all()).distinct()
    focus_areas.allow_tags = True

    def areas_and_categories(self):
        from .focus_area import FocusArea
        from .category import Category
        area_objs = FocusArea.objects.filter(categories__projects__exact=self).distinct().order_by('name')
        areas = []
        for area_obj in area_objs:
            area = {'area': area_obj}
            area['categories'] = []
            for cat_obj in Category.objects.filter(focus_area=area_obj, projects=self).order_by('name'):
                area['categories'] += [cat_obj.name]
            areas += [area]
        return areas

    #shortcuts to linked orgs for a single project
    def _partners(self, partner_type=None):
        """
        Return the partner organisations to the project.
        If partner_type is specified only organisations having that role are returned
        """
        orgs = self.partners.all()
        if partner_type:
            return orgs.filter(partnerships__partner_type=partner_type).distinct()
        else:
            return orgs.distinct()

    def reporting_org(self):
        if self.sync_owner:
            return self.sync_owner
        elif self.support_partners():
            return self.support_partners()[0]
        elif self.all_partners():
            return self.all_partners()[0]
        else:
            return None

    def field_partners(self):
        return self._partners(Partnership.FIELD_PARTNER)

    def funding_partners(self):
        return self._partners(Partnership.FUNDING_PARTNER)

    def sponsor_partners(self):
        return self._partners(Partnership.SPONSOR_PARTNER)

    def support_partners(self):
        return self._partners(Partnership.SUPPORT_PARTNER)

    def all_partners(self):
        return self._partners()

    def partners_info(self):
        """
        Return a dict of the distinct partners with the organisation as key and as content:
        1. The partnerships of the organisation
        2. The (added up) funding amount, if available. Otherwise None.
        E.g. {<Organisation 1>: [[<Partnership 1>,], 10000], <Organisation 2>: [[<Partnership 2>,], None]]}
        """
        partners_info = {}
        for partnership in Partnership.objects.filter(project=self):
            funding_amount = partnership.funding_amount if partnership.funding_amount else None
            if not partnership.organisation in partners_info.keys():
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
        return self.partnerships.filter(partner_type=Partnership.FUNDING_PARTNER)

    def show_status_large(self):
        "Show the current project status with background"
        return mark_safe(
            "<span class='status_large' style='background-color:%s; color:inherit; display:inline-block;'>%s</span>" % (
                self.STATUSES_COLORS[self.status], self.get_status_display()
            )
        )

    def iati_project_scope(self):
        return codelist_value(ActivityScope, self, 'project_scope')

    def iati_collaboration_type(self):
        return codelist_value(CollaborationType, self, 'collaboration_type')

    def iati_default_flow_type(self):
        return codelist_value(FlowType, self, 'default_flow_type')

    def iati_default_finance_type(self):
        return codelist_value(FinanceType, self, 'default_finance_type')

    def iati_default_aid_type(self):
        return codelist_value(AidType, self, 'default_aid_type')

    def iati_default_tied_status(self):
        return codelist_value(TiedStatus, self, 'default_tied_status')

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
        return (
            Project.objects.filter(
                related_projects__related_project=self,
                related_projects__relation=2
            ) | Project.objects.filter(
                related_to_projects__project=self,
                related_to_projects__relation=1
            )
        ).distinct()

    def children(self):
        return (
            Project.objects.filter(
                related_projects__related_project=self,
                related_projects__relation=1
            ) | Project.objects.filter(
                related_to_projects__project=self,
                related_to_projects__relation=2
            )
        ).distinct()

    def siblings(self):
        return (
            Project.objects.filter(
                related_projects__related_project=self,
                related_projects__relation=3
            ) | Project.objects.filter(
                related_to_projects__project=self,
                related_to_projects__relation=3
            )
        ).distinct()

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

    def check_mandatory_fields(self, version='2.01'):
        return check_export_fields(self, version)

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'project')
        verbose_name_plural = _(u'projects')
        ordering = ['-id', ]
        permissions = (
            ('post_updates', u'Can post updates'),
        )


@receiver(post_save, sender=ProjectUpdate)
def update_denormalized_project(sender, **kwargs):
    "Updates the denormalized project.last_update on related project."
    project_update = kwargs['instance']
    project = project_update.project
    project.last_update = project_update
    project.save()
