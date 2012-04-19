# -*- coding: utf-8 -*-
"""
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please
    see < http://www.gnu.org/licenses/agpl.html >.
"""
from __future__ import absolute_import

from django.conf import settings
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.utils import simplejson
from django.views.generic import TemplateView, ListView, View
from django.core.urlresolvers import reverse

#from sorl.thumbnail import get_thumbnail
from sorl.thumbnail.main import DjangoThumbnail

from akvo.rsr.views_partner_sites.base import BaseView, BaseProjectListView
from akvo.rsr.models import Organisation, Project


__all__ = [
    'GetWidgetView',
    'ProjectMapView',
    'ProjectCordinates',
    ]

class GetWidgetView(BaseView):
    template_name = 'partner_sites/widgets/get_widget1.html'

    def post(self, request, *args, **kwargs):
        self.template_name = 'partner_sites/widgets/get_widget2.html'

        return self.render_to_response(self.get_post_context(request))
        
    def get_post_context(self, request):
        widget_type = self.request.POST.get('widget-type', '')
        project = get_object_or_404(Project, pk=self.kwargs['project_id']) 
        return {
            'widget_type': widget_type,
            'project': project 
            
        }

class ProjectMapView(TemplateView):
    template_name = 'partner_sites/widgets/projects_map.html'

    def get_context_data(self, **kwargs):
        context = super(ProjectMapView, self).get_context_data(**kwargs)
        if getattr(settings, 'HTTPS_SUPPORT', True):
            protocol = 'https://'
        else:
            protocol = 'http://'

        context['app_url'] = '%s%s.%s' % (protocol, self.request.partner_site.hostname, settings.APP_DOMAIN_NAME)
        context['domain_url'] = '%s%s' % (protocol, settings.DOMAIN_NAME)
        context['height'] = self.request.GET.get('height', '300')
        context['width'] = self.request.GET.get('width', '600')
        context['bgcolor'] = self.request.GET.get('bgcolor', 'B50000')
        context['organisation'] = get_object_or_404(Organisation, pk=self.request.organisation_id)
        return context


class ProjectCordinates(TemplateView):

    def get_queryset(self):
        projects = get_object_or_404(Organisation, pk=self.request.organisation_id) \
            .published_projects().funding().latest_update_fields().order_by('-id')
        return projects

    def render_to_response(self, context, **kwargs):
        return HttpResponse(context, content_type='application/json', **kwargs)

    def get_context_data(self, **kwargs):
        if getattr(settings, 'HTTPS_SUPPORT', True):
            protocol = 'https://'
        else:
            protocol = 'http://'
        app_url = '%s%s.%s' % (protocol, self.request.partner_site.hostname, settings.APP_DOMAIN_NAME)
        projects = self.get_queryset()
        content = {'projects': []}

        for project in projects:
            project_url = reverse('project_main',kwargs={'project_id': project.id})

            # Trying to grab a thumbnail, first try
            
            # thumbnail project.current_image 100x100 autocrop sharpen
            #project_img = get_thumbnail(project.current_image, '100x100', crop='center', quality=99)

            # Trying to grab a thumbnail, second try
            
            #img = project.current_image # a normal image url returned from an ImageField
            #size = (100,100) # any tuple 
            #project_img = unicode(DjangoThumbnail(img, size))

            #info_window = """
            #                <div class="mapInfoWindow">
            #                    <a href="%s">%s</a><br>
            #                    <a href="%s"><img src="%s" alt="" /></a>
            #                    <p class="small grey" style="margin:0;">
            #                        %s: %s, %s
            #                    </p>
            #                </div>
            #              """ % (project_url, project.name, project_url, project_img, _('Location'), project.primary_location.country.continent, project.primary_location.city)

            # Giving up an just sending text :-(, need to revisit this
            #info_window = '<a href="%s%s">%s</a>' % (app_url, project_url, project.subtitle)

            info_window = '''
                            <div class="mapInfoWindow">
                                <a href="%s%s">%s</a><br>
                                <p class="small grey">
                                    %s: %s, %s
                                </p>
                            </div>
                        ''' % (app_url, project_url, project.name, 'Location', 
                                project.primary_location.country.continent, 
                                project.primary_location.city)
            
            content['projects'].append(dict(title=project.name,
                                            latitude=project.primary_location.latitude,
                                            longitude=project.primary_location.longitude,
                                            content=info_window,
                                            ))
        # Build jsonp with callback
        callback = self.request.GET.get('callback', '')
        return callback + '(' + simplejson.dumps(content) + ');'


