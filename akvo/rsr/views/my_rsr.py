# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""

from collections import OrderedDict
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

from akvo.codelists.models import Country, Version
from akvo.codelists.store.default_codelists import (
    AID_TYPE, EARMARKING_CATEGORY, SECTOR_CATEGORY, SECTOR
)
from akvo.rsr.models import IndicatorPeriodData, User, UserProjects
from akvo.rsr.models.user_projects import InvalidPermissionChange, check_collaborative_user
from akvo.rsr.permissions import (
    GROUP_NAME_USERS, GROUP_NAME_USER_MANAGERS, GROUP_NAME_ENUMERATORS,
    GROUP_NAME_ADMINS, GROUP_NAME_ME_MANAGERS, GROUP_NAME_PROJECT_EDITORS,
    user_accessible_projects
)
from ..forms import (ProfileForm, UserOrganisationForm, UserAvatarForm, SelectOrgForm,
                     RSRPasswordChangeForm)
from ..filters import remove_empty_querydict_items
from ...utils import codelist_name, codelist_choices, pagination, filter_query_string
from ..models import (Employment, Organisation, Project, ProjectEditorValidation,
                      ProjectEditorValidationSet)


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


def user_viewable_projects(user, show_restricted=False):
    """Return list of all projects a user can view

    If a project is unpublished, and the user is not allowed to edit that
    project, the project is not displayed in the list.

    Any projects where the user's access has been restricted (using fine-access
    control) are also not shown.

    """
    # User groups
    not_allowed_to_edit = [GROUP_NAME_USERS, GROUP_NAME_USER_MANAGERS, GROUP_NAME_ENUMERATORS]
    allowed_to_edit = [GROUP_NAME_ADMINS, GROUP_NAME_ME_MANAGERS, GROUP_NAME_PROJECT_EDITORS]
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
        non_editor_roles = employments.filter(group__name__in=not_allowed_to_edit)
        uneditable_projects = user.my_projects(
            group_names=not_allowed_to_edit, show_restricted=show_restricted).published()
        projects = (
            projects | user_accessible_projects(user, non_editor_roles, uneditable_projects)
        )
        # Allowed to edit roles
        editor_roles = employments.exclude(group__name__in=not_allowed_to_edit)
        editable_projects = user.my_projects(
            group_names=allowed_to_edit, show_restricted=show_restricted)
        projects = (
            projects | user_accessible_projects(user, editor_roles, editable_projects)
        )
        projects = projects.distinct()
    return projects


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

    if not (user.is_admin or user.is_superuser or user.in_group(me_managers)
            or user.in_group(admins) or user.in_group(project_editors)):
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
            'dimension_names',
            'dimension_names__dimension_values',
        ).select_related(
            'publishingstatus',
            'primary_organisation',
        ).get(pk=project_id)
    except Project.DoesNotExist:
        raise Http404('No project exists with the given id.')

    if (not request.user.has_perm('rsr.change_project', project)
            or project.iati_status in Project.EDIT_DISABLED) and not (
            request.user.is_superuser or request.user.is_admin):
        raise PermissionDenied

    # Validations / progress bars
    validations = ProjectEditorValidation.objects.select_related('validation_set')
    validation_sets = ProjectEditorValidationSet.objects.all()
    project_validation_sets = project.validations.all()

    # IATI fields
    countries = Country.objects.filter(version=Version.objects.get(code=settings.IATI_VERSION))
    # Map options to the vocabulary code
    sector_vocabulary_options = {
        '1': OrderedDict(codelist_choices(SECTOR)), '2': OrderedDict(codelist_choices(SECTOR_CATEGORY))
    }
    location_administrative_vocabulary_options = {}
    organisation_codelist = project.organisation_codelist()
    if organisation_codelist:
        sector_category = organisation_codelist.data.get('SECTOR_CATEGORY')
        if sector_category is not None:
            sector_vocabulary_options['99'] = OrderedDict(codelist_choices(sector_category))

        location_administratives = organisation_codelist.data.get('LOCATION_ADMINISTRATIVE_CODES')
        if location_administratives is not None:
            # FIXME: A4 is one of the options for a vocabulary. Other
            # organisations may want to use other geographic vocabularies, and
            # we should be able to customize that.
            location_administrative_vocabulary_options['A4'] = OrderedDict(
                codelist_choices(location_administratives)
            )

    aid_type_vocabulary_options = {
        '1': dict(codelist_choices(AID_TYPE)), '2': dict(codelist_choices(EARMARKING_CATEGORY))
    }

    # Permissions
    org_permissions = []
    for approved_org in request.user.approved_organisations():
        if request.user.admin_of(approved_org) or request.user.me_manager_of(approved_org) or \
                request.user.project_editor_of(approved_org):
            org_permissions.append(approved_org.pk)

    # NOTE: The API for setting default indicator is changed, and the old
    # project editor won't be able to do this any more.
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
        'sector_vocabulary_options': json.dumps(sector_vocabulary_options),
        'aid_type_vocabulary_options': json.dumps(aid_type_vocabulary_options),
        'location_administrative_vocabulary_options': json.dumps(location_administrative_vocabulary_options),

        # Default indicator
        'default_indicator': default_indicator,
    }

    context = project.project_hierarchy_context(context)
    context.update(project.iati_identifier_context())

    # Custom fields context
    for section_id in range(1, 12):
        context['custom_fields_section_{}'.format(section_id)] = \
            project.custom_fields.filter(section=section_id).order_by('order', 'id')

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
