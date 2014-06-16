## API Resources

In order to make calls to the API for commonly used features, we have started to create cusotmised resources to provide the exact information that is needed.

#### Project Update Resource

We have created a resource to encapsulate all the information required to read and display a Project Update within a website or other visual interface.

http://rsr.akvo.org/api/v1/project_update_extra/?format=json

This resource contains the following information:

```
    "absolute_url": "/project/880/update/5077/",
    "id": 5077,
    "language": "en",
    "notes": "",
    "photo": "/media/db/project/880/update/5077/ProjectUpdate_5077_photo_2014-04-10_11.13.26.jpg",
    "photo_caption": "",
    "photo_credit": "",
    "photo_location": "E",
    "project": "/api/v1/project/880/",
    "resource_uri": "/api/v1/project_update_extra/5077/",
    "text": "To increase storage capacity of water sources and accessibility for domestic and multiple uses of water by the community CARE WASH program has constructed 20,,000 cubic metres pan for Antut community. The pan of its kind is improved one with infiltration gallery, well fenced and has VIP latrine. Community appreciated the work. The ongoing construction work is at the final stage of installation of hand pump.\n",
    "time": "2014-04-10T11:13:26",
    "time_last_updated": "2014-04-10T11:13:26",
    "title": "Construction of new water pan - Antut",
    "update_method": "M",
    "user": {
        "full_name": "Dima Bonaya",
        "organisation": {
            "absolute_url": "/organisation/1194/",
            "long_name": "CARE International in Kenya ",
            "name": "CARE - Kenya",
            "resource_uri": "/api/v1/organisation/1194/"
        },
        "resource_uri": "/api/v1/user/1203/"
    },
    "user_agent": "Akvo RSR Up v1.0 on Android 2.3.6 device samsung GT-S5830i",
    "uuid": "77eefef4-098f-4ccb-966c-db8faf3e9396",
    "video": "",
    "video_caption": "",
    "video_credit": ""
```

#### Map for Project Resource

We have created a resource that provides all the information about projects that is needed to visualise them on a map including population of an info window that gives extra information about the point selected. This includes the location, title and image information.

http://rsr.akvo.org/api/v1/map_for_project/?format=json

This resource contains the following information:

```
	"absolute_url": "/project/2019/",
	"budget": "49258.00",
	"created_at": "2014-06-04T16:59:01",
	"currency": "EUR",
	"current_image": {

	    "original": "/media/db/project/2019/Project_2019_current_image_2014-06-04_17.00.13.jpg",
	    "thumbnails": {
	        "fb_thumb": "/media/db/project/2019/Project_2019_current_image_2014-06-04_17.00.13_jpg_200x200_pad_q85.jpg",
	        "map_thumb": "/media/db/project/2019/Project_2019_current_image_2014-06-04_17.00.13_jpg_160x120_autocrop_detail_q85.jpg"
	    }

	},
	"current_image_caption": "",
	"current_image_credit": "",
	"date_complete": "2016-06-04",
	"date_request_posted": "2014-06-04",
	"donate_button": true,
	"funds": "0.00",
	"funds_needed": "49258.00",
	"id": 2019,
	"language": "en",
	"last_modified_at": "2014-06-15T09:00:03",
	"primary_location": {

	    "address_1": "",
	    "address_2": "",
	    "city": "Bilibiza",
	    "country": "/api/v1/country/53/",
	    "id": 4956,
	    "latitude": -12.566667,
	    "longitude": 40.283333,
	    "postcode": "",
	    "primary": true,
	    "resource_uri": "/api/v1/project_map_location/4956/",
	    "state": ""

	},
	"project_plan_summary": "This project will:\r\n1 Strengthen local partner GSB to become a WASH production & training center\r\n2 Provide 5000 people with water and sanitation via ground water recharge, hand dug or drilled wells, Rope pumps, household water filters, improved latrines etc\r\n3 Focus water activities on Self-supply for income generating via small scale irrigation by training of smallholder farmers. ",
	"resource_uri": "/api/v1/map_for_project/2019/",
	"status": "H",
	"subtitle": "Production & Training centre for Low cost WASH Solutions",
	"target_group": "The rural population who belong to the poorest people in Mozambique. Only 22.6% of the households reported that they produce enough food. Between 16% and 42% of the population have access to water from protected wells. Very few people have a latrine.\r\n\r\nVillages will be selected on occurrence of water borne diseases like cholera, willingness to start a Farmers Club, willingness to assist with installing WASH facilities and set up Water Committees and payment for maintenance and repairs.",
	"title": "Water for Bilibiza"
```

