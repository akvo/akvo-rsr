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
    Panel = ReactBootstrap.Panel;

Indicator = React.createClass({
  render: function () {
    var period_start = this.props.indicator.period_start;
    var period_end = this.props.indicator.period_end;
    var periods;
    if (period_start !== undefined) {
        if (period_end !== undefined) {
            periods = "(" + period_start + " - " + period_end + ")";
        } else {
            periods = "(" + period_start + " - " + i18n.end_date_unknown_text + ")";
        }
    } else if (period_end !== undefined) {
        periods = "(" + i18n.start_date_unknown_text + " - " + period_end + ")";
    } else {
        periods = "";
    }

    var target_value = this.props.indicator.target_value;
    var actual_value = this.props.indicator.actual_value;
    var value = "";
    if (actual_value !== "") {
        value += actual_value + " (" + i18n.actual_text + ")";
        if (target_value !== "") {
            value += " / ";
        }
    }
    if (target_value !== "") {
        value += target_value + " (" + i18n.target_text + ")";
    }

    return (
      <div>
        <dt>
            {this.props.indicator.title} {periods}
        </dt>
        <dd>
            {value}
        </dd>
      </div>
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
        <li><i className="fa fa-check"></i> {this.props.result.title}</li>
        <dl className="indicators">{indicators}</dl>
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
      <ul className="results list-unstyled">{results}</ul>
    );
  }
});


AccordionInstance = React.createClass({

  splitLines: function(text) {
    var i = 0;
    var lines = text.match(/[^\r\n]+/g).map(function(line) {
      i = i + 1;
      return (
          <p key={i}>{line}</p>
      );
    });
    return lines;
  },

  getIndicators: function(indicators) {
      var i = 0;
      var result_list = indicators.map(function(indicator) {
          i = i + 1;
          return (
              <dl className="indicators">
                  <dt>
                      <i className="fa fa-check"></i> {result.title}
                  </dt>
                  <dd></dd>
              </dl>
          );
      });
      return result_list;
  },

  getResults: function(results) {
      var i = 0;
      var result_list = results.map(function(result) {
          i = i + 1;
          return (
              <dl className="results">
                  <dt>
                      <i className="fa fa-check"></i> {result.title}
                  </dt>
                  <dd></dd>
                    {this.getIndicators(result.indicators)}
              </dl>
          );
      });
      return result_list;
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
          <a href={photo.original_url} target="_blank"><img src={photo.url} /></a>
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

// Initial data
i18n = JSON.parse(document.getElementById("project-main-text").innerHTML);

React.renderComponent(
    <AccordionInstance source={JSON.parse(document.getElementById("akvo-rsr-accordion").innerHTML)} />,
    document.getElementById('accordion'));
React.renderComponent(
    <CarouselInstance source={JSON.parse(document.getElementById("akvo-rsr-carousel").innerHTML)} />,
    document.getElementById('carousel'));

document.querySelector('#accordion div.panel-group div:first-child div a').click();