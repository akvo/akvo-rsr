# -*- coding: utf-8 -*-
"""
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please
    see < http://www.gnu.org/licenses/agpl.html >.
"""
from __future__ import absolute_import

from django.contrib.auth.decorators import login_required
from django.core.exceptions import PermissionDenied
from django.db.models import Sum
from django.shortcuts import get_object_or_404
from django.shortcuts import redirect
from django.utils.decorators import method_decorator
from django.views.decorators.cache import never_cache
from django.views.generic.edit import FormView, UpdateView

from akvo.rsr.forms import ProjectUpdateForm
from akvo.rsr.models import Project, ProjectUpdate
from akvo.rsr.views_partner_sites.base import BaseProjectView, BaseListView


__all__ = [
    'ProjectFundingView',
    'ProjectMainView',
    'ProjectUpdateAddView',
    'ProjectUpdateEditView',
    'ProjectUpdateListView',
    'ProjectUpdateView',
    ]


class ProjectFundingView(BaseProjectView):
    """Extends the project view with public donations."""
    template_name = 'partner_sites/project/project_funding.html'

    def get_context_data(self, **kwargs):
        context = super(ProjectFundingView, self).get_context_data(**kwargs)
        context['public_donations'] = context['project'].public_donations()
        return context


class ProjectMainView(BaseProjectView):
    """Extends the BaseProjectView with benchmarks."""
    template_name = "partner_sites/project/project_main.html"

    def get_context_data(self, **kwargs):
        context = super(ProjectMainView, self).get_context_data(**kwargs)
        context['benchmarks'] = context['project'].benchmarks \
            .filter(category__in=[category for category in context['project']
                .categories.all()
                    if context['project'].benchmarks \
                        .filter(category=category) \
                            .aggregate(Sum('value'))['value__sum']
            ])
        return context


class ProjectUpdateListView(BaseListView):
    """List view that makes a projects updates available as update_list in the
    template."""
    template_name = "partner_sites/project/update_list.html"
    context_object_name = 'update_list'

    def get_context_data(self, **kwargs):
        context = super(ProjectUpdateListView, self).get_context_data(**kwargs)
        context['project'] = get_object_or_404(Project, \
                                               pk=self.kwargs['project_id'])
        return context

    def get_queryset(self):
        return get_object_or_404(Project, pk=self.kwargs['project_id']) \
            .project_updates.all().order_by('-time')


class ProjectUpdateView(BaseProjectView):
    """Extends the project view with the current update"""
    template_name = "partner_sites/project/update_main.html"

    def get_context_data(self, **kwargs):
        context = super(ProjectUpdateView, self).get_context_data(**kwargs)
        update = get_object_or_404(ProjectUpdate, id=self.kwargs['update_id'])
        context['update'] = update

        context['can_edit_update'] = (update.user == self.request.user
                                      and context['can_add_update']
                                      and not update.edit_window_has_expired())
        return context


class ProjectUpdateFormView(BaseProjectView):
    """Base class for Project update forms (add & edit)"""

    template_name = "partner_sites/project/update_form.html"
    form_class = ProjectUpdateForm

    @method_decorator(login_required)
    @method_decorator(never_cache)
    def dispatch(self, *args, **kwargs):
        """Make sure login is required."""
        return super(ProjectUpdateFormView, self).dispatch(*args, **kwargs)

    def form_invalid(self, form, **kwargs):
        context = self.get_context_data(**kwargs)
        context['form'] = form
        return self.render_to_response(context)

    def form_valid(self, form):
        """On valid form login and redirect the user to the appropriate url"""
        project = get_object_or_404(Project, pk=self.kwargs['project_id'])
        update = form.save(commit=False)
        update.project = project
        update.user = self.request.user
        update.update_method = 'W'
        update.save()
        return redirect(update.get_absolute_url())


class ProjectUpdateAddView(ProjectUpdateFormView, FormView):
    """Add update on partner sites"""

    def get_context_data(self, **kwargs):
        context = super(ProjectUpdateAddView, self).get_context_data(**kwargs)
        user_is_authorized = context['project'].connected_to_user(self.request.user)
        if not user_is_authorized:
            raise PermissionDenied
        update = None
        try:
            update_id = self.kwargs['update_id']
        except KeyError:
            update_id = None

        if update_id:
            update = get_object_or_404(ProjectUpdate, pk=update_id)
            context['update'] = update
            if not (self.request.user == update.user and not update.edit_window_has_expired()):
                raise PermissionDenied

        context['form'] = self.form_class(instance=update)
        return context


class ProjectUpdateEditView(ProjectUpdateFormView, UpdateView):
    """Edit update on partner sites"""

    def get_context_data(self, **kwargs):
        context = super(ProjectUpdateEditView, self).get_context_data(**kwargs)
        user_is_authorized = context['project'].connected_to_user(self.request.user)
        if not user_is_authorized:
            raise PermissionDenied
        update = None
        try:
            update_id = self.kwargs['update_id']
        except KeyError:
            update_id = None

        if update_id:
            update = get_object_or_404(ProjectUpdate, pk=update_id)
            self.object = update
            context['update'] = update
            if not (self.request.user == update.user and not update.edit_window_has_expired()):
                raise PermissionDenied

        context['form'] = self.form_class(instance=update)
        return context

    def get_object(self, queryset=None):
        return get_object_or_404(ProjectUpdate, id=self.kwargs['update_id'])
