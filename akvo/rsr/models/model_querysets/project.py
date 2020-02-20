# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.apps import apps
from django.conf import settings
from django.db import models
from django.db.models import Q, Max, Sum


class ProjectQuerySet(models.QuerySet):
    def of_partner(self, organisation):
        "return projects that have organisation as partner"
        return self.filter(partners__exact=organisation)

    def of_partners(self, organisations):
        """Return projects that have one of the organisations as partner.

        *NOTE*: If any of the organisations has one or more ProjectHierarchies,
        include all the projects in the hierarchies.
        """

        from akvo.rsr.models import ProjectHierarchy, Project

        projects = self.filter(partners__in=organisations).distinct()
        hierarchies = ProjectHierarchy.objects.filter(organisation__in=organisations)\
                                              .select_related('root_project')

        hierarchy_project_ids = set()
        for hierarchy in hierarchies:
            hierarchy_projects = hierarchy.root_project.descendants(hierarchy.max_depth)\
                                                       .values_list('id', flat=True)
            hierarchy_project_ids.update(hierarchy_projects)

        projects = Project.objects.filter(Q(id__in=projects) | Q(id__in=hierarchy_project_ids))
        return projects

    def has_location(self):
        return self.filter(primary_location__isnull=False)

    def published(self):
        PublishingStatus = apps.get_model('rsr.publishingstatus')
        return self.filter(publishingstatus__status=PublishingStatus.STATUS_PUBLISHED)

    def unpublished(self):
        PublishingStatus = apps.get_model('rsr.publishingstatus')
        return self.filter(publishingstatus__status=PublishingStatus.STATUS_UNPUBLISHED)

    def private(self):
        return self.filter(is_public=False)

    def public(self):
        return self.filter(is_public=True)

    def status_none(self):
        return self.filter(iati_status__exact='6')

    def status_active(self):
        return self.filter(iati_status__exact='2')

    def status_onhold(self):
        return self.filter(iati_status__exact='1')

    def status_complete(self):
        return self.filter(iati_status__exact='3')

    def status_not_complete(self):
        return self.exclude(iati_status__exact='3')

    def status_post_complete(self):
        return self.filter(iati_status__exact='4')

    def status_not_post_complete(self):
        return self.exclude(iati_status__exact='4')

    def status_cancelled(self):
        return self.filter(iati_status__exact='5')

    def status_not_cancelled(self):
        return self.exclude(iati_status__exact='5')

    def status_archived(self):
        return self.filter(iati_status__exact='6')

    def status_not_archived(self):
        return self.exclude(iati_status__exact='6')

    # aggregates
    def budget_sum(self):
        ''' aggregates the budgets of all the projects in the QS
            n.b. non-chainable, doesn't return a QS
        '''
        return self.aggregate(budget=Sum('budget'), )['budget'] or 0

    def funds_sum(self):
        ''' aggregates the funds of all the projects in the QS
            n.b. non-chainable, doesn't return a QS
        '''
        return self.aggregate(funds=Sum('funds'), )['funds'] or 0

    def funds_needed_sum(self):
        ''' aggregates the funds of all the projects in the QS
            n.b. non-chainable, doesn't return a QS
        '''
        return self.aggregate(funds_needed=Sum('funds_needed'), )['funds_needed'] or 0

    def get_largest_value_sum(self, benchmarkname, cats=None):
        if cats:
            # filter finds largest "benchmarkname" value in benchmarks for categories in cats
            result = self.filter(
                benchmarks__name__name=benchmarkname,
                benchmarks__category__name__in=cats
            )
        else:
            # filter finds largest "benchmarkname" value in benchmarks for all categories
            result = self.filter(
                benchmarks__name__name=benchmarkname
            )
        # annotate the greatest of the "benchmarkname" values into max_value
        # sum max_value for all projects
        return result.annotate(max_value=Max('benchmarks__value')).aggregate(
            Sum('max_value')
        )['max_value__sum'] or 0  # we want to return 0 instead of an empty QS

    def get_planned_water_calc(self):
        "how many will get improved water"
        return self.status_not_cancelled().get_largest_value_sum(
            getattr(settings, 'AFFECTED_BENCHMARKNAME', 'people affected'),
            ['Water']
        ) - self.status_complete().get_largest_value_sum(
            getattr(settings, 'AFFECTED_BENCHMARKNAME', 'people affected'),
            ['Water']
        )

    def get_planned_sanitation_calc(self):
        "how many will get improved sanitation"
        return self.status_not_cancelled().get_largest_value_sum(
            getattr(settings, 'AFFECTED_BENCHMARKNAME', 'people affected'),
            ['Sanitation']
        ) - self.status_complete().get_largest_value_sum(
            getattr(settings, 'AFFECTED_BENCHMARKNAME', 'people affected'),
            ['Sanitation']
        )

    def get_actual_water_calc(self):
        "how many have gotten improved water"
        return self.status_complete().get_largest_value_sum(
            getattr(settings, 'AFFECTED_BENCHMARKNAME', 'people affected'),
            ['Water']
        )

    def get_actual_sanitation_calc(self):
        "how many have gotten improved sanitation"
        return self.status_complete().get_largest_value_sum(
            getattr(settings, 'AFFECTED_BENCHMARKNAME', 'people affected'),
            ['Sanitation']
        )

    def all_updates(self):
        """Return ProjectUpdates for self, newest first."""
        ProjectUpdate = apps.get_model('rsr.projectupdate')
        return ProjectUpdate.objects.filter(project__in=self).distinct()

    # The following 8 methods return organisation querysets
    def _partners(self, role=None):
        Organisation = apps.get_model('rsr.organisation')
        if role is None:
            query = Q(partnerships__project__in=self)
        else:
            query = Q(partnerships__iati_organisation_role=role, partnerships__project__in=self)
        return Organisation.objects.filter(query).distinct()

    def field_partners(self):
        Partnership = apps.get_model('rsr.partnership')
        return self._partners(Partnership.IATI_IMPLEMENTING_PARTNER)

    def funding_partners(self):
        Partnership = apps.get_model('rsr.partnership')
        return self._partners(Partnership.IATI_FUNDING_PARTNER)

    def sponsor_partners(self):
        Partnership = apps.get_model('rsr.partnership')
        return self._partners(Partnership.AKVO_SPONSOR_PARTNER)

    def support_partners(self):
        Partnership = apps.get_model('rsr.partnership')
        return self._partners(Partnership.IATI_ACCOUNTABLE_PARTNER)

    def extending_partners(self):
        Partnership = apps.get_model('rsr.partnership')
        return self._partners(Partnership.IATI_EXTENDING_PARTNER)

    def all_partners(self):
        return self._partners()

    def paying_partners(self):
        Organisation = apps.get_model('rsr.organisation')
        return Organisation.objects.filter(
            partnerships__project__in=self,
            can_create_projects=True
        ).distinct()

    def countries(self):
        """Returns a Country queryset of the countries of these projects"""
        Country = apps.get_model('rsr.country')
        country_ids = []
        for project in self:
            for location in project.locations.all():
                country_ids.append(location.country.id)

        country_ids = list(set(country_ids))
        return Country.objects.filter(id__in=country_ids).distinct()

    def publishingstatuses(self):
        PublishingStatus = apps.get_model('rsr.publishingstatus')
        return PublishingStatus.objects.filter(project__in=self)

    def keywords(self):
        Keyword = apps.get_model('rsr.keyword')
        return Keyword.objects.filter(projects__in=self).distinct()

    def sectors(self):
        Sector = apps.get_model('rsr', 'Sector')
        return Sector.objects.filter(project__in=self).distinct()
