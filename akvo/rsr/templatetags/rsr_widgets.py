# -*- coding: utf-8 -*-
"""
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please
    see < http://www.gnu.org/licenses/agpl.html >.
"""

from django import template

register = template.Library()


@register.inclusion_tag('partials/widgets/header.html', takes_context=True)
def rsr_widget_header(context):
    """..."""
    return {}


@register.inclusion_tag('partials/widgets/project_status.html', takes_context=True)
def rsr_widget_project_status(context, project):
    """..."""
    return {'project': context['project']}


@register.inclusion_tag('partials/widgets/project_location.html', takes_context=True)
def rsr_widget_project_location(context, project):
    """..."""
    return {'project': context['project']}


@register.inclusion_tag('partials/widgets/project_status_location.html', takes_context=True)
def rsr_widget_project_status_location(context, project):
    """..."""
    return {'project': context['project']}


@register.inclusion_tag('partials/widgets/project_funding.html', takes_context=True)
def rsr_widget_project_funding(context, project):
    """..."""
    return {'project': context['project']}


@register.inclusion_tag('partials/widgets/project_donate_button.html', takes_context=True)
def rsr_widget_project_donate_button(context, project):
    """..."""
    return {
        'request': context['request'],
        'project': context['project'],
    }


@register.inclusion_tag('partials/widgets/project_progress_bar.html', takes_context=True)
def rsr_widget_project_progress_bar(context, project):
    """..."""
    return {'project': context['project']}


@register.inclusion_tag('partials/widgets/project_budget.html', takes_context=True)
def rsr_widget_project_budget(context, project):
    """..."""
    return {
        'request': context['request'],
        'project': context['project'],
    }
