Last changed: 19 April 2012, pb

Akvo RSR (Really Simple Reporting) makes it easy to put any type of projects online and share status updates from your teams.

We provide Akvo RSR as a service on your own URL and with your own branding, as well as and on Akvo.org, to combat poverty by making it easy to bring development aid projects online. There you can use our open web and mobile tools to connect and share progress with funders and followers.

Check out [Introducing Akvo Really Simple Reporting](http://www.akvo.org/web/akvo-rsr).
Read more about the [Akvo Platform](http://www.akvo.org/web/akvo_platform_overview).

Akvo RSR ver 2.0.5 release notes
----
19 April 2012, (Code name: Fennel) pb

Overview
----
This release addresses a problem whereby certain project fields were not being constrained in length consistently. Django >= 1.4 is now a requirement of Akvo RSR and, as such, several parts of the system have been upgraded to support it.

New features & changes
----
### Improved help text
[PT story 25606657](https://www.pivotaltracker.com/story/show/25606657) Some fields in the admin interface that constrain input to a maximum number of characters did not have help text alerting the user to this limit. This has been remedied.


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


====END OF RELEASE NOTES====

