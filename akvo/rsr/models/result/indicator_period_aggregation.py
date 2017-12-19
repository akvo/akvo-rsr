# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.db import models

from django_pgviews import view as pg


VIEW_SQL = """
    SELECT
        -- row_number() OVER... creates an artificial "pk" column, without which Django will protest
        row_number() OVER (ORDER BY period.id ) AS id,
        period.id AS period_id,
        sum((update.value) :: BIGINT) AS value
    FROM
        rsr_indicatorperiod period,
        rsr_indicator indicator,
        rsr_indicatorperioddata update
    WHERE
        indicator.id = period.indicator_id AND
        period.id = update.period_id AND
        ((indicator.measure) :: TEXT = '1' :: TEXT) AND
        ((update.status) :: TEXT = 'A' :: TEXT)
        -- Ignore non-numerical update.values. This can be removed when values is numeric
        AND ((update.value) :: TEXT ~ '^\d+$' :: TEXT)
    GROUP BY
        period.id
"""


class PeriodActualValue(pg.View):
    period = models.ForeignKey('IndicatorPeriod')
    value = models.IntegerField()
    sql = VIEW_SQL

    class Meta:
        app_label = 'rsr'
        db_table = 'rsr_indicator_period_actual_value'
        managed = False
