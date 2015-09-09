# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from decimal import Decimal, InvalidOperation
from datetime import datetime

from django.db.models import get_model


def planned_disbursements(activity, project, activities_globals):
    """
    Retrieve and store the planned disbursements.
    The planned disbursements will be extracted from the 'planned-disbursement' elements.

    :param activity: ElementTree; contains all data of the activity
    :param project: Project instance
    :param activities_globals: Dictionary; contains all global activities information
    :return: List; contains fields that have changed
    """
    imported_pds = []
    changes = []

    for planned_disbursement in activity.findall('planned-disbursement'):
        value = None
        value_date = None
        currency = ''
        updated = None
        period_start = None
        period_end = None
        disbursement_type = ''

        if 'type' in planned_disbursement.attrib.keys():
            disbursement_type = planned_disbursement.attrib['type']

        if 'updated' in planned_disbursement.attrib.keys():
            updated_text = planned_disbursement.attrib['updated']
            try:
                updated = datetime.strptime(updated_text, '%Y-%m-%d').date()
            except ValueError:
                pass

        period_start_element = planned_disbursement.find('period-start')
        if not period_start_element is None and 'iso-date' in period_start_element.attrib.keys():
            period_start_text = period_start_element.attrib['iso-date']
            try:
                period_start = datetime.strptime(period_start_text, '%Y-%m-%d').date()
            except ValueError:
                pass

        period_end_element = planned_disbursement.find('period-end')
        if not period_end_element is None and 'iso-date' in period_end_element.attrib.keys():
            period_end_text = period_end_element.attrib['iso-date']
            try:
                period_end = datetime.strptime(period_end_text, '%Y-%m-%d').date()
            except ValueError:
                pass

        value_element = planned_disbursement.find('value')
        if not value_element is None:
            try:
                value = Decimal(value_element.text)
            except InvalidOperation:
                pass

            if 'value-date' in value_element.attrib.keys():
                value_date_text = value_element.attrib['value-date']
                try:
                    value_date = datetime.strptime(value_date_text, '%Y-%m-%d').date()
                except ValueError:
                    pass

            if 'currency' in value_element.attrib.keys():
                currency = value_element.attrib['currency'].upper()

        pd, created = get_model('rsr', 'planneddisbursement').objects.get_or_create(
            project=project,
            value=value,
            value_date=value_date,
            currency=currency,
            updated=updated,
            period_start=period_start,
            period_end=period_end,
            type=disbursement_type
        )

        if created:
            changes.append(u'added planned disbursement (id: %s): %s' % (str(pd.pk), pd))

        imported_pds.append(pd)

    for planned_disbursement in project.planned_disbursements.all():
        if not planned_disbursement in imported_pds:
            changes.append(u'deleted planned disbursement (id: %s): %s' %
                           (str(planned_disbursement.pk),
                            planned_disbursement.__unicode__()))
            planned_disbursement.delete()

    return changes
