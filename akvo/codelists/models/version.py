# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.db import models
from django.utils.translation import ugettext_lazy as _


class Version(models.Model):
    code = models.CharField(_('code'), max_length=4)
    url = models.URLField(_('url'), blank=True, null=False)

    def __str__(self):
        return self.code

    class Meta:
        app_label = 'codelists'
        ordering = ('-code',)
        verbose_name = _('version')
        verbose_name_plural = _('versions')
