import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import {
    obtenerDiasInhabiles,
    registrarDiaInhabil,
    eliminarDiaInhabil
} from "../controllers/dias.controller.js";

const router = Router();

// Rutas para días inhábiles
router.get('/obtenerDias', authRequired, obtenerDiasInhabiles);
router.post('/registrarDia', authRequired, registrarDiaInhabil);
router.delete('/eliminarDia/:id', authRequired, eliminarDiaInhabil);

export default router;