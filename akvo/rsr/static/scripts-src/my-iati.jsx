/** @jsx React.DOM */

// Akvo RSR is covered by the GNU Affero General Public License.
// See more details in the license.txt file located at the root folder of the
// Akvo RSR module. For additional details on the GNU license please see
// < http://www.gnu.org/licenses/agpl.html >.

var i18n;

function loadAsync(url, retryCount, retryLimit, label) {
    var xmlHttp;

    xmlHttp = new XMLHttpRequest();

    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == XMLHttpRequest.DONE) {

            if(xmlHttp.status == 200){
                processResponse(label, xmlHttp.responseText);
                return true;
            } else {
                if (retryCount >= retryLimit) {
                    return false;
                } else {
                    retryCount = retryCount + 1;
                    loadAsync(url, retryCount, retryLimit);
                }
            }
        } else {
            return false;
        }
    };

    xmlHttp.open("GET", url, true);
    xmlHttp.send();
}

function processResponse(label, response) {
    var label_content, checks, all_checks_passed, span, checks_response;

    label_content = label.innerHTML.replace("noCheck", "");
    checks = JSON.parse(response);

    all_checks_passed = checks.all_checks_passed;
    checks_response = checks.checks;

    if (all_checks_passed === "True") {
        span = document.createElement("span");
        span.className = "success";
        span.innerHTML = label_content;

        label.innerHTML = '';
        label.appendChild(span);

    } else {
        span = document.createElement("span");
        span.className = "error";
        label_content += "<br/>";
        for (var i = 0; i < checks_response.length; i++) {
            if (checks_response[i][0] === "error") {
                label_content += "- " + checks_response[i][1] + "<br/>";
            }
        }
        span.innerHTML = label_content;

        label.innerHTML = '';
        label.appendChild(span);
    }
}

function getProjectLabels() {
    var labels;

    labels = document.getElementById('id_projects').getElementsByTagName('label');

    for (var i = 0; i < labels.length; i++) {
        var project_id;

        project_id = labels[i].getElementsByTagName('input')[0].value;
        loadAsync('/rest/v1/project_iati_check/' + project_id + '/?format=json', 0, 3, labels[i]);
    }
}

function loadComponent(component_id) {
    var Container;

    Container = React.createClass({
        getInitialState: function() {
            return {active_button: true};
        },

        handleClick: function() {
            this.setState({active_button: false});
            getProjectLabels();
        },

        render: function() {
            if (this.state.active_button) {
                return (
                    <p>
                        <button onClick={this.handleClick} className='btn btn-primary'>{i18n.perform_checks}</button>
                    </p>
                    );
            } else {
                return (
                    <p></p>
                    );
            }
        }
    });

    React.render(
        <Container />,
        document.getElementById(component_id)
    );
}

i18n = JSON.parse(document.getElementById("perform-checks-text").innerHTML);
if (document.getElementById('react_iati_checks')) {
    loadComponent('react_iati_checks');
}
