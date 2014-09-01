# -*- coding: utf-8 -*-
#!/usr/bin/env python

"""
Script for generating an IATI file of an organisation, taking an organisation as input with
the possibility to select partner types and exclude individual projects.
"""

import os
os.environ['DJANGO_SETTINGS_MODULE'] = 'akvo.settings'

from datetime import datetime
from akvo.rsr.iati.iati_code_lists import IATI_LIST_ACTIVITY_STATUS, IATI_LIST_ORGANISATION_ROLE, IATI_LIST_SECTOR
from akvo.rsr.models import (Project, Organisation, Partnership, Goal, ProjectLocation, Country, BudgetItem,
                             BudgetItemLabel, InternalOrganisationID, Link, Benchmark, Benchmarkname, Category)

import sys, argparse, os.path, cgi
import akvo.rsr.iati_schema as schema


class MandatoryError(Exception):
    """Exception raised for mandatory field errors in a project.

    Attributes:
        title -- Project title
        project_id -- Project id
        node -- Node or information that is missing
    """

    def __init__(self, title, project_id, node):
        self.msg = "Error on project '%s' (id: %s); Mandatory information on '%s' is missing..." % \
                   (title, project_id, node)

def check_mandatory_fields(project, fields):
    """Checks whether the fields in the fields dict are not NULL. Raises a MandatoryError if so."""

    for field_key in fields:
        if fields[field_key] == "" or fields[field_key] is None:
            raise MandatoryError(project.title, project.pk, field_key)

def check_value(value):
    if value == "" or value is None:
        return False
    else:
        return True

def xml_enc(string):
    return cgi.escape(string, True).encode('utf-8')

def sector_mapping(category_id):
    """Returns a IATI sector based on the RSR category."""

    MAPPING = {
        1: 140,
        2: 140,
        4: 14081,
        5: 111,
        10: 22040,
        11: 22040,
        12: 32130,
        13: 32130,
        14: 15110,
        15: 12261,
        16: 13040,
        17: 12191,
        18: 11120,
        19: 12261,
        20: 121,
        21: 22040,
        22: 311,
        23: 12191,
        24: 11230,
        25: 122,
        26: 12261,
        27: 121,
        28: 121,
        32: 41040,
        33: 111,
        34: 12191,
        35: 11330,
        36: 22040,
        37: 220,
        38: 14010,
        39: 140,
        40: 240
    }

    try:
        sector_id = MAPPING[category_id]
    except:
        return "", ""

    if sector_id > 9999:
        for count, sector in enumerate(IATI_LIST_SECTOR):
            if sector[0] == sector_id:
                return sector_id, IATI_LIST_SECTOR[count][1]

    else:
        for count, sector in enumerate(IATI_LIST_SECTOR):
            if sector[3] == sector_id:
                return sector_id, IATI_LIST_SECTOR[count][4]



def iati_outcome(activity, benchmarks, benchmark_names, categories):
    """Collects all RSR benchmark information and adds them to the activity as results."""

    bm_categories = benchmarks.values_list('category_id', flat=True)
    categories_distinct = list()
    map(lambda x: not x in categories_distinct and categories_distinct.append(x), bm_categories)

    for category in categories_distinct:
        sector_id, sector_name = sector_mapping(category)
        if check_value(sector_id):
            sector_node = schema.sector(valueOf_=sector_name)
            sector_node.set_code(sector_id)
            activity.add_sector(sector_node)

        result_title = schema.textType(valueOf_=xml_enc(categories.get(id=category).name))
        result = schema.result(type_="2")
        result.add_title(result_title)

        for benchmark in benchmarks.filter(category_id=category):
            result_text = str(benchmark.value) + " " + benchmark_names.get(id=benchmark.name_id).name
            result_description = schema.textType(valueOf_=xml_enc(result_text))
            result.add_description(result_description)

        activity.add_result(result)

    return activity

