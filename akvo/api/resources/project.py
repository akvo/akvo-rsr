# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from decimal import Decimal

from django.contrib.auth import get_permission_codename, get_user_model
from django.core.exceptions import ObjectDoesNotExist
from django.forms.models import ModelForm

from tastypie import fields

from tastypie.authorization import Authorization
from tastypie.constants import ALL, ALL_WITH_RELATIONS
from tastypie.exceptions import NotFound
from tastypie.http import HttpUnauthorized
from tastypie.resources import ModelResource

from akvo import settings

from akvo.api.authentication import ConditionalApiKeyAuthentication
from akvo.api.fields import ConditionalFullToManyField
from akvo.api.serializers import IATISerializer
from akvo.rsr.models import (
    Project, Benchmarkname, Category, Goal, Partnership, BudgetItem, ProjectLocation, Benchmark, Organisation
)
from akvo.utils import RSR_LIMITED_CHANGE

from .resources import ConditionalFullResource, get_extra_thumbnails
from .partnership import FIELD_NAME, FIELD_LONG_NAME


class IATIProjectModelForm(ModelForm):
    class Meta:
        model = Project
        fields = "__all__"


class IATIProjectResource(ModelResource):

    benchmarks =  fields.ToManyField(
        'akvo.api.resources.IATIBenchmarkResource',
        'benchmarks', full=True, related_name='project'
    )
    budget_items = fields.ToManyField(
        'akvo.api.resources.IATIBudgetItemResource',
        'budget_items', full=True, related_name='project'
    )
    categories =  fields.ToManyField(
        'akvo.api.resources.IATICategoryResource',
        'categories', full=True, null=True, related_name='project'
    )
    goals = fields.ToManyField(
        'akvo.api.resources.IATIGoalResource',
        'goals', full=True, related_name='project'
    )
    locations = fields.ToManyField(
        'akvo.api.resources.IATIProjectLocationResource',
        'locations', full=True, related_name='location_target'
    )
    partnerships = fields.ToManyField(
        'akvo.api.resources.IATIPartnershipResource',
        'partnerships', full=True, related_name='project'
    )

    sync_owner = fields.ToOneField(
        'akvo.api.resources.OrganisationResource',
        'sync_owner', full=True, related_name='project'
    )

    class Meta:
        allowed_methods = ['post', 'put']
        resource_name   = 'iati_activity'
        authorization   = Authorization()
        authentication  = ConditionalApiKeyAuthentication(methods_requiring_key=['POST', 'PUT'])
        serializer      = IATISerializer()
        # validation      = ModelFormValidation(form_class=IATIProjectModelForm)
        queryset        = Project.objects.all()

    def obj_update(self, bundle, skip_errors=False, **kwargs):
        """
        override obj_update to delete related objects
        """
        method = kwargs.pop('method')
        if not bundle.obj or not self.get_bundle_detail_data(bundle):
            try:
                lookup_kwargs = self.lookup_kwargs_with_identifiers(bundle, kwargs)
            except:
                # if there is trouble hydrating the data, fall back to just
                # using kwargs by itself (usually it only contains a "pk" key
                # and this will work fine.
                lookup_kwargs = kwargs

            try:
                bundle.obj = self.obj_get(bundle=bundle, **lookup_kwargs)
            except ObjectDoesNotExist:
                raise NotFound(
                    "A model instance matching the provided arguments could not be found."
                )

        # If the method is PUT, delete all related objects
        # so they can be re-created with potentially new data
        if method == 'PUT':
            Goal.objects.filter(project=bundle.obj).delete()
            BudgetItem.objects.filter(project=bundle.obj).delete()
            ProjectLocation.objects.filter(location_target=bundle.obj).delete()
            # Since all locations for the project are deleted we need to make sure Project.primary_location is set to None
            bundle.obj.primary_location = None
            bundle.obj.save()
            Partnership.objects.filter(project=bundle.obj).delete()
            Benchmark.objects.filter(project=bundle.obj).delete()
            bundle.obj.categories.clear()

        self.authorized_update_detail(self.get_object_list(bundle.request), bundle)
        bundle = self.full_hydrate(bundle)
        return self.save(bundle, skip_errors=skip_errors)

    def put_detail(self, request, **kwargs):
        # inject request method to be used in obj_update()
        kwargs['method'] = request.META['REQUEST_METHOD']
        super(IATIProjectResource, self).put_detail(request, **kwargs)

    def alter_deserialized_detail_data(self, request, data):
        reporting_iati_org_id = data['partnerships'][0]['reporting_org']
        # Cordaid custom code
        if reporting_iati_org_id == getattr(settings, 'CORDAID_IATI_ID', 'NL-KVK-41160054'):
            data['sync_owner'] = Organisation.objects.get(iati_org_id_exact='NL-KVK-41160054')
            # Figure out the category for the project from the business unit
            business_unit_categories = {
                "K6020": dict(cat_name="Children & Education", fa="Education"),
                "K6090": dict(cat_name="Domestic", fa="Economic development"),
                "K6030": dict(cat_name="Disaster Recovery", fa="Economic development"),
                "K6070": dict(cat_name="Entrepreneurship", fa="Economic development"),
                "K6110": dict(cat_name="Food Security", fa="Healthcare"),
                "K6100": dict(cat_name="Investments", fa="Economic development"),
                "K6010": dict(cat_name="Healthcare", fa="Healthcare"),
                "K6060": dict(cat_name="Security & Justice", fa="Economic development"),
                "K6080": dict(cat_name="Urban Matters", fa="Economic development"),
                "K6040": dict(cat_name="Women's leadership", fa="Economic development"),
                "K6050": dict(cat_name="Extractives", fa="Economic development"),
            }
            business_unit = business_unit_categories.get(data['partnerships'][0]['business_unit'], None)
            project_category = Category.objects.get(name=business_unit['cat_name'], focus_area__name=business_unit['fa'])
            data['categories'] = ['/api/v1/iati_category/{pk}/'.format(pk=project_category.pk),]

            # prepare the benchmarks, looking up the Benchmarkname and set the Category to project_category
            benchmarks = []
            for benchmark in data['benchmarks']:
                # if we don't find a value drop that benchmark
                if benchmark.get('value'):
                    new_benchmark = dict(value=benchmark['value'])
                    benchmarkname = Benchmarkname.objects.get(name=benchmark['name'])
                    new_benchmark['name'] = benchmarkname.pk
                    new_benchmark['category'] = project_category.pk
                    benchmarks.append(new_benchmark)
            data['benchmarks'] = benchmarks
        if reporting_iati_org_id == getattr(settings, 'RAIN_IATI_ID', 'NL-KVK-34200988'):
            data['sync_owner'] = Organisation.objects.get(iati_org_id__exact='NL-KVK-34200988')
            # remove benchmarks, as they currently have no category
            data['benchmarks'] = []

        # hack to set the first location as primary
        if data.get('locations'):
            data['locations'][0]['primary'] = True
            for location in data['locations'][1:]:
                location['primary'] = False

        # remove budget items with value 0
        if data.get('budget_items'):
            data['budget_items'] = [item for item in data['budget_items'] if Decimal(item['amount']) > 0]

        # hack to truncate org names.
        # Tried to do this in the XSLT but substring(text, 1, 25) sometimes returns more than 25 characters :-p
        # TODO: write a general truncator function for all char and text field of a model's deserialized data
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

    def hydrate_date_end_actual(self, bundle):
        date_end_actual = bundle.data.get('date_end_actual')
        if date_end_actual and date_end_actual[-1] == 'Z':
            bundle.data['date_end_actual'] = date_end_actual[:-1]
        return bundle

    def hydrate_date_start_actual(self, bundle):
        date_start_actual = bundle.data.get('date_start_actual')
        if date_start_actual and date_start_actual[-1] == 'Z':
            bundle.data['date_start_actual'] = date_start_actual[:-1]
        return bundle

    def hydrate_date_end_planned(self, bundle):
        date_end_planned = bundle.data.get('date_end_planned')
        if date_end_planned and date_end_planned[-1] == 'Z':
            bundle.data['date_end_planned'] = date_end_planned[:-1]
        if date_end_planned:
            bundle.data['date_complete'] = bundle.data.pop('date_end_planned')
        return bundle

    def hydrate_date_start_planned(self, bundle):
        date_start_planned = bundle.data.get('date_start_planned')
        if date_start_planned and date_start_planned[-1] == 'Z':
            bundle.data['date_start_planned'] = date_start_planned[:-1]
        if date_start_planned:
            bundle.data['date_request_posted'] = bundle.data.pop('date_start_planned')
        return bundle

    # def hydrate_categories(self, bundle):
    #     if bundle.data['categories']:
    #         bundle.data['categories'] = [
    #             reverse('api_dispatch_detail', kwargs={
    #                 'resource_name': 'category',
    #                 'api_name': 'v1',
    #                 'pk': bundle.data['categories'][0]
    #             })
    #         ]
    #     return bundle


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


