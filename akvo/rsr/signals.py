# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module. 
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import logging
logger = logging.getLogger('akvo.rsr')

import os
from datetime import datetime

from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.db.models import get_model, ImageField

from sorl.thumbnail.fields import ImageWithThumbnailsField

from akvo.rsr.utils import send_donation_confirmation_emails, who_am_i, rsr_send_mail_to_users
from akvo.rsr.utils import (
    GROUP_RSR_EDITORS, GROUP_RSR_PARTNER_ADMINS
)

import akvo.rsr.models

def create_publishing_status(sender, **kwargs):
    """
    called when a new project is saved so an associated published record for the
    project is created
    """
    # kwargs['raw'] is True when we're running manage.py loaddata
    if kwargs.get('created', False) and not kwargs.get('raw', False):
        new_project = kwargs['instance']
        ps = get_model('rsr', 'publishingstatus')(status='unpublished')
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
            new_acc = OrganisationAccount(organisation=new_org, account_level='free')
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
            if isinstance(f, (ImageField, ImageWithThumbnailsField)):
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
            if isinstance(f, (ImageField, ImageWithThumbnailsField)):
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

def set_active_cms(instance, created, **kwargs):
    MiniCMS = get_model('rsr', 'MiniCMS')
    if instance.active:
        MiniCMS.objects.exclude(pk=instance.pk).update(active=False)

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
    for category in project.categories.all():
        for benchmarkname in category.benchmarknames.all():
            benchmark, created = akvo.rsr.models.Benchmark.objects.get_or_create(project=project, category=category, name=benchmarkname, defaults={'value': 0})
    #if kwargs['created']:
    #technology = kwargs['instance']
    #for factor in Factor.objects.filter(pk__in=[pk for pk in technology.factors.all().values_list('pk', flat=True)]):
    #    for criterion in factor.criteria.all():
    #        try:
    #            Relevancy.objects.get(technology=technology, criterion=criterion,)
    #        except Relevancy.DoesNotExist:
    #            Relevancy.objects.create(technology=technology, criterion=criterion,)

from django.contrib.admin.models import ADDITION, CHANGE
from django.contrib.contenttypes.models import ContentType
def act_on_log_entry(sender, **kwargs):
    """
    catch the LogEntry post_save to grab newly added Technology instances and create
    relevancy objects for it
    we do this at this time to be able to work with a fully populated Technology
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

def user_activated_callback(sender, **kwargs):
    user = kwargs.get("user", False)
    if user:
        org = user.get_profile().organisation
        users = User.objects.all()
        #find all users that are 1) superusers 2) RSR editors
        #3) org admins for the same org as the just activated user
        notify = (users.filter(is_superuser=True) | users.filter(groups__name__in=[GROUP_RSR_EDITORS]) | \
            users.filter(userprofile__organisation=org, groups__name__in=[GROUP_RSR_PARTNER_ADMINS])).distinct()
        rsr_send_mail_to_users(notify,
                               subject='email/new_user_registered_subject.txt',
                               message='email/new_user_registered_message.txt',
                               subject_context={'organisation': org},
                               msg_context={'user': user, 'organisation': org}
                              )

#def manage_workflow_roles(sender, **kwargs):
#    """When a user is assigned the SMS updater group assign the Role with the same name.
#    Do the same for SMS manager
#    """
#    logger.debug("Entering: %s()" % who_am_i())
#    action  = kwargs.get('action', None)
#    reverse = kwargs.get('reverse', False)
#    model   = kwargs.get('model', False)
#    pk_set  = kwargs.get('pk_set', False)
#    if model == Group and action == 'post_add' and not reverse:
#        groups = model.objects.filter(pk__in=pk_set)
#        new_sms = kwargs['instance']
#        try:
#            profile = get_model('rsr', 'UserProfile').objects.process_sms(new_sms)
#        except Exception, e:
#            logger.exception('%s Locals:\n %s\n\n' % (e.message, locals(), ))
#    logger.debug("Exiting: %s()" % who_am_i())
    
def handle_incoming_sms(sender, **kwargs):
    """
    called through post_save.connect(handle_incoming_sms, sender=MoSms)
    """
    logger.debug("Entering: %s()" % who_am_i())
    # kwargs['raw'] is True when we're running manage.py loaddata
    if kwargs.get('created', False) and not kwargs.get('raw', False):
        new_sms = kwargs['instance']
        try:
            profile = get_model('rsr', 'UserProfile').objects.process_sms(new_sms)
        except Exception, e:
            logger.exception('%s Locals:\n %s\n\n' % (e.message, locals(), ))
    logger.debug("Exiting: %s()" % who_am_i())

def cleanup_reporters(profile, user):
    if not profile.validation == profile.VALIDATED:
        get_model('rsr', 'SmsReporter').objects.filter(userprofile=profile).delete()


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
