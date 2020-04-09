const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slug');
const shortid = require('shortid');

const vacantesSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: 'El nombre de la vacante es obligatorio',
        trim: true
    },
    empresa: {
        type: String,
        trim: true
    },
    ubicacion: {
        type: String,
        trim: true,
        required: 'La ubicacione s obligatoria'
    },
    salario: {
        type: String,
        default: 0,
        trim: true
    },
    contrato: {
        type: String,
        trim: true
    },
    descripcion: {
        type: String,
        trim: true
    },
    url: {
        type: String,
        lowercase: true
    },
    skills: [String],
    candidatos: [{
        nombre: String,
        email: String,
        cv: String
    }],
    autor: {
        type: mongoose.Schema.ObjectId,
        ref: 'Usuarios',
        required: 'El autor es obligatorio'
    }
});
vacantesSchema.pre('save', function(next) { //actua como middleware antes de guardar un nuevo objeto, crea la url

    //crear url
    const url = slug(this.titulo); //slug borra los espacios, tildes, etc y lo deja plano para que sea compatible con una url

    this.url = `${url}-${shortid.generate()}`; //le agrega a lo que hizo slug, un id corto por si se repiten los nombre, que la url siempre sea unica

    next();
})

//crear indice porque tenemos un buscador
vacantesSchema.index({titulo : 'text'})

module.exports = mongoose.model('Vacante', vacantesSchema);