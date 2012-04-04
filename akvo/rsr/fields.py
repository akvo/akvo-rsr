# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator, MaxLengthValidator
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


class LimitedTextField(models.TextField):

    description = _("A TextField that honors the max_length param")

    def __init__(self, *args, **kwargs):
        max_length = kwargs.pop('max_length', None)
        super(LimitedTextField, self).__init__(*args, **kwargs)
        if max_length:
            self.validators += [MaxLengthValidator(max_length)]


class ProjectLimitedTextField(LimitedTextField):

    description = _("A TextField that honors the max_length param for 'new' projects")

    def clean(self, value, model_instance):
        """ Don't apply the MaxLengthValidator to "old" projects. OLD_PROJECT_MAX_ID should be lowered as projects are
            brought within the field length limits and eventually the OLD_PROJECT_MAX_ID can be removed
        """
        if model_instance.id and model_instance.id <= getattr(settings, 'OLD_PROJECT_MAX_ID', 0):
            self.validators = [v for v in self.validators if type(v) != MaxLengthValidator]
        return super(LimitedTextField, self).clean(value, model_instance)
