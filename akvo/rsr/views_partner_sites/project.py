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
from django.shortcuts import get_object_or_404
from django.shortcuts import redirect
from django.utils.decorators import method_decorator
from django.views.decorators.cache import never_cache
from django.views.generic.edit import FormView
from functools import wraps

from akvo.rsr.forms import ProjectUpdateForm
from akvo.rsr.models import Project, ProjectUpdate
from akvo.rsr.views_partner_sites.base import BaseProjectView

__all__ = [
    'ProjectUpdateFormView',
    ]


class ProjectUpdateFormView(BaseProjectView, FormView):
    """Add update on partner sites"""

    template_name = "partner_sites/project/update_add.html"
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

    def get_context_data(self, **kwargs):
        context = super(ProjectUpdateFormView, self).get_context_data(**kwargs)
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
        #if update.edit_window_has_expired():
        #    raise PermissionDenied

        context['form'] = self.form_class(instance=update)
        return context
