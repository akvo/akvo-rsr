# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

# django snippet 840, see http://www.djangosnippets.org/snippets/840/
#from django.utils.http import urlencode as django_urlencode
from django.template import Library, Node, resolve_variable, TemplateSyntaxError


register = Library()


class AddParameters(Node):
    def __init__(self, vars):
        self.vars = vars

    def render(self, context):
        req = resolve_variable('request', context)
        params = req.GET.copy()

        for i in range(0, len(self.vars), 2):
            key = self.vars[i].resolve(context)
            if key == '':
                key = self.vars[i]
            value = self.vars[i + 1].resolve(context)
            if value == '':
                value = self.vars[i + 1]
            params[key] = value

        # return '%s?%s' % (req.path, params.urlencode())
        if params:
            # return ('?%s' % params.urlencode()).replace('&', '&amp;')

            params = '?%s' % params.urlencode()
            return params.replace('&', '&amp;')
        else:
            return ''
        '''
        if params:
            return '?%s' % params.urlencode()
        else:
            return ''
        '''


def addparam(parser, token):
    """
    Add multiple parameters to current url 

    Usage:
        {% addparam name1 value1 name2 value2 %}
                                            or
        {% addparam "name1" value1 "name2" value2 %}        

        variable can be use inplace of names and values
        example: {% addparam "view" message.id %}

    """

    bits = token.contents.split(' ')
    if len(bits) < 2:
        raise TemplateSyntaxError, "'%s' tag requires atleast two arguments" % bits[0]

    if len(bits) % 2 != 1:
        raise TemplateSyntaxError, "The arguments must be pairs"

    vars = [parser.compile_filter(bit) for bit in bits[1:]]
    return AddParameters(vars)

register.tag('addparam', addparam)
