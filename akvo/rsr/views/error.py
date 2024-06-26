# -*- coding: utf-8 -*-
"""
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please
    see < http://www.gnu.org/licenses/agpl.html >.
"""

from django.shortcuts import render


def server_error(request, template_name='500.html'):
    response = render(request, template_name, context={})
    response.status_code = 500
    return response
