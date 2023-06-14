// const routes = require('express').Router();
// const { graphqlHTTP } = require('express-graphql');
// const schema = require('../schema');
// const { requiresAuth } = require('express-openid-connect');

// routes.use('/', requiresAuth(), async (req, res, next) => {
//   try {
//     if (req.oidc.isAuthenticated()) {
//       // User is authenticated
//       let docData = {
//         // documentationURL: 'https://cse341-mw5a.onrender.com/api-docs',
//         message: 'You are logged in! API doc is at https://cse341-mw5a.onrender.com/api-docs'
//       };
//       res.send(docData);
//     } else {
//       // User is not authenticated
//       let docData = {
//         // documentationURL: 'https://cse341-mw5a.onrender.com/api-docs',
//         message: 'Welcome guest! Please login.'
//       };
//       res.send(docData);
//     }
//   } catch (error) {
//     next(error);
//   }
// });

// routes.use('/graphql', requiresAuth(), async (req, res, next) => {
//   try {
//     // Check if user is authenticated
//     console.log('hello');
//     if (req.oidc.isAuthenticated()) {
//       // User is authenticated, proceed to GraphQL endpoint
//       next();
//     } else {
//       // User is not authenticated, return unauthorized response
//       res.status(401).json({ message: 'Unauthorized' });
//     }
//   } catch (error) {
//     next(error);
//   }
// }, graphqlHTTP({
//   schema,
//   graphiql: true
// }));

// module.exports = routes;

// routes.use('/', async (req, res, next) => {
//   try {
//     // Your logic here
//     // This middleware will be executed for all requests to '/'
//     let docData = {
//       // documentationURL: 'https://cse341-mw5a.onrender.com/api-docs',
//       message: 'Welcome guest! Please login.'
//     };
//     res.send(docData);
//   } catch (error) {
//     next(error);
//   }
// });

// routes.use('/graphql', async (req, res, next) => {
//   try {
//     // Your logic here
//     // This middleware will be executed for all requests to '/graphql'
//     console.log('hello');
//     next();
//   } catch (error) {
//     next(error);
//   }
// }, graphqlHTTP({
//   schema,
//   graphiql: true
// }));

// module.exports = routes;

