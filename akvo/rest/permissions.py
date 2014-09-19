# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from rest_framework.permissions import DjangoModelPermissions


class RSRModelPermissions(DjangoModelPermissions):
    """ Model permissions with a custom perms_map since the standard Django model perms don't work for RSR.
    GET, OPTIONS and HEAD don't require any permission. All others do, the permissions have the pattern
    "rsr_rest_<http method>_<model name>"
    """
    perms_map = {
        'GET': [],
        'OPTIONS': [],
        'HEAD': [],
        'POST': ['%(app_label)s.rsr_rest_post_%(model_name)s'],
        'PUT': ['%(app_label)s.rsr_rest_put_%(model_name)s'],
        'PATCH': ['%(app_label)s.rsr_rest_patch_%(model_name)s'],
        'DELETE': ['%(app_label)s.rsr_rest_delete_%(model_name)s'],
    }

