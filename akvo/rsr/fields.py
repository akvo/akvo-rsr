from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models
from django.utils.translation import ugettext_lazy as _


class NullCharField(models.CharField):

    description = _("CharField that stores NULL but returns an empty string")

    def to_python(self, value):
        if isinstance(value, models.CharField):
            return value 
        if value is None:
            return ''
        return value

    def get_db_prep_value(self, value, connection, prepared=False):
        if not value:
            return None
        return value


class LatitudeField(models.FloatField):

    description = _('Latitude coordinate.')

    def __init__(self, *args, **kwargs):
        super(LatitudeField, self).__init__(*args, **kwargs)
        self.validators = [MinValueValidator(-90), MaxValueValidator(90)]


class LongitudeField(models.FloatField):

    description = _('Longitude coordinate.')

    def __init__(self, *args, **kwargs):
        super(LongitudeField, self).__init__(*args, **kwargs)
        self.validators = [MinValueValidator(-180), MaxValueValidator(180)]
