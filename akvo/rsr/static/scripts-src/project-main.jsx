/** @jsx React.DOM */

// Akvo RSR is covered by the GNU Affero General Public License.
// See more details in the license.txt file located at the root folder of the
// Akvo RSR module. For additional details on the GNU license please see
// < http://www.gnu.org/licenses/agpl.html >.

var defaultValues,
    i18n;

if (ReactBootstrap !== undefined) {
    // KB: Hack, ReactBootstrap does not always get loaded.
    var Carousel = ReactBootstrap.Carousel,
        CarouselItem = ReactBootstrap.CarouselItem;
}

IndicatorPeriodValue = React.createClass({
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
            <span>
                : <i>{actual_value} ({i18n.actual_text}) / {target_value} ({i18n.target_text})</i>
            </span>
        ) : actual_value !== '' ? (
            <span>
                : <i>{actual_value} ({i18n.actual_text})</i>
            </span>
        ) : target_value !== '' ? (
            <span>
                : <i>{target_value} ({i18n.target_text})</i>
            </span>
        ) : (
            <span />
        );
    }
});

IndicatorPeriod = React.createClass({
    render: function () {
        var period_start = this.props.indicator.period_start;
        var period_end = this.props.indicator.period_end;

        if (period_start === undefined && period_end === undefined) {
            return (
                <span />
            );
        }

        if (period_start === undefined) {
            period_start = i18n.start_date_unknown_text;
        } else if (period_end === undefined) {
            period_end = i18n.end_date_unknown_text;
        }

        return (
            <span>
                &nbsp;({period_start} - {period_end})
            </span>
        );
    }
});

Indicator = React.createClass({
    render: function () {
        return this.props.indicator.title ? (
            <div>
                {this.props.indicator.title}
                <IndicatorPeriod indicator={this.props.indicator} />
                <IndicatorPeriodValue indicator={this.props.indicator} />
            </div>
        ) : (
            <span />
        );
    }
});

Result = React.createClass({
    render: function () {
        var indicators = this.props.result.indicators.map(function(indicator) {
            return (
                <Indicator key={indicator.id} indicator={indicator} />
            );
        });
        return (
            <span>
                <li><i className="fa fa-check" /> <strong>{this.props.result.title}</strong></li>
                <dl className="indicator-descriptions">{indicators}</dl>
            </span>
        );
    }
});

ResultList = React.createClass({
    render: function () {
        var results = this.props.results.map(function(result) {
            return (
                <Result key={result.id} result={result} />
            );
        });
        return (
            <ul className="list-unstyled">{results}</ul>
        );
    }
});

var AccordionPanel = React.createClass({
    handleClick: function() {
        this.props.changeOpened(this.props.key);
        return false;
    },

    opened: function() {
        return this.props.key === this.props.opened;
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
            <div className={panelClass}>
                <div className="panel-heading" onClick={this.handleClick}>
                    <h4 className="panel-title">
                        <a href='#' className={headerCollapse}>
                            {this.props.header}
                        </a>
                    </h4>
                </div>
                <div className={panelCollapse} style={panelStyle}>
                    <div className="panel-body">
                        {this.props.content}
                    </div>
                </div>
            </div>
        );
    }
});

var AccordionInstance = React.createClass({
    getInitialState: function() {
        return {
            opened: 0
        };
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
                <p key={i++}>{line}</p>
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
            results = this.props.source.results || null,
            panel_id = 0;

        if (background !== null) {
            background = <AccordionPanel key={panel_id++} opened={this.state.opened} changeOpened={this.changeOpened} content={this.splitLines(background)} panelClass="background" header={i18n.background_text} />;
        }

        if (current_status !== null) {
            current_status = <AccordionPanel key={panel_id++} opened={this.state.opened} changeOpened={this.changeOpened} content={this.splitLines(current_status)} panelClass="current_status" header={i18n.current_situation_text} />;
        }

        if (goals_overview !== null) {
            goals_overview = <AccordionPanel key={panel_id++} opened={this.state.opened} changeOpened={this.changeOpened} content={this.splitLines(goals_overview)} panelClass="goals_overview" header={i18n.goals_overview_text} />;
        }

        if (project_plan !== null) {
            project_plan = <AccordionPanel key={panel_id++} opened={this.state.opened} changeOpened={this.changeOpened} content={this.splitLines(project_plan)} panelClass="project_plan" header={i18n.project_plan_text} />;
        }

        if (sustainability !== null) {
            sustainability = <AccordionPanel key={panel_id++} opened={this.state.opened} changeOpened={this.changeOpened} content={this.splitLines(sustainability)} panelClass="sustainability" header={i18n.sustainability_text} />;
        }

        if (target_group !== null) {
            target_group = <AccordionPanel key={panel_id++} opened={this.state.opened} changeOpened={this.changeOpened} content={this.splitLines(target_group)} panelClass="target_group" header={i18n.target_group_text} />;
        }

        if (results !== null) {
            var resultsContent = <ResultList results={results} />;
            results = <AccordionPanel key={panel_id++} opened={this.state.opened} changeOpened={this.changeOpened} content={resultsContent} panelClass="result" header={i18n.results_text} />;
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
        // KB: Hack to see if we can use ReactBootstrap or not
        if (ReactBootstrap !== undefined) {
            var photos = this.props.source.photos.map(function (photo) {
                return (
                    <CarouselItem key={photo.url}>
                        <a target="_blank" href={photo.direct_to_url}><img src={photo.url}/></a>
                        <div className="carousel-caption">
                            <h4>{photo.caption}</h4>
                            <p>{photo.credit}</p>
                        </div>
                    </CarouselItem>
                );
            });
            return (
                <Carousel>
                    {photos}
                </Carousel>
            );
        } else if (this.props.source.photos.length > 0) {
            var photo = this.props.source.photos[0];
            return (
                <div className="carousel slide">
                    <ol className="carousel-indicators">
                        <li className="active" />
                    </ol>
                    <div className="carousel-inner">
                        <div className="item active">
                            <a target="_blank" href={photo.direct_to_url}>
                                <img src={photo.url} />
                            </a>
                            <div className="carousel-caption">
                                <h4>{photo.caption}</h4>
                                <p>{photo.credit}</p>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <span />
            );
        }
    }
});

function renderAccordion() {
    React.renderComponent(
        <AccordionInstance source={JSON.parse(document.getElementById("akvo-rsr-accordion").innerHTML)} />,
        document.getElementById('accordion'));
}

function renderCarousel() {
    React.renderComponent(
        <CarouselInstance source={JSON.parse(document.getElementById("akvo-rsr-carousel").innerHTML)} />,
        document.getElementById('carousel'));
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

/* Initialise page */
document.addEventListener('DOMContentLoaded', function() {
    // Load initial data
    i18n = JSON.parse(document.getElementById("project-main-text").innerHTML);
    defaultValues = JSON.parse(document.getElementById("default-values").innerHTML);

    // Setup project tabs
    setTabsOnClicks();
    readTabFromFragment();
    readMoreOnClicks();

    // Render React components
    renderAccordion();
    renderCarousel();
});