# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from datetime import datetime, timedelta

from django.conf import settings
from django.db import models
from django.contrib.auth.models import User
from django.utils.translation import ugettext_lazy as _

from mollie.ideal.utils import get_mollie_banklist

from akvo.rsr.fields import ValidXMLCharField, ValidXMLTextField

from .models_utils import PAYMENT_ENGINES, STATUS_CHOICES


class InvoiceManager(models.Manager):
    def get_queryset(self):
        """Returns a queryset of all invoices
        Test invoices are excluded in production mode
        """
        if not settings.DONATION_TEST:
            return super(InvoiceManager, self).get_queryset().exclude(test=True)
        else:
            return super(InvoiceManager, self).get_queryset()

    def stale(self):
        """Returns a queryset of invoices which have been pending
        for longer than settings.PAYPAL_INVOICE_TIMEOUT (60 minutes by default)
        """
        timeout = (datetime.now() - timedelta(minutes=getattr(settings, 'PAYPAL_INVOICE_TIMEOUT', 60)))
        qs = self.filter(status=1, time__lte=timeout)
        return qs

    def complete(self):
        """Returns a queryset of invoices which have
        a status of 'Complete'
        """
        qs = self.filter(status=3)
        return qs


class Invoice(models.Model):
    # STATUS_CHOICES = (
    #     (PAYPAL_INVOICE_STATUS_PENDING, 'Pending'),
    #     (PAYPAL_INVOICE_STATUS_VOID, 'Void'),
    #     (PAYPAL_INVOICE_STATUS_COMPLETE, 'Complete'),
    #     (PAYPAL_INVOICE_STATUS_STALE, 'Stale'),
    # )
    # PAYMENT_ENGINES = (
    #     ('paypal', u'PayPal'),
    #     ('ideal', u'iDEAL'),
    # )
    # Setup
    test = models.BooleanField(
        u'test donation',
        help_text=u'This flag is set if the donation was made in test mode.',
        default=False)
    engine = ValidXMLCharField(u'payment engine', choices=PAYMENT_ENGINES, max_length=10, default='paypal')
    user = models.ForeignKey(User, blank=True, null=True)
    project = models.ForeignKey('Project', related_name='invoices')
    # Common
    amount = models.PositiveIntegerField(help_text=u'Amount requested by user.')
    amount_received = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True,
        help_text=u'Amount actually received after charges have been applied.'
    )
    time = models.DateTimeField(auto_now_add=True)
    name = ValidXMLCharField(max_length=75, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    status = models.PositiveSmallIntegerField('status', choices=STATUS_CHOICES, default=1)
    http_referer = ValidXMLCharField(u'HTTP referer', max_length=255, blank=True)
    campaign_code = ValidXMLCharField(u'Campaign code', blank=True, max_length=15)
    is_anonymous = models.BooleanField(u'anonymous donation', default=False)
    # PayPal
    ipn = ValidXMLCharField(u'PayPal IPN', blank=True, null=True, max_length=75)
    # Mollie
    bank = ValidXMLCharField(u'mollie.nl bank ID', max_length=4, choices=get_mollie_banklist(), blank=True)
    transaction_id = ValidXMLCharField(u'mollie.nl transaction ID', max_length=100, blank=True)

    notes = ValidXMLTextField(verbose_name=_("Notes and comments"), blank=True, default='')

    admin_objects = models.Manager()
    objects = InvoiceManager()

    def get_favicon(self):
        pass  # TODO: @ grab favicon from HTTP_REFERER site

    @property
    def get_name(self):
        if self.user:
            return self.user.get_full_name()
        return self.name

    @property
    def get_email(self):
        if self.user:
            return self.user.email
        return self.email

    @property
    def currency(self):
        return self.project.currency

    @property
    def gateway(self):
        if self.engine == 'paypal':
            if settings.DONATION_TEST:
                return settings.PAYPAL_SANDBOX_GATEWAY
            else:
                return self.project.paymentgatewayselector.paypal_gateway.account_email
        elif self.engine == 'ideal':
            return self.project.paymentgatewayselector.mollie_gateway.partner_id

    @property
    def locale(self):
        return self.project.paymentgatewayselector.paypal_gateway.locale

    @property
    def notification_email(self):
        if getattr(settings, "DONATION_TEST", False):
            return "test@akvo.org"
        else:
            if self.engine == "paypal":
                return self.project.paymentgatewayselector.paypal_gateway.notification_email
            elif self.engine == "ideal":
                return self.project.paymentgatewayselector.mollie_gateway.notification_email

    @property
    def donation_fee(self):
        return (self.amount - self.amount_received)

    def __unicode__(self):
        return u'Invoice %(invoice_id)s (Project: %(project_name)s)' % {
            'invoice_id': self.id, 'project_name': self.project
        }

    class Meta:
        app_label = 'rsr'
        verbose_name = u'invoice'
        ordering = ['-id', ]
