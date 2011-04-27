# -*- coding: utf-8 -*-
#!/usr/bin/env python

# utility functions for RSR

import inspect
import random
import logging
logger = logging.getLogger('akvo.rsr')

from workflows.models import State
from workflows.utils import get_state

from django.conf import settings
from django.contrib.sites.models import Site
from django.core.mail import send_mail, EmailMessage
from django.core.urlresolvers import reverse
from django.db.models import get_model
from django.template import loader, Context
from django.template.loader import render_to_string
from django.utils.translation import ugettext_lazy as _
from django.utils.translation import ugettext, get_language, activate

from BeautifulSoup import BeautifulSoup

from notification.models import (
    Notice, NoticeType, get_notification_language, should_send,
    LanguageStoreNotAvailable, get_formatted_messages
)


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
        instance_pk = str(instance.pk)
    else:
        # for new objects that have no id yet
        instance_pk = 'temp'
    return path_template % locals()


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
    #This won't work:
    #return sum(qs.values_list(col, flat=True))
    #when you have multiple rows with the exact same amount. They only get counted once
    #Workoaround:
    return sum([row[col] for row in qs.values()])

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
    site = Site.objects.get_current()
    site_url = 'http://%s/' % site
    base_project_url = reverse('project_main', kwargs=dict(project_id=invoice.project.id))
    project_url = 'http://%s%s' % (site, base_project_url)
    base_project_updates_url = reverse('project_updates', kwargs=dict(project_id=invoice.project.id))
    project_updates_url = 'http://%s%s' % (site, base_project_updates_url)
    t = loader.get_template('rsr/project/donate/donation_confirmation_email.html')
    c = Context(dict(invoice=invoice, site_url=site_url,
        project_url=project_url, project_updates_url=project_updates_url))
    message_body = t.render(c)
    subject_field, from_field = _(u'Thank you from Akvo.org!'), settings.DEFAULT_FROM_EMAIL
    bcc_field = [invoice.notification_email]
    if invoice.user:
        to_field = [invoice.user.email]
    else:
        to_field = [invoice.email]
    msg = EmailMessage(subject_field, message_body, from_field, to_field, bcc_field)
    msg.content_subtype = "html"
    msg.send()
    

def wordpress_get_lastest_posts(connection='wpdb', new_section_id=None, limit=2):
    from django.db import connections
    try:
        cursor = connections[connection].cursor()
        cursor.execute("SELECT option_value FROM options where option_id = 1")
        option_rows = cursor.fetchall()
        site_url = option_rows[0][0]
    except:
        site_url = 'http://akvo.org/blog'
    
    try:
        cursor.execute("""
            SELECT * FROM posts, term_relationships
                WHERE post_status != 'draft'
                    AND post_status != 'auto-draft'
                    AND post_type = 'post'
                    AND term_taxonomy_id = %d
                    and ID = object_id
                ORDER By post_date DESC LIMIT %d
            """ % (new_section_id, limit)
        )
        rows = cursor.fetchall()
        
        news_post = {'title': rows[0][5], 'url': '%s/?p=%s' % (site_url, rows[0][0],)}
    
        cursor.execute("""
            SELECT * FROM posts, users
                WHERE post_status != 'draft'
                    AND post_status != 'auto-draft'
                    AND post_type = 'post'
                    AND posts.post_author = users.ID
                ORDER By post_date DESC LIMIT %d
            """ % limit
        )
        rows = cursor.fetchall()
    except:
        return None, None

    posts = []
    for post in rows:
        post_content_soup = BeautifulSoup(post[4])

        # Find first image in post
        try:
            post_img = post_content_soup('img')[0]['src']
        except:
            post_img = ''

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
        
        posts.append({ 'title': post[5], 'image': post_img, 'text': p, 'date': post[2], 'url': '%s/?p=%s' % (site_url, post[0]), 'author': post[33]})

    return news_post, posts