def iati_links(activity, links):
    """Collects the website links of the RSR project and adds them to the activity."""

    for link in links:
        if check_value(link.url):
            website = schema.activity_website()
            website.set_valueOf_(xml_enc(link.url))

            if check_value(link.caption):
                website.set_anyAttributes_({"akvo:url-caption": xml_enc(link.caption)})

            activity.add_activity_website(website)

    return activity

def iati_participating_org(activity, project, participating_orgs):
    """Collects the participating organisations of the RSR project and adds it to the activity."""

    def organisation_role(role):
        """Converts the role of an RSR organisation to IATI codes and description.

        Participating organisation roles mapped to the RSR Organisation Roles:
        Accountable => Support, Implementing => Field, Funding => Funding, Extending => Sponsor"""

        if role == 'support':
            return IATI_LIST_ORGANISATION_ROLE[0][0]
        elif role == 'field':
            return IATI_LIST_ORGANISATION_ROLE[3][0]
        elif role == 'funding':
            return IATI_LIST_ORGANISATION_ROLE[2][0]
        elif role == 'sponsor':
            return IATI_LIST_ORGANISATION_ROLE[1][0]
        else:
            # This should never fire, the status of the project has been checked beforehand.
            raise MandatoryError(project.title, project.pk, "organisation role")

    for participating_org in participating_orgs:
        partnerships = Partnership.objects.filter(organisation_id=participating_org.pk, project_id=project.pk)

        for partnership in partnerships:

            participating_org_node = schema.participating_org()
            participating_org_node.set_role(organisation_role(xml_enc(partnership.partner_type)))

            if check_value(participating_org.long_name):
                participating_org_node.set_valueOf_(xml_enc(participating_org.long_name))
            elif check_value(participating_org.name):
                participating_org_node.set_valueOf_(xml_enc(participating_org.name))

            if check_value(participating_org.iati_org_id):
                participating_org_node.set_ref(xml_enc(participating_org.iati_org_id))

            if check_value(partnership.iati_url):
                participating_org_node.set_anyAttributes_({"akvo:iati": xml_enc(partnership.iati_url)})

            activity.add_participating_org(participating_org_node)

    return activity

def iati_budget(activity, budgets, project):
    """Collects budget of the RSR project and adds it to the activity."""

    # Ignore total budgets -- label 13 or 14 -- if not all budgets are a total budget
    if not all(budget.get_label() == 13 or 14 for budget in budgets):
        budgets = filter(lambda x: x.get_label() == 13 or 14, budgets)

    for budget in budgets:
        budget_node = schema.budget()

        budget_label = budget.get_label()

        if check_value(budget.amount):
            budget_value = schema.textType(valueOf_=budget.amount)

            if check_value(project.date_start_actual):
                budget_value.set_anyAttributes_({"value-date": project.date_start_actual})
            elif check_value(project.date_start_planned):
                budget_value.set_anyAttributes_({"value-date": project.date_start_planned})

            budget_node.add_value(budget_value)

        if check_value(budget_label):
            budget_node.set_anyAttributes_({"akvo:type": xml_enc(budget_label)})

        if check_value(budget.other_extra):
            budget_node.set_anyAttributes_({"akvo:description": xml_enc(budget.other_extra)})

        activity.add_budget(budget_node)

    return activity


