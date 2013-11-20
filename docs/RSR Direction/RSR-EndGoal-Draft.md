RSR End-Goal - working draft

This is my take on where we should be going in terms of what RSR functionality and services we should be building.

There are of course many other additional uses for this data including, but not limited to IATI, Open Data, Collaboration, Dashboards and Visualisations.

1. [API](RSR-EndGoal-Draft#api)
1. [RSR Pages and RSR Sites](RSR-EndGoal-Draft#rsr-pages-and-rsr-sites)
1. [Maps](RSR-EndGoal-Draft#maps)
1. [Widgets](RSR-EndGoal-Draft#widgets)
1. [Donations](RSR-EndGoal-Draft#donations)
1. [Social](RSR-EndGoal-Draft#social)
1. [Mobile](RSR-EndGoal-Draft#mobile)
1. [Data Management](](RSR-EndGoal-Draft#data-management)


### API

We should have a great, speedy and simple to use API available for users to create, read and update their information in RSR directly.

We should have a series of custom resources designed around the data types that a user may need.

These should include standard templates for:
- Projects
- Organisations
- Project Updates
- Users
- Locations (Maps)
- Widgets

Many of our other services will depend on obtaining their information using the API.
The API needs to be robust and scalable to be able to handle this usage.

There should be an open API available for all to use via a web interface.
A user should be able to select from the available resources or create a custom request.
The open API should be throttled (limit to be discussed).

All registered users should be able to easily obtain their API Key and Username details with instructions on how to add this into their requests.
The open API web page should provide the authenticated API to a logged in user.
The user should be able to select from the available resources or create/save/modify a custom request.
The authenticated API should have a global fair usage policy throttle.

All standard resources should have a sub-second response time.
All reasonable custom requests should have a sub-second response time. (Reasonable to be determined).


### RSR Pages and RSR Sites

AKA Partnersites and Consortia sites, we should work to a more manageable solution for scale and domain:

- RSR MiniSites
- RSR Templates
- RSR Sites

**RSR MiniSites**

This option is not designed to be integrated into another website. This is an option for an Organisation to setup a closed website for an Organisation, Program, Theme or individual Project with it's own look, feel and customisable options.
We should use Partnersites as they currently exist, with an additional cusomisable Homepage.
CNAME should only be provided for Akvo Hosted Domains.
We should provide a service to host Partners' Domains.

**RSR Templates**

We refine and standardise the set of templates used in RSR.
We provide these templates within Open Github Repositories
We cater for web builders using a wide variety of platforms including (can this be achieved for):

- Django/Python
- Rails/Ruby
- Wordpress
- Drupal
- Joomla
- iOS
- Android
- More...

These templates should collect infomation using the athenticated API and have easy ways for the user to implement both the pages and the API keys and usernames.

**RSR Sites**

We should expand on the current Wordpress Solution, and utilising RSR Templates, build a series of Plug n Play websites.
Organisations should be able to create full websites in a number of different platforms.
We should provide the option of building this for them in a platform of their choice utilising Akvo Dev, Kominski and/or other Development parties as well as engaging the Open Source community.
RSR Sites should collect their information using the RSR API and other live data sources.


### Maps

We should provide interactive and enjoyable maps both in RSR and throughout the implementations being undertaken.
Maps should have a variety of layers available for users to select from.
Maps should have clustering options to allow for clear visualisation of the data.
Users should be able to collect Map embed URLs for their sites.
Additional Data sets should be available for users to pull into Maps including:

- FLOW
- Akvopedia?
- OpenAid (IATI)

Maps should show all the location information that is available to them on a map. This includes:

- Projects
- Organisations
- Users
- Working Groups
- Photos
- Videos
- Update location
- Referenced
- Just a country or region mentioned should be visualised (somehow)
- Data from various sources:
    - Government data
    - Own data
    - RSR/FLOW data
    - IATI data
    - Other public data

Users on maps should be able to visually add and remove data set elements to be able to interpret the information displayed.
Maps should visualise organisation networks by displaying information about the partners that they work with, and the relationships that they have with each other and with projects.

### Widgets

We should offer a range of customisable widgets for users to be able to collect and display.
Widgets should track visitor data that can be accessed through the My Akvo pages or the authenticated API.
All elements of the Widgets should be selectable for the user to be able to choose what data should be displayed.
Widget content should be responsive to allow the widget to be resized or displayed on different screen resolutions.
Widgets should be provided on a variety of content streams including:

- Project Updates
- Organisation Updates
- Project Fundraising
- Project Promotion


### Donations

Donations should be an optional extra for Organisations to be able to add to their projects on a Global Scale (for all projects they are managing) or on a per project basis.
We should offer a variety of payment options for Organisations to choose from.
We should offer an immediate donation and an "all or nothing" delayed donation option with clear messaging throughout the Donation process.
Entry to the Donaion process should be via Donations buttons saying "DONATE TO THIS PROJECT (provided by Akvo)"
Donation pages should be styled to clearly display the secure payment area being provided by the Akvo platform.
Donation payments should be directed to the Organisations bank account directly.


### Social

RSR should provide social options for users to interact with projects and other users of RSR.
We should provide easy to use sharing tools to allow users to share content on social media and other sites.
We should provide Forums on Projects and Programs to allow the public to interact with the users working on projects.
We should provide Coffee Corners for Users and the Public to interact with each other discussing various topics.
We should provide statistics, graphs and maps to visualise data, bringing it to life and allows the public and users to interact with it.
Users should be able to create public profiles and network with other users to achieve more together.


### Mobile

RSR Mobile should provide a set of functionality with a UX tailored for the mobile user.
Features should include:

- Project Updates
- Viewing Projects
- Project Maintenance
- User Registration
- Mobile Maps
- Find my nearest...
- RSR Forum
- Notifications and Messaging
- Help


### Data Management

Data should have a range of documented input methods available including:

- Web Interface
- Mobile Interface
- CSV
- XLS
- API (JSON)
- IATI (XML)

Users should be able to interact with their data in a direct and simple way.
We should provide interfaces for the users to create and manage their:

- Projects
- Programs
- Partnerships (to other Organisations)
- Relationships (to other Users)
- Forums
- Preferences
- Akvo

Each option should have it's own interface designed around the type of data that is required to be entered.

**Projects**

Projects require a lot of data, we should guide users through the creation process.
A project should be able to be saved in any state of completion.
A project should only be able to be submitted for publishing when all mandatory fields have been completed.
A project should be editable by all approved Users for the Project, or as per the Management settings of the Support PArtner if no Project settings are set.
Multiple Users should be able to work on a project at the same time.
Notifications should be displayed on the live interface to show other users are working on the project.
We could allow these Users to communicate with each other within the interface.
The interface could utilise the final template and allow the user to select the fields where they will end up to open the editor to complete their content.
Editors should be provided to allow users to create and display their data the way they wish to.
We should set and agree on a single display language (HTML, Markup etc) and allow data to be stored and displayed in this manner throughout the visualisation process.
A copy of deformatted data should also be made available via the API.

**Programs**

Users should be able to group their projects into Programs.
Programs should have their own set of data requirements.
The Interface should allow for clear selection of multiple projects with filtering and multiple-select options available.

**Partnerships**

Users should be able to connect their projects to Organisations they are working with.
Users should be able to easily identify if an Organisation they are working with is already existing within RSR.
Users should be able to insert new Organisations into RSR.
We should employ minimum standards for the insertion of Organisation Data.
We should promote the use of an International Organisatio Register.
We should display limited Organisation Data until we have confirmation that the Organisation exists (via Register or through contact).
Users should be able to define their Partnerships with other Organisations in different ways:

- How they interact on Projects (Project Creation/Editing/Updating rights)
- How they interact on Organisations (Organisation Creation/Editing rights)
- How they interact on Users (Registration/API)

**Relationships**

Users should be able to indicate who they work with on Pojects, Programs, Organisations or Other items.
Users should be able to provide access rights to other users on their data. (E.g. Allowing a Contractor from another Organisation to Update or Manage one of your Projects)
Users should be able to Review or Promote their fellow Users and interact with their Projects and Programs.
Users should be able to Invite people to join RSR for their Organisation or for an Organisation that they Manage.

**Forums**

Users should be able to see an overview of the activity on their Projects and Programs.
Users should be able to eaily respond to questions and send messages to participants.
Users should be able to follow recent and trending conversations.

**Akvo**

We should provide a separate interface for Akvo Users to use.
Akvo Users should be able to manage:

- User Registrations
- Project Creation
- Project Updates
- Donations
- Organisation Rights
- Forums
- Network Partners
- Open Templates
