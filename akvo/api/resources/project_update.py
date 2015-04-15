# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
from django.core.urlresolvers import reverse

from django.forms.models import ModelForm

from tastypie.authorization import Authorization
from tastypie.constants import ALL, ALL_WITH_RELATIONS

from akvo.api.authentication import ConditionalApiKeyAuthentication
from akvo.api.fields import Base64FileField, ConditionalFullToOneField
from akvo.api.validation import ModelFormValidation

from akvo.rsr.models import ProjectUpdate, Country

from .resources import ConditionalFullResource


class ProjectUpdateModelForm(ModelForm):
    class Meta:
        model = ProjectUpdate


class ProjectUpdateResource(ConditionalFullResource):
    photo = Base64FileField("photo", blank=True, null=True)
    project = ConditionalFullToOneField('akvo.api.resources.ProjectResource', 'project')
    user = ConditionalFullToOneField('akvo.api.resources.UserResource', 'user')

    class Meta:
        max_limit = 10
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
            created_at          = ALL,
            last_modified_at    = ALL,
            title               = ALL,
            update_method       = ALL,
            uuid                = ALL,
            photo               = ALL,
            # foreign keys
            project             = ALL_WITH_RELATIONS,
            user                = ALL_WITH_RELATIONS,
        )

    def dehydrate(self, bundle):
            """ Revert the field names "created_at" and "last_modified_at" to the old "time" and "time_last_updated"
                respectively to keep the API signature stable
            """
            # TODO: remove this for v2 of API
            bundle = super(ProjectUpdateResource, self).dehydrate(bundle)
            bundle.data['time'] = bundle.data['created_at']
            bundle.data['time_last_updated'] = bundle.data['last_modified_at']
            del bundle.data['created_at']
            del bundle.data['last_modified_at']
            if isinstance(bundle.data['time'], bool): bundle.data['time'] = None
            if isinstance(bundle.data['time_last_updated'], bool): bundle.data['time_last_updated'] = None
            return bundle


class ProjectUpdateResourceExtra(ProjectUpdateResource):
    class Meta(ProjectUpdateResource.Meta):
        allowed_methods = ['get',]
        resource_name = 'project_update_extra'

    def dehydrate(self, bundle):
        def primary_location_data_for_update(obj):
            """ We need similar data for both the project and the organisation associated with the update
            """
            try:
                primary_location = dict(obj.primary_location.__dict__)
            except:
                return None
            # remove Django internal field
            primary_location.pop('_state', None)
            country_id = primary_location.pop('country_id', None)
            if country_id:
                primary_location['country'] = dict(
                    resource_uri=reverse(
                        'api_dispatch_detail', kwargs={
                            'resource_name':'country', 'api_name': 'v1', 'pk': country_id
                        }
                    ),
                )
                country = Country.objects.get(pk=country_id)
                country_dict = country.__dict__
                # remove Django internal field
                country_dict.pop('_state', None)
                primary_location['country'].update(country_dict)
            return primary_location

        def org_data_for_update(organisation):
            """ return relevant data for the organisation that is linked to an update through the user that created the update
            """
            return dict(
                absolute_url=organisation.get_absolute_url(),
                long_name=organisation.long_name,
                name=organisation.name,
                resource_uri=reverse(
                    'api_dispatch_detail', kwargs={
                        'resource_name':'organisation', 'api_name': 'v1', 'pk': organisation.pk
                    }
                ),
            )

        def user_data_for_update(user):
            return dict(
                first_name=user.first_name,
                last_name=user.last_name,
            )

        def project_data_for_update(bundle):
            return dict(
                resource_uri=bundle.data['project'],
            )

        bundle = super(ProjectUpdateResourceExtra, self).dehydrate(bundle)
        organisation = bundle.obj.user.approved_organisations()[0]
        org_dict = org_data_for_update(organisation)
        user_resource_uri = bundle.data['user']
        bundle.data['user'] = user_data_for_update(bundle.obj.user)
        bundle.data['user'].update(resource_uri=user_resource_uri)
        bundle.data['user']['organisation'] = org_dict
        bundle.data['user']['organisation'].update(primary_location=primary_location_data_for_update(organisation))
        bundle.data['project'] = project_data_for_update(bundle)
        bundle.data['project'].update(primary_location=primary_location_data_for_update(bundle.obj.project))

        return bundle

    def build_schema(self):
        data = super(ProjectUpdateResourceExtra, self).build_schema()
        data['fields']['user'] = {
            'default': "No default provided.",
            'type': "to_one",
            'nullable': False,
            'blank': False,
            'readonly': True,
            'help_text': "A custom related resource with parts of data from user and the organisation the user belongs to. "
                "Includes the fields full_name, organisation and resource_uri of user and absolute_url, long_name, name and resource_uri "
                "of organisation.",
            'unique': False,
        }
        return data
