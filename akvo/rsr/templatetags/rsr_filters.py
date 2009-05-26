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

@register.filter("smart_truncate")
def smart_truncate(content, length=100, suffix='...'):
    if len(content) <= length:
        return content
    else:
        return ' '.join(content[:length+1].split(' ')[0:-1]) + suffix
        
        
'''
The filter I used from start had a bug which led me to trying to find an alternative. I have saved some variants here until the smart_truncate one is tested / Daniel

@register.filter("truncatechars")
def truncatechars(value, max_length):
    return value[:max_length].rsplit(' ', 1)[0]+'...'
    
@register.filter("smart_truncate2")
def smart_truncate2(text, min_length=100):
    """If the `text` is more than `min_length` characters long,
    it will be cut at the next word-boundary and `suffix`will
    be appended.
    """
    pattern = r'^(.{%d,}?\S)\s.*' % (min_length-1)
    return re.sub(pattern, r'\1' + '...', text)

@register.filter("smart_truncate3")
def smart_truncate3(text, length=100):
    suffix='...'
    slen = len(suffix)
    pattern = r'^(.{0,%d}\S)\s+\S+' % (length-slen-1)
    if len(text) > length:
        match = re.match(pattern, text)
        if match:
            length0 = match.end(0)
            length1 = match.end(1)
            if abs(length0+slen-length) < abs(length1+slen-length):
                return match.group(0) + suffix
            else:
                return match.group(1) + suffix
    return text


'''