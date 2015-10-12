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

  render: function() {
    var background = this.props.source.background || null,
        current_status = this.props.source.current_status || null,
        goals_overview = this.props.source.goals_overview || null,
        project_plan = this.props.source.project_plan || null,
        sustainability = this.props.source.sustainability || null,
        target_group = this.props.source.target_group || null,
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

    return (
        <Accordion>
        {background}
        {current_status}
        {project_plan}
        {target_group}
        {sustainability}
        {goals_overview}
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

// Open the first accordion item on load
document.querySelector('#accordion div.panel-group div:first-child div a').click();
