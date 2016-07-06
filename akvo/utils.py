# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

# utility functions for RSR

import hashlib
import inspect
import pytz
import random
import logging
import zipfile

from BeautifulSoup import BeautifulSoup
from datetime import datetime
from os.path import splitext
from urlparse import urljoin
from workflows.models import State
from workflows.utils import get_state

from django.conf import settings
from django.contrib.auth.models import Group
from django.core.mail import send_mail, EmailMessage, get_connection, EmailMultiAlternatives
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.core.urlresolvers import reverse
from django.db.models import get_model
from django.http import HttpResponse
from django.template import loader, Context
from django.template.loader import render_to_string
from django.utils.translation import ugettext_lazy as _
from django.utils.translation import ugettext, get_language, activate

from notification.models import (Notice, NoticeType, get_notification_language, should_send,
                                 LanguageStoreNotAvailable, get_formatted_messages)

from akvo.rsr.iso3166 import COUNTRY_CONTINENTS, ISO_3166_COUNTRIES, CONTINENTS

logger = logging.getLogger('akvo.rsr')

RSR_LIMITED_CHANGE = u'rsr_limited_change'


class HttpResponseNoContent(HttpResponse):
    status_code = 204


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


def send_mail_with_attachments(subject, message, from_email, recipient_list,
              fail_silently=False, auth_user=None, auth_password=None,
              connection=None, html_message=None, attachments=None):
    """
    Extension of django.core.main.send_mail to allow the inclusion of attachments

    Easy wrapper for sending a single message to a recipient list. All members
    of the recipient list will see the other recipients in the 'To' field.

    If auth_user is None, the EMAIL_HOST_USER setting is used.
    If auth_password is None, the EMAIL_HOST_PASSWORD setting is used.

    Note: The API for this method is frozen. New code wanting to extend the
    functionality should use the EmailMessage class directly.

    attachments must be a list of dicts of the form
        {'filename': <file name>, 'content': <attachment data>, 'mimetype': mime type}
    """
    connection = connection or get_connection(username=auth_user,
                                              password=auth_password,
                                              fail_silently=fail_silently)
    mail = EmailMultiAlternatives(subject, message, from_email, recipient_list,
                                  connection=connection)
    if html_message:
        mail.attach_alternative(html_message, 'text/html')

    if attachments:
        for attachment in attachments:
            mail.attach(**attachment)

    return mail.send()


def rsr_send_mail(to_list, subject='templates/email/test_subject.txt',
                  message='templates/email/test_message.txt',
                  subject_context=None,
                  msg_context=None,
                  html_message=None,
                  attachments=None):
    """
    Send template driven email.
        to_list is a list of email addresses
        subject and message are templates for use as email subject and message body
        subject_context and msg_context are dicts used when renedering the respective templates
        html_message is the HTML template for use as message body
    settings.RSR_DOMAIN is added to both contexts as current_site, defaulting to 'akvo.org'
    if undefined
    """
    subject_context = subject_context or {}
    msg_context = msg_context  or {}
    current_site = getattr(settings, 'RSR_DOMAIN', 'rsr.akvo.org')

    subject_context.update({'site': current_site})
    subject = loader.render_to_string(subject, subject_context)
    # Email subject *must not* contain newlines
    subject = ''.join(subject.splitlines())

    msg_context.update({'site': current_site})
    message = loader.render_to_string(message, msg_context)

    if html_message:
        html_message = loader.render_to_string(html_message, msg_context)
    send_mail_with_attachments(
        subject, message, getattr(settings, "DEFAULT_FROM_EMAIL", "noreply@akvo.org"), to_list,
        html_message=html_message, attachments=attachments
    )


