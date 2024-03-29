'use strict';
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
// const client_posts = JSON.parse(fs.readFileSync('./json-resources/client_posts.json'));

//MIDDLEWARE
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
}
console.log(process.env.NODE_ENV);
app.use(express.json());
app.use(express.static('./public'));
app.use(cors());

app.use((req, res, next) => {
  // req.requestTime = new Date().toISOString();
  // console.log(req.requestTime);
  //console.log(req.headers);

  next();
});


app.use((req, res, next) =>{
  
res.setHeader("Access-Control-Allow-Origin", "*");
res.setHeader("Access-Control-Allow-Credentials", "true");
res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  next();
});
//ROUTES
const defaultRoute = require('./routes/defaultRoute');
const threadRouter = require('./routes/threadRoute');
const userRouter = require('./routes/userRoute');
const authRouter = require('./routes/authRoute');
const notificationRouter = require('./routes/notificationRoute');

const testRoute = require('./routes/testRoute');

app.use('/', defaultRoute);

app.use('/api/v1/', defaultRoute);
app.use('/api/v1/threads', threadRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/notification', notificationRouter);

app.use('/api/test', testRoute);

app.all('*', (req, res, next) => {
  next(new AppError('Cant find ' + req.originalUrl + ' on the server', 404));
});
app.use(globalErrorHandler);

module.exports = app;
