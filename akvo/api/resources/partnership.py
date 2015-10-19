# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.core.urlresolvers import reverse

from tastypie import fields

from tastypie.authorization import Authorization
from tastypie.constants import ALL, ALL_WITH_RELATIONS
from tastypie.resources import ModelResource


import logging
logger = logging.getLogger('akvo.rsr')

from akvo.api.authentication import ConditionalApiKeyAuthentication
from akvo.api.fields import ConditionalFullToOneField

from akvo.codelists.store.codelists_v201 import ORGANISATION_TYPE as IATI_LIST_ORGANISATION_TYPE
from akvo.rsr.models import Organisation, Partnership, InternalOrganisationID

from .resources import ConditionalFullResource

# bundle field names, matching field names on Organisation, InternalOrganisationID and Partnership models
# Organisation
FIELD_IATI_ORG_ID = 'iati_org_id'
FIELD_NAME = 'name'
FIELD_LONG_NAME = 'long_name'
FIELD_NEW_ORGANISATION_TYPE = 'new_organisation_type'
FIELD_PARTNER_TYPE = 'iati_organisation_role'
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
            # no luck here, let's try with internal ID
            pass
    if bundle.data.get(FIELD_INTERNAL_ORG_ID) and bundle.data.get(FIELD_REPORTING_ORG):
        try:
            organisation = InternalOrganisationID.objects.get(
                recording_org__iati_org_id=bundle.data[FIELD_REPORTING_ORG],
                identifier=bundle.data[FIELD_INTERNAL_ORG_ID]
            ).referenced_org
            return organisation
        except:
            return None
    return None #TODO: better error handling, we may end up here with ret_val == None

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
        zip([int(type) for type, name in IATI_LIST_ORGANISATION_TYPE[1:]],
            Organisation.NEW_TO_OLD_TYPES)
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
            logger.debug("Trying to create an org")
            organisation = Organisation.objects.create(**kwargs)
        except Exception, e:
            logger.exception('%s' % e.message)
    # otherwise fall back to using the reporting_org's internal ID
    elif bundle_field_to_use == FIELD_INTERNAL_ORG_ID:
        try:
            logger.debug("Trying to create an org")
            organisation = Organisation.objects.create(**kwargs)
            our_organisation = Organisation.objects.get(iati_org_id=bundle.data[FIELD_REPORTING_ORG])
            InternalOrganisationID.objects.create(
                recording_org=our_organisation,
                referenced_org=organisation,
                identifier=bundle.data[FIELD_INTERNAL_ORG_ID],
            )
        except Exception, e:
            logger.exception('%s' % e.message)
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
        max_limit = 10
        allowed_methods = ['post']
        resource_name   = 'iati_partnership'
        authorization   = Authorization()
        authentication  = ConditionalApiKeyAuthentication(methods_requiring_key=['POST'])
        queryset        = Partnership.objects.all()

    def hydrate(self, bundle):
        """ Only the reporting org is assigned the FIELD_IATI_ACTIVITY_ID and FIELD_INTERNAL_ID values
        """
        organisation = get_organisation(bundle)
        if organisation:
            bundle.data[FIELD_ORGANISATION] = organisation
            # note that checking against the Partnership.IATI_ACCOUNTABLE_PARTNER only sorta right,
            # it should be the reporting org, but since we know there's only one accountable,
            # Cordaid, it's OK
            if (
                organisation.iati_org_id != bundle.data[FIELD_REPORTING_ORG] or
                bundle.data[FIELD_PARTNER_TYPE] != str(Partnership.IATI_ACCOUNTABLE_PARTNER)
            ):
                bundle.data[FIELD_IATI_ACTIVITY_ID] = None
                bundle.data[FIELD_INTERNAL_ID] = None
        else:
            raise Exception("Can't find organisation. Bundle data:\n{bundle}".format(bundle=bundle))
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


class PartnershipResource(ConditionalFullResource):
    organisation = ConditionalFullToOneField('akvo.api.resources.OrganisationResource', 'organisation')
    project = ConditionalFullToOneField('akvo.api.resources.ProjectResource', 'project')
    partner_type = fields.CharField(attribute='iati_role_to_partner_type')

    def __init__(self, api_name=None):
        """ override to be able to create custom help_text on the partner_type field
        """
        super(PartnershipResource, self).__init__(api_name=None)
        self.fields[
            'iati_organisation_role'].help_text = "Uses the following key-value pair list: {%s}" % ', '.join(
            ['"%s": "%s"' % (k, v) for k, v in Partnership.IATI_ROLES]
        )

    def apply_filters(self, request, applicable_filters):
        """ Custom filtering for the "fake" field partner_type allowing the filtering of the
        resource using the deprecated Akvo partner type values

        Uses Partnership.PARTNER_TYPES_TO_ROLES_MAP map the filter to the
        Partnership.iati_organisation_role field
        """

        partner_type_filter = {}
        if 'iati_role_to_partner_type' in [k.split('__')[0] for k in applicable_filters.keys()]:
            for k in applicable_filters.keys():
                if k.startswith('iati_role_to_partner_type'):
                    operator = k.split('__')[1]
                    if operator == 'in':
                        values = [
                            Partnership.PARTNER_TYPES_TO_ROLES_MAP[v] for v in applicable_filters[k]
                        ]
                        partner_type_filter['iati_organisation_role__in'] = values
                    else:
                        partner_type_filter[
                            "iati_organisation_role__{}".format(operator)
                        ] = Partnership.PARTNER_TYPES_TO_ROLES_MAP[applicable_filters[k]]
                    applicable_filters.pop(k)

        default_filtering = super(PartnershipResource, self).apply_filters(request, applicable_filters)

        if partner_type_filter:
            return default_filtering.filter(**partner_type_filter)
        else:
            return default_filtering

    class Meta:
        max_limit = 10
        allowed_methods = ['get']
        queryset        = Partnership.objects.all()
        resource_name   = 'partnership'
        filtering       = dict(organisation=ALL_WITH_RELATIONS)
        filtering       = dict(
            # other fields
            iati_activity_id = ALL,
            internal_id = ALL,
            partner_type = ALL,
            iati_organisation_role = ALL,
            # foreign keys
            organisation = ALL_WITH_RELATIONS,
            project = ALL_WITH_RELATIONS,
        )