def rsr_send_mail_to_users(users,
                           subject='templates/email/test_subject.txt',
                           message='templates/email/test_message.txt',
                           subject_context=None,
                           msg_context=None):
    """
    Send mail to many users supplied through a queryset
    """
    if not subject_context:
        subject_context = {}
    if not msg_context:
        msg_context = {}
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
    if getattr(settings, "DONATION_NOTIFICATION_EMAILS", True):
        invoice = get_model("rsr", "invoice").objects.get(pk=invoice_id)
        site_url = 'http://%s' % getattr(settings, "RSR_DOMAIN", "rsr.akvo.org")
        base_project_url = reverse("project-main", kwargs=dict(project_id=invoice.project.id))
        project_url = urljoin(site_url, base_project_url)
        base_project_updates_url = reverse("project-updates", kwargs=dict(project_id=invoice.project.id))
        project_updates_url = urljoin(site_url, base_project_updates_url)
        template = loader.get_template("donate/donation_confirmation_email.html")
        context = Context(dict(invoice=invoice,
                               site_url=site_url,
                               project_url=project_url,
                               project_updates_url=project_updates_url))
        message_body = template.render(context)
        subject_field = _("Thank you from Akvo.org!")
        from_field = getattr(settings, "DEFAULT_FROM_EMAIL", "noreply@akvo.org")
        bcc_field = [invoice.notification_email]
        to_field = [invoice.get_email]
        msg = EmailMessage(subject_field, message_body, from_field, to_field, bcc_field)
        msg.content_subtype = "html"
        msg.send(fail_silently=True)


def wordpress_get_lastest_posts(connection='wpdb', category_id=None, limit=2):
    """get a number of blog posts from wordpress
    category_id is the numerical ID of the category to filter on
    limit is the number of posts
    """
    from django.db import connections
    try:
        cursor = connections[connection].cursor()
        cursor.execute("SELECT option_value FROM options where option_id = 1")
        option_rows = cursor.fetchall()
        site_url = option_rows[0][0]
    except:
        site_url = 'http://akvo.org/blog'

    try:
        if category_id:
            cursor.execute("""
                SELECT posts.ID, post_title, post_content, post_date, display_name  FROM posts, users, term_relationships
                    WHERE post_status = 'publish'
                        AND post_type = 'post'
                        AND term_taxonomy_id = %d
                        and posts.ID = object_id
                        AND posts.post_author = users.ID
                    ORDER By post_date DESC LIMIT %d
                """ % (category_id, limit)
            )
        else:
            cursor.execute("""
                SELECT posts.ID, post_title, post_content, post_date, display_name  FROM posts, users
                    WHERE post_status = 'publish'
                        AND post_status != 'auto-draft'
                        AND post_type = 'post'
                        AND posts.post_author = users.ID
                    ORDER By post_date DESC LIMIT %d
                """ % limit
            )
        rows = cursor.fetchall()

    except:
        return None

    posts = []
    for post in rows:
        post_content_soup = BeautifulSoup(post[2])

        # Find first image in post
        try:
            post_img = post_content_soup('img')[0]['src']
        except:
            post_img = ''

        # Find first paragraph in post
        try:
            post_p = post_content_soup('p')[0].contents
        except: # no p-tags
            post_p = ''.join(post_content_soup.findAll(text=True))

        posts.append({ 'title': post[1], 'image': post_img, 'text': post_p, 'date': post[3], 'url': '%s/?p=%s' % (site_url, post[0]), 'author': post[4]})

    return posts


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
    current_site = getattr(settings, 'RSR_DOMAIN', 'rsr.akvo.org')

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
                send_mail(
                    subject,
                    body,
                    getattr(settings, "DEFAULT_FROM_EMAIL", "noreply@akvo.org"),
                    recipients
                )
            if should_send(user, notice_type, "sms") and user.phone_number: # SMS
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


# convert naive datetime to GMT format
def to_gmt(dt):
    gmt = pytz.timezone('GMT')
    return dt.replace(tzinfo=gmt).astimezone(gmt)


def custom_get_or_create_country(iso_code, country=None):
    """ add the missing fields to a skeleton country object from the admin
        or create a new one with the given iso_code if it doesn't already exist
    """
    # for some reason, maybe some circular import issue importing Country at the module level doesn't work
    from akvo.rsr.models import Country
    iso_code = iso_code.lower()
    if  not country:
        try:
            country = Country.objects.get(iso_code=iso_code)
            return country
        except:
            country = Country()
            country.iso_code = iso_code
    continent_code = COUNTRY_CONTINENTS[iso_code]
    country.name = dict(ISO_3166_COUNTRIES)[iso_code]
    country.continent = dict(CONTINENTS)[continent_code]
    country.continent_code = continent_code
    country.save()
    return country


