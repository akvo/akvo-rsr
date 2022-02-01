#!/usr/bin/env python3

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

""" Import projects from Optimy for Aqua for All

Usage:

    python manage.py a4a_optimy_import [--project-id <optimy_project_id>]

"""

from itertools import groupby

from django.conf import settings
from django.core.management.base import BaseCommand, CommandError
from django.db.models import Q
import requests
import textwrap

from akvo.rsr.iso3166 import ISO_3166_COUNTRIES
from akvo.rsr.models import (
    BudgetItem,
    BudgetItemLabel,
    Organisation,
    Partnership,
    Project,
    ProjectCustomField,
    ProjectEditorValidationSet, ProjectLocation,
)
from akvo.utils import custom_get_or_create_country

BASE_URL = "https://api.optimytool.com/v1.3"
USERNAME = settings.OPTIMY_USERNAME
PASSWORD = settings.OPTIMY_PASSWORD
COUNTRY_NAME_TO_ISO_MAP = {name: code for code, name in ISO_3166_COUNTRIES}
MASTER_PROGRAM_ID = 9062
PROGRAM_IDS = {"VIA Water": 9222, "SCALE": 9224, "Response Facility": 9469}
OPTIMY_FORM_IDS = {
    "making-water-count": "68d4a00a-416d-5ce1-9c12-2d6d1dc1a047",
    "response-facility": "6e962295-06c9-5de1-a39e-9cd2272b1837",
}
FORM_QUESTION_MAPPING = {
    # Making Water Count
    "68d4a00a-416d-5ce1-9c12-2d6d1dc1a047": {
        "title": "9900586f-3c4b-5e3e-a9e6-a209eb8cb8e3",
        # FIXME: subtitle?
        "cofinancing-budget": "6c05de7b-4031-5809-a692-a45beadf7cec",
        "a4a-budget": "b0268b0c-d7e9-513a-bb27-1de7c0ec593a",
        "total-budget": "322932f0-e294-5621-a37b-fd57fec9937a",
        "start-date": "b785b97e-64f7-5149-a07b-7216497aa39f",
        "end-date": "d3c4132c-1e55-5177-943e-3afa25b092ab",
        "project-number": "683c31bc-d1d3-57f2-bf57-2e4c54894181",
        "country": "913bec17-7f11-540a-8cb5-c5803e32a98b",
        "summary": "02f1316c-4d5c-5989-8183-e392a634d23e",
        "program": "09c477bb-d887-5862-9b12-ea5ab566b363",
        "grantee": "51550c5f-a019-561d-80ca-50ed38a2bfce"
    },
    # Response Facility
    "6e962295-06c9-5de1-a39e-9cd2272b1837": {
        "title": "ed814396-7e42-5a72-a1fb-c478947c499b",
        # FIXME: subtitle?
        "cofinancing-budget": "ad2b9e11-6ac7-57b2-a20d-d13259f72484",
        "a4a-budget": "fac61f74-8d27-5128-9afb-a34283c39e75",
        "total-budget": "0b99fc04-bf13-55c2-805a-fec273774a26",
        "start-date": "e13cf4d6-d4be-56a3-9228-9c12263ead07",
        "end-date": "d6b82834-24e7-5a1b-ab7e-369c745c302a",
        "project-number": "fa543aa4-6cf7-53f8-a071-f775d8f89711",
        "country": "cdc40519-f33c-5b29-b668-84ff60823ad7",
        "summary": "4cff3960-6f4c-5a7f-a681-1dd8382d15e3",
        "grantee": "60dfcace-9344-5ddf-89ef-2076f96ec07f"
    },
}
CONTRACT_STATUSES = {
    "68d4a00a-416d-5ce1-9c12-2d6d1dc1a047": "d30a945f-e524-53fe-8b2f-0c65b27be1ea",
    "6e962295-06c9-5de1-a39e-9cd2272b1837": "2df6666f-d73b-5b57-9f66-51150dc9d6c9",
}
A4A = Organisation.objects.get(name="Aqua for All")
DEFAULT_PROJECT_INFO = {
    "default_aid_type": "B01",
    "default_flow_type": "10",
    "default_tied_status": "3",
    "default_finance_type": "110",
}
VALIDATION_SET_NAME = "DGIS Modified"


