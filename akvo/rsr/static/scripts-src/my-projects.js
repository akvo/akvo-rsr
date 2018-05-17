// Akvo RSR is covered by the GNU Affero General Public License.
// See more details in the license.txt file located at the root folder of the
// Akvo RSR module. For additional details on the GNU license please see
// < http://www.gnu.org/licenses/agpl.html >.

// DEFAULT VALUES
var defaultValues = JSON.parse(document.getElementById("default-values").innerHTML);

// CSRF TOKEN
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== "") {
        var cookies = document.cookie.split(";");
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == name + "=") {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

var csrftoken = getCookie("csrftoken");

function setError(message) {
    var errorNode = document.getElementById("projectCreationError");
    errorNode.innerHTML = message;
}

function setReportingOrg(projectId, partnerId) {
    var api_url = "/rest/v1/partnership/?format=json",
        request = new XMLHttpRequest();

    request.open("POST", api_url, true);
    request.setRequestHeader("X-CSRFToken", csrftoken);
    request.setRequestHeader("Content-type", "application/json");

    request.onload = function() {
        if (request.status == 201) {
            // Successfully created reporting organisation! Now log the project addition.
            logAddProject(projectId);
        } else {
            // We reached our target server, but it returned an error
            setError(
                defaultValues.could_not_add +
                    " " +
                    defaultValues.reporting_organisation +
                    ". " +
                    defaultValues.contact_us
            );
            return false;
        }
    };

    request.onerror = function() {
        // There was a connection error of some sort
        setError(defaultValues.connection_error);
        return false;
    };

    request.send(
        '{"project": ' +
            projectId +
            ', "organisation": ' +
            partnerId +
            ', "iati_organisation_role": 101}'
    );
}

function addCustomFieldToProject(data, callback) {
    var api_url = "/rest/v1/project_custom_field/?format=json",
        request = new XMLHttpRequest();

    request.open("POST", api_url, true);
    request.setRequestHeader("X-CSRFToken", csrftoken);
    request.setRequestHeader("Content-type", "application/json");

    request.onload = function() {
        if (request.status == 201) {
            // Successfully added the custom field!
            callback();
        } else {
            // We reached our target server, but it returned an error
            setError(
                defaultValues.could_not_add +
                    " " +
                    defaultValues.custom_fields +
                    ". " +
                    defaultValues.contact_us
            );
            return false;
        }
    };

    request.onerror = function() {
        // There was a connection error of some sort
        setError(defaultValues.connection_error);
        return false;
    };

    request.send(data);
}

function addCustomFieldsToProject(projectId) {
    var customFields = defaultValues.new_project_custom_fields,
        processedFieldsCount = 0;

    function countFields() {
        processedFieldsCount++;

        if (customFields.length === processedFieldsCount) {
            window.location = "/myrsr/project_editor/" + projectId + "/";
        }
    }

    if (customFields && customFields.length > 0) {
        for (var i = 0; i < customFields.length; i++) {
            var customField = customFields[i];
            customField.project = projectId;
            addCustomFieldToProject(JSON.stringify(customField), countFields);
        }
    } else {
        window.location = "/myrsr/project_editor/" + projectId + "/";
    }
}

function setCreateProjectOnClick() {
    var createProjectNode = document.getElementById("createProject");

    if (createProjectNode !== null) {
        createProjectNode.onclick = getCreateProject(createProjectNode);
    }
}

function logAddProject(projectId) {
    var api_url = "/rest/v1/project/" + projectId + "/log_project_addition/?format=json",
        request = new XMLHttpRequest();

    request.open("POST", api_url, true);
    request.setRequestHeader("X-CSRFToken", csrftoken);
    request.setRequestHeader("Content-type", "application/json");

    request.onload = function() {
        if (request.status == 201) {
            // Successfully logged project addition! Add custom fields.
            addCustomFieldsToProject(projectId);
        } else {
            // We reached our target server, but it returned an error
            setError(
                defaultValues.could_not_add +
                    " " +
                    defaultValues.project_log +
                    ". " +
                    defaultValues.contact_us
            );
            return false;
        }
    };

    request.onerror = function() {
        // There was a connection error of some sort
        setError(defaultValues.connection_error);
        return false;
    };

    request.send();
}

function getCreateProject(createProjectNode) {
    return function(e) {
        e.preventDefault();

        createProjectNode.setAttribute("disabled", "");

        var api_url = "/rest/v1/project/?format=json",
            request = new XMLHttpRequest();

        request.open("POST", api_url, true);
        request.setRequestHeader("X-CSRFToken", csrftoken);
        request.setRequestHeader("Content-type", "application/json");

        request.onload = function() {
            if (request.status == 201) {
                // Successfully created project!
                var response = JSON.parse(request.response),
                    projectId = response.id;

                // Set reporting partner by default
                var partners = defaultValues.employments;
                if (partners && partners.length > 0) {
                    setReportingOrg(projectId, partners[0]);
                }
            } else {
                // We reached our target server, but it returned an error
                setError(
                    defaultValues.could_not_add +
                        " " +
                        defaultValues.project +
                        ". " +
                        defaultValues.contact_us
                );
                return false;
            }
        };

        request.onerror = function() {
            // There was a connection error of some sort
            setError(defaultValues.connection_error);
            return false;
        };

        request.send('{"validations": [1]}');
    };
}

document.addEventListener("DOMContentLoaded", function() {
    setCreateProjectOnClick();
});

// Show hierarchy modals
var show_hierarchy = function(e) {
    e.stopPropagation();
    e.preventDefault();
    var url = $(e.target).data("project-url"),
        modal = $("#hierarchy-modal"),
        iframe = modal.find("iframe");
    modal.modal("hide");
    iframe.removeAttr("src");
    iframe.attr("src", url);
    iframe.attr("width", $(document).width());
    modal.modal("show");
};

$(function() {
    $(".hierarchy-link").click(show_hierarchy);
});
