import Citas from "../models/citas.model.js";
import Carros from "../models/carros.model.js";
import Admin from "../models/admin.model.js";

export const crearCita = async (req, res) => {
    try {
        const { 
            fechaInicio, 
            fechaFin, 
            tipoServicio, 
            costo, 
            carro, 
            informacionAdicional 
        } = req.body;

        // Verificar que el carro existe y pertenece al usuario
        const carroExiste = await Carros.findOne({ 
            _id: carro, 
            propietario: req.admin.id 
        });
        
        if (!carroExiste) {
            return res.status(404).json({ message: "Carro no encontrado" });
        }

        // Verificar disponibilidad de horario
        const citaExistente = await Citas.findOne({
            fechaInicio: { $lt: fechaFin },
            fechaFin: { $gt: fechaInicio },
            estado: { $nin: ['cancelada', 'completada'] }
        });

        if (citaExistente) {
            return res.status(400).json({ 
                message: "Ya existe una cita programada para ese horario" 
            });
        }

        const nuevaCita = new Citas({
            fechaInicio,
            fechaFin,
            tipoServicio,
            costo,
            carro,
            cliente: req.admin.id,
            gestor: req.admin.id,
            informacionAdicional
        });

        const citaGuardada = await nuevaCita.save();

        // Poblar los datos necesarios para la respuesta
        const citaCompleta = await Citas.findById(citaGuardada._id)
            .populate('carro', 'marca modelo año color placas tipo')
            .populate('cliente', 'nombre correo telefono')
            .populate('gestor', 'nombre');

        res.json(citaCompleta);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const obtenerCitasPorCliente = async (req, res) => {
    try {
        const { id } = req.params;
        
        const citas = await Citas.find({ cliente: id })
            .populate('carro', 'marca modelo año color placas tipo')
            .populate('cliente', 'nombre correo telefono')
            .populate('gestor', 'nombre')
            .sort({ fechaInicio: 1 })
            .lean();

        res.json(citas);
    } catch (error) {
        res.status(500).json({ 
            message: "Error al obtener las citas", 
            error: error.message 
        });
    }
};

export const obtenerCitasPorCarro = async (req, res) => {
    try {
        const { id } = req.params;
        
        const citas = await Citas.find({ carro: id })
            .populate('carro', 'marca modelo año color placas tipo')
            .populate('cliente', 'nombre correo telefono')
            .populate('gestor', 'nombre')
            .sort({ fechaInicio: 1 })
            .lean();

        res.json(citas);
    } catch (error) {
        res.status(500).json({ 
            message: "Error al obtener las citas", 
            error: error.message 
        });
    }
};

export const actualizarCita = async (req, res) => {
    try {
        const { id } = req.params;
        const { fechaInicio, fechaFin, tipoServicio, costo, informacionAdicional, estado } = req.body;

        // Verificar que la cita existe y está asociada a un carro del usuario
        const cita = await Citas.findById(id).populate('carro');
        if (!cita) return res.status(404).json({ message: "Cita no encontrada" });
        
        if (cita.carro.propietario.toString() !== req.admin.id) {
            return res.status(403).json({ message: "No autorizado" });
        }

        const citaActualizada = await Citas.findByIdAndUpdate(
            id,
            { fechaInicio, fechaFin, tipoServicio, costo, informacionAdicional, estado },
            { new: true }
        );

        res.json(citaActualizada);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const eliminarCita = async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar que la cita existe y está asociada a un carro del usuario
        const cita = await Citas.findById(id).populate('carro');
        if (!cita) return res.status(404).json({ message: "Cita no encontrada" });
        
        if (cita.carro.propietario.toString() !== req.admin.id) {
            return res.status(403).json({ message: "No autorizado" });
        }

        await Citas.findByIdAndDelete(id);
        res.json({ message: "Cita eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const obtenerCitas = async (req, res) => {
    try {
        // Obtener todas las citas asociadas a los carros del usuario
        const citas = await Citas.find()
            .populate({
                path: 'carro',
                match: { propietario: req.admin.id }
            })
            .exec();

        // Filtrar las citas que realmente pertenecen al usuario
        const citasUsuario = citas.filter(cita => cita.carro !== null);
        
        res.json(citasUsuario);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const obtenerCita = async (req, res) => {
    try {
        const { id } = req.params;
        const cita = await Citas.findById(id).populate('carro');
        
        if (!cita) return res.status(404).json({ message: "Cita no encontrada" });
        
        if (cita.carro.propietario.toString() !== req.admin.id) {
            return res.status(403).json({ message: "No autorizado" });
        }

        res.json(cita);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};