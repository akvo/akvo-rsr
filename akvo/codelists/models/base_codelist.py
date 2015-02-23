# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.db import models
from django.utils.translation import ugettext_lazy as _


class BaseCodelist(models.Model):
    code = models.CharField(_(u'code'), max_length=100, blank=True, null=False)
    version = models.ForeignKey('Version', verbose_name=_(u'version'), blank=False, null=False)

    class Meta:
        app_label = 'codelists'
        abstract = True
