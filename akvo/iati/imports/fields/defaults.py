# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


def language(activity, project, activities_globals):
    """
    Retrieve and store the language.
    The language will be extracted from the 'lang' attribute of the activity root element.

    :param activity: ElementTree; contains all data for the activity
    :param project: Project instance
    :param activities_globals: Dictionary; contains all global activities information
    :return: List; contains fields that have changed
    """
    xml_ns = 'http://www.w3.org/XML/1998/namespace'
    default_language_value = ''

    if '{%s}lang' % xml_ns in activity.attrib.keys():
        default_language_value = activity.attrib['{%s}lang' % xml_ns].lower()

    if project.language != default_language_value:
        project.language = default_language_value
        project.save(update_fields=['language'])
        return ['language']

    return []


def currency(activity, project, activities_globals):
    """
    Retrieve and store the currency.
    The currency will be extracted from the 'default-currency' attribute of the activity root element.

    :param activity: ElementTree; contains all data for the activity
    :param project: Project instance
    :param activities_globals: Dictionary; contains all global activities information
    :return: List; contains fields that have changed
    """
    default_currency_value = 'EUR'

    if 'default-currency' in activity.attrib.keys():
        default_currency_value = activity.attrib['default-currency']

    if project.currency != default_currency_value:
        project.currency = default_currency_value
        project.save(update_fields=['currency'])
        return ['currency']

    return []


def hierarchy(activity, project, activities_globals):
    """
    Retrieve and store the hierarchy.
    The hierarchy will be extracted from the 'hierarchy' attribute of the activity root element.

    :param activity: ElementTree; contains all data for the activity
    :param project: Project instance
    :param activities_globals: Dictionary; contains all global activities information
    :return: List; contains fields that have changed
    """
    hierarchy_value = None

    if 'hierarchy' in activity.attrib.keys():
        try:
            hierarchy_value = int(activity.attrib['hierarchy'])
        except ValueError:
            pass

    if project.hierarchy != hierarchy_value:
        project.hierarchy = hierarchy_value
        project.save(update_fields=['hierarchy'])
        return ['hierarchy']

    return []


def scope(activity, project, activities_globals):
    """
    Retrieve and store the activity scope.
    The scope will be extracted from the 'code' attribute of the 'activity-scope' element.

    :param activity: ElementTree; contains all data for the activity
    :param project: Project instance
    :param activities_globals: Dictionary; contains all global activities information
    :return: List; contains fields that have changed
    """
    scope_value = ''

    scope_element = activity.find("activity-scope")
    if not scope_element is None and 'code' in scope_element.attrib.keys():
        scope_value = scope_element.attrib['code']

    if project.project_scope != scope_value:
        project.project_scope = scope_value
        project.save(update_fields=['project_scope'])
        return ['project_scope']

    return []


def collaboration_type(activity, project, activities_globals):
    """
    Retrieve and store the collaboration type.
    The collaboration type will be extracted from the 'code' attribute of the
    'collaboration-type' element.

    :param activity: ElementTree; contains all data for the activity
    :param project: Project instance
    :param activities_globals: Dictionary; contains all global activities information
    :return: List; contains fields that have changed
    """
    ct_value = ''

    ct_element = activity.find("collaboration-type")
    if not ct_element is None and 'code' in ct_element.attrib.keys():
        ct_value = ct_element.attrib['code']

    if project.collaboration_type != ct_value:
        project.collaboration_type = ct_value
        project.save(update_fields=['collaboration_type'])
        return ['collaboration_type']

    return []


def default_flow_type(activity, project, activities_globals):
    """
    Retrieve and store the default flow type.
    The flow type will be extracted from the 'code' attribute of the 'default-flow-type' element.

    :param activity: ElementTree; contains all data for the activity
    :param project: Project instance
    :param activities_globals: Dictionary; contains all global activities information
    :return: List; contains fields that have changed
    """
    dft_value = ''

    dft_element = activity.find("default-flow-type")
    if not dft_element is None and 'code' in dft_element.attrib.keys():
        dft_value = dft_element.attrib['code']

    if project.default_flow_type != dft_value:
        project.default_flow_type = dft_value
        project.save(update_fields=['default_flow_type'])
        return ['default_flow_type']

    return []


def default_finance_type(activity, project, activities_globals):
    """
    Retrieve and store the default finance type.
    The finance type will be extracted from the 'code' attribute of the 'default-finance-type'
    element.

    :param activity: ElementTree; contains all data for the activity
    :param project: Project instance
    :param activities_globals: Dictionary; contains all global activities information
    :return: List; contains fields that have changed
    """
    dft_value = ''

    dft_element = activity.find("default-finance-type")
    if not dft_element is None and 'code' in dft_element.attrib.keys():
        dft_value = dft_element.attrib['code']

    if project.default_finance_type != dft_value:
        project.default_finance_type = dft_value
        project.save(update_fields=['default_finance_type'])
        return ['default_finance_type']

    return []


def default_aid_type(activity, project, activities_globals):
    """
    Retrieve and store the default aid type.
    The aid type will be extracted from the 'code' attribute of the 'default-aid-type' element.

    :param activity: ElementTree; contains all data for the activity
    :param project: Project instance
    :param activities_globals: Dictionary; contains all global activities information
    :return: List; contains fields that have changed
    """
    dat_value = ''

    dat_element = activity.find("default-aid-type")
    if not dat_element is None and 'code' in dat_element.attrib.keys():
        dat_value = dat_element.attrib['code']

    if project.default_aid_type != dat_value:
        project.default_aid_type = dat_value
        project.save(update_fields=['default_aid_type'])
        return ['default_aid_type']

    return []


def default_tied_status(activity, project, activities_globals):
    """
    Retrieve and store the default tied status.
    The tied status will be extracted from the 'code' attribute of the 'default-tied-status'
    element.

    :param activity: ElementTree; contains all data for the activity
    :param project: Project instance
    :param activities_globals: Dictionary; contains all global activities information
    :return: List; contains fields that have changed
    """
    dts_value = ''

    dts_element = activity.find("default-tied-status")
    if not dts_element is None and 'code' in dts_element.attrib.keys():
        dts_value = dts_element.attrib['code']

    if project.default_tied_status != dts_value:
        project.default_tied_status = dts_value
        project.save(update_fields=['default_tied_status'])
        return ['default_tied_status']

    return []
