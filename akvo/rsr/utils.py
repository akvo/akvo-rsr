# utility functions for RSR

from django.core.mail import send_mail
from django.template import loader, Context

from paypal.standard.models import PayPalIPN

RSR_LIMITED_CHANGE          = u'rsr_limited_change'
GROUP_RSR_PARTNER_ADMINS    = u'RSR partner admins'#can edit organisation info
GROUP_RSR_PARTNER_EDITORS   = u'RSR partner editors' #can edit an org's projects
GROUP_RSR_EDITORS           = u'RSR editors'
GROUP_RSR_USERS             = u'RSR users'

def groups_from_user(user):
    """
    Return a list with the groups the current user belongs to.
    """
    return [group.name for group in user.groups.all()]
        
#Modeled on Options method get_change_permission in django/db/models/options.py
def get_rsr_limited_change_permission(obj):
    return '%s_%s' % (RSR_LIMITED_CHANGE, obj.object_name.lower())


def rsr_image_path(instance, file_name, path_template='db/project/%s/%s'):
    """
    Use to set ImageField upload_to attribute.
    Create path for image storing. When a new object instance is created we save
    in MEDIA_ROOT/db/project/temp/img_name.ext first and then immediately call
    save on the ImageFieldFile when the object instance has been saved to the db,
    so the path changes to MEDIA_ROOT/db/project/org.pk/img_name.ext.
    Modify path by supplying a path_tempate string
    """
    if instance.pk:
        return path_template % (str(instance.pk), file_name)
    else:
        return path_template % ('temp', file_name)

def qs_column_sum(qs, col):
    "return sum of a queryset column"
    return sum(qs.values_list(col, flat=True))
