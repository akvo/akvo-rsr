# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

# tastypie (api)
from tastypie.api import Api
import resources

def named_api(api_name):
    """ api_name is the version part of the api path
    """
    new_api = Api(api_name=api_name)

    for resource in resources.__all__:
        new_api.register(getattr(resources, resource)())
    return new_api
