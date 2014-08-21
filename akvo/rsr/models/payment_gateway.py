# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.db import models

from ..fields import ValidXMLCharField, ValidXMLTextField

from .project import Project


class PaymentGateway(models.Model):
    name = ValidXMLCharField(max_length=255, help_text=u'Use a short, descriptive name.')
    description = ValidXMLTextField(blank=True)
    currency = ValidXMLCharField(max_length=3, choices=Project.CURRENCY_CHOICES, default='EUR')
    notification_email = models.EmailField(u'notification email',
        help_text=u'When a donation is completed successfully, notification emails will be sent to the donor and to this address.')

    def __unicode__(self):
        return u'%s - %s' % (self.name, self.get_currency_display())

    class Meta:
        app_label = 'rsr'
        abstract = True


class PayPalGateway(PaymentGateway):
    PAYPAL_US_LOCALE = 'US'
    PAYPAL_LOCALE_CHOICES = (
        (PAYPAL_US_LOCALE, u'US English'),
    )
    account_email = models.EmailField()
    locale = ValidXMLCharField(max_length=2, choices=PAYPAL_LOCALE_CHOICES, default=PAYPAL_US_LOCALE)

    class Meta:
        app_label = 'rsr'
        verbose_name = u'PayPal gateway'


class MollieGateway(PaymentGateway):
    partner_id = ValidXMLCharField(max_length=10)

    class Meta:
        app_label = 'rsr'
        verbose_name = u'Mollie/iDEAL gateway'


class PaymentGatewaySelector(models.Model):
    project = models.OneToOneField('Project')
    paypal_gateway = models.ForeignKey(PayPalGateway, default=1)
    mollie_gateway = models.ForeignKey(MollieGateway, default=1)

    def __unicode__(self):
        return u'%s - %s' % (self.project.id, self.project.title)

    class Meta:
        app_label = 'rsr'
        verbose_name = u'Project payment gateway configuration'