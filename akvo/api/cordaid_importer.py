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


class HttpNoContent(HttpResponse):
    status_code = 204


IATI_ACTIVITIES_XML = './xml/109069.xml'
API_VERSION = 'v1'


class Requester():
    """
    wrapper class for requests
    """
    def __init__(self, method='get', url_template=None, url_args=None, headers=None, data=None, accept_codes=[]):
        self.method = method
        self.url = url_template.format(**url_args)
        self.headers = headers
        self.data = data
        self.error = None

        kwargs = {}
        if self.headers:
            kwargs.update(headers=self.headers)
        if self.data:
            kwargs.update(data=self.data)
        try:
            self.response = getattr(requests, self.method)(self.url, **kwargs)
        except Exception, e:
            raise Exception("Error in request. Error msg:\n {message}".format(message=e.message))
        if not (self.response.status_code == HttpOK.status_code or self.response.status_code in accept_codes):
            error_msg = "Non-OK response. Status: {status}{message}".format(
                status=self.response.status_code,
                message="\nResponse text: {text}".format(text=self.response.text) if self.response.text else ""
            )
            raise Exception(error_msg)


def post_an_activity(activity_element, user):
    try:
        project = Requester(
            method='post',
            url_template="http://{domain}/api/{api_version}/iati_activity/?format=xml&api_key={api_key}&username={username}",
            url_args=user,
            headers={'content-type': 'application/xml', 'encoding': 'utf-8'},
            data=etree.tostring(activity_element),
            accept_codes=[HttpCreated.status_code]
        )
    except Exception, e:
        print "{message}".format(message=e.message)
        return
    if project.response.text:
        print "**** Error creating iati-activity: {id}".format(id=activity_element.findall('iati-identifier')[0].text)
    elif project.response.status_code is HttpCreated.status_code:
        print "Created project for iati-activity: {id}".format(id=activity_element.findall('iati-identifier')[0].text)
    else:
        print "**** Error creating iati-activity: {id}. HTTP status code: {status_code}".format(
            id=activity_element.findall('iati-identifier')[0].text,
            status_code=project.response.status_code,
        )

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
    user = dict(domain=domain, username=username, api_version=API_VERSION,)
    if api_key:
        user['api_key'] = api_key
        return user
    elif password:
        # url = "http://{domain}/rsr/auth/token/".format(domain=domain,)
        # payload = dict(username=username, password=password)
        # response = requests.post(url, data=payload,)
        auth = Requester(
            method='post',
            url_template="http://{domain}/rsr/auth/token/",
            url_args=dict(domain=domain),
            data=dict(username=username, password=password),
        )
        xml = auth.response.text
        root = etree.fromstring(xml)
        user['api_key'] = root.find("api_key").text
        return user
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
        print "{message}".format(message=e.message)
        usage(argv[0])
        return None

def get_project_count(internal_id, user):
    """
    query the API for projects associated with a given internal_id
    """
    url_args = user
    url_args.update(internal_id=internal_id)
    try:
        project = Requester(
            url_template="http://{domain}/api/{api_version}/project/?format=json&partnerships__internal_id={internal_id}",
            url_args=url_args
        )
    except Exception, e:
        print "{message}".format(message=e.message)
        return False, None
    return True, project

def put_an_activity(activity_element, pk, url_args):
    url_args.update(pk=pk)
    try:
        project = Requester(
            method='put',
            url_template="http://{domain}/api/{api_version}/iati_activity/{pk}/?format=xml&api_key={api_key}&username={username}",
            url_args=url_args,
            headers={'content-type': 'application/xml', 'encoding': 'utf-8'},
            data=etree.tostring(activity_element),
            accept_codes=[HttpNoContent.status_code]
        )
    except Exception, e:
        print "{message}".format(message=e.message)
        return
    if project.response.text:
        print "**** Error creating iati-activity: {id}".format(id=activity_element.findall('iati-identifier')[0].text)
    elif project.response.status_code is HttpCreated.status_code:
        print "Updated project for iati-activity: {id}".format(id=activity_element.findall('iati-identifier')[0].text)
    else:
        print "**** Error creating iati-activity: {id}. HTTP status code: {status_code}".format(
            id=activity_element.findall('iati-identifier')[0].text,
            status_code=project.response.status_code,
        )


def post_some_activities(argv):
    user = credentials_from_args(argv)
    if user:
        with open(IATI_ACTIVITIES_XML, 'r') as f:
            root = etree.fromstring(f.read())
            AKVO_NS = '{{{akvo_ns}}}'.format(akvo_ns=root.nsmap['akvo'])
            for i in range(len(root)):
                internal_id = root[i].get(AKVO_NS + 'internal-project-id')
                ok, project = get_project_count(internal_id, user)
                if not ok:
                    continue #error msg already output
                project_count = project.response.json()['meta']['total_count']
                if project_count == 0:
                    post_an_activity(root[i], user)
                elif project_count == 1:
                    pk = project.response.json()['objects'][0]['id']
                    put_an_activity(root[i], pk, user)
                elif project_count > 1:
                    print "**** Error updating iati-activity: {id}. More than one project with internal ID {internal_id} exists.".format(
                        id=root[i].findall('iati-identifier')[0].text, internal_id=internal_id)


TEST_PUT_XML = './xml/1108.xml'
def test_put(argv):
    url_args = credentials_from_args(argv)
    if url_args:
        with open(TEST_PUT_XML, 'r') as f:
            url_args.update(pk=1108)
            data=str(f.read())
            try:
                import pdb
                pdb.set_trace()
                project = Requester(
                    method='put',
                    url_template="http://{domain}/api/{api_version}/project/{pk}/?format=xml",
                    url_args=url_args,
                    headers={'content-type': 'application/xml', 'encoding': 'utf-8'},
                    data=data,
                )

            except Exception, e:
                print "{message}".format(message=e.message)
                return

if __name__ == '__main__':
    # post_some_activities(sys.argv)
    test_put(sys.argv)
