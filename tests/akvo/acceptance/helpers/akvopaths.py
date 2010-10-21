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

def terms_of_use_page():
    return cms_path("terms_of_use")

def donation_policy_page():
    return cms_path("donation_policy")

def partners_policy_page():
    return cms_path("partners_and_projects_policy")

def user_contribution_policy_page():
    return cms_path("user_contribution_policy")

def open_license_page():
    return cms_path("open_license")

def privacy_policy_page():
    return cms_path("privacy_policy")

def api_code_of_conduct_page():
    return cms_path("akvo-rsr-api-code-of-conduct")

def what_we_do_page():
    return cms_path("what_we_do")

def how_akvo_works_page():
    return cms_path("how_akvo_works")

def why_we_do_it_page():
    return cms_path("why_we_do_it")

def faq_page():
    return cms_path("faq")

def global_maps_page():
    return cms_path("map_partners_projects")

def akvo_team_page():
    return cms_path("team")

def akvo_jobs_page():
    return cms_path("jobs")

def press_page():
    return cms_path("press")

def annual_reports_page():
    return cms_path("annual_reports")

def organisations_page():
    return rsr_path("organisations")

def commercial_partners_page():
    return cms_path("commercial_partners")

def knowledge_institute_partners_page():
    return cms_path("knowledge_institute_partners")

def akvo_investors_page():
    return cms_path("akvo_investors")

def akvo_labs_page():
    return "/labs"

def contact_us_page():
    return cms_path("contact_us")

def rsr_admin_page():
    return rsr_path("admin")

def blog_admin_page():
    return "/blog/wp-login.php"

def cms_admin_page():
    return cms_path("?q=user")

def rsr_path(subpath):
    return "/rsr/%s" % subpath

def cms_path(cms_page_name):
    return "/web/%s" % cms_page_name