def iati_location(activity, location, country):
    """Collects location of the RSR project and adds it to the activity."""

    location_node = schema.location()

    # Set value of location node. "<city>, <state>" if both are available.
    if check_value(location.city):
        if check_value(location.state):
            location_name = schema.textType(valueOf_=xml_enc(location.city + ", " + location.state))
            location_node.add_name(location_name)

        else:
            location_name = schema.textType(valueOf_=xml_enc(location.city))
            location_node.add_name(location_name)

        location_type = schema.textType(valueOf_="populated place")
        location_type.set_anyAttributes_({"code": "PPL"})
        location_node.add_location_type(location_type)

    elif check_value(location.state):
        location_name = schema.textType(valueOf_=xml_enc(location.state))
        location_node.add_name(location_name)

        location_type = schema.textType(valueOf_="first-order administrative division")
        location_type.set_anyAttributes_({"code": "ADM1"})
        location_node.add_location_type(location_type)

    coordinates = schema.coordinatesType(latitude=location.latitude, longitude=location.longitude)
    location_node.add_coordinates(coordinates)

    if check_value(country.name) and check_value(country.iso_code):
        administrative = schema.administrativeType(country=country.iso_code.upper(), valueOf_=xml_enc(country.name))

        location_node.add_administrative(administrative)

        # Add recipient-country node
        recipient_country_node = schema.recipient_country(code=country.iso_code.upper(), valueOf_=xml_enc(country.name))
        activity.add_recipient_country(recipient_country_node)

    if check_value(location.address_1):
        location_node.set_anyAttributes_({"akvo:address-1": xml_enc(location.address_1)})

    if check_value(location.address_2):
        location_node.set_anyAttributes_({"akvo:address-2": xml_enc(location.address_2)})

    if check_value(location.postcode):
        location_node.set_anyAttributes_({"akvo:post-code": xml_enc(location.postcode)})

    activity.add_location(location_node)

    return activity

def iati_photo(activity, project):
    """Collects the actual photo of the RSR project and adds it to the activity."""

    photo_url = "http://rsr.akvo.org/media/" + str(project.current_image)

    allowed_extensions = ["jpg", "jpeg", "png", "gif", "tiff", "bmp"]
    try:
        extension = str(project.current_image).rsplit('.',1)[1].lower()
    except:
        extension = ""

    document_link = schema.document_link(url=xml_enc(photo_url))

    if check_value(extension) and extension in allowed_extensions:
        document_link.set_format(xml_enc("image/" + extension))

    if check_value(project.current_image_caption):
        caption = schema.textType(valueOf_=xml_enc(project.current_image_caption))
        document_link.add_title(caption)

    if check_value(project.current_image_credit):
        document_link.set_anyAttributes_({"akvo:photo-credit": xml_enc(project.current_image_credit)})

    activity.add_document_link(document_link)

    return activity

def iati_goals(activity, goals):
    """Collects all goals as specified in the RSR project and adds them to the activity."""

    for goal in goals:
        if check_value(goal.text):
            goal_text = schema.textType(valueOf_=xml_enc(goal.text))
            result = schema.result(type_="1")
            result.add_title(goal_text)
            activity.add_result(result)

    return activity

def iati_contact(activity, organisation):
    """Collects contact information of the RSR organisation and adds it to the activity."""

    contact_node = schema.contact_info()

    if check_value(organisation.long_name):
        long_name = schema.textType(valueOf_=xml_enc(organisation.long_name))
        contact_node.add_organisation(long_name)
    elif check_value(organisation.name):
        org_name = schema.textType(valueOf_=xml_enc(organisation.name))
        contact_node.add_organisation(org_name)

    if check_value(organisation.url):
        contact_node.add_website(xml_enc(organisation.url))

    if check_value(organisation.phone):
        phone = schema.textType(valueOf_=xml_enc(organisation.phone))
        contact_node.add_telephone(phone)
    elif check_value(organisation.mobile):
        mobile = schema.textType(valueOf_=xml_enc(organisation.mobile))
        contact_node.add_telephone(mobile)

    if check_value(organisation.contact_person):
        person = schema.textType(valueOf_=xml_enc(organisation.contact_person))
        contact_node.add_person_name(person)

    if check_value(organisation.contact_email):
        email = schema.textType(valueOf_=xml_enc(organisation.contact_email))
        contact_node.add_email(email)

    activity.add_contact_info(contact_node)

    return activity

