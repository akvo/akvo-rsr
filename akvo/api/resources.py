# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module. 
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.conf.urls import url
from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned
from django.core.urlresolvers import reverse
from django.forms.models import ModelForm
from django.http import HttpResponse

from tastypie import fields
from tastypie import http

from tastypie.authentication import ApiKeyAuthentication
from tastypie.authorization import Authorization
from tastypie.serializers import Serializer
from tastypie.bundle import Bundle
from tastypie.constants import ALL, ALL_WITH_RELATIONS
from tastypie.exceptions import ApiFieldError
from tastypie.fields import ApiField, NOT_PROVIDED
from tastypie.resources import ModelResource, Resource
from tastypie.authentication import ApiKeyAuthentication
from akvo.api.authentication import ConditionalApiKeyAuthentication

from tastypie.utils.mime import build_content_type

from cacheback.base import Job

import logging
logger = logging.getLogger('akvo.rsr')

from akvo.api.fields import (
    Base64FileField, ConditionalFullToManyField,
    ConditionalFullToOneField, bundle_related_data_info_factory
)
from akvo.api.serializers import IATISerializer
from akvo.api.validation import ModelFormValidation
from akvo.rsr.iati_code_lists import IATI_LIST_ORGANISATION_TYPE

from akvo.rsr.models import (
    Benchmark, Benchmarkname, BudgetItem, BudgetItemLabel, Category, Country, FocusArea, Goal, Link,
    Organisation, OrganisationLocation, Partnership, Project, ProjectLocation, ProjectUpdate,
    ProjectComment, UserProfile, Invoice,
    InternalOrganisationID)
from akvo.rsr.utils import PAYPAL_INVOICE_STATUS_COMPLETE, custom_get_or_create_country, right_now_in_akvo

__all__ = [
    'BenchmarkResource',
    'BenchmarknameResource',
    'BudgetItemResource',
    'BudgetItemLabelResource',
    'CategoryResource',
    'CountryResource',
    'FocusAreaResource',
    'GoalResource',
    'IATIBudgetItemResource',
    'IATIGoalResource',
    'IATIProjectLocationResource',
    'IATIProjectResource',
    'InvoiceResource',
    'LinkResource',
    'OrganisationResource',
    'OrganisationLocationResource',
    'OrganisationMapResource',
    'PartnershipResource',
    'ProjectResource',
    'ProjectCommentResource',
    'ProjectLocationResource',
    'ProjectMapResource',
    'ProjectUpdateResource',
    'RightNowInAkvoResource',
    'UserResource',
    'UserProfileResource',
]

def get_extra_thumbnails(image_field):
    try:
        thumbs = image_field.extra_thumbnails
        return {key: thumbs[key].absolute_url for key in thumbs.keys()}
    except:
        return None


class CachedResourceJob(Job):

    def __init__(self, resource, request, kwargs):
        self.resource = resource
        self.request = request
        self.kwargs = kwargs
        super(CachedResourceJob, self).__init__()

    def fetch(self, url):
        """
        emulates most of Resource.get_list() but stops before calling create_response()
        """
        resource = self.resource
        request = self.request
        kwargs = self.kwargs
        # code of Resource.get_list()

        base_bundle = resource.build_bundle(request=request)
        objects = resource.obj_get_list(bundle=base_bundle, **resource.remove_api_resource_names(kwargs))
        sorted_objects = resource.apply_sorting(objects, options=request.GET)

        paginator = resource._meta.paginator_class(request.GET, sorted_objects, resource_uri=resource.get_resource_uri(),
                                               limit=resource._meta.limit, max_limit=resource._meta.max_limit,
                                               collection_name=resource._meta.collection_name)
        to_be_serialized = paginator.page()

        # Dehydrate the bundles in preparation for serialization.
        # Dehydrate the bundles in preparation for serialization.
        bundles = [resource.build_bundle(obj=obj, request=request) for obj in to_be_serialized['objects']]
        # add metadata to bundle to keep track of "depth", "ancestor" and "full" info
        for bundle in bundles:
            bundle.related_info = bundle_related_data_info_factory(request=request)
        # end add

        for obj in to_be_serialized[resource._meta.collection_name]:
            bundle = resource.build_bundle(obj=obj, request=request)
            bundles.append(resource.full_dehydrate(bundle))

        to_be_serialized[resource._meta.collection_name] = bundles
        to_be_serialized = resource.alter_list_data_to_serialize(request, to_be_serialized)
        # code of Resource.create_response() but only as far as serializing
        # meaning the serialized result is what gets cached
        desired_format = resource.determine_format(request)
        return resource.serialize(request, to_be_serialized, desired_format)#.encode("utf8").encode("zlib")

        # objects = resource.obj_get_list(request=request, **resource.remove_api_resource_names(kwargs))
        # sorted_objects = resource.apply_sorting(objects, options=request.GET)
        #
        # paginator = resource._meta.paginator_class(request.GET, sorted_objects, resource_uri=resource.get_resource_uri(), limit=resource._meta.limit)
        # to_be_serialized = paginator.page()
        #
        # # Dehydrate the bundles in preparation for serialization.
        # bundles = [resource.build_bundle(obj=obj, request=request) for obj in to_be_serialized['objects']]
        # # add metadata to bundle to keep track of "depth", "ancestor" and "full" info
        # for bundle in bundles:
        #     bundle.related_info = bundle_related_data_info_factory(request=request)
        #     # end add
        # to_be_serialized['objects'] = [resource.full_dehydrate(bundle) for bundle in bundles]
        # to_be_serialized = resource.alter_list_data_to_serialize(request, to_be_serialized)
        # # code of Resource.create_response() but only as far as serializing
        # # meaning the serialized result is what gets cached
        # desired_format = resource.determine_format(request)
        # return resource.serialize(request, to_be_serialized, desired_format).encode("utf8").encode("zlib")


