# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.db import models
from django.utils.translation import ugettext_lazy as _

from ..fields import ValidXMLCharField


class OrganisationAccount(models.Model):
    """
    This model keeps track of organisation account levels and other relevant data.
    The reason for having this in a separate model form Organisation is to hide
    it from the org admins.
    """
    ACCOUNT_FREE = 'free'
    ACCOUNT_FREEMIUM = 'freemium'
    ACCOUNT_PREMIUM = 'premium'
    ACCOUNT_PLUS = 'plus'
    ACCOUNT_FREE = 'archived'

    ACCOUNT_LEVEL = (
        (ACCOUNT_FREE, _('Free')),
        (ACCOUNT_FREEMIUM, _('Freemium')),
        (ACCOUNT_PREMIUM, _('Premium')),
        (ACCOUNT_PLUS, _('Premium Plus')),
        (ACCOUNT_FREE, _('Archived')),
    )

    organisation = models.OneToOneField(
        'Organisation', verbose_name='organisation', primary_key=True
    )
    account_level = ValidXMLCharField(
        _('account level'), max_length=12, choices=ACCOUNT_LEVEL, default=ACCOUNT_FREE
    )

    class Meta:
        app_label = 'rsr'
        verbose_name = _('organisation account')
        verbose_name_plural = _('organisation accounts')
