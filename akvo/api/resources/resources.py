# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned

from tastypie import http

from tastypie.resources import ModelResource

from akvo.api.fields import bundle_related_data_info_factory

def get_extra_thumbnails(image_field):
    try:
        thumbs = image_field.extra_thumbnails
        return {key: thumbs[key].absolute_url for key in thumbs.keys()}
    except:
        return None


class ConditionalFullResource(ModelResource):

    def apply_filters(self, request, applicable_filters):
        """
        An ORM-specific implementation of ``apply_filters``.

        The default simply applies the ``applicable_filters`` as ``**kwargs``,
        but should make it possible to do more advanced things.

        Here we override to check for a 'distinct' query string variable,
        if it's equal to True we apply distinct() to the queryset after filtering.
        """
        distinct = request.GET.get('distinct', 'True') == 'True'
        if distinct:
            return self.get_object_list(request).filter(**applicable_filters).distinct()
        else:
            return self.get_object_list(request).filter(**applicable_filters)

    # def get_list(self, request, **kwargs):
    #     """
    #     Returns a serialized list of resources.
    #
    #     Calls ``obj_get_list`` to provide the data, then handles that result
    #     set and serializes it.
    #
    #     Should return a HttpResponse (200 OK).
    #     --------------------------------------
    #     This is a "gutted" get_list where most of the code has been moved to CachedResourceJob.fetch so that cacheback can
    #     do its thing and only run the original get_list if we don't have anything in the cache
    #     """
    #     desired_format = self.determine_format(request)
    #     cached_resource = CachedResourceJob(self, request, kwargs)
    #     url = "%s?%s" % (request.path, request.META['QUERY_STRING'])
    #     serialized = cached_resource.get(url)#.decode("zlib").decode("utf8")
    #     return HttpResponse(content=serialized, content_type=build_content_type(desired_format))
    #
    # def get_detail(self, request, **kwargs):
    #     """
    #     Returns a single serialized resource.
    #
    #     Calls ``cached_obj_get/obj_get`` to provide the data, then handles that result
    #     set and serializes it.
    #
    #     Should return a HttpResponse (200 OK).
    #     """
    #     basic_bundle = self.build_bundle(request=request)
    #
    #     try:
    #         obj = self.cached_obj_get(bundle=basic_bundle, **self.remove_api_resource_names(kwargs))
    #     except ObjectDoesNotExist:
    #         return http.HttpNotFound()
    #     except MultipleObjectsReturned:
    #         return http.HttpMultipleChoices("More than one resource is found at this URI.")
    #
    #     bundle = self.build_bundle(obj=obj, request=request)
    #     # add metadata to bundle to keep track of "depth", "ancestor" and "full" info
    #     bundle.related_info = bundle_related_data_info_factory(request=request)
    #     # end add
    #     bundle = self.full_dehydrate(bundle)
    #     bundle = self.alter_detail_data_to_serialize(request, bundle)
    #     return self.create_response(request, bundle)


    def get_list(self, request, **kwargs):
        """
        Returns a serialized list of resources.

        Calls ``obj_get_list`` to provide the data, then handles that result
        set and serializes it.

        Should return a HttpResponse (200 OK).
        """
        # TODO: Uncached for now. Invalidation that works for everyone may be
        #       impossible.
        base_bundle = self.build_bundle(request=request)
        objects = self.obj_get_list(bundle=base_bundle, **self.remove_api_resource_names(kwargs))
        sorted_objects = self.apply_sorting(objects, options=request.GET)
        paginator = self._meta.paginator_class(request.GET, sorted_objects, resource_uri=self.get_resource_uri(),
                                               limit=self._meta.limit, max_limit=self._meta.max_limit,
                                               collection_name=self._meta.collection_name)
        to_be_serialized = paginator.page()

        # Dehydrate the bundles in preparation for serialization.
        bundles = []

        for obj in to_be_serialized[self._meta.collection_name]:
            bundle = self.build_bundle(obj=obj, request=request)
            # add metadata to bundle to keep track of "depth", "ancestor" and "full" info
            bundle.related_info = bundle_related_data_info_factory(request=request)
            # end add
            bundles.append(self.full_dehydrate(bundle))

        to_be_serialized[self._meta.collection_name] = bundles
        to_be_serialized = self.alter_list_data_to_serialize(request, to_be_serialized)
        return self.create_response(request, to_be_serialized)

    def get_detail(self, request, **kwargs):
        """
        Returns a single serialized resource.

        Calls ``cached_obj_get/obj_get`` to provide the data, then handles that result
        set and serializes it.

        Should return a HttpResponse (200 OK).
        """
        basic_bundle = self.build_bundle(request=request)

        try:
            obj = self.cached_obj_get(bundle=basic_bundle, **self.remove_api_resource_names(kwargs))
        except ObjectDoesNotExist:
            return http.HttpNotFound()
        except MultipleObjectsReturned:
            return http.HttpMultipleChoices("More than one resource is found at this URI.")

        bundle = self.build_bundle(obj=obj, request=request)
        # add metadata to bundle to keep track of "depth", "ancestor" and "full" info
        bundle.related_info = bundle_related_data_info_factory(request=request)
        # end add
        bundle = self.full_dehydrate(bundle)
        bundle = self.alter_detail_data_to_serialize(request, bundle)
        return self.create_response(request, bundle)

