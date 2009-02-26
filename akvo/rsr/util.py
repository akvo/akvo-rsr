# utility functions for RSR

def groups_from_request(request):
    """
    Return a list with the groups the current user belongs to.
    """
    return [g.name for g in request.user.groups.all()]