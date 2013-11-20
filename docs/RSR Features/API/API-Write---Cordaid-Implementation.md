We have partnered with Cordaid to provide the functionality to synchronise their Project Management System (Daisy) with RSR via the use of the Tastypie write API.

Additionally, the Cordaid website is setup to automatically synchronise to RSR, allowing their project information to be displayed Real-time on their website whilst removing any need for double entering of data.

Cordaid will deliver a Project Activity File every 3 months that will conform to IATI Standards. Additional information will be placed within the file to populate the additional fields present in RSR that are not part of the IATI Standard.

The project activity file will contain all projects ready to be published. This file may also include previously published projects. For these items, the objects should be updated with a PUT request and not replaced.

The following document, should include all the specifics when considering this implementation to ensure that all items are covered and can be dealt with in the correct way.


Process Issues or Highlights
----------------------------

Security  Justice
---
The Security & Justice Business Unit was not included within the Organsiation List and so some projects failed to load/loaded inaccurately.
All Participating Organisations and associated Business Units must be included within the information submitted.

Internal IDs
---
Every project should be assigned an Internal ID.
For Cordaid this is usually a 6 digit number - but is can also include non-numerical characters and be of a different length.
This is in addition to the IATI Identifier that an Organisation can use for the project.
This ID should be used when communicating about a project. The Akvo ID should also be used if known.
The Project Image may use the Internal ID as the filename to assign the Image to that project.

Funding Amounts & Donate Button
---
For all projects being loaded via the Cordaid File, they should appear publicly without the presence of the Donate Button.
This can be achieved by having funding information included within the XML file adding up to the total Budget of the project.
If the Funding information is not present, then Cordaid will be added as a Funding Partner for the remaining amount to ensure the project is showing as Fully Funded, and no Donate button is visible.

Multiple Organisation Entries
---
By default, the Organisation submitting the file is added as a Support Partner for the projects being loaded.
In the event that a different Organisation is being listed as the Accountable Partner in the IATI Standard, this needs to be checked.
As Cordaid will be listed as an alternative partner (Implementing Partner) for example, it is possible that an additional organisation is created in RSR.
A fix for this issue is being investigated, but this can be easily manually resolved post-import without much effort.

Text Formatting after analysis tools
---
Some analysis tools used for testing the file can insert unwanted formatting. A clean zipped and protected copy of the file should be made available on TeamWork system.


XML and Data Items related to the Import
----------------------------------------

Akvo namespace for non-IATI fields
---
All fields that are not part of the IATI schema should be placed within an Akvo namespace so that the file can be correctly read and analysedby both Akvo and IATI organisations.

Project Description Fields
---
There are many project description fields within RSR that are not part of IATI.
These can be used by using the akvo:type= for IATI Description fields.
The type should be from the following:
```text
Code    Name            Description
1       General         Long description of the activity with no particular structure
2       Objectives      Objectives for the activity, for example from a logical framework
3       Target Groups   Statement of groups targeted to benefit from the activity 
Akvo extensions:
4       Subtitle        A subtitle with more information on the project
5       Summary         A brief summary of the project
6       Background      Relevant background information
7       Project Plan    Detailed information about the project and plans for implementing: the what, how, who and when
8       Goal Overview   Describe what the project hopes to accomplish
9       Current status  Description of current phase of project
10      Sustainability  Plans for sustaining/maintaining results after implementation is complete
```
Locations
---
Every Location should include at least the following attributes:
- Latitude
- Logitude
- Country
A Location may also include additional fields. The IATI Location Type codes are listed where supported:
- City (PPLA, PPLA2, PPLC)
- State (PPL)
- Address 1
- Address 2 (ADM1, ADM2, FRM)
- Post Code

Goals
---
Up to 8 goals can be included, each with a description length of 100 characters.

Indicators
---
All Indicators to be used should be delivered separately to Akvo.
Each Indicator should be attached to a Business Unit and should not be more than 80 characters in length.
Each BU in RSR has it's own Category.
All new Indicators are loaded in to the BUs and are made available to be used when adding projects.
This is a series of scripts that is run after the import of the core data.

Photos & Logos
---
Each project being added should be accompanied by an image for the main project photo.
Each organisation being added should be accompanied by an image for the organisation logo.
Each image should be given a unique reference as the filename.
The unique reference must be included within the project or organisation record with the tags:
akvo:photo-id=
logo_id=

Participating Organisations
---
All Organisations involved with projects need to be consistently referenced. If the IATI Organisation Id is known for all Organisations then this can be used.
Alternatively, a unique reference number should be applied to all organisation with the tag:
internal-org-ref=
The Logo may use the Internal Org Ref as the filename to assign that image to the Organisation.

Additional Field Partner Role
---
If a field partner is selected then the following additional roles may be further identified:
- Alliance
- Knowledge
- Network

Organisation Types
---
We support the IATI Organisation Type Codes:
```text
Code    Name
10      Government
15      Other Public Sector
21      International NGO
22      National NGO
23      Regional NGO
30      Public Private Partnership
40      Multilateral
60      Foundation
70      Private Sector
80      Academic, Training and Research
```

Still to be confirmed
---------------------

Disclaimers
---
Displaying a disclaimer notice on behalf of some organisations/projects.

Region/Worldwide
---
Displaying a Region/Worldwide location.