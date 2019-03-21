import React from 'react';
import { StaticQuery, graphql } from 'gatsby';
import D3WorldMap from '../components/d3WorldMap';
import './worldMap.scss';

const citiesGeoJsonFactory = data => {
  return {
    type: 'FeatureCollection',
    features: data.allContentfulTrip.edges
      .reduce((acc, el) => {
        return [...acc, ...el.node.article];
      }, [])
      .map(feature => {
        return {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [feature.coordinates.lon, feature.coordinates.lat],
          },
          properties: {
            name: feature.title,
          },
        };
      }),
  };
};

const tripsGeoJsonFactory = data => {
  return {
    type: 'FeatureCollection',
    features: data.allContentfulTrip.edges.map(feature => {
      return {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: feature.node.article.map(article => {
            return [article.coordinates.lon, article.coordinates.lat];
          }),
        },
      };
    }),
  };
};

export default props => (
  <StaticQuery
    query={graphql`
      query {
        allContentfulTrip {
          edges {
            node {
              id
              article {
                title
                coordinates {
                  lon
                  lat
                }
                date
              }
            }
          }
        }
      }
    `}
    render={data => (
      <D3WorldMap
        trips={tripsGeoJsonFactory(data).features}
        stops={citiesGeoJsonFactory(data).features}
      />
    )}
  />
);
