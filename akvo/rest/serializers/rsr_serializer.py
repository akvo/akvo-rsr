# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.db import models

from rest_framework import serializers

from ..fields import NonNullCharField, NonNullURLField
from akvo.rsr.fields import ValidXMLCharField, ValidXMLTextField


class BaseRSRSerializer(serializers.ModelSerializer):
    def __init__(self, *args, **kwargs):
        super(BaseRSRSerializer, self).__init__(*args, **kwargs)

        # Add 'absolute_url' field if the model defines the get_absolute_url method
        if getattr(self.Meta.model, 'get_absolute_url', None):
            self.fields['absolute_url'] = serializers.ReadOnlyField(source='get_absolute_url')

        # Add the ValidXMLXXXFields to the model-to-rest-field mapping and use the modified
        # CharField, NonNullCharField or URLField that returns '' for None values.
        self.serializer_field_mapping.update(
            {
                models.URLField: NonNullURLField,
                ValidXMLCharField: NonNullCharField,
                ValidXMLTextField: NonNullCharField,
            }
        )

    def get_uniqueness_extra_kwargs(self, field_names, declared_fields, extra_kwargs):
        """Reimplemented to work around https://github.com/encode/django-rest-framework/pull/4192/

        *NOTE*: This is a hack to prevent ReadOnlyFields that are a part of
        unique_together constraints to be marked as HiddenFields. This bug was
        fixed in the PR above (DRF version 3.4.0), but we will need to upgrade
        Django to >=1.8. This hack can be removed once that is done.

        """
        extra_kwargs, hidden_fields = super(BaseRSRSerializer, self).get_uniqueness_extra_kwargs(
            field_names, declared_fields, extra_kwargs
        )

        model = getattr(self.Meta, 'model')
        unique_constraint_names = set()

        for parent_class in [model] + list(model._meta.parents.keys()):
            for unique_together_list in parent_class._meta.unique_together:
                if set(field_names).issuperset(set(unique_together_list)):
                    unique_constraint_names |= set(unique_together_list)

        for field_name in hidden_fields.keys():
            if field_name not in unique_constraint_names:
                continue
            if field_name in self._declared_fields and self._declared_fields[field_name].read_only:
                hidden_fields.pop(field_name)

        return extra_kwargs, hidden_fields
