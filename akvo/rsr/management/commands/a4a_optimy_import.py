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
from django.core.management.base import BaseCommand
import requests

from akvo.rsr.iso3166 import ISO_3166_COUNTRIES
from akvo.rsr.models import (
    BudgetItem,
    BudgetItemLabel,
    Organisation,
    Partnership,
    Project,
    ProjectCustomField,
    ProjectLocation,
    RelatedProject,
)
from akvo.utils import custom_get_or_create_country

BASE_URL = "https://api.optimytool.com/v1.3"
USERNAME = settings.OPTIMY_USERNAME
PASSWORD = settings.OPTIMY_PASSWORD
COUNTRY_NAME_TO_ISO_MAP = {name: code for code, name in ISO_3166_COUNTRIES}

PROGRAM_IDS = {
    "VIA Water": 9222,
    "SCALE": 9224,
}


def get_projects(contracts_only=True):
    CONTRACT_STATUS = "d30a945f-e524-53fe-8b2f-0c65b27be1ea"
    response = requests.get(f"{BASE_URL}/projects", auth=(USERNAME, PASSWORD))
    content = response.json()
    projects = content["data"]
    if contracts_only:
        projects = [
            project for project in projects if project["status_id"] == CONTRACT_STATUS
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

    return answers


def create_project(project_id, answers):
    question_mapping = {
        "title": "9900586f-3c4b-5e3e-a9e6-a209eb8cb8e3",
        # FIXME: subtitle?
        "cofinancing-budget": "6c05de7b-4031-5809-a692-a45beadf7cec",
        "a4a-budget": "b0268b0c-d7e9-513a-bb27-1de7c0ec593a",
        "total-budget": "322932f0-e294-5621-a37b-fd57fec9937a",
        "aqua-for-all-budget": "b0268b0c-d7e9-513a-bb27-1de7c0ec593a",
        "co-financing-budget": "6c05de7b-4031-5809-a692-a45beadf7cec",
        "start-date": "b785b97e-64f7-5149-a07b-7216497aa39f",
        "end-date": "d3c4132c-1e55-5177-943e-3afa25b092ab",
        "project-number": "683c31bc-d1d3-57f2-bf57-2e4c54894181",
        "country": "913bec17-7f11-540a-8cb5-c5803e32a98b",
        "summary": "02f1316c-4d5c-5989-8183-e392a634d23e",
        "program": "09c477bb-d887-5862-9b12-ea5ab566b363",
    }
    answers_by_id = {ans["question_id"]: ans for ans in answers}

    def get_answer(key, ans_key="value"):
        answer = answers_by_id.get(question_mapping[key], {}).get(ans_key)
        if not answer:
            print(f"Could not find answer for {key}")
        return answer

    program_name = get_answer("program", ans_key="answer_name")
    lead_project_id = PROGRAM_IDS.get(program_name)
    if lead_project_id is None:
        print(f"Skipping {project_id} since it has no associated program")
        return None

    optimy_project_id_field = "Optimy Project ID"
    custom_field = ProjectCustomField.objects.filter(
        name=optimy_project_id_field, value=project_id
    ).first()
    if custom_field is not None:
        project = custom_field.project

    else:
        title = get_answer("title")
        project = Project.objects.create(title=title)
        ProjectCustomField.objects.get_or_create(
            project=project,
            name="Optimy Project ID",
            defaults=dict(value=project_id, section="1", order="1"),
        )

    # Add Aqua for All project Number
    answer_project_number = answers_by_id.get(question_mapping["project-number"])
    if answer_project_number:
        ProjectCustomField.objects.get_or_create(
            project=project,
            name=answer_project_number["question_name"],
            defaults=dict(value=answer_project_number["value"], section="1", order="1"),
        )

    start_date = get_answer("start-date")
    end_date = get_answer("end-date")

    # Update project attributes
    data = dict(
        date_start_planned=start_date,
        date_end_planned=end_date,
        is_public=False,
        project_plan_summary=get_answer("summary"),
        iati_status="2",  # Implementation status
    )
    for key, value in data.items():
        if value is not None:
            setattr(project, key, value)
    project.save(update_fields=data.keys())

    # Add reporting organisation
    a4a = Organisation.objects.get(name="Aqua for All")
    project.set_reporting_org(a4a)

    # Add Aqua for All as financing partner
    Partnership.objects.get_or_create(
        project=project,
        organisation=a4a,
        iati_organisation_role=Partnership.IATI_FUNDING_PARTNER,
    )

    # Set lead project
    if lead_project_id is not None and not project.parents_all().exists():
        RelatedProject.objects.create(
            project=project,
            related_project_id=lead_project_id,
            relation=RelatedProject.PROJECT_RELATION_PARENT,
        )

    # Import results
    project.import_results()

    # Create budget objects
    BudgetItem.objects.filter(project=project).delete()
    # Co-financing budget
    other = BudgetItemLabel.objects.get(label="Other")
    budget = get_answer("cofinancing-budget")
    extra = get_answer("cofinancing-budget", "answer_name")
    if budget:
        if extra:
            extra = " ".join(extra.split()[1:-1]).title()
        BudgetItem.objects.create(
            project=project, label=other, amount=budget, other_extra=extra
        )
    # A4A budget
    budget = get_answer("a4a-budget")
    extra = get_answer("a4a-budget", "answer_name")
    if budget:
        if extra:
            extra = " ".join(extra.split()[1:-1]).title()
        BudgetItem.objects.create(
            project=project, label=other, amount=budget, other_extra=extra
        )
    # Total budget
    total = BudgetItemLabel.objects.get(label="Total")
    budget = get_answer("total-budget")
    if budget:
        BudgetItem.objects.create(project=project, label=total, amount=budget)

    # Create location objects
    ProjectLocation.objects.filter(location_target=project).delete()
    project.primary_location = None
    name = get_answer("country", ans_key="answer_name")
    iso_code = COUNTRY_NAME_TO_ISO_MAP.get(name)
    if iso_code:
        country = custom_get_or_create_country(iso_code)
        ProjectLocation.objects.create(location_target=project, country=country)
    else:
        print(f"Could not find iso code for {name}")

    # Publish the project
    project.publish()

    return project


class Command(BaseCommand):
    help = "Import projects from Optimy for Aqua for All"

    def add_arguments(self, parser):
        parser.add_argument(
            "--project-id", type=str, help="ID of the project to import"
        )

    def handle(self, *args, **options):
        project_id = options["project_id"]
        if not project_id:
            print("Fetching projects from Optimy")
            projects = get_projects()
        else:
            projects = [dict(id=project_id)]

        for project in projects:
            project_id = project["id"]
            answers = get_project_answers(project_id)
            project = create_project(project_id, answers)
            if project is not None:
                print(f"Imported {project_id} as {project.id} - {project.title}")
