# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import collections

from ....rsr.models.custom_field import ProjectCustomField
# from ....rsr.models.iati_import_log import IatiImportLog
from ....rsr.models.project import Project

from ..utils import add_log, get_text, ImporterHelper

from django.conf import settings
from django.db.models import ObjectDoesNotExist

DescriptionStart = collections.namedtuple(
        'DescriptionStart',
        ['project_name', 'subtitle', 'project_plan_summary', 'background', 'current_status',
         'project_plan', 'sustainability'])

description_start = DescriptionStart(
    project_name='Project name: ',
    subtitle='Subtitle: ',
    project_plan_summary='Project summary: ',
    background='Background: ',
    current_status='Baseline situation: ',
    project_plan='Project plan: ',
    sustainability='Sustainability: '
)


def _add_custom_field(project, name, text, section):
    """
    In case the text of a field is too long, we store the full text in a custom field. Or update
    the field if the field already exists.

    :param project: Project instance
    :param name: String; field name
    :param text: String; field text
    :param section: Integer; field section
    """
    if project and name and section:
        custom_field, _created = ProjectCustomField.objects.get_or_create(
            project=project,
            name=name,
            section=section,
            max_characters=0,
            help_text='',
            mandatory=False,
            order=0
        )

        if custom_field.value != text:
            custom_field.value = text
            custom_field.save(update_fields=['value'])


def _delete_custom_field(project, name, section):
    """
    In case the text of a field is not too long, the custom field should be deleted if it exists.

    :param project: Project instance
    :param name: String; field name
    :param section: Integer; field section
    """
    if project and name and section:
        try:
            custom_field = ProjectCustomField.objects.get(
                project=project,
                name=name,
                section=section
            )
            custom_field.delete()
        except ObjectDoesNotExist:
            pass

# TODO: fix this; there should exist one place where the sections are defined
SECTION_ONE = 1
SECTION_FOUR = 4

class Descriptions(ImporterHelper):

    def __init__(self, iati_import, parent_elem, project, globals, related_obj=None):
        super(Descriptions, self).__init__(iati_import, parent_elem, project, globals)
        self.model = Project

    def find_description(self, order):
        count = 0
        for description in self.parent_elem.findall("description"):
            description_text = self.get_text(description)
            if (not 'type' in description.attrib.keys() or description.attrib['type'] == '1') \
                    and (not '{%s}type' % settings.AKVO_NS in description.attrib.keys()) \
                    and (not description_text.startswith(description_start)):
                count += 1
                if count == order:
                    return description
        return None

    def do_import(self):
        # title
        element = self.parent_elem.find('title')
        title_text = self.get_text(element)
        title = self.check_text_length_and_set_custom_field(
                element, title_text, 'title', 'title', SECTION_ONE)

        # subtitle
        subtitle = ''
        element = self.parent_elem.find("description[@{%s}type='4']" % settings.AKVO_NS)
        if element is None:
            for element in self.parent_elem.findall("description"):
                description_text = self.get_text(element)
                if description_text.startswith(description_start.subtitle):
                    subtitle = description_text[len(description_start.subtitle):]
                    break
                elif description_text.startswith(description_start.project_name):
                    subtitle = description_text[len(description_start.project_name):]
                    break
        if not subtitle:
            subtitle = title_text

        subtitle = self.check_text_length_and_set_custom_field(
                element, subtitle, 'subtitle', 'subtitle', 1)

        # project plan summary
        project_plan_summary = ''
        element = self.parent_elem.find("description[@{%s}type='5']" % settings.AKVO_NS)
        if element is None:
            for element in self.parent_elem.findall("description"):
                description_text = self.get_text(element)
                if description_text.startswith(description_start.project_plan_summary):
                    project_plan_summary = description_text[
                                           len(description_start.project_plan_summary):]
                    break
        if not project_plan_summary:
            element = self.find_description(1)
            if element is not None:
                project_plan_summary = self.get_text(element)

        project_plan_summary = self.check_text_length_and_set_custom_field(
                element, project_plan_summary, 'project_plan_summary', 'project_plan_summary',
                SECTION_FOUR)

        # goals overview
        goals_overview = self.get_child_element_text(
                self.parent_elem, "description[@{%s}type='8']" % settings.AKVO_NS, 'goals_overview')
        if not goals_overview:
            goals_overview = self.get_child_element_text(
                    self.parent_elem, "description[@type='2']", 'goals_overview')
        if not goals_overview:
            goals_overview = '\n'.join(
                    ["- {}".format(
                        self.get_text(title)
                    ) for title in self.parent_elem.findall('result/title')]
            )
        if goals_overview:
            goals_overview = self.check_text_length_and_set_custom_field(
                    'description', goals_overview, 'goals_overview', 'goals_overview', SECTION_FOUR)

        # background
        background = self.get_child_element_text(
            self.parent_elem, "description[@{%s}type='6']" % settings.AKVO_NS, 'background')
        if not background:
            element = self.find_description(2)
        if element is not None:
            background = self.get_text(element)
            background = self.check_text_length_and_set_custom_field(
                    element, background, 'background', 'background', SECTION_FOUR)

        # current status
        current_status = self.get_child_element_text(
            self.parent_elem, "description[@{%s}type='9']" % settings.AKVO_NS, 'current_status')
        if not current_status:
            element = self.find_description(3)
        if element is not None:
            current_status = self.get_text(element)
            current_status = self.check_text_length_and_set_custom_field(
                'description', current_status, 'current_status', 'current_status', SECTION_FOUR)

        # target group
        target_group, element = self.get_child_element_text(
                self.parent_elem, "description[@{%s}type='3']" % settings.AKVO_NS, 'target_group',
                return_element=True)
        if not target_group:
            target_group, element = self.get_child_element_text(
                    self.parent_elem, "description[@type='3']", 'target_group', return_element=True)
        if target_group:
            target_group = self.check_text_length_and_set_custom_field(
                element, target_group, 'target_group', 'target_group', SECTION_FOUR)

        # project plan
        project_plan = self.get_child_element_text(
            self.parent_elem, "description[@{%s}type='7']" % settings.AKVO_NS, 'project_plan')
        if not project_plan:
            element = self.find_description(4)
        if element is not None:
            project_plan = self.get_text(element)

        # sustainability
        sustainability = self.get_child_element_text(
            self.parent_elem, "description[@{%s}type='10']" % settings.AKVO_NS, 'sustainability')
        if not sustainability:
            element = self.find_description(5)
        if element is not None:
            sustainability = self.get_text(element)

        project_fields = ['title', 'subtitle', 'project_plan_summary', 'goals_overview',
                'background', 'current_status', 'target_group', 'project_plan', 'sustainability',]
        project = self.project
        changes = []

        for field in project_fields:
            if getattr(project, field) != locals()[field]:
                setattr(project, field, locals()[field])
                changes.append(field)
        project.save(update_fields=changes)
        return changes


