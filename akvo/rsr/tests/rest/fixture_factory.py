# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

"""

import datetime
import random

from django.conf import settings
from django.contrib.auth.models import Group
import factory
from factory.django import DjangoModelFactory
from factory.fuzzy import reseed_random

from akvo.rsr.iso3166 import ISO_3166_COUNTRIES
from akvo.rsr.models import PublishingStatus, Partnership, ProjectLocation, Country, Keyword
from akvo.rsr.models import User, Project, Organisation, Indicator, Result, IndicatorPeriod
from akvo.utils import check_auth_groups


class UserFactory(DjangoModelFactory):

    class Meta:
        model = 'rsr.User'

    is_active = True
    username = factory.Sequence(lambda x: 'user-{}'.format(x))
    email = factory.LazyAttribute(lambda u: '{}@foo.com'.format(u.username))

    @factory.post_generation
    def post(obj, create, extracted, **kwargs):
        # Set password to 'password' for all users
        obj.set_password('password')
        obj.save()


class AdministrativeLocationFactory(DjangoModelFactory):

    class Meta:
        model = 'rsr.AdministrativeLocation'


class OrganisationLocationFactory(DjangoModelFactory):

    class Meta:
        model = 'rsr.OrganisationLocation'

    latitude = factory.fuzzy.FuzzyDecimal(-90, 90)
    longitude = factory.fuzzy.FuzzyDecimal(-90, 90)


class ProjectLocationFactory(OrganisationLocationFactory):

    class Meta:
        model = 'rsr.ProjectLocation'

    administratives = factory.RelatedFactory(AdministrativeLocationFactory, 'location')


class OrganisationFactory(DjangoModelFactory):

    class Meta:
        model = 'rsr.Organisation'

    long_name = factory.Sequence(lambda x: 'Organisation - {}'.format(x))
    name = factory.LazyAttribute(lambda org: org.long_name)
    locations = factory.RelatedFactory(OrganisationLocationFactory, 'location_target')


class TransactionSectorFactory(DjangoModelFactory):

    class Meta:
        model = 'rsr.TransactionSector'


class TransactionFactory(DjangoModelFactory):

    class Meta:
        model = 'rsr.Transaction'

    receiver_organisation = factory.LazyAttribute(lambda t: t.project.find_primary_organisation())
    sectors = factory.RelatedFactory(TransactionSectorFactory, 'transaction')


class ProjectDocumentCategoryFactory(DjangoModelFactory):

    class Meta:
        model = 'rsr.ProjectDocumentCategory'


class ProjectDocumentFactory(DjangoModelFactory):

    class Meta:
        model = 'rsr.ProjectDocument'

    categories = factory.RelatedFactory(ProjectDocumentCategoryFactory, 'document')


class CrsAddOtherFlagFactory(DjangoModelFactory):

    class Meta:
        model = 'rsr.CrsAddOtherFlag'


class CrsAddFactory(DjangoModelFactory):

    class Meta:
        model = 'rsr.CrsAdd'

    other_flags = factory.RelatedFactory(CrsAddOtherFlagFactory, 'crs')
    project = factory.Iterator(Project.objects.all())


class FssForecastFactory(DjangoModelFactory):

    class Meta:
        model = 'rsr.FssForecast'


class FssFactory(DjangoModelFactory):

    class Meta:
        model = 'rsr.Fss'

    forecasts = factory.RelatedFactory(FssForecastFactory, 'fss')
    project = factory.Iterator(Project.objects.all())


class ProjectFactory(DjangoModelFactory):

    class Meta:
        model = 'rsr.Project'

    currency = factory.Sequence(lambda x: u'EUR' if x % 2 == 0 else u'USD')
    title = factory.Sequence(
        lambda x: ('Fiber Project - {}' if x % 3 == 0 else 'Water Project - {}').format(x)
    )
    locations = factory.RelatedFactory(
        'akvo.rsr.tests.rest.fixture_factory.ProjectLocationFactory', 'location_target'
    )
    transactions = factory.RelatedFactory(TransactionFactory, 'project')
    documents = factory.RelatedFactory(ProjectDocumentFactory, 'project')
    post__publishingstatus__status = PublishingStatus.STATUS_PUBLISHED

    @factory.post_generation
    def post(obj, create, extracted, **kwargs):
        for key, value in kwargs.items():
            obj_ = obj
            names = key.split('__')
            for name in names[:-1]:
                obj_ = getattr(obj, name)
            setattr(obj_, names[-1], value)
            obj_.save()


class PartnershipFactory(DjangoModelFactory):

    class Meta:
        model = 'rsr.Partnership'

    project = factory.Iterator(Project.objects.all())
    organisation = factory.Iterator(Organisation.objects.all())
    iati_organisation_role = Partnership.IATI_REPORTING_ORGANISATION


class ProjectUpdateFactory(DjangoModelFactory):

    class Meta:
        model = 'rsr.ProjectUpdate'

    project = factory.Iterator(Project.objects.all())
    user = factory.Iterator(User.objects.all())
    title = factory.Sequence(lambda x: 'Project Update - {}'.format(x))


class ResultFactory(DjangoModelFactory):

    class Meta:
        model = 'rsr.Result'

    project = factory.Iterator(Project.objects.all())
    title = factory.Sequence(lambda x: 'Result - {}'.format(x))


class IndicatorFactory(DjangoModelFactory):

    class Meta:
        model = 'rsr.Indicator'

    result = factory.Iterator(Result.objects.all())
    title = factory.Sequence(lambda x: 'Indicator - {}'.format(x))


class IndicatorReferenceFactory(DjangoModelFactory):

    class Meta:
        model = 'rsr.IndicatorReference'

    indicator = factory.Iterator(Indicator.objects.all())


class IndicatorPeriodFactory(DjangoModelFactory):

    class Meta:
        model = 'rsr.IndicatorPeriod'

    indicator = factory.Iterator(Indicator.objects.all())
    period_start = factory.fuzzy.FuzzyDate(datetime.date(2000, 1, 1))
    period_end = factory.LazyAttribute(lambda p: p.period_start + datetime.timedelta(90))
    locked = False


class IndicatorPeriodActualDimensionFactory(DjangoModelFactory):

    class Meta:
        model = 'rsr.IndicatorPeriodActualDimension'

    period = factory.Iterator(IndicatorPeriod.objects.all())
    name = factory.fuzzy.FuzzyText
    value = factory.fuzzy.FuzzyDecimal


class IndicatorPeriodTargetDimensionFactory(IndicatorPeriodActualDimensionFactory):

    class Meta:
        model = 'rsr.IndicatorPeriodTargetDimension'


class IndicatorPeriodActualLocationFactory(DjangoModelFactory):

    class Meta:
        model = 'rsr.IndicatorPeriodActualLocation'

    period = factory.Iterator(IndicatorPeriod.objects.all())


class IndicatorPeriodTargetLocationFactory(IndicatorPeriodActualLocationFactory):

    class Meta:
        model = 'rsr.IndicatorPeriodTargetLocation'


class IndicatorPeriodDataFactory(DjangoModelFactory):

    class Meta:
        model = 'rsr.IndicatorPeriodData'

    user = factory.Iterator(User.objects.all())
    period = factory.Iterator(IndicatorPeriod.objects.all())


class IatiExportFactory(DjangoModelFactory):

    class Meta:
        model = 'rsr.IatiExport'

    user = factory.LazyFunction(lambda: User.objects.get(is_superuser=True))
    reporting_organisation = factory.Iterator(Organisation.objects.all())

    @factory.post_generation
    def post(obj, create, extracted, **kwargs):
        for project in obj.reporting_organisation.projects.distinct():
            obj.projects.add(project)


class EmploymentFactory(DjangoModelFactory):

    class Meta:
        model = 'rsr.Employment'

    user = factory.Iterator(User.objects.all())
    organisation = factory.Iterator(Organisation.objects.all())
    group = factory.Sequence(lambda x: Group.objects.get(id=Group.objects.order_by('id').values_list('id', flat=True)[x % Group.objects.count()]))


class KeywordFactory(DjangoModelFactory):

    class Meta:
        model = 'rsr.Keyword'

    label = factory.Sequence(lambda x: 'label-{}'.format(x))


class ProjectEditorValidationSetFactory(DjangoModelFactory):

    class Meta:
        model = 'rsr.ProjectEditorValidationSet'

    @factory.post_generation
    def post(obj, create, extracted, **kwargs):
        for project in Project.objects.all():
            project.validations.add(obj)


def populate_test_data(seed=42):
    """Populate the DB for tests using the factories defined."""

    reseed_random(seed)
    random.seed(seed)

    Group.objects.all().delete()
    check_auth_groups(settings.REQUIRED_AUTH_GROUPS)

    User.objects.delete()
    Project.objects.delete()
    Organisation.objects.delete()
    Partnership.objects.all().delete()
    ProjectLocation.objects.all().delete()
    Indicator.objects.all().delete()

    UserFactory.create(is_admin=True, is_superuser=True, is_staff=True)
    UserFactory.create_batch(4)
    OrganisationFactory.create_batch(3)

    ProjectFactory.create_batch(10)
    CrsAddFactory.create_batch(10)
    FssFactory.create_batch(10)
    PartnershipFactory.create_batch(10)

    ProjectUpdateFactory.create_batch(100)
    ResultFactory.create_batch(40)
    IndicatorFactory.create_batch(80)
    IndicatorReferenceFactory.create_batch(80)
    IndicatorPeriodFactory.create_batch(240)
    IndicatorPeriodActualDimensionFactory.create_batch(240)
    IndicatorPeriodTargetDimensionFactory.create_batch(240)
    IndicatorPeriodActualLocationFactory.create_batch(240)
    IndicatorPeriodTargetLocationFactory.create_batch(240)
    IndicatorPeriodDataFactory.create_batch(1200)
    IatiExportFactory.create_batch(3)

    for _ in range(10):
        created = False
        while not created:
            country_code = random.choice(ISO_3166_COUNTRIES)[0]
            country_info = Country.fields_from_iso_code(country_code)
            country, created = Country.objects.get_or_create(**country_info)

    EmploymentFactory.create_batch(15)

    KeywordFactory.create_batch(20)
    for keyword in Keyword.objects.all():
        for project in Project.objects.all():
            if keyword.id % project.id != 0:
                continue
            project.keywords.add(keyword)

    ProjectEditorValidationSetFactory.create_batch(2)

    # FIXME: Check if all models have at least one object.
    # for model in akvo.rsr.models: assert model.objects.count() > 0

# Organisation.objects.update(can_create_projects=True)

# ## Publish a bunch of indicators and results
# project = Project.objects.get(id=4)
# for title in ('first', 'second', 'third'):
#     r = Result(project=project, title=title)
#     r.save()
#     for title in ('1', '2', '3'):
#         i = Indicator(result=r, title=title)
#         i.save()
#         locked = False if title != '3' else True
#         ip = IndicatorPeriod(indicator=i, locked=locked)
#         ip.save()

#         IndicatorPeriodData(period=ip, user_id=2).save()

# # Create an unapproved employment
# Employment(organisation_id=1, user_id=2).save()

# project = Project.objects.get(id=4)
# partnership = Partnership.objects.get(project=project, organisation_id=1)
# partnership.iati_organisation_role = 101  # reporting partner
# partnership.save()

# iati_export.projects.add(project)
# project.update_iati_checks()
