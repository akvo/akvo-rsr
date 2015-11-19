# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import collections

from ....rsr.models.custom_field import ProjectCustomField
from ....rsr.models.project import Project

from ..utils import ImportHelper

from django.conf import settings

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


# TODO: fix this; there should exist one place where the sections are defined
SECTION_ONE = 1
SECTION_FOUR = 4

class Descriptions(ImportHelper):

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


class CustomFields(ImportHelper):

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
        for custom_field in self.parent_elem.findall("description[@{%s}type='99']" % AKVO_NS):

            value = self.get_text(custom_field)
            name = self.get_attrib(custom_field, '{%s}label' % AKVO_NS, 'name', 'Custom field')

            section = self.get_attrib(custom_field, '{%s}section' % AKVO_NS, 'section')
            try:
                section = int(section)
                if section < 1 or section > 10:
                    self.add_log("description[@{%s}type='99']" % AKVO_NS, 'section',
                                 'section should be a number between 1 and 10')
            except ValueError as e:
                self.add_log("description[@{%s}type='99']" % AKVO_NS, 'section', str(e))

            max_characters = self.get_attrib(
                    custom_field, '{%s}max-characters' % AKVO_NS, 'max_characters')
            try:
                max_characters = int(max_characters)
            except ValueError as e:
                self.add_log("description[@{%s}type='99']" % AKVO_NS, 'max_characters', str(e))

            help_text = self.get_attrib(custom_field, '{%s}help-text' % AKVO_NS, 'help_text')

            mandatory = self.get_attrib(
                    custom_field, '{%s}mandatory' % AKVO_NS, 'mandatory', 'false')
            mandatory = self.to_boolean(mandatory)

            order = self.get_attrib(custom_field, '{%s}order' % AKVO_NS, 'order', 0)
            try:
                order = int(order)
            except ValueError as e:
                self.add_log("description[@{%s}type='99']" % AKVO_NS, 'order', str(e))

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
