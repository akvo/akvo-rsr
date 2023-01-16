from factory.django import DjangoModelFactory

from akvo.rsr.models import IndicatorPeriodLabel


class IndicatorPeriodLabelFactory(DjangoModelFactory):
    class Meta:
        model = IndicatorPeriodLabel
