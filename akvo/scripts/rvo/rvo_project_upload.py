# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import getopt
import sys

from lxml import etree

from tastypie.http import HttpCreated, HttpNoContent

from akvo.scripts.rvo import (
    log, API_VERSION, ACTION_CREATE_PROJECT, ERROR_EXCEPTION, ERROR_UPLOAD_ACTIVITY,
    ERROR_CREATE_ACTIVITY, ERROR_UPDATE_ACTIVITY, ACTION_UPDATE_PROJECT, RVO_ACTIVITIES_CSV_FILE,
    print_log, init_log, RvoActivity, ERROR_MISSING_IATI_ID, load_xml, RVO_IATI_ACTIVITES_URL,
    save_xml, ERROR_IDENTIFY_RSR_PROJECT, AKVO_NS
)

from akvo.api_utils import Requester


def post_an_activity(activity_element, user):
    try:
        iati_id = activity_element.findall('iati-identifier')[0].text.encode('utf-8')
        project = Requester(
            url_template="http://{domain}/api/{api_version}/iati_activity/?format=xml&api_key={api_key}&username={username}",
            method='post',
            url_args=user,
            headers={'content-type': 'application/xml', 'encoding': 'utf-8'},
            data=etree.tostring(activity_element), accept_codes=[HttpCreated.status_code]
        )
    except Exception, e:
        return False, "{extra}", dict(
            iati_id = iati_id,
            event = ERROR_EXCEPTION,
            extra = e.message,
        )
    if project.response.text:
        return False,  "**** Error creating iati-activity: {iati_id}", dict(
            iati_id = iati_id,
            event = ERROR_CREATE_ACTIVITY,
            extra = project.response.text
        )
    elif project.response.status_code is HttpCreated.status_code:
        return True, "Created project for iati-activity: {iati_id}", dict(
            iati_id = iati_id, event = ACTION_CREATE_PROJECT
        )
    else:
        return (
            False,
            "**** Error creating iati-activity: {iati_id}. HTTP status code: {extra}", dict(
                iati_id = iati_id,
                event = ERROR_UPLOAD_ACTIVITY,
                extra = project.response.status_code,
            )
        )

# root[i].findall('iati-identifier')[0].text

