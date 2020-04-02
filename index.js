const mongoose = require('mongoose');
require('./config/db');
const express = require('express');
const morgan = require('morgan');
require('./config/config');
const handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const path = require('path');
const router = require('./routes');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoStore= require('connect-mongo')(session);

const app = express();

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

app.use('/', router());

app.listen(process.env.PUERTO);