class ConditionalFullResource(ModelResource):

    def apply_filters(self, request, applicable_filters):
        """
        An ORM-specific implementation of ``apply_filters``.

        The default simply applies the ``applicable_filters`` as ``**kwargs``,
        but should make it possible to do more advanced things.

        Here we override to check for a 'distinct' query string variable,
        if it's equal to True we apply distinct() to the queryset after filtering.
        """
        distinct = request.GET.get('distinct', False) == 'True'
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


class IATIProjectModelForm(ModelForm):
    class Meta:
        model = Project


class IATIProjectResource(ModelResource):

    budget_items = fields.ToManyField(
        'akvo.api.resources.IATIBudgetItemResource', 'budget_items', full=True, related_name='project'
    )
    goals = ConditionalFullToManyField(
        'akvo.api.resources.IATIGoalResource', 'goals', full=True, related_name='project'
    )
    locations = fields.ToManyField(
        'akvo.api.resources.IATIProjectLocationResource', 'locations', full=True, related_name='location_target'
    )
    partnerships = fields.ToManyField(
        'akvo.api.resources.IATIPartnershipResource', 'partnerships', full=True, related_name='project'
    )

    class Meta:
        allowed_methods = ['post']
        resource_name   = 'iati_activity'
        authorization   = Authorization()
        authentication  = ConditionalApiKeyAuthentication(methods_requiring_key=['POST'])
        serializer      = IATISerializer()
        # validation      = ModelFormValidation(form_class=IATIProjectModelForm)
        queryset        = Project.objects.all()

    def alter_deserialized_detail_data(self, request, data):
        # hack to set the first location as primary
        if data.get('locations'):
            data['locations'][0]['primary'] = True
            for location in data['locations'][1:]:
                location['primary'] = False
        # hack to sum multiple budget tags into one
        if data.get('budget_items'):
            if len(data['budget_items']) > 1:
                data['budget_items'] = [
                    {'amount': '{amount}'.format(
                        amount=sum([int(item['amount']) for item in data['budget_items']])
                    ), 'label': '1'}
                ]
        # hack to truncate org names.
        # Tried to do this in the XSLT but substring(text, 1, 25) sometimes returns more than 25 characters :-p
        # TODO: write a general truncator function for all char and text field of a model's deserialized data
        if data.get('partnerships'):
            if data.get('partnerships'):
                temp_org = data['partnerships'][0]
                # are the requirements met for creating a business unit partnership?
                if temp_org['business_unit'] and temp_org['reporting_org']:
                    data['partnerships'] += [dict(
                        internal_org_id=temp_org['business_unit'],
                        reporting_org=temp_org['reporting_org'],
                        name='Incorrect business unit', #this should never be used, if it is the lookup of existing BUs is borked
                        long_name='Incorrect business unit',
                        partner_type='sponsor',
                        new_organisation_type='21',
                        organisation=None,
                    )]
            for partnership in data['partnerships']:
                partnership[FIELD_NAME] = partnership[FIELD_NAME][:25]
                partnership[FIELD_LONG_NAME] = partnership[FIELD_LONG_NAME][:75]
        return data

    def hydrate_date_complete(self, bundle):
        date_complete = bundle.data.get('date_complete')
        if date_complete and date_complete[-1] == 'Z':
            bundle.data['date_complete'] = date_complete[:-1]
        return bundle

    def hydrate_date_request_posted(self, bundle):
        date_request_posted = bundle.data.get('date_request_posted')
        if date_request_posted and date_request_posted[-1] == 'Z':
            bundle.data['date_request_posted'] = date_request_posted[:-1]
        return bundle

    # def hydrate_partnerships(self, bundle):
    #     import pdb
    #     pdb.set_trace()
    #     return bundle

    # def hydrate_current_image(self, bundle):
    #     import requests
    #
    #     from django.core.files import File
    #     from django.core.files.temp import NamedTemporaryFile
    #     return bundle
    #
    #     def save_image_from_url(model, url):
    #         r = requests.get(url)
    #
    #         img_temp = NamedTemporaryFile(delete=True)
    #         img_temp.write(r.content)
    #         img_temp.flush()
    #
    #         img_name = "%s_%s_%s_%s%s" % (
    #             bundle.obj._meta.object_name,
    #             bundle.obj.pk or '',
    #             'current_image',
    #             datetime.now().strftime("%Y-%m-%d_%H.%M.%S"),
    #             os.path.splitext(img_temp.name)[1],
    #         )
    #         Project.current_image.save("image.jpg", File(img_temp), save=True)


