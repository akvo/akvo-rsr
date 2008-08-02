from django import template
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