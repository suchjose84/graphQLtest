const express = require('express');
const {auth} = require('express-openid-connect');
const authConfig = require('./config/auth0.config.js');
const port = process.env.PORT || 3000;


const app = express();

//connects to auth0
app.use(auth(authConfig.config));

//connect to routes folder
// app.use('/graphql', graphqlHTTP({schema, graphiql:true}));
app.use('/', require('./routes'));


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