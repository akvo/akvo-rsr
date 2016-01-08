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
# - url: The URL where the report is available. Parameter(s) should be indicated in between <..>'s.

REPORTS = [
    {
        'key': 'results-framework',
        'title': unicode(_('Results overview')),
        'description': unicode(_('The results overview shows all results, indicators and indicator '
                                 'periods for the selected project.')),
        'formats': ['pdf', 'word', 'excel', 'html'],
        'parameters': ['project', ],
        'url': '/en/reports/project_results/<project>?format=<format>&download=true'
    },
    {
        'key': 'projects-overview',
        'title': unicode(_('Projects overview')),
        'description': unicode(_('The projects overview shows all projects of the selected '
                                 'organisation, and the basic information for each of the '
                                 'projects.')),
        'formats': ['excel', 'word'],
        'parameters': ['organisation', ],
        'url': '/en/reports/projects_overview/<organisation>?format=<format>&download=true'
    },
    {
        'key': 'data-quality',
        'title': unicode(_('Data quality check')),
        'description': unicode(_('The data quality check performs multiple checks for every '
                                 'project of an organisation, including checks on the status and '
                                 'end date for each project, and which projects haven\'t been '
                                 'updated for longer than 3 months.')),
        'formats': ['excel', 'word'],
        'parameters': ['organisation', ],
        'url': '/en/reports/data_quality/<organisation>?format=<format>&download=true'
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
