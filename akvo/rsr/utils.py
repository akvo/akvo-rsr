# -*- coding: utf-8 -*-
#!/usr/bin/env python

# utility functions for RSR


from django.conf import settings
from django.contrib.sites.models import Site
from django.core.mail import send_mail, EmailMessage
from django.db.models import get_model
from django.template import loader, Context
from django.utils.translation import ugettext_lazy as _

from BeautifulSoup import BeautifulSoup


RSR_LIMITED_CHANGE          = u'rsr_limited_change'
GROUP_RSR_PARTNER_ADMINS    = u'RSR partner admins'#can edit organisation info
GROUP_RSR_PARTNER_EDITORS   = u'RSR partner editors' #can edit an org's projects
GROUP_RSR_EDITORS           = u'RSR editors'
GROUP_RSR_USERS             = u'RSR users'

PAYPAL_INVOICE_STATUS_PENDING   = 1
PAYPAL_INVOICE_STATUS_VOID      = 2
PAYPAL_INVOICE_STATUS_COMPLETE  = 3
PAYPAL_INVOICE_STATUS_STALE     = 4


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


def rsr_send_mail(to_list, subject='templates/email/test_subject.txt',
                  message='templates/email/test_message.txt', subject_context={}, msg_context={}):
    """
    Send template driven email.
        to_list is a list of email addresses
        subject and message are templates for use as email subject and message body
        subject_context and msg_context are dicts used when renedering the respective templates
    Site.objects.get_current() is added to both contexts as current_site
    """
    current_site = Site.objects.get_current()
    subject_context.update({'site': current_site})
    subject = loader.render_to_string(subject, subject_context)
    # Email subject *must not* contain newlines
    subject = ''.join(subject.splitlines())
    msg_context.update({'site': current_site})
    message = loader.render_to_string(message, msg_context)    
    send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, to_list)


def rsr_send_mail_to_users(users, subject='templates/email/test_subject.txt',
                  message='templates/email/test_message.txt', subject_context={}, msg_context={}):
    """
    Send mail to many users supllied through a queryset
    """
    to_list = [user.email for user in users if user.email]
    rsr_send_mail(to_list, subject, message, subject_context, msg_context)


def qs_column_sum(qs, col):
    "return sum of a queryset column"
    return sum(qs.values_list(col, flat=True))


def model_and_instance_based_filename(object_name, pk, field_name, img_name):
    """ Create a file name for an image based on the model name, the current object's pk,
    the field name of the model and the current date and time"""
    return "%s_%s_%s_%s%s" % (
        object_name,
        pk or '',
        field_name,
        datetime.now().strftime("%Y-%m-%d_%H.%M.%S"),
        splitext(img_name)[1],
    )


def send_donation_confirmation_emails(invoice_id):
    invoice = get_model('rsr', 'invoice').objects.get(pk=invoice_id)
    t = loader.get_template('rsr/donation_confirmation_email.html')
    c = Context({'invoice': invoice, 'domain_name': settings.DOMAIN_NAME})
    message_body = t.render(c)
    subject_field, from_field = _(u'Thank you from Akvo.org!'), settings.DEFAULT_FROM_EMAIL
    bcc_field = invoice.notification_email
    if invoice.user:
        to_field = invoice.user.email
    else:
        to_field = invoice.email
    msg = EmailMessage(subject_field, message_body, from_field, [to_field], [bcc_field])
    msg.content_subtype = "html"
    msg.send()
    

def wordpress_get_lastest_posts(connection, limit):
    from django.db import connections
    cursor = connections[connection].cursor()
    try:
        cursor.execute("SELECT * FROM wp_posts where post_status != 'draft' and post_status != 'auto-draft'and post_type = 'post' ORDER By post_date DESC LIMIT %d" % limit)
        rows = cursor.fetchall()
    except:
        return None

    posts = []
    for post in rows:
        post_content_soup = BeautifulSoup(post[4])

        # Find first image in post
        try:
            post_img = post_content_soup('img')[0]['src']
        except:
            post_img = 'No image'

        # Find first paragraph in post
        try:
            post_p = post_content_soup('p')[0].contents
        except:
            # If no paragraph then use the raw content
            post_p = post_content_soup

        # Create one string
        p = ''
        for text in post_p:
            p = '%s%s' % (p, text)
        
        posts.append({ 'title': post[5], 'image': post_img, 'text': p, 'date': post[2], 'url': post[18], })

    return posts
