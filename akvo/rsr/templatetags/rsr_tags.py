# -*- coding: utf-8 -*-
"""
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please
    see < http://www.gnu.org/licenses/agpl.html >.
"""
from __future__ import absolute_import

from django import template
from django.template.defaulttags import WidthRatioNode
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
            label = _('No partner role')

        if organisation != project.primary_organisation:
            if organisation in partners_dict:
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

        script = 'var a="' + key + '";var b=a.split("").sort().join("");var c="' + cipher_text + '";var d="";'
        script += 'for(var e=0;e<c.length;e++)d+=b.charAt(a.indexOf(c.charAt(e)));'
        script += 'document.getElementById("' + id + '").innerHTML="<a href=\\"mailto:"+d+"\\">"+d+"</a>"'

        script = "eval(\"" + script.replace("\\", "\\\\").replace('"', '\\"') + "\")"
        script = '<script type="text/javascript">/*<![CDATA[*/' + script + '/*]]>*/</script>'

        return '<span id="' + id + '">[javascript protected email address]</span>' + script


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
