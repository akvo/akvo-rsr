# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from ..utils import get_text

from django.conf import settings
from django.db.models import get_model

START_WITH = {
    'subtitle': 'Subtitle: ',
    'project_plan_summary': 'Project Summary: ',
    'background': 'Background: ',
    'current_status': 'Baseline situation: ',
    'project_plan': 'Project Plan: ',
    'sustainability': 'Sustainability: '
}


def title(activity, project, activities_globals):
    """
    Retrieve and store the title.
    The title will be extracted from the 'title' element.

    :param activity: ElementTree; contains all data for the activity
    :param project: Project instance
    :param activities_globals: Dictionary; contains all global activities information
    :return: List; contains fields that have changed
    """
    title_text = ''

    title_element = activity.find('title')
    if title_element is not None:
        title_text = get_text(title_element, activities_globals['version'])[:45]

    if project.title != title_text:
        project.title = title_text
        project.save(update_fields=['title'])
        return ['title']

    return []


def subtitle(activity, project, activities_globals):
    """
    Retrieve and store the subtitle.
    In case the Akvo NS is used, the subtitle will be extracted from a 'description' element
    with akvo type 4. Without an Akvo NS, we use the 'title' element again.

    :param activity: ElementTree; contains all data for the activity
    :param project: Project instance
    :param activities_globals: Dictionary; contains all global activities information
    :return: List; contains fields that have changed
    """
    subtitle_text = ''

    subtitle_element = activity.find("description[@{%s}type='4']" % settings.AKVO_NS)

    if subtitle_element is None:
        all_descriptions = activity.findall("description")
        for description in all_descriptions:
            description_text = get_text(description, activities_globals['version'])
            if description_text.startswith(START_WITH['subtitle']):
                subtitle_text = description_text[10:][:75]
                break

    if not subtitle_text:
        if subtitle_element is None:
            subtitle_element = activity.find("title")

        if not subtitle_element is None:
            subtitle_text = get_text(subtitle_element, activities_globals['version'])[:75]

    if project.subtitle != subtitle_text:
        project.subtitle = subtitle_text
        project.save(update_fields=['subtitle'])
        return ['subtitle']

    return []


def project_plan_summary(activity, project, activities_globals):
    """
    Retrieve and store the project plan summary.
    In case the Akvo NS is used, the project plan summary will be extracted from a 'description'
    element with akvo type 5. Without an Akvo NS, we first check if there's a description starting
    with "Project Summary: ". If not, we use the first description element with no type or type 1.

    :param activity: ElementTree; contains all data for the activity
    :param project: Project instance
    :param activities_globals: Dictionary; contains all global activities information
    :return: List; contains fields that have changed
    """
    pps_text = ''

    pps_element = activity.find("description[@{%s}type='5']" % settings.AKVO_NS)
    if pps_element is None:
        for description in activity.findall("description"):
            description_text = get_text(description, activities_globals['version'])
            if description_text.startswith(START_WITH['project_plan_summary']):
                pps_text = description_text[17:][:400]
                break

    if not pps_text:
        if pps_element is None:
            for description in activity.findall("description"):
                description_text = get_text(description, activities_globals['version'])
                if (not 'type' in description.attrib.keys() or description.attrib['type'] == '1') \
                        and (not '{%s}type' % settings.AKVO_NS in description.attrib.keys()) \
                        and (not description_text.startswith(tuple(START_WITH.values()))):
                    pps_element = description
                    break

        if not pps_element is None:
            pps_text = get_text(pps_element, activities_globals['version'])[:400]

    if project.project_plan_summary != pps_text:
        project.project_plan_summary = pps_text
        project.save(update_fields=['project_plan_summary'])
        return ['project_plan_summary']

    return []


