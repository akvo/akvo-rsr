# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module. 
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.conf.urls.defaults import *
from django.core.urlresolvers import reverse
from django.contrib.auth import views as auth_views
from django.views.generic.simple import direct_to_template
from akvo.rsr.feeds import ProjectUpdates
from akvo.rsr.models import create_rsr_profile
from akvo.rsr.forms import RSR_PasswordResetForm

# The next two lines enable the admin and load each admin.py file:
from django.contrib import admin
admin.autodiscover()

feeds = {
    'updates': ProjectUpdates,
}

urlpatterns = patterns('',
    #(r'^rsr/', include('akvo.rsr.urls')),

    (r'^$', 'akvo.rsr.views.index', ),
    (r'^rsr/$', 'akvo.rsr.views.oldindex', ),

    (r'^rsr/admin/(.*)', admin.site.root),
    #(r'^rsr/admin/', include('django.contrib.admin.urls')),
    
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
    url(r'^rsr/signin/$',
                           'akvo.rsr.views.login',
                           {'template_name': 'rsr/sign_in.html'},
                           name='signin'),
    #(r'^rsr/signin/$', 'auth_views.login', {'template_name': 'rsr/sign_in.html'}),
    (r'^rsr/signout/$', 'akvo.rsr.views.signout', ),
    
    (r'^rsr/accounts/register1/$', 'akvo.rsr.views.register1', ),
    (r'^rsr/accounts/register2/$', 'akvo.rsr.views.register2', ),
    url(r'^rsr/accounts/activate/(?P<activation_key>\w+)/$', 'akvo.rsr.views.activate', name='registration_activate'),
    (r'^rsr/accounts/update/$', 'akvo.rsr.views.update_user_profile', ),
    (r'^rsr/accounts/password/change/$', 'akvo.rsr.views.password_change', ),
    url(r'^rsr/accounts/password/reset/$',
        auth_views.password_reset,
        {'password_reset_form': RSR_PasswordResetForm,
            'post_reset_redirect': '/rsr/accounts/password/reset/done/'},
        name='rsr_password_reset'
    ),
    (r'^rsr/accounts/update/complete/$', direct_to_template, {'template': 'registration/update_complete.html'} ),
    (r'^rsr/accounts/', include('registration.urls')),

    url(r'^rsr/widget/project$', 'akvo.rsr.views.widget_project', {'template':'widgets/project.html'}, name='widget_project', ),
	url(r'^rsr/widget/projectupdates$', 'akvo.rsr.views.widget_project', {'template':'widgets/project_updates.html'}, name='widget_project_updates', ),
	url(r'^rsr/widget/projectcontribute$', 'akvo.rsr.views.widget_project', {'template':'widgets/project_contribute.html'}, name='widget_project_contribute', ),
    url(r'^rsr/widget/projectsmall$', 'akvo.rsr.views.widget_project', {'template':'widgets/project_small.html'}, name='widget_project_small', ),
    url(r'^rsr/widget/projectlist$', 'akvo.rsr.views.widget_project_list', name='widget_project_list', ),
    
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
