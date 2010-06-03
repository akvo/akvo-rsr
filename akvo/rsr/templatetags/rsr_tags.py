# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module. 
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
import os

from django import template
from django.conf import settings
from django.utils.translation import ugettext_lazy as _

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

from akvo.scripts.media_packer import map, media_bundles
@register.inclusion_tag('inclusion_tags/media_bundle.html', takes_context=True)
def media_bundle(context, bundle):
    '''
    Uses the akvo/scripts/media_packer/map.py to retrive a resource file
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
    
    if settings.DEV_MEDIA_BUNDLES or cant_get_map:
        if media_bundles.MEDIA_BUNDLES['%s' % str(bundle)]['type'] == 'css':
            url = '%s%s%s_raw.%s' % (settings.MEDIA_URL, bundle_path, bundle, bundle_type)
            script_string = '%s<link rel="stylesheet" href="%s" type="text/css" media="screen" title="main">\n' % (script_import_string, url)
            include = script_string
        else:
            script_import_string = ''
            for file_element in media_bundles.MEDIA_BUNDLES['%s' % str(bundle)]['files']:
                url = '%s%s%s' % (settings.MEDIA_URL, media_bundles.MEDIA_BUNDLES['%s' % str(bundle)]['path'], file_element)
                script_import_string = '%s<script src="%s" type="text/javascript" charset="utf-8"></script>\n\t' % (script_import_string, url)
            include = script_import_string
    else:
        url = '%s%s%s_min_%s.%s' % (settings.MEDIA_URL, bundle_path, bundle, bundle_hash, bundle_type)
        if bundle_type == 'css':
            script_string = '%s<link rel="stylesheet" href="%s" type="text/css" media="screen" title="main">\n' % (script_import_string, url)
        else:
            script_string = '%s<script src="%s" type="text/javascript" charset="utf-8"></script>\n' % (script_import_string, url)
        include = script_string
    
    return {
        'MEDIA_URL' : context['MEDIA_URL'], 'raw': settings.DEV_MEDIA_BUNDLES, 'include': include, 'bundle_type': bundle_type,
    }






















 