def goals_overview(activity, project, activities_globals):
    """
    Retrieve and store the goals overview.
    In case the Akvo NS is used, the goals overview will be extracted from a 'description' element
    with akvo type 8. Without an Akvo NS, we use the first 'description' element with type 2. If
    these do not exist, but the activity does have results with a title, we use those.

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
        go_text = get_text(go_element, activities_globals['version'])[:600]

    if not go_text:
        for result_title in activity.findall('result/title'):
            go_text += '- ' + get_text(result_title, activities_globals['version']) + '\n'

    if project.goals_overview != go_text:
        project.goals_overview = go_text
        project.save(update_fields=['goals_overview'])
        return ['goals_overview']

    return []


def background(activity, project, activities_globals):
    """
    Retrieve and store the background.
    In case the Akvo NS is used, the background will be extracted from a 'description' element
    with akvo type 6. Without an Akvo NS, we use the second 'description' element with no type
    or type 1.

    :param activity: ElementTree; contains all data for the activity
    :param project: Project instance
    :param activities_globals: Dictionary; contains all global activities information
    :return: List; contains fields that have changed
    """
    background_text = ''

    background_element = activity.find("description[@{%s}type='6']" % settings.AKVO_NS)
    if background_element is None:
        description_count = 0
        for description in activity.findall("description"):
            description_text = get_text(description, activities_globals['version'])
            if (not 'type' in description.attrib.keys() or description.attrib['type'] == '1') \
                    and (not '{%s}type' % settings.AKVO_NS in description.attrib.keys()) \
                    and (not description_text.startswith(tuple(START_WITH.values()))):
                description_count += 1
            if description_count == 2:
                background_element = description
                break

    if not background_element is None:
        background_text = get_text(background_element, activities_globals['version'])[:1000]

    if project.background != background_text:
        project.background = background_text
        project.save(update_fields=['background'])
        return ['background']

    return []


def current_status(activity, project, activities_globals):
    """
    Retrieve and store the current status (or baseline status).
    In case the Akvo NS is used, the current status will be extracted from a 'description' element
    with akvo type 9. Without an Akvo NS, we use the third 'description' element with no type or
    type 1.

    :param activity: ElementTree; contains all data for the activity
    :param project: Project instance
    :param activities_globals: Dictionary; contains all global activities information
    :return: List; contains fields that have changed
    """
    current_status_text = ''

    current_status_element = activity.find("description[@{%s}type='9']" % settings.AKVO_NS)
    if current_status_element is None:
        description_count = 0
        for description in activity.findall("description"):
            description_text = get_text(description, activities_globals['version'])
            if (not 'type' in description.attrib.keys() or description.attrib['type'] == '1') \
                    and (not '{%s}type' % settings.AKVO_NS in description.attrib.keys()) \
                    and (not description_text.startswith(tuple(START_WITH.values()))):
                description_count += 1
            if description_count == 3:
                current_status_element = description
                break

    if not current_status_element is None:
        current_status_text = get_text(current_status_element, activities_globals['version'])[:600]

    if project.current_status != current_status_text:
        project.current_status = current_status_text
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
        target_group_text = get_text(target_group_element, activities_globals['version'])[:600]

    if project.target_group != target_group_text:
        project.target_group = target_group_text
        project.save(update_fields=['target_group'])
        return ['target_group']

    return []


def project_plan(activity, project, activities_globals):
    """
    Retrieve and store the project plan.
    In case the Akvo NS is used, the project plan will be extracted from a 'description' element
    with akvo type 7. Without an Akvo NS, we use the fourth 'description' element with no type or
    type 1.

    :param activity: ElementTree; contains all data for the activity
    :param project: Project instance
    :param activities_globals: Dictionary; contains all global activities information
    :return: List; contains fields that have changed
    """
    project_plan_text = ''

    project_plan_element = activity.find("description[@{%s}type='7']" % settings.AKVO_NS)
    if project_plan_element is None:
        description_count = 0
        for description in activity.findall("description"):
            description_text = get_text(description, activities_globals['version'])
            if (not 'type' in description.attrib.keys() or description.attrib['type'] == '1') \
                    and (not '{%s}type' % settings.AKVO_NS in description.attrib.keys()) \
                    and (not description_text.startswith(tuple(START_WITH.values()))):
                description_count += 1
            if description_count == 4:
                project_plan_element = description
                break

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
    with akvo type 10. Without an Akvo NS, we use the fifth 'description' element with no type or
    type 1.

    :param activity: ElementTree; contains all data for the activity
    :param project: Project instance
    :param activities_globals: Dictionary; contains all global activities information
    :return: List; contains fields that have changed
    """
    sustainability_text = ''

    sustainability_element = activity.find("description[@{%s}type='10']" % settings.AKVO_NS)
    if sustainability_element is None:
        description_count = 0
        for description in activity.findall("description"):
            description_text = get_text(description, activities_globals['version'])
            if (not 'type' in description.attrib.keys() or description.attrib['type'] == '1') \
                    and (not '{%s}type' % settings.AKVO_NS in description.attrib.keys()) \
                    and (not description_text.startswith(tuple(START_WITH.values()))):
                description_count += 1
            if description_count == 5:
                sustainability_element = description
                break

    if not sustainability_element is None:
        sustainability_text = get_text(sustainability_element, activities_globals['version'])

    if project.sustainability != sustainability_text:
        project.sustainability = sustainability_text
        project.save(update_fields=['sustainability'])
        return ['sustainability']

    return []


