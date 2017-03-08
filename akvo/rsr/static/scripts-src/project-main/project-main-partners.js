/** @jsx React.DOM */

// Akvo RSR is covered by the GNU Affero General Public License.
// See more details in the license.txt file located at the root folder of the
// Akvo RSR module. For additional details on the GNU license please see
// < http://www.gnu.org/licenses/agpl.html >.

var endpointsPartners,
    i18nPartners,
    projectIdPartners;

/* CSRF TOKEN (this should really be added in base.html, we use it everywhere) */
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
csrftoken = getCookie('csrftoken');

function renderPartnersTab() {
    var PartnersApp = React.createClass({displayName: 'PartnersApp',
        getInitialState: function() {
            return {
                partnerships: null
            };
        },

        componentDidMount: function() {
            var xmlHttp = new XMLHttpRequest();
            var url = endpointsPartners.base_url + endpointsPartners.partnerships_of_project.replace('{project}', projectIdPartners);
            var thisApp = this;
            xmlHttp.onreadystatechange = function() {
                if (xmlHttp.readyState == XMLHttpRequest.DONE && xmlHttp.status == 200) {
                    thisApp.setState({
                        partnerships: thisApp.processPartners(JSON.parse(xmlHttp.responseText).results)
                    });
                }
            };
            xmlHttp.open("GET", url, true);
            xmlHttp.send();
        },

        processPartners: function(partnerships) {
            // Store the partnerships per partner
            var store = {};
            for (var i = 0; i < partnerships.length; i++) {
                var partner = partnerships[i];
                if (partner.organisation !== null) {
                    if (partner.organisation.id in store) {
                        store[partner.organisation.id].push(partner);
                    } else {
                        store[partner.organisation.id] = [partner];
                    }
                }
            }
            return store;
        },

        orgLogo: function(logoUrl, width, height) {
            var logoStyle = {
                'max-width': width + 'px',
                'max-height': height + 'px'
            };

            if (logoUrl !== '') {
                return (
                    React.DOM.img( {src:logoUrl, style:logoStyle} )
                );
            } else {
                return (
                    React.DOM.img( {src:'/static/images/default-org-logo.jpg', style:logoStyle} )
                );
            }
        },

        compare: function(o1, o2) {
            var o1Name = o1[0].organisation.name;
            var o2Name = o2[0].organisation.name;
            if (o1Name < o2Name) {
                return -1;
            } else if (o1Name > o2Name) {
                return 1;
            } else {
                return 0;
            }
        },

        render: function() {
            if (this.state.partnerships === null) {
                return (
                    React.DOM.div(null, 
                        React.DOM.i( {className:"fa fa-spin fa-spinner"} ), " ", i18nPartners.loading, " ", i18nPartners.partners,"..."
                    )
                );
            } else {


                var partnershipsArray = [];
                for (var orgId in this.state.partnerships) {
                    if(this.state.partnerships.hasOwnProperty(orgId)) {
                        partnershipsArray.push(this.state.partnerships[orgId]);
                    }
                }
                var sortedPartnerships = partnershipsArray.sort(this.compare);

                var thisApp = this;
                var organisations = sortedPartnerships.map(function(partner) {
                    var roles = [];
                    for (var i = 0; i < partner.length; i++) {
                        if (roles.indexOf(partner[i].iati_organisation_role_label) < 0) {
                            roles.push(partner[i].iati_organisation_role_label);
                        }
                    }

                    return (
                        React.DOM.div( {className:"row verticalPadding projectPartners"}, 
                            React.DOM.div( {className:"col-sm-2 img"}, 
                                React.DOM.a( {href:'/en/organisation/' + partner[0].organisation.id + '/'}, 
                                    thisApp.orgLogo(partner[0].organisation.logo, 120, 120)
                                )
                            ),
                            React.DOM.div( {className:"col-sm-6"}, 
                                React.DOM.a( {href:'/en/organisation/' + partner[0].organisation.id + '/', className:"org-link"}, 
                                    React.DOM.i( {className:"fa fa-users"} ), " ", React.DOM.h2(null, partner[0].organisation.name)
                                )
                            ),
                            React.DOM.div( {className:"col-sm-4"}, 
                                React.DOM.h4( {className:"detailedInfo"}, i18nPartners.roles),
                                React.DOM.div(null, roles.join(', '))
                            )
                        )
                    );
                });

                return (
                    React.DOM.div(null, 
                        organisations
                    )
                );
            }
        }
    });

    // Initialise 'Partners' tab
    var partnersContainer = document.querySelector('section.projectPartners div.container');
    ReactDOM.render(
        React.createElement(PartnersApp),
        partnersContainer
    );
}

var loadJS = function(url, implementationCode, location){
    //url is URL of external file, implementationCode is the code
    //to be called from the file, location is the location to
    //insert the <script> element

    var scriptTag = document.createElement('script');
    scriptTag.src = url;

    scriptTag.onload = implementationCode;
    scriptTag.onreadystatechange = implementationCode;

    location.appendChild(scriptTag);
};

function loadAndRenderReact() {
    function loadReactDOM() {
        var reactDOMSrc = document.getElementById('react-dom').src;
        loadJS(reactDOMSrc, renderPartnersTab, document.body);
    }

    console.log('No React, load again.');
    var reactSrc = document.getElementById('react').src;
    loadJS(reactSrc, loadReactDOM, document.body);
}

/* Initialise page */
document.addEventListener('DOMContentLoaded', function() {
    // Load initial data
    endpointsPartners = JSON.parse(document.getElementById('data-endpoints').innerHTML);
    i18nPartners = JSON.parse(document.getElementById('partner-translations').innerHTML);
    projectIdPartners = JSON.parse(document.getElementById('default-values').innerHTML).project_id;

    // Check if React is loaded
    if (typeof React !== 'undefined' && typeof ReactDOM !== 'undefined') {
        // Render React components
        renderPartnersTab();
    } else {
        loadAndRenderReact();
    }
});
