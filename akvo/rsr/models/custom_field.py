# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.contrib.postgres.fields import JSONField
from django.db import models
from django.utils.translation import ugettext_lazy as _

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
        (1, _(u'01 - General information')),
        (2, _(u'02 - Contact information')),
        (3, _(u'03 - Project partners')),
        (4, _(u'04 - Project descriptions')),
        (5, _(u'05 - Results and indicators')),
        (6, _(u'06 - Finance')),
        (7, _(u'07 - Project locations')),
        (8, _(u'08 - Project focus')),
        (9, _(u'09 - Links and documents')),
        (10, _(u'10 - Project comments')),
    )

    TYPES = (
        ('text', _(u'Text')),
        ('boolean', _(u'Checkbox')),
        ('dropdown', _(u'Dropdown')),
    )

    project = models.ForeignKey('Project', verbose_name=_(u'project'), related_name='custom_fields')
    name = ValidXMLCharField(_(u'name'), max_length=255, help_text=_(u'(max 255 characters)'))
    section = models.IntegerField(
        _(u'admin section'), choices=SECTIONS,
        help_text=_(u'Select the section of the admin where the custom field should be displayed')
    )
    max_characters = models.IntegerField(
        _(u'maximum characters'), blank=True, null=True,
        help_text=_(u'Set the maximum amount of characters that the user is allowed to fill in. '
                    u'Leave empty or fill in 0 if there is no character limit.')
    )
    help_text = ValidXMLTextField(
        _(u'help text'), max_length=1000, blank=True,
        help_text=_(u'The help text to be displayed with the field in the admin. Leave empty if '
                    u'there is no need for a help text. (max 1000 characters)')
    )
    value = ValidXMLTextField(_(u'value'), blank=True)
    mandatory = models.BooleanField(_(u'mandatory'), default=False,
                                    help_text=_(u'Indicate whether this field is mandatory or not'))
    order = models.PositiveSmallIntegerField(
        _(u'order'), help_text=_(u'The order of the fields as they will be displayed in the '
                                 u'project editor. Must be a positive number, and the lowest '
                                 u'number will be shown on top.')
    )
    type = ValidXMLCharField(
        _(u'type'), max_length=20, choices=TYPES, default='text',
        help_text=_(u'Select the type of custom field. Text will show a text area in the project '
                    u'editor, and checkbox will show a checkbox.')
    )
    dropdown_options = JSONField(_(u'dropdown options'), null=True, blank=True)

    dropdown_selection = JSONField(_(u'dropdown selection'), null=True, blank=True)

    def __unicode__(self):
        return u'%s' % self.value


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
        (1, _(u'01 - General information')),
        (2, _(u'02 - Contact information')),
        (3, _(u'03 - Project partners')),
        (4, _(u'04 - Project descriptions')),
        (5, _(u'05 - Results and indicators')),
        (6, _(u'06 - Finance')),
        (7, _(u'07 - Project locations')),
        (8, _(u'08 - Project focus')),
        (9, _(u'09 - Links and documents')),
        (10, _(u'10 - Project comments')),
    )

    TYPES = (
        ('text', _(u'Text')),
        ('boolean', _(u'Checkbox')),
        ('dropdown', _(u'Dropdown')),
    )

    organisation = models.ForeignKey(
        'Organisation', verbose_name=_(u'organisation'), related_name='custom_fields'
    )
    name = ValidXMLCharField(_(u'name'), max_length=255, help_text=_(u'(max 255 characters)'))
    section = models.IntegerField(
        _(u'admin section'), choices=SECTIONS,
        help_text=_(u'Select the section of the admin where the custom field should be displayed')
    )
    max_characters = models.IntegerField(
        _(u'maximum characters'), blank=True, null=True,
        help_text=_(u'Set the maximum amount of characters that the user is allowed to fill in. '
                    u'Leave empty or fill in 0 if there is no character limit.')
    )
    help_text = ValidXMLTextField(
        _(u'help text'), max_length=1000, blank=True,
        help_text=_(u'The help text to be displayed with the field in the admin. Leave empty if '
                    u'there is no need for a help text. (max 1000 characters)')
    )
    mandatory = models.BooleanField(_(u'mandatory'), default=False,
                                    help_text=_(u'Indicate whether this field is mandatory or not'))
    order = models.PositiveSmallIntegerField(
        _(u'order'), help_text=_(u'The order of the fields as they will be displayed in the '
                                 u'project editor. Must be a positive number, and the lowest '
                                 u'number will be shown on top.')
    )
    type = ValidXMLCharField(
        _(u'type'), max_length=20, choices=TYPES, default='text',
        help_text=_(u'Select the type of custom field. Text will show a text area in the project '
                    u'editor, and checkbox will show a checkbox.')
    )

    dropdown_options = JSONField(_(u'dropdown options'),
                                 help_text=_(u'List of options for the dropdown fields. '
                                             u'Leave empty if field is not a dropdown'),
                                 null=True,
                                 blank=True)

    show_in_searchbar = models.BooleanField(
        _(u'show in searchbar'), default=False,
        help_text=_(u'Indicate whether this field is show in the partner site search bar'))

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
