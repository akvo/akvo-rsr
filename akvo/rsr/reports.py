# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.utils.translation import ugettext_lazy as _

# Data for all available reports from ReportServer, with the following fields:
# - key: A unique identifier for the report
# - title: The title of the report, will be shown on the 'My reports' page as such
# - description: The description of the report, as displayed on the 'My reports' page
# - formats: The available formats for the report, see options below
# - parameters: The available parameters for the report, options; ['project', 'organisation']
# - url: The URL where the report is available. Parameter(s) should be indicated in between {..}'s.

REPORTS = [
    {
        'key': 'results-framework',
        'title': unicode(_('Results and indicators overview')),
        'description': unicode(_('This report gives an overview of the status of your project\'s '
                                 'results and indicators.')),
        'formats': ['pdf', 'word', 'excel', 'html'],
        'parameters': ['project', ],
        'url': '/en/reports/project_results/{project}?format={format}&download=true'
    },
    {
        'key': 'projects-overview',
        'title': unicode(_('Projects overview')),
        'description': unicode(_('This report provides information about your organisation\'s '
                                 'projects: amount of updates, country, total budgets, project '
                                 'statuses, start- and end dates.')),
        'formats': ['pdf', 'word', 'excel', 'html'],
        'parameters': ['organisation', ],
        'url': '/en/reports/project_overview/{organisation}?format={format}&download=true'
    },
    {
        'key': 'data-quality',
        'title': unicode(_('Data quality overview')),
        'description': unicode(_('This report gives an overview of your organisation\'s projects '
                                 'that have passed the planned end date, need funding or that '
                                 'haven\'t been edited or updated for 3 months.')),
        'formats': ['pdf', 'word', 'excel', 'html'],
        'parameters': ['organisation', ],
        'url': '/en/reports/data_quality/{organisation}?format={format}&download=true'
    }
]

# Data for all available formats from ReportServer, with the following fields:
# - key: A unique identifier for the format, also used in the formats field of the reports
# - displayName: The display name of the format, as displayed on the 'My reports' page
# - icon: The font awesome icon of the format, as displayed on the 'My reports' page

FORMATS = [
    {
        'key': 'pdf',
        'displayName': 'PDF',
        'icon': 'file-pdf-o',
    },
    {
        'key': 'excel',
        'displayName': 'Excel',
        'icon': 'file-excel-o',
    },
    {
        'key': 'word',
        'displayName': 'Word',
        'icon': 'file-word-o',
    },
    {
        'key': 'html',
        'displayName': 'HTML',
        'icon': 'code',
    },
]