def put_an_activity(activity_element, pk, url_args):
    url_args.update(pk=pk)
    try:
        iati_id = activity_element.findall('iati-identifier')[0].text.encode('utf-8')
        project = Requester(
            url_template="http://{domain}/api/{api_version}/iati_activity/{pk}/?format=xml&api_key={api_key}&username={username}",
            method='put',
            url_args=url_args,
            headers={'content-type': 'application/xml', 'encoding': 'utf-8'},
            data=etree.tostring(activity_element),
            accept_codes=[HttpNoContent.status_code],
        )
    except Exception, e:
        return False, "{extra}", dict(
            iati_id = iati_id,
            event = ERROR_EXCEPTION,
            extra = e.message
        )
    if project.response.text:
        return False, "**** Error creating iati-activity: {iati_id}", dict(
            iati_id = iati_id,
            event = ERROR_UPDATE_ACTIVITY,
            extra = project.response.text
        )
    elif project.response.status_code is HttpNoContent.status_code:
        return True, "Updated project for iati-activity: {iati_id} (Akvo pk: {pk})", dict(
            iati_id = iati_id,
            event = ACTION_UPDATE_PROJECT,
            pk = pk
        )
    else:
        return (
            False,
            "**** Error updating iati-activity: {iati_id}. HTTP status code: {extra}", dict(
                iati_id = iati_id,
                event = ERROR_UPLOAD_ACTIVITY,
                extra = project.response.status_code,
            )
        )

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
        auth = Requester(
            url_template="http://{domain}/auth/token/",
            method='post',
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
        # TODO: see if it's possible to suppress password echoing in terminal
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

def get_project_count(user, **q_args):
    """
    Look for a project
    """
    url_args = user
    url_args.update(
        extra_args = "&".join(
            ["{}={}".format(item[0], item[1]) for item in q_args.items()]
        )
    )
    try:
        project = Requester(
            url_template="http://{domain}/api/{api_version}/project/"
                         "?format=json&api_key={api_key}&username={username}&{extra_args}",
            url_args=url_args,
        )
    except Exception, e:
        print "{message}".format(message=e.message)
        return False, None
    return True, project


def identify_rsr_project(user, iati_id):
    """ Figure out if we can identify an RSR project from one or more of
        the RSR ID, an IATI activity ID, and an internal ID of RAIN, with consistency checking
    """
    rsr_id_from_iati_id = None

    if iati_id:
        ok, project = get_project_count(user, **dict(iati_activity_id=iati_id))
        if ok:
            iati_project_count = project.response.json()['meta']['total_count']
            # More than one project with the same IATI activity ID is not good
            assert iati_project_count < 2, "Two or more projects with the same IATI ID: {}".format(iati_id)
            if iati_project_count == 1:
                rsr_id_from_iati_id = project.response.json()['objects'][0]['id']

    return rsr_id_from_iati_id

def upload_activities(argv):
    user = credentials_from_args(argv)
    if user:
        xml = load_xml(RVO_IATI_ACTIVITES_URL)
        if xml:
            save_xml(xml, "rain_activities_{datetime}.xml")
            parser = etree.XMLParser(ns_clean=True, recover=True, encoding='utf-8')
            root = etree.fromstring(xml, parser=parser)
            activities = root.findall('iati-activity')
            activity_count = len(activities)
            for i, activity in enumerate(activities):
                activity = RvoActivity(activity)
                iati_id = activity.iati_id()
                try:
                    assert iati_id is not None, "No IATI ID found, for activity number {} in the XML".format(i+1)
                except AssertionError, e:
                    message = "No IATI ID for activity number {extra}"
                    data = dict(
                        event=ERROR_MISSING_IATI_ID,
                        extra=i,
                    )
                    log(message, data)
                    print message.format(**data)
                    continue
                print "({current} of {activity_count}) Processing activity {iati_id}".format(
                    current=i+1, activity_count=activity_count, iati_id=iati_id
                ),
                try:
                    rsr_id = identify_rsr_project(user, iati_id)
                except AssertionError, e:
                    message = "Error identifying RSR project: IATI ID: {iati_id}, Error message: \n{extra}"
                    data = dict(
                        iati_id=iati_id,
                        event=ERROR_IDENTIFY_RSR_PROJECT,
                        extra=e.message,
                    )
                    log(message, data)
                    print message.format(**data)
                    continue

                # HACK! trim titles
                for title in activity.tree.xpath('title'):
                    if title.text and len(title.text) > 45:
                        title.text = title.text[:45]

                # HACK! add Akvo NS to description and trim descriptions
                for description in activity.tree.xpath('description[@type="1"]'):
                    description.attrib['{' + AKVO_NS + '}type'] = '5'
                    if description.text and len(description.text) > 400:
                        new_description = etree.SubElement(activity.tree, "description")
                        new_description.text = description.text
                        new_description.attrib['type'] = '1'
                        new_description.attrib['{' + AKVO_NS + '}type'] = '6'

                        description.text = description.text[:400]

                for goals_overview in activity.tree.xpath('description[@type="2"]'):
                    goals_overview.attrib['{' + AKVO_NS + '}type'] = '8'
                    if goals_overview.text and len(goals_overview.text) > 600:
                        goals_overview.text = goals_overview.text[:600]

                # HACK! add locations
                for location in activity.tree.xpath('location'):
                    if activity.tree.xpath('recipient-country'):
                        country = activity.tree.xpath('recipient-country')[0].get("code")
                        administrative = etree.SubElement(location, "administrative")
                        administrative.attrib['country'] = country.lower()

                # HACK! add budgets
                for budget in activity.tree.xpath('budget'):
                    if budget.xpath('value'):
                        for value in budget.xpath('value'):
                            if value.text and len(value.text) > 8:
                                budget.getparent().remove(budget)
                            else:
                                value.attrib['{' + AKVO_NS + '}type'] = '14'
                    else:
                        budget.getparent().remove(budget)

                # HACK! removing participating-orgs
                for org in activity.tree.xpath('participating-org'):
                    org.getparent().remove(org)

                # HACK! removing results
                for result in activity.tree.xpath('result'):
                    result.getparent().remove(result)

                if rsr_id:
                    ok, message, data = put_an_activity(activity.tree, rsr_id, user)
                    log(message, data)
                    print message.format(**data)
                else:
                    ok, message, data = post_an_activity(activity.tree, user)
                    log(message, data)
                    print message.format(**data)

if __name__ == '__main__':
    upload_activities(sys.argv)
    log_file = init_log(RVO_ACTIVITIES_CSV_FILE)
    names = (u'iati_id', u'pk', u'event', u'extra')
    print_log(log_file, names)
