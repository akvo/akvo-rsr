# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module. 
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
from copy import deepcopy

from tastypie import fields
from tastypie.constants import ALL, ALL_WITH_RELATIONS
from tastypie.resources import ModelResource

from akvo.rsr.models import (
    Benchmark, Benchmarkname, BudgetItem, BudgetItemLabel, Category, Country, FocusArea, Goal, Link,
    Organisation, OrganisationLocation, Partnership, Project, ProjectLocation, ProjectUpdate,
    ProjectComment)


__all__ = [
    'BenchmarkResource',
    'BenchmarknameResource',
    'BudgetItemResource',
    'BudgetItemLabelResource',
    'CategoryResource',
    'CountryResource',
    'FocusAreaResource',
    'GoalResource',
    'LinkResource',
    'OrganisationResource',
    'OrganisationLocationResource',
    'PartnershipResource',
    'ProjectResource',
    'FullProjectResource',
    'ProjectCommentResource',
    'ProjectLocationResource',
    'ProjectUpdateResource',
]

class BenchmarkResource(ModelResource):
    project     = fields.ToOneField('akvo.api.resources.ProjectResource', 'project')
    category    = fields.ToOneField('akvo.api.resources.CategoryResource', 'category', full=True)
    name        = fields.ToOneField('akvo.api.resources.BenchmarknameResource', 'name', full=True)

    class Meta:
        allowed_methods = ['get']
        queryset        = Benchmark.objects.all()
        resource_name   = 'benchmark'


class BenchmarknameResource(ModelResource):
    class Meta:
        allowed_methods = ['get']
        queryset        = Benchmarkname.objects.all()
        resource_name   = 'benchmarkname'


class BudgetItemResource(ModelResource):
    label   = fields.ToOneField('akvo.api.resources.BudgetItemLabelResource', 'label', full=True)
    project = fields.ToOneField('akvo.api.resources.ProjectResource', 'project')

    class Meta:
        allowed_methods = ['get']
        queryset = BudgetItem.objects.all()
        resource_name = 'budget_item'


class BudgetItemLabelResource(ModelResource):
    class Meta:
        allowed_methods = ['get']
        queryset        = BudgetItemLabel.objects.all()
        resource_name   = 'budget_item_label'


class CategoryResource(ModelResource):
    class Meta:
        allowed_methods = ['get']
        queryset = Category.objects.all()
        resource_name = 'category'


class CountryResource(ModelResource):
    class Meta:
        allowed_methods = ['get']
        queryset = Country.objects.all()
        resource_name = 'country'


class FocusAreaResource(ModelResource):
    categories      = fields.ToManyField('akvo.api.resources.CategoryResource', 'categories')

    class Meta:
        allowed_methods = ['get']
        queryset = FocusArea.objects.all()
        resource_name = 'focus_area'


class GoalResource(ModelResource):
    project = fields.ToOneField('akvo.api.resources.ProjectResource', 'project')

    class Meta:
        allowed_methods = ['get']
        queryset = Goal.objects.all()
        resource_name = 'goal'


class LinkResource(ModelResource):
    project = fields.ToOneField('akvo.api.resources.ProjectResource', 'project')

    class Meta:
        allowed_methods = ['get']
        queryset        = Link.objects.all()
        resource_name   = 'link'


class OrganisationResource(ModelResource):
    partnerships = fields.ToManyField(
        'akvo.api.resources.PartnershipResource',
        'partnership_set',
        related_name='organisation',
        help_text='Show the projects the organisation is related to and how.'
    )
    locations   = fields.ToManyField('akvo.api.resources.OrganisationLocationResource', 'locations')

    class Meta:
        allowed_methods = ['get']
        queryset        = Organisation.objects.all()
        resource_name   = 'organisation'


class OrganisationLocationResource(ModelResource):
    organisation = fields.ToOneField(OrganisationResource, 'location_target')
    country = fields.ToOneField(CountryResource, 'country')

    class Meta:
        allowed_methods = ['get']
        queryset        = OrganisationLocation.objects.all()
        resource_name   = 'organisation_location'


class PartnershipResource(ModelResource):
    organisation    = fields.ToOneField('akvo.api.resources.OrganisationResource', 'organisation')
    project         = fields.ToOneField('akvo.api.resources.ProjectResource', 'project')

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


class ProjectResource(ModelResource):
    benchmarks      = fields.ToManyField('akvo.api.resources.BenchmarkResource', 'benchmarks')
    budget_items        = fields.ToManyField('akvo.api.resources.BudgetItemResource', 'budget_items')
    categories          = fields.ToManyField('akvo.api.resources.CategoryResource', 'categories')
    goals               = fields.ToManyField('akvo.api.resources.GoalResource', 'goals')
    links               = fields.ToManyField('akvo.api.resources.LinkResource', 'links')
    locations           = fields.ToManyField('akvo.api.resources.ProjectLocationResource', 'locations')
    partnerships        = fields.ToManyField('akvo.api.resources.PartnershipResource', 'partnerships')
    project_comments    = fields.ToManyField('akvo.api.resources.ProjectCommentResource', 'project_comments')
    project_updates     = fields.ToManyField('akvo.api.resources.ProjectUpdateResource', 'project_updates')

    class Meta:
        allowed_methods = ['get']
        queryset        = Project.objects.all()
        resource_name   = 'project'
        filtering       = dict(partners=ALL_WITH_RELATIONS)


class FullProjectResource(ModelResource):
    benchmarks          = fields.ToManyField('akvo.api.resources.BenchmarkResource', 'benchmarks', full=True)
    budget_items        = fields.ToManyField('akvo.api.resources.BudgetItemResource', 'budget_items', full=True)
    categories          = fields.ToManyField('akvo.api.resources.CategoryResource', 'categories', full=True)
    goals               = fields.ToManyField('akvo.api.resources.GoalResource', 'goals', full=True)
    links               = fields.ToManyField('akvo.api.resources.LinkResource', 'links', full=True)
    locations           = fields.ToManyField('akvo.api.resources.ProjectLocationResource', 'locations', full=True)
    partnerships        = fields.ToManyField('akvo.api.resources.PartnershipResource', 'partnerships', full=True)
    project_comments    = fields.ToManyField('akvo.api.resources.ProjectCommentResource', 'project_comments', full=True)
    project_updates     = fields.ToManyField('akvo.api.resources.ProjectUpdateResource', 'project_updates', full=True)

    class Meta:
        allowed_methods = ['get']
        queryset        = Project.objects.all()
        resource_name   = 'full_project'
        filtering       = dict(partners=ALL_WITH_RELATIONS)


class ProjectCommentResource(ModelResource):
    project = fields.ToOneField('akvo.api.resources.ProjectResource', 'project')

    class Meta:
        allowed_methods = ['get']
        queryset = ProjectComment.objects.all()
        resource_name = 'project_comment'


class ProjectLocationResource(ModelResource):
    project = fields.ToOneField(ProjectResource, 'location_target')
    country = fields.ToOneField(CountryResource, 'country')

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

    class Meta:
        allowed_methods = ['get']
        queryset        = ProjectLocation.objects.all()
        resource_name   = 'project_location'
        filtering = dict(project=ALL_WITH_RELATIONS)


class ProjectUpdateResource(ModelResource):
    project = fields.ToOneField('akvo.api.resources.ProjectResource', 'project')

    class Meta:
        allowed_methods = ['get']
        queryset = ProjectUpdate.objects.all()
        resource_name = 'project_update'
