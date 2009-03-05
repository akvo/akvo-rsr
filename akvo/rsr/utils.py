# utility functions for RSR

RSR_LIMITED_CHANGE   = u'rsr_limited_change'
GROUP_RSR_PARTNER_ADMINS    = 'RSR partner admins'#can edit organisation info
GROUP_RSR_PARTNER_EDITORS   = 'RSR partner editors' #can edit an org's projects
GROUP_RSR_EDITORS           = 'RSR editors'
GROUP_RSR_USERS             = 'RSR users'


def groups_from_user(user):
    """
    Return a list with the groups the current user belongs to.
    """
    return [group.name for group in user.groups.all()]
        
#Modeled on Options method get_change_permission in django/db/models/options.py
def get_rsr_limited_change_permission(obj):
    return '%s_%s' % (RSR_LIMITED_CHANGE, obj.object_name.lower())
