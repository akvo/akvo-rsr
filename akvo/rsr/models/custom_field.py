# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.db.models import JSONField
from django.db import models
from django.utils.translation import gettext_lazy as _

from ..fields import ValidXMLCharField, ValidXMLTextField


class ProjectCustomField(models.Model):
    """
    Custom fields make it possible for partner to specify additional fields. When specified for a
    project, the fields will appear in the admin (under the specified section) and can then be
    filled in.

    Custom fields for a project, linking the project to its' custom fields.

    Name: name of the custom field (label in the admin)
    Section: the section in the admin where the field should be added
    Maxlength: the maximum number of characters of the field
    Help text: the help text belonging to the field
    Value: the value which can be filled in the project admin.
    """
    SECTIONS = (
        (1, _('01 - General information')),
        (2, _('02 - Contact information')),
        (3, _('03 - Project partners')),
        (4, _('04 - Project descriptions')),
        (5, _('05 - Results and indicators')),
        (6, _('06 - Finance')),
        (7, _('07 - Project locations')),
        (8, _('08 - Project focus')),
        (9, _('09 - Links and documents')),
        (10, _('10 - Project comments')),
    )

    TYPES = (
        ('text', _('Text')),
        ('boolean', _('Checkbox')),
        ('dropdown', _('Dropdown')),
    )

    project = models.ForeignKey('Project', on_delete=models.CASCADE, verbose_name=_('project'), related_name='custom_fields')
    name = ValidXMLCharField(_('name'), max_length=255, help_text=_('(max 255 characters)'))
    section = models.IntegerField(
        _('admin section'), choices=SECTIONS,
        help_text=_('Select the section of the admin where the custom field should be displayed')
    )
    max_characters = models.IntegerField(
        _('maximum characters'), blank=True, null=True,
        help_text=_('Set the maximum amount of characters that the user is allowed to fill in. '
                    'Leave empty or fill in 0 if there is no character limit.')
    )
    help_text = ValidXMLTextField(
        _('help text'), max_length=1000, blank=True,
        help_text=_('The help text to be displayed with the field in the admin. Leave empty if '
                    'there is no need for a help text. (max 1000 characters)')
    )
    value = ValidXMLTextField(_('value'), blank=True)
    mandatory = models.BooleanField(_('mandatory'), default=False,
                                    help_text=_('Indicate whether this field is mandatory or not'))
    order = models.PositiveSmallIntegerField(
        _('order'), help_text=_('The order of the fields as they will be displayed in the '
                                'project editor. Must be a positive number, and the lowest '
                                'number will be shown on top.')
    )
    type = ValidXMLCharField(
        _('type'), max_length=20, choices=TYPES, default='text',
        help_text=_('Select the type of custom field. Text will show a text area in the project '
                    'editor, and checkbox will show a checkbox.')
    )
    dropdown_options = JSONField(_('dropdown options'), null=True, blank=True)
    dropdown_selection = JSONField(_('dropdown selection'), null=True, blank=True)

    def __str__(self):
        return '%s' % self.value


class OrganisationCustomField(models.Model):
    """
    Custom fields make it possible for partner to specify additional fields. When specified for a
    project, the fields will appear in the admin (under the specified section) and can then be
    filled in.

    Custom fields for an organisation, linking the organisation to its' custom fields.

    These custom fields will be used for the projects whenever a user of the organisation
    creates a new project.

    Name: name of the custom field (label in the admin)
    Section: the section in the admin where the field should be added
    Maxlength: the maximum number of characters of the field
    Help text: the help text belonging to the field
    """
    SECTIONS = (
        (1, _('01 - General information')),
        (2, _('02 - Contact information')),
        (3, _('03 - Project partners')),
        (4, _('04 - Project descriptions')),
        (5, _('05 - Results and indicators')),
        (6, _('06 - Finance')),
        (7, _('07 - Project locations')),
        (8, _('08 - Project focus')),
        (9, _('09 - Links and documents')),
        (10, _('10 - Project comments')),
    )

    TYPES = (
        ('text', _('Text')),
        ('boolean', _('Checkbox')),
        ('dropdown', _('Dropdown')),
    )

    organisation = models.ForeignKey(
        'Organisation', on_delete=models.CASCADE, verbose_name=_('organisation'), related_name='custom_fields'
    )
    name = ValidXMLCharField(_('name'), max_length=255, help_text=_('(max 255 characters)'))
    section = models.IntegerField(
        _('admin section'), choices=SECTIONS,
        help_text=_('Select the section of the admin where the custom field should be displayed')
    )
    max_characters = models.IntegerField(
        _('maximum characters'), blank=True, null=True,
        help_text=_('Set the maximum amount of characters that the user is allowed to fill in. '
                    'Leave empty or fill in 0 if there is no character limit.')
    )
    help_text = ValidXMLTextField(
        _('help text'), max_length=1000, blank=True,
        help_text=_('The help text to be displayed with the field in the admin. Leave empty if '
                    'there is no need for a help text. (max 1000 characters)')
    )
    mandatory = models.BooleanField(_('mandatory'), default=False,
                                    help_text=_('Indicate whether this field is mandatory or not'))
    order = models.PositiveSmallIntegerField(
        _('order'), help_text=_('The order of the fields as they will be displayed in the '
                                'project editor. Must be a positive number, and the lowest '
                                'number will be shown on top.')
    )
    type = ValidXMLCharField(
        _('type'), max_length=20, choices=TYPES, default='text',
        help_text=_('Select the type of custom field. Text will show a text area in the project '
                    'editor, and checkbox will show a checkbox.')
    )

    dropdown_options = JSONField(_('dropdown options'),
                                 help_text=_('List of options for the dropdown fields. '
                                             'Leave empty if field is not a dropdown'),
                                 null=True,
                                 blank=True)

    show_in_searchbar = models.BooleanField(
        _('show in searchbar'), default=False,
        help_text=_('Indicate whether this field is show in the partner site search bar'))

    def new_project_custom_field(self, project_id):
        copy_fields = (
            'name', 'type', 'section', 'order', 'max_characters', 'mandatory',
            'help_text', 'dropdown_options',
        )
        project_custom_field = ProjectCustomField(
            project_id=project_id,
            **{field: getattr(self, field) for field in copy_fields}
        )
        return project_custom_field
