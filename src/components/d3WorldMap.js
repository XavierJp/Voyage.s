import React, { Component } from 'react';
import * as d3Geo from 'd3-geo';
import * as d3Drag from 'd3-drag';
import * as d3Scale from 'd3-scale';
import * as d3Selection from 'd3-selection';
import * as d3Transition from 'd3-transition';
import * as d3Ease from 'd3-ease';
import * as topojson from 'topojson';

import world from '../resources/geoJson/world';
import { sanitizeName } from '../../gatsby-node';
import { navigate } from 'gatsby';

export default class D3WorldMap extends Component {
  componentDidMount() {
    if (document.getElementById('world-map')) {
      return;
    }

    const width = window.innerWidth;
    const height = window.innerHeight;

    const projection = d3Geo
      .geoOrthographic()
      .clipAngle(90)
      .translate([350, 500])
      .scale(600)
      .center([0, 0])
      .rotate([-41, -21, 0]); //center on Eurasia

    const path = d3Geo.geoPath().projection(projection);

    // Define the div for the tooltip
    const tooltip = d3Selection
      .select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    const tooltipTitleContainer = tooltip.append('div').style('opacity', 0);

    const svg = d3Selection
      .select('body')
      .append('svg')
      .attr('id', 'world-map')
      .attr('width', width)
      .attr('height', height);

    const lambda = d3Scale
      .scaleLinear()
      .domain([0, width])
      .range([-180, 180]);

    const phi = d3Scale
      .scaleLinear()
      .domain([0, height])
      .range([90, -90]);

    const drag = d3Drag
      .drag()
      .subject(function() {
        const r = projection.rotate();
        return {
          x: lambda.invert(r[0]),
          y: phi.invert(r[1]),
        };
      })
      .on('drag', function() {
        tooltip.style('opacity', 0);

        if (window.location.pathname !== '/') {
          navigate('/');
        }

        projection.rotate([
          lambda(d3Selection.event.x),
          phi(d3Selection.event.y),
        ]);

        svg
          .selectAll('.graticule')
          .datum(graticule)
          .attr('d', path);

        svg.selectAll('.country').attr('d', path);

        svg.selectAll('.trip').attr('d', path);

        svg.selectAll('.stop').attr('d', path);
      });

    svg.call(drag);

    const graticule = d3Geo.geoGraticule();

    svg
      .append('path')
      .datum({ type: 'Sphere' })
      .attr('class', 'sphere')
      .attr('d', path)
      .attr('fill', '#ffd133');

    svg
      .append('path')
      .datum(graticule)
      .attr('class', 'graticule')
      .attr('d', path);

    //countries
    svg
      .selectAll('.country')
      .data(topojson.feature(world, world.objects.countries).features)
      .enter()
      .append('path')
      .attr('d', path)
      .attr('class', 'country');

    const trips = this.props.trips;
    svg
      .selectAll('.trip')
      .data(trips)
      .enter()
      .append('path')
      .attr('d', path)
      .attr('class', 'trip')
      .attr('stroke-dasharray', 3);

    const stops = this.props.stops;
    svg
      .selectAll('.stop')
      .data(stops)
      .enter()
      .append('path')
      .attr('class', 'stop')
      .attr('d', path)
      .attr('fill-opacity', 1)
      .on('mouseover', function(d) {
        const easeBackOut = d3Transition.transition().ease(d3Ease.easeBackOut);
        // const linear = d3Transition.transition().ease(d3Ease.easeLinear);

        tooltip
          .style('opacity', 0)
          .style('left', projection(d.geometry.coordinates)[0] + 'px')
          .style('top', projection(d.geometry.coordinates)[1] - 75 + 'px')
          .transition(easeBackOut) // apply a transition
          .duration(200)
          .style('opacity', 0.9)
          .style('top', projection(d.geometry.coordinates)[1] - 45 + 'px');

        tooltipTitleContainer.html(d.properties.name);

        tooltipTitleContainer
          .style('opacity', 0)
          .style('background-size', '0%')
          .transition(easeBackOut) // apply a transition
          .delay(200)
          .duration(400)
          .style('opacity', 1)
          .style('background-size', '100%');
      })
      .on('mouseout', function(d) {
        const t = d3Transition.transition().ease();
        tooltip
          .style('opacity', 0.9)
          .transition(t)
          .duration(250)
          .style('opacity', 0);

        tooltipTitleContainer
          .style('opacity', 0)
          .style('background-size', '0%');
      })
      .on('click', function(d) {
        navigate(sanitizeName(d.properties.name, d.properties.date));
      });
  }

  componentWillUnmount() {
    // let's do nothing here
  }

  render() {
    return <></>;
  }
}
