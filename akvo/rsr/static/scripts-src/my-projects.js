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

function addCustomFieldToProject(customField, projectId) {
    var api_url, request;

    // Create request
    api_url = '/rest/v1/project_custom_field/?format=json';

    request = new XMLHttpRequest();
    request.open('POST', api_url, true);
    request.setRequestHeader("X-CSRFToken", csrftoken);
    request.setRequestHeader("Content-type", "application/json");

    request.onload = function() {
        if (projectId == undefined) {
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
    try {
        var createProjectNode;

        createProjectNode = document.getElementById('createProject');
        createProjectNode.onclick = getCreateProject(createProjectNode);

    } catch (error) {
        // No create project button
        return false;
    }
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

                    addCustomFieldsToProject(projectId);
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

        // Set reporting partner by default
        partners = defaultValues.employments;

        if (partners.length === 1) {
            request.send('{"sync_owner": ' + partners[0] + '}');
        } else {
            request.send('{}');
        }

    };
}

$(document).ready(function() {
    setCreateProjectOnClick();
});
