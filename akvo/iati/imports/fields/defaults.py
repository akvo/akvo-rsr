# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.




def default_language(activity, project, activities_globals):
    """
    Retrieve and store the default language from the XML.

    :param activity: ElementTree; contains all data for the activity
    :param project: Project instance
    :param activities_globals: Dictionary; contains all global activities information
    :return: List; contains fields that have changed
    """
    xml_ns = 'http://www.w3.org/XML/1998/namespace'

    if '{%s}lang' % xml_ns in activity.attrib.keys():
        default_language_value = activity.attrib['{%s}lang' % xml_ns].lower()
        if project.language != default_language_value:
            project.language = default_language_value
            project.save(update_fields=['language'])
            return ['language']

    return []
