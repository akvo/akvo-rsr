# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module. 
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from textwrap import dedent

from django.contrib import admin
from django.db.models import get_model
from django.utils.translation import ugettext, ugettext_lazy as _

from models import Gateway, GatewayNumber, MoSms

#class GatewayCallbackApiFieldInLine(admin.TabularInline):
#    model   = get_model('gateway', 'gatewaycallbackapifield')
#    #don't work...initial = [{'name': 'sender'}, {'name': 'receiver'}, {'name': 'message'}, {'name': 'getaway_timestamp'}, {'name': 'gateway_id'}, ]
#    extra = 5
#    max_num = 5

class GatewayNumberInLine(admin.TabularInline):
    model = GatewayNumber #get_model('gateway', 'gatewaynumber')
    extra = 3

class GatewayAdmin(admin.ModelAdmin):
    model = Gateway #get_model('gateway', 'gateway')
    list_display = ('name', 'host_name', 'send_path', 'numbers', )
    inlines = [GatewayNumberInLine, ]
    fieldsets = (
        (u'Gateway general info', {
            'fields': (
                'name', 'host_name', 'send_path',
            ),
         }),
        (u'Query string variable names', {
            'description': dedent(
                u'''<p style="margin-left:0; padding-left:0; margin-top:1em; width:75%;">
                        The names of the query string variables for mo sms http callback.
                    </p>'''
            ),
            'fields': (
                'sender', 'receiver', 'message', 'timestamp', 'msg_id',
            ),
         }),
    )
     
    
admin.site.register(Gateway, GatewayAdmin)


class MoSmsAdmin(admin.ModelAdmin):
    list_display = ('pk', 'sender', 'receiver', 'message', )    

admin.site.register(MoSms, MoSmsAdmin)



