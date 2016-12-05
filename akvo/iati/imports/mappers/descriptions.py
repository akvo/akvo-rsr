# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import collections

from ....rsr.models.custom_field import ProjectCustomField
from ....rsr.models.project import Project

from .. import ImportMapper, akvo_ns

# project editor sections with text fields
# TODO: fix this; there should exist one place where the sections are defined
SECTION_ONE = 1
SECTION_FOUR = 4

TextFieldInfo = collections.namedtuple(
        'TextFieldInfo',
        ['akvo_type', 'order', 'cf_section']
)

project_text_fields = {
    'title': TextFieldInfo(akvo_type=None, order=None, cf_section=SECTION_ONE),
    'subtitle': TextFieldInfo(akvo_type=4, order=None, cf_section=SECTION_ONE),
    'project_plan_summary': TextFieldInfo(akvo_type=5, order=1, cf_section=SECTION_FOUR),
    'goals_overview': TextFieldInfo(akvo_type=8, order=None, cf_section=SECTION_FOUR),
    'background': TextFieldInfo(akvo_type=6, order=2, cf_section=SECTION_FOUR),
    'current_status': TextFieldInfo(akvo_type=9, order=3, cf_section=SECTION_FOUR),
    'target_group': TextFieldInfo(akvo_type=3, order=None, cf_section=SECTION_FOUR),
    'project_plan': TextFieldInfo(akvo_type=7, order=4, cf_section=None),
    'sustainability': TextFieldInfo(akvo_type=10, order=5, cf_section=None),
}


class Descriptions(ImportMapper):

    def __init__(self, iati_import_job, parent_elem, project, globals,
                 related_obj=None):
        super(Descriptions, self).__init__(
                iati_import_job, parent_elem, project, globals)
        self.model = Project

    def find_description_by_akvo_type(self, field):
        type = project_text_fields[field].akvo_type
        if type:
            return self.parent_elem.find(
                    "description[@{}='{}']".format(akvo_ns('type'), type))

    def find_description_by_order(self, field):
        """
        Helper method for finding the Nth description field where N is the order param
        :param order: the description field ordinal
        :return: the description element or None if there is no element that matches
        """
        order = project_text_fields[field].order
        if order:
            count = 0
            for description in self.parent_elem.findall("description"):
                self.get_text(description)
                if (not 'type' in description.attrib.keys() or description.attrib['type'] == '1') \
                        and (not akvo_ns('type') in description.attrib.keys()):
                    count += 1
                    if count == order:
                        return description
        return None

    def do_import(self):
        project = self.project
        changes = []

        for field in project_text_fields.keys():
            text = ''
            # try to find the text by akvo type
            element = self.find_description_by_akvo_type(field)
            # then do any special handling if available
            if element is None:
                custom_method = getattr(self, "get_{}".format(field), None)
                if custom_method:
                    element, text = custom_method()
                else:
                    # last chance, find by iati type or order of description field
                    element = self.find_description_by_order(field)
            if element is not None:
                if not text:
                    text = self.get_text(element)
                new_value = self.check_text_length_and_set_custom_field(
                    element, text, field, project_text_fields[field].cf_section)
                # is the currently saved value different from the newly found one?
                if getattr(project, field) != new_value:
                    setattr(project, field, new_value)
                    changes.append(field)
                    project.save(update_fields=changes)
        return changes

    def get_title(self):
        # title
        element = self.parent_elem.find('title')
        if element is not None:
            return element, self.get_text(element)
        return None, ''

    def get_subtitle(self):
        return self.get_title()

    def get_goals_overview(self):
        text, element = self.get_child_element_text(
                self.parent_elem, "description[@type='2']", 'goals_overview', return_element=True)
        if element is None:
            text = '\n'.join(
                ["- {}".format(
                    self.get_text(title)
                ) for title in self.parent_elem.findall('result/title')]
            )
            return self.parent_elem.find('result/title'), text
        return element, text

    def get_target_group(self):
        text, element = self.get_child_element_text(
                self.parent_elem, "description[@type='3']", 'target_group', return_element=True)
        return element, text


class CustomFields(ImportMapper):

    def __init__(self, iati_import_job, parent_elem, project, globals,
                 related_obj=None):
        super(CustomFields, self).__init__(iati_import_job, parent_elem,
                                           project, globals, related_obj)
        self.model = ProjectCustomField

    def do_import(self):
        """
        Retrieve and store a custom field.
        The custom fields will be extracted from a 'description' element with akvo type 99.

        :return: List; contains fields that have changed
        """
        imported_fields = []
        changes = []
        custom_description = "description[@{}='99']".format(akvo_ns('type'))
        for custom_field in self.parent_elem.findall(custom_description):

            value = self.get_text(custom_field)
            name = self.get_attrib(custom_field, akvo_ns('label'), 'name', 'Custom field')

            section = self.get_attrib(custom_field, akvo_ns('section'), 'section')
            try:
                section = int(section)
                if section < 1 or section > 10:
                    self.add_log(custom_description, 'section',
                                 'section should be a number between 1 and 10')
            except ValueError as e:
                self.add_log(custom_description, 'section', str(e))

            max_characters = self.get_attrib(
                    custom_field, akvo_ns('max-characters'), 'max_characters')
            try:
                max_characters = int(max_characters)
            except ValueError as e:
                self.add_log(custom_description, 'max_characters', str(e))

            help_text = self.get_attrib(custom_field, akvo_ns('help-text'), 'help_text')

            mandatory = self.get_attrib(
                    custom_field, akvo_ns('mandatory'), 'mandatory', 'false')
            mandatory = self.to_boolean(mandatory)

            order = self.get_attrib(custom_field, akvo_ns('order'), 'order', 0)
            try:
                order = int(order)
            except ValueError as e:
                self.add_log(custom_description, 'order', str(e))

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
