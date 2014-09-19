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

from akvo.api_utils import Requester
from akvo.api_utils import ImageImporter


def data_from_json_reponse(request):
    return json.loads(request.response.text)


class NotFoundError(Exception):
    pass


class RSRModelInstance(object):
    """ Create model instances in RSR. Uses Requester to do the talking to the API
    """
    def __init__(self, host, api_token, model, data):
        """ Object data:
                self.host: the API host
                self.api_token: the RSR UserProfile API key
                self.model: the API name of the model
                self.data: the python dict representation of the instance
                self.response: the API response object
                self.error: if the API call results in an exception, the error message is stored here
        """
        self.host = host
        self.api_token = api_token
        self.model = model
        self.data = data
        self.response = None
        self.error = None

    def send_to_rsr(self):
        """ Determine if we're to POST or PUT and then do it
        """
        try:
            # TODO: maybe change to pk and lookup of pk field, but this requires RSR models introspection
            self.id = id = self.data.get('id', 0)
            if id:
                self.put_to_rsr(id)
            else:
                self.post_to_rsr()
            print self.response.response.text
        except Exception, e:
            print e.message
            self.error = e

    def post_to_rsr(self):
        self.response = Requester(
            'post',
            'http://{host}/rest/v1/{model}/',
            dict(host=self.host, model=self.model.lower()),
            headers={
                'Content-type': 'application/json',
                'Accept': 'application/json',
                'Encoding': 'utf-8',
                'Authorization': 'Token {}'.format(self.api_token),
            },
            data=json.dumps(self.data),
            accept_codes=[codes.created],
        )

    def put_to_rsr(self, id):
        self.response = Requester(
            'put',
            'http://{host}/rest/v1/{model}/{id}/',
            dict(host=self.host, model=self.model.lower(), id=id),
            headers={
                'Content-type': 'application/json',
                'Accept': 'application/json',
                'Encoding': 'utf-8',
                'Authorization': 'Token {}'.format(self.api_token),
            },
            data=json.dumps(self.data),
            accept_codes=[codes.ok],
        )

    def get_id(self):
        self.id = data_from_json_reponse(self.response)['id']

    def handle_special_fields(self):
        """ For each field check if there is a method defined based on the model and field names and run it.
        """
        for field in self.data.keys():
            field_method = getattr(self, "{model}__{field}".format(model=self.model, field=field), None)
            if field_method:
                field_method()

    ### Special fields methods

    def organisation__logo(self):
        """ The logo data should be either a URL to the image or a path to it on the local machine
            Use the ImageImporter to get the image and turn it into a base64 encoded string
        """
        if self.data['logo']:
            logo = ImageImporter(self.data['logo'])
            logo.get_image()
            self.data['logo'] = logo.to_base64()

    def project__current_image(self):
        """ The image data should be either a URL to the image or a path to it on the local machine
            Use the ImageImporter to get the image and turn it into a base64 encoded string
        """
        if self.data['current_image']:
            current_image = ImageImporter(self.data['current_image'])
            current_image.get_image()
            self.data['current_image'] = current_image.to_base64()


    def project_update__photo(self):
        """ The image data should be either a URL to the image or a path to it on the local machine
            Use the ImageImporter to get the image and turn it into a base64 encoded string
        """
        if self.data['photo']:
            photo = ImageImporter(self.data['photo'])
            photo.get_image()
            self.data['photo'] = photo.to_base64()


    def partnership__organisation(self):
        """ The Partnership object has two FKs, one to the Project and one to the Organisation. Since the Organisation
            may not exist when the JSON is created we need a way to lookup the Organisation from the API. This is done
            using the IATI organisation ID if it exists, and if not lookup of the organisation name is used.
            Note that currently Organisation.name isn't unique. This should be fixed.
        """
        def lookup_organisation(instance):
            request = Requester(
                url_template='http://{host}/rest/v1/{model}/?iati_org_id={iati_org_id}',
                url_args=dict(host=instance.host, model='organisation', iati_org_id=instance.data['organisation']),
                headers={
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                    'Encoding': 'utf-8',
                    'Authorization': 'Token {}'.format(instance.api_token),
                },
                accept_codes=[codes.ok],
            )
            if request.response.status_code == codes.ok:
                data = data_from_json_reponse(request)
                if data['count'] == 1:
                    return data['results'][0]['id']

            request = Requester(
                url_template='http://{host}/rest/v1/{model}/?name={name}',
                url_args=dict(host=instance.host, model='organisation', name=instance.data['organisation']),
                headers={
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                    'Encoding': 'utf-8',
                    'Authorization': 'Token {}'.format(instance.api_token),
                },
                accept_codes=[codes.ok],
            )
            if request.response.status_code == codes.ok:
                data = data_from_json_reponse(request)
                if data['count'] == 1:
                    return data['results'][0]['id']

            raise NotFoundError, 'Organisation not found, using filters "iati_org_id={}" and "name={}"'.format(
                instance.data['organisation'], instance.data['organisation']
            )

        organisation = self.data.get('organisation', False)
        if organisation:
            # if we have an integer ID we're happy
            if isinstance(organisation, int):
                return
            # otherwise try to get the ID from the API
            elif isinstance(organisation, (str, unicode)):
                id = lookup_organisation(self)
                if id:
                    self.data['organisation'] = id

    def lookup_organisation(self):

        ### DEBUG ###
        import pdb
        pdb.set_trace()
        ### DEBUG ###

        request = Requester(
            url_template='http://{host}/rest/v1/{model}/?iati_org_id={iati_org_id}',
            url_args=dict(host=self.host, model='organisation', iati_org_id=self.data['organisation']),
            headers={
                'Content-type': 'application/json',
                'Accept': 'application/json',
                'Encoding': 'utf-8',
                'Authorization': 'Token {}'.format(self.api_token),
            },
            accept_codes=[codes.ok],
        )
        if request.response.status_code == codes.ok:
            data = data_from_json_reponse(request)
            if data['count'] == 1:
                return data['results'][0]['id']

        request = Requester(
            url_template='http://{host}/rest/v1/{model}/?name={name}',
            url_args=dict(host=self.host, model='organisation', name=self.data['organisation']),
            headers={
                'Content-type': 'application/json',
                'Accept': 'application/json',
                'Encoding': 'utf-8',
                'Authorization': 'Token {}'.format(self.api_token),
            },
            accept_codes=[codes.ok],
        )
        if request.response.status_code == codes.ok:
            data = data_from_json_reponse(request)
            if data['count'] == 1:
                return data['results'][0]['id']

        raise NotFoundError, 'Organisation not found, using filters "iati_org_id={}" and "name={}"'.format(
            self.data['organisation'], self.data['organisation']
        )

    def partnership__organisation(self):
        organisation = self.data.get('organisation', False)
        if organisation:
            if isinstance(organisation, int):
                return
            elif isinstance(organisation, (str, unicode)):
                id = self.lookup_organisation()
                if id:
                    self.data['organisation'] = id


