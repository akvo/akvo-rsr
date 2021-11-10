# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from django.http import HttpResponseRedirect
from django.urls import reverse


def index(request):
    """Redirect user to project directory or My RSR."""

    return HttpResponseRedirect(reverse('project-directory', args=[]))
