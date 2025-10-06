import mongoose from "mongoose";
import dotenv from "dotenv";


dotenv.config(); // Carga las variables del archivo .env
export const connectDBClientes = mongoose.createConnection(process.env.connectDBClientes, {

});

// Verifica conexión participantes
connectDBClientes.on('connected', () => {
  console.log('Conectado a MongoDB Clientes');
});
connectDBClientes.on('error', (err) => {
  console.error('Error en conexión Clientes:', err);
});