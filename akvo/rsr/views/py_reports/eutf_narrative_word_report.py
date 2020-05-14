# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""

from django.contrib.auth.decorators import login_required
from django.http import HttpResponse


@login_required
def render_report(request, project_id):
    return HttpResponse('EUTF narrative report')
