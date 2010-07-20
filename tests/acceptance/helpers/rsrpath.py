# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from test_settings import SITE_UNDER_TEST


def home_page_path():
    return SITE_UNDER_TEST

def project_listing_path():
    return rsr_path("projects")

def project_path(project_number):
    return rsr_path(_project_number_path(project_number))

def project_updates_path(project_number):
    return _url_path(project_path(project_number), "/updates")

def widget_path_for_project(project_number, widget_type):
    return rsr_path("widget/%s/%s" % (widget_type, _project_number_path(project_number)))

def _project_number_path(project_number):
    return "project/%i" % project_number

def rsr_path(subpath):
    return _url_path(SITE_UNDER_TEST, "/rsr/%s" % subpath)

def _url_path(base_url, path):
    return "%s%s" % (base_url, path)
