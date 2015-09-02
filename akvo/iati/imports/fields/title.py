# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


def title(activity, project, activities_globals):
    """
    Retrieve and store the title from the XML.

    :param activity: ElementTree; contains all data for the activity
    :return: List; contains fields that have changed
    """
    title_text = None

    if activities_globals['version'][0] == '1':
        title_element = activity.find('title')
        if title_element is not None:
            title_text = title_element.text[:45]
    else:
        title_element = activity.find('title')
        if title_element is not None:
            narrative_element = title_element.find('narrative')
            if narrative_element is not None:
                title_text = narrative_element.text[:45]

    if title_text is not None and project.title != title_text:
        project.title = title_text
        project.save(update_fields=['title'])
        return ['title']

    return []
