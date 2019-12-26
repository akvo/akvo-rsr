# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.db import models
from django.utils.translation import ugettext_lazy as _

from ..fields import ValidXMLCharField


class Goal(models.Model):
    project = models.ForeignKey('Project', verbose_name=_('project'), related_name='goals')
    text = ValidXMLCharField(_('goal'), blank=True, max_length=100,
                             help_text=_('(100 characters)'))

    class Meta:
        app_label = 'rsr'
