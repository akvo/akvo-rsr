# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.db import models

from akvo.rsr.fields import ValidXMLCharField
from .models_utils import ACCOUNT_LEVEL


class OrganisationAccount(models.Model):
    """
    This model keeps track of organisation account levels and other relevant data.
    The reason for having this in a separate model form Organisation is to hide
    it from the org admins.
    """
    organisation = models.OneToOneField('Organisation', verbose_name=u'organisation', primary_key=True)
    account_level = ValidXMLCharField(u'account level', max_length=12, choices=ACCOUNT_LEVEL, default='free')

    class Meta:
        app_label = 'rsr'
        verbose_name = u'organisation account'
        verbose_name_plural = u'organisation accounts'