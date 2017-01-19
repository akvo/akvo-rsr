# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""

from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import Group
from django.core.exceptions import PermissionDenied
from django.core.urlresolvers import reverse
from django.db.models import Max
from django.forms.models import model_to_dict
from django.http import HttpResponseRedirect, Http404
from django.shortcuts import get_object_or_404, render

from tastypie.models import ApiKey

from akvo.codelists.models import Country, Version
from akvo.codelists.store.codelists_v202 import SECTOR_CATEGORY,SECTOR

from ..forms import (PasswordForm, ProfileForm, UserOrganisationForm, UserAvatarForm,
                     SelectOrgForm)
from ..filters import remove_empty_querydict_items
from ...utils import codelist_name, codelist_choices, pagination, filter_query_string
from ..models import (Employment, Organisation, OrganisationCustomField, Project,
                      ProjectEditorValidation, ProjectEditorValidationSet, Result, Indicator)

import json


@login_required
def my_rsr(request):
    """
    Redirect to the 'My Details' page in MyRSR, if the user is logged in.

    :param request; A Django request.
    """
    return HttpResponseRedirect(reverse('my_details', args=[]))


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

    change_password_form = PasswordForm(request.user)

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
    updates = request.user.updates().select_related('project')

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


@login_required
def my_projects(request):
    """
    If the user is logged in, he/she can view a list of projects linked to the user account.

    :param request; A Django request.
    """

    # User groups
    not_allowed_to_edit = ['Users', 'User Managers', ]

    # Get user organisation information
    employments = request.user.approved_employments()
    organisations = employments.organisations()
    creator_organisations = organisations.filter(can_create_projects=True).\
        values_list('id', flat=True)

    # Get project list
    if request.user.is_superuser or request.user.is_admin:
        # Superuser and general admins are allowed to see all projects
        projects = Project.objects.all()
    else:
        # For each employment, check if the user is allowed to edit projects (e.g. not a 'User' or
        # 'User Manager'). If not, do not show the unpublished projects of that organisation.
        projects = Project.objects.none()
        for employment in employments:
            if employment.group and employment.group.name not in not_allowed_to_edit:
                projects = projects | employment.organisation.all_projects()
            else:
                projects = projects | employment.organisation.all_projects().published()
        projects = projects.distinct()

    # Custom filter on project id or (sub)title
    q = request.GET.get('q')
    if q:
        try:
            project_pk = int(q)
            projects = projects.filter(pk=project_pk)
        except Project.DoesNotExist:
            Project.objects.none()
        except ValueError:
            q_list = q.split()
            for q_item in q_list:
                projects = projects.filter(title__icontains=q_item) | \
                    projects.filter(subtitle__icontains=q_item)

    # Pagination
    qs = remove_empty_querydict_items(request.GET)
    page = request.GET.get('page')
    page, paginator, page_range = pagination(page, projects, 10)

    # Get related objects of page at once
    page.object_list = page.object_list.select_related('validations').\
        prefetch_related('publishingstatus')

    # Add custom fields in case user adds a new project
    new_project_custom_fields = OrganisationCustomField.objects.filter(
        organisation__in=organisations
    )

    context = {
        'organisations': organisations,
        'new_project_custom_fields': new_project_custom_fields,
        'page': page,
        'paginator': paginator,
        'page_range': page_range,
        'q': filter_query_string(qs),
        'q_search': q,
        'reportable_organisations': creator_organisations
    }
    return render(request, 'myrsr/my_projects.html', context)


@login_required
def project_editor_select(request):
    """
    Project editor without a project selected. Only accessible to Admins, Project editors and
    M&E Managers.

    :param request; A Django HTTP request and context
    """
    user = request.user
    me_managers = Group.objects.get(name='M&E Managers')
    admins = Group.objects.get(name='Admins')
    project_editors = Group.objects.get(name='Project Editors')

    if not (user.is_admin or user.is_superuser or user.in_group(me_managers) or
            user.in_group(admins) or user.in_group(project_editors)):
        raise PermissionDenied

    projects = Project.objects.all() if user.is_admin or user.is_superuser else user.my_projects()

    context = {
        'user': user,
        'projects': projects,
    }

    return render(request, 'myrsr/select_project.html', context)


