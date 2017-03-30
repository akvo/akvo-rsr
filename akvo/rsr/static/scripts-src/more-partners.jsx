/** @jsx React.DOM */

// Akvo RSR is covered by the GNU Affero General Public License.
// See more details in the license.txt file located at the root folder of the
// Akvo RSR module. For additional details on the GNU license please see
// < http://www.gnu.org/licenses/agpl.html >.

var endpointsMorePartners,
    i18nMorePartners;

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

function loadMorePartners() {
    var MorePartnersToolTip = React.createClass({
        render: function() {
            var partnershipsArray = [];
            for (var orgId in this.props.partnerships) {
                if(this.props.partnerships.hasOwnProperty(orgId)) {
                    partnershipsArray.push(this.props.partnerships[orgId]);
                }
            }

            var thisTooltip = this;
            var arrayCount = 0;
            var organisations = partnershipsArray.map(function(partner) {
                arrayCount++;
                if (thisTooltip.props.primaryOrgId !== partner[0].organisation.id) {
                    var roles = [];
                    for (var i = 0; i < partner.length; i++) {
                        if (roles.indexOf(partner[i].iati_organisation_role_label) < 0) {
                            roles.push(partner[i].iati_organisation_role_label);
                        }
                    }

                    var splitLine;
                    if (arrayCount === partnershipsArray.length) {
                        splitLine = <span />;
                    } else {
                        splitLine = <hr />;
                    }

                    return (
                        <div className='extra-partner-entry'>
                            <a href={'/en/organisation/' + partner[0].organisation.id + '/'}>
                                {partner[0].organisation.long_name}
                            </a>
                            <br />
                            {roles.join(', ')}
                            {splitLine}
                        </div>
                    );
                }
            });

            return (
                <div className="tooltip right in">
                    <div className="tooltip-arrow"></div>
                    <div className="tooltip-inner">
                        {organisations}
                    </div>
                </div>
            );
        }
    });

    var MorePartnersApp = React.createClass({
        getInitialState: function() {
            return {
                hover: false,
                hoverClosing: false,
                partnerships: null
            };
        },

        componentDidMount: function() {
            var xmlHttp = new XMLHttpRequest();
            var thisApp = this;
            var element_id = 'more-partners-' + this.props.projectId;
            thisApp.setState({
                partnerships: thisApp.processPartners(JSON.parse(document.getElementById(element_id).innerHTML))
            });
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

        partnersCount: function() {
            var count = -1;
            var partners = this.state.partnerships;
            for (var k in partners) if (partners.hasOwnProperty(k)) ++count;
            return count;
        },

        handleMouseEnter: function() {
            this.setState({
                hover: true,
                hoverClosing: false
            });
        },

        handleMouseLeave: function() {
            if (this.state.hover) {
                var thisApp = this;

                this.setState({
                    hoverClosing: true
                });

                setTimeout(function() {
                    if (thisApp.state.hoverClosing){
                        thisApp.setState({
                            hover: false,
                            hoverClosing: false
                        });
                    }
                }, 3000);
            }
        },

        showTooltip: function() {
            if (this.state.hover) {
                return React.createElement(
                    MorePartnersToolTip, {
                        partnerships: this.state.partnerships,
                        primaryOrgId: this.props.primaryOrgId
                    });
            } else {
                return (
                    <span />
                );
            }
        },

        generateLink: function() {
            function showTab(tabClass) {
                // Copied from project-main.jsx
                var allTabs = document.querySelectorAll('.project-tab');
                var allTabLinks = document.querySelectorAll('.tab-link.selected');
                var activeTab = document.querySelector('.' + tabClass);
                var activeTabLink = document.querySelector('.tab-link[href="#' + tabClass + '"]');

                for (var i = 0; i < allTabs.length; i++) {
                    var tab = allTabs[i];

                    tab.style.display = 'none';
                }
                for (var j = 0; j < allTabLinks.length; j++) {
                    var tabLink = allTabLinks[j];

                    tabLink.classList.remove('selected');
                }

                activeTab.style.display = 'block';
                activeTabLink.classList.add('selected');
            }

            if (this.props.projectPage) {
                showTab('partners');
            } else {
                window.location.assign(window.location.pathname.substring(0, 4) + 'project/' + this.props.projectId + '#partners');
            }
        },

        render: function() {
            if (this.state.partnerships === null) {
                return (
                    <a href='#partners' onClick={this.generateLink} className="small moreLink tab-link">
                        <i className="fa fa-spin fa-spinner" /> {i18nMorePartners.partners}
                    </a>
                );
            } else if (this.partnersCount() > 0) {
                var partnersText = i18nMorePartners.partners;
                if (this.partnersCount() === 1) {
                    partnersText = i18nMorePartners.partner;
                }

                return (
                    <div>
                        <a href='#partners' onClick={this.generateLink} className="small moreLink tab-link" onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
                            + {this.partnersCount()} {partnersText}
                        </a>
                        {this.showTooltip()}
                    </div>
                );
            } else {
                return (
                    <span />
                );
            }
        }
    });

    // Initialize all 'More partners' instances
    var morePartnersContainers = document.querySelectorAll('.morePartners');
    for (var i = 0; i < morePartnersContainers.length; i++) {
        var node = morePartnersContainers[i];
        var projectId = node.getAttribute('projectId');
        var primaryOrgId = node.getAttribute('primaryOrgId');
        var projectPage = node.getAttribute('projectPage');

        ReactDOM.render(
            React.createElement(
                MorePartnersApp, {
                    projectId: parseInt(projectId),
                    primaryOrgId: parseInt(primaryOrgId),
                    projectPage: projectPage === "true"
                }),
            morePartnersContainers[i]
        );
    }
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
        loadJS(reactDOMSrc, loadMorePartners, document.body);
    }

    console.log('No React, load again.');
    var reactSrc = document.getElementById('react').src;
    loadJS(reactSrc, loadReactDOM, document.body);
}

/* Initialise */
document.addEventListener('DOMContentLoaded', function() {
    // Retrieve translations
    i18nMorePartners = JSON.parse(document.getElementById('more-link-translations').innerHTML);
    endpointsMorePartners = JSON.parse(document.getElementById('data-endpoints').innerHTML);

    // Check if React is loaded
    if (typeof React !== 'undefined' && typeof ReactDOM !== 'undefined') {
        loadMorePartners();
    } else {
        loadAndRenderReact();
    }
});
