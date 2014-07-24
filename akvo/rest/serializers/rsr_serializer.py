# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
from django.db import models

from rest_framework import serializers

from ..fields import NonNullCharField, NonNullURLField, Base64ImageField
from akvo.rsr.fields import ValidXMLCharField, ValidXMLTextField


# class BaseRSRSerializer(serializers.HyperlinkedModelSerializer):
#     TODO: find a way to use the HyperlinkedModelSerializer when using the browsable API
#     pass


class BaseRSRSerializer(serializers.ModelSerializer):
    def __init__(self, *args, **kwargs):
        """ Add the ValidXMLXXXFields to the model-to-rest-field mapping and use the modified CharField,
            NonNullCharField, that returns '' for None values
        """
        super(BaseRSRSerializer, self).__init__(*args, **kwargs)
        self.field_mapping.update(
            {
                models.URLField: NonNullURLField,
                ValidXMLCharField: NonNullCharField,
                ValidXMLTextField: NonNullCharField,
            }
        )
