/** @jsx React.DOM */

// Akvo RSR is covered by the GNU Affero General Public License.
// See more details in the license.txt file located at the root folder of the
// Akvo RSR module. For additional details on the GNU license please see
// < http://www.gnu.org/licenses/agpl.html >.

var Carousel,
    CarouselItem,
    defaultValues,
    i18n;

function renderReactComponents() {
    var IndicatorPeriodValue = React.createClass({displayName: 'IndicatorPeriodValue',
        render: function() {
            var target_value = this.props.indicator.target_value;
            var actual_value = this.props.indicator.actual_value;

            if (actual_value === undefined) {
                actual_value = '';
            }

            if (target_value === undefined) {
                target_value = '';
            }

            return (actual_value !== '' && target_value !== '') ? (
                React.DOM.span(null, 
                    ": ", React.DOM.i(null, actual_value, " (",i18n.actual_text,") / ", target_value, " (",i18n.target_text,")")
                )
            ) : actual_value !== '' ? (
                React.DOM.span(null, 
                    ": ", React.DOM.i(null, actual_value, " (",i18n.actual_text,")")
                )
            ) : target_value !== '' ? (
                React.DOM.span(null, 
                    ": ", React.DOM.i(null, target_value, " (",i18n.target_text,")")
                )
            ) : (
                React.DOM.span(null )
            );
        }
    });

    var IndicatorPeriod = React.createClass({displayName: 'IndicatorPeriod',
        render: function () {
            var period_start = this.props.indicator.period_start;
            var period_end = this.props.indicator.period_end;

            if (period_start === undefined && period_end === undefined) {
                return (
                    React.DOM.span(null )
                );
            }

            if (period_start === undefined) {
                period_start = i18n.start_date_unknown_text;
            } else if (period_end === undefined) {
                period_end = i18n.end_date_unknown_text;
            }

            return (
                React.DOM.span(null, 
                    " (",period_start, " - ", period_end,")"
                )
            );
        }
    });

    var Indicator = React.createClass({displayName: 'Indicator',
        render: function () {
            return this.props.indicator.title ? (
                React.DOM.div(null, 
                    this.props.indicator.title,
                    React.createElement(IndicatorPeriod, {indicator: this.props.indicator}),
                    React.createElement(IndicatorPeriodValue, {indicator: this.props.indicator})
                )
            ) : (
                React.DOM.span(null )
            );
        }
    });

    var Result = React.createClass({displayName: 'Result',
        render: function () {
            var indicators = this.props.result.indicators.map(function(indicator) {
                return (
                    React.createElement(Indicator, {key: indicator.id, indicator: indicator})
                );
            });
            return (
                React.DOM.span(null, 
                    React.DOM.li(null, React.DOM.i( {className:"fa fa-check"} ), " ", React.DOM.strong(null, this.props.result.title)),
                    React.DOM.dl( {className:"indicator-descriptions"}, indicators)
                )
            );
        }
    });

    var ResultList = React.createClass({displayName: 'ResultList',
        render: function () {
            var results = this.props.results.map(function(result) {
                return (
                    React.createElement(Result, {key: result.id, result: result})
                );
            });
            return (
                React.DOM.ul( {className:"list-unstyled"}, results)
            );
        }
    });

    var AccordionPanel = React.createClass({displayName: 'AccordionPanel',
        handleClick: function() {
            this.props.changeOpened(this.props.panelClass);
            return false;
        },

        opened: function() {
            return this.props.panelClass === this.props.opened;
        },

        render: function() {
            var panelClass = "panel panel-default " + this.props.panelClass,
                headerCollapse,
                panelCollapse,
                panelStyle;

            if (this.opened()) {
                headerCollapse = '';
                panelCollapse = 'panel-collapse';
                panelStyle = {};
            } else {
                headerCollapse = 'collapsed';
                panelCollapse = 'panel-collapse collapse';
                panelStyle = {height: '0px'};
            }

            return (
                React.DOM.div( {className:panelClass}, 
                    React.DOM.div( {className:"panel-heading"}, 
                        React.DOM.h4( {className:"panel-title"}, 
                            React.DOM.a( {href:"", className:headerCollapse, onClick:this.handleClick}, 
                                this.props.header
                            )
                        )
                    ),
                    React.DOM.div( {className:panelCollapse, style:panelStyle}, 
                        React.DOM.div( {className:"panel-body"}, 
                            this.props.content
                        )
                    )
                )
            );
        }
    });

    var AccordionInstance = React.createClass({displayName: 'AccordionInstance',
        getInitialState: function() {
            if (this.props.source.background !== undefined) {
                return {opened: "background"};
            } else if (this.props.source.current_status !== undefined) {
                return {opened: "current_status"};
            } else if (this.props.source.goals_overview !== undefined) {
                return {opened: "goals_overview"};
            } else if (this.props.source.project_plan !== undefined) {
                return {opened: "project_plan"};
            } else if (this.props.source.sustainability !== undefined) {
                return {opened: "sustainability"};
            } else if (this.props.source.target_group !== undefined) {
                return {opened: "target_group"};
            } else if (this.props.source.results !== undefined) {
                return {opened: "result"};
            } else {
                return {opened: null};
            }
        },

        changeOpened: function(key) {
            this.setState({
                opened: this.state.opened === key ? null : key
            });
        },

        splitLines: function(text) {
            var i = 0;
            return text.match(/[^\r\n]+/g).map(function(line) {
                return (
                    React.DOM.p( {key:i++}, line)
                );
            });
        },

        render: function() {
            var background = this.props.source.background || null,
                current_status = this.props.source.current_status || null,
                goals_overview = this.props.source.goals_overview || null,
                project_plan = this.props.source.project_plan || null,
                sustainability = this.props.source.sustainability || null,
                target_group = this.props.source.target_group || null,
                results = this.props.source.results || null;

            if (background !== null) {
                background = React.createElement(AccordionPanel, {
                    opened: this.state.opened,
                    changeOpened: this.changeOpened,
                    content: this.splitLines(background),
                    panelClass: "background",
                    header: i18n.background_text
                });
            }

            if (current_status !== null) {
                current_status = React.createElement(AccordionPanel, {
                    opened: this.state.opened,
                    changeOpened: this.changeOpened,
                    content: this.splitLines(current_status),
                    panelClass: "current_status",
                    header: i18n.current_situation_text
                });
            }

            if (goals_overview !== null) {
                goals_overview = React.createElement(AccordionPanel, {
                    opened: this.state.opened,
                    changeOpened: this.changeOpened,
                    content: this.splitLines(goals_overview),
                    panelClass: "goals_overview",
                    header: i18n.goals_overview_text
                });
            }

            if (project_plan !== null) {
                project_plan = React.createElement(AccordionPanel, {
                    opened: this.state.opened,
                    changeOpened: this.changeOpened,
                    content: this.splitLines(project_plan),
                    panelClass: "project_plan",
                    header: i18n.project_plan_text
                });
            }

            if (sustainability !== null) {
                sustainability = React.createElement(AccordionPanel, {
                    opened: this.state.opened,
                    changeOpened: this.changeOpened,
                    content: this.splitLines(sustainability),
                    panelClass: "sustainability",
                    header: i18n.sustainability_text
                });
            }

            if (target_group !== null) {
                target_group = React.createElement(AccordionPanel, {
                    opened: this.state.opened,
                    changeOpened: this.changeOpened,
                    content: this.splitLines(target_group),
                    panelClass: "target_group",
                    header: i18n.target_group_text
                });
            }

            if (results !== null) {
                var resultsContent = React.createElement(ResultList, {results: results});
                results = React.createElement(AccordionPanel, {
                    opened: this.state.opened,
                    changeOpened: this.changeOpened,
                    content: resultsContent,
                    panelClass: "result",
                    header: i18n.results_text
                });
            }

            return (
                React.DOM.div( {className:"panel-group"}, 
                    background,
                    current_status,
                    project_plan,
                    target_group,
                    sustainability,
                    goals_overview,
                    results
                )
            );
        }
    });

    var CarouselInstance = React.createClass({displayName: 'CarouselInstance',
        render: function() {
            var photos = this.props.source.photos.map(function (photo) {
                var photoCaption = React.createElement('h4', null, photo.caption);
                var photoCredit = React.createElement('p', null, photo.credit);
                var carouselCaption = React.createElement('div', {className: "carousel-caption"}, photoCaption, photoCredit);
                var photoImage = React.createElement('img', {src: photo.url});
                var photoLink = React.createElement('a', {target: '_blank', href: photo.direct_to_url}, photoImage);

                return (
                    React.createElement(CarouselItem, {key: photo.url}, photoLink, carouselCaption)
                );
            });
            return (React.createElement(Carousel, null, photos));
        }
    });

    function renderAccordion() {
        ReactDOM.render(
            React.createElement(AccordionInstance, {
                source: JSON.parse(document.getElementById("akvo-rsr-accordion").innerHTML)
            }),
            document.getElementById('accordion')
        );
    }

    function renderCarousel() {
        ReactDOM.render(
            React.createElement(CarouselInstance, {
                source: JSON.parse(document.getElementById("akvo-rsr-carousel").innerHTML)
            }),
            document.getElementById('carousel')
        );
    }

    renderAccordion();
    renderCarousel();
}

