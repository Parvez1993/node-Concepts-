const express = require('express');
const morgan = require('morgan');

const tourRoutes = require('./routes/tourRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
//add middlewares

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(`${__dirname}/public`));

app.get('/', function (req, res) {
  res.status(200).json({ message: 'succesfull' });
});

app.use((req, res, next) => {
  req.timer = new Date().toISOString();
  next();
});

// ---------------3 route handler-----------------

//called mounting a router

app.use('/v1/tours', tourRoutes);
app.use('/v1/users', userRoutes);

module.exports = app;
