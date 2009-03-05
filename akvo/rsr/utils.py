# utility functions for RSR
from django.core.mail import send_mail
from django.template import loader, Context

from paypal.standard.models import PayPalIPN

from akvo.rsr.models import PayPalInvoice

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

def send_paypal_confirmation_email(id):
    ppi = PayPalInvoice.objects.get(pk=id)
    t = loader.get_template('rsr/paypal_confirmation_email.html')
    c = Context({
        'anon_name': ppi.name,
        'anon_email': ppi.email,
        'u': ppi.user,
        'project': ppi.project,
        'amount': ppi.amount,
        'invoice': ppi.id,
        'timestamp': ppi.time,
    })
    if ppi.user is not None:
        send_mail('Thank you from Akvo.org!', t.render(c), 'noreply@akvo.org', [ppi.user.email], fail_silently=False)
    else:
        send_mail('Thank you from Akvo.org!', t.render(c), 'noreply@akvo.org', [ppi.email], fail_silently=False)