const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const routes = require('./routes')(express, app);
const swaggerUi = require('swagger-ui-express');
const swaggerOutput = require('./swagger-output.json');
const passport = require('passport')
const session = require('express-session')

import dbConnect from './db_connect';

// Choose port
const port = Number(process.env.PORT) || 8080;

//Session
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}))

//Passport
require('./passport')(passport)
app.use(passport.initialize())
app.use(passport.session())

// Middleware
app.use(bodyParser.json());

// CORS handling
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerOutput));

// Routes
app.use('/', routes);

// Initialize MongoDB connection
dbConnect.initDb((err, db) => {
  if (err) {
    console.error('Error connecting to MongoDB:', err);
  } else {
    // Start the server
    app.listen(port, () => {
      console.log(`Connected to MongoDB and listening on port ${port}`);
    });
  }
});
