# -*- coding: utf-8 -*-
"""
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please
    see < http://www.gnu.org/licenses/agpl.html >.
"""
from __future__ import absolute_import

from django.contrib.auth.views import redirect_to_login
from django.core.exceptions import PermissionDenied
from django.core.urlresolvers import reverse
from django.db.models import Sum
from django.shortcuts import get_object_or_404, redirect
from django.utils.decorators import method_decorator
from django.views.decorators.cache import never_cache
from django.views.generic.edit import FormView, UpdateView
from django.http import Http404

from akvo.rsr.forms import ProjectUpdateForm
from akvo.rsr.models import Invoice, Project, ProjectUpdate
from akvo.rsr.views_partner_sites.base import (
    BaseProjectListView, BaseProjectView, BaseListView, BaseView)


__all__ = [
    'HomeView',
    'ProjectFundingView',
    'ProjectMainView',
    'ProjectUpdateAddView',
    'ProjectUpdateEditView',
    'ProjectUpdateListView',
    'ProjectUpdateView',
    'ProjectDonationThanksView'
]


class HomeView(BaseProjectListView):
    """Represents the home page (/) on a partner site"""
    template_name = 'partner_sites/home.html'


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
            .filter(category__in=[
                category for category in context['project'].categories.all()
                if context['project'].benchmarks.filter(
                    category=category).aggregate(Sum('value'))['value__sum']
            ])
        return context


class ProjectUpdateListView(BaseListView):
    """List view that makes a projects updates available as update_list in the
    template."""
    template_name = "partner_sites/project/update_list.html"
    context_object_name = 'update_list'

    def get_context_data(self, **kwargs):
        context = super(ProjectUpdateListView, self).get_context_data(**kwargs)
        context['project'] = get_object_or_404(
            Project, pk=self.kwargs['project_id'])
        return context

    def get_queryset(self):
        project = get_object_or_404(Project, pk=self.kwargs['project_id'])
        return project.project_updates.all().order_by('-time')


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

    # @method_decorator(login_required)
    @method_decorator(never_cache)
    def dispatch(self, request, *args, **kwargs):
        """Make sure login is required."""
        #
        # request.error_message = "yay"
        # raise PermissionDenied
        self.project = get_object_or_404(Project, pk=kwargs['project_id'])
        return super(ProjectUpdateFormView, self).dispatch(
            request, *args, **kwargs)

    def form_invalid(self, form, **kwargs):
        context = self.get_context_data(**kwargs)
        context['form'] = form
        return self.render_to_response(context)

    def form_valid(self, form):
        """On valid form login and redirect the user to the appropriate url"""
        # project = get_object_or_404(Project, pk=self.kwargs['project_id'])
        update = form.save(commit=False)
        update.project = self.project
        update.user = self.request.user
        update.update_method = 'W'
        update.save()
        return redirect(update.get_absolute_url())


class ProjectUpdateAddView(ProjectUpdateFormView, FormView):
    """Add update on partner sites"""

    def render_to_response(self, context):
        # re-direct unauthenticated users to sign-in page
        if not self.request.user.is_authenticated():
            return redirect_to_login(
                self.request.path, login_url=reverse('sign_in'))
        context['form'].initial = dict(language=self.project.language)
        return super(ProjectUpdateAddView, self).render_to_response(context)

    def get_context_data(self, **kwargs):
        context = super(ProjectUpdateAddView, self).get_context_data(**kwargs)

        if not self.project.is_published():
            self.request.error_message = \
                u"You can't add updates to unpublished projects."
            raise PermissionDenied

        user_is_authorized = context['project'].connected_to_user(
            self.request.user)
        if self.request.user.is_authenticated() and not user_is_authorized:
            self.request.error_message = \
                u"You don't have permission to add updates to this project."
            raise PermissionDenied

        update = None
        # TODO: is this bit really needed here? how can there exist an update
        # when we're creating it?
        try:
            update_id = self.kwargs['update_id']
        except KeyError:
            update_id = None

        if update_id:
            update = get_object_or_404(ProjectUpdate, pk=update_id)
            context['update'] = update
            expired = update.edit_window_has_expired()
            if not (self.request.user == update.user and not expired):
                raise PermissionDenied

        context['form'] = self.form_class(instance=update)
        return context


class ProjectUpdateEditView(ProjectUpdateFormView, UpdateView):
    """Edit update on partner sites"""

    def get_context_data(self, **kwargs):
        context = super(ProjectUpdateEditView, self).get_context_data(**kwargs)
        user_is_authorized = context['project'].connected_to_user(
            self.request.user)
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
            expired = update.edit_window_has_expired()
            if not (self.request.user == update.user and not expired):
                raise PermissionDenied

        context['form'] = self.form_class(instance=update)
        return context

    def get_object(self, queryset=None):
        return get_object_or_404(ProjectUpdate, id=self.kwargs['update_id'])


class ProjectDonationThanksView(BaseView):
    "Render a thankyou page after a successful donation"
    template_name = "partner_sites/project/donate/donate_thanks.html"

    def get_context_data(self, invoice=None, **kwargs):
        context = super(
            ProjectDonationThanksView, self).get_context_data(**kwargs)
        paypal_invoice_id = self.request.GET.get("invoice", None)
        mollie_transaction_id = self.request.GET.get("transaction_id", None)
        if paypal_invoice_id is not None:
            invoice = Invoice.objects.get(pk=int(paypal_invoice_id))
        elif mollie_transaction_id is not None:
            invoice = Invoice.objects.get(
                transaction_id=str(mollie_transaction_id))
        if not invoice:
            raise Http404
        context["invoice"] = invoice
        return context