# bundle field names, matching field names on Organisation, InternalOrganisationID and Partnership models
# Organisation
FIELD_IATI_ORG_ID = 'iati_org_id'
FIELD_NAME = 'name'
FIELD_LONG_NAME = 'long_name'
FIELD_NEW_ORGANISATION_TYPE = 'new_organisation_type'
ORG_FIELDS = [FIELD_IATI_ORG_ID, FIELD_NAME, FIELD_LONG_NAME, FIELD_NEW_ORGANISATION_TYPE]
# InternalOrganisationID
FIELD_INTERNAL_ORG_ID = 'internal_org_id'
# Partnership
FIELD_ORGANISATION = 'organisation'
FIELD_IATI_ACTIVITY_ID = 'iati_activity_id'
FIELD_INTERNAL_ID = 'internal_id'
# Meta
FIELD_REPORTING_ORG = 'reporting_org'
FIELD_BUSINESS_UNIT= 'business_unit'

def get_organisation(bundle):
    """ Try to find the organisation to link to in the Partnership
    :param bundle: the tastypie bundle for the IATIPartnershipResource
    :return: either the organisation to link to in the IATIPartnershipResource being created
             or a string of the bundle field to use to create a new Organisation
    """
    ret_val = None
    if bundle.data.get(FIELD_ORGANISATION):
        try:
            organisation = Organisation.objects.get(pk=bundle.data[FIELD_ORGANISATION])
            return organisation
        except:
            # If we don't find an organisation we have an RSR ID for something is seriously wrong
            return None #TODO: better error handling

    if bundle.data.get(FIELD_IATI_ORG_ID):
        try:
            organisation = Organisation.objects.get(iati_org_id=bundle.data[FIELD_IATI_ORG_ID])
            return organisation
        except:
            # return string indicating how we can create a new Organisation
            ret_val = FIELD_IATI_ORG_ID
    if bundle.data.get(FIELD_INTERNAL_ORG_ID) and bundle.data.get(FIELD_REPORTING_ORG):
        try:
            organisation = InternalOrganisationID.objects.get(
                recording_org__iati_org_id=bundle.data[FIELD_REPORTING_ORG],
                identifier=bundle.data[FIELD_INTERNAL_ORG_ID]
            ).referenced_org
            return organisation
        except:
            # return string indicating how we can create a new Organisation
            return FIELD_INTERNAL_ORG_ID
    return ret_val #TODO: better error handling, we may end up here with ret_val == None

