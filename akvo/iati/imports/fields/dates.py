# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from datetime import datetime


def planned_start_date(activity, project, activities_globals):
    """
    Retrieve and store the planned start date.
    The codelist changed from v1 to v2. For v1 we retrieve the 'activity-date's with type
    'start-planned' and for v2 we use type '1'.

    :param activity: ElementTree; contains all data for the activity
    :param project: Project instance
    :param activities_globals: Dictionary; contains all global activities information
    :return: List; contains fields that have changed
    """
    if activities_globals['version'][0] == '1':
        psd_element = activity.find("activity-date[@type='start-planned']")
    else:
        psd_element = activity.find("activity-date[@type='1']")

    if not psd_element is None:
        if 'iso-date' in psd_element.attrib.keys():
            psd_date = psd_element.attrib['iso-date']
        else:
            psd_date = psd_element.text

        if psd_date and (not project.date_start_planned or
                         project.date_start_planned.isoformat() != psd_date):
            project.date_start_planned = datetime.strptime(psd_date, '%Y-%m-%d')
            project.save(update_fields=['date_start_planned'])
            return ['date_start_planned']

    return []


def actual_start_date(activity, project, activities_globals):
    """
    Retrieve and store the actual start date.
    The codelist changed from v1 to v2. For v1 we retrieve the 'activity-date's with type
    'start-actual' and for v2 we use type '2'.

    :param activity: ElementTree; contains all data for the activity
    :param project: Project instance
    :param activities_globals: Dictionary; contains all global activities information
    :return: List; contains fields that have changed
    """
    if activities_globals['version'][0] == '1':
        asd_element = activity.find("activity-date[@type='start-actual']")
    else:
        asd_element = activity.find("activity-date[@type='1']")

    if not asd_element is None:
        if 'iso-date' in asd_element.attrib.keys():
            asd_date = asd_element.attrib['iso-date']
        else:
            asd_date = asd_element.text

        if asd_date and (not project.date_start_actual or
                         project.date_start_actual.isoformat() != asd_date):
            project.date_start_actual = datetime.strptime(asd_date, '%Y-%m-%d')
            project.save(update_fields=['date_start_actual'])
            return ['date_start_actual']

    return []


def planned_end_date(activity, project, activities_globals):
    """
    Retrieve and store the planned end date.
    The codelist changed from v1 to v2. For v1 we retrieve the 'activity-date's with type
    'end-planned' and for v2 we use type '3'.

    :param activity: ElementTree; contains all data for the activity
    :param project: Project instance
    :param activities_globals: Dictionary; contains all global activities information
    :return: List; contains fields that have changed
    """
    if activities_globals['version'][0] == '1':
        ped_element = activity.find("activity-date[@type='end-planned']")
    else:
        ped_element = activity.find("activity-date[@type='3']")

    if not ped_element is None:
        if 'iso-date' in ped_element.attrib.keys():
            ped_date = ped_element.attrib['iso-date']
        else:
            ped_date = ped_element.text

        if ped_date and (not project.date_end_planned or
                         project.date_end_planned.isoformat() != ped_date):
            project.date_end_planned = datetime.strptime(ped_date, '%Y-%m-%d')
            project.save(update_fields=['date_end_planned'])
            return ['date_end_planned']

    return []


def actual_end_date(activity, project, activities_globals):
    """
    Retrieve and store the planned end date.
    The codelist changed from v1 to v2. For v1 we retrieve the 'activity-date's with type
    'end-actual' and for v2 we use type '4'.

    :param activity: ElementTree; contains all data for the activity
    :param project: Project instance
    :param activities_globals: Dictionary; contains all global activities information
    :return: List; contains fields that have changed
    """
    if activities_globals['version'][0] == '1':
        aed_element = activity.find("activity-date[@type='end-actual']")
    else:
        aed_element = activity.find("activity-date[@type='4']")

    if not aed_element is None:
        if 'iso-date' in aed_element.attrib.keys():
            aed_date = aed_element.attrib['iso-date']
        else:
            aed_date = aed_element.text

        if aed_date and (not project.date_end_actual or
                         project.date_end_actual.isoformat() != aed_date):
            project.date_end_actual = datetime.strptime(aed_date, '%Y-%m-%d')
            project.save(update_fields=['date_end_actual'])
            return ['date_end_actual']

    return []
