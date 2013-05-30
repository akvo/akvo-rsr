# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
import getopt

import requests

from lxml import etree
import sys
from tastypie.http import HttpCreated
from django.http import HttpResponse

class HttpOK(HttpResponse):
    status_code = 200


IATI_ACTIVITIES_XML = './xml/cordaid_iati_activities.xml'
API_VERSION = 'v1'

# localhost = dict(
#     domain='localhost:8000',
#     api_ver='v1',
#     api_key='ae9b09ba6f6c34079aad95701f188148fa149d87',
#     username='gabriel',
# )
#
# test = dict(
#     domain='test.akvo.org',
#     api_ver='v1',
#     api_key='d84a069e3693e23d7f63a79e01c2080b291d6c55',
#     username='gabriel',
# )
#
# test2 = dict(
#     domain='test2.akvo.org',
#     api_ver='v1',
#     api_key='e5dbdaf6122fd3ee4193e1121850cbec4290160c',
#     username='gabriel',
# )

def post_an_activity(activity_element, user):
    url = "http://{domain}/api/{api_version}/iati_activity/?format=xml&api_key={api_key}&username={username}".format(**user)
    headers = {'content-type': 'application/xml', 'encoding': 'utf-8'}
    try:
        response = requests.post(
            url, headers=headers,
            data=etree.tostring(activity_element),
        )
    except Exception, e:
        print "Error in request. Error msg:\n {message}".format(url=url, message=e.message)
        return
    if response.text:
        print "**** Error creating iati-activity: {id}".format(id=activity_element.findall('iati-identifier')[0].text)
    elif response.status_code is HttpCreated.status_code:
        print "Created project for iati-activity: {id}".format(id=activity_element.findall('iati-identifier')[0].text)
    else:
        print "**** Error creating iati-activity: {id}. HTTP status code: {status_code}".format(
            id=activity_element.findall('iati-identifier')[0].text,
            status_code=response.status_code,
        )
    import pdb
    pdb.set_trace()

# root[i].findall('iati-identifier')[0].text

def usage(script_name):
    print(
        "\nUsage: %s <domain> <username> [options]\n\n"
        "  <domain>         The domain you are posting to, e.g. test.akvo.org\n"
        "  <username>       Your Akvo account username\n\n"
        "  Options (note that either PWD or KEY must be supplied):\n"
        "     -h, --help    show this message\n\n"
        "     -p PWD, --password=PWD\n"
        "       Supply your Akvo account password\n\n"
        "     -k KEY, --api_key=KEY\n"
        "       Supply the API key generated in your Akvo user profile\n"
        % script_name)

def api_user(domain, username, password='', api_key=''):
    user = dict(
        domain=domain,
        username=username,
        api_version=API_VERSION,
    )
    if api_key:
        user['api_key'] = api_key
        return user
    elif password:
        url = "http://{domain}/rsr/auth/token/".format(domain=domain,)
        payload = dict(username=username, password=password)
        response = requests.post(url, data=payload,)
        if response.status_code == HttpOK.status_code:
            xml = response.text
            root = etree.fromstring(xml)
            user['api_key'] = root.find("api_key").text
            return user
        else:
            raise Exception("Call to retrieve API key failed, HTTP status: {reason}".format(
                reason=response.status_code)
            )
    else:
        raise Exception("Either password or API key must be supplied")

def credentials_from_args(argv):
    try:
        opts, args = getopt.getopt(argv[1:], "hp:k:", ["help", "password=", "api_key="])
    except getopt.GetoptError as e:
        print (str(e))
        usage(argv[0])
        sys.exit(2)
    kwargs = {}
    for opt, arg in opts:
        if opt in ("-h", "--help"):
            usage(argv[0])
            sys.exit()
        elif opt in ("-p", "--password"):
            kwargs['password'] = arg
        elif opt in ("-k", "--api_key"):
            kwargs['api_key'] = arg
    try:
        domain = args[0]
        username = args[1]
    except IndexError:
        usage(argv[0])
        sys.exit(2)
    try:
        user = api_user(domain, username, **kwargs)
        return user
    except Exception, e:
        print "Error msg: {message}".format(message=e.message)
        usage(argv[0])
        return None


def post_some_activities(argv):
    user = credentials_from_args(argv)
    if user:
        with open(IATI_ACTIVITIES_XML, 'r') as f:
            root = etree.fromstring(f.read())
            for i in range(len(root)):
                post_an_activity(root[i], user)

if __name__ == '__main__':
    import pdb
    pdb.set_trace()
    post_some_activities(sys.argv)