def custom_fields(activity, project, activities_globals):
    """
    Retrieve and store a custom field.
    The custom fields will be extracted from a 'description' element with akvo type 99.

    :param activity: ElementTree; contains all data for the activity
    :param project: Project instance
    :param activities_globals: Dictionary; contains all global activities information
    :return: List; contains fields that have changed
    """
    imported_fields = []
    changes = []

    for custom_field in activity.findall("description[@{%s}type='99']" % settings.AKVO_NS):
        custom_text = get_text(custom_field, activities_globals['version'])
        custom_label = 'Custom field'
        section = 1
        max_characters = 0
        help_text = ''
        mandatory = False
        order = 0

        if '{%s}label' % settings.AKVO_NS in custom_field.attrib.keys():
            custom_label = custom_field.attrib['{%s}label' % settings.AKVO_NS]

        if '{%s}section' % settings.AKVO_NS in custom_field.attrib.keys():
            try:
                section = int(custom_field.attrib['{%s}section' % settings.AKVO_NS])
                if not section < 11:
                    section = 1
            except ValueError:
                pass

        if '{%s}max-characters' % settings.AKVO_NS in custom_field.attrib.keys():
            try:
                max_characters = int(custom_field.attrib['{%s}max-characters' % settings.AKVO_NS])
            except ValueError:
                pass

        if '{%s}help-text' % settings.AKVO_NS in custom_field.attrib.keys():
            help_text = custom_field.attrib['{%s}help-text' % settings.AKVO_NS]

        if '{%s}mandatory' % settings.AKVO_NS in custom_field.attrib.keys():
            mandatory_text = custom_field.attrib['{%s}mandatory' % settings.AKVO_NS]
            if mandatory_text and mandatory_text.lower() == 'true':
                mandatory = True

        if '{%s}order' % settings.AKVO_NS in custom_field.attrib.keys():
            try:
                order = int(custom_field.attrib['{%s}order' % settings.AKVO_NS])
            except ValueError:
                pass

        cf, created = get_model('rsr', 'projectcustomfield').objects.get_or_create(
            project=project,
            name=custom_label,
            section=section,
            max_characters=max_characters,
            help_text=help_text,
            value=custom_text,
            mandatory=mandatory,
            order=order,
            type='text'
        )

        if created:
            changes.append(u'added custom field (id: %s): %s' % (str(cf.pk), cf))

        imported_fields.append(cf)

    for custom_field in project.custom_fields.all():
        if not custom_field in imported_fields:
            changes.append(u'deleted custom field (id: %s): %s' %
                           (str(custom_field.pk),
                            custom_field.__unicode__()))
            custom_field.delete()

    return changes
