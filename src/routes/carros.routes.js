import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { 
    agregarCarro, 
    eliminarCarro, 
    actualizarCarro, 
    obtenerCarros,
    obtenerCarro,
    obtenerCarroPorPropietario
} from "../controllers/carros.controller.js";

const router = Router();

// Rutas para gestión de carros
router.post('/agregarCarro', authRequired, agregarCarro);
router.delete('/eliminarCarro/:id', authRequired, eliminarCarro);
router.put('/actualizarCarro/:id', authRequired, actualizarCarro);
router.get('/verCarros', authRequired, obtenerCarros);
router.get('/porPropietario/:id', authRequired, obtenerCarroPorPropietario);
router.get('/verCarro/:id', obtenerCarro);
export default router;