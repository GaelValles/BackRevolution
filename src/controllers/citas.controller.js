import Citas from "../models/citas.model.js";
import Carros from "../models/carros.model.js";
import Admin from "../models/admin.model.js";

export const crearCita = async (req, res) => {
    try {
        const { 
            fechaInicio,
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
            fechaInicio: { $lte: new Date(fechaInicio) },
            estado: { $nin: ['cancelada', 'completada'] }
        });

        if (citaExistente) {
            return res.status(400).json({ 
                message: "Ya existe una cita programada para ese horario" 
            });
        }

        const nuevaCita = new Citas({
            fechaInicio,
            tipoServicio,
            costo,
            carro,
            cliente: req.admin.id,
            informacionAdicional,
            estado: 'programada'
        });

        const citaGuardada = await nuevaCita.save();

        // Actualizar el array de citas del cliente
        await Admin.findByIdAndUpdate(
            req.admin.id,
            { $push: { citas: citaGuardada._id } }
        );

        const citaCompleta = await Citas.findById(citaGuardada._id)
            .populate('carro', 'marca modelo año color placas tipo')
            .populate('cliente', 'nombre correo telefono');

        res.json(citaCompleta);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const obtenerCitasPorCliente = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Primero verificamos que el cliente existe
        const cliente = await Admin.findById(id);
        if (!cliente) {
            return res.status(404).json({ message: "Cliente no encontrado" });
        }

        // Obtenemos las citas usando el array de citas del cliente
        const citasCompletas = await Citas.find({
            _id: { $in: cliente.citas }
        })
        .populate({
            path: 'carro',
            select: 'marca modelo año color placas tipo'
        })
        .populate({
            path: 'cliente',
            select: 'nombre correo telefono'
        })
        .select('fechaInicio fechaFin tipoServicio costo informacionAdicional estado createdAt updatedAt')
        .lean();

        // Agregamos console.log para debugging
        console.log('Cliente encontrado:', cliente);
        console.log('IDs de citas del cliente:', cliente.citas);
        console.log('Citas completas encontradas:', citasCompletas);

        res.json(citasCompletas);
    } catch (error) {
        console.error('Error en obtenerCitasPorCliente:', error);
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

        // Eliminar la cita
        await Citas.findByIdAndDelete(id);

        // Eliminar la referencia de la cita en el array del cliente
        await Admin.findByIdAndUpdate(
            req.admin.id,
            { $pull: { citas: id } }
        );

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
        console.log("si llegó al backend",cita);
        if (!cita) return res.status(404).json({ message: "Cita no encontrada" });
        
        if (cita.carro.propietario.toString() !== req.admin.id) {
            return res.status(403).json({ message: "No autorizado" });
        }
        console.log(cita);
        res.json(cita);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllCitas = async (req, res) => {
    try {
        const citas = await Citas.find()
            .populate({
                path: 'carro',
                select: 'marca modelo año color placas tipo'
            })
            .populate({
                path: 'cliente',
                select: 'nombre correo telefono'
            })
            .select('fechaInicio fechaFin tipoServicio costo informacionAdicional estado createdAt updatedAt')
            .sort({ fechaInicio: 1 })
            .lean();

        console.log('Todas las citas encontradas:', citas.length);
        res.json(citas);
    } catch (error) {
        console.error('Error en getAllCitas:', error);
        res.status(500).json({ 
            message: "Error al obtener todas las citas", 
            error: error.message 
        });
    }
};

export const updateCitaEstado = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        // Validar que el estado sea válido
        const estadosValidos = ['programada', 'en_proceso', 'completada', 'cancelada'];
        if (!estadosValidos.includes(estado)) {
            return res.status(400).json({ 
                message: "Estado no válido" 
            });
        }

        const updateData = { estado };

        // Si el estado es 'completada', agregar fechaFin
        if (estado === 'completada') {
            updateData.fechaFin = new Date();
        }

        // Buscar y actualizar la cita
        const citaActualizada = await Citas.findByIdAndUpdate(
            id,
            updateData,
            { 
                new: true,
                runValidators: true
            }
        )
        .populate({
            path: 'carro',
            select: 'marca modelo año color placas tipo'
        })
        .populate({
            path: 'cliente',
            select: 'nombre correo telefono'
        });

        if (!citaActualizada) {
            return res.status(404).json({ 
                message: "Cita no encontrada" 
            });
        }

        console.log('Cita actualizada:', citaActualizada);
        res.json(citaActualizada);
    } catch (error) {
        console.error('Error en updateCitaEstado:', error);
        res.status(500).json({ 
            message: "Error al actualizar el estado de la cita", 
            error: error.message 
        });
    }
};