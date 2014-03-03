# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.conf.urls import url

from tastypie import fields
from tastypie.resources import Resource

from akvo.utils import right_now_in_akvo


class RightNowInAkvoObject(object):
    def populate(self):
        data = right_now_in_akvo()
        self.number_of_organisations = data['number_of_organisations']
        self.number_of_projects = data['number_of_projects']
        self.people_served = data['people_served']
        self.projects_budget_millions = data['projects_budget_millions']


class RightNowInAkvoResource(Resource):
    number_of_organisations = fields.IntegerField(attribute='number_of_organisations')
    number_of_projects = fields.IntegerField(attribute='number_of_projects')
    people_served = fields.IntegerField(attribute='people_served')
    projects_budget_millions = fields.FloatField(attribute='projects_budget_millions')

    class Meta:
        # Disallow list operations
        list_allowed_methods = []
        detail_allowed_methods = ['get',]
        object_class = RightNowInAkvoObject
        resource_name = 'right_now_in_akvo'
        include_resource_uri = False

    # Override urls such that GET:right_now_in_akvo/ is actually the detail endpoint
    def prepend_urls(self):
        return [
            url(r"^(?P<resource_name>%s)/$" % self._meta.resource_name, self.wrap_view('dispatch_detail'),
                name="api_dispatch_detail"),
        ]

    def obj_get(self, bundle, **kwargs):
        rnia = RightNowInAkvoObject()
        rnia.populate()
        return rnia
