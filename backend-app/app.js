var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
var logger = require('morgan');
var session = require('express-session');
var cors = require('cors');
var cron = require('node-cron');
var employeeModel = require('./models').Employee;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var departmentRouter = require('./routes/department');
var employeesRouter = require('./routes/employee');

var app = express();
app.use(
    cors({
        origin: 'http://localhost:3001',
        methods: ['GET', 'PUT', 'POST', 'DELETE'],
    })
);
app.use(
    session({
        secret: 'employee_app_key',
        resave: true,
        saveUnitialized: true,
        cookie: {
            secure: false,
        },
    })
);

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/departments', departmentRouter);
app.use('/employees', employeesRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

//Bonus Task :- Deleting inactive employees at 8PM
//scheldule * * * * *
//minute - hour - day(month) - month - day(week)
//1 1 1 1 1 refers to at 1 on
//at minute 1 - at hour 1 - at day 1 of month - at month 1 jan - on monday 1
// * 20 * * * -> at 8PM everyday of every month
cron.schedule('* 20 * * * ', async () => {
    await employeeModel.destroy({ where: { isActive: 0 } });
});

module.exports = app;
