# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.conf.urls import patterns, url, include
from rest_framework import routers
import views

router = routers.DefaultRouter()

router.register(r'country', views.CountryViewSet)
router.register(r'organisation', views.OrganisationViewSet)
router.register(r'internal_organisation_id', views.InternalOrganisationIDViewSet)
router.register(r'organisation_location', views.OrganisationLocationViewSet)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browseable API.
urlpatterns = patterns('',
    url(r'^', include(router.urls)),
    #url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework'))
)