# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.template import Library, Node
from django.template import resolve_variable
import GChartWrapper

register = Library()


class AttrNode(Node):
    def __init__(self, args):
        self.args = map(str, args)

    def render(self, context):
        for n, arg in enumerate(self.args):
            if arg in context:
                self.args[n] = resolve_variable(arg, context)
        return self.args


def attribute(parser, token):
    return AttrNode(token.split_contents())
for tag in GChartWrapper.constants.TTAGSATTRS:
    register.tag(tag, attribute)


class ChartNode(Node):
    def __init__(self, tokens, nodelist):
        self.type = None
        self.tokens = []
        if tokens and len(tokens) > 1:
            self.type = tokens[1]
            self.tokens = tokens[2:]
        self.nodelist = nodelist

    def render(self, context):
        args = []
        kwargs = {}
        for t in self.tokens:
            try:
                args.append(resolve_variable(t, context))
            except:
                try:
                    args.append(float(t))
                except:
                    arg = str(t)
                    if arg.find('=') > -1:
                        k, v = arg.split('=')[:2]
                        kwargs[k] = v
                    else:
                        args.append(arg)
        if len(args) == 1 and type(args[0]) in map(type, [[], ()]):
            args = args[0]
        if self.type in dir(GChartWrapper):
            chart = getattr(GChartWrapper, self.type)(args, **kwargs)
        elif self.type in GChartWrapper.constants.TYPES:
            chart = GChartWrapper.GChart(self.type, args, **kwargs)
        else:
            raise TypeError('Chart type %s not recognized' % self.type)
        imgkwargs = {}
        for n in self.nodelist:
            rend = n.render(context)
            if isinstance(rend, list):
                if rend[0] == 'img':
                    for k, v in map(lambda x: x.split('='), rend[1:]):
                        imgkwargs[k] = v
                    continue
                if rend[0] == 'axes':
                    getattr(getattr(chart, rend[0]), rend[1])(*rend[2:])
                else:
                    getattr(chart, rend[0])(*rend[1:])
        return chart.img(**imgkwargs)


def make_chart(parser, token):
    nodelist = parser.parse(('endchart',))
    parser.delete_first_token()
    tokens = token.contents.split()
    return ChartNode(tokens, nodelist)
register.tag('chart', make_chart)
