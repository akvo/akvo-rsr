# Currently in develop

## Improvements

## Bug fixes

[#2416] (https://github.com/akvo/akvo-rsr/issues/2416) Fix wrong country counts
for organisations in the project overview report.

[#2434] (https://github.com/akvo/akvo-rsr/issues/2434) Fix wrong counts for
number of projects in data quality reports if an organisation has multiple
partnership roles for a project.

[#2398] (https://github.com/akvo/akvo-rsr/issues/2398) Fix empty user
management page when a user in a page has an employment that does not have a
group defined.

[#2424] (https://github.com/akvo/akvo-rsr/issues/2424) Optimize how queryset filtering based on permissions is made. This is necessary since some filtering is taking so long that the request times out before completing.  The fix is based around parsing the django-rules predicates and turning them into Django Q object queryset filters. This results in speedup of at least an order of magnitude for complex filters.

[#2417] (https://github.com/akvo/akvo-rsr/issues/2417) Fix bug in API calls
which accept an image, which can be None, for example deleting project photo
from the project editor.

[#2421] (https://github.com/akvo/akvo-rsr/issues/2421) RSR User management page
in the French site will now correctly show the user list.

[#2426] (https://github.com/akvo/akvo-rsr/issues/2426) Fix unicode error when
adding an indicator period comment with non-ASCII characters

# Akvo RSR version 3.17 Ulaanbaatar
Thursday 20th of October, 2016 [@nadiagorchakova](https://github.com/nadiagorchakova)

## New & Noteworthy

### 'Donate' button removed

We have removed an option to make donations through Akvo since it was a significant admin overhead for us. Most importantly, the feature was barely used by partners.
There is an option now to embed a link to an external platform to collect donations.
Data on all donations made in the past for current and completed projects will still be shown in the Finance tab.

Github issue [#1885] (https://github.com/akvo/akvo-rsr/issues/1885)

## Improvements

### Check on the size of uploaded image

Previously, if the size of an uploaded image was too big (more than 2MB), an RSR update failed silently without producing any error message.
From now on, a user will receive an error message and an update will not fail. A user will have an opportunity to resize the image and try uploading it again.

Github issue [#2040] (https://github.com/akvo/akvo-rsr/issues/2040)



## Bug fixes

[#1577] (https://github.com/akvo/akvo-rsr/issues/1577) Unknown file types will now give a proper error during posting.

[#2389] (https://github.com/akvo/akvo-rsr/issues/2389) RSR User management will not show what appeared to be 'duplicate employments' anymore

[#2232] (https://github.com/akvo/akvo-rsr/issues/2232) RSR Test environment is not discoverable through Google anymore



# Akvo RSR version 3.16 Tegucigalpa
Thursday 29th of September, 2016 [@nadiagorchakova](https://github.com/nadiagorchakova)

## New & Noteworthy

### IATI reporting on "actual value comment"

Before the release, the IATI field 'Actual Value comment' (actual_comment) was not available for input through My RSR - My results. Instead, there was a field 'Value Description' there. If a user inputted comment for a chosen indicator value in 'Value Description', it did not update actual_comment.
Since these two fields have similar purpose, user input in 'Value Description' is now defaulted in 'Actual Value comment' (actual_comment). It will be further used in IATI export.

Github issue [#2342](https://github.com/akvo/akvo-rsr/issues/2342).


## Bug fixes:

### Unnecessary migrations are created for IatiImport.mapper_prefix

Github issue [#2371](https://github.com/akvo/akvo-rsr/issues/2371).

### Mandatory fields in Project Focus

The progress bar in Project Focus section of the Project Editor should work fine now. It should turn green once all mandatory fields are populated.

Github issue: [#2351](https://github.com/akvo/akvo-rsr/issues/2351).


## Performance improvements

### RSR Results performance

Loading results framework with complex hierarchies should be much faster now.

Github issue: [#2378](https://github.com/akvo/akvo-rsr/pull/2378).



# Akvo RSR version 3.15.1 Suva (Hotfix)
Tuesday 18th of August, 2016 [@KasperBrandt](https://github.com/KasperBrandt)

## New & Noteworthy

### Admin permissions
Previously, users with the M&E Managers role would have special permissions in the results framework (e.g. unlock indicator periods, approve indicator updates). However, Admins that do not have all permissions for their projects seemed odd and therefore Admins now have all permissions in the results framework as well.

Similarly, Admins were not able to do everything they wanted in the User management section in MyRSR. For instance, actions on themselves (e.g. set yourself to a different role) were not possible. We have now changed the permissions for Admins on this page as well, so that they're in full control.

Github issues: [#2326](https://github.com/akvo/akvo-rsr/issues/2326) and [#2321](https://github.com/akvo/akvo-rsr/issues/2321).

## Bug fixes

### My updates page crash
In certain scenarios (users with multiple Admin employments), the 'My updates' page in MyRSR would crash because of a bug in the code. This has now been resolved.

Github issue: [#2328](https://github.com/akvo/akvo-rsr/issues/2328).

### Language is mandatory for IATI
An IATI check that was missing so far, is that each project should have a default language specified. We have now added this check to the IATI checks and made the language field mandatory for any IATI validation set.

Github issue: [#2320](https://github.com/akvo/akvo-rsr/issues/2320).

### Cordaid import fixes
For every Cordaid import, we would get two standard errors. One was concerning the sponsor partners and business units, which would fail if a certain business unit did not exist. Also, the codes used by Cordaid for the ```default tied status``` are longer than the IATI codes used in v2.02, so we now allow longer codes for this to at least store their values.

Github issue: [#2333](https://github.com/akvo/akvo-rsr/issues/2333).

## Under the hood

### Allow 'offset' parameter in ```/api/v1/```
The old API has a different pagination system than the one used in Django Rest Framework. Instead of working with a ```page``` parameter, the old TastyPie API used an ```offset``` parameter. This has now been implemented.

Github issue: [#2329](https://github.com/akvo/akvo-rsr/issues/2329).

### Test coverage to 100%
We have implemented unit tests, mainly for the IATI imports, exports and checks. There are still a lot of tests missing, but since we now ignore a large part of RSR (e.g. the ```rsr``` and ```rest``` folders), the test coverage is up to 100%.

Also, builds on Travis will fail from now on when the test coverage is lower than 100%.

Github issue: [#2312](https://github.com/akvo/akvo-rsr/issues/2312).

### Change RSR maintainers
In the RSR settings, we have replaced Kasper Brandt with Paul Burt as an RSR maintainer, since Kasper will be leaving Akvo as of September 2016.

Github issue: [#2322](https://github.com/akvo/akvo-rsr/issues/2322).

# Akvo RSR version 3.15 Suva
Monday 18th of July, 2016 [@KasperBrandt](https://github.com/KasperBrandt)

## New & Noteworthy

### Results framework improvements
The results framework in RSR now has several new options:

- It is possible to order results and indicators;
- Indicators with 'percentage' as the measure will aggregate to the parent project using the average of the child projects;
- New options for enabling or disabling aggregations to the parent project;
- Actual values filled in the project editor will now also aggregate to parent project;
- It is possible to set indicator periods as the default periods for all indicators;
- M&E Managers are able to approve or edit any indicator update on their projects;
- It is possible to add data to indicators for private projects;
- The results framework will scroll up to show the indicator periods in the main panel when an indicator is selected;
- A warning in the project editor for parent projects which indicates that editing or deleting results will have the same effect in the child projects;
- The styling of actual value comments in the 'My results' tab has been improved.

Github issues: [#2185](https://github.com/akvo/akvo-rsr/issues/2185), [#2257](https://github.com/akvo/akvo-rsr/issues/2257), [#1956](https://github.com/akvo/akvo-rsr/issues/1956), [#2272](https://github.com/akvo/akvo-rsr/issues/2272), [#2267](https://github.com/akvo/akvo-rsr/issues/2267), [#2182](https://github.com/akvo/akvo-rsr/issues/2182), [#2300](https://github.com/akvo/akvo-rsr/issues/2300), [#2179](https://github.com/akvo/akvo-rsr/issues/2179), [#2307](https://github.com/akvo/akvo-rsr/issues/2307) and [#2181](https://github.com/akvo/akvo-rsr/issues/2181).

### Show all updates of my organisation in 'My updates'
In the 'My updates' tab of MyRSR, it is now possible to view, edit and delete all updates of a user's organisation, in case the user is an admin of an organisation. Otherwise, the user will only see his own updates.

Github issue: [#2220](https://github.com/akvo/akvo-rsr/issues/2220).

### Allow updates on private projects
It is now possible to place updates on private projects. These private projects, and their updates, will not be shown on RSR if you do not have the access to view them, but they could serve as internal communication or as a way to setup a complete project with updates before making the project public on RSR.

Github issue: [#2299](https://github.com/akvo/akvo-rsr/issues/2299).

### Sector codes in the project editor
The sector codes are no longer mandatory for RSR in the project editor. In addition, when the DAC-3 or DAC-5 vocabularies are chosen, the sector code field will change into a dropdown to select the DAC-3 or DAC-5 codes respectively.

Github issue: [#2223](https://github.com/akvo/akvo-rsr/issues/2223).

### Always mark mandatory fields as mandatory
A small change in the way validation sets work has been implemented: in case a model is mandatory (e.g. partnerships), then the mandatory fields of this model will always show as mandatory.

Previously, these fields would only show mandatory when one of the fields within the model was filled in.

Github issue: [#2229](https://github.com/akvo/akvo-rsr/issues/2229).

### Removed end date check for user invitations
User invitations used to be valid for one week. However, since we've noticed that a lot of users only accepted their invitation after more than a week, we have removed this validation completely, making the user invitations valid forever.

Github issue: [#2250](https://github.com/akvo/akvo-rsr/issues/2250).

### Edit completed or cancelled projects
In the previous release we introduced a change that did not allow for partners to edit completed or cancelled projects. However, this gave partners more issues than expected and therefore these changes have been undone.

Github issue: [#2263](https://github.com/akvo/akvo-rsr/issues/2263).

### Countries in the project editor
We have removed the country code of the countries in the project editor, and in addition the countries will be listed alphabetically by name.

Github issue: [#2278](https://github.com/akvo/akvo-rsr/issues/2278).

### Removed organisation location from project page
The organisation location would previously show on the project page. However, some users confused this with the project's location and therefore the organisation's location has been removed.

Github issue: [#2242](https://github.com/akvo/akvo-rsr/issues/2242).

### Support Markdown in the project summary
In all description fields Markdown was already supported, except for the project summary. We've now added Markdown support for the project summary as well.

Github issue: [#2268](https://github.com/akvo/akvo-rsr/issues/2268).

### Allow '0' as funding amount
We did not allow for an empty or ```0``` as a funding amount for funding partners. This has now been changed, so that a funding partner can also have ```0``` as a funding amount (in case the funding of the partner is unknown, for example).

Github issue: [#2269](https://github.com/akvo/akvo-rsr/issues/2269).

### Hide delete button for certain partnerships
In case someone is editing partnerships in the project editor, the delete button will be hidden in case this partnership is the only partnership that allows the user to edit the project.

There were numerous cases in which a user would remove a partnership and thereby also losing the ability to edit the project. By hiding the delete button in these cases, we now prevent the user from deleting these partnerships.

Github issue: [#2226](https://github.com/akvo/akvo-rsr/issues/2226).

### French translations
French translations have been added for the most important parts of RSR. Not completely everything is translated, but the most vital parts of RSR now have a French translation.

Github issue: [#2000](https://github.com/akvo/akvo-rsr/issues/2000).

## Bug fixes

### Alignment of error message in project editor
The alignment of the error messages in the project editor (for instance, when a project cannot be published) was incorrect. This has now been resolved.

Github issue: [#2224](https://github.com/akvo/akvo-rsr/issues/2224).

### Alignment of table in the report tab
On the report tab of the project page, the column width of the descriptions was a bit too small for the description headers. These have now been made wider in order to display the description header correctly.

Github issue: [#2266](https://github.com/akvo/akvo-rsr/issues/2266).

### Uploading documents in project editor
Uploading documents in the project editor would, in certain scenarios, cause buggy behaviour. This has now been resolved.

Github issue: [#2228](https://github.com/akvo/akvo-rsr/issues/2228).

### Access for organisation admins to the organisation admin
In the RSR backend, the organisation admins did not have access rights to edit all fields. This has now been resolved, so that organisation admins can now also fill in any IATI related field for organisations.

Github issue: [#2261](https://github.com/akvo/akvo-rsr/issues/2261).

### Old project update admin crashing
Whenever the old project update admin was accessed, it would crash. This has now been resolved.

Github issue: [#2276](https://github.com/akvo/akvo-rsr/issues/2276).

### Change the user group to an existing group
In case the permissions of a user would change to a user - organisation - group combination which already existed, an ```IntegrityError``` would be raised, because it is not allowed to have two similar employments. We have changed this so that the error is caught and the user will see a nice warning message on the "User management" page in MyRSR now.

Github issue: [#2274](https://github.com/akvo/akvo-rsr/issues/2274).

### Do not show unpublished projects in the hierarchy
On a project's hierarchy page, we previously showed all projects linked to a project, even though they could be unpublished or private projects. We have changed this so that only published and public projects are shown now.

Github issue: [#2270](https://github.com/akvo/akvo-rsr/issues/2270).

## Under the hood

### Remove old Tastypie API
We have removed the old Tastpie API, that used to be accessible at ```/api/v1/```. Since there are still partners using this API, we have routed the old requests to use the new API (available at ```/rest/v1/```) and minimised the changes in the responses, so that partners will still be able to use the same links as before.

In addition, we have replicated the old ```/api/v1/right_now_in_akvo/``` endpoint - which is used on Akvo's website - in the new API: ```/rest/v1/right_now_in_akvo/```. The old endpoint is also routed to the new API and shows the same information.

Github issues: [#1636](https://github.com/akvo/akvo-rsr/issues/1636) and [#2262](https://github.com/akvo/akvo-rsr/issues/2262).

### New 500 page
A new 500 page is in place. Previously, only an 'Internal server error' message would show. However, we now show a nice error page.

Github issue: [#2218](https://github.com/akvo/akvo-rsr/issues/2218).

### Travis and Coveralls setup
We have setup Travis CI and Coveralls in order to have a better grip on our unit tests and the coverage of these tests.

Github issue: [#2216](https://github.com/akvo/akvo-rsr/issues/2216).

### Add multiple testing scripts
As a start with improved unit testing, we have included several new unit tests, such as tests to check whether the API resources as used by RSR Up still work. In addition, several unit tests for the results framework are now in place.

Github issue: [#2205](https://github.com/akvo/akvo-rsr/issues/2205).

### Non-unicode location data
Whenever non-unicode location data was entered in the project editor, this would give an error in Sentry. The user would still see a nice error in the project editor, but the error is now caught in the backend as well.

Github issue: [#2275](https://github.com/akvo/akvo-rsr/issues/2275).

### Invalid query parameters cause internal server error
In the API, when supplying the ```filter``` parameter with incorrect details, an internal server error would be returned. We have now changed this so that a normal response is returned including the cause of the error.

Github issue: [#2291](https://github.com/akvo/akvo-rsr/issues/2291).

### Corrupt images cause internal server error
In the API, when trying to fetch a project or project update with a corrupt image file, an internal server error would be returned. We have now changed this so that the image will not be returned, but ```null``` will be returned instead.

Github issue: [#2291](https://github.com/akvo/akvo-rsr/issues/2291).

### Password protection for test environments
We have added a warning and a password pop-up for our test environments. This was done so that it is clear to users that they're not actually viewing live data, but test data. Once a password is filled in, the warning will not show for a week.

Github issue: [#2225](https://github.com/akvo/akvo-rsr/issues/2225).

# Akvo RSR version 3.14.1 Riga (Hotfix)
Monday 13th of June, 2016 [@KasperBrandt](https://github.com/KasperBrandt)

## Bug fixes

### Remove location filter on Akvo Pages
The updates listing page on Akvo Pages would crash after the v3.14 release, because we still tried to filter on countries (which had been removed in this release). This has now been resolved.

Github issue: [#2245](https://github.com/akvo/akvo-rsr/issues/2245).

# Akvo RSR version 3.14 Riga
Monday 6th of June, 2016 [@KasperBrandt](https://github.com/KasperBrandt)

## New & Noteworthy

### Edit and remove project updates
It is now possible to edit and delete your own project updates through the 'My updates' section in MyRSR.

Previously we had a time limit of 30 minutes after placing the update in which in was possible to edit your update. This time limit has now been removed, and in addition the option to delete an update has been added.

Github issue: [#2191](https://github.com/akvo/akvo-rsr/issues/2191).

### Small project editor improvements
Several small improvements have been made in the project editor:

- Changed the link for looking up a latitude and longitude to [http://www.latlong.net/](http://www.latlong.net/);
- The datepickers now allow for a year selection;
- The 'add organisation' pop-up has been improved, and the newly added organisation is now automatically selected.

Github issues: [#1995](https://github.com/akvo/akvo-rsr/issues/1995) and [#1999](https://github.com/akvo/akvo-rsr/issues/1999).

### Further alignment with IATI standard
Several areas of RSR did not completely align with the IATI standard yet. We have now changed the following fields in order to further align with IATI:

- Project currency now supports all currencies available in IATI (instead of only Euros and US Dollars);
- Project status has been converted to IATI statuses. This was already done during the IATI export and import, therefore it makes more sense to use the same statuses in RSR as well;
- The country field is removed from the location model in the project editor, and converted to the recipient country model.

All original fields will still be available through the API, for legacy support.

Github issues: [#1801](https://github.com/akvo/akvo-rsr/issues/1801), [#1804](https://github.com/akvo/akvo-rsr/issues/1804) and [#2189](https://github.com/akvo/akvo-rsr/issues/2189).

### Plan Finland custom report
A custom report for Plan Finland has been added to the 'My reports' section. This report will only be visible for Plan Finland users and general superusers.

Github issue: [#2194](https://github.com/akvo/akvo-rsr/issues/2194).

### Project title in My projects links to project editor
A small change in the My projects section now makes sure that the user is directed to the project editor when the project title is clicked, but only when the user has the rights to edit projects. Otherwise, the project title will still link to the project page.

Github issue: [#2176](https://github.com/akvo/akvo-rsr/issues/2176).

### Completed and cancelled projects cannot be edited or updated
We've disabled the abilty to place project updates or edit a project with the 'Completed' or 'Cancelled' status.

Github issues: [#2006](https://github.com/akvo/akvo-rsr/issues/2006) and [#2149](https://github.com/akvo/akvo-rsr/issues/2149).

### Removed 'IATI' and 'XML' export from project page
Underneath the 'Export data' options on the project page there used to be an IATI and an XML link (the latter would point to the API). These have now been removed, leaving RSS and JSON in this list.

Github issue: [#2033](https://github.com/akvo/akvo-rsr/issues/2033).

## Bug fixes

### Show project documents on project page
In the footer on the project page, it should show the project documents. However, due to a bug these were never shown. This has now been resolved.

Github issue: [#2197](https://github.com/akvo/akvo-rsr/issues/2197).

### IATI import fixes
Several small bugs in the IATI import have been addressed:

- The humanitarian field always gave an error when it is not present in the IATI XML;
- Organisation information is not overwritten anymore when the organisation has a different content owner.

Github issues: [#2042](https://github.com/akvo/akvo-rsr/issues/2042) and [#2167](https://github.com/akvo/akvo-rsr/issues/2167).

## Under the hood

### Unit tests for the IATI import and export
We have added several unit tests for the IATI import and export, in order to automatically test if generating and importing IATI XML files still works.

Github issue: [#2170](https://github.com/akvo/akvo-rsr/issues/2170).

### Updated /auth/token/ endpoint for RSR Up
The ```/auth/token/``` endpoint has been updated to also support JSON, and the projects that the user can edit are now supplied in a list.

Github issue: [#2168](https://github.com/akvo/akvo-rsr/issues/2168).

### Removed unused fields for Akvo Pages
The 'About box text' and 'About box image' for Akvo Pages are not relevant anymore, and have therefore been removed from the (old) admin.

Github issue: [#2053](https://github.com/akvo/akvo-rsr/issues/2053).

### Cleanup scripts
Two new management scripts have been added for the cleanup of empty projects, and spam user accounts.

Github issues: [#1753](https://github.com/akvo/akvo-rsr/issues/1753) and [#2003](https://github.com/akvo/akvo-rsr/issues/2053).

# Akvo RSR version 3.13.3 Quito (Hotfix 3)
Tuesday 24th of May, 2016 [@KasperBrandt](https://github.com/KasperBrandt)

## Bug fixes

### RSR Up crashes because of changed endpoint
An API endpoint that was used by Up used to be able to accept datetimes, but due to a change in date validation datetimes were not accepted anymore, only dates.

Github issue: [#1774](https://github.com/akvo/akvo-rsr/issues/1774).

# Akvo RSR version 3.13.2 Quito (Hotfix 2)
Tuesday 17th of May, 2016 [@KasperBrandt](https://github.com/KasperBrandt)

## Under the hood

### API crash when parameters are not necessary
The API would crash for certain parameters which are not necessary, such as ```/rest/v1/project_extra/2649/?partners=273```. These parameters will now be ignored.

Github issue: [#2171](https://github.com/akvo/akvo-rsr/issues/2171).

# Akvo RSR version 3.13.1 Quito (Hotfix)
Wednesday 11th of May, 2016 [@KasperBrandt](https://github.com/KasperBrandt)

## Bug fixes

### Project page crash for funding partnerships without organisation
In case a funding partnership of a project does not have an organisation specified, the finance tab (and therefore, the whole project page) would crash, because it expects an organiastion. This has now been resolved.

Github issue: [#2162](https://github.com/akvo/akvo-rsr/issues/2162).

## Under the hood

### API crash when parameters or values are non-existent
The API would crash for certain parameters, or for values that are non-existent, such as ```/rest/v1/?project=```. This has now been resolved.

Github issues: [#2163](https://github.com/akvo/akvo-rsr/issues/2163) and [#2160](https://github.com/akvo/akvo-rsr/issues/2160).

# Akvo RSR version 3.13 Quito
Tuesday 3rd of May, 2016 [@KasperBrandt](https://github.com/KasperBrandt)

## New & Noteworthy

### Improved IATI exports
The IATI exports page on MyRSR has been improved with several enhancements:

- Previously, larger IATI exports (with more than 100 projects) would give a time-out. This has now been resolved.
- A new overview of all the organisation's IATI exports and files. And the option to display a file on the organisation's page.
- Filtering options for creating an IATI export, such as to select all projects without errors or projects that were included in last export (or a combination of the two).

Github issue: [#2102](https://github.com/akvo/akvo-rsr/issues/2102).

### 'Add an update' button in header returned
The 'Add an update' button in the top navigation had been removed, since it was causing confusing for some users. However, it turned out that other users now could not find where to place an update, therefore this button has now been restored in its' old format.

Github issue: [#2130](https://github.com/akvo/akvo-rsr/issues/2130).

### Styling of social media links in organisations list
The styling of the social media links and the IATI organisation identifier has been changed in the organisations list. The old mark-up and styling did not look clean, but this has now been resolved.

Github issue: [#2128](https://github.com/akvo/akvo-rsr/issues/2128).

### Actual value comment in the results framework
We would display the comment on the target values in the results framework previously. However, the actual value comments did not show. Therefore, these have been added to the results framework, both on the project page as the 'My results' section in MyRSR.

Github issue: [#2125](https://github.com/akvo/akvo-rsr/issues/2125).

### Support for markdown in most description fields
All description fields, except for the project summary, now support markdown. Using markdown it is possible to add headers, links and images (amongst other things) to the text. The changes can be seen on the summary and full report tabs of the project page.

Github issue: [#2117](https://github.com/akvo/akvo-rsr/issues/2117).

### API key on the 'My details' page
In MyRSR, on the 'My details' page, users can now find their API key and a link to the support documentation on how to use the RSR API.

Github issue: [#1990](https://github.com/akvo/akvo-rsr/issues/1990).

## Bug fixes

### Forbidden error when adding a new project
In certain cases a 403 - Forbidden error would show when trying to create a new project in the 'My projects' section in MyRSR. This was due to the fact that adding a partner to the project failed. This bug has now been resolved, and the page now has better error handling in the case it does happen.

Github issue: [#2132](https://github.com/akvo/akvo-rsr/issues/2132).

### Results framework for private projects
Private projects would previously not be selected in the 'My results' section of MyRSR. This has now been resolved, so that results data can be filled in for private projects as well.

Github issue: [#2113](https://github.com/akvo/akvo-rsr/issues/2113).

### Project count on organisations listing page
The project count on the organisations listing page would also count unpublished projects, whereas the organisation page itself only counts published projects of an organisation. This has now been resolved so that the unpublished projects are not counted anymore on the organisations listing page.

Github issue: [#2038](https://github.com/akvo/akvo-rsr/issues/2038).

## Under the hood

### Project document category API endpoint crash
The project document category API endpoint had not been setup correctly, and would therefore crash when called. This has now been resolved.

Github issue: [#2134](https://github.com/akvo/akvo-rsr/issues/2134).

### General API filtering
We have extended the filter options of the ```/rest/v1/``` API in order to support any kind of filtering that is possible in the Django framework, by making use of the "filter" parameter. For instance: ```http://rsr.localdev.akvo.org/rest/v1/project_update/?filter={'project__partners':415,'project__keywords__label':'drydev'}```.

Github issue: [#2095](https://github.com/akvo/akvo-rsr/issues/2095).

### Employment endpoint does not require Django login anymore
The employment endpoint, to be used by the RSR Up app in the near future, does not require a Django authentication anymore, but is extended by making use of API key authentication.

Github issue: [#2074](https://github.com/akvo/akvo-rsr/issues/2074).

### API date validation
Some API endpoints could crash when an invalid date was entered as a filtering parameter. We now validate these dates and return a 400 status in case the date is not valid.

Github issue: [#1774](https://github.com/akvo/akvo-rsr/issues/1774).

### New 404 page
A new 404 page is in place for RSR, similar to the 404 page which is used on [Akvo's website](http://akvo.org).

Github issue: [#1294](https://github.com/akvo/akvo-rsr/issues/1294).

### Performance improvements
We have improved the performance of the project_extra API endpoint, and set a tighter limit on the number of objects retrieved by the RSS feeds, in order to improve RSR's performance in general.

Github issues: [#2154](https://github.com/akvo/akvo-rsr/issues/2154) and [#2155](https://github.com/akvo/akvo-rsr/issues/2155).

# Akvo RSR version 3.12.1 Pretoria (Hotfix)
Tuesday 12th of April, 2016 [@KasperBrandt](https://github.com/KasperBrandt)

## Bug fixes

### Scroll bar in results framework
In some scenarios it was possible to create a horizontal and vertical scroll bar in the results framework. This has now been fixed so that the scrollbar should not appear, even when resizing the browser window.

Github issue: [#2105](https://github.com/akvo/akvo-rsr/issues/2105).

### 'See all updates for this project' link not working
For projects with updates, we display a 'See all updates for this project' link on the bottom of the summary tab on the project page. This link should direct the user to the 'Updates' tab, but this was not functioning properly and has now been resolved.

Github issue: [#2107](https://github.com/akvo/akvo-rsr/issues/2107).

## Under the hood

### IATI export crashes when budget items has no value
Budget items without a value filled in would make the IATI export crash, but only when there was a label, value date or currency filled in for the budget item. This has now been resolved by not generating a ```value``` tag when there is no value indicated.

Github issue: [#2108](https://github.com/akvo/akvo-rsr/issues/2108).

### Indicator period data comment API endpoint crashes
For non-superusers, the indicator period data comment API would crash, since it had not been setup correctly. This could lead to the comments in the indicator updates not loading correctly for some users, and has now been resolved.

Github issue: [#2109](https://github.com/akvo/akvo-rsr/issues/2109).

# Akvo RSR version 3.12 Pretoria
Tuesday 5th of April, 2016 [@KasperBrandt](https://github.com/KasperBrandt)

## New & Noteworthy

### New results tab on the project page
All projects with results will now have a 'Result' tab on the project page, which will display the project's result framework. While adding the new tab, the design of the project page has been renewed and the data on the page is now loaded dynamically in order to allow for faster loading times.

Besides this new tab, the design and functionality of the results framework itself, both on the project page and in MyRSR, has been improved as well. The design is more clean and loading icons have been added.

Github issues: [#1966](https://github.com/akvo/akvo-rsr/issues/1966), [#2010](https://github.com/akvo/akvo-rsr/issues/2010), [#2011](https://github.com/akvo/akvo-rsr/issues/2011), [#2045](https://github.com/akvo/akvo-rsr/issues/2045), [#2050](https://github.com/akvo/akvo-rsr/issues/2050) and [#2078](https://github.com/akvo/akvo-rsr/issues/2078).

### IATI v2.02 and organisation standard
RSR has been updated to contain all [IATI v2.02](http://iatistandard.org/202/activity-standard/) and [IATI organisation](http://iatistandard.org/202/organisation-standard/) fields.

All IATI v2.02 fields can be found in the project editor, when the 'IATI' checkbox is checked. In addition, the IATI import, export, and the 'Full report' tab on the project page have been updated to correctly display any IATI information.

For the organisation standard, we've only added the fields to the old organisation admin page. No UI is available in MyRSR yet to fill in extensive organisation information.

Github issues: [#1040](https://github.com/akvo/akvo-rsr/issues/1040), [#1920](https://github.com/akvo/akvo-rsr/issues/1920) and [#2077](https://github.com/akvo/akvo-rsr/issues/2077).

### Publish directly to the IATI registry
IATI files are now available under two new URLs, making it possible to 'publish directly' to the IATI registry once an URL has been registered there. The following URLs are now available:

- ```/organisation/<organisation-id>/iati/```: This URL will display the latest generated public IATI file of an organisation. Once this link has been registered in the IATI registry, it is possible to generate a new file in RSR and it will automatically be logged in the IATI registry.
- ```/organisation/<organisation-id>/iati-org/```: This URL will display the IATI organisation file of an organisation with the latest information of an organisation. Editing organisation data will automatically result in an updated organisation file.

Github issues: [#2004](https://github.com/akvo/akvo-rsr/issues/2004) and [#2080](https://github.com/akvo/akvo-rsr/issues/2080).

### Styling update for the 'My projects' list in MyRSR
The styling of the projects list in MyRSR has been updated, so that it is now more clear which projects are unpublished or private. Also, the styling of disabled buttons is renewed.

Github issue: [#2081](https://github.com/akvo/akvo-rsr/issues/2081).

## Bug fixes

### Partnerships without an organisation would break RSR
It is in some cases possible to save a partnership in RSR, without specifying an organisation. Previously this was not possible, but if this scenario happened, it would break the project directory page in RSR. This has now been resolved.

Github issue: [#2051](https://github.com/akvo/akvo-rsr/issues/2051).

### Unknown IATI organisation roles would break RSR
During an IATI import, it is possible that the IATI organisation role of a partnership is an unknown value for RSR. In these edge cases, RSR would break. This has now been resolved.

Github issue: [#2059](https://github.com/akvo/akvo-rsr/issues/2059).

## Under the hood

### No index for non-live environments
We have added a new ```<meta name="robots" content="none">``` tag for the non-live environments of RSR, so that they don't get indexed anymore and won't show in Google's search results.

Github issue: [#273](https://github.com/akvo/akvo-rsr/issues/273).

### Requesting to join an organisation endpoint authorization
The API endpoint for requesting to join an organisation needed Django authorization. However, as we are in the process of updating the RSR Up app, a general authorization method is required for this endpoint.

Github issue: [#2074](https://github.com/akvo/akvo-rsr/issues/2074).

# Akvo RSR version 3.11.4 Ouagadougou (Hotfix 4)
Wednesday 9th of March, 2016 [@KasperBrandt](https://github.com/KasperBrandt)

## Bug fixes

### Click on descriptions reloads project page
When trying to open one of the description fields on the project page, the project page reloaded, making it impossible to view some of the descriptions. This has now been resolved.

Github issue: [#2041](https://github.com/akvo/akvo-rsr/issues/2041).

## Under the hood

### Copy external Javascript and CSS files to RSR server
Several Javascript and CSS files that we loaded from external sources have been copied to RSR's servers. Some aggressive siteblockers could, for instance, completely block Facebook from where we retrieved our React Javascript files, causing parts of RSR to break.

Github issue: [#2047](https://github.com/akvo/akvo-rsr/issues/2047).

### File uploads for indicator data update
The permissions on the file uploads endpoint for indicator data updates have been changed, so that it is now possible for the RSR Up app to upload images and files when placing an indicator data update.

Github issue: [#2037](https://github.com/akvo/akvo-rsr/issues/2037).

# Akvo RSR version 3.11.3 Ouagadougou (Hotfix 3)
Friday 4th of March, 2016 [@KasperBrandt](https://github.com/KasperBrandt)

## Bug fixes

### Re-enable support center
The new 'HELP' button on the right side of any RSR page is re-enabled. We took it off after last release, since it caused Javascript conflicts on some pages, making the pages not function properly anymore. This should be resolved now.

Github issue: [#2027](https://github.com/akvo/akvo-rsr/issues/2027).

### Labels in project editor disappeared
We have fixed a styling bug where the labels of some inputs in the project editor partly disappeared underneath the input itself.

Github issue: [#2030](https://github.com/akvo/akvo-rsr/issues/2030).

### Multiple roles for one user on same organisation
It is now possible for a user to have multiple roles on the same organisation. So a user can be a 'M&E Manager' and 'Admin' at the same time, for instance.

Github issues: [#2024](https://github.com/akvo/akvo-rsr/issues/2024) and [#2028](https://github.com/akvo/akvo-rsr/issues/2028).

## Under the hood

### Upgrade to React v0.14.7
All pages in RSR that use React.js have been updated to v0.14.7. We used a lot of different versions on different pages and some versions are not supported anymore, therefore we decided to upgrade to the latest React version everywhere.

In addition, this made it possible to bring back the SupportHero plugin.

Github issue: [#900](https://github.com/akvo/akvo-rsr/issues/900).

### Project update admin broken
We have fixed the project update admin, which gave an internal server error after last release.

Github issue: [#2026](https://github.com/akvo/akvo-rsr/issues/2026).

# Akvo RSR version 3.11.2 Ouagadougou (Hotfix 2)
Friday 26th of February, 2016 [@KasperBrandt](https://github.com/KasperBrandt)

## Bug fixes

### Disable support center
The new 'HELP' button on the right side of any RSR page was causing several pages (those with the React Bootstrap library) not to load. Therefore we have decided to disable this support button for now. We will investigate how the button can be put back.

Github issue: [#2020](https://github.com/akvo/akvo-rsr/issues/2020).

## Under the hood

### Change Piwik URL to https
The Piwik URL has been set to https, in order to prevent a redirect before the actual Piwik script is called. Piwik is used in RSR for the site's analytics.

Github issue: [#2013](https://github.com/akvo/akvo-rsr/issues/2013).

# Akvo RSR version 3.11.1 Ouagadougou (Hotfix)
Friday 26th of February, 2016 [@KasperBrandt](https://github.com/KasperBrandt)

## Bug fixes

### Project update API error
The project update API endpoint gave an internal server error, due to the changes in the project update model for the new results framework. This has been resolved.

Github issue: [#2014](https://github.com/akvo/akvo-rsr/issues/2014).

### Correct link to the RSR support center
The RSR support center, in RSR's footer, still had an old link. This has been changed to [http://rsrsupport.akvo.org/](http://rsrsupport.akvo.org/).

Github issue: [#2016](https://github.com/akvo/akvo-rsr/issues/2016).

### My organisations in 'My details' not loading
The My organisations part of 'My details' was not loading for all users. This component has been rewritten partly so that it now always loads.

Github issue: [#2018](https://github.com/akvo/akvo-rsr/issues/2018).

# Akvo RSR version 3.11 Ouagadougou
Tuesday 24th of February, 2016 [@KasperBrandt](https://github.com/KasperBrandt)

## New & Noteworthy

### New 'My results' section in MyRSR
This release will contain a preliminary version of RSR's new results framework, which can be found in the 'My results' section of MyRSR. Initially, only a few selected projects will be able to use this functionality (to be set by superusers).

The 'My results' section will allow for users to fill in data in the results framework of a project. A new role, the "M&E Manager", will be able to approve these updates. This process will make it possible to update the results of a project in real-time.

Note that the results framework will not be visible on a project page yet, only a text version as one of the descriptions on the project page. This feature is coming up in the next release, for now it is only possible to view and fill in a results framework in MyRSR.

Github issue: [#1897](https://github.com/akvo/akvo-rsr/issues/1897).

### MyRSR and typography overhaul
In order for the 'My results' tab to be added, MyRSR has been redesigned and the typography of all pages in RSR has been adjusted in the process as well. MyRSR used to have a vertical menu on the left side, this has been changed to a horizontal menu underneath the top navigation bar, so that there is more space on all MyRSR pages.

Also, the 'Change password' page on MyRSR has been integrated into the 'My details' page, and the 'My details' page itself is now available on a new URL: ```/myrsr/details``` (used to be just ```/myrsr/```).

Github issues: [#1955](https://github.com/akvo/akvo-rsr/issues/1955), [#1965](https://github.com/akvo/akvo-rsr/issues/1965) and [#1994](https://github.com/akvo/akvo-rsr/issues/1994).

## Bug fixes

### IATI import bugfixes
A few bugfixes in the IATI import have been addressed. Specifically, a scheduled import did not always run on time and the performance of generating CSV files has been increased.

Github issue: [#1980](https://github.com/akvo/akvo-rsr/issues/1980).

# Akvo RSR version 3.10 Nouakchott
Tuesday 19th of January, 2016 [@KasperBrandt](https://github.com/KasperBrandt)

## New & Noteworthy

### New 'My reports' section in MyRSR
When a user is logged in, a new section can be seen in MyRSR: 'My reports'. In this section it is possible to select from four pre-defined reporting templates: __Projects overview__, __Data quality__, a __Results and indicators overview__ and a __Results and indicators table view__.

Based on the selected reporting template the user will have to select a project or organisation to base the report on and a format. Initially we will support PDF and Excel, depending on the report. We will continue to add new reports and improve existing reports.

Github issues: [#1957](https://github.com/akvo/akvo-rsr/issues/1957), [#1960](https://github.com/akvo/akvo-rsr/issues/1960) and [#1964](https://github.com/akvo/akvo-rsr/issues/1964).

### IATI import with scheduler
We have completely refactored the code for our IATI import module and introduced a scheduler that allows for periodic imports. This makes it possible to import a certain IATI file every day, week or month for example. In addition, we have added several custom import mappers for specific partners, such as Cordaid and ICCO.

Github issues: [#1828](https://github.com/akvo/akvo-rsr/issues/1828) and [#1980](https://github.com/akvo/akvo-rsr/issues/1980).

### Custom validation sets in the project editor
In the project editor, we have introduced the concept of custom validation sets. A validation set determines which fields in the project editor are mandatory and which fields should be hidden. This makes it easily possible to customise the project editor per project.

It is also possible to have a combination of validations sets, for example 'RSR' (the default validation set) and 'IATI' (the IATI validation set). This will result in all fields of RSR and IATI being mandatory, so that the project can be published to both RSR and IATI once all progress bars are green.

In the backend, it is possible for superusers to add a new validation set, so that we can update the project editor for any project at any time and introduce specific mandatory fields, like a DFID or DGIS IATI set.

Github issues: [#1760](https://github.com/akvo/akvo-rsr/issues/1760), [#1878](https://github.com/akvo/akvo-rsr/issues/1878) and [#1895](https://github.com/akvo/akvo-rsr/issues/1895).

### Invite users
We have added functionality to invite users in the 'User management' section in MyRSR. Users with sufficient permissions (e.g. superusers, organisation admins or user managers) will see a new button in the top right corner of the page that will open a dialog to invite users. For every invited user, an organisation and role needs to be filled in.

Once invitations have been sent, RSR will check if the user is already active in RSR. If so, the user will be added to the organisation to which the user is invited and the user will receive an email about this. If the user is new or not active yet, he or she will receive an activation email with an activation link. This link will lead the new user to a page where he or she will need to fill in additional details (first and last name, and a password) and then activate the account. Once the account is activated, the user that had invited the new user will receive a notification of this per email.

Github issue: [#1005](https://github.com/akvo/akvo-rsr/issues/1005).

### Private projects
The private projects functionality is now fully developed. However, it is only available for superusers. A superuser can set any project to private in the project editor, which will result in the project not being visible in any public list or API, but visible for anyone that has editing rights to the project.

Github issue: [#1946](https://github.com/akvo/akvo-rsr/issues/1946).

### Improved 'My organisations' in MyRSR
In the 'My details' section of MyRSR, we have refactored and improved the section in which it is possible to request to join an organisation. It is now possible to search an organisation either by long or short name, and to connect to an organisation with a special character. In addition, it is now possible for a user to delete one of his own employments.

Github issues: [#1510](https://github.com/akvo/akvo-rsr/issues/1510) and [#1778](https://github.com/akvo/akvo-rsr/issues/1778).

### Increased character limits
We have increased the number of characters allowed for some of RSR's fields. All description fields now have an unlimited number of characters, except for the project plan summary, which has a limit of 2000 (used to be 400). In addition, project titles and subtitles are now allowed to have 200 characters, organisation names 40 characters and organisation long names 100 characters.

Since the project plan summary will not display nicely on the project page when it's more than 400 characters, we've added a 'Read more' link in case it is longer than that.

Github issue: [#1948](https://github.com/akvo/akvo-rsr/issues/1948)

## Bug fixes

### Indicator values on project page
In the 'Results and indicators' section on the project page, the actual or target values of an indicator would not show if the start or end date of an indicator period was not filled in. This has now been resolved and the values will always be shown.

Github issue: [#1953](https://github.com/akvo/akvo-rsr/issues/1953).

### Reporting organisation added as participating organisation
In the IATI export, the reporting organisation would be added as a participating organisation as well as the reporting organisation. This was a bug in the IATI export and has now been resolved so that the reporting organisation is only exported as such.

Github issue: [#1947](https://github.com/akvo/akvo-rsr/issues/1947).

### Keyword logos on project page
A project page can have two keyword logos shown in the project's header. However, these two logos were missing any styling, so we have now aligned them horizontally and added some spacing in between the two.

Github issue: [#1855](https://github.com/akvo/akvo-rsr/issues/1855).

### Project page crash in case of multiple reporting organisations
In RSR we don't allow for multiple reporting organisations, adhering to the IATI standard. However, mostly due to legacy, there are some projects that have more than one reporting organisation. In these cases, the project page would crash since we assumed there would only be one reporting organisation. This has now been fixed.

Github issue: [#1971](https://github.com/akvo/akvo-rsr/issues/1971).

# Akvo RSR version 3.9.1 Maseru (Hotfix)
Thursday 3rd of December 2015, [@KasperBrandt](https://github.com/KasperBrandt)

## Bug fixes

### RSR Up app crashed
Due to a performance enhancement in RSR's API, the resource that the Up app uses was broken. This has now been resolved.

Github issue: [#1939](https://github.com/akvo/akvo-rsr/issues/1939).

### Organisation list shows internal server error
Due to changes in RSR's organisation list, a timeout of the page was shown. This has now been resolved by reverted the changes.

Github issue: [#1940](https://github.com/akvo/akvo-rsr/issues/1940).

### REST API not showing the correct objects
Due to the introduction of private projects, we tried to filter out all private projects from the API. However, this introduced a bug that showed the same resource multiple times or some resources not at all. The changes have now been reverted, meaning that private projects will show in the API for now. This will be addressed in a later release.

Github issue: [#1944](https://github.com/akvo/akvo-rsr/issues/1944).

# Akvo RSR version 3.9 Maseru
Friday 27th of November 2015, [@KasperBrandt](https://github.com/KasperBrandt)

## New & Noteworthy

### Private projects
Technically, it is now possible to set a project to 'private'. Private projects will not appear anywhere on RSR or in the API, only in MyRSR if you have sufficient permissions to see the project.

We are currently working on improving the project editor, but those changes will not be taken along in this release yet. Therefore it will not be possible yet to set a project to private in the project editor.

Github issue: [#1820](https://github.com/akvo/akvo-rsr/issues/1820).

### Change of support email addresses
We are in the process of moving to a new support system, and therefore all support email addresses on RSR have been changed to rsr@akvo.org.

Github issue: [#1891](https://github.com/akvo/akvo-rsr/issues/1891).

## Bug fixes

### Styling of results on the project summary page
The styling of results and indicators on the project summary page had been changed due to the results framework release. Indicators were shown in bold and results were shown in a normal font, whereas this should be the other way around. We have now fixed this and improved the display of results on the project summary page in general.

Github issue: [#1924](https://github.com/akvo/akvo-rsr/issues/1924).

### Internal server error when grabbing a widget
Some projects, those without a reporting organisation, gave an internal server error when a user tried to create a map or projects list widget. These widgets need an organisation as input and took the reporting organisation by default, so an error was shown when no reporting organisation was present. This has now been changed so that the primary organisation is taken as default.

Github issue: [#1923](https://github.com/akvo/akvo-rsr/issues/1923).

### Project editor crash when project conditions filled in
The project editor crashed when project conditions with only a type, and no text, were filled in. This has now been resolved.

Github issue: [#1919](https://github.com/akvo/akvo-rsr/issues/1919).

## Under the hood

### Basic reports
We have added some simple reports to make it easier to get started with RSR reports in BIRT. It is useful to have reports that are less complex than the result framework one.

Github issue: [#1899](https://github.com/akvo/akvo-rsr/issues/1899).

### Unit tests are fixed
Some of our unit tests were broken due to the changes introduced with the release of the results framework prototype. These have now been fixed.

Github issue: [#1925](https://github.com/akvo/akvo-rsr/issues/1925).

### Old user admin is fixed
The old user admin, not often used anymore since we have 'User management' in MyRSR, was broken in certain scenarios. This has now been resolved.

Github issue: [#1922](https://github.com/akvo/akvo-rsr/issues/1922).

# Akvo RSR version 3.8.1 Lilongwe (Hotfix)
Friday 13th of November 2015, [@KasperBrandt](https://github.com/KasperBrandt)

## Bug fixes

### Partner logos disappeared
The partner logos had disappeared from the partners tab. This has now been resolved.

Github issue: [#1911](https://github.com/akvo/akvo-rsr/issues/1911).

### Project footer disappeared
The project page used to have a footer, including the project links, documents, and export options. Due to the merging of several project pages into the tabs system, the project footer had accidentally been removed. This is now resolved.

Github issue: [#1908](https://github.com/akvo/akvo-rsr/issues/1908).

### Validation error when saving an organisation
Adding or changing an IATI organisation ID in the 'old' RSR admin gave an error. The reason for this was a bug in the check for duplicate IATI IDs, which is now resolved.

Github issue: [#1903](https://github.com/akvo/akvo-rsr/issues/1903).

### Partnerships without a role would crash RSR
A scenario that does not occur often, a partnership without a partner role, caused the RSR project list and project main pages to crash. This has now been fixed.

Github issue: [#1901](https://github.com/akvo/akvo-rsr/issues/1901).

### Projects without partners would crash RSR
Another scenario that nearly never happens is a project without partners. This would also cause the project listing to crash, as it looked for the primary organisation of the project. This has now been fixed.

Github issue: [#1900](https://github.com/akvo/akvo-rsr/issues/1900).

## Under the hood

### Performance of listing pages
We noticed a dramatic performance degradation of especially the project listing page. After investigating the issue we found several possibilities of reducing loading times, which have been implemented. The projects, organisations and updates listing pages should load considerably faster now.

Github issue: [#1902](https://github.com/akvo/akvo-rsr/issues/1902).

# Akvo RSR version 3.8 Lilongwe
Monday 9th of November 2015, [@KasperBrandt](https://github.com/KasperBrandt)

## New & Noteworthy

### Results framework (prototype)
A prototype of the results framework is included in this release. Initially, only Akvo staff will be able to set up a project as an 'RSR Impact' project, meaning that a 'Results & indicators' tab will be added to the project page.

It is then possible to place updates to an indicator period, in order to update the actual values of an indicator over time. In addition, results can be linked to a parent project (programme) that will aggregate the results of underlying projects in order to show an overview of all results of a programme.

Also, we've added a PDF report, which is significantly different from the project main page, for the results framework of a project using ReportServer. This is the first time we've incorporated ReportServer into RSR, as we're looking into using it more often for other reports as well.

Github issues: [#1772](https://github.com/akvo/akvo-rsr/issues/1772), [#1773](https://github.com/akvo/akvo-rsr/issues/1773), [#1831](https://github.com/akvo/akvo-rsr/issues/1831), [#1868](https://github.com/akvo/akvo-rsr/issues/1868), [#1877](https://github.com/akvo/akvo-rsr/issues/1877), [#1879](https://github.com/akvo/akvo-rsr/issues/1879), [#1889](https://github.com/akvo/akvo-rsr/issues/1889) and [#1892](https://github.com/akvo/akvo-rsr/issues/1892).

### Tabs on project main page
The project main page has been redesigned slightly to allow for more information to be displayed within several tabs. This effort is part of the results framework designs.

Github issue: [#1773](https://github.com/akvo/akvo-rsr/issues/1773) and [#1892](https://github.com/akvo/akvo-rsr/issues/1892).

### Reporting organisation as partner type
The reporting organisation has changed, it is now one of the partner types (like 'accountable' or 'funding'). This will resolve several issues we had concerning reporting organisations not being seen as a partner on the project.

In addition, we have removed the 'Reportable' setting for organisations, as this was a confusing setting. Instead, we now have a 'Can create projects' setting for organisations. Partner editors of this organisation can create new projects, and publish projects it is a partner of.

Github issue: [#1800](https://github.com/akvo/akvo-rsr/issues/1800), [#1826](https://github.com/akvo/akvo-rsr/issues/1826) and [#1874](https://github.com/akvo/akvo-rsr/issues/1874).

### Explanation on maps
An explanation on maps has been added to state that only the projects, organisations or updates on that page are shown on the map. In the long run we are aiming to replace the Google Maps with CartoDB and display all points on any of the maps.

Github issue: [#1288](https://github.com/akvo/akvo-rsr/issues/1288).

## Bug fixes

### Project editor bug fixes
We have fixed two small bugs in the project editor:

- The IATI Identifier field would show 'None' when it wasn't filled in. Instead, it is empty now. Github issue: [#1866](https://github.com/akvo/akvo-rsr/issues/1866).
- It wasn't possible to set 'Aggregation status' and 'Ascending' to No in the project editor. This has been resolved. Github issue: [#1881](https://github.com/akvo/akvo-rsr/issues/1881).

### Not possible to save organisations
Due to a bug that checked the uniqueness of an organisation's name, it wasn't possible to save an organisation anymore. This has now been resolved.

Github issue: [#1859](https://github.com/akvo/akvo-rsr/issues/1859).

### Special characters in update titles
Some of the maps did not display the titles of updates correctly due to an encoding error, this is now solved.

Github issue: [#1849](https://github.com/akvo/akvo-rsr/issues/1849).

### IATI checks for transactions
A small bug in the IATI checks showed transactions with a value filled in as incorrect. This has been fixed and in addition we have added checks for value dates as these are required by IATI v2.01.

Github issue: [#1851](https://github.com/akvo/akvo-rsr/issues/1851).

### Full data report missing fields
We have extended and fixed some bugs in the full data report, such as the project's currency (was missing) and the outline of the indicator periods.

Github issue: [#1880](https://github.com/akvo/akvo-rsr/issues/1880).

## Under the hood

### The admin crashed if not all permission groups are in the database
In case not all 4 permission groups were in the database (Admins, Project editors, User managers and Users), the 'old' RSR admin crashed. This error is now caught.

Github issue: [#1069](https://github.com/akvo/akvo-rsr/issues/1069).

### Akvo Pages with a capital in the hostname does not work
When an Akvo Page's hostname was filled in containing a capital, the Akvo Page would not work. Since hostnames are case insensitive by design, we have now made it impossible to place capitals in an Akvo Page's hostname.

Github issue: [#1500](https://github.com/akvo/akvo-rsr/issues/1500).

### Turn off broken link emails
The RSR admins received a lot of emails concerning broken links (hundreds a day). This setting is now turned off.

Github issue: [#1860](https://github.com/akvo/akvo-rsr/issues/1860).

# Akvo RSR version 3.7 Khartoum
Wednesday 7th of October 2015, [@KasperBrandt](https://github.com/KasperBrandt)

## New & Noteworthy

### Project editor improvements
The project editor, as introduced in RSR v3.6, has seen several improvements:

- It is now possible to add a new organisation without leaving the project editor. (Github issue: [#1746](https://github.com/akvo/akvo-rsr/issues/1746))
- It is possible to look up a project by the project ID and look up an organisation by the long and short name. (Github issues: [#1751](https://github.com/akvo/akvo-rsr/issues/1751) and [#1752](https://github.com/akvo/akvo-rsr/issues/1752))
- Any Admin or Project editor is now allowed to add or delete keywords from a project. Previously, this feature was only enabled for Akvo staff members. (Github issue: [#1832](https://github.com/akvo/akvo-rsr/issues/1832))
- Users connected to multiple organisations would not be able to edit a newly created project, which was a bug with permissions. This has now been resolved. (Github issue: [#1817](https://github.com/akvo/akvo-rsr/issues/1817))
- It seemed like the 'Save' button had to be clicked twice sometimes, before a section would actually save. However, this was due to an 'amusing' UI issue that caused the button to evade the user's click. This has now been resolved. (Github issue: [#1791](https://github.com/akvo/akvo-rsr/issues/1791))
- All scripts now use either pure Javascript or React.js, any reference to jQuery and Zepto.js has been removed. (Github issue: [#1765](https://github.com/akvo/akvo-rsr/issues/1765))

### IATI import
We have created a general IATI import functionality, which is able to import all information from any IATI file into RSR, given that the reporting organisation of the IATI file is already in RSR.

Github issue: [#1770](https://github.com/akvo/akvo-rsr/issues/1770).

### Show all projects for superusers and RSR Admins
Currently, even for superusers and RSR Admins, only the projects of their organisation are being displayed in the My Projects overview on MyRSR. Since superusers and RSR Admins have the rights to edit any project, we now show all projects for these users.

Github issue: [#1799](https://github.com/akvo/akvo-rsr/issues/1799).

### Additional permissions for Admins and User managers
On the MyRSR user management page, organisation Admins and User managers are now able to see not only the users from their own organisation, but also the users of the organisations that their own organisation is ```content owner``` of.

For example, if Akvo and Akvo Kenya would be two organisations in RSR, with Akvo being the ```content owner``` of Akvo Kenya, then Admins and User managers of Akvo are now able to also see, approve and decline users from Akvo Kenya on the MyRSR user management page.

Github issues: [#795](https://github.com/akvo/akvo-rsr/issues/795) and [#1843](https://github.com/akvo/akvo-rsr/issues/1843).

### Search for organisation on the MyRSR user management page
It is now also possible to search on an organisation's name or long name on the MyRSR user management page, in addition to the user's email, first and last name.

Github issue: [#1777](https://github.com/akvo/akvo-rsr/issues/1777).

### Google translate bar placeholder for Akvo Pages
For Akvo Pages it is possible to activate the Google translate functionality, and when a language is selected through this feature, a new bar will be shown on top of the page. Since this bar overlaps with our navigation, we had previously decided to lower the rest of the page by default, so that the bar wouldn't overlap our navigation.

However, this resulted in an empty bar always sitting on top of the page. We have now changed this so that the page is only lowered when the Google translate bar is clicked.

Github issue: [#1796](https://github.com/akvo/akvo-rsr/issues/1796).

### Filter on publishing status in the API
We have added the ability for all Project resources in the REST API to filter on publishing status by adding the ```publishing_status__status``` optional parameter.

Github issue: [#1827](https://github.com/akvo/akvo-rsr/issues/1827).

### Show budget periods on the project finance page
Since we've incorporated the IATI standard, it is possible to define budgets per period in RSR. However, thus far this would not be shown on the finance page of a project. We have now added these budget periods there.

Github issue: [#1771](https://github.com/akvo/akvo-rsr/issues/1771).

## Bug fixes

### '+ More' partners link not always showing
When a project has one participating organisation and a different reporting organisation, the '+ more' partners link would not show on the project main page. This has now been resolved.

Github issue: [#1793](https://github.com/akvo/akvo-rsr/issues/1793).

### Lists in updates
The layout of an update preview on the update listing page used to show boxes when a list was used in the update content. This has now been fixed so that the lists show as they should in the preview.

Github issue: [#1722](https://github.com/akvo/akvo-rsr/issues/1722).

### Maps showing only one info window
Previously, after clicking on a pin on the maps and then clicking on another pin, the info windows of both pins would stay open and often overlap each other. This has now been fixed, so that the info window that is open will be dismissed when another is clicked.

Github issue: [#1251](https://github.com/akvo/akvo-rsr/issues/1251).

## Under the hood

### Clean up keywords
We are in the process of removing the 'Sponsor' partner type for participating organisations, and had to make some changes to the way several Akvo Pages have been setup. Therefore new keywords were created, but also some duplicates. We have now created a management command to merge the duplicate keywords.

Github issue: [#1825](https://github.com/akvo/akvo-rsr/issues/1825).

### Server info added to API
We have created a new API endpoint for gathering server information. It is available at ```/rest/v1/server_info/``` and contains information about the hostname, deployment and the project update timeout settings.

Github issue: [#1798](https://github.com/akvo/akvo-rsr/issues/1798).

### Clean up middleware
We have cleaned up existing middleware and removed old middleware that hadn't been used since we moved to RSR v3.

Github issue: [#1795](https://github.com/akvo/akvo-rsr/issues/1795).

## Documentation

### Wiki page update
We have updated the IATI part of the wiki pages by including a short manual on the IATI import [here](https://github.com/akvo/akvo-rsr/wiki/IATI-Import) and the full IATI to RSR field mapping that is used during the import [here](https://github.com/akvo/akvo-rsr/wiki/IATI-Import-mapping).

Github issue: [#1612](https://github.com/akvo/akvo-rsr/issues/1795).

# Akvo RSR version 3.6.1 Jakarta (Hotfix)
Wednesday 2nd of September 2015, kasperbrandt

## New & Noteworthy

### Body text in the feedback mail
The feedback button on the project editor page now has a default text for the email body included.

Github issue: [#1784](https://github.com/akvo/akvo-rsr/issues/1784).

## Bug fixes

### Selection boxes not loading in Google Chrome
There was an issue with the size of the local storage in Google Chrome, which led to some of the selection boxes not being loaded. This has now been resolved.

Github issue: [#1785](https://github.com/akvo/akvo-rsr/issues/1785).

### Unsaved changes message still displaying after saving
After editing the photo credit or caption and saving the project, there would still be a message displayed that there are unsaved changes when the user tried to leave the page. This has now been resolved.

Github issue: [#1788](https://github.com/akvo/akvo-rsr/issues/1788).

### Delete photo not responding
Nothing happened when the 'Delete photo' link was clicked. This has now been resolved.

Github issue: [#1788](https://github.com/akvo/akvo-rsr/issues/1788).


# Akvo RSR version 3.6 Jakarta
Wednesday 26th of August 2015, kasperbrandt

New & Noteworthy
--
### Introducing the project editor
From the My Projects section in MyRSR, it is now possible to edit your projects in a completely new editor!

Github issues: [#1525](https://github.com/akvo/akvo-rsr/issues/1525), [#1744](https://github.com/akvo/akvo-rsr/issues/1744), [#1750](https://github.com/akvo/akvo-rsr/issues/1750), [#1759](https://github.com/akvo/akvo-rsr/issues/1759) and [#1762](https://github.com/akvo/akvo-rsr/issues/1762).

### Custom fields
It is now possible to add custom text fields or checkboxes in the project editor. These can be set in the 'old' organisation admin. When an organisation admin of that organisation then creates a project, these custom fields will be automatically added to the new project.

Github issue: [#1738](https://github.com/akvo/akvo-rsr/issues/1738).

### IATI organisation roles
We have switched from the RSR specific parter types to the IATI organisation roles. This means that the following switch has been made:

- Support partner: renamed to Accountable partner
- Field partner: renamed to Implementing partner
- Funding partner: remains Funding partner
- Extending partner: added
- Sponsor partner: removed

For current Sponsor partners, we have made sure no information is lost. Every Sponsor partner now has its own keyword, which is linked to the projects the partner used to be linked to. So it is possible to create Akvo Pages based on the keyword of a former Sponsor partner.

In addition, the RSR specific partner types are still available in the API through a backwards compatible mapping.

Github issue: [#1633](https://github.com/akvo/akvo-rsr/issues/1633).

### Updated calculation of total budget
In the calculation of the total budget, we now take into account the original and revised budgets.

Github issues: [#1505](https://github.com/akvo/akvo-rsr/issues/1505) and [#1733](https://github.com/akvo/akvo-rsr/issues/1733).

### IATI funding streams
In RSR v2, we showed the IATI activity IDs of the funding partners. This information has now been re-added on the project finance page.

Github issue: [#1659](https://github.com/akvo/akvo-rsr/issues/1659).

### Organisation page layout
The layout of the organisation page has been slightly updated. It now displays the long name as well as the short name of an organisation. In addition, the logo of the organisation is centralised and a default 'Partner logo is missing'-logo is added when no organisation logo is present.

Github issue: [#1509](https://github.com/akvo/akvo-rsr/issues/1509).

### Project dates on the project page
The (planned) start and end dates of a project have now been added to the right panel on the project main page.

Github issue: [#1514](https://github.com/akvo/akvo-rsr/issues/1514).

### Sorting of indicators
In the results section on the project main page, the indicators are now sorted by their starting date.

Github issue: [#1532](https://github.com/akvo/akvo-rsr/issues/1532).

### Filter on organisation in project_update API
It is now possible to filter on organisations in the project_update resource of the /rest/v1/ API. This can either be done by looking for all updates of an organisation's projects (project\_\_partners) or all updates of an organisation's users (user\_\_organisations).

Github issue: [#1758](https://github.com/akvo/akvo-rsr/issues/1758).

Bug fixes
--
### Search for users on the User Management page
When searching for users in the User Management page, the search would be lost when switching pages. This has now been resolved.

Github issue: [#1560](https://github.com/akvo/akvo-rsr/issues/1560).

### Disabled 'Update' button in My Project
For non-published projects, we have disabled the 'update' button. Users were getting a 'Forbidden' error before when trying to place an update to a non-published project.

Github issue: [#1571](https://github.com/akvo/akvo-rsr/issues/1571).

### IATI checks for planned disbursements
We have fixed a bug in the IATI checks for planned disbursements, which made the IATI checks crash whenever a project had a planned disbursement indicated.

Github issue: [#1749](https://github.com/akvo/akvo-rsr/issues/1749).

### Filters in API declared twice
For some resources, the filters in the API were declared twice, causing random behaviour in the output of the API. In the RSR Up app, this caused a bug where not all updates were retrieved. This has now been resolved.

Github issue: [#1766](https://github.com/akvo/akvo-rsr/issues/1766).

Under the hood
--
### Added correct meta descriptions
We have added meta descriptions for every page, so that RSR pages will have a correct description when showing up in Google search results.

Github issue: [#1713](https://github.com/akvo/akvo-rsr/issues/1713).

### Monitoring of published projects
We have seen some projects that get published, even though this is not logged. In order to keep track of the projects that get published better, we will be informed when this happens.

Github issue: [#1740](https://github.com/akvo/akvo-rsr/issues/1740).

# Akvo RSR version 3.5.1 Islamabad (Minor release)
Thursday 6th of August 2015, kasperbrandt

New & Noteworthy
---
### Unique organisation names
From now on, the organisation names (both the name and long name) have to be unique. Organisation names that currently occur multiple times within RSR have been made unique by adding a '(2)' or '(3)' to the names.

Github issue: [#1406](https://github.com/akvo/akvo-rsr/issues/1406).

### User permissions for adding a new organisation
As an organisation Admin or Project Editor it is now possible to add new organisations to RSR. Previously, only RSR superusers were allowed to do so.

Organisation Admins or Project Editors can also edit any organisation that they are employed to, or any organisation that is a partner in a project of which their organisation(s) is a partner too.

E.g. if the user is an organisation Admin of Akvo, and Akvo is a partner of a project together with another organisation, then the user is also allowed to edit that organisation.

Github issue: [#1700](https://github.com/akvo/akvo-rsr/issues/1700).

Bug Fixes
---
### Display of project partners
Both on the project partners page and on the project page itself, the logos of the partners weren't displayed correctly. On the project page, the logos of the partners were displayed too big. On the project partners page, the logos weren't displayed at all and the alignment of the partners wasn't consistent. This has now been fixed.

Github issues: [#1667](https://github.com/akvo/akvo-rsr/issues/1667) and [#1674](https://github.com/akvo/akvo-rsr/issues/1674).

### Update credit field character size increased
We have increased the number of allowed characters in the photo and video credit fields when adding an update. This used to be 25, but is now 75 characters.

Github issue: [#1682](https://github.com/akvo/akvo-rsr/issues/1682).

### User permissions for deleting user employments
As an organisation User Manager or Admin, it is now possible to detele user employments on the user management page in MyRSR. Previously, the red delete button with the white cross was visible, however, when clicked nothing happened due to the user permissions. This has now been resolved.

Github issue: [#1699](https://github.com/akvo/akvo-rsr/issues/1699).

# Akvo RSR version 3.5 Islamabad
Wednesday 15th July 2015, kasperbrandt

New & Noteworthy
---
### Default logo for organisations
A default logo for organisations has been added, which will show in the organisations list when an organisation has no logo, stating "Partner logo missing". This improves the UI of the organisations list and makes it clear that the organisation has no logo.

Github issue: [#1007](https://github.com/akvo/akvo-rsr/issues/1007).

### Consortium logos on project pages
In addition to adding the consortium logos to a project page in RSR v3.4, we have now extended this functionality so that it's possible to to do so on Akvo Pages as well. In the RSR admin, there is a setting for every Akvo Page to allow consortium logos to be shown or not. On RSR itself, consortium logos will always be shown.

Also, we've increased the size of the consortium logos.

Github issues: [#1616](https://github.com/akvo/akvo-rsr/issues/1616) and [#1631](https://github.com/akvo/akvo-rsr/issues/1631).

### Increase the size of update titles to 80 characters
The maximum number of characters allowed in the title of a project update has been increased to allow 80 characters.

Github issue: [#1625](https://github.com/akvo/akvo-rsr/issues/1625).

### List of project partners sorted by name
The list of project partners is now sorted alphabetically, whereas they used to be sorted randomly.

Github issue: [#1643](https://github.com/akvo/akvo-rsr/issues/1643).

Bug Fixes
---
### Fixed '+ more' links on project page
The '+ more' links, which are used to indicate the number of additional partners on the project page, counted the reporting organisation double in some cases. This has now been fixed.

Github issue: [#1608](https://github.com/akvo/akvo-rsr/issues/1608).

### Fixed actual end date on project report page
On the project report pages, the actual end date did not display correctly. Instead, the planned end date would be shown. This has now been resolved.

Github issue: [#1648](https://github.com/akvo/akvo-rsr/issues/1648).

Under the Hood
---
### Removed legacy files
We have removed several legacy files that were used prior to RSR v3.

Github issue: [#1504](https://github.com/akvo/akvo-rsr/issues/1504).

### Updated README and INSTALL documentation
As indicated by Paul Burt ([peeb](https://github.com/peeb)), our README and INSTALL documentation was outdated and contained broken links. The broken links have now been fixed.

Github pull requests: [#1584](https://github.com/akvo/akvo-rsr/pull/1584) and [#1589](https://github.com/akvo/akvo-rsr/pull/1589).

### Removed log warnings for locations without coordinates
There used to be an entry for every location without coordinates that could not be loaded in a map. However, since we there are quite a few of these and since these warning were added every time a user tried to load a map, our logs got flooded with these warnings. Therefore, we have stopped logging these warnings.

Github issue: [#1632](https://github.com/akvo/akvo-rsr/issues/1632).

# Akvo RSR version 3.4 Honiara
Wednesday 24th June 2015, kasperbrandt

New & Noteworthy
---
### Google Translate for Akvo Pages
After the release of v3, the Google Translate function had been removed in favour of native RSR translations for static content. Now, the Google Translate widget is back in for Akvo Pages, which makes it possible to translate a whole page, including dynamic content.

Since RSR also has translations of its' own, the language selector for these translation won't be displayed when the Google Translate function is activated.

The Google Translate function can be set per Akvo Page, in the admin.

Github issue: [#1617](https://github.com/akvo/akvo-rsr/issues/1617).

### Consortia projects
In RSR, projects belonging to a consortium used to be indicated with a sponsor partner. However, after the implementation of keywords, it is possible to tag a project with a keyword to indicate if it belongs to a consortium. And also to indicate if it should be displayed on an Akvo Page or not.

We have now added an option to add a logo to a keyword. If a project is linked to a keyword and the keyword has a logo, then this logo will be displayed in the project header on RSR (but not on Akvo Pages), with a maximum of 2 logos.

Github issue: [#1616](https://github.com/akvo/akvo-rsr/issues/1616).

### Additional links on organisation page
On the organisation pages, it was already possible to click on the 'Projects' and 'Updates' sections, to view all projects or updates of the organisation. Now, in addition, it is also possible to click on the numbers underneath these headers, so that it's possible to view all 'Active projects' for instance.

Github issue: [#1508](https://github.com/akvo/akvo-rsr/issues/1508).

Bug Fixes
---
### IATI Export improvements
We noticed that the IATI export did not always produce valid IATI v2.01 files. Therefore we have made some slight changes in the export function, and the checks, to make sure the created IATI exports are always valid when the checks succeed.

Also, the projects in the project list of the My IATI section are black by default, so that it's clear when the checks have been performed and the projects have turned either green or red. In addition, '(not published)' is added to the project title when a project is not publised. And finally, the errors returned for projects with missing information are added to the project list while the checks are performed.

Github issue: [#1618](https://github.com/akvo/akvo-rsr/issues/1618).

### Several UI fixes
Several small UI fixes have been implemented. Mainly the financial overview page is renewed, now showing the budget in the left column, the funding in the middle column, and the funds needed in the right column.

We have also updated the alignment and spacing in several places, and removed decimals from all money amounts.

Github issue: [#1615](https://github.com/akvo/akvo-rsr/issues/1615).

# Akvo RSR version 3.3.1 Gaborone Hotfix
Thursday 4th June 2015, kasperbrandt

Bug Fixes
---

### Fix permissions for results
We noticed that result indicators and indicator periods were not showing up for non-superusers in the RSR admin. This was due to the fact that the permissions for adjusting indicators and indicator periods were not set correctly and has been adjusted.

Github issue: [#1604](https://github.com/akvo/akvo-rsr/issues/1604).

### Admin crashes when transaction information filled in
When a project had transaction information filled in, the RSR admin would crash and show an 'Internal Server Error'. This has been fixed.

Github issue: [#1602](https://github.com/akvo/akvo-rsr/issues/1602).

### Updates and organisations listing pages for Akvo Pages
Akvo Pages that show projects based on keywords showed all updates and organisations, instead of only the relevant ones. This has been addressed and fixed.

Github issue: [#1600](https://github.com/akvo/akvo-rsr/issues/1600).

### Minor UI issue with translations header on small windows
For Spanish and French translations, the navigation header would sometimes display incorrectly. This has been fixed by adjusting the CSS.

Github issue: [#1596](https://github.com/akvo/akvo-rsr/issues/1596).

### Fix broken tests
Some tests were failing because we now have a different URL pattern due to translations, e.g. '/en/projects/' instead of '/projects/'. The tests have been updated to deal with the new translations.

Github issue: [#1595](https://github.com/akvo/akvo-rsr/issues/1595).

# Akvo RSR version 3.3 Gaborone
Wednesday 3rd June 2015, kasperbrandt

New & Noteworthy
---

### French and Spanish translations
Besides the default English language, RSR is now fully available in French and Spanish.

Github issue: [#948](https://github.com/akvo/akvo-rsr/issues/948).

### Reportable organisations
We have implemented a new setting in order to control which organisations can be marked as a reporting organisation. The 'Reportable' setting is available in the organisation admin, but only for superusers. All organisations that are currently marked as reporting organisation have been set to reportable by default.

In addition, we have added an overview of all organisations that are indicated as reportable. This overview is available at [http://rsr.akvo.org/organisations/?reporting=true](http://rsr.akvo.org/organisations/?reporting=true).

Github issue: [#1341](https://github.com/akvo/akvo-rsr/issues/1341).

### Sign in with email
It was, and still is, possible to sign in with either an email address or RSR username. However, for new registrations we only ask an email address. Therefore we have changed the sign in page so that it now displays 'Email address'.

Github issue: [#1399](https://github.com/akvo/akvo-rsr/issues/1399).

### Add 'Funds needed' to projects listing
In case a project needs funding and has the donation button activated, we display the actual funds needed on the projects listing page.

Github issue: [#1507](https://github.com/akvo/akvo-rsr/issues/1507).

### Show all points on maps for Akvo Pages
We have added a new setting for Akvo Pages, allowing all pins to be shown on the maps of projects, updates and organisations listing pages. For performance reasons this should not be activated for any Akvo Pages, but only for the ones with less than 100 projects.

Github issue: [#1563](https://github.com/akvo/akvo-rsr/issues/1563).

### Descriptions on project page
The first panel of the descriptions at the bottom of the project page is now folded out by default. In addition, we have added a + or - to indicate whether a panel is folded out or not.

Github issue: [#1572](https://github.com/akvo/akvo-rsr/issues/1572).

Bug Fixes
---

### Improve IATI export
The IATI export functionality, as introduced in v3.2, caused time-outs for organisations with more than approximately 100 projects. This was caused by the IATI checks being carried out when loading the page.

We have changed this page so that it now includes a 'Perform checks' button. Instead of performing all checks upon page load, the checks can now be performed after the page is loaded.

Github issue: [#1447](https://github.com/akvo/akvo-rsr/issues/1447).

### Pending donations not counted as funds
We used to count pending donations as funds, assuming that these donations would be added to the funds eventually. However, as some donations never finalised, this caused confusion among our users and therefore the pending donations do not count as funds anymore.

Github issue: [#1533](https://github.com/akvo/akvo-rsr/issues/1533).

### Correct information in user registration emails
Because of a bug in the translations, essential information was missing in user registration emails. We have fixed this, also in several other places where information was missing.

Github issue: [#1564](https://github.com/akvo/akvo-rsr/issues/1564).

Under the Hood
---

### Landscape.io checks
We perform checks on the code in our Github repository by making use of [landscape.io](https://landscape.io/). We have now improved our code so that all checks pass and the code health is 100%.

Github issue: [#1450](https://github.com/akvo/akvo-rsr/issues/1450), [#1551](https://github.com/akvo/akvo-rsr/issues/1551).

### Tests for common markup errors
We have added automatic unit tests for the discovery of common errors in the markup.

Github issue: [#1555](https://github.com/akvo/akvo-rsr/issues/1555).

### Performance improvements
We have improved the performance of the project list widget and the project overview in the RSR admin.

Github issue: [#1559](https://github.com/akvo/akvo-rsr/issues/1559).

### Perform tests during deployment
We have added a new step to perform unit tests during the deployment to the Test and UAT servers.

Github issue: [#1581](https://github.com/akvo/akvo-rsr/issues/1581).

# Akvo RSR version 3.2.3 Flying Fish Cove Hotfix
Thursday 7th May 2015, kasperbrandt

New & Noteworthy
---

### Advanced filter on projects listing page
On the project listing page, we have adjusted the advanced filter. The filter is now only applied when the 'Apply filter' button is clicked, and it is now possible to type the name of an organisation in the filter which will show suggestions of organisations.

Github issue: [#1052](https://github.com/akvo/akvo-rsr/issues/1052).

### Clickable '+ more' link on projects listing page
On the project main page, the '+ more' link next to the partners was already clickable so that all partners of a project could be viewed on a separate page. We have now implemented the same functionality on the projects listing page.

Github issue: [#1474](https://github.com/akvo/akvo-rsr/issues/1474).

### New API resources for map
We have created new API resources for maps. These resources are a lot faster and provide more information in comparison to the previous location resources.

Github issues: [#1521](https://github.com/akvo/akvo-rsr/issues/1521), [#1530](https://github.com/akvo/akvo-rsr/issues/1530).

Bug Fixes
---

### Video thumbnails missing
On some pages, the thumbnails for videos of updates were missing. We have now added these.

Github issue: [#1494](https://github.com/akvo/akvo-rsr/issues/1494).

### Search query displayed incorrectly on MyRSR
The search query for some pages in MyRSR was displayed incorrectly when the search has no results. This has now been fixed.

Github issue: [#1498](https://github.com/akvo/akvo-rsr/issues/1498).

### Change password broken in MyRSR
The change password functionality in MyRSR was broken, this has now been fixed.

Github issue: [#1511](https://github.com/akvo/akvo-rsr/issues/1511).

Under the Hood
---

### Responsive design for organisation page
We have changed the layout of the organisation page, so that it is fully responsive.

Github issue: [#1375](https://github.com/akvo/akvo-rsr/issues/1375).

### Mark all strings as translatable
In preparation for a multi-lingual RSR v3, we have marked all strings as translatable.

Github issue: [#1421](https://github.com/akvo/akvo-rsr/issues/1421).

### Performance of MyRSR user management page
At times, the user management page in MyRSR was very slow. We have rewritten this page to increase the performance.

Github issue: [#1499](https://github.com/akvo/akvo-rsr/issues/1499).

### Performance of search in project admin
The search in the project admin could get slow when creating a search query with multiple words. We have now limited the search fields so that the performance of search is increased.

Github issue: [#1519](https://github.com/akvo/akvo-rsr/issues/1519).

### Performance of API and pages with updates
In general, we have increased the performance of the API. However, we have also put a limit on the API to show 30 objects per page by default, and a maximum of 100 objects per page.

In addition, we noticed that pages showing updates were slow as well. The performance of these pages has been increased.

Github issue: [#1523](https://github.com/akvo/akvo-rsr/issues/1523).

### Increase the character limit on results and indicators
In preparation for paperless reporting, we have increased the character limit on descriptions and comments of the results and indicators fields. Previously these were set to 255 characters, they have now been increased to allow up to 2000 characters.

Github issue: [#1542](https://github.com/akvo/akvo-rsr/issues/1542).

# Akvo RSR version 3.2 Flying Fish Cove
Wednesday 15th April 2015, kasperbrandt

New & Noteworthy
---

### Data export options
On the project page, we have added data export options in the footer. It is possible to export project data in RSS, XML, JSON and IATI format.

However, for the XML and JSON format it is required that the user is logged in, since this functionality uses our REST API.

Github issue: [#993](https://github.com/akvo/akvo-rsr/issues/993).

### IATI export
We have introduced a new section for organisation admins in MyRSR: My IATI.

In this section it is possible to create an IATI v2.01 file, based on a selection of projects of which the users' organisation is the reporting organisation.

The generated IATI file can be shown on the organisation page, if desired.

Github issue: [#1351](https://github.com/akvo/akvo-rsr/issues/1351).

Introduced Changes
---

### MyRSR improvements
We have extended the My Projects, My Updates and User Management sections on MyRSR with a search box.

In addition, when a user is approved on the User Management page, this will be logged in the admin.

Furthermore, the titles of the projects in the My Project section and updates in the My Updates section are now links to the respective project or update.

Finally, we have improved some UI elements on the MyRSR section. Unpublished projects now have a grey background in My Projects, the table on My Projects is shown correctly in Firefox and the text in all action buttons is now visible at all times.

Github issues: [#1079](https://github.com/akvo/akvo-rsr/issues/1079), [#1398](https://github.com/akvo/akvo-rsr/issues/1398), [#1410](https://github.com/akvo/akvo-rsr/issues/1410), [#1413](https://github.com/akvo/akvo-rsr/issues/1413), [#1418](https://github.com/akvo/akvo-rsr/issues/1418), [#1420](https://github.com/akvo/akvo-rsr/issues/1420).

### Result data
Result and indicator data is now displayed in the accordion on the project page in a nested manner.

Github issue: [#1267](https://github.com/akvo/akvo-rsr/issues/1267).

### Last update on project list
In the project list, the date of the last update is now shown. When clicked, the user will be redirected to this update.

Github issue: [#1281](https://github.com/akvo/akvo-rsr/issues/1281).

### Organisation page improvements
We have added links to all projects and all updates of an organisation to an organisation page.

In addition, the funding information is aligned to the right and the amounts are displayed with two decimals.

Github issues: [#1285](https://github.com/akvo/akvo-rsr/issues/1285), [#1286](https://github.com/akvo/akvo-rsr/issues/1286), [#1416](https://github.com/akvo/akvo-rsr/issues/1416).

### Hide updates of unpublished projects
In the updates list, the updates of unpublished projects are not shown anymore.

Github issue: [#1323](https://github.com/akvo/akvo-rsr/issues/1323).

### Partners of a project
We have added the logos of partners to the partner pop-up on the project page. Also, it is now possible to click the ```+ more``` button to show a new page with a list of all partners of a project.

Github issue: [#1358](https://github.com/akvo/akvo-rsr/issues/1358).

### Last modified sorting
The filter that was previously named 'last updated' is now named 'last modified', since it not only sorts by updates, but also by general edits of a project.

Github issue: [#1377](https://github.com/akvo/akvo-rsr/issues/1377).

### User employment admin improvements
We have added search and filter options for the user employment admin.

Github issue: [#1379](https://github.com/akvo/akvo-rsr/issues/1379).

### Custom thumbnails in the API
The Django Rest Framework-based API now supports the creation of thumbnails for the images in the Project, Organisation and ProjectUpdate models.

The thumbnail is created on a GET request when the paramterer ```image_thumb_name``` is added. The value of image_thumb_name is one or more names of the thumbnails requested. In addition to the ```image_thumb_name``` parameter, for each image named a second parameter is added, specifying the size of each thumbnail.

Example of an API call using this new functionality: ```http://rsr.akvo.org/rest/v1/project/?image_thumb_name=big,small&image_thumb_small_width=90&image_thumb_big_max_size=300x200```

The first practical use of the custom thumbnail in the API is by Akvo RSR Up, that now fetches thumbnails of the correct size for mobile.

Github issue: [#1384](https://github.com/akvo/akvo-rsr/issues/1384).

### Remove v3 notification
The notification of RSR v3 in the bottom right corner of the project list has been removed.

Github issue: [#1385](https://github.com/akvo/akvo-rsr/issues/1385).

### Rename partner filter to organisation
The filter on the project list previously named 'partner' is now named 'organisation'.

Github issue: [#1402](https://github.com/akvo/akvo-rsr/issues/1402).

### Donate button
The donate button on the project main page has its' own new section, including the budget needed information.

Github issue: [#1414](https://github.com/akvo/akvo-rsr/issues/1414).

### Map on smaller screens
We received feedback that the map on smaller screens, such as an iPad, would disappear. This is changed now so that the map is only hidden on the narrowest screen size.

Github issue: [#1433](https://github.com/akvo/akvo-rsr/issues/1433).

### Look and feel of search dropdown
We have changed the UI of the search dropdown on the project, update and organisation listing pages.

Github issue: [#1434](https://github.com/akvo/akvo-rsr/issues/1434).

Bug Fixes
---

### Search for special characters
We have fixed a bug that would display a server error when searching for special characters, such as ```é```.

Github issue: [#1284](https://github.com/akvo/akvo-rsr/issues/1284).

### Sorting of organisation names
We have fixed the sorting of organisation names. Previously, organisation 'ZZZ' would appear above 'Zaa' because of capitals.

Github issue: [#1338](https://github.com/akvo/akvo-rsr/issues/1338).

### Styling of update and organisation list
The red and green hovers on respectively the organisation and update list pages had been removed, but are back in now.

Github issue: [#1380](https://github.com/akvo/akvo-rsr/issues/1380).

Under the Hood
---

### Upgrade to Django 1.7
We have upgraded our Django library to version 1.7. This will allow us to use the Django native migrations, and many other improvements.

Github issue: [#1324](https://github.com/akvo/akvo-rsr/issues/1324).

### Cleanup of old files
We have cleaned up the repository by removing unused files stemming from either RSR v2 or the transition to Postgres.

Github issues: [#1234](https://github.com/akvo/akvo-rsr/issues/1234), [#1340](https://github.com/akvo/akvo-rsr/issues/1340).

### Piwik
We have added code for tracking Akvo Pages and CNAME addresses, which was not in anymore after the RSR v3 release.

Github issue: [#1305](https://github.com/akvo/akvo-rsr/issues/1305).

### Akvo Pages permissions
We have added permissions for Akvo Pages, so that it is possible for organisation admins to view and edit their Akvo Page in the admin.

Github issue: [#1365](https://github.com/akvo/akvo-rsr/issues/1365).

### Gulp-react update
We have updated the version of gulp-react, to match the version of React used in RSR.

Github issue: [#1371](https://github.com/akvo/akvo-rsr/issues/1371).

# Akvo RSR version 3.1 Episkopi
Thursday 18th March 2015, adriancollier

New & Noteworthy
---

### Reintroduction of Project Donations
Within the v3 release we disabled project donations as there were some issues with the process that was not possible to resolve in a short enough time period. We have now had enough time to look at this and we are pleased to be able to reinstate the donation functionality.

It will be possible again to donate to a project using iDeal or Paypal.

Github issue: [#1265](https://github.com/akvo/akvo-rsr/issues/1265)

### New User Process
Following on from the changes to registration and approval made in v3, we have now added some further functionality to assist Akvo users to approve and have access to all the right users.

These changes include a new option for Akvo staff to be labelled as Support user and this means that they can make the necessary changes for all users.

Akvo staff that are not tagged as being support staff will not receive new user notifications any more.

Github issue: [#1042](https://github.com/akvo/akvo-rsr/issues/1042)

Introduced Changes
---

### IATI Organisation ID on Organisation Page
We have added the IATI Organisation ID to the Organisation page.

Github issue: [#1293](https://github.com/akvo/akvo-rsr/issues/1293)

### Link to Organisation in Transactions
As Transactions on a project can be linked to a partner, we have now enabled the option for users to select an existing organisation in RSR as the linked partner for transactions. This should help with better data quality and an improved ability to follow the chain.

Github issue: [#1317](https://github.com/akvo/akvo-rsr/issues/13117)

### Removed Goals and Categories from Project Admin
Since we have made a replacement of Goals and Categories within the RSR data model for Results and Sectors. Now that this is the new model, we have removed the older ones from the Admin. We will retain the data for some time just to be safe, but this will not be publicly accessible for now.

Github issue: [#1316](https://github.com/akvo/akvo-rsr/issues/1316)

### Reporting Organisation Requirement
Due to the changes in the domain model in v3, it was unclear to many partners on the new partner types and in particular who is the reporting organisation on a project. We will be working to take our existing data and specify who is the Reporting organisation for our entire portfolio of projects shortly. In the meantime we have removed the need for this field to be filled in.

Github issue: [#1299](https://github.com/akvo/akvo-rsr/issues/1299)

### Related Projects to the Project Admin Form
Previously it was possible to specify related projects and their relationship, but this was done independently from the project data. We have now moved this into the project form so it's possible to specify this information at the same time as completing a project.

Github issue: [#1290](https://github.com/akvo/akvo-rsr/issues/1290)

Bug Fixes
---

### Budget Label
When users entered a custom budget item label this was not being displayed on the financial screen as it did before the v3 release. This has been fixed and now the custom label is being correctly displayed.

Github issue: [#1261](https://github.com/akvo/akvo-rsr/issues/1261)

### Markup on Project Descriptions
When users included markup within the text on description fields, this was not being rendered correctly on the project pages. We have now resolved this, so the markup is now correctly rendered.

Github issue: [#1262](https://github.com/akvo/akvo-rsr/issues/1262)

### Goals Overview
The Goals Overview section was missing from the project page despite being part of the project data set. So we've added this back in.

Github issue: [#1264](https://github.com/akvo/akvo-rsr/issues/1264)

### Currency amounts
We have satndardised the currency display to ensure that the alignment and presence of 2 decimal places on all financial figures is correctly visualised.

Github issue: [#1292](https://github.com/akvo/akvo-rsr/issues/1292)

### Budgets Shown Twice
We noticed that some budget items were being displayed twice in the Financial overview page for projects. We have now resolved this so the budget only shows up once per entry.

Github issue: [#1347](https://github.com/akvo/akvo-rsr/issues/1347)

### Tidying of Font Case for Sectors
We have unified the case of text for sectors within RSR. Previously some sectors were listed with all capitals, or all small letters and the subsequent order in lists was being affected.

We have resoled this to now generate the sectors in a normalised manner and so the lists will all be truly alphabetical and it should be much easier to find the sector you are looking for.

Github issue: [#1330](https://github.com/akvo/akvo-rsr/issues/1330)

### Removed Partner Type Extra
We had an additional partner type field to take into account additional options within the IATI Standard that were not part of RSR. We have now pulled this data into RSR, so we have now removed the additional field.

Github issue: [#1321](https://github.com/akvo/akvo-rsr/issues/1321)

### Show amount received for Donations
We noticed that we were displaying the amount sent for donations, which due to transaction costs, can be lower than the amount that is received by Akvo and passed on to the project.

To make it clear for users reading the project, we have swapped this back to displaying the amount received.

Github issue: [#1318](https://github.com/akvo/akvo-rsr/issues/1318)

### API Errors for Partner Website
After the v3 changes, we found an error in the API resources that made some certain calls inaccessible without implementing an API authentication key. Seeing as the information being called here has no reason to remain private we made a fix that put the resource back into the public domain that then resolved the issue.

Github issue: [#1259](https://github.com/akvo/akvo-rsr/issues/1259)

### Link from /update/
We used to have a link from a project to add an update that sat at /update. In the v3 upgrade, this got changed to /add_update, so we have added a redirect to ensure that existing workflows remain working.

Github issue: [#1308](https://github.com/akvo/akvo-rsr/issues/1308)

### Pagination on empty lists
We discovered a bug that visually displayed a double set of results and sorting options on the listing pages even when no results were displayed.

Github issue: [#1283](https://github.com/akvo/akvo-rsr/issues/1283) & [#1280](https://github.com/akvo/akvo-rsr/issues/1280)

### Pagination on All Project Updates Page
We introduced a new page to display all project updates for a particular project, but we noticed that all were displayed on a single page and the pagination options displayed were not responding. This has been resolved to show a set of updates at a time and made it possible to navigate to the next page and back again.

Github issue: [#1276](https://github.com/akvo/akvo-rsr/issues/1276)

### Project Image Encoding Error
When project images are not able to be correctly displayed within RSR these were causing the entire page to stop loading. We have modified this function so that now the image is skipped from the carousel but the page still renders.

Github issue: [#1312](https://github.com/akvo/akvo-rsr/issues/1312)

Under the Hood
---

### Upgrade Django to v1.6.9
A new version of Django has some security changes we wanted to include within RSR so we have updated the version we are using.

Github issue: [#1011](https://github.com/akvo/akvo-rsr/issues/1011)

### Upgrade Pillow for Security Release
We upgraded our version of pillow to take into account a recent security improvmeent.

Github issue: [#1010](https://github.com/akvo/akvo-rsr/issues/1010)

### Enable Debug Toolbar
We use the Django Debug Toolbar for assisting with development of RSR. We have now added this to the Vagrant setup so all developers on RSR will have access to this.

Github issue: [#1018](https://github.com/akvo/akvo-rsr/issues/1018)

### Add created_at timestamps to all Projects and Organisations
Some time ago we added created_at timestamps to Projects and Organisations that are now being populated when new items are created. We have now run a script that populates these values for all previously existing items to improve data quality.

Github issue: [#1116](https://github.com/akvo/akvo-rsr/issues/1116)

### Page Load Time Improvements
We have made many changes to the frrequency and efficiency of database calls within RSR in an attempt to improve the overall responsiveness and speed of the system.

With these changes we are seeing a vast improvement when view list pages loading up to 6 times faster, and a moderate improvement across the rest of the system.

Github issue: [#1258](https://github.com/akvo/akvo-rsr/issues/1258)

### Update of API Import Scripts
Since the v3 changes in RSR, many more fields from the IATI Standard are now available to be stored within RSR. We have taken a look at the API Import processes we have in place and updated these to include all the newly available information. We will start to notice going forwards that projects populated through this import will have a much richer data set.

Github issue: [#1331](https://github.com/akvo/akvo-rsr/issues/1331) & [#879](https://github.com/akvo/akvo-rsr/issues/879)

### Github Wiki Tidy
We have made an effort towards unifying the documentation for RSR. We have now removed all documentation that used to sit directly within the repository, and now this resides within the Github Wiki for RSR.

Github issue: [#1334](https://github.com/akvo/akvo-rsr/issues/1334)

### Gulp Errors
The errors that were being generated by Gulp out of the box were not very informative and so made trouble shooting more complicated. With the addition of Gulp Plumber, we have been able to make these errors more intuitive to assist the development.

Github issue: [#1333](https://github.com/akvo/akvo-rsr/issues/1333)

### Django Nest Inlines Library
We use a library within RSR called django_nested_inlines. The version we were using was out of date and not maintained, but we located a version that has been updated, so we have switched to this new version.

Github issue: [#1309](https://github.com/akvo/akvo-rsr/issues/1309)

### Add Landscape Badge to Github
A tool we use called landscape has a feature that provides code quality information when making changes to the repository. We have added the code that automates this process, giving us hints on the quality changes we make while we make them.

Github issue: [#1297](https://github.com/akvo/akvo-rsr/issues/1297)

### Added RSR Version Number to API Responses
To better assist with troubleshooting and to provide more information to people and services connecting to RSR, we have added the version number to the header of responses.

Github issue: [#749](https://github.com/akvo/akvo-rsr/issues/749)

### Remove MiniCMS Model
We used to use a model within RSR called MiniCMS. This was to populate and manage the content on the Akvo.org website before we split this out from RSR. Now that the website is independently managed through the Wordpress installation, we can remove this model from RSR.

Github issue: [#727](https://github.com/akvo/akvo-rsr/issues/727)

________

# Akvo RSR version 3.0.2 Hotfix 2 for Douglas
Thursday 5th March 2015, adriancollier

Included Fixes
---

### Correction to API Authentication issue
We noticed that since the RSR v3 release, we were experiencing an issue with certain API calls that were requiring authentication where previously these were open. This change is to fix this to allow these resources to be fully accessible again.

Github issue: [#1289](https://github.com/akvo/akvo-rsr/issues/1289)

--------

# Akvo RSR version 3.0.1 Hotfix for Douglas
Friday 27th February 2015, adriancollier

Included Fixes
---

### All Updates for a Project
We noticed that in the new designs there was a missing view showing all project updates belonging to a single project. We have now added this in to the project page and given it a new style to match the other pages.

Github issue: [#1260](https://github.com/akvo/akvo-rsr/issues/1260)

### Update Text with Links
We noticed a bug where project updates that included links were breaking the layout of the page with text ending up in the header of the page. This has now been resolved.

Github issue: [#1257](https://github.com/akvo/akvo-rsr/issues/1257)

### Location Target in API
We have modified the location API resource within the Django REST Framework API implementation as the lack of location target was causing errors.

Github issue: [#1266](https://github.com/akvo/akvo-rsr/issues/1266)

# Akvo RSR version 3.0 Douglas
Thursday 26th February 2015, adriancollier

New & Noteworthy
---

### New Visual Design
The biggest change in this release and for sure the part you won't be able to miss is the new visual styling that has been applied throughout the platform. We've given all pages a new look, with an emphasis on making it easier for the user to find exactly what they're looking for.

All pages have also been coded to be responsive to the device size that's being used, so now RSR is friendly for use on mobile and tablets.

Github issue: [#733](https://github.com/akvo/akvo-rsr/issues/733), [#744](https://github.com/akvo/akvo-rsr/issues/744), [#759](https://github.com/akvo/akvo-rsr/issues/759), [#764](https://github.com/akvo/akvo-rsr/issues/764), [#786](https://github.com/akvo/akvo-rsr/issues/786), [#806](https://github.com/akvo/akvo-rsr/issues/806), [#807](https://github.com/akvo/akvo-rsr/issues/807), [#808](https://github.com/akvo/akvo-rsr/issues/808), [#811](https://github.com/akvo/akvo-rsr/issues/811), [#825](https://github.com/akvo/akvo-rsr/issues/825), [#839](https://github.com/akvo/akvo-rsr/issues/839), [#842](https://github.com/akvo/akvo-rsr/issues/842), [#843](https://github.com/akvo/akvo-rsr/issues/843), [#847](https://github.com/akvo/akvo-rsr/issues/847), [#856](https://github.com/akvo/akvo-rsr/issues/856), [#859](https://github.com/akvo/akvo-rsr/issues/859), [#866](https://github.com/akvo/akvo-rsr/issues/866), [#909](https://github.com/akvo/akvo-rsr/issues/909), [#914](https://github.com/akvo/akvo-rsr/issues/914), [#925](https://github.com/akvo/akvo-rsr/issues/925), [#926](https://github.com/akvo/akvo-rsr/issues/926), [#933](https://github.com/akvo/akvo-rsr/issues/933), [#947](https://github.com/akvo/akvo-rsr/issues/947), [#957](https://github.com/akvo/akvo-rsr/issues/957), [#969](https://github.com/akvo/akvo-rsr/issues/969), [#971](https://github.com/akvo/akvo-rsr/issues/971), [#976](https://github.com/akvo/akvo-rsr/issues/976), [#986](https://github.com/akvo/akvo-rsr/issues/986), [#987](https://github.com/akvo/akvo-rsr/issues/987), [#989](https://github.com/akvo/akvo-rsr/issues/989), [#996](https://github.com/akvo/akvo-rsr/issues/996), [#998](https://github.com/akvo/akvo-rsr/issues/998), [#1008](https://github.com/akvo/akvo-rsr/issues/1008), [#1009](https://github.com/akvo/akvo-rsr/issues/1009), [#1012](https://github.com/akvo/akvo-rsr/issues/1012), [#1028](https://github.com/akvo/akvo-rsr/issues/1028), [#1030](https://github.com/akvo/akvo-rsr/issues/1030), [#1031](https://github.com/akvo/akvo-rsr/issues/1031), [#1057](https://github.com/akvo/akvo-rsr/issues/1057), [#1082](https://github.com/akvo/akvo-rsr/issues/1082), [#1084](https://github.com/akvo/akvo-rsr/issues/1084), [#1087](https://github.com/akvo/akvo-rsr/issues/1087), [#1088](https://github.com/akvo/akvo-rsr/issues/1088), [#1118](https://github.com/akvo/akvo-rsr/issues/1118), [#1119](https://github.com/akvo/akvo-rsr/issues/1119), [#1123](https://github.com/akvo/akvo-rsr/issues/1123), [#1126](https://github.com/akvo/akvo-rsr/issues/1126), [#1130](https://github.com/akvo/akvo-rsr/issues/1130), [#1147](https://github.com/akvo/akvo-rsr/issues/1147), [#1150](https://github.com/akvo/akvo-rsr/issues/1150), [#1162](https://github.com/akvo/akvo-rsr/issues/1162), [#1164](https://github.com/akvo/akvo-rsr/issues/1164), [#1169](https://github.com/akvo/akvo-rsr/issues/1169), [#1180](https://github.com/akvo/akvo-rsr/issues/1180), [#1197](https://github.com/akvo/akvo-rsr/issues/1197), [#1198](https://github.com/akvo/akvo-rsr/issues/1198), [#1208](https://github.com/akvo/akvo-rsr/issues/1208) &  [#1212](https://github.com/akvo/akvo-rsr/issues/1212).

### MyRSR Section
A completely new section has been added into the platform called MyRSR. This is available for all users that are logged in to their accounts, and gives direct access to the content that is available to the user.

This is the first big step towards bringing all actions that users need to be able to perform into the front end of the platform, with carefully crafted interfaces that provide exactyl the right functionality.

In this release MyRSR contains areas for Projects, Updates and User Management. While some tasks still require the use of the RSR Admin, we've provided more direct links to the exact places in the Admin for ease of use, and we'll continue to work on replacing many of these Admin tasks with similar front end interfaces.

Github issue: [#780](https://github.com/akvo/akvo-rsr/issues/780), [#781](https://github.com/akvo/akvo-rsr/issues/781), [#814](https://github.com/akvo/akvo-rsr/issues/814), [#835](https://github.com/akvo/akvo-rsr/issues/835), [#852](https://github.com/akvo/akvo-rsr/issues/852), [#873](https://github.com/akvo/akvo-rsr/issues/873), [#915](https://github.com/akvo/akvo-rsr/issues/915), [#970](https://github.com/akvo/akvo-rsr/issues/970), [#1026](https://github.com/akvo/akvo-rsr/issues/1026), [#1046](https://github.com/akvo/akvo-rsr/issues/1046), [#1125](https://github.com/akvo/akvo-rsr/issues/1125), [#1188](https://github.com/akvo/akvo-rsr/issues/1188), [#1193](https://github.com/akvo/akvo-rsr/issues/1193) & [#1204](https://github.com/akvo/akvo-rsr/issues/1204).

### Site Navigation
An important part of the new design is a new header that has been added to RSR. This gives access to different parts of the site as well as giving RSR a bit more of it's own brand identity.

Github issue: [#942](https://github.com/akvo/akvo-rsr/issues/942), [#1111](https://github.com/akvo/akvo-rsr/issues/1111), [#1132](https://github.com/akvo/akvo-rsr/issues/1132) &  [#1163](https://github.com/akvo/akvo-rsr/issues/1163).

### Project Hierarchy
We've always been fond of the phrase "follow the money" here, and we think that it's an important element of visualising collaborative aid spending. To promote this, we have designed a new extension of the project page that called the Hierarchy. This page displays a visual representation of a project and all the projects that are related - either by funding, being funded, or coming from the same funding pool.

We realise that initially there will not be a lot of data in this section, but we hope that partners will start populating this data and we'll start seeing some interesting mappings of projects.

Github issue: [#904](https://github.com/akvo/akvo-rsr/issues/904), [#949](https://github.com/akvo/akvo-rsr/issues/949) &  [#1039](https://github.com/akvo/akvo-rsr/issues/1039).

### Project Data Reports
In previous releases we have made many changes to the data model of RSR to bring in more of the IATI standard into the data that we collect and hold on projects. So far, much of this data has remained hidden, but we now have a full data report for projects.

From any project page it will now be possible to view the full project report containing all the available information we hold on a project. As an added benefit, you can also download this information in pdf format.

Github issue: [#994](https://github.com/akvo/akvo-rsr/issues/994) &  [#1196](https://github.com/akvo/akvo-rsr/issues/1196).


New or Improved Features
---

### User Registration Process
We've completely overhauled the user regsitration process, making sure that it's clear and easy to follow in the hope to reduce the number of issues our users were having while siging up for an account.

Github issue: [#766](https://github.com/akvo/akvo-rsr/issues/766), [#783](https://github.com/akvo/akvo-rsr/issues/783), [#790](https://github.com/akvo/akvo-rsr/issues/790), [#823](https://github.com/akvo/akvo-rsr/issues/823), [#824](https://github.com/akvo/akvo-rsr/issues/824), [#884](https://github.com/akvo/akvo-rsr/issues/884), [#905](https://github.com/akvo/akvo-rsr/issues/905), [#906](https://github.com/akvo/akvo-rsr/issues/906), [#1044](https://github.com/akvo/akvo-rsr/issues/1044), [#1045](https://github.com/akvo/akvo-rsr/issues/1045), [#1078](https://github.com/akvo/akvo-rsr/issues/1078), [#1092](https://github.com/akvo/akvo-rsr/issues/1092), [#1104](https://github.com/akvo/akvo-rsr/issues/1104), [#1145](https://github.com/akvo/akvo-rsr/issues/1145), [#1200](https://github.com/akvo/akvo-rsr/issues/1200) &  [#1201](https://github.com/akvo/akvo-rsr/issues/1201).

### Password Reset
There's now a new Password Reset process within the MyRSR section. We also tidied up the previous process for those users who are not logged in.

Github issue: [#760](https://github.com/akvo/akvo-rsr/issues/760), [#797](https://github.com/akvo/akvo-rsr/issues/797) & [#952](https://github.com/akvo/akvo-rsr/issues/952).

### Image Management
We made some changes to the way images are managed. This includes increasing the upload size of images within updates, as well as a great new way to be able to access the original high resolution images.

Github issue: [#893](https://github.com/akvo/akvo-rsr/issues/893), [#953](https://github.com/akvo/akvo-rsr/issues/953), [#968](https://github.com/akvo/akvo-rsr/issues/968),  [#1114](https://github.com/akvo/akvo-rsr/issues/1114) & [#901](*https://github.com/akvo/akvo-rsr/issues/901).

### Searching and Filtering
We made significant improvements to the search, filtering and sorting functionality for RSR. This is visible now within the listing pages and should give users all the tools they need to find the content they are looking for.

Github issue: [#770](https://github.com/akvo/akvo-rsr/issues/770), [#812](https://github.com/akvo/akvo-rsr/issues/812), [#848](https://github.com/akvo/akvo-rsr/issues/848), [#939](https://github.com/akvo/akvo-rsr/issues/939), [#1041](https://github.com/akvo/akvo-rsr/issues/1041), [#1060](https://github.com/akvo/akvo-rsr/issues/1060), [#1073](https://github.com/akvo/akvo-rsr/issues/1073), [#1113](https://github.com/akvo/akvo-rsr/issues/1113), [#1120](https://github.com/akvo/akvo-rsr/issues/1120), [#1156](https://github.com/akvo/akvo-rsr/issues/1156), [#1191](https://github.com/akvo/akvo-rsr/issues/1191) &  [#1192](https://github.com/akvo/akvo-rsr/issues/1192).

### Project Documents
Added the ability to be able to upload project documents directly into RSR for them to be visible and downloadable from the project page.

Github issue: [#1025](https://github.com/akvo/akvo-rsr/issues/1025).

### Feedback Button
Added a new Feedback Button in the footer of every page to make it easier for users to let us know what they think.

Github issue: [#1049](https://github.com/akvo/akvo-rsr/issues/1049) & [#1144](https://github.com/akvo/akvo-rsr/issues/1144).

### New in RSR Notice
Created a new temporary box that informs users of the new changes and provides a link to give further information about what has changed.

Github issue: [#1050](https://github.com/akvo/akvo-rsr/issues/1050) & [#1184](https://github.com/akvo/akvo-rsr/issues/1184).

### Cookie Notification
We have added a new banner to inform users about the Cookies that we use within RSR and a link to the cookie policy we hold.

Github issue: [#1051](https://github.com/akvo/akvo-rsr/issues/1051).

### API Improvements
We made some modifications to the API to align with the other changes in RSR.

Github issue: [#776](https://github.com/akvo/akvo-rsr/issues/776) & [#955](https://github.com/akvo/akvo-rsr/issues/995).

### Data Model Modifications
Following on from our previous changes to the data model to move towards the IATI standard, we have made a few more changes here to move the underlying data into this new structure. The old elements remain for now, and we will be working to tidy this up over the next few releases.

Github issue: [#872](https://github.com/akvo/akvo-rsr/issues/872), [#945](https://github.com/akvo/akvo-rsr/issues/945), [#1001](https://github.com/akvo/akvo-rsr/issues/1001), [#1003](https://github.com/akvo/akvo-rsr/issues/1003), [#1032](https://github.com/akvo/akvo-rsr/issues/1032), [#1047](https://github.com/akvo/akvo-rsr/issues/1047), [#1075](https://github.com/akvo/akvo-rsr/issues/1075) &  [#1103](https://github.com/akvo/akvo-rsr/issues/1103).

### Project Timeline
We have created a new project timeline; however we were not fully happy with the way it was being displayed so this has not been released in this version. We will be looking at this and launching the project timeline as soon as we can.

Github issue: [#890](https://github.com/akvo/akvo-rsr/issues/890).

### Donations
Due to the change in many of the existing processes, we have made the decision to temporarily disable the automated donation process. It is still possible to donate to a project by sending the funds in to Akvo directly, and we will be re-enabling the automated process as soon as possible.

Github issue: [#1135](https://github.com/akvo/akvo-rsr/issues/1135).


Backend and Structural Changes
---

### Development Environment
In order to ensure that our developers can all work locally on RSR, we have needed to put some effort into getting the environment up and running with all the changes we have made.

Github issue:
[#804](https://github.com/akvo/akvo-rsr/issues/804), [#805](https://github.com/akvo/akvo-rsr/issues/805), [#844](https://github.com/akvo/akvo-rsr/issues/844), [#885](https://github.com/akvo/akvo-rsr/issues/885), [#889](https://github.com/akvo/akvo-rsr/issues/889) &  [#1187](https://github.com/akvo/akvo-rsr/issues/1187).

### Other Backend Changes
We also had to make a whole host of smaller invisible changes to the system to manage all the front end changes we made. These vary from modifications to python libraries to fixing minor issues in the workflow of the application.

Github issue: [#747](https://github.com/akvo/akvo-rsr/issues/747), [#751](https://github.com/akvo/akvo-rsr/issues/751), [#753](https://github.com/akvo/akvo-rsr/issues/753), [#761](https://github.com/akvo/akvo-rsr/issues/761), [#810](https://github.com/akvo/akvo-rsr/issues/810), [#813](https://github.com/akvo/akvo-rsr/issues/813), [#817](https://github.com/akvo/akvo-rsr/issues/817), [#822](https://github.com/akvo/akvo-rsr/issues/822), [#832](https://github.com/akvo/akvo-rsr/issues/832), [#841](https://github.com/akvo/akvo-rsr/issues/841), [#845](https://github.com/akvo/akvo-rsr/issues/845), [#853](https://github.com/akvo/akvo-rsr/issues/853), [#882](https://github.com/akvo/akvo-rsr/issues/882), [#902](https://github.com/akvo/akvo-rsr/issues/902), [#912](https://github.com/akvo/akvo-rsr/issues/912), [#924](https://github.com/akvo/akvo-rsr/issues/924), [#982](https://github.com/akvo/akvo-rsr/issues/982), [#991](https://github.com/akvo/akvo-rsr/issues/991), [#1101](https://github.com/akvo/akvo-rsr/issues/1101), [#1105](https://github.com/akvo/akvo-rsr/issues/1105), [#1109](https://github.com/akvo/akvo-rsr/issues/1109), [#1148](https://github.com/akvo/akvo-rsr/issues/1148), [#1159](https://github.com/akvo/akvo-rsr/issues/1159), [#1170](https://github.com/akvo/akvo-rsr/issues/1170), [#1175](https://github.com/akvo/akvo-rsr/issues/1175) &  [#1178](https://github.com/akvo/akvo-rsr/issues/1178).


--------

Akvo RSR ver 2.6 Conakry
---

Wednesday 17th December 2014, adriancollier

New & Noteworthy
---

### PostgreSQL as the Database Engine

In this release we are migrating our underlying database engine from MySQL to PostgreSQL. Following on from this change, we will begin to be able to take advantage of many of the additional pieces of functionality that PostgreSQL offers us including Materialised Views.

Github issue: [#813](https://github.com/akvo/akvo-rsr/issues/813) & [#753](https://github.com/akvo/akvo-rsr/issues/753)

### Minor Visual Updates

We have made some minor changes to the data visualisation within RSR. Nothing large, but these should meet some of the demands we've been receiving.

#### Visualise Identifiers on Project Pages

If a project has additional identifiers, including an IATI ID or an Internal ID obtained from an external system, then these are now displayed on the Project page alongside the RSR ID.

Github issue: [#946](https://github.com/akvo/akvo-rsr/issues/946)

#### Start and End dates

We are accepting 4 types of dates on a project now, start and end with both planned and actual values. We have now implemented a change to show all of these dates within the Funding page for the project.

Github issue: [#936](https://github.com/akvo/akvo-rsr/issues/936)

#### IATI Activity Link in Akvo Pages

This is a minor fix to enhance the IATI Identifier (if existing) on the Funding page to direct a user towards an external source of further information (such as Openaid.nl) to match the functionality within RSR.

Github issue: [#868](https://github.com/akvo/akvo-rsr/issues/868)

#### Partner Name on Akvo Pages

The Partner Name on Akvo Pages was previously only displaying the short name. We have updated this to match the layout and display of both the name and country as displayed in RSR.

Github issue: [#729](https://github.com/akvo/akvo-rsr/issues/729)


--------

Akvo RSR ver 2.5.1 Bujumbura Hotfix
---

Sunday 2nd November 2014, kasperbrandt

Bug Fixes
---

### Update locations on maps

We noticed a bug that showed project update locations with (0, 0) as longitude and latitude on the maps, these are now not shown anymore.

Github issue: [#837](https://github.com/akvo/akvo-rsr/issues/837)

### Cordaid import

Two bugs in the Cordaid import have been fixed. One causing the import to run slowly due to the 'sync_owner' field, and another that did not import the 'date_start_planned' and 'date_end_planned' fields correctly.

Github issue: [#865](https://github.com/akvo/akvo-rsr/issues/865)

--------

Akvo RSR ver 2.5 Bujumbura
---

Wednesday 21st October 2014, adriancollier

Improvements
---

### Filtering of Updates

The API has been modified to allow the list of updates to be filtered on timestamp. This was to ensure that the RSR API is fully compatible with the upcoming release of RSR Up.

Github issue:  [#769](https://github.com/akvo/akvo-rsr/issues/769)

Bug Fixes
---

### Finalisation of PayPal Donations

We noticed a bug that was preventing PayPal donations from being completed as the callback from the PayPal service was not being correctly read. This has been fixed and we will apply this to all affected donations.

Github issue: [#796](https://github.com/akvo/akvo-rsr/issues/796)

### IATI Export Activity ID

There was a mistake in the IATI export that resulted in an incorrect IATI ID being applied to activities that has now been rectified.

Github issue: [#799](https://github.com/akvo/akvo-rsr/issues/799)

### Project Update Extra API Resource

An issue was discovered that when an organisation has no location, the API resource was returning an error value. While not common, this needed to be resolved for the few instances where this is the case.

Github issue: [#820](https://github.com/akvo/akvo-rsr/issues/820)

--------

Akvo RSR ver 2/4/2 Astana Hotfix II
---

Tuesday 30th September 2014, zzgvh

Included changes
---

### Import RAIN IATI Data

Update the import scripts with better logging, use of online source files for the import adn a bugfix for an API call needed by the RAIN import.

Github issue: [#710](https://github.com/akvo/akvo-rsr/issues/710)

### Project exclusion for Pages

Using keywords introduced in 2.3.9 Yam it is now possible to exclude projects for an Akvo Pages website.

Github issue: [#745](https://github.com/akvo/akvo-rsr/issues/745)

### Bugfix for RSR country list

The country list used in RSR also contains a mapping between countires and continents. The mapping for Bonaire, Sint Eustatius and Saba was missing.

Github issue: [#748](https://github.com/akvo/akvo-rsr/issues/748)

--------

Akvo RSR ver 2/4/1 Astana Hotfix
---

Tuesday 16th September 2014, adriancollier

Included changes
---

### Import RAIN IATI Data

We have been working with our second partner RAIN Foundation to implement an import function that will allow us to take a copy of their published IATI file in order to create RSR projects to reflect their working portfolio.

The scripts have been created and tested as part of the workflow and now need to be pushed into the live environment for final publication.

Github issue: [#710](https://github.com/akvo/akvo-rsr/issues/710)

### Swagger Documentation - Django REST Framework

We have recently added the Django REST Framework to RSR to provide us with a newer API for both Read and Write functionality that we will continue to build out on.

Within this area we are looking a lot at the documentation surrounding the API and have installed a library called Swagger that generates some documentation on the resources automatically.

This feature will intially be available at http://rsr.akvo.org/rest/docs/ but we will continue to work on more structured documentation going forwards.

Github issue: [#632](https://github.com/akvo/akvo-rsr/issues/632)

### API Permissions

We've also made some additions to the permissions when using the API to ensure that we can provide the right access to those that need it when making queries on the new Django REST Framework API.

Github issue: [#632](https://github.com/akvo/akvo-rsr/issues/632)


--------

Akvo RSR ver 2.4 Astana
---

Thursday 28th August 2014, adriancollier

New and Noteworthy
---

### New and Improved RSR API

We have developed a new API for RSR using the [Django REST Framework](http://www.django-rest-framework.org/). This new API allows organisations to both Read and Write data to the database using an existing RSR user account with the right permissions. The functionality will be tried and tested with a few select partners with which we will work on and implement a full set of API documentation to ensure that it can be effectively utilised.

Github issue [#632](https://github.com/akvo/akvo-rsr/issues/632) & [#39](https://github.com/akvo/akvo-product-design/issues/39)

### RSR Updates with Locations

We have made the first steps in creating the functionality to have locations present with RSR Updates. With this release we can now visualise locations that are provided within RSR Updates on maps displayed within the RSR user interface.

There is still further work to be done on modifying the Update form to enable the entry of updates, as well as releasing a new version of RSR Up that includes locations also.

Github issue [#709](https://github.com/akvo/akvo-rsr/issues/709) & [#646](https://github.com/akvo/akvo-rsr/issues/646)

### Piwik Tracking on Akvo Pages

We have added some code to Akvo Pages implementations that will allow the traffic going through these to be monitored using our analytics tool Piwik. We will be rolling this out to our partners over the coming weeks to provide portals to obtain this useful user data.

Github issue [#630](https://github.com/akvo/akvo-rsr/issues/630)

Features
---

### Organisation duplicate logic on API Import

We have now added some logic to the API import scripts being utilised by Cordaid and soon RAIN Foundation to ensure that the organisation owner flag is considered when determining if the organisation provided should be modified or created. This change will prevent additional duplicate organisations being created during imports.

Github issue [#690](https://github.com/akvo/akvo-rsr/issues/690)

### Project Comment timestamp creation

The timestamp present on the project comment entries were only being generated automatically when submitting new comments using the web form. We have now updated the system so that this is created automatically also if these entries are created using any other means, such as the API.

Github issue [#659](https://github.com/akvo/akvo-rsr/issues/659)

Bug Fixes
---

### Keyword filtered Akvo Pages dropdowns

When Akvo Pages are filtered by a keyword rather than an organisation, there was an issue that the dropdowns displayed were still being populated solely with the information relevant to that organisation. This has been resolved to provide the correct dropdown lists for the users.

Github issue [#665](https://github.com/akvo/akvo-rsr/issues/665)

### All project widget on Akvo Pages display issue

We have resolved a problem with the Akvo Pages widget displaying all projects from a partner. There was a grey border that was affecting the layout that has now been removed.

Github issue [#691](https://github.com/akvo/akvo-rsr/issues/691)

### Add Update button on Update listing pages

We discovered an issue where the Add Update button was not being displayed on the page where all updates for a single project are being listed.

Github issue [#407](https://github.com/akvo/akvo-rsr/issues/407)

Infrastructure Changes
---

### Refactor models.py into a package

The existing models file that defined the structure of the data in RSR was becoming too large, so we have now refactored this into several different files to make management easier.

Github issue [#192](https://github.com/akvo/akvo-rsr/issues/192)


--------

Akvo RSR ver 2.3.10 Zambo
---

Thursday 31st July 2014, adriancollier

New and Noteworthy
---

### IATI Fields in RSR

We have made the first contribution to the RSR Database and Admin resources to be able to accomodate all of the IATI Standard. This now means that we can collect and store any information delivered for the IATI Standard within RSR. We are working towards visualising this information wihtin the front end of RSR.

Github issue [#678](https://github.com/akvo/akvo-rsr/issues/678)

Bug Fixes
---

### 404 page missing media

We have corrected a bug where the 404 page was no longer displaying the image and styling.

Github issue [#686](https://github.com/akvo/akvo-rsr/issues/686)

### Incorrect Password on Akvo Pages

When a user was logging into RSR via Akvo Pages and they entered their password incorrectly, the format of the page was not displaying correctly. This has now been resolved.

Github issue [#664](https://github.com/akvo/akvo-rsr/issues/664)

### Donate Image on PayPal Donation Screen

The Donate button was missing its visual display button when making a donation through PayPal, so this has now been corrected.

Github issue [#663](https://github.com/akvo/akvo-rsr/issues/663)

### Galleria Error on Akvo Pages

Some users were experiencing errors with images when viewing projects within Akvo Pages. This resulted in the images not being displayed and only an error message in their place. We have made some fixes that we believe should resolve this for all users, but we will be keeping an eye on this.

Github issue [#473](https://github.com/akvo/akvo-rsr/issues/473)

### Requesting a non existing Widget

When a user was requesting an widget that did not exist in RSR, they were receiving a 500 error. This has been changed to correctly provide a 404 error to display that the content is not available.

Github issue [#198](https://github.com/akvo/akvo-rsr/issues/198)

### Cancelling donations from Akvo Pages

When a user is within the donation process and presses the cancel button, they are now correctly redirected back to the page that they came from even if this is on an Akvo Pages instace, where previously they were only being returned to http://rsr.akvo.org.

Github issue [#147](https://github.com/akvo/akvo-rsr/issues/147)


--------

Akvo RSR ver 2.3.9.2 Yam - Hotfix 2
---

Thursday 24th July 2014, adriancollier

Included Changes
---

### Fixes to Import Scripts

We made some small fixes to the import scripts to ensure that all was working correctly for the IATI XML Import processes.

Github issue [#680](https://github.com/akvo/akvo-rsr/issues/680)


--------

Akvo RSR ver 2.3.9.1 Yam - Hotfix
---

Tuesday 8th Juyl 2014, adriancollier

Included Changes
---

### Akvo Pages Keyword Maps

With the implementation of keywords in [#620](https://github.com/akvo/akvo-rsr/issues/620) we noticed that the headline map on Akvo Pages was not updated to display the points for these keyword projects. This has been fixed so it matches the projects being displayed.

Github issue [#671](https://github.com/akvo/akvo-rsr/issues/671)

### Akvo Pages Drop-down Filtering

The drop-down filters for Akvo Pages were not being correctly populated with the keyword content. After trying some things, it appeared that this area of code needs some further investigation to ensure it runs smoothly. In the meantime, we have removed the custom filtering so now all drop-downs contain all possibilities. We AIM to resolve this as soon as possible.

Github issue [#673](https://github.com/akvo/akvo-rsr/issues/673)

### Keyword API Management

We implemented some changes in the API import processes to manage kaywords but it should only be possible to add keywords using the API, existing keywords on projects should not be removed.

Github issue [#670](https://github.com/akvo/akvo-rsr/issues/670)

--------

Akvo RSR ver 2.3.9 Yam
---

Wednesday 2nd July 2014, adriancollier

New and Noteworthy
---

### Akvo Pages by Keyword

We have implemented a big change to the way that Akvo Pages can collect a set of projects. With the addition of Keywords that can be added to projects within the RSR Admin, it will now be possible to create Akvo Pages that utilise one or more of these keywords to select the projects that are being visualised.

This work will be expanded to also build out more API and other resources that will help our partners to use this functionality in a flexible manner.

Github issue [#620](https://github.com/akvo/akvo-rsr/issues/620)

### Updated search functionality

We have improved the search functionality for searching that now used an AND function on search terms that narrows the results to help you find projects or organisations that match all of the terms entered instead of only 1 of them.
We have also added the project ID to the search options, so that you can now search for a project directly if you know its identifier.

Github issue [#441](https://github.com/akvo/akvo-rsr/issues/441)

### Target Group Visualisation

After including the Target Group field in the project model, we were able to accept data being populated in this field from a file import or directly in the Admin, however this information was not being visualised. The templates have now been updated to include this content within the Project Plan tab on the project page.

Github issue [#255](https://github.com/akvo/akvo-rsr/issues/255)

### Akvo Manager user permissions for Organisation

We have updated the user permissions for the Akvo Manager role so that they are able to update or change the organisation that a user belongs to. This is extremely useful in the event that a user mistakenly registers under an incorrect organisation.

Github issue [#278](https://github.com/akvo/akvo-rsr/issues/278)

### Bug in Editing updates on Akvo Pages

We discovered a bug that prevented updates from being edited when viewed on a partnersite. It should be possible that within the first 20 minutes of posting an update the user can edit the content to fix any small issues with the content. This was generating an error which has now been resolved.

Github issue [#647](https://github.com/akvo/akvo-rsr/issues/647)

### Change in Geolocation Provider for the Admin

We were previously using http://itouchmap.com to link partners to a map to generate their location information. After a suggestion from the Akvo Partner Team we have now swapped this link with http://mygeoposition.com/ that provides a more simple workflow for populating this information.

Github issue [#649](https://github.com/akvo/akvo-rsr/issues/649)

Features
---

### Removed Primary Location

After some consideration and user feedback we have simplified the locations models by removing the Primary Location information from the system. It is now implicit that the first project entered into the Admin is the primary location for the project. This prevents many issues that were arising using the Admin project form.

Github issue [#141](https://github.com/akvo/akvo-rsr/issues/141)

### Tidying the Support Partner List

We have made a change to the [support partner list](http://rsr.akvo.org//organisations/support/) that now means only partners with published projects are being displayed here.

Github issue [#204](https://github.com/akvo/akvo-rsr/issues/204)

### API Resource Documentation

We have created [some documentation](https://github.com/akvo/akvo-rsr/blob/develop/docs/RSR%20Features/API/API-Resources.md) that provides information about the Custom API Resources we have created. This will assist developers who are wishing to onboard with the Read API by providing them with a list of the existing resources available in a consumable manner.

Github issue [#510](https://github.com/akvo/akvo-rsr/issues/510)

### Organisation Account Types

We have added some new account types for the Organisation account model that will enable Akvo to tag organisations by their activty and contractual status within RSR to help with accounting and reporting purposes.

Github issue [#608](https://github.com/akvo/akvo-rsr/issues/608)

Bug Fixes
---

### Multiple languages in XML Import

If an incoming IATI XML contained 2 tags with the same information in 2 different languages then the scripts were simply importing the last in the list. This has now been updated to actually consider the language tags that are specified in the file so that the correct contents is imported.

Github issue [#252](https://github.com/akvo/akvo-rsr/issues/252)

### Post Import Budget Error

As part of the XML Import functionality there is the functionality to create the budget items included within the file. Due to a recent change in the Budget Item Labels, this process was not working correctly, so we have now made a change to fix this issue.

Github issue [#652](https://github.com/akvo/akvo-rsr/issues/652)

### NULL value returned for ``last_modified_at``

We fixed a small bug in the API that was returning an incorrect boolean value when querying on the ``last_modified_date`` field where there was no value set for the row being returned.

Github issue [#477](https://github.com/akvo/akvo-rsr/issues/477)


Under the hood
---

### Removing old deployment scripts

With the introduction of newer deployment scripts we have done some work to clear out the old ones that are no longer used.

Github issue [#362](https://github.com/akvo/akvo-rsr/issues/362)

### Move akvo.rsr.utils to akvo.utils

We have refactored the code within akvo.rsr.utils to be compiled into akvo.utils.

Github issue [#434](https://github.com/akvo/akvo-rsr/issues/434)


--------

Akvo RSR ver 2.3.8 Xylocarp
---

Wednesday 11th June 2014, adriancollier

New and Noteworthy
---

### Upgrade to Django 1.6

This latest release of Akvo RSR contains a wide variety of back end changes to upgrade the underlying framework that RSR runs on - Django. We were previously running on version 1.4, so we've performed a double staged upgrade to make use of the later features than have been developed with Django.

Github issue [#544](https://github.com/akvo/akvo-rsr/issues/544)


Areas Modified
---

### Separated Static and User Media assets

We have now separated the server location for static media from media that is uploaded by users. This ensures that we can manage and maintain the information in different ways if needed by the use cases of the different sources.

Github issue [#564](https://github.com/akvo/akvo-rsr/issues/564)

### Updated Folder Structure

The folders structure for the application was improved in Django 1.4, but we continued to use the legacy structure. We have now updated this to bring RSR in line with the latest Django folder structure.

Github issue [#565](https://github.com/akvo/akvo-rsr/issues/565)

### Fixed ProjectAdmin add view

We have updated the new project form to work with the improved standards bring implemented in Django 1.5

Github issue [#566](https://github.com/akvo/akvo-rsr/issues/566)

### Upgraded Python Libraries

We have performed updates of all dependent python libraries where possible to allow us to use the latest versions.

Github issue [#570](https://github.com/akvo/akvo-rsr/issues/570)

### New Markdown Solution

We have implemented a new method of managing Markdown included within Project Updates that uses django_markup.

Github issue [#572](https://github.com/akvo/akvo-rsr/issues/572)

### Removed SMS Code

We had in the past implemented a beta version of an SMS updating tool for RSR that was never fully functional. To tidy up the codebase, we have now removed this code and all references to this.

Github issue [#574](https://github.com/akvo/akvo-rsr/issues/574)

### URL Encoding removal

As part of the Django 1.6 changes, we have removed the URL Encoding from ``reverse()`` arguments.

Github issue [#575](https://github.com/akvo/akvo-rsr/issues/575)

### Default value for Boolean Fields

Required with the Django 1.6 upgrade, we have to specify a default value for Boolean fields within RSR. These have now been specified where previously not present.

Github issue [#578](https://github.com/akvo/akvo-rsr/issues/578)

### Update Django URLs

We have updated the code to ensure that the names of views in {% url %} tag are strings.

Github issue [#579](https://github.com/akvo/akvo-rsr/issues/579)

### Fixes for Django 1.7 Upgrade

While we are not yet planning to update the Django framework to 1.7 yet, we have already provided some updates to key libraries including Tastypie (which runs parts of the RSR API) to provide 1.7 compatibility.

Github issue [#580](https://github.com/akvo/akvo-rsr/issues/580)

### Rename ``get_query_set()``

A change that takes advantage of some newer features provided in Django 1.6, we have renamed this function.

Github issue [#583](https://github.com/akvo/akvo-rsr/issues/583)

### Change in permission methods

We have replaced ``get_(add|change|delete)_permission`` methods with ``django.contrib.auth.get_permission_codename`` as the previous are now depreciated.

Github issue [#584](https://github.com/akvo/akvo-rsr/issues/584)

### Check ``ModelForms``

As part of the Django 1.6 upgrade we have updated ``ModelForms``.

Github issue [#586](https://github.com/akvo/akvo-rsr/issues/586)

### Implement ``ALLOWED_HOST`` setting

We have added a new ``ALLOWED_HOST`` setting as needed as part of the Django 1.6 upgrade.

Github issue [#596](https://github.com/akvo/akvo-rsr/issues/596)

--------------

Akvo RSR ver 2.3.7 Watermelon
---

Wednesday 28th May 2014, rumca

New Features
---

### Country options on project list

We have added a feature to only populate the countries dropdown on Akvo Pages with a list of countries where there are projects present. This allows the country selection to always return a project and provides a shorter list to select from.

Github issue [#176](https://github.com/akvo/akvo-rsr/issues/176)


Bug Fixes
---

### Content owner in org admin

The content owner field was accidentally removed during a previous release, this has been reinstated on the organisation admin now.

Github issue [#558](https://github.com/akvo/akvo-rsr/issues/558)

### Image/Video files positioning

We have made a change to the way in which image or videos are positioned on RSR updates. We now only allow the media links to be placed before the update.

Github issue [#243](https://github.com/akvo/akvo-rsr/issues/243)

### Removal of YouTube related videos

When YouTube videos were added to project updates they would display related videos after they had been played. We have made a change to prevent this from happening, as often times the videos were not relevant.

Github issue [#540](https://github.com/akvo/akvo-rsr/issues/540)

### Django version upgrade

As an intermediary step whilst we complete a full upgrade from Django 1.4 to 1.7, we have upgraded to Django 1.4.13 from 1.4.2 to plug recently identified security vulnerabilities.

Github issue [#522](https://github.com/akvo/akvo-rsr/issues/522)


Akvo RSR ver 2.3.6 Voavanga
---

Wednesday 14th May 2014, adriancollier

New Features
---

### Add Update button change

If a user was attempting to add an update to a project that they didn't have the permission for, then they were being served a 403 error page. We have now changed this activity to grey out the Add Update button for users that do not have permission to add updates on individual projects.

Github issue [#150](https://github.com/akvo/akvo-rsr/issues/150)

### Character validation in admin

Now that we are working with XML more deeply with the API and IATI information, we have added validation to the RSR admin to check for any characters that have been included within the added fields that are not valid within XML. A warning is now displayed in the event that any of these characters are present.

Github issue [#242](https://github.com/akvo/akvo-rsr/issues/242)

### Back button on Akvo Pages

We have added a custom option to Akvo Pages to allow the back button to have a different text added. So now our partners can allow this button to say something more appropriate to the location that the user will be taken to upon pressing.

Github issue [#258](https://github.com/akvo/akvo-rsr/issues/258)

### Sign in target location

We have tidied up the signing in process to direct users to the main page after completing the sign in process.

Github issue [#301](https://github.com/akvo/akvo-rsr/issues/301)

### Organisation filter on Akvo Pages

We had previously removed the project filter on Akvo Pages that allows any project to be viewed within a Pages instance. This has now been extended to organisations so that organisations can be visualised within an instance without the need for that organisation to be present within projects.

Github issue [#433](https://github.com/akvo/akvo-rsr/issues/433)

### Facebook meta information

We have tidied up the meta information when sharing projects via Facebook to provide the information of the organisation that owns the Akvo Pages instance in place of Akvo.

Github issue [#442](https://github.com/akvo/akvo-rsr/issues/442)

### RSR favicon

We have replaced the favicon being used within RSR to use the more updated icon as is present within the Akvo.org website.

Github issue [#443](https://github.com/akvo/akvo-rsr/issues/443)

### Donation redirect page for Akvo Pages

We have added a new timed redirection page that users will see when completing a donation from an Akvo Pages instance. This provides information to the user to inform them that they will be leaving the previous domain and be directed to the Akvo.org donation process.

Github issue [#480](https://github.com/akvo/akvo-rsr/issues/480)

### Translation management process

We have documented our process for managing the content translations with a team of external language translators. This is just a documentation update.

Github issue [#494](https://github.com/akvo/akvo-rsr/issues/494)

### Documentation Update

We have performed a merging process to pull some recent documentation efforts into the main code repository to ensure that the right information is always available for users to see.

Github issue [#512](https://github.com/akvo/akvo-rsr/issues/512)

### Project summary pop-up Akvo Pages map widget

We have added a project summary pop-up to the Akvo Pages map widget that displays basic information about a project to the user when they click on the pin for a specific project.

Github issue [#505](https://github.com/akvo/akvo-rsr/issues/505)

### Project and organisation management flags

Following on from recent work on management flags, we have extended this functionality to projects. Now it is possible to set a flag on both projects and organisations that will prevent unwanted changes being made.

Organisations can have an owner flag set so that any changes made by other organisations inform the user that these changes could be overwritten by the managing organisation.

Partners can also set a flag on their organisation record to prevent their projects being modified by other organisations. Only Admins from the support partner organisation will be able to make changes to the project content for these projects.

Github issue [#233](https://github.com/akvo/akvo-rsr/issues/233)


Bug Fixes
---

### Blank location error

We were experiencing a problem where if new locations were added to a project but no information was completed, the admin form would not save. This has been corrected to now ignore any added but incomplete locations.

Github issue [#312](https://github.com/akvo/akvo-rsr/issues/312)

### Budget totals

We previously had 2 different budget items within the dataset that referred to total budgets. This has now been consolidated so that we only have a single entry and all information will be merged to this single entry.

Github issue [#471](https://github.com/akvo/akvo-rsr/issues/471)

### Akvo Pages widgets layout error

We have tidied up some layout issues with the widgets being provided for Akvo Pages.

Github issue [#498](https://github.com/akvo/akvo-rsr/issues/498)

### Wrapped links on project pages

We have fixed an issue that long links provided on projects were extending beyond the box provided in the visual layout. These links will now wrap to the next line if they are too long to fit within the available space.

Github issue [#506](https://github.com/akvo/akvo-rsr/issues/506)

### Global maps in Internet Explorer 8

We have resolved some visualisation issues when viewing the global maps in IE8. Now the maps are correctly displaying the points.

Github issue [#507](https://github.com/akvo/akvo-rsr/issues/507)

### IATI export missing data

We were missing some date information within the budget item export when creating IATI files. This prevented the files from validating as a correct IATI XML file. This has now been included.

Github issue [#533](https://github.com/akvo/akvo-rsr/issues/533)

### Live server logging

We have made a small change to the underlying code that will provide better logging information for our system to help discover and troubleshoot any issues that occur.

Github issue [#432](https://github.com/akvo/akvo-rsr/issues/432)

### Using Sentry within RSR

We have added Sentry as a tool to assist us with monitoring and logging with RSR as part of our efforts to ensure we have a great performing system and access to all the right information to investigate when things don't go entirely to plan. You can read more about Sentry [here](http://sentry.readthedocs.org/en/latest/).

Github issue [#541](https://github.com/akvo/akvo-rsr/issues/541)


Akvo RSR ver 2.3.5 Uglyfruit
---

Wednesday 9th April 2014, adriancollier

New Features
---

### IATI Export

On popular demand we have created the first installment of the IATI Export functionality. This feature will allow us to create an IATI XML file based on the projects that an organisation has within RSR to publish within the IATI Registry.

There will be further improvements to this functionality including visibility of files within the website, automatic publishing and historical file access over the coming weeks.

Github issue [#334](https://github.com/akvo/akvo-rsr/issues/334)

### Donate Buttons on Projects and Widgets

We have had a couple of requests from partners to prevent the donate button from appearing on their projects. Primarily this is due to the organisation not wishing to accomodate donations on specific projects. We have now added the functionality for partners to be able to turn on/off the visibility of the Donate button from the Project Admin per project.

This setting affects where the project is visible on Akvo.org, Akvo Pages and within Widgets.

Github issue [#310](https://github.com/akvo/akvo-rsr/issues/310) & [#491](https://github.com/akvo/akvo-rsr/issues/491)


### Image Upload Recommendations

We noticed that many users were unaware of the right size or dimentions of images to use when uploading to RSR projects or updates. To help guide users to have the best quality of images on their projects we have added some recommendations including the limits related to file sizes that the system imposes.

Github issue [#219](https://github.com/akvo/akvo-rsr/issues/219)

### Update warning on empty content

If a user wants to post an update without any content and only a title, then we think they should be allowed to do this. However we also think it's great if users do add content and not just the title. So we have added a reminder to the form to advise users to include content in case this is a mistake. Just like if you send an email without a subject.

Github issue [#304](https://github.com/akvo/akvo-rsr/issues/304)

### Registrations via Akvo Pages (aka Partnersites)

When users want to register directly from Akvo Pages they used to have to select the organisation that they want to register under. To improve integration we have now pre-selected this, so that users now automatically are registering under the organisation that owns the Akvo Pages.

Github issue [#309](https://github.com/akvo/akvo-rsr/issues/309)

### Organisation input guidelines

We've made some small improvements in the documentation available for organisations wishing to import organisations using the API.

Github issue [#425](https://github.com/akvo/akvo-rsr/issues/425)

### Improved 404 page

We'd prefer it if no-one sees a 404 error page, but when they do, we want it to be a nice 404 error page, so we've now added the same one we use on Akvo.org as we like it.

Github issue [#450](https://github.com/akvo/akvo-rsr/issues/450)

### Partner Types

We made a change a while back to only allow partners to be added to projects where they are enabled for that particular role, e.g. Support Partner. This has created some processing issues affecting Admin users and causing a bit of a long process for maintaining projects. As a workaround for this, we have now enabled all organisations to be either Field or Funding partners on projects. As before if organisations need to be added as a Support or Sponsor partner then this will need to be approved by the Akvo Partner Team, but this small change should help a lot of project admins have a simpler time with their work.

Github issue [#462](https://github.com/akvo/akvo-rsr/issues/462)

### Improved API resource for Project Updates

As we would like to display more information about project updates in different places, and as this information is stored in multiple different tables within the database, we have created a common single resource to be able to collect all this information with a single API call.

Github issue [#463](https://github.com/akvo/akvo-rsr/issues/463)

### Widget Improvements

We have made several visual improvements on the Widget templates in this release based on some partner feedback from CommonSites to make them clearer and look that little bit more impressive.

Github issue [#479](https://github.com/akvo/akvo-rsr/issues/479)

### Better documentation on Github Process

We've improved the developer documentation for our Github process internally to make things clearer for everyone in the team.

Github issue [#422](https://github.com/akvo/akvo-rsr/issues/422) & [#481](https://github.com/akvo/akvo-rsr/issues/481)

Bug Fixes
---

### Error in maps for Internet Explorer 8 (IE8)

There was an issue with displaying maps in IE8 within RSR. While IE8 is being discontinued by Microsoft soon, we still notice some traffic to RSR via this browser so we have made an update to the maps code to render these maps correctly when viewed there.

Github issue [#474](https://github.com/akvo/akvo-rsr/issues/474)

### Links wrapping on Akvo Pages (aka Partnersites)

Links that are added to projects to connect information from Akvopedia or other external sources were not wrapping within the field correctly. This has now been resolved.

Github issue [#179](https://github.com/akvo/akvo-rsr/issues/179)

### Akvo Pages (aka Partnersites) organisation Lists not paginated

All organisations that were participating in projects in the Akvo Pages were being listed in a single page, we have now corrected this to ensure that the organisations are listed in pages containing 10 at a time.

Github issue [#285](https://github.com/akvo/akvo-rsr/issues/285)

### Sign In fields alignment

Sign In fields were being displayed as too large for the box they were sitting in. We have fixed this visual bug.

Github issue [#322](https://github.com/akvo/akvo-rsr/issues/322)

### Donation email in Gmail

There was a styling issue in Gmail when viewing the donation email we send to users who have completed a donation in RSR. This template now uses a table rather than floating div elements so the visuals always match what is expected of them.

Github issue [#460](https://github.com/akvo/akvo-rsr/issues/460)


### External links tab use

When opening multiple external links from a project page, the same tab or window was being used again, so only the most recent link was being displayed to you. We've resolved this to create a new tab or window for each link selected.

Github issue [#323](https://github.com/akvo/akvo-rsr/issues/323)

### Header Sign In & Register options in browser

When a browser was not maximised, the Sign In and Register options were no longer visible in the header, and the scrollbar didn't allow for them to be pulled into view. This has been resolved.

Github issue [#408](https://github.com/akvo/akvo-rsr/issues/408)



Akvo RSR ver 2.3.4 Tamarine
---

10th March 2014, adriancollier

New Features
---

###Timestamp Audit Records

The first of a series of changes we'll be making to improve the audit tracking of RSR data. This change provides a ``created_at`` and a ``last_modified_at`` field on Projects, Organisations and ProjectUpdates as well as on PartnerSites that are used to administer Akvo Pages. The fields are currently only visible within the Admin interface; but will be useful when viewing projects in the admin or when generating our reporting information and metrics.

Github issue [#381](https://github.com/akvo/akvo-rsr/issues/381)

###Data Management Flag

Another change related to audit tracking and ownership, this new feature allows Organisation records to be tagged with an owner organisation.

This flag will generate a warning if a user belonging to an organisation that is not the owner changes data through the admin interface. Such changes risk being overwritten, now that we are working with some partners who are sending us content updates via an import file. In the future, this flag will also let the import process reject any improper changes.

Github issue [#374](https://github.com/akvo/akvo-rsr/issues/374)

###Organisation API Import

Further improvements to our API Import allowing more fields to be updated when we do the import from an external file. This will ensure all of the latest information is displayed exactly the way they should be.

Github issue [#451](https://github.com/akvo/akvo-rsr/issues/451)

###Android App Update Identifier

We have implemented some changes to the identification of updates provided by the new Android app. This will ensure that the app cannot post the same update more than once. This change is in preparation of our Mobile App launch later in March.

Github issue [#445](https://github.com/akvo/akvo-rsr/issues/445)

###Registration Usernames

Usernames in RSR have never been able to include spaces, but there are also some unwanted characters that were not allowed. To make the registration process easier we have added some code to the validation of the username that not only prevents users from entering restricted characters but also provides a clear error message in the event that an invalid character is included within the username entered.

Github issue [#437](https://github.com/akvo/akvo-rsr/issues/437)

###Email Delivery Improvement

After some reports of RSR Emails not being received, we have made some changes to the system to improve the way we handle emails. We now route the emails being delivered from RSR through the Mail Server we have running mail.akvo.org. The logging of this is delivered to us regularly so we can always track what happened to emails that are not delivered to see where the problems may lie.

This change will also work to improve the overall stability of the mails being sent from RSR.

This also required a change in RSR to enable the sending of mails using a service with SSL.

Github issue [#448](https://github.com/akvo/akvo-rsr/issues/448)


Bug Fixes
---

###Clickable Links in updates

We had an issue that was preventing some links that were included within RSR updates from being clickable within the browser. This was affecting some Akvo Pages updates as well as times when the links were not preceded by line breaks.

The new change now scans an update after it has been submitted in order to make any links that may have not been picked up automatically clickable. This will help to ensure that users who are sharing information have great updates.

Github issue [#438](https://github.com/akvo/akvo-rsr/issues/438) & [#419](https://github.com/akvo/akvo-rsr/issues/419)

###Add project view in Admin bug

During the implementation of the new Timestamp feature, we had an issue with the template for adding a new project into RSR. This required some tidying up of the fields and moving the Timestamp fields into the General field list rather than in its own section.

Github issue [#458](https://github.com/akvo/akvo-rsr/issues/458)


Akvo RSR ver 2.3.3 Satsuma
---

21st January 2014, adriancollier

New Features
---

###Organisation API Import

We have been working with our Partners Cordaid and RAIN Foundation to build and expand on our API Write Functionality. The process of importing organisations on a large scale was previously being done via the use of local scripts. With scale however we needed a more structural solution not only to enter this data, but also to update it and allow changes to be made.

To complete this task we have also introduced a new API tool called the Django REST Framework. This is an alternative to our existing API tool TastyPie. We believe this new tool is a more stable and long term solution to the API functionality. With this addition, we will be able to track the performances of both tools before deciding on the final solution that RSR will be taking for its application interface technology.

Github issue [#415](https://github.com/akvo/akvo-rsr/issues/415) & [#375](https://github.com/akvo/akvo-rsr/issues/375)

###Budgets Importing

In a similar strain to the Organisation API Import, we have also been extending the existing Project functionality, and have enabled the feature to be able to import budget information via the API.

Github issue [#390](https://github.com/akvo/akvo-rsr/issues/390)

###Target Group Field

Through conversations internally, with partners and also within the IATI community, we have made a decision to more closely align the RSR data set to the IATI standard to make publishing and comparison of these sets easier and more open.

The latest of these changes is the inclusion of the Target Group field in the RSR Project model. At the moment this is only a backend change, so while data can be entered through the RSR Admin portal or via the API, it will not yet be visualised on the Akvo Website, Akvo Pages or Akvo Sites. This visual addition will be coming soon.

Github issue [#311](https://github.com/akvo/akvo-rsr/issues/311)

Bug Fixes
---

###Email Tracking

We have been hearing of several incidents where activation, password or confirmation emails are not being received by users in RSR. In order to fully investigate this issue, we have enabled some detailed logging and tracking in the system to be able to inform us about emails that are sent out so we can pinpoint where the problems lies.

Github issue [#416](https://github.com/akvo/akvo-rsr/issues/416)

###Remove Facebook App ID From Admin

Since we have released the Facebook sharing buttons in RSR, we have done some further investigation and determined a better way of solving this problem that no longer requires users to create their own Facebook Apps. To ensure users do not get confused we have removed the App ID field from the Admin.

Github issue [#423](https://github.com/akvo/akvo-rsr/issues/423)

###RSR Footer Update

We corrected a grammar mistake in the Product roadmaps link in the footer.

Github issue [#411](https://github.com/akvo/akvo-rsr/issues/411)


Akvo RSR ver 2.3.2 Rambutan
---

10th December 2013, adriancollier

New Features
---

###Social Media Sharing Buttons

Following on from the Meta-Data changes that we provided in the last release of RSR, we have now worked on adding in Social Media Sharing buttons for your Project, Update and Organisation pages within your Partnersite.

We have created this functionality for Facebook and Twitter. Both of these can be turned on/off independently within the [Partnersite Admin](http://rsr.akvo.org/admin/rsr/partnersite) form.

For Facebook there is an additional setup needed. You will need to [Create a Facebook App](http://tri.be/how-to-create-a-facebook-app-id/) and enter the App ID into the [Partnersite Admin](http://rsr.akvo.org/admin/rsr/partnersite) form. The Domain of the Facebook App should match the primary domain being used for your Partnersite, e.g. http://projects.organisation.org OR http://organisation.akvoapp.org.

Github issue [#230](https://github.com/akvo/akvo-rsr/issues/230)

###Github Wiki and RSR Documentation

We have been working on improving the documentation for both internal developers, users as well as external partners, integrating organisations and the Open Source development Community. As you can imagine this is a big undertaking to ensure that everone has all the necessary information available in the right format to be suitable for its intended use.

This is of course a work in progress and we will continue to improve this, but you can already see the summary page with an overview of what we have and where to find it [here](https://github.com/akvo/akvo-rsr/wiki)

###Footer Changes

We have made several changes to the Footer for RSR to match the changes that are being made within the main Akvo website.

Github issue [#398](https://github.com/akvo/akvo-rsr/issues/398)
Github issue [#342](https://github.com/akvo/akvo-rsr/issues/342)
Github issue [#350](https://github.com/akvo/akvo-rsr/issues/350)

###Reinstate Global  Maps in RSR

Earlier this summer we removed the functionality surrounding global maps on the platform. This was due to some performance and stability issues we were having with this portion of the site. We have now resolved these issues by implementing a Caching layer using Memcache on the API calls, as well as tidying up the API code to streamline the data being transmitted for the query involved.

These changes have provided a big enough improvement in the performance of the system that we have been able now to turn the maps back on in RSR so you can now see all your projects or organisations in one place - as you should be able to.

Github issue [#331](https://github.com/akvo/akvo-rsr/issues/331)


Bug Fixes
---

###Thumbnails on Partnersite Maps

We had a reoccurrence of a previous bug in this release - maps on Partnersites were displaying a very large thumbnail in the pop-up window after clicking on a single point on the map. This meant that only a small portion of the image was visible and the thumbnail took a long time to load.

We have resolved this by using a smaller thumbnail when pulling images into the maps.

Github issue [#159](https://github.com/akvo/akvo-rsr/issues/159)

###Release Notes Fixes

The last release was pushed out with a couple of spelling mistakes in the Release Notes, these have now been corrected.

Github issue [#372](https://github.com/akvo/akvo-rsr/issues/372)

###Social Media Images

When sharing Projects and other RSR Pages in Social Media sites images are passed through to be displayed. We had an issue that the images being used were not the correct format and so an inaccurate thumbnail was being displayed. This has been rectified to ensure that the right image sizes and shapes are provided to display as expected.

Github issue [#367](https://github.com/akvo/akvo-rsr/issues/367)

###Supervisor Log Warning

One of the Resources in the Benchmark Models was causing some errors and so this has been fixed to prevent any further issues.

Github issue [#364](https://github.com/akvo/akvo-rsr/issues/364)



Akvo RSR ver 2.3.1 Quince
---

31st October 2013, adriancollier

New Features
---

###Social Media Sharing Optimisation

When you share something using modern Social Media sites, the site you are sharing to (for example Facebook) automatically collects information from the source system to display an image, description and other Meta Information.

We have improved the Meta Data in RSR to ensure that when you share a page from RSR, the appropriate information is supplied to the Social Media site and the share looks great.

Github issue [#196](https://github.com/akvo/akvo-rsr/issues/196)

###Partnersite Widget CNAME

We have recently released a new set of Partnersite Widgets, however these have now been additionally configured to use the CNAME belonging to the Partnersite itself. This means that if the Widget is collected from a CNAME domain, then they will direct Widget visitors to the same CNAME domain when clicked.

Github issue: [#315](https://github.com/akvo/akvo-rsr/issues/315)

Bug Fixes
---

###Partnersite Widget Visual Fixes

There were a few inconsistencies with the visual elements of the new Partnersite Widgets. These included text running off the end of the widget, and the scrollbar on the Project Listing Widget. These have been resolved so now we should have pretty, error-free widgets.

Github issue: [#316](https://github.com/akvo/akvo-rsr/issues/316)

###Duplicates in API

The API was occasionally returning duplicate values in the results due to circular references between tables in the originating request. To ensure this doesn't continue to happen, we have adde da Distinct Clause to the API that will clean any duplicates before returning the results to the user.

Github issue: [#206](https://github.com/akvo/akvo-rsr/issues/206)

###Problems Saving Project in Admin

There was an issue where the project saving in the RSR Admin was taking some time. There was no indication as to whether this was working or not, and so if the save button was used several times, then it could result in dupliciate infomration being stored on a individual project.

To keep the project information unique where it needs to be, we have set it now that while the project is saving the Save Button is greyed out so it cannot be pressed multiple times.

Github issue: [#313](https://github.com/akvo/akvo-rsr/issues/313)

###RSR and Partnersite Sing In Page Link

We found a broken link on the sign in page that was directing users to the former Drupal content. We have corrected this to point the user to the correct page on the new Akvo.org website.

Github issue: [#342](https://github.com/akvo/akvo-rsr/issues/342)

###Footer Link Error

There was a link on the Footer of RSR that directed users to a non-existant page. This has been corrected so users are pointed to the correct page on the new Akvo.org website.

Github issue: [#350](https://github.com/akvo/akvo-rsr/issues/350)

###Field Limit Config Setting

Last year we implemented a change to impose the correct character limits on RSR Project fields. We made a decision not to force these limits historically, and so we added a config setting to allow projects with an ID below 478 to be exempt from these new limits.

This config setting was lost during the migration and infrastructure work we have been doing, so in this issue we have replaced this so that older projects can continue to be edited and used as normal.

Github issue: [#360](https://github.com/akvo/akvo-rsr/issues/360)

Infrastructure Changes
---

####Reduce Downtime during Deployments

By changing the way and order that we process all the necessary tasks during system deployment, we have been able to dramatically reduce the downtime of Akvo RSR. With releases going forwards we should always be looking at a downtime of less than 10 minutes.

Github issue [#132](https://github.com/akvo/akvo-rsr/issues/132)

###Migrations for Apps During Deployment

We have made some changes to our deployment scripts so that any migrations on apps used are included in the steps, making this process a lot more complete.

Github issue [#89](https://github.com/akvo/akvo-rsr/issues/89)

###Upgrade TastyPie

A newer version of TastyPie has been released. We use TastyPie for the RSR API. To ensure we can utilise the latest features of this, we have upgraded our version to the latest in this release.

Github issue: [#157](https://github.com/akvo/akvo-rsr/issues/157)


Akvo RSR ver 2.3.0.1 - Passionfruit Part 2 - Hotfix
---
21st October 2013, carlio

Bug Fixes
---

The "All Projects" RSS feed now returns only the most recent 100 project updates to speed up the feed generation and prevent out-of-memory problems.

GitHub Issue [#318](https://github.com/akvo/akvo-rsr/issues/318) and [#329](https://github.com/akvo/akvo-rsr/issues/329)

Akvo RSR ver 2.3.0 Passionfruit
---

8th October 2013, adriancollier

New Features
---

###Searching in the Admin on Internal ID

We have begun to implement a foreign identification number on projects that allow an Organisation to identify their projects using the ID that exists in their own internal systems. This is an extremely useful feature as it ensures that Partners can communciate in their own terms.

Until now however it was only possible to search in the Admin for RSR Ids. We have coded the change so that in the RSR Admin you can search on these Internal IDs and find the RSR Project that responds to that ID.

Github issue [#254](https://github.com/akvo/akvo-rsr/issues/254)

###Notes and Comments in the Admin

We have added some additional notes fields to a lot of the different areas of the admin. These fields will not be visible anywhere on the site, and the content will only be available to those working on the project with access ot the Admin. So, these fields can be used to explain additional informaiton for users of the project, or to write notes about recent changes or anything in particular that someone maintaining the content of a project might need to know.

Github issue [#151](https://github.com/akvo/akvo-rsr/issues/151)


Infrastructure Changes:
---

###Upgrade to Ubuntu 12.04, Nginx and move to CloudVPS

In this release our live server is being moved from its current home in London with the fantastic guys at ProWeb to a new Cloud based machine at CloudVPS. Within this movement we are also updating the underlying Operating System on RSR from 8.04 to 12.04. This has a whole series of additional benefits as well as challenges, but its certainly a move in the right direction. In addition we are also changing our Web-Server from Apache to Nginx at the same time. Nginx provides a more responsive web application with a simpler configuration and a smaller footprint.

We are aligning the environments that all our machines sit within, to improve the fidelity between our systems, as well as reducing the overhead of maintaining and administering these machines.

We expect these changes to enable some much bigger changes in the area of performance and stability to ensure our systems are working at the top of their game.

More to come in this area for sure!

###Moving Virtual Environments to CloudVPS

When we decided to choose a new hosting provider, this didn't just affect the live server, as we also have a number of additional development environments that we also need to move to ensure these work in a similar structure as the live system. Otherwise our testing has a lot less value.

We have moved these machines to our provider CloudVPS and have setup the additional surrounding structure so that they are already tightly integrated into our devleopment process.

Github issue [#130](https://github.com/akvo/akvo-rsr/issues/130)


Bug Fixes
---

###Register Link on Partnersites

We uncovered a sneaky bug that caused the Register link on Partnersites to only direct people into a loop and not actually deliver users to the correct location. We've fixed this so now users can register as normal.

Github issue [#307](https://github.com/akvo/akvo-rsr/issues/307)

###Update Title Character Limit

The Title field on Project Updates has a limit of 50 characters. However we were experiencing a problem with this that when you started typing into the field the display gave you a limit of 255. This was only a visual issue and luckily the form validation did not let the Update be submitted if over 50, but of course this is a very confusing situation.

We have resolved this now, so the display correctly informs you how many characters you have left out of the actual 50 character limit.

Github issue [#302](https://github.com/akvo/akvo-rsr/issues/302)


Akvo RSR ver 2.2.0.3 - Okra Part 3 - Hotfix
---

5th September 2013, adriancollier

New Features
---

###Expansion of Write API Functionality

We have been working on improving the process of importing IATI XML Files into the RSR Write API. These are a combination of general fixes and resolutions to Cordaid specific issues.

Github issue [#266](https://github.com/akvo/akvo-rsr/issues/266)
Github issue [#277](https://github.com/akvo/akvo-rsr/issues/277)
Github issue [#237](https://github.com/akvo/akvo-rsr/issues/237)
Github issue [#297](https://github.com/akvo/akvo-rsr/issues/297)

Bug Fixes
---

###Header to show Signed In Status

Following on from the release of our new Akvo.org website, we needed to modify the header being used so that users can be shown within the header if they are logged into RSR or not.

Github issue [#300](https://github.com/akvo/akvo-rsr/issues/300)

###Previous Navigation Button Broken

The Previous Button in RSR Lists for Organisations or Projects was not working due to some spaces instead of Tabs in the template code. We've corrected this now so users can navigate freely forwards and backwards to their heart's content.

###CSS Regression

We had a bug that managed to creep back into the system affecting the layout on the User Registration page on Partnersites. This has been fixed - and hopefully for the final time.

Github issue [#205](https://github.com/akvo/akvo-rsr/issues/205)


Akvo RSR ver 2.2.0.2 - Okra Part 2 - Hotfix
---

2nd September 2013, adriancollier

New Features
---

###New Headers and Footers for RSR

We have implemented new Headers and Footers throughout RSR to coincide with the new Akvo.org Website launch. These now contain the look and feel of the new website whilst providing all the functionality necessary to navigate throughout RSR and the Akvo network pages.

Github issue [#288](https://github.com/akvo/akvo-rsr/issues/288)

###Automated Development Environment Setup

To improve the ease of setting up a local instance of RSR for development, we have worked on a set of scripts and resources using Puppet and Vagrant.

###Cordaid API Update Functionality

We have developed an improvement to the API that allows us to update existing projects using the API Write functionality we have previously implemented. It was only possible before to create new projects.

Github issue [#224](https://github.com/akvo/akvo-rsr/issues/224)


Bug Fixes
---

###Partnersite Routing

We had an issue within our Middleware that resulted in an incorrect domain being set for Partnersites that were using CNAME entries to embed these into their Organisation's websites.
This has now been resolved, fixing issues related to Widgets not containing pins, as well as incorrect links throughout Partnersites.

Github issue [#291](https://github.com/akvo/akvo-rsr/issues/291)


###Mistakes in Unpublished Project Notification

We implemented a Banner to be displayed to users that are viewing an unpublished project. This banner contained some errors which have now been resolved.

Github issue [#257](https://github.com/akvo/akvo-rsr/issues/257)

Akvo RSR ver 2.2.0.1 - Okra
---
29th August 2013, adriancollier

New Features
---

###RSR Moved to Subdomain

In light of moving to a new website and structure, we have decided modify the underlying source of the RSR codebase. All RSR pages used to be displayed at http://akvo.org/rsr/ where we have now changed this to http://rsr.akvo.org. This allows us to separate out our products more easily and include more in-line information from Akvo's other products including FLOW and Akvopedia in a standard way going forwards. All the existing links and permalinks will continue to work, with the user being redirected to the new page automatically.

Github issue [#139](https://github.com/akvo/akvo-rsr/issues/139)

###Added Piwik Tracking Code

We have implemented an Analytics Traffic counting system Piwik throughout Akvo. We added the tracking information to RSR to allow traffic to be counted from within this new system to replace our previous solution HitList.

Github issue [#268](https://github.com/akvo/akvo-rsr/issues/268)

###Temporary Replacement Homepage

We are intending shortly to implement a new Akvo.org website. In addition we are also planning to move RSR to a new hosting provider and separate out the different parts of the current Live Server to create a more service based architechture. In order to do this, we needed to replace the current homepage which was being delivered by Django in a piece of functionality we called the MiniCMS.
We have built a temporary Hoempage solution using Wordpress that gives us the flexibility to carry on with this work unhindered.

Bug Fixes
---

###Remove Labs Footer Link

There was a link to an Akvo Labs page within the footer where the page is no longer in use, so the Footer link has been removed.

Github issue [#280](https://github.com/akvo/akvo-rsr/issues/280)


###Interactive Global Maps Disabled

We were experiencing problems with our API calls that resulted in excessive memory being used on our servers when these pages were displayed to users. While we work on the cause of the problem, we have disabled the maps and placed static maps in their stead to retain the visual elements, even though we are aware of the reduction in functionality.

Github issue [#279](https://github.com/akvo/akvo-rsr/issues/279)

###ISO Country Name

Palestein was listed as an Occupied Territory in RSR based on an older version of the ISO3166 list. We have now corrected this to State of.

Github issue [#215](https://github.com/akvo/akvo-rsr/issues/215)

###Water and Sanitation Text in RSR Admin

The headline text in the RSR Admin when creating a project mentioned Water and Sanitation projects. This is legacy from when RSR was only involved with these types of projects. We have now replaced this with a more general headline text.

Github issue [#216](https://github.com/akvo/akvo-rsr/issues/216)

###Add Update to Submit Update

On the Project Update Form within RSR, the button below the Update Form had the same Text "Add Update" as the button on the right side of the page to enter the form, leading to confusion. We have now changed the lower button to read "Submit Update" to make the difference between these more clear.

Github issue [#251](https://github.com/akvo/akvo-rsr/issues/251)


Akvo RSR ver 2.1.5.2 - hotfix for Nectarine
---
8th August 2013, adriancollier

###Adding a Country via the RSR Admin

We inherited a bug which prevented Countries from te ISO list being added to the available country list in the RSR Admin.

Github issue [#256](https://github.com/akvo/akvo-rsr/issues/256)

###Registration page in Partnersites

We made some fixes to the Regsiitartion page included modifying the layout to match the style better, and fixing some issues with the links that were not working once ported from Core RSR.

Github issue [#260](https://github.com/akvo/akvo-rsr/issues/260)

Akvo RSR ver 2.1.5.1 - hotfix for Nectarine
---
24 July 2013, adriancollier

###Add Organsiation Loading Info

We needed a little more code to process the Organisation Import File from Cordaid.

Github issue [#250](https://github.com/akvo/akvo-rsr/issues/250)

Akvo RSR ver 2.1.5 Nectarine
---
8th July 2013 - adriancollier

New Features
---

###Partnersite Widgets

We build a set of Widgets some time ago to enable our Partners to visualise information from one or more of their projects on any website via the use of an iframe. These Widgets provide a link directly to the project page on Akvo.org.

We have now built a new set of widgets that are redirecting users to the Project page on the Partnersite of the Organisation that collected the Widget.

This allows Partners to direct users to the right places they want, and makes the user experience more streamline remaining in the Partners domain or website look and feel.

Github Issue: [#154](http://github.com/akvo/akvo-rsr/issues/154)

###Restyled Widgets

As well as creating a set of Partnersite widgets, we also set our Designer to work on the visuals for these. The result is a new set of Widgets with a fresh and clean look. They're available in Light and Dark styles, so you should be able to locate the widget that looks exactly right on the site you want to place it on.

Github Issue: [#181](http://github.com/akvo/akvo-rsr/issues/181)
Github Issue: [#188](http://github.com/akvo/akvo-rsr/issues/188)
Github Issue: [#182](http://github.com/akvo/akvo-rsr/issues/182)
Github Issue: [#185](http://github.com/akvo/akvo-rsr/issues/185)
Github Issue: [#186](http://github.com/akvo/akvo-rsr/issues/186)

###New Get a Widget Page

And in case you thought we hadn't done enough with Widgets in this release, we have created a new Get a Widget page for Partnersites that display the available widgets and allow you to customise and collect the code for your Widget of choice.

Github Issue: [#193](http://github.com/akvo/akvo-rsr/issues/193)

###Comments field in Partnersite Admin

To allow us to maintain a better grasp on which Partnersites we have active, who is responsible for these and what Demo Partnersites we have implemented, we have added a notes field to this record so that we can provide some additional information which running our Admin.

Github Issue: [#207](http://github.com/akvo/akvo-rsr/issues/207)

###Partner Type Selection

We found recently within RSR that some of our Partners were being assigned to roles that the Partner was not authorised to be able to undertake. To solve this problem we have implemented a choice selection within our backend Admin, that allow us to pre-select the different roles that a Partner is able to fulfill on Projects in RSR.

Github Issue: [#203](http://github.com/akvo/akvo-rsr/issues/203)

Russian Translation

Working with one of our Partners UNDP, we have developed a set of User Interface translations that allow RSR Partnersites to be viewed locally in Russian. This now makes 6 languages we support in the User Interface of RSR:

- English
- Dutch
- French
- German
- Spanish
- Russian

Github Issue: [#138](http://github.com/akvo/akvo-rsr/issues/138)

###Subdomain RSR

In preparation for our move to a new hosting provider, we are making some changes to the underlying structure of RSR. In this release we are moving the RSR core code from the location of http://akvo.org/rsr to http://rsr.akvo.org.

This allows us to physically separate the various components of RSR and find stable and efficient hosting solutions for each part. All on the way to a smooth and flexible development process.

Github Issue: [#139](http://github.com/akvo/akvo-rsr/issues/139)

###Homepage API Resource

Also related to our move of hosting providers, this new addition to the API has been added to populate the "Right now in Akvo" box on the Homepage. This resource can be customised as time goes on to be able to generate more Analytics/KPI type information to be displayed within our Public Website pages.

Github Issue: [#180](http://github.com/akvo/akvo-rsr/issues/180)

###Remove old API

We have been working for some time on a working Read and Write API for RSR. We are pleased that we are now at the point when we have this in place. We are still making improvements and customisations but in the meantime we have decided it's time for us to remove the previous API we had in place to ensure that all Partners using this are using the correct feature and can access all of the right information.

The correct API Documentation can be found on our [Github Wiki here](https://github.com/akvo/akvo-rsr/wiki/Akvo-RSR-API-developer-documentation).

Github Issue: [#61](http://github.com/akvo/akvo-rsr/issues/61)

###Update API to allow new version of Tastypie

When trying to perform an upgrade of Tastypie which runs our new RSR API eature, we experienced an error as the models within RSR were not compatible with the latest Tastypie features.

To resolve this we have fixed the dependencies so that we can upgrade Tastypie and make the most out of this technology.

Github Issue: [#165](http://github.com/akvo/akvo-rsr/issues/165)

###Registration Links on Partnersites

If you go to add an update to a project on Akvo.org then you get a screen asking you to login and if you don't have an account there is an easy link to register for a new account right there on the page.

However if you try to do the same thing from a Partnersite, there is no registration link available. In this release we have resolved this and now the Login page has the same Registration information displayed.

Github Issue: [#205](http://github.com/akvo/akvo-rsr/issues/205)

###Photo Credit on Project Image

When adding a photo to a project via an Update, you can enter both a Caption and Credit for the photo, allowing you to describe the image and ensure that the photographer is credited for their work.

Now you can do the same when adding a photo to a project. Both the Caption and Credit fields are available to complete to ensure your images have the most up to date and accurate information you know at the time.

Github Issue: [#212](http://github.com/akvo/akvo-rsr/issues/212)

Bug Fixes
---

###Fix to Global Maps

There were 2 visual issues affecting the Global Maps page. As more pins are collected from the API, the position of the map on the screen and the zoom level was resetting. This has been fixed now to provide a steady map view.

Github Issue: [#113](http://github.com/akvo/akvo-rsr/issues/113)

###Fix Partners Column in Widget
In the standard RSR Widget, the Project List Widget had a column called Partners that was not being populated. This has been resolved so that this again shows the list of current partners working on the project being displayed on the Widget.

Github Issue: [#15](http://github.com/akvo/akvo-rsr/issues/15)

###Test Bug - Cannot create new org in Admin

When testing this release, we discovered an issue preventing Organisations from being created within the Admin. This was resolved before we pushed the release to live, so no such bug will be affecting our users after this release.

Github Issue: [#244](http://github.com/akvo/akvo-rsr/issues/244)


Akvo RSR ver 2.1.4 - mangosteen
---
25 June 2013, adriancollier, zzgvh

New features & changes
----

###Akvo RSR Write API

We have added functionality to our API to be able to import projects from an external source. This is hugely beneficial for our partnerships with larger partners such as Cordaid.org, who are currently working on implementing their entire project portfolio (500+ projects) into RSR.

The process involves sending an IATI Formatted XML File to RSR, which is then translated and imported into the system to create the projects based on the file's contents.

We will continue to work on improving and strengthening this process, but the first projects are being added via the API for Cordaid's initial run. In this we're adding over 130 new projects to RSR.

Github issue: [121](https://github.com/akvo/akvo-rsr/issues/121)

###Internal Organisation ID

We needed a way for Organisations to label other organisations and identify them on an ongoing basis. We have implemented this field which allows a partner to reference all of their working partners and provide a unique code for this. In the long term we believe we will be replacing this field for the IATI Organisation Identifier, but until this is more commonly in use, we will be using a custom identifier selected by the submitting organisation.

Github issue: [178](https://github.com/akvo/akvo-rsr/issues/178)

###Migrate Organisation to use the IATI Code List

We were previously using an Organisation type list of 4 types:

- NGO
- Governmental
- Commercial
- Knowledge Institution

We have now implemented an additional type field to use the [existing IATI List](http://iatistandard.org/codelists/organisation_type/). We will shortly be working on migration to update all existing Organisations we have to use the new field.

Github issue: [149](https://github.com/akvo/akvo-rsr/issues/149)

###API Caching

We have reduced the Caching solution we are using for the API to Memcached only, as our previous solution had stability issues. We now have a simple cache for Maps provided by Tasypie, and will work on what additional changes need to be implemented.

Github issue: [136](https://github.com/akvo/akvo-rsr/issues/136)

Bug fixes
----

###Cordaid Data Importing

We experienced an issue with the data import which was caused by a missing Business Unit in the implementation details. This was added and the problem resolved.

Github issue: [197](https://github.com/akvo/akvo-rsr/issues/197)

###IATI Organisation Identifier NULL Duplicates

When we added the IATI Identifier to the Organisation records, we wanted to prevent duplicates from being created so we implemented validation on the field. The issue was that the validation included a NULL value so 2 Organisations both without any ID were showing as duplicates. As it is possible to have an Organisation without an identifier we have removed this validation constraint to ignore NULL values.

Github issue: [208](https://github.com/akvo/akvo-rsr/issues/208)


Akvo RSR ver 2.1.3.1 - hotfix for leek
---
11 March 2013, zzgvh


###Fix project update form in RSR

The project update form was missing the newly added language field, rendering the form un-postable. This is now fixed.

Github issue [162](https://github.com/akvo/akvo-rsr/issues/162)

###Fix the middleware for partner sites using CNAME domains

The partner site routing middleware generated an exception when accessing a site using a CNAME domain. This is now fixed.

Github issue [164](https://github.com/akvo/akvo-rsr/issues/164)

Akvo RSR ver 2.1.3 - leek
---
4 February 2013, adriancollier


###Project Admin Rework

We have made some changes to the ordering and display of the Project Form in the Admin. This is to make the order more logical so that entering a project is easier.

We are working on an update to the manual project form which is currently in PDF format, which will also utilise the same ordering of fields to make the process even more seamless.

Github issue: [145](https://github.com/akvo/akvo-rsr/issues/145)

###API Caching

We have implemented a Caching solution to our API to store results of requests to pull information for the Global Maps in RSR. This works by storing a copy of the data for the maps on the server and only renewing this information if the existing data is expired. This not only speeds up the request but also dramatically reduces the load on the server.

For this we have used the Django library Cacheback.

Github issue: [136](https://github.com/akvo/akvo-rsr/issues/136)

###Multilingual Content Translations

We have successfully implemented the Google Translate Widget into Akvo RSR for Partnersites. This functionality is by default turned off, but can easily be switched on within the RSR Admin.

Once activated, the Widget appears in the top right hand corner of the page and allows users to select any of the 64 supported languages to translate the entire page and contents into.

This is a machine translation, and is not fully verified, but it should provide enough information for viewers of the project to understand the intention of the project and it's overall aims and goals.

It is also possible to submit better translations to Google via the translated page, increasing the accuracy of the translated content for future viewers.

Github issue: [101](https://github.com/akvo/akvo-rsr/issues/101)

###Closing the Donation Loop on Partnersites

An improvement in both Partnersites and the Donation process that captures the Partnersite users were on when they began the process, and returns them there once they finished. Previously, a user of the site would always be returned to Akvo RSR regardless of which site they started their donation on.

Github issue: [93](https://github.com/akvo/akvo-rsr/issues/93)


Akvo RSR ver 2.1.2.1 - Donations Hotfix release notes
---
4 February 2013, adriancollier

###Funding Projects to 100% with the Donation Engine

We have made a change to the way payment amounts are being calculated when including fees. There has been an existing legacy issue for some time that due to the fees deducted from PayPal or iDeal, a project could not be fully funded using the donation engine alone. A manual payment was neeeded to be made in the Admin to complete the project funding.

Now we have re-engineerd the fees so that these are added to the amount required to complete a project. The donor can make the payment and the actual fees charged are deducted from the payment before the remaindfer is applied to the chosen project.

It may occur infrequently that the project is over-funded by a small fraction as the fees incurred could differ from the fees calculated. Where this occurs the funds are provided to the project budget.


Github issue: [120](https://github.com/akvo/akvo-rsr/issues/120)

Akvo RSR ver 2.1.2 release notes
---
10 December 2012, (Code name: Kiwi) kardan, adriancollier, zzgvh

Overview
----
...

New features & changes
----

###End to End Transparency with Openaid.nl and Akvo RSR

In this release we have made a firm link between the Financial Information published by the Dutch Government at Openaid.nl and Akvo RSR. Pending a change in the Openaid.nl source code which should be pushed later this week, you will now be able to navigate between Funding Activities in Openaid.nl and projects being implemented using those funds on Akvo RSR.

So, links on the Openaid.nl site will provide you with a list of RSR projects or a list of participating organisations. From the Funding Pages on Akvo RSR you'll be able to go directly to the original funding activity in OpenAid.nl.

You can read more about this on our [Blog Post](http://www.akvo.org/blog/?p=7962) on this feature!

Github issue: [69](https://github.com/akvo/akvo-rsr/issues/69) & [87](https://github.com/akvo/akvo-rsr/issues/87)

###Donation Initial Page Restyle/Addition

On the first page of the donation process (http://www.akvo.org/rsr/project/613/donate/) there is currently the option of donating by PayPal or iDeal. At the bottom of the page there is also the option to donate as an Organisation which follows a different process.

This alternative process has been made more apparent to ensure organisations follow the correct path rather than to participate in the workflow that is aimed at individual donors.

Github issue: [98](https://github.com/akvo/akvo-rsr/issues/98)

###API Changes

We have added the "primary_location" field as inline data to the "project" and "organisation" resources in the API. This allows for the primary location to be collected directly when obtaining the project and organisation resources. Being one of the more useful pieces of information that is not part of the project or organisation database tables it makes a lot of sense to make this information accessible as a part of these resources directly.

In JSON the "primary_location" looks like this:

```js
    "primary_location": {
          "address_1": "",
          "address_2": "",
          "city": "Freetown",
          "country": "/api/v1/country/42/",
          "id": 779,
          "latitude": 8.371664,
          "longitude": -13.189087,
          "postcode": "",
          "primary": true,
          "project": "/api/v1/project/672/",
          "resource_uri": "/api/v1/project_location/779/",
          "state": ""
        },
```

Github issue: [124](https://github.com/akvo/akvo-rsr/issues/124)

We have also expanded the "current_image" field of the "project" resource and the "logo" field of the "organisation" to include a sub-object with two fields, "original" which is the URI for the original image, and "thumbnails" which is an object with named thumbnails of the image. Currently there is only one thumbnail, "map_thumb" that is used by RSR itself for some of the maps. With this change it will be easy to add other thumbnail formats in the future.

In JSON the new format for "current_image" (and "logo" in the organisation) is:

```js
    "current_image": {
        "original": "http://uat.akvo.org/rsr/media/db/project/672/Project_672_current_image_2012-11-06_15.22.42.jpg",
        "thumbnails": {
            "map_thumb": "http://uat.akvo.org/rsr/media/db/project/672/Project_672_current_image_2012-11-06_15.22.42_jpg_160x120_autocrop_detail_q85.jpg"
        }
    },
```

Github issue: [123](https://github.com/akvo/akvo-rsr/issues/123)

###Sorting on country

The ability to sort projects in a list based on which country they are located in was disabled some time back when we made changes to the location model. It has now been reinstated, so it'll be easier once more to find projects in the same country. We have also fixed the sorting direction to use logical defaults for all columns of the project listing pages.

Github issue: [99](https://github.com/akvo/akvo-rsr/issues/99)

###Map Images

Previously we were pulling and displaying original project images on our maps. This looked fine in general, but it had a huge impact on performance as all the images needed to be downloaded when the map was displayed to the user...not the most efficient.

Seeing as the images are small on the map pop-up anyway, we have modified the interface to use the thumbnail image rather than the original image. Reducing the loading time for users, and the impact on our server resources - for which we are grateful.

Github issue: [65](https://github.com/akvo/akvo-rsr/issues/65)

###Map Scrolling

This improvement is a great addition. We have enabled Global map zooming in and out using the scrollwheel on your mouse. If you don't use the scrollwheel on your mouse, then you'll probably not notice anything. If you do use it - then I hope you get as excited about this as I did!

Github issue: [43](https://github.com/akvo/akvo-rsr/issues/43)

###Akvo RSR in German

Working closely with one of our Partners Mars Chocolates, we have made significant progress in translating the Akvo RSR User Interface into German. We have checked this well, but we are still ironing out all of the kinks and making sure it all makes sense. If you spot any inaccurately translated items, please let us know. Online translation tools don't let you see things in context, so it's a lot of guesswork until it's seen in action.

Github issue: [116](https://github.com/akvo/akvo-rsr/issues/116)

###Automated Donation Testing Scripts

We have written some powerful Lettuce scripts allow us to run through the Donation Process automatically in under 2 minutes. They check that everything's working as expected, that all the numbers and figures are adding up and the connections are still responsive. It's a great addition to our testing process and will save hours of manual testing in the weeks, months and years to come.

Github issue: [131](https://github.com/akvo/akvo-rsr/issues/113)

Bug fixes
----
###Image slider thumbs not faded on initialisation
There was a slight UI issue with the image slider on project pages.

Github issue: [50](https://github.com/akvo/akvo-rsr/issues/50)

###Video Updates Scrollbar

We found that some videos were being bordered by scrollbars when showing on the RSR Update page. This made them look more than a little messy. So after some poking, we've fixed it and removed those unsightly bars.

Github issue: [104](https://github.com/akvo/akvo-rsr/issues/104)

###Unpublished Projects Administration

After making some major changes to the way unpublished projects are visible in RSR, we have made a further change to allow easier administration and maintenance by Akvo Staff of these projects. In short, it's now possible to do the things we need to do, without any jiggery-pokery.

Github issue: [91](https://github.com/akvo/akvo-rsr/issues/91)

###Translation of Listing Headings

A while back we made a large effort to translate our user interface into multiple languages. Almost all of the non-user-generated content within RSR is now available in different languages. Some items however missed out...

We have now updated this so that the project listing pages such as http://akvo.akvoapp.org have all the column titles translated - not just the select ones from before.

Github issue: [48](https://github.com/akvo/akvo-rsr/issues/48)

###Duplication of Partners on Project Page

The list of partners presented on the Project page was for a while showing the same organisations multiple times when this partner was connected to a project with multiple roles - such as Support Partner and also as Funding Partner. We've fixed the filter again now so no matter how many times a parter is linked they will be shown just the once. If however you go through to the Partners page for that project, you'll be able to see each partner and the roles they perform. So we've not lost anything, just tidied it all up a little.

Github issue: [127](https://github.com/akvo/akvo-rsr/issues/127)

---------------------------------------------

Akvo RSR ver 2.1.1 release notes
---
17 September 2012, (Code name: Jujube) ac

Overview
----
We have release several items in this version focusing around permissions and IATI identification. Along with a few bug fixes for good measure.

New features & changes
----


###Extension of the Akvo API
We have improved the functionality of the Akvo API to improve usability all-round. This feature now enables users to authenticate their access using an API key linked to an Akvo RSR User account. This allows a little more access in terms of information as now user details can also be passed through a correctly authenticated access request.
We've also included a "depth" option to the querying. This enables the requester to choose how much information is pulled alongside the item they are looking at - for example linking to a project, you will also want to pull information from tables linked to the project table. The depth option provides this opportunity.

Further information on the API is available in the [Github Akvo RSR Wiki](https://github.com/akvo/akvo-rsr/wiki/Akvo-RSR-API)

Github issue: [72](https://github.com/akvo/akvo-rsr/issues/72) & [75](https://github.com/akvo/akvo-rsr/issues/75)

###IATI Identifiers
This feature is to implement the ability to add an IATI activity identifier to Projects and IATI identifiers for Organisations.

This is the first step in an end-to-end transparency initiative to enable navigation from the original funding source present on the OpenAid website at http://openaid.nl through to the RSR Organisations and Projects where this money is being spent.

Github issue: [69](https://github.com/akvo/akvo-rsr/issues/69) & [74](https://github.com/akvo/akvo-rsr/issues/74)

### Partner Identifier
Partners are now able to add an Identifier to projects via the Akvo RSR Admin. This field can be used by Partner Administrators to track the identity of their own projects. This can be anything the Partner wishes, but the main purpose we expect is to use the Id that is being used for the project in their internal systems.

This Id is usable in the API, allowing partners to query their data in RSR using the Ids in their own systems.

Github issue: [86](https://github.com/akvo/akvo-rsr/issues/86)

###Public viewing of Unpublished projects
This developed feature is in multiple parts.

A change has been made to make unpublished projects in RSR only visible to those who are logged in to RSR AND are connected to the project. This moves the functionality in line with what most people expect - unpublished means that it is not public.

If you are not logged into RSR at all, then when you view an unpublished project [such as project 609](http://akvo.org/rsr/project/609/) then you are presented with a [404 Error - page does not exist](https://raw.github.com/akvo/akvo-rsr-docs/master/image/404_not_found_unpublished.png).

If you are logged into RSR, but are not connected to the project then you are presented with a [403 Error - forbidden access](https://raw.github.com/akvo/akvo-rsr-docs/master/image/403_no_access_to_unpublished.png).

If you are logged in and connected to an unpublished project, then you are able to access the page, but this displays clearly that [the project is not live](https://raw.github.com/akvo/akvo-rsr-docs/master/image/access_to_unpublished.png).

Github issue: [39](https://github.com/akvo/akvo-rsr/issues/39)

Bug fixes
----

###Add Update Page Layout Issue
There was a slight mis-alignment of the foem fields on the Add an Update page. This has now been corrected.

Github issue: [83](https://github.com/akvo/akvo-rsr/issues/83)

###Incorrect Errors in Update process
We noticed that on certain actions when trying to add Updates to projects, the wrong error message was being displayed. We have corrected this so that if the issue is related to permissions then this is displayed.

Github issue: [39](https://github.com/akvo/akvo-rsr/issues/39)

###Akvo Stats Page
There was an error in the Overview page following an update to the database fields. This has been rectified, so we now see all the data on [this page](http://www.akvo.org/rsr/data/overview/) again!

Github issue: [68](https://github.com/akvo/akvo-rsr/issues/68)

###Global Map Info Window Scrollbar
When pictures in portrait format were displayed in the info windows for the global project or organisation map, then a scrollbar was appearing on the right hand side of the window. This was not necessary as the window resized to accommodate the image - so we've removed it.

Github issue: [66](https://github.com/akvo/akvo-rsr/issues/66)

Akvo RSR ver 2.1.0 release notes
----
2 August 2012, (Code name: Iyokan) ac

Overview
----
This release contains improvements to the map functionality that was implemented in the previous release. As well as some structural changes to the database to facilitate this functionality. We've also squeezed in more than a handful of bug fixes as well.

New features & changes
----

###TastyPie API
This release brings the first prototype of our new API into play. This is a simple model to begin with, but we will be working with some close partners to pad out the functionality to provide exactly what everyone wants from this functionality.
More information about this can be found on this subject on the Github wiki page for the [Akvo RSR API](https://github.com/akvo/akvo-rsr/wiki/Akvo-RSR-API).
The existing API will shortly be depreciated in favour of this one.

Github issue: [21](https://github.com/akvo/akvo-rsr/issues/21)

###Text Formatting in Project Updates
We have added the ability to use some Markdown formatting when submitting project updates to RSR. We have restricted the language to a relevant sub-set and will be providing partners with information on how to utilise this feature in the update process.

Github issue: [24](https://github.com/akvo/akvo-rsr/issues/24)

###Map info bubbles
In our last release we introduced a new style of maps. In this release the info windows contained only a link to the object. Now we have embellished this a little further to also include the primary image for the object. Further work on these windows is still to be completed.

###Map zoom level outliers

We have implemented a new style of maps on the system which will enable us to use more geospacial tools and tricks going forwards. However there was an issue that for Partner Sites which had only 1 project, the map zoomed so far that it occasionally looked as though there was no map loaded in the background. We have now applied a default zoom level to maps that only have a single pin.

GitHub issue: [46](https://github.com/akvo/akvo-rsr/issues/46)

###People who get...

We have removed the 'People who get' box from Organisation pages as this was often providing misleading results. We will be working to determine what information should be displayed in this location.

GitHub issue: [10](https://github.com/akvo/akvo-rsr/issues/10)

###Searching on secondary locations

Within the work we have done on locations, we have improved the search filter in the application to include the information in secondary locations.

GitHub issue: [18](https://github.com/akvo/akvo-rsr/issues/18)

###Location Refactor

We have changed the way locations are stored and served in the system. Now a location can be either a project location or an organisation location. This provides us with the additional flexibility required to provide better information and functionality in maps and location functions.

GitHub issue: [27](https://github.com/akvo/akvo-rsr/issues/27)

###Adding Kosovo to our country list

Kosovo declared [independence](http://en.wikipedia.org/wiki/2008_Kosovo_declaration_of_independence) in 2008, however to date it has not been allocated an ISO country code. We have recently partnered with an organisation working in Kosovo and so have added it to our country list.

GitHub issue: [56](https://github.com/akvo/akvo-rsr/issues/56)

###AJAX Loading Animation

While we have made many changes to improve the speed and performance of the site, it still occasionally happens that a map needs some time to load in the browser before being visible. In this instance we needed a loading animation, so we put one in. If you want to see this then you'll need to be quick as it doesn't hang around for long.

GitHub issue: [42](https://github.com/akvo/akvo-rsr/issues/42)

Bug fixes
----

###Multiple Primary Locations Bug

We fixed an issue which created an error when a project was labelled with multiple primary locations. All duplicates have now been removed and the fix also prevents this from reoccurring.

GitHub issue: [7](https://github.com/akvo/akvo-rsr/issues/7)

###PayPal Donations blank confirmation page

PayPal changed it's methods to use HTTP GET in place of HTTP POST. This had an effect that after making a donation, the confirmation page was not served to the user.

GitHub issue: [63](https://github.com/akvo/akvo-rsr/issues/63)

###Runtime error when removing projects

We fixed an issue which caused errors when making major changes to projects and the connected database items.

GitHub issue: [59](https://github.com/akvo/akvo-rsr/issues/59)

###Partner Map Widget Error

The Map Widgets for Partner Sites were not working due to an error in the templates. This is resolved and they have been fully functional for several weeks now, but the full fix is being checked in with this release.

GitHub issue: [45](https://github.com/akvo/akvo-rsr/issues/45)

###Resolving some display issues

Some organisations had contact details such as websites or email addresses, which were too long for the fields in the application. So we've made a change to truncate these items whilst continuing to provide the full clickable link.
[How it used to look](https://www.dropbox.com/s/pvlxism0hdkkfij/Screen%20Shot%202012-07-25%20at%2013.51.20%20PM.png) and [how it looks now]{(https://www.dropbox.com/s/gvps4pbfufn2zqo/Screen%20Shot%202012-07-25%20at%2013.51.26%20PM.png)

GitHub issue: [36](https://github.com/akvo/akvo-rsr/issues/36)

We noticed that in some partner sites, the funding box on project pages was over-running it's boundaries and obscuring the figures. We made a change to hide some of the text when this spills over to preserve the numbers.
[Originally](https://www.dropbox.com/s/0cxjsu8e3upvlfx/Screen%20Shot%202012-07-25%20at%2013.55.10%20PM.png) and now [with the fix.](https://www.dropbox.com/s/oe6vo8sqqgyl738/Screen%20Shot%202012-07-25%20at%2013.56.23%20PM.png)

GitHub issue: [40](https://github.com/akvo/akvo-rsr/issues/40)

###Project to organisation relationship duplicates

We have fixed an error in the system which was caused by a project being linked to an organisation twice with the same type of relationship. This had the knock-on effect of doubling amounts related to funding and budgets for the project. It is no longer possible to create this situation, and we have resolved all the previous instances.

GitHub issue: [35](https://github.com/akvo/akvo-rsr/issues/35) & [58](https://github.com/akvo/akvo-rsr/issues/58)

Non-functional changes
----

###Python 2.7 Upgrade

Various Python packages are no longer supported on Python 2.5, so we needed to upgrade our servers to use the 2.7 version.

GitHub issue: [9](https://github.com/akvo/akvo-rsr/issues/9)

###Web server to use mod_wsgi

The web server components have been upgraded to use the newer [mod_wsgi](https://docs.djangoproject.com/en/1.4/howto/deployment/wsgi/modwsgi/) app handler since mod_python is now [deprecated](https://docs.djangoproject.com/en/1.4/howto/deployment/modpython/) and support will be removed in Django 1.5.

GitHub issue: [55](https://github.com/akvo/akvo-rsr/issues/55)

Akvo RSR ver 2.0.7 release notes
----
29 June 2012, (Code name: Hawthorn) pb

Overview
----
This release contains improvements to the way global maps are rendered in Akvo RSR. These maps are now rendered using AJAX calls resulting in dramatically reduced template size and rendering times for the pages in question.

New features & changes
----
### New global project and organisation maps
The global projects and organisations maps (including the small map on the akvo.org home page) are now rendered using JSON data and AJAX. This has resulted in dramatic speed improvements to these pages.

GitHub issue:
[38](https://github.com/akvo/akvo-rsr/issues/38)

### "People who get..." box removal

The "People who get..." box has been removed on all Organisation pages.

GitHub issue:
[10](https://github.com/akvo/akvo-rsr/issues/10)

### Partner site error pages

Specific HTTP status code 403, 404 and 500 error pages now exist for partner sites.

GitHub issue:
[31](https://github.com/akvo/akvo-rsr/issues/31)

### Partner site widget wording

The page for getting a PS Widget, displays incorrect information about how to widget will work. It says that the widget will redirect back to the Akvo.org page and it will redirect back to the original partner site page. The wording on this widget has been fixed.

GitHub issue:
[25](https://github.com/akvo/akvo-rsr/issues/25)

Bug fixes
----
### Partner list navigation
The navigation of multiple pages of partners in Akvo RSR was not working correctly. This has been fixed.

GitHub issue:
[26](https://github.com/akvo/akvo-rsr/issues/26)

### Sorting on continent/country in listing widget
Due to complexity in the way we are currently storing location data, continent and country sorting in listing widgets is broken. This sorting has been disabled until we change the way location data is handled in the system.

GitHub Issue:
[11](https://github.com/akvo/akvo-rsr/issues/11)

Akvo RSR ver 2.0.6 release notes
----
7 June 2012, (Code name: Guava) gvh

Overview
----
This release contains the Beta Version of our Multi-Lingual Interface for Partner Sites and also the first Partner Site Widget, with a Map. Additionally, we have also performed several important de-normalisation modifications to the system to improve performance throughout the site.

New features & changes
----
###Multi-lingual Partners Sites Beta
Partner Sites introduces beta support for different lanugages. The URLs now have a lanauge code prefix (en/es/fe/nl) which sets the user interface language. This means it is now possible to link to a specific lanauge. The language can be changed from a drop down menu at the top right of the site.

Pivotal Tracker Stories:
[29702725](https://www.pivotaltracker.com/story/show/29702725) and [29625905](https://www.pivotaltracker.com/story/show/29625905)

###Create Partner Site Map Widget
We have created a new Map Widget which is available via Projects visible in Partner Sites. This has been implemented using async map loading and an API.

Pivotal Tracker Story:
[23693093](https://www.pivotaltracker.com/story/show/23693093)

###De-normalise Financial Information for Projects and Organisations
Some de-normalisation of Database Information that is referenced within Akvo RSR has been performed to speed up the provision of web pages. As an example the loading time of Akvo.org homepage has been significantly reduced. To achieve this improvement, jonny-cache has been implemented.

Pivotal Tracker Story:
[27249075](https://www.pivotaltracker.com/story/show/27249075)

###Refactor the API for Financial Information
As part of the de-normalisation being done in the system, the API to transfer information internally has been refactored to allow Financial Information to be delivered.

Pivotal Tracker Story:
[27250173](https://www.pivotaltracker.com/story/show/27250173)

###Conversion of LICENSE file
The LICENSE File in Guthub has been converted to Markdown format, and the root docs have been updated.

Pivotal Tracker Story:
[30320839](https://www.pivotaltracker.com/story/show/30320839)

Bug Fixes
----
###Set Initial Partnership Inline to User's Organisation
When a user creates a new Project now, the Organisation they belong to is automatically added as one of the Partners for the Project.

Pivotal Tracker Story:
[25288719](https://www.pivotaltracker.com/story/show/25288719)

###Budget Items within RSR Admin Missing
A problem with Permissions caused certain Data Items not to appear in RSR Admin to Users and Administrators. This has now been resolved.

Pivotal Tracker Story:
[29704531](https://www.pivotaltracker.com/story/show/29704531)

###Ensure Deployment Directories have Applicable Web Group Permissions
The Deployment Process Home and other Relevant Deployment Directories are now created with Web Group File System Permissions and Access.

Pivotal Tracker Story:
[23664419](https://www.pivotaltracker.com/story/show/23664419)

###Resolve Translation Issues
A variety of issues, queries and feedback items have been resolved resulting from the previous Translation Implementation.

Pivotal Tracker Stories:
[29976705](https://www.pivotaltracker.com/story/show/29976705) and
[28720359](https://www.pivotaltracker.com/story/show/28720359)

###Donation Engine on Test Site not working
We have fixed a bug in the Test System caused the Donation Process to direct to the Live Donation Site.

Pivotal Tracker Stories:
[30559557](https://www.pivotaltracker.com/story/show/30559557)

Akvo RSR ver 2.0.5 release notes
----
15 May 2012, (Code name: Fennel) pb, ogl, ac

Overview
----
This release addresses a problem whereby certain project fields were not being constrained in length consistently. Django >= 1.4 is now a requirement of Akvo RSR and, as such, several parts of the system have been upgraded to support it.

New features & changes
----
### New translations
Initial preparation work has been done to support Dutch, French and Spanish localisations.

Pivotal Tracker stories:
[25221481](https://www.pivotaltracker.com/story/show/25221481),
[26502217](https://www.pivotaltracker.com/story/show/26502217) and
[26786625](https://www.pivotaltracker.com/story/show/26786625)

### Project goals improvements
In order to support custom goals within a project, a new Goal model has been created.

Pivotal Tracker story:
[27515615](https://www.pivotaltracker.com/story/show/27515615) and
[28809041](https://www.pivotaltracker.com/story/show/28809041)

### Project field constraints
Due to a problem whereby certain project fields were not being consistently constrained, several changes have taken place under the hood to limit these fields going forward whilst maintaining support for the old data.

More information about this problem can be found [here](http://www.akvo.org/blog/?p=5262).

Pivotal Tracker stories:
[25606657](https://www.pivotaltracker.com/story/show/25606657) and
[27251477](https://www.pivotaltracker.com/story/show/27251477)

### Project fields renamed
To improve consistency between the Project PDF form and the Project sections of the Django admin interface, certain Project fields were renamed.

Pivotal Tracker stories:
[27010245](https://www.pivotaltracker.com/story/show/27010245),
[27011303](https://www.pivotaltracker.com/story/show/27011303),
[29704721](https://www.pivotaltracker.com/story/show/29704721) and
[29907631](https://www.pivotaltracker.com/story/show/29907631)

### Project details
Improved the layout for project details summary.

Pivotal Tracker story:
[27008303](https://www.pivotaltracker.com/story/show/27008303)

### Partner site routing middleware improvements
It is now possible to configure in settings files which domain names the partner sites routing middleware will operate on. Previously this was hardcoded into the middleware. In addition to this, the routing middleware has been updated to work together with the Django Sites framework so as not to break third party applications which depend on the functionality of the Sites framework.

Pivotal Tracker stories:
[22953583](https://www.pivotaltracker.com/story/show/22953583) and
[27234363](https://www.pivotaltracker.com/story/show/27234363)

### Partner site UI improvements
Improved the Add Update and Get a Widget UI components.

Pivotal Tracker story:
[26903241](https://www.pivotaltracker.com/story/show/26903241)

### User permissions admin
Improved the Admin UI for managing user permissions and groups and updated permissions for use with Django 1.4.

Pivotal Tracker story:
[28126391](https://www.pivotaltracker.com/story/show/28126391)

### Project admin
Corrected project listing order subsequent to Django 1.4 upgrade.

Pivotal Tracker story:
[28107129](https://www.pivotaltracker.com/story/show/28107129)

### Project Page UI Changes
In addition to some of the field changes, there have been some important modiofications in the layout and design of the Project Page. Within the Summary area this includes restricting the amount of space available for the Summary and adding a View More button for the Project Indicators, allowing the viewer to choose if they want to see all of the Indicators. Further in the Project Page, a new Tab has been added called Goals, and moved some of the information within these tabs to be more evenly distributed. The tabs are set out in chronological order, so it reads more like a story from left to right with the past, present and future.

Fixes
----
### Project updates
The "Sign in to add update" textual hint now disappears as expected when a user is already signed in.

Pivotal Tracker story:
[26983111](https://www.pivotaltracker.com/story/show/26983111)

### RSR admin
Replaced project goals overview in project admin.  Corrected project listing order subsequent to Django 1.4 upgrade.

Pivotal Tracker stories:
[28105979](https://www.pivotaltracker.com/story/show/28105979),
[28107129](https://www.pivotaltracker.com/story/show/28107129),
[28110191](https://www.pivotaltracker.com/story/show/28110191) and
[28874085](https://www.pivotaltracker.com/story/show/28874085)

### Partner sites
Partner site project update edit form now retains previously entered data.  Budget line item text is now displayed as expected.
Fixed the sign-in process when partner sites are hosted on partner's own domain.

Pivotal Tracker stories:
[23990641](https://www.pivotaltracker.com/story/show/23990641),
[29684439](https://www.pivotaltracker.com/story/show/29684439) and
[29907575](https://www.pivotaltracker.com/story/show/29907575)

### Akvo blog posts
Corrected markup for blog posts so that they appear as expected on the Akvo home page.

Pivotal Tracker story:
[22517473](https://www.pivotaltracker.com/story/show/22517473)

Non-functional changes
----
### Upgrade to Django 1.4
The latest version of Django contains several backwards incompatible changes across the framework. Release 2.0.5 of Akvo RSR has been updated to support Django 1.4. In addition, some third-party Django apps also had to be patched or upgraded to support the upgrade to Django 1.4.

Pivotal Tracker stories:
[26809039](https://www.pivotaltracker.com/story/show/26809039),
[27784115](https://www.pivotaltracker.com/story/show/27784115),
[27833485](https://www.pivotaltracker.com/story/show/27833485),
[27835435](https://www.pivotaltracker.com/story/show/27835435),
[27893279](https://www.pivotaltracker.com/story/show/27893279) and
[28673101](https://www.pivotaltracker.com/story/show/28673101)

### Deployment automation
Improvements were made to the RSR deployment process so that RSR instances can now be deployed automatically for testing purposes.

Pivotal Tracker stories:
[21406319](https://www.pivotaltracker.com/story/show/21406319),
[23633289](https://www.pivotaltracker.com/story/show/23633289),
[26763721](https://www.pivotaltracker.com/story/show/26763721) and
[29670447](https://www.pivotaltracker.com/story/show/29670447)

Akvo RSR ver 2.0.4 release notes
----
27 March 2012, (Code name: Eggplant) ogl


Overview
----
This is primarily a maintenance release.

New features & changes
----
### Switched the 'Get a widget' button and 'Add update' link
[PT story 25207905](https://www.pivotaltracker.com/story/show/25207905) The 'Get a widget' button and 'Add update' link in the 'Tools for this page' section of a project page have been switched around since users would more frequently be viewing a project page to provide project updates rather than to get project widgets.

Fixes
----
### Corrected display of global organisation map
[PT story 26632783](https://www.pivotaltracker.com/story/show/26632783) The global organisation map now displays without errors.

### Corrected highlighted text colour for selected text on partner sites
[PT story 24968667](https://www.pivotaltracker.com/story/show/24968667) The highlighted text colour on partner sites is now blue, as is the convention for selected text, instead of pink.

### Corrected validation process when entering video project updates on partner sites
[PT story 24054429](https://www.pivotaltracker.com/story/show/24054429) The validation process now waits for the video URL to be entered before validating.

### Corrected styling on project update pages for parter sites
[22289553](https://www.pivotaltracker.com/story/show/22289553) Corrected colour differences of photo and video captions and credits on partner sites.



Akvo RSR ver 2.0.3 release notes
-------------------------------------------
22 February 2012, (Code name: Dewberry) bw


New features & changes
----------------
### Expanded and customizable budget line items
This release reworks how line items for project budgets are handled within RSR. Up to this point there have been 6 budget line items: building, employment, maintenance, management, training and other. Release 2.0.3 removes "other" and adds the fields other 1, other 2, other 3. Organisation administrators and project editors can enter custom labels for these line items in their budgets.

Additionally, Akvo's administrators now have the flexibility to expand the list of common budget items. The list of choices should be expanded cautiously as the commonly-used forms become obvious. Having a standard list helps users compare & understand financial plans across multiple projects and organisations.

### Size of photos and videos in updates.
The photos and embedded videos on an individual update page are now larger, making details easier to see.

### Custom landing page URLs redirected to appropriate partner sites.
Landing page functionality is deprecated in favor of partner sites.


Bug fixes
---------
### Enter/Return does not post form on Sign in page.
Certain browsers did not post the sign in form when Enter/Return key was hit; this is now fixed.

### Latest Updates missing on project comments page.
Fixed a bug where Latest Updates section did not appear on the project comments page.

### Funding amounts field appears for non-funding partners.
Fixed a bug in the changed partner types code whereby it was possible to set funding amounts for other partner types.

### Map display when there are no projects or none fitting selection criteria.
The main partner site page includes a map displaying all organisation projects. When there were not yet any projects or filtering returned no matching projects the map completely disappeared, leaving only a display glitch. This is now fixed.

### Partner site workflow issues when signing in to add an update.
Fixed page routing to match expectations.



Akvo RSR ver 2.0.2 release notes
-------------------------------------------
30 January 2012, (Code name: Carrot) bw

Overview
------------
The release adds the ability to sign in and add updates to Akvo RSR from a partner site. It also contains a reworking of the way in which organisations are internally linked to projects in RSR. We've also updated our version of JQuery.

New features & changes
----------------
### Partner site sign in and add updates capability.
Users with Akvo RSR accounts can now sign in to Akvo RSR on partner site pages. Signed-in users can add updates to projects on a partner site just as they do on the main Akvo site project pages. This includes adding text, a photo, or video URL to the update, and the ability to edit updates for a limited time after update creation.

### Rework of relationship between organisations and projects.
Organisations can be linked to projects making them project partners. There are 4 types of links, or partnership types: Field partner, Funding partner, Sponsor partner and Support partner. The current code proved to be inefficient and needed to be changed.

Users no longer need to enable a particular partnership type on the Organisation form. Instead partnership type is set directly on a project by choosing the organisation and then setting the type of partnership. It is possible for the same organisation to have multiple types of partnership on the same Project. Tip: In the organisation list on a project, press the first letter of an organisation's name to scroll the list forward.

There is a Funding amount field visible regardless of type of partner chosen. Only Funding partner amounts are recorded and used in RSR. In a future release the field will be hidden unless the partnership type is set to Funding.

### Updated JQuery to version 1.7.1.


Bug fixes
---------
### Cannot upload image file names same as thumbnails.
Fixes an issue loading image files with the same name format used by RSR thumbnails.

### Fixed home page WordPress issues.
The home page was only presenting blog posts in the partners category. Now it will display the last 2 posts from any category.

### Partner site breadcrumb, logo and courtesy back link.
Added code to handle the case when no return URL is specified for the partner site, nor has a URL been specified for the organisation. In this situation the logo and the breadcrumb text are no longer links and the organisation courtesy link is completely suppressed.

### Miscellaneous partner site ui and usability tweaks.
This includes adding the Powered by Akvo logo and centering the Donate button.

### Changed tax status page on donation pages and messages.
Fixes an issue whereby misleading information was given in donation templates and emails pertaining to the tax deductible status of certain types of donations in the United States of America.

### Remove PvW/DWS template files.
Removed old template files associated with the PvW/DWS project, which will be managed as its own branch from now.

---


Akvo RSR ver 2.0.1 release notes
-------------------------------------------
29 November 2011, (Code name: Elderberry) kad

Overview
------------
The release's biggest feature is extended RSS feeds. Besides that the images on the updates list page have been sized to match videos as on partners sites.

Several related bugs around the presentation of funding have been fixed.

New features
----------------

### RSS feed with images and media extensions
The RSS feed for project updates has been upgraded to include any images that are part of the update. The image is included in the <description> field as an <img> and will be shown as part of the update text in most feed readers.

Currently the Akvo RSS includes three kinds of feeds:

* **/rsr/rss/updates/NNN** where NNN is the ID of a Project.

  Returns all updates for that project. An RSS icon for this feed can be found on the main page of each project.

* **/rsr/rss/org-updates/NNN** where NNN is the ID of an Organisation

  Returns all updates for all projects that the organisation is a partner to. An RSS icon for this feed can be found on each organisation page.

* **/rsr/rss/all-updates/**

  Returns all project updates in RSR. An RSS icon for this feed can be found on the home page.

All feeds are in reverse chronological order.

All feeds are extended using the [Media RSS module defined by Yahoo](http://video.search.yahoo.com/mrss) for easy retrieval of the images available through the feeds.

The feed has also been extended to include the author of the project update.

### Increase size of images in updates list
Backport partner sites photo thumbnail size on /updates/ list page to akvo.org's /updates/ list page. The increase makes them the same size as video

### Renamed RELEASE_NOTES.txt to RELEASE_NOTES.md
To make Github understand and apply the correct format to the Markdown file it is renamed to .md.

Bug fixes
---------

### Removed self referencing "funding details" link
Removed self referencing "funding details" link in the funding box.

### Added funding details box to partner site's funding page
Funding details page were missing funding/status box.

### Link to funding details have disappeared from the funding box
Link to funding details have disappeared on Partner Sites.

---

Akvo RSR ver 2.0 release notes
-------------------------------------------
28 October 2011, (Code name: Garlic) tbp

Overview
------------
Akvo RSR 2.0 is a preview release that introduces a major new feature to Akvo RSR, multitenancy, which we call Partner sites. Partner sites allows an organisation which already has projects on the Akvo RSR system to display all of these projects on their own website. This will be done by useing the Akvo RSR tools on their own designated URL, with their own branding and styling. We believe that this will be the main way most people will think of Akvo RSR in the future.

Being a preview release means that all the features we are expecting on a Partner site in the future are not ready yet, there are some rough edges, but we consider the features that are available suitable enough to start experimenting with.

The Akvo RSR tools available on the aggregated site (Akvo.org) have not changed for this release, except for a minor bug fix.

New features
----------------
### Partner sites, multitenancy
The Partner sites features allow you to have your own projects on your own website with a separate URL, with your own branding and styling.

A Partner site will live under a separate domain. The default URL for a new Partner site for Akvo.org will be a subdomain under akvoapp.org, for example: [http://connect4change.akvoapp.org](http://connect4change.akvoapp.org). The partner site can also be setup to be displayed under another appropriate domain, for example: [http://projects.connect4change.nl](http://projects.connect4change.nl).

Your own Partner site can be configured and managed by a user with organisation administrator privileges (initial setup you need to request the Akvo.org team to do during the preview period).

### Notes about Akvo RSR Partner sites multitenancy
The Akvo RSR multitenancy implementation has a shared data space for the application. Information that is shared between partners is also shared between Partner sites as well as shown on the aggregation site (i.e. Akvo.org).

For example: the information about one a project is shared between all organisations that collaborate on that project. An update to a project will show up on all the various Partner sites which are showing that particular project. Likewise, if an organisation changes its logo on the organisation page the logo will also change on all Partner sites displaying this organisation, as well as on Akvo.org.

### New functionality
The following functions are new to Akvo RSR 2.0 preview of Partner sites and don’t exist on Akvo RSR on Akvo.org. Some of these functions may be added to the aggregated site (Akvo.org) later.

- A Partner site will live under a separate domain, distinct from the aggregate domain
- A Partner site can be displayed under a custom domain (CNAME)
- Filtering also reflects the projects marked on the map on the Partner site home page (i.e. filtering for Africa will only show projects in Africa on the map)
- Ability to style content with CSS on the Partner site
- Ability to add a picture and HTML content for the description of an organisation on the home page of their Partner site
- Filtering displays the number of projects displayed and what filter is applied
- Ability to add a custom back link to another website

### Limited functionality
The following features have not been completely implemented yet in Akvo RSR 2.0 preview of Partner sites, but will be updated at a later stage.

- Funding box on project page has limited layout
- Latest updates display on project page (banner is missing)
- Project partners listing
- Donations, you will be sent to the Akvo.org site to do a donation and not returned to the Partner site

### Excluded functionality
The following functions have not been implemented yet in Akvo RSR 2.0 preview of Partner sites, but will be implemented at a later stage, in some fashion.

- Widgets
- Comments
- Focus areas and categories
- RSS feeds
- Sign in, you can sign in on Akvo.org to administer your account and your projects
- Add update, you can still sign in on Akvo.org to make an update
- Partner listing showing a partners role in a project

### Akvo.org specifics for Partner sites
On Akvo.org you can request organisation administrator privileges by emailing partners@akvo.org, if your organisation is on a paid services plan.

Bug fixes
---------
The link to the latest blog news article was not shown on the home page.
[Lighthouse RSR ticket 247](https://akvo.lighthouseapp.com/projects/46515/tickets/247)

---

Akvo RSR ver 1.0.11 release notes
-------------------------------------------
17 October 2011, (Code name: Rhubarb) pb & bw

Overview
------------
The release fixes a bug in password reset, and expands existing functionality related to embedded video updates and editing updates. It adds the ability to use an existing project as the basis for a new project. Several internal changes to Akvo RSR have also been made, including use of ISO 3166 country codes in location fields, a different sorting method on listing pages, RSR settings file changes, and a move to using South for data migration.

New features
------------
### Save existing project as new project
In the admin you can now create a copy of an existing project. The "Save and add another" button is replaced by "Save as new". Use this button to create a new project with most of the same information as the current one. Location data, project image, updates, individual donations and comments are not copied. All benchmark values are set to 0.

### Improved project update form
When editing a project update, the update form now displays thumbnails of any video or photo included with the original update. The original video or photo can be replaced, or the video removed. The photo cannot (yet) be completely removed.

### Updates with video now thumbnails on Akvo home page and project page
Updates with embedded video now display thumbnails of the video on the project page.

Recently posted project updates with videos are now displayed on the home page. Previously only updates with photos were displayed. Updates containing both a photo and video will display the video thumbnail to represent the update.

### Refactor of country data
Refactoring of how we handle countries in the data model. We now use the ISO-3166-1 alpha-2 list of countries as the base for the country list. The only outward facing change is a slight modification in how the filter on the project listing page (/rsr/projects/all/) behaves. Selecting a continent no longer automatically restricts the countries displayed on the country pulldown.
Instead the relevant continent is always set when a country is selected in the filter.

### Rework RSR settings
Internal RSR settings have been updated to a more flexible arrangement. This also fixes issue with serving multiple versions of RSR with the same code base.

### Changed version of django-sorting library used by RSR.
Changing the library also uncovered several SQL issues, now fixed.

Bug fixes
---------
### Server error bug when generating password reset email message has been fixed.
[Lighthouse RSR ticket 227](https://akvo.lighthouseapp.com/projects/46515-akvo-rsr/tickets/227-error-with-password-reset)

### Fix to text filtering of user profiles in RSR Admin.
[Lighthouse RSR ticket 169](https://akvo.lighthouseapp.com/projects/46515-akvo-rsr/tickets/169-search-user-profile-listfielderror)


---


Akvo RSR ver 1.0.10 release notes
-------------------------------------------
17 October 2011 / Deployed 4 July 2011, (Code name: Granite) pb

New features
------------

This release contains no new features.

Bug fixes
---------

### Broken link in project listing widget

A broken link reference in the project listing widget template was causing 500 errors on partner websites. This has been fixed.

### Benchmarks list rendering issue

Fixed broken benchmarks list which caused the project page to render incorrectly in some older browsers.

### Cron script to handle stale invoices

After the addition of the SMS gateway application, the cron script to detect stale invoices was no longer able to run. The script now functions as expected.


Akvo RSR ver 1.0.9 release notes
-------------------------------------------
28 June 2011, (Code name: Quadrant) pb

New features
------------

### Ability to edit project updates

The release adds the ability to edit project updates. Up until now, once a project update had been created it could no longer be edited in any way. Now the user who created a project update may also now edit it for up to 30 minutes after its original creation time.

### Improved handling of embedded videos

Several improvemenets have been made to video embedding in project updates. Short-form YouTube URLs are now supported so a user can now enter both youtube.com and youtu.be URLs.

Shortly after the release of RSR 1.0.8, Blip.TV made several backwards-incompatible changes to their API meaning that supporting blip.tv video URLs was no longer possible. This situation has now been rectified and RSR 1.0.9 handles both old-style and new-style blip.tv video URLs. Users should, however, only use the new-style URLs in project updates.

In addition to displaying full embedded Flash videos, this release also handles displaying static thumbnail images of video objects. This results in faster page loads for pages displaying multiple videos.

### Templates updates to new Django syntax

To ensure compatibility with future releases of Django, RSR's templates now use the new-style template syntax released with version 1.3 of Django. This change is, however, not visible to users of the site.

More information about the new template syntax can be found [here](https://docs.djangoproject.com/en/dev/releases/1.3/#changes-to-url-and-ssi).

---

Akvo RSR ver 1.0.8 release notes
-------------------------------------------
29 April 2011, (Code name: Blockbuster) bw

Overview
------------
The release adds the ability to embed video in updates made via the web. The first generation SMS code is also included, with access restricted to certain users for testing purposes.

New features
------------

### Ability to embed videos in updates

When creating an update one may now embed a video as well as add text and a photo. URLs from Youtube, Blip and Vimeo are currently accepted.

### SMS update, alpha for testing ONLY
First steps toward the ability for users to send text updates from a particular mobile phone to a particular project. There are no user-visible changes at this point in time.

---

Akvo RSR ver 1.0.7 release notes
-------------------------------------------
5 April 2011, (Code name: Lustre) bw

** INTERNAL RELEASE ONLY **

Overview
------------
The Dutch Water Sector site and Akvo RSR code have been updated to run on the same codebase. Different configurations and views allow the sites to operate in their own incarnations when deployed. Akvo-specific changes are listed first, and DWS changes follow below.

Akvo changes and fixes
---------
### Help text and links on donations pages have been fixed, expanded and/or clarified.
This includes tagging optional fields (campaign code), specifying format for amounts, correcting links to privacy and donation policy/ Terms and Conditions information, and adding a link to information for institutional donors.
[Lighthouse RSR ticket 94](https://akvo.lighthouseapp.com/projects/46515/tickets/94)
[Lighthouse RSR ticket 135](https://akvo.lighthouseapp.com/projects/46515/tickets/135)
[Lighthouse RSR ticket 189](https://akvo.lighthouseapp.com/projects/46515/tickets/189)
[Lighthouse RSR ticket 192](https://akvo.lighthouseapp.com/projects/46515/tickets/192)

### Presentation of the option to donate anonymously has been changed.
For usability reasons this was changed to present a pre-checked box "List name next to donation."
[Lighthouse RSR ticket 8](https://akvo.lighthouseapp.com/projects/46515/tickets/8)

### Error messages for mismatching email addresses on donation pages were incorrect.
When the email address and confirmation email address text did not match, the error message returned was correct, but labelled as being for the Amount field instead of the email address field.

### Presentation of information in balloon pins of global organisation map changed to match that of global project map.
Clicking the pinned location balloons on the organisation map presented individual organisation info under a large red "Organisation" header. The display now matches that of the projects' pins on global project map.

### Global map on home page is dislocated under Firefox 4.
The global map was not being rendered in the proper place under Firefox 4.
[Lighthouse website ticket 15](https://akvo.lighthouseapp.com/projects/49157/tickets/15)

DWS changes and fixes
---------
### Organisation and project search capability.
This has now been added on the organisation and project list pages respectively.

### "Deliverables" heading now appears when there is a list of deliverables.
When a project does not have any deliverables, the header does not appear.

### Project images on the main project page should display a caption.
If a caption has been written for the image, it will now be displayed.

### The lead partner on a project needs to be more obvious on the project page.
A separate box now distinguishes lead partner(s) from other partners on a project.

### If there are no updates, then Goals tab should be selected on the main project page.
When updates have been made to a project, the project page displays the Updates tab; if there are no updates yet, the Goals tab is displayed instead.

### Original deprecated locations fields in Admin have been removed.
These out-of-date fields were still showing up in Admin, though public site uses new Locations model fields. To avoid confusion for users entering project data, they have been removed.

### Template and media file names have now been renamed from "pvw_take2" to "dws."
References to filenames have been updated to new name as well.

### Toolbar display issues in Internet Explorer.
The orange Holland logo to the left of the Dutch Water Sector name is in certain circumstances mis-positioned. It has been verified to appear correctly in both Internet Explorer 7 and 8 in a Windows 7 environment, and Internet Explorer 6 and 7 in an XP environment.

### Global map code now works as in Akvo RSR.
Maps have all the same capabilities as they do in Akvo RSR.

### The embedded video on the DWS home page was displaying as a broken link img in IE.
IE was not playing object elements; the video was switched to use Youtube-style iframes.

### "Akvo" appearing in multiple places on the registration/sign up pages.
These have been removed.

### An iframe on the project page was causing trouble for users.
The iframe was removed from the project page.

### Get random widget was broken, and has now been fixed.
The organisation selection menu was greyed out at all times for the random project widget.

### All update photos were appearing at the top of the update, regardless of setting.
Update photos set to display at the end of the update are now behaving properly.

---

Akvo RSR ver 1.0.6 release notes
-------------------------------------------
15 Mar 2011, (Code name: Sextant) kad

New Features
------------
### A new setting to the map widget at the get a widget page
At the get a widget page one can now set the map widget to either static or dynamic. In dynamic mode zoom and bubble interaction is enabled.

Bug Fixes
---------
### Fixed broken arrows in Internet Explorer 7 on XP
In Internet Explorer 7 on Windows XP arrows used in the interface was not rendered correctly. Those arrows have now been changed to an unicode character that is supported in a clean Windows XP installation.
[Lighthouse ticket 170](https://akvo.lighthouseapp.com/projects/46515/tickets/170)

### Updated automatic Thank you email
When someone donated to a project that belonged to the Focus Area Health they received a Thank you email that is dedicated to Water & Sanitation. This is now changed to a more appropriate wording.
[Lighthouse ticket 144](https://akvo.lighthouseapp.com/projects/46515/tickets/144)

### Photos do not appear at first project page view in IE7
In Internet Explorer 7 the mini gallery of project photos on the project page would not be displayed at first request, only after a refresh. Project photos does now appear at first request.
[Lighthouse ticket 180](https://akvo.lighthouseapp.com/projects/46515/tickets/180)

---

Akvo RSR ver 1.0.5 release notes
------------------------------
9 Mar 2011, (Code name: Encore) tbp

New features
------------

### Landing page for Rabobank

A landing page for the Rabobank microfinance projects. (This is most likely the last landing page we do. We are going to focus on the generic solution to this via a new feature codenamed Subsites.)

### Other changes

Modified the formatting of the release notes for release 1.0.1-1.0.4 to be more like the previous notes.

---

Akvo RSR ver 1.0.4 release notes
------------------------------
28 Feb 2011, (Code name: Crossbow) pb

Akvo RSR v 1.0.4 also contains all of the features and bug fixes from v 1.0.3. See below for more details.

New Features
------------

### Update to Django 1.2.5

More information on the [Django 1.2.5 release](http://docs.djangoproject.com/en/dev/releases/1.2.5/).

### New map widget

A new widget showing a Google Map of all of an organisation's projects is now available. You must be logged into a Plus Account in order to use this feature.

### Admin location changes

City, State and Country fields in a project or organisation's Location data are now optional. Only Latitude and Longitude coordinates are required.

### "Campaign code"

An optional "Campaign code" field has been added to the donation system.

### Donation product description changed

The product description has been modified to show an identical string for both PayPal and iDEAL donations. The string is "Akvo-<Project ID>-<Project Name>".  Note that the Mollie/iDEAL API will always truncate this string at 29 characters. PayPal is unaffected by this limitation.

### Presentation of project and organisation information in large maps

The information bubbles which appear when you click on a location marker in the global project and organisation maps have been updated to display the information in a much smaller space. This reduces screen clutter.

Bug fixes
---------

### Javascript bug in IE7

A bug in the image gallery code on the project main page resulted in a rendering issue on Internet Explorer 7. This was resolved by the addition of custom CSS rules for IE7.

---

Akvo RSR ver 1.0.3 release notes
------------------------------
9 Feb 2011, (Code name: Primrose) bw

** INTERNAL RELEASE ONLY **

Akvo RSR v 1.0.3 was not released publicly. The following bugs were discovered which prevented release:

- A regression in the maps-handling code meant that location markers were no longer being displayed.
- The RSR database was not being initialised properly because of an incorrectly configured setting.

These have been addressed in release 1.0.4. See above.

New Features
------------
### Admin: Latest update column
A "Latest update" column has added to the Administrator Project Listing page. This column shows:

- The date of the most recent update as a link back to that update on the public project page.
- The email address of the user who made the update, as a send-to link.
- A list of support and funding partners for the project, by partnership type, with names as links to the organisation's public page.

### Admin: By status filter
A "By status" filter has been added to the Administrator Project listing page. The filter allows administrators to view only projects with particular status settings, for example, only projects with the status "Needs funding."

Bug fixes
---------
### Duplicate search results
Certain searches on the organisation listing page returned duplicate entries. This has been fixed.
[Lighthouse ticket](https://akvo.lighthouseapp.com/projects/46515/tickets/139)

---

Akvo RSR ver 1.0.2 release notes
-----------------------------
18 Jan 2011 (Code name: Hailstorm) ogl

Bug fixes
---------
### Widget location bug
Widgets now display all location information as expected (esp. continent and country details).
[Lighthouse ticket](https://akvo.lighthouseapp.com/projects/46515/tickets/146)

### Home page IE6 bug
The Akvo home page will now display as expected in Internet Explorer 6.
[Lighthouse ticket](https://akvo.lighthouseapp.com/projects/46515/tickets/129)

### Get a Widget page display bug
The Get-a-Widget page now has the Projects menu tab selected.
[Lighthouse ticket](https://akvo.lighthouseapp.com/projects/46515/tickets/128)

### All updates page bug
The All Updates page for a particular project now displays titles for all updates in the list even if some information was missing when a particular update was submitted.
[Lighthouse ticket](http://akvo.lighthouseapp.com/projects/46515/tickets/142)

---

Akvo RSR ver 1.0.1 release notes
-------------------------------------------
14 Jan 2011, (Code name: Indigo) bw
Note: The original 16 Dec 2010 release notes have been edited to better document changes made in 1.0.1.

New Features
------------
### Markdown is now available for adding formatting to text used in the MiniCMS text boxes and Focus area description fields.

Bug Fixes
---------
### People served calculation
The "People Served" calculation on the Akvo home page now counts only the largest "people affected" benchmark from any category for each project. For any given project, it is likely that the people affected in different categories have some overlap, so calculations for numbers affected should take only the larger number. Currently people affected numbers come only from the Water and Sanitation categories.

### MiniCMS
The following fixes have been made to the MiniCMS.

- Map box has been removed.
- Lower section height renamed to Focus areas accordion height.
- Help text has been added regarding HTML tags that can be used in MiniCMS fields.

Other Changes
-------------
### Load time of organisation listing page decreased.
The data calculations for the columns Requested and Still needed were having a severe impact on its load time, so have been removed. The page loads much faster now.

### Removed legacy data fields for Location, Category and Benchmark.
Content of the previous data fields were imported into new models in the 1.0.0 release; the old fields have now been removed.

### MiniCMS
The following improvements have been made to the MiniCMS.
- Name field for instances of the MiniCMS has been added.

---

Akvo RSR ver 1.0.0 release notes
-------------------------------------------
4 Nov 2010, (Code name: One Oh) tbp

This is the first major release of Akvo RSR since we publicly launched 0.9 on the 8th January 2009. This release is an overhaul of several parts of the system.

Overview
------------
We have created a completely new design for Akvo RSR which is visually more attractive and a much better design, and we think it is easier to use and understand. This means we have created a full new set of templates for Akvo RSR. As usual, we have integrated the new template system with Mediawiki, Wordpress and Drupal.

We have added the ability to add new types of projects to the system. Previously you could only add water and sanitation projects. Now we have a dynamic system where projects belong to something called focus areas, and they are associated with new categories and measure new benchmarks, all which are created dynamically from the administration function. For Akvo.org, Focus areas describe areas in which development aid tries to improve the world around us; Categories describe the type of improvements to be made and Benchmarks indicate the manner in which progress will be measured.

There is a new nearly completely data and forms driven home page for the system, which means that you don’t have to modify the home page template to add new content.

We made a mapping system integration for projects and organisations, where the first version uses Google Maps.

New features
------------

### New design and templates
The new Akvo RSR design touches every page, except for the administration pages. Here is an overview of some of the changes this includes:

- the template system is more modular, and easier to modify and extend
- HTML “snippets” caching is used extensively in the new templates
- breadcrumb trails are available for each page
- new CSS infrastructure
- a mini-sitemap is in the footer of each page

### Project pages

Project pages have been re-designed to present a better overview of the project. New features include:

- picture gallery of project and update pictures
- interactive map and latitude/longitude coordinate display
- page view counter
- new Latest update display

### Update pages

Updates now appear both all together on a listing page and each on their own individual pages, much like a tweet in Twitter has its own unique page. This gives each Update a unique URL.

### Organisation pages

Organisation pages have been improved with the following new features:

- link to a searchable project list displaying all projects related to an organisation
- interactive map of organisation’s location

### Data and forms driven home page

In an Akvo RSR system we expect RSR to drive the home page of the site. There may be a touch of megalomania in this, but it has made it significantly easier to integrate the key features of Akvo RSR to the front page. We have been dabbling with the idea of letting another CMS drive the front page, but we are not there yet. So as a compromise we have created a feature called MiniCMS, which drives some of the content on the front page, more about that below.

The areas which are not powered by MiniCMS are pulling content from Akvo RSR or Wordpress. These are:

- Most recent project updates: shows the latest project updates, with picture
- Right now in Akvo.org...: shows stats from the projects in the Akvo RSR system
- the global Google Map, showing project locations from data in Akvo RSR.
- Project focus areas: takes Focus area content from Akvo RSR
- Recent blog posts: displays the last two blog posts from Wordpress
- Latest news: shows content from Wordpress marked with the category News

The Right now in Akvo.org... data is self-explanatory, except perhaps for People served. This is the number of people who benefit from projects in Akvo RSR (people getting water and/or sanitation for example), and includes “People affected.” If a project has different numbers for water and sanitation benchmarks, the higher number is used (not everyone gets all services, but all get at least one). People served will also pick up the new Benchmarks data from the new Focus areas.

With the multiple database support which was introduced in Django 1.2 we can now fetch the blog post data for the homepage directly from the Wordpress database, improving the performance of the home page.

### Home page CMS, or MiniCMS.

The MiniCMS allows you to populate the “Feature box” with a picture and HTML. It has some features like scrims and layout tools specifically for the box. The “Top right box” also takes HTML.

The “Lower section height” controls the height of the Focus area accordion; how high it should be depends on how many Focus areas there are.

The “Map box text” is already deprecated and will be removed in a later release.

We are considering whether to add capabilities to the MiniCMS or whether to integrate with a separate CMS like Django CMS, but the jury is out on that at the moment.

### Maps

We have created an integration with a map system, at the moment using Google Maps. There are two global maps, one showing all projects and the other all organisations in Akvo RSR. There are also location maps for each organisation page and each project page. We are expect to do a lot more with maps in the future.

We have created new location models for this, which over time will take over from the old address data fields. We anticipate doing this in the next couple of releases. We did want this to be a two-step process to speed up implementation, allowing us to reschedule some tricky testing that otherwise would need to be done.

### Classification system and benchmarks

Akvo RSR has been expanded to work with projects beyond the water and sanitation sector it was originally designed to serve. That gave us an opportunity to change the way you look for projects in the system. First we created a flexible classification system for projects, and then we started creating ways of searching for projects based on that classification.

The classification system has three interlocking parts.

- Focus areas
- Categories
- Benchmarks

Each project belongs to something called a Focus area, which could be Water and sanitation, or Economic Development, or Healthcare, for example. Each Focus area can be associated with one or more Categories, such as Water, Training or Maintenance. Each Category has Benchmarks (aka Key Performance Indicators) associated with it , such as Number of people trained, Water systems installed or Hospitals built.

Focus areas, Categories and Benchmarks can all be created in the administration user interface in Akvo RSR by a Superuser administrator, thereby enabling us to add any type of project to the system without having to do any customisation.

For a detailed technical description of the new [classification syste](http://www.akvo.org/labs/index.php?title=Akvo_RSR_project_classification_system).

### Filters and sorting for listing pages

Project and organisation listings now have filters which can be used to search projects or organisations.

- [Listing of all projects](http://www.akvo.org/rsr/projects/all/)
- [Listing of all organisations](http://www.akvo.org/rsr/organisations/all/)

The projects listing can filter on continent, country and organisation, through pull-down menus. You can also search for keywords in the project title and subtitle.

The organisation listing can be searched for short name, long name, or keywords in either.

Both lists allow sorting on a number of columns as well. The fields which can be sorted have a link on the column name; when sorted this way the project listing displays the direction of the sort.

### Page view counter

A number of pages now have page view counters implemented. The counters were introduced in 0.9.18, but haven’t been displayed until now. The counters record how many visits have been made to a particular project. A display of the project page, funding details page or widget counts as a view of the project. Individual Update pages also have a view counter and are counted separately.

### Widgets available for all

All widgets except for the Project list widget can now be accessed by any user. The Project list widget requires you have a Plus account. The three new widgets accessible for any users are:

- Project widget with updates (202 pixels wide by 900 pixels high)
- Project with Donation Link (202 pixels wide by 570 pixels high)
- Small project (170 pixels wide by 312 pixels high)

### Akvo at a glance

The Akvo at a glance data, which was shown previously on the home page, has been replaced by the Right now in Akvo.org... . The Akvo at a glance data has been [moved to this place](http://www.akvo.org/rsr/data/overview) This is a temporary holding page for this information and we will be extending the data view pages in the future.

Minor features
-------------------

### Add project ID to Project __unicode__ method.

The __unicode__ method for Project instances should show the Project's ID as well as its name so that individual projects can be easily identified from other objects' admin pages.
[Pivotal story.](https://www.pivotaltracker.com/story/show/5632494)

Bug fixes
------------

### When you sign out of Akvo RSR in Safari you still look like you are signed in
Fixed. [Lighthouse ticket 12](https://akvo.lighthouseapp.com/projects/46515-akvo-rsr/tickets/12)

### Completed projects do not show on the organisation page in Akvo RSR
Fixed with a new project listing for organisations. [Lighthouse ticket 11](https://akvo.lighthouseapp.com/projects/46515-akvo-rsr/tickets/11)

### Cancelled project widgets have text "Funding" at bottom.
Widgets for Cancelled projects have gray text "Funding" at bottom below separator where donation box was. This doesn't really seem to serve a purpose; think we can get rid of it entirely. Fixed. [Pivotal story.](https://www.pivotaltracker.com/story/show/5425890)

### Widgets for projects w/ status Archived should probably not show donation box
Donation boxes show up on these widgets, probably don't want donations coming in to them. Cancelled project widgets also need examining.
Fixed. [Lighthouse ticket 74](https://akvo.lighthouseapp.com/projects/46515-akvo-rsr/tickets/74)

### Widget machinery pgs for Cancelled projects projects
Go to Cancelled project page, click Get a widget (not signed in, FWIW). Some of the widgets on machinery page display Donate box, some do not; none should display it, as those widgets do not either.
Fixed. [Pivotal story.](https://www.pivotaltracker.com/story/show/5426105)

### Using back button when selecting widget gives 500 error
Fixed. [Lighthouse ticket 76](https://akvo.lighthouseapp.com/projects/46515/tickets/76)

Known issues
------------------
As this is a major new release we have a number of known issues, and we’ll be working on them soon. We released when we didn’t have any more major known bugs, but there are always improvements that can be made. Some of our planned improvements are listed below. You can enter your own suggestions by starting a discussion at: [http://help.akvo.org/](http://help.akvo.org)

### MiniCMS
The new home page MiniCMS tool will have the following improvements:

- Map box text isn’t used and will be removed
- Lower section height renamed to Focus areas accordion height
- Name field for instances in the MiniCMS (currently no way to name, although you can have more than one)
- Help text is incomplete

### Maps

We are migrating the location data from the old location models to the new location models in a two-step process. This means old location data models and fields will remain in the Akvo RSR admin pages until we have finished the transition.

We want to create an easy to use longitude/latitude selector for the location. For now you have to enter the decimal longitude and latitude.

### Organisation page

People who get, box is only showing water and sanitation Benchmarks. This needs to be extended to show generic benchmarks.

### Admin page for organisation

We have duplicate of fields for organisation location as we are moving from the old text fields to the new location model. The old fields will be deprecated (removed) when we are happy all data has migrated and that we have removed all references to the old fields in the templates.

### Admin page for project

We have duplication of fields for Benchmarks, Categories and project location, as we are moving from the old fields to new models. The old fields will be deprecated (removed) when we are happy all data has migrated and that we have removed references to the old models in the templates.

### Old templates

We are still in a process of removing old templates from the system. A lot has changed and there are a lot of old files which will be removed in a forthcoming release.

### Wordpress posts on the home page

There are some issues with certain characters in blog posts on the home page. The character set conversions do not happen as they should. We dug quite deep into this but we have to come back to it later.

---

Akvo RSR v 0.9.19 release notes
-------------------------------------------
4 Oct 2010, (Code name: Magic) bethw

This release adds a new project status to Akvo RSR, fixes a bug in the donations process and includes a point release update of the Django framework.

New features
------------

### Project Status
A new project status has been added, Archived. Projects set to Archived will no longer appear in Akvo at a Glance figures, project lists or organisation pages. Donations boxes still appear on widgets; this is Lighthouse ticket #74.

### Django 1.2.3
Akvo RSR now runs on Django version 1.2.3. The security fix in 1.2.2 caused some problems with which have been remedied in this release. Additionally, to run Akvo RSR, you will want get zzgvh patch here:

http://github.com/zzgvh/django/tree/1.2.1_patched

which fixes Django ticket 10046. http://code.djangoproject.com/ticket/10046

Bug fixes
------------

### Donation emails not being sent.
A code regression prevented donations from proceeding to Complete status. As a result, confirmation emails and funding totals in the Akvo at a Glance portlets were not appropriately updated. This has now been fixed.

---

Akvo RSR v 0.9.18 release notes
-------------------------------------------
6 Aug 2010, (Code name: Supercharge) gvh

This release introduces page counters in Akvo RSR. We are also updating the version of Django that Akvo RSR runs on to 1.2.

New features
------------

### Page counters
In this first iteration page counters are created for projects, project updates and widgets showing one project. The counters record how many visits to a particular project have been made. However we are still only gathering the page count data for these objects, it is not shown in the interface. This will be added in a later release.

### Django 1.2
Akvo RSR now runs on Django version 1.2. The new version of Django required changes to forms handling. The changes should be backwards compatible however and we have not introduced any new features requiring 1.2 yet.

### Pip requirements
We use pip whenever possible for installing python libaries. We have added scripts/deployment/pip-requirements.txt describing all python components needed to run Akvo RSR. We use this together with virtualenv to set up our environment. While not technically necessary to run Akvo RSR it is warmly recommended.
Note: On Ubuntu you may need developer versions of certain python bindings: we had to

sudo aptitude install libxml2-dev libxslt-dev libmysqlclient-dev

to get lxml and MySQL-python to install. Similar upgrades may be needed on other *nixes.


---

Akvo RSR v 0.9.17 release notes
-------------------------------------------
11 May 2010, (Code name: Bolero) bw

This release implements a new feature on the Akvo home page whereby selected updates appear as Staff picks. Ongoing work with Walking for Water is also now highlighted on the home page.

New features
------------

### New Staff picks-featured updates on the Akvo home page
The home page now displays 3 of the most recent updates with images. These updates are selected from a pool of updates Akvo has chosen to feature.

### Walking for Water box now on home page.
Links in this box now provide entry to latest blog entries and projects connected to Walking for Water.

Bug fixes
------------

### Text overflow in widgets under certain types of browsers.
Bugs relating to certain layout issues for widgets in Opera and similar browser have been fixed.

### Internet Explorer problems on RSR pages
These problems were traced back to the use of Javascript to open the Help & Support link.

### Reformatting layout on pages with donor names to accommodate longer names.
Long names were breaking oddly. This fix attemptes to address that issue.

---

Akvo RSR v 0.9.16 release notes
------------------------------
13 April 2010, (Code name: Performance) tbp
This is primarily an initial release of page fragment caching and an Akvo RSR API beta test.

We also implemented caching for the Akvo blog. While not directly affecting Akvo RSR, this does significantly improve performance of the Akvo home page, which fetches RSS feeds from the Akvo blog.

New features
------------

### Caching

Caching for page fragments has been implemented in this release. Whole pages cannot be cached, as that type of implementation conflicts with the i18n language machinery in Django: essentially every user would run a separate customised session, and no user would encounter the same cache information as another. We have only implemented caching for certain heavy or higher traffic pages, such as project listings. The cache timeout is 5 minutes: if the last request for a page is more than 5 minutes ago then your request will regenerate it.

A more detailed discussion about the cache implementation can be found here: http://akvo.org/labs/index.php/Caching_in_RSR

### Akvo RSR API - beta test

A beta test of the Akvo RSR API has been released. The API can publish information about projects and updates using either XML or JSON.
Basic information about how the API works can be found in the Akvo Labs wiki. http://www.akvo.org/labs/index.php/Akvo_RSR_API

Before writing applications using the Akvo RSR API, please read the Code of Conduct. http://www.akvo.org/web/akvo-rsr-api-code-of-conduct

### Individual donor list

Individual donors using PayPal or IDEAL to donate money to a project in Akvo RSR are now listed with the amount they donated. If the donor elected to remain anonymous, the donation will be listed as such. An example can be seen here: http://www.akvo.org/rsr/project/64/funding/

### Help and Support widget link

A link to the new Akvo help and support system has been placed on the home page and on all Akvo RSR pages. The link brings up a widget, at the top of the page, with a search tool and discussion starter. The help and support system can be found here: http://help.akvo.org/

Bug fixes
------------

### Comments broken

The way we handle URLs for Post forms changed. This meant the old URL for a comment ending "comment" didn't handle the new URL ending "comments/" properly. Fixed through the use of URL tags.

### Internet Explorer and IDEAL

Some Internet Explorer users had the Donate button greyed out (inaccessible) due to incorrect loading order of the Javascript guaring against duplicate donations. We disabled the Javascript, as we have protection against double donations through the "stale invoice" feature.

### Project comments broken
Project comments couldn't be made. The form's action URL has become invalid after a change in urls.py.

---

Akvo RSR v 0.9.15 release notes
-------------------------------------------
5 March 2010, (Code name: Avonmouth) tbp

Adding one more custom sponsor portal page. The first one was introduced in 0.9.12, this one is for Walking for Water.

New features
------------

### New custom sponsor portal page
Sponsor portal page, a page which is different from the organisation page, but has branding and a project list related to the sponsor

The new sponsor functionality is possible to enable or disable in the settings.py file, as well as identifying with organisation number is the sponsor partner which the features will be linked to. This is still considered experimental and we want to generalise this feature so you can set up these type of portals from the admin user interface.
http://www.pivotaltracker.com/story/show/2396373

### README.md
Added a README.md file which displays nicely on the project page on Github.

---

Akvo RSR v 0.9.14 release notes
-------------------------------------------
29 January 2010, (Code name: Firebrand) pb

This release introduces support for donations via the iDEAL payment system for users in the Netherlands as well as a number of architectural changes.

New features
------------

### iDEAL payment system
The donation subsystem has been extended to support donations via the Dutch iDEAL online payment system. Akvo RSR provides this functionality by interfacing with the APIs provided by [Mollie.nl](http://www.mollie.nl/).

### Code namespace changes
Providing an additional payment system resulted in a fair number of architectural changes behind the scenes.

### Move to virtual Python environment
Akvo RSR is now installed into and run from a Python virtual environment (or "virtualenv") separate from the system Python installation. This is achieved using the tools [pip](http://pypi.python.org/pypi/pip/) and [virtualenv](http://pypi.python.org/pypi/virtualenv/). The advantages of this pip/virtualenv setup are increased deployment flexibility and standardisation of software requirements for each release.

### "All updates" RSS Feed
An RSS feed for updates from all Akvo projects has been set up at http://www.akvo.org/rsr/rss/all-updates. Further RSS features are in the works.

### Image thumbnails refactor.
Further refinements have been made to the way RSR handles the various image types (project, update, organisation logos, maps), creating appropriately-sized thumbnails, and cases where images do not exist.

### HTTP Referrer
Support for capturing HTTP referrer information has been added to parts of RSR for use in future planned RSR reporting tools.

### Admin help text
Further improvements to help text in the RSR Administration tools for organisations.

---

Akvo RSR v 0.9.13 release notes
------------------------------
2 November 2009, (Code name: Anakim) kad

This is primarily a bug fix release, and some minor new features.

New features
------------

### Partners entry on sitewide toolbar
Added a "Partners" entry to the toolbar (site wide). Linked the "Partners" entry to
/web/partners
http://www.pivotaltracker.com/story/show/1321046

### The top akvo logo is a link to the front page
it now links to the front page from all subsystems.
http://www.pivotaltracker.com/story/show/1289374

### Replaced the main Akvo logo
The logo now have the new tagline "See it happen"
http://www.pivotaltracker.com/story/show/1543983

### Changed the page title on the front page to "Akvo.org - See it happen"
Updated with our new tagline.
http://www.pivotaltracker.com/story/show/1579950

### Add Management costs to Funding budget item
Added 'Management cost' to the Budget item ITEM_CHOICES tuple.
http://www.pivotaltracker.com/story/show/1407959

### The version of Django that is running is visible in the source
One can now in the front page source see which version of Django that is runnig. e.g. "«!--
Akvo RSR runs on Django, version: Django/1.1.1 (http://www.djangoproject.com) --»".
http://www.pivotaltracker.com/story/show/1464719

### Humanised funding boxes.
Currently only the funding aggregates are humanised. This needs to be extended across the
system to all areas where currency amounts are displayed.
http://www.pivotaltracker.com/story/show/1469524

### Organisation project count needed cancelled projects
In the organisation activities the projects count does now have a line for cancelled
projects making for an non incorrect sum if the org is associated with a cancelled project.
http://www.pivotaltracker.com/story/show/817414

### Organisation listing widget for internal use
Created an "Organisation listing" widget for internal use only. This widget is used on the
Partners page in Drupal.
http://www.pivotaltracker.com/story/show/1321040

### Moved the page tools up on the partner pages
To make the get a widget link more apparent, we moved the page tools section up.
http://www.pivotaltracker.com/story/show/1543990

### Script cleaning out old images
The script removes old images from Organisation, Project and ProjectUpdate and renames any
that haven't been renamed properly. (See also bug
http://www.pivotaltracker.com/story/show/1510571)
http://www.pivotaltracker.com/story/show/1510576

### void_invoice() view function needs conditional redirect.
The void_invoice() view function now have the keyword redirect=False set in its signature
which is then used to determine where it will redirect to.
http://www.pivotaltracker.com/story/show/1458419

### Hide "Action" menu in user list for Organisation admins
As they couldn't delete users anyway.
http://www.pivotaltracker.com/story/show/616357

### User attribute on UserProfile is now a OneToOneField.
Changed the relationship between the UserProfile and User models. (No visible change)
http://www.pivotaltracker.com/story/show/1480363


Bug fixes
------------
### Donation page displayed error message while loading
Switched from using JavaScript's hide function to use the "noscript" tag for warning about
no javascript.
http://www.pivotaltracker.com/story/show/1448535

### Removed debug info when in production mode.
The debug info about context and sql queries was showned at the bottom of the source in all
RSR pages. This should only be visible when settings.DEBUG == True.
http://www.pivotaltracker.com/story/show/1468582

### Own org could be deleted from project
A non-super-user could sneak past the checks that their own org is among the partners when
saving a project. This is accomplished by checking the delete check-box for the own org in
the partner inline form.
http://www.pivotaltracker.com/story/show/1424820

### Uploaded images didn't get renamed
When uploading an image to an existing project or organisation the renaming of the image
didn't work. This was because of a change in how sorl.thumbnail handles images.
http://www.pivotaltracker.com/story/show/1510571

### Prevented display of funding amounts less than 0 in templates.
Over-funded projects could result in the round filter displaying very confusing amounts such
as "€-0".
http://www.pivotaltracker.com/story/show/1493650

### Pledged sum in Org activities wrong with certain data
The calculation for how much a certain organisation has pledged totally was wrong when there
are mutliple projects to which the same amount has been pledged.
http://www.pivotaltracker.com/story/show/1460695

### Saving userprofile may lock out user from admin
When a UserProfile is saved the staff status is set to false if neither org admin or org
project editor is true. This could lead to the possible lock out even if you are superuser.
http://www.pivotaltracker.com/story/show/1469655

### In Akvo at a glance change Partners link to Project Partners
Direct link to the right page.
http://www.pivotaltracker.com/story/show/1573608

### The breadcrum entry "home" at the blog pointed to "#"
The home link is pointing at "http://www.akvo.org/blog/", and not "#"
http://www.pivotaltracker.com/story/show/822234

### Learn about Akvo link broken on sign-in page
The 'Learn about' how Akvo works link was broken on the sign-in page:
http://www.akvo.org/rsr/signin/?next=/rsr/projects/
http://www.pivotaltracker.com/story/show/1514408

### Proj.update/access denied page didn't give you a way back to the project page
Now get's linked to the current project page.
http://www.pivotaltracker.com/story/show/1229436

### Cancelled projects had the wrong donation text
Cancelled projects still would say that you could fund them.
http://www.pivotaltracker.com/story/show/1528542

### Cancel update on a project sends you back to top level RSR page
Cancel update on a project would send you back to top level RSR page instead of back to the
project detail page. https://bugs.launchpad.net/akvo.rsr/+bug/315228
http://www.pivotaltracker.com/story/show/1229429

### Sign in routine should not send you back to the completed registration page
Signing in from the completed registration page will send you to the front page. (lp:
315146)
http://www.pivotaltracker.com/story/show/1229422

### Set height and width to every image when using sorl
If a photo can't be loaded it should still occupy the same space. This is not true for logos
and other non photo sized images.
http://www.pivotaltracker.com/story/show/1467668


---


Akvo RSR v 0.9.12 release notes
------------------------------
12 October 2009, (Code name: Basalt) tbp


New features
------------
### Addition of comprehensive help text in Akvo RSR admin
The add/modify project and organisation form in the Akvo RSR admin packs in a lot of information. Many of the fields are required and must be entered correctly. To make this form more usable, we added detailed and clear plain-English help text to guide partners through what is required of them.

### Updated JQuery to 1.3.2
We now use the JQuery framework 1.3.2.

### New small widget for Plus customers
A new "minimal" small widget has been created. With only project title, picture and location information. If you are using the Akvo.org services you have to have a Plus account (have an contract with Akvo Foundation) to get access to this new widget.

### Listing of projects in other currencies
One can now list projects in other currencies than Euros. To be able to do this one needs to do the following:

1. For other currencies than Euro and US Dollar, you need to modify CURRENCY_CHOICES in models.py.
2. Create a new PayPal gateway. This can only be done by Superusers in the system. The new admin form for this is called "Paypal gateways".
3. In the admin form "Project PayPal gateway configurations" you can select which donation gateway a selected project should use. This functionallity is only available to the Superuser of the system.

We have special code on the donation pages which displays different information based on which currency you have selected. This needs to be abstracted and entered into some admin forms for easier configuration. To change this you currently have to modify the donation templates.

The currency display ripples through the whole system including displaying multiple currencies in organisation listings, as well as the "Akvo at a glance" portlets, the "Organisation activities" portlet on the organisation page and the Sponsor portlet on the new Sponsor portal page. We updated how currencies are being displayed as well, for better readability. This work still needs another pass as we didn't have time to do it everywhere yet.

Read more about the [Akvo RSR support for multiple currencies](http://www.akvo.org/labs/index.php?title=Akvo_RSR_support_for_multiple_currencies).

### Added column in the admin view "Project PayPal gateway configurations" to display settings
This PayPal account a particular projects donations are linked to is important to know, without having to go into every project to see it. This is the one way money gets transferred through your system from donors to PayPal accounts, so you need to be able to see what they are set as.

### Adding prototype sponsor features
In 0.9.7 we added a new type of partner, a sponsor partner. We are testing some new features for the sponsor partner type with this release. We are expecting these features to be fleshed out in one form or another with subsequent releases. These features are only applicable to one specific sponsor for now:

* Sponsor portal page, a page which is different from the organisation page, but has branding and a project list related to the sponsor
* Sponsor branding on the organisation page which has a link to the sponsor portal page
* Sponsor branding on donation pages which has a link ot the sponsor portal page
* Home page Sponsor box, which has a link to the Sponsor portal page and links to articles in the blog

The new sponsor functionality is possible to enable or disable in the settings.py file, as well as identifying with organisation number is the sponsor partner which the features will be linked to. This will be updated in the next few releases and should be considered experimental.

### Added a link to updater's organisation in updates
In an update on the projects page you can now see which organisation the account which performed the update belongs to. The name of the organisation is displayed as the short name and has a link to the organisation page.

Bug fixes
------------
### "Hover" text (img title) not appearing over Focus area graphics on Organisation listing page
[Launchpad bug reference 319407](https://bugs.launchpad.net/akvo.rsr/+bug/319407)
[Pivotal story](http://www.pivotaltracker.com/story/show/1229439)

### Partners' listings breadcrumb trail doesn't lead back to Organisation Listing
[Launchpad bug reference 304679](https://bugs.launchpad.net/akvo.rsr/+bug/304679)
[Pivotal story](http://www.pivotaltracker.com/story/show/1289389)

### Sponsor attribution use wrong words in Widget, 2+ display
[Pivotal story](http://www.pivotaltracker.com/story/show/1321398)

### Donation template should not allow donations if a project is fully funded
One could manually go to the donation URL. The user will now be redirected to the project page.
[Pivotal story](http://www.pivotaltracker.com/story/show/1322025)

### Image on donation page is not "sorled"
The project current image is not run through thumbnailing with sorl on the donation page, it is just a scaled original.
[Pivotal story](http://www.pivotaltracker.com/story/show/1453502)

### Change text 'On hold' to 'Need funding' in Akvo at a Glance and Organisation detail page
'On hold' is misleading and should be changed to 'Need funding'. We had no projects on hold and there isn't even a status called on hold (anymore). Se Need funding was a better description.
[Pivotal story](http://www.pivotaltracker.com/story/show/1453017)

### Clicking Cancel in donation templates should immediately void an invoice
When the user clicks on "Cancel", a new URL is called which triggers a view function which voids the invoice and redirects the user to the project's detail page, thus freeing up that sum of money so it can be donated again.
[Pivotal story](http://www.pivotaltracker.com/story/show/1226213)

### Purpose of 'Back' button in PayPal checkout template is not clear and produces strange results
Workaround for now is to make 'Back' do the same as 'Cancel'.
[Pivotal story](http://www.pivotaltracker.com/story/show/1458080)

### Funding partner logo too large on funding detail page
In the funding detail page the logo for the funding organisation does not seem to get scaled down. Logos now passed through sorl-thumbnail and scaled to no more than 140x140.
[Pivotal story](http://www.pivotaltracker.com/story/show/823749)

---


Akvo RSR v 0.9.11 release notes
------------------------------
14 September 2009, (Code name: Jupiter) PB

New features
------------
### Decimalisation of financial data
All financial data in Akvo RSR is now stored in decimal format. Previously it was stored in integer (whole number) format. This transition was necessary to allow for accurate calculation and output of financial data in the system.

### Reconciliation of PayPal donations
All individual donations made to projects in Akvo RSR are subject to processing fees applied by PayPal. Although Akvo RSR has always stored these fees, we were not able to apply them to our own financial data until the system was decimalised. We are now able to store the final amounts received from PayPal with cent accuracy.

### PayPal gateway selection and multi-currency support
Currently all individual donations are sent to the Akvo PayPal account. As from this release, it is possible for a partner to request that Akvo staff override this behaviour on a project-by-project basis and define a new "gateway" (PayPal store) to direct payments to. Note: this is only done in exceptional cases at this point. PayPal gateways also contain locale and currency information meaning that we will be able to handle donations to a particular project in an alternative currency in the future.

### Various enhancements to the PayPal donation engine
Several smaller enhancements have been made to the Akvo RSR PayPal engine:

* The find_stale_invoices.py cron script now logs detailed information for each invoice operated on
* The PayPal-specific settings in settings.py have been simplified
* The view code which handles the donation process has been simplified

Detailed technical information about these new features and enhancements can be found on [Akvo Labs](http://www.akvo.org/labs/index.php/Akvo_PayPal_Under_the_Hood)

Bugs
----
In one particular template, the message "Fully funded" did not appear when a project had reached its funding target. This has been fixed.

When a user attempted to donate a negative integer amount (for example "-10") to a project, the error message produced was misleading, asking her to donate an amount "greater then or equal to 0". Since it is not possible to donate 0 to a project, this message now asks the user to donate an amount "greater than or equal to 1".

---


Akvo RSR v 0.9.10 release notes
------------------------------
1 September 2009, (Code name: Avalanche) GvH

This is a small release featuring new widgets

New features
------------
### Co-branded widgets
The widget gallery has been considerably expanded with designs promoting the various partners for the projects and having new formats for use both horizontally and vertically on the host page.

---

Akvo RSR v 0.9.9 release notes
------------------------------
7 July 2009, (Code name: Torch) tbp

New features
------------
### New style to organisation activity box/portlet
When viewing an organisation page in Akvo RSR, a portlet to the right of the page displays how many projects the organisation is involved in, which partners it works with, etc. The presentation of this has been updated to correspond with presentation changes made in 0.9.7 to the "Akvo at a glance" portlet.

### Akvo PayPal integration documentation
We have some initial [documentation for the Akvo PayPal integration](http://www.akvo.org/labs/index.php/Akvo_PayPal_integration_overview)

Bugs
----
It is now no longer possible to donate to a cancelled project. The project remains visible in Akvo, but the donation box is no longer displayed.
Internal reference: http://www.pivotaltracker.com/story/show/745352

Sponsor partners no longer have the "state" attribute displayed in the partner portlet on a project page. The sponsor partner information displayed there now matches that of other partner types.
Internal reference: http://www.pivotaltracker.com/story/show/782930

---

Akvo RSR v 0.9.8 release notes
------------------------------
25 June 2009, (Code name: Utah) pb

New features
------------
### PayPal Enhancements
A number of improvements have been made to the PayPal donation subsystem of RSR.

### More states for PayPal invoices
In previous releases, a PayPal invoice could be in one of two states: complete or incomplete. In this release, an invoice can be in one of four states: pending, void, complete or stale. This allows for more granular control over invoices and results in more accurate funding totals in the system.

### Cron script to mark stale PayPal invoices
Stale invoices are identified and marked as such by a new script which can be run manually or from the system cron daemon (recommended). This script is designed to find invoices in the system which have been pending for longer than a given, configurable period of time, allowing them to be easily identified and operated on in the admin interface. For more information about this script, see http://akvo.org/labs/index.php/PayPal_Overview#Invoice_Management

### User interface to void PayPal invoices
Batches of invoices can now be selected and operated on. This feature was designed to allow for easy manual voiding of batches of invoices which have been automatically marked as stale or that are pending and never likely to be completed. It will not allow invoices to be voided if they are either complete or already void. If the administrator attempts the latter, she will receive a warning message and a reason for each invoice in turn and no further action will be taken.

### Display of funding of projects
Funding calculations displayed in the Akvo Marketplace donation box now only take completed invoices into account. Pending invoices are also included in the calculation when a user is about to make a donation to avoid conflicting messages if a project is close to being fully funded.


Bugs
----
Donations did not show immediately when a PayPal donation was being made. This bug was a result of the changes which were made to the donation calculations in 0.9.7.
Internal reference: http://www.pivotaltracker.com/story/show/785964

---

Akvo RSR v 0.9.7 release notes
------------------------------
10 June 2009, (Code name: Omaha) eaw

Required software changes
-------------------------
**New required software: django-10766**
We have upgraded the version of Django which we use to rev. 10766. Our project budget code makes use of some admin features fixed in this Django version.

New features
------------
### New narrower "Project widget with donation"
A new widget with the same information as the previous tall "Project widget with donation" has been added. The new widget is narrower (172 pixels) wide, compared to its sister (202 pixels). Both widgets take up a maximum of 840 pixels vertically. Each may actually take up less, depending on the content of the project being displayed.

Both widgets are freely available for anyone to use.

### Individual funder contribution displayed
The total amount of contributions from individual funders' (donors via Paypal) contribution is now listed under the funders portlet on the project page and on the funding details page.

### Updated Akvo at a glance
The "Akvo at a glance" portlet on the Akvo home page and the projects listing page has been updated. Its simplified layout now shows correctly how many projects have been completed and how many people have water and sanitation as a result. Akvo at a glance now also includes the individual donations in the way it calculates funding for a project. The code has been restructured to make it easier to extend later. Bugs fixed: Launchpad #279243.

### Favicon
A favicon.ico has been added to all Akvo RSR pages.

### Project budgets
The project budget terminology has been updated to more accurately match its use. Previously this was called "Funding breakdown," but it really is designed to be a project budget.

The way the budget data is stored and manipulated has changed as well. Before we had a Django Funding model (i.e. database table); the model has been renamed BudgetItem. The date information (i.e. Date request posted, Date complete) has moved to the Project model; the money information is now stored in the BudgetItem model, and consists of one or more BudgetItem objects (records) instead of multiple columns.

### Sponsor partner type
A new type of partner is now available. Sponsor partners, if one exists for a particular project, appear at the bottom of the partner portlet. This indicates functionality currently in the pipeline. More soon.

### Featured projects
The projects featured on the projects listing page and on the Akvo.org home page now only show projects which need money. For the Akvo.org listing, this is only done if there are a minimum of 8 projects with outstanding funding requests.

Bugs
----
### Error message style sheet
404 and 500 http errors did not have style sheets; now they do.

### Funding table alignment
The funding table at the organisation page had a alignment bug making the sums pushed down a couple of pixels. This is now fixed.

### Project updates widget is too large for the iframe
A new smart_truncate Django filter is used to increase control over text lengths in the widgets. Since text length is a general problem with widgets, we updated all widgets to use the new filter. Small changes have also been made around the Akvo reference number for better Internet Explorer compatibility. Filter by Adam & bobince (http://stackoverflow.com/questions/250357/smart-truncate-in-python).

### Akvo at a glance
The updates to Akvo at a glance (described above) fix Launchpad bug #279243.


Miscellaneous
-------------
### Donation page simplified
The donation page had a "Sign in" link for people with an Akvo RSR account. This has been removed, as it proved confusing; the 10 seconds saved by users with Akvo RSR accounts was not worth the confusion it caused.
Akvo RSR v 0.9.6 release notes
------------------------------

v0.9.6, 27 April 2009, (Code name: Sword) tbp

**New required software: django-10553**
We have upgraded the version of Django which we use to rev. 10553. There are some features in Django which has changed and will break Akvo RSR if you don't update to this version.

New features
------------
### New user roles
Two new user roles have been introduced: organisation project editor and organisation administrator

An organisation administrator can do the following:

* Create new projects
* Edit projects
* Edit the organisation page
* Activate new users attached to the organisation
* Promote new users to be project editor or organisation administrator
* Add countries to the country list

The organisation administrator get an email each time a new user signs up for an Akvo RSR account and selects the organisation administrator's organisation. In this email there is a clickable link directly to the user profile for the new user, where the user can be activated.

An organisation editor can do the following:

* Edit projects
* Add countries to the country list

Documentation about how to use the new features can be found in the Akvo Labs Wiki: [Akvo HOWTOs](http://www.akvo.org/labs/index.php/Akvo_HOWTOs)

Miscellaneous
-------------
### New home page layout
We have added a new box on the home page: Learn about Akvo.

### Updated Dutch translation
The Dutch translation has been updated with some changes to the use of language.

### Release notes
We are now coding the release notes in [markdown](http://daringfireball.net/projects/markdown/), to make it easier to convert to an HTML page, as well as read in the raw text format.

---

Akvo RSR v 0.9.5 release notes
------------------------------
v0.9.5, 20 April 2009, (Code name: Juno) tbp

**New required software: sorl-thumbnail.**
For the image handling integration you now need the following software:[sorl-thumbnail](http://code.google.com/p/sorl-thumbnail/)

New features
------------
### Akvo RSR image upload improvements
When uploading images to the Akvo RSR system there are now a number of improvements to how the system handle images.

1. Images are scaled to the appropriate size the first time they are viewed. This is done via the sorl-thumbnail toolkit.
2. Images are now renamed according to the use in the system. The naming is based on ModelName_instance.pk_FieldName_YYYY-MM-DD_HH.MM.SS.ext. Example: a map image uploaded to project no 17 gets the name Project_17_map_2009-04-17_12.13.14.jpg.
3. Images are stored in the subdirectory related to the project and the update. /var/www/akvo/db/project/NN/update/MM

### Akvo RSR admin link
A link to the administration login can now be found on the footer of the page "Admin". (Note, that if you are on the non-RSR pages of the Akvo.org site, the Admin link leads to the Drupal system admin pages.)

Bugs
----
Fixed two bugs where the maxlength attribute was missing on the input field for `photo_credit` and `photo_caption`.

Limitations
-----------
See comments about limitations in the PayPal integration under release notes for 0.9.3.

----

Akvo RSR v 0.9.4 release notes
------------------------------
v0.9.4, 15 March 2009, tbp

New features
------------
Added Dutch and German translations of Akvo RSR user interface for Widgets and Paypal donations. (Thanks Anke and Malte!)

Bugs
----
Fixed a bug where featured projects were not shown when looking at a project list from a specific organisation.

----

Akvo RSR v 0.9.3 release notes
------------------------------
v0.9.3, 12 March 2009, tbp

**New required software: django-paypal.**
For the PayPal integration you now need the following software:[django-paypal](http://github.com/johnboxall/django-paypal/)

New features
------------
### Akvo RSR Widgets user interface
There is now a user interface to select and customize widgets. The tool can be found under Page tools on each project page. The widgets can be placed on any web site to promote a particular project or highlight progress.

### Akvo RSR delegated project and user administration beta
We have started creating the ability for project owners to edit their own project descriptions and manage their own users. The tools are fairly basic so far, but it is a start.

### Akvo Direct PayPal integration, using django-paypal
Support added for making donations to projects via PayPal Standard. Instances of a new PayPalInvoice class are created which capture details of the payment and track it all the way through to PayPal and back again. Invoices are "completed" and the end user is sent a confirmation email on receipt of a confirmation callback from PayPal.

Behaviour of PayPal donations can be defined by several environment variables in settings.py, making it straightforward to select currency, PayPal command flow, specify custom PayPal buttons and switch between sandbox settings for testing and production settings.

Limitations in PayPal integration
----------------------------------
There are a couple of limitations with the PayPal integration at this point.

### Donation committments
When performing a donation we committ a portion of the funding the project needs, to ensure that the project isn't overfunded. We currently have no routines to take down "stale" donations, i.e. donations which were never completed. This is a priority set of routines which will be created as soon as possible.

### PayPal charges
Project funding is currently done as integers. This will have to change, as when donations come in from PayPal a certain percentage of the donation has been deducted from the donation. This very seldom is a whole number. We don't deduct this at this point from the project, which means that the project will always be short of some funds if donations have been made to it. This is a fairly large thing to fix, so due to deadlines we have punted this for a later release. Each transaction that is completed has a record of how much PayPal charged, so we can fix the accounting later.


Infrastructure
--------------
The way funding of a project was calculated has been changed. We have included the donations into the funding.

Bugs
----
Fixed a bug in the project-list widget. When you sorted on anything else than project name it was impossible to resort on project name.

----

Akvo RSR v 0.9.2 release notes
------------------------------
v0.9.2, 13 February 2009, tbp

New feature
-----------
### Akvo RSR Widgets
Beta-release of the Akvo RSR Widget backend. This allows you to post iFrame based widgets of projects and project listings. A user interface should be added to the next release.

----

Akvo RSR v 0.9.1 release notes
------------------------------
v0.9.1, 6 February 2009, bw

New features
------------
### Django framework upgrade.
This version of Akvo RSR uses the latest Django framework, version 1.0.x. The new form-handling library, django.forms, was designed with extensibility and customization in mind, and will permit us to more quickly and easily develop RSR's administration user interface. To read more about Django 1.0.x please see:
http://docs.djangoproject.com/en/dev/releases/1.0/

Parts of RSR have been rewritten to accomodate the frameworks upgrade. RSR should not look or behave any differently than it did in 0.90. If you experience anything new, please let us know so we can address problems!

### Internationalization
Dutch translation files have been added. A big thanks to our Dutch translator, Anke van Lenteren, for helping us as we work out our translation process.

### Miscellaneous
The wording of some text and error messages has been changed in the interest of greater clarity (and proper English). There are also some minor tweaks to style sheets to fix display glitches and layout irregularities across browsers.

----

Akvo RSR v 0.9 release notes
----------------------------
v0.9, 8 January 2009, tbp

New features
------------
### First public release
This is the first public release of Akvo RSR.

### Internationalization for the user interface.
We have tagged all the user interface text, so that the Django translation engine can pick up the text strings and produce a translation file. While the interface is translated, some emails from the system remain in English; these will be fixed in a later release. We have tested the implementation with one initial language, German. You can participate and help translate the Akvo RSR user interface to your language by downloading the translation files from: https://translations.launchpad.net/akvo.rsr

### Licensing
Inserted the GNU AGPL license in the distribution and tagged all the files with license information.

### Akvo at a glance portlet
Field partners, Support partners and Funding partners are now linked to a listing showing only those partners (the feature existed before, but there were no links to it).

### Project updates
Projects with no updates now have an RSS icon and a link (previously you had to wait for the first update for the icon and link to show up). So you can subscribe with an RSS reader to projects which have not been updated yet.

Bugs
----
We have changed how funders contributions are displayed in the Organisation activities portlet. Now only the funders proportion of a project is displayed (Bug 269400).

Highlights of bugs fixed
------------------------

296702 Remove MDG count terminology Medium Fix Released
274658 Photos in Project Update have no default placement, so do not show up. Medium Fix Released
269400 Portlet: "Organisation activities" shows easy to miss-understand Funding pledged Medium Fix Released
269402 Organisation description box do not use line breaks. Medium Fix Released
274099 Partner types (example: funding partner) should be link to the URL which lists them Low Fix Released
279243 Actual number in Akvo at a glance portlet gives ugly linebreak Wishlist Fix Released
292932 Describe in user interface that user names are case-sensitive. Wishlist Fix Released

A detailed list (including in process development bugs) can be found at: http://snurl.com/9lqvk
