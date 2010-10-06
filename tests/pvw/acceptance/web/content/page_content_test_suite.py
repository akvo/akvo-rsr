#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from helpers.seleniumclient import SeleniumClient
from helpers.testexecution import *

from web.content.home_page_content_test import HomePageContentTest
from web.content.focus_areas_page_content_test import FocusAreasPageContentTest
from web.content.projects_page_content_test import ProjectsPageContentTest
from web.content.netherlands_page_content_test import NetherlandsPageContentTest
from web.content.education_page_content_test import EducationPageContentTest
from web.content.directory_page_content_test import DirectoryPageContentTest
from web.content.news_page_content_test import NewsPageContentTest


def page_content_suite():
    return create_test_suite_from_classes([HomePageContentTest, FocusAreasPageContentTest, ProjectsPageContentTest,
                                           NetherlandsPageContentTest, EducationPageContentTest, DirectoryPageContentTest,
                                           NewsPageContentTest])

if __name__ == "__main__":
    run_test_suite(page_content_suite())
    SeleniumClient().stop()
