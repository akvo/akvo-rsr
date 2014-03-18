# -*- coding: utf-8 -*-
#!/usr/bin/env python

"""
Script for generating an IATI file of an organisation, taking an organisation as input with
the possibility to select partner types and exclude individual projects.
"""

from django.core.management import setup_environ
from akvo import settings
setup_environ(settings)

from datetime import datetime
from akvo.rsr.iati_code_lists import IATI_LIST_ACTIVITY_STATUS, IATI_LIST_ORGANISATION_ROLE
from akvo.rsr.models import (Project, Organisation, Partnership, Goal, ProjectLocation, Country, BudgetItem,
                             BudgetItemLabel, InternalOrganisationID, Link)

import sys, argparse, os.path
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


def iati_links(activity, links):
    """Collects the website links of the RSR project and adds them to the activity."""

    for link in links:
        if check_value(link.url):
            website = schema.activity_website()
            website.set_valueOf_(link.url)

            if check_value(link.caption):
                website.set_anyAttributes_({"akvo:url-caption": link.caption})

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
            participating_org_node.set_valueOf_(participating_org.long_name)
            participating_org_node.set_role(organisation_role(partnership.partner_type))

            if check_value(participating_org.iati_org_id):
                participating_org_node.set_ref(participating_org.iati_org_id)

            if check_value(partnership.iati_url):
                participating_org_node.set_anyAttributes_({"akvo:iati": partnership.iati_url})

            activity.add_participating_org(participating_org_node)

    return activity

def iati_focusarea(activity, project):
    """Collects focus area of the RSR project and adds it to the activity."""

    # TODO: Clear up specs

    return activity

def iati_budget(activity, budgets):
    """Collects budget of the RSR project and adds it to the activity."""

    for budget in budgets:
        budget_node = schema.budget()

        budget_label = BudgetItemLabel.objects.get(id=budget.label_id)

        if check_value(budget.amount):
            budget_value = schema.textType(valueOf_=budget.amount)
            budget_node.add_value(budget_value)

        if check_value(budget_label):
            budget_node.set_anyAttributes_({"akvo:type": budget_label})

        if check_value(budget.other_extra):
            budget_node.set_anyAttributes_({"akvo:description": budget.other_extra})

        activity.add_budget(budget_node)

    return activity


def iati_location(activity, location, country):
    """Collects location of the RSR project and adds it to the activity."""

    # TODO: Add location types (codes are unclear)

    location_node = schema.location()

    if check_value(location.city):
        location_name = schema.textType(valueOf_=location.city)
        location_node.add_name(location_name)

    coordinates = schema.coordinatesType(latitude=location.latitude, longitude=location.longitude)
    location_node.add_coordinates(coordinates)

    if check_value(country.name) and check_value(country.iso_code):
        country_name = schema.textType(valueOf_=country.name)
        administrative = schema.administrativeType(country=country.iso_code.upper(), valueOf_=country_name)

        location_node.add_administrative(administrative)

    if check_value(location.address_1):
        location_node.set_anyAttributes_({"akvo:address-1": location.address_1})

    if check_value(location.address_2):
        location_node.set_anyAttributes_({"akvo:address-2": location.address_2})

    if check_value(location.postcode):
        location_node.set_anyAttributes_({"akvo:post-code": location.postcode})

    return activity

def iati_photo(activity, project):
    """Collects the actual photo of the RSR project and adds it to the activity."""

    # TODO: Add file format (no codelist suitable for images)

    photo_url = "http://rsr.akvo.org/media/" + str(project.current_image)

    document_link = schema.document_link(url=photo_url)

    if check_value(project.current_image_caption):
        document_link.set_anyAttributes_({"akvo:photo-caption": project.current_image_caption})

    if check_value(project.current_image_credit):
        document_link.set_anyAttributes_({"akvo:photo-credit": project.current_image_credit})

    activity.add_document_link(document_link)

    return activity

def iati_goals(activity, goals):
    """Collects all goals as specified in the RSR project and adds them to the activity."""

    for goal in goals:
        goal_text = schema.textType(valueOf_=goal.text)

        if check_value(goal_text):
            result = schema.result(type_="1")
            result.add_title(goal_text)
            activity.add_result(result)

    return activity


