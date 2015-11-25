# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import collections

from ....rsr.models.custom_field import ProjectCustomField
from ....rsr.models.project import Project

from ..utils import ImportHelper

from django.conf import settings

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


class Descriptions(ImportHelper):

    def __init__(self, iati_import, parent_elem, project, globals, related_obj=None):
        super(Descriptions, self).__init__(iati_import, parent_elem, project, globals)
        self.model = Project

    def find_description_by_akvo_type(self, field):
        type = project_text_fields[field].akvo_type
        if type:
            element = self.parent_elem.find(
                    "description[@{{{}}}type='{}']".format(settings.AKVO_NS, type))

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
                description_text = self.get_text(description)
                if (not 'type' in description.attrib.keys() or description.attrib['type'] == '1') \
                        and (not '{%s}type' % settings.AKVO_NS in description.attrib.keys()):
                    count += 1
                    if count == order:
                        return description
        return None

    def do_import(self):
        project = self.project
        changes = []
        noop = lambda: None, ''
        for field in project_text_fields.keys():
            text = ''
            # try to find the text by akvo type
            element = self.find_description_by_akvo_type(field)
            # then do any special handling if available
            if element is None:
                custom_method = getattr(self, "get_{}".format(field))
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
        element = self.get_child_element_text(
                self.parent_elem, "description[@type='2']", 'goals_overview')
        if element is None:
            text = '\n'.join(
                ["- {}".format(
                    self.get_text(title)
                ) for title in self.parent_elem.findall('result/title')]
            )
            return self.parent_elem.findall('result/title'), text
        return None, ''

    def get_target_group(self):
        text, element = self.get_child_element_text(
                self.parent_elem, "description[@type='3']", 'target_group', return_element=True)
        return element, text


# Customizations for ICCO

description_start = dict(
    project_name='project name:',
    subtitle='subtitle:',
    project_plan_summary='project summary:',
    background='background:',
    current_status='baseline situation:',
    project_plan='project plan:',
    sustainability='sustainability:',
)

def _text_starts_with(text, start):
    return text.lower().startswith(start)

class ICCODescriptions(Descriptions):
    """
    Custom import rules for importing description fields from ICCO IATI XML. Here we look for
    description fields prefixed with the description_start strings and match them to the respective
    fields.
    Note that this is not "mixable" with the default method of matching description fields by order
    so if a description field is not prefixed it will not be included.
    """

    def _get_description(self, start_string):
        for element in self.parent_elem.findall("description"):
            text = self.get_text(element)
            if _text_starts_with(text, start_string):
                return element, text[len(start_string):].strip()
        return None, ''

    def get_subtitle(self):
        element, text = self._get_description(description_start['subtitle'])
        if element is None:
            element, text = self._get_description(description_start['project_name'])
        if element is not None:
            return super(ICCODescriptions, self).get_subtitle()

    def get_project_plan_summary(self):
        return self._get_description(description_start['project_plan_summary'])

    def get_background(self):
        return self._get_description(description_start['background'])

    def get_current_status(self):
        return self._get_description(description_start['current_status'])

    def get_project_plan(self):
        return self._get_description(description_start['project_plan'])

    def get_sustainability(self):
        return self._get_description(description_start['sustainability'])


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
