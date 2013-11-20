Content Translation

Introduction
------------
We need to provide the content of Akvo RSR Projects, Organisations and Updates, including the associated linked records, such as Benchmarks in multiple languages.

Due to the high intensity and cost of human translation, we have decided that a machine translation using Google Translate will be used to provide this to the end user.

We have the possibility to combine this with an additional feature to allow partners to provide additional language translations of their content.

Specific Information
--------------------
The most likely solution will involve utilising the Google Translate API for this solution.
This product from Google is a paid service which currently charges at $20 per 1M characters sent to the API.
We must visually display all Google Translated content as being translated by Google.
We must not use the Google Translate API in a way which avoids incurring fees.

Partners have made several requests to be able to submit project content in multiple languages. This would be human translations that would supersede the machine translations by Google Translate.

Currently we do not store any language identifiers in Akvo RSR. The language that a project is written in is not detectable by machine and must be manually identified by the user or admin. Once identified this information is currently lost as it is not stored.

Requirements
------------
- View content on Akvo Partner Sites in multiple languages
	- Project pages
		- Core Project content
		- Tabs
		- Partner Overviews
	- Project Updates
	- Project Comments
	- Organisation pages
	- Project listings
	- Organisation Listings
	- Login process
	- Registration process
	- Map pages
	- Donation process
	- Funding pages
	- Widgets
	- Admin Screens
- Support at least the UI Languages within the language choices
	- Dutch
	- English
	- French
	- German
	- Spanish
	- Russian* (not yet implemented)
- Provide visual confirmation that translation is provided by Google Tranlsate
- Ensure bills from Google Translate do not reach excessive amounts

Decisions
---------
What content should be translated?
When should the translations be performed?
Should we store translated strings?
Where should translated strings be stored?
Who should pay for translation costs?
How do we manage multiple translations when considering updated content?
How do we display original and translated content to the end-user?
How can users interact with translations?
How do we monitor modifications in original and translated content?
How can cached translations be utilised?

General note by GvH:

Google provides four kinds of machine translations. 1) to 3) are free, 3) has a limit of 1GB/year.

1) The webpage http://translate.google.com where you can enter a piece of text or a link to a web page and get it translated.

2) The website translation widget. A javascript based widget you add to a web page to enable a translation tool that (I think) uses the same functionality as 1)

3) Translator toolkit. A tool for assisting document translations. One potential use of Translator toolkit is the translation of the .po files we generate as it is one of the file formats that Translator toolkit supports. Another file format we might use is Android resource XML files.

4) The Google Translate API (GTA), https://developers.google.com/translate/v2/getting_started. Requires a google account with an API key and costs $. The GTA translates pieces of text, not whole web pages or parts thereof.

I don't think we can use 2) as a part solution, if we go that route then that's it: we add the widget and when a user selects a translation our page gets chewed on by Google and is then displayed by Google. Navigation still works but everything is run through Google's proxy to translate the pages. If we want finer grained control 3) or 4) are the alternatives I think.

This in turn means that some of the options below are not as easy to implement as maybe implied. Basically I don't think we can stuff whole web pages into the GTA, get them back and cache them, but rather we have to translate discreet strings using the GTA and use/store those for (later) assembly of a translated page.

One other detail is that the GTA _can_ be used on the client side, even if that exposes our API key. You can restrict the use of the key to certain domains, thereby preventing others to use the key. One important consideration is to determine if the key can be assigned to *.domain.tld for us to be able to use it on all our partner sites if we want to use client side GTA access. If not new partner sites have to registered manually when setting up translations for them.

Options
-------

Option 1:
Use the Google Translate API to collect translations for each page as they are generated.
Display the result to the end user.
Trash the translated strings after the user closes their browser.

GvH: This seems to me to be the best for 2), the translation widget. It's free and simple to set up. However it requires us to fix our javascript and css on some pages for full functionality of translated pages. If we want to use GTA this can be used either on the client or the server. If we intend to cache the translations it makes little sense to translate client-side.

Option 2:
Use the Google Translate API to collect translations for each page as they are generated.
Cache the result within Akvo RSR.
Display the Cached result to users via the Web Interface.
Provide the Cached results to new users who wish to display the same page.
Trash the translated strings when the project content is modified.

GvH: as noted above I don't think we can translate whole pages, but rather have to translate individual pieces of text. Also note that all markup surrounding translated text  needs attributes denoting that the content is machine translated. 

Option 3:
Use the Google Translate API to collect translations for each page as they are generated.
Store the result within the Akvo RSR Database.
Display the Cached result to users via the Web Interface.
Provide the Cached results to new users who wish to display the same page.
Allow the translated strings to be updated via the Akvo RSR Admin interface.
Trash raw translated strings when the project content is modified.

GvH: If translations are generated on the fly like this we would probably have to foot the bill since we cannot know beforehand what site will display the translation "first". Alternatively a given partner is designated to foot the bill regardless of where it appears. Allowing post translation editing makes this complicated. What happens when the "original" is updated if there are translations that have been edited by users? I don't think we can just trash content that's been edited by users. Also see option 2.

Option 4:
Use the Google Translate API to collect translations for content upfront for a set number of languages.
Store the result within the Akvo RSR Database.
Display the Cached result to users via the Web Interface.
Provide the Cached results to new users who wish to display the same page.
Allow the translated strings to be updated via the Akvo RSR Admin interface.
Trash raw translated strings when the project content is modified.

GvH: The advantage here is that there's no waiting for a translation the first time a page is requested to be translated. The downside is that we run the risk of paying for translations that will never be used. Also see options 2 and 3.

Option 5:
Use the Google Translate API to collect translations for content upfront for a set number of languages.
Store the result within the Akvo RSR Database.
Display the Cached result to users via the Web Interface.
Provide the Cached results to new users who wish to display the same page.
Allow the translated strings to be updated via the Akvo RSR Admin interface.
Trash raw translated strings when the project content is modified.
Inform modifying user of translated content on save.

Option 6:
Use the Google Translate API to collect translations for content upfront for all supported languages.
Store the result within the Akvo RSR Database.
Display the Cached result to users via the Web Interface.
Provide the Cached results to new users who wish to display the same page.
Allow the translated strings to be updated via the Akvo RSR Admin interface.
Trash raw translated strings when the project content is modified.

Option 7:
Use the Google Translate API to collect translations for content upfront for all supported languages.
Store the result within the Akvo RSR Database.
Display the Cached result to users via the Web Interface.
Provide the Cached results to new users who wish to display the same page.
Allow the translated strings to be updated via the Akvo RSR Admin interface.
Trash raw translated strings when the project content is modified.
Inform modifying user of translated content on save.