#### Map for Organisation Resource

We have created a resource that provides all the information about organisations that is needed to visualise them on a map including population of an info window that gives extra information about the point selected. This includes the location, title and image information.

http://rsr.akvo.org/api/v1/map_for_organisation/?format=json

This resource contains the following information:

```
    "absolute_url": "/organisation/411/",
    "allow_edit": true,
    "contact_email": "info@1procentclub.nl",
    "contact_person": "Bart Lacroix",
    "created_at": true,
    "fax": "",
    "iati_org_id": null,
    "id": 411,
    "language": "en",
    "last_modified_at": true,
    "logo": {
        "original": "/media/db/org/411/Organisation_411_logo_2011-09-05_14.11.13.png",
        "thumbnails": {
            "fb_thumb": "/media/db/org/411/Organisation_411_logo_2011-09-05_14.11.13_png_200x200_pad_q85.jpg",
            "map_thumb": "/media/db/org/411/Organisation_411_logo_2011-09-05_14.11.13_png_160x120_autocrop_q85.jpg"
        }
    },
    "long_name": "Stichting 1%CLUB",
    "mobile": "",
    "name": "1%Club",
    "new_organisation_type": 22,
    "notes": "",
    "organisation_type": "N",
    "phone": "",
    "primary_location": {
        "address_1": "'s-Gravenhekje 1A",
        "address_2": "",
        "city": "Amsterdam",
        "country": "/api/v1/country/3/",
        "id": 1,
        "latitude": 52.3723,
        "longitude": 4.907987,
        "postcode": "1011 TG",
        "primary": true,
        "resource_uri": "/api/v1/organisation_map_location/1/",
        "state": "Noord-Holland"
    },
    "resource_uri": "/api/v1/map_for_organisation/411/",
    "url": "http://www.onepercentclub.com/"
```


#### Project Map Location

This resource provides only the basic location information about projects that allow points to be populated on a map. No further contextual information is provided within this resource.

http://rsr.akvo.org/api/v1/project_map_location/?format=json

This resource contains the following information:

```
    "address_1": "",
    "address_2": "",
    "city": "",
    "country": "/api/v1/country/13/",
    "id": 4969,
    "latitude": 48.878416,
    "longitude": 2.320922,
    "postcode": "",
    "primary": true,
    "resource_uri": "/api/v1/project_map_location/4969/",
    "state": ""
```


#### Organisation Map Location

This resource provides only the basic location information about organisations that allow points to be populated on a map. No further contextual information is provided within this resource.

http://rsr.akvo.org/api/v1/organisation_map_location/?format=json

This resource contains the following information:

```
    "address_1": "36 Beaumont Street",
    "address_2": "",
    "city": "Oxford",
    "country": "/api/v1/country/39/",
    "id": 1972,
    "latitude": 51.755095,
    "longitude": -1.260939,
    "postcode": "OX1 2PG",
    "primary": true,
    "resource_uri": "/api/v1/organisation_map_location/1972/",
    "state": ""
```

#### Right now in Akvo

This resouce provides the high level figures that are presented within our overview at Akvo.org.

http://rsr.akvo.org/api/v1/right_now_in_akvo/?format=json

This resource contains the following information:

```
    "number_of_organisations": 1883,
    "number_of_projects": 1773,
    "people_served": 4025000,
    "projects_budget_millions": 868.8
```