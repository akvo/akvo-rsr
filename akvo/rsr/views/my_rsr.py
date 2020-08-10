# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""

import json

from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import Group
from django.core.exceptions import PermissionDenied
from django.core.urlresolvers import reverse
from django.http import HttpResponseRedirect, Http404
from django.shortcuts import get_object_or_404, render, redirect
from django.templatetags.static import static

from tastypie.models import ApiKey

from akvo.codelists.models import Country
from akvo.rsr.models import IndicatorPeriodData, ProjectHierarchy
from akvo.rsr.permissions import EDIT_ROLES, NO_EDIT_ROLES
from ..forms import (ProfileForm, UserOrganisationForm, UserAvatarForm, SelectOrgForm,
                     RSRPasswordChangeForm)
from ..models import Organisation, Project


@login_required
def my_rsr(request):
    """
    Redirect to the 'My Projects' page in MyRSR, if the user is logged in.

    :param request; A Django request.
    """
    return HttpResponseRedirect(reverse('my_projects', args=[]))


@login_required
def my_details(request):
    """
    If the user is logged in, he/she can change his user details and password here. In addition,
    the user can request to join an organisation.

    :param request; A Django request.
    """
    if request.method == "POST" and 'avatar' in request.FILES:
        request.FILES['avatar'].name = request.FILES['avatar'].name.encode('ascii', 'ignore')
        avatar_form = UserAvatarForm(request.POST, request.FILES, instance=request.user)
        if avatar_form.is_valid():
            avatar_form.save()
        return HttpResponseRedirect(reverse('my_details'))

    profile_form = ProfileForm(
        initial={
            'email': request.user.email,
            'first_name': request.user.first_name,
            'last_name': request.user.last_name
        }
    )
    organisation_form = UserOrganisationForm()
    avatar_form = UserAvatarForm()

    json_data = json.dumps({'user': request.user.employments_dict([])})

    organisation_count = Organisation.objects.all().count()
    country_count = Country.objects.all().count()

    change_password_form = RSRPasswordChangeForm(request.user)

    api_key = ApiKey.objects.get_or_create(user=request.user)[0].key

    context = {
        'organisation_count': organisation_count,
        'country_count': country_count,
        'user_data': json_data,
        'profileform': profile_form,
        'organisationform': organisation_form,
        'avatarform': avatar_form,
        'change_password_form': change_password_form,
        'api_key': api_key,
    }

    return render(request, 'myrsr/my_details.html', context)


def user_viewable_projects(user, show_restricted=False, filter_program=None):
    """Return list of all projects a user can view

    If a project is unpublished, and the user is not allowed to edit that
    project, the project is not displayed in the list.

    Any projects where the user's access has been restricted (using fine-access
    control) are also not shown.

    """
    # Get project list
    if user.is_superuser or user.is_admin:
        # Superuser and general admins are allowed to see all projects
        projects = Project.objects.all()

    else:
        # For each employment, check if the user is allowed to edit projects (e.g. not a 'User' or
        # 'User Manager'). If not, do not show the unpublished projects of that organisation.
        projects = Project.objects.none()
        # Not allowed to edit roles
        uneditable_projects = user.my_projects(
            group_names=NO_EDIT_ROLES, show_restricted=show_restricted).published()
        projects = projects | uneditable_projects
        # Allowed to edit roles
        editable_projects = user.my_projects(
            group_names=EDIT_ROLES, show_restricted=show_restricted)
        projects = projects | editable_projects
        projects = projects.distinct()

    if filter_program:
        programs = ProjectHierarchy.objects.select_related('root_project')

        if filter_program != -1:
            programs = programs.filter(root_project=filter_program)

        programs_projects = set()
        for program in programs:
            programs_projects.update(program.project_ids)

        projects = projects.exclude(pk__in=programs_projects) if filter_program == -1 \
            else projects.filter(pk__in=programs_projects)

    return projects


@login_required
def my_iati(request):
    """
    If the user is logged in and has sufficient permissions (Admins, M&E Managers and Project
    Editors), he/she can view and create IATI files.

    :param request; A Django request.
    """
    user = request.user

    if not user.has_perm('rsr.project_management'):
        raise PermissionDenied

    org = request.GET.get('org')
    new_export = request.GET.get('new')

    selected_org = None
    select_org_form = SelectOrgForm(user)

    superuser = user.is_superuser or user.is_admin
    if not (org or superuser) and user.approved_organisations().count() == 1:
        selected_org = user.approved_organisations()[0]

    elif org:
        try:
            selected_org = Organisation.objects.get(pk=int(org))
        except (Organisation.DoesNotExist, ValueError):
            raise PermissionDenied
        if not (superuser or user.has_perm('rsr.change_organisation', selected_org)):
            raise PermissionDenied

    context = {
        'select_org_form': select_org_form,
        'selected_org': selected_org,
        'new_export': new_export
    }

    return render(request, 'myrsr/my_iati.html', context)


@login_required
def my_project(request, project_id, template='myrsr/my_project.html'):
    """Project results, updates and reports CRUD view

    The page allows adding updates, creating reports, adding/changing results
    and narrative reports. So, this page should be visible to any org user, but
    tabs are shown based on the permissions of the user.

    :param request; A Django HTTP request and context
    :param project_id; The ID of the project

    """
    project = get_object_or_404(Project, pk=project_id)
    user = request.user

    # FIXME: Can reports be generated on EDIT_DISABLED projects?
    if project.iati_status in Project.EDIT_DISABLED:
        raise PermissionDenied

    # Adding an update is the action that requires least privileges - the view
    # is shown if a user can add updates to the project.
    if not user.has_perm('rsr.add_projectupdate', project) or not project.is_published():
        raise PermissionDenied

    me_managers_group = Group.objects.get(name='M&E Managers')
    admins_group = Group.objects.get(name='Admins')
    me_managers = project.publishing_orgs.employments().approved().\
        filter(group__in=[admins_group, me_managers_group])
    # Can we unlock and approve?
    user_is_me_manager = user.has_perm('rsr.do_me_manager_actions')
    show_narrative_reports = project.partners.filter(
        id__in=settings.NARRATIVE_REPORTS_BETA_ORGS
    ).exists() and user.has_perm('rsr.add_narrativereport', project)
    show_results = user.has_perm('rsr.add_indicatorperioddata', project)

    context = {
        'project': project,
        'user': user,
        'me_managers': me_managers.exists(),
        # JSON data for the client-side JavaScript
        'update_statuses': json.dumps(dict(IndicatorPeriodData.STATUSES)),
        'user_is_me_manager': json.dumps(user_is_me_manager),
        'show_narrative_reports': json.dumps(show_narrative_reports),
        'show_results': json.dumps(show_results),
        'can_edit_project': json.dumps(user.can_edit_project(project)),
    }

    context = project.project_hierarchy_context(context)
    return render(request, template, context)


def logo(request):
    logo = static('rsr/images/rsrLogo.svg')
    site = request.rsr_page
    if site is not None and site.logo is not None:
        logo = site.logo.url
    return redirect(logo)


def css(request):
    site = request.rsr_page
    if site is not None and site.stylesheet is not None:
        return redirect(site.stylesheet.url)
    raise Http404('No custom CSS file defined')
