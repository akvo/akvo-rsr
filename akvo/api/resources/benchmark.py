# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from tastypie.constants import ALL, ALL_WITH_RELATIONS

from akvo.api.fields import ConditionalFullToOneField

from akvo.rsr.models import Benchmark, Benchmarkname

from .resources import ConditionalFullResource


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