def iati_activity(activity, project):
    """Collects all underlying nodes of the <iati-activity> node and adds them to the activity."""

    def project_status():
        """Converts the status of the RSR project to IATI codes and description.

        Mapped to the RSR Project Status: Pipeline/identification => Needs Funding,
        Implementation => Active, Completion => Completed, Post-completion => Completed, Cancelled => Cancelled."""

        if project.status == 'H':
            return IATI_LIST_ACTIVITY_STATUS[0][0], IATI_LIST_ACTIVITY_STATUS[0][1]
        elif project.status == 'A':
            return IATI_LIST_ACTIVITY_STATUS[1][0], IATI_LIST_ACTIVITY_STATUS[1][1]
        elif project.status == 'C':
            return IATI_LIST_ACTIVITY_STATUS[2][0], IATI_LIST_ACTIVITY_STATUS[2][1]
        elif project.status == 'L':
            return IATI_LIST_ACTIVITY_STATUS[4][0], IATI_LIST_ACTIVITY_STATUS[4][1]
        else:
            # This should never fire, the status of the project has been checked beforehand.
            raise MandatoryError(project.title, project.pk, "status")

    # Title
    activity.add_title(schema.textType(valueOf_=project.title))

    # Subtitle
    subtitle = schema.description(type_="1",valueOf_=project.subtitle)
    subtitle.set_anyAttributes_({"akvo:type":"4"})
    activity.add_description(subtitle)

    # Project plan summary
    pps = schema.description(type_="1",valueOf_=project.project_plan_summary)
    pps.set_anyAttributes_({"akvo:type":"5"})
    activity.add_description(pps)

    # Background
    if check_value(project.background):
        background = schema.description(type_="1",valueOf_=project.background)
        background.set_anyAttributes_({"akvo:type":"6"})
        activity.add_description(background)

    # Project plan
    if check_value(project.project_plan):
        project_plan = schema.description(type_="1",valueOf_=project.project_plan)
        project_plan.set_anyAttributes_({"akvo:type":"7"})
        activity.add_description(project_plan)

    # Current status
    if check_value(project.current_status):
        current_status = schema.description(type_="1",valueOf_=project.current_status)
        current_status.set_anyAttributes_({"akvo:type":"9"})
        activity.add_description(current_status)

    # Sustainability
    sustainability = schema.description(type_="1",valueOf_=project.sustainability)
    sustainability.set_anyAttributes_({"akvo:type":"10"})
    activity.add_description(sustainability)

    # Project status
    status_code, status_description = project_status()
    project_status = schema.textType(valueOf_=status_description)
    project_status.set_anyAttributes_({"code": status_code})
    activity.add_activity_status(project_status)

    # Goals overview
    goals_overview = schema.description(type_="2",valueOf_=project.goals_overview)
    goals_overview.set_anyAttributes_({"akvo:type":"8"})
    activity.add_description(goals_overview)

    # Date request posted
    if check_value(project.date_request_posted):
        start_actual = schema.activity_date(iso_date=project.date_request_posted, type_="start-actual",
                                            valueOf_=project.date_request_posted)
        activity.add_activity_date(start_actual)

    # Date complete
    if check_value(project.date_complete):
        end_planned = schema.activity_date(iso_date=project.date_complete, type_="end-planned",
                                           valueOf_=project.date_complete)
        activity.add_activity_date(end_planned)

    # Notes
    if check_value(project.notes): activity.set_anyAttributes_({"akvo:notes": project.notes})

    return activity

def iati_identifier(activity, partnerships):
    """Collects the IATI identifier from the RSR project and adds it to the activity."""

    identifier = ""

    # Return the first identifier that is found
    for partnership in partnerships:
        if check_value(partnership.iati_activity_id):
            identifier = partnership.iati_activity_id
            internal_id = partnership.internal_id
            break

    if check_value(identifier):
        identifier_node = schema.iati_identifier()
        activity.add_iati_identifier(identifier_node)

        if check_value(internal_id):
            activity.set_anyAttributes_({"akvo:internal-project-id":internal_id})

    return activity

