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

def open_license_page():
    return cms_path("open_license")

def terms_of_use_page():
    return cms_path("terms_of_use")

def privacy_policy_page():
    return cms_path("privacy_policy")

def credits_page():
    return cms_path("credits")

def admin_page():
    return cms_path("admin")

def register_page():
    return rsr_path("accounts/register1")

def sign_in_page():
    return rsr_path("signin/?next=%s" % all_projects_page())

def contact_us_page():
    return cms_path("contact_us")

def akvo_home_page():
    return "http://www.akvo.org"

def rsr_path(subpath):
    return "/rsr/%s" % subpath

def cms_path(cms_page_name):
    return "/web/%s" % cms_page_name
