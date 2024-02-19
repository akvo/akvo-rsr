from akvo.rsr.tests.base import BaseTestCase
from akvo.rsr.models import User
from akvo.rsr.usecases.toggle_org_enforce_2fa import find_related_users, toggle_enfore_2fa


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


class ToggleEnforce2FATest(BaseTestCase):
    def setUp(self):
        super().setUp()
        self.org = self.create_organisation('Akvo')
        self.user = self.create_user('test@akvo.org')
        self.make_employment(self.user, self.org, 'Users')

    def test_toggle_true(self):
        self.org.enforce_2fa = True
        self.org.save()

        toggle_enfore_2fa(self.org)

        self.assertTrue(User.objects.get(id=self.user.id).enforce_2fa)

    def test_toggle_false(self):
        # Force changes
        self.org.enforce_2fa = True
        self.org.save()
        self.org.enforce_2fa = False
        self.org.save()

        self.user.enforce_2fa = True
        self.user.save()

        toggle_enfore_2fa(self.org)

        self.assertFalse(User.objects.get(id=self.user.id).enforce_2fa)
