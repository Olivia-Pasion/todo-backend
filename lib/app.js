const cookieParser = require('cookie-parser');
const express = require('express');
const cors = require('cors');
const authenticate = require('../lib/middleware/authenticate');

const app = express();

// Built in middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin:
      'http://localhost:5501',
    credentials: true,
  })
);

// App routes
app.use('/api/v1/users', require('../lib/controllers/users'));
app.use('/api/v1/todos', authenticate, require('../lib/controllers/todos'));


// Error handling & 404 middleware for when
// a request doesn't match any app routes
app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
