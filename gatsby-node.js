/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it
const path = require('path');

const sanitizeName = (articleTitle, articleDate) => {
  if (!articleTitle || !articleDate) {
    console.error(`invalid url : no title or date provided`);
  }

  let p;
  try {
    p = articleTitle
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/([^a-zA-Z0-9])/g, ' ')
      .split(' ')
      .filter(Boolean)
      .join('-')
      .toLowerCase();
  } catch (e) {
    console.error(e);
  }
  return p;
};

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;
  return new Promise((resolve, reject) => {
    const articlePageTemplate = path.resolve(`src/templates/article/index.js`);

    // Query for markdown nodes to use in creating pages.
    resolve(
      graphql(
        `
          query articleForPath {
            allContentfulArticle {
              edges {
                node {
                  id
                  title
                  date
                }
              }
            }
          }
        `,
      ).then(result => {
        if (result.errors) {
          reject(result.errors);
        }

        // Create blog post pages.
        result.data.allContentfulArticle.edges.forEach(edge => {
          let path = '';
          try {
            path = sanitizeName(edge.node.title, edge.node.date);
          } catch (e) {
            console.error(e);
          }
          createPage({
            path: `/${path}/`, // required
            component: articlePageTemplate,
            context: {
              articleId: edge.node.id,
            },
          });
        });

        return;
      }),
    );
  });
};
