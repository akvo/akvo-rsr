# -*- coding: utf-8 -*-
"""
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please
    see < http://www.gnu.org/licenses/agpl.html >.
"""
from __future__ import absolute_import

from django import template
from django.conf import settings
from django.contrib.sites.models import Site
from django.template.defaulttags import WidthRatioNode
from django.template.base import TemplateSyntaxError
from django.utils.translation import ugettext as _

register = template.Library()


@register.inclusion_tag('inclusion_tags/more_partners.html', takes_context=True)
def more_link(context, project, project_page=False):
    """Generate the more links."""
    num_other_partners = 0
    partners_dict = {}

    for partnership in project.partnerships.all():
        organisation = partnership.organisation

        if partnership.iati_organisation_role_label():
            label = partnership.iati_organisation_role_label()
        else:
            label = _(u'No partner role')

        if organisation != project.primary_organisation:
            if organisation in partners_dict.keys():
                partners_dict[organisation].append(label)
            else:
                partners_dict[organisation] = [label]
                num_other_partners += 1

    return {
        'project': project,
        'project_page': project_page,
        'num_other_partners': num_other_partners,
        'partners_dict': partners_dict
    }

@register.inclusion_tag('inclusion_tags/counter_badge.html', takes_context=True)
def counter_badge(context, object):
    '''show the counter_badge'''
    return {'MEDIA_URL': context['MEDIA_URL'], 'object': object}


@register.inclusion_tag('inclusion_tags/funding_box.html', takes_context=True)
def funding_box(context, project):
    '''Show the funding box used in the widgets. Css definition in
    widget_global.css'''
    return {'MEDIA_URL': context['MEDIA_URL'], 'project': project}


@register.inclusion_tag('inclusion_tags/funding_table.html',
                        takes_context=True)
def funding_table(context, project):
    '''Show the funding box used in the widgets. Css definition in
    widget_global.css'''
    return {'MEDIA_URL': context['MEDIA_URL'], 'project': project}


@register.inclusion_tag('inclusion_tags/funding_project.html',
                        takes_context=True)
def funding_project(context, project):
    '''Show the funding box used in the widgets. Css definition in
    widget_global.css'''
    return {'MEDIA_URL': context['MEDIA_URL'], 'project': project}


@register.inclusion_tag('inclusion_tags/funding_box_narrow.html',
                        takes_context=True)
def funding_box_narrow(context, project):
    '''Show the funding box used in the widgets. Css definition in
    widget_global.css'''
    return {'MEDIA_URL': context['MEDIA_URL'], 'project': project}


@register.inclusion_tag('inclusion_tags/funding_box_narrow2.html',
                        takes_context=True)
def funding_box_narrow2(context, project):
    '''Show the funding box used in the widgets. Css definition in
    widget_global.css   '''
    return {'MEDIA_URL': context['MEDIA_URL'], 'project': project}


@register.inclusion_tag(
    'partner_sites/inclusion_tags/partner_sites_funding_box.html',
    takes_context=True)
def partner_sites_funding_box(context, project):
    '''Funding box used on partner sites'''
    return {
        'MEDIA_URL': context['MEDIA_URL'],
        'project': project,
        'request': context['request'],
        'domain_url': context['domain_url'],
        'akvoapp_root_url': context['akvoapp_root_url']
        }


@register.inclusion_tag('inclusion_tags/institutions_sponsor.html',
                        takes_context=True)
def institutions_sponsor(context, project):
    '''Show the individual doante button. CSS in widget_global.css'''
    return {'MEDIA_URL': context['MEDIA_URL'], 'project': project}


@register.inclusion_tag('inclusion_tags/funding_box_wide.html',
                        takes_context=True)
def funding_box_wide(context, project):
    '''Show the funding box used in the widgets. Css in widget_global.css'''
    return {'MEDIA_URL': context['MEDIA_URL'], 'project': project}


@register.inclusion_tag('inclusion_tags/project_thumb.html',
                        takes_context=True)
def project_thumb(context, project, width, height, style='',):
    return {
        'MEDIA_URL': context['MEDIA_URL'],
        'project': project,
        'width': width,
        'height': height,
        'wxh': '%sx%s' % (width, height,),
        'style': style,
    }

@register.inclusion_tag('inclusion_tags/org_logo.html', takes_context=True)
def org_logo(context, org, width, height, style=''):
    return {
        'MEDIA_URL': context['MEDIA_URL'],
        'org': org,
        'width': width,
        'height': height,
        'wxh': '%sx%s' % (width, height,),
        'style': style,
    }


@register.inclusion_tag('inclusion_tags/update_thumb.html',
                        takes_context=True)
