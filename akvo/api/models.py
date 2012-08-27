# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

#import datetime
#import hmac
#import uuid
#
#from hashlib import sha1
#
#from django.contrib.contenttypes import generic
#from django.contrib.contenttypes.models import ContentType
#from django.db import models

from tastypie.models import ApiKey

#class AkvoApiKey(models.Model):
#    """ based on the tastypie APiKey but with a generic relation so we can
#    associate both UserProfile and Organisation objects
#    """
#    key = models.CharField(max_length=256, blank=True, default='')
#    created = models.DateTimeField(default=datetime.datetime.now)
#    content_type = models.ForeignKey(ContentType)
#    object_id = models.PositiveIntegerField()
#    content_object = generic.GenericForeignKey()
#
#    def __unicode__(self):
#        return u"API key for %s %s: %s" % (self.content_type, self.content_object, self.key)
#
#    def save(self, *args, **kwargs):
#        if not self.key:
#            self.key = self.generate_key()
#
#        return super(AkvoApiKey, self).save(*args, **kwargs)
#
#    def generate_key(self):
#        # Get a random UUID.
#        new_uuid = uuid.uuid4()
#        # Hmac that beast.
#        return hmac.new(str(new_uuid), digestmod=sha1).hexdigest()


def create_api_key(sender, **kwargs):
    """
    A signal for hooking up automatic ApiKey creation.
    Slightly modified from the tastypie function to generate a key when saving an existing user if no key exists
    """
    if not kwargs.get('raw', False):
        user_profile = kwargs.get('instance')
        ApiKey.objects.get_or_create(user=user_profile.user)

