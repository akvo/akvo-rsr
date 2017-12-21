# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.db import models

from django_pgviews import view as pg


ACTUAL_VALUE_SQL = """
    SELECT
        -- row_number() OVER... creates an artificial "pk" column, without which Django will protest
        row_number()
        OVER (ORDER BY period.id) AS id,
        period.id AS period_id,
        indicator.measure as measure,
        sum((update.value) :: BIGINT) AS value,
        sum((update.numerator) :: BIGINT) AS numerator,
        sum((update.denominator) :: BIGINT) AS denominator
    FROM
        rsr_indicatorperiod period, 
        rsr_indicator indicator, 
        rsr_indicatorperioddata "update"
    WHERE 
        (
            (((indicator.id = period.indicator_id) AND 
            (period.id = update.period_id)) AND
            ((update.status) :: TEXT = 'A' :: TEXT)) AND 
            ((update.value) :: TEXT ~ '^\d+$' :: TEXT)
        )
    GROUP BY period.id, indicator.measure;
"""


class PeriodActualValue(pg.View):
    period = models.ForeignKey('IndicatorPeriod', on_delete=models.DO_NOTHING)
    measure = models.CharField(max_length=1)
    value = models.IntegerField()
    numerator = models.IntegerField()
    denominator = models.IntegerField()

    sql = ACTUAL_VALUE_SQL

    class Meta:
        app_label = 'rsr'
        db_table = 'rsr_indicator_period_actual_value'
        managed = False


DISAGG_SQL = """
    WITH aggregated_disaggs AS (
        SELECT
            dimension_id,
            sum(("value") :: BIGINT) AS value,
            sum((numerator) :: BIGINT) AS numerator,
            sum((denominator) :: BIGINT) AS denominator
        FROM
            rsr_disaggregation
        GROUP BY
            dimension_id
    )
    SELECT DISTINCT
        indicator.id AS indicator_id,
        period.id AS period_id,
        dimension.name AS dimension_name,
        dimension.value AS dimension_value,
        agg.value,
        agg.numerator,
        agg.denominator
    FROM
        rsr_indicator indicator,
        rsr_indicatorperiod period,
        rsr_indicatorperioddata update,
        aggregated_disaggs agg,
        rsr_indicatordimension dimension
    WHERE
        indicator.id = period.indicator_id AND
        period.id = update.period_id AND
        indicator.id = dimension.indicator_id AND
        dimension.id = agg.dimension_id
"""


class PeriodDisaggregation(pg.View):
    indicator = models.ForeignKey('Indicator', on_delete=models.DO_NOTHING)
    period = models.ForeignKey('IndicatorPeriod', on_delete=models.DO_NOTHING)
    dimension_name = models.CharField(max_length=100)
    dimension_value = models.CharField(max_length=100)
    value = models.IntegerField()
    numerator = models.IntegerField()
    denominator = models.IntegerField()

    sql = DISAGG_SQL

    class Meta:
        app_label = 'rsr'
        db_table = 'rsr_indicator_period_disaggregation'
        managed = False


