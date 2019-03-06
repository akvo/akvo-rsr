// Akvo RSR is covered by the GNU Affero General Public License.
// See more details in the license.txt file located at the root folder of the
// Akvo RSR module. For additional details on the GNU license please see
// < http://www.gnu.org/licenses/agpl.html >.

var Carousel, CarouselItem, defaultValues, i18n;

function renderReactComponents() {
    // Load globals
    Carousel = ReactBootstrap.Carousel;
    CarouselItem = ReactBootstrap.CarouselItem;

    var IndicatorPeriodValue = React.createClass({
        render: function() {
            var target_value = this.props.indicator.target_value;
            var actual_value = this.props.indicator.actual_value;

            if (actual_value === undefined) {
                actual_value = "";
            }

            if (target_value === undefined) {
                target_value = "";
            }

            return actual_value !== "" && target_value !== "" ? (
                <span>
                    :{" "}
                    <i>
                        {actual_value} ({i18n.actual_text}) / {target_value} ({i18n.target_text})
                    </i>
                </span>
            ) : actual_value !== "" ? (
                <span>
                    :{" "}
                    <i>
                        {actual_value} ({i18n.actual_text})
                    </i>
                </span>
            ) : target_value !== "" ? (
                <span>
                    :{" "}
                    <i>
                        {target_value} ({i18n.target_text})
                    </i>
                </span>
            ) : (
                <span />
            );
        }
    });

    var IndicatorPeriod = React.createClass({
        render: function() {
            var period_start = this.props.indicator.period_start;
            var period_end = this.props.indicator.period_end;

            if (period_start === undefined && period_end === undefined) {
                return <span />;
            }

            if (period_start === undefined) {
                period_start = i18n.start_date_unknown_text;
            } else if (period_end === undefined) {
                period_end = i18n.end_date_unknown_text;
            }

            return (
                <span>
                    &nbsp;(
                    {period_start} - {period_end})
                </span>
            );
        }
    });

    var Indicator = React.createClass({
        render: function() {
            return this.props.indicator.title ? (
                <div>
                    {this.props.indicator.title}
                    {React.createElement(IndicatorPeriod, { indicator: this.props.indicator })}
                    {React.createElement(IndicatorPeriodValue, { indicator: this.props.indicator })}
                </div>
            ) : (
                <span />
            );
        }
    });

    var Result = React.createClass({
        render: function() {
            var indicators = this.props.result.indicators.map(function(indicator) {
                return React.createElement(Indicator, { key: indicator.id, indicator: indicator });
            });
            return (
                <span>
                    <li>
                        <i className="fa fa-check" /> <strong>{this.props.result.title}</strong>
                    </li>
                    <dl className="indicator-descriptions">{indicators}</dl>
                </span>
            );
        }
    });

    var ResultList = React.createClass({
        render: function() {
            var results = this.props.results.map(function(result) {
                return React.createElement(Result, { key: result.id, result: result });
            });
            return <ul className="list-unstyled">{results}</ul>;
        }
    });

    var AccordionPanel = React.createClass({
        getInitialState: function() {
            // KB: Workaround, since i18n seems to change.
            return {
                background_text: i18n.background_text,
                current_situation_text: i18n.current_situation_text,
                goals_overview_text: i18n.goals_overview_text,
                project_plan_text: i18n.project_plan_text,
                sustainability_text: i18n.sustainability_text,
                target_group_text: i18n.target_group_text,
                results_text: i18n.results_text
            };
        },

        handleClick: function() {
            this.props.changeOpened(this.props.panelClass);
        },

        opened: function() {
            return this.props.panelClass === this.props.opened;
        },

        header: function() {
            switch (this.props.panelClass) {
                case "background":
                    return this.state.background_text;
                case "current_status":
                    return this.state.current_situation_text;
                case "goals_overview":
                    return this.state.goals_overview_text;
                case "project_plan":
                    return this.state.project_plan_text;
                case "sustainability":
                    return this.state.sustainability_text;
                case "target_group":
                    return this.state.target_group_text;
                case "result":
                    return this.state.results_text;
                default:
                    return "";
            }
        },

        render: function() {
            var panelClass = "panel panel-default " + this.props.panelClass,
                headerCollapse,
                panelCollapse,
                panelStyle;

            if (this.opened()) {
                headerCollapse = "";
                panelCollapse = "panel-collapse";
                panelStyle = {};
            } else {
                headerCollapse = "collapsed";
                panelCollapse = "panel-collapse collapse";
                panelStyle = { height: "0px" };
            }

            var htmlContent = { __html: micromarkdown.parse(this.props.content) };

            return (
                <div className={panelClass}>
                    <div className="panel-heading">
                        <h4 className="panel-title">
                            <a className={headerCollapse} onClick={this.handleClick}>
                                {this.header()}
                            </a>
                        </h4>
                    </div>
                    <div className={panelCollapse} style={panelStyle}>
                        <div className="panel-body" dangerouslySetInnerHTML={htmlContent} />
                    </div>
                </div>
            );
        }
    });

    var AccordionInstance = React.createClass({
        getInitialState: function() {
            if (this.props.source.background !== "") {
                return { opened: "background" };
            } else if (this.props.source.current_status !== "") {
                return { opened: "current_status" };
            } else if (this.props.source.goals_overview !== "") {
                return { opened: "goals_overview" };
            } else if (this.props.source.project_plan !== "") {
                return { opened: "project_plan" };
            } else if (this.props.source.sustainability !== "") {
                return { opened: "sustainability" };
            } else if (this.props.source.target_group !== "") {
                return { opened: "target_group" };
            } else if (this.props.source.results !== "") {
                return { opened: "result" };
            } else {
                return { opened: "" };
            }
        },

        changeOpened: function(panelClass) {
            this.setState({
                opened: this.state.opened === panelClass ? "" : panelClass
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
                    content: background,
                    panelClass: "background"
                });
            }

            if (current_status !== null) {
                current_status = React.createElement(AccordionPanel, {
                    opened: this.state.opened,
                    changeOpened: this.changeOpened,
                    content: current_status,
                    panelClass: "current_status"
                });
            }

            if (goals_overview !== null) {
                goals_overview = React.createElement(AccordionPanel, {
                    opened: this.state.opened,
                    changeOpened: this.changeOpened,
                    content: goals_overview,
                    panelClass: "goals_overview"
                });
            }

            if (project_plan !== null) {
                project_plan = React.createElement(AccordionPanel, {
                    opened: this.state.opened,
                    changeOpened: this.changeOpened,
                    content: project_plan,
                    panelClass: "project_plan"
                });
            }

            if (sustainability !== null) {
                sustainability = React.createElement(AccordionPanel, {
                    opened: this.state.opened,
                    changeOpened: this.changeOpened,
                    content: sustainability,
                    panelClass: "sustainability"
                });
            }

            if (target_group !== null) {
                target_group = React.createElement(AccordionPanel, {
                    opened: this.state.opened,
                    changeOpened: this.changeOpened,
                    content: target_group,
                    panelClass: "target_group"
                });
            }

            if (results !== null) {
                var resultsContent = React.createElement(ResultList, { results: results });
                results = React.createElement(AccordionPanel, {
                    opened: this.state.opened,
                    changeOpened: this.changeOpened,
                    content: resultsContent,
                    panelClass: "result"
                });
            }

            return (
                <div className="panel-group">
                    {background}
                    {current_status}
                    {project_plan}
                    {target_group}
                    {sustainability}
                    {goals_overview}
                    {results}
                </div>
            );
        }
    });

    var CarouselInstance = React.createClass({
        render: function() {
            var photos = this.props.source.photos.map(function(photo) {
                var photoCaption = React.createElement("h4", null, photo.caption);
                var photoCredit = React.createElement("p", null, photo.credit);
                var carouselCaption = React.createElement(
                    "div",
                    { className: "carousel-caption" },
                    photoCaption,
                    photoCredit
                );
                var photoImage = React.createElement("img", { src: photo.url });
                var photoLink = React.createElement(
                    "a",
                    { target: "_blank", href: photo.direct_to_url },
                    photoImage
                );

                return React.createElement(
                    CarouselItem,
                    { key: photo.url },
                    photoLink,
                    carouselCaption
                );
            });
            return React.createElement(
                Carousel,
                { controls: this.props.source.photos.length > 1 },
                photos
            );
        }
    });

    function renderAccordion() {
        ReactDOM.render(
            React.createElement(AccordionInstance, {
                source: JSON.parse(document.getElementById("akvo-rsr-accordion").innerHTML)
            }),
            document.getElementById("accordion")
        );
    }

    function renderCarousel() {
        var source = JSON.parse(document.getElementById("akvo-rsr-carousel").innerHTML);
        ReactDOM.render(<CarouselInstance source={source} />, document.getElementById("carousel"));
    }

    renderAccordion();
    renderCarousel();

    // HACK: Re-render carousel when we switch to the summary tab
    var summary_tab = document.querySelector("#summary-tab");
    summary_tab.addEventListener("click", function() {
        ReactDOM.unmountComponentAtNode(document.querySelector("#carousel"));
        renderCarousel();
    });
}

