const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/AppError');
const tourRoutes = require('./routes/tourRoutes');
const userRoutes = require('./routes/userRoutes');
const globalErrorHandler = require('./controllers/errorController');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const app = express();
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
//add middlewares

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

//helmet

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
});

app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

app.use(limiter);
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

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

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
