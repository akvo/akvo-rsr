# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module. 
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django import template
register = template.Library()

from django.conf import settings

import time, datetime
from decimal import Decimal, ROUND_HALF_UP

DECIMAL_PLACES = getattr(settings, 'DECIMALS_DECIMAL_PLACES', 2)

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
def round(value, decimal_places=DECIMAL_PLACES):
    try:
        value = Decimal(str(value))
    except:
        return u''
    if settings.DECIMALS_DEBUG:
        decimal_result = value.quantize(Decimal(10) ** -decimal_places)
        return decimal_result
    else:
        decimal_result = value.quantize(Decimal(10), ROUND_HALF_UP)
        if decimal_result <= 0:
            return 0
        else:
            return decimal_result
round.is_safe = True

