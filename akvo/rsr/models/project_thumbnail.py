import re
from typing import Optional

from django.core.exceptions import ValidationError
from django.db import models
from timeout_decorator import timeout as timeout_dec

from akvo.rsr.models import Project
from akvo.utils import get_thumbnail

GEOMETRY_RE = re.compile(r"\d+x\d+")


def validate_geometry_string(string: str):
    if not GEOMETRY_RE.match(string):
        raise ValidationError("Geometry must have the format <number>x<number>")


class ProjectThumbnail(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="thumbnails")
    geometry = models.CharField(max_length=100, validators=[validate_geometry_string])
    url = models.URLField()

    # URL to the full image
    # Also serves as a cache for filtering
    full_size_url = models.URLField()

    class Meta:
        unique_together = ["project", "full_size_url", "geometry"]


def get_cached_thumbnail(
        project: Project,
        geometry: str,
        prefetched: bool = True,
        timeout: float = 0.5
) -> Optional[ProjectThumbnail]:
    """
    Gets a project's thumbnail with the given geometry

    The ProjectThumbnail table acts as a cache for the thumbnail URLs
     so if the thumbnail with given geometry doesn't exist,
     it'll have to be generated.

    :param prefetched: If the project was retrieved with QuerySet.prefetch_related
                       If so, no DB query will be necessary should the thumbnail exist
    """
    if not (project.current_image and project.current_image.url):
        return

    full_size_url = project.current_image.url
    if prefetched:
        # Can't use QuerySet.filter() on prefetched querysets
        thumb = next(
            iter(
                t for t in project.thumbnails.all()
                if t.full_size_url == full_size_url and t.geometry == geometry
            ),
            None
        )
    else:
        thumb = project.thumbnails.filter(
            full_size_url=full_size_url, geometry=geometry
        ).first()

    if not thumb:
        # Cache the thumbnail
        timeout_get_thumbnail = timeout_dec(timeout)(get_thumbnail)
        thumbnail = timeout_get_thumbnail(project.current_image, geometry, crop="smart", quality=99)
        thumb = project.thumbnails.create(
            geometry=geometry,
            url=thumbnail.url,
            full_size_url=full_size_url
        )
    return thumb
