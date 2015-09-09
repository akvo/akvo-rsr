# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from ..utils import get_text

from django.conf import settings


def project_plan_summary(activity, project, activities_globals):
    """
    Retrieve and store the project plan summary.
    In case the Akvo NS is used, the project plan summary will be extracted from a 'description'
    element with akvo type 5. Without an Akvo NS, we use the second 'description' element of type 1.

    :param activity: ElementTree; contains all data for the activity
    :param project: Project instance
    :param activities_globals: Dictionary; contains all global activities information
    :return: List; contains fields that have changed
    """
    pps_text = ''

    pps_element = activity.find("description[@{%s}type='5']" % settings.AKVO_NS)
    if pps_element is None:
        descriptions_type_1 = activity.findall("description[@type='1']")
        if len(descriptions_type_1) > 1:
            pps_element = descriptions_type_1[1]

    if not pps_element is None:
        pps_text = get_text(pps_element, activities_globals['version'])

    if project.project_plan_summary != pps_text[:400]:
        project.project_plan_summary = pps_text[:400]
        project.save(update_fields=['project_plan_summary'])
        return ['project_plan_summary']

    return []


def goals_overview(activity, project, activities_globals):
    """
    Retrieve and store the goals overview.
    In case the Akvo NS is used, the goals overview will be extracted from a 'description' element
    with akvo type 8. Without an Akvo NS, we use the first 'description' element with type 2.

    :param activity: ElementTree; contains all data for the activity
    :param project: Project instance
    :param activities_globals: Dictionary; contains all global activities information
    :return: List; contains fields that have changed
    """
    go_text = ''

    go_element = activity.find("description[@{%s}type='8']" % settings.AKVO_NS)
    if go_element is None:
        go_element = activity.find("description[@type='2']")

    if not go_element is None:
        go_text = get_text(go_element, activities_globals['version'])

    if project.goals_overview != go_text[:600]:
        project.goals_overview = go_text[:600]
        project.save(update_fields=['goals_overview'])
        return ['goals_overview']

    return []


def background(activity, project, activities_globals):
    """
    Retrieve and store the background.
    In case the Akvo NS is used, the background will be extracted from a 'description' element
    with akvo type 6. Without an Akvo NS, we use the third 'description' element with type 1.

    :param activity: ElementTree; contains all data for the activity
    :param project: Project instance
    :param activities_globals: Dictionary; contains all global activities information
    :return: List; contains fields that have changed
    """
    background_text = ''

    background_element = activity.find("description[@{%s}type='6']" % settings.AKVO_NS)
    if background_element is None:
        descriptions_type_1 = activity.findall("description[@type='1']")
        if len(descriptions_type_1) > 2:
            background_element = descriptions_type_1[2]

    if not background_element is None:
        background_text = get_text(background_element, activities_globals['version'])

    if project.background != background_text[:1000]:
        project.background = background_text[:1000]
        project.save(update_fields=['background'])
        return ['background']

    return []


def current_status(activity, project, activities_globals):
    """
    Retrieve and store the current status (or baseline status).
    In case the Akvo NS is used, the current status will be extracted from a 'description' element
    with akvo type 9. Without an Akvo NS, we use the fourth 'description' element with type 1.

    :param activity: ElementTree; contains all data for the activity
    :param project: Project instance
    :param activities_globals: Dictionary; contains all global activities information
    :return: List; contains fields that have changed
    """
    current_status_text = ''

    current_status_element = activity.find("description[@{%s}type='9']" % settings.AKVO_NS)
    if current_status_element is None:
        descriptions_type_1 = activity.findall("description[@type='1']")
        if len(descriptions_type_1) > 3:
            current_status_element = descriptions_type_1[3]

    if not current_status_element is None:
        current_status_text = get_text(current_status_element, activities_globals['version'])

    if project.current_status != current_status_text[:600]:
        project.current_status = current_status_text[:600]
        project.save(update_fields=['current_status'])
        return ['current_status']

    return []


def target_group(activity, project, activities_globals):
    """
    Retrieve and store the target group.
    In case the Akvo NS is used, the target group will be extracted from a 'description' element
    with akvo type 3. Without an Akvo NS, we use the first 'description' element with type 3.

    :param activity: ElementTree; contains all data for the activity
    :param project: Project instance
    :param activities_globals: Dictionary; contains all global activities information
    :return: List; contains fields that have changed
    """
    target_group_text = ''

    target_group_element = activity.find("description[@{%s}type='3']" % settings.AKVO_NS)
    if target_group_element is None:
        target_group_element = activity.find("description[@type='3']")

    if not target_group_element is None:
        target_group_text = get_text(target_group_element, activities_globals['version'])

    if project.target_group != target_group_text[:600]:
        project.target_group = target_group_text[:600]
        project.save(update_fields=['target_group'])
        return ['target_group']

    return []


def project_plan(activity, project, activities_globals):
    """
    Retrieve and store the project plan.
    In case the Akvo NS is used, the project plan will be extracted from a 'description' element
    with akvo type 7. Without an Akvo NS, we use the fifth 'description' element with type 1.

    :param activity: ElementTree; contains all data for the activity
    :param project: Project instance
    :param activities_globals: Dictionary; contains all global activities information
    :return: List; contains fields that have changed
    """
    project_plan_text = ''

    project_plan_element = activity.find("description[@{%s}type='7']" % settings.AKVO_NS)
    if project_plan_element is None:
        descriptions_type_1 = activity.findall("description[@type='1']")
        if len(descriptions_type_1) > 4:
            project_plan_element = descriptions_type_1[4]

    if not project_plan_element is None:
        project_plan_text = get_text(project_plan_element, activities_globals['version'])

    if project.project_plan != project_plan_text:
        project.project_plan = project_plan_text
        project.save(update_fields=['project_plan'])
        return ['project_plan']

    return []


def sustainability(activity, project, activities_globals):
    """
    Retrieve and store sustainability.
    In case the Akvo NS is used, sustainability will be extracted from a 'description' element
    with akvo type 10. Without an Akvo NS, we use the sixth 'description' element with type 1.

    :param activity: ElementTree; contains all data for the activity
    :param project: Project instance
    :param activities_globals: Dictionary; contains all global activities information
    :return: List; contains fields that have changed
    """
    sustainability_text = ''

    sustainability_element = activity.find("description[@{%s}type='10']" % settings.AKVO_NS)
    if sustainability_element is None:
        descriptions_type_1 = activity.findall("description[@type='1']")
        if len(descriptions_type_1) > 5:
            sustainability_element = descriptions_type_1[5]

    if not sustainability_element is None:
        sustainability_text = get_text(sustainability_element, activities_globals['version'])

    if project.sustainability != sustainability_text:
        project.sustainability = sustainability_text
        project.save(update_fields=['sustainability'])
        return ['sustainability']

    return []
