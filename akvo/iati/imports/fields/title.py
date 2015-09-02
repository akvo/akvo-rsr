# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


def title(activity, project):
    """
    Retrieve and store the title from the XML.

    :param activity: ElementTree; contains all data for the activity
    :return: List; contains fields that have changed
    """
    if project.title != activity.find('title').text[:45]:
        project.title = activity.find('title').text[:45]
        project.save(update_fields=['title'])
        return ['title']
    return []