function readMoreOnClicks() {
    function setReadMore(show, hide) {
        return function(e) {
            e.preventDefault();
            hide.classList.add("hidden");
            show.classList.remove("hidden");
        };
    }

    var summaryTruncated = document.getElementById("summary-truncated");
    var summaryFull = document.getElementById("summary-full");
    var summaryReadMore = summaryTruncated.querySelector(".read-more");
    var summaryReadLess = summaryFull.querySelector(".read-less");
    if (summaryReadMore !== null && summaryReadLess !== null) {
        summaryReadMore.onclick = setReadMore(summaryFull, summaryTruncated);
        summaryReadLess.onclick = setReadMore(summaryTruncated, summaryFull);
    }
}

function setSummaryMarkdown() {
    var summaryTruncated = document.getElementById("summary-truncated");
    var summaryFull = document.getElementById("summary-full");
    if (summaryTruncated !== null) {
        summaryTruncated.innerHTML = micromarkdown.parse(summaryTruncated.innerHTML.trim());
    }
    if (summaryFull !== null) {
        summaryFull.innerHTML = micromarkdown.parse(summaryFull.innerHTML.trim());
    }
}

function showTab(tabClass) {
    var allTabs = document.querySelectorAll(".project-tab");
    var allTabLinks = document.querySelectorAll(".tab-link.selected");
    var activeTab = document.querySelector("." + tabClass);
    var activeTabLink = document.querySelector('.tab-link[href="#' + tabClass + '"]');

    for (var i = 0; i < allTabs.length; i++) {
        var tab = allTabs[i];

        tab.style.display = "none";
    }
    for (var j = 0; j < allTabLinks.length; j++) {
        var tabLink = allTabLinks[j];

        tabLink.classList.remove("selected");
    }

    var projectFooter = document.querySelector("footer#project-footer");
    if (tabClass === "results") {
        projectFooter.style.display = "none";
    } else {
        projectFooter.style.display = "block";
    }

    activeTab.style.display = "block";
    activeTabLink.classList.add("selected");
}