def process_project(xml, project, org_id):
    """Convert a project to an IATI XML."""

    # Get data
    partnerships = Partnership.objects.filter(organisation_id=org_id, project_id=project.pk)
    goals = Goal.objects.filter(project_id=project.pk)
    location = ProjectLocation.objects.get(id=project.pk)
    country = Country.objects.get(id=location.country_id)
    budgets = BudgetItem.objects.filter(project_id=project.pk)
    participating_orgs = project.all_partners()
    links = Link.objects.filter(project_id=project.pk)

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
        check_mandatory_fields(project, {"participating organisation name": participating_org.long_name})

        partnerships_orgs = Partnership.objects.filter(organisation_id=participating_org.pk, project_id=project.pk)
        for partnership in partnerships_orgs:
            check_mandatory_fields(project, {"partner type of a participating organisation": partnership.partner_type})

    # Create the activity
    activity = schema.iati_activity()

    # Set arguments
    if check_value(project.language): activity.set_lang(project.language)
    if check_value(project.currency): activity.set_default_currency(project.currency)

    # Add nodes
    activity = iati_identifier(activity, partnerships)
    activity = iati_activity(activity, project)
    activity = iati_goals(activity, goals)
    activity = iati_photo(activity, project)
    activity = iati_location(activity, location, country)
    activity = iati_budget(activity, budgets)
    activity = iati_focusarea(activity, project)
    activity = iati_participating_org(activity, project, participating_orgs)
    activity = iati_links(activity, links)

    # Add the activity to the xml
    xml.add_iati_activity(activity)

    return xml

def generate_file(projects, org_id, iati_version):
    """Generates the IATI XML file based on the projects and the organisation ID."""

    dt = datetime.now().strftime("%Y-%m-%dT%H:%M:%S")
    xml = schema.iati_activities(dt, iati_version)
    xml.set_anyAttributes_({"xmlns:akvo": "http://www.akvo.org"})

    for project in projects:
        try:
            xml = process_project(xml, project, org_id)
        except MandatoryError as e:
            print e.msg
        else:
            print "Successfully processed project '%s' (id: %s)" % (project.title, project.pk)

    return xml

def project_selection(organisation_id, partner_types, ignore_list):
    """Returns list of projects connected to an organisation. Add project id to ignore list
     to ignore a project."""

    # Retrieve all active projects of the organisation
    organisation = Organisation.objects.get(id=organisation_id)
    project_list = organisation.active_projects()

    field_projects = Project.objects.none()
    funding_projects = Project.objects.none()
    sponsor_projects = Project.objects.none()
    support_projects = Project.objects.none()

    # Filter on selected partner types
    if partner_types[0]:
        field_projects = project_list.filter(
            partnerships__organisation_id=organisation_id,
            partnerships__partner_type='field'
        )
    if partner_types[1]:
        funding_projects = project_list.filter(
            partnerships__organisation_id=organisation_id,
            partnerships__partner_type='funding'
        )
    if partner_types[2]:
        sponsor_projects = project_list.filter(
            partnerships__organisation_id=organisation_id,
            partnerships__partner_type='sponsor'
        )
    if partner_types[3]:
        support_projects = project_list.filter(
            partnerships__organisation_id=organisation_id,
            partnerships__partner_type='support'
        )

    # Combine filtered partner types (there must be some way to do this faster)
    filtered_projects = field_projects | funding_projects | sponsor_projects | support_projects

    # Filter out ignored projects
    if not ignore_list is None:
        for ignore_project in ignore_list:
            filtered_projects = filtered_projects.exclude(pk=int(ignore_project))

    return filtered_projects

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
    PARTNER_TYPES = (args.field, args.funding, args.sponsor, args.support)
    IATI_VERSION = "1.03"
    PATH = "/var/iati_files/"

    # Project selection based on organisation ID, partner types and the projects to be ignored
    projects = project_selection(args.organisation, PARTNER_TYPES, args.ignore)

    # Convert selected projects to XML
    iati_file = generate_file(projects, args.organisation, IATI_VERSION)

    # Output file
    export_file(PATH, iati_file, organisation)