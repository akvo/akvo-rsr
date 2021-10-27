# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.db.models import JSONField
from django.db import models
from django.utils.translation import ugettext_lazy as _

from akvo.rsr.fields import ValidXMLCharField, ValidXMLTextField


class IndicatorCustomField(models.Model):

    TYPES = (
        ('text', _('Text')),
        ('boolean', _('Checkbox')),
        ('dropdown', _('Dropdown')),
    )

    project = models.ForeignKey('Project', on_delete=models.CASCADE, verbose_name=_('project'),
                                related_name='indicator_custom_fields')
    name = ValidXMLTextField(_('name'))
    order = models.PositiveSmallIntegerField(
        _('order'), help_text=_('The order of the fields as they will be displayed in the '
                                'project editor. Must be a positive number, and the lowest '
                                'number will be shown on top.'),
        default=1,
    )
    mandatory = models.BooleanField(_('mandatory'), default=False,
                                    help_text=_('Indicate whether this field is mandatory or not'))
    help_text = ValidXMLTextField(
        _('help text'), max_length=1000, blank=True,
        help_text=_('The help text to be displayed with the field in the admin. Leave empty if '
                    'there is no need for a help text. (max 1000 characters)')
    )
    type = ValidXMLCharField(
        _('type'), max_length=20, choices=TYPES, default='text',
        help_text=_('Select the type of custom field. Text will show a text area in the project '
                    'editor, and checkbox will show a checkbox.')
    )
    dropdown_options = JSONField(_('dropdown options'), null=True, blank=True)

    class Meta:
        app_label = 'rsr'
        verbose_name = _('indicator custom field')
        verbose_name_plural = _('indicator custom fields')


class IndicatorCustomValue(models.Model):
    project_relation = 'results__indicators__custom_values__in'
    indicator = models.ForeignKey('Indicator', on_delete=models.CASCADE, verbose_name=_('indicator'),
                                  related_name='custom_values')
    custom_field = models.ForeignKey('IndicatorCustomField', on_delete=models.CASCADE, verbose_name=_('custom_field'),
                                     related_name='values')
    text_value = ValidXMLTextField(_('text_value'), blank=True)
    boolean_value = models.BooleanField(_('boolean_value'), default=False)
    dropdown_selection = JSONField(_('dropdown selection'), null=True, blank=True)

    class Meta:
        app_label = 'rsr'
        verbose_name = _('indicator custom value')
        verbose_name_plural = _('indicator custom values')
