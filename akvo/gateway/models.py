# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module. 
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.conf import settings
from django.db import models
from django.db.models.signals import post_save
from django.utils.translation import ugettext, ugettext_lazy as _

from datetime import datetime

import urllib
import urllib2

from utils import who_am_i
#from akvo.gateway import logger
from akvo.rsr.signals import handle_incoming_sms

import logging
logger = logging.getLogger('akvo.rsr')

class Gateway(models.Model):
    """

    """
    name        = models.SlugField(
        u'gateway name', max_length=30,
        help_text='''
            The name is used in the callback to determine the gateway used.
            For example if the name is "42it" the callback path will be /gateway/42it/
        '''
    )
    host_name   = models.CharField(u'host name', max_length=255, help_text=u'Host name to use when sending an SMS through the gateway', )
    send_path   = models.CharField(u'send message path', max_length=255, help_text=u'Path at gateway when sending an SMS', )

    sender      = models.CharField(u'sender',    max_length=30, help_text=u"Sender's phone number", )
    receiver    = models.CharField(u'receiver',  max_length=30, help_text=u'Receiving number at gateway', )
    message     = models.CharField(u'message',   max_length=30, help_text=u'The message text', )
    timestamp   = models.CharField(u'timestamp', max_length=30, help_text=u'Gateway timestamp', )
    msg_id      = models.CharField(u'msg_id',    max_length=30, help_text=u'Gateway message id', )

    def __unicode__(self):
        return self.name

    def numbers(self):
        return '<br />'.join([gw_number.number for gw_number in self.gatewaynumber_set.all()])
    numbers.allow_tags = True

#mapping between the gateways field names and ours for default fields (they should be the minimum set needed to send)
GW_SENDING_FIELDS_42IT = {
    'mt_number' : 'to',
    'gw_number' : 'from',
    'message'   : 'message',
}
# "static data for GW_SEMDING_FIELDS and extra fields with data
GW_SENDING_DATA_42IT = {
    # default
    'username'  : 'Concinnity',
    'password'  : '9391167',
    # extra
    'route'     : '2',
}


class GatewayNumber(models.Model):
    gateway = models.ForeignKey(Gateway)     
    number  = models.CharField(u'gateway number', max_length=30)
    
    def __unicode__(self):
        return self.number

    def send_sms(self, mt_number, message):
        logger.debug("Entering: %s()" % who_am_i())
        try:
            send_fields = GW_SENDING_FIELDS_42IT #TODO: generalize to handle any defined gateway
            data = GW_SENDING_DATA_42IT #TODO: generalize to handle any defined gateway
            gw_number = self.number
            for field_name in ['gw_number', 'mt_number', 'message',]:
                data[send_fields[field_name]] = locals()[field_name]
            url_values = urllib.urlencode(dict([k, v.encode('utf-8')] for k, v in data.items()))
            gw = self.gateway
            full_url = 'http://%s%s?%s' % (gw.host_name, gw.send_path, url_values)
            if getattr(settings, 'SMS_DEBUG', False):
                print "send_sms URL call: %s" % full_url    
            else:
                data = urllib2.urlopen(full_url)
        except Exception, e:
            logger.exception('%s Locals:\n %s\n\n' % (e.message, locals(), ))            
        logger.debug("Exiting: %s(). Called URL: %s" % (who_am_i(), data))


class MoSms(models.Model):
    """
    Generic storage of an incoming sms
    Attributes:
        sender: sender's telephone number
        receiver: phone number the message was received at
        message: the actual sms text
        timestamp: many gateways include a time when the message arrived at the gateway
        msg_id: many gateways include an id for each message
        saved_at: time when the message is saved
    """
    
    sender      = models.CharField(max_length=30, verbose_name=u'sender',)
    receiver    = models.CharField(max_length=30, verbose_name=u'receiver',) #TODO: change to FK to GatewayNumber?
    message     = models.TextField(blank=True, verbose_name=u'message',) #degenerate, but possible...
    timestamp   = models.CharField(max_length=50, verbose_name=u'timestamp', blank=True,)
    msg_id      = models.CharField(max_length=100, verbose_name=u'message ID', blank=True,)
    saved_at    = models.DateTimeField(verbose_name=u'time saved at',)

    @classmethod
    def new_sms(cls, request, gateway):
        """
        Handle callback from gateway, creating a generic object representing
        an incoming SMS
        """
        logger.debug("Entering: %s()" % who_am_i())
        request.encoding = 'iso-8859-1' #TODO: some GWs allow this to be set I think
        try:
            # if we find an mms already, do nuthin...
            sms, created = cls.objects.get(msg_id=request.GET.get(gateway.msg_id)), False
            logger.debug("SMS with id %s already exists!" % msg_id)
        except:
            try:
                raw = {}
                # loop over all field names and do lookup of the callback api name of
                # the field to get the incoming value
                for f in cls._meta.fields:
                    value = request.GET.get(getattr(gateway, f.name, ''), False)
                    if value:
                        raw[f.name] = value
                raw['saved_at'] = datetime.now()
                sms, created = cls.objects.create(**raw), True
            except Exception, e:
                logger.exception("Exception trying to create a MoSms instance. Error: %s Locals:\n %s\n\n" % (e.message, locals()))
                return None, False
        logger.debug("Exiting: %s()" % who_am_i())
        return sms, created


#class GatewayCallbackApiField(models.Model):
#    FIELD_CHOICES = (
#        ('sender', 'sender'),
#        ('receiver', 'receiver'),
#        ('message', 'message'),
#        ('timestamp', 'getaway timestamp'),
#        ('msg_id', 'gateway message id'),
#    )
#    gateway = models.ForeignKey(Gateway)     
#    name    = models.CharField(_(u'field name'), choices=FIELD_CHOICES, max_length=20)
#    value   = models.CharField(_(u'api field'), max_length=20)
#    
#    class Meta:
#        unique_together = ('gateway', 'name', 'value',)

# http://localhost:8000/rsr/gateway/42it/?sender=46707277477&to=467301203262115&text=SAYXYQ&delivered=1234567&incsmsid=1234567

#gateways = {
#    '42it': {
#        'name'      : '42it',
#        'host_name' : 'server1.msgtoolbox.com',
#        'send_path' : '/api/current/send/message.php? ',
#        'api_map'   : {
#            'sender'            : 'sender',
#            'receiver'          : 'to',
#            'message'           : 'text',
#            'getaway_timestamp' : 'delivered',
#            'gateway_id'        : 'incsmsid',
#        }
#    },
#    'clickatell': {
#        'name'      : 'Clickatell',
#        'host_name' : 'api.clickatell.com',
#        'send_path' : '/http/sendmsg',
#        'api_map'   : {
#            'sender'            : 'from',
#            'receiver'          : 'to',
#            'message'           : 'text',
#            'getaway_timestamp' : 'timestamp',
#            'gateway_id'        : 'moMsgId',
#        }
#    },
#    'smsglobal': {
#        'name'      : 'SMSGlobal',
#        'host_name' : 'www.smsglobal.com.au',
#        'send_path' : '/http-api.php',
#        'api_map'   : {
#            'sender'            : 'from',
#            'receiver'          : 'to',
#            'message'           : 'msg',
#            'getaway_timestamp' : 'date',
#            'gateway_id'        : 'userfield',
#        }
#    }
#}

post_save.connect(handle_incoming_sms, sender=MoSms)