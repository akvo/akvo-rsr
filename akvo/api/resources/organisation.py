# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from tastypie import fields

from tastypie.constants import ALL, ALL_WITH_RELATIONS

from akvo.api.fields import ConditionalFullToManyField

from akvo.rsr.models import Organisation

from .resources import ConditionalFullResource, get_extra_thumbnails


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
        """check if created_at and last_modified_at are boolean instead of null
        add thumbnails inline info for Organisation.logo
        """
        bundle = super(OrganisationResource, self).dehydrate(bundle)
        if isinstance(bundle.data['created_at'], bool):
            bundle.data['created_at'] = None
        if isinstance(bundle.data['last_modified_at'], bool):
            bundle.data['last_modified_at'] = None
        bundle.data['logo'] = {
            'original': bundle.data['logo'],
            'thumbnails': get_extra_thumbnails(bundle.obj.logo),
        }
        return bundle
