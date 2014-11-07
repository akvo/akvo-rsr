/** @jsx React.DOM */

var Accordion = ReactBootstrap.Accordion;
var Carousel = ReactBootstrap.Carousel;
var CarouselItem = ReactBootstrap.CarouselItem;
var Panel = ReactBootstrap.Panel;

var AccordionInstance = React.createClass({displayName: 'AccordionInstance',
    render: function() {
        var background, current_status, project_plan, target_group, sustainability;
        if (this.props.source.background != "") {
            background = React.createElement(Panel, {header: "Background", key: 'background'}, this.props.source.background);
        } else {
            background = null;
        }
        if (this.props.source.current_status != "") {
            current_status = React.createElement(Panel, {header: "Current status", key: 'current_status'}, this.props.source.current_status);
        } else {
            current_status = null;
        }
        if (this.props.source.project_plan != "") {
            project_plan = React.createElement(Panel, {header: "Project plan", key: 'project_plan'}, this.props.source.project_plan);
        } else {
            project_plan = null;
        }
        if (this.props.source.target_group != "") {
            target_group = React.createElement(Panel, {header: "Target group", key: 'target_group'}, this.props.source.target_group);
        } else {
            target_group = null;
        }
        if (this.props.source.sustainability != "") {
            sustainability = React.createElement(Panel, {header: "Sustainability", key: 'sustainability'}, this.props.source.sustainability);
        } else {
            sustainability = null;
        }

        return (
            React.createElement(Accordion, null, 
                background, 
                current_status, 
                project_plan, 
                target_group, 
                sustainability
            )
            );
    }
});

var CarouselInstance = React.createClass({displayName: 'CarouselInstance',
    render: function() {
        var photos = this.props.source.photos.map(function(photo) {
          return (
            React.createElement(CarouselItem, null, 
                React.createElement("img", {width: "100%", height: 400, src: photo.url}), 
                React.createElement("div", {className: "carousel-caption"}, 
                    React.createElement("h3", null, photo.caption), 
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

var accordion_data = JSON.parse(document.getElementById("accordion-data").innerHTML);
var carousel_data = JSON.parse(document.getElementById("carousel-data").innerHTML);

React.renderComponent(React.createElement(AccordionInstance, {source: accordion_data}), document.getElementById('accordion'));
React.renderComponent(React.createElement(CarouselInstance, {source: carousel_data}), document.getElementById('carousel'));
