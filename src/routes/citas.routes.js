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
    getAllCitas,           // Nueva ruta
    updateCitaEstado      // Nueva ruta
} from "../controllers/citas.controller.js";

const router = Router();

router.post('/agregarCita', authRequired, crearCita);
router.put('/actualizarCita/:id', authRequired, actualizarCita);
router.delete('/eliminarCita/:id', authRequired, eliminarCita);
router.get('/verCitas', authRequired, obtenerCitas);
router.get('/verCita/:id', authRequired, obtenerCita);
router.get('/porCliente/:id', authRequired, obtenerCitasPorCliente);
router.get('/porCarro/:id', authRequired, obtenerCitasPorCarro);
router.get('/getAllCitas', authRequired, getAllCitas);
router.put('/updateEstado/:id', authRequired, updateCitaEstado);

export default router;