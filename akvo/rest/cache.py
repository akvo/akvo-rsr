#!/usr/bin/env python3
from typing import Dict, List

from akvo.cache import cache_with_key, delete_cache_data
from akvo.rest.serializers import ProjectDirectorySerializer
from akvo.rsr.models import Country, Partnership, ProjectLocation, RecipientCountry, Sector
from akvo.rsr.models.project import Project, project_directory_cache_key

PROJECT_DIRECTORY_CACHE = 'database'


# NOTE: The data doesn't timeout, since we expect the data to be invalidated
# when the data is updated from the project editor. Also, the script to fill the
# cache should be able to clear the cache and create new values.
@cache_with_key(project_directory_cache_key, timeout=None, cache_name=PROJECT_DIRECTORY_CACHE)
def serialized_project(
        project: Project,
        location_cache: Dict[int, List[ProjectLocation]],
        partnership_cache: Dict[int, List[Partnership]],
        recipient_country_cache: Dict[int, List[RecipientCountry]],
        sector_cache: Dict[int, List[Sector]],
        country_cache: Dict[int, Country],
):
    return ProjectDirectorySerializer(
        location_cache,
        partnership_cache,
        recipient_country_cache,
        sector_cache,
        country_cache,
        instance=project,
    ).data


def delete_project_from_project_directory_cache(project: Project):
    delete_cache_data(project_directory_cache_key(project), PROJECT_DIRECTORY_CACHE)
