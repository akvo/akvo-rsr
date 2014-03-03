We have developed a Write API to be able to create information within Akvo RSR through file submission.
To ensure that the content is suitable to create projects with, the data should conform the to the requirements on this page.

### [Project Content](https://github.com/akvo/akvo-rsr/wiki/Akvo-RSR-API-Content-Requirements#project-content-1)
### [Goals](https://github.com/akvo/akvo-rsr/wiki/Akvo-RSR-API-Content-Requirements#goals-1)
### [Locations](https://github.com/akvo/akvo-rsr/wiki/Akvo-RSR-API-Content-Requirements#locations-1)
### [Budgets](https://github.com/akvo/akvo-rsr/wiki/Akvo-RSR-API-Content-Requirements#budgets-1)
### [Organisations](https://github.com/akvo/akvo-rsr/wiki/Akvo-RSR-API-Content-Requirements#organisations-1)
### [Images](https://github.com/akvo/akvo-rsr/wiki/Akvo-RSR-API-Content-Requirements#images-1)
### [Indicators, Categories & Focus Areas](https://github.com/akvo/akvo-rsr/wiki/Akvo-RSR-API-Content-Requirements#indicators-categories--focus-areas-1)

Project Content
===============

All content that resides on the rsr_project database table is referred to as Core Project Content.

Core Content Requirements:
* Title (45)*
* Subtitle (75)*
* Status*
	- Active
	- Needs Funding
	- Complete
	- Archived (for existing projects only)
* Project Language*
	- English
	- Dutch
	- French
	- German
	- Spanish
	- Russian
* Project Start Date (yyyy-mm-dd)*
- Project End Date (yyyy-mm-dd)
* Project Plan Summary (400)*
- Background (1000)
- Current Status (600)
- Project Plan (∞)
* Sustainability (∞)*
* Overview of Goals (600)*
- Photo Caption (50)
- Currency (€/$)
- Admin Notes (∞)


Goals
=====

Individual Goals are added to a project.
We can accept up to 8 Goals per project.

Goals Requirements:
* Description (100)*


Locations
=========

A project must have at least one Location included, but may have many more.
The details included in the Location will provide the information to populate maps.
One Location may be marked as the Primary Location.
If no Location is marked as primary, the first Location will be used as the Primary Location.

Location Requirements:
* Latitude*
* Longitude*
- City (255)
- State (255)
* Country (ISO 3166)*
- Address 1 (255)
- Address 2 (255)
- Postcode (10)
- Primary Location (Y/N - 1 permitted per project)


Budgets
=======

Project budget information is used to show where funds are to be spent.
Budget information is split into individual items categorised by type.
There are 10 types available, with 3 custom labels available per project.
A project can include as many budget items as needed.

Budget Item Requirements:
* Label*
	- Building Materials
	- Employment
	- Equipment
	- Maintenance
	- Overhead
	- PR & Marketing
	- Total
	- Training
	- Transportation
	- Other 1
	- Other 2
	- Other 3
- If Other 1/2/3:
	- Extra Label (20)
* Amount (€/$)*


Organisations
=============

Partnerships
------------

When an Organisation is working on a project we refer to this relationship as a Partnership.
Partnerships need to be included within the Project Data to identify the Organisations that are working on the project.
Unless specifically stated otherwise, the Organisation submitting the API Data will be assigned as the Support Partner for the project.

All additional Organisations working on the project need to be uniquely identified.
We recommend that the IATI Organisation Identifier is used.

If the IATI Org Id is unknown for one of more Organisations you work with, all Organisations from all projects being submitted should be collated into a separate import file.

Partnership Requirements:
* Organisation Identifier - Internal or IATI (255)*
	If IATI:
	* Organisation Type*
		- Government
		- Other Public Sector
		- International NGO
		- National NGO
		- Regional NGO
		- Public Private Partnership
		- Multilateral
		- Foundation
		- Private Sector
		- Academic, Training & Research
* Partner Role*
	- Field Partner
	- Funding Partner
	- Sponsor Partner
	- Support Partner (1 permitted per project)
- If Field Partner:
	- Additional Field Partner Type
		- Alliance
		- Knowledge
		- Network
- If Funding Partner:
	- Funding Amount (€/$)
- Partner's Internal Project Identifier (255)


Organisation Input File
--------------

Each Organisation needs to be given a unique reference that will be used consistently throughout this and all future import files.
For subsequent API Imports, only additional Organisations need to be submitted, but a full Organisation list will be accepted.

Organisation Requirements:
* Name (25)*
- Long Name (75)
* Organisation Type*
	- Government
	- Other Public Sector
	- International NGO
	- National NGO
	- Regional NGO
	- Public Private Partnership
	- Multilateral
	- Foundation
	- Private Sector
	- Academic, Training & Research
- Logo (see Image requirements)
- URL (255)
- IATI Organisation ID (255)
- Contact Person (30)
- Contact Email (50)
- Phone (20)
- Mobile (20)
- Fax (20)
- Description (∞)


Images
======

