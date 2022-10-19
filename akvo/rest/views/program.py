from akvo.rest.serializers import ProjectMetadataSerializer
from akvo.rest.viewsets import ReadOnlyPublicProjectViewSet
from akvo.rsr.models import Project


class ProgramViewSet(ReadOnlyPublicProjectViewSet):
    queryset = Project.objects.filter(projecthierarchy__isnull=False).prefetch_related(
        'publishingstatus',
        'categories',
        'keywords',
        'partners',
        'projecthierarchy'
    )
    serializer_class = ProjectMetadataSerializer
