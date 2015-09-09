# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from ..utils import get_text

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
    psd_date = None

    if activities_globals['version'][0] == '1':
        psd_element = activity.find("activity-date[@type='start-planned']")
    else:
        psd_element = activity.find("activity-date[@type='1']")

    if not psd_element is None:
        if 'iso-date' in psd_element.attrib.keys():
            psd_date_text = psd_element.attrib['iso-date']
        else:
            psd_date_text = get_text(psd_element, activities_globals['version'])

        try:
            psd_date = datetime.strptime(psd_date_text, '%Y-%m-%d')
        except ValueError:
            pass

    if project.date_start_planned != psd_date:
        project.date_start_planned = psd_date
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
    asd_date = None

    if activities_globals['version'][0] == '1':
        asd_element = activity.find("activity-date[@type='start-actual']")
    else:
        asd_element = activity.find("activity-date[@type='2']")

    if not asd_element is None:
        if 'iso-date' in asd_element.attrib.keys():
            asd_date_text = asd_element.attrib['iso-date']
        else:
            asd_date_text = get_text(asd_element, activities_globals['version'])

        try:
            asd_date = datetime.strptime(asd_date_text, '%Y-%m-%d')
        except ValueError:
            pass

    if project.date_start_actual != asd_date:
        project.date_start_actual = asd_date
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
    ped_date = None

    if activities_globals['version'][0] == '1':
        ped_element = activity.find("activity-date[@type='end-planned']")
    else:
        ped_element = activity.find("activity-date[@type='3']")

    if not ped_element is None:
        if 'iso-date' in ped_element.attrib.keys():
            ped_date_text = ped_element.attrib['iso-date']
        else:
            ped_date_text = get_text(ped_element, activities_globals['version'])

        try:
            ped_date = datetime.strptime(ped_date_text, '%Y-%m-%d')
        except ValueError:
            pass

    if project.date_end_planned != ped_date:
        project.date_end_planned = ped_date
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
    aed_date = None

    if activities_globals['version'][0] == '1':
        aed_element = activity.find("activity-date[@type='end-actual']")
    else:
        aed_element = activity.find("activity-date[@type='4']")

    if not aed_element is None:
        if 'iso-date' in aed_element.attrib.keys():
            aed_date_text = aed_element.attrib['iso-date']
        else:
            aed_date_text = get_text(aed_element, activities_globals['version'])

        try:
            aed_date = datetime.strptime(aed_date_text, '%Y-%m-%d')
        except ValueError:
            pass

    if project.date_end_actual != aed_date:
        project.date_end_actual = aed_date
        project.save(update_fields=['date_end_actual'])
        return ['date_end_actual']

    return []