class Entity(object):
    """ The Entity represents many Django model instances that together make up a "real world" object such as an RSR
     project. The entity has one parent model that all other models refer to via a foreign key.
    """
    def __init__(self, host, api_token, file_name, parent_model):
        """ Object data
                self.host: the API host
                self.api_token: the RSR UserProfile API key
                self.file_name: the source JSON with the data to be uploaded
                self.parent_model: the name of the "parent" model, i.e. the model that all other objects refer to via FKs
                self.data: python representation of all model objects, it's as straight transform of the source JSON,
                    a dict of dicts, each object is a dict with field names as keys and field values as values
                self.parent: RSRModelInstance object of the parent model
        """
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
            self.data = json.loads(self.read_json())
        except Exception, e:
            print "Can't load JSON, error message: {}".format(e.message)
            sys.exit()

    def read_json(self):
        """ The actual reading of the file
        """
        if os.path.isabs(self.file_name):
            path = self.file_name
        else:
            path = os.path.join(os.path.dirname(os.path.realpath(__file__)), self.file_name)
        with open(path, 'r') as f:
            _json = f.read()
        assert _json != None, "JSON file missing, can't continue"
        return _json

    def create_parent(self):
        """ Create the parent model instance, both as part of the Entity and in RSR
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
        """ Create child objects. Use the ID of the parent to add the foreign key ID. This assumes the FK field is named
            after the parent model, which is true for all objects except locations
        """
        # The FK field to Project and Organisation are not named after their target models in locations
        FOREIGN_KEY_FIELDS = {"project_location": "location_target", "organisation_location": "location_target"}
        for model, objects in self.data.items():
            if not isinstance(objects, list):
                objects = [objects]
            for object in objects:
                child = RSRModelInstance(self.host, self.api_token, model, object)
                # check if the FK field is not named after the related model
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
    """ Using the OptionParser turned out to be overkill, since all options went out the window!
        Keeping it anyway it's a nice library.
    """
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
