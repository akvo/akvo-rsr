from factory.django import DjangoModelFactory
from factory.fuzzy import FuzzyText

from akvo.rsr.models import ExternalProject


class ExternalProjectFactory(DjangoModelFactory):
    class Meta:
        model = ExternalProject

    iati_id = FuzzyText(length=100)
