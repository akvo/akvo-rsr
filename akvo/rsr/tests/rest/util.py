# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.

# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import random
import string
import datetime

from akvo.rsr.models import Result, Indicator, IndicatorPeriod, IndicatorPeriodData, ProjectLocation
from akvo.rsr.models.result.utils import QUANTITATIVE, PERCENTAGE_MEASURE
from akvo.rsr.tests.base import BaseTestCase
from akvo.utils import custom_get_or_create_country


def random_string(length):
    return ''.join(random.choice(string.ascii_lowercase) for i in range(length))


class ProjectFixtureBuilder(object):
    def __init__(self):
        self.is_percentage = False
        self.aggregate_children = True
        self.aggregate_to_parent = True
        self.title = random_string(5)
        self.location = None
        self.lead = None

    def with_title(self, title):
        self.title = title
        return self

    def with_aggregate_children(self, flag):
        self.aggregate_children = flag
        return self

    def with_aggregate_to_parent(self, flag):
        self.aggregate_to_parent = flag
        return self

    def with_percentage_indicator(self, flag=True):
        self.is_percentage = flag
        return self

    def with_location(self, country_code):
        self.location = country_code
        return self

    def as_contributor_of(self, lead):
        self.lead = lead
        return self

    def build(self):
        project = BaseTestCase.create_contributor(
            self.title, self.lead, aggregate_children=self.aggregate_children,
            aggregate_to_parent=self.aggregate_to_parent
        ) if self.lead else self._build_project()
        self._build_location(project)
        return ProjectFixtureFacade(project)

    def _build_project(self):
        project = BaseTestCase.create_project(self.title, aggregate_children=self.aggregate_children, aggregate_to_parent=self.aggregate_to_parent)
        result = Result.objects.create(project=project, title=random_string(5), type='1')
        indicator = self._build_indicator(result)
        IndicatorPeriod.objects.create(
            indicator=indicator, period_start=datetime.date.today(),
            period_end=datetime.date.today() + datetime.timedelta(days=30)
        )
        return project

    def _build_location(self, project):
        if self.location is None:
            return
        country = custom_get_or_create_country(iso_code=self.location.lower())
        ProjectLocation.objects.create(location_target=project, country=country)

    def _build_indicator(self, result):
        if self.is_percentage:
            return Indicator.objects.create(result=result, type=QUANTITATIVE, measure=PERCENTAGE_MEASURE)
        return Indicator.objects.create(result=result, type=QUANTITATIVE, measure="1")


class ProjectFixtureFacade(object):
    def __init__(self, project):
        self.project = project
        self._result = None
        self._period = None

    def add_update(self, user, value=None, numerator=None, denominator=None, status=IndicatorPeriodData.STATUS_APPROVED_CODE):
        return IndicatorPeriodData.objects.create(
            period=self.period,
            user=user,
            value=value,
            numerator=numerator,
            denominator=denominator,
            status=status
        )

    @property
    def object(self):
        return self.project

    @property
    def result(self):
        return Result.objects.get(project=self.project)

    @property
    def period(self):
        return IndicatorPeriod.objects.get(indicator__result__project=self.project)


class ProjectHierarchyFixtureBuilder(object):
    def __init__(self):
        self.project_tree = {}
        self.updates = {}
        self.project_list = []
        self.is_percentage = False
        self._user = None

    def with_hierarchy(self, project_tree):
        self.project_tree = project_tree
        return self

    def with_percentage_indicators(self, flag=True):
        self.is_percentage = flag
        return self

    def with_user(self, user):
        self._user = user
        return self

    def with_updates_on(self, project_title, updates):
        self.updates[project_title] = updates
        return self

    @property
    def user(self):
        if not self._user:
            self._user = BaseTestCase.create_user(
                random_string(5) + "@akvo.org", "password", is_admin=True)
        return self._user

    def build(self):
        title = self.project_tree['title']
        root = ProjectFixtureBuilder()\
            .with_title(title)\
            .with_percentage_indicator(self.is_percentage)\
            .with_aggregate_children(self.project_tree.get('aggregate_children', True))\
            .with_location(self.project_tree.get('location', None))\
            .build()
        project_tree = ProjectHierarchyFixtureFacade(root)
        self._build_contributors(self.project_tree.get('contributors', []), root, project_tree)
        self._handle_updates(project_tree)
        return project_tree

    def _build_contributors(self, contributors, lead, project_tree):
        for contributor in contributors:
            title = contributor['title']
            project = ProjectFixtureBuilder()\
                .with_title(title)\
                .with_aggregate_children(contributor.get('aggregate_children', True))\
                .with_aggregate_to_parent(contributor.get('aggregate_to_parent', True))\
                .with_location(contributor.get('location', None))\
                .as_contributor_of(lead.object)\
                .build()
            project_tree.add_contributor(lead, project)
            self._build_contributors(contributor.get('contributors', []), project, project_tree)

    def _handle_updates(self, project_tree):
        for project_title, updates in self.updates.items():
            project = project_tree.get(project_title)
            for update in updates:
                project.add_update(
                    user=self.user,
                    value=update.get('value', None),
                    numerator=update.get('numerator', None),
                    denominator=update.get('denominator', None),
                    status=update.get('status', 'A')
                )


class ProjectHierarchyFixtureFacade(object):
    def __init__(self, root):
        root_title = root.object.title
        self._root_title = root_title
        self._lookup = {}
        self._lookup[root_title] = {'item': root, 'children': []}

    @property
    def root(self):
        return self._lookup[self._root_title]['item']

    @property
    def period_tree(self):
        return self._period_node(self._lookup[self._root_title])

    def add_contributor(self, lead, contributor):
        node = {'item': contributor, 'children': []}
        self._lookup[contributor.object.title] = node
        self._lookup[lead.object.title]['children'].append(node)

    def get(self, project_title):
        return self._lookup[project_title]['item']

    def _period_node(self, node):
        return {
            'item': node['item'].period,
            'children': self._period_nodes(node['children']),
        }

    def _period_nodes(self, nodes):
        items = []
        for node in nodes:
            item = self._period_node(node)
            items.append(item)
        return items
