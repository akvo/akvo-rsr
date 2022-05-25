from django.db import models
from django.utils.translation import ugettext_lazy as _

from akvo.rsr.fields import ValidXMLCharField
from akvo.rsr.mixins import TimestampsMixin
from akvo.rsr.models import Project


class ExternalProject(TimestampsMixin):
    related_project = models.ForeignKey(
        Project,
        models.CASCADE,
        related_name="third_party_projects"
    )
    iati_id = ValidXMLCharField(
        _('IATI identifier'), max_length=100, blank=True, db_index=True, null=True, unique=True,
        help_text=_('This is a globally unique identifier for this activity. It is a requirement '
                    'to be compliant with the IATI standard. This code consists of: '
                    '[country code]-[Chamber of Commerce number]-[organisation’s internal project '
                    'code]. For Dutch organisations this is e.g. NL-KVK-31156201-TZ1234. For more '
                    'information see') + ' <a href="http://iatistandard.org/202/activity-standard/'
        'iati-activities/iati-activity/iati-identifier/'
        '#definition" target="_blank">http://iatistandard.org/'
        '201/activity-standard/iati-activities/iati-activity/'
        'iati-identifier/#definition</a>'
    )
    cofunded = models.BooleanField(default=False)
