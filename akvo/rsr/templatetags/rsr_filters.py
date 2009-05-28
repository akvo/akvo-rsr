# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module. 
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django import template
register = template.Library()

import time, datetime

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