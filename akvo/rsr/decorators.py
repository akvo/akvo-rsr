from functools import wraps

from django.shortcuts import get_object_or_404

from akvo.rsr.models import Project


def fetch_project(view):
    """
    Retrieve a specific project object from the project_id captured in the URL
    and passes it directly to the view as 'p'.
    
    Usage:
    
    @fetch_project
    def view(request, p):
        ...

    """
    @wraps(view)
    def wrapper(request, project_id, *args, **kwargs):
        p = get_object_or_404(Project, id=int(project_id))
        return view(request, p=p, *args, **kwargs)
    return wrapper
