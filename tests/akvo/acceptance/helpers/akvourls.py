# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import sys
import helpers.akvopaths

from test_settings import SITE_UNDER_TEST


def akvo_page_path_functions():
    return filter(lambda name: name.endswith('_page'), dir(helpers.akvopaths))

def generate_akvo_url_functions():
    for path_function_name in akvo_page_path_functions():
        url_function_name = path_function_name.replace("_page", "_url")
        setattr(sys.modules[__name__], url_function_name, create_url_function(path_function_name))

def create_url_function(path_function_name):
    return lambda: full_url_for_path(path_function_name)

def full_url_for_path(page_path_function_name):
    return "%s%s" % (SITE_UNDER_TEST, getattr(helpers.akvopaths, page_path_function_name)())


generate_akvo_url_functions()
