# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""

import os

from akvo.rsr.decorators import with_download_indicator
from datetime import datetime
from django.contrib.auth.decorators import login_required
from openpyxl import load_workbook

from . import utils


@login_required
@with_download_indicator
def render_report(request, program_id):
    wb = load_workbook(os.path.join(os.path.dirname(__file__), 'wcaro-smq.tpl.xlsx'))

    filename = '{}-WCARO-SMQ.xlsx'.format(
        datetime.now().strftime('%Y%m%d'))

    return utils.make_excel_response(wb, filename)
