// Akvo RSR is covered by the GNU Affero General Public License.
// See more details in the license.txt file located at the root folder of the
// Akvo RSR module. For additional details on the GNU license please see
// < http://www.gnu.org/licenses/agpl.html >.

// DEFAULT VALUES
var defaultValues = JSON.parse(document.getElementById("default-values").innerHTML);

// CSRF TOKEN
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

var csrftoken = getCookie('csrftoken');

function setReportingOrg(projectId, partnerId) {
    var api_url, request;

    // Create request
    api_url = '/rest/v1/partnership/?format=json';

    request = new XMLHttpRequest();
    request.open('POST', api_url, true);
    request.setRequestHeader("X-CSRFToken", csrftoken);
    request.setRequestHeader("Content-type", "application/json");

    request.onload = function() {
        return false;
    };

    request.send('{"project": ' + projectId + ', "organisation": ' + partnerId + ', "iati_organisation_role": 101}');
}

function addCustomFieldToProject(customField, projectId) {
    var api_url, request;

    // Create request
    api_url = '/rest/v1/project_custom_field/?format=json';

    request = new XMLHttpRequest();
    request.open('POST', api_url, true);
    request.setRequestHeader("X-CSRFToken", csrftoken);
    request.setRequestHeader("Content-type", "application/json");

    request.onload = function() {
        if (projectId === undefined) {
            return false;
        } else {
            window.location = '/myrsr/project_editor/' + projectId + '/';
        }
    };

    request.onerror = function() {
        return false;
    };

    request.send(customField);
}

function addCustomFieldsToProject(projectId) {
    var customFields;

    customFields = defaultValues.new_project_custom_fields;

    if (customFields.length === 0) {
        window.location = '/myrsr/project_editor/' + projectId + '/';
    } else {
        for (var i = 0; i < customFields.length; i++) {
            customFields[i].project = projectId;

            if (i !== customFields.length - 1) {
                addCustomFieldToProject(JSON.stringify(customFields[i]));
            } else {
                addCustomFieldToProject(JSON.stringify(customFields[i]), projectId);
            }
        }
    }
}

function setCreateProjectOnClick() {
    var createProjectNode = document.getElementById('createProject');

    if (createProjectNode !== null) {
        createProjectNode.onclick = getCreateProject(createProjectNode);
    }
}

function logAddProject(projectId) {
    var api_url, request;

    // Create request
    api_url = '/rest/v1/project/' + projectId + '/log_project_addition/?format=json';

    request = new XMLHttpRequest();
    request.open('POST', api_url, true);
    request.setRequestHeader("X-CSRFToken", csrftoken);
    request.setRequestHeader("Content-type", "application/json");
    request.send();
}

function getCreateProject(createProjectNode) {
    return function(e) {
        e.preventDefault();

        createProjectNode.setAttribute('disabled', '');

        var api_url, request, partners;

        // Create request
        api_url = '/rest/v1/project/?format=json';

        request = new XMLHttpRequest();
        request.open('POST', api_url, true);
        request.setRequestHeader("X-CSRFToken", csrftoken);
        request.setRequestHeader("Content-type", "application/json");

        request.onload = function() {
            if (request.status == 201) {
                // Successfully created project!
                var response, projectId;

                try {
                    response = JSON.parse(request.response);
                    projectId = response.id;

                    // Set reporting partner by default
                    partners = defaultValues.employments;
                    if (partners.length > 0) {
                        setReportingOrg(projectId, partners[0]);
                    }

                    addCustomFieldsToProject(projectId);
                    logAddProject(projectId);
                } catch (error) {
                    // Something went wrong while parsing the response
                    createProjectNode.removeAttribute('disabled');
                }

                return false;
            } else {
                // We reached our target server, but it returned an error
                createProjectNode.removeAttribute('disabled');
                return false;
            }
        };

        request.onerror = function() {
            // There was a connection error of some sort
            createProjectNode.removeAttribute('disabled');
            return false;
        };

        request.send('{"validations": [1]}');
    };
}

document.addEventListener('DOMContentLoaded', function() {
    setCreateProjectOnClick();
});
