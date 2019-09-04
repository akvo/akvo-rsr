# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

"""A module to contain special data change signals for EUTF."""

from __future__ import print_function

import logging

from django.conf import settings

logger = logging.getLogger('akvo.rsr.eutf_signals')


def set_reporting_organisation(sender, **kwargs):
    """Set the reporting organisation to EUTF organisation."""

    from akvo.rsr.models import Partnership, RelatedProject

    if issubclass(sender, Partnership):
        partnership = kwargs['instance']
        project = partnership.project

    elif issubclass(sender, RelatedProject):
        relation = kwargs['instance']
        if relation.relation == RelatedProject.PROJECT_RELATION_PARENT:
            project = relation.project
        elif relation.relation == RelatedProject.PROJECT_RELATION_CHILD:
            project = relation.related_project
        else:
            return

    else:
        return

    if not project or not project.in_eutf_hierarchy():
        return

    set_eutf_as_reporting_organisation(project)


def set_eutf_as_reporting_organisation(project):

    from akvo.rsr.models import Organisation, Partnership

    eutf = Organisation.objects.get(pk=settings.EUTF_ORG_ID)

    partnership, created = Partnership.objects.get_or_create(
        project=project,
        iati_organisation_role=Partnership.IATI_REPORTING_ORGANISATION,
        defaults=dict(organisation=eutf)
    )
    if not created and partnership.organisation != eutf:
        old_reporting_organisation = partnership.organisation
        partnership.organisation = eutf
        partnership.save(update_fields=['organisation'])
        Partnership.objects.create(
            project=project,
            organisation=old_reporting_organisation,
            iati_organisation_role=Partnership.IATI_IMPLEMENTING_PARTNER,
        )
