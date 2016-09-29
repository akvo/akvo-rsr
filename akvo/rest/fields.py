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
from django.utils.translation import ugettext_lazy as _

from rest_framework import serializers
from rest_framework.fields import ImageField
from sorl.thumbnail import get_thumbnail
from sorl.thumbnail.parsers import ThumbnailParseError


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
        Now also supports thumbnails of different sizes. See to_native() for more info.
    """
    ALLOWED_IMAGE_TYPES = (
        'gif',
        'jpeg',
        'jpg',
        'png',
    )
    def to_internal_value(self, base64_data):
        # Check if this is a base64 string
        if isinstance(base64_data, basestring):
            # Try to decode the file. Return validation error if it fails.
            try:
                decoded_file = base64.b64decode(base64_data)
            except TypeError:
                raise serializers.ValidationError(_(u"Please upload a valid image."))

            # Generate file name:
            file_name = str(uuid.uuid4())[:12] # 12 characters are more than enough.
            # Get the file name extension:
            file_extension = self.get_file_extension(file_name, decoded_file)
            if file_extension not in self.ALLOWED_IMAGE_TYPES:
                raise serializers.ValidationError(
                    _(u"The type of the image couldn't been determined.")
                )
            complete_file_name = file_name + "." + file_extension
            data = ContentFile(decoded_file, name=complete_file_name)
        else:
            data = base64_data

        return super(Base64ImageField, self).to_internal_value(data)

    def to_representation(self, value):
        """
        :param value: A Base64ImageField object
        :return: a path to a thumbnail with a predetermined size, the default thumb
        OR
        a dict with a number of thumbnails, one of which is the default, the others being generated
        from the query string parameters, and finally the path to the original image keyed to
        "original".

        The extended functionality, allowing the generation of one or more thumbnails from the
        original image is triggered by including "image_thumb_name" in the query string. The value
        for image_thumb_name is a comma separated list of identifiers for the generated thumbs.
        The names must not be "default" or "original".

        For each thumb thus specified a size must be supplied as a query param on the form
            image_thumb_<name>_<dimension>
        where <name> is the name of the thumb specified as one of the values for image_thumb_name
        and <dimension> is one of "width, "height" or "max_size". width and height must be an integer
        specifying that dimension in pixels. The image will be scaled correctly in the other
        dimension. max_size is width and height concatenated with an "x" and sets the maximum size
        allowed for the respective dimensions, while still maintaining the correct aspect ratio of
        the image.

        Example:
        the querystring
            ?image_thumb_name=big,small&image_thumb_small_width=90&image_thumb_big_max_size=300x200
        results in the following dict being returned:
        {
            'original': '/full/path/to/original/image.png',
            'default': '/full/path/to/default/thumbnail/image.png',
            'small': '/full/path/to/small/thumbnail/image.png',
            'big': '/full/path/to/big/thumbnail/image.png',
        }
        This dict will be converted as appropriate to JSON or XML

        NOTE: This special functionality works best when there is only one image field in a model.
        If there are more, things will still work (I think), but for each image all thumbs returned
        will have the same dimensions
        """
        def get_thumb(request, name):
            if name not in [u'original', u'default']:
                try:
                    width = request.GET.get('image_thumb_{}_width'.format(name))
                    if width:
                        return get_thumbnail(value, '{}'.format(width), quality=99)
                    height = request.GET.get('image_thumb_{}_height'.format(name))
                    if height:
                        return get_thumbnail(value, 'x{}'.format(height), quality=99)
                    # yes this is redundant...code is nearly identical with the width code above
                    # but for clarity of function we keep them separate
                    max_size = request.GET.get('image_thumb_{}_max_size'.format(name))
                    if max_size:
                        return get_thumbnail(value, '{}'.format(max_size), quality=99)
                except (ThumbnailParseError, IOError):
                    return None

            # no size specification matching the name found; give up
            return None

        if value:
            default_width = '191' # width of update images on akvo.org/seeithappen
            try:
                default_thumb = get_thumbnail(value, default_width, quality=99)
                request = self.context['request']
            except (ThumbnailParseError, IOError, KeyError):
                return None

            # look for name(s) of thumb(s)
            image_thumb_name = request.GET.get('image_thumb_name')
            if image_thumb_name:
                names = image_thumb_name.split(',')
                thumbs = {u'original': value.url, u'default': default_thumb.url}
                for name in names:
                    thumb = get_thumb(request, name)
                    if thumb is not None:
                        thumbs[name] = thumb.url
                return thumbs
            return default_thumb.url

    def get_file_extension(self, filename, decoded_file):
        extension = imghdr.what(filename, decoded_file)
        extension = "jpg" if extension == "jpeg" else extension
        return extension
