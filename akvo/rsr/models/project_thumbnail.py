import re

from django.core.exceptions import ValidationError
from django.db import models

from akvo.rsr.models import Project

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
