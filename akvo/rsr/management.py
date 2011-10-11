from django.conf import settings
from django.contrib.auth.models import User, Group
from django.contrib.contenttypes.models import ContentType
from django.db.models.signals import post_syncdb
from django.utils.translation import ugettext_noop as _

if not settings.PVW_RSR:
    if "notification" in settings.INSTALLED_APPS:
        from notification import models as notification

        def create_notice_types(app, created_models, verbosity, **kwargs):
            print "Creating notice types for SMS updates"
            notification.create_notice_type(
                "phone_added",
                _("Phone number added"),
                _("Your mobile phone has been added to your user profile")
            )
            notification.create_notice_type(
                "phone_confirmed",
                _("Phone confirmed"),
                _("Your mobile phone number has been confirmed for use in updating RSR projects")
            )
            notification.create_notice_type(
                "reporting_enabled",
                _("SMS updates enabled for project"),
                _("You can now send SMS-updates to an RSR project")
            )
            notification.create_notice_type(
                "reporting_cancelled",
                _("SMS updates cancelled"),
                _("SMS-updates to an RSR project has been cancelled")
            )
            notification.create_notice_type(
                "phone_disabled",
                _("Phone disabled"),
                _("SMS-updates from your mobile phone are no longer accepted")
            )
            notification.create_notice_type(
                "update_received",
                _("Update received"),
                _("Akvo has received an update from your phone")
            )

        post_syncdb.connect(create_notice_types, sender=notification)
    else:
        print "Skipping creation of NoticeTypes as notification app not found"

    def create_model_instance(model, **kwargs):
        handle = kwargs.pop('handle')
        try:
            existing_instance = model.objects.get(**handle)
            updated = False
            for key in kwargs.keys():
                if kwargs[key] != getattr(existing_instance, key, False):
                    setattr(existing_instance, key, kwargs[key])
                    updated = True
            if updated:
                existing_instance.save()
                #if verbosity > 1:
                #    print "Updated %s %s" % (label, existing_instance)
            return existing_instance
        except model.DoesNotExist:
            kwargs.update(handle)
            return model.objects.create(**kwargs)
            #if verbosity > 1:
            #    print "Created %s NoticeType" % label


    #workflow for UserProfile
    #principalrolerelation group SMS updater - role SMS updater
    #principalrolerelation group SMS manager - role SMS manager
    #principalrolerelation group SMS manager - role SMS updater


    #if "permissions" in settings.INSTALLED_APPS:
    #    from permissions.utils import register_role
    #
    #    def create_permissions_objects(app, created_models, verbosity, **kwargs):
    #        #register_role('SMS Updater')
    #        print "Done creating permissions objects"
    #
    #    post_syncdb.connect(create_permissions_objects, sender=permissions)
    #else:
    #    print "Skipping creation of Permissions objects as permissions app not found"
    #

    from django.contrib.auth import models as auth_models
    def create_workflow_groups(sender, **kwargs):
        sms_updater_group = create_model_instance(Group, **{'handle': {'name': UserProfile.GROUP_SMS_UPDATER}})
        sms_manager_group = create_model_instance(Group, **{'handle': {'name': UserProfile.GROUP_SMS_MANAGER}})
        print "Done creating groups"

    post_syncdb.connect(create_workflow_groups, sender=auth_models)

    if "workflows" in settings.INSTALLED_APPS:
        from workflows import models as workflows
        from workflows.utils import set_workflow_for_model
        from .models import UserProfile

        def create_workflows_model_relation(app, created_models, verbosity, **kwargs):
            set_workflow_for_model(ContentType.objects.get_for_model(UserProfile), UserProfile.WORKFLOW_SMS_UPDATE)
            print "Created workflow relation for UserProfile"

        post_syncdb.connect(create_workflows_model_relation, sender=workflows)
    else:
        print "Skipping creation of Workflow objects as workflows app not found"


    if "permissions" in settings.INSTALLED_APPS:
        from permissions import models as permissions
        from permissions.utils import add_role
        from .models import UserProfile

        def create_principal_role_relations(sender, **kwargs):
            try:
                sms_updater_group = Group.objects.get(name=UserProfile.GROUP_SMS_UPDATER)
                sms_manager_group = Group.objects.get(name=UserProfile.GROUP_SMS_MANAGER)
                sms_updater_role  = permissions.Role.objects.get(name=UserProfile.GROUP_SMS_UPDATER)
                sms_manager_role  = permissions.Role.objects.get(name=UserProfile.GROUP_SMS_MANAGER)

                add_role(sms_updater_group, sms_updater_role)
                add_role(sms_manager_group, sms_updater_role)
                add_role(sms_manager_group, sms_manager_role)

                print "Created principal role relations for %s and %s" % (UserProfile.GROUP_SMS_MANAGER, UserProfile.GROUP_SMS_UPDATER)
            except:
                print "Role relations could not be created since fixtures are missing. Run manage.py syncdb again please!"

        post_syncdb.connect(create_principal_role_relations, sender=permissions)
    else:
        print "Skipping creation of Roles as permissions app was not found"




#if "workflow" in settings.INSTALLED_APPS:
#
#    from workflow import models as workflow
#
#    def create_workflow_objects(app, created_models, verbosity, **kwargs):
#        try:
#            system_acct = User.objects.get(username='system')
#        except:
#            print "Can't create workflow objects without User 'system'."
#            return
#        # Role
#        role1_data = {
#            'handle':       {'name': 'SMS Updater'},
#            'description':  'Allows the user to create project updates via SMS.'
#        }
#        role1 = create_model_instance(workflow.Role, **role1_data)
#        # EventType
#        event_type1_data = {
#            'handle':       {'name': 'UserProfile change'},
#            'description':  "A change in a user's UserProfile has occured.",
#        }
#        event_type1 = create_model_instance(workflow.EventType, **event_type1_data)
#        event_type2_data = {
#            'handle':       {'name': 'Send email'},
#            'description':  "Send an email to a user.",
#        }
#        event_type2 = create_model_instance(workflow.EventType, **event_type2_data)
#        event_type3_data = {
#            'handle':       {'name': 'Send SMS'},
#            'description':  "Send an SMS to a user's mobile phone.",
#        }
#        event_type3 = create_model_instance(workflow.EventType, **event_type3_data)
#        # Workflow
#        workflow1_data = {
#            'handle':       {'name': 'SMS update'},
#            'slug':         'sms-update',
#            'description':  'Workflow for setting up a user to do project updates via SMS.',
#            'status':       workflow.Workflow.DEFINITION,
#            'created_by':   system_acct,
#        }
#        workflow1 = create_model_instance(workflow.Workflow, **workflow1_data)
#        # State
#        #state1_data = {
#        #    'handle':           {'name': 'Phone number added test'},
#        #    'description':      'A phone number is added to the UserProfile',
#        #    'is_start_state':   True,
#        #    'is_end_state':     False,
#        #    'workflow':         workflow1,
#        #    'roles':            role1,
#        #}
#        #state1 = create_model_instance(workflow.State, **state1_data)
#
#        
#    post_syncdb.connect(create_workflow_objects, sender=notification)
#else:
#    print "Skipping creation of Workflow objects as workflow app not found"