function readMoreOnClicks() {
    function setReadMore(show, hide) {
        return function (e) {
            e.preventDefault();
            hide.classList.add('hidden');
            show.classList.remove('hidden');
        };
    }

    var summaryReadMore = document.getElementById('summary-truncated').querySelector('.read-more');
    var summaryReadLess = document.getElementById('summary-full').querySelector('.read-less');
    if (summaryReadMore !== null && summaryReadLess !== null) {
        summaryReadMore.onclick = setReadMore(summaryReadLess.parentNode, summaryReadMore.parentNode);
        summaryReadLess.onclick = setReadMore(summaryReadMore.parentNode, summaryReadLess.parentNode);
    }
}

function showTab(tabClass) {
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

function setTabOnClicks(tab) {
    tab.addEventListener('click', function () {
        var tabClass = this.getAttribute('href');

        // Remove the '#' from the href
        tabClass = tabClass.substring(1);
        showTab(tabClass);
    });
}

function setTabsOnClicks() {
    var allTabs = document.querySelectorAll('.tab-link');
    for (var i = 0; i < allTabs.length; i++) {
        setTabOnClicks(allTabs[i]);
    }
}

function readTabFromFragment() {
    var fragment = window.location.hash;
    var parameters = window.location.search;

    if (fragment || parameters.indexOf('?page') > -1) {
        if (parameters.indexOf('?page') > -1) {
            // KB: Hack, only the updates tab has a 'page' parameter
            fragment = 'updates';
        } else {
            // Remove the '#' from the fragment
            fragment = fragment.substring(1);
        }

        if (fragment === 'summary' || fragment === 'report' || fragment === 'finance') {
            showTab(fragment);
        } else if (fragment === 'partners' && defaultValues.show_partners_tab) {
            showTab(fragment);
        } else if (fragment === 'updates' && defaultValues.show_updates_tab) {
            showTab(fragment);
        } else {
            showTab('summary');
        }
    } else {
        showTab('summary');
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
    function loadGlobalsAndInit() {
        Carousel = ReactBootstrap.Carousel;
        CarouselItem = ReactBootstrap.CarouselItem;

        renderReactComponents();
    }

    function loadReactBootstrap() {
        var reactBootstrapSrc = document.getElementById('react-bootstrap').src;
        loadJS(reactBootstrapSrc, loadGlobalsAndInit, document.body);
    }

    function loadReactDOM() {
        var reactDOMSrc = document.getElementById('react-dom').src;
        loadJS(reactDOMSrc, loadReactBootstrap, document.body);
    }

    console.log('No React, load again.');
    var reactSrc = document.getElementById('react').src;
    loadJS(reactSrc, loadReactDOM, document.body);
}

/* Initialise page */
document.addEventListener('DOMContentLoaded', function() {
    // Load initial data
    i18n = JSON.parse(document.getElementById("project-main-text").innerHTML);
    defaultValues = JSON.parse(document.getElementById("default-values").innerHTML);

    // Setup project tabs
    setTabsOnClicks();
    readTabFromFragment();
    readMoreOnClicks();

    // Check if React is loaded
    if (typeof React !== 'undefined' && typeof ReactDOM !== 'undefined' && typeof ReactBootstrap !== 'undefined') {
        // Render React components
        renderReactComponents();
    } else {
        loadAndRenderReact();
    }
});