# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.apps import apps
from django.contrib.auth import get_user_model
from django.db import models


class OrganisationManager(models.Manager):
    def get_queryset(self):
        return super(OrganisationManager, self).get_queryset().extra(
            select={
                'lower_name': 'lower(rsr_organisation.name)'
            }
        ).order_by('lower_name')


class OrganisationQuerySet(models.QuerySet):

    def has_location(self):
        return self.filter(primary_location__isnull=False)

    def partners(self, role):
        "return the organisations in the queryset that are partners of type role"
        return self.filter(partnerships__iati_organisation_role__exact=role).distinct()

    def allpartners(self):
        return self.distinct()

    def fieldpartners(self):
        Partnership = apps.get_model('rsr.partnership')
        return self.partners(Partnership.IATI_IMPLEMENTING_PARTNER)

    def fundingpartners(self):
        Partnership = apps.get_model('rsr.partnership')
        return self.partners(Partnership.IATI_FUNDING_PARTNER)

    def reportingpartners(self):
        Partnership = apps.get_model('rsr.partnership')
        return self.partners(Partnership.IATI_REPORTING_ORGANISATION)

    def sponsorpartners(self):
        Partnership = apps.get_model('rsr.partnership')
        return self.partners(Partnership.AKVO_SPONSOR_PARTNER)

    def supportpartners(self):
        Partnership = apps.get_model('rsr.partnership')
        return self.partners(Partnership.IATI_ACCOUNTABLE_PARTNER)

    def extendingpartners(self):
        Partnership = apps.get_model('rsr.partnership')
        return self.partners(Partnership.IATI_EXTENDING_PARTNER)

    def supportpartners_with_projects(self):
        """return the organisations in the queryset that are support partners with published
        projects, not counting archived projects"""
        Partnership = apps.get_model('rsr.partnership')
        Project = apps.get_model('rsr.project')
        PublishingStatus = apps.get_model('rsr.publishingstatus')
        return self.filter(
            partnerships__iati_organisation_role=Partnership.IATI_ACCOUNTABLE_PARTNER,
            partnerships__project__publishingstatus__status=PublishingStatus.STATUS_PUBLISHED,
            partnerships__project__iati_status__in=Project.NOT_SUSPENDED
        ).distinct()

    def ngos(self):
        from ..organisation import ORG_TYPE_NGO
        return self.filter(organisation_type__exact=ORG_TYPE_NGO)

    def governmental(self):
        from ..organisation import ORG_TYPE_GOV
        return self.filter(organisation_type__exact=ORG_TYPE_GOV)

    def commercial(self):
        from ..organisation import ORG_TYPE_COM
        return self.filter(organisation_type__exact=ORG_TYPE_COM)

    def knowledge(self):
        from ..organisation import ORG_TYPE_KNO
        return self.filter(organisation_type__exact=ORG_TYPE_KNO)

    def all_projects(self):
        "returns a queryset with all projects that has self as any kind of partner"
        Project = apps.get_model('rsr.project')
        return Project.objects.of_partners(self).distinct()

    def users(self):
        return get_user_model().objects.filter(employers__organisation__in=self).distinct()

    def all_updates(self):
        ProjectUpdate = apps.get_model('rsr.projectupdate')
        return ProjectUpdate.objects.filter(user__organisations__in=self).distinct()

    def employments(self):
        Employment = apps.get_model('rsr.employment')
        return Employment.objects.filter(organisation__in=self).distinct()

    def content_owned_organisations(self, exclude_orgs=None):
        """Returns a list of Organisations of which these organisations are the content owner.

        Includes self, is recursive.

        """
        Organisation = apps.get_model('rsr.organisation')
        organisations = set(self.values_list('pk', flat=True))

        while True:
            content_owners = Organisation.objects.filter(
                id__in=organisations, can_create_projects=True)
            indirect_content_owned_orgs = content_owners.all_projects()\
                                                        .field_partners()\
                                                        .exclude(can_create_projects=True)
            indirect_ids = set(indirect_content_owned_orgs.values_list('pk', flat=True))

            direct_content_owned_orgs = Organisation.objects.filter(
                content_owner_id__in=organisations)
            direct_ids = set(direct_content_owned_orgs.values_list('pk', flat=True))

            if organisations == (organisations | indirect_ids | direct_ids):
                break
            else:
                organisations |= (indirect_ids | direct_ids)

        return Organisation.objects.filter(pk__in=organisations).distinct()


OrgManager = OrganisationManager.from_queryset(OrganisationQuerySet)
