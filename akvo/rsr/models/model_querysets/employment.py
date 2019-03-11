# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.apps import apps
from django.contrib.auth import get_user_model
from django.db import models


class EmploymentQuerySet(models.QuerySet):
    def organisations(self):
        """
        Return an Organisation QuerySet containing the organisations of the Employment QuerySet
        """
        Organisation = apps.get_model('rsr.organisation')
        return Organisation.objects.filter(employees__in=self).distinct()

    def users(self):
        """
        Return a User QuerySet containing the users of the Employment QuerySet
        """
        return get_user_model().objects.filter(employers__in=self).distinct()

    def approved(self):
        """
        Return an Employment QuerySet containing the approved Employments
        """
        return self.filter(is_approved=True)
