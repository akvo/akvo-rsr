# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.db import models
from django.utils.translation import ugettext_lazy as _

from akvo.rsr.fields import ValidXMLCharField
from akvo.rsr.iati.codelists import codelists_v104 as codelists


class Result(models.Model):
    project = models.ForeignKey('Project', verbose_name=_(u'project'), related_name='results')
    title = ValidXMLCharField(_(u'title'), blank=True, max_length=255, help_text=_(u'(max 255 characters)'))
    type = ValidXMLCharField(_(u'type'), blank=True, max_length=1, choices=codelists.RESULT_TYPE)
    aggregation_status = models.NullBooleanField(_(u'aggregation status'), blank=True)
    description = ValidXMLCharField(_(u'description'), blank=True, max_length=255, help_text=_(u'(max 255 characters)'))
    description_type = ValidXMLCharField(
        _(u'description type'), blank=True, max_length=1, choices=[code[:2] for code in codelists.DESCRIPTION_TYPE]
    )

    def __unicode__(self):
        return self.title

    class Meta:
        verbose_name = _(u'result')
        verbose_name_plural = _(u'results')