# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import logging
logger = logging.getLogger('akvo.rsr')

import os
from datetime import datetime

from django.contrib.admin.models import ADDITION, CHANGE
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import ObjectDoesNotExist
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.db import transaction
from django.db.models import get_model
from django.db.models.signals import post_save

from sorl.thumbnail import ImageField

from akvo.utils import send_donation_confirmation_emails, rsr_send_mail, rsr_send_mail_to_users
from akvo.iati.exports.iati_export import IatiXML
from akvo.iati.imports.iati_import import IatiImportProcess
from akvo.iati.imports.utils import add_log


def create_publishing_status(sender, **kwargs):
    """
    called when a new project is saved so an associated published record for the
    project is created
    """
    # kwargs['raw'] is True when we're running manage.py loaddata
    from .models import PublishingStatus

    if kwargs.get('created', False) and not kwargs.get('raw', False):
        new_project = kwargs['instance']
        ps = get_model('rsr', 'publishingstatus')(status=PublishingStatus.STATUS_UNPUBLISHED)
        ps.project = new_project
        ps.save()


def create_organisation_account(sender, **kwargs):
    """
    called when a new organisation is saved so an associated org account is
    created with the "free" level of access to widgets
    """
    # kwargs['raw'] is True when we're running manage.py loaddata
    if kwargs.get('created', False) and not kwargs.get('raw', False):
        new_org = kwargs['instance']
        OrganisationAccount = get_model('rsr', 'OrganisationAccount')
        try:
            #this should never work
            acc = OrganisationAccount.objects.get(organisation=new_org)
        except:
            #and when it doesn't we do this
            new_acc = OrganisationAccount(organisation=new_org, account_level=OrganisationAccount.ACCOUNT_FREE)
            new_acc.save()


def change_name_of_file_on_create(sender, **kwargs):
    """
    call to create a filename when creating a new model instance with the pattern
    ModelName_instance.pk_FieldName_YYYY-MM-DD_HH.MM.SS.ext
    Since we cannot do this until the instance of the model has been saved
    we do it as a post_save signal callback
    """
    # kwargs['raw'] is True when we're running manage.py loaddata
    if kwargs.get('created', False) and not kwargs.get('raw', False):
        instance = kwargs['instance']
        opts = instance._meta
        for f in opts.fields:
            # extend this list of fields if needed to catch other uploads
            if isinstance(f, (ImageField, )):
                # the actual image sits directly on the instance of the model
                img = getattr(instance, f.name)
                if img:
                    img_name = "%s_%s_%s_%s%s" % (
                        opts.object_name,
                        instance.pk or '',
                        f.name,
                        datetime.now().strftime("%Y-%m-%d_%H.%M.%S"),
                        os.path.splitext(img.name)[1],
                    )
                    img.save(img_name, img)


def change_name_of_file_on_change(sender, **kwargs):
    """
    call to create a filename when saving the changes of a model with the pattern
    ModelName_instance.pk_FieldName_YYYY-MM-DD_HH.MM.SS.ext
    this is done before saving the model
    """
    if not kwargs.get('created', False):
        instance = kwargs['instance']
        opts = instance._meta
        for f in opts.fields:
            # extend this list of fields if needed to catch other uploads
            if isinstance(f, (ImageField, )):
                img = getattr(instance, f.name)
                #if a new image is uploaded it resides in a InMemoryUploadedFile
                if img:
                    try:
                        if isinstance(img.file, InMemoryUploadedFile):
                            img.name = "%s_%s_%s_%s%s" % (
                                opts.object_name,
                                instance.pk or '',
                                f.name,
                                datetime.now().strftime("%Y-%m-%d_%H.%M.%S"),
                                os.path.splitext(img.name)[1],
                            )
                    except:
                        pass


def create_payment_gateway_selector(instance, created, **kwargs):
    """Associates a newly created project with the default PayPal
    and Mollie payment gateways
    """
    # kwargs['raw'] is True when we're running manage.py loaddata
    if created and not kwargs.get('raw', False):
        project = instance
        gateway_selector = get_model('rsr', 'paymentgatewayselector').objects
        gateway_selector.create(project=project)


def donation_completed(instance, created, **kwargs):
    invoice = instance
    if not created and invoice.status == 3:
        send_donation_confirmation_emails(invoice.id)


def set_showcase_project(instance, created, **kwargs):
    Project = get_model('rsr', 'Project')
    if instance.showcase:
        Project.objects.exclude(pk=instance.pk).update(showcase=False)


def set_focus_org(instance, created, **kwargs):
    Organisation = get_model('rsr', 'Organisation')
    if instance.focus_org:
        Organisation.objects.exclude(pk=instance.pk).update(focus_org=False)


def create_benchmark_objects(project):
    """
    create the relevant Benchmark objects for this project based on the Categories of the project
    """
    from .models import Benchmark

    for category in project.categories.all():
        for benchmarkname in category.benchmarknames.all():
            benchmark, created = Benchmark.objects.get_or_create(project=project, category=category, name=benchmarkname, defaults={'value': 0})


