from django.conf.urls.defaults import *
#   from akvo.rsr.models import Organization, Project

urlpatterns = patterns('',
    #(r'^rsr/', include('akvo.rsr.urls')),

    # Uncomment this for admin:
    (r'^rsr/admin/', include('django.contrib.admin.urls')),
    (r'^rsr/organization/(?P<org_id>\d+)/$', 'akvo.rsr.views.orgdetail', ),
    (r'^rsr/project/(?P<project_id>\d+)/$', 'akvo.rsr.views.projectmain', ),
    (r'^rsr/project/(?P<project_id>\d+)/update$', 'akvo.rsr.views.updateform', ),
    (r'^rsr/project/(?P<project_id>\d+)/comment$', 'akvo.rsr.views.commentform', ),
    (r'^rsr/project/(?P<project_id>\d+)/updates$', 'akvo.rsr.views.projectupdates', ),
    #(r'^rsr/project/(?P<project_id>\d+)/ajax_tab_goals$', 'akvo.rsr.views.ajax_tab_goals', ),
    #(r'^rsr/project/(?P<project_id>\d+)/ajax_tab_sustainability$', 'akvo.rsr.views.ajax_tab_sustainability', ),
    #(r'^rsr/project/(?P<project_id>\d+)/ajax_tab_context$', 'akvo.rsr.views.ajax_tab_context', ),
    #(r'^rsr/projects/(?P<order_by>[_a-zA-Z]*)/$', 'akvo.rsr.views.projectlist', ),
    (r'^rsr/projects/$', 'akvo.rsr.views.projectlist', ),
    (r'^rsr/signin/$', 'django.contrib.auth.views.login', {'template_name': 'rsr/sign_in.html'}),
    (r'^rsr/signout/$', 'akvo.rsr.views.signout', ),
    (r'^rsr/$', 'akvo.rsr.views.index', ),
    
    #feedjack
    #(r'', include('feedjack.urls')),
    
    #template dev urls
    (r'^rsr/dev/(?P<template_name>[_a-zA-Z]+)/$', 'akvo.rsr.views.templatedev', ),
    #(r'^rsr/dev/project_main/$', 'django.views.generic.simple.direct_to_template', {'template': 'dev/project_main.html'}),

    # serving media in the dev server environment TODO: set up real media serving
    #(r'^rsr/media/(?P<path>.*)$', 
    #    'django.views.static.serve', 
    #    {'document_root': '/var/dev/akvo/mediaroot/', 'show_indexes': True}),
)
