// Akvo RSR is covered by the GNU Affero General Public License.
// See more details in the license.txt file located at the root folder of the
// Akvo RSR module. For additional details on the GNU license please see
// < http://www.gnu.org/licenses/agpl.html >.

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

function deleteUpdate(updateId) {
    return function(e) {
        e.preventDefault();

        var api_url = '/rest/v1/project_update/' + updateId + '/?format=json',
            request = new XMLHttpRequest();

        request.open('DELETE', api_url, true);
        request.setRequestHeader("X-CSRFToken", csrftoken);
        request.setRequestHeader("Content-type", "application/json");

        request.onload = function() {
            if (request.status == 204) {
                // Successfully created reporting organisation! Now log the project addition.
                console.log(request.status)
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
    };
}

function setDeleteUpdateOnClick() {
    var deleteUpdateNodes = document.querySelectorAll('.deleteUpdate');
    console.log(deleteUpdateNodes)

    if (deleteUpdateNodes !== null) {
        for (var i = 0; i < deleteUpdateNodes.length; i++) {
            var updateId = deleteUpdateNodes[i].id.split('-')[1]
            console.log(updateId)
            deleteUpdateNodes[i].onclick = deleteUpdate(updateId);
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    setDeleteUpdateOnClick();
});
