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
from django.db.models import Max
from django.forms.models import model_to_dict
from django.http import HttpResponseRedirect, Http404
from django.shortcuts import get_object_or_404, render, redirect
from django.templatetags.static import static

from tastypie.models import ApiKey

from akvo.codelists.models import Country
from akvo.rsr.models import IndicatorPeriodData, User, UserProjects, ProjectHierarchy
from akvo.rsr.models.user_projects import InvalidPermissionChange, check_collaborative_user
from akvo.rsr.permissions import user_accessible_projects, EDIT_ROLES, NO_EDIT_ROLES
from ..forms import (ProfileForm, UserOrganisationForm, UserAvatarForm, SelectOrgForm,
                     RSRPasswordChangeForm)
from ..filters import remove_empty_querydict_items
from ...utils import codelist_name, pagination, filter_query_string
from ..models import Employment, Organisation, Project


def manageable_objects(user):
    """
    Return all employments, organisations and groups the user can "manage"
    :param user: a User object
    :return: a dict with three query sets of Employment, Organisation and Group objects
        The Employment and Organisation query sets consits of objects that user may manage while
        roles is a QS of the RSR Group models, minus the "Admins" group if user is not an org_admin
        or "higher"
    NOTE: this is a refactoring of some inline code that used to be in my_rsr.user_management. We
    need the exact same set of employments in UserProjectsAccessViewSet.get_queryset()
    """
    groups = settings.REQUIRED_AUTH_GROUPS
    non_admin_groups = [group for group in groups if group != 'Admins']
    if user.is_admin or user.is_superuser:
        # Superusers or RSR Admins can manage and invite someone for any organisation
        employments = Employment.objects.select_related().prefetch_related('group')
        organisations = Organisation.objects.all()
        roles = Group.objects.filter(name__in=groups)
    else:
        # Others can only manage or invite users to their own organisation, or the
        # organisations that they content own
        connected_orgs = user.approved_organisations()
        connected_orgs_list = [
            org.pk for org in connected_orgs if user.has_perm('rsr.user_management', org)
        ]
        organisations = Organisation.objects.filter(pk__in=connected_orgs_list).\
            content_owned_organisations()
        if user.approved_employments().filter(group__name='Admins').exists():
            roles = Group.objects.filter(name__in=groups)
            employments = organisations.employments()
        else:
            roles = Group.objects.filter(name__in=non_admin_groups)
            employments = organisations.employments().exclude(user=user)

    return dict(
        employments=employments,
        organisations=organisations,
        roles=roles,
    )


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


@login_required
def my_updates(request):
    """
    If the user is logged in, he/she can view a list of own updates.

    :param request; A Django request.
    """
    updates = request.user.updates().select_related('project', 'user')

    q = request.GET.get('q')
    if q:
        q_list = q.split()
        for q_item in q_list:
            updates = updates.filter(title__icontains=q_item)
    qs = remove_empty_querydict_items(request.GET)
    page = request.GET.get('page')
    page, paginator, page_range = pagination(page, updates, 10)

    org_admin_view = True if request.user.get_admin_employment_orgs() or \
        request.user.is_admin or request.user.is_superuser else False

    context = {
        'page': page,
        'paginator': paginator,
        'page_range': page_range,
        'q': filter_query_string(qs),
        'q_search': q,
        'org_admin_view': org_admin_view,
    }
    return render(request, 'myrsr/my_updates.html', context)