# def projects_cordinates_old(request):
# 
#     projects = {
#         'markers': [
#         {'latitude': 57.797333, 'longitude': 12.0502107, 'title': 'Angered', 'content': 'da hood'},
#         {'latitude': 57.6969943, 'longitude': 11.98645, 'title': 'Gothenburg', 'content': 'city'}
#         ]
#     }
#     callback = request.GET.get('callback', '')
#     response = simplejson.dumps(projects)
#     response = callback + '(' + response + ');'
#     return HttpResponse(response, mimetype='application/json')
# 
# 
# def map_js_experimental(request):
#     """ Experimental JavaScript loader which should been loaded by:
#     <div id="map" style="height:400px; width:600px;"></div>
#     <script type="text/javascript">
#         var widget_el = 'map';
# 
#         (function() {
#             var aw = document.createElement('script'); 
#             aw.type = 'text/javascript'; 
#             aw.src = 'http://akvo.akvoapp.dev/widgets/map.js';
# 
#             var hook = document.getElementById('map');
#             hook.parentNode.insertBefore(aw, hook);
#         })();
# 
#       </script>
#     """
#     s = """
#         (function() {
#             var google_maps = document.createElement('script');
#             google_maps.setAttribute('type','text/javascript');
#             google_maps.setAttribute('src', 'http://maps.google.com/maps/api/js?sensor=true');
#             google_maps.onload = firstStep;
#             (document.getElementsByTagName("head")[0] ||document.documentElement).appendChild(google_maps);
# 
#             function firstStep() {
#                 var jq = document.createElement('script');
#                 jq.setAttribute('type','text/javascript');
#                 jq.setAttribute('src', 'http://akvo.dev/rsr/media/core/js/jquery-1.7.1.min.js');
#                 jq.onload = secondStep;
#                 (document.getElementsByTagName("head")[0] ||document.documentElement).appendChild(jq);
#             }
# 
#             function secondStep() {
#                 $ = jQuery = window.jQuery.noConflict(true);
#                 jQuery(document).ready(function($) {
#                     var uim = document.createElement('script');
#                     uim.setAttribute('type','text/javascript');
#                     uim.setAttribute('src', 'http://akvo.dev/rsr/media/core/js/jquery.ui.map.3.js');
#                     uim.onload = thirdStep;
#                     (document.getElementsByTagName("head")[0] ||document.documentElement).appendChild(uim);
#                 });
#             }
# 
#             function thirdStep() {
#                 $widget_el = jQuery('#'+widget_el);
# 
#                 if (typeof( window.gmaps ) == 'undefined') {
#                     alert('undefined'); 
#                 } else {
#                     alert('defined');
#                 }
# 
#                 $widget_el.gmap().bind('init', function() {
#                     $.getJSON('http://akvo.akvoapp.dev/api/v0/projects_cordinates.json?callback=?', function(data) {
#                         $.each(data.markers, function(i, marker) {
#                             console.log(marker.title);
#                              $widget_el.gmap('addMarker', { 
#                                 'position': new google.maps.LatLng(marker.latitude, marker.longitude), 
#                                 'bounds': true 
#                             }).click(function() {
#                                  $widget_el.gmap('openInfoWindow', { 'content': marker.content }, this);
#                             });
#                         });
#                     });
#                 });
# 
#             }
# 
#         })();
#         """
#     
#     return HttpResponse(s, mimetype='text/javascript')
