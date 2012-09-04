# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from tastypie.models import ApiKey

def create_api_key(sender, **kwargs):
    """
    A signal for hooking up automatic ApiKey creation.
    Slightly modified from the tastypie function to generate a key when saving an existing user if no key exists
    """
    if not kwargs.get('raw', False):
        user_profile = kwargs.get('instance')
        ApiKey.objects.get_or_create(user=user_profile.user)
