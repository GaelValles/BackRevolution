import { connectDBClientes } from '../db.js';
import mongoose from 'mongoose';

const citasSchema = new mongoose.Schema({
    fechaInicio: {
        type: Date,
        required: true
    },
    fechaFin: {
        type: Date,
        required: true
    },
    tipoServicio: {
        type: String,
        required: true,
        enum: [
            'Lavado básico',
            'Lavado premium',
            'Encerado',
            'Pulido',
            'Detallado interior',
            'Detallado completo'
        ]
    },
    costo: {
        type: Number,
        required: true
    },
    carro: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Carros',
        required: true
    },
    cliente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Clientes',
        required: true
    },
    informacionAdicional: {
        type: String,
        default: ''
    },
    estado: {
        type: String,
        enum: ['programada', 'en_proceso', 'completada', 'cancelada'],
        default: 'programada'
    }
}, {
    timestamps: true
});

citasSchema.index({ cliente: 1, fechaInicio: 1 });
citasSchema.index({ carro: 1 });

export default connectDBClientes.model('Citas', citasSchema);