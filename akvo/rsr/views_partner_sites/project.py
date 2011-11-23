# -*- coding: utf-8 -*-
"""
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please
    see < http://www.gnu.org/licenses/agpl.html >.
"""
from __future__ import absolute_import

from django.views.generic.edit import FormView
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required

__all__ = [
    'ProjectAddUpdateView',
    ]


class ProjectUpdateAddView(BaseProjectView, FormView):
    """Add update on partner sites
    the login_required decorator added but we need to validate the users
    permissions in relationships to the org & project.
    """
    template_name = "partner_sites/project/update_add.html"

    @method_decorator(login_required)
    def dispatch(self, *args, **kwargs):
        """Make sure login is required."""
        return super(ProjectUpdateAddView, self).dispatch(*args, **kwargs)
