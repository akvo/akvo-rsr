# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.core.exceptions import ObjectDoesNotExist

from tastypie import fields
from tastypie.bundle import Bundle
from tastypie.exceptions import ApiFieldError


def bundle_related_data_info_factory(request=None, parent_bundle=None):
    """ Create and return a BundleRelatedDataInfo object
    If we have a request this is a "top" bundle i.e. it has no parents and the BundleRelatedDataInfo should reflect this
    If we receive a parent_bundle we decrement the depth and add the parent_bundle to ancestors unless it's already there
    """
    if request:
        try:
            depth = int(request.GET.get('depth', 'not an int'))
            if depth > 0:
                full = 'True' == request.GET.get('full', False)
                if full:
                    if depth > 3:
                        depth = 3
                else:
                    if depth > 6:
                        depth = 6
                # internally depth is twice the number of relations crossed
                depth = depth * 2
                ancestors = []
            else:
                return None
        except:
            return None
    else:
        parent_info = parent_bundle.related_info
        depth = parent_info.depth - 1
        ancestors = parent_info.ancestors
        if not parent_bundle.obj in parent_info.ancestors:
            ancestors.append(parent_bundle.obj)
        full = parent_info.full
    return BundleRelatedDataInfo(depth, ancestors, full)


class BundleRelatedDataInfo(object):
    """ Helper object for storing info about the inclusion of related data in resources

    The idea is to allow resources to be automatically included with their full data if they are not more than "depth"
    relations away from the root ancestor resource. For example if we request the ProjectResource with depth=2 we get
    full data inline for Partnership and Organisation resources since they are 1 and 2 foreign key away respectively,
    but we get a path to OrgansiationLocationResource since it's 3 relations away.

    If self.full is set to True full data is returned even when the same object is visited more than once, otherwise it's
    substituted by a path after the first time
    """
    def __init__(self, depth, ancestors, full):
        self.depth = depth
        self.ancestors = ancestors
        self.full = full


class ConditionalFullFieldMixin(object):

    def dehydrate_related(self, bundle, related_resource):
        """
        Based on the ``full_resource``, returns either the endpoint or the data
        from ``full_dehydrate`` for the related resource.
        """
        if self.full:
            # ZOMG extra data and big payloads.
            new_bundle = related_resource.build_bundle(obj=related_resource.instance, request=bundle.request)
            return related_resource.full_dehydrate(new_bundle)

        parent_info = getattr(bundle, 'related_info', False)
        if parent_info and parent_info.depth > 0 and (not related_resource.instance in parent_info.ancestors or parent_info.full):
            new_bundle = related_resource.build_bundle(obj=related_resource.instance, request=bundle.request)
            new_bundle.related_info = bundle_related_data_info_factory(parent_bundle=bundle)
            return related_resource.full_dehydrate(new_bundle)

        return related_resource.get_resource_uri(bundle)


class ConditionalFullToOneField(ConditionalFullFieldMixin, fields.ToOneField):

    def dehydrate(self, bundle):
        try:
            foreign_obj = getattr(bundle.obj, self.attribute)
        except ObjectDoesNotExist:
            foreign_obj = None

        if not foreign_obj:
            if not self.null:
                raise ApiFieldError("The model '%r' has an empty attribute '%s' and doesn't allow a null value." % (bundle.obj, self.attribute))

            return None

        self.fk_resource = self.get_related_resource(foreign_obj)
        fk_bundle = Bundle(obj=foreign_obj, request=bundle.request)
        # add by zzgvh
        if getattr(bundle, 'related_info', False):
            fk_bundle.related_info = bundle_related_data_info_factory(parent_bundle=bundle)
        # end add
        return self.dehydrate_related(fk_bundle, self.fk_resource)


class ConditionalFullToManyField(ConditionalFullFieldMixin, fields.ToManyField):

    def dehydrate(self, bundle):
        if not bundle.obj or not bundle.obj.pk:
            if not self.null:
                raise ApiFieldError("The model '%r' does not have a primary key and can not be used in a ToMany context." % bundle.obj)

            return []

        the_m2ms = None

        if isinstance(self.attribute, basestring):
                the_m2ms = getattr(bundle.obj, self.attribute)
        elif callable(self.attribute):
            the_m2ms = self.attribute(bundle)

        if not the_m2ms:
            if not self.null:
                raise ApiFieldError("The model '%r' has an empty attribute '%s' and doesn't allow a null value." % (bundle.obj, self.attribute))

            return []

        self.m2m_resources = []
        m2m_dehydrated = []

        # TODO: Also model-specific and leaky. Relies on there being a
        #       ``Manager`` there.
        for m2m in the_m2ms.all():
            m2m_resource = self.get_related_resource(m2m)
            m2m_bundle = Bundle(obj=m2m, request=bundle.request)
            # add by zzgvh
            if getattr(bundle, 'related_info', False):
                m2m_bundle.related_info = bundle_related_data_info_factory(parent_bundle=bundle)
                # end add
            self.m2m_resources.append(m2m_resource)
            m2m_dehydrated.append(self.dehydrate_related(m2m_bundle, m2m_resource))

        return m2m_dehydrated

