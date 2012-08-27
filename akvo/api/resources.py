# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module. 
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
from copy import deepcopy
from django.contrib.auth.models import User

from tastypie import fields
from tastypie.constants import ALL, ALL_WITH_RELATIONS
from tastypie.fields import ApiField, NOT_PROVIDED
from tastypie.resources import ModelResource
from tastypie.authentication import ApiKeyAuthentication

from akvo.rsr.models import (
    Benchmark, Benchmarkname, BudgetItem, BudgetItemLabel, Category, Country, FocusArea, Goal, Link,
    Organisation, OrganisationLocation, Partnership, Project, ProjectLocation, ProjectUpdate,
    ProjectComment, UserProfile, Invoice
)

from akvo.rsr.utils import PAYPAL_INVOICE_STATUS_COMPLETE

__all__ = [
    'BenchmarkResource',
    'BenchmarknameResource',
    'BudgetItemResource',
    'BudgetItemLabelResource',
    'CategoryResource',
    'CountryResource',
    'FocusAreaResource',
    'GoalResource',
    'InvoiceResource',
    'LinkResource',
    'OrganisationResource',
    'OrganisationFullResource',
    'OrganisationLocationResource',
    'PartnershipResource',
    'PartnershipFullResource',
    'ProjectResource',
    'ProjectFullResource',
    'ProjectCommentResource',
    'ProjectLocationResource',
    'ProjectUpdateResource',
    'UserResource',
    'UserProfileResource',
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
        queryset        = BudgetItem.objects.all()
        resource_name   = 'budget_item'


class BudgetItemLabelResource(ModelResource):
    class Meta:
        allowed_methods = ['get']
        queryset        = BudgetItemLabel.objects.all()
        resource_name   = 'budget_item_label'


class CategoryResource(ModelResource):
    class Meta:
        allowed_methods = ['get']
        queryset        = Category.objects.all()
        resource_name   = 'category'


class CountryResource(ModelResource):
    class Meta:
        allowed_methods = ['get']
        queryset        = Country.objects.all()
        resource_name   = 'country'


class FocusAreaResource(ModelResource):
    categories      = fields.ToManyField('akvo.api.resources.CategoryResource', 'categories')

    class Meta:
        allowed_methods = ['get']
        queryset        = FocusArea.objects.all()
        resource_name   = 'focus_area'


class GoalResource(ModelResource):
    project = fields.ToOneField('akvo.api.resources.ProjectResource', 'project')

    class Meta:
        allowed_methods = ['get']
        queryset        = Goal.objects.all()
        resource_name   = 'goal'


class InvoiceResource(ModelResource):
    project = fields.ToOneField('akvo.api.resources.ProjectResource', 'project')

    class Meta:
        allowed_methods = ['get']
        queryset        = Invoice.objects.filter(status__exact=PAYPAL_INVOICE_STATUS_COMPLETE)
        resource_name   = 'invoice'
        fields = ['amount', 'amount_received', 'user', 'is_anonymous',]

    def dehydrate(self, bundle):
        """ Add meta fields showing if the user profile is an organisation admin or an organisation editor
        """
        if not bundle.obj.is_anonymous:
            bundle.data['email'] = bundle.obj.email
            bundle.data['name'] = bundle.obj.name
        return bundle


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


class OrganisationFullResource(OrganisationResource):
    """ return Project data with all related data inline, rather than as resource URLs
    """
    partnerships = fields.ToManyField(
        'akvo.api.resources.PartnershipFullResource',
        'partnership_set',
        related_name='organisation',
        help_text='Show the projects the organisation is related to and how.',
    )

    def __init__(self, api_name=None):
        """ set full=True for all ToManyFields
        """
        super(OrganisationFullResource, self).__init__(api_name)
        for field in self.fields:
            if type(self.fields[field]) == fields.ToManyField and field == 'locations':
                self.fields[field].full = True

    class Meta:
        allowed_methods = ['get']
        queryset        = Organisation.objects.all()
        resource_name   = 'organisation_full'


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


class PartnershipFullResource(PartnershipResource):
    organisation    = fields.ToOneField('akvo.api.resources.OrganisationFullResource', 'organisation')

    def __init__(self, api_name=None):
        """ set full=True for all ToManyFields
        """
        super(PartnershipFullResource, self).__init__(api_name)
        for field in self.fields:
            if type(self.fields[field]) == fields.ToOneField and field == 'organisation':
                self.fields[field].full = True

    class Meta:
        allowed_methods = ['get']
        queryset        = Partnership.objects.all()
        resource_name   = 'partnership_full'


class ProjectResource(ModelResource):
    benchmarks          = fields.ToManyField('akvo.api.resources.BenchmarkResource', 'benchmarks',)
    budget_items        = fields.ToManyField('akvo.api.resources.BudgetItemResource', 'budget_items')
    categories          = fields.ToManyField('akvo.api.resources.CategoryResource', 'categories')
    goals               = fields.ToManyField('akvo.api.resources.GoalResource', 'goals')
    invoices            = fields.ToManyField('akvo.api.resources.InvoiceResource', 'invoices')
    links               = fields.ToManyField('akvo.api.resources.LinkResource', 'links')
    locations           = fields.ToManyField('akvo.api.resources.ProjectLocationResource', 'locations')
    partnerships        = fields.ToManyField('akvo.api.resources.PartnershipResource', 'partnerships',)
    project_comments    = fields.ToManyField('akvo.api.resources.ProjectCommentResource', 'comments')
    project_updates     = fields.ToManyField('akvo.api.resources.ProjectUpdateResource', 'project_updates')

    class Meta:
        allowed_methods = ['get']
        queryset        = Project.objects.published()
        resource_name   = 'project'
        filtering       = dict(partners=ALL_WITH_RELATIONS)


class ProjectFullResource(ProjectResource):
    """ Return Project data with all related data inline, rather than as resource URLs
    """
#    partnerships        = fields.ToManyField('akvo.api.resources.PartnershipFullResource', 'partnerships')

    def __init__(self, api_name=None):
        """ set full=True for all ToManyFields
        """
        super(ProjectFullResource, self).__init__(api_name)
        for field in self.fields:
            if type(self.fields[field]) == fields.ToManyField:
                self.fields[field].full = True

    class Meta:
        allowed_methods = ['get']
        queryset        = Project.objects.published()
        resource_name   = 'project_full'
        filtering       = dict(partners=ALL_WITH_RELATIONS)


class ProjectCommentResource(ModelResource):
    project = fields.ToOneField('akvo.api.resources.ProjectResource', 'project')

    class Meta:
        allowed_methods = ['get']
        queryset        = ProjectComment.objects.all()
        resource_name   = 'project_comment'


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
        filtering       = dict(project=ALL_WITH_RELATIONS)


class ProjectUpdateResource(ModelResource):
    project = fields.ToOneField('akvo.api.resources.ProjectResource', 'project')
    user    = fields.ToOneField('akvo.api.resources.UserResource', 'user')

    class Meta:
        allowed_methods = ['get']
        queryset        = ProjectUpdate.objects.all()
        resource_name   = 'project_update'


class UserProfileResource(ModelResource):
    organisation    = fields.ToOneField('akvo.api.resources.OrganisationResource', 'organisation')
    user            = fields.ToOneField('akvo.api.resources.UserResource', 'user')

    class Meta:
        authentication  = ApiKeyAuthentication()
        allowed_methods = ['get']
        queryset        = UserProfile.objects.filter(user__is_active=True)
        resource_name   = 'user_profile'
        fields = ['organisation', 'user',]

    def get_object_list(self, request):
        """ Limit access to the users in your own organisation
        """
        organisation = request.user.get_profile().organisation
        return UserProfile.objects.filter(organisation=organisation)

    def dehydrate(self, bundle):
        """ Add meta fields showing if the user profile is an organisation admin or an organisation editor
        """
        bundle.data['is_org_admin'] = bundle.obj.get_is_org_admin()
        bundle.data['is_org_editor'] = bundle.obj.get_is_org_editor()
        return bundle


class UserResource(ModelResource):
    user_profile = fields.ToOneField('akvo.api.resources.UserProfileResource', 'userprofile', null=True)

    class Meta:
        authentication  = ApiKeyAuthentication()
        allowed_methods = ['get']
        queryset = User.objects.filter(is_active=True)
        resource_name = 'user'
        fields = ['first_name', 'last_name', 'last_login', ]

    def dehydrate(self, bundle):
        """ Workaround for the overloading of 'username' when used in the query.
            It is needed for the authentication, but the filtering machinery
            intercepts and complains that the 'username' field doesn't allow filtering.
            So instead of having username in the fields list we add it here

            The adding is conditional, only add fields for users in the same organisation
            as request.user which is the API key user

            For other users delete the user_profile field
        """
        organisation = bundle.request.user.get_profile().organisation
        profile = UserProfile.objects.filter(organisation=organisation, user__id=bundle.obj.id)
        if profile:
            bundle.data['username'] = bundle.obj.username
            bundle.data['email'] = bundle.obj.email
        else:
            del bundle.data['user_profile']
        return bundle

