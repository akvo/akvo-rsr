from django.db.models import Q

from akvo.rsr.models import Project, RelatedProject


def print_actual_parent(project, tab_count=0):
    """Find parent and print it"""
    project_condition = Q(project=project, related_project__isnull=False) | \
        Q(project__isnull=False, related_project=project)
    actual_rps = RelatedProject.objects.filter(
        project_condition,
        relation__in=[RelatedProject.PROJECT_RELATION_CHILD, RelatedProject.PROJECT_RELATION_PARENT]
    )
    actual_count = actual_rps.count()

    # Is there a parent?
    if actual_count == 0:
        sibling = RelatedProject.objects.filter(
            project_condition,
            relation=[RelatedProject.PROJECT_RELATION_SIBLING]
        )
        if sibling.exists():
            write("NO ACTUAL PARENT", tab_count)
        else:
            # Oh no... finding the sibling with a parent is a hassle
            write("SIBLING", tab_count)

    # There definitely is a parent
    elif actual_count == 1:
        actual_rp = actual_rps.first()
        if actual_rp.relation == RelatedProject.PROJECT_RELATION_CHILD:
            parent = actual_rp.project
        else:
            parent = actual_rp.related_project
        write_project(parent, "actual_parent", tab_count=tab_count)

    # It's not clear if there is a parent
    else:
        write("Multiple related projects?", tab_count)
        _tab_count = tab_count + 1
        for actual_rp in actual_rps.select_related("project", "related_project"):
            write(f"RP {actual_rp.id}: {actual_rp.get_relation_display()}", _tab_count)
            write_project(actual_rp.project, tab_count=_tab_count + 1)
            write_project(actual_rp.related_project, "related_project", tab_count=_tab_count + 1)


def write_project(project: Project, prefix="project", tab_count=0):
    write(f"{prefix} {project.id} {project.last_modified_at.date()}: {project}", tab_count)


def write(msg, tab_count=0):
    print(("\t" * tab_count) + msg)
