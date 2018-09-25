# -*- coding: utf-8 -*-
# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.contrib.auth.models import Group
from django.test import TestCase

from akvo.rsr.models import User, Employment


class BaseTestCase(TestCase):
    """Testing that permissions work correctly."""

    @staticmethod
    def create_user(email, password=None, is_active=True, is_admin=False, is_superuser=False):
        """Create a user with the given email."""

        first_name = email.split('@')[0]
        last_name = 'von {}enstein'.format(first_name)
        user = User.objects.create(
            email=email,
            username=email,
            first_name=first_name,
            last_name=last_name,
            is_active=is_active,
            is_admin=is_admin,
            is_superuser=is_superuser,
        )
        if password:
            user.set_password(password)
            user.save()
        return user

    @staticmethod
    def make_org_admin(user, org):
        BaseTestCase.make_employment(user, org, 'Admins')

    @staticmethod
    def make_org_project_editor(user, org):
        BaseTestCase.make_employment(user, org, 'Project Editors')

    @staticmethod
    def make_org_me_manager(user, org):
        BaseTestCase.make_employment(user, org, 'M&E Managers')

    @staticmethod
    def make_org_user_manager(user, org):
        BaseTestCase.make_employment(user, org, 'User Managers')

    @staticmethod
    def make_employment(user, org, group_name):
        group = Group.objects.get(name=group_name)
        Employment.objects.create(user=user, organisation=org, group=group, is_approved=True)
