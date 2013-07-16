# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.http import HttpResponseServerError

from lxml import etree
from requester import Requester
from StringIO import StringIO

DOMAIN = 'test.akvo.org'
API_VERSION = 'v1'

def check_resource(**kwargs):
    offset = 0
    get_next_resource = True
    while get_next_resource:
        kwargs.update(offset=offset)
        try:
            resource = Requester(
                url_template="http://{domain}/api/{api_version}/{resource}/?format=xml&limit=1&offset={offset}",
                url_args=kwargs,
                accept_codes=[HttpResponseServerError.status_code]
            )
        except Exception, e:
            print "{message}".format(message=e.message)
            get_next_resource = False
        if resource.response.status_code == HttpResponseServerError.status_code:
            try:
                resource = Requester(
                    url_template="http://{domain}/api/{api_version}/{resource}/?limit=1&offset={offset}",
                    url_args=kwargs,
                )
            except Exception, e:
                print "{message}".format(message=e.message)
                get_next_resource = False
            print '***** XML error in {resource} {id}'.format(id=resource.response.json()['objects'][0]['id'], resource=kwargs['resource'])
        else:
            xml = etree.XML(resource.response.text[resource.response.text.find('\n'):])
            id = xml.xpath('//object/id')
            if id:
                # print 'XML OK in {resource} {id}'.format(id=id[0].text, resource=kwargs['resource'])
                print '.',
            else:
                return
        offset += 1

if __name__ == '__main__':
    check_resource(**dict(domain=DOMAIN, api_version=API_VERSION, resource='project'))
    check_resource(**dict(domain=DOMAIN, api_version=API_VERSION, resource='organisation'))
    check_resource(**dict(domain=DOMAIN, api_version=API_VERSION, resource='project_update'))