def programs_exist():
    program = Project.objects.filter(id=MASTER_PROGRAM_ID).first()
    if program is not None:
        sub_programs = set(program.descendants(depth=1).values_list("pk", flat=True))
        program_ids = set(PROGRAM_IDS.values())
        return (sub_programs & program_ids) == program_ids
    return False


def get_projects(contracts_only=True):
    response = requests.get(f"{BASE_URL}/projects", auth=(USERNAME, PASSWORD))
    content = response.json()
    projects = content["data"]
    if contracts_only:
        projects = [
            project
            for project in projects
            if project["status_id"] == CONTRACT_STATUSES[project["form_id"]]
        ]
    return projects


def get_submission_versions(project_id):
    response = requests.get(
        f"{BASE_URL}/projects/{project_id}/versions", auth=(USERNAME, PASSWORD)
    )
    data = response.json()["data"]
    versions = [
        list(versions)[-1]["version_id"]
        for form_part_id, versions in groupby(data, key=lambda x: x["form_part_id"])
    ]
    return versions


def get_project_answers(project_id):
    version_ids = get_submission_versions(project_id)

    answers = []
    for version_id in version_ids:
        print(f"Fetching answers for {project_id} - {version_id}...")
        response = requests.get(
            f"{BASE_URL}/projects/{project_id}/versions/{version_id}/answers",
            auth=(USERNAME, PASSWORD),
        )
        data = response.json()["data"]
        answers.extend(data)

    return {ans["question_id"]: ans for ans in answers}


def get_answer(form_id, answers, key, ans_key="value"):
    answer = answers.get(FORM_QUESTION_MAPPING[form_id][key], {}).get(ans_key)
    if not answer:
        print(f"Could not find answer for {key}")
    return answer


