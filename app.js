const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/AppError');
const tourRoutes = require('./routes/tourRoutes');
const userRoutes = require('./routes/userRoutes');
const globalErrorHandler = require('./controllers/errorController');

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
  console.log(req.headers);
  next();
});

// ---------------3 route handler-----------------

//called mounting a router

app.use('/v1/tours', tourRoutes);
app.use('/v1/users', userRoutes);

//error handling

app.all('*', (req, res, next) => {
  // res.status(200).json({ message: 'no such tour exists' });
  next(
    new AppError(
      new Error(`Cant find original ${req.originalUrl} on this server`)
    )
  );
});

//error middleware

app.use(globalErrorHandler);

module.exports = app;
