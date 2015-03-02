/** @jsx React.DOM */

var Accordion = ReactBootstrap.Accordion;
var Carousel = ReactBootstrap.Carousel;
var CarouselItem = ReactBootstrap.CarouselItem;
var Panel = ReactBootstrap.Panel;

var AccordionInstance = React.createClass({
    render: function() {
        var background, current_status, project_plan, target_group, sustainability;
        if (this.props.source.background != "") {
            background = <Panel className="background" header="Background" key={'background'}>{this.props.source.background}</Panel>;
        } else {
            background = null;
        }
        if (this.props.source.current_status != "") {
            current_status = <Panel  className="current_status" header="Current situation" key={'current_status'}>{this.props.source.current_status}</Panel>;
        } else {
            current_status = null;
        }
        if (this.props.source.project_plan != "") {
            project_plan = <Panel  className="project_plan" header="Project plan" key={'project_plan'}>{this.props.source.project_plan}</Panel>;
        } else {
            project_plan = null;
        }
        if (this.props.source.target_group != "") {
            target_group = <Panel  className="target_group" header="Target group" key={'target_group'}>{this.props.source.target_group}</Panel>;
        } else {
            target_group = null;
        }
        if (this.props.source.sustainability != "") {
            sustainability = <Panel  className="sustainability" header="Sustainability" key={'sustainability'}>{this.props.source.sustainability}</Panel>;
        } else {
            sustainability = null;
        }
        if (this.props.source.goals_overview != "") {
            goals_overview = <Panel  className="goals_overview" header="Goals overview" key={'goals_overview'}>{this.props.source.goals_overview}</Panel>;
        } else {
            goals_overview = null;
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

var CarouselInstance = React.createClass({
    render: function() {
        var photos = this.props.source.photos.map(function(photo) {
          return (
            <CarouselItem>
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

React.renderComponent(
    <AccordionInstance source={JSON.parse(document.getElementById("akvo-rsr-accordion").innerHTML)} />,
    document.getElementById('accordion'));
React.renderComponent(
    <CarouselInstance source={JSON.parse(document.getElementById("akvo-rsr-carousel").innerHTML)} />,
    document.getElementById('carousel'));
