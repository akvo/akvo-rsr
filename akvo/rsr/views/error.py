# -*- coding: utf-8 -*-
"""
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please
    see < http://www.gnu.org/licenses/agpl.html >.
"""

from django.shortcuts import render_to_response
from django.template import RequestContext


def server_error(request, template_name='500.html'):
    response = render_to_response('500.html', {}, context_instance=RequestContext(request))
    response.status_code = 500
    return response

