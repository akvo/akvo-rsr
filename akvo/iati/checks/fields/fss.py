# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


def fss(project):
    """
    Check if fss has extraction date.
    Check if fss forecast has value, year and currency or a default currency specified.

    :param project: Project object
    :return: All checks passed boolean, [Check results]
    """
    checks = []
    all_checks_passed = True

    fss_obj = getattr(project, 'fss', None)

    if fss_obj:
        if not fss_obj.extraction_date:
            all_checks_passed = False
            checks.append(('error', 'FSS (id: %s) has no extraction date specified' %
                           str(fss_obj.pk)))

        for forecast in fss_obj.forecasts.all():
            if forecast.value is None:
                all_checks_passed = False
                checks.append(('error', 'FSS forecast (id: %s) has no value specified' %
                               str(forecast.pk)))

            if not forecast.year:
                all_checks_passed = False
                checks.append(('error', 'FSS forecast (id: %s) has no year specified' %
                               str(forecast.pk)))

            if not (forecast.currency or project.currency):
                all_checks_passed = False
                checks.append(('error', 'FSS forecast (id: %s) has no currency specified and no '
                               'default currency specified' % str(forecast.pk)))

        if all_checks_passed:
            checks.append(('success', 'has valid FSS'))

    return all_checks_passed, checks
