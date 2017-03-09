# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

# utility functions for RSR

import hashlib
import inspect
import pytz
import logging
import zipfile

from datetime import datetime
from os.path import splitext

from django.conf import settings
from django.contrib.auth.models import Group
from django.core.cache import cache
from django.core.mail import EmailMultiAlternatives, get_connection
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.db.models import get_model
from django.http import HttpResponse
from django.template import loader
from django.utils.text import slugify

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
    msg_context = msg_context or {}
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
                           subject='test/test_subject.txt',
                           message='test/test_message.txt',
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


def who_am_i():
    "introspecting function returning the name of the function where who_am_i is called"
    return inspect.stack()[1][3]


def who_is_parent():
    """
    introspecting function returning the name of the caller of the function
    where who_is_parent is called
    """
    return inspect.stack()[2][3]


# convert naive datetime to GMT format
def to_gmt(dt):
    gmt = pytz.timezone('GMT')
    return dt.replace(tzinfo=gmt).astimezone(gmt)


def custom_get_or_create_country(iso_code, country=None):
    """ add the missing fields to a skeleton country object from the admin
        or create a new one with the given iso_code if it doesn't already exist
    """
    # Importing Country at the module level doesn't work, because of circular imports
    from akvo.rsr.models import Country
    iso_code = iso_code.lower()
    if not country:
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
            del page_range[2:active - 2]
        if (page_range[-1] - active) > 3:
            page_range[-2] = '...'
            active_index = page_range.index(active)
            del page_range[active_index + 2:-2]

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
    if not value:
        return ''

    ### DEBUG ###
    import pdb
    pdb.set_trace()
    ### DEBUG ###

    key = u'{}-{}-{}'.format(version, model.__name__, value,)
    # Memcached keys can't have whitespace and has a max length of 250
    # https://github.com/memcached/memcached/blob/master/doc/protocol.txt#L41
    key = slugify(key).encode('utf-8')[:250]
    result = cache.get(key)
    if result is not None:
        return result

    try:
        objects = getattr(model, 'objects')
        result = objects.get(code=value, version__code=version)

    except model.DoesNotExist:
        result = value

    else:
        # Update the cache only if the required data is in the DB!
        cache.set(key, result)

    finally:
        return result


def codelist_name(model, instance, field, version=settings.IATI_VERSION):
    """
    Looks up the name of a codelist, returns the field value if the lookup fails
    :param model: Model from codelists app
    :param instance: Instance from model
    :param field: String of the lookup field (e.g. 'type')
    :param version: String of version (optional)
    :return: String of the codelist instance
    """

    value = codelist_value(model, instance, field, version)
    return value.name if hasattr(value, 'name') else value


def check_auth_groups(group_names):
    for group_name in group_names:
        Group.objects.get_or_create(name=group_name)


def file_from_zip_archive(zip, file_name):  # pragma: no cover
    """
    Return a file from a zip archive
    :param zip: zip file or file name
    :param file_name: name of the file to retrieve from the archive
    :return: the file or None
    """
    zip = zipfile.ZipFile(zip, 'r')  # TODO: in test
    try:
        return zip.open(file_name)
    except KeyError:
        return None


def get_sha1_hash(s):
    """ return the sha1 hash of the string you call with"""
    hash = hashlib.sha1()
    hash.update(s)
    return hash.hexdigest()
