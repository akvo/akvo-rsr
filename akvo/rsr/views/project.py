# -*- coding: utf-8 -*-
"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please see
< http://www.gnu.org/licenses/agpl.html >.
"""

import json
from datetime import datetime

from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.core.exceptions import PermissionDenied
from django.core.urlresolvers import reverse
from django.core.paginator import Page
from django.http import Http404, HttpResponse, HttpResponseRedirect
from django.shortcuts import get_object_or_404, redirect, render
from lxml import etree

from akvo.rsr.models import IndicatorPeriodData
from akvo.utils import get_thumbnail
from .utils import check_project_viewing_permissions, get_hierarchy_grid
from ..forms import ProjectUpdateForm
from ..models import Project, ProjectUpdate
from ...utils import pagination
from ...iati.exports.iati_export import IatiXML


###############################################################################
# Project directory
###############################################################################


def _project_directory_coll(request):
    """Dig out and pass correct projects to the view."""
    page = request.rsr_page
    return (
        page.projects() if page is not None
        else Project.objects.public().published()
    )


def directory(request):
    """The project list view."""
    return render(request, 'project_directory.html', {})


###############################################################################
# Project main
###############################################################################

def _get_carousel_data(project, updates):
    photos = []
    if project.current_image:
        try:
            im = get_thumbnail(project.current_image, '750x400', quality=99)
            photos.append({
                "url": im.url,
                "caption": project.current_image_caption,
                "credit": project.current_image_credit,
                "direct_to_url": '',
            })
        except IOError:
            pass
    for update in updates:
        if update.photo:
            direct_to = reverse('update-main', kwargs={
                'project_id': project.pk,
                'update_id': update.pk
            })
            try:
                im = get_thumbnail(update.photo, '750x400', quality=99)
                photos.append({
                    "url": im.url,
                    "caption": update.photo_caption,
                    "credit": update.photo_credit,
                    "direct_to_url": direct_to,
                })
            except IOError:
                continue
    return {"photos": photos}


def main(request, project_id, template="project_main.html"):
    """
    The main project page, consisting of 6 tabs:

    - 'Summary'
    - 'Full report'
    - 'Project partners'
    - 'Finances'
    - 'Results' (optional, only when project has results)
    - 'Updates' (optional, only when project has updates)

    :param request; Django request.
    :param project_id; ID of a Project object.
    :return A rendered project page.
    """
    project = get_object_or_404(Project, pk=project_id)

    # Permissions
    check_project_viewing_permissions(request, project)

    # Updates
    updates = project.project_updates.prefetch_related('user')
    first_10_updates = updates[:10]

    page_number = request.GET.get('page')

    page, paginator, page_range = pagination(page_number, updates, 10)

    if page_number == '1':
        page = Page(first_10_updates, 1, paginator)

    first_9_updates = first_10_updates[:9]

    # Wordpress custom CSS trigger
    iframe = request.GET.get('iframe')

    # Related documents
    related_documents = []
    for d in project.documents.all():
        if d.url or d.document:
            related_documents += [d]
    related_documents = related_documents[:5]

    # JSON data
    carousel_data = json.dumps(_get_carousel_data(project, first_9_updates))
    accordion_data = json.dumps({
        'background': project.background,
        'current_status': project.current_status,
        'project_plan': project.project_plan,
        'target_group': project.target_group,
        'sustainability': project.sustainability,
        'goals_overview': project.goals_overview
    })

    context = {
        'accordion_data': accordion_data,
        'carousel_data': carousel_data,
        'current_datetime': datetime.now(),
        'page': page,
        'page_range': page_range,
        'paginator': paginator,
        'pledged': project.get_pledged(),
        'project': project,
        'related_documents': related_documents,
        'updates': first_9_updates[:5] if first_9_updates else None,
        'update_timeout': settings.PROJECT_UPDATE_TIMEOUT,
        'update_statuses': json.dumps(dict(IndicatorPeriodData.STATUSES)),
        'user_is_me_manager': 'false',
        'load_wp_css': iframe is not None,
    }

    context = project.project_hierarchy_context(context)
    return render(request, template, context)


#####################
# Project hierarchy #
#####################


def hierarchy(request, project_id, public=True, template='project_hierarchy.html'):
    """."""
    project = get_object_or_404(Project, pk=project_id)

    # Non-editors are not allowed to view unpublished projects
    check_project_viewing_permissions(request, project)

    if public and not project.has_relations():
        raise Http404

    hierarchy_grid = get_hierarchy_grid(project, include_private=not public)

    context = {
        'project': project,
        'hierarchy_grid': hierarchy_grid,
    }

    return render(request, template, context)


###############################################################################################
# Old links, now incorporated in tabs of the project main page, will redirect to project main #
###############################################################################################


def report(request, project_id):
    """Show the full data report tab on the project main page."""
    return HttpResponseRedirect(
        reverse('project-main', kwargs={'project_id': project_id}) + '#report'
    )


def partners(request, project_id):
    """Show the partners tab on the project main page."""
    return HttpResponseRedirect(
        reverse('project-main', kwargs={'project_id': project_id}) + '#partners'
    )


def finance(request, project_id):
    """Show finance tab on the project main page."""
    return HttpResponseRedirect(
        reverse('project-main', kwargs={'project_id': project_id}) + '#finance'
    )

###############################################################################
# Project IATI file
###############################################################################


def iati(request, project_id):
    """Generate the IATI file on-the-fly and return the XML."""
    project = get_object_or_404(Project, pk=project_id)
    if not project.is_public:
        raise PermissionDenied
    xml_data = etree.tostring(etree.ElementTree(IatiXML([project]).iati_activities))
    return HttpResponse(xml_data, content_type="text/xml")


###############################################################################
# Project widgets
###############################################################################


def widgets(request, project_id):
    """."""
    project = get_object_or_404(Project, pk=project_id)
    selected_widget = request.GET.get('widget', None)

    # Do not show private projects, and non-editors are not allowed to view unpublished projects
    if not project.is_public or \
            (not project.is_published() and not request.user.is_anonymous() and
             not request.user.has_perm('rsr.change_project', project)):
        raise PermissionDenied

    context = {
        'project': project,
        'style': 'darkBG',
    }

    if selected_widget in ['narrow', 'cobranded', 'small', 'map', 'list']:
        context['widget'] = selected_widget
        context['domain_url'] = '{}://{}'.format(request.scheme, request.META['HTTP_HOST'])
        return render(request, 'project_widgets2.html', context)

    else:
        return render(request, 'project_widgets.html', context)


@login_required()
def set_update(request, project_id, edit_mode=False, form_class=ProjectUpdateForm, update_id=None):
    """."""
    project = get_object_or_404(Project, id=project_id)

    # Permissions
    check_project_viewing_permissions(request, project)

    # Check if user is allowed to place updates for this project
    allow_update = True if request.user.has_perm('rsr.post_updates', project) else False

    updates = project.updates_desc()[:5]
    update = None
    update_user = None

    if update_id is not None:
        edit_mode = True
        update = get_object_or_404(ProjectUpdate, id=update_id)
        update_user = update.user.get_full_name()
        if not request.user.has_perm('rsr.change_projectupdate', update):
            request.error_message = u'You can only edit your own updates.'
            raise PermissionDenied

    # Prevent adding update if project is completed, cancelled or unpublished
    elif project.iati_status in Project.EDIT_DISABLED or not project.is_published():
        request.error_message = u'Cannot add updates to completed or unpublished projects.'
        raise PermissionDenied

    if request.method == 'POST':
        if not allow_update:
            raise PermissionDenied
        updateform = form_class(request.POST, request.FILES, instance=update)
        if updateform.is_valid():
            if update:
                update = updateform.save(project=project, user=update.user)
            else:
                update = updateform.save(project=project, user=request.user)
            return redirect(update.get_absolute_url())
        else:
            # Django forms takes care of this, and displays the errors!
            pass
    else:
        updateform = form_class(instance=update)

    context = {
        'project': project,
        'updates': updates,
        'update': update,
        'update_user': update_user,
        'updateform': updateform,
        'edit_mode': edit_mode,
        'allow_update': allow_update
    }

    return render(request, 'update_add.html', context)
