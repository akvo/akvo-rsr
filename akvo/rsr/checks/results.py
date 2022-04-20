from typing import Dict, Iterable, List

from django.db.models import QuerySet

from akvo.rsr.models import Project, Result
from akvo.rsr.models.related_project import get_project_parents


def get_with_non_familial_parents() -> Iterable[Result]:
    """
    Results that have parents with a project outside of the family hierarchy

    # Example:

    hierarchy:
        program
            project
        other_project

    results:
        project -> result -> parent_result -> other_project
    """
    results = get_with_parents()
    return [
        result for result in results
        if result.parent_result.project not in get_project_parents(result.project)
    ]


def get_with_multi_project_parents() -> Dict[Project, Dict[Project, List[Result]]]:
    """
    Results that have parent results with different projects

    # Example:
    result -> parent -> project
    result -> parent -> project1
    result -> parent -> project
    """
    results = get_with_parents()
    project_lookup: Dict[Project, Dict[Project, List[Result]]] = {}
    for result in results:
        project_lookup.setdefault(
            result.project, {}
        ).setdefault(result.parent_result.project, list()).append(result)
    return {
        project: parent_projects for project, parent_projects in project_lookup.items()
        if len(parent_projects) > 1
    }


def get_with_parents() -> QuerySet[Result]:
    results = Result.objects.all().select_related(
        'project', 'parent_result', 'parent_result__project'
    ).exclude(
        parent_result=None
    ).order_by('project__pk')
    return results
