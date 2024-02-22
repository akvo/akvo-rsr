from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from django.http import HttpResponse
from django.test import RequestFactory
from django_otp.plugins.otp_totp.models import TOTPDevice
from akvo.rsr.tests.base import BaseTestCase
from akvo.rsr.decorators import two_factor_required


def func_view(request):
    return HttpResponse(request.user)


class TwoFactorRequiredDecoratorTestCase(BaseTestCase):
    def setUp(self) -> None:
        super().setUp()
        self.request = RequestFactory().get('')
        self.user = self.create_user('test@akvo.org')
        self.request.user = self.user

    def make_default_device(self, user):
        return TOTPDevice.objects.create(user=user, name='default')

    def enforce_2fa(self, user):
        user.enforce_2fa = True
        user.save()
        return get_user_model().objects.get(id=user.id)

    def test_user_no_device_and_not_enforced_2fa(self):
        response = two_factor_required(func_view)(self.request)
        self.assertEqual(response.status_code, 200)

    def test_user_no_device_and_enforced_2fa(self):
        self.enforce_2fa(self.user)
        response = two_factor_required(func_view)(self.request)
        self.assertEqual(response.status_code, 302)

    def test_user_with_device_not_and_enforced_2fa(self):
        self.make_default_device(self.user)
        response = two_factor_required(func_view)(self.request)
        self.assertEqual(response.status_code, 200)

    def test_user_with_device_and_enforced_2fa(self):
        user = self.enforce_2fa(self.user)
        self.make_default_device(user)
        response = two_factor_required(func_view)(self.request)
        self.assertEqual(response.status_code, 200)

    def test_anonymous_user(self):
        user = AnonymousUser()
        request = RequestFactory().get('')
        request.user = user
        response = two_factor_required(func_view)(request)
        self.assertEqual(response.status_code, 200)
