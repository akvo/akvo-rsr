# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

"""

import datetime
import random

from django.conf import settings
from django.db import transaction
from django.contrib.auth.models import Group
import factory
from factory.django import DjangoModelFactory
from factory.fuzzy import reseed_random

from akvo.rsr.iso3166 import ISO_3166_COUNTRIES
from akvo.rsr.models import PublishingStatus, Partnership, Country, Keyword
from akvo.rsr.models import User, Project, Organisation, Indicator, Result, IndicatorPeriod, IndicatorPeriodData, ProjectEditorValidationSet
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


class ProjectUpdateLocationFactory(OrganisationLocationFactory):

    class Meta:
        model = 'rsr.ProjectUpdateLocation'


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


class ProjectCommentFactory(DjangoModelFactory):

    class Meta:
        model = 'rsr.ProjectComment'

    user = factory.Iterator(User.objects.all())
    project = factory.Iterator(Project.objects.all())


class ProjectContactFactory(DjangoModelFactory):

    class Meta:
        model = 'rsr.ProjectContact'

    project = factory.Iterator(Project.objects.all())


class ProjectConditionFactory(DjangoModelFactory):

    class Meta:
        model = 'rsr.ProjectCondition'

    project = factory.Iterator(Project.objects.all())
    type = factory.Iterator(['1', '2', '3'])


class ProjectFactory(DjangoModelFactory):

    class Meta:
        model = 'rsr.Project'

    currency = factory.Sequence(lambda x: u'EUR' if x % 2 == 0 else u'USD')
    title = factory.Sequence(
        lambda x: ('Fiber Project - {}' if x % 3 == 0 else 'Water Project - {}').format(x)
    )
    locations = factory.RelatedFactory(ProjectLocationFactory, 'location_target')
    transactions = factory.RelatedFactory(TransactionFactory, 'project')
    documents = factory.RelatedFactory(ProjectDocumentFactory, 'project')
    contacts = factory.RelatedFactory(ProjectContactFactory, 'project')
    conditions = factory.RelatedFactory(ProjectConditionFactory, 'project')
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
    locations = factory.RelatedFactory(ProjectUpdateLocationFactory, 'location_target')
    event_date = factory.fuzzy.FuzzyDate(datetime.date(2000, 1, 1), datetime.date(2020, 1, 1))


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
    period_start = factory.fuzzy.FuzzyDate(datetime.date(2000, 1, 1), datetime.date(2020, 1, 1))
    period_end = factory.LazyAttribute(lambda p: p.period_start + datetime.timedelta(90))
    locked = False


class IndicatorPeriodActualDimensionFactory(DjangoModelFactory):

    class Meta:
        model = 'rsr.IndicatorPeriodActualDimension'

    period = factory.Iterator(IndicatorPeriod.objects.all())
    name = factory.fuzzy.FuzzyText()
    value = factory.fuzzy.FuzzyDecimal(0, 100)


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


class IndicatorPeriodDataCommentFactory(DjangoModelFactory):

    class Meta:
        model = 'rsr.IndicatorPeriodDataComment'

    data = factory.Iterator(IndicatorPeriodData.objects.all())
    user = factory.Iterator(User.objects.all())


class IatiExportFactory(DjangoModelFactory):

    class Meta:
        model = 'rsr.IatiExport'

    user = factory.LazyFunction(lambda: User.objects.get(is_superuser=True))
    reporting_organisation = factory.Iterator(Organisation.objects.all())

    @factory.post_generation
    def post(obj, create, extracted, **kwargs):
        for project in obj.reporting_organisation.projects.distinct():
            project.update_iati_checks()
            obj.projects.add(project)


class IatiImportFactory(DjangoModelFactory):

    class Meta:
        model = 'rsr.IatiImport'

    user = factory.LazyFunction(lambda: User.objects.get(is_superuser=True))
    label = factory.Sequence(lambda x: 'iati-import-{}'.format(x))
    frequency = factory.fuzzy.FuzzyInteger(1, 7)

    @factory.post_generation
    def post(obj, create, extracted, **kwargs):
        obj.execute_import()


class EmploymentFactory(DjangoModelFactory):

    class Meta:
        model = 'rsr.Employment'

    # We have 3 sequences, and we try to create a nested loop structure using that.
    # We have 6 groups, 3 orgs and 5 users.
    # Each user has 6 employments - 2 employments per org with different groups

    _users = User.objects.all()
    _organisations = Organisation.objects.all()
    _groups = Group.objects.all().order_by('id')

    @factory.sequence
    def user(n):
        index = n / len(EmploymentFactory._groups)
        return EmploymentFactory._users[index]

    @factory.sequence
    def organisation(n):
        index = (n % len(EmploymentFactory._groups)) / 2
        return EmploymentFactory._organisations[index]

    @factory.sequence
    def group(n):
        index = n % len(EmploymentFactory._groups)
        return EmploymentFactory._groups[index]


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


class ProjectEditorValidationFactory(DjangoModelFactory):

    class Meta:
        model = 'rsr.ProjectEditorValidation'

    validation_set = factory.Iterator(ProjectEditorValidationSet.objects.all())
    validation = factory.fuzzy.FuzzyText()
    action = factory.fuzzy.FuzzyInteger(1, 2)


class RelatedProjectFactory(DjangoModelFactory):

    class Meta:
        model = 'rsr.RelatedProject'

    project = factory.Iterator(Project.objects.all())
    related_project = factory.Iterator(Project.objects.filter(pk=1))
    relation = '1'


class RecipientCountryFactory(DjangoModelFactory):

    class Meta:
        model = 'rsr.RecipientCountry'

    project = factory.Iterator(Project.objects.all())
    percentage = factory.fuzzy.FuzzyDecimal(1, 100)


class CustomFieldFactory(DjangoModelFactory):

    name = factory.fuzzy.FuzzyText()
    section = factory.fuzzy.FuzzyInteger(1, 10)
    order = factory.fuzzy.FuzzyInteger(1, 10)


class ProjectCustomFieldFactory(CustomFieldFactory):

    class Meta:
        model = 'rsr.ProjectCustomField'

    project = factory.Iterator(Project.objects.all())


class OrganisationCustomFieldFactory(CustomFieldFactory):

    class Meta:
        model = 'rsr.OrganisationCustomField'

    organisation = factory.Iterator(Organisation.objects.all())


class ReportFormatFactory(DjangoModelFactory):

    class Meta:
        model = 'rsr.ReportFormat'

    name = factory.Iterator(['pdf', 'excel', 'word', 'html'])
    display_name = factory.LazyAttribute(lambda f: f.name.capitalize())


class ReportFactory(DjangoModelFactory):

    class Meta:
        model = 'rsr.Report'

    name = factory.Sequence(lambda x: 'report-{}'.format(x))
    url = factory.Iterator(['/x/{project}?format={format}', '/x/{organisation}?format={format}'])


@transaction.atomic()
def populate_test_data(seed=42):
    """Populate the DB for tests using the factories defined."""

    reseed_random(seed)
    random.seed(seed)

    check_auth_groups(settings.REQUIRED_AUTH_GROUPS)

    UserFactory.create(is_admin=True, is_superuser=True, is_staff=True)
    UserFactory.create_batch(4)
    OrganisationFactory.create_batch(3)
    OrganisationCustomFieldFactory.create_batch(9)

    ProjectFactory.create_batch(10)
    RecipientCountryFactory.create_batch(10)
    CrsAddFactory.create_batch(10)
    FssFactory.create_batch(10)
    PartnershipFactory.create_batch(10)

    ProjectCustomFieldFactory.create_batch(20)
    ProjectCommentFactory.create_batch(20)
    RelatedProjectFactory.create_batch(10)

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
    IndicatorPeriodDataCommentFactory.create_batch(1200)

    IatiExportFactory.create_batch(3)
    IatiImportFactory.create_batch(3)

    for _ in range(10):
        created = False
        while not created:
            country_code = random.choice(ISO_3166_COUNTRIES)[0]
            country_info = Country.fields_from_iso_code(country_code)
            country, created = Country.objects.get_or_create(**country_info)

    EmploymentFactory.create_batch(30)

    KeywordFactory.create_batch(20)
    for keyword in Keyword.objects.all():
        for project in Project.objects.all():
            if keyword.id % project.id != 0:
                continue
            project.keywords.add(keyword)

    ProjectEditorValidationSetFactory.create_batch(2)
    ProjectEditorValidationFactory.create_batch(20)

    ReportFormatFactory.create_batch(4)
    ReportFactory.create_batch(4)

    # FIXME: Enforce this!
    verify_model_instances()


def verify_model_instances(enforce=False):
    """Verify that there's at least one instance of all the models."""

    from akvo.rsr import models as M
    from django.db.models import Model

    for model in sorted(M.__dict__.values()):
        if not (isinstance(model, type) and issubclass(model, Model)) or model.objects.count() > 0:
            continue
        msg = 'No instances of {} found'.format(model)

        if enforce:
            assert False, msg

        else:
            print msg
