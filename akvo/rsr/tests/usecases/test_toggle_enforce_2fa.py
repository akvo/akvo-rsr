from akvo.rsr.tests.base import BaseTestCase
from akvo.rsr.usecases.toggle_org_enforce_2fa import find_related_users


class FindRelatedUsersTest(BaseTestCase):
    def setUp(self):
        super().setUp()
        self.org = self.create_organisation('Akvo')
        self.user = self.create_user('test@akvo.org')
        self.project = self.create_project('Acme')

    def test_found_employee(self):
        self.make_employment(self.user, self.org, 'Users')

        found = find_related_users(self.org).values_list('email', flat=True)

        self.assertIn(self.user.email, found)

    def test_found_project_access(self):
        self.make_project_role(self.user, self.project, 'Users')
        self.make_partner(self.project, self.org)

        found = find_related_users(self.org).values_list('email', flat=True)

        self.assertIn(self.user.email, found)
