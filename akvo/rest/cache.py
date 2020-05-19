#!/usr/bin/env python3

from akvo.cache import cache_with_key, delete_cache_data
from akvo.rest.serializers import ProjectDirectorySerializer
from akvo.rsr.models.project import Project, project_directory_cache_key

# FIXME: Should we use a DB cache?
PROJECT_DIRECTORY_CACHE = 'default'


@cache_with_key(project_directory_cache_key, timeout=None, cache_name=PROJECT_DIRECTORY_CACHE)
def serialized_project(project_id):
    project = Project.objects.only(
        'id', 'title', 'subtitle',
        'primary_location__id',
        'primary_organisation__id',
        'primary_organisation__name',
        'primary_organisation__long_name'
    ).select_related(
        'primary_location',
        'primary_organisation',
    ).prefetch_related(
        'locations',
        'locations__country',
        'recipient_countries',
        'partners',
    ).get(pk=project_id)
    return ProjectDirectorySerializer(project).data


def delete_project_from_project_directory_cache(project_id):
    delete_cache_data(project_directory_cache_key(project_id), PROJECT_DIRECTORY_CACHE)
