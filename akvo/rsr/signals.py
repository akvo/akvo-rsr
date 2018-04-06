# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import logging
import os
from datetime import datetime

from django.contrib.admin.models import ADDITION, CHANGE
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import ObjectDoesNotExist
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.db.models import get_model, Q

from sorl.thumbnail import ImageField

from akvo.utils import rsr_send_mail, rsr_send_mail_to_users

logger = logging.getLogger('akvo.rsr')


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
            # this should never work
            OrganisationAccount.objects.get(organisation=new_org)
        except:
            # and when it doesn't we do this
            new_acc = OrganisationAccount(organisation=new_org,
                                          account_level=OrganisationAccount.ACCOUNT_FREE)
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
                # if a new image is uploaded it resides in a InMemoryUploadedFile
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
    # Benchmarks are not used anymore

    # from .models import Benchmark
    #
    # for category in project.categories.all():
    #     for benchmarkname in category.benchmarknames.all():
    #         benchmark, created = Benchmark.objects.get_or_create(project=project,
    # category=category, name=benchmarkname, defaults={'value': 0})


def act_on_log_entry(sender, **kwargs):
    """
    catch the LogEntry post_save to grab newly added Project instances and create
    Benchmark objects for it
    we do this at this time to be able to work with a fully populated Project
    instance
    """
    CRITERIA = [
        {'app': 'rsr', 'model': 'project', 'action': ADDITION, 'call': create_benchmark_objects},
        {'app': 'rsr', 'model': 'project', 'action': CHANGE, 'call': create_benchmark_objects},
    ]
    if kwargs.get('created', False) and not kwargs.get('raw', False):
        log_entry = kwargs['instance']
        content_type = ContentType.objects.get(pk=log_entry.content_type_id)
        for criterion in CRITERIA:
            if (
                content_type.app_label == criterion['app'] and
                content_type.model == criterion['model'] and
                log_entry.action_flag == criterion['action']
            ):
                object = content_type.get_object_for_this_type(pk=log_entry.object_id)
                criterion['call'](object)


def employment_pre_save(sender, **kwargs):
    """
    This signal intends to send a mail to the user when his/her account has been approved.

    This signal also sets 'Users' Group for the employment if no group has been set

    A mail will be sent when:

    - A new employment is created with is_approved = True.
      * We assume this happens when an existing user is invited for a new organisation.
    - An existing employment is updated from is_approved = False changed to True.
      * We assume this happens when an existing user has requested to join an organisation himself.
    """
    # FIXME: The actual save may fail. Why are emails being sent pre_save?!
    employment = kwargs.get("instance", None)

    # Set the group to 'Users' when no group has been specified
    if not employment.group:
        employment.group = Group.objects.get(name='Users')

    try:
        obj = sender.objects.get(pk=employment.pk)
    except sender.DoesNotExist:
        # Employment is new, send mail when it is also approved
        if employment.is_approved:
            rsr_send_mail(
                [employment.user.email],
                subject='registration/approved_added_email_subject.txt',
                message='registration/approved_added_email_message.txt',
                subject_context={
                    'organisation': employment.organisation,
                },
                msg_context={
                    'user': employment.user,
                    'organisation': employment.organisation,
                }
            )
    else:
        # Employment already exists, send mail when it wasn't approved before, but is approved now.
        if not obj.is_approved and employment.is_approved:
            rsr_send_mail(
                [employment.user.email],
                subject='registration/approved_request_email_subject.txt',
                message='registration/approved_request_email_message.txt',
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
    For all employments:
    - Set User to is_staff (for admin access) when the employment is approved and the Group is set
      to 'Project Editors', 'User managers' or 'Admins', or when the user is a superuser or general
      admin.

    If a new employment is created for an active user of which the employment is not approved yet:
    - Inform RSR support users, organisation admins and organisation user managers of the request
    """
    # Retrieve all user groups and the employment
    project_editors_group = Group.objects.get(name='Project Editors')
    user_managers_group = Group.objects.get(name='User Managers')
    admins_group = Group.objects.get(name='Admins')
    employment = kwargs.get("instance", None)

    if not employment:
        return

    user = employment.user

    # Set user to staff when in a certain group
    if (employment.group in [project_editors_group, user_managers_group, admins_group] and
            employment.is_approved) or user.is_superuser or user.is_admin:
        user.is_staff = True
        user.save()

    # Send an 'Organisation request' mail when an employment has been newly created, the
    # user is active and the employment has not been approved yet.
    if kwargs['created'] and user.is_active and not employment.is_approved:
        organisation = employment.organisation

        # Retrieve all active support users
        active_support_users = get_user_model().objects.filter(is_active=True, is_support=True)

        # General (support) admins will always be informed
        admin_users = active_support_users.filter(is_admin=True)

        # As well as organisation (+ content owners) User managers and Admins
        employer_users = active_support_users.filter(
            employers__organisation__in=organisation.content_owned_by(),
            employers__group__in=[user_managers_group, admins_group]
        )

        notify = active_support_users.filter(
            Q(pk__in=admin_users.values_list('pk', flat=True)) |
            Q(pk__in=employer_users.values_list('pk', flat=True))
        ).exclude(pk=user.pk).distinct()

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
            # this happens when a project is deleted, and thus any invoices linked to it go the
            # same way.
            pass


def update_project_funding(sender, **kwargs):
    """
    called when Partnership objects are added/changed/deleted
    """
    # kwargs['raw'] is True when we're running manage.py loaddata
    if not kwargs.get('raw', False):
        try:
            Project = get_model('rsr', 'project')
            project = Project.objects.get(id=kwargs['instance'].project_id)
            project.update_funds()
            project.update_funds_needed()
        except ObjectDoesNotExist:
            # this happens when a project is deleted, and thus any invoices linked to it go the
            # same way.
            pass


def update_project_editor_validation_cache(sender, **kwargs):
    """Called when ProjectEditorValidation objects are added/changed/deleted."""

    # kwargs['raw'] is True when we're running manage.py loaddata
    if kwargs.get('raw', False):
        return

    # Import here to avoid problems with circular imports
    from akvo.rsr.templatetags.project_editor import invalidate_validation_cache
    invalidate_validation_cache()
