# RSR API

Akvo RSR provides an API into its data. Currently it's a read-only, RESTish API with an emphasis on discoverability. The data is accessed through what we call **resources**, where a resource roughly corresponds to a table in the database.

When using the Akvo RSR API, please respect our API Code of Conduct: http://www.akvo.org/web/akvo-rsr-api-code-of-conduct

-----

### Table of contents
* [Introduction: example resource](#wiki-introduction-example-resource)
* [Objects and meta information](#wiki-objects-and-meta-information)
* [Schemas](#wiki-schemas)
* [Construcing URLs](#wiki-constructing-urls)
* [Filtering](#wiki-filtering)
* [Filtering on related resources](#wiki-filtering-on-related-resources)
* [Restricted resources and API authentication](#wiki-restricted-resources-and-api-authentication)
* [Inline data from related resources](#wiki-inline-data-from-related-resources)

-----

<a id="introduction-example-resource"></a>
## Introduction: example resource

The API lives under [http://www.akvo.org/api/v1/](http://www.akvo.org/api/v1/?format=json)

For instance to get a list of project locations you request http://www.akvo.org/api/v1/project_location/?format=json

Doing that will return a JSON object (here shortened and formatted for readability):

```js
    {
        "meta": {
            "limit": 20,
            "next": "/api/v1/project_location/?offset=20&limit=20&format=json",
            "offset": 0,
            "previous": null,
            "total_count": 640
        },
        "objects": [{
            "address_1": "",
            "address_2": "",
            "city": "Kake II",
            "country": "/api/v1/country/8/",
            "id": "1",
            "latitude": 4.630153,
            "longitude": 9.363441,
            "postcode": "",
            "primary": true,
            "project": "/api/v1/project/578/",
            "resource_uri": "/api/v1/project_location/1/",
            "state": ""
        }, {
            "address_1": "",
            "address_2": "",
            "city": "",
            "country": "/api/v1/country/81/",
            "id": "2",
            "latitude": 9.30769,
            "longitude": 2.315834,
            "postcode": "",
            "primary": true,
            "project": "/api/v1/project/577/",
            "resource_uri": "/api/v1/project_location/2/",
            "state": ""
        },
        // … 18 more objects
        ]
    }
```

The default data format is JSON, but you’ll need to add **?format=json** when playing with the API in a browser. This is because of browser idiosyncrasies, they request different formats by default, so rather than the API guessing you have to be explicit when experimenting! When accessing it programmatically it should only be needed if you want XML or JSONP, like http://www.akvo.org/api/v1/project_location/?format=xml. Tip: a nice syntax high-lighting plugin for Chrome is [Sight](https://chrome.google.com/webstore/detail/epmaefhielclhlnmjofcdapbeepkmggh). It works very well for viewing JSON. Both Safari and Firefox render XML pretty well by default.

Note: In this document we use JSON in most cases when discussing the data returned and the URLs include format=json to make them accessible as browser links. However XML can be substituted everywhere and the conversion of the data formatting is fairly obvious. Compare the two if you need to clarify something.

<a id="objects-and-meta-information"></a>
## Objects and meta information

Continuing the example above, the data returned is a number of objects of the type requested in the **“objects”** list, and a **“meta”** object with information about the data.

**“meta”** holds information about the maximum number of objects returned in **“limit”** and the total number of objects in **“total\_count”**. In the example here there are 640 **project\_location** objects. The default limit is 20 so if there are more than 20 objects you will get the first 20. This can be changed by adding to the URL. http://www.akvo.org/api/v1/project_location/?format=json&limit=50 would return the first 50 project locations, and http://www.akvo.org/api/v1/project_location/?format=json&limit=0
returns all of them.

There may also be information about where to get more objects from the resource. If there are more objects than the value of  **“limit”**, the **“next”** and **“previous”** fields hold information about the paths to the corresponding groups of objects. To access the next batch of 20 project locations in the example you would use the value of **meta["next"]**, **"/api/v1/project\_location/?offset=20&limit=20&format=json"**, concatenate it with the domain, to call http://www.akvo.org/api/v1/project_location/?offset=20&limit=20&format=json. Tip: When implementing code that uses the API it's a good idea to separate the domain into a constant when constructing URLs, to easily be able to update it if we change the domain where the API lives.

The data of each object holds one meta data attribute, **"resource_uri"**, the value of which is the path to that particular object when accessed via the API.

<a id="schemas"></a>
## Schemas

Each resource object holds a number of data fields. To find more information about the fields that make up a resource you can add **schema/** to the root URL for the resource. The schema for the project location resource is found at http://www.akvo.org/api/v1/project_location/schema/?format=json.

The schema returns an object with the following fields:

* **"allowed\_detail\_http\_methods"** Listing the methods the API can be accessed with when a single object is involved
* **"allowed\_list_http\_methods"** Listing the methods allowed when a list of objects is involved
* **"default\_format"** The default serialization format that is returned. Currently JSON is the default globally.
* **"default\_limit"** The default number of objects returned by the listing URL. Currently 20.
* **"fields"** An object made up of objects, one for each field on the resource
* **"filtering"** The fields that can be filtered on and how

Each object in the **"fields"** object is named after the field on the resource it represents and the attributes provide detail about the field. Most of the field attributes should be self explanatory but fields that have the attribute **"type": "related"** are worth discussing.

Each resource roughly represents a table in the database and each field on the resource corresponds to one column in a database table, also roughly. However resource fields of **"type": "related"** represent database foreign key fields and when requesting data they do not by default return the data of the related resource, but rather the *path* to that resource in the API.

Example: In the schema for **project\_location** there are two fields having **“type”: “related”, “country”** and **“project”**. In the example resource above we see **“country”: “/api/v1/country/8/”** in the first project location, so to get the country data we request http://www.akvo.org/api/v1/country/8/?format=json

The schema also returns a **“filtering”** object that holds filtering options for the resource. In the schema for **project_location** the filtering looks like:

```js
    "filtering": {
        "country": 2,
        "latitude": 1,
        "longitude": 1,
        "primary": 1,
        "project": 2
    }
```

The attributes on the **"filtering"** object are the fields where filtering can be applied. An attribute with value **1** means it is filtered using values of the field, a field with value **2** is a foreign key field and can be filtered using the foreign key value *or other filterable fields on the related resource*. For example to get all project locations for the project with **“id”: 42** we would visit http://www.akvo.org/api/v1/project_location/?format=json&project=42. More on filtering [below](#wiki-filtering).

### Other ways of accessing the data

Each resource is accessible in similar ways by requesting URLs with paths constructed using the same patterns.

Examples of ways to access the project location resource:

* http://www.akvo.org/api/v1/project_location/?format=json Get the first 20 project locations

* http://www.akvo.org/api/v1/project_location/1/?format=json A single project location object, with “id” = 1. Note that  data does not include any meta data.

* http://www.akvo.org/api/v1/project_location/schema/?format=json The schema for the resource

* http://www.akvo.org/api/v1/project_location/set/1;2;4?format=json A set of objects identified by “id”. No meta data is included here either.

<a id="constructing-urls"></a>
## Construcing URLs

The root URL of the API, http://www.akvo.org/api/v1/?format=json, returns a list of all resources currently available. Given this information we can construct URLs for all resources.

http://www.akvo.org/api/v1/?format=json returns the following:

```js
    {
        "benchmark": {
            "list_endpoint": "/api/v1/benchmark/",
            "schema": "/api/v1/benchmark/schema/"
        },
        "benchmarkname": {
            "list_endpoint": "/api/v1/benchmarkname/",
            "schema": "/api/v1/benchmarkname/schema/"
        },
        "budget_item": {
            "list_endpoint": "/api/v1/budget_item/",
            "schema": "/api/v1/budget_item/schema/"
        },
        "budget_item_label": {
            "list_endpoint": "/api/v1/budget_item_label/",
            "schema": "/api/v1/budget_item_label/schema/"
        },
        "category": {
            "list_endpoint": "/api/v1/category/",
            "schema": "/api/v1/category/schema/"
        },
        "country": {
            "list_endpoint": "/api/v1/country/",
            "schema": "/api/v1/country/schema/"
        },
        "focus_area": {
            "list_endpoint": "/api/v1/focus_area/",
            "schema": "/api/v1/focus_area/schema/"
        },
        "goal": {
            "list_endpoint": "/api/v1/goal/",
            "schema": "/api/v1/goal/schema/"
        },
        "invoice": {
            "list_endpoint": "/api/v1/invoice/",
            "schema": "/api/v1/invoice/schema/"
        },
        "link": {
            "list_endpoint": "/api/v1/link/",
            "schema": "/api/v1/link/schema/"
        },
        "organisation": {
            "list_endpoint": "/api/v1/organisation/",
            "schema": "/api/v1/organisation/schema/"
        },
        "organisation_location": {
            "list_endpoint": "/api/v1/organisation_location/",
            "schema": "/api/v1/organisation_location/schema/"
        },
        "partnership": {
            "list_endpoint": "/api/v1/partnership/",
            "schema": "/api/v1/partnership/schema/"
        },
        "project": {
            "list_endpoint": "/api/v1/project/",
            "schema": "/api/v1/project/schema/"
        },
        "project_comment": {
            "list_endpoint": "/api/v1/project_comment/",
            "schema": "/api/v1/project_comment/schema/"
        },
        "project_location": {
            "list_endpoint": "/api/v1/project_location/",
            "schema": "/api/v1/project_location/schema/"
        },
        "project_update": {
            "list_endpoint": "/api/v1/project_update/",
            "schema": "/api/v1/project_update/schema/"
        },
        "user": {
            "list_endpoint": "/api/v1/user/",
            "schema": "/api/v1/user/schema/"
        },
        "user_profile": {
            "list_endpoint": "/api/v1/user_profile/",
            "schema": "/api/v1/user_profile/schema/"
        }
    }
```

<a id="url-construction"></a>
URLs to all resources are created by using the pattern `http:/(domain)/(list_endpoint)[optional_path_info][optional_query_info]`

 *  **(domain)** is currently www.akvo.org but this may change in the future
 *  **(list_endpoint)** is the value of one of the “list_endpoint” fields in the listing returned by the root URL above
 *  **[optional_path_info]** can be on the form
      * **&lt;id&gt;/** One object with a known ID
      * **set/&lt;id1;id2...&gt;/** A set of objects with known IDs
      * **schema/** The schema for the resource
      * or nothing at all
 *  **[optional_query_info]** is the query string. Prepend with **?** and concatenate with **&**. Available identifiers are:
      * **format=json | jsonp | xml** JSON is default so this is not needed when accessing the API programmatically, however a format is always needed when you experiment with the API using a browser
      * **callback=&lt;callback name&gt; used when format=jsonp to set the name of the callback function. Default name is "callback".
      * **limit=&lt;max number of objects returned, 0 returns all objects&gt;**
      * **offset=&lt;order of the first object returned&gt;**
      * **&lt;field to filter on and filtering method&gt;=&lt;value&gt;** More on this [below](#wiki-filtering)
      * **depth=&lt;integer from 1 to 6&gt;** More on this [below](#wiki-inline-data-from-related-resources)
      * **full=True** Used with depth, more on this [below](#wiki-full-inline-data)
      * **distinct=True** In some cases thei is needed to eliminate duplicates
      * **username=&lt;Akvo account user name&gt;**
      * **api_key=&lt;Akvo account API key&gt;**

### Nomenclature

This document is centered around what we call **resources**, a set of data that is accessed through a call to the API. As previously mentioned an API resource roughly corresponds to one table in the Akvo RSR database. When discussing the data structure we also use the term **model** to indicate a logical chunk of data and the operations that can be performed on that chunk, such as a **Project update** or an **Organisation** model. The terms model and resource both relate closely to an underlying database structures, but all three terms differ in detail. For example some of the fields in the models and resources are "virtual", they have no direct counterpart in the database and the field names may differ slightly between all three. When working with the API always use the schema to find out what is available and how it is named from the API point of view.

<a id="filtering"></a>
## Filtering

The API can be queried in various ways to return only those objects that match one or more filter criteria. For the purposes of filtering there are two kinds of fields, foreign key fields and all others. This can be seen in the schemas, where a meta data object called **"filtering"** shows what fields can be filtered on.

Example: the **"filtering"** object in the **project_update** resource schema looks like:

```js
    "filtering": {
        "project": 2,
        "time": 1,
        "time_last_updated": 1,
        "title": 1,
        "update_method": 1,
        "user": 2
    }
```

The fields with a value of **1** can be filtered using search strings relevant to the field in conjunction with comparison operators such as "greater than" or "contains". Fields with a value of **2** are foreign keys and can be filtered using the IDs of the related resource _or using fields on the related resource_. This allows very powerful filters to be set up.

### Filtering examples:

#### All projects with "water" in their title
 - Resource: **project**
 - Filtering string: **title__icontains=water**
 - Full URL: http://www.akvo.org/api/v1/project/?format=json&title__icontains=water
 - Discussion: There are several operators that can be applied to a field filtered on. They are specified by appending them to the field name, separated by a double underscore, **"__"**. The **icontains** operator matches fields with the search string somewhere in the text, ignoring any case differences. To search only for titles starting with "Water" (case sensitive) use **title\_\_startswith=Water**.

####Project updates created after June 2012 for project 222
- Resource: **project_update**
- Filtering string: **project=222&time__gt=2012-06-30**
- Full URL: http://www.akvo.org/api/v1/project_update/?format=json&project=222&time__gt=2012-06-30
- Discussion: The **\_\_gt** operator is greater than (&gt;). To specify a date range use **\_\_gt** and **\_\_lt** (less than, &lt;) in combination. There is also **\_\_gte**, greater than or equal (&gt;=) and **\_\_lte**, less than or equal (&lt;=).

#### Find projects without any updates
- Resource: **project**
- Filtering string: **project\_updates__isnull=True**
- Full URL: http://www.akvo.org/api/v1/project/?format=json&project_updates__isnull=True
- Discussion: The **\_\_isnull** operator filters on the underlying database field being NULL or not. In this example the filter will return all projects where the **"project\_updates"** field is NULL meaning the project has no project updates. **project\_updates__isnull=False** can be used to find only project with updates.

<a id="filtering-on-related-resources"></a>
## Filtering on related resources

Filtering can be applied using fields other than those of the resource returned. This works when the requested resource has a foreign key field to the resource filtered on. It works across multiple relations and across the reverse of a foreign key. The Akvo RSR data models that are published through the API as resources are organised like this:

<a id="model-relationships-diagram"></a>
<img src="https://docs.google.com/drawings/pub?id=1Plg2YptcCkArpkISWxxySoJ-C8LEVIU-qsEDcLnIino&amp;w=920&amp;h=596">

As shown in the diagram the **Project** model is central to the data structure of Akvo RSR. With the help of the diagram and the schema filtering on related resources can be set up.

### Examples

#### All project locations of project 580
- Resource: **project_location**
- Filtering string: **project=580**
- Full URL: http://www.akvo.org/api/v1/project_location/?format=json&project=580
- Discussion: The fields on a resource representing foreign keys can be discovered using the schema. The schema for project_location looks like this:

```js
    {
      "allowed_detail_http_methods": ["get"],
      "allowed_list_http_methods": ["get"],
      "default_format": "application/json",
      "default_limit": 20,
      "fields": {
        "address_1": {
          "blank": false,
          "default": "",
          "help_text": "(255 characters).",
          "nullable": false,
          "readonly": false,
          "type": "string",
          "unique": false
        },
        "address_2": {
          "blank": false,
          "default": "",
          "help_text": "(255 characters).",
          "nullable": false,
          "readonly": false,
          "type": "string",
          "unique": false
        },
        "city": {
          "blank": false,
          "default": "",
          "help_text": "(255 characters).",
          "nullable": false,
          "readonly": false,
          "type": "string",
          "unique": false
        },
        "country": {
          "blank": false,
          "default": "No default provided.",
          "help_text": "A single related resource. Can be either a URI or set of nested resource data.",
          "nullable": false,
          "readonly": false,
          "type": "related",
          "unique": false
        },
        "id": {
          "blank": false,
          "default": "",
          "help_text": "Unicode string data. Ex: \"Hello World\"",
          "nullable": false,
          "readonly": false,
          "type": "string",
          "unique": true
        },
        "latitude": {
          "blank": false,
          "default": 0,
          "help_text": "Go to <a href='http://itouchmap.com/latlong.html' target='_blank'>iTouchMap.com</a> to get the decimal coordinates of your project.",
          "nullable": false,
          "readonly": false,
          "type": "float",
          "unique": false
        },
        "longitude": {
          "blank": false,
          "default": 0,
          "help_text": "Go to <a href='http://itouchmap.com/latlong.html' target='_blank'>iTouchMap.com</a> to get the decimal coordinates of your project.",
          "nullable": false,
          "readonly": false,
          "type": "float",
          "unique": false
        },
        "postcode": {
          "blank": false,
          "default": "",
          "help_text": "(10 characters).",
          "nullable": false,
          "readonly": false,
          "type": "string",
          "unique": false
        },
        "primary": {
          "blank": false,
          "default": true,
          "help_text": "Boolean data. Ex: True",
          "nullable": false,
          "readonly": false,
          "type": "boolean",
          "unique": false
        },
        "project": {
          "blank": false,
          "default": "No default provided.",
          "help_text": "A single related resource. Can be either a URI or set of nested resource data.",
          "nullable": false,
          "readonly": false,
          "type": "related",
          "unique": false
        },
        "resource_uri": {
          "blank": false,
          "default": "No default provided.",
          "help_text": "Unicode string data. Ex: \"Hello World\"",
          "nullable": false,
          "readonly": true,
          "type": "string",
          "unique": false
        },
        "state": {
          "blank": false,
          "default": "",
          "help_text": "(255 characters).",
          "nullable": false,
          "readonly": false,
          "type": "string",
          "unique": false
        }
      },
      "filtering": {
        "country": 2,
        "latitude": 1,
        "longitude": 1,
        "primary": 1,
        "project": 2
      }
    }
```

The fields with **"type": "related"** are foreign keys (or their reverse, more on that [below](#wiki-reverse-foreign-keys)). The **project\_location** resource related fields are **"project"** and **"country"**. Using this information a filter returning all locations related to a certain project is created using the **__** delimiter between the related fields of the resources.

#### All project updates for project with ID 222 or ID 361
- Resource: **project_update**
- Filtering string: **project\_\_in=222&project\_\_in=361**
- Full URL: http://www.akvo.org/api/v1/project_update/?format=json&project__in=222&project__in=361
- Discussion: When filtering for multiple objects we use the **__in** operator on the field. Because of how query-strings work the **field=value** pair has to be repeated for each value. (Note that this is not needed when you have a set of IDs of the objects you want. In that case you use the set/ optional path info instead. See [above](#wiki-url-construction).)

#### All projects in Uganda:
 - Resource: **project**
 - Filtering string: **locations\_\_country\_\_iso_code=ug**
 - Full URL: http://www.akvo.org/api/v1/project/?format=json&locations__country__iso_code=ug
 - Discussion: Using the schemas we see that the **project\_location** resource is referred to by the **"locations"** field in the project resource. (More on that in the next paragraph.) A filter can span multiple relations. That is used to filter on the **"iso\_code"** field of the **country** resource, via the **project\_location** resource. When creating these kinds of filters always trace through the relations starting at the requested resource, using the respective related fields for each step of the trace and possibly, as in this example, end the trace with a field on the "destination" resource.

<a id="reverse-foreign-keys"></a>
### Reverse foreign keys
The unidirectional arrows in the diagram represent foreign key fields on the model where the arrows originate. But as we've seen in the latest example a foreign key field is represented "at both ends" of the resources. Looking at the **Partnership** model, it is used to connect organisations to the projects they are a partner to. **Partnership** has a foreign key field, *project*, that relates to a project, and another foreign key, *organisation*, relating to an organisation, thus creating the link between organisation and project. In the API the **partnership** resource has the corresponding fields **"project"** and **"organisation"** of **"type": "related"** as expected. However there are also fields on the project and organisation resources, both named **"partnerships"** that also are of **"type": "related"**. These fields return sets of **partnership** objects that the project and organisation are related to, by following the partnership foreign keys in reverse. The **"partnerships"** fields on the **project** and **organisation** resources have no corresponding fields in the models or database layer, but are a construct of the API framework to provide for symmetrical access to related resources.

#### All projects that organisation 42 is a partner to
- Resource: **project**
- Filtering string: **partnerships__organisation=42**
- Full URL: http://www.akvo.org/api/v1/project/?format=json&partnerships__organisation=42
- Discussion: Here we use the **"partnerships"** field on the **project** resource and the **"organisation"** field on the **partnership** resource to create the filter. In most cases the the related fields are named after the resource they relate to, in plural if the relationship is a many-to-many relation or the reverse of a foreign key. (This is not entirely consistent unfortunately, use the schema to verify the correct field names.)

<a id="restricted-resources-and-api-authentication"></a>
## Restricted resources and API authentication

The **User** and **UserProfile** models in Akvo RSR hold information that is in part private, either to Akvo, or to the organisation the user is registered with. For this reason the API resources **user** and **user\_profile** are also restricted in the information they return. To directly access the **user** and **user\_profile** resources the username of a user registered with Akvo and an associated an API key is required as part of the query string.

<a id="api-key"></a>
A user registered with Akvo that has access to the user profiles in the admin of Akvo RSR (Must have at least organisation administrator privileges) can generate an API key for any user with at least project editor privileges belonging to the same organisation. The key is generated automatically when the **User profile** form is saved in the Akvo RSR admin interface. The querystring needed for access is listed in the User profile form for the user.

By default, only the **first\_name**, **last\_name** and **last\_login** fields of the **User** model are returned by the **user** resource. When authenticated, the **user** objects includes the fields **"username"** and **"email"** for users _associated with the same organisation_ as the API key user. The **user** resource will also include the path the the related **user\_profile** resource, which in turn includes information about the user's organisation and privileges in the **"organisation"**, **"is\_org\_editor"** and **"is\_org\_admin"** fields.

### Examples

#### All users in Akvo RSR
- Resource: user
- Filtering string: none
- Full URL: http://www.akvo.org/api/v1/user/?format=json
- Discussion: If you try this in a browser you will get nothing back. Using **curl -v "http://www.akvo.org/api/v1/user/?format=json"** or similar on the command line  or using a browser developer tool you can see that the response to the request is HTTP/1.1 401 UNAUTHORIZED.

#### All Projects to which user 124 has contributed updates:
- Resource: **project**
- Filtering string: **project\_updates__user=124**
- Full URL: http://www.akvo.org/api/v1/project/?format=json&project_updates__user=124
- Discussion: This works, returning a list or projects to which user 124 has contributed project updates. We still get no actual user information though.

#### All users in Akvo RSR (2nd try)
- Resource: **user**
- Filtering string: none
- Full URL: http://www.akvo.org/api/v1/user/?format=json&api_key=8b92d9766d136613726737911d8116d896a7e1b3&username=gabriel
- Discussion: This URL doesn't work either, since we do not want to publish a working API key. You will have to substitute with an actual key using the method described [above](#wiki-api-key). Note that the user objects returned only contain **"first_name"**, **"last_name"** and **"last_login"** for users not associated with the same organisation as "your own".

<a id="inline-data-from-related-resources"></a>
## Inline data from related resources

Note: *When requesting inline data the resulting data sets can become quite large. Be mindful when requesting resources in this manner, and try to cache the resulting data sets rather than requesting them time and again.*

So far we have only seen data of one type of resource being returned. Using the path information to related resources included in a resource object's data the relevant related information can be requested subsequently. In many cases it makes sense to query the API for initial data that in turn allows you to request additional data based on the first reply. Some data can also be considered "semi-constant", like the list of countries, and for those resources it probably makes sense for an API consumer to query the resource, store the reply locally, and only re-query if an entry cannot be found in the local copy.

However in some cases you know what information you want and it is spread out over more than one resource. The API provides a query string variable, **depth**, to help in these situations. **depth** should be an integer between 1 and 5 and it indicates the number of relations the data is to span across.

### Inline data examples

#### Project number 222 along with all its project updates.
- Resource: **project**
- Filtering string: none
- Additional query string parameters: **format=json&depth=1**
- Full URL: http://www.akvo.org/api/v1/project/222/?format=json&depth=1
- Discussion: The resulting data set now includes the data of all resources directly related to the project. For each related resource the objects are included in a list that is the value of the related resource's field (JSON) or as a set of &lt;object&gt; nodes within a node named after the field and with the attribute **type="list"** (XML).

```js
    "project_updates": [{
        "id": "1638",
        "path": "/rsr/project/222/update/1638/",
        "photo": "http://www.akvo.org/rsr/media/db/project/222/update/1638/ProjectUpdate_1638_photo_2012-07-07_20.31.22.jpg",
        "photo_caption": "",
        "photo_credit": "",
        "photo_location": "E",
        "project": "/api/v1/project/222/",
        "resource_uri": "/api/v1/project_update/1638/",
        "text": "",
        "time": "2012-07-07T20:28:17",
        "time_last_updated": "2012-08-06T19:10:53",
        "title": "Finally water at the Nyanje school",
        "update_method": "W",
        "user": "/api/v1/user/222/",
        "video": "",
        "video_caption": "",
        "video_credit": ""
      }, {
        "id": "1637",
        "path": "/rsr/project/222/update/1637/",
        "photo": "http://www.akvo.org/rsr/media/db/project/222/update/1637/ProjectUpdate_1637_photo_2012-07-07_20.26.59.jpg",
        "photo_caption": "",
        "photo_credit": "",
        "photo_location": "E",
        "project": "/api/v1/project/222/",
        "resource_uri": "/api/v1/project_update/1637/",
        "text": "",
        "time": "2012-07-07T20:26:59",
        "time_last_updated": "2012-08-06T19:10:53",
        "title": "Drilling borehole Nyanje school",
        "update_method": "W",
        "user": "/api/v1/user/222/",
        "video": "",
        "video_caption": "",
        "video_credit": ""
      },
      // ... more project updates
    }],
```

```xml
    <object>
      <project_updates type="list">
        <object>
          <update_method>W</update_method>
          <photo_credit/>
          <photo_caption/>
          <title>Finally water at the Nyanje school</title>
          <photo>
            http://www.akvo.org/rsr/media/db/project/222/update/1638/ProjectUpdate_1638_photo_2012-07-07_20.31.22.jpg
          </photo>
          <video_credit/>
          <project>/api/v1/project/222/</project>
          <video_caption/>
          <photo_location>E</photo_location>
          <video/>
          <user>/api/v1/user/222/</user>
          <time>2012-07-07T20:28:17</time>
          <path>/rsr/project/222/update/1638/</path>
          <time_last_updated>2012-08-06T19:10:53</time_last_updated>
          <text/>
          <id>1638</id>
          <resource_uri>/api/v1/project_update/1638/</resource_uri>
        </object>
        <object>
          <update_method>W</update_method>
          <photo_credit/>
          <photo_caption/>
          <title>Drilling borehole Nyanje school</title>
          <photo>
            http://www.akvo.org/rsr/media/db/project/222/update/1637/ProjectUpdate_1637_photo_2012-07-07_20.26.59.jpg
          </photo>
          <video_credit/>
          <project>/api/v1/project/222/</project>
          <video_caption/>
          <photo_location>E</photo_location>
          <video/>
          <user>/api/v1/user/222/</user>
          <time>2012-07-07T20:26:59</time>
          <path>/rsr/project/222/update/1637/</path>
          <time_last_updated>2012-08-06T19:10:53</time_last_updated>
          <text/>
          <id>1637</id>
          <resource_uri>/api/v1/project_update/1637/</resource_uri>
        </object>
        ...
      </project_updates>
      ...
    </object>
```

#### Project number 222 along with all its project updates.
- Resource: **project_update**
- Filtering string: **project=222**
- Additional query string parameters: **format=json&depth=1**
- Full URL: http://www.akvo.org/api/v1/project_update/?format=json&depth=1&project=222
- Discussion: Basing the query on the **project_update** resource returns the data organized differently. There is more redundant data since the same **project** object is included in each project update.

In both these examples the returned data will include more than the "needed" information, since both project and project_update relate to other resources that also will be included in the data returned, but it is easy to find the objects you need using lookup. There is currently no way to specify only certain related resources to be returned, it's an all or nothing affair.

As can be seen in the [model relationships diagram](#wiki-model-relationships-diagram) some models are 5 foreign keys "away" from each other. This means that setting the depth to 5 will return all the data there is that is related to the resource requested. In most cases this will be true for depth=3 or depth=4.

#### All projects that organisation 42 is a partner to and information about all other organisations that are partners to those projects
- Resource: **project**
- Filtering string: **partnerships__organisation=42**
- Additional query string parameters: **format=json&depth=2**
- Full URL: http://www.akvo.org/api/v1/project/?format=json&depth=2&partnerships__organisation=42
- Discussion: When depth is set to 2 data from resources that span two foreign keys or their reverse are included in the data set. Starting at the **project** resource we trace through the **partnership** resource to the **organisation** resource.

<a id="full-inline-data"></a>
### Full inline data
Some relations between resources can be seen as "recursive", meaning that, given a large enough depth, the same resource may be passed several times when tracing relations. This is the case since relations between resources are traced "both ways" along foreign keys.

For example, a request for the **project** resource with a **depth=4** will be traced to the **partnership**, further along to the **organisation**, then *back* through the **"partnerships"** field on the **organisation** to the **partnership** resource again and then to the project. To limit the amount of data returned, the same resource is only included as full inline data the first time it is found when tracing the relations. If full data is required regardless of if it's been visited before or not **full=True** can be added to the query string. However in this case depth is limited to a maximum value of **3**, otherwise the data returned will "snowball" to ridiculous proportion.

## Further reading (deeply technical)

The Akvo RSR API is based on the Django app/framework called [Tastypie](http://django-tastypie.readthedocs.org/)

The filtering is based on the [Django ORM field lookup syntax](https://docs.djangoproject.com/en/1.4/ref/models/querysets/#field-lookups)

And then there is the Akvo RSR source code. You find the models defined [here](https://github.com/akvo/akvo-rsr/blob/master/akvo/rsr/models.py) and the API resources [here](https://github.com/akvo/akvo-rsr/blob/master/akvo/api/resources.py).