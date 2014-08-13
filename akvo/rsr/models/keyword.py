# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.db import models
from django.utils.translation import ugettext_lazy as _

from akvo.rsr.fields import ValidXMLCharField


class Keyword(models.Model):
    label = ValidXMLCharField(_(u'label'), max_length=30, unique=True, db_index=True)

    def __unicode__(self):
        return self.label

    class Meta:
        ordering = ('label',)
        verbose_name = _(u'keyword')
        verbose_name_plural = _(u'keywords')