def update_thumb(context, update, width, height, style=''):
    return {
        'MEDIA_URL': context['MEDIA_URL'],
        'update': update,
        'width': width,
        'height': height,
        'wxh': '%sx%s' % (width, height,),
        'div_style': style,
    }


@register.inclusion_tag('inclusion_tags/gallery_thumb.html', takes_context=True)
def gallery_thumb(context, image, width, height, caption='', style=''):
    '''
    '''
    return {
        'MEDIA_URL': context['MEDIA_URL'],
        'image': image,
        'width': width,
        'height': height,
        'wxh': '%sx%s' % (width, height,),
        'caption': caption,
        'style': style,
    }


@register.inclusion_tag('inclusion_tags/focus_area.html', takes_context=True)
def focus_area(context, focusarea, projects_link=True):
    '''
    '''
    TITLE, BG_COLOR, OUTER_DIV, INNER_DIV, MORE_URL = 0, 1, 2, 3, 4
    FOCUS_AREA_DATA = {
        'clean': (u'Clean water', '%spvw/img/base/focus_area/clean_water_bkgrd.jpg' % settings.MEDIA_URL, 'height:180px;', '', 'http://%s/web/areas/cleanwater' % Site.objects.get_current()),
        'safety': (u'Safety', '%spvw/img/base/focus_area/sharing_water_bkgrd.jpg' % settings.MEDIA_URL, 'height:180px; width:350px', '', 'http://%s/web/areas/safety' % Site.objects.get_current()),
        'sharing': (u'Sharing water', '%spvw/img/base/focus_area/governance_bkgrd.jpg' % settings.MEDIA_URL, 'height:180px;', 'text-align:right; padding-left:200px;', 'http://%s/web/areas/sharingwater' % Site.objects.get_current()),
        'governance': (u'Governance', '%spvw/img/base/focus_area/safety_bkgrd.jpg' % settings.MEDIA_URL, 'height:180px;', '', 'http://%s/web/areas/governance' % Site.objects.get_current()),
    }
    return {
        'MEDIA_URL': context['MEDIA_URL'],
        'focusarea': focusarea,
        'title': FOCUS_AREA_DATA[focusarea][TITLE],
        'bgrd': FOCUS_AREA_DATA[focusarea][BG_COLOR],
        'outer_div': FOCUS_AREA_DATA[focusarea][OUTER_DIV],
        'inner_div': FOCUS_AREA_DATA[focusarea][INNER_DIV],
        'more_link': FOCUS_AREA_DATA[focusarea][MORE_URL],
        'projects_link': projects_link,
    }


# http://www.nitinh.com/2010/02/django-template-tag-to-protect-the-e-mail-address/
class EncryptEmail(template.Node):
    def __init__(self, context_var):
        self.context_var = template.Variable(context_var)  # context_var

    def render(self, context):
        import random
        email_address = self.context_var.resolve(context)
        character_set = '+-.0123456789@ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz'
        char_list = list(character_set)
        random.shuffle(char_list)

        key = ''.join(char_list)

        cipher_text = ''
        id = 'e' + str(random.randrange(1, 999999999))

        for a in email_address:
            cipher_text += key[character_set.find(a)]

        script = 'var a="'+key+'";var b=a.split("").sort().join("");var c="'+cipher_text+'";var d="";'
        script += 'for(var e=0;e<c.length;e++)d+=b.charAt(a.indexOf(c.charAt(e)));'
        script += 'document.getElementById("'+id+'").innerHTML="<a href=\\"mailto:"+d+"\\">"+d+"</a>"'

        script = "eval(\""+ script.replace("\\","\\\\").replace('"','\\"') + "\")"
        script = '<script type="text/javascript">/*<![CDATA[*/'+script+'/*]]>*/</script>'

        return '<span id="'+ id + '">[javascript protected email address]</span>'+ script


def encrypt_email(parser, token):
    '''
    {% encrypt_email user.email %}
    '''
    tokens = token.contents.split()
    if len(tokens) != 2:
        raise template.TemplateSyntaxError("%r tag accept two argument" % tokens[0])
    return EncryptEmail(tokens[1])
register.tag('encrypt_email', encrypt_email)


class WidthRatioTruncNode(WidthRatioNode):
    def render(self, context):
        try:
            value = self.val_expr.resolve(context)
            maxvalue = self.max_expr.resolve(context)
            max_width = int(self.max_width.resolve(context))
        except template.VariableDoesNotExist:
            return ''
        except ValueError:
            raise template.TemplateSyntaxError("widthratio final argument must be an number")
        try:
            value = float(value)
            maxvalue = float(maxvalue)
            ratio = (value / maxvalue) * max_width
        except (ValueError, ZeroDivisionError):
            return ''
        return str(int(ratio))


