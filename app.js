'use strict'
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const serveStatic = require('serve-static');
const morgan = require('morgan');
const enrouten = require('express-enrouten');

const ev = require('express-validation');


// assign options for express validation 
ev.options({ flatten: true });

//log requests
app.use(morgan('short'));

// parse application/json
app.use(bodyParser.json());

//disable x-powered-by (recommended best practice)
app.disable('x-powered-by');

//serve the public folder directly
app.use(serveStatic('public'));

//use the enrouten module to configure routes. No need to add routes manually. The specified folder is scanned for handlers
app.use(enrouten({ directory: 'routes' }))

/* ERROR HANDLERS */
//configure error handlers
//express returns development if NODE_ENV is not set

//err handler. no stack trace is leaked to the user in prod run
app.use(function (err, req, res, next) {
    console.log('Error: ' + err);
    let errResponse = {};
    if (app.get('env') === 'development') {
        //development mode
        errResponse.message = err.message;
        errResponse.stack = err.stack;
    } else {
        //production. no stack trace
        errResponse.message = err.message;
    }
    //express-validation error
    if (err instanceof ev.ValidationError) {
        errResponse.message += err;
    }
    
    //express-jwt error handling
    if (err.name === 'UnauthorizedError') {
        err.status = 401;
        errResponse.message = 'Unauthorized User';
    }

    res.status(err.status || 500);
    res.json(errResponse);

});

/* START LISTENING FOR CONNECTIONS */
var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log(`App listening on port ${port}. NODE_ENV ${process.env.NODE_ENV}. app.get('env') ${app.get('env')}.`);
});