@login_required
def project_editor(request, project_id):
    """
    If the user is logged in and has sufficient permissions (Admins, M&E Managers and Project
    Editors), he/she can edit the selected project.

    :param request; A Django request.
    :param project_id; The selected project's ID.
    """
    try:
        project = Project.objects.prefetch_related(
            'related_projects',
            'related_projects__project',
            'related_projects__related_project',
            'contacts',
            'partnerships',
            'partnerships__organisation',
            'results',
            'results__indicators',
            'results__indicators__references',
            'results__indicators__periods',
            'results__indicators__periods__data',
            'results__indicators__periods__actual_dimensions',
            'results__indicators__periods__target_dimensions',
            'results__indicators__periods__actual_locations',
            'results__indicators__periods__target_locations',
            'conditions',
            'budget_items',
            'budget_items__label',
            'country_budget_items',
            'transactions',
            'transactions__provider_organisation',
            'transactions__receiver_organisation',
            'transactions__sectors',
            'planned_disbursements',
            'locations',
            'locations__country',
            'locations__administratives',
            'recipient_countries',
            'recipient_regions',
            'sectors',
            'policy_markers',
            'links',
            'documents',
            'keywords',
        ).select_related(
            'publishingstatus__status'
        ).get(pk=project_id)
    except Project.DoesNotExist:
        return Http404

    if (not request.user.has_perm('rsr.change_project', project) or project.iati_status in Project.EDIT_DISABLED) and not \
            (request.user.is_superuser or request.user.is_admin):
        raise PermissionDenied

    # Custom fields
    custom_fields_section_1 = project.custom_fields.filter(section=1).order_by('order', 'id')
    custom_fields_section_2 = project.custom_fields.filter(section=2).order_by('order', 'id')
    custom_fields_section_3 = project.custom_fields.filter(section=3).order_by('order', 'id')
    custom_fields_section_4 = project.custom_fields.filter(section=4).order_by('order', 'id')
    custom_fields_section_5 = project.custom_fields.filter(section=5).order_by('order', 'id')
    custom_fields_section_6 = project.custom_fields.filter(section=6).order_by('order', 'id')
    custom_fields_section_7 = project.custom_fields.filter(section=7).order_by('order', 'id')
    custom_fields_section_8 = project.custom_fields.filter(section=8).order_by('order', 'id')
    custom_fields_section_9 = project.custom_fields.filter(section=9).order_by('order', 'id')
    custom_fields_section_10 = project.custom_fields.filter(section=10).order_by('order', 'id')
    custom_fields_section_11 = project.custom_fields.filter(section=11).order_by('order', 'id')

    # Validations / progress bars
    validations = ProjectEditorValidation.objects.select_related('validation_set')
    validation_sets = ProjectEditorValidationSet.objects.all()
    project_validation_sets = project.validations.all()

    # IATI fields
    countries = Country.objects.filter(version=Version.objects.get(code=settings.IATI_VERSION))
    dac5_codes = codelist_choices(SECTOR)
    dac3_codes = codelist_choices(SECTOR_CATEGORY)

    # Permissions
    org_permissions = []
    for approved_org in request.user.approved_organisations():
        if request.user.admin_of(approved_org) or request.user.me_manager_of(approved_org) or \
                request.user.project_editor_of(approved_org):
            org_permissions.append(approved_org.pk)

    # Check for default indicator
    results = Result.objects.filter(project_id=project)
    default_indicator = Indicator.objects.filter(result_id__in=results, default_periods=True)
    if default_indicator:
        default_indicator = default_indicator[0].id
    else:
        default_indicator = '-1'

    context = {
        'id': project_id,
        'project': project,
        'projectmodel': Project,

        # Permissions
        'is_admin': request.user.is_admin or request.user.is_superuser,
        'org_permissions': list(set(org_permissions)),

        # Validation
        'validations': validations,
        'validation_sets': validation_sets,
        'project_validation_sets': project_validation_sets,

        # IATI fields
        'countries': countries,
        'dac5_codes': dac5_codes,
        'dac3_codes': dac3_codes,

        # Default indicator
        'default_indicator': default_indicator,

        # Custom fields
        'custom_fields_section_1': custom_fields_section_1,
        'custom_fields_section_2': custom_fields_section_2,
        'custom_fields_section_3': custom_fields_section_3,
        'custom_fields_section_4': custom_fields_section_4,
        'custom_fields_section_5': custom_fields_section_5,
        'custom_fields_section_6': custom_fields_section_6,
        'custom_fields_section_7': custom_fields_section_7,
        'custom_fields_section_8': custom_fields_section_8,
        'custom_fields_section_9': custom_fields_section_9,
        'custom_fields_section_10': custom_fields_section_10,
        'custom_fields_section_11': custom_fields_section_11,
    }

    return render(request, 'myrsr/project_editor/project_editor.html', context)


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
def my_reports(request):
    """
    If the user is logged in, he/she can create reports based on a project or organisation.

    :param request; A Django request.
    """
    return render(request, 'myrsr/my_reports.html', {})


