# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.db import models
from django.utils.translation import ugettext_lazy as _

from akvo.utils import (
    PAYPAL_INVOICE_STATUS_PENDING, PAYPAL_INVOICE_STATUS_VOID,
    PAYPAL_INVOICE_STATUS_COMPLETE, PAYPAL_INVOICE_STATUS_STALE
)


# Custom manager based on http://www.djangosnippets.org/snippets/562/ and http://simonwillison.net/2008/May/1/orm/
class QuerySetManager(models.Manager):
    def get_queryset(self):
        return self.model.QuerySet(self.model)

    def __getattr__(self, attr, *args):
        try:
            return getattr(self.__class__, attr, *args)
        except AttributeError:
            return getattr(self.get_queryset(), attr, *args)


class OrganisationsQuerySetManager(QuerySetManager):
    def get_queryset(self):
        return self.model.OrganisationsQuerySet(self.model)


OLD_CONTINENTS = (
    ("1", _(u'Africa')),
    ("2", _(u'Asia')),
    ("3", _(u'Australia')),
    ("4", _(u'Europe')),
    ("5", _(u'North America')),
    ("6", _(u'South America')),
)

UPDATE_METHODS = (
    ('W', _(u'web')),
    ('E', _(u'e-mail')),
    ('S', _(u'SMS')),
    ('M', _(u'mobile')),
)



ORG_TYPE_NGO = 'N'
ORG_TYPE_GOV = 'G'
ORG_TYPE_COM = 'C'
ORG_TYPE_KNO = 'K'
ORG_TYPES = (
    (ORG_TYPE_NGO, _(u'NGO')),
    (ORG_TYPE_GOV, _(u'Governmental')),
    (ORG_TYPE_COM, _(u'Commercial')),
    (ORG_TYPE_KNO, _(u'Knowledge institution')),
)
NEW_TO_OLD_TYPES = [ORG_TYPE_GOV, ORG_TYPE_GOV, ORG_TYPE_NGO, ORG_TYPE_NGO, ORG_TYPE_NGO, ORG_TYPE_NGO,
                    ORG_TYPE_NGO, ORG_TYPE_NGO, ORG_TYPE_COM, ORG_TYPE_KNO]

ACCOUNT_LEVEL = (
    ('free', u'Free'),
    ('freemium', u'Freemium'),
    ('premium', u'Premium'),
    ('plus', u'Premium Plus'),
    ('archived', u'Archived'),
)

HIERARCHY_OPTIONS = (
    (1, u'Core Activity'),
    (2, u'Sub Activity'),
    (3, u'Lower Sub Activity')
)

TOTAL_BUDGET_LABEL_ID = 14

OTHER_LABELS = [u'other 1', u'other 2', u'other 3']

PUBLISHING_STATUS = (
    ('unpublished', _(u'Unpublished')),
    ('published', _(u'Published')),
)

LINK_KINDS = (
    ('A', _(u'Akvopedia entry')),
    ('E', _(u'External link')),
)

PAYPAL_LOCALE_CHOICES = (
    ('US', u'US English'),
)

STATUS_CHOICES = (
    (PAYPAL_INVOICE_STATUS_PENDING, 'Pending'),
    (PAYPAL_INVOICE_STATUS_VOID, 'Void'),
    (PAYPAL_INVOICE_STATUS_COMPLETE, 'Complete'),
    (PAYPAL_INVOICE_STATUS_STALE, 'Stale'),
)

PAYMENT_ENGINES = (
    ('paypal', u'PayPal'),
    ('ideal', u'iDEAL'),
)