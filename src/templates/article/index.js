import React, { useState } from 'react';

import Layout from '../../components/layout';
import SEO from '../../components/seo';
import './styles.scss';
import WorldMap from '../../components/worldMap';
import { graphql, navigate } from 'gatsby';

const cross = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    strokeWidth="5"
    strokeLinecap="round"
    strokeLinejoin="round"
    onClick={() => navigate('/')}
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export default props => {
  const [selectedPic, setSelectedPic] = useState(0);

  return (
    <Layout>
      <SEO title="Home" keywords={[`gatsby`, `application`, `react`]} />
      <WorldMap />
      <div className="article">
        {cross}
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