@login_required
def user_management(request):
    """
    Show the user management page. It is possible to manage employments on this page, e.g. approve
    an employment or change the group of a certain employment. Also allows users to invite other
    users.

    :param request; a Django request.
    """
    user = request.user

    if not user.has_perm('rsr.user_management'):
        raise PermissionDenied

    org_admin = user.approved_employments().filter(group__name='Admins').exists() or \
        user.is_admin or user.is_superuser
    groups = ['Users', 'User Managers', 'Project Editors', 'M&E Managers', 'Admins']

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
        if org_admin:
            roles = Group.objects.filter(name__in=groups)
            employments = organisations.employments()
        else:
            roles = Group.objects.filter(name__in=groups[:-1])
            employments = organisations.employments().exclude(user=user)

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
    employments = employments.order_by('-max_id', '-id')

    qs = remove_empty_querydict_items(request.GET)
    page = request.GET.get('page')
    page, paginator, page_range = pagination(page, employments, 10)

    all_groups = [
        Group.objects.get(name='Users'),
        Group.objects.get(name='User Managers'),
        Group.objects.get(name='Project Editors'),
        Group.objects.get(name='M&E Managers'),
        Group.objects.get(name='Admins')
    ]

    employments_array = []
    for employment in page:
        employment_dict = model_to_dict(employment)
        if org_admin:
            employment_dict['other_groups'] = [
                model_to_dict(group, fields=['id', 'name']) for group in all_groups
            ]
        else:
            employment_dict['other_groups'] = [
                model_to_dict(group, fields=['id', 'name']) for group in all_groups[:-1]
            ]
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
            employment_dict["user"] = user_dict
        employments_array.append(employment_dict)

    organisations_list = []
    for organisation in organisations:
        organisation_dict = {'id': organisation.id, 'name': organisation.name}
        organisations_list.append(organisation_dict)

    roles_list = []
    for role in roles:
        roles_dict = {'id': role.id, 'name': role.name}
        roles_list.append(roles_dict)

    context = {}
    if employments_array:
        context['employments'] = json.dumps(employments_array)
    context['org_admin'] = org_admin
    context['organisations'] = json.dumps(organisations_list)
    context['roles'] = json.dumps(roles_list)
    context['page'] = page
    context['paginator'] = paginator
    context['page_range'] = page_range
    if q:
        context['q_search'] = q
    context['q'] = filter_query_string(qs)

    return render(request, 'myrsr/user_management.html', context)


@login_required
def my_results_select(request):
    """
    My results section without a project selected. Only accessible to M&E Managers, Admins and
    Project editors.

    :param request; A Django HTTP request and context
    """
    user = request.user
    me_managers = Group.objects.get(name='M&E Managers')
    admins = Group.objects.get(name='Admins')
    project_editors = Group.objects.get(name='Project Editors')

    if not (user.is_admin or user.is_superuser or user.in_group(me_managers) or
            user.in_group(admins) or user.in_group(project_editors)):
        raise PermissionDenied

    return render(request, 'myrsr/my_results_select.html', {})


@login_required
def my_results(request, project_id):
    """
    My results section. Only accessible to M&E Managers, Admins and Project editors.

    :param request; A Django HTTP request and context
    :param project_id; The ID of the project
    """
    project = get_object_or_404(Project, pk=project_id)
    user = request.user

    if not user.has_perm('rsr.change_project', project) or project.iati_status in Project.EDIT_DISABLED \
            or not project.is_published():
        raise PermissionDenied

    me_managers_group = Group.objects.get(name='M&E Managers')
    admins_group = Group.objects.get(name='Admins')
    me_managers = project.publishing_orgs.employments().approved().\
        filter(group__in=[admins_group, me_managers_group])

    context = {
        'project': project,
        'parent_projects_ids': [parent_project.id for parent_project in project.parents()],
        'child_projects_ids': [child_project.id for child_project in project.children()],
        'user': user,
        'me_managers': me_managers.exists(),
    }

    return render(request, 'myrsr/my_results.html', context)
