from django.conf.urls.defaults import *
from django.views.generic.simple import direct_to_template
from akvo.rsr.feeds import ProjectUpdates
from akvo.rsr.models import create_rsr_profile

feeds = {
    'updates': ProjectUpdates,
}

urlpatterns = patterns('',
    #(r'^rsr/', include('akvo.rsr.urls')),

    (r'^rsr/$', 'akvo.rsr.views.index', ),

    (r'^rsr/admin/', include('django.contrib.admin.urls')),
    
    (r'^rsr/projects/$', 'akvo.rsr.views.projectlist', ),
    (r'^rsr/projects/(?P<org_id>\d+)/$', 'akvo.rsr.views.filteredprojectlist', ),
    #(r'^rsr/projects/all/$', 'akvo.rsr.views.projectlist', ),

    (r'^rsr/project/(?P<project_id>\d+)/$', 'akvo.rsr.views.projectmain', ),
    (r'^rsr/project/(?P<project_id>\d+)/update$', 'akvo.rsr.views.updateform', ),
    (r'^rsr/project/(?P<project_id>\d+)/comment$', 'akvo.rsr.views.commentform', ),
    (r'^rsr/project/(?P<project_id>\d+)/updates$', 'akvo.rsr.views.projectupdates', ),
    (r'^rsr/project/(?P<project_id>\d+)/comments$', 'akvo.rsr.views.projectcomments', ),
    (r'^rsr/project/(?P<project_id>\d+)/details$', 'akvo.rsr.views.projectdetails', ),
    (r'^rsr/project/(?P<project_id>\d+)/funding$', 'akvo.rsr.views.projectfunding', ),
    
    url(r'^rsr/fundingbar/$', 'akvo.rsr.views.fundingbarimg', name='fundingbar'),    

    #(r'^rsr/project/(?P<project_id>\d+)/ajax_tab_goals$', 'akvo.rsr.views.ajax_tab_goals', ),
    #(r'^rsr/project/(?P<project_id>\d+)/ajax_tab_sustainability$', 'akvo.rsr.views.ajax_tab_sustainability', ),
    #(r'^rsr/project/(?P<project_id>\d+)/ajax_tab_context$', 'akvo.rsr.views.ajax_tab_context', ),
    #(r'^rsr/projects/(?P<order_by>[_a-zA-Z]*)/$', 'akvo.rsr.views.projectlist', ),

    (r'^rsr/flashgallery.xml$', 'akvo.rsr.views.flashgallery', ),
    
    (r'^rsr/organisation/(?P<org_id>\d+)/$', 'akvo.rsr.views.orgdetail', ),
    
    url(r'^rsr/organisations/$', 'akvo.rsr.views.orglist', name='rsr_org_list'),
    url(r'^rsr/organisations/(?P<org_type>[_a-zA-Z]+)/$', 'akvo.rsr.views.orglist', name='rsr_org_list_filtered'),

    (r'^rsr/setlowbandwidth/$', 'akvo.rsr.views.set_low_bandwidth', ),
    (r'^rsr/sethighbandwidth/$', 'akvo.rsr.views.set_high_bandwidth', ),
    (r'^rsr/settestcookie/$', 'akvo.rsr.views.set_test_cookie', ),

    #(r'^rsr/signin/$', 'akvo.rsr.views.login', {'template_name': 'rsr/sign_in.html'}),
    (r'^rsr/signin/$', 'akvo.rsr.views.login', {'template_name': 'rsr/sign_in.html'}),
    (r'^rsr/signout/$', 'akvo.rsr.views.signout', ),
    
    (r'^rsr/accounts/register1/$', 'akvo.rsr.views.register1', ),
    (r'^rsr/accounts/register2/$', 'akvo.rsr.views.register2', {'profile_callback': create_rsr_profile,}),
    (r'^rsr/accounts/update/$', 'akvo.rsr.views.update_user_profile', ),
    (r'^rsr/accounts/password/change/$', 'akvo.rsr.views.password_change', ),
    (r'^rsr/accounts/update/complete/$', direct_to_template, {'template': 'registration/update_complete.html'} ),
    (r'^rsr/accounts/', include('registration.urls')),
    
    (r'^rsr/error/access_denied/$', direct_to_template, {'template': 'rsr/error_access_denied.html'}),
    
    (r'^rsr/rss/(?P<url>.*)/$', 'django.contrib.syndication.views.feed', {'feed_dict': feeds}),

    (r'^rsr/mosms/$', 'akvo.rsr.views.sms_update', ),    
    (r'^rsr/momms/$', 'akvo.rsr.views.mms_update', ),    
    
    #feedjack
    #(r'', include('feedjack.urls')),
    
    #template dev urls
    (r'^rsr/dev/(?P<template_name>[_a-zA-Z0-9]+)/$', 'akvo.rsr.views.templatedev', ),
    #(r'^rsr/dev/project_main/$', 'django.views.generic.simple.direct_to_template', {'template': 'dev/project_main.html'}),

    # serving media in the dev server environment TODO: set up real media serving
    #(r'^rsr/media/(?P<path>.*)$', 
    #    'django.views.static.serve', 
    #    {'document_root': '/var/dev/akvo/mediaroot/', 'show_indexes': True}),
)
