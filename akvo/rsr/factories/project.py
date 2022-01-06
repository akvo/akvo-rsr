from factory.django import DjangoModelFactory

from akvo.rsr.models import Project


class ProjectFactory(DjangoModelFactory):
    class Meta:
        model = Project
