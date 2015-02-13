# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.db import models
from django.utils.translation import ugettext_lazy as _

from .base_codelist import BaseCodelist


class Country(BaseCodelist):
    name = models.CharField(_(u'name'), max_length=300, blank=True, null=False)
    language = models.CharField(_(u'language'), max_length=2, blank=True, null=False)

    def __unicode__(self):
        return self.code + ' - ' + self.name

    class Meta:
        app_label = 'codelists'
        ordering = ('-version', 'code')
        verbose_name = _(u'country')
        verbose_name_plural = _(u'countries')
