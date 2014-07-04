# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
import getopt

import json
import optparse
import os
import sys

from requests import codes

from requester2 import Requester
from image_importer import ImageImporter


# the dir where the json data files are stored
JSON_BASE_PATH = 'json'


class RSRModelInstance(object):
    """ A representation of one RSR model instance
    Object data:
        self.model: the API name of the model
        self.data: the python dict representation of the instance
        self.response: the API response object
        self.error: if the API call results in an exception, the error message is stored here
    """
    def __init__(self, host, api_token, model, data):
        self.host = host
        self.api_token = api_token
        self.model = model
        self.data = data
        self.response = None
        self.error = None

    def send_to_rsr(self):
        try:
            # TODO: maybe change to pk and lookup of pk field, but this requires RSR models introspection
            self.id = id = self.data.get('id', 0)
            if id:
                self.response = self.put_to_rsr(id)
            else:
                self.response = self.post_to_rsr()
            print self.response.response.text
        except Exception, e:
            print e.message
            self.error = e

    def post_to_rsr(self):
        return Requester(
            'post',
            'http://{host}/rest/v1/{model}/',
            dict(host=self.host, model=self.model.lower()),
            headers={
                'content-type': 'application/json',
                'encoding': 'utf-8',
                'Authorization': 'Token {}'.format(self.api_token),
            },
            data=json.dumps(self.data),
            accept_codes=[codes.created],
        )

    def put_to_rsr(self, id):
        return Requester(
            'put',
            'http://{host}/rest/v1/{model}/{id}/',
            dict(host=self.host, model=self.model.lower(), id=id),
            headers={
                'content-type': 'application/json',
                'encoding': 'utf-8',
                'Authorization': 'Token {}'.format(self.api_token),
            },
            data=json.dumps(self.data),
            accept_codes=[codes.ok],
        )

    def get_id(self):
        self.id = json.loads(self.response.response.text)['id']

    def handle_special_fields(self):
        for field in self.data.keys():
            field_method = getattr(self, "{}__{}".format(self.model, field), None)
            if field_method:
                field_method()

    def organisation__logo(self):
        if self.data['logo']:
            logo = ImageImporter(self.data['logo'])
            logo.get_image()
            self.data['logo'] = logo.to_base64()

    def project__current_image(self):
        if self.data['current_image']:

            ### DEBUG ###
            import pdb
            pdb.set_trace()
            ### DEBUG ###

            logo = ImageImporter(self.data['current_image'])
            logo.get_image()
            self.data['current_image'] = logo.to_base64()


class Entity(object):
    """ An entity is made up of many Django model instances that together make up the representation of for example
    an RSR project
    The entity has one parent model that all other models refer to via a foreign key
    Object data:
        self.parent_model: the name of the parent model
        self.file_name: the source JSON file
        self.data: python representation of all model objects, it's as traight transform of the source JSON,
            a dict of dicts, each object is a dict with field names as keys and field values as values
        self.parent: RSRModelInstance object of the parent model
    """
    def __init__(self, host, api_token, file_name, parent_model):
        self.host = host
        self.api_token = api_token
        self.file_name = file_name
        self.parent_model = parent_model
        self.data = None
        self.parent = None

    def get_data(self):
        """ Load the json data for all objects
        """
        try:
            self.data = json.loads(self.json())
        except Exception, e:
            print "Can't load JSON, error message: {}".format(e.message)
            sys.exit()

    def json(self):
        if os.path.isabs(self.file_name):
            path = self.file_name
        else:
            path = os.path.join(os.path.dirname(os.path.realpath(__file__)), self.file_name)
        with open(path, 'r') as f:
            _json = f.read()
        assert _json != None, "JSON file missing, can't continue"
        return _json

    def create_parent(self):
        """ Create the parent model instance in RSR
            Use the response to record the ID of the parent for use by all the children
        """
        parent_data = self.data[self.parent_model]
        # delete the object so we can grab all other objects as children later
        del self.data[self.parent_model]
        self.parent = RSRModelInstance(self.host, self.api_token, self.parent_model, parent_data)
        self.parent.handle_special_fields()
        self.parent.send_to_rsr()
        self.parent.get_id()

    def create_children(self):
        """ Create child objects in RSR, using the ID of the parent to include the foregin key ID
            Ths works on the assumption that the foreign key field is named after the parent model name
        """
        FOREIGN_KEY_FIELDS = {"project_location": "location_target", "organisation_location": "location_target"}
        for model, objects in self.data.items():
            if not isinstance(objects, list):
                objects = [objects]
            for object in objects:
                child = RSRModelInstance(self.host, self.api_token, model, object)
                # look for a foreign key field that's not named after the related model
                fk_field = FOREIGN_KEY_FIELDS.get(model, self.parent_model)
                child.data[fk_field] = self.parent.id
                child.handle_special_fields()
                child.send_to_rsr()
                
    def run(self):
        self.get_data()
        self.create_parent()
        self.create_children()

def usage(script_name):
    print(
        "\nUsage: %s <host> <api key> <file> <parent model>\n\n"
        "  <host>            The host you are posting to, e.g. rsr.localdev.akvo.org\n"
        "  <api key>         Your Akvo account API key. To be found in your User profile\n"
        "  <file>            Relative or absolute path to the JSON file with the data to be uploaded\n"
        "  <parent model>    The RSR model parent model for this upload (Project or Organisation)\n\n"
        % script_name)

def get_script_args(argv):
    parser = optparse.OptionParser()
    options, args = parser.parse_args(argv)
    if len(args) < 5:
        usage(argv[0])
        sys.exit(2)
    args = args[1:]
    return args

if __name__ == '__main__':
    args = get_script_args(sys.argv)
    new_project = Entity(*args)
    new_project.run()
