from __future__ import annotations
from typing import TYPE_CHECKING
from django.apps import apps

from django.db.models import QuerySet

if TYPE_CHECKING:
    from akvo.rsr.models import Organisation


def toggle_enfore_2fa(org: Organisation):
    print("toggle to: ", org.enforce_2fa, ", from", not org.enforce_2fa)


def find_related_users(organisation: Organisation) -> QuerySet:
    User = apps.get_model('rsr.User')
    Project = apps.get_model('rsr.Project')
    employees = User.objects.filter(employers__organisation=organisation)

    programs = Project.objects.exclude(projecthierarchy__isnull=True).filter(
        primary_organisation=organisation
    )
    program_projects = set(programs.values_list("id", flat=True))
    for program in programs:
        program_projects = program_projects | set(
            program.descendants().values_list("id", flat=True)
        )
    program_users = User.objects.filter(projectrole__project__in=program_projects)
    other_projects = Project.objects.filter(primary_organisation=organisation).exclude(
        id__in=program_projects
    )
    other_users = User.objects.filter(projectrole__project__in=other_projects)

    return employees.union(program_users).union(other_users)
