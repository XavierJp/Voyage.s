import React from 'react';

import Layout from '../components/layout';
import SEO from '../components/seo';
import './indexStyles.scss';
import WorldMap from '../components/worldMap';

export default () => (
  <Layout>
    <SEO title="Home" keywords={[`gatsby`, `application`, `react`]} />
    <WorldMap />
    <div className="header">
      <h1>Carnet de voyages</h1>
    </div>
    {/* <Article /> */}
  </Layout>
);
