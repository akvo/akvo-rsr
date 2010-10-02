# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

def home_page():
    return "/"

def focus_areas_page():
    return cms_path("focus-areas")

def projects_page():
    return rsr_path("projects")

def all_projects_page():
    return rsr_path("projects/all")

def netherlands_page():
    return cms_path("netherlands")

def education_page():
    return cms_path("education")

def directory_page():
    return cms_path("directory")

def news_page():
    return "/news"

def about_page():
    return cms_path("about")

def rsr_path(subpath):
    return "/rsr/%s" % subpath

def cms_path(cms_page_name):
    return "/web/%s" % cms_page_name