def create_organisation(bundle, bundle_field_to_use):
    """ Create an Organisation using bundle_field_to_use to uniquely identify the Organisation
    :param bundle: a tastypie bundle
    :param bundle_field_to_use: a string denoting the field to use to uniquely identify the new Organisation
    :return: an Organisation object
    """
    organisation = None
    new_organisation_type=int(bundle.data[FIELD_NEW_ORGANISATION_TYPE])
    # derive the old organisation type from the new one
    organisation_type = dict(
        zip([type for type, name in IATI_LIST_ORGANISATION_TYPE], Organisation.NEW_TO_OLD_TYPES)
    )[new_organisation_type]
    kwargs = dict(
        name=bundle.data[FIELD_NAME],
        long_name=bundle.data.get(FIELD_LONG_NAME, ''),
        new_organisation_type=new_organisation_type,
        organisation_type= organisation_type
    )
    # use the IATI ID if possible
    if bundle_field_to_use == FIELD_IATI_ORG_ID:
        kwargs[FIELD_IATI_ORG_ID] = bundle.data[FIELD_IATI_ORG_ID]
        try:
            logger.debug("Trying to create an org with kwargs: {kwargs}".format(kwargs=kwargs))
            organisation = Organisation.objects.create(**kwargs)
        except Exception, e:
            logger.exception('{message} Locals:\n {locals}\n\n'.format(message=e.message, locals=locals(), ))
    # otherwise fall back to using the reporting_org's internal ID
    elif bundle_field_to_use == FIELD_INTERNAL_ORG_ID:
        try:
            logger.debug("Trying to create an org with kwargs: {kwargs}".format(kwargs=kwargs))
            organisation = Organisation.objects.create(**kwargs)
            our_organisation = Organisation.objects.get(iati_org_id=bundle.data[FIELD_REPORTING_ORG])
            InternalOrganisationID.objects.create(
                recording_org=our_organisation,
                referenced_org=organisation,
                identifier=bundle.data[FIELD_INTERNAL_ORG_ID],
            )
        except Exception, e:
            logger.exception('{message} Locals:\n {locals}\n\n'.format(message=e.message, locals=locals(), ))
    return organisation


def update_organisation(bundle, organisation):
    for field_name in ORG_FIELDS:
        # Set the organisation field only if it's empty.
        # This way we add data where there is none, but we don't change existing fields
        if bundle.data.get(field_name, False) and not getattr(organisation, field_name, ''):
            setattr(organisation, field_name, bundle.data[field_name])
    if bundle.data.get(FIELD_INTERNAL_ORG_ID, False):
        our_organisation = Organisation.objects.get(iati_org_id=bundle.data[FIELD_REPORTING_ORG])
        InternalOrganisationID.objects.get_or_create(
            recording_org=our_organisation,
            referenced_org=organisation,
            defaults=dict(identifier=bundle.data[FIELD_INTERNAL_ORG_ID]),
        )
    organisation.save()
    return organisation

def get_or_create_organisation(bundle):
    # try to find existing org
    org_or_bundle_field = get_organisation(bundle)
    # if no org found:
    if not org_or_bundle_field:
        return None #Bail!
    if not isinstance(org_or_bundle_field, Organisation):
        # try create a new org
        organisation = create_organisation(bundle, org_or_bundle_field)
        # if we can't crete a new org:
        if not organisation:
            return None # Bail!
    else:
        # Just to make clear what is what
        organisation = org_or_bundle_field
    return update_organisation(bundle, organisation)


class IATIPartnershipResource(ModelResource):
    # Accountable, Extending, Funding, Implementing
    project = fields.ToOneField('akvo.api.resources.IATIProjectResource', 'project', full=True,)
    organisation = fields.ToOneField('akvo.api.resources.OrganisationResource', 'organisation')

    class Meta:
        allowed_methods = ['post']
        resource_name   = 'iati_partnership'
        authorization   = Authorization()
        authentication  = ConditionalApiKeyAuthentication(methods_requiring_key=['POST'])
        queryset        = Partnership.objects.all()

    def hydrate(self, bundle):
        """ Only the reporting org is assigned the FIELD_IATI_ACTIVITY_ID and FIELD_INTERNAL_ID values
        """
        organisation = get_or_create_organisation(bundle)
        if organisation:
            bundle.data[FIELD_ORGANISATION] = organisation
            if organisation.iati_org_id != bundle.data[FIELD_REPORTING_ORG]:
                bundle.data[FIELD_IATI_ACTIVITY_ID] = None
                bundle.data[FIELD_INTERNAL_ID] = None
        return bundle

    def hydrate_organisation(self, bundle):
        # we should have an org already from hydrate()
        if bundle.data[FIELD_ORGANISATION]:
            bundle.data[FIELD_ORGANISATION] = reverse(
                'api_dispatch_detail', kwargs={
                    'resource_name': 'organisation',
                    'api_name': 'v1',
                    'pk': bundle.data[FIELD_ORGANISATION].pk
                }
            )
        return bundle


