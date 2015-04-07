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
from sorl.thumbnail import get_thumbnail


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

    def to_native(self, value):
        """
        :param value: A Base64ImageField object
        :return: The full path to the image. If the request includes a special query string param a thumbnail is
            generated and returned along with the original

        If the querystring part of the request includes the query param "image_thumb_name" a thumbnail is generated,
        provided that at least one of "width" and "height" parameters is also supplied. The image_thumb_name value is
        used as the key for the thumbnail in the dict returned.
        If a thumbnail is included a dict with two members is returned:
        {
            'original': '/full/path/to/original/image.png',
            '<value of image_thumb_name QS param>': '/full/path/to/thumbnail/image.png'
        }
        This dict will be converted as appropriate to JSON or XML

        NOTE: This special functionality works best when there is only one image field in a model. If there are more,
        things will still work (I think), but all thumbs returned will have the same dimensions
        """
        ORIGINAL_KEY = u'original'
        if value:
            # get the full path of original image
            image_url = value.url
            image_thumb_name = self.context['request'].GET.get('image_thumb_name')
            # do we have a request for a thumbnail?
            # also make sure the thumb isn't named "original"!
            if image_thumb_name and image_thumb_name.lower() != ORIGINAL_KEY:
                width = self.context['request'].GET.get('width')
                height = self.context['request'].GET.get('height')
                # set thumb size according to what data we got
                if width and height:
                    thumb = get_thumbnail(value, '{}x{}'.format(width, height), quality=99)
                elif width:
                    thumb = get_thumbnail(value, '{}'.format(width), quality=99)
                elif height:
                    thumb = get_thumbnail(value, 'x{}'.format(height), quality=99)
                else:
                    # bail if we get neither width nor heigth
                    return image_url
                # populate dict with original and thumb paths
                image_dict = {ORIGINAL_KEY: image_url}
                image_dict[image_thumb_name] = thumb.url
                return image_dict
            return image_url

    def get_file_extension(self, filename, decoded_file):
        extension = imghdr.what(filename, decoded_file)
        extension = "jpg" if extension == "jpeg" else extension
        return extension
