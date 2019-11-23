# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""

import os
from django.http import HttpResponse

def check(request):
    env = int(os.getenv('RSR_REPORTS', '0'))
    return HttpResponse('OK' if bool(env) else '')
