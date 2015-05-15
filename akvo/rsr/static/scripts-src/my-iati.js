/** @jsx React.DOM */

// Akvo RSR is covered by the GNU Affero General Public License.
// See more details in the license.txt file located at the root folder of the
// Akvo RSR module. For additional details on the GNU license please see
// < http://www.gnu.org/licenses/agpl.html >.


function loadAsync(url, retryCount, retryLimit, label) {
    var xmlHttp;

    xmlHttp = new XMLHttpRequest();

    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == XMLHttpRequest.DONE) {

            if(xmlHttp.status == 200){
                processResponse(label, xmlHttp.responseText);
            } else {
                if (retryCount >= retryLimit) {
                    return;
                } else {
                    retryCount = retryCount + 1;
                    loadAsync(url, retryCount, retryLimit);
                }
            }
        } else {
            return;
        }
    };

    xmlHttp.open("GET", url, true);
    xmlHttp.send();
}

function processResponse(label, response) {
    var label_content, checks, all_checks_passed, span;

    label_content = label.innerHTML;
    checks = JSON.parse(response);

    all_checks_passed = checks.all_checks_passed;

    if (all_checks_passed === "True") {
        span = document.createElement("span");
        span.className = "success";
        span.innerHTML = label_content;

        label.innerHTML = '';
        label.appendChild(span);

    } else if (all_checks_passed === "False") {
        span = document.createElement("span");
        span.className = "error";
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

    return true;
}

function loadComponent(component_id) {
    var Container;

    Container = React.createClass({displayName: 'Container',
        getInitialState: function() {
            return {active_button: true};
        },

        handleClick: function() {
            this.setState({active_button: false});
            getProjectLabels();
        },

        render: function() {
            return (
                React.DOM.p(null, 
                React.DOM.div( {className:"row"}, 
                    React.DOM.div( {className:"col-md-8"}, 
                        "In order to see which of your projects is fully IATI compliant, you can"+' '+
                        "perform checks by clicking the \"Perform checks\" button. ", React.DOM.br(null),
                        "Projects with all mandatory IATI information filled in will be"+' '+
                        "marked ", React.DOM.span( {className:"success"}, "green"), " and projects with missing"+' '+
                        "information will be marked ", React.DOM.span( {className:"error"}, "red"),"."
                    ),
                    React.DOM.div( {className:"col-md-4"}, 
                        React.DOM.button( {onClick:this.handleClick, className:this.state.active_button ? 'btn btn-primary' : 'btn btn-primary disabled'}, 
                            this.state.active_button ? 'Perform checks' : 'Performing checks...'
                        )
                    )
                )
                )
                );
        }
    });

    React.render(
        Container(null ),
        document.getElementById(component_id)
    );
}

loadComponent('react_iati_checks');