@register.tag
def widthratio_trunc(parser, token):
    """
    For creating bar charts and such, this tag calculates the ratio of a given
    value to a maximum value, and then applies that ratio to a constant.

    For example::

        <img src='bar.gif' height='10' width='{% widthratio this_value max_value 100 %}' />

    Above, if ``this_value`` is 175 and ``max_value`` is 200, the image in
    the above example will be 88 pixels wide (because 175/200 = .875;
    .875 * 100 = 87.5 which is rounded up to 88).
    """
    bits = token.contents.split()
    if len(bits) != 4:
        raise template.TemplateSyntaxError("widthratio takes three arguments")
    tag, this_value_expr, max_value_expr, max_width = bits

    return WidthRatioTruncNode(
        parser.compile_filter(this_value_expr),
        parser.compile_filter(max_value_expr),
        parser.compile_filter(max_width)
    )


class QSHiddenInputNode(template.Node):
    def __init__(self, identifiers):
        self.identifiers = identifiers

    def render(self, context):
        get_values = context['request'].GET
        html = ''
        for ident in self.identifiers:
            if ident in get_values.keys():
                html += '<input type="hidden" name="%s" value="%s"/>' % (ident, get_values[ident])
        return html


@register.tag
def hidden_inputs_from_qs(parser, token):
    """
    Generate hidden input tags for query string params that we want to propagate in a form post
    Example: {% hidden_inputs_from_qs sort dir %} captures sort and dir query variables used by
    django-sorting. They can then be put into the form used by django-filter.
    """
    try:
        tag_name, identifiers = token.split_contents()[0], token.split_contents()[1:]
    except:
        raise template.TemplateSyntaxError("The %r tag requires at least one argument" % token.contents.split()[0])

    return QSHiddenInputNode(identifiers)

########################################################################################################################
# This bit originates at https://github.com/bradjasper/django-sorting/ which is a fork of django-sorting that adds a
# param to the anchor tag to determine sort order.
# On top of that is added translation of the anchor label
########################################################################################################################

DEFAULT_SORT_UP = getattr(settings, 'DEFAULT_SORT_UP' , '&uarr;')
DEFAULT_SORT_DOWN = getattr(settings, 'DEFAULT_SORT_DOWN' , '&darr;')
INVALID_FIELD_RAISES_404 = getattr(settings,
                                   'SORTING_INVALID_FIELD_RAISES_404' , False)

sort_directions = {
    'asc': {'icon':DEFAULT_SORT_UP, 'inverse': 'desc'},
    'desc': {'icon':DEFAULT_SORT_DOWN, 'inverse': 'asc'},
    '': {'icon':DEFAULT_SORT_DOWN, 'inverse': 'asc'},
    }

class SortAnchorNode(template.Node):
    """
    Renders an <a> HTML tag with a link which href attribute
    includes the field on which we sort and the direction.
    and adds an up or down arrow if the field is the one
    currently being sorted on.

    Eg.
        {% anchor name Name asc %} generates
        <a href="/the/current/path/?sort=name&dir=asc" title="Name">Name</a>

    """
    def __init__(self, field, title, sortdir):
        self.field = field
        self.title = title
        self.sortdir = sortdir

    def render(self, context):
        request = context['request']
        getvars = request.GET.copy()
        if 'sort' in getvars:
            sortby = getvars['sort']
            del getvars['sort']
        else:
            sortby = ''

        if 'dir' in getvars:
            sortdir = getvars['dir']
            del getvars['dir']
        else:
            sortdir = self.sortdir

        if sortby == self.field:
            getvars['dir'] = sort_directions[sortdir]['inverse']
            icon = sort_directions[sortdir]['icon']
        else:
            # If we're not on the current field, use the default sortdir
            # rather than the order
            if self.sortdir:
                getvars['dir'] = self.sortdir
            icon = ''

        if len(getvars.keys()) > 0:
            urlappend = "&%s" % getvars.urlencode()
        else:
            urlappend = ''

        if icon:
            title = "%s %s" % (self.title, icon)
        else:
            title = self.title

        url = '%s?sort=%s%s' % (request.path, self.field, urlappend)
        return '<a href="%s" title="%s">%s</a>' % (url, self.title, title)

@register.tag
def translated_anchor(parser, token):
    """
    Parses a tag that's supposed to be in this format: {% translated_anchor field title sortdir %}
    This is modified from django_sorting/templatetags/sorting_tags.py to handle translation of the anchor label
    """
    bits = [b.strip('"\'') for b in token.split_contents()]

    if len(bits) < 2:
        raise TemplateSyntaxError, "anchor tag takes at least 1 argument"

    field = bits[1].strip()
    title = field.capitalize()
    sortdir = ''

    if len(bits) >= 3:
        title = bits[2]

    if len(bits) == 4:
        sortdir = bits[3]

    return SortAnchorNode(field, _(title.strip()), sortdir)
