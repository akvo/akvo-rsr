# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


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
