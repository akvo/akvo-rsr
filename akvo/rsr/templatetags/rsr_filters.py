# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module. 
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django import template
register = template.Library()

from django.conf import settings

import time, datetime
from decimal import Decimal, ROUND_HALF_UP

@register.filter
def string_to_date(value):
    try:
        time_format = "%Y-%m-%d %H:%M:%S"
        fmt_time = time.strptime(value, time_format)
        return datetime.datetime(*fmt_time[:6])
    except:
        return value

# http://stackoverflow.com/questions/250357/smart-truncate-in-python 
@register.filter("smart_truncate")
def smart_truncate(content, length=100, suffix='...'):
    if len(content) <= length:
        return content
    else:
        return content[:length].rsplit(' ', 1)[0]+suffix

@register.filter
def round(value, decimal_places=getattr(settings, 'DECIMALS_DECIMAL_PLACES', 2)):
    try:
        value = Decimal(str(value))
    except:
        return u''
    if settings.DECIMALS_DEBUG:
        d = value.quantize(Decimal(10) ** -decimal_places)
        return unicode(d)
    else:
        d = value.quantize(Decimal(10), ROUND_HALF_UP)
        return unicode(d)
round.is_safe = True