def user_viewable_projects(user, show_restricted=False, programs=None, filter_program=None):
    """Return list of all projects a user can view

    If a project is unpublished, and the user is not allowed to edit that
    project, the project is not displayed in the list.

    Any projects where the user's access has been restricted (using fine-access
    control) are also not shown.

    """
    # User groups
    employments = user.approved_employments()

    # Get project list
    if user.is_superuser or user.is_admin:
        # Superuser and general admins are allowed to see all projects
        projects = Project.objects.all()

    else:
        # For each employment, check if the user is allowed to edit projects (e.g. not a 'User' or
        # 'User Manager'). If not, do not show the unpublished projects of that organisation.
        projects = Project.objects.none()
        # Not allowed to edit roles
        non_editor_roles = employments.filter(group__name__in=NO_EDIT_ROLES)
        uneditable_projects = user.my_projects(
            group_names=NO_EDIT_ROLES, show_restricted=show_restricted).published()
        projects = (
            projects | user_accessible_projects(user, non_editor_roles, uneditable_projects)
        )
        # Allowed to edit roles
        editor_roles = employments.exclude(group__name__in=NO_EDIT_ROLES)
        editable_projects = user.my_projects(
            group_names=EDIT_ROLES, show_restricted=show_restricted)
        projects = (
            projects | user_accessible_projects(user, editor_roles, editable_projects)
        )
        projects = projects.distinct()

    if filter_program:
        programs = ProjectHierarchy.objects.select_related('root_project')

        if filter_program is not -1:
            programs = programs.filter(root_project=filter_program)

        programs_projects = set()
        for program in programs:
            programs_projects.update(program.project_ids)

        projects = projects.exclude(pk__in=programs_projects) if filter_program is -1 \
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
def user_management(request):
    """
    Show the user management page. It is possible to manage employments on this page, e.g. approve
    an employment or change the group of a certain employment. Also allows users to invite other
    users.

    :param request; a Django request.
    """

    def _restrictions_turned_on(user):
        if user.approved_organisations().filter(enable_restrictions=True).exists():
            return True
        return False

    admin = request.user

    if not admin.has_perm('rsr.user_management'):
        raise PermissionDenied

    org_admin = admin.approved_employments().filter(group__name='Admins').exists() or \
        admin.is_admin or admin.is_superuser

    manageables = manageable_objects(admin)

    employments = manageables['employments']
    organisations_list = list(manageables['organisations'].values('id', 'name'))
    roles_list = list(manageables['roles'].values('id', 'name').order_by('name'))

    q = request.GET.get('q')
    if q:
        q_list = q.split()
        for q_item in q_list:
            employments = employments.filter(user__username__icontains=q_item) | \
                employments.filter(user__first_name__icontains=q_item) | \
                employments.filter(user__last_name__icontains=q_item) | \
                employments.filter(organisation__name__icontains=q_item) | \
                employments.filter(organisation__long_name__icontains=q_item)

    # Order employments in reverse chronological order, but also group
    # employments by the user.
    employments = employments.annotate(max_id=Max('user__employers__id'))
    employments = employments.order_by('-max_id', '-id').select_related(
        'user',
        'organisation',
        'group',
    )

    # Show only approved employments
    employments = employments.exclude(is_approved=False)

    qs = remove_empty_querydict_items(request.GET)
    page = request.GET.get('page')
    page, paginator, page_range = pagination(page, employments, 10)

    employments_array = []
    for employment in page:
        employment_dict = model_to_dict(employment)
        employment_dict['other_groups'] = roles_list
        if employment.country:
            employment_dict["country"] = codelist_name(Country, employment, 'country')
        if employment.group:
            group_dict = model_to_dict(employment.group, fields=['id', 'name'])
            employment_dict["group"] = group_dict
        if employment.organisation:
            organisation_dict = model_to_dict(employment.organisation, fields=[
                'id', 'name', 'long_name'
            ])
            employment_dict["organisation"] = organisation_dict
        if employment.user:
            user_dict = model_to_dict(employment.user, fields=[
                'id', 'first_name', 'last_name', 'email'
            ])

            if _restrictions_turned_on(admin):
                # determine if this user's project access can be restricted
                # TODO: this needs fixing, since a user can be admin for one org and project editor
                # for another, or have an employment pending approval while being approved for
                # another org
                if employment.user.has_perm('rsr.user_management',
                                            employment.organisation) or not employment.is_approved:
                    can_be_restricted = False
                else:
                    try:
                        check_collaborative_user(admin, employment.user)
                        can_be_restricted = True
                        user_projects = UserProjects.objects.filter(user=employment.user)
                        if user_projects.exists():
                            user_dict['is_restricted'] = user_projects[0].is_restricted
                            user_dict['restricted_count'] = admin.admin_projects().filter(
                                pk__in=user_projects[0].projects.all()
                            ).count()
                    except InvalidPermissionChange:
                        can_be_restricted = False

                user_dict['can_be_restricted'] = can_be_restricted
            else:
                user_dict['can_be_restricted'] = False

            employment_dict["user"] = user_dict
        employments_array.append(employment_dict)

    context = dict(
        employments=json.dumps(employments_array),
        org_admin=org_admin,
        organisations=json.dumps(organisations_list),
        roles=json.dumps(roles_list),
        page=page,
        paginator=paginator,
        page_range=page_range,
    )

    if q:
        context['q_search'] = q
    context['q'] = filter_query_string(qs)

    return render(request, 'myrsr/user_management.html', context)


@login_required
def user_projects(request, user_id):

    user = get_object_or_404(User, pk=user_id)
    manageables = manageable_objects(request.user)
    manageable_users = manageables['employments'].users()
    if user not in manageable_users:
        raise PermissionDenied

    context = {
        "user_projects_user": user
    }
    return render(request, 'myrsr/user_projects.html', context)


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
