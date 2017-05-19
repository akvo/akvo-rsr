# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from .models import Project


def set_project_status_complete(modeladmin, request, queryset):
    """ Admin action setting selected projects to STATUS_COMPLETE
    """
    queryset.update(status=Project.STATUS_COMPLETE)

set_project_status_complete.short_description = "Set status of selected projects to complete"
