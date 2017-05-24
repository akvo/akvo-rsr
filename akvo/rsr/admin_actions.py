# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


def set_project_status_complete(modeladmin, request, queryset):
    """ Admin action setting selected projects iati_status to u'3', i.e. 'Completion' in
    codelists_v202.ACTIVITY_STATUS and status to Project.STATUS_COMPLETE
    """
    for project in queryset:
        project.iati_status = u'3'
        # Project.status is set in Project.save() when iati_status is changed
        project.save()

set_project_status_complete.short_description = "Set status of selected projects to Completion"
