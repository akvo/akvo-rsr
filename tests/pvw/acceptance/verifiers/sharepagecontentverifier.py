# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

class SharedPageContentVerifier:

    def __init__(self, web_test_case):
        self.test_case = web_test_case

    def verify_expected_main_menu_links(self):
        self.test_case.assert_links_exist(["Focus Areas",
                                           "Projects",
                                           "Netherlands",
                                           "Education",
                                           "Directory",
                                           "News",
                                           "About"])
