# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

def home_page():
    return "/"

def projects_page():
    return rsr_path("projects")

def all_projects_page():
    return rsr_path("projects/all")

def focus_areas_page():
    return cms_path("focus-areas")

def partners_page():
    return cms_path("partners")

def akvopedia_page():
    return "/wiki"

def about_page():
    return cms_path("get_involved")

def blog_page():
    return "/blog"

def register_page():
    return rsr_path("accounts/register1")

def sign_in_page():
    return rsr_path("signin/?next=%s" % all_projects_page())

def rsr_path(subpath):
    return "/rsr/%s" % subpath

def cms_path(cms_page_name):
    return "/web/%s" % cms_page_name
