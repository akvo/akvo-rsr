from akvo.password_policy.models import PolicyConfig
from akvo.rsr.forms import resolve_password_policy
from akvo.rsr.tests.base import BaseTestCase


class ResolvePasswordPolicyTestCase(BaseTestCase):
    def setUp(self):
        super().setUp()
        first_org = self.create_organisation('First org')
        first_policy = PolicyConfig.objects.create(name='First policy', min_length=4, uppercases=2, symbols=2)
        first_org.password_policy = first_policy
        first_org.save()

        self.user = self.create_user('foo@example.com', 'password')
        self.make_employment(self.user, first_org, 'Users')

    def test_resolve_config(self):
        config = resolve_password_policy(self.user)
        self.assertEqual('First policy', config.name)

    def test_only_config_of_first_org(self):
        second_org = self.create_organisation('Second org')
        second_policy = PolicyConfig.objects.create(name='Second policy', min_length=1, uppercases=1, symbols=1)
        second_org.password_policy = second_policy
        second_org.save()
        self.make_employment(self.user, second_org, 'Admins')

        config = resolve_password_policy(self.user)
        self.assertEqual('First policy', config.name)

    def test_no_config(self):
        user = self.create_user('test@example.com', 'password')
        org = self.create_organisation('No policy')
        self.make_employment(user, org, 'Enumerators')

        config = resolve_password_policy(user)
        self.assertIsNone(config)