class IATIBudgetItemResource(ModelResource):
    project = fields.ToOneField('akvo.api.resources.IATIProjectResource', 'project', full=True,)
    label = fields.ToOneField('akvo.api.resources.BudgetItemLabelResource', 'label',)

    class Meta:
        allowed_methods = ['post']
        resource_name   = 'iati_budget_item'
        authorization   = Authorization()
        authentication  = ConditionalApiKeyAuthentication(methods_requiring_key=['POST'])
        queryset        = BudgetItem.objects.all()

    def hydrate_label(self, bundle):
        bundle.data['label'] = reverse(
            'api_dispatch_detail', kwargs={
                'resource_name':'budget_item_label', 'api_name': 'v1', 'pk': bundle.data['label']
            }
        )
        return bundle


class IATIGoalResource(ModelResource):
    project = fields.ToOneField('akvo.api.resources.IATIProjectResource', 'project', full=True,)

    class Meta:
        allowed_methods = ['post']
        resource_name   = 'iati_goal'
        authorization   = Authorization()
        authentication  = ConditionalApiKeyAuthentication(methods_requiring_key=['POST'])
        queryset        = Goal.objects.all()


class IATIProjectLocationResource(ModelResource):
    project = fields.ToOneField('akvo.api.resources.IATIProjectResource', 'location_target', full=True,)
    country = fields.ToOneField('akvo.api.resources.CountryResource', 'country')

    class Meta:
        allowed_methods = ['post']
        resource_name   = 'iati_project_location'
        authorization   = Authorization()
        authentication  = ConditionalApiKeyAuthentication(methods_requiring_key=['POST'])
        queryset        = ProjectLocation.objects.all()

    def hydrate_country(self, bundle):
        country = custom_get_or_create_country(bundle.data['country'])
        bundle.data['country'] = reverse(
            'api_dispatch_detail', kwargs={'resource_name':'country', 'api_name': 'v1', 'pk': country.pk}
        )
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


class BudgetItemResource(ConditionalFullResource):
    label = ConditionalFullToOneField('akvo.api.resources.BudgetItemLabelResource', 'label', full=True)
    project = ConditionalFullToOneField('akvo.api.resources.ProjectResource', 'project')

    class Meta:
        allowed_methods = ['get']
        queryset        = BudgetItem.objects.all()
        resource_name   = 'budget_item'
        filtering       = dict(
            # foreign keys
            label       = ALL_WITH_RELATIONS,
            project     = ALL_WITH_RELATIONS,
        )


class BudgetItemLabelResource(ConditionalFullResource):
    class Meta:
        allowed_methods = ['get']
        queryset        = BudgetItemLabel.objects.all()
        resource_name   = 'budget_item_label'
        filtering       = dict(
            # other fields
            label       = ALL,
        )


class CategoryResource(ConditionalFullResource):
    class Meta:
        allowed_methods = ['get']
        queryset        = Category.objects.all()
        resource_name   = 'category'
        filtering       = dict(
            # other fields
            name        = ALL,
            # foreign keys
            focus_area  = ALL_WITH_RELATIONS,
        )


class CountryResource(ConditionalFullResource):
    class Meta:
        allowed_methods = ['get']
        queryset        = Country.objects.all()
        resource_name   = 'country'
        filtering       = dict(
            # other fields
            iso_code        = ALL,
            continent_code  = ALL,
        )


class FocusAreaResource(ConditionalFullResource):
    categories = ConditionalFullToManyField('akvo.api.resources.CategoryResource', 'categories')

    class Meta:
        allowed_methods = ['get']
        queryset        = FocusArea.objects.all()
        resource_name   = 'focus_area'
        filtering       = dict(
            # other fields
            slug        = ALL,
        )


class GoalResource(ConditionalFullResource):
    project = ConditionalFullToOneField('akvo.api.resources.ProjectResource', 'project')

    class Meta:
        allowed_methods = ['get']
        queryset        = Goal.objects.all()
        resource_name   = 'goal'
        filtering       = dict(
            # foreign keys
            project     = ALL_WITH_RELATIONS,
        )


