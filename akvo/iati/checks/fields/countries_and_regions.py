# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


def countries_and_regions(project):
    """
    Check if recipient countries or regions are present only on project or transaction level.

    In case there are multiple recipients, all must have a percentage specified.
    Percentages for all reported countries and regions must add up to 100%.

    :param project: Project object
    :return: All checks passed boolean, [Check results]
    """
    checks = []
    all_checks_passed = True

    if project.recipient_countries.all() or project.recipient_regions.all():
        for transaction in project.transactions.all():
            if transaction.recipient_country or transaction.recipient_region:
                all_checks_passed = False
                checks.append(('error', 'recipient countries or regions present on project '
                               'and transaction level'))

    else:
        transaction_recipients = []
        for transaction in project.transactions.all():
            if transaction.recipient_country and transaction.recipient_region:
                all_checks_passed = False
                checks.append(('error', 'transaction (id: %s) has a recipient country and '
                               'region specified' % str(transaction.pk)))

            elif not (transaction.recipient_country or transaction.recipient_region):
                transaction_recipients.append(False)

            else:
                transaction_recipients.append(True)

            if len(set(transaction_recipients)) > 1:
                all_checks_passed = False
                checks.append(('error', 'all transactions must have a recipient country or '
                               'region specified if at least one transaction has'))

    no_recipient_countries = project.recipient_countries.all().count()
    no_recipient_regions = project.recipient_regions.all().count()

    if no_recipient_countries + no_recipient_regions > 1:
        percentage = 0

        for country in project.recipient_countries.all():
            if country.percentage is None:
                all_checks_passed = False
                checks.append(('error', 'recipient country %s has no percentage' %
                               country.country))

            else:
                percentage += country.percentage

        for region in project.recipient_regions.all():
            if region.percentage is None:
                all_checks_passed = False
                checks.append(('error', 'recipient region %s has no percentage' % region.region))

            else:
                percentage += region.percentage

        if percentage == 100:
            checks.append(('success', 'country or region recipients percentage adds up to 100'))

        else:
            all_checks_passed = False
            checks.append(('error', 'country or region recipients percentage does not add up to '
                           '100'))

    for country in project.recipient_countries.all():
        if not country.country:
            all_checks_passed = False
            checks.append(('error', 'recipient country (id: %s) has no country specified' %
                           str(country.pk)))

    for region in project.recipient_regions.all():
        if not region.region:
            all_checks_passed = False
            checks.append(('error', 'recipient region (id: %s) has no region specified' %
                           str(region.pk)))

        if region.region_vocabulary == '99' and not region.region_vocabulary_uri:
            checks.append(('warning', 'recipient region (id: %s) vocabulary is 99 (reporting '
                           'organisation), but no vocabulary URI is specified' %
                           str(region.pk)))

    if (project.recipient_countries.all() or project.recipient_regions.all()) and all_checks_passed:
        checks.append(('success', 'has valid country or region recipient(s)'))

    return all_checks_passed, checks