# def title(iati_import, activity, project, activities_globals):
#     """
#     Retrieve and store the title.
#     The title will be extracted from the 'title' element.
#
#     :param iati_import: IatiImport instance
#     :param activity: ElementTree; contains all data for the activity
#     :param project: Project instance
#     :param activities_globals: Dictionary; contains all global activities information
#     :return: List; contains fields that have changed
#     """
#     title_text = ''
#
#     title_element = activity.find('title')
#     if title_element is not None:
#         title_text = get_text(title_element, activities_globals['version'])
#         if len(title_text) > 45:
#             add_log(iati_import, 'title', 'title is too long (45 characters allowed)', project,
#                     IatiImportLog.VALUE_PARTLY_SAVED)
#             _add_custom_field(project, 'title', title_text, 1)
#             title_text = title_text[:45]
#         else:
#             _delete_custom_field(project, 'title', 1)
#
#     if project.title != title_text:
#         project.title = title_text
#         project.save(update_fields=['title'])
#         return ['title']
#
#     return []
#
#
# def subtitle(iati_import, activity, project, activities_globals):
#     """
#     Retrieve and store the subtitle.
#     In case the Akvo NS is used, the subtitle will be extracted from a 'description' element
#     with akvo type 4. Without an Akvo NS, we use the 'title' element again.
#
#     :param iati_import: IatiImport instance
#     :param activity: ElementTree; contains all data for the activity
#     :param project: Project instance
#     :param activities_globals: Dictionary; contains all global activities information
#     :return: List; contains fields that have changed
#     """
#     subtitle_text = ''
#
#     subtitle_element = activity.find("description[@{%s}type='4']" % settings.AKVO_NS)
#
#     if subtitle_element is None:
#         all_descriptions = activity.findall("description")
#         for description in all_descriptions:
#             description_text = get_text(description, activities_globals['version'])
#             if description_text.startswith(START_WITH['subtitle']):
#                 subtitle_text = description_text[10:]
#                 break
#             elif description_text.startswith(START_WITH['project_name']):
#                 subtitle_text = description_text[14:]
#                 break
#
#     if not subtitle_text:
#         if subtitle_element is None:
#             subtitle_element = activity.find("title")
#
#         if not subtitle_element is None:
#             subtitle_text = get_text(subtitle_element, activities_globals['version'])
#
#     if len(subtitle_text) > 75:
#         add_log(iati_import, 'subtitle', 'subtitle is too long (75 characters allowed)', project,
#                 IatiImportLog.VALUE_PARTLY_SAVED)
#         _add_custom_field(project, 'subtitle', subtitle_text, 1)
#         subtitle_text = subtitle_text[:75]
#     else:
#         _delete_custom_field(project, 'subtitle', 1)
#
#     if project.subtitle != subtitle_text:
#         project.subtitle = subtitle_text
#         project.save(update_fields=['subtitle'])
#         return ['subtitle']
#
#     return []
#
#
# def project_plan_summary(iati_import, activity, project, activities_globals):
#     """
#     Retrieve and store the project plan summary.
#     In case the Akvo NS is used, the project plan summary will be extracted from a 'description'
#     element with akvo type 5. Without an Akvo NS, we first check if there's a description starting
#     with "Project Summary: ". If not, we use the first description element with no type or type 1.
#
#     :param iati_import: IatiImport instance
#     :param activity: ElementTree; contains all data for the activity
#     :param project: Project instance
#     :param activities_globals: Dictionary; contains all global activities information
#     :return: List; contains fields that have changed
#     """
#     pps_text = ''
#
#     pps_element = activity.find("description[@{%s}type='5']" % settings.AKVO_NS)
#     if pps_element is None:
#         for description in activity.findall("description"):
#             description_text = get_text(description, activities_globals['version'])
#             if description_text.startswith(START_WITH['project_plan_summary']):
#                 pps_text = description_text[17:]
#                 break
#
#     if not pps_text:
#         if pps_element is None:
#             for description in activity.findall("description"):
#                 description_text = get_text(description, activities_globals['version'])
#                 if (not 'type' in description.attrib.keys() or description.attrib['type'] == '1') \
#                         and (not '{%s}type' % settings.AKVO_NS in description.attrib.keys()) \
#                         and (not description_text.startswith(tuple(START_WITH.values()))):
#                     pps_element = description
#                     break
#
#         if not pps_element is None:
#             pps_text = get_text(pps_element, activities_globals['version'])
#
#     if len(pps_text) > 400:
#         add_log(iati_import, 'project_plan_summary', 'summary is too long (400 characters allowed)',
#                 project, IatiImportLog.VALUE_PARTLY_SAVED)
#         _add_custom_field(project, 'project_plan_summary', pps_text, 4)
#         pps_text = pps_text[:400]
#     else:
#         _delete_custom_field(project, 'project_plan_summary', 4)
#
#     if project.project_plan_summary != pps_text:
#         project.project_plan_summary = pps_text
#         project.save(update_fields=['project_plan_summary'])
#         return ['project_plan_summary']
#
#     return []
#
#
# def goals_overview(iati_import, activity, project, activities_globals):
#     """
#     Retrieve and store the goals overview.
#     In case the Akvo NS is used, the goals overview will be extracted from a 'description' element
#     with akvo type 8. Without an Akvo NS, we use the first 'description' element with type 2. If
#     these do not exist, but the activity does have results with a title, we use those.
#
#     :param iati_import: IatiImport instance
#     :param activity: ElementTree; contains all data for the activity
#     :param project: Project instance
#     :param activities_globals: Dictionary; contains all global activities information
#     :return: List; contains fields that have changed
#     """
#     go_text = ''
#
#     go_element = activity.find("description[@{%s}type='8']" % settings.AKVO_NS)
#     if go_element is None:
#         go_element = activity.find("description[@type='2']")
#
#     if not go_element is None:
#         go_text = get_text(go_element, activities_globals['version'])
#
#     if not go_text:
#         for result_title in activity.findall('result/title'):
#             go_text += '- ' + get_text(result_title, activities_globals['version']) + '\n'
#
#     if len(go_text) > 600:
#         add_log(iati_import, 'goals_overview',
#                 'goals overview is too long (600 characters allowed)', project,
#                 IatiImportLog.VALUE_PARTLY_SAVED)
#         _add_custom_field(project, 'goals_overview', go_text, 4)
#         go_text = go_text[:600]
#     else:
#         _delete_custom_field(project, 'goals_overview', 4)
#
#     if project.goals_overview != go_text:
#         project.goals_overview = go_text
#         project.save(update_fields=['goals_overview'])
#         return ['goals_overview']
#
#     return []
#
#
# def background(iati_import, activity, project, activities_globals):
#     """
#     Retrieve and store the background.
#     In case the Akvo NS is used, the background will be extracted from a 'description' element
#     with akvo type 6. Without an Akvo NS, we use the second 'description' element with no type
#     or type 1.
#
#     :param iati_import: IatiImport instance
#     :param activity: ElementTree; contains all data for the activity
#     :param project: Project instance
#     :param activities_globals: Dictionary; contains all global activities information
#     :return: List; contains fields that have changed
#     """
#     background_text = ''
#
#     background_element = activity.find("description[@{%s}type='6']" % settings.AKVO_NS)
#     if background_element is None:
#         description_count = 0
#         for description in activity.findall("description"):
#             description_text = get_text(description, activities_globals['version'])
#             if (not 'type' in description.attrib.keys() or description.attrib['type'] == '1') \
#                     and (not '{%s}type' % settings.AKVO_NS in description.attrib.keys()) \
#                     and (not description_text.startswith(tuple(START_WITH.values()))):
#                 description_count += 1
#             if description_count == 2:
#                 background_element = description
#                 break
#
#     if not background_element is None:
#         background_text = get_text(background_element, activities_globals['version'])
#         if len(background_text) > 1000:
#             add_log(iati_import, 'background',
#                     'background is too long (1000 characters allowed)', project,
#                     IatiImportLog.VALUE_PARTLY_SAVED)
#             _add_custom_field(project, 'background', background_text, 4)
#             background_text = background_text[:1000]
#         else:
#             _delete_custom_field(project, 'background', 4)
#
#     if project.background != background_text:
#         project.background = background_text
#         project.save(update_fields=['background'])
#         return ['background']
#
#     return []
#
#
# def current_status(iati_import, activity, project, activities_globals):
#     """
#     Retrieve and store the current status (or baseline status).
#     In case the Akvo NS is used, the current status will be extracted from a 'description' element
#     with akvo type 9. Without an Akvo NS, we use the third 'description' element with no type or
#     type 1.
#
#     :param iati_import: IatiImport instance
#     :param activity: ElementTree; contains all data for the activity
#     :param project: Project instance
#     :param activities_globals: Dictionary; contains all global activities information
#     :return: List; contains fields that have changed
#     """
#     current_status_text = ''
#
#     current_status_element = activity.find("description[@{%s}type='9']" % settings.AKVO_NS)
#     if current_status_element is None:
#         description_count = 0
#         for description in activity.findall("description"):
#             description_text = get_text(description, activities_globals['version'])
#             if (not 'type' in description.attrib.keys() or description.attrib['type'] == '1') \
#                     and (not '{%s}type' % settings.AKVO_NS in description.attrib.keys()) \
#                     and (not description_text.startswith(tuple(START_WITH.values()))):
#                 description_count += 1
#             if description_count == 3:
#                 current_status_element = description
#                 break
#
#     if not current_status_element is None:
#         current_status_text = get_text(current_status_element, activities_globals['version'])
#         if len(current_status_text) > 600:
#             add_log(iati_import, 'current_status',
#                     'current status is too long (600 characters allowed)', project,
#                     IatiImportLog.VALUE_PARTLY_SAVED)
#             _add_custom_field(project, 'current_status', current_status_text, 4)
#             current_status_text = current_status_text[:600]
#         else:
#             _delete_custom_field(project, 'current_status', 4)
#
#     if project.current_status != current_status_text:
#         project.current_status = current_status_text
#         project.save(update_fields=['current_status'])
#         return ['current_status']
#
#     return []
#
#
# def target_group(iati_import, activity, project, activities_globals):
#     """
#     Retrieve and store the target group.
#     In case the Akvo NS is used, the target group will be extracted from a 'description' element
#     with akvo type 3. Without an Akvo NS, we use the first 'description' element with type 3.
#
#     :param iati_import: IatiImport instance
#     :param activity: ElementTree; contains all data for the activity
#     :param project: Project instance
#     :param activities_globals: Dictionary; contains all global activities information
#     :return: List; contains fields that have changed
#     """
#     target_group_text = ''
#
#     target_group_element = activity.find("description[@{%s}type='3']" % settings.AKVO_NS)
#     if target_group_element is None:
#         target_group_element = activity.find("description[@type='3']")
#
#     if not target_group_element is None:
#         target_group_text = get_text(target_group_element, activities_globals['version'])
#         if len(target_group_text) > 600:
#             add_log(iati_import, 'target_group',
#                     'target group is too long (600 characters allowed)', project,
#                     IatiImportLog.VALUE_PARTLY_SAVED)
#             _add_custom_field(project, 'target_group', target_group_text, 4)
#             target_group_text = target_group_text[:600]
#         else:
#             _delete_custom_field(project, 'target_group', 4)
#
#     if project.target_group != target_group_text:
#         project.target_group = target_group_text
#         project.save(update_fields=['target_group'])
#         return ['target_group']
#
#     return []
#
#
# def project_plan(iati_import, activity, project, activities_globals):
#     """
#     Retrieve and store the project plan.
#     In case the Akvo NS is used, the project plan will be extracted from a 'description' element
#     with akvo type 7. Without an Akvo NS, we use the fourth 'description' element with no type or
#     type 1.
#
#     :param iati_import: IatiImport instance
#     :param activity: ElementTree; contains all data for the activity
#     :param project: Project instance
#     :param activities_globals: Dictionary; contains all global activities information
#     :return: List; contains fields that have changed
#     """
#     project_plan_text = ''
#
#     project_plan_element = activity.find("description[@{%s}type='7']" % settings.AKVO_NS)
#     if project_plan_element is None:
#         description_count = 0
#         for description in activity.findall("description"):
#             description_text = get_text(description, activities_globals['version'])
#             if (not 'type' in description.attrib.keys() or description.attrib['type'] == '1') \
#                     and (not '{%s}type' % settings.AKVO_NS in description.attrib.keys()) \
#                     and (not description_text.startswith(tuple(START_WITH.values()))):
#                 description_count += 1
#             if description_count == 4:
#                 project_plan_element = description
#                 break
#
#     if not project_plan_element is None:
#         project_plan_text = get_text(project_plan_element, activities_globals['version'])
#
#     if project.project_plan != project_plan_text:
#         project.project_plan = project_plan_text
#         project.save(update_fields=['project_plan'])
#         return ['project_plan']
#
#     return []
#
#
# def sustainability(iati_import, activity, project, activities_globals):
#     """
#     Retrieve and store sustainability.
#     In case the Akvo NS is used, sustainability will be extracted from a 'description' element
#     with akvo type 10. Without an Akvo NS, we use the fifth 'description' element with no type or
#     type 1.
#
#     :param iati_import: IatiImport instance
#     :param activity: ElementTree; contains all data for the activity
#     :param project: Project instance
#     :param activities_globals: Dictionary; contains all global activities information
#     :return: List; contains fields that have changed
#     """
#     sustainability_text = ''
#
#     sustainability_element = activity.find("description[@{%s}type='10']" % settings.AKVO_NS)
#     if sustainability_element is None:
#         description_count = 0
#         for description in activity.findall("description"):
#             description_text = get_text(description, activities_globals['version'])
#             if (not 'type' in description.attrib.keys() or description.attrib['type'] == '1') \
#                     and (not '{%s}type' % settings.AKVO_NS in description.attrib.keys()) \
#                     and (not description_text.startswith(tuple(START_WITH.values()))):
#                 description_count += 1
#             if description_count == 5:
#                 sustainability_element = description
#                 break
#
#     if not sustainability_element is None:
#         sustainability_text = get_text(sustainability_element, activities_globals['version'])
#
#     if project.sustainability != sustainability_text:
#         project.sustainability = sustainability_text
#         project.save(update_fields=['sustainability'])
#         return ['sustainability']
#
#     return []


