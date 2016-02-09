/** @jsx React.DOM */

// Akvo RSR is covered by the GNU Affero General Public License.
// See more details in the license.txt file located at the root folder of the
// Akvo RSR module. For additional details on the GNU license please see
// < http://www.gnu.org/licenses/agpl.html >.

var Accordion = ReactBootstrap.Accordion,
    AccordionInstance,
    Carousel = ReactBootstrap.Carousel,
    CarouselInstance,
    CarouselItem = ReactBootstrap.CarouselItem,
    Panel = ReactBootstrap.Panel,
    i18n;

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


AccordionInstance = React.createClass({
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
            background = <Panel key={panel_id++} className="background" header={i18n.background_text} eventKey={'background'}>
                {this.splitLines(background)}
            </Panel>;
        }

        if (current_status !== null) {
            current_status = <Panel key={panel_id++} className="current_status" header={i18n.current_situation_text} eventKey={'current_status'}>
                {this.splitLines(current_status)}
            </Panel>;
        }

        if (goals_overview !== null) {
            goals_overview = <Panel key={panel_id++} className="goals_overview" header={i18n.goals_overview_text} eventKey={'goals_overview'}>
                {this.splitLines(goals_overview)}
            </Panel>;
        }

        if (project_plan !== null) {
            project_plan = <Panel key={panel_id++} className="project_plan" header={i18n.project_plan_text} eventKey={'project_plan'}>
                {this.splitLines(project_plan)}
            </Panel>;
        }

        if (sustainability !== null) {
            sustainability = <Panel key={panel_id++} className="sustainability" header={i18n.sustainability_text} eventKey={'sustainability'}>
                {this.splitLines(sustainability)}
            </Panel>;
        }

        if (target_group !== null) {
            target_group = <Panel key={panel_id++} className="target_group" header={i18n.target_group_text} eventKey={'target_group'}>
                {this.splitLines(target_group)}
            </Panel>;
        }

        if (results !== null) {
            results = <Panel key={panel_id++} className="result" header={i18n.results_text} eventKey={'results'}>
                <ResultList key={0} results={results} />
            </Panel>;
        }

        return (
            <Accordion>
                {background}
                {current_status}
                {project_plan}
                {target_group}
                {sustainability}
                {goals_overview}
                {results}
            </Accordion>
        );
    }
});

CarouselInstance = React.createClass({
    render: function() {
        var photos = this.props.source.photos.map(function(photo) {
            return (
                <CarouselItem key={photo.url} >
                    <a target="_blank" href={photo.direct_to_url}><img src={photo.url} /></a>
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

    // Open the first accordion item on load
    var firstAccordionChild = document.querySelector('#accordion div.panel-group div:first-child div a');
    if (firstAccordionChild !== null) {
        firstAccordionChild.click();
    }
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

    // Setup project tabs
    setTabsOnClicks();
    readTabFromFragment();
    readMoreOnClicks();

    // Render React components
    renderAccordion();
    renderCarousel();
});