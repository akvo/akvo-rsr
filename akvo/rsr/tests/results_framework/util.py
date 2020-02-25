# -*- coding: utf-8 -*-

"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from akvo.rsr.models import (
    IndicatorPeriod, IndicatorDimensionValue, IndicatorPeriodData,
    Disaggregation)


def get_periods(project):
    return IndicatorPeriod.objects.filter(indicator__result__project=project)


def get_disaggregations(project):
    return IndicatorDimensionValue.objects.filter(name__project=project)


def get_period_disaggregation(period, type):
    return period.disaggregations.filter(dimension_value__value=type).first()


def get_disaggregation_contributors(period, type, contributing_project=None):
    contributors = period.disaggregations.filter(dimension_value__value=type).first().contributors
    return contributors.filter(contributing_project=contributing_project).get()\
        if contributing_project else contributors


def create_period_update(period, user, value=None, numerator=None, denominator=None,
                         disaggregations=[], status=IndicatorPeriodData.STATUS_APPROVED_CODE):

    data = IndicatorPeriodData.objects.create(
        period=period,
        user=user,
        value=value,
        numerator=numerator,
        denominator=denominator,
        status=status
    )
    for d in disaggregations:
        Disaggregation.objects.create(
            update=data,
            dimension_value=d['type'],
            value=d.get('value', None),
            numerator=d.get('numerator', None),
            denominator=d.get('denominator', None)
        )

    return data


def amend_disaggregation_update(update, type, value):
    disaggregation = update.disaggregations.filter(dimension_value__value=type).first()
    disaggregation.value = value
    disaggregation.save()
