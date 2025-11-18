import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import {
    crearCita,
    actualizarCita,
    eliminarCita,
    obtenerCitas,
    obtenerCita,
    obtenerCitasPorCliente,
    obtenerCitasPorCarro,
    getAllCitas,
    updateCitaEstado,
    cancelarCita // nuevo
} from "../controllers/citas.controller.js";

const router = Router();

router.post('/agregarCita', authRequired, crearCita);
router.put('/actualizarCita/:id', authRequired, actualizarCita);
router.delete('/eliminarCita/:id', authRequired, eliminarCita);
router.get('/verCitas', authRequired, obtenerCitas);
router.get('/verCita/:id', authRequired, obtenerCita);
router.get('/porCliente/:id', authRequired, obtenerCitasPorCliente);
router.get('/porCarro/:id', authRequired, obtenerCitasPorCarro);

// Nuevo endpoint para cancelar y aplicar penalidad
router.post('/:id/cancel', authRequired, cancelarCita);

// rutas administrativas / públicas
router.get('/getAllCitas', authRequired, getAllCitas);
router.put('/updateEstado/:id', authRequired, updateCitaEstado);

export default router;