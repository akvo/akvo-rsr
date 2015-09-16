# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from ..utils import add_log


CODE_TO_STATUS = {
    '1': 'H',
    '2': 'A',
    '3': 'C',
    '4': 'C',
    '5': 'L',
    '6': 'R'
}


def status(iati_import, activity, project, activities_globals):
    """
    Retrieve and store the status.
    The title will be extracted from the 'code' attribute of the 'activity-status' element.

    :param iati_import: IatiImport instance
    :param activity: ElementTree; contains all data for the activity
    :param project: Project instance
    :param activities_globals: Dictionary; contains all global activities information
    :return: List; contains fields that have changed
    """
    project_status = 'N'

    activity_status = activity.find('activity-status')
    if activity_status is not None and 'code' in activity_status.attrib.keys():
        if not len(activity_status.attrib['code']) > 1:
            code = activity_status.attrib['code']
            if code in CODE_TO_STATUS.keys():
                project_status = CODE_TO_STATUS[code]
            else:
                add_log(iati_import, 'status', 'invalid status code', project)
        else:
            add_log(iati_import, 'status', 'status is too long (1 character allowed)', project)

    if project.status != project_status:
        project.status = project_status
        project.save(update_fields=['status'])
        return ['status']

    return []
