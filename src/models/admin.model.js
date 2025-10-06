import { connectDBClientes } from '../db.js';
import mongoose from 'mongoose';

const clientesSchema = new mongoose.Schema({
    nombre:{
        type: String,
        required: true
    },
    correo:{
        type: String,
        required: true,
        unique: true,
    },
    telefono:{
        type: String,
        required: true
    },
    rol:{
        type: Boolean,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    carros: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Carros'
    }]
},
{
    timestamps: true
});

export default connectDBClientes.model('Clientes', clientesSchema);