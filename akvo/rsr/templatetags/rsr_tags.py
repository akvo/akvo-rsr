# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module. 
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
import os

from django import template
from django.conf import settings
from django.utils.translation import ugettext_lazy as _
from akvo.scripts.media_packer import media_packer

register = template.Library()

@register.inclusion_tag('inclusion_tags/funding_bar.html')
def funding_bar(project):
    '''
    crete the bar graphic showing the total amount of money the project needs
    and how much is currently pledged
    '''
    return {'p': project}

@register.inclusion_tag('inclusion_tags/category_icons.html', takes_context=True)
def category_icons(context, project):
    '''
    show icons for the categories the project entails
    '''
    return {'MEDIA_URL': context['MEDIA_URL'], 'p': project}

@register.inclusion_tag('inclusion_tags/category_icons_org.html', takes_context=True)
def category_icons_org(context, organisation):
    '''
    show icons for the categories the project entails
    '''
    return {'MEDIA_URL': context['MEDIA_URL'], 'o': organisation}

@register.inclusion_tag('inclusion_tags/submit_button.html')
def submit_button(caption, css_class):
    '''
    form submit and cancel buttons, with caption for the submit button
    '''
    return {'caption': caption, 'css_class': css_class}

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

@register.inclusion_tag('inclusion_tags/funding_box_march.html', takes_context=True)
def funding_box_march(context, project):
    '''
	show the funding box used in the widgets. Css definition in widget_global.css   
    '''
    return {'MEDIA_URL': context['MEDIA_URL'], 'p': project}

@register.inclusion_tag('inclusion_tags/funding_box_march_directory.html', takes_context=True)
def funding_box_march_directory(context, project):
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
def project_thumb(context, project, width, height, style=''):
    '''
    '''
    return {
        'MEDIA_URL' : context['MEDIA_URL'],
        'project'   : project,
        'width'     : width,
        'height'    : height,
        'wxh'       : '%sx%s' % (width, height,),
        'div_style'     : style,
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
        'div_style' : style,
    }
    
@register.inclusion_tag('inclusion_tags/map_thumb.html', takes_context=True)
def map_thumb(context, object, width, height, style=''):
    '''
    '''
    return {
        'MEDIA_URL' : context['MEDIA_URL'],
        'object'    : object,
        'width'     : width,
        'height'    : height,
        'wxh'       : '%sx%s' % (width, height,),
        'div_style'     : style,
    }

@register.inclusion_tag('inclusion_tags/update_thumb.html', takes_context=True)
def update_thumb(context, update, width, height):
    '''
    '''
    return {
        'MEDIA_URL' : context['MEDIA_URL'],
        'update'    : update,
        'width'     : width,
        'height'    : height,
        'wxh'       : '%sx%s' % (width, height,),
    }
    
@register.inclusion_tag('inclusion_tags/styles.html', takes_context=True)
def media_bundle(context, bundle):
    '''
    Todo: What happens on first request without any map? Return something from the media_packer script to wait for it. 
    '''
    
    bundle_hash = '111'
    try:
        from akvo.scripts.media_packer import bundle_map
        bundle_hash = bundle_map.BUNDLE_MAP['%s' % str(bundle)]
        
    except Exception, e:
        media_packer.main()
    

    if settings.STYLES_RAW:
        bundle_path = 'akvo/css/%s_raw.%s' % (bundle,'css')
    else:
        bundle_path = 'akvo/css/%s_min_%s.%s' % (bundle, bundle_hash, 'css')
    
    return {
        'MEDIA_URL' : context['MEDIA_URL'], 'raw': settings.STYLES_RAW, 'bundle_path': bundle_path,
    }






















 