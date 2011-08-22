from django.db import models


class CharNullField(models.CharField):
    description = "CharField that stores NULL but returns an empty string"
    def to_python(self, value):
        if isinstance(value, models.CharField):
            return value 
        if value is None:
            return ''
        else:
            return value

    def get_db_prep_value(self, value):
        if value == '':
            return None
        else:
            return value
