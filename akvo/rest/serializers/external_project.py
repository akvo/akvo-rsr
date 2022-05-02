from rest_framework import serializers

from akvo.rest.serializers.rsr_serializer import BaseRSRSerializer
from akvo.rsr.models import ExternalProject


class ExternalProjectSerializer(BaseRSRSerializer):
    id = serializers.ReadOnlyField()

    class Meta:
        model = ExternalProject
        exclude = ("related_project",)
