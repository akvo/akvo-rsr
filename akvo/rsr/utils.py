from paypal.standard.models import PayPalIPN
from akvo.rsr.models import PayPalInvoice

from django.template import loader, Context
from django.core.mail import send_mail

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
