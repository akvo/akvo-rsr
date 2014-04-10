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

from akvo.rsr.models import ProjectUpdate

from .resources import ConditionalFullResource


class ProjectUpdateModelForm(ModelForm):
    class Meta:
        model = ProjectUpdate


class ProjectUpdateResource(ConditionalFullResource):
    photo = Base64FileField("photo", blank=True, null=True)
    project = ConditionalFullToOneField('akvo.api.resources.ProjectResource', 'project')
    user = ConditionalFullToOneField('akvo.api.resources.UserResource', 'user')

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
            created_at          = ALL,
            last_modified_at    = ALL,
            title               = ALL,
            update_method       = ALL,
            uuid                = ALL,
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
            return bundle


class ProjectUpdateResourceExtra(ProjectUpdateResource):
    class Meta(ProjectUpdateResource.Meta):
        allowed_methods = ['get',]
        resource_name = 'project_update_extra'

    def dehydrate(self, bundle):
        def org_data_for_update(update):
            """ return relevant data for the organisation that is linked to an update through the user that created the update
            """
            update_org = update.user.get_profile().organisation
            return dict(
                absolute_url=update_org.get_absolute_url(),
                long_name=update_org.long_name,
                name=update_org.name,
                resource_uri=reverse(
                    'api_dispatch_detail', kwargs={
                        'resource_name':'organisation', 'api_name': 'v1', 'pk': update_org.pk
                    }
                ),
            )

        def user_data_for_update(user):
            if user.first_name or user.last_name:
                return dict(
                    full_name=u"{} {}".format(user.first_name, user.last_name)
                )
            return {}

        bundle = super(ProjectUpdateResourceExtra, self).dehydrate(bundle)
        org = org_data_for_update(bundle.obj)
        user_resource_uri = bundle.data['user']
        bundle.data['user'] = user_data_for_update(bundle.obj.user)
        bundle.data['user'].update(resource_uri=user_resource_uri)
        bundle.data['user']['organisation'] = org
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
