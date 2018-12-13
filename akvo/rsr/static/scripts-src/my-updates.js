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

// display error message in empty div below title
function setError(message) {
    var errorNode = document.getElementById("projectUpdateError");
    errorNode.innerHTML = message;
}

// display confirmation message before deleting update
function confirmDeleteUpdate(node) {
    return function(e) {
        e.preventDefault();

        // check if delete button is enabled
        if ((" " + node.className + " ").indexOf(" disabled ") < 0) {
            var updateId = node.id.split("-")[1];
            var confirmId = "confirm-delete-" + updateId;

            var confirmNode = document.getElementById(confirmId);
            node.setAttribute("class", "delete-update disabled");

            var sureNode = document.createElement("span");
            sureNode.innerHTML = defaultValues.sure_message;

            var yesNode = document.createElement("a");
            yesNode.setAttribute("style", "color: green; margin-left: 5px;");
            yesNode.onclick = confirmDelete(yesNode, updateId);
            yesNode.innerHTML = defaultValues.yes;

            var noNode = document.createElement("a");
            noNode.setAttribute("style", "color: red; margin-left: 5px;");
            noNode.onclick = dismissConfirmationNo(sureNode, updateId);
            noNode.innerHTML = defaultValues.no;

            sureNode.appendChild(yesNode);
            sureNode.appendChild(noNode);
            confirmNode.appendChild(sureNode);
        }
    };
}

function dismissConfirmationNo(sureNode, updateId) {
    return function(e) {
        e.preventDefault();

        dismissConfirmation(sureNode, updateId);
    };
}

function dismissConfirmation(sureNode, updateId) {
    var parentNode = sureNode.parentNode;
    parentNode.removeChild(sureNode);

    var updateNodeId = "update-" + updateId;
    deleteButtonNode = document.getElementById(updateNodeId);
    deleteButtonNode.setAttribute("class", "delete-update");
}

function confirmDelete(yesNode, updateId) {
    return function(e) {
        e.preventDefault();
        var sureNode = yesNode.parentNode;
        sureNode.innerHTML = defaultValues.delete_progress;

        deleteUpdate(sureNode, updateId);
    };
}

// make api call to delete specified update
function deleteUpdate(sureNode, updateId) {
    var api_url = "/rest/v1/project_update/" + updateId + "/?format=json",
        request = new XMLHttpRequest();

    request.open("DELETE", api_url, true);
    request.setRequestHeader("X-CSRFToken", csrftoken);
    request.setRequestHeader("Content-type", "application/json");

    request.onload = function() {
        if (request.status >= 204 && request.status < 300) {
            // Successfully deleted update, remove container.
            removeUpdateContainer(updateId);
        } else if (request.status == 404) {
            // Update not found, most likely already deleted
            dismissConfirmation(sureNode, updateId);
            setError(defaultValues.error_delete);
        } else {
            // We reached our target server, but it returned an error
            dismissConfirmation(sureNode, updateId);
            setError(request.status + defaultValues.error_misc);
        }
    };

    request.onerror = function() {
        // There was a connection error of some sort
        setError(defaultValues.error_connection);
        return false;
    };

    request.send();
}

// remove update from screen once it has been delete
function removeUpdateContainer(updateId) {
    var nodeId = "update-" + updateId + "-container";
    var removeNode = document.getElementById(nodeId);
    var parentNode = removeNode.parentNode;
    parentNode.removeChild(removeNode);
}

// add onlick to all delete buttons
function setDeleteUpdateOnClick() {
    var deleteUpdateNodes = document.querySelectorAll(".delete-update");

    if (deleteUpdateNodes !== null) {
        for (var i = 0; i < deleteUpdateNodes.length; i++) {
            deleteUpdateNodes[i].onclick = confirmDeleteUpdate(deleteUpdateNodes[i]);
        }
    }
}

document.addEventListener("DOMContentLoaded", function() {
    setDeleteUpdateOnClick();
});
