const routes = require('express').Router();
const { graphqlHTTP } = require('express-graphql');
const schema = require('../schema');
const { requiresAuth } = require('express-openid-connect');


routes.use('/', (req, res, next) => {
  if (req.oidc.isAuthenticated()) {
    // User is authenticated
    let docData = {
      // documentationURL: 'https://cse341-mw5a.onrender.com/api-docs',
      message: 'You are logged in! API doc is at https://cse341-mw5a.onrender.com/api-docs'
    };
    res.send(docData);
  } else {
    // User is not authenticated
    let docData = {
      // documentationURL: 'https://cse341-mw5a.onrender.com/api-docs',
      message: 'Welcome guest! Please login.'
    };
    res.send(docData);
  }
});
routes.use('/graphql', (req, res, next) => {
  // Check if user is authenticated
  if (req.oidc.isAuthenticated()) {
    // User is authenticated, proceed to GraphQL endpoint
    next();
  } else {
    // User is not authenticated, return unauthorized response
    res.status(401).json({ message: 'Unauthorized' });
  }
}, graphqlHTTP({
  schema,
  graphiql: true
}));

module.exports = routes;