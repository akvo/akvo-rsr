# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.db import models


class TimestampsMixin(models.Model):
    """
    Mixin used to add created and modified timestamp fields
    """
    created_at = models.DateTimeField(null=True, auto_now_add=True, db_index=True, editable=False)
    last_modified_at = models.DateTimeField(null=True, auto_now=True, db_index=True, editable=False)

    class Meta:
        abstract = True