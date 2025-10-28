import { connectDBClientes } from '../db.js';
import mongoose from 'mongoose';

const carrosSchema = new mongoose.Schema({
    marca: {
        type: String,
        required: true
    },
    modelo: {
        type: String,
        required: true
    },
    año: {
        type: Number,
        required: true
    },
    placas: {
        type: String,
        required: true,
        unique: true
    },
    color: {
        type: String,
        required: true
    },
    tipo: {
        type: String,
        required: true,
        enum: [
            'carro chico',
            'carro grande',
            'camioneta chica',
            'camioneta grande',
            'motocicleta chica',
            'motocicleta grande'
        ]
    },
    propietario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Clientes',
        required: true
    }
}, {
    timestamps: true
});

// En el modelo de Carros
carrosSchema.index({ propietario: 1 });

// Usando Redis o similar para cachear resultados frecuentes
const CACHE_TTL = 300; // 5 minutos
const getCachedCarros = async (propietarioId) => {
    const cacheKey = `carros:${propietarioId}`;
    // ... implementación del caché
};


export default connectDBClientes.model('Carros', carrosSchema);