def iati_activity(activity, project):
    """Collects all underlying nodes of the <iati-activity> node and adds them to the activity."""

    def project_status():
        """Converts the status of the RSR project to IATI codes and description.

        Mapped to the RSR Project Status: Pipeline/identification => Needs Funding,
        Implementation => Active, Completion => Completed, Post-completion => Completed, Cancelled => Cancelled."""

        if project.status == Project.STATUS_NEEDS_FUNDING:
            return IATI_LIST_ACTIVITY_STATUS[0][0], IATI_LIST_ACTIVITY_STATUS[0][1]
        elif project.status == Project.STATUS_ACTIVE:
            return IATI_LIST_ACTIVITY_STATUS[1][0], IATI_LIST_ACTIVITY_STATUS[1][1]
        elif project.status == Project.STATUS_COMPLETE:
            return IATI_LIST_ACTIVITY_STATUS[2][0], IATI_LIST_ACTIVITY_STATUS[2][1]
        elif project.status == Project.STATUS_ARCHIVED:
            return IATI_LIST_ACTIVITY_STATUS[3][0], IATI_LIST_ACTIVITY_STATUS[3][1]
        elif project.status == Project.STATUS_CANCELLED:
            return IATI_LIST_ACTIVITY_STATUS[4][0], IATI_LIST_ACTIVITY_STATUS[4][1]
        else:
            # Impossible to have another status
            raise MandatoryError(project.title, project.pk, "status")

    # Title
    activity.add_title(schema.textType(valueOf_=xml_enc(project.title)))

    # Subtitle
    subtitle = schema.description(type_="1",valueOf_=xml_enc(project.subtitle))
    subtitle.set_anyAttributes_({"akvo:type":"4"})
    activity.add_description(subtitle)

    # Project plan summary
    pps = schema.description(type_="1",valueOf_=xml_enc(project.project_plan_summary))
    pps.set_anyAttributes_({"akvo:type":"5"})
    activity.add_description(pps)

    # Background
    if check_value(project.background):
        background = schema.description(type_="1",valueOf_=xml_enc(project.background))
        background.set_anyAttributes_({"akvo:type":"6"})
        activity.add_description(background)

    # Project plan
    if check_value(project.project_plan):
        project_plan = schema.description(type_="1",valueOf_=xml_enc(project.project_plan))
        project_plan.set_anyAttributes_({"akvo:type":"7"})
        activity.add_description(project_plan)

    # Current status
    if check_value(project.current_status):
        current_status = schema.description(type_="1",valueOf_=xml_enc(project.current_status))
        current_status.set_anyAttributes_({"akvo:type":"9"})
        activity.add_description(current_status)

    # Sustainability
    sustainability = schema.description(type_="1",valueOf_=xml_enc(project.sustainability))
    sustainability.set_anyAttributes_({"akvo:type":"10"})
    activity.add_description(sustainability)

    # Project status
    status_code, status_description = project_status()
    project_status = schema.textType(valueOf_=xml_enc(status_description))
    project_status.set_anyAttributes_({"code": status_code})
    activity.add_activity_status(project_status)

    # Goals overview
    goals_overview = schema.description(type_="2",valueOf_=xml_enc(project.goals_overview))
    goals_overview.set_anyAttributes_({"akvo:type":"8"})
    activity.add_description(goals_overview)

    # Date start (actual)
    if check_value(project.date_start_actual):
        start_actual = schema.activity_date(iso_date=project.date_start_actual, type_="start-actual",
                                            valueOf_=project.date_start_actual)
        activity.add_activity_date(start_actual)

    # Date start (planned)
    if check_value(project.date_start_planned):
        start_planned = schema.activity_date(iso_date=project.date_start_planned, type_="start-planned",
                                             valueOf_=project.date_start_planned)
        activity.add_activity_date(start_planned)

    # Date end (actual)
    if check_value(project.date_end_actual):
        end_actual = schema.activity_date(iso_date=project.date_end_actual, type_="end-actual",
                                          valueOf_=project.date_end_actual)
        activity.add_activity_date(end_actual)

    # Date end (planned)
    if check_value(project.date_end_planned):
        end_planned = schema.activity_date(iso_date=project.date_end_planned, type_="end-planned",
                                           valueOf_=project.date_end_planned)
        activity.add_activity_date(end_planned)

    return activity

