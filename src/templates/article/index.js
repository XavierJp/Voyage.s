import React, { useState } from 'react';

import Layout from '../../components/layout';
import SEO from '../../components/seo';
import './styles.scss';
import WorldMap from '../../components/worldMap';
import { graphql } from 'gatsby';

export default props => {
  const [selectedPic, setSelectedPic] = useState(0);

  return (
    <Layout>
      <SEO title="Home" keywords={[`gatsby`, `application`, `react`]} />
      <WorldMap />
      <div className="article">
        <h2>{props.data.contentfulArticle.title}</h2>
        <h3>
          {new Intl.DateTimeFormat('fr-FR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          }).format(new Date(props.data.contentfulArticle.date))}
        </h3>
        <div className="pictures">
          {props.data.contentfulArticle.pics && (
            <>
              {props.data.contentfulArticle.pics.map((picture, index) => (
                <img
                  key={picture.fixed.src}
                  src={picture.fixed.src}
                  className={index === selectedPic ? 'active' : ''}
                  alt={picture.title}
                  title={picture.title}
                />
              ))}
              {props.data.contentfulArticle.pics.length > 1 && (
                <div className="picture-carroussel">
                  {props.data.contentfulArticle.pics.map((el, index) => (
                    <span
                      onClick={() => setSelectedPic(index)}
                      key={el.fixed.src}
                      className={index === selectedPic ? 'active' : ''}
                    >
                      {index + 1}
                    </span>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
        <div>
          <p
            dangerouslySetInnerHTML={{
              __html:
                props.data.contentfulArticle
                  .childContentfulArticleContentTextNode.childMarkdownRemark
                  .html,
            }}
          />
        </div>
      </div>
    </Layout>
  );
};

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