function setTabOnClicks(tab) {
    tab.addEventListener("click", function() {
        var tabClass = this.getAttribute("href");

        // Remove the '#' from the href
        tabClass = tabClass.substring(1);
        showTab(tabClass);
    });
}

function setTabsOnClicks() {
    var allTabs = document.querySelectorAll(".tab-link");
    for (var i = 0; i < allTabs.length; i++) {
        setTabOnClicks(allTabs[i]);
    }

    // Also set the 'Show all updates' link
    var showUpdates = document.querySelector("div.allUpdates > a");
    if (showUpdates !== null) {
        setTabOnClicks(showUpdates);
    }
}

function readTabFromFragment() {
    var fragment = window.location.hash;
    var parameters = window.location.search;

    if (fragment || parameters.indexOf("?page") > -1) {
        if (parameters.indexOf("?page") > -1) {
            // KB: Hack, only the updates tab has a 'page' parameter
            fragment = "updates";
        } else {
            // Remove the '#' from the fragment
            fragment = fragment.substring(1);
        }

        if (fragment === "summary" || fragment === "report" || fragment === "finance") {
            showTab(fragment);
        } else if (fragment === "partners" && defaultValues.show_partners_tab) {
            showTab(fragment);
        } else if (fragment === "updates" && defaultValues.show_updates_tab) {
            showTab(fragment);
        } else if (fragment.indexOf("results") > -1 && defaultValues.show_results_tab) {
            showTab("results");
        } else {
            showTab("summary");
        }
    } else {
        showTab("summary");
    }
}

var loadJS = function(url, implementationCode, location) {
    //url is URL of external file, implementationCode is the code
    //to be called from the file, location is the location to
    //insert the <script> element

    var scriptTag = document.createElement("script");
    scriptTag.src = url;

    scriptTag.onload = implementationCode;
    scriptTag.onreadystatechange = implementationCode;

    location.appendChild(scriptTag);
};

function loadAndRenderReact() {
    function loadMarkdown() {
        var markdownSrc = document.getElementById("markdown").src;
        loadJS(markdownSrc, renderReactComponents, document.body);
    }

    function loadReactBootstrap() {
        var reactBootstrapSrc = document.getElementById("react-bootstrap").src;
        loadJS(reactBootstrapSrc, loadMarkdown, document.body);
    }

    function loadReactDOM() {
        var reactDOMSrc = document.getElementById("react-dom").src;
        loadJS(reactDOMSrc, loadReactBootstrap, document.body);
    }

    console.log("No React, load again.");
    var reactSrc = document.getElementById("react").src;
    loadJS(reactSrc, loadReactDOM, document.body);
}

/* Initialise page */
document.addEventListener("DOMContentLoaded", function() {
    // Load initial data
    i18n = JSON.parse(document.getElementById("project-main-text").innerHTML);
    defaultValues = JSON.parse(document.getElementById("default-values").innerHTML);

    // Setup project tabs
    setSummaryMarkdown();
    setTabsOnClicks();
    readTabFromFragment();
    readMoreOnClicks();

    // Check if React is loaded
    if (
        typeof React !== "undefined" &&
        typeof ReactDOM !== "undefined" &&
        typeof ReactBootstrap !== "undefined" &&
        micromarkdown !== "undefined"
    ) {
        // Render React components
        renderReactComponents();
    } else {
        loadAndRenderReact();
    }
});