class InvoiceResource(ConditionalFullResource):
    project = ConditionalFullToOneField('akvo.api.resources.ProjectResource', 'project')

    class Meta:
        allowed_methods = ['get']
        queryset        = Invoice.objects.filter(status__exact=PAYPAL_INVOICE_STATUS_COMPLETE)
        resource_name   = 'invoice'
        fields          = ['amount', 'amount_received', 'is_anonymous',]
        filtering       = dict(
            # foreign keys
            project     = ALL_WITH_RELATIONS,
            user        = ALL_WITH_RELATIONS,
        )

    def dehydrate(self, bundle):
        """ Add name and email for non-anonymous donators
        """
        bundle = super(InvoiceResource, self).dehydrate(bundle)
        if not bundle.obj.is_anonymous:
            bundle.data['email'] = bundle.obj.email
            bundle.data['name'] = bundle.obj.name
        return bundle


class LinkResource(ConditionalFullResource):
    project = ConditionalFullToOneField('akvo.api.resources.ProjectResource', 'project')

    class Meta:
        allowed_methods = ['get']
        queryset        = Link.objects.all()
        resource_name   = 'link'
        filtering       = dict(
            # foreign keys
            project     = ALL_WITH_RELATIONS,
        )

# code	name                                Akvo org type
# 10	Government                      => ORG_TYPE_GOV
# 15	Other Public Sector             => ORG_TYPE_GOV
# 21	International NGO               => ORG_TYPE_NGO
# 22	National NGO                    => ORG_TYPE_NGO
# 23	Regional NGO                    => ORG_TYPE_NGO
# 30	Public Private Partnership      => ?
# 40	Multilateral                    => ?
# 60	Foundation                      => ORG_TYPE_NGO
# 70	Private Sector                  => ORG_TYPE_COM
# 80	Academic, Training and Research => ORG_TYPE_KNO

class OrganisationResource(ConditionalFullResource):
    partnerships = ConditionalFullToManyField(
        'akvo.api.resources.PartnershipResource', 'partnerships',
        help_text='Show the projects the organisation is related to and how.'
    )
    locations = ConditionalFullToManyField('akvo.api.resources.OrganisationLocationResource', 'locations', null=True)
    primary_location = fields.ToOneField(
        'akvo.api.resources.OrganisationLocationResource', 'primary_location', full=True, blank=True, null=True,
    )

    class Meta:
        allowed_methods         = ['get']
        queryset                = Organisation.objects.all()
        resource_name           = 'organisation'
        include_absolute_url    = True

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
        bundle = super(OrganisationResource, self).dehydrate(bundle)
        bundle.data['logo'] = {
            'original': bundle.data['logo'],
            'thumbnails': get_extra_thumbnails(bundle.obj.logo),
        }
        return bundle


class OrganisationLocationResource(ConditionalFullResource):
    organisation = ConditionalFullToOneField(OrganisationResource, 'location_target')
    country = ConditionalFullToOneField(CountryResource, 'country')

    class Meta:
        allowed_methods = ['get']
        queryset        = OrganisationLocation.objects.all()
        resource_name   = 'organisation_location'
        filtering       = dict(
            # foreign keys
            organisation= ALL_WITH_RELATIONS,
            country     = ALL_WITH_RELATIONS,
        )


class OrganisationMapResource(ConditionalFullResource):
    """
    a limited resource for delivering data to be used when creating maps
    """
    locations           = ConditionalFullToManyField('akvo.api.resources.OrganisationLocationResource', 'locations', null=True)
    primary_location    = fields.ToOneField('akvo.api.resources.OrganisationLocationResource', 'primary_location', full=True, null=True)

    class Meta:
        allowed_methods         = ['get']
        queryset                = Organisation.objects.all()
        resource_name           = 'map_for_organisation'
        include_absolute_url    = True

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


class PartnershipResource(ConditionalFullResource):
    organisation = ConditionalFullToOneField('akvo.api.resources.OrganisationResource', 'organisation')
    project = ConditionalFullToOneField('akvo.api.resources.ProjectResource', 'project')

    def __init__(self, api_name=None):
        """ override to be able to create custom help_text on the partner_type field
        """
        super(PartnershipResource, self).__init__(api_name=None)
        self.fields['partner_type'].help_text = "Uses the following key-value pair list: {%s}" % ', '.join(
            ['"%s": "%s"' % (k, v) for k, v in Partnership.PARTNER_TYPES]
        )

    class Meta:
        allowed_methods = ['get']
        queryset        = Partnership.objects.all()
        resource_name   = 'partnership'
        filtering       = dict(organisation=ALL_WITH_RELATIONS)
        filtering       = dict(
            # other fields
            iati_activity_id    = ALL,
            internal_id         = ALL,
            partner_type        = ALL,
            # foreign keys
            organisation        = ALL_WITH_RELATIONS,
            project             = ALL_WITH_RELATIONS,
        )


