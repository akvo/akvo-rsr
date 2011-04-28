# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module. 
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.http import HttpResponse#, HttpResponseRedirect, HttpResponsePermanentRedirect

from models import Gateway, MoSms
from utils import who_am_i

import logging
logger = logging.getLogger('django.request')

def receive_sms(request, gw_name):
    '''
    Handle a callback from a mobile message gateway
    '''
    # see if message already has been received for some reason, if so ignore
    logger.debug("Entering: %s()" % who_am_i())
    try:
        gateway = Gateway.objects.get(name__iexact=gw_name)
        logger.debug("Found a gateway: %s" % gw_name)
    except Exception, e:
        # general bork...bail out
        logger.exception("Exception trying to create a gateway instance. Error: %s Locals:\n %s\n\n" % (e.message, locals()))
        return HttpResponse("OK") #return OK under all conditions
    sms, created = MoSms.new_sms(request, gateway)
    logger.debug("Exiting: %s()" % who_am_i())
    return HttpResponse("OK") #return OK under all conditions TODO: this should probably be configurable on the gateway