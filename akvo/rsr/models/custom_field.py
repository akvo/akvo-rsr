# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.db import models
from django.utils.translation import ugettext_lazy as _

from ..fields import ValidXMLCharField


class CustomField(models.Model):
    """
    Custom fields for a project, consisting of a name and a description for the field.
    """

    project = models.ForeignKey('Project', verbose_name=_(u'project'), related_name='custom_fields')
    name = ValidXMLCharField(
        _(u'name'), blank=True, max_length=255, help_text=_(u'(max 255 characters)')
    )
    value = ValidXMLCharField(
        _(u'value'), blank=True, max_length=2000, help_text=_(u'(max 2000 characters)')
    )
