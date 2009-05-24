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
        
@register.filter("truncatechars")
def truncatechars(value, max_length):  
    if len(value) > max_length:  
        truncd_val = value[:max_length]  
        if value[max_length+1] != " ":  
            truncd_val = truncd_val[:truncd_val.rfind(" ")]  
        return  truncd_val + "..."  
    return value
