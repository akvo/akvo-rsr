# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.
See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""

import json

from ..forms import (PasswordForm, ProfileForm, UserOrganisationForm, UserAvatarForm,
                     SelectOrgForm, IatiExportForm)
from ...utils import pagination
from ..models import Country, Organisation, Project

from django.contrib.auth import get_user_model
from django.contrib.auth.decorators import login_required
from django.core.exceptions import PermissionDenied
from django.core.urlresolvers import reverse
from django.http import HttpResponseRedirect
from django.shortcuts import render, render_to_response
from django.template import RequestContext


@login_required
def my_details(request):
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
    context = RequestContext(request)
    form = PasswordForm(request.user)
    return render_to_response('myrsr/password_change.html', {'form': form}, context_instance=context)


@login_required
def my_updates(request):
    updates = request.user.updates()
    page = request.GET.get('page')

    page, paginator, page_range = pagination(page, updates, 10)

    context = {
        'page': page,
        'paginator': paginator,
        'page_range': page_range,
    }

    return render(request, 'myrsr/my_updates.html', context)


@login_required
def my_projects(request):
    organisations = request.user.employers.approved().organisations()
    projects = organisations.all_projects().distinct()
    page = request.GET.get('page')

    page, paginator, page_range = pagination(page, projects, 10)

    context = {
        'organisations': organisations,
        'page': page,
        'paginator': paginator,
        'page_range': page_range,
    }

    return render(request, 'myrsr/my_projects.html', context)


@login_required
def my_iati(request):
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
    user = request.user

    if not user.has_perm('rsr.user_management'):
        raise PermissionDenied

    if user.is_support and user.is_admin:
        users = get_user_model().objects.filter(is_active=True).order_by('-date_joined')
        org_actions = Organisation.objects.all()
    else:
        organisations = user.employers.approved().organisations()
        users = organisations.users().exclude(pk=user.pk).order_by('-date_joined')
        org_actions = [org for org in organisations if user.has_perm('rsr.user_management', org)]

    page = request.GET.get('page')
    page, paginator, page_range = pagination(page, users, 10)

    users_array = [user.employments_dict(org_actions) for user in page]

    context = {}
    if users_array:
        context['user_data'] = json.dumps({'users': users_array, })
    context['page'] = page
    context['paginator'] = paginator
    context['page_range'] = page_range
    return render(request, 'myrsr/user_management.html', context)
