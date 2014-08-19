# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.db import models
from django.utils.translation import ugettext_lazy as _

from akvo.rsr.fields import ValidXMLCharField

from .models_utils import PUBLISHING_STATUS


class PublishingStatus(models.Model):
    """
    Keep track of publishing status. Only for projects now, but possible to extend to other object types.
    """
    # TODO: change to a generic relation if we want to have publishing stats on other objects than projects
    project = models.OneToOneField('Project',)
    status = ValidXMLCharField(max_length=30, choices=PUBLISHING_STATUS, default='unpublished')

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'publishing status')
        verbose_name_plural = _(u'publishing statuses')
        ordering = ('-status', 'project')