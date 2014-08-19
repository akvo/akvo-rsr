# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.db import models

from akvo.rsr.fields import ValidXMLCharField


class PartnerType(models.Model):
    id = ValidXMLCharField(max_length=8, primary_key=True, unique=True)
    label = ValidXMLCharField(max_length=30, unique=True)

    def __unicode__(self):
        return self.label

    class Meta:
        app_label = 'rsr'
        ordering = ('label',)