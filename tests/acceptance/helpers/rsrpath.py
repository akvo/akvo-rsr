# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from test_settings import SITE_UNDER_TEST


def home_page_path():
    return SITE_UNDER_TEST

def project_listing_path():
    return rsr_path("projects")

def project_path(project_number):
    return rsr_path("project/%i" % (project_number))

def project_updates_path(project_number):
    return rsr_path("project/%i/updates" % (project_number))

def rsr_path(subpath):
    return url_path(SITE_UNDER_TEST, "/rsr/%s" % (subpath))

def url_path(base_url, path):
    return "%s%s" % (base_url, path)
