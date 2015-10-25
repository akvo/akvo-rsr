# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from datetime import date

CHECKS = [
    'iati_identifier',
    'reporting_org',
    'title',
    'description',
    'partners',
    'activity_status',
    'dates',
    'recipients',
    'locations',
    'sectors',
    'country_budget_items',
    'policy_markers',
    'budgets',
    'planned_disbursements',
    'transactions',
    'document_link',
    'related_activity',
    'legacy_data',
    'conditions',
    'results',
    'crs_add',
    'fss',
]


class V201Checks(object):
    def iati_identifier(self):
        """
        Check if a project has a IATI identifier.

        :return: List of tuples; Boolean for check passed and string explaining the check
        """
        if self.project.iati_activity_id:
            return [(u'success', u'has IATI identifier')]
        else:
            self.all_checks_passed = False
            return [(u'error', u'IATI identifier missing')]

    def reporting_org(self):
        """
        Check if a project has a reporting organisation and if the reporting organisation
        has an IATI identifier.

        :return: List of tuples; Boolean for check passed and string explaining the check
        """
        checks = []

        if self.project.sync_owner:
            checks.append((u'success', u'has reporting organisation'))
            if self.project.sync_owner.iati_org_id:
                checks.append((u'success', u'reporting organisation has IATI identifier'))
            else:
                self.all_checks_passed = False
                checks.append((u'error', u'IATI identifier for reporting organisation missing'))
        else:
            self.all_checks_passed = False
            checks.append((u'error', u'reporting organisation missing'))
            checks.append((u'error', u'IATI identifier for reporting organisation missing'))

        return checks

    def title(self):
        """
        Check if a project has a title.

        :return: List of tuples; Boolean for check passed and string explaining the check
        """
        if self.project.title:
            return [(u'success', u'has title')]
        else:
            self.all_checks_passed = False
            return [(u'error', u'title missing')]

    def description(self):
        """
        Check if a project has a description field.

        :return: List of tuples; Boolean for check passed and string explaining the check
        """
        p = self.project

        if p.subtitle or p.project_plan_summary or p.background or p.project_plan \
                or p.current_status or p.sustainability or p.goals_overview or p.target_group:
            return [(u'success', u'has description field(s)')]
        else:
            self.all_checks_passed = False
            return [(u'error', u'description field(s) missing')]

    def partners(self):
        """
        Check if a project has at least one valid partner and issue a warning if a partner
        misses the role, IATI identifier or name.

        :return: List of tuples; Boolean for check passed and string explaining the check
        """
        checks = []
        valid_partner = False

        for partnership in self.project.partnerships.all():
            if partnership.organisation:
                org = partnership.organisation
                org_name = org.long_name or org.name
                if (partnership.iati_organisation_role and
                        partnership.iati_organisation_role < 100 and (org.iati_org_id or org_name)):
                    valid_partner = True
                if not partnership.iati_organisation_role:
                    checks.append((u'error', u'missing role for partner %s' % org_name))
                if not org.iati_org_id:
                    checks.append((u'warning', u'partner %s has no IATI identifier' % org_name))
                if not org_name:
                    checks.append((u'warning', u'%s has no organisation '
                                               u'name' % partnership.iati_organisation_role))
            else:
                checks.append((u'error', u'partnership has no organisation'))

        if valid_partner:
            checks.insert(0, (u'success', u'has at least one valid partner'))
        else:
            self.all_checks_passed = False
            checks.insert(0, (u'error', u'no valid partners'))

        return checks

    def activity_status(self):
        """
        Check if a project has a status.

        :return: List of tuples; Boolean for check passed and string explaining the check
        """
        if self.project.status:
            return [(u'success', u'has status')]
        else:
            self.all_checks_passed = False
            return [(u'error', u'status missing')]

    def dates(self):
        """
        Check if a date start planned or actual is present
        Check if the actual dates are today, or in the past

        :return: List of tuples; Boolean for check passed and string explaining the check
        """
        checks = []

        if self.project.date_start_planned or self.project.date_start_actual:
            checks.append((u'success', u'has planned or actual start date'))
        else:
            self.all_checks_passed = False
            checks.append((u'error', u'planned or actual start date missing'))

        if self.project.date_start_actual:
            if self.project.date_start_actual > date.today():
                self.all_checks_passed = False
                checks.append((u'error', u'actual start date must be in the past'))

        if self.project.date_end_actual:
            if self.project.date_end_actual > date.today():
                self.all_checks_passed = False
                checks.append((u'error', u'actual end date must be in the past'))

        return checks

    def recipients(self):
        """
        Check if recipient countries or regions are present only on project or transaction level.
        In case there are multiple recipients, all must have a percentage specified.
        Check if percentages for all reported countries and regions must add up to 100%.

        :return: List of tuples; Boolean for check passed and string explaining the check
        """
        checks = []

        if self.project.recipient_countries.all() or self.project.recipient_regions.all():
            for t in self.project.transactions.all():
                if t.recipient_country or t.recipient_region:
                    self.all_checks_passed = False
                    checks.append((u'error', u'recipient countries or regions present on project '
                                             u'and transaction level'))
        else:
            transaction_recipients = []
            for t in self.project.transactions.all():
                if t.recipient_country and t.recipient_region:
                    self.all_checks_passed = False
                    checks.append((u'error', u'transaction (id: %s) has a recipient country and '
                                             u'region specified' % str(t.pk)))
                elif not (t.recipient_country or t.recipient_region):
                    transaction_recipients.append(False)
                else:
                    transaction_recipients.append(True)
                if len(set(transaction_recipients)) > 1:
                    self.all_checks_passed = False
                    checks.append((u'error', u'all transactions must have a recipient country or '
                                             u'region specified if at least one transaction has'))

        no_recipient_countries = self.project.recipient_countries.all().count()
        no_recipient_regions = self.project.recipient_regions.all().count()

        if no_recipient_countries + no_recipient_regions > 1:
            percentage = 0

            for country in self.project.recipient_countries.all():
                if not country.percentage:
                    self.all_checks_passed = False
                    checks.append((u'error', u'recipient country %s has no '
                                             u'percentage' % country.country))
                else:
                    percentage += country.percentage

            for region in self.project.recipient_regions.all():
                if not region.percentage:
                    self.all_checks_passed = False
                    checks.append((u'error', u'recipient region %s has no '
                                             u'percentage' % region.region))
                else:
                    percentage += region.percentage

            if percentage == 100:
                checks.append((u'success', u'country or region recipients percentage '
                                           u'adds up to 100'))
            else:
                self.all_checks_passed = False
                checks.append((u'error', u'country or region recipients percentage does not '
                                         u'add up to 100'))

        if (self.project.recipient_countries.all() or self.project.recipient_regions.all()) \
                and not checks:
            checks.append((u'success', u'has valid country or region recipient(s)'))

        return checks

    def locations(self):
        """
        If a(n administrative) code is specified, a vocabulary needs to be specified
        as well.

        :return: List of tuples; Boolean for check passed and string explaining the check
        """
        checks = []

        for location in self.project.locations.all():
            if location.location_code and not location.vocabulary:
                checks.append((u'error', u'location (id: %s) has code, '
                                         u'but no vocabulary' % str(location.pk)))

            for administrative in location.administratives.all():
                if administrative.code and not administrative.vocabulary:
                    checks.append((u'error', u'administrative location (id: %s) has code, '
                                             u'but no vocabulary' % str(administrative.pk)))

        if self.project.locations.all() and not checks:
            checks.append((u'success', u'has valid location(s)'))

        return checks

    def sectors(self):
        """
        Check if sectors are present, either on project or transaction level, but not both.
        If on transaction level, all transactions must have a sector.
        Per sector vocabulary on project level, the percentages of the sectors
        should add up to 100%.
        On transaction level, each sector vocabulary should only occur once per transaction.

        :return: List of tuples; Boolean for check passed and string explaining the check
        """
        checks = []

        if self.project.sectors.all():
            for t in self.project.transactions.all():
                if t.sectors.all():
                    self.all_checks_passed = False
                    checks.append((u'error', u'sectors present on project and transaction level'))

            if not checks:
                sectors_dict = {}
                for sector in self.project.sectors.all():
                    if not sector.vocabulary or sector.vocabulary == 'DAC':
                        voc = '1'
                    elif sector.vocabulary == 'DAC-3':
                        voc = '2'
                    else:
                        voc = sector.vocabulary

                    try:
                        sectors_dict[voc].append(sector.percentage)
                    except KeyError:
                        sectors_dict[voc] = [sector.percentage]

                for voc_key in sectors_dict.keys():
                    if len(sectors_dict[voc_key]) > 1:
                        voc_percentage = 0
                        for percentage in sectors_dict[voc_key]:
                            try:
                                voc_percentage += int(percentage)
                            except (ValueError, TypeError):
                                self.all_checks_passed = False
                                checks.append((u'error', u'multiple sectors for vocabulary (id: %s)'
                                                         u', but not all have a percentage '
                                                         u'specified' % str(voc_key)))

                        if voc_percentage == 100:
                            checks.append((u'success', u'sector percentages for vocabulary (id: %s)'
                                                       u' add up to 100' % str(voc_key)))
                        else:
                            self.all_checks_passed = False
                            checks.append((u'error', u'sector percentages for vocabulary (id: %s) '
                                                     u'do not add up to 100' % str(voc_key)))

        elif not self.project.transactions.all():
            self.all_checks_passed = False
            checks.append((u'error', u'no sectors present on project or transaction level'))

        else:
            for t in self.project.transactions.all():
                if not t.sectors.all():
                    self.all_checks_passed = False
                    checks.append((u'error', u'no sectors on project level or transaction (id: %s) '
                                             u'missing sector' % str(t.pk)))
                else:
                    t_sectors_vocs = []
                    for t_sector in t.sectors.all():
                        if not t_sector.vocabulary or t_sector.vocabulary == 'DAC':
                            voc = '1'
                        elif t_sector.vocabulary == 'DAC-3':
                            voc = '2'
                        else:
                            voc = t_sector.vocabulary

                        if voc in t_sectors_vocs:
                            checks.append((u'error', u'multiple sectors with same vocabulary '
                                                     u'specified for transaction '
                                                     u'(id: %s)' % str(t.pk)))
                        else:
                            t_sectors_vocs.append(voc)

        if not checks:
            checks.append((u'success', u'sectors specified on one level (project or transaction)'))

        return checks

    def country_budget_items(self):
        """
        Check if vocabulary is present if there are any country budget items.
        Check if percentages add up to 100 if there are multiple budgets.

        :return: List of tuples; Boolean for check passed and string explaining the check
        """
        checks = []

        if self.project.country_budget_items.all():
            if not self.project.country_budget_vocabulary:
                checks.append((u'error', u'vocabulary for country budget items not specified'))

        if self.project.country_budget_items.all().count() > 1:
            percentage = 0
            for budget in self.project.country_budget_items.all():
                if not budget.percentage:
                    checks.append((u'warning', u'country budget item (id: %s) has no '
                                               u'percentage' % str(budget.pk)))
                else:
                    percentage += budget.percentage

            if percentage == 100:
                checks.append((u'success', u'country budget item percentages add up to 100'))

        return checks

    def policy_markers(self):
        """
        Check if policy marker has a code and significance.

        :return: List of tuples; Boolean for check passed and string explaining the check
        """
        checks = []

        for policy_marker in self.project.policy_markers.all():
            if not policy_marker.policy_marker:
                checks.append((u'error', u'policy marker (id: %s) has no '
                                         u'code' % str(policy_marker.pk)))
            if not policy_marker.significance:
                checks.append((u'error', u'policy marker (id: %s) has no '
                                         u'significance' % str(policy_marker.pk)))

        if self.project.policy_markers.all() and not checks:
            checks.append((u'success', u'has valid policy marker(s)'))

        return checks

    def budgets(self):
        """
        Check if budget has start date, end date and a value.
        Check that start date lies before the end date.
        Check if the budget has a currency if there is not default currency.

        :return: List of tuples; Boolean for check passed and string explaining the check
        """
        checks = []

        for budget in self.project.budget_items.all():
            if not budget.amount:
                checks.append((u'error', u'budget (id: %s) has no amount' % str(budget.pk)))
            if not budget.period_start:
                checks.append((u'error', u'budget (id: %s) has no start date' % str(budget.pk)))
            if not budget.period_end:
                checks.append((u'error', u'budget (id: %s) has no end date' % str(budget.pk)))
            if budget.period_start and budget.period_end \
                    and budget.period_start > budget.period_end:
                checks.append((u'error', u'budget (id: %s) has a start date before the '
                                         u'end date' % str(budget.pk)))
            if not budget.currency and not self.project.currency:
                checks.append((u'error', u'budget (id: %s) has no currency and no default '
                                         u'currency specified' % str(budget.pk)))

        if self.project.budget_items.all() and not checks:
            checks.append((u'success', u'has valid budget items'))

        return checks

    def planned_disbursements(self):
        """
        Check if planned disbursement has start date, end date and a value.
        Check that start date lies before the end date.
        Check if the planned disbursement has a currency if there is not default currency.

        :return: List of tuples; Boolean for check passed and string explaining the check
        """
        checks = []

        for pd in self.project.planned_disbursements.all():
            if not pd.value:
                checks.append((u'error', u'planned disbursement (id: %s) has '
                                         u'no amount' % str(pd.pk)))
            if not pd.period_start:
                checks.append((u'error', u'planned disbursement (id: %s) has no start '
                                         u'date' % str(pd.pk)))
            if pd.period_start and pd.period_end and pd.period_start > pd.period_end:
                checks.append((u'error', u'planned disbursement (id: %s) has a start '
                                         u'date before the end date' % str(pd.pk)))
            if not pd.currency and not self.project.currency:
                checks.append((u'error', u'planned disbursement (id: %s) has no currency and no '
                                         u'default currency specified' % str(pd.pk)))

        if self.project.planned_disbursements.all() and not checks:
            checks.append((u'success', u'has valid planned disbursements'))

        return checks

    def transactions(self):
        """
        Check if transaction has a type, date (in the past or today) and value.
        Check if the transaction has a currency if there is not default currency.
        Check if provider and receiver org have a IATI identifier.

        :return: List of tuples; Boolean for check passed and string explaining the check
        """
        checks = []

        for t in self.project.transactions.all():
            if not t.transaction_type:
                checks.append((u'error', u'transaction (id: %s) has no type' % str(t.pk)))

            if not t.transaction_date:
                checks.append((u'error', u'transaction (id: %s) has no date' % str(t.pk)))
            elif t.transaction_date > date.today():
                checks.append((u'error', u'transaction (id: %s) has a date in '
                                         u'the future' % str(t.pk)))

            if not t.value:
                checks.append((u'error', u'transaction (id: %s) has no value' % str(t.pk)))

            if not (t.currency or self.project.currency):
                checks.append((u'error', u'transaction (id: %s) has no currency and no default '
                                         u'currency specified' % str(t.pk)))

            if t.receiver_organisation and not t.receiver_organisation.iati_org_id:
                checks.append((u'warning', u'receiver organisation of transaction (id: %s) has no '
                                           u'IATI identifier' % str(t.pk)))

            if t.provider_organisation and not t.provider_organisation.iati_org_id:
                checks.append((u'warning', u'provider organisation of transaction (id: %s) has no '
                                           u'IATI identifier' % str(t.pk)))

        if self.project.transactions.all() and not checks:
            checks.append((u'success', u'has valid transaction(s)'))

        return checks

    def document_link(self):
        """
        Check if document link has an url, format, title and category.

        :return: List of tuples; Boolean for check passed and string explaining the check
        """
        checks = []

        for doc in self.project.documents.all():
            if not (doc.url or doc.document):
                checks.append((u'error', u'document link (id: %s) has no url or document '
                                         u'specified' % str(doc.pk)))

            if not doc.format:
                checks.append((u'error', u'document link (id: %s) has no format '
                                         u'specified' % str(doc.pk)))

            if not doc.title:
                checks.append((u'error', u'document link (id: %s) has no title '
                                         u'specified' % str(doc.pk)))

            if not doc.category:
                checks.append((u'error', u'document link (id: %s) has no category '
                                         u'specified' % str(doc.pk)))

        if self.project.documents.all() and not checks:
            checks.append((u'success', u'has valid document(s)'))

        return checks

    def related_activity(self):
        """
        Check if related project has an IATI identifier and relation.

        :return: List of tuples; Boolean for check passed and string explaining the check
        """
        checks = []

        for related in self.project.related_projects.all():
            if not (related.related_project or related.related_iati_id):
                checks.append((u'error', u'related project or IATI identifier not specified'))
            elif not (related.related_project.iati_activity_id or related.related_iati_id):
                checks.append((u'error', u'related project (id: %s) has no IATI identifier and '
                                         u'no IATI identifier '
                                         u'specified' % str(related.related_project.pk)))

            if not related.relation:
                checks.append((u'error', u'relation missing for related project'))

        for related_to in self.project.related_to_projects.all():
            if not (related_to.project or related_to.related_iati_id):
                checks.append((u'error', u'related to project or IATI identifier not specified'))
            elif not (related_to.project.iati_activity_id or related_to.related_iati_id):
                checks.append((u'error', u'related to project (id: %s) has no IATI identifier '
                                         u'and no IATI identifier '
                                         u'specified' % str(related_to.project.pk)))

            if not related_to.relation:
                checks.append((u'error', u'relation missing for related to project'))

        if (self.project.related_projects.all() or self.project.related_to_projects.all()) \
                and not checks:
            checks.append((u'success', u'has valid related project(s)'))

        return checks

    def legacy_data(self):
        """
        Check if legacy data has a name and value.

        :return: List of tuples; Boolean for check passed and string explaining the check
        """
        checks = []

        for ld in self.project.legacy_data.all():
            if not ld.name:
                checks.append((u'error', u'legacy data (id: %s) has no name '
                                         u'specified' % str(ld.pk)))

            if not ld.value:
                checks.append((u'error', u'legacy data (id: %s) has no value '
                                         u'specified' % str(ld.pk)))

        if self.project.legacy_data.all() and not checks:
            checks.append((u'success', u'has valid legacy data'))

        return checks

    def conditions(self):
        """
        Check if condition has a type and description.

        :return: List of tuples; Boolean for check passed and string explaining the check
        """
        # TODO: Change conditions attached (1 if there are conditions else 0)
        checks = []

        for condition in self.project.conditions.all():
            if not condition.type:
                checks.append((u'error', u'condition (id: %s) has no type '
                                         u'specified' % str(condition.pk)))

            if not condition.text:
                checks.append((u'error', u'condition (id: %s) has no description '
                                         u'specified' % str(condition.pk)))

        if self.project.conditions.all() and not checks:
            checks.append((u'success', u'has valid condition(s)'))

        return checks

    def results(self):
        """
        Check if result has a type, title and at least one indicator.
        Check if indicator has a measure and title.
        Check if indicator baseline has year and value.
        Check if indicator period has a start and end date, and start before end.

        :return: List of tuples; Boolean for check passed and string explaining the check
        """
        checks = []

        for result in self.project.results.all():
            if not result.type:
                self.all_checks_passed = False
                checks.append((u'error', u'result (id: %s) has no type '
                                         u'specified' % str(result.pk)))

            if not result.title:
                self.all_checks_passed = False
                checks.append((u'error', u'result (id: %s) has no title '
                                         u'specified' % str(result.pk)))

            if not result.indicators.all():
                self.all_checks_passed = False
                checks.append((u'error', u'result (id: %s) has no indicator(s)' % str(result.pk)))

            for indicator in result.indicators.all():
                if not indicator.measure:
                    self.all_checks_passed = False
                    checks.append((u'error', u'indicator (id: %s) has no measure '
                                             u'specified' % str(indicator.pk)))

                if not indicator.title:
                    self.all_checks_passed = False
                    checks.append((u'error', u'indicator (id: %s) has no title '
                                             u'specified' % str(indicator.pk)))

                if (indicator.baseline_value and not indicator.baseline_year) or \
                        (not indicator.baseline_value and indicator.baseline_year):
                    checks.append((u'error', u'indicator (id: %s) baseline has no value or year '
                                             u'specified' % str(indicator.pk)))

                for period in indicator.periods.all():
                    if not period.period_start:
                        checks.append((u'error', u'indicator period (id: %s) has no start '
                                                 u'date specified' % str(period.pk)))
                    if not period.period_end:
                        checks.append((u'error', u'indicator period (id: %s) has no end '
                                                 u'date specified' % str(period.pk)))
                    if period.period_start and period.period_end and \
                            period.period_start > period.period_end:
                        checks.append((u'error', u'indicator period (id: %s) has a start date '
                                                 u'later than the end date' % str(period.pk)))

        if self.project.results.all() and not checks:
            checks.append((u'success', u'has valid result(s)'))

        return checks

    def crs_add(self):
        """
        Check if crs add other flags have a code and significance.
        Check if loan status year is present if any of the other loan status fields
        is present.
        Check if loan status currency or default currency is present if any of
        the other loan status fields is present.

        :return: List of tuples; Boolean for check passed and string explaining the check
        """
        checks = []

        if hasattr(self.project, 'crsadd'):
            c = self.project.crsadd
            for flag in c.other_flags.all():
                if not flag.code:
                    checks.append((u'error', u'CRS other flag (id: %s) has no code '
                                             u'specified' % str(flag.pk)))

                if not flag.significance:
                    checks.append((u'error', u'CRS other flag (id: %s) has no significance '
                                             u'specified' % str(flag.pk)))

            if not c.loan_status_year and \
                    (c.loan_status_currency or c.loan_status_value_date or c.interest_received
                     or c.principal_outstanding or c.principal_arrears or c.interest_arrears):
                checks.append((u'error', u'CRS (id: %s) has no loan status year '
                                         u'specified' % str(c.pk)))

            if not (c.loan_status_currency or self.project.currency) and \
                    (c.loan_status_year or c.loan_status_value_date or c.interest_received
                     or c.principal_outstanding or c.principal_arrears or c.interest_arrears):
                checks.append((u'error', u'CRS (id: %s) has no loan status currency specified '
                                         u'and no default currency specified' % str(c.pk)))

            if not checks:
                checks.append((u'success', u'has valid CRS'))

        return checks

    def fss(self):
        """
        Check if fss has extraction date.
        Check if fss forecast has value, year and currency or a default currency specified.

        :return: List of tuples; Boolean for check passed and string explaining the check
        """
        checks = []

        if hasattr(self.project, 'fss'):
            if not self.project.fss.extraction_date:
                checks.append((u'error', u'FSS (id: %s) has no extraction date '
                                         u'specified' % str(self.project.fss.pk)))

            for forecast in self.project.fss.forecasts.all():
                if not forecast.value:
                    checks.append((u'error', u'FSS forecast (id: %s) has no value '
                                             u'specified' % str(forecast.pk)))

                if not forecast.year:
                    checks.append((u'error', u'FSS forecast (id: %s) has no year '
                                             u'specified' % str(forecast.pk)))

                if not (forecast.currency or self.project.currency):
                    checks.append((u'error', u'FSS forecast (id: %s) has no currency specified '
                                             u'and no default currency '
                                             u'specified' % str(forecast.pk)))

            if not checks:
                checks.append((u'success', u'has valid FSS'))

        return checks

    def execute_all_checks(self):
        """
        Executes all checks for a Project.
        """
        for check in CHECKS:
            for check_result in getattr(self, check)():
                self.checks_results.append(check_result)

    def __init__(self, project):
        """
        Check if a Project has all the mandatory fields for exporting a valid IATI v2.01 file.

        :param project: Project object
        """
        self.all_checks_passed = True
        self.checks_results = []
        self.project = project
