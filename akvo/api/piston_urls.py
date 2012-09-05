# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module. 
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.conf.urls.defaults import *
from piston.doc import documentation_view
from piston.resource import Resource

from akvo.api.handlers import ProjectHandler, LEProjectHandler, UpdateHandler

project_handler = Resource(ProjectHandler)
le_project_handler = Resource(LEProjectHandler)

update_handler = Resource(UpdateHandler)

urlpatterns = patterns('',
    url(r'^projects/$', project_handler), # all projects
    url(r'^projects\.(?P<emitter_format>[A-Za-z]+)/$', project_handler), # format "filtetype" eg projects.json
    url(r'^projects/live-earth/$', le_project_handler), # Live Earth projects /projects/live-earth/
    url(r'^projects\.(?P<emitter_format>[A-Za-z]+)/live-earth/$', le_project_handler), # /projects.xml/live-earth/

    url(r'^project/(?P<pk>\d+)/$', project_handler), # one project: /project/42/
    url(r'^project\.(?P<emitter_format>[A-Za-z]+)/(?P<pk>\d+)/$', project_handler), # one project, filetype specified eg /project.xml/42/

    url(r'^project/(?P<project_id>\d+)/updates/$', update_handler), # /project/42/updates/
    url(r'^project/(?P<project_id>\d+)/updates\.(?P<emitter_format>[A-Za-z]+)/$', update_handler), # /project/42/updates.xml/

    url(r'^update/(?P<update_id>\d+)/$', update_handler), # /update/17/
    url(r'^update\.(?P<emitter_format>[A-Za-z]+)/(?P<update_id>\d+)/$', update_handler), # /update.json-/17/

    #url(r'^$', documentation_view),
)
