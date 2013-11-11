# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.core.urlresolvers import reverse

from tastypie import fields

from tastypie.authorization import Authorization
from tastypie.constants import ALL, ALL_WITH_RELATIONS
from akvo.api.fields import ConditionalFullToOneField
from tastypie.resources import ModelResource

from akvo.api.authentication import ConditionalApiKeyAuthentication

from akvo.rsr.models import Benchmark, Benchmarkname

from .resources import ConditionalFullResource

class IATIBenchmarkResource(ModelResource):
    project = fields.ToOneField('akvo.api.resources.IATIProjectResource', 'project')
    category = fields.ToOneField('akvo.api.resources.CategoryResource', 'category')
    name = fields.ToOneField('akvo.api.resources.BenchmarknameResource', 'name', full=True)

    class Meta:
        allowed_methods = ['post']
        resource_name   = 'iati_benchmark'
        authorization   = Authorization()
        authentication  = ConditionalApiKeyAuthentication(methods_requiring_key=['POST'])
        queryset        = Benchmark.objects.all()

    def hydrate_name(self, bundle):
        bundle.data['name'] = reverse(
            'api_dispatch_detail', kwargs={
                'resource_name':'benchmarkname', 'api_name': 'v1', 'pk': bundle.data['name']
            }
        )
        return bundle

    def hydrate_category(self, bundle):
        bundle.data['category'] = reverse(
            'api_dispatch_detail', kwargs={
                'resource_name':'category', 'api_name': 'v1', 'pk': bundle.data['category']
            }
        )
        return bundle

    def hydrate_value(self, bundle):
        "Values have to be integers"
        try:
            bundle.data['value'] = int(round(float(bundle.data['value'])))
        except:
            # TODO: logging!
            bundle.data['value'] = 0
        return bundle


class BenchmarkResource(ConditionalFullResource):
    project = ConditionalFullToOneField('akvo.api.resources.ProjectResource', 'project')
    category = ConditionalFullToOneField('akvo.api.resources.CategoryResource', 'category')
    name = ConditionalFullToOneField('akvo.api.resources.BenchmarknameResource', 'name', full=True)

    class Meta:
        allowed_methods = ['get']
        queryset        = Benchmark.objects.all()
        resource_name   = 'benchmark'
        filtering       = dict(
            # foreign keys
            category    = ALL_WITH_RELATIONS,
            name        = ALL_WITH_RELATIONS,
            project     = ALL_WITH_RELATIONS,
        )


class BenchmarknameResource(ConditionalFullResource):
    class Meta:
        allowed_methods = ['get']
        queryset        = Benchmarkname.objects.all()
        resource_name   = 'benchmarkname'
        filtering       = dict(
            # other fields
            name        = ALL,
        )
