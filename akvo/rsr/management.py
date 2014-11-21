from django.conf import settings
from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType
from django.db.models import get_app, get_models
from django.db.models.signals import post_syncdb
from akvo.utils import RSR_REST

if "akvo.rsr" in settings.INSTALLED_APPS:
    from akvo.rsr import models as rsr
    def create_limited_change_permissions(sender, **kwargs):
        print "Adding RSR limited permissions"
        print
        models = [
            rsr.Organisation, rsr.Project, rsr.User, rsr.PartnerSite
        ]
        for model in models:
            opts = model._meta
            model_name = opts.object_name.lower()
            permission, created = Permission.objects.get_or_create(
                codename=u"rsr_limited_change_%s" % model_name,
                defaults={
                    'name': u'RSR limited change %s' % model_name,
                    'content_type_id': ContentType.objects.get_for_model(model).id,
                }
            )
            if created:
                print 'Created RSR limited change %s Permission' % model_name
            else:
                print 'RSR limited change %s Permission already exists in the database' % model_name

    # post_syncdb.connect(create_limited_change_permissions, sender=rsr)

    def create_rest_api_permissions(sender, **kwargs):
        """ Permissions for each "unsafe" method: POST, PUT, PATCH, DELETE
            Those permissions are used by akvo.rsr.rest.permissions.RSRModelPermissions
        """
        app = get_app('rsr')
        methods = ['post', 'put', 'patch', 'delete']
        for model in get_models(app):
            opts = model._meta
            model_name = opts.object_name.lower()
            for method in methods:
                permission, created = Permission.objects.get_or_create(
                    codename="{}_{}_{}".format(RSR_REST, method, model_name),
                    defaults={
                        'name': u'RSR rest API {} {}'.format(method, model_name),
                        'content_type_id': ContentType.objects.get_for_model(model).id,
                    }
                )
                if created:
                    print 'Created RSR rest API {} permission for {}'.format(method, model_name)
                else:
                    print 'RSR rest API {} permission for {} already exists'.format(method, model_name)


    # post_syncdb.connect(create_rest_api_permissions, sender=rsr)
