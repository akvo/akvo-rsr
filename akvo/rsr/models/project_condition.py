# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.db import models
from django.utils.translation import ugettext_lazy as _

from ..fields import ValidXMLCharField
from ..iati.codelists import codelists_v104 as codelists


class ProjectCondition(models.Model):
    project = models.ForeignKey('Project', verbose_name=u'project', related_name='conditions')
    text = ValidXMLCharField(_(u'condition'), blank=True, max_length=100, help_text=_(u'(100 characters)'))
    type = ValidXMLCharField(_(u'condition type'), blank=True, max_length=1, choices=codelists.CONDITION_TYPE)
    attached = models.NullBooleanField(_(u'attached'), blank=True)

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'condition')
        verbose_name_plural = _(u'conditions')
