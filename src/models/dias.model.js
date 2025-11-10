import { connectDBClientes } from '../db.js';
import mongoose from 'mongoose';

const diasInhabilesSchema = new mongoose.Schema({
    fecha: {
        type: Date,
        required: true
    },
    registradoPor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Clientes',
        required: true
    }
}, {
    timestamps: true
});

// Crear índice para mejorar búsquedas por fecha
diasInhabilesSchema.index({ fecha: 1 });

// Asegurar que no se dupliquen fechas
diasInhabilesSchema.index({ fecha: 1 }, { unique: true });

export default connectDBClientes.model('DiasInhabiles', diasInhabilesSchema);