const routes = require('express').Router();
// const users = require('./users');
// const inventory = require('./inventory');

// routes.use('/', users);
// routes.use('/', inventory);

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

module.exports = routes;