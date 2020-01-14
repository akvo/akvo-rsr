# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.utils.translation import ugettext_lazy as _

from ..fields import ValidXMLCharField

from akvo.codelists.models import (CRSAddOtherFlags, LoanRepaymentType, LoanRepaymentPeriod,
                                   Currency, CRSChannelCode)
from akvo.codelists.store.default_codelists import (C_R_S_ADD_OTHER_FLAGS, LOAN_REPAYMENT_TYPE,
                                                    LOAN_REPAYMENT_PERIOD, CURRENCY,
                                                    C_R_S_CHANNEL_CODE)
from akvo.utils import codelist_choices, codelist_value


class CrsAdd(models.Model):
    """
    Items specific to CRS++ reporting. Can only occur once per project.
    """
    project = models.OneToOneField('Project', primary_key=True)
    loan_terms_rate1 = models.DecimalField(
        _('loan terms rate 1'), blank=True, null=True, max_digits=5, decimal_places=2,
        validators=[MaxValueValidator(100), MinValueValidator(0)],
        help_text=_('Interest Rate. If an ODA loan with variable interest rate, report the '
                    'variable rate here and the reference fixed rate as rate 2.')
    )
    loan_terms_rate2 = models.DecimalField(
        _('loan terms rate 2'), blank=True, null=True, max_digits=5, decimal_places=2,
        validators=[MaxValueValidator(100), MinValueValidator(0)],
        help_text=_('Second Interest Rate. If an ODA loan with variable interest rate, report the '
                    'variable rate as rate 1 and the reference fixed rate here.')
    )
    repayment_type = ValidXMLCharField(
        _('loan terms repayment type'), max_length=1,
        choices=codelist_choices(LOAN_REPAYMENT_TYPE), blank=True,
        help_text=_('An IATI codelist tabulating CRS-specified values for the type of Repayment. '
                    'See the <a href="http://iatistandard.org/202/codelists/LoanRepaymentType/" '
                    'target="_blank">IATI codelist</a>.')
    )
    repayment_plan = ValidXMLCharField(
        _('loan terms repayment plan'), max_length=2,
        choices=codelist_choices(LOAN_REPAYMENT_PERIOD), blank=True,
        help_text=_('An IATI codelist tabulating CRS-specified values for the number of '
                    'repayments per annum. See the <a href="http://iatistandard.org/202/codelists/'
                    'LoanRepaymentPeriod/" target="_blank">IATI codelist</a>.')
    )
    commitment_date = models.DateField(
        _('loan terms commitment date'), null=True, blank=True,
        help_text=_('The CRS++ reported commitment date.')
    )
    repayment_first_date = models.DateField(
        _('loan terms first repayment date'), null=True, blank=True,
        help_text=_('The CRS++ reported first repayment date.')
    )
    repayment_final_date = models.DateField(
        _('loan terms final repayment date'), null=True, blank=True,
        help_text=_('The CRS++ reported final repayment date.')
    )
    loan_status_year = models.PositiveIntegerField(
        _('loan status year'), blank=True, null=True,
        help_text=_('CRS reporting year (CRS++ Column 1).')
    )
    loan_status_currency = ValidXMLCharField(
        _('loan status currency'), blank=True, max_length=3, choices=codelist_choices(CURRENCY)
    )
    loan_status_value_date = models.DateField(
        _('loan status value date'), blank=True, null=True,
        help_text=_('Enter the specific date (DD/MM/YYYY) for the loan status values.')
    )
    interest_received = models.DecimalField(
        _('loan status interest received'), max_digits=10, decimal_places=2, blank=True, null=True,
        help_text=_('Interest received during the reporting year.')
    )
    principal_outstanding = models.DecimalField(
        _('loan status principal outstanding'), max_digits=10, decimal_places=2, blank=True,
        null=True, help_text=_('The amount of principal owed on the loan at the end of the '
                               'reporting year.')
    )
    principal_arrears = models.DecimalField(
        _('loan status principal arrears'), max_digits=10, decimal_places=2, blank=True, null=True,
        help_text=_('Arrears of principal at the end of the year. Included in principal '
                    'outstanding.')
    )
    interest_arrears = models.DecimalField(
        _('loan status interest arrears'), max_digits=10, decimal_places=2, blank=True, null=True,
        help_text=_('Arrears of interest at the end of the year.')
    )
    channel_code = ValidXMLCharField(
        _('channel code'), blank=True, max_length=5, choices=codelist_choices(C_R_S_CHANNEL_CODE),
        help_text=_('The CRS channel code for this activity. The codelist contains both '
                    'organisation types and names of organisations. For non-CRS purposes these '
                    'should be reported using participating organisations. See the <a '
                    'href="http://iatistandard.org/202/codelists/CRSChannelCode/" '
                    'target="_blank">IATI codelist</a>.')
    )

    def __str__(self):
        return 'CRS++'

    def iati_repayment_type(self):
        return codelist_value(LoanRepaymentType, self, 'repayment_type')

    def iati_repayment_type_unicode(self):
        return str(self.iati_repayment_type())

    def iati_repayment_plan(self):
        return codelist_value(LoanRepaymentPeriod, self, 'repayment_plan')

    def iati_repayment_plan_unicode(self):
        return str(self.iati_repayment_plan())

    def iati_currency(self):
        return codelist_value(Currency, self, 'loan_status_currency')

    def iati_currency_unicode(self):
        return str(self.iati_currency())

    def iati_channel_code(self):
        return codelist_value(CRSChannelCode, self, 'channel_code')

    def iati_channel_code_unicode(self):
        return str(self.iati_channel_code())

    class Meta:
        app_label = 'rsr'
        verbose_name = _('CRS reporting')
        verbose_name_plural = _('CRS reporting')
        ordering = ('pk',)


class CrsAddOtherFlag(models.Model):
    """
    Other flag of CRS++ reporting.
    """
    crs = models.ForeignKey('CrsAdd', verbose_name='crs', related_name='other_flags')
    code = ValidXMLCharField(
        _('code'), max_length=1, choices=codelist_choices(C_R_S_ADD_OTHER_FLAGS),
        help_text=_('An IATI code describing the equivalent CRS++ columns. See the <a '
                    'href="http://iatistandard.org/202/codelists/CRSAddOtherFlags/" '
                    'target="_blank">IATI codelist</a>.')
    )
    significance = models.NullBooleanField(
        _('significance'), blank=True, help_text=_('Indicate whether the flag applies or not.')
    )

    def __str__(self):
        if self.code:
            try:
                return self.iati_code().name
            except AttributeError:
                return self.iati_code()
        else:
            return '%s' % _('No other flag code specified')

    def iati_code(self):
        return codelist_value(CRSAddOtherFlags, self, 'code')

    def iati_code_unicode(self):
        return str(self.iati_code())

    class Meta:
        app_label = 'rsr'
        verbose_name = _('CRS other flag')
        verbose_name_plural = _('CRS other flags')
        ordering = ('pk',)
