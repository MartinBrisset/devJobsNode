const mongoose = require('mongoose');
const express = require('express');
const morgan = require('morgan');
require('./config/config');
require('./config/db');
const handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const path = require('path');
const router = require('./routes');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoStore= require('connect-mongo')(session);
const expressValidator = require('express-validator');
const flash = require('connect-flash');

const app = express();

// validación de campos
app.use(expressValidator());

app.use(morgan('dev')); //muestra la ruta en la consola
app.use(express.urlencoded({extended:true})); //recibe datos, archivos, etc
app.use(express.json()); //recibir datos json

//habilitar hbs como template
app.engine('handlebars',
    exphbs({
        handlebars: allowInsecurePrototypeAccess(handlebars),
        defaultLayout: 'layout',
        helpers: require('./helpers/handlebars')
    })
);
app.set('view engine', 'handlebars');

//archivos publicos y estatidos
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());

app.use(session({
    secret: process.env.SECRETO,
    key: process.env.key,
    resave: false,
    saveUninitialized: false,
    store: new mongoStore({mongooseConnection: mongoose.connection})
}));

//alertas y flash messages
app.use(flash());

//crear un middleware sencillo entonces lo creamos aca
app.use((req, res, next) => {
    res.locals.mensajes = req.flash();
    next();
});

app.use('/', router());

app.listen(process.env.PUERTO);