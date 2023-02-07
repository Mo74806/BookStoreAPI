const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const path = require('path');
const userRouter = require('./routes/userRoutes');
const bookRouter = require('./routes/bookRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const purchaseRouter = require('./routes/purchaseRoutes');
const authorRouter = require('./routes/authorRoutes');
const cros = require('cors');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();
app.use(
  cros({
    origin: '*',
  })
);
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet());
let limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: 'Too Many Requests from that IP',
});

app.use('/api', limiter);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(cookieParser());
app.use(express.json());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// ROUTES
app.use('/api/v1/users', userRouter);
app.use('/api/v1/books', bookRouter);
app.use('/api/v1/authors', authorRouter);

app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/purchaces', purchaseRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`coldn\'t make request to this url ${req.url} `, 404));
});
app.use(globalErrorHandler);

module.exports = app;
