import React from 'react';

import './articleWrapper.scss';
import { navigate } from 'gatsby';

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

const formatDate = date => {
  return {
    year: new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
    }).format(new Date(date)),
    month: new Intl.DateTimeFormat('fr-FR', {
      month: '2-digit',
    }).format(new Date(date)),
    day: new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
    }).format(new Date(date)),
  };
};

export class ArticleWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedPic: 0,
    };
  }

  setSelectedPic(index) {
    this.setState({
      selectedPic: index,
    });
  }

  componentDidMount() {
    if (!this.wrapper) {
      return;
    }
    try {
      this.wrapper.animate(
        [
          // keyframes
          { right: '-530px' },
          { right: '0px' },
        ],
        {
          // timing options
          duration: 500,
          easing: 'ease',
          fill: 'forwards',
        },
      );
    } catch {
      this.wrapper.style.right = '0px';
    }
  }

  render() {
    const {
      title,
      date,
      pics,
      childContentfulArticleContentTextNode,
    } = this.props.contentfulArticle;
    const { selectedPic } = this.state;
    const formatedDate = formatDate(date);

    return (
      <div className="article" ref={el => (this.wrapper = el)}>
        <div className="header">
          {cross}
          <h2>{title}</h2>
          <div className="date">
            {`${formatedDate.day} . ${formatedDate.month} . ${
              formatedDate.year
            }`}
          </div>
        </div>
        <div className="pictures">
          {pics && (
            <>
              {pics.map((picture, index) => (
                <img
                  key={picture.fixed.src}
                  src={picture.fixed.src}
                  className={index === selectedPic ? 'active' : ''}
                  alt={picture.title}
                  title={picture.title}
                />
              ))}
              {pics.length > 1 && (
                <div className="picture-carroussel">
                  {pics.map((el, index) => (
                    <span
                      onClick={() => this.setSelectedPic(index)}
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
        <div className="article-content">
          <p
            dangerouslySetInnerHTML={{
              __html:
                childContentfulArticleContentTextNode.childMarkdownRemark.html,
            }}
          />
        </div>
      </div>
    );
  }
}
