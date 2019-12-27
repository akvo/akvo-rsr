# Akvo RSR is covered by the GNU Affero General Public License. See more
# details in the license.txt file located at the root folder of the Akvo RSR
# module. For additional details on the GNU license please see
# <http://www.gnu.org/licenses/agpl.html>.

from os.path import abspath, dirname

HERE = dirname(abspath(__file__))


GET_URLS = [
    # akvo/rsr/front-end/scripts-src/my-projects.js
    '/rest/v1/project/?format=json',

    # akvo/rest/filters.py doc examples
    "/rest/v1/project/?filter={'title__icontains':'water','currency':'EUR'}&format=json",
    "/rest/v1/project/?filter={'title__icontains':'fiber'}&exclude={'currency':'EUR'}&format=json",
    "/rest/v1/project/?filter={'partners__in':[2,3]}&prefetch_related=['partners']&format=json",

    # akvo/rsr/front-end/scripts-src/project-directory-typeahead.jsx
    '/rest/v1/typeaheads/organisations?format=json',

    # akvo/rsr/front-end/scripts-src/my-details-employments.jsx
    '/rest/v1/typeaheads/countries?format=json',

    # akvo/rsr/front-end/scripts-src/project-main/project-main-report.jsx
    '/rest/v1/project/4/?format=json',
    '/rest/v1/project_location/?format=json&location_target=4',
    '/rest/v1/indicator/?format=json&result__project=4',
    '/rest/v1/indicator_reference/?format=json&indicator__result__project=4',
    '/rest/v1/indicator_period/?format=json&indicator__result__project=4',
    '/rest/v1/indicator_period_actual_location/?format=json&period__indicator__result__project=4',
    '/rest/v1/indicator_period_target_location/?format=json&period__indicator__result__project=4',
    '/rest/v1/transaction_sector/?format=json&transaction__project=4',
    '/rest/v1/administrative_location/?format=json&location__location_target=4',
    '/rest/v1/project_document_category/?format=json&document__project=4',
    '/rest/v1/crs_add_other_flag/?format=json&crs__project=4',
    '/rest/v1/fss_forecast/?format=json&fss__project=4',

    # akvo/rsr/front-end/scripts-src/project-directory.js
    '/rest/v1/typeaheads/projects?format=json',

    # akvo/rsr/front-end/scripts-src/update-directory.js
    '/rest/v1/typeaheads/project_updates?format=json',

    # akvo/rsr/front-end/scripts-src/my-reports.js
    '/rest/v1/report_formats/?format=json',
    '/rest/v1/reports/?format=json',
    '/rest/v1/typeaheads/user_organisations?format=json',
    '/rest/v1/typeaheads/user_projects?format=json',

    # akvo/rsr/front-end/scripts-src/my-results.js
    '/rest/v1/partnership/?format=json&project=4',
    '/rest/v1/user/3/?format=json',
    '/rest/v1/result/?format=json&project=4',
    '/rest/v1/indicator_period_data_framework/?format=json&period__indicator__result__project=4',
    '/rest/v1/indicator_period_framework/1/?format=json',

    # akvo/rsr/front-end/scripts-src/my-results-select.jsx
    '/rest/v1/typeaheads/impact_projects?format=json',

    # akvo/rsr/front-end/scripts-src/my-iati.js
    '/rest/v1/project_iati_export/?format=json&limit=50&reporting_org=1',
    '/rest/v1/iati_export/?format=json&reporting_organisation=2&ordering=-id&limit=1',
    '/rest/v1/iati_export/?format=json&reporting_organisation=3',

    # akvo/rsr/front-end/scripts-src/project-main/project-main-partners.js
    '/rest/v1/partnership_more_link/?format=json&project=4',

    # RSR UP urls ################
    # android/AkvoRSR/src/org/akvo/rsr/up/service/GetProjectDataService.java
    '/rest/v1/project_update/?format=xml&project=3&last_modified_at__gt=2014-01-01',

    # android/AkvoRSR/src/org/akvo/rsr/up/service/VerifyProjectUpdateService.java
    '/rest/v1/project_update/?format=xml&uuid=%s&limit=2',

    # android/AkvoRSR/src/org/akvo/rsr/up/service/GetProjectDataService.java
    '/rest/v1/project_up/3/?format=xml&image_thumb_name=up&image_thumb_up_width=100',

    # android/AkvoRSR/src/org/akvo/rsr/up/service/GetProjectDataService.java
    '/rest/v1/country/?format=json&limit=50',

    # android/AkvoRSR/src/org/akvo/rsr/up/service/GetProjectDataService.java
    '/rest/v1/user/3/?format=json&depth=1',

    # android/AkvoRSR/src/org/akvo/rsr/up/service/GetOrgDataService.java
    '/rest/v1/organisation/?format=json&limit=10',
    '/rest/v1/employment/?format=json&user=3',

    # android/AkvoRSR/src/org/akvo/rsr/up/service/GetProjectDataService.java
    '/rest/v1/organisation/3/?format=json',

    # android/AkvoRSR/src/org/akvo/rsr/up/service/GetProjectDataService.java
    '/rest/v1/results_framework/?format=json&project=4',

]