def right_now_in_akvo():
    """
    Calculate the numbers used in the "Right now in Akvo" box on the home page.
    """
    projects = get_model('rsr', 'Project').objects.published()
    organisations = get_model('rsr', 'Organisation').objects.all()
    updates = get_model('rsr', 'ProjectUpdate').objects.all()
    people_served = projects.get_largest_value_sum(
        getattr(settings, 'AFFECTED_BENCHMARKNAME', 'people affected')
    )

    return {
        'number_of_organisations': organisations.count(),
        'number_of_projects': projects.count(),
        'people_served': int(people_served / 1000) * 1000,
        'projects_budget_millions': round(projects.budget_sum() / 100000) / 10.0,
        'number_of_project_updates': updates.count(),
    }


def rsr_show_keywords(instance):
    if len(instance.keywords.all()) > 0:
        keyword_str = '<ul>'
        for key in instance.keywords.all():
            keyword_str += '<li>%s</li>' % key.label
        keyword_str += '</ul>'
        return keyword_str
    else:
        return 'None'


def pagination(page, object_list, objects_per_page):
    paginator = Paginator(object_list, objects_per_page)

    try:
        page = paginator.page(page)
    except PageNotAnInteger:
        # If page is not an integer, deliver first page.
        page = paginator.page(1)
    except EmptyPage:
        # If page is out of range (e.g. 9999), deliver last page of results.
        page = paginator.page(paginator.num_pages)

    page_range = paginator.page_range
    active = page.number

    if not len(page_range) < 10:
        if active > 4:
            page_range[1] = '...'
            del page_range[2:active-2]
        if (page_range[-1] - active) > 3:
            page_range[-2] = '...'
            active_index = page_range.index(active)
            del page_range[active_index+2:-2]

    return page, paginator, page_range


def filter_query_string(qs):
    """
    Takes a QueryDict and returns a string that can be prepended to paginated
    links. Since pagination is handled outside of this function we pop the page
    item.
    """
    q = dict(qs.iterlists())  # to Python dict
    q.pop('page', None)

    if not bool(q):
        return ''

    return u'&{}'.format(
        u'&'.join([u'{}={}'.format(k, u''.join(v)) for (k, v) in q.items()])).encode('utf-8')


def codelist_choices(codelist, show_code=True):
    """
    Based on a model from the codelists app, returns a list of tuples with the available choices.

    :param codelist: Codelist from codelists store
    :param show_code: Show the code (e.g. '1 - ..') in front of the name, True by default
    :return: List of tuples with available choices, tuples in the form of (code, name)
    """
    name_index = 0
    for index, header in enumerate(codelist[0]):
        if header == 'name':
            name_index = index
            break

    if name_index > 0 and show_code:
        return [(cl[0], '%s - %s' % (cl[0], cl[name_index])) for cl in codelist[1:]]
    else:
        return [(cl[0], cl[name_index]) for cl in codelist[1:]]


def codelist_value(model, instance, field, version=settings.IATI_VERSION):
    """
    Looks up the value of a codelist
    :param model: Model from codelists app
    :param instance: Instance from model
    :param field: String of the lookup field (e.g. 'type')
    :param version: String of version (optional)
    :return: String of the codelist instance
    """
    value = getattr(instance, field, None)
    if value:
        try:
            objects = getattr(model, 'objects')
            return objects.get(code=value, version__code=version)
        except model.DoesNotExist:
            return value
    return ''


def codelist_name(model, instance, field, version=settings.IATI_VERSION):
    """
    Looks up the name of a codelist
    :param model: Model from codelists app
    :param instance: Instance from model
    :param field: String of the lookup field (e.g. 'type')
    :param version: String of version (optional)
    :return: String of the codelist instance
    """
    value = getattr(instance, field, None)
    if value:
        try:
            objects = getattr(model, 'objects')
            return objects.get(code=value, version__code=version).name
        except model.DoesNotExist:
            return value
    return ''


def check_auth_groups(group_names):
    for group_name in group_names:
        Group.objects.get_or_create(name=group_name)


def file_from_zip_archive(zip, file_name):
    """
    Return a file from a zip archive
    :param zip: zip file or file name
    :param file_name: name of the file to retrieve from the archive
    :return: the file or None
    """
    zip = zipfile.ZipFile(zip, 'r')
    try:
        return zip.open(file_name)
    except KeyError:
        return None


def get_sha1_hash(s):
    """ return the sha1 hash of the string you call with"""
    hash = hashlib.sha1()
    hash.update(s)
    return hash.hexdigest()
