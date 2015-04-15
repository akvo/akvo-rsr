# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from tastypie import fields
from tastypie.cache import SimpleCache
from tastypie.constants import ALL, ALL_WITH_RELATIONS
from tastypie.resources import ModelResource
from tastypie.utils.mime import build_content_type

from django.http import HttpResponse

from akvo import settings

from akvo.rsr.models import Organisation, Project

from .resources import get_extra_thumbnails


class CachedMapResource(ModelResource):
    """
    Base class for maps API calls that need caching for speed
    """
    class Meta:
        max_limit = 10
        allowed_methods = ['get']
        include_absolute_url = True
        cache = SimpleCache(timeout=getattr(settings, 'MAP_CACHE_TIMEOUT_SECONDS', 3600)) #an hour

    def get_list(self, request, **kwargs):
        """
        Returns a serialized list of resources.

        Calls ``obj_get_list`` to provide the data, then handles that result
        set and serializes it.

        Should return a HttpResponse (200 OK).

        Addition by zzgvh:
        Add caching of the serialized result for use in the large maps
        """
        desired_format = self.determine_format(request)
        cache_key = self.generate_cache_key('list', **request.GET)
        serialized = self._meta.cache.get(cache_key)

        if serialized is None:
            base_bundle = self.build_bundle(request=request)
            objects = self.obj_get_list(bundle=base_bundle, **self.remove_api_resource_names(kwargs))
            sorted_objects = self.apply_sorting(objects, options=request.GET)

            paginator = self._meta.paginator_class(
                request.GET, sorted_objects, resource_uri=self.get_resource_uri(),
                limit=self._meta.limit, max_limit=self._meta.max_limit,
                collection_name=self._meta.collection_name
            )
            to_be_serialized = paginator.page()

            # Dehydrate the bundles in preparation for serialization.
            bundles = []
            for obj in to_be_serialized[self._meta.collection_name]:
                bundle = self.build_bundle(obj=obj, request=request)
                bundles.append(self.full_dehydrate(bundle))

            to_be_serialized[self._meta.collection_name] = bundles
            to_be_serialized = self.alter_list_data_to_serialize(request, to_be_serialized)
            serialized = self.serialize(request, to_be_serialized, desired_format)
            self._meta.cache.set(cache_key, serialized)

        return HttpResponse(content=serialized, content_type=build_content_type(desired_format))

class OrganisationMapResource(CachedMapResource):
    """
    a limited resource for delivering data to be used when creating maps
    """
    primary_location    = fields.ToOneField('akvo.api.resources.OrganisationMapLocationResource', 'primary_location', full=True, null=True)

    class Meta(CachedMapResource.Meta):
        queryset = Organisation.objects.select_related('primary_location', 'primary_location__country')
        resource_name = 'map_for_organisation'

        filtering       = dict(
            # other fields
            iati_org_id         = ALL,
            name                = ALL,
            organisation_type   = ALL,
            # foreign keys
            locations           = ALL_WITH_RELATIONS,
            partnerships        = ALL_WITH_RELATIONS,
            )

    def dehydrate(self, bundle):
        """ add thumbnails inline info for Organisation.logo
        """
        bundle = super(OrganisationMapResource, self).dehydrate(bundle)
        del bundle.data['description']
        bundle.data['logo'] = {
            'original': bundle.data['logo'],
            'thumbnails': get_extra_thumbnails(bundle.obj.logo),
            }
        return bundle


class ProjectMapResource(CachedMapResource):
    """
    a limited resource for delivering data to be used when creating maps
    """
    primary_location    = fields.ToOneField('akvo.api.resources.ProjectMapLocationResource', 'primary_location', full=True, null=True)

    class Meta(CachedMapResource.Meta):
        queryset = Project.objects.select_related('primary_location', 'primary_location__country').published()
        resource_name = 'map_for_project'

        filtering               = dict(
            # other fields
            status              = ALL,
            title               = ALL,
            budget              = ALL,
            funds               = ALL,
            funds_needed        = ALL,
            # foreign keys
            benchmarks          = ALL_WITH_RELATIONS,
            budget_items        = ALL_WITH_RELATIONS,
            categories          = ALL_WITH_RELATIONS,
            goals               = ALL_WITH_RELATIONS,
            invoices            = ALL_WITH_RELATIONS,
            links               = ALL_WITH_RELATIONS,
            partnerships        = ALL_WITH_RELATIONS,
            project_comments    = ALL_WITH_RELATIONS,
            project_updates     = ALL_WITH_RELATIONS,
        )

    def dehydrate(self, bundle):
        """ add thumbnails inline info for Project.current_image
        """
        bundle = super(ProjectMapResource, self).dehydrate(bundle)
        ignored_fields = ('goals_overview', 'current_status', 'project_plan', 'sustainability', 'background', 'project_rating', 'notes',)
        for field in ignored_fields:
            del bundle.data[field]
        bundle.data['current_image'] = {
            'original': bundle.data['current_image'],
            'thumbnails': get_extra_thumbnails(bundle.obj.current_image),
            }
        return bundle
