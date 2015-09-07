# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


def currency(activity, project, activities_globals):
    """
    Retrieve and store the currency.
    The title will be extracted from the 'default-currency' attribute of the activity root element.

    :param activity: ElementTree; contains all data for the activity
    :param project: Project instance
    :param activities_globals: Dictionary; contains all global activities information
    :return: List; contains fields that have changed
    """
    if 'default-currency' in activity.attrib.keys():
        default_currency_value = activity.attrib['default-currency']
        if project.currency != default_currency_value:
            project.currency = default_currency_value
            project.save(update_fields=['currency'])
            return ['currency']
    return []
