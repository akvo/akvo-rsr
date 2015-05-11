# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""

import json

from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import Group
from django.core.exceptions import PermissionDenied
from django.core.urlresolvers import reverse
from django.forms.models import model_to_dict
from django.http import HttpResponseRedirect
from django.shortcuts import render, render_to_response
from django.template import RequestContext

from ..forms import (PasswordForm, ProfileForm, UserOrganisationForm, UserAvatarForm,
                     SelectOrgForm, IatiExportForm)
from ..filters import remove_empty_querydict_items
from ...utils import pagination, filter_query_string
from ..models import Country, Organisation, Employment


@login_required
def my_details(request):
    """First page in My RSR."""
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

    context = {
        'organisation_count': organisation_count,
        'country_count': country_count,
        'user_data': json_data,
        'profileform': profile_form,
        'organisationform': organisation_form,
        'avatarform': avatar_form,
    }

    return render(request, 'myrsr/my_details.html', context)


@login_required
def password_change(request):
    """The password change page."""
    context = RequestContext(request)
    form = PasswordForm(request.user)
    return render_to_response('myrsr/password_change.html', {'form': form},
                              context_instance=context)


@login_required
def my_updates(request):
    """Directory of Updates connected to the user."""
    updates = request.user.updates().select_related('project')

    q = request.GET.get('q')
    if q:
        q_list = q.split()
        for q_item in q_list:
            updates = updates.filter(title__icontains=q_item)
    qs = remove_empty_querydict_items(request.GET)
    page = request.GET.get('page')
    page, paginator, page_range = pagination(page, updates, 10)

    context = {
        'page': page,
        'paginator': paginator,
        'page_range': page_range,
        'q': filter_query_string(qs),
        'q_search': q,
    }
    return render(request, 'myrsr/my_updates.html', context)


@login_required
def my_projects(request):
    """Directory of Projects connected to the user."""
    organisations = request.user.employers.approved().organisations()
    projects = organisations.all_projects().distinct().select_related(
        'publishingstatus',
        'primary_location__country',
    )

    q = request.GET.get('q')
    if q:
        q_list = q.split()
        for q_item in q_list:
            projects = projects.filter(title__icontains=q_item) | \
                projects.filter(subtitle__icontains=q_item)
    qs = remove_empty_querydict_items(request.GET)
    page = request.GET.get('page')
    page, paginator, page_range = pagination(page, projects, 10)

    context = {
        'organisations': organisations,
        'page': page,
        'paginator': paginator,
        'page_range': page_range,
        'q': filter_query_string(qs),
        'q_search': q,
    }
    return render(request, 'myrsr/my_projects.html', context)

@login_required
def rsr_admin(request):
    """."""

    context = {}
    return render(request, 'myrsr/rsr_admin.html', context)
    
@login_required
def my_iati(request):
    """IATI reports."""
    user = request.user

    if not user.has_perm('rsr.iati_management'):
        raise PermissionDenied

    org = request.GET.get('org')
    selected_org, iati_exports, export_added, project_count = None, None, False, 0

    select_org_form = SelectOrgForm(user)
    iati_export_form = None

    if not org and not (user.is_superuser or user.is_admin) \
            and user.approved_organisations().count() == 1:
        selected_org = user.approved_organisations()[0]

    elif org:
        try:
            selected_org = Organisation.objects.get(pk=int(org))
        except Organisation.DoesNotExist:
            raise PermissionDenied
        if not (user.is_superuser or user.is_admin) \
                and not user.has_perm('rsr.change_organisation', selected_org):
            raise PermissionDenied

    if selected_org:
        iati_exports = selected_org.iati_exports.all().order_by('-last_modified_at')
        project_count = selected_org.reporting_projects.all().count()
        initial = {
            'is_public': True,
            'projects': [p.pk for p in selected_org.reporting_projects.all()]
        }
        iati_export_form = IatiExportForm(initial=initial, org=selected_org)

    if request.method == 'POST':
        iati_export_form = IatiExportForm(selected_org, request.POST)
        if iati_export_form.is_valid():
            iati_export_form.save(reporting_organisation=selected_org, user=user)
            export_added = True

    context = {
        'select_org_form': select_org_form,
        'iati_export_form': iati_export_form,
        'selected_org': selected_org,
        'exports': iati_exports,
        'export_added': export_added,
        'project_count': project_count,
    }

    return render(request, 'myrsr/my_iati.html', context)


@login_required
def user_management(request):
    """Directory of users connected to the user."""
    user = request.user

    if not user.has_perm('rsr.user_management'):
        raise PermissionDenied

    if user.is_support and user.is_admin:
        employments = Employment.objects.select_related().\
            prefetch_related('country', 'group').order_by('-id')
    else:
        organisations = user.employers.approved().organisations()
        for org in organisations:
            if not user.has_perm('rsr.user_management', org):
                organisations = organisations.exclude(pk=org.pk)
        employments = organisations.employments().exclude(user=user).select_related().\
            prefetch_related('country', 'group').order_by('-id')

    q = request.GET.get('q')
    if q:
        q_list = q.split()
        for q_item in q_list:
            employments = employments.filter(user__username__icontains=q_item) | \
                employments.filter(user__first_name__icontains=q_item) | \
                employments.filter(user__last_name__icontains=q_item)

    page = request.GET.get('page')
    page, paginator, page_range = pagination(page, employments, 10)

    all_groups = [
        Group.objects.get(name='Users'),
        Group.objects.get(name='User Managers'),
        Group.objects.get(name='Project Editors'),
        Group.objects.get(name='Admins')
    ]

    employments_array = []
    for employment in page:
        employment_dict = model_to_dict(employment)
        employment_dict['other_groups'] = [
            model_to_dict(group, fields=['id', 'name']) for group in all_groups
        ]
        if employment.country:
            country_dict = model_to_dict(employment.country, fields=['id', 'iso_code', 'name'])
            employment_dict["country"] = country_dict
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

    context = {}
    if employments_array:
        context['employments'] = json.dumps(employments_array)
    context['page'] = page
    context['paginator'] = paginator
    context['page_range'] = page_range
    if q:
        context['q'] = q
    return render(request, 'myrsr/user_management.html', context)
