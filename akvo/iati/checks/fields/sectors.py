# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from decimal import Decimal
from akvo.utils import codelist_has_value
from akvo.codelists import models

VOCABULARY_CODE_MODEL_MAP = {
    '1': models.Sector,
    '2': models.SectorCategory,
    '7': models.UNSDGGoals,
    '8': models.UNSDGTargets,
}


def has_invalid_vocabulary_code(sector):
    return (
        sector.sector_code
        and sector.vocabulary in VOCABULARY_CODE_MODEL_MAP.keys()
        and not codelist_has_value(VOCABULARY_CODE_MODEL_MAP[sector.vocabulary], sector.sector_code)
    )


def sectors(project):
    """
    Check if sectors are present, either on project or transaction level, but not both.
    If on transaction level, all transactions must have a sector.
    Per sector vocabulary on project level, the percentages of the sectors should add up to 100%.
    On transaction level, each sector vocabulary should only occur once per transaction.

    :param project: Project object
    :return: All checks passed boolean, [Check results]
    """
    checks = []
    all_checks_passed = True

    if project.sectors.all():
        for transaction in project.transactions.all():
            if transaction.sectors.all():
                all_checks_passed = False
                checks.append(('error', 'sectors present both on project and transaction level'))

        if all_checks_passed:
            sectors_dict = {}
            for sector in project.sectors.all():
                try:
                    sectors_dict[sector.vocabulary or '1'].append(sector.percentage)
                except KeyError:
                    sectors_dict[sector.vocabulary or '1'] = [sector.percentage]

            for voc_key in sectors_dict:
                if len(sectors_dict[voc_key]) > 1:
                    voc_percentage = 0

                    for percentage in sectors_dict[voc_key]:
                        try:
                            voc_percentage += Decimal(percentage)
                        except (ValueError, TypeError):
                            all_checks_passed = False
                            checks.append(('error', 'multiple sectors with vocabulary \'%s\' '
                                           'specified, but not all have a percentage' %
                                           str(voc_key)))

                    if voc_percentage == 100:
                        checks.append(('success', 'sector percentages for vocabulary \'%s\' '
                                       'add up to 100' % str(voc_key)))
                    else:
                        all_checks_passed = False
                        checks.append(('error', 'sector percentages for vocabulary \'%s\' '
                                       'do not add up to 100' % str(voc_key)))

        sectors_by_vocabulary = dict()

        for sector in project.sectors.all():
            sectors_by_vocabulary.setdefault(sector.vocabulary, []).append(sector)
            if not sector.sector_code:
                all_checks_passed = False
                checks.append(('error', 'sector (id: %s) is missing sector code' %
                               str(sector.pk)))

            if has_invalid_vocabulary_code(sector):
                all_checks_passed = False
                checks.append(('error', 'sector (id: %s) has invalid sector code' % str(sector.pk)))

            if sector.vocabulary in ['98', '99'] and not sector.vocabulary_uri:
                checks.append(('warning', 'sector (id: %s) with vocabulary 98 or 99 (reporting '
                               'organisation) has no vocabulary URI specified' %
                               str(sector.pk)))

        for grouped_sectors in sectors_by_vocabulary.values():
            if len(grouped_sectors) > 1:
                continue
            single_sector_in_vocabulary = grouped_sectors[0]
            if not single_sector_in_vocabulary.percentage or single_sector_in_vocabulary.percentage == 100:
                continue
            all_checks_passed = False
            checks.append(('error', 'sector "%s" declared only once, the percentage must either be omitted or set to 100'
                           % single_sector_in_vocabulary.iati_vocabulary().name))

    elif not project.transactions.all():
        all_checks_passed = False
        checks.append(('error', 'no sectors present on project or transaction level'))

    else:
        for transaction in project.transactions.all():
            if not transaction.sectors.all():
                all_checks_passed = False
                checks.append(('error', 'no sectors on project level or transaction (id: %s) '
                               'missing sector' % str(transaction.pk)))

            else:
                sectors_vocs = []
                for sector in transaction.sectors.all():
                    if not sector.code:
                        all_checks_passed = False
                        checks.append(('error', 'transaction sector (id: %s) is missing code' %
                                       str(sector.pk)))

                    if sector.vocabulary in ['98', '99'] and not sector.vocabulary_uri:
                        checks.append(('warning', 'sector (id: %s) with vocabulary 98 or 99 '
                                       '(reporting organisation) has no vocabulary '
                                       'URI specified' % str(sector.pk)))

                    voc = sector.vocabulary or '1'

                    if voc in sectors_vocs:
                        all_checks_passed = False
                        checks.append(('error', 'multiple sectors with same vocabulary specified '
                                       'for transaction (id: %s)' % str(transaction.pk)))
                    else:
                        sectors_vocs.append(voc)

    if all_checks_passed:
        checks.append(('success', 'sectors specified on one level (project or transaction)'))

    return all_checks_passed, checks
