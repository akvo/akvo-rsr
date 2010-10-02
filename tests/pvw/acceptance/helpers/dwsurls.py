# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from test_settings import SITE_UNDER_TEST

from helpers.dwspaths import *


def home_page_url():
    return SITE_UNDER_TEST

def focus_areas_url():
    return _full_url(focus_areas_page())

def projects_url():
    return _full_url(projects_page())

def all_projects_url():
    return _full_url(all_projects_page())

def netherlands_url():
    return _full_url(netherlands_page())

def education_url():
    return _full_url(education_page())

def directory_url():
    return _full_url(directory_page())

def news_url():
    return _full_url(news_page())

def about_url():
    return _full_url(about_page())

def _full_url(path):
    return "%s%s" % (SITE_UNDER_TEST, path)
