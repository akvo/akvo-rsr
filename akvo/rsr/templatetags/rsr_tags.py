# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module. 
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django import template
from django.conf import settings
from django.contrib.sites.models import Site
from django.template.defaulttags import WidthRatioNode
from akvo.scripts.asset_manager import map, asset_bundles
register = template.Library()


@register.inclusion_tag('inclusion_tags/funding_box.html', takes_context=True)
def funding_box(context, project):
    '''
	show the funding box used in the widgets. Css definition in widget_global.css   
    '''
    return {'MEDIA_URL': context['MEDIA_URL'], 'p': project}

@register.inclusion_tag('inclusion_tags/funding_table.html', takes_context=True)
def funding_table(context, project):
    '''
	show the funding box used in the widgets. Css definition in widget_global.css   
    '''
    return {'MEDIA_URL': context['MEDIA_URL'], 'p': project}

@register.inclusion_tag('inclusion_tags/funding_project.html', takes_context=True)
def funding_project(context, project):
    '''
	show the funding box used in the widgets. Css definition in widget_global.css   
    '''
    return {'MEDIA_URL': context['MEDIA_URL'], 'p': project}    

@register.inclusion_tag('inclusion_tags/funding_box_narrow.html', takes_context=True)
def funding_box_narrow(context, project):
    '''
	show the funding box used in the widgets. Css definition in widget_global.css   
    '''
    return {'MEDIA_URL': context['MEDIA_URL'], 'p': project}

@register.inclusion_tag('inclusion_tags/funding_box_narrow2.html', takes_context=True)
def funding_box_narrow2(context, project):
    '''
	show the funding box used in the widgets. Css definition in widget_global.css   
    '''
    return {'MEDIA_URL': context['MEDIA_URL'], 'p': project}

@register.inclusion_tag('inclusion_tags/individual_donate_button.html', takes_context=True)
def individual_donate_button(context, project):
    '''
	show the individual doante button. CSS definition in widget_global.css   
    '''
    return {'MEDIA_URL': context['MEDIA_URL'], 'project': project}

@register.inclusion_tag('inclusion_tags/institutions_sponsor.html', takes_context=True)
def institutions_sponsor(context, project):
    '''
	show the individual doante button. CSS definition in widget_global.css   
    '''
    return {'MEDIA_URL': context['MEDIA_URL'], 'project': project}

@register.inclusion_tag('inclusion_tags/project_budget.html', takes_context=True)
def project_budget(context, project):
    '''
	show the individual doante button. CSS definition in widget_global.css   
    '''
    return {'MEDIA_URL': context['MEDIA_URL'], 'p': project}

@register.inclusion_tag('inclusion_tags/funding_box_wide.html', takes_context=True)
def funding_box_wide(context, project):
    '''
	show the funding box used in the widgets. Css definition in widget_global.css   
    '''
    return {'MEDIA_URL': context['MEDIA_URL'], 'p': project}
    
@register.inclusion_tag('inclusion_tags/project_thumb.html', takes_context=True)
def project_thumb(context, project, width, height, style='',):
    '''
    '''
    return {
        'MEDIA_URL' : context['MEDIA_URL'],
        'project'   : project,
        'width'     : width,
        'height'    : height,
        'wxh'       : '%sx%s' % (width, height,),
        'style'     : style,
    }
    
@register.inclusion_tag('inclusion_tags/org_logo.html', takes_context=True)
def org_logo(context, org, width, height, style=''):
    '''
    '''
    return {
        'MEDIA_URL' : context['MEDIA_URL'],
        'org'       : org,
        'width'     : width,
        'height'    : height,
        'wxh'       : '%sx%s' % (width, height,),
        'style'     : style,
    }

@register.inclusion_tag('inclusion_tags/update_thumb.html', takes_context=True)
def update_thumb(context, update, width, height, style=''):
    '''
    '''
    return {
        'MEDIA_URL' : context['MEDIA_URL'],
        'update'    : update,
        'width'     : width,
        'height'    : height,
        'wxh'       : '%sx%s' % (width, height,),
        'div_style' : style,
    }


@register.inclusion_tag('inclusion_tags/update_video.html',
                        takes_context=True)
def update_video(context, update, width, height, style=''):
    template_context = dict(
        MEDIA_URL=context['MEDIA_URL'],
        update=update,
        width=width,
        height=height,
        wxh='%sx%s' % (width, height),
        div_style=style
    )
    return template_context


@register.inclusion_tag('inclusion_tags/gallery_thumb.html', takes_context=True)
def gallery_thumb(context, image, width, height, caption='', style=''):
    '''
    '''
    return {
        'MEDIA_URL' : context['MEDIA_URL'],
        'image'    : image,
        'width'     : width,
        'height'    : height,
        'wxh'       : '%sx%s' % (width, height,),
        'caption'   : caption,
        'style'     : style,
    }
    

