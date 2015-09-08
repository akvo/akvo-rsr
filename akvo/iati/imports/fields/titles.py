# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from ..utils import get_text

from django.conf import settings


def title(activity, project, activities_globals):
    """
    Retrieve and store the title.
    The title will be extracted from the 'title' element.

    :param activity: ElementTree; contains all data for the activity
    :param project: Project instance
    :param activities_globals: Dictionary; contains all global activities information
    :return: List; contains fields that have changed
    """
    title_text = None
    title_element = activity.find('title')

    if title_element is not None:
        title_text = get_text(title_element, activities_globals['version'])

    if title_text is not None and project.title != title_text[:45]:
        project.title = title_text[:45]
        project.save(update_fields=['title'])
        return ['title']

    return []


def subtitle(activity, project, activities_globals):
    """
    Retrieve and store the subtitle.
    In case the Akvo NS is used, the subtitle will be extracted from a 'description' element
    with akvo type 4. Without an Akvo NS, we use the first 'description' element of type 1.

    :param activity: ElementTree; contains all data for the activity
    :param project: Project instance
    :param activities_globals: Dictionary; contains all global activities information
    :return: List; contains fields that have changed
    """
    subtitle_text = None
    subtitle_element = activity.find("description[@{%s}type='4']" % settings.AKVO_NS)

    if subtitle_element is None:
        subtitle_element = activity.find("description[@type='1']")

    if not subtitle_element is None:
        subtitle_text = get_text(subtitle_element, activities_globals['version'])

    if subtitle_text is not None and project.subtitle != subtitle_text[:75]:
        project.subtitle = subtitle_text[:75]
        project.save(update_fields=['subtitle'])
        return ['subtitle']

    return []
