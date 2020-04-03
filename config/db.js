require('./config');
const mongoose = require('mongoose');

mongoose.connect(process.env.URLDB, {
    useNewUrlParser:true,
    useUnifiedTopology: true
});

mongoose.connection.on('error' , (error) => {
    console.log(error);
})

//importar los modelos
require('../models/Vacantes');
require('../models/Usuarios');