def iati_reporting_org(activity, organisation):
    """Collects the reporting organisation from the RSR project and adds it to the activity."""

    reporting_org = schema.reporting_org()

    # Use long name if available and short name otherwise
    if check_value(organisation.long_name):
        reporting_org.set_valueOf_(xml_enc(organisation.long_name))
    else:
        reporting_org.set_valueOf_(xml_enc(organisation.name))

    if check_value(organisation.iati_org_id):
        reporting_org.set_ref(xml_enc(organisation.iati_org_id))

    activity.add_reporting_org(reporting_org)

    return activity

def iati_identifier(activity, partnerships, organisation):
    """Collects the IATI identifier from the RSR project and adds it to the activity."""

    identifier = ""

    # Return the first identifier that is found
    for partnership in partnerships:
        if check_value(partnership.iati_activity_id):
            identifier = partnership.iati_activity_id
            internal_id = partnership.internal_id
            break

    if check_value(identifier):
        identifier_node = schema.iati_identifier(valueOf_=xml_enc(identifier))
        activity.add_iati_identifier(identifier_node)

        if check_value(internal_id):
            other_identifier = schema.other_identifier(valueOf_=xml_enc(internal_id))
            if check_value(organisation.iati_org_id):
                other_identifier.set_owner_ref(xml_enc(organisation.iati_org_id))
            if check_value(organisation.long_name):
                other_identifier.set_owner_name(xml_enc(organisation.long_name))
            elif check_value(organisation.name):
                other_identifier.set_owner_name(xml_enc(organisation.name))

            activity.add_other_identifier(other_identifier)

    return activity

def process_project(xml, project, org_id):
    """Convert a project to an IATI XML."""

    # Get all necessary data
    partnerships = Partnership.objects.filter(organisation_id=org_id, project_id=project.pk)
    goals = Goal.objects.filter(project_id=project.pk)
    try:
        location = project.primary_location
        country = Country.objects.get(id=location.country_id)
    except:
        raise MandatoryError(project.title, project.pk, "location")
    budgets = BudgetItem.objects.filter(project_id=project.pk)
    participating_orgs = project.all_partners()
    links = Link.objects.filter(project_id=project.pk)
    benchmarks = Benchmark.objects.filter(project_id=project.pk).filter(value__gt=0)
    benchmark_names = Benchmarkname.objects.all()
    categories = Category.objects.all()

    # Check mandatory fields
    check_mandatory_fields(project, {"title": project.title,
                                     "subtitle": project.subtitle,
                                     "status": project.status,
                                     "project plan summary": project.project_plan_summary,
                                     "sustainability": project.sustainability,
                                     "goals overview": project.goals_overview,
                                     "status": project.status,
                                     "photo": project.current_image,
                                     "latitude": location.latitude,
                                     "longitude": location.longitude,
                                     "country": location.country_id})

    for participating_org in participating_orgs:
        partnerships_orgs = Partnership.objects.filter(organisation_id=participating_org.pk, project_id=project.pk)
        for partnership in partnerships_orgs:
            check_mandatory_fields(project, {"partner type of a participating organisation": partnership.partner_type})

    # Create the activity
    activity = schema.iati_activity()

    # Set arguments
    if check_value(project.language): activity.set_lang(project.language)
    if check_value(project.currency): activity.set_default_currency(project.currency)

    # Add nodes
    activity = iati_identifier(activity, partnerships, organisation)
    activity = iati_reporting_org(activity, organisation)
    activity = iati_activity(activity, project)
    activity = iati_contact(activity, organisation)
    activity = iati_goals(activity, goals)
    activity = iati_photo(activity, project)
    activity = iati_location(activity, location, country)
    activity = iati_budget(activity, budgets, project)
    activity = iati_participating_org(activity, project, participating_orgs)
    activity = iati_links(activity, links)
    activity = iati_outcome(activity, benchmarks, benchmark_names, categories)

    # Add the activity to the xml
    xml.add_iati_activity(activity)

    return xml

def generate_file(projects, org_id, iati_version):
    """Generates the IATI XML file based on the projects and the organisation ID."""

    dt = datetime.now().strftime("%Y-%m-%dT%H:%M:%S")
    iati_file = schema.iati_activities(dt, iati_version)
    iati_file.set_anyAttributes_({"xmlns:akvo": "http://akvo.org/iati-activities"})

    for project in projects:
        try:
            iati_file = process_project(iati_file, project, org_id)
        except MandatoryError as e:
            print e.msg
        else:
            print "Successfully processed project '%s' (id: %s)" % (project.title, project.pk)

    return iati_file

def project_selection(organisation, partner_types, ignore_list):
    """Returns list of projects connected to an organisation. Add project id to ignore list
     to ignore a project."""

    # Retrieve all active projects of the organisation
    active_projects = organisation.published_projects()

    # Check every project whether organisation has one of the selected partner types
    project_list = []
    for project in active_projects:
        for partner_type in partner_types:
            if partner_type[0] and (organisation in getattr(project, partner_type[1])()):
                project_list.append(project)
                break

    # Filter out ignored projects
    if not ignore_list is None:
        for id in ignore_list:
            try:
                project = Project.objects.get(id=id)
                if project in project_list:
                    project_list.remove(project)
            except:
                pass

    return project_list

def export_file(path, file, organisation):
    """Exports the XML to a file using the name of the organisation."""

    name = organisation.name
    file_name = path + name + ".xml"

    # Check if file exists and make sure the file has a unique name
    increment = True
    count = 1

    while increment:
        if os.path.isfile(file_name):
            file_name = path + name + " (" + str(count) + ").xml"
            count += 1
        else:
            with open(file_name, 'w') as f:
                f.write('<?xml version="1.0" encoding="UTF-8"?>\n')
                file.export(f, 0)
            increment = False

    print "\nIATI XML available at: " + str(file_name) + "\n"


if __name__ == '__main__':
    # Parse arguments
    parser = argparse.ArgumentParser()
    parser.add_argument("-o", "--organisation", help="organisation id (required)", type=int, required=True)
    parser.add_argument("-fi", "--field", help="select field partners", action="store_true")
    parser.add_argument("-fu", "--funding", help="select funding partners", action="store_true")
    parser.add_argument("-sp", "--sponsor", help="select sponsor partners", action="store_true")
    parser.add_argument("-su", "--support", help="select support partners", action="store_true")
    parser.add_argument("-i", "--ignore", help="project id's to be ignored", type=int, nargs='*')
    args = parser.parse_args()

    # At least one of the partner types has to be selected, if not the program is terminated
    if not (args.field or args.funding or args.sponsor or args.support):
        print "Error; choose at least one of the partner types:\n"
        print "- Field partner (-fi)"
        print "- Funding partner (-fu)"
        print "- Sponsor partner (-sp)"
        print "- Support partner (-su)\n"
        sys.exit()

    # Check if organisation exists, if not the program is terminated
    try:
        organisation = Organisation.objects.get(id=args.organisation)
    except:
        print "Error; organisation with id " + str(args.organisation) + " does not exist\n"
        sys.exit()

    # Variables
    PARTNER_TYPES = ((args.field, "field_partners"),
                     (args.funding, "funding_partners"),
                     (args.sponsor, "sponsor_partners"),
                     (args.support, "support_partners"))
    IATI_VERSION = "1.03"
    PATH = "/var/iati_files/"

    # Project selection based on organisation ID, partner types and the projects to be ignored
    projects = project_selection(organisation, PARTNER_TYPES, args.ignore)

    # Convert selected projects to XML
    iati_file = generate_file(projects, args.organisation, IATI_VERSION)

    # Output file
    export_file(PATH, iati_file, organisation)