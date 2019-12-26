# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.db import models
from django.utils.translation import ugettext_lazy as _


class BaseCodelist(models.Model):
    code = models.CharField(_('code'), max_length=100, blank=True, null=False, db_index=True)
    version = models.ForeignKey('Version', verbose_name=_('version'), blank=False, null=False,
                                db_index=True)

    class Meta:
        app_label = 'codelists'
        abstract = True