def create_project(project, answers):
    project_id = project["id"]
    form_id = project["form_id"]
    if form_id == OPTIMY_FORM_IDS["response-facility"]:
        lead_project_id = PROGRAM_IDS["Response Facility"]
    else:
        program_name = get_answer(form_id, answers, "program", ans_key="answer_name")
        lead_project_id = PROGRAM_IDS.get(program_name)
    if lead_project_id is None:
        print(f"Skipping {project_id} since it has no associated program")
        return None

    optimy_project_id_field = "Optimy Project ID"
    custom_field = ProjectCustomField.objects.filter(
        name=optimy_project_id_field, value=project_id
    ).first()
    title = get_answer(form_id, answers, "title")[:200]
    project_created = False
    if custom_field is not None:
        project = custom_field.project

    else:
        project = Project.objects.create(title=title)
        project_created = True
        ProjectCustomField.objects.get_or_create(
            project=project,
            name="Optimy Project ID",
            defaults=dict(value=project_id, section="1", order="1"),
        )

        validation_set = ProjectEditorValidationSet.objects.filter(name=VALIDATION_SET_NAME).first()
        if validation_set:
            project.validations.add(validation_set)

    program = Project.objects.get(pk=lead_project_id)
    project.add_to_program(program)
    # Add Aqua for All as financing partner
    Partnership.objects.get_or_create(
        project=project,
        organisation=A4A,
        iati_organisation_role=Partnership.IATI_FUNDING_PARTNER,
    )

    # Add implementing partner
    grantee = get_answer(form_id, answers, "grantee")
    if grantee and project_created:
        grantee_org = Organisation.objects.filter(Q(name=grantee) | Q(long_name=grantee)).first()
        if not grantee_org:
            grantee_org = Organisation.objects.create(
                name=textwrap.wrap(grantee, 40)[0],
                long_name=grantee
            )
        Partnership.objects.get_or_create(
            project=project,
            organisation=grantee_org,
            iati_organisation_role=Partnership.IATI_IMPLEMENTING_PARTNER,
        )

    # Add Aqua for All project Number
    project_number_question = get_answer(
        form_id, answers, "project-number", "question_name"
    )
    project_number_value = get_answer(form_id, answers, "project-number")
    if project_number_value:
        ProjectCustomField.objects.get_or_create(
            project=project,
            name=project_number_question,
            defaults=dict(value=project_number_value, section="1", order="1"),
        )

    start_date = get_answer(form_id, answers, "start-date")
    end_date = get_answer(form_id, answers, "end-date")

    iati_id = f"{A4A.iati_org_id}-{project.pk}"

    # Update project attributes
    data = dict(
        title=title,
        date_start_planned=start_date,
        date_end_planned=end_date,
        is_public=False,
        project_plan_summary=get_answer(form_id, answers, "summary"),
        iati_status="2",  # Implementation status
        iati_activity_id=iati_id,
    )
    # NOTE: Don't update Title, description and is_public for existing projects
    if not project_created:
        data.pop('title')
        data.pop('project_plan_summary')
        data.pop('is_public')

    data.update(DEFAULT_PROJECT_INFO)
    for key, value in data.items():
        if value is not None:
            setattr(project, key, value)
    project.save(update_fields=data.keys())

    # Create budget objects
    BudgetItem.objects.filter(project=project).delete()
    # Co-financing budget
    other = BudgetItemLabel.objects.get(label="Other")
    budget = get_answer(form_id, answers, "cofinancing-budget")
    extra = get_answer(form_id, answers, "cofinancing-budget", "answer_name")
    if budget:
        if extra:
            extra = " ".join(extra.split()[1:-1]).title()
        BudgetItem.objects.create(
            project=project,
            label=other,
            amount=budget,
            other_extra=extra,
            value_date=start_date,
            period_start=start_date,
            period_end=end_date,
        )
    # A4A budget
    budget = get_answer(form_id, answers, "a4a-budget")
    extra = get_answer(form_id, answers, "a4a-budget", "answer_name")
    if budget:
        if extra:
            extra = " ".join(extra.split()[1:-1]).title()
        BudgetItem.objects.create(
            project=project,
            label=other,
            amount=budget,
            other_extra=extra,
            value_date=start_date,
            period_start=start_date,
            period_end=end_date,
        )

    # Create location objects
    if project_created:
        project.primary_location = None
        if form_id == OPTIMY_FORM_IDS["response-facility"]:
            iso_code = get_answer(form_id, answers, "country").lower()
        else:
            name = get_answer(form_id, answers, "country", ans_key="answer_name")
            iso_code = COUNTRY_NAME_TO_ISO_MAP.get(name)
        if iso_code:
            country = custom_get_or_create_country(iso_code)
            ProjectLocation.objects.create(location_target=project, country=country)
        else:
            print(f"Could not find iso code for {name}")

    return project


def set_program_iati_ids():
    for program_id in (MASTER_PROGRAM_ID,) + tuple(PROGRAM_IDS.values()):
        program = Project.objects.get(id=program_id)

        data = dict(iati_activity_id=f"{A4A.iati_org_id}-{program_id}")
        data.update(DEFAULT_PROJECT_INFO)
        for key, value in data.items():
            setattr(program, key, value)
        program.save(update_fields=data.keys())


class Command(BaseCommand):
    help = "Import projects from Optimy for Aqua for All"

    def add_arguments(self, parser):
        parser.add_argument(
            "--project-id", type=str, help="ID of the project to import"
        )

    def handle(self, *args, **options):
        if not programs_exist():
            raise CommandError("Not all programs are present in the DB")
        project_id = options["project_id"]
        if not project_id:
            print("Fetching projects from Optimy")
            projects = get_projects()
        else:
            projects = [dict(id=project_id)]

        # Set program IDs
        set_program_iati_ids()

        print(f"Importing {len(projects)} Projects ...")
        for project in projects:
            project_id = project["id"]
            answers = get_project_answers(project_id)
            project = create_project(project, answers)
            if project is not None:
                print(f"Imported {project_id} as {project.id} - {project.title}")
