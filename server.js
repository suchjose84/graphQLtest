const express = require('express');
const {graphqlHTTP} = require('express-graphql');
const schema = require('./schema/index.js');
const {auth} = require('express-openid-connect');
const { requiresAuth } = require('express-openid-connect');
const authConfig = require('./config/auth0.config.js');
const port = process.env.PORT || 3000;


const app = express();

// connects to auth0
app.use(auth(authConfig.config));

app.use('/', (req, res, next) => {
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

//graphiql
app.use('/graphql', requiresAuth(), graphqlHTTP({
  schema: schema,
  graphiql: true
}));

//connect to db
const db = require('./models');
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    app.listen(port, () => {
      console.log(`Connected to the database and server running on port ${port}.`);
    });
  })
  .catch(err => {
    console.log('Cannot connect to the database!', err);
    process.exit();
  });