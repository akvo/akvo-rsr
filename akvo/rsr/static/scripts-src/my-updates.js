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

function setError(message) {
    var errorNode = document.getElementById('projectUpdateError');
    errorNode.innerHTML = message;
}

function confirmDeleteUpdate(node) {
    return function(e) {
        e.preventDefault();

        // check if delete button is enabled
        if ((' ' + node.className + ' ').indexOf(' disabled ') == -1) {

            var updateId = node.id.split('-')[1];
            var confirmId = 'confirm-delete-' + updateId;

            // Show warning first
            var confirmNode = document.getElementById(confirmId);
            node.setAttribute('class', 'delete-update disabled');

            var sureNode = document.createElement('span');
            sureNode.innerHTML = defaultValues.sure_message;

            var yesNode = document.createElement('a');
            yesNode.setAttribute('style', 'color: green; margin-left: 5px;');
            yesNode.onclick = confirmDelete(yesNode, updateId);
            yesNode.innerHTML = defaultValues.yes;

            var noNode = document.createElement('a');
            noNode.setAttribute('style', 'color: red; margin-left: 5px;');
            noNode.onclick = dismissDelete(noNode, updateId);
            noNode.innerHTML = defaultValues.no;

            sureNode.appendChild(yesNode);
            sureNode.appendChild(noNode);
            confirmNode.appendChild(sureNode);

        }

    };
}

function dismissDelete(noNode, updateId) {
    return function(e) {
        e.preventDefault();
        var sureNode = noNode.parentNode;
        var parentNode = sureNode.parentNode;
        parentNode.removeChild(sureNode);

        var updateNodeId = 'update-' + updateId;
        deleteButtonNode =  document.getElementById(updateNodeId);
        deleteButtonNode.setAttribute('class', 'delete-update');
    };
}

function confirmDelete(yesNode, updateId) {
    return function(e) {
        e.preventDefault();
        var sureNode = yesNode.parentNode;
        var parentNode = sureNode.parentNode;
        parentNode.removeChild(sureNode);

        deleteUpdate(updateId);
    };
}

function deleteUpdate(updateId) {

    var api_url = '/rest/v1/project_update/' + updateId + '/?format=json',
        request = new XMLHttpRequest();

    request.open('DELETE', api_url, true);
    request.setRequestHeader("X-CSRFToken", csrftoken);
    request.setRequestHeader("Content-type", "application/json");

    request.onload = function() {
        if (request.status >= 204 && request.status < 300) {
            // Successfully created reporting organisation! Now log the project addition.
            console.log(request.status);
            removeUpdateContainer(updateId);
        } else if (request.status == 404) {
            setError('Update not deleted because it was not found.');
        } else {
            // We reached our target server, but it returned an error
            setError(request.status);
            return false;
        }
    };

    request.onerror = function() {
        // There was a connection error of some sort
        setError('Connection error');
        return false;
    };

    request.send();
}

function removeUpdateContainer(updateId) {
    var nodeId = 'update-' + updateId + '-container';
    var removeNode = document.getElementById(nodeId);
    var parentNode = removeNode.parentNode;
    parentNode.removeChild(removeNode);
}

function setDeleteUpdateOnClick() {
    var deleteUpdateNodes = document.querySelectorAll('.delete-update');

    if (deleteUpdateNodes !== null) {
        for (var i = 0; i < deleteUpdateNodes.length; i++) {
            deleteUpdateNodes[i].onclick = confirmDeleteUpdate(deleteUpdateNodes[i]);
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    setDeleteUpdateOnClick();
});