@register.inclusion_tag('inclusion_tags/asset_bundle.html', takes_context=True)
def asset_bundle(context, bundle):
    '''
    Uses the akvo/scripts/asset_manager/map.py to retrive a resource file
    '''
    cant_get_map = False
    script_import_string = ''
    include = ''
    try:
        bundle_hash = map.BUNDLE_MAP['%s' % str(bundle)]['hash']
        bundle_type = map.BUNDLE_MAP['%s' % str(bundle)]['type']
        bundle_path = map.BUNDLE_MAP['%s' % str(bundle)]['path']
    except Exception, e:
        print 'Got problems'
        bundle_hash = '000'
        cant_get_map = True

    try:
        dev_mode = settings.ASSET_MANAGER_DEV
    except:
        dev_mode = False
    

    if dev_mode or cant_get_map:
        if asset_bundles.ASSET_BUNDLES['%s' % str(bundle)]['type'] == 'css':
            url = '%s%sbuild/%s_raw.%s' % (settings.MEDIA_URL, bundle_path, bundle, bundle_type)
            script_string = '%s<link rel="stylesheet" href="%s" type="text/css" media="screen" title="main">\n' % (script_import_string, url)
            include = script_string
        else:
            script_import_string = ''
            for file_element in asset_bundles.ASSET_BUNDLES['%s' % str(bundle)]['files']:
                url = '%s%ssrc/%s' % (settings.MEDIA_URL, asset_bundles.ASSET_BUNDLES['%s' % str(bundle)]['path'], file_element)
                script_import_string = '%s<script src="%s" type="text/javascript" charset="utf-8"></script>\n\t' % (script_import_string, url)
            include = script_import_string
    else:
        url = '%s%sbuild/%s_min_%s.%s' % (settings.MEDIA_URL, bundle_path, bundle, bundle_hash, bundle_type)
        if bundle_type == 'css':
            script_string = '%s<link rel="stylesheet" href="%s" type="text/css" media="screen" title="main">\n' % (script_import_string, url)
        else:
            script_string = '%s<script src="%s" type="text/javascript" charset="utf-8"></script>\n' % (script_import_string, url)
        include = script_string

    return {
        'include': include,
    }

@register.inclusion_tag('inclusion_tags/focus_area.html', takes_context=True)
def focus_area(context, focusarea, projects_link=True):
    '''
    '''
    TITLE, BG_COLOR, OUTER_DIV, INNER_DIV, MORE_URL = 0, 1, 2, 3,4 
    FOCUS_AREA_DATA = {
        'clean'         : (u'Clean water', '%spvw/img/base/focus_area/clean_water_bkgrd.jpg' % settings.MEDIA_URL, 'height:180px;', '','http://%s/web/areas/cleanwater' % Site.objects.get_current()),
        'safety'        : (u'Safety', '%spvw/img/base/focus_area/sharing_water_bkgrd.jpg' % settings.MEDIA_URL, 'height:180px; width:350px', '','http://%s/web/areas/safety' % Site.objects.get_current()),
        'sharing'       : (u'Sharing water', '%spvw/img/base/focus_area/governance_bkgrd.jpg' % settings.MEDIA_URL, 'height:180px;', 'text-align:right; padding-left:200px;','http://%s/web/areas/sharingwater' % Site.objects.get_current()),
        'governance'    : (u'Governance', '%spvw/img/base/focus_area/safety_bkgrd.jpg' % settings.MEDIA_URL, 'height:180px;', '','http://%s/web/areas/governance' % Site.objects.get_current()),
    }
    return {
        'MEDIA_URL'     : context['MEDIA_URL'],
        'focusarea'     : focusarea,
        'title'         : FOCUS_AREA_DATA[focusarea][TITLE],
        'bgrd'          : FOCUS_AREA_DATA[focusarea][BG_COLOR],
        'outer_div'     : FOCUS_AREA_DATA[focusarea][OUTER_DIV],
        'inner_div'     : FOCUS_AREA_DATA[focusarea][INNER_DIV],
        'more_link'     : FOCUS_AREA_DATA[focusarea][MORE_URL],
        'projects_link' : projects_link,
    }

# http://www.nitinh.com/2010/02/django-template-tag-to-protect-the-e-mail-address/
class EncryptEmail(template.Node): 
    def __init__(self, context_var): 
        self.context_var = template.Variable(context_var) # context_var 
    def render(self, context): 
        import random 
        email_address = self.context_var.resolve(context) 
        character_set = '+-.0123456789@ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz' 
        char_list = list(character_set) 
        random.shuffle(char_list)   
        
        key = ''.join(char_list)   
        
        cipher_text = '' 
        id = 'e' + str(random.randrange(1,999999999))   
        
        for a in email_address: 
            cipher_text += key[ character_set.find(a) ]
            
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
    if len(tokens)!=2: 
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


