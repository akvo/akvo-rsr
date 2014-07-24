# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import base64
import imghdr
import six
import uuid

from django.core.files.base import ContentFile
from django.utils.encoding import smart_text

from rest_framework import serializers
from rest_framework.fields import ImageField


class NonNullCharField(serializers.CharField):
    """ Fix fo CharField so that '' is returned if the field value is None
        see https://github.com/tomchristie/django-rest-framework/pull/1665
    """
    def from_native(self, value):
        if isinstance(value, six.string_types):
            return value
        if value is None:
            return u''
        return smart_text(value)


class NonNullURLField(NonNullCharField, serializers.URLField):
    pass


class Base64ImageField(ImageField):
    """ A django-rest-framework field for handling image-uploads through raw post data.
        It uses base64 for en-/decoding the contents of the file.
    """
    ALLOWED_IMAGE_TYPES = (
        'gif',
        'jpeg',
        'jpg',
        'png',
    )
    def from_native(self, base64_data):
        # Check if this is a base64 string
        if isinstance(base64_data, basestring):
            # Try to decode the file. Return validation error if it fails.
            try:
                decoded_file = base64.b64decode(base64_data)
            except TypeError:
                raise serializers.ValidationError("Please upload a valid image.")

            # Generate file name:
            file_name = str(uuid.uuid4())[:12] # 12 characters are more than enough.
            # Get the file name extension:
            file_extension = self.get_file_extension(file_name, decoded_file)
            if file_extension not in self.ALLOWED_IMAGE_TYPES:
                raise serializers.ValidationError("The type of the image couldn't been determined.")
            complete_file_name = file_name + "." + file_extension
            data = ContentFile(decoded_file, name=complete_file_name)
        else:
            data = base64_data

        return super(Base64ImageField, self).from_native(data)

    def get_file_extension(self, filename, decoded_file):
        extension = imghdr.what(filename, decoded_file)
        extension = "jpg" if extension == "jpeg" else extension
        return extension
