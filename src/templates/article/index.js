import React from 'react';

import Layout from '../../components/layout';
import SEO from '../../components/seo';
import './styles.scss';
import WorldMap from '../../components/worldMap';
import { graphql } from 'gatsby';
import { ArticleWrapper } from '../../components/articleWrapper';

export default props => (
  <Layout>
    <SEO title="Home" keywords={[`gatsby`, `application`, `react`]} />
    <WorldMap />
    <ArticleWrapper contentfulArticle={props.data.contentfulArticle} />
  </Layout>
);

export const pageQuery = graphql`
  query($articleId: String!) {
    contentfulArticle(id: { eq: $articleId }) {
      id
      title
      coordinates {
        lon
        lat
      }
      date
      childContentfulArticleContentTextNode {
        content
        childMarkdownRemark {
          html
        }
      }
      pics {
        title
        fixed(height: 270) {
          width
          height
          src
        }
      }
    }
  }
`;