class ProjectResource(ConditionalFullResource):
    benchmarks = ConditionalFullToManyField('akvo.api.resources.BenchmarkResource', 'benchmarks',)
    budget_items = ConditionalFullToManyField('akvo.api.resources.BudgetItemResource', 'budget_items')
    categories = ConditionalFullToManyField('akvo.api.resources.CategoryResource', 'categories')
    goals = ConditionalFullToManyField('akvo.api.resources.GoalResource', 'goals')
    keywords = ConditionalFullToManyField('akvo.api.resources.KeywordResource', 'keywords')
    invoices = ConditionalFullToManyField('akvo.api.resources.InvoiceResource', 'invoices')
    links = ConditionalFullToManyField('akvo.api.resources.LinkResource', 'links')
    locations = ConditionalFullToManyField('akvo.api.resources.ProjectLocationResource', 'locations')
    partnerships = ConditionalFullToManyField('akvo.api.resources.PartnershipResource', 'partnerships',)
    primary_location = fields.ToOneField('akvo.api.resources.ProjectLocationResource', 'primary_location', full=True, null=True)
    project_comments = ConditionalFullToManyField('akvo.api.resources.ProjectCommentResource', 'comments')
    project_updates = ConditionalFullToManyField('akvo.api.resources.ProjectUpdateResource', 'project_updates')

    class Meta:
        allowed_methods         = ['get']
        authentication          = ConditionalApiKeyAuthentication(methods_requiring_key=['POST', 'PUT'])
        queryset                = Project.objects.all() #Note: this is modified in get_object_list()
        resource_name           = 'project'
        include_absolute_url    = True

        filtering               = dict(
            # other fields
            id                  = ALL,
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
            keywords            = ALL_WITH_RELATIONS,
            partnerships        = ALL_WITH_RELATIONS,
            project_comments    = ALL_WITH_RELATIONS,
            project_updates     = ALL_WITH_RELATIONS,
        )

    def get_object_list(self, request):
        """ The Project queryset is filtered depending on the user accessing the API
            All users get Project.objects.published()
            If the user is authenticated via an API key additional projects are added similarly to the access in the
            admin:
                Superusers get access to ALL projects
                Users with "change_project" perm (currently Akvo staff users) also get access to ALL projects
                Users with "rsr_limited_change_project" perm get access to all projects linked to their organisation
                regardless of publishing status
        """
        object_list = super(ProjectResource, self).get_object_list(request)
        # The whole point of ConditionalApiKeyAuthentication is to allow some access even for unauthorised requests,
        # but here we need to figure out if the request contains a name/key pair and if so allow access to unpublished
        # projects. So we call ApiKeyAuthentication.is_authenticated() (using super() which returns True if there is an
        # identified user holding an api key, AND is_authenticated() also sets request.user to the User object which we
        # need to be able to call request.user.has_perm() correctly.
        if super(ConditionalApiKeyAuthentication, self.Meta.authentication).is_authenticated(request) is True:
            opts = Project._meta
            if request.user.has_perm(opts.app_label + '.' + get_permission_codename('change', opts)):
                return object_list
            elif request.user.has_perm(opts.app_label + '.' + get_permission_codename(RSR_LIMITED_CHANGE, opts)):
                object_list = object_list.published() | object_list.of_partner(
                    request.user.userprofile.organisation
                )
                return object_list.distinct()
        return object_list.published()

    def dehydrate(self, bundle):
        """ add thumbnails inline info for Project.current_image
        """
        bundle = super(ProjectResource, self).dehydrate(bundle)
        if isinstance(bundle.data['created_at'], bool):
            bundle.data['created_at'] = None
        if isinstance(bundle.data['last_modified_at'], bool):
            bundle.data['last_modified_at'] = None
        bundle.data['current_image'] = {
            'original': bundle.data['current_image'],
            'thumbnails': get_extra_thumbnails(bundle.obj.current_image),
        }
        bundle.data['date_request_posted'] = bundle.data.pop('date_start_planned')
        bundle.data['date_complete'] = bundle.data.pop('date_end_planned')
        return bundle
