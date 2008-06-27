from django.conf.urls.defaults import *
from akvo.rsr.models import Organization, Project

info_dict = {
    'queryset': Project.objects.all().values(),
}


urlpatterns = patterns('',
    # generic view experiment
    #(r'^$', 'django.views.generic.list_detail.object_list', info_dict),
    #(r'^(?P<object_id>\d+)/$', 'django.views.generic.list_detail.object_detail', {'queryset': Project.objects, 'template_object_name':'project',}),
    (r'^$', 'akvo.rsr.views.index', ),
    (r'^(?P<project_id>\d+)/$', 'akvo.rsr.views.projectmain', ),
)