class CustomFields(ImporterHelper):

    def __init__(self, iati_import, parent_elem, project, globals, related_obj=None):
        super(CustomFields, self).__init__(iati_import, parent_elem, project, globals, related_obj)
        self.model = ProjectCustomField

    def do_import(self):
        """
        Retrieve and store a custom field.
        The custom fields will be extracted from a 'description' element with akvo type 99.

        :return: List; contains fields that have changed
        """
        imported_fields = []
        changes = []
        AKVO_NS = settings.AKVO_NS
        for custom_field in self.parent_elem.findall(
                "description[@{%s}type='99']" % AKVO_NS):
            value = self.get_text(custom_field)

            # custom_label = 'Custom field'
            # section = 1
            # max_characters = 0
            # help_text = ''
            # mandatory = False
            # order = 0

            name = self.get_attrib(
                    custom_field, '{%s}label' % AKVO_NS, 'name', 'Custom field')
            # if '{%s}label' % settings.AKVO_NS in custom_field.attrib.keys():
            #     if not len(custom_field.attrib['{%s}label' % settings.AKVO_NS]) > 255:
            #         custom_label = custom_field.attrib['{%s}label' % settings.AKVO_NS]
            #     else:
            #         add_log(iati_import, 'custom_field_label',
            #                 'label is too long (255 characters allowed', project)

            section = self.get_attrib(
                custom_field, '{%s}section' % AKVO_NS, 'section')
            try:
                section = int(section)
                if section < 1 or section > 10:
                    self.add_log("description[@{%s}type='99']" % AKVO_NS, 'section',
                                 'section should be a number between 1 and 10')
            except ValueError as e:
                self.add_log("description[@{%s}type='99']" % AKVO_NS, 'section', str(e))
            # if '{%s}section' % settings.AKVO_NS in custom_field.attrib.keys():
            #     try:
            #         section = int(custom_field.attrib['{%s}section' % settings.AKVO_NS])
            #         if section < 1 or section > 10:
            #             add_log(iati_import, 'custom_field_section',
            #                     'section should be a number between 1 and 10', project)
            #             section = 1
            #     except ValueError as e:
            #         add_log(iati_import, 'custom_field_section', str(e), project)

            max_characters = self.get_attrib(
                custom_field, '{%s}max-characters' % AKVO_NS, 'max_characters')
            try:
                max_characters = int(max_characters)
            except ValueError as e:
                self.add_log(
                        "description[@{%s}type='99']" % AKVO_NS, 'max_characters', str(e))
            # if '{%s}max-characters' % settings.AKVO_NS in custom_field.attrib.keys():
            #     try:
            #         max_characters = int(custom_field.attrib['{%s}max-characters' % settings.AKVO_NS])
            #     except ValueError as e:
            #         add_log(iati_import, 'custom_field_max_characters', str(e), project)

            help_text = self.get_attrib(
                custom_field, '{%s}help-text' % AKVO_NS, 'help_text')
            # if '{%s}help-text' % settings.AKVO_NS in custom_field.attrib.keys():
            #     if not len(custom_field.attrib['{%s}help-text' % settings.AKVO_NS]) > 1000:
            #         help_text = custom_field.attrib['{%s}help-text' % settings.AKVO_NS]
            #     else:
            #         add_log(iati_import, 'custom_field_helptext',
            #                 'helptext is too long (1000 characters allowed', project)
            mandatory = self.get_attrib(
                custom_field, '{%s}mandatory' % AKVO_NS, 'mandatory', 'false')
            mandatory = self.to_boolean(mandatory)
            # if '{%s}mandatory' % settings.AKVO_NS in custom_field.attrib.keys():
            #     mandatory_text = custom_field.attrib['{%s}mandatory' % settings.AKVO_NS]
            #     if mandatory_text and mandatory_text.lower() == 'true':
            #         mandatory = True
            order = self.get_attrib(
                custom_field, '{%s}order' % AKVO_NS, 'order', 0)
            try:
                order = int(order)
            except ValueError as e:
                self.add_log(
                        "description[@{%s}type='99']" % AKVO_NS, 'order', str(e))
            # if '{%s}order' % settings.AKVO_NS in custom_field.attrib.keys():
            #     try:
            #         order = int(custom_field.attrib['{%s}order' % settings.AKVO_NS])
            #     except ValueError as e:
            #         add_log(iati_import, 'custom_field_order', str(e), project)

            custom_field_obj, created = ProjectCustomField.objects.get_or_create(
                project=self.project,
                name=name,
                section=section,
                max_characters=max_characters,
                help_text=help_text,
                value=value,
                mandatory=mandatory,
                order=order,
                type='text'
            )

            if created:
                changes.append(u'added custom field (id: {}): {}'.format(
                        custom_field_obj.pk, custom_field_obj))

            imported_fields.append(custom_field_obj)

        for custom_field in self.project.custom_fields.all():
            if not custom_field in imported_fields:
                if not custom_field.name in ['title', 'subtitle', 'project_plan_summary',
                                             'goals_overview', 'background', 'current_status',
                                             'target_group']:
                    changes.append(u'deleted custom field (id: {}): {}'.format(
                            custom_field.pk, custom_field.__unicode__()))
                    custom_field.delete()

        return changes