Each project and organisation should be given an image.
The image should be in 4:3 aspect ratio and no more than 2MB in size.
The image should be transmitted to Akvo with API files or should be hosted in a publicly accessible location.
Each image should be given a filename that uniquely identifies the project or organisation that the image should be attached to.


Indicators, Categories & Focus Areas
====================================

SOON TO BE DELIVERED PROCESS
----------------------------
_[Click here for the current process](https://github.com/akvo/akvo-rsr/wiki/_preview#current-process)_

Focus Areas
-----------

Each project must be assigned to one or more Focus Areas.

Focus Area Requirements:
* Focus Area*
	- Economic Development
	- Education
	- Healthcare
	- IT and Communication
	- Water and Sanitation

Indicator and Categories
------------------------
Indicators have been given a simple but defined structure to enable data management and analysis.
Each Indicator must be given one from each of a set of attributes.
An Indicator may also be given a custom label to be used for public websites when further refinement is needed.
Each Indicator must be given its own category from the IATI Sector list (http://iatistandard.org/codelists/sector/).

Indicator Requirements:
* Indicator Amount (int)*
- Custom Label (80)
* Indicator Effect*
	- Affected
	- Created
	- Empowered
	- Improved
	- Organised
	- Reached
	- Trained
* Indicator Subject*
	- Adults
	- Children
	- Men
	- People
	- Staff
	- Students
	- Teachers
	- Users
	- Women
	- Communities
	- Entrepreneurs
	- Health clinics
	- Households
	- Institutions
	- NGO’s
	- Organisations
	- Schools
	- Events
	- Hygiene facilities
	- Sanitation facilities
	- Sites
	- Surveys/research
	- Technology facilities
	- Training facilities
	- Water facilities
	- Health facilities
	- Resources
* Category (IATI Sector List - selection indicated below)*
	- IATI Sector/Category Code (int)

Subset of IATI Sector/Category List
-----------------------------------

- 31165 - Agricultural alternative development
- 31120 - Agricultural development
- 31181 - Agricultural education/training
- 14030 - Basic drinking water supply and sanitation
- 12220 - Basic health care/Nursery
- 11230 - Basic life skills 
- 25010 - Business support services and institutions
- 15220 - Civilian peace-building
- 22010 - Communcations policy and administrative management
- 15110 - Economic and development policy/planning
- 24081 - Education and training in banking/financial management
- 11110 - Education policy and administrative management
- 11120 - Educational training
- 12261 - Health education
- 12230 - Health infrastructure
- 12281 - Health personal development
- 12110 - Health policy and administrative management
- 13040 - HIV/Aids
- 15162 - Human rights
- 22040 - ICT
- 12191 - Medical services
- 24040 - Micro-credit
- 15261 - Prevention and demobilization of child soldiers
- 22030 - Radio and/or television
- 43040 - Rural development
- 41040 - Site preservation
- 32130 - Small and medium sized enterprises development
- 16010 - Social/welfare services
- 15150 - Strengthening civil society
- 11130 - Teacher training
- 14081 - Training in water supply and sanitation
- 11330 - Vocational education
- 14010 - Water resources and administrative management
- 14020 - Water supply and sanitation (large systems)
- 111 - Education
- 112 - Basic education
- 113 - Secondary education
- 121 - Health
- 122 - Basic health
- 130 - Population policies and reproductive health
- 140 - Water and Sanitation
- 151 - Government and civil society
- 152 - Conflict prevention and resolution, peace and security
- 160 - Social infrastructure and services 
- 220 - Communication
- 240 - Banking and financial services
- 250 - Business and other services
- 311 - Agriculture
- 321 - Industry
- 410 - Environmental protection
- 430 - Unspecified sector
- 720 - Emergency response


CURRENT PROCESS
---------------

Indicators (aka Benchmarks), Categories and Focus Areas are co-dependently linked.
Each Focus Area has a set of Categories.
Each Category has a set of Indicators.
Indicators are only selectable if the project has the parent Category.

Focus Area and Category Requirements:
* Focus Area*
	- Economic Development
	- Education
	- Healthcare
	- IT and Communication
	- Water and Sanitation
- If Economic Development:
* Category*
	- Small Business Development
	- Entrepreneurship trainees
	- Social Enterprise Development
	- Agriculture
	- Economic development
	- Heritage Management
	- Disaster Recovery
	- Entrepreneurship
	- Investments
	- Security & Justice
	- Urban Matters
	- Women's Leadership	
- If Education:
	- Training
	- Education
	- Archaeological Research
	- Education and Outreach
	- Vocational Training
- If Healthcare:
	- Raising awareness
	- HIV / AIDS
	- Telemedicine
	- Medical training
	- Webbased tools
	- HMIS
	- eHealth
	- Community Empowerment 
	- Training
	- Equipment
	- Health
	- Eye care
	- Lobby and Advocacy
	- Food Security
	- Healthcare
- If IT and Communication:
	- Economic development
	- ICT
	- Training
	- Telemedicine
	- Mobiles for Development
- If Water and Sanitation
	- Water
	- Sanitation
	- Maintenance
	- Training
	- Education
	- Product development
	- Other
	- Hygiene
	- Capacity Building
	- Networking
	- Lobby and Advocacy

Indicators/Benchmarks Requirements:
* Value (ind)*
- If Agriculture:
    - farmers groups reached
    - farmers trained
    - trainees
- If Archaeological Research:
    - communities helped
    - excavations
    - publications
    - research programs
    - students and/or staff trained
- If Capacity Building:
    - NGOs receive capacity assessments
    - NGOs receive tailor made trainings
    - NGOs trained on Sustainability Assessment
    - people trained on budget tracking methodologies
    - staff members trained on WASH financing 
    - staff trained on water resource protection
- If Community Empowerment :
    - community educators trained
    - people reached
- If Economic development:
    - end users
    - farmers groups reached
    - households reached
    - households receive funding
    - houses built
    - institutions trained
    - institutions with improved facilities
    - people affected
    - people empowered
    - people reached
    - people reached via radio broadcasting
    - people receive funding
    - people trained
    - people with access to improved facilities
    - people with access to information
    - producer organisations reached
    - producer organizations access to market info
    - producers/entrepreneurs increased their income
    - producers/entrepreneurs trained
    - users
    - women empowered
    - women groups reached
    - women join co-operative
    - women lift themselves out of poverty
    - women reached
    - women receive funding
    - years duration
    - youth groups reached
- If Education:
    - children participating in mixed sports
    - children participating in reading aloud
    - children reached
    - former child soldiers are lifted out of poverty
    - former child soldiers complete their education
    - new construction 
    - others in community mentored
    - outreach counsellors trained in counseling skills
    - people trained
    - percentage of girls in secondary education
    - School management Committees trained
    - schools reached
    - students reached
    - students trained
    - students use ICT
    - surveys carried out with beneficiaries
    - teachers reached
    - teachers trained
    - teachers use ICT
    - teaching notes uploaded
    - trainees
    - trauma victims are offered support and counseling
    - women learn to read and write
    - women learn vocational skills
- If Education and Outreach:
    - communities helped
    - exhibitions created
    - sites interpreted
    - teaching programs 
- If eHealth:
    - e-courses
- If Entrepreneurship trainees:
    - entrepreneurship trainees
- If Equipment:
    - equipment installed
- If Eye care:
    - cataract operations
    - euros in medical equipment
    - postgraduate seminar trainees
- If Health:
    - children reached
    - health facilties reached
    - health workers trained
    - households have access to healthcare
    - people affected
    - people in communities reached
    - people reached
    - people with access to health care
    - pregnant women reached
    - trauma victims are offered support and counseling
- If Heritage Management:
    - communities helped
    - sites managed and conserved
    - students and/or staff trained
- If HIV / AIDS:
    - children / (childheaded) families taken care of
    - HIV/AIDS tested
    - increased awareness
    - medical staff receive HIV training
    - people reached by HIV socialization
- If HMIS:
    - local health clinics
    - trainees
- If Hygiene:
    - people reached with hygiene related communication
    - Persons who receive training/capacity building
- If ICT:
    - advocacy events organised
    - communities reached
    - computer software and hardware
    - information systems
    - internet connections
    - mobile devices
    - organisations trained
    - people affected
    - people impacted by ICT-improved org. services
    - staff trained
    - students and/or staff trained
    - students trained
    - trainees
    - users
    - years duration
- If Lobby and Advocacy:
    - areas where budget tracking is on meeting agenda
    - NGOs using integrated Sustainability Instrument
    - of initiatives to influence water resource policy
    - organisations focus on human rights
    - organisations strengthened 
- If Medical training:
    - trainees
- If Mobiles for Development:
    - daily SMS on market info.
    - people reached
    - SMS send monthly
- If Networking:
    - active WASH coordination structures
    - district level WASH programs implemented 
    - marginalized groups active in WASH community group
    - women active in WASH community group 
- If Raising awareness:
    - health training materials
    - increased awareness
    - people reached
    - trainees
    - with access to health information
- If Sanitation:
    - households reached
    - hygiene facilities
    - institutions with improved sanitation facilities
    - people affected
    - people use improved sanitation facilities
    - sanitation systems
    - years duration
- If Small Business Development:
    - business centers
    - micro-finance bodies
    - new clients/customers
    - new jobs
    - people running sustainable business
    - radio station
    - trainees
- If Social Enterprise Development:
    - new partnerships
- If Telemedicine:
    - consultations 
    - health centers using telemedicine
    - hospitals using telemedicine
    - medical cases uploaded
    - people affected
    - staff trained
    - users
    - years duration
- If Training:
    - new jobs
    - trainees
- If Vocational Training:
    - schools reached
    - students reached
    - teachers reached
    - teachers trained
    - women learn vocational skills
- If Water:
    - communities reached
    - households reached
    - people affected
    - people in communities reached
    - people receive training 
    - people use improved drinking water
    - water systems
    - years duration
- If Webbased tools:
    - hospitals
    - local health clinics