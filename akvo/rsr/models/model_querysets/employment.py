# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.apps import apps
from django.contrib.auth import get_user_model
from django.db import models


class EmploymentQuerySet(models.QuerySet):
    def organisations(self):
        """Return an Organisation QuerySet containing orgs in the Employment QS.

        *NOTE*: Collaborator organisations are a special case, here! If there
         are any collaborator organisations, we return the original orgs.

        """
        Organisation = apps.get_model('rsr.organisation')
        organisations = Organisation.objects.filter(employees__in=self).distinct()

        original_ids = {
            org.id: org.original_id for org in organisations if org.is_collaborator_organisation
        }
        if original_ids:
            organisation_ids = {
                original_ids.get(org.id, org.id) for org in organisations
            }
            organisations = Organisation.objects.filter(id__in=organisation_ids).distinct()

        return organisations

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