def get_random_from_qs(qs, count):
    "used as replacement for qs.order_by('?')[:count] since that 'freezes' the result when using johnny-cache"
    qs_list = list(qs.values_list('pk', flat=True))
    random.shuffle(qs_list)
    return qs.filter(pk__in=qs_list[:count])

def who_am_i():
    "introspecting function returning the name of the function where who_am_i is called"
    return inspect.stack()[1][3]

def who_is_parent():
    """
    introspecting function returning the name of the caller of the function
    where who_is_parent is called
    """
    return inspect.stack()[2][3]


def send_now(users, label, extra_context=None, on_site=True, sender=None):
    """
    GvH: Modified version of notification.models.send_now
    
    Creates a new notice.

    This is intended to be how other apps create new notices.

    notification.send(user, 'friends_invite_sent', {
        'spam': 'eggs',
        'foo': 'bar',
    )
    
    You can pass in on_site=False to prevent the notice emitted from being
    displayed on the site.
    """
    logger.debug("Entering: %s()" % who_am_i())
    if extra_context is None:
        extra_context = {}
    
    notice_type = NoticeType.objects.get(label=label)

    protocol = getattr(settings, "DEFAULT_HTTP_PROTOCOL", "http")
    current_site = Site.objects.get_current()
    
    notices_url = u"%s://%s%s" % (
        protocol,
        unicode(current_site),
        reverse("notification_notices"),
    )

    current_language = get_language()

    formats = (
        'short.txt',
        'full.txt',
        'sms.txt',
        'notice.html',
        'full.html',
    ) # TODO make formats configurable

    for user in users:
        recipients = []
        # get user language for user from language store defined in
        # NOTIFICATION_LANGUAGE_MODULE setting
        try:
            language = get_notification_language(user)
        except LanguageStoreNotAvailable:
            language = None

        if language is not None:
            # activate the user's language
            activate(language)

        # update context with user specific translations
        context = Context({
            "recipient": user,
            "sender": sender,
            "notice": ugettext(notice_type.display),
            "notices_url": notices_url,
            "current_site": current_site,
        })
        context.update(extra_context)

        # get prerendered format messages
        messages = get_formatted_messages(formats, label, context)

        # Strip newlines from subject
        subject = ''.join(render_to_string('notification/email_subject.txt', {
            'message': messages['short.txt'],
        }, context).splitlines())

        body = render_to_string('notification/email_body.txt', {
            'message': messages['full.txt'],
        }, context)

        notice = Notice.objects.create(recipient=user, message=messages['notice.html'],
            notice_type=notice_type, on_site=on_site, sender=sender)
        if user.is_active:
            if should_send(user, notice_type, "email") and user.email: # Email
                recipients.append(user.email)
            logger.info("Sending email notification of type %s to %s" % (notice_type, recipients, ))
            # don't send anything in debug/develop mode
            if not getattr(settings, 'SMS_DEBUG', False):
                send_mail(subject, body, settings.DEFAULT_FROM_EMAIL, recipients)
            
            if should_send(user, notice_type, "sms") and user.get_profile().phone_number: # SMS
                # strip newlines
                sms = ''.join(render_to_string('notification/email_subject.txt', {
                    'message': messages['sms.txt'],
                }, context).splitlines())
                #extra_context['gw_number'] holds a GatewayNumber object
                logger.info("Sending SMS notification of type %s to %s, mobile phone number: %s." % (notice_type, user, extra_context['phone_number'], ))
                # don't send anything in debug/develop mode
                if not getattr(settings, 'SMS_DEBUG', False):
                    extra_context['gw_number'].send_sms(extra_context['phone_number'], sms)


    # reset environment to original language
    activate(current_language)
    logger.debug("Exiting: %s()" % who_am_i())


# workflow helpers

def state_equals(obj, state):
    if type(state) != type([]):
        state = [state] 
    return get_state(obj) in State.objects.filter(name__in=state)
