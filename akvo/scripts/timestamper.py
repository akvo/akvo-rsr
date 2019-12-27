# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import os
os.environ['DJANGO_SETTINGS_MODULE'] = 'akvo.settings'

from django.contrib.admin.models import LogEntry, ADDITION
from django.contrib.contenttypes.models import ContentType
from akvo.rsr.models import Organisation, Project


def find_log_entry(obj, action_flag):
    logs = LogEntry.objects.filter(
        content_type=ContentType.objects.get_for_model(obj), object_id=obj.pk, action_flag=action_flag
    ).order_by('-action_time')
    if logs:
        return logs[0]
    else:
        return False


def migrate_timestamps(model):
    """
    Look for entries in the django admin log and use them to set created_at on models inheriting from
    akvo.rsr.mixins.TimestampsMixin
    """
    objects = model.objects.all().order_by('id')
    for obj in objects:
        if obj.created_at is None:
            creation = find_log_entry(obj, ADDITION)
            if creation:
                obj.created_at = creation.action_time
                print("Set {}.create_at for ID {} to {} ".format(obj.__class__.__name__, obj.pk, obj.created_at))
            else:
                print("No creation time for {} ID {}".format(obj.__class__.__name__, obj.pk))
        else:
            print("{}.created_at for ID {} already set to {}".format(obj.__class__.__name__, obj.pk, obj.created_at))

        obj.save()


if __name__ == '__main__':
    migrate_timestamps(Organisation)
    migrate_timestamps(Project)
