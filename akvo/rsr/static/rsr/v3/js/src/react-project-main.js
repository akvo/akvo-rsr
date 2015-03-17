/** @jsx React.DOM */

var Accordion = ReactBootstrap.Accordion;
var Carousel = ReactBootstrap.Carousel;
var CarouselItem = ReactBootstrap.CarouselItem;
var Panel = ReactBootstrap.Panel;

var AccordionInstance = React.createClass({displayName: "AccordionInstance",
    splitLines: function(text) {
        var lines = text.match(/[^\r\n]+/g).map(function(line) {
          return (
            React.createElement("p", null, line)
          );
        });
        return lines
    },

    render: function() {
        var background, current_status, project_plan, target_group, sustainability;
        if (this.props.source.background != "") {
            background = React.createElement(Panel, {className: "background", header: "Background", key: 'background'}, this.splitLines(this.props.source.background));
        } else {
            background = null;
        }
        if (this.props.source.current_status != "") {
            current_status = React.createElement(Panel, {className: "current_status", header: "Current situation", key: 'current_status'}, this.splitLines(this.props.source.current_status));
        } else {
            current_status = null;
        }
        if (this.props.source.project_plan != "") {
            project_plan = React.createElement(Panel, {className: "project_plan", header: "Project plan", key: 'project_plan'}, this.splitLines(this.props.source.project_plan));
        } else {
            project_plan = null;
        }
        if (this.props.source.target_group != "") {
            target_group = React.createElement(Panel, {className: "target_group", header: "Target group", key: 'target_group'}, this.splitLines(this.props.source.target_group));
        } else {
            target_group = null;
        }
        if (this.props.source.sustainability != "") {
            sustainability = React.createElement(Panel, {className: "sustainability", header: "Sustainability", key: 'sustainability'}, this.splitLines(this.props.source.sustainability));
        } else {
            sustainability = null;
        }
        if (this.props.source.goals_overview != "") {
            goals_overview = React.createElement(Panel, {className: "goals_overview", header: "Goals overview", key: 'goals_overview'}, this.splitLines(this.props.source.goals_overview));
        } else {
            goals_overview = null;
        }

        return (
            React.createElement(Accordion, null, 
                background, 
                current_status, 
                project_plan, 
                target_group, 
                sustainability, 
                goals_overview
            )
            );
    }
});

var CarouselInstance = React.createClass({displayName: "CarouselInstance",
    render: function() {
        var photos = this.props.source.photos.map(function(photo) {
          return (
            React.createElement(CarouselItem, null, 
                React.createElement("a", {href: photo.original_url, target: "_blank"}, React.createElement("img", {src: photo.url})), 
                React.createElement("div", {className: "carousel-caption"}, 
                    React.createElement("h4", null, photo.caption), 
                    React.createElement("p", null, photo.credit)
                )
            )
          );
        });
        return (
            React.createElement(Carousel, null, 
                photos
            )
            );
    }
});

React.renderComponent(
    React.createElement(AccordionInstance, {source: JSON.parse(document.getElementById("akvo-rsr-accordion").innerHTML)}),
    document.getElementById('accordion'));
React.renderComponent(
    React.createElement(CarouselInstance, {source: JSON.parse(document.getElementById("akvo-rsr-carousel").innerHTML)}),
    document.getElementById('carousel'));
