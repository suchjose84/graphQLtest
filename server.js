const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/index.js');
const { auth, requiresAuth } = require('express-openid-connect');
const authConfig = require('./config/auth0.config.js');
const port = process.env.PORT || 3000;

const app = express();

// Connects to auth0
// app.use(auth(authConfig.config));

// app.get('/', (req, res) => {
//   if (req.oidc.isAuthenticated()) {
//     // User is authenticated
//     res.send('You are logged in! API doc is at https://graphqltest.onrender.com');
//   } else {
//     // User is not authenticated
//     res.send('Welcome guest! Please login.');
//   }
// });

// GraphiQL
app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true
}));

// Connect to db
const db = require('./models/index.js');
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