class ProjectResource(ConditionalFullResource):
    benchmarks = ConditionalFullToManyField('akvo.api.resources.BenchmarkResource', 'benchmarks',)
    budget_items = ConditionalFullToManyField('akvo.api.resources.BudgetItemResource', 'budget_items')
    categories = ConditionalFullToManyField('akvo.api.resources.CategoryResource', 'categories')
    goals = ConditionalFullToManyField('akvo.api.resources.GoalResource', 'goals')
    invoices = ConditionalFullToManyField('akvo.api.resources.InvoiceResource', 'invoices')
    links = ConditionalFullToManyField('akvo.api.resources.LinkResource', 'links')
    locations = ConditionalFullToManyField('akvo.api.resources.ProjectLocationResource', 'locations')
    partnerships = ConditionalFullToManyField('akvo.api.resources.PartnershipResource', 'partnerships',)
    primary_location = fields.ToOneField('akvo.api.resources.ProjectLocationResource', 'primary_location', full=True, null=True)
    project_comments = ConditionalFullToManyField('akvo.api.resources.ProjectCommentResource', 'comments')
    project_updates = ConditionalFullToManyField('akvo.api.resources.ProjectUpdateResource', 'project_updates')

    class Meta:
        allowed_methods         = ['get']
        queryset                = Project.objects.published()
        resource_name           = 'project'
        include_absolute_url    = True

        filtering               = dict(
            # other fields
            status              = ALL,
            title               = ALL,
            budget              = ALL,
            funds               = ALL,
            funds_needed        = ALL,
            current_image       = ALL,
            # foreign keys
            benchmarks          = ALL_WITH_RELATIONS,
            budget_items        = ALL_WITH_RELATIONS,
            categories          = ALL_WITH_RELATIONS,
            goals               = ALL_WITH_RELATIONS,
            invoices            = ALL_WITH_RELATIONS,
            links               = ALL_WITH_RELATIONS,
            locations           = ALL_WITH_RELATIONS,
            partnerships        = ALL_WITH_RELATIONS,
            project_comments    = ALL_WITH_RELATIONS,
            project_updates     = ALL_WITH_RELATIONS,
        )

    def dehydrate(self, bundle):
        """ add thumbnails inline info for Project.current_image
        """
        bundle = super(ProjectResource, self).dehydrate(bundle)
        bundle.data['current_image'] = {
            'original': bundle.data['current_image'],
            'thumbnails': get_extra_thumbnails(bundle.obj.current_image),
        }
        return bundle


class ProjectCommentResource(ConditionalFullResource):
    project = ConditionalFullToOneField('akvo.api.resources.ProjectResource', 'project')

    class Meta:
        allowed_methods = ['get']
        queryset        = ProjectComment.objects.all()
        resource_name   = 'project_comment'
        filtering       = dict(
            # other fields
            time        = ALL,
            # foreign keys
            project     = ALL_WITH_RELATIONS,
            user        = ALL_WITH_RELATIONS,
        )


class ProjectLocationResource(ConditionalFullResource):
    project = ConditionalFullToOneField(ProjectResource, 'location_target')
    country = ConditionalFullToOneField(CountryResource, 'country')

    class Meta:
        allowed_methods = ['get']
        queryset        = ProjectLocation.objects.all()
        resource_name   = 'project_location'
        filtering       = dict(
            # other fields
            latitude    = ALL,
            longitude   = ALL,
            primary     = ALL,
            # foreign keys
            country     = ALL_WITH_RELATIONS,
            project     = ALL_WITH_RELATIONS,
        )


class ProjectMapResource(ConditionalFullResource):
    """
    a limited resource for delivering data to be used when creating maps
    """
    locations           = ConditionalFullToManyField('akvo.api.resources.ProjectLocationResource', 'locations')
    primary_location    = fields.ToOneField('akvo.api.resources.ProjectLocationResource', 'primary_location', full=True, null=True)

    class Meta:
        allowed_methods         = ['get']
        queryset                = Project.objects.published()
        resource_name           = 'map_for_project'
        include_absolute_url    = True

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
            locations           = ALL_WITH_RELATIONS,
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


