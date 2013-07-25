# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.forms.models import ModelForm

from tastypie import fields

from tastypie.authentication import ApiKeyAuthentication, Authentication, MultiAuthentication
from tastypie.authorization import Authorization
from tastypie.constants import ALL, ALL_WITH_RELATIONS
from tastypie.resources import ModelResource

from akvo.api.authentication import ConditionalApiKeyAuthentication
from akvo.api.fields import ConditionalFullToManyField
from akvo.api.serializers import IATISerializer

from akvo.rsr.models import Project
from akvo.rsr.utils import get_rsr_limited_change_permission

from .resources import ConditionalFullResource, get_extra_thumbnails
from .partnership import FIELD_NAME, FIELD_LONG_NAME


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
        authentication          = MultiAuthentication(ApiKeyAuthentication(), Authentication(),)
        queryset                = Project.objects.all() #Note: this is modified in get_object_list()
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
        if self._meta.authentication.is_authenticated(request):
            opts = Project._meta
            if request.user.has_perm(opts.app_label + '.' + opts.get_change_permission()):
                return object_list
            elif request.user.has_perm(opts.app_label + '.' + get_rsr_limited_change_permission(opts)):
                object_list = object_list.published() | object_list.of_partner(
                    request.user.get_profile().organisation
                )
                return object_list.distinct()
        return object_list.published()


    def dehydrate(self, bundle):
        """ add thumbnails inline info for Project.current_image
        """
        bundle = super(ProjectResource, self).dehydrate(bundle)
        bundle.data['current_image'] = {
            'original': bundle.data['current_image'],
            'thumbnails': get_extra_thumbnails(bundle.obj.current_image),
        }
        return bundle