def act_on_log_entry(sender, **kwargs):
    """
    catch the LogEntry post_save to grab newly added Project instances and create
    Benchmark objects for it
    we do this at this time to be able to work with a fully populated Project
    instance
    """
    CRITERIA = [
        {'app': 'rsr', 'model': 'project', 'action': ADDITION, 'call': create_benchmark_objects},
        {'app': 'rsr', 'model': 'project', 'action': CHANGE,   'call': create_benchmark_objects},
    ]
    if kwargs.get('created', False) and not kwargs.get('raw', False):
        log_entry = kwargs['instance']
        content_type = ContentType.objects.get(pk=log_entry.content_type_id)
        for criterion in CRITERIA:
            if (
                content_type.app_label == criterion['app']
                and content_type.model == criterion['model']
                and log_entry.action_flag == criterion['action']
            ):
                #user = User.objects.get(pk=log_entry.user_id)
                object = content_type.get_object_for_this_type(pk=log_entry.object_id)
                criterion['call'](object)


def employment_pre_save(sender, **kwargs):
    """
    Send a mail to the user when his/her account has been approved.
    """
    employment = kwargs.get("instance", False)
    try:
        obj = sender.objects.get(pk=employment.pk)
    except sender.DoesNotExist:
        # Object is new
        pass
    else:
        if not obj.is_approved and employment.is_approved:
            # Employment is approved, send mail
            rsr_send_mail(
                [employment.user.email],
                subject='registration/approved_email_subject.txt',
                message='registration/approved_email_message.txt',
                subject_context={
                    'organisation': employment.organisation,
                },
                msg_context={
                    'user': employment.user,
                    'organisation': employment.organisation,
                }
            )

def employment_post_save(sender, **kwargs):
    """
    If a new employment is created:
    - Set 'Users' Group for this employment if no group has been set
    - Inform RSR support users, organisation admins and organisation user managers

    If an existing employment is saved:
    - Set User to is_staff (for admin access) when the employment is approved and the Group is set to 'Project Editors',
    'User managers' or 'Admins', or when the user is a superuser or general admin.
    """
    users_group = Group.objects.get(name='Users')
    project_editors_group = Group.objects.get(name='Project Editors')
    user_managers_group = Group.objects.get(name='User Managers')
    admins_group = Group.objects.get(name='Admins')
    employment = kwargs.get("instance", None)
    if employment:
        user = employment.user
        if kwargs['created']:
            if not employment.group:
                employment.group = users_group
                employment.save()
            organisation = employment.organisation
            users = get_user_model().objects.all()
            notify = (
                users.filter(is_admin=True, is_support=True) |
                users.filter(
                    employers__organisation=organisation,
                    employers__group__in=[user_managers_group, admins_group],
                    is_support=True
                )
            ).distinct()
            rsr_send_mail_to_users(
                notify,
                subject='registration/user_organisation_request_subject.txt',
                message='registration/user_organisation_request_message.txt',
                subject_context={
                    'user': user,
                    'organisation': organisation
                },
                msg_context={
                    'user': user,
                    'organisation': organisation
                },
            )
        else:
            if (employment.group in [project_editors_group, user_managers_group, admins_group] and
                    employment.is_approved) or user.is_superuser or user.is_admin:
                user.is_staff = True
                user.save()


def update_project_budget(sender, **kwargs):
    """
    called when BudgetItem objects are added/changed/deleted
    """
    # kwargs['raw'] is True when we're running manage.py loaddata
    if not kwargs.get('raw', False):
        try:
            kwargs['instance'].project.update_budget()
            kwargs['instance'].project.update_funds()
            kwargs['instance'].project.update_funds_needed()
        except ObjectDoesNotExist:
            # this happens when a project is deleted, and thus any invoices linked to it go the same way.
            pass


def update_project_funding(sender, **kwargs):
    """
    called when Invoice or Partnership objects are added/changed/deleted
    """
    # kwargs['raw'] is True when we're running manage.py loaddata
    if not kwargs.get('raw', False):
        try:
            kwargs['instance'].project.update_funds()
            kwargs['instance'].project.update_funds_needed()
        except ObjectDoesNotExist:
            # this happens when a project is deleted, and thus any invoices linked to it go the same way.
            pass


def create_iati_file(sender, **kwargs):
    """
    Create an IATI XML file when an entry in the iati_export table is saved, with projects.

    :param sender: IatiExport model
    """
    iati_export = kwargs.get("instance", None)
    projects = iati_export.projects.all()
    if iati_export and projects:
        post_save.disconnect(create_iati_file, sender=sender)
        try:
            iati_export.status = 2
            iati_export.save()
            iati_xml = IatiXML(projects)
            iati_file = iati_xml.save_file(str(iati_export.reporting_organisation.pk),
                                           datetime.utcnow().strftime("%Y%m%d-%H%M%S") + '.xml')
            iati_export.iati_file = iati_file
            iati_export.status = 3
            iati_export.save()
        except:
            iati_export.status = 4
            iati_export.save()
        post_save.connect(create_iati_file, sender=sender)


def import_iati_file(sender, **kwargs):
    """
    Import an IATI XML file when an entry in the iati_import table is saved.

    :param sender: IatiImport model
    """
    iati_import = kwargs.get("instance", None)

    if iati_import and iati_import.status == 1:
        post_save.disconnect(import_iati_file, sender=sender)
        try:
            with transaction.atomic():
                IatiImportProcess(iati_import)
        except Exception as e:
            add_log(iati_import, 'general', str(e), None, 1)
        post_save.connect(import_iati_file, sender=sender)