class ProjectUpdateModelForm(ModelForm):
    class Meta:
        model = ProjectUpdate


class ProjectUpdateResource(ConditionalFullResource):
    project = ConditionalFullToOneField('akvo.api.resources.ProjectResource', 'project')
    user = ConditionalFullToOneField('akvo.api.resources.UserResource', 'user')
    file_field = Base64FileField()

    class Meta:
        allowed_methods         = ['get', 'post']
        authorization           = Authorization()
        authentication          = ConditionalApiKeyAuthentication(methods_requiring_key=['POST'])
        validation              = ModelFormValidation(form_class=ProjectUpdateModelForm)
        queryset                = ProjectUpdate.objects.all()
        resource_name           = 'project_update'
        include_absolute_url    = True
        always_return_data      = True

        filtering               = dict(
            # other fields
            time                = ALL,
            time_last_updated   = ALL,
            title               = ALL,
            update_method       = ALL,
            # foreign keys
            project             = ALL_WITH_RELATIONS,
            user                = ALL_WITH_RELATIONS,
        )


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
        #Disallow list operations
        list_allowed_methods = []
        detail_allowed_methods = ['get',]
        object_class = RightNowInAkvoObject
        resource_name = 'right_now_in_akvo'
        include_resource_uri = False

    #Override urls such that GET:right_now_in_akvo/ is actually the detail endpoint
    def override_urls(self):
        return [
            url(r"^(?P<resource_name>%s)/$" % self._meta.resource_name, self.wrap_view('dispatch_detail'),
                name="api_dispatch_detail"),
        ]

    def obj_get(self, bundle, **kwargs):
        rnia = RightNowInAkvoObject()
        rnia.populate()
        return rnia


class UserProfileResource(ConditionalFullResource):
    organisation = ConditionalFullToOneField('akvo.api.resources.OrganisationResource', 'organisation')
    user = ConditionalFullToOneField('akvo.api.resources.UserResource', 'user')

    class Meta:
        authentication  = ApiKeyAuthentication()
        allowed_methods = ['get']
        queryset        = UserProfile.objects.filter(user__is_active=True)
        resource_name   = 'user_profile'
        fields          = ['organisation', 'user',]
        filtering       = dict(
            # foreign keys
            user            = ALL_WITH_RELATIONS,
            organisation    = ALL_WITH_RELATIONS,
        )

    def get_object_list(self, request):
        """ Limit access to the users in your own organisation
        """
        organisation = request.user.get_profile().organisation
        return UserProfile.objects.filter(organisation=organisation)

    def dehydrate(self, bundle):
        """ Add meta fields showing if the user profile is an organisation admin or an organisation editor
        """
        bundle = super(UserProfileResource, self).dehydrate(bundle)
        bundle.data['is_org_admin'] = bundle.obj.get_is_org_admin()
        bundle.data['is_org_editor'] = bundle.obj.get_is_org_editor()
        return bundle


class UserResource(ConditionalFullResource):
    user_profile = ConditionalFullToOneField('akvo.api.resources.UserProfileResource', 'userprofile', null=True)

    class Meta:
        authentication  = ApiKeyAuthentication()
        allowed_methods = ['get']
        queryset = User.objects.filter(is_active=True)
        resource_name = 'user'
        fields = ['first_name', 'last_name', 'last_login', ]
        filtering       = dict(
            # foreign keys
            userprofile  = ALL_WITH_RELATIONS,
        )

    def dehydrate(self, bundle):
        """ Workaround for the overloading of 'username' when used in the query.
            It is needed for the authentication, but the filtering machinery
            intercepts and complains that the 'username' field doesn't allow filtering.
            So instead of having username in the fields list we add it here

            The adding is conditional, only add fields for users in the same organisation
            as request.user which is the API key owner

            For other users delete the user_profile field
        """
        bundle = super(UserResource, self).dehydrate(bundle)
        if self._meta.authentication.is_authenticated(bundle.request):
            if getattr(bundle.request.user, 'get_profile', False):
                # get the org of the API key owner
                organisation = bundle.request.user.get_profile().organisation
            else:
                organisation = None
            # find out if the user has a profile that's associated with the API key owner org
            profile = UserProfile.objects.filter(organisation=organisation, user__id=bundle.obj.id)
        if profile:
            bundle.data['username'] = bundle.obj.username
            bundle.data['email'] = bundle.obj.email
        else:
            del bundle.data['user_profile']